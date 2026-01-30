import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserId = Principal;

  public type UserProfile = {
    name : Text;
    partnerId : ?Principal;
  };

  public type RitualPrompt = {
    id : Nat;
    text : Text;
  };

  public type RitualResponse = {
    userId : UserId;
    text : ?Text;
    emoji : ?Text;
  };

  public type RitualEntry = {
    prompt : RitualPrompt;
    responses : Map.Map<UserId, RitualResponse>;
    date : Time.Time;
  };

  public type DailyRitualInput = {
    text : ?Text;
    emoji : ?Text;
  };

  public type PartnerRitualStatus = {
    partnerAComplete : Bool;
    partnerBComplete : Bool;
  };

  public type HarmonyStats = {
    streakCount : Nat;
    completionRate : Float;
  };

  public type EntryStatus = {
    #waitingForPartner;
    #complete;
  };

  public type GetDailyRitualResponse = {
    prompt : RitualPrompt;
    responses : [RitualResponse];
    status : EntryStatus;
    streakCount : Nat;
    harmonyMeter : Float;
  };

  public type SharedPhoto = {
    id : Text;
    owner : UserId;
    blob : Storage.ExternalBlob;
    name : Text;
    timestamp : Time.Time;
  };

  let codeLifetime : Int = 3 * 24 * 60 * 60 * 1_000_000_000; // 3 days in nanoseconds

  let ritualEntries = Map.empty<Text, RitualEntry>();
  let prompts = Map.empty<Nat, RitualPrompt>();
  let userProfiles = Map.empty<UserId, UserProfile>();
  let photos = Map.empty<Text, SharedPhoto>();
  let codeToPrincipal = Map.empty<Nat, Principal>();

  let queueSize = 100;
  var codePool : [Nat] = [];

  let randomSeed = 17;
  var currentSeed = randomSeed;

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : UserId) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func assignPartner(partner : UserId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can assign partners");
    };

    switch (userProfiles.get(caller), userProfiles.get(partner)) {
      case (null, _) { Runtime.trap("Caller profile not found") };
      case (_, null) { Runtime.trap("Partner profile not found") };
      case (?callerProfile, ?partnerProfile) {
        let updatedCallerProfile = { callerProfile with partnerId = ?partner };
        let updatedPartnerProfile = { partnerProfile with partnerId = ?caller };
        userProfiles.add(caller, updatedCallerProfile);
        userProfiles.add(partner, updatedPartnerProfile);
      };
    };
  };

  func getPartnerId(userId : UserId) : ?UserId {
    switch (userProfiles.get(userId)) {
      case (null) { null };
      case (?profile) { profile.partnerId };
    };
  };

  public shared ({ caller }) func initPrompts() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize prompts");
    };

    addPrompt(0, "Share one thing you appreciate about your partner today");
    addPrompt(1, "What made you smile today?");
    addPrompt(2, "Describe your partner in one word");
    addPrompt(3, "Send your partner a cute emoji or GIF");
    addPrompt(4, "Share a memory that makes you laugh");
  };

  func addPrompt(id : Nat, text : Text) {
    let prompt = {
      id;
      text;
    };
    prompts.add(id, prompt);
  };

  public query ({ caller }) func getDailyRitual() : async ?RitualPrompt {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view daily rituals");
    };

    let dayInMillis = Int.abs(Time.now() / (24 * 60 * 60 * 1000000000));
    let promptId = dayInMillis % 5;

    prompts.get(promptId);
  };

  public shared ({ caller }) func submitRitualResponse(input : DailyRitualInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit ritual responses");
    };

    switch (getPartnerId(caller)) {
      case (null) { Runtime.trap("Cannot submit ritual: No partner assigned") };
      case (?_) { /* Partner exists, continue */ };
    };

    let dayInMillis = Int.abs(Time.now() / (24 * 60 * 60 * 1000000000));
    let ritualKey = dayInMillis.toText();

    let ritualEntry = switch (ritualEntries.get(ritualKey)) {
      case (null) {
        let promptId = dayInMillis % 5;
        let prompt = switch (prompts.get(promptId)) {
          case (null) { Runtime.trap("Prompt not found in submitRitualResponse") };
          case (?p) { p };
        };
        {
          prompt;
          responses = Map.empty<UserId, RitualResponse>();
          date = Time.now();
        };
      };
      case (?entry) { entry };
    };

    let response = {
      userId = caller;
      text = input.text;
      emoji = input.emoji;
    };

    ritualEntry.responses.add(caller, response);
    ritualEntries.add(ritualKey, ritualEntry);
  };

  public query ({ caller }) func getRitualStatus() : async PartnerRitualStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check ritual status");
    };

    let partnerId = switch (getPartnerId(caller)) {
      case (null) { Runtime.trap("Cannot check status: No partner assigned") };
      case (?id) { id };
    };

    let dayInMillis = Int.abs(Time.now() / (24 * 60 * 60 * 1000000000));
    let ritualKey = dayInMillis.toText();

    switch (ritualEntries.get(ritualKey)) {
      case (null) {
        {
          partnerAComplete = false;
          partnerBComplete = false;
        };
      };
      case (?entry) {
        let partnerAComplete = entry.responses.get(caller) != null;
        let partnerBComplete = entry.responses.get(partnerId) != null;

        {
          partnerAComplete;
          partnerBComplete;
        };
      };
    };
  };

  public query ({ caller }) func getDailyRitualWithStats() : async GetDailyRitualResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view daily ritual stats");
    };

    let partnerId = switch (getPartnerId(caller)) {
      case (null) { Runtime.trap("Cannot view ritual: No partner assigned") };
      case (?id) { id };
    };

    let dayInMillis = Int.abs(Time.now() / (24 * 60 * 60 * 1000000000));
    let ritualKey = dayInMillis.toText();
    let promptId = dayInMillis % 5;

    let prompt = switch (prompts.get(promptId)) {
      case (null) { Runtime.trap("Prompt not found") };
      case (?p) { p };
    };

    let entry = switch (ritualEntries.get(ritualKey)) {
      case (null) {
        {
          prompt = prompt;
          responses = [];
          status = #waitingForPartner;
          streakCount = 0;
          harmonyMeter = 0.5;
        };
      };
      case (?e) {
        let filteredResponses = e.responses.toArray()
          .filter(func((userId, _)) { userId == caller or userId == partnerId })
          .map(func((_, r)) { r });

        let callerComplete = e.responses.get(caller) != null;
        let partnerComplete = e.responses.get(partnerId) != null;

        let status = if (callerComplete and partnerComplete) {
          #complete;
        } else { #waitingForPartner };

        {
          prompt = e.prompt;
          responses = filteredResponses;
          status;
          streakCount = 0;
          harmonyMeter = 0.5;
        };
      };
    };

    entry;
  };

  public shared ({ caller }) func uploadPhoto(blob : Storage.ExternalBlob, name : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload photos");
    };

    let photoId = caller.toText();
    let photo = {
      id = photoId;
      owner = caller;
      blob;
      name;
      timestamp = Time.now();
    };

    photos.add(photoId, photo);
    photoId;
  };

  public query ({ caller }) func getPhoto(id : Text) : async ?SharedPhoto {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view photos");
    };

    let photo = switch (photos.get(id)) {
      case (null) { return null };
      case (?p) { p };
    };

    // Only allow access to own photos or partner's photos
    let partnerId = getPartnerId(caller);
    if (photo.owner != caller and ?photo.owner != partnerId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own or your partner's photos");
    };

    ?photo;
  };

  public query ({ caller }) func getPhotosByUser(user : UserId) : async [SharedPhoto] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view photos");
    };

    // Only allow viewing own photos or partner's photos
    let partnerId = getPartnerId(caller);
    if (user != caller and ?user != partnerId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own or your partner's photos");
    };

    let iter = photos.values();
    let photoValues = iter.toArray();
    photoValues.filter(func(photo) { photo.owner == user });
  };

  public shared ({ caller }) func deletePhoto(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete photos");
    };

    let photo = switch (photos.get(id)) {
      case (null) { Runtime.trap("Photo not found") };
      case (?p) { p };
    };

    if (photo.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only photo owner or admin can delete");
    };

    photos.remove(id);
  };

  public shared ({ caller }) func initializeUserProfile(name : Text, partnerId : ?UserId) : async UserId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can initialize profiles");
    };

    // Prevent setting partnerId directly - must use pairing flow
    if (partnerId != null) {
      Runtime.trap("Cannot set partnerId directly. Use pairing flow instead.");
    };

    let newUserId = caller;
    let profile = {
      name;
      partnerId = null; // Always initialize without partner
    };
    userProfiles.add(newUserId, profile);
    newUserId;
  };

  let codeRange = 900_000;
  let codeOffset = 100_000;

  func generateRandomCode() : (Nat, Nat) {
    let prime1 = 314379;
    let prime2 = 5210271;

    let newSeed = (currentSeed * prime1 + prime2) % 1_000_000;
    currentSeed := newSeed;

    let randomPart = newSeed % codeRange;
    let code = randomPart + codeOffset;

    (code, newSeed);
  };

  func keepLast(array : [Nat], n : Nat) : [Nat] {
    let size = array.size();
    if (n >= size) {
      array;
    } else {
      Array.tabulate<Nat>(n, func(i) { array[size - n + i] });
    };
  };

  public shared ({ caller }) func createPairingCode() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create pairing codes");
    };

    let (code, _) = generateRandomCode();
    updateMapping(code, caller);

    if (codePool.size() >= queueSize) {
      codePool := keepLast(codePool, queueSize - 1);
    };

    codePool := codePool.concat([code]);
    code;
  };

  func updateMapping(code : Nat, caller : Principal) {
    codeToPrincipal.add(code, caller);
  };

  public shared ({ caller }) func checkPairingCode(code : Nat) : async ?Principal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check pairing codes");
    };

    codeToPrincipal.get(code);
  };

  public shared ({ caller }) func completePairing(code : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete pairing");
    };

    // Validate the pairing code exists
    let partnerPrincipal = switch (codeToPrincipal.get(code)) {
      case (null) { Runtime.trap("Invalid or expired pairing code") };
      case (?p) { p };
    };

    // Prevent self-pairing
    if (partnerPrincipal == caller) {
      Runtime.trap("Cannot pair with yourself");
    };

    // Check if caller already has a partner
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found. Please initialize profile first.") };
      case (?profile) {
        if (profile.partnerId != null) {
          Runtime.trap("Already paired with a partner");
        };
      };
    };

    // Check if partner already has a partner
    switch (userProfiles.get(partnerPrincipal)) {
      case (null) { Runtime.trap("Partner profile not found") };
      case (?profile) {
        if (profile.partnerId != null) {
          Runtime.trap("Partner is already paired with someone else");
        };
      };
    };

    // Complete the pairing using assignPartner
    await assignPartner(partnerPrincipal);

    // Remove the used code to prevent reuse
    codeToPrincipal.remove(code);
  };

  func garbageCollectExpiredCodes() {
    let now = Time.now();

    let codesToRemove = codePool.filter(
      func(code) {
        switch (codeToPrincipal.get(code)) {
          case (?_) { false };
          case (null) { true };
        };
      }
    );

    codesToRemove.forEach(
      func(_code) {
        // Remove the codes from the codePool
        let remainingCodes = codePool.filter(
          func(c) { c != _code }
        );
        codePool := remainingCodes;
      }
    );
  };
};


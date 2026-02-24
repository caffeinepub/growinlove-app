import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserId = Principal;
  public type UserRole = { #admin; #user };
  public type Points = Nat;
  public type StreakMultiplier = {
    boost : Float;
  };
  public type RewardTierPoints = Nat;
  public type WeeklyChallengeProof = {
    blob : ?Storage.ExternalBlob;
    points : Points;
    timestamp : Time.Time;
  };
  public type RewardMilestone = {
    pointsRequired : Points;
    rewardType : Text;
    description : Text;
  };
  public type MilestoneRewardTier = {
    rewardTier : Text;
    pointsRequired : Points;
    congratulationsMessage : Text;
    badge : Text;
  };
  public type UserProfile = {
    name : Text;
    partnerId : ?UserId;
    role : UserRole;
    isFirstUser : Bool;
  };
  public type RitualPrompt = {
    id : Nat;
    text : Text;
    loveLanguage : ?LoveLanguage;
  };
  public type RitualResponse = {
    userId : UserId;
    text : ?Text;
    emoji : ?Text;
    photoId : ?Text;
  };
  public type RitualEntryView = {
    prompt : RitualPrompt;
    responses : [RitualResponse];
    date : Int;
    loveLanguageFocus : ?LoveLanguage;
  };
  public type RitualEntry = {
    prompt : RitualPrompt;
    responses : Map.Map<UserId, RitualResponse>;
    date : Int;
    loveLanguageFocus : ?LoveLanguage;
  };
  public type DailyRitualInput = {
    text : ?Text;
    emoji : ?Text;
    photoId : ?Text;
  };
  public type PartnerRitualStatus = {
    partnerAComplete : Bool;
    partnerBComplete : Bool;
  };
  public type CanonicalPartnerRitualStatus = {
    partnerA : UserId;
    partnerB : UserId;
    partnerAComplete : Bool;
    partnerBComplete : Bool;
  };
  public type HighScoreRecord = {
    userId : UserId;
    score : Nat;
    timestamp : Time.Time;
  };
  public type HarmonyStats = {
    streakCount : Nat;
    completionRate : Float;
    averageHarmony : Float;
  };
  public type EntryStatus = { #waitingForPartner; #complete };
  public type GetDailyRitualResponse = {
    partnerId : ?UserId;
    prompt : RitualPrompt;
    responses : [RitualResponse];
    status : EntryStatus;
    streakCount : Nat;
    harmonyMeter : Float;
  };
  public type WeeklyChallenge = {
    id : Nat;
    title : Text;
    description : Text;
    weekNumber : Nat;
    isCompleted : Bool;
    assignedDate : Time.Time;
    proof : ?WeeklyChallengeProof;
  };
  public type QuizEntry = {
    originalText : Text;
    translatedText : Text;
    author : UserId;
    creationDate : Time.Time;
    difficulty : Nat;
  };
  public type PrizeCategory = {
    name : Text;
    description : Text;
    eligibilityCriteria : Text;
  };
  public type SharedPhoto = {
    id : Text;
    owner : UserId;
    blob : Storage.ExternalBlob;
    name : Text;
    timestamp : Time.Time;
  };
  public type PairingError = {
    #ProfileNotInitialized;
    #InvalidCode;
    #ExpiredCode;
    #SelfPairingNotAllowed;
    #AlreadyPaired;
    #PartnerAlreadyPaired;
    #UserNotFound;
    #PartnerNotFound;
  };
  public type PairingResult = {
    #ok;
    #err : Text;
  };
  public type StreakRecord = {
    currentStreak : Nat;
    longestStreak : Nat;
  };
  public type CoupleStats = {
    streakRecord : StreakRecord;
    lastCompletedDay : ?Text;
    harmonyStats : HarmonyStats;
    currentStreak : Nat;
    longestStreak : Nat;
  };
  public type PromptInitializationResult = {
    #success;
    #alreadyInitialized;
    #unauthorized;
    #internalError : Text;
  };
  public type LoveLanguage = {
    #wordsOfAffirmation;
    #actsOfService;
    #receivingGifts;
    #qualityTime;
    #physicalTouch;
  };
  public type LoveLanguageRanking = {
    language : LoveLanguage;
    score : Float;
  };
  public type LoveLanguagesQuizResult = {
    userId : UserId;
    rankings : [LoveLanguageRanking];
    completionTime : Time.Time;
  };
  public type PartnerQuizState = {
    partnerCompleted : Bool;
    partnerResults : ?LoveLanguagesQuizResult;
  };
  public type SynchronizedLoveLanguagesResults = {
    userId : UserId;
    results : LoveLanguagesQuizResult;
    partnerResults : LoveLanguagesQuizResult;
  };
  public type LoveChallenge = {
    id : Nat;
    title : Text;
    description : Text;
    loveLanguage : LoveLanguage;
    isCompleted : Bool;
    dateAssigned : Int;
  };
  public type CoupleChallenges = {
    coupleId : Text;
    activeChallenges : [LoveChallenge];
    completedChallenges : [LoveChallenge];
  };
  public type ChallengeCompletionResponse = {
    #success;
    #err : Text;
  };
  public type ChallengeStats = {
    totalChallenges : Nat;
    completedChallenges : Nat;
    progressPercent : Float;
  };
  public type MilestoneBadge = {
    name : Text;
    dateAchieved : Time.Time;
    isUnlocked : Bool;
  };
  public type InsightsDataResponse = {
    currentStreak : Nat;
    longestStreak : Nat;
    challengeCompletionRate : Float;
    mostFrequentLoveLanguage : Text;
    badges : [MilestoneBadge];
  };
  public type MilestoneProgress = {
    sevenDayUnlocked : Bool;
    thirtyDayUnlocked : Bool;
    hundredDayUnlocked : Bool;
    harmonyEliteUnlocked : Bool;
  };
  public type BadgeMilestoneResponse = {
    badges : [MilestoneBadge];
    milestones : MilestoneProgress;
  };
  public type InsighsDataExtendedResponse = {
    currentStreak : Nat;
    longestStreak : Nat;
    challengeCompletionRate : Float;
    mostFrequentLoveLanguage : Text;
    badges : [MilestoneBadge];
    challengeStats : ChallengeStats;
    milestones : MilestoneProgress;
    averageHarmony : Float;
    currentHarmony : Float;
    quizOverlapScore : Float;
    recentCompletionRate : Float;
    last14DayTrend : [Bool];
    harmonyTrend : [Float];
    last30DayTrend : [Bool];
  };
  public type DayNumber = Nat;
  public type CoupleId = Text;
  public type RitualCompletion = {
    partnerAComplete : Bool;
    partnerBComplete : Bool;
    completionTimePartnerA : ?Time.Time;
    completionTimePartnerB : ?Time.Time;
  };
  public type DayStats = {
    numCompletedByBoth : Nat;
    numCompletedByEither : Nat;
  };
  public type RewardXPResult = {
    previousXP : Nat;
    newXP : Nat;
    level : Nat;
  };
  public type XP = Nat;
  public type Badge = Text;
  public type EntryWithDay = {
    dayNumber : Nat;
    entry : RitualEntry;
  };
  public type StreakResult = {
    dayInMillis : Time.Time;
    currentStreak : Nat;
  };
  public type CoupleProgress = {
    currentLevel : Nat;
    totalPoints : Nat;
    pointsForNextLevel : Nat;
    pointsToNextLevel : Nat;
    levelThresholds : [Nat];
  };
  let harmonyTrendWindow = 7;
  let recentWindowSize = 14;
  let fullHistoryWindow = 30;
  var xpMap : Map.Map<UserId, XP> = Map.empty();
  var badgeMap : Map.Map<UserId, [Badge]> = Map.empty();
  var completedChallenges : Map.Map<UserId, Map.Map<Nat, Bool>> = Map.empty();
  var lastCompletedChallengesCache : ?(UserId, Map.Map<Nat, Bool>) = null;
  var promptsInitialized = false;
  var adminAssigned = false;
  var codePool : [Nat] = [];
  let queueSize = 100;
  let randomSeed = 17;
  var currentSeed = randomSeed;
  let prompts = Map.empty<Nat, RitualPrompt>();
  let userProfiles = Map.empty<UserId, UserProfile>();
  let codeToPrincipal = Map.empty<Nat, Principal>();
  var ritualEntries = Map.empty<Text, Map.Map<DayNumber, RitualEntry>>();
  let weeklyChallenges = Map.empty<Text, WeeklyChallenge>();
  let photos = Map.empty<Text, SharedPhoto>();
  var currentStreaks = Map.empty<UserId, Nat>();
  let longestStreaks = Map.empty<UserId, Nat>();
  let coupleStats = Map.empty<UserId, CoupleStats>();
  var loveLanguagesResults = Map.empty<UserId, LoveLanguagesQuizResult>();
  var synchronizedLoveLanguagesResults = Map.empty<UserId, SynchronizedLoveLanguagesResults>();
  let dailyRitualStats = Map.empty<UserId, GetDailyRitualResponse>();
  let harmonyStatsMap = Map.empty<UserId, HarmonyStats>();
  let milestoneProgress = Map.empty<UserId, MilestoneProgress>();
  var milestoneBadges = Map.empty<UserId, [MilestoneBadge]>();
  var coupleChallenges = Map.empty<Text, CoupleChallenges>();
  var challengeStats = Map.empty<Text, ChallengeStats>();
  var completedDays = Map.empty<CoupleId, Map.Map<DayNumber, RitualCompletion>>();
  let completedDaysReviewStats = Map.empty<CoupleId, DayStats>();
  var coupleLevelData = Map.empty<CoupleId, CoupleProgress>();
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
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
  func calculateLevelPoints(caller : Principal, _partner : Principal, ritualCount : Nat, harmonyScore : Nat, challengesCompleted : Nat) : CoupleProgress {
    let totalPoints = (
      (ritualCount * 2) +
      (harmonyScore * 15 / 10) +
      (challengesCompleted * 5)
    );
    let levelThresholds = [
      0, 100, 250, 500, 800, 1200, 1600, 2100, 2700, 3500
    ];
    switch (calculateCurrentLevel(totalPoints, levelThresholds).size()) {
      case (range) {
        {
          currentLevel = range;
          totalPoints;
          pointsForNextLevel = findNextThreshold(totalPoints, levelThresholds);
          pointsToNextLevel = calculatePointsToNextLevel(totalPoints, findNextThreshold(totalPoints, levelThresholds));
          levelThresholds;
        };
      };
    };
  };
  func calculateCurrentLevel(points : Nat, levelThresholds : [Nat]) : [Nat] {
    levelThresholds.filter(func(threshold) { points >= threshold });
  };
  func findNextThreshold(points : Nat, levelThresholds : [Nat]) : Nat {
    levelThresholds.foldLeft<Nat, Nat>(0, func(next, threshold) { if (points < threshold) { threshold } else { next } });
  };
  func calculatePointsToNextLevel(points : Nat, nextThreshold : Nat) : Nat {
    if (nextThreshold > points) { nextThreshold } else { points };
  };
  let defaultLevelThresholds = [
    0, 100, 250, 500, 800, 1200, 1600, 2100, 2700, 3500
  ];
  public query ({ caller }) func getCoupleProgress(partner : Principal, ritualCount : Nat, harmonyScore : Nat, challengesCompleted : Nat) : async CoupleProgress {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view couple progress");
    };
    let partnerId = switch (getPartnerId(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: Must be paired with a partner to access couple progress");
      };
      case (?id) { id };
    };
    if (partnerId != partner) {
      Runtime.trap("Unauthorized: Can only view progress with your actual partner");
    };
    if (not verifyMutualPartnership(caller, partnerId)) {
      Runtime.trap("Unauthorized: Invalid partner relationship");
    };
    calculateLevelPoints(caller, partner, ritualCount, harmonyScore, challengesCompleted);
  };
  public type CombinedQuizResultState = {
    callerCompleted : Bool;
    partnerCompleted : Bool;
    callerResults : ?LoveLanguagesQuizResult;
    partnerResults : ?LoveLanguagesQuizResult;
  };
  public query ({ caller }) func getCombinedQuizResultState() : async ?CombinedQuizResultState {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get combined quiz result state");
    };
    let partnerId = switch (getPartnerId(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: Must be paired with a partner to access quiz results");
      };
      case (?id) { id };
    };
    if (not verifyMutualPartnership(caller, partnerId)) {
      Runtime.trap("Unauthorized: Invalid partner relationship");
    };
    let _ = mustGetCoupleId(caller);
    let callerResults = loveLanguagesResults.get(caller);
    let partnerResults = loveLanguagesResults.get(partnerId);
    ?{
      callerCompleted = callerResults != null;
      partnerCompleted = partnerResults != null;
      callerResults;
      partnerResults;
    };
  };
  func updateMapping(code : Nat, caller : Principal) {
    codeToPrincipal.add(code, caller);
  };
  func keepLast(array : [Nat], n : Nat) : [Nat] {
    let size = array.size();
    if (n >= size) {
      array;
    } else {
      Array.tabulate<Nat>(n, func(i) { array[size - n + i] });
    };
  };
  func getCoupleId(userId : UserId) : ?Text {
    let partnerId = switch (getPartnerId(userId)) {
      case (null) { return null };
      case (?id) { id };
    };
    if (not verifyMutualPartnership(userId, partnerId)) {
      return null;
    };
    let userText = userId.toText();
    let partnerText = partnerId.toText();
    if (userText < partnerText) {
      ?("couple-" # userText # "-" # partnerText);
    } else {
      ?("couple-" # partnerText # "-" # userText);
    };
  };
  func mustGetCoupleId(caller : UserId) : Text {
    switch (getCoupleId(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: Must be paired with a partner to access couple data");
      };
      case (?coupleId) { coupleId };
    };
  };
  func verifyCoupleAccess(caller : UserId, coupleId : Text) {
    let callerCoupleId = mustGetCoupleId(caller);
    if (callerCoupleId != coupleId) {
      Runtime.trap("Unauthorized: Cannot access data for a different couple");
    };
  };
  func addPrompt(id : Nat, text : Text, loveLanguage : LoveLanguage) {
    let prompt = {
      id;
      text;
      loveLanguage = ?loveLanguage;
    };
    prompts.add(id, prompt);
  };
  func getPromptByLoveLanguage(loveLanguage : LoveLanguage) : ?RitualPrompt {
    prompts.values().find(
      func(prompt) {
        switch (prompt.loveLanguage) {
          case (?lang) { lang == loveLanguage };
          case (null) { false };
        };
      },
    );
  };
  func selectWeightedLoveLanguageFocus(rankings : [LoveLanguageRanking]) : LoveLanguage {
    if (rankings.isEmpty()) {
      return #wordsOfAffirmation;
    };
    rankings[0].language;
  };
  public query ({ caller }) func getXP() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get XP");
    };
    switch (xpMap.get(caller)) {
      case (null) { 0 };
      case (?xp) { xp };
    };
  };
  public query ({ caller }) func getBadges() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get badges");
    };
    switch (badgeMap.get(caller)) {
      case (null) { [] };
      case (?badges) { badges };
    };
  };
  public query ({ caller }) func getLevelThresholds() : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get level thresholds");
    };
    defaultLevelThresholds;
  };
  public query ({ caller }) func fetchPrompts() : async [RitualPrompt] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch prompts");
    };
    prompts.values().toArray();
  };
  public query ({ caller }) func calculateLevelPointsNonAuth(
    ritualCount : Nat,
    harmonyScore : Nat,
    challengesCompleted : Nat
  ) : async CoupleProgress {
    let totalPoints = (
      (ritualCount * 2) +
      (harmonyScore * 15 / 10) +
      (challengesCompleted * 5)
    );
    let levelThresholds = [
      0, 100, 250, 500, 800, 1200, 1600, 2100, 2700, 3500
    ];
    switch (calculateCurrentLevel(totalPoints, levelThresholds).size()) {
      case (range) {
        {
          currentLevel = range;
          totalPoints;
          pointsForNextLevel = findNextThreshold(totalPoints, levelThresholds);
          pointsToNextLevel = calculatePointsToNextLevel(totalPoints, findNextThreshold(totalPoints, levelThresholds));
          levelThresholds;
        };
      };
    };
  };
  func getPartnerId(userId : UserId) : ?UserId {
    switch (userProfiles.get(userId)) {
      case (null) { null };
      case (?profile) { profile.partnerId };
    };
  };
  func verifyMutualPartnership(userA : UserId, userB : UserId) : Bool {
    let partnerOfA = getPartnerId(userA);
    let partnerOfB = getPartnerId(userB);
    switch (partnerOfA, partnerOfB) {
      case (?pA, ?pB) {
        pA == userB and pB == userA;
      };
      case _ { false };
    };
  };
};

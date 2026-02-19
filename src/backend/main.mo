import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserId = Principal;
  public type UserRole = { #admin; #user };

  public type Points = Nat;
  public type StreakMultiplier = { boost : Float };
  public type RewardTierPoints = Nat;

  // Engagement Foundation Types
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

  public type PairingResult = { #ok; #err : Text };

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

  public type ChallengeCompletionResponse = { #success; #err : Text };

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

  // NEW XP/BADGE SYSTEM
  public type RewardXPResult = {
    previousXP : Nat;
    newXP : Nat;
    level : Nat;
  };

  public type XP = Nat;
  public type Badge = Text;

  // STABLE XP SYSTEM (for now, more integration coming soon)
  let xpMap = Map.empty<UserId, XP>();
  let badgeMap = Map.empty<UserId, [Badge]>();

  // Love Garden (NEW)
  public type LoveGardenLevel = {
    name : Text;
    xpRequired : XP;
    description : Text;
    milestone : Text;
  };

  public type Plant = {
    name : Text;
    description : Text;
    xpRequired : XP;
    isUnlocked : Bool;
    milestone : Text;
  };

  public type LoveGarden = {
    level : Nat;
    xp : XP;
    streakMilestones : [Plant];
    badgeAchievements : [Plant];
    isComplete : Bool;
  };

  public type GardenProgress = {
    level : Nat;
    xp : XP;
    levelProgress : Float;
    streakMilestones : [Plant];
    badgeAchievements : [Plant];
    hasAvailableRewards : Bool;
    isComplete : Bool;
    unlockedPlant : ?Plant;
  };

  // CONVERTING EXISTING RESPONSE TO EXTENDED RESPONSE FOR NEW LOVE GARDEN
  func convertToRitualEntryView(entry : RitualEntry) : RitualEntryView {
    {
      entry with responses = entry.responses.toArray().map(func((_, response)) { response });
    };
  };

  func assignPartner(caller : UserId, partner : UserId) {
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

  func verifyMutualPartnership(userA : UserId, userB : UserId) : Bool {
    let userAPartner = getPartnerId(userA);
    let userBPartner = getPartnerId(userB);

    switch (userAPartner, userBPartner) {
      case (?partnerA, ?partnerB) {
        partnerA == userB and partnerB == userA
      };
      case (_, _) { false };
    };
  };

  func addPrompt(id : Nat, text : Text, loveLanguage : LoveLanguage) {
    let prompt = { id; text; loveLanguage = ?loveLanguage };
    prompts.add(id, prompt);
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

  func getRewardTiers() : [(XP, ?RewardMilestone)] {
    [
      (50, ?{
        pointsRequired = 50;
        rewardType = "Beginner";
        description = "Congratulations on reaching 50 points!";
      }),
      (100, ?{
        pointsRequired = 100;
        rewardType = "Advanced";
        description = "Fantastic job. You have made it to 100 points!";
      }),
      (300, ?{
        pointsRequired = 300;
        rewardType = "Expert";
        description = "You are a true relationship pro!";
      }),
    ];
  };

  func getChallengeTemplates() : [(LoveLanguage, Text, Text)] {
    [
      (#wordsOfAffirmation, "Daily Affirmation", "Share three things you appreciate about your partner today"),
      (#wordsOfAffirmation, "Love Letter", "Write a heartfelt note expressing your feelings"),
      (#wordsOfAffirmation, "Compliment Challenge", "Give your partner five genuine compliments throughout the day"),
      (#qualityTime, "Uninterrupted Time", "Spend 30 minutes together without phones or distractions"),
      (#qualityTime, "Shared Activity", "Plan and do a fun activity together that you both enjoy"),
      (#qualityTime, "Deep Conversation", "Have a meaningful conversation about your dreams and goals"),
      (#physicalTouch, "Cuddle Time", "Spend 15 minutes cuddling and being close"),
      (#physicalTouch, "Massage Exchange", "Give each other relaxing shoulder or foot massages"),
      (#physicalTouch, "Hand Holding", "Hold hands during a walk or while watching something together"),
      (#actsOfService, "Helpful Gesture", "Do a chore or task your partner usually handles"),
      (#actsOfService, "Surprise Help", "Complete something on your partner's to-do list without being asked"),
      (#actsOfService, "Breakfast in Bed", "Prepare a special meal or treat for your partner"),
      (#receivingGifts, "Thoughtful Surprise", "Give your partner a small, meaningful gift"),
      (#receivingGifts, "Love Token", "Create or find something that represents your relationship"),
      (#receivingGifts, "Favorite Treat", "Surprise your partner with their favorite snack or item"),
    ];
  };

  func generateChallengesForCouple(_ : Text, preferredLanguages : [LoveLanguage]) : [LoveChallenge] {
    let templates = getChallengeTemplates();
    let currentTime = Int.abs(Time.now() / 1_000_000_000);

    let filteredTemplates = if (preferredLanguages.size() > 0) {
      templates.filter(func((lang, _, _)) {
        preferredLanguages.find(func(prefLang) { prefLang == lang }) != null;
      });
    } else {
      templates;
    };

    let numChallenges = Nat.min(3, filteredTemplates.size());
    let selectedTemplates = Array.tabulate(
      numChallenges,
      func(i) {
        let index = (currentTime + i) % filteredTemplates.size();
        filteredTemplates[index];
      }
    );

    selectedTemplates.map(func((lang, title, desc)) {
      {
        id = 0;
        title;
        description = desc;
        loveLanguage = lang;
        isCompleted = false;
        dateAssigned = currentTime;
      };
    });
  };

  var codePool : [Nat] = [];
  let queueSize = 100;
  let randomSeed = 17;
  var currentSeed = randomSeed;

  var promptsInitialized = false;
  var adminAssigned = false;

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

  let harmonyTrendWindow = 7;
  let recentWindowSize = 14;
  let fullHistoryWindow = 30;

  // Love Garden Backend State
  var loveGardens = Map.empty<UserId, LoveGarden>();

  public query ({ caller }) func getLoveGarden() : async LoveGarden {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view Love Garden");
    };

    switch (loveGardens.get(caller)) {
      case (?loveGarden) { loveGarden };
      case (null) {
        Runtime.trap("Love Garden not initialized for user");
      };
    };
  };

  public query ({ caller }) func getLoveGardenProgress() : async GardenProgress {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view Love Garden progress");
    };

    switch (loveGardens.get(caller)) {
      case (?garden) {
        {
          garden with
          levelProgress = 0.0;
          hasAvailableRewards = false;
          unlockedPlant = null;
        };
      };
      case (null) {
        Runtime.trap("Love Garden not found for user " # caller.toText());
      };
    };
  };

  public shared ({ caller }) func createGarden() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create Love Garden");
    };

    if (loveGardens.get(caller) != null) {
      Runtime.trap("Love Garden already exists");
    };

    let initialGarden : LoveGarden = {
      level = 1;
      xp = 0;
      streakMilestones = [
        {
          name = "Floribunda Rose";
          description = "Beautiful roses that thrive with daily care after a 7-day devotion streak.";
          xpRequired = 70;
          isUnlocked = false;
          milestone = "7-Day Streak";
        },
        {
          name = "Bonsai Maple";
          description = "After a month of daily rituals, this tree symbolizes your relationship. It thrives with 30 day devotion.";
          xpRequired = 90;
          isUnlocked = false;
          milestone = "30-Day Streak";
        },
        {
          name = "Orchid Harmony";
          description = "Beautiful orchids appear in the love garden after 100 day devotion";
          xpRequired = 120;
          isUnlocked = false;
          milestone = "100-Day Streak";
        },
      ];
      badgeAchievements = [
        {
          name = "Sunflower Harmony";
          description = "Awarded for consistent rituals when harmony rating is high. Needs baseline of 95% for two consecutive weeks.";
          xpRequired = 130;
          isUnlocked = false;
          milestone = "Harmony Elite";
        },
      ];
      isComplete = false;
    };
    loveGardens.add(caller, initialGarden);
  };

  func findPlantInGarden(loveGarden : LoveGarden, plantName : Text) : ?Plant {
    switch (
      loveGarden.streakMilestones.find(func(p) { p.name == plantName }),
      loveGarden.badgeAchievements.find(func(p) { p.name == plantName }),
    ) {
      case (?streak, _) { ?streak };
      case (null, ?badge) { ?badge };
      case (null, null) { null };
    };
  };

  public shared ({ caller }) func unlockPlant(plantName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unlock plants");
    };

    switch (loveGardens.get(caller)) {
      case (null) {
        Runtime.trap("Love Garden not found for user " # caller.toText());
      };
      case (?garden) {
        switch (findPlantInGarden(garden, plantName)) {
          case (null) {
            Runtime.trap("Plant " # plantName # " not found in Love Garden");
          };
          case (?plant) {
            if (garden.xp >= plant.xpRequired) {
              if (isPlantUnlocked(garden, plantName)) {
                Runtime.trap("Plant " # plantName # " is already unlocked");
              } else {
                activatePlantInGarden(caller, plant);
              };
            } else {
              Runtime.trap("Insufficient XP to unlock plant " # plantName);
            };
          };
        };
      };
    };
  };

  func isPlantUnlocked(loveGarden : LoveGarden, plantName : Text) : Bool {
    loveGarden.streakMilestones.find(func(p) { p.name == plantName and p.isUnlocked }) != null
    or loveGarden.badgeAchievements.find(func(p) { p.name == plantName and p.isUnlocked }) != null;
  };

  func activatePlantInGarden(caller : UserId, plant : Plant) {
    switch (loveGardens.get(caller)) {
      case (null) {
        Runtime.trap("Love Garden not found for user " # caller.toText());
      };
      case (?garden) {
        let updatedStreaks = garden.streakMilestones.map(
          func(p) {
            if (p.name == plant.name) { { p with isUnlocked = true } } else { p };
          }
        );
        let updatedBadges = garden.badgeAchievements.map(
          func(p) {
            if (p.name == plant.name) { { p with isUnlocked = true } } else { p };
          }
        );

        let updatedGarden = {
          garden with
          streakMilestones = updatedStreaks;
          badgeAchievements = updatedBadges;
        };
        loveGardens.add(caller, updatedGarden);
      };
    };
  };

  func internalInitPrompts() {
    if (promptsInitialized) { return };

    addPrompt(0, "Plan a special activity together for some quality time.", #qualityTime);
    addPrompt(1, "Spend uninterrupted time with your partner today.", #qualityTime);
    addPrompt(2, "Share sincere appreciation with your partner.", #wordsOfAffirmation);
    addPrompt(3, "Write your partner a positive note.", #wordsOfAffirmation);
    addPrompt(4, "Show affection through gentle touch and hugs.", #physicalTouch);
    addPrompt(5, "Plan a cozy movie night with cuddles.", #physicalTouch);
    addPrompt(6, "Do a helpful gesture for your partner.", #actsOfService);
    addPrompt(7, "Detailed acts of service prompt.", #actsOfService);
    addPrompt(8, "Give your partner a thoughtful gift.", #receivingGifts);
    addPrompt(9, "Share a small surprise with your partner.", #receivingGifts);
    addPrompt(10, "Share one thing you appreciate about your partner today.", #wordsOfAffirmation);
    addPrompt(11, "What made you smile today?", #qualityTime);
    addPrompt(12, "Describe your partner in one word", #wordsOfAffirmation);
    addPrompt(13, "Send your partner a cute emoji or GIF", #receivingGifts);
    addPrompt(14, "Share a memory that makes you laugh", #qualityTime);

    promptsInitialized := true;
  };

  func selectWeightedLoveLanguageFocus(rankings : [LoveLanguageRanking]) : LoveLanguage {
    if (rankings.isEmpty()) {
      return #wordsOfAffirmation;
    };
    rankings[0].language;
  };

  public shared ({ caller }) func getDailyRitual() : async ?RitualPrompt {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view daily rituals");
    };

    mustBePairedWithPartner(caller);
    let _ = mustGetCoupleId(caller);
    internalInitPrompts();

    let dayInMillis = Int.abs(Time.now() / (24 * 60 * 60 * 1000000000));
    let promptId = dayInMillis % 15;

    prompts.get(promptId);
  };

  public shared ({ caller }) func completeWeeklyChallengeWithProof(blob : ?Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete and submit weekly challenge proof");
    };

    mustBePairedWithPartner(caller);

    let coupleId = mustGetCoupleId(caller);
    switch (weeklyChallenges.get(coupleId)) {
      case (null) {
        Runtime.trap("No weekly challenge found to complete with proof");
      };
      case (?challenge) {
        let points = 100;
        let proof = {
          blob;
          points;
          timestamp = Time.now();
        };
        let updatedChallenge = {
          challenge with
          isCompleted = true;
          proof = ?proof;
        };
        weeklyChallenges.add(coupleId, updatedChallenge);
      };
    };
  };

  public shared ({ caller }) func confirmWeeklyChallengeWithoutProof() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can confirm weekly challenge completion");
    };

    mustBePairedWithPartner(caller);

    let coupleId = mustGetCoupleId(caller);
    switch (weeklyChallenges.get(coupleId)) {
      case (null) {
        Runtime.trap("No weekly challenge found to confirm completion");
      };
      case (?challenge) {
        let updatedChallenge = {
          challenge with
          isCompleted = true;
          proof = null;
        };
        weeklyChallenges.add(coupleId, updatedChallenge);
      };
    };
  };

  func mustBePairedWithPartner(caller : UserId) {
    let partnerId = switch (getPartnerId(caller)) {
      case (null) {
        Runtime.trap("Cannot view ritual: No partner assigned. Please complete pairing first.");
      };
      case (?(partnerId)) { partnerId };
    };

    if (not verifyMutualPartnership(caller, partnerId)) {
      Runtime.trap("Cannot view ritual: Invalid partner relationship");
    };
  };

  func getPromptByLoveLanguage(loveLanguage : LoveLanguage) : ?RitualPrompt {
    prompts.values().find(
      func(prompt) {
        switch (prompt.loveLanguage) {
          case (?lang) { lang == loveLanguage };
          case (null) { false };
        };
      }
    );
  };

  public query ({ caller }) func getPromptsByLoveLanguage(language : LoveLanguage) : async [RitualPrompt] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get prompts by love language");
    };

    internalInitPrompts();

    prompts.values().toArray().filter(
      func(prompt) {
        switch (prompt.loveLanguage) {
          case (?lang) { lang == language };
          case (null) { false };
        };
      }
    );
  };

  public query ({ caller }) func fetchPrompts() : async [RitualPrompt] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch prompts");
    };

    internalInitPrompts();
    prompts.values().toArray();
  };

  func getStreakData(coupleId : CoupleId) : (Nat, Nat) {
    switch (ritualEntries.get(coupleId)) {
      case (null) { (0, 0) };
      case (?coupleEntries) {
        var currentStreak = 0;
        var maxStreak = 0;
        var previousDay : ?Nat = null;
        var lastPromptId : ?Nat = null;
        var partnerA : ?UserId = null;
        var partnerB : ?UserId = null;
        var didNotifyPartnerSwitch = false;

        func processDay(dayNum : DayNumber, entry : RitualEntry, currentPromptId : Nat) {
          if (dayNum >= 1) {
            switch (previousDay) {
              case (null) {
                currentStreak += 1;
              };
              case (?prevDay) {
                if (dayNum == (prevDay + 1)) {
                  currentStreak += 1;
                } else {
                  currentStreak := 1;
                };
              };
            };

            if (currentStreak > maxStreak) {
              maxStreak := currentStreak;
            };
            previousDay := ?dayNum;
          };
        };

        coupleEntries.forEach(
          func(dayNum, entry) {
            switch (lastPromptId) {
              case (?lastPrompt) { processDay(dayNum, entry, lastPrompt) };
              case (null) {
                switch (entry.loveLanguageFocus, entry.responses.values().next()) {
                  case (?_, ?_) { processDay(dayNum, entry, entry.prompt.id) };
                  case (null, _) {};
                  case (_, null) {};
                };
              };
            };
          }
        );

        switch (partnerA, partnerB) {
          case (?a, ?b) {
            if (not didNotifyPartnerSwitch) {
              didNotifyPartnerSwitch := true;
              currentStreak := 1;
              (currentStreak, maxStreak);
            } else {
              (currentStreak, maxStreak);
            };
          };
          case (null, ?_) { (currentStreak, maxStreak) };
          case (_, null) { (currentStreak, maxStreak) };
        };
      };
    };
  };

  public query ({ caller }) func getInsightsData() : async InsighsDataExtendedResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view insights data");
    };

    let _ = mustGetCoupleId(caller);

    let badges = switch (milestoneBadges.get(caller)) {
      case (null) { [] };
      case (?b) { b };
    };

    {
      currentStreak = 0;
      longestStreak = 0;
      challengeCompletionRate = 0.0;
      mostFrequentLoveLanguage = "Quality Time";
      badges;
      challengeStats = {
        totalChallenges = 0;
        completedChallenges = 0;
        progressPercent = 0.0;
      };
      milestones = getDefaultMilestoneProgress();
      averageHarmony = 0.0;
      currentHarmony = 0.0;
      quizOverlapScore = 0.0;
      recentCompletionRate = 0.0;
      last14DayTrend = [];
      harmonyTrend = [];
      last30DayTrend = [];
    };
  };

  public query ({ caller }) func getBadgeMilestones() : async BadgeMilestoneResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view badge milestones");
    };

    let badges = switch (milestoneBadges.get(caller)) {
      case (null) { [] };
      case (?b) { b };
    };

    { badges; milestones = getDefaultMilestoneProgress() };
  };

  public shared ({ caller }) func uploadPhoto(blob : Storage.ExternalBlob, name : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload photos");
    };

    let partnerId = switch (getPartnerId(caller)) {
      case (null) {
        Runtime.trap("Cannot upload photo: No partner assigned. Please complete pairing first.");
      };
      case (?id) { id };
    };

    if (not verifyMutualPartnership(caller, partnerId)) {
      Runtime.trap("Cannot upload photo: Invalid partner relationship");
    };

    let _ = mustGetCoupleId(caller);

    let photoId = caller.toText() # "-" # Time.now().toText();
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

    if (photo.owner == caller) {
      return ?photo;
    };

    if (not verifyMutualPartnership(caller, photo.owner)) {
      if (not AccessControl.isAdmin(accessControlState, caller)) {
        Runtime.trap("Unauthorized: Can only view your own or your partner`s photos");
      };
    };

    ?photo;
  };

  public query ({ caller }) func getPhotosByUser(user : UserId) : async [SharedPhoto] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view photos");
    };

    if (user == caller) {
      return photos.values().toArray().filter(func(photo) { photo.owner == user });
    };

    if (not verifyMutualPartnership(caller, user)) {
      if (not AccessControl.isAdmin(accessControlState, caller)) {
        Runtime.trap("Unauthorized: Can only view your own or your partner`s photos");
      };
    };

    photos.values().toArray().filter(func(photo) { photo.owner == user });
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

    if (partnerId != null) {
      Runtime.trap("Cannot set partnerId directly. Use pairing flow instead.");
    };

    switch (userProfiles.get(caller)) {
      case (?_) {
        Runtime.trap("Profile already initialized. Use saveCallerUserProfile to update.");
      };
      case (null) {};
    };

    let isFirstUser = userProfiles.size() == 0;
    let assignedRole : UserRole = if (isFirstUser and not adminAssigned) {
      adminAssigned := true;
      AccessControl.assignRole(accessControlState, caller, caller, #admin);
      #admin;
    } else {
      #user;
    };

    let newUserId = caller;
    let profile = {
      name;
      partnerId = null;
      role = assignedRole;
      isFirstUser;
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

  public shared ({ caller }) func createPairingCode() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create pairing codes");
    };

    let userProfile = switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Profile not initialized. Please complete your profile setup before pairing.");
      };
      case (?profile) { profile };
    };

    switch (userProfile.partnerId) {
      case (null) {};
      case (?_) {
        Runtime.trap("Cannot create pairing code when already paired with a partner");
      };
    };

    let (code, _) = generateRandomCode();
    updateMapping(code, caller);

    if (codePool.size() >= queueSize) {
      codePool := keepLast(codePool, queueSize - 1);
    };

    codePool := codePool.concat([code]);
    code;
  };

  public shared ({ caller }) func checkPairingCode(code : Nat) : async ?Principal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check pairing codes");
    };

    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Profile not initialized. Please complete your profile setup before pairing.");
      };
      case (?_) {};
    };

    codeToPrincipal.get(code);
  };

  public shared ({ caller }) func completePairing(code : Nat) : async PairingResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #err(
        "Unauthorized: Only users can complete pairing"
      );
    };

    let userProfile = switch (userProfiles.get(caller)) {
      case (null) {
        return #err(
          "Profile not initialized. Please complete your profile setup before pairing."
        );
      };
      case (?profile) { profile };
    };

    let partnerPrincipal = switch (codeToPrincipal.get(code)) {
      case (null) {
        return #err("Invalid or expired pairing code");
      };
      case (?p) { p };
    };

    if (partnerPrincipal == caller) {
      return #err(
        "Cannot pair with yourself. Pairing code must be shared with another user"
      );
    };

    switch (userProfile.partnerId) {
      case (null) { };
      case (?_) {
        return #err(
          "Already paired. Cannot complete pairing when already paired with a partner"
        );
      };
    };

    let partnerProfile = switch (userProfiles.get(partnerPrincipal)) {
      case (null) {
        return #err("Partner profile not found for principal " # partnerPrincipal.toText());
      };
      case (?profile) { profile };
    };

    switch (partnerProfile.partnerId) {
      case (null) {};
      case (_) {
        return #err("Partner is already paired with someone else");
      };
    };

    assignPartner(caller, partnerPrincipal);
    codeToPrincipal.remove(code);

    #ok;
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

  public query ({ caller }) func getPartnerQuizState(partnerId : UserId) : async PartnerQuizState {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view partner quiz state");
    };

    if (partnerId == caller) {
      Runtime.trap("Unauthorized: Cannot access own partner quiz state, use getLoveLanguageQuizResult instead.");
    };

    if (not verifyMutualPartnership(caller, partnerId)) {
      if (not AccessControl.isAdmin(accessControlState, caller)) {
        Runtime.trap("Unauthorized: Can only view your partner's quiz state, unless admin");
      };
    };

    switch (loveLanguagesResults.get(partnerId)) {
      case (null) {
        {
          partnerCompleted = false;
          partnerResults = null;
        };
      };
      case (?results) {
        {
          partnerCompleted = true;
          partnerResults = ?results;
        };
      };
    };
  };

  public query ({ caller }) func getLoveLanguageQuizResult() : async ?LoveLanguagesQuizResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get quiz results");
    };
    loveLanguagesResults.get(caller);
  };

  public query ({ caller }) func isAdmin() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check admin status");
    };
    AccessControl.isAdmin(accessControlState, caller);
  };

  public shared ({ caller }) func saveLoveLanguageQuizResults(result : LoveLanguagesQuizResult) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save quiz results");
    };

    if (result.userId != caller) {
      Runtime.trap("Unauthorized: Cannot save quiz results for another user");
    };

    loveLanguagesResults.add(caller, result);
  };

  public shared ({ caller }) func clearLoveLanguagesQuizResults() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear quiz results");
    };
    loveLanguagesResults.remove(caller);
  };

  func getDefaultMilestoneProgress() : MilestoneProgress {
    {
      sevenDayUnlocked = false;
      thirtyDayUnlocked = false;
      hundredDayUnlocked = false;
      harmonyEliteUnlocked = false;
    };
  };

  public shared ({ caller }) func submitRitualResponse(input : DailyRitualInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit ritual responses");
    };

    let partnerId = switch (getPartnerId(caller)) {
      case (null) {
        Runtime.trap("Cannot submit ritual: No partner assigned. Please complete pairing first.");
      };
      case (?id) { id };
    };

    if (not verifyMutualPartnership(caller, partnerId)) {
      Runtime.trap("Cannot submit ritual: Invalid partner relationship");
    };

    let coupleId = mustGetCoupleId(caller);
    internalInitPrompts();

    let dayInMillis = Int.abs(Time.now() / (24 * 60 * 60 * 1_000_000_000));
    let promptId = dayInMillis % 15;

    let prompt = switch (prompts.get(promptId)) {
      case (null) {
        Runtime.trap("Ritual prompt for today not found");
      };
      case (?p) { p };
    };

    let response : RitualResponse = {
      userId = caller;
      text = input.text;
      emoji = input.emoji;
      photoId = input.photoId;
    };

    let currentEntries = switch (ritualEntries.get(coupleId)) {
      case (null) { Map.empty<DayNumber, RitualEntry>() };
      case (?entries) { entries };
    };

    let entry = switch (currentEntries.get(dayInMillis)) {
      case (null) {
        {
          prompt;
          responses = Map.singleton<UserId, RitualResponse>(caller, response);
          date = Time.now();
          loveLanguageFocus = prompt.loveLanguage;
        };
      };
      case (?existing) {
        let newResponses = existing.responses;
        newResponses.add(caller, response);
        {
          existing with
          responses = newResponses;
        };
      };
    };

    currentEntries.add(dayInMillis, entry);

    ritualEntries.add(coupleId, currentEntries);

    let currentStatus = switch (dailyRitualStats.get(caller)) {
      case (null) {
        {
          partnerId = ?partnerId;
          prompt;
          responses = [response];
          status = #waitingForPartner;
          streakCount = 0;
          harmonyMeter = 0.5;
        };
      };
      case (?existing) {
        {
          existing with
          prompt;
          responses = [response];
        };
      };
    };
    dailyRitualStats.add(caller, currentStatus);
  };

  public query ({ caller }) func getRitualStatus() : async ?CanonicalPartnerRitualStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get ritual status");
    };
    mustBePairedWithPartner(caller);

    let coupleId = mustGetCoupleId(caller);
    let entriesMap = ritualEntries.get(coupleId);

    let dayInMillis = Int.abs(Time.now() / (24 * 60 * 60 * 1_000_000_000));
    let entry = switch (entriesMap) {
      case (null) { null };
      case (?map) { map.get(dayInMillis) };
    };

    switch (entry, getPartnerId(caller)) {
      case (?e, ?partnerId) {
        let (partnerA, partnerB) =
          if (caller.toText() < partnerId.toText()) {
            (caller, partnerId);
          } else {
            (partnerId, caller);
          };

        let partnerAComplete = e.responses.get(partnerA) != null;
        let partnerBComplete = e.responses.get(partnerB) != null;

        ?{
          partnerA;
          partnerB;
          partnerAComplete;
          partnerBComplete;
        };
      };
      case (_ , null) { null };
      case (null, ?_) { null };
    };
  };

  public query ({ caller }) func getRitualHistory(limit : Nat) : async [RitualEntryView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get ritual history");
    };
    mustBePairedWithPartner(caller);

    let coupleId = mustGetCoupleId(caller);

    switch (ritualEntries.get(coupleId)) {
      case (null) { [] };
      case (?dailyEntries) {
        let sortedEntries = dailyEntries.toArray().sort(
          func(a, b) {
            if (a.0 < b.0) { return #greater };
            if (a.0 > b.0) { return #less };
            #equal;
          }
        );

        let sortedViews = sortedEntries.map(
          func((_, entry)) { convertToRitualEntryView(entry) }
        );

        sortedViews.sliceToArray(0, Nat.min(limit, sortedViews.size()));
      };
    };
  };

  // NEW XP/REWARDS SYSTEM FUNCTIONS
  public query ({ caller }) func getXP() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view XP");
    };
    switch (xpMap.get(caller)) {
      case (?xp) { xp };
      case (null) { 0 };
    };
  };

  public query ({ caller }) func getBadges() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view badges");
    };
    switch (badgeMap.get(caller)) {
      case (?badges) { badges };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getAllBadges() : async [(UserId, [Text])] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all badges");
    };
    badgeMap.toArray();
  };

  public query ({ caller }) func getXPForAllUsers() : async [(UserId, Nat)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users' XP");
    };
    xpMap.toArray();
  };

  func calculateLevel(xp : Nat) : Nat {
    let levelThresholds : [Nat] = [500, 300, 100, 0];

    for ((index, threshold) in levelThresholds.enumerate()) {
      if (xp >= threshold) { return 5 - index; };
    };

    1;
  };

  func calculateRewardXP(caller : UserId, earnedXP : Nat) : RewardXPResult {
    let currentXP = switch (xpMap.get(caller)) {
      case (?xp) { xp };
      case (null) { 0 };
    };

    let newXP = currentXP + earnedXP;
    let level = calculateLevel(newXP);

    let exceededRewardTiers = getRewardTiers().filter(
      func((tierXP, _)) { currentXP < tierXP and newXP >= tierXP }
    );

    switch (exceededRewardTiers.find(func(tier) { tier.1 != null })) {
      case (?(_, ?rewardTier)) {
        if (rewardTier.pointsRequired == newXP) {
          addBadge(caller, rewardTier.rewardType);
        };
      };
      case (_) {};
    };

    xpMap.add(caller, newXP);

    { previousXP = currentXP; newXP; level };
  };

  public shared ({ caller }) func rewardXP(earnedXP : Nat) : async RewardXPResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can reward XP");
    };
    calculateRewardXP(caller, earnedXP);
  };

  func updateXP(caller : UserId, newXP : Nat) {
    xpMap.add(caller, newXP);
  };

  func updateBadges(caller : UserId, newBadges : [Badge]) {
    badgeMap.add(caller, newBadges);
  };

  func addBadge(caller : UserId, badge : Badge) {
    let currentBadges = switch (badgeMap.get(caller)) {
      case (?badges) { badges };
      case (null) { [] };
    };
    let newBadges = currentBadges.concat([badge]);
    badgeMap.add(caller, newBadges);
  };
};

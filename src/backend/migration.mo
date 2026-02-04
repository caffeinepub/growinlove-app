import Array "mo:core/Array";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import Principal "mo:core/Principal";

module {
  type Time = Time.Time;
  type UserId = Principal.Principal;

  type LoveLanguage = {
    #wordsOfAffirmation;
    #actsOfService;
    #receivingGifts;
    #qualityTime;
    #physicalTouch;
  };

  type DailyRitualInput = {
    text : ?Text;
    emoji : ?Text;
    photoId : ?Text;
  };

  type PartnerRitualStatus = {
    partnerAComplete : Bool;
    partnerBComplete : Bool;
  };

  type CanonicalPartnerRitualStatus = {
    partnerA : UserId;
    partnerB : UserId;
    partnerAComplete : Bool;
    partnerBComplete : Bool;
  };

  type HarmonyStats = {
    streakCount : Nat;
    completionRate : Float;
    averageHarmony : Float;
  };

  type EntryStatus = {
    #waitingForPartner;
    #complete;
  };

  type GetDailyRitualResponse = {
    partnerId : ?UserId;
    prompt : RitualPrompt;
    responses : [RitualResponse];
    status : EntryStatus;
    streakCount : Nat;
    harmonyMeter : Float;
  };

  type MilestoneBadge = {
    name : Text;
    dateAchieved : Time.Time;
    isUnlocked : Bool;
  };

  type InsightsDataResponse = {
    currentStreak : Nat;
    longestStreak : Nat;
    challengeCompletionRate : Float;
    mostFrequentLoveLanguage : Text;
    badges : [MilestoneBadge];
  };

  type MilestoneProgress = {
    sevenDayUnlocked : Bool;
    thirtyDayUnlocked : Bool;
    hundredDayUnlocked : Bool;
    harmonyEliteUnlocked : Bool;
  };

  type BadgeMilestoneResponse = {
    badges : [MilestoneBadge];
    milestones : MilestoneProgress;
  };

  type InsighsDataExtendedResponse = {
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

  type DayNumber = Nat;
  type CoupleId = Text;

  type RitualCompletion = {
    partnerAComplete : Bool;
    partnerBComplete : Bool;
    completionTimePartnerA : ?Time.Time;
    completionTimePartnerB : ?Time.Time;
  };

  type DayStats = {
    numCompletedByBoth : Nat;
    numCompletedByEither : Nat;
  };

  type UserRole = {
    #admin;
    #user;
  };

  type UserProfile = {
    name : Text;
    partnerId : ?Principal.Principal;
    role : UserRole;
    isFirstUser : Bool;
  };

  type RitualPrompt = {
    id : Nat;
    text : Text;
    loveLanguage : ?LoveLanguage;
  };

  type RitualResponse = {
    userId : UserId;
    text : ?Text;
    emoji : ?Text;
    photoId : ?Text;
  };

  type RitualEntry = {
    prompt : RitualPrompt;
    responses : Map.Map<UserId, RitualResponse>;
    date : Int;
    loveLanguageFocus : ?LoveLanguage;
  };

  type SharedPhoto = {
    id : Text;
    owner : UserId;
    blob : Storage.ExternalBlob;
    name : Text;
    timestamp : Time.Time;
  };

  type LoveLanguageRanking = {
    language : LoveLanguage;
    score : Float;
  };

  type LoveLanguagesQuizResult = {
    userId : UserId;
    rankings : [LoveLanguageRanking];
    completionTime : Time.Time;
  };

  type SynchronizedLoveLanguagesResults = {
    userId : UserId;
    results : LoveLanguagesQuizResult;
    partnerResults : LoveLanguagesQuizResult;
  };

  type LoveChallenge = {
    id : Nat;
    title : Text;
    description : Text;
    loveLanguage : LoveLanguage;
    isCompleted : Bool;
    dateAssigned : Int;
  };

  type CoupleChallenges = {
    coupleId : Text;
    activeChallenges : [LoveChallenge];
    completedChallenges : [LoveChallenge];
  };

  type ChallengeStats = {
    totalChallenges : Nat;
    completedChallenges : Nat;
    progressPercent : Float;
  };

  type StreakRecord = {
    currentStreak : Nat;
    longestStreak : Nat;
  };

  type CoupleStats = {
    streakRecord : StreakRecord;
    lastCompletedDay : ?Text;
    harmonyStats : HarmonyStats;
    currentStreak : Nat;
    longestStreak : Nat;
  };

  type PairingResult = {
    #ok;
    #err : Text;
  };

  type PromptInitializationResult = {
    #success;
    #alreadyInitialized;
    #unauthorized;
    #internalError : Text;
  };

  type RitualEntryView = {
    prompt : RitualPrompt;
    responses : [RitualResponse];
    date : Int;
    loveLanguageFocus : ?LoveLanguage;
  };

  type OldActor = {
    prompts : Map.Map<Nat, RitualPrompt>;
    userProfiles : Map.Map<UserId, UserProfile>;
    codeToPrincipal : Map.Map<Nat, Principal.Principal>;
    ritualEntries : Map.Map<Text, RitualEntry>;
    photos : Map.Map<Text, SharedPhoto>;
    currentStreaks : Map.Map<UserId, Nat>;
    longestStreaks : Map.Map<UserId, Nat>;
    coupleStats : Map.Map<UserId, CoupleStats>;
    loveLanguagesResults : Map.Map<UserId, LoveLanguagesQuizResult>;
    synchronizedLoveLanguagesResults : Map.Map<UserId, SynchronizedLoveLanguagesResults>;
    dailyRitualStats : Map.Map<UserId, GetDailyRitualResponse>;
    harmonyStatsMap : Map.Map<UserId, HarmonyStats>;
    milestoneProgress : Map.Map<UserId, MilestoneProgress>;
    milestoneBadges : Map.Map<UserId, [MilestoneBadge]>;
    coupleChallenges : Map.Map<Text, CoupleChallenges>;
    challengeStats : Map.Map<Text, ChallengeStats>;
    completedDays : Map.Map<CoupleId, Map.Map<DayNumber, RitualCompletion>>;
    completedDaysReviewStats : Map.Map<CoupleId, DayStats>;
  };

  type NewActor = {
    prompts : Map.Map<Nat, RitualPrompt>;
    userProfiles : Map.Map<UserId, UserProfile>;
    codeToPrincipal : Map.Map<Nat, Principal.Principal>;
    ritualEntries : Map.Map<Text, Map.Map<DayNumber, RitualEntry>>;
    photos : Map.Map<Text, SharedPhoto>;
    currentStreaks : Map.Map<UserId, Nat>;
    longestStreaks : Map.Map<UserId, Nat>;
    coupleStats : Map.Map<UserId, CoupleStats>;
    loveLanguagesResults : Map.Map<UserId, LoveLanguagesQuizResult>;
    synchronizedLoveLanguagesResults : Map.Map<UserId, SynchronizedLoveLanguagesResults>;
    dailyRitualStats : Map.Map<UserId, GetDailyRitualResponse>;
    harmonyStatsMap : Map.Map<UserId, HarmonyStats>;
    milestoneProgress : Map.Map<UserId, MilestoneProgress>;
    milestoneBadges : Map.Map<UserId, [MilestoneBadge]>;
    coupleChallenges : Map.Map<Text, CoupleChallenges>;
    challengeStats : Map.Map<Text, ChallengeStats>;
    completedDays : Map.Map<CoupleId, Map.Map<DayNumber, RitualCompletion>>;
    completedDaysReviewStats : Map.Map<CoupleId, DayStats>;
  };

  public func run(old : OldActor) : NewActor {
    let newRitualEntries = old.ritualEntries.map<Text, RitualEntry, Map.Map<DayNumber, RitualEntry>>(
      func(_coupleId, entry) {
        let dayNumber = Int.abs(entry.date) / (24 * 60 * 60 * 1_000_000_000);
        let map = Map.empty<DayNumber, RitualEntry>();
        map.add(dayNumber, entry);
        map;
      }
    );

    {
      old with
      ritualEntries = newRitualEntries;
    };
  };
};

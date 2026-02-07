import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type UserId = Principal;
  type LoveLanguage = {
    #wordsOfAffirmation;
    #actsOfService;
    #receivingGifts;
    #qualityTime;
    #physicalTouch;
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
  type SharedPhoto = {
    id : Text;
    owner : UserId;
    blob : Blob;
    name : Text;
    timestamp : Time.Time;
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
  type RitualStatus = {
    partner1Complete : Bool;
    partner2Complete : Bool;
  };
  type MilestoneBadge = {
    name : Text;
    dateAchieved : Time.Time;
    isUnlocked : Bool;
  };
  type ChallengeStats = {
    totalChallenges : Nat;
    completedChallenges : Nat;
    progressPercent : Float;
  };
  type MilestoneProgress = {
    sevenDayUnlocked : Bool;
    thirtyDayUnlocked : Bool;
    hundredDayUnlocked : Bool;
    harmonyEliteUnlocked : Bool;
  };

  type OldActor = {
    prompts : Map.Map<Nat, RitualPrompt>;
    ritualEntries : Map.Map<Text, Map.Map<Nat, RitualEntry>>;
    photos : Map.Map<Text, SharedPhoto>;
    currentStreaks : Map.Map<UserId, Nat>;
    longestStreaks : Map.Map<UserId, Nat>;
    coupleStats : Map.Map<UserId, CoupleStats>;
    harmonyStatsMap : Map.Map<UserId, HarmonyStats>;
    milestoneProgress : Map.Map<UserId, MilestoneProgress>;
    milestoneBadges : Map.Map<UserId, [MilestoneBadge]>;
    challengeStats : Map.Map<Text, ChallengeStats>;
  };

  public func run(state : OldActor) : OldActor {
    state;
  };
};

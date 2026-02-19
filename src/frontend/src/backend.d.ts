import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface SharedPhoto {
    id: string;
    owner: UserId;
    blob: ExternalBlob;
    name: string;
    timestamp: Time;
}
export interface LoveLanguagesQuizResult {
    rankings: Array<LoveLanguageRanking>;
    completionTime: Time;
    userId: UserId;
}
export interface DailyRitualInput {
    text?: string;
    emoji?: string;
    photoId?: string;
}
export type Time = bigint;
export interface RitualResponse {
    userId: UserId;
    text?: string;
    emoji?: string;
    photoId?: string;
}
export interface CombinedQuizResultState {
    callerResults?: LoveLanguagesQuizResult;
    partnerCompleted: boolean;
    partnerResults?: LoveLanguagesQuizResult;
    callerCompleted: boolean;
}
export interface Plant {
    name: string;
    description: string;
    milestone: string;
    isUnlocked: boolean;
    xpRequired: XP;
}
export interface CanonicalPartnerRitualStatus {
    partnerBComplete: boolean;
    partnerA: UserId;
    partnerB: UserId;
    partnerAComplete: boolean;
}
export interface RitualPrompt {
    id: bigint;
    text: string;
    loveLanguage?: LoveLanguage;
}
export interface PartnerQuizState {
    partnerCompleted: boolean;
    partnerResults?: LoveLanguagesQuizResult;
}
export interface InsighsDataExtendedResponse {
    challengeStats: ChallengeStats;
    mostFrequentLoveLanguage: string;
    last14DayTrend: Array<boolean>;
    recentCompletionRate: number;
    badges: Array<MilestoneBadge>;
    quizOverlapScore: number;
    last30DayTrend: Array<boolean>;
    currentHarmony: number;
    harmonyTrend: Array<number>;
    longestStreak: bigint;
    challengeCompletionRate: number;
    averageHarmony: number;
    currentStreak: bigint;
    milestones: MilestoneProgress;
}
export interface RitualEntryView {
    responses: Array<RitualResponse>;
    loveLanguageFocus?: LoveLanguage;
    date: bigint;
    prompt: RitualPrompt;
}
export interface BadgeMilestoneResponse {
    badges: Array<MilestoneBadge>;
    milestones: MilestoneProgress;
}
export interface LoveLanguageRanking {
    score: number;
    language: LoveLanguage;
}
export interface ChallengeStats {
    completedChallenges: bigint;
    progressPercent: number;
    totalChallenges: bigint;
}
export type UserId = Principal;
export type XP = bigint;
export interface LoveGarden {
    xp: XP;
    level: bigint;
    streakMilestones: Array<Plant>;
    badgeAchievements: Array<Plant>;
    isComplete: boolean;
}
export type PairingResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface MilestoneBadge {
    name: string;
    dateAchieved: Time;
    isUnlocked: boolean;
}
export interface MilestoneProgress {
    hundredDayUnlocked: boolean;
    thirtyDayUnlocked: boolean;
    sevenDayUnlocked: boolean;
    harmonyEliteUnlocked: boolean;
}
export interface GardenProgress {
    xp: XP;
    unlockedPlant?: Plant;
    level: bigint;
    hasAvailableRewards: boolean;
    streakMilestones: Array<Plant>;
    badgeAchievements: Array<Plant>;
    isComplete: boolean;
    levelProgress: number;
}
export interface RewardXPResult {
    level: bigint;
    newXP: bigint;
    previousXP: bigint;
}
export enum LoveLanguage {
    qualityTime = "qualityTime",
    receivingGifts = "receivingGifts",
    actsOfService = "actsOfService",
    wordsOfAffirmation = "wordsOfAffirmation",
    physicalTouch = "physicalTouch"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkPairingCode(code: bigint): Promise<Principal | null>;
    clearLoveLanguagesQuizResults(): Promise<void>;
    completePairing(code: bigint): Promise<PairingResult>;
    completeWeeklyChallengeWithProof(blob: ExternalBlob | null): Promise<void>;
    confirmWeeklyChallengeWithoutProof(): Promise<void>;
    createGarden(): Promise<void>;
    createPairingCode(): Promise<bigint>;
    deletePhoto(id: string): Promise<void>;
    fetchPrompts(): Promise<Array<RitualPrompt>>;
    getAllBadges(): Promise<Array<[UserId, Array<string>]>>;
    getBadgeMilestones(): Promise<BadgeMilestoneResponse>;
    getBadges(): Promise<Array<string>>;
    getCallerUserRole(): Promise<UserRole>;
    getCombinedQuizResultState(): Promise<CombinedQuizResultState | null>;
    getDailyRitual(): Promise<RitualPrompt | null>;
    getInsightsData(): Promise<InsighsDataExtendedResponse>;
    getLoveGarden(): Promise<LoveGarden>;
    getLoveGardenProgress(): Promise<GardenProgress>;
    getLoveLanguageQuizResult(): Promise<LoveLanguagesQuizResult | null>;
    getPartnerQuizState(partnerId: UserId): Promise<PartnerQuizState>;
    getPhoto(id: string): Promise<SharedPhoto | null>;
    getPhotosByUser(user: UserId): Promise<Array<SharedPhoto>>;
    getPromptsByLoveLanguage(language: LoveLanguage): Promise<Array<RitualPrompt>>;
    getRitualHistory(limit: bigint): Promise<Array<RitualEntryView>>;
    getRitualStatus(): Promise<CanonicalPartnerRitualStatus | null>;
    getXP(): Promise<bigint>;
    getXPForAllUsers(): Promise<Array<[UserId, bigint]>>;
    initializeUserProfile(name: string, partnerId: UserId | null): Promise<UserId>;
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    rewardXP(earnedXP: bigint): Promise<RewardXPResult>;
    saveLoveLanguageQuizResults(result: LoveLanguagesQuizResult): Promise<void>;
    submitRitualResponse(input: DailyRitualInput): Promise<void>;
    unlockPlant(plantName: string): Promise<void>;
    uploadPhoto(blob: ExternalBlob, name: string): Promise<string>;
}

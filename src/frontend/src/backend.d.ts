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
export type Time = bigint;
export interface RitualResponse {
    userId: UserId;
    text?: string;
    emoji?: string;
    photoId?: string;
}
export interface RitualEntryView {
    responses: Array<RitualResponse>;
    loveLanguageFocus?: LoveLanguage;
    date: bigint;
    prompt: RitualPrompt;
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
export interface LoveLanguageRanking {
    score: number;
    language: LoveLanguage;
}
export interface RitualPrompt {
    id: bigint;
    text: string;
    loveLanguage?: LoveLanguage;
}
export interface DailyRitualInput {
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
export interface PartnerQuizState {
    partnerCompleted: boolean;
    partnerResults?: LoveLanguagesQuizResult;
}
export type UserId = Principal;
export interface ChallengeStats {
    completedChallenges: bigint;
    progressPercent: number;
    totalChallenges: bigint;
}
export interface CanonicalPartnerRitualStatus {
    partnerBComplete: boolean;
    partnerA: UserId;
    partnerB: UserId;
    partnerAComplete: boolean;
}
export interface BadgeMilestoneResponse {
    badges: Array<MilestoneBadge>;
    milestones: MilestoneProgress;
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
export interface RewardXPResult {
    level: bigint;
    newXP: bigint;
    previousXP: bigint;
}
export interface UserProfile {
    name: string;
    role: UserRole;
    partnerId?: UserId;
    isFirstUser: boolean;
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
    user = "user"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    checkPairingCode(code: bigint): Promise<Principal | null>;
    clearAllCompletedChallenges(): Promise<void>;
    clearLoveLanguagesQuizResults(): Promise<void>;
    completePairing(code: bigint): Promise<PairingResult>;
    completeWeeklyChallengeWithProof(blob: ExternalBlob | null): Promise<void>;
    confirmWeeklyChallengeWithoutProof(): Promise<void>;
    createPairingCode(): Promise<bigint>;
    deletePhoto(id: string): Promise<void>;
    fetchPrompts(): Promise<Array<RitualPrompt>>;
    getAllBadges(): Promise<Array<[UserId, Array<string>]>>;
    getBadgeMilestones(): Promise<BadgeMilestoneResponse>;
    getBadges(): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getChallengeCompletionCount(): Promise<bigint>;
    getCombinedQuizResultState(): Promise<CombinedQuizResultState | null>;
    getCompletedChallengeIds(): Promise<Array<bigint>>;
    getDailyRitual(): Promise<RitualPrompt | null>;
    getInsightsData(): Promise<InsighsDataExtendedResponse>;
    getLoveLanguageQuizResult(): Promise<LoveLanguagesQuizResult | null>;
    getPartnerQuizState(partnerId: UserId): Promise<PartnerQuizState>;
    getPhoto(id: string): Promise<SharedPhoto | null>;
    getPhotosByUser(user: UserId): Promise<Array<SharedPhoto>>;
    getPromptsByLoveLanguage(language: LoveLanguage): Promise<Array<RitualPrompt>>;
    getRitualHistory(limit: bigint): Promise<Array<RitualEntryView>>;
    getRitualStatus(): Promise<CanonicalPartnerRitualStatus | null>;
    getUserProfile(user: UserId): Promise<UserProfile | null>;
    getXP(): Promise<bigint>;
    getXPForAllUsers(): Promise<Array<[UserId, bigint]>>;
    initializeUserProfile(name: string, partnerId: UserId | null): Promise<UserId>;
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isChallengeCompleted(challengeId: bigint): Promise<boolean>;
    markChallengeComplete(challengeId: bigint): Promise<void>;
    resetChallengeCompletion(challengeId: bigint): Promise<void>;
    rewardXP(earnedXP: bigint): Promise<RewardXPResult>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveLoveLanguageQuizResults(result: LoveLanguagesQuizResult): Promise<void>;
    submitRitualResponse(input: DailyRitualInput): Promise<void>;
    uploadPhoto(blob: ExternalBlob, name: string): Promise<string>;
}

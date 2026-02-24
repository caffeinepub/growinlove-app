import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LoveLanguagesQuizResult {
    rankings: Array<LoveLanguageRanking>;
    completionTime: Time;
    userId: UserId;
}
export type Time = bigint;
export interface CombinedQuizResultState {
    callerResults?: LoveLanguagesQuizResult;
    partnerCompleted: boolean;
    partnerResults?: LoveLanguagesQuizResult;
    callerCompleted: boolean;
}
export interface CoupleProgress {
    pointsForNextLevel: bigint;
    currentLevel: bigint;
    totalPoints: bigint;
    levelThresholds: Array<bigint>;
    pointsToNextLevel: bigint;
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
export type UserId = Principal;
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
    calculateLevelPointsNonAuth(ritualCount: bigint, harmonyScore: bigint, challengesCompleted: bigint): Promise<CoupleProgress>;
    fetchPrompts(): Promise<Array<RitualPrompt>>;
    getBadges(): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getCombinedQuizResultState(): Promise<CombinedQuizResultState | null>;
    getCoupleProgress(partner: Principal, ritualCount: bigint, harmonyScore: bigint, challengesCompleted: bigint): Promise<CoupleProgress>;
    getLevelThresholds(): Promise<Array<bigint>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getXP(): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}

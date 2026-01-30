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
export interface DailyRitualInput {
    text?: string;
    emoji?: string;
}
export type Time = bigint;
export interface RitualResponse {
    userId: UserId;
    text?: string;
    emoji?: string;
}
export interface RitualPrompt {
    id: bigint;
    text: string;
}
export interface GetDailyRitualResponse {
    status: EntryStatus;
    responses: Array<RitualResponse>;
    harmonyMeter: number;
    prompt: RitualPrompt;
    streakCount: bigint;
}
export type UserId = Principal;
export interface PartnerRitualStatus {
    partnerBComplete: boolean;
    partnerAComplete: boolean;
}
export interface UserProfile {
    name: string;
    partnerId?: Principal;
}
export enum EntryStatus {
    complete = "complete",
    waitingForPartner = "waitingForPartner"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignPartner(partner: UserId): Promise<void>;
    checkPairingCode(code: bigint): Promise<Principal | null>;
    completePairing(code: bigint): Promise<void>;
    createPairingCode(): Promise<bigint>;
    deletePhoto(id: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDailyRitual(): Promise<RitualPrompt | null>;
    getDailyRitualWithStats(): Promise<GetDailyRitualResponse>;
    getPhoto(id: string): Promise<SharedPhoto | null>;
    getPhotosByUser(user: UserId): Promise<Array<SharedPhoto>>;
    getRitualStatus(): Promise<PartnerRitualStatus>;
    getUserProfile(user: UserId): Promise<UserProfile | null>;
    initPrompts(): Promise<void>;
    initializeUserProfile(name: string, partnerId: UserId | null): Promise<UserId>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitRitualResponse(input: DailyRitualInput): Promise<void>;
    uploadPhoto(blob: ExternalBlob, name: string): Promise<string>;
}

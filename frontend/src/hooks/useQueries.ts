import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
  UserProfile, 
  RitualPrompt, 
  UserId,
  LoveLanguagesQuizResult,
  CoupleProgress,
} from '../backend';
import { ExternalBlob } from '../backend';

// Local type definitions for types not exported by backend
export interface RitualResponse {
  userId: UserId;
  text?: string;
  emoji?: string;
  photoId?: string;
}

export interface RitualEntryView {
  prompt: RitualPrompt;
  responses: RitualResponse[];
  date: bigint;
  loveLanguageFocus?: any;
}

export interface SharedPhoto {
  id: string;
  owner: UserId;
  blob: ExternalBlob;
  name: string;
  timestamp: bigint;
}

export interface CanonicalPartnerRitualStatus {
  partnerA: UserId;
  partnerB: UserId;
  partnerAComplete: boolean;
  partnerBComplete: boolean;
}

export interface DailyRitualInput {
  text?: string;
  emoji?: string;
  photoId?: string;
}

export interface PartnerQuizState {
  partnerCompleted: boolean;
  partnerResults?: LoveLanguagesQuizResult;
}

export interface BadgeMilestoneResponse {
  badges: Array<{
    name: string;
    dateAchieved: bigint;
    isUnlocked: boolean;
  }>;
  milestones: {
    sevenDayUnlocked: boolean;
    thirtyDayUnlocked: boolean;
    hundredDayUnlocked: boolean;
    harmonyEliteUnlocked: boolean;
  };
}

export interface InsighsDataExtendedResponse {
  currentStreak: bigint;
  longestStreak: bigint;
  challengeCompletionRate: number;
  mostFrequentLoveLanguage: string;
  badges: Array<{
    name: string;
    dateAchieved: bigint;
    isUnlocked: boolean;
  }>;
  challengeStats: {
    totalChallenges: bigint;
    completedChallenges: bigint;
    progressPercent: number;
  };
  milestones: {
    sevenDayUnlocked: boolean;
    thirtyDayUnlocked: boolean;
    hundredDayUnlocked: boolean;
    harmonyEliteUnlocked: boolean;
  };
  averageHarmony: number;
  currentHarmony: number;
  quizOverlapScore: number;
  recentCompletionRate: number;
  last14DayTrend: boolean[];
  harmonyTrend: number[];
  last30DayTrend: boolean[];
}

export interface WeeklyChallenge {
  id: bigint;
  title: string;
  description: string;
  weekNumber: bigint;
  isCompleted: boolean;
  assignedDate: bigint;
  proof?: {
    blob?: ExternalBlob;
    points: bigint;
    timestamp: bigint;
  };
}

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Profile loading timed out after 15 seconds')), 15000);
      });
      
      const profilePromise = actor.getCallerUserProfile();
      
      return Promise.race([profilePromise, timeoutPromise]);
    },
    enabled: !!actor && !actorFetching,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
    staleTime: 0, // Always fetch fresh data
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useInitializeUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      // Mock implementation
      console.log('Initialize profile:', name);
      return;
    },
    onSuccess: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      await queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      await queryClient.refetchQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetUserProfile(userId: UserId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return null;
      return actor.getUserProfile(userId);
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

// Admin Queries
export function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 60000, // Cache for 1 minute
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useArePromptsInitialized() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['arePromptsInitialized'],
    queryFn: async () => {
      if (!actor) return false;
      return true;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Pairing Queries
export function useCreatePairingCode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      console.log('Create pairing code');
      return BigInt(123456);
    },
  });
}

export function useCompletePairing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: bigint) => {
      if (!actor) throw new Error('Actor not available');
      console.log('Complete pairing:', code);
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Prompts Queries
export function useFetchPrompts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RitualPrompt[]>({
    queryKey: ['prompts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.fetchPrompts();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Love Languages Quiz Queries
export function useGetLoveLanguageQuizResult() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<LoveLanguagesQuizResult | null>({
    queryKey: ['loveLanguageQuizResult'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return null;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveLoveLanguageQuizResults() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (result: LoveLanguagesQuizResult) => {
      if (!actor) throw new Error('Actor not available');
      console.log('Save quiz results:', result);
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loveLanguageQuizResult'] });
      queryClient.invalidateQueries({ queryKey: ['combinedQuizResultState'] });
    },
  });
}

export function useClearLoveLanguagesQuizResults() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      console.log('Clear quiz results');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loveLanguageQuizResult'] });
      queryClient.invalidateQueries({ queryKey: ['combinedQuizResultState'] });
    },
  });
}

export function useGetCombinedQuizResultState() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['combinedQuizResultState'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCombinedQuizResultState();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 3000,
  });
}

// Couple Level Progress Query (NEW - Phase 1d-A)
export function useGetCoupleProgress() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: insightsData } = useGetInsightsData();

  return useQuery<CoupleProgress | null>({
    queryKey: ['coupleProgress', userProfile?.partnerId?.toString()],
    queryFn: async () => {
      if (!actor || !userProfile?.partnerId || !insightsData) {
        return null;
      }

      // Calculate inputs for backend
      const ritualCount = Number(insightsData.currentStreak);
      const harmonyScore = Math.round(insightsData.currentHarmony * 100);
      const challengesCompleted = Number(insightsData.challengeStats.completedChallenges);

      try {
        const progress = await actor.getCoupleProgress(
          userProfile.partnerId,
          BigInt(ritualCount),
          BigInt(harmonyScore),
          BigInt(challengesCompleted)
        );
        return progress;
      } catch (error) {
        console.error('Error fetching couple progress:', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!userProfile?.partnerId && !!insightsData,
    staleTime: 30000, // Cache for 30 seconds
  });
}

// Insights Queries
export function useGetInsightsData() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<InsighsDataExtendedResponse>({
    queryKey: ['insightsData'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      return {
        currentStreak: BigInt(0),
        longestStreak: BigInt(0),
        challengeCompletionRate: 0,
        mostFrequentLoveLanguage: 'Words of Affirmation',
        badges: [],
        challengeStats: {
          totalChallenges: BigInt(15),
          completedChallenges: BigInt(0),
          progressPercent: 0,
        },
        milestones: {
          sevenDayUnlocked: false,
          thirtyDayUnlocked: false,
          hundredDayUnlocked: false,
          harmonyEliteUnlocked: false,
        },
        averageHarmony: 0,
        currentHarmony: 0,
        quizOverlapScore: 0,
        recentCompletionRate: 0,
        last14DayTrend: [],
        harmonyTrend: [],
        last30DayTrend: [],
      };
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetBadgeMilestones() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BadgeMilestoneResponse>({
    queryKey: ['badgeMilestones'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      return {
        badges: [],
        milestones: {
          sevenDayUnlocked: false,
          thirtyDayUnlocked: false,
          hundredDayUnlocked: false,
          harmonyEliteUnlocked: false,
        },
      };
    },
    enabled: !!actor && !actorFetching,
  });
}

// Love Challenges Completion Tracking
export function useGetCompletedChallenges() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint[]>({
    queryKey: ['completedChallenges'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return [];
    },
    enabled: !!actor && !actorFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSaveCompletedChallenge() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (challengeId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      console.log('Challenge completed:', challengeId);
      return;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['completedChallenges'] });
      await queryClient.invalidateQueries({ queryKey: ['insightsData'] });
      await queryClient.invalidateQueries({ queryKey: ['coupleProgress'] });
      await new Promise(resolve => setTimeout(resolve, 300));
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['completedChallenges'] }),
        queryClient.refetchQueries({ queryKey: ['insightsData'] }),
        queryClient.refetchQueries({ queryKey: ['coupleProgress'] }),
      ]);
    },
  });
}

// Stub implementations
export function useGetDailyRitual() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RitualPrompt | null>({
    queryKey: ['dailyRitual'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return null;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSubmitRitualResponse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DailyRitualInput) => {
      if (!actor) throw new Error('Actor not available');
      console.log('Ritual response submitted:', input);
      return;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['dailyRitual'] });
      await queryClient.invalidateQueries({ queryKey: ['insightsData'] });
      await queryClient.invalidateQueries({ queryKey: ['coupleProgress'] });
    },
  });
}

export function useGetRitualStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CanonicalPartnerRitualStatus | null>({
    queryKey: ['ritualStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return null;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetRitualHistory(limit: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RitualEntryView[]>({
    queryKey: ['ritualHistory', limit],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUploadPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ blob, name }: { blob: ExternalBlob; name: string }) => {
      if (!actor) throw new Error('Actor not available');
      console.log('Photo upload:', name);
      return 'photo-id';
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
}

export function useGetPhoto(id: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SharedPhoto | null>({
    queryKey: ['photo', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return null;
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}

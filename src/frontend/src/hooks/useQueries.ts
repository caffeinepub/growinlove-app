import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
  UserProfile, 
  RitualPrompt, 
  UserId,
  SharedPhoto,
  LoveLanguagesQuizResult,
  BadgeMilestoneResponse,
  InsighsDataExtendedResponse,
  RitualEntryView,
  DailyRitualInput,
  CanonicalPartnerRitualStatus,
  PartnerQuizState,
} from '../backend';
import { Principal } from '@icp-sdk/core/principal';
import { ExternalBlob } from '../backend';

// Local type definitions for types not exported by backend
export interface RitualResponse {
  userId: UserId;
  text?: string;
  emoji?: string;
  photoId?: string;
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
      const userId = await actor.initializeUserProfile(name, null);
      return userId;
    },
    onSuccess: async () => {
      // Wait for backend to process the profile creation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Invalidate and refetch profile to ensure UI updates
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
      return actor.isAdmin();
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
      // Backend method doesn't exist, return true as default
      return true;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    refetchInterval: 10000, // Check every 10 seconds for automatic initialization
  });
}

// Pairing Queries
export function useCreatePairingCode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      // Ensure profile is loaded before creating code
      const profile = await queryClient.ensureQueryData({
        queryKey: ['currentUserProfile'],
        queryFn: async () => actor.getCallerUserProfile(),
      });

      if (!profile) {
        throw new Error('Profile not initialized. Please complete your profile setup before pairing.');
      }

      return actor.createPairingCode();
    },
  });
}

export function useCheckPairingCode() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (code: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkPairingCode(code);
    },
  });
}

export function useCompletePairing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: bigint) => {
      if (!actor) throw new Error('Actor not available');
      
      // Ensure profile is loaded before completing pairing
      const profile = await queryClient.ensureQueryData({
        queryKey: ['currentUserProfile'],
        queryFn: async () => actor.getCallerUserProfile(),
      });

      if (!profile) {
        throw new Error('Profile not initialized. Please complete your profile setup before pairing.');
      }

      return actor.completePairing(code);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['dailyRitual'] });
      queryClient.invalidateQueries({ queryKey: ['ritualStatus'] });
    },
  });
}

// Daily Ritual Queries
export function useGetDailyRitual() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RitualPrompt | null>({
    queryKey: ['dailyRitual'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDailyRitual();
    },
    enabled: !!actor && !actorFetching,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}

export function useSubmitRitualResponse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DailyRitualInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitRitualResponse(input);
    },
    onSuccess: async () => {
      // A2: Enhanced invalidation with aggressive refetch strategy
      // Invalidate all ritual-related queries
      await queryClient.invalidateQueries({ queryKey: ['dailyRitual'], exact: true });
      await queryClient.invalidateQueries({ queryKey: ['ritualStatus'], exact: true });
      await queryClient.invalidateQueries({ queryKey: ['ritualHistory'], exact: false });
      
      // A2: Invalidate insights and badge data to trigger immediate backend fetch
      await queryClient.invalidateQueries({ queryKey: ['insightsData'], exact: true });
      await queryClient.invalidateQueries({ queryKey: ['badgeMilestones'], exact: true });
      
      // A2: Force immediate refetch with retry to ensure backend has processed the write
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief delay for backend processing
      
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['insightsData'], exact: true }),
        queryClient.refetchQueries({ queryKey: ['badgeMilestones'], exact: true }),
        queryClient.refetchQueries({ queryKey: ['ritualStatus'], exact: true }),
        queryClient.refetchQueries({ queryKey: ['ritualHistory'], exact: false }),
      ]);
    },
  });
}

export function useGetRitualStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CanonicalPartnerRitualStatus | null>({
    queryKey: ['ritualStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRitualStatus();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 5000, // Poll every 5 seconds to check partner status
  });
}

// Step 2A: Ritual History Query with client-side defensive sorting
export function useGetRitualHistory(limit: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RitualEntryView[]>({
    queryKey: ['ritualHistory', limit],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const history = await actor.getRitualHistory(BigInt(limit));
      
      // Step 2A: Client-side defensive sort to ensure reverse-chronological order
      return history.sort((a, b) => {
        const dateA = Number(a.date);
        const dateB = Number(b.date);
        return dateB - dateA; // Descending order (newest first)
      });
    },
    enabled: !!actor && !actorFetching,
  });
}

// Photo Queries
export function useUploadPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ blob, name }: { blob: ExternalBlob; name: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadPhoto(blob, name);
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
      return actor.getPhoto(id);
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}

export function useGetPhotosByUser(userId: UserId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SharedPhoto[]>({
    queryKey: ['photos', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getPhotosByUser(userId);
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

export function useDeletePhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePhoto(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
}

// Love Languages Quiz Queries
export function useGetLoveLanguageQuizResult() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<LoveLanguagesQuizResult | null>({
    queryKey: ['loveLanguageQuizResult'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLoveLanguageQuizResult();
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
      return actor.saveLoveLanguageQuizResults(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loveLanguageQuizResult'] });
      queryClient.invalidateQueries({ queryKey: ['combinedQuizResultState'] });
      queryClient.invalidateQueries({ queryKey: ['partnerQuizState'] });
    },
  });
}

export function useClearLoveLanguagesQuizResults() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearLoveLanguagesQuizResults();
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
    refetchInterval: 3000, // Poll every 3 seconds for partner completion
  });
}

export function useGetPartnerQuizState(partnerId: UserId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PartnerQuizState>({
    queryKey: ['partnerQuizState', partnerId?.toString()],
    queryFn: async () => {
      if (!actor || !partnerId) throw new Error('Actor or partnerId not available');
      return actor.getPartnerQuizState(partnerId);
    },
    enabled: !!actor && !actorFetching && !!partnerId,
    refetchInterval: 3000, // Poll every 3 seconds for partner completion
  });
}

// Insights Queries
export function useGetInsightsData() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<InsighsDataExtendedResponse>({
    queryKey: ['insightsData'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getInsightsData();
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
      return actor.getBadgeMilestones();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Prompts Queries
export function useGetPromptsByLoveLanguage(language: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RitualPrompt[]>({
    queryKey: ['promptsByLoveLanguage', language],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Map string to LoveLanguage enum
      const loveLanguageMap: Record<string, any> = {
        'Words of Affirmation': { wordsOfAffirmation: null },
        'Quality Time': { qualityTime: null },
        'Physical Touch': { physicalTouch: null },
        'Acts of Service': { actsOfService: null },
        'Receiving Gifts': { receivingGifts: null },
      };
      const loveLanguage = loveLanguageMap[language];
      if (!loveLanguage) return [];
      return actor.getPromptsByLoveLanguage(loveLanguage);
    },
    enabled: !!actor && !actorFetching,
  });
}

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

// Weekly Challenge Queries
export function useGetWeeklyChallenge() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WeeklyChallenge | null>({
    queryKey: ['weeklyChallenge'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend doesn't have getWeeklyChallenge yet, return null for now
      return null;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCompleteWeeklyChallenge() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ blob }: { blob?: ExternalBlob } = {}) => {
      if (!actor) throw new Error('Actor not available');
      
      if (blob) {
        // Complete with proof
        await actor.completeWeeklyChallengeWithProof(blob);
      } else {
        // Complete without proof
        await actor.confirmWeeklyChallengeWithoutProof();
      }
    },
    onSuccess: async () => {
      // Invalidate weekly challenge query
      await queryClient.invalidateQueries({ queryKey: ['weeklyChallenge'] });
      
      // Invalidate engagement foundation queries (points, rewards, etc.)
      await queryClient.invalidateQueries({ queryKey: ['insightsData'] });
      
      // Brief delay for backend processing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Refetch to update UI
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['weeklyChallenge'] }),
        queryClient.refetchQueries({ queryKey: ['insightsData'] }),
      ]);
    },
  });
}

// Love Challenges Completion Tracking
export function useGetCompletedChallengeIds() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint[]>({
    queryKey: ['completedChallengeIds'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCompletedChallengeIds();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useMarkChallengeComplete() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (challengeId: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markChallengeComplete(BigInt(challengeId));
    },
    onSuccess: async () => {
      // Invalidate completed challenges query
      await queryClient.invalidateQueries({ queryKey: ['completedChallengeIds'] });
      
      // Brief delay for backend processing
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Refetch to update UI
      await queryClient.refetchQueries({ queryKey: ['completedChallengeIds'] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
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
  GardenProgress,
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

// Stub UserProfile type for compatibility
export interface UserProfile {
  name: string;
  partnerId: UserId | null;
  role: { admin: null } | { user: null };
  isFirstUser: boolean;
}

// Stub hooks for user profile (return null since backend doesn't support it)
export function useGetCallerUserProfile() {
  return {
    data: null as UserProfile | null,
    isLoading: false,
    isFetched: true,
    error: null,
    refetch: async () => {},
  };
}

export function useGetUserProfile(userId: UserId | null) {
  return {
    data: null as UserProfile | null,
    isLoading: false,
    error: null,
  };
}

export function useInitializeUserProfile() {
  return {
    mutateAsync: async (name: string) => {
      console.warn('User profile initialization not supported by backend');
      return Principal.anonymous();
    },
    isPending: false,
  };
}

export function useSaveCallerUserProfile() {
  return {
    mutateAsync: async (profile: UserProfile) => {
      console.warn('User profile saving not supported by backend');
    },
    isPending: false,
  };
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

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
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
      return actor.completePairing(code);
    },
    onSuccess: () => {
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
      
      // Invalidate garden progress
      await queryClient.invalidateQueries({ queryKey: ['gardenProgress'], exact: true });
      
      // A2: Force immediate refetch with retry to ensure backend has processed the write
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief delay for backend processing
      
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['insightsData'], exact: true }),
        queryClient.refetchQueries({ queryKey: ['badgeMilestones'], exact: true }),
        queryClient.refetchQueries({ queryKey: ['ritualStatus'], exact: true }),
        queryClient.refetchQueries({ queryKey: ['ritualHistory'], exact: false }),
        queryClient.refetchQueries({ queryKey: ['gardenProgress'], exact: true }),
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

// Love Garden Queries
export function useGetLoveGardenProgress() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<GardenProgress>({
    queryKey: ['gardenProgress'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLoveGardenProgress();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateGarden() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.createGarden();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gardenProgress'] });
    },
  });
}

export function useUnlockPlant() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plantName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unlockPlant(plantName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gardenProgress'] });
    },
  });
}

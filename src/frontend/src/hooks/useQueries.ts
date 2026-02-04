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
  PartnerQuizState
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

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
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
      // Invalidate all ritual-related queries using exact query keys
      await queryClient.invalidateQueries({ queryKey: ['dailyRitual'], exact: true });
      await queryClient.invalidateQueries({ queryKey: ['ritualStatus'], exact: true });
      await queryClient.invalidateQueries({ queryKey: ['ritualHistory'], exact: false });
      
      // Build 1: Explicitly invalidate and refetch insights/badge data with exact matching
      await queryClient.invalidateQueries({ queryKey: ['insightsData'], exact: true });
      await queryClient.invalidateQueries({ queryKey: ['badgeMilestones'], exact: true });
      
      // Force immediate refetch to update UI without full reload
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['insightsData'], exact: true }),
        queryClient.refetchQueries({ queryKey: ['badgeMilestones'], exact: true }),
        queryClient.refetchQueries({ queryKey: ['ritualStatus'], exact: true }),
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
      const entries = await actor.getRitualHistory(BigInt(limit));
      
      // Step 2A: Defensive client-side sort to ensure newest-first ordering
      // Sort by entry.date descending (newest first)
      return entries.sort((a, b) => {
        if (a.date > b.date) return -1;
        if (a.date < b.date) return 1;
        return 0;
      });
    },
    enabled: !!actor && !actorFetching,
    retry: 2,
  });
}

// Photo Upload Queries
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
    staleTime: 60000, // Cache photos for 1 minute
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
export function useGetCallerQuizResults() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<LoveLanguagesQuizResult | null>({
    queryKey: ['callerQuizResults'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLoveLanguageQuizResult();
    },
    enabled: !!actor && !actorFetching,
    retry: 3,
    retryDelay: 1000,
  });
}

export function useGetPartnerQuizResults() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  return useQuery<PartnerQuizState>({
    queryKey: ['partnerQuizResults'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      // Get the caller's profile to extract partnerId
      const profile = await queryClient.ensureQueryData<UserProfile | null>({
        queryKey: ['currentUserProfile'],
        queryFn: async () => actor.getCallerUserProfile(),
      });

      // If no profile or no partner, return not completed
      if (!profile || !profile.partnerId) {
        return { partnerCompleted: false, partnerResults: undefined };
      }

      // Call the backend with the partner's principal
      try {
        const partnerState = await actor.getPartnerQuizState(profile.partnerId);
        return partnerState;
      } catch (error) {
        // Defensive fallback: if the backend method fails (e.g., older backend version),
        // return not completed instead of throwing
        console.warn('Failed to fetch partner quiz state:', error);
        return { partnerCompleted: false, partnerResults: undefined };
      }
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 5000, // Poll every 5 seconds to check partner completion
    retry: 3,
    retryDelay: 1000,
  });
}

export function useGetCombinedQuizResultState() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{
    callerResults?: LoveLanguagesQuizResult;
    partnerCompleted: boolean;
    partnerResults?: LoveLanguagesQuizResult;
    callerCompleted: boolean;
  } | null>({
    queryKey: ['combinedQuizResultState'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCombinedQuizResultState();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 5000,
    retry: 3,
    retryDelay: 1000,
  });
}

export function useSaveQuizResults() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (results: LoveLanguagesQuizResult) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveLoveLanguageQuizResults(results);
    },
    onSuccess: async () => {
      // Wait a moment for backend synchronization to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Invalidate all quiz-related queries to trigger refetch
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['callerQuizResults'] }),
        queryClient.invalidateQueries({ queryKey: ['partnerQuizResults'] }),
        queryClient.invalidateQueries({ queryKey: ['combinedQuizResultState'] }),
        queryClient.invalidateQueries({ queryKey: ['dailyRitual'] }),
      ]);
      
      // Force refetch combined state to check for synchronization
      await queryClient.refetchQueries({ queryKey: ['combinedQuizResultState'] });
    },
    retry: 2,
    retryDelay: 1000,
  });
}

export function useResetQuizResults() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearLoveLanguagesQuizResults();
    },
    onSuccess: () => {
      // Invalidate all quiz-related queries
      queryClient.invalidateQueries({ queryKey: ['callerQuizResults'] });
      queryClient.invalidateQueries({ queryKey: ['partnerQuizResults'] });
      queryClient.invalidateQueries({ queryKey: ['combinedQuizResultState'] });
    },
  });
}

// Insights Data Queries - Build 1: Hardened with exact query key matching
export function useGetInsightsData() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<InsighsDataExtendedResponse>({
    queryKey: ['insightsData'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getInsightsData();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10000, // Poll every 10 seconds for real-time updates
    retry: 2,
    staleTime: 5000, // Cache for 5 seconds to reduce unnecessary calls
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
    refetchInterval: 10000, // Poll every 10 seconds for real-time updates
    retry: 2,
    staleTime: 5000, // Cache for 5 seconds to reduce unnecessary calls
  });
}

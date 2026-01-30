import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
  UserProfile, 
  RitualPrompt, 
  DailyRitualInput, 
  GetDailyRitualResponse,
  PartnerRitualStatus,
  UserId 
} from '../backend';
import { Principal } from '@icp-sdk/core/principal';

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
      return actor.initializeUserProfile(name, null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
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
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Daily Ritual Queries
export function useGetDailyRitualWithStats() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<GetDailyRitualResponse>({
    queryKey: ['dailyRitualWithStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDailyRitualWithStats();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 5000, // Poll every 5 seconds to check partner status
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyRitualWithStats'] });
      queryClient.invalidateQueries({ queryKey: ['ritualStatus'] });
    },
  });
}

export function useGetRitualStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PartnerRitualStatus>({
    queryKey: ['ritualStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRitualStatus();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Initialize prompts (admin only)
export function useInitPrompts() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.initPrompts();
    },
  });
}

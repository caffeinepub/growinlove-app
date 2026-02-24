// Frontend-only utility functions for calculating couple level, XP, and progress
// These calculations are based on existing insights data without requiring backend changes

import type { InsighsDataExtendedResponse } from '../hooks/useQueries';

export interface CoupleLevelData {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  progressPercent: number;
}

// XP calculation based on engagement metrics
export function calculateCoupleXP(insightsData: InsighsDataExtendedResponse | undefined): number {
  if (!insightsData) return 0;

  const streakXP = Number(insightsData.currentStreak) * 10;
  const challengeXP = Number(insightsData.challengeStats.completedChallenges) * 15;
  const harmonyXP = Math.round(insightsData.averageHarmony * 100);

  return streakXP + challengeXP + harmonyXP;
}

// Level calculation based on XP (exponential curve)
export function calculateLevel(xp: number): number {
  if (xp === 0) return 1;
  return Math.floor(Math.sqrt(xp / 50)) + 1;
}

// XP required for next level
export function xpForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 50;
}

// Get complete level data
export function getCoupleLevelData(insightsData: InsighsDataExtendedResponse | undefined): CoupleLevelData {
  const totalXP = calculateCoupleXP(insightsData);
  const level = calculateLevel(totalXP);
  const xpForCurrentLevel = xpForLevel(level);
  const xpForNextLevel = xpForLevel(level + 1);
  const currentXP = totalXP - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const progressPercent = (currentXP / xpNeeded) * 100;

  return {
    level,
    currentXP,
    nextLevelXP: xpNeeded,
    progressPercent: Math.min(100, Math.max(0, progressPercent)),
  };
}

// Get level label based on level number
export function getLevelLabel(level: number): string {
  if (level <= 1) return 'Just Starting';
  if (level <= 3) return 'Growing Together';
  if (level <= 5) return 'Building Connection';
  if (level <= 10) return 'Strong Bond';
  if (level <= 15) return 'Deep Connection';
  if (level <= 20) return 'Unbreakable Bond';
  return 'Legendary Love';
}

/**
 * Frontend-only couple level and XP calculation utilities.
 * Derives visual XP/level from existing insights data without backend changes.
 */

import type { InsighsDataExtendedResponse } from '../backend';

export interface CoupleLevelData {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  progressPercent: number;
}

/**
 * Calculate couple level and XP from insights data.
 * Uses a simple formula based on streak, challenges, and harmony.
 */
export function calculateCoupleLevel(insightsData: InsighsDataExtendedResponse | null | undefined): CoupleLevelData {
  if (!insightsData) {
    return {
      level: 1,
      currentXP: 0,
      nextLevelXP: 100,
      progressPercent: 0,
    };
  }

  // Calculate total XP from various activities
  const streakXP = Number(insightsData.currentStreak) * 10;
  const challengeXP = Number(insightsData.challengeStats?.completedChallenges || 0) * 50;
  const harmonyXP = Math.floor(insightsData.averageHarmony * 100);
  
  const totalXP = streakXP + challengeXP + harmonyXP;

  // Calculate level (each level requires more XP)
  // Level 1: 0-100 XP, Level 2: 100-250 XP, Level 3: 250-450 XP, etc.
  let level = 1;
  let xpForCurrentLevel = 0;
  let xpForNextLevel = 100;
  
  while (totalXP >= xpForNextLevel) {
    level++;
    xpForCurrentLevel = xpForNextLevel;
    // Each level requires 50 more XP than the previous increment
    xpForNextLevel = xpForCurrentLevel + (100 + (level - 1) * 50);
  }

  const currentXP = totalXP - xpForCurrentLevel;
  const nextLevelXP = xpForNextLevel - xpForCurrentLevel;
  const progressPercent = Math.min(100, Math.round((currentXP / nextLevelXP) * 100));

  return {
    level,
    currentXP,
    nextLevelXP,
    progressPercent,
  };
}

/**
 * Get a descriptive label for the current level.
 */
export function getLevelLabel(level: number): string {
  if (level >= 20) return 'Legendary Couple';
  if (level >= 15) return 'Master of Love';
  if (level >= 10) return 'Love Expert';
  if (level >= 7) return 'Growing Strong';
  if (level >= 5) return 'Building Together';
  if (level >= 3) return 'Getting Started';
  return 'New Journey';
}

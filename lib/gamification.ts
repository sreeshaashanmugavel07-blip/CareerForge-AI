import type { GamificationState } from "@/types";

const KEY = "careerforge_gamification_v1";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string) {
  const da = new Date(a + "T00:00:00Z").getTime();
  const db = new Date(b + "T00:00:00Z").getTime();
  return Math.round((db - da) / (1000 * 60 * 60 * 24));
}

export function loadGamification(): GamificationState {
  if (typeof window === "undefined") {
    return {
      xp: 0,
      level: 1,
      streak: 0,
      lastActiveDate: null,
      badges: [],
    };
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) throw new Error("empty");
    return JSON.parse(raw) as GamificationState;
  } catch {
    return {
      xp: 0,
      level: 1,
      streak: 0,
      lastActiveDate: null,
      badges: [],
    };
  }
}

export function saveGamification(state: GamificationState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

/** Award XP, update streak, unlock badges, bump level thresholds. */
export function applyActivityXp(
  prev: GamificationState,
  xpGain: number,
  badgeIds?: string[]
): GamificationState {
  const today = todayISO();
  let streak = prev.streak;
  if (!prev.lastActiveDate) streak = 1;
  else {
    const diff = daysBetween(prev.lastActiveDate, today);
    if (diff === 0) {
      // same day: keep streak
    } else if (diff === 1) {
      streak += 1;
    } else {
      streak = 1;
    }
  }

  const xp = prev.xp + xpGain;
  const level = Math.max(1, Math.floor(xp / 250) + 1);

  const badges = new Set(prev.badges);
  badgeIds?.forEach((b) => badges.add(b));

  if (streak >= 3) badges.add("streak_3");
  if (streak >= 7) badges.add("streak_7");

  return {
    xp,
    level,
    streak,
    lastActiveDate: today,
    badges: Array.from(badges),
  };
}

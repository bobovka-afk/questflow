import type { CharacterDto } from './character';

export type CharacterStreakSnapshot = {
  checkinStreak: number;
  lastCheckinDayKey: string | null;
};

export type StreakProfileFeedback =
  | { kind: 'increased'; from: number; to: number }
  | { kind: 'lost'; previous: number; current: number };

const STORAGE_PREFIX = 'questflow.characterStreak.v1.';

export function normalizeCheckinDayKey(
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  return value.slice(0, 10);
}

export function snapshotFromCharacter(
  character: Pick<CharacterDto, 'checkinStreak' | 'lastCheckinDayKey'>,
): CharacterStreakSnapshot {
  return {
    checkinStreak: character.checkinStreak ?? 0,
    lastCheckinDayKey: normalizeCheckinDayKey(character.lastCheckinDayKey),
  };
}

export function readCharacterStreakSnapshot(
  userId: number,
): CharacterStreakSnapshot | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${userId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CharacterStreakSnapshot;
    if (typeof parsed.checkinStreak !== 'number') return null;
    return {
      checkinStreak: parsed.checkinStreak,
      lastCheckinDayKey: normalizeCheckinDayKey(parsed.lastCheckinDayKey),
    };
  } catch {
    return null;
  }
}

export function writeCharacterStreakSnapshot(
  userId: number,
  snapshot: CharacterStreakSnapshot,
): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(snapshot));
  } catch {
    /* ignore quota / private mode */
  }
}

export function computeStreakProfileFeedback(
  previous: CharacterStreakSnapshot | null,
  current: CharacterStreakSnapshot,
): StreakProfileFeedback | null {
  if (!previous) return null;

  if (current.checkinStreak > previous.checkinStreak) {
    return {
      kind: 'increased',
      from: previous.checkinStreak,
      to: current.checkinStreak,
    };
  }

  if (
    current.checkinStreak < previous.checkinStreak &&
    previous.checkinStreak > 1
  ) {
    return {
      kind: 'lost',
      previous: previous.checkinStreak,
      current: current.checkinStreak,
    };
  }

  return null;
}

const INTRO_PENDING_KEY = 'questflow_gamification_intro_pending';

export function markGamificationIntroPending(): void {
  try {
    sessionStorage.setItem(INTRO_PENDING_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function isGamificationIntroPending(): boolean {
  try {
    return sessionStorage.getItem(INTRO_PENDING_KEY) === '1';
  } catch {
    return false;
  }
}

export function dismissGamificationIntroPending(): void {
  try {
    sessionStorage.removeItem(INTRO_PENDING_KEY);
  } catch {
    /* ignore */
  }
}

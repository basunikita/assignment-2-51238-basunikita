export type TimerState = { total: number; remaining: number; running: boolean };

export function newTimer(total: number): TimerState {
  return { total, remaining: total, running: false };
}

// One second passes. A running timer stops itself when it reaches zero.
export function tick(state: TimerState): TimerState {
  if (!state.running) return state;
  const remaining = Math.max(0, state.remaining - 1);
  return { ...state, remaining, running: remaining > 0 };
}

// Start or pause. Starting a finished timer runs it again from the top.
export function toggleRunning(state: TimerState): TimerState {
  if (state.remaining === 0) return { ...state, remaining: state.total, running: true };
  return { ...state, running: !state.running };
}

export function resetTimer(state: TimerState): TimerState {
  return newTimer(state.total);
}

export function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

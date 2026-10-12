export function progressLabel(done: number, total: number): string {
  return `${done} of ${total} done`;
}

export function progressPercent(done: number, total: number): number {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

export function noSetsDone(sets: number): boolean[] {
  return Array.from({ length: sets }, () => false);
}

export function toggleSet(done: boolean[], index: number): boolean[] {
  return done.map((isDone, i) => (i === index ? !isDone : isDone));
}

export function allDone(done: boolean[]): boolean {
  return done.length > 0 && done.every(Boolean);
}

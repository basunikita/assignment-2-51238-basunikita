export function progressLabel(done: number, total: number): string {
  return `${done} of ${total} done`;
}

export function progressPercent(done: number, total: number): number {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

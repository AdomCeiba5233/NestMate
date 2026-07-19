export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function isWithinWordLimit(text: string, maxWords: number): boolean {
  return countWords(text) <= maxWords;
}

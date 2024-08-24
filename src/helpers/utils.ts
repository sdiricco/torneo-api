export function splitScore(score: string = ''): number[] {
  return score.split('-').map(Number)
}

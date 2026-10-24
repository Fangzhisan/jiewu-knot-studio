// Transient UI state only: cleared when the page is reloaded. No storage API.
export const practice = {
  lastLesson: 'knot',
  progress: {} as Record<string, number>,
  speed: 1,
  checks: {} as Record<string, boolean[]>,
}

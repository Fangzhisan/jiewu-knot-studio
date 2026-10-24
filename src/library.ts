import { COURSES } from './lessons/catalog'
import type { CategoryId, Course } from './lessons/types'
import { courseSearchText, getApplication, scenarioName } from './courseScenarios'
import { GUIDES } from './guides/catalog'
import type { MakingGuide } from './guides/types'

export type LibraryKind = 'interactive' | 'foundation' | 'project'
export interface LibraryEntry {
  id: string; kind: LibraryKind; category: CategoryId; title: string; summary: string
  scenarios: string[]; search: string; course?: Course; guide?: MakingGuide
}
export interface LibraryFilters { kind: string; category: string; scenario: string; query: string }
export const EMPTY_FILTERS: LibraryFilters = { kind: 'all', category: 'all', scenario: '', query: '' }
export const KIND_NAMES: Record<LibraryKind, string> = { interactive: '三维基础课', foundation: '基础补课', project: '进阶攻略' }
const norm = (text: string) => text.normalize('NFKC').toLocaleLowerCase().trim()

// Round-robin categories keeps the first row useful to all three interests.
function interleave(entries: LibraryEntry[]): LibraryEntry[] {
  const queues = ['knots', 'weaving', 'beads'].map(category => entries.filter(item => item.category === category))
  const result: LibraryEntry[] = []
  for (let i = 0; queues.some(queue => i < queue.length); i++) for (const queue of queues) if (queue[i]) result.push(queue[i]!)
  return result
}
const guideEntries: LibraryEntry[] = GUIDES.map(guide => ({
  id: guide.id, kind: guide.kind, category: guide.category, title: guide.title, summary: guide.outcome,
  scenarios: guide.scenarios, guide,
  search: norm([guide.title, guide.subtitle, guide.outcome, ...guide.scenarios.map(scenarioName), ...guide.materials.map(item => item.name)].join(' ')),
}))
export const LIBRARY_ENTRIES: LibraryEntry[] = [
  ...interleave(guideEntries.filter(entry => entry.kind === 'project')),
  ...interleave(guideEntries.filter(entry => entry.kind === 'foundation')),
  ...interleave(COURSES.map(course => ({ id: course.id, kind: 'interactive' as const, category: course.category, title: course.name, summary: getApplication(course).task, scenarios: getApplication(course).scenarios, search: courseSearchText(course), course }))),
]
export function filterLibrary(filters: LibraryFilters): LibraryEntry[] {
  const terms = norm(filters.query).split(/\s+/).filter(Boolean)
  return LIBRARY_ENTRIES.filter(entry => (filters.kind === 'all' || entry.kind === filters.kind)
    && (filters.category === 'all' || entry.category === filters.category)
    && (!filters.scenario || entry.scenarios.includes(filters.scenario))
    && terms.every(term => entry.search.includes(term)))
}

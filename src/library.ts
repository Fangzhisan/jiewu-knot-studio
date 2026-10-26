import { COURSES } from './lessons/catalog';
import type { CategoryId, Course } from './lessons/types';
import { courseSearchText, getApplication } from './courseScenarios';
import { weavingFamily } from './weavingAtlas/families';
import { beadFamily } from './beadAtlas/families';

// 目录条目保留完整课程引用，供课堂和缩略图使用。
export interface LibraryEntry {
  id: string;
  category: CategoryId;
  title: string;
  summary: string;

  scenarios: string[];
  family: string;
  finishedProject: boolean;
  search: string;
  course: Course;
}

export interface LibraryFilters {
  category: string;
  scenario: string;
  query: string;
  family: string;
}
export const EMPTY_FILTERS: LibraryFilters = {
  category: 'all',
  scenario: '',
  query: '',
  family: '',
};
// 统一搜索词的全半角和大小写。
const norm = (text: string) => text.normalize('NFKC').toLocaleLowerCase().trim();

// 三类课程交错排列，避免目录首屏只有同一类。
function interleave(entries: LibraryEntry[]): LibraryEntry[] {
  const queues = ['knots', 'weaving', 'beads'].map((category) =>
    entries.filter((item) => item.category === category),
  );

  const result: LibraryEntry[] = [];

  for (let i = 0; queues.some((queue) => i < queue.length); i++) {
    for (const queue of queues) {
      if (queue[i]) {
        result.push(queue[i]!);
      }
    }
  }

  return result;
}

export const LIBRARY_ENTRIES = interleave(
  COURSES.map((course) => ({
    id: course.id,
    category: course.category,
    title: course.name,
    summary: getApplication(course).task,
    scenarios: getApplication(course).scenarios,
    family: weavingFamily(course.id)?.id ?? beadFamily(course.id)?.id ?? '',
    finishedProject: beadFamily(course.id)?.project ?? false,
    search: norm(
      courseSearchText(course) +
        ' ' +
        (weavingFamily(course.id)?.keywords ?? beadFamily(course.id)?.keywords ?? ''),
    ),
    course,
  })),
);

// 分类、场景和所有搜索词必须同时匹配。
export function filterLibrary(filters: LibraryFilters): LibraryEntry[] {
  const terms = norm(filters.query).split(/\s+/).filter(Boolean);

  return LIBRARY_ENTRIES.filter(
    (entry) =>
      (filters.category === 'all' || entry.category === filters.category) &&
      (!filters.family || entry.family === filters.family) &&
      (!filters.scenario || entry.scenarios.includes(filters.scenario)) &&
      terms.every((term) => entry.search.includes(term)),
  );
}

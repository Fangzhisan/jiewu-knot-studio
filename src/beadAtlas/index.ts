import { COURSES } from '../lessons/catalog';
import { beadFamily } from './families';
import { BEAD_PRODUCTION_REVIEWS } from './productionReviews';

/** 原有针法和部件课保留，但不自动沿用新增成品课的验收。 */
export const LEGACY_BEAD_COURSES: readonly string[] = [
  'flower',
  'cross-weave',
  'ladder-stitch',
  'square-stitch',
  'peyote-even',
  'netting-seven',
  'brick-stitch',
  'spiral-rope',
  'graduated-fringe',
  'flat-herringbone',
  'picot-edge',
  'bracelet-clasp-return',
  'ring-bead-fringe',
];

/** 仅从实际注册课程建立节点，规划名称不进入前台数量。 */
export const BEAD_ATLAS = COURSES.filter((course) => course.category === 'beads').map((course) => ({
  id: course.id,
  title: course.name,
  family: beadFamily(course.id)?.id,
  project: beadFamily(course.id)?.project ?? false,
  review: BEAD_PRODUCTION_REVIEWS[course.id],
}));

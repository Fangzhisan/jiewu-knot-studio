import { WEAVING_CURRICULUM } from './curriculum';
import { WEAVING_PRODUCTION_REVIEWS } from './productionReviews';

/** 原有课程保留地址和播放入口，未完成本轮复核时不计入已验收数量。 */
export const LEGACY_WEAVING_COURSES: readonly string[] = [
  'three-strand-braid',
  'four-strand-flat-braid',
  'plain-weave',
  'twill-weave-2-2',
  'basket-weave-2-2',
  'macrame-square-column',
  'macrame-half-knot-spiral',
  'macrame-alternating-square-net',
  'kumihimo-eight-strand',
  'macrame-diagonal-double-half-hitch',
  'frame-coaster-body',
  'ring-keyfob-braid',
];

/** 目标条目、原有课程和本轮已验收课程分别统计。 */
export const WEAVING_ATLAS = WEAVING_CURRICULUM.map((node) => ({
  ...node,
  review: node.courseId ? WEAVING_PRODUCTION_REVIEWS[node.courseId] : undefined,
}));

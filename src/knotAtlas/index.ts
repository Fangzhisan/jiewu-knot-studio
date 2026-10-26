import { EXISTING_KNOT_MAPPINGS } from './existingMappings';
import { SOURCE_KNOT_NODES } from './sourceNodes';
import { IMPLEMENTED_KNOT_MAPPINGS } from './implementedMappings';
import { KNOT_PRODUCTION_REVIEWS } from './productionReviews';
import type { KnotAtlasNode } from './types';

/** 元数据节点不自动变成课程；可播放课程仍由 lessons/catalog 注册。 */
export const KNOT_ATLAS: readonly KnotAtlasNode[] = SOURCE_KNOT_NODES.map((node) => {
  const implemented = IMPLEMENTED_KNOT_MAPPINGS[node.id];
  const localCourse = implemented ?? EXISTING_KNOT_MAPPINGS[node.id];

  return {
    ...node,
    ...(localCourse ? { localCourse } : {}),
    production: {
      status: implemented
        ? 'implemented-3d'
        : localCourse?.match === 'same-method'
          ? 'existing-3d'
          : 'not-started',
      review: implemented ? 'in-review' : 'not-reviewed',
      ...KNOT_PRODUCTION_REVIEWS[node.id],
    },
  };
});

/** 用来源节点标识检索，缺失时明确返回 undefined。 */
export function getKnotNode(id: string): KnotAtlasNode | undefined {
  return KNOT_ATLAS.find((node) => node.id === id);
}

import type { CategoryId, Course } from './types';
import { getKnotState, KNOT_STEPS } from './knot';
import { getFlowerState, FLOWER_STEPS } from './flower';
import { KNOT_EXTRA_COURSES } from './knots-extra';
import { KNOT_UTILITY_COURSES } from './knots-utility';
import { JOINT_KNOT_COURSES } from './knots-joins';
import { LOOP_DECORATIVE_COURSES } from './knots-loop-decorative';
import { WEAVING_COURSES } from './weaving';
import { NETTING_PRACTICE_COURSE, NETTING_ROW_COURSE } from './weaving-netting';
import { JEWELRY_BRAID_COURSES } from './weaving-jewelry-braids';
import { PATTERN_WEAVING_COURSES } from './weaving-patterns';
import { MACRAME_COURSES } from './macrame';
import { KUMIHIMO_COURSES } from './kumihimo';
import { BEADING_COURSES } from './beading';
import { BEADING_EXTRA_COURSES } from './beading-extra';
import { BEADING_FRINGE_COURSES } from './beading-fringe';
import { HERRINGBONE_COURSES } from './beading-herringbone';
import { DOUBLE_FISHERMAN_COURSES } from './knots-double-fisherman';
import { DIAGONAL_HITCH_COURSES } from './macrame-diagonal-hitch';
import { PICOT_COURSES } from './beading-picot';
import { WEAVING_PROJECT_COURSES } from './weaving-projects';
import { BEADING_PROJECT_COURSES } from './beading-projects';
import { BEAD_WIRE_PROJECT_COURSES } from './beading-wire-projects';
import { BEAD_FRAME_PROJECT_COURSES } from './beading-frame-projects';
import { BEAD_PENDANT_PROJECT_COURSES } from './beading-pendant-projects';
import { BEAD_LOOP_PROJECT_COURSES } from './beading-loop-projects';
import { SCENIC_KNOT_COURSES } from './knots-scenic';
import { REFERENCE_CARE_COURSES } from './knots-reference-care';
import { REFERENCE_HITCH_COURSES } from './knots-reference-hitches';
import { REFERENCE_STOPPER_COURSES } from './knots-reference-stoppers';
import { REFERENCE_BIGHT_COURSES } from './knots-reference-bights';
import { REFERENCE_HEAVING_COURSES } from './knots-reference-heaving';
import { REFERENCE_CLOVE_VARIANT_COURSES } from './knots-reference-clove-variants';
import { MARLINSPIKE_COURSE } from './knots-reference-toggle';
import { SAILORS_COIL_COURSE } from './knots-reference-coils';
import { FIREMANS_COIL_COURSE } from './knots-reference-fireman-coil';
import { PILE_HITCH_COURSE } from './knots-reference-pile';
import { REFERENCE_EYE_HITCH_COURSES } from './knots-reference-eye-hitches';
import { TRIPLE_FISHERMAN_COURSE } from './knots-reference-triple-fisherman';

/** 目录里的三个工艺分类。 */
export const CATEGORIES: { id: CategoryId; name: string; mark: 'knot' | 'weaving' | 'flower' }[] = [
  { id: 'knots', name: '绳结', mark: 'knot' },
  { id: 'weaving', name: '编织', mark: 'weaving' },
  { id: 'beads', name: '珠串', mark: 'flower' },
];
/** 课程顺序也是默认目录顺序。 */
export const COURSES: Course[] = [
  /** 基础单结，最后一步补上收紧检查。 */
  {
    id: 'knot',
    category: 'knots',
    name: '基础单结',
    title: '单结 · 从一个绳圈开始',
    description: '跟着绳端的方向，理解成圈、穿环与收紧的每一步。',
    material: '单根绳线',
    materialNote: '准备一段容易辨认绳端的软绳。',
    duration: 18,
    initialProgress: 0.48,
    steps: KNOT_STEPS.map((step, index) =>
      index === 4
        ? {
            ...step,
            title: '收紧并检查',
            instruction:
              '沿两端方向继续轻拉，让结芯交叉处贴合、绳尾拉直。检查工作端完整穿过绳圈，上下关系保持不变。',
          }
        : step,
    ),
    source: 'https://www.animatedknots.com/overhand-knot',
    sourceName: 'Animated Knots · 单结',
    getState: getKnotState,
  },
  ...KNOT_EXTRA_COURSES,
  ...KNOT_UTILITY_COURSES,
  ...JOINT_KNOT_COURSES,
  ...LOOP_DECORATIVE_COURSES,
  ...DOUBLE_FISHERMAN_COURSES,
  ...SCENIC_KNOT_COURSES,
  ...REFERENCE_HITCH_COURSES,
  ...REFERENCE_CARE_COURSES,
  ...REFERENCE_STOPPER_COURSES,
  ...REFERENCE_BIGHT_COURSES,
  ...REFERENCE_HEAVING_COURSES,
  ...REFERENCE_CLOVE_VARIANT_COURSES,
  MARLINSPIKE_COURSE,
  SAILORS_COIL_COURSE,
  FIREMANS_COIL_COURSE,
  PILE_HITCH_COURSE,
  ...REFERENCE_EYE_HITCH_COURSES,
  TRIPLE_FISHERMAN_COURSE,
  ...WEAVING_COURSES,
  NETTING_PRACTICE_COURSE,
  NETTING_ROW_COURSE,
  ...JEWELRY_BRAID_COURSES,
  ...PATTERN_WEAVING_COURSES,
  ...MACRAME_COURSES,
  ...KUMIHIMO_COURSES,
  ...DIAGONAL_HITCH_COURSES,
  ...WEAVING_PROJECT_COURSES,
  /** 七颗珠组成一个花形单元。 */
  {
    id: 'flower',
    category: 'beads',
    name: '串珠花形',
    title: '串珠花形 · 一朵花的诞生',
    description: '六颗花瓣珠，一颗花心。沿着线的路径，完成一个花形单元。',
    material: '6 颗花瓣珠 + 1 颗花心珠',
    materialNote: '七颗珠采用同一尺寸，配一根细线并预留线尾。',
    duration: 25,
    initialProgress: 0.6,
    steps: FLOWER_STEPS,
    source: 'https://beadaholique.com/products/how-to-bead-weave-a-daisy-chain',
    sourceName: 'Beadaholique · Daisy Chain',
    getState: getFlowerState,
  },
  ...BEADING_COURSES,
  ...BEADING_EXTRA_COURSES,
  ...BEADING_FRINGE_COURSES,
  ...HERRINGBONE_COURSES,
  ...PICOT_COURSES,
  ...BEADING_PROJECT_COURSES,
  ...BEAD_WIRE_PROJECT_COURSES,
  ...BEAD_FRAME_PROJECT_COURSES,
  ...BEAD_PENDANT_PROJECT_COURSES,
  ...BEAD_LOOP_PROJECT_COURSES,
];

/** 查找课程，找不到时回到第一课。 */
export function getCourse(id: string): Course {
  return COURSES.find((course) => course.id === id) ?? COURSES[0]!;
}

import type { CategoryId, Course } from './types'
import { getKnotState, KNOT_STEPS } from './knot'
import { getFlowerState, FLOWER_STEPS } from './flower'
import { KNOT_EXTRA_COURSES } from './knots-extra'
import { KNOT_UTILITY_COURSES } from './knots-utility'
import { JOINT_KNOT_COURSES } from './knots-joins'
import { LOOP_DECORATIVE_COURSES } from './knots-loop-decorative'
import { WEAVING_COURSES } from './weaving'
import { MACRAME_COURSES } from './macrame'
import { KUMIHIMO_COURSES } from './kumihimo'
import { BEADING_COURSES } from './beading'
import { BEADING_EXTRA_COURSES } from './beading-extra'
import { BEADING_FRINGE_COURSES } from './beading-fringe'
import { HERRINGBONE_COURSES } from './beading-herringbone'
import { DOUBLE_FISHERMAN_COURSES } from './knots-double-fisherman'
import { DIAGONAL_HITCH_COURSES } from './macrame-diagonal-hitch'
import { PICOT_COURSES } from './beading-picot'
import { WEAVING_PROJECT_COURSES } from './weaving-projects'
import { BEADING_PROJECT_COURSES } from './beading-projects'
import { SCENIC_KNOT_COURSES } from './knots-scenic'

export const CATEGORIES: { id: CategoryId; name: string; mark: 'knot' | 'weaving' | 'flower' }[] = [
  { id: 'knots', name: '绳结', mark: 'knot' },
  { id: 'weaving', name: '编织', mark: 'weaving' },
  { id: 'beads', name: '珠串', mark: 'flower' },
]
export const COURSES: Course[] = [
  {
    id: 'knot', category: 'knots', name: '基础单结',
    title: '单结 · 从一个绳圈开始', description: '跟着绳端的方向，理解成圈、穿环与收紧的每一步。',
    material: '单根绳线', materialNote: '准备一段容易辨认绳端的软绳。', duration: 18, initialProgress: .48,
    steps: KNOT_STEPS.map((step, index) => index === 4 ? { ...step, title: '收紧并检查', instruction: '沿两端方向继续轻拉，让结芯交叉处贴合、绳尾拉直。检查工作端完整穿过绳圈，上下关系保持不变。' } : step), source: 'https://www.animatedknots.com/overhand-knot', sourceName: 'Animated Knots · 单结', getState: getKnotState,
  },
  ...KNOT_EXTRA_COURSES,
  ...KNOT_UTILITY_COURSES,
  ...JOINT_KNOT_COURSES,
  ...LOOP_DECORATIVE_COURSES,
  ...DOUBLE_FISHERMAN_COURSES,
  ...SCENIC_KNOT_COURSES,
  ...WEAVING_COURSES,
  ...MACRAME_COURSES,
  ...KUMIHIMO_COURSES,
  ...DIAGONAL_HITCH_COURSES,
  ...WEAVING_PROJECT_COURSES,
  {
    id: 'flower', category: 'beads', name: '串珠花形',
    title: '串珠花形 · 一朵花的诞生', description: '六颗花瓣珠，一颗花心。沿着线的路径，完成一个花形单元。',
    material: '6 颗花瓣珠 + 1 颗花心珠', materialNote: '七颗珠采用同一尺寸，配一根细线并预留线尾。', duration: 25, initialProgress: .6,
    steps: FLOWER_STEPS, source: 'https://beadaholique.com/products/how-to-bead-weave-a-daisy-chain', sourceName: 'Beadaholique · Daisy Chain', getState: getFlowerState,
  },
  ...BEADING_COURSES,
  ...BEADING_EXTRA_COURSES,
  ...BEADING_FRINGE_COURSES,
  ...HERRINGBONE_COURSES,
  ...PICOT_COURSES,
  ...BEADING_PROJECT_COURSES,
]
export function getCourse(id: string): Course { return COURSES.find(course => course.id === id) ?? COURSES[0]! }

/** 珠串按针法、整件饰品及部件用途分类，只列真实可播放的课程。 */
export const BEAD_FAMILIES = [
  {
    id: 'bead-techniques',
    name: '基础针法',
    keywords: '基础 珠编 针法 串珠 起底',
    courseIds: [
      'flower',
      'cross-weave',
      'ladder-stitch',
      'square-stitch',
      'peyote-even',
      'netting-seven',
      'brick-stitch',
      'spiral-rope',
      'flat-herringbone',
    ],
    project: false,
  },
  {
    id: 'bead-necklaces',
    name: '项链成品',
    keywords: '项链 颈链 吊坠 整体 成品',
    courseIds: [
      'bead-complete-graduated-necklace',
      'bead-complete-station-necklace',
      'bead-complete-double-necklace',
      'bead-complete-triple-necklace',
      'bead-complete-front-toggle-necklace',
      'bead-complete-column-pendant-necklace',
      'bead-complete-fan-pendant-necklace',
      'bead-complete-wave-pendant-necklace',
      'bead-complete-loop-necklace',
    ],
    project: true,
  },
  {
    id: 'bead-bracelets',
    name: '手链成品',
    keywords: '手链 手串 腕链 绕腕 整体 成品',
    courseIds: [
      'bead-complete-spacer-bracelet',
      'bead-complete-double-bracelet',
      'bead-complete-triple-bracelet',
      'bead-complete-wrap-bracelet',
      'bead-complete-graduated-bracelet',
      'bead-complete-four-loop-bracelet',
      'bead-complete-six-loop-bracelet',
    ],
    project: true,
  },
  {
    id: 'bead-earrings',
    name: '耳饰成品',
    keywords: '耳饰 耳环 耳坠 成对 成品',
    courseIds: [
      'bead-complete-column-earrings',
      'bead-complete-crescent-earrings',
      'bead-complete-spiral-earrings',
      'bead-complete-wave-earrings',
      'bead-complete-fan-earrings',
      'bead-complete-tier-earrings',
    ],
    project: true,
  },
  {
    id: 'bead-ornaments',
    name: '挂饰与摆件',
    keywords: '摆件 摆饰 挂饰 装饰 工艺品',
    courseIds: [
      'bead-complete-spiral-ornament',
      'bead-complete-crescent-ornament',
      'bead-complete-wave-ornament',
      'bead-complete-fan-ornament',
      'bead-complete-step-ornament',
    ],
    project: true,
  },
  {
    id: 'bead-borders',
    name: '花边与流苏',
    keywords: '珠齿 花边 流苏 部件',
    courseIds: ['graduated-fringe', 'picot-edge', 'ring-bead-fringe'],
    project: false,
  },
  {
    id: 'bead-finishing',
    name: '扣件与收尾',
    keywords: '扣件 压管 回穿 收尾',
    courseIds: ['bracelet-clasp-return'],
    project: false,
  },
] as const;

/** 查找珠串课程的类型与成品标识。 */
export function beadFamily(courseId: string) {
  return BEAD_FAMILIES.find((family) => (family.courseIds as readonly string[]).includes(courseId));
}

import type { Course } from './lessons/types';
import { COURSE_KNOT_REFERENCES } from './knotAtlas/courseReferences';

// 筛选与用途说明共用这份场景表。
export const SCENARIOS = [
  { id: 'home', name: '日常生活' },

  { id: 'fixing', name: '绑物固定' },

  { id: 'binding', name: '捆扎收紧' },

  { id: 'storage', name: '整理收纳' },

  { id: 'garden', name: '园艺支撑' },

  { id: 'camping', name: '露营搭建' },

  { id: 'outdoors', name: '户外装备' },

  { id: 'fishing', name: '钓鱼连接' },

  { id: 'mountaineering', name: '登山绳技' },

  { id: 'climbing', name: '攀岩绳技' },

  { id: 'rescue', name: '救援结构' },

  { id: 'table', name: '杯垫桌用' },

  { id: 'accessories', name: '随身挂件' },

  { id: 'jewelry', name: '首饰配件' },

  { id: 'clothing', name: '服装配饰' },

  { id: 'decor', name: '家居装饰' },

  { id: 'gifts', name: '手作礼物' },

  { id: 'repair', name: '修补连接' },
  { id: 'netting', name: '网具制作' },
  { id: 'textile', name: '织物布艺' },
  { id: 'basketry', name: '篮筐编作' },
] as const;

type Application = NonNullable<Course['application']>;
const application = (
  scenarios: string[],
  task: string,
  focus: string,
  boundary?: string,
): Application => ({ scenarios, task, focus, boundary });

// 用途只覆盖动画实际教到的结构。
// 基础结构不等于完成的物件或安全系统。
const FOUNDATIONS: Record<string, Application> = {
  knot: application(['home', 'storage'], '认识抽绳末端的基础止脱结。', '单结结构'),
  'double-overhand': application(
    ['home', 'accessories'],
    '练习绳尾较饱满的止脱结。',
    '双绕止脱结构',
  ),
  'figure-eight': application(
    ['outdoors', 'camping'],
    '认识装备绳端的八字止脱结构。',
    '单股八字结',
    '不是攀岩安全带的回穿系入课。',
  ),
  'slip-knot': application(
    ['home', 'storage'],
    '辨认能够抽回的活套与固定绳圈的区别。',
    '活套结构',
    '不演示约束人或动物，也不用于承重。',
  ),
  'overhand-loop': application(
    ['accessories', 'gifts'],
    '给轻质挂饰准备一个固定绳圈。',
    '绳圈结法',
    '画面演示绳圈本身，不含挂件安装。',
  ),
  'figure-eight-loop': application(
    ['mountaineering', 'climbing', 'rescue'],
    '在练习绳上辨认八字绳圈的双股路径。',
    '绳圈结构认知',
    '仅演示折绳打法；不含回穿安全带、锚点或救援系统。承重操作需专业现场训练。',
  ),
  'square-knot': application(
    ['home', 'binding', 'gifts'],
    '学习轻物捆扎时两个反向半结的结构。',
    '捆扎结法',
    '画面不含绕物过程；平结不可作攀登或救援接绳结。',
  ),
  'clove-hitch': application(
    ['fixing', 'garden', 'camping'],
    '把一根绳绕在圆杆上，观察临时固定的位置。',
    '圆杆固定',
    '只是结构示意，不模拟滑移与承载。',
  ),
  'larks-head': application(
    ['fixing', 'decor', 'accessories'],
    '把装饰绳挂到横杆上，留出成对垂线。',
    '挂绳起头',
  ),
  'sheet-bend': application(
    ['camping', 'repair'],
    '练习两段绳的单编结连接。',
    '接绳结构',
    '不包含帐篷搭建、拉力测试或承重使用。',
  ),
  'fishermans-knot': application(
    ['outdoors', 'repair'],
    '用两侧单结认识绳段接续。',
    '接绳结构',
    '这是接绳结，不是钓线绑钩课。',
  ),
  bowline: application(
    ['camping', 'outdoors'],
    '认识不会随拉尾而缩小的称人结绳圈。',
    '固定圈结构',
    '画面没有围绕人体或锚点；不能作为救援操作依据。',
  ),
  'diamond-lanyard': application(
    ['clothing', 'accessories', 'gifts'],
    '制作绳扣和挂件可用的单绳纽扣结。',
    '装饰结单元',
    '不含衣物缝接或扣眼制作。',
  ),
  'three-strand-braid': application(
    ['accessories', 'clothing'],
    '练习挂绳、发带可用的三股编织段。',
    '辫绳样段',
    '不含安装配件和封尾。',
  ),
  'four-strand-flat-braid': application(
    ['clothing', 'accessories'],
    '练习扁带的一上一下交编。',
    '扁辫样段',
    '不含腰带扣或包带连接。',
  ),
  'plain-weave': application(
    ['table', 'repair'],
    '认识小织物与织补的经纬交错。',
    '平纹样片',
    '不含衣物破洞修补或织物收边。',
  ),
  'twill-weave-2-2': application(['table', 'clothing'], '练习桌面织物可用的斜纹组织。', '斜纹样片'),
  'basket-weave-2-2': application(
    ['storage', 'table'],
    '看懂收纳编物常见的两两分组纹理。',
    '篮纹平面样片',
    '不包含立体篮筐的底、壁和收口。',
  ),
  'macrame-square-column': application(
    ['accessories', 'decor'],
    '练习挂件与壁饰的连续平结。',
    '平结编织段',
  ),
  'macrame-half-knot-spiral': application(
    ['accessories', 'decor'],
    '练习装饰挂绳的螺旋结纹。',
    '螺旋编织段',
  ),
  'macrame-alternating-square-net': application(
    ['storage', 'decor'],
    '认识网袋、挂饰中的交替平结网格。',
    '网格样片',
    '不含袋底、袋口或花盆吊篮的承重结构。',
  ),
  'kumihimo-eight-strand': application(
    ['accessories', 'jewelry', 'gifts'],
    '在组纽盘上练习圆形饰绳。',
    '八股组纽段',
    '不含扣头与两端封口。',
  ),
  flower: application(
    ['jewelry', 'accessories', 'gifts'],
    '制作花形挂饰中的一朵珠花。',
    '七珠花形单元',
    '不含挂环与项链扣头。',
  ),
  'cross-weave': application(
    ['jewelry', 'gifts'],
    '练习手链珠链中的双端交叉连接。',
    '珠链基础单元',
    '不含完整手围与收尾。',
  ),
  'ladder-stitch': application(
    ['jewelry', 'repair'],
    '连接一排相邻珠，为饰品珠片起底。',
    '梯式起底',
  ),
  'square-stitch': application(
    ['jewelry', 'clothing'],
    '把新珠固定在对应底珠上方。',
    '方格珠片',
    '不包含缝到衣物的步骤。',
  ),
  'peyote-even': application(
    ['jewelry', 'gifts'],
    '练习珠织手环的隔珠加珠组织。',
    '佩约特样片',
    '不是完整手环。',
  ),
  'netting-seven': application(['jewelry', 'decor'], '练习珠网挂饰中的交点连接。', '珠网单元'),
  'brick-stitch': application(
    ['jewelry', 'accessories'],
    '练习耳饰珠片的挂线桥加珠。',
    '砖式针样片',
    '不含耳钩安装。',
  ),
  'spiral-rope': application(
    ['jewelry', 'gifts'],
    '围绕芯珠编出珠绳花纹。',
    '螺旋珠绳段',
    '不含完整项链与扣头。',
  ),
  'graduated-fringe': application(
    ['clothing', 'accessories', 'decor'],
    '在既有珠片边缘接出渐长流苏。',
    '珠流苏装饰边',
    '画面只显示珠片边缘，不含服装缝接。',
  ),
  'flat-herringbone': application(['jewelry', 'gifts'], '学习双珠成对的平面鱼骨纹。', '鱼骨针样片'),
  'double-fishermans-knot': application(
    ['mountaineering', 'climbing', 'outdoors'],
    '辨认辅绳接续中的双圈回穿与两芯相抵。',
    '双渔人接绳结构',
    '用两根练习绳演示，不含闭合辅绳圈或承重系统；需专业现场训练。',
  ),
  'macrame-diagonal-double-half-hitch': application(
    ['decor', 'clothing', 'accessories'],
    '为壁饰、包饰编一排斜向装饰边。',
    '斜卷结装饰边',
    '上端已固定，不含完整壁饰与藏尾。',
  ),
  'picot-edge': application(
    ['jewelry', 'clothing', 'gifts'],
    '给已有珠片接出三珠尖齿装饰边。',
    '珠片装饰边',
    '需先有珠片，末尾藏线固定另做。',
  ),
};

// 优先用课程自身说明，旧课程从基础表补齐。
export function getApplication(course: Course): Application {
  return (
    course.application ?? FOUNDATIONS[course.id] ?? application([], course.description, '基础练习')
  );
}

// 场景名称缺失时保留原标识。
export function scenarioName(id: string): string {
  return SCENARIOS.find((scene) => scene.id === id)?.name ?? id;
}

// 合并课程内容作为搜索索引。
export function courseSearchText(course: Course): string {
  const app = getApplication(course);
  // “不用于救援”这类限制不进入搜索索引，避免变成推荐词。

  return [
    course.name,
    course.title,
    course.description,
    course.material,
    course.sourceName,
    ...(COURSE_KNOT_REFERENCES[course.id]?.names ?? []),
    app.task,
    app.focus,
    ...app.scenarios.map(scenarioName),
  ]
    .join(' ')
    .normalize('NFKC')
    .toLocaleLowerCase();
}

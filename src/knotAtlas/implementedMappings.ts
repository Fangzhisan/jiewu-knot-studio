import type { KnotCourseMapping, KnotNodeId } from './types';

/** 独立建模并注册的课程；数值与浏览器检查不等同于实物工艺认证。 */
export const IMPLEMENTED_KNOT_MAPPINGS: Readonly<Partial<Record<KnotNodeId, KnotCourseMapping>>> = {
  消防员收绳结: {
    courseId: 'firemans-coil',
    match: 'same-method',
    note: '盘绳后形成锁圈，将绕后的完整绳弯穿入，收紧双腿并整理末圈连接，保留挂环和抽解尾。',
  },
  渔人结: {
    courseId: 'fishermans-knot',
    match: 'same-method',
    note: '重建两条整绳各打单结套住对方主段，先分别收紧，再沿主段相向拉合。',
  },
  双渔人结: {
    courseId: 'double-fishermans-knot',
    match: 'same-method',
    note: '重建两端各两圈与共同回穿通道，独立收紧后沿主段滑合；保留四个真实端头和两根等长整绳。',
  },
  三重渔人结: {
    courseId: 'reference-triple-fisherman',
    match: 'same-method',
    note: '两端各完成三圈回穿，分别排齐收紧，再拉主段使两个半结相向滑合。',
  },
  锚结: {
    courseId: 'reference-anchor-hitch',
    match: 'same-method',
    note: '绕环后将首个半扣从绕圈下穿出，再同向补半扣，并逐步整理贴紧结芯。',
  },
  桩结: {
    courseId: 'reference-pile-hitch',
    match: 'same-method',
    note: '双股绕柱后，把绳中整弯提过开放柱顶，整理骑跨并拉紧两条绳腿。',
  },
  帆脚结: {
    courseId: 'reference-buntline-hitch',
    match: 'same-method',
    note: '绳端穿环后绕主绳形成内双套，第二圈朝物体方向递进，工作尾从骑跨下引出。',
  },
  水手收绳结: {
    courseId: 'sailors-coil',
    match: 'same-method',
    note: '在圆盘绳上缘依次做左右两个套结，工作尾由中间交搭下方向上引出。',
  },
  '双套结-双环': {
    courseId: 'reference-clove-hitch-two-loop',
    match: 'same-method',
    note: '在绳中形成并叠合两个同向圈，从打开的锁扣门端套入，沿门轴移到底部后关门收紧。',
  },
  绳针结: {
    courseId: 'reference-marlinspike-hitch',
    match: 'same-method',
    note: '绳圈叠在中间主段上，再将插销从外圈前方、中间主段后方穿入。',
  },
  双套滑结: {
    courseId: 'reference-slipped-clove-hitch',
    match: 'same-method',
    note: '绳端绕横杆两圈，在骑跨外折出绳弯，再把整个弯头送到骑跨下收紧。',
  },
  乌利结: {
    courseId: 'capuchin-heaving-stopper',
    match: 'same-method',
    note: '绕双股绳芯形成八圈，工作尾穿过上端绳弯后收紧。',
  },
  抛绳结: {
    courseId: 'heaving-line-stopper',
    match: 'same-method',
    note: 'S 形折返形成三股绳芯，圈列向下包绕后从下端环收尾。',
  },
  三重反手结: {
    courseId: 'triple-overhand-stopper',
    match: 'same-method',
    note: '三次同向穿绕，工作端回穿圈列后逐圈整理。',
  },
  多重反手结: {
    courseId: 'multiple-overhand-stopper',
    match: 'same-method',
    note: '以六圈演示连续绕圈、回穿共同通道与收紧成形。',
  },
  '双套结-绳中': {
    courseId: 'reference-clove-hitch-bight',
    match: 'same-method',
    note: '用绳中依次形成两个同向圈，越过开放柱端后整理压绳。',
  },
  '收缩结-绳中': {
    courseId: 'reference-constrictor-bight',
    match: 'same-method',
    note: '先在绳中翻折两圈并保留骑跨下的回穿段，再越过开放柱端套入。',
  },
  雀头结: {
    courseId: 'reference-lanyard-hitch',
    match: 'same-method',
    note: '中间绳弯绕杆后套过两个自由端，再同时拉紧两腿。',
  },
  半扣结: {
    courseId: 'reference-half-hitch',
    match: 'same-method',
    note: '环眼旁的单个半扣，保留主绳与工作端的穿绕关系。',
  },
  双半结: {
    courseId: 'reference-two-half-hitches',
    match: 'same-method',
    note: '绕过固定环眼，再沿主绳打两个同向半扣；与额外绕环法分开。',
  },
  系木结: {
    courseId: 'reference-timber-hitch',
    match: 'same-method',
    note: '围木、绕主绳、反绕自身三圈，演示木料上的收拢。',
  },
  惯用绳端结: {
    courseId: 'common-whipping',
    match: 'same-method',
    note: '独立细缠绳，预放绳弯、十圈缠绕、穿弯与抽埋。',
  },
  '弗拉芒扁螺旋-结': {
    courseId: 'flemish-flake',
    match: 'same-method',
    note: '单层平面盘绳，中心向外连续螺旋，外尾沿切线离开。',
  },
  西部绳端结: {
    courseId: 'west-country-whipping',
    match: 'same-method',
    note: '同一根细绳的两端前后交替打半结，最后同面反向收尾。',
  },
};

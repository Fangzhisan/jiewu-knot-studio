import type { KnotCourseMapping, KnotNodeId } from './types';

/** 从真实网址取标识，保留连字符等方法后缀，不从显示名称猜测。 */
export function knotIdFromSourceUrl(sourceUrl: string): KnotNodeId {
  const url = new URL(sourceUrl);
  const parts = url.pathname.split('/').filter(Boolean);

  if (url.origin !== 'https://knots3d.com' || parts.length !== 2 || parts[0] !== 'zh-CN') {
    throw new Error(`Unsupported Knots 3D source URL: ${sourceUrl}`);
  }

  return decodeURIComponent(parts[1]!);
}

/** 按结的身份和打法对照；same-method 不代表本次模型已逐帧验收。 */
export const EXISTING_KNOT_MAPPINGS: Readonly<Partial<Record<KnotNodeId, KnotCourseMapping>>> = {
  反手结: {
    courseId: 'knot',
    match: 'same-method',
    note: '本站“基础单结”对应单股 Overhand Knot，工作端完整穿过绳圈。',
  },
  双反手结: {
    courseId: 'double-overhand',
    match: 'same-method',
    note: '本站“双重单结”是 Double Overhand Stopper，对应 ABOK 516；不是固定绳环。',
  },
  八字结: {
    courseId: 'figure-eight',
    match: 'same-method',
    note: '单股八字止索结；不替代八字套结、八字返穿结或八字连接结。',
  },
  双重单结: {
    courseId: 'overhand-loop',
    match: 'same-method',
    note: '来源为 Overhand Loop、ABOK 1046，对应本站“单结绳圈”的折绳打法。',
  },
  八字套结: {
    courseId: 'figure-eight-loop',
    match: 'same-method',
    note: '折弯端参与双股八字，保留一个固定圈；与回穿及双环方法分开。',
  },
  平结: {
    courseId: 'square-knot',
    match: 'same-method',
    note: 'Square / Reef Knot，以两个反向半结形成平结；现有画面不含绕物。',
  },
  '双套结-绳端': {
    courseId: 'clove-hitch',
    match: 'same-method',
    note: '现有课程从绳端连续绕杆，不能同时覆盖来源的绳中或双环打法。',
  },
  牛索结: {
    courseId: 'larks-head',
    match: 'same-method',
    note: '本站名为“雀头结”，实际演示 Cow Hitch 绳端绕杆法；按方法对应牛索结。',
  },
  接绳结: {
    courseId: 'sheet-bend',
    match: 'same-method',
    note: '本站“单编结”对应 Sheet Bend，连接两段绳；不计双重或三重变体。',
  },
  渔人结: {
    courseId: 'fishermans-knot',
    match: 'same-method',
    note: '两条绳分别作单结后相抵；是接绳结构，不是钓钩连接方法。',
  },
  称人结: {
    courseId: 'bowline',
    match: 'same-method',
    note: '基本 Bowline 固定绳圈；不计快速打法及其他锁定、双圈变体。',
  },
  钻石结: {
    courseId: 'diamond-lanyard',
    match: 'same-method',
    note: '本站“单绳纽扣结”对应 Lanyard / Diamond Knot 装饰结单元。',
  },
  双渔人结: {
    courseId: 'double-fishermans-knot',
    match: 'same-method',
    note: '两侧各双绕回穿，再让结芯相抵；现有课程不含闭合辅绳圈制作。',
  },
  环编双重半套钩结: {
    courseId: 'round-turn-two-half-hitches',
    match: 'same-method',
    note: '对应 Round Turn & Two Half Hitches，围杆绕行后在主绳上做两个半结。',
  },
  收缩结: {
    courseId: 'constrictor-binding',
    match: 'same-method',
    note: '本站“束紧结”为 Constrictor 绳端打法；来源另列的绳中打法仍需独立课程。',
  },
  改进的扭抱结: {
    courseId: 'improved-clinch-eye',
    match: 'same-method',
    note: '本站“改良克林奇结”对应 Improved Clinch，演示环眼、五绕与两次回穿。',
  },
  普鲁士抓结: {
    courseId: 'prusik-structure',
    match: 'same-method',
    note: '对应预闭合绳环的对称 Prusik 结构；现有课只作结构认知，不含实际承重操作。',
  },
  滑结: {
    courseId: 'slip-knot',
    match: 'different-method',
    note: '来源 Simple Overhand Noose 用主绳绳弯穿环；本站用短工作端绳弯，拉短端抽解，不计同法覆盖。',
  },
  雀头结: {
    courseId: 'larks-head',
    match: 'different-method',
    note: '来源 Lanyard Hitch 将整段绳穿过折弯；本站演示绳端绕杆。成品相同，打法不同。',
  },
  辫子结: {
    courseId: 'three-strand-braid',
    match: 'different-method',
    note: '来源 Single Rope Braid、ABOK 2950 是单绳并含穿底部绳弯收尾；本站是三根独立绳的 ABOK 2965 辫段。',
  },
};

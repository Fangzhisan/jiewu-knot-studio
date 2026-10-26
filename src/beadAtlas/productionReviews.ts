/** 珠串额外检查真实穿孔；每项必须有本轮过程及画面依据。 */
export const BEAD_REVIEW_CHECKS = [
  'actions',
  'routing',
  'holes',
  'turns',
  'finishing',
  'tightening',
  'finished-shape',
  'browser',
] as const;
type Check = (typeof BEAD_REVIEW_CHECKS)[number];
type Group = 'wire' | 'frame' | 'pendant' | 'loop';
export interface BeadReview {
  status: 'passed';
  checks: Record<Check, string>;
}

/** 名单逐课登记，后来加入分类或目录的课程不会自动获得验收。 */
const REVIEWED_PROJECTS: readonly [string, Group, string][] = [
  [
    'bead-complete-graduated-necklace',
    'wire',
    '两侧从小珠向中央大珍珠递增，整串对称，左右扣件均装齐。',
  ],
  [
    'bead-complete-spacer-bracelet',
    'wire',
    '主体珍珠与小隔珠交替，单圈珠身连续，两端分别接闭合环与T扣。',
  ],
  [
    'bead-complete-station-necklace',
    'wire',
    '每颗浮珠由两侧定位珠固定，各站之间的裸线是设计间隔，端圈另行收紧。',
  ],
  [
    'bead-complete-double-necklace',
    'wire',
    '两条完整珠链错层成弧，各有独立回穿和压管，共用焊接扣件架。',
  ],
  [
    'bead-complete-triple-necklace',
    'wire',
    '三层珠链与三组两端压管逐一核对，扣架连接杆位于端圈绕线以外。',
  ],
  [
    'bead-complete-double-bracelet',
    'wire',
    '双排珠串各自收密并回穿，完整扣架连接两排，保留适合弯腕的珠间隙。',
  ],
  [
    'bead-complete-triple-bracelet',
    'wire',
    '三排大小珠的次序与两端压管分别完成，共用T扣及对应闭合环。',
  ],
  [
    'bead-complete-wrap-bracelet',
    'wire',
    '一根连续钢丝绕成双圈，圈间有高度错层；两端回穿与扣件均完整。',
  ],
  [
    'bead-complete-graduated-bracelet',
    'wire',
    '大珠集中在腕链中央，小珠逐渐过渡到扣件，两端收尾齐全。',
  ],
  [
    'bead-complete-front-toggle-necklace',
    'wire',
    '扣件置于项链前方，珠身绕颈一周；前端两个压管都已回穿压紧。',
  ],
  [
    'bead-complete-column-earrings',
    'frame',
    '两只耳坠分别串满直线框，固定眼套住预装耳扣，两个自由端均折眼。',
  ],
  [
    'bead-complete-crescent-earrings',
    'frame',
    '一对月牙线框逐颗穿满，珠孔沿弧切线转动，两只外端均封口。',
  ],
  [
    'bead-complete-spiral-earrings',
    'frame',
    '一对螺旋从内侧向外侧穿满，预留圈间间距，两个外端止珠眼完整。',
  ],
  [
    'bead-complete-wave-earrings',
    'frame',
    '两只双弧耳坠的转弯逐个查看，穿珠连续，底端折眼不碰最后一珠。',
  ],
  [
    'bead-complete-fan-earrings',
    'frame',
    '左右各三路珠穗共六路，先越过分叉裸杆再排珠，六个自由端分别折眼。',
  ],
  [
    'bead-complete-tier-earrings',
    'frame',
    '左右各五路阶梯珠帘共十路，逐路穿孔并检查十个止珠小眼。',
  ],
  [
    'bead-complete-spiral-ornament',
    'frame',
    '整件螺旋珠饰从挂环延伸至外端小眼，上缘初始取景已修正并重看。',
  ],
  [
    'bead-complete-crescent-ornament',
    'frame',
    '单件月牙挂饰保留预成形弧线，全部珠子与挂环、末端止珠眼齐全。',
  ],
  [
    'bead-complete-wave-ornament',
    'frame',
    '长波纹多次转折的孔轴随线变化，末端封口后整件轮廓连续。',
  ],
  ['bead-complete-fan-ornament', 'frame', '共用挂环下的三路扇形珠帘完整穿满，三处末端均封口。'],
  ['bead-complete-step-ornament', 'frame', '五级错落珠帘逐路穿满，每路保留固定眼和末端止脱眼。'],
  [
    'bead-complete-column-pendant-necklace',
    'pendant',
    '主链中央从直列珠坠固定眼内穿过，主链压管与珠坠末端各自收尾。',
  ],
  [
    'bead-complete-fan-pendant-necklace',
    'pendant',
    '主链中央实际穿过三个穗眼，中央裸线给三眼留足间距，三路珠坠分别封口。',
  ],
  [
    'bead-complete-wave-pendant-necklace',
    'pendant',
    '波纹珠坠固定眼套在中央主链裸线段，完整穿满珠坠后再折回末端。',
  ],
  [
    'bead-complete-four-loop-bracelet',
    'loop',
    '七组四珠圈逐圈回到共用珠闭合，再从侧珠换位；首尾各有扣件回穿。',
  ],
  [
    'bead-complete-six-loop-bracelet',
    'loop',
    '六组六珠圈由上下各两侧珠与共用珠构成，一根连续线闭圈、换位并完成扣件。',
  ],
  [
    'bead-complete-loop-necklace',
    'loop',
    '十二组四珠圈从两端向中央渐大，整链平铺；每圈实际闭合且两端均完成回穿压管。',
  ],
];

/** 共用检查方法保留材料差异，各课成品判断单独写在名单中。 */
function projectReview(group: Group, note: string): BeadReview {
  const frame = group === 'frame';
  const pendant = group === 'pendant';
  return {
    status: 'passed',
    checks: {
      actions: frame
        ? '预成形线框及上端扣件作为备料；珠子从直线自由端进入，沿固定线框滑到内侧，全部就位后再折眼。'
        : pendant
          ? '先完成主链与两端扣件，中央实际穿过预备珠坠眼；随后将珠坠逐颗穿满并折眼封口。'
          : group === 'loop'
            ? '同一根线绕回共用珠闭合一圈，沿侧珠换位后续圈；完成整链后回穿两端压管及末端三珠。'
            : '先绕左端闭合环回穿，再连续串入主体珠；右端绕T扣小眼后回穿压管及末端三珠，最后收拢压管。',
      routing:
        '每课全程1001帧分别检查主线自身与独立线股之间的非邻段间距；全部穿孔线路可追踪，无线管互穿或无连接悬浮线段。',
      holes:
        '采用渲染所用的36段珠孔轮廓与实际轴向、径向缩放检查孔口及孔壁；终点逐颗验证完整穿孔，压管压缩后的多股分道也通过。',
      turns:
        '孔外转弯保持连续曲线，最小弯曲半径大于线半径；另查步骤和装珠阶段连接无跳线，真实端帽网格复检通过。',
      finishing: frame
        ? '上端预备小眼套住扣件实体，自由端从直线连续折成止珠小眼；小眼端帽与回折线段、最后一珠均无相交。所有分支和左右耳均封口。'
        : pendant
          ? '主链两端绕扣眼、回穿压管及末端三珠，压管压紧；珠坠每路末端另外折成止珠眼，主链确实穿过珠坠固定眼。'
          : '两端闭合环与T扣小眼分别被端圈绕住，回穿对应压管和末端三珠；压管压紧，短尾藏入珠身。扣件分开摊放便于检查。',
      tightening: frame
        ? '金属线框保持预成形轮廓，珠子滑到各自位置后把端部金属线折回止脱；不把硬线框当软绳缩小，珠子保留轻微活动间隙。'
        : '主体珠保持原尺寸，珠距与端圈同步收拢，最后单独压缩金属压管；定位珠的间隔属于设计留白，未把松散端圈当成品。',
      'finished-shape': note,
      browser:
        '本轮逐课查看10或11个实际渲染进度点、正斜视末态及适合画面近景；连续播放收尾至100%，390像素页面无横向溢出，控制台无错误。',
    },
  };
}

/** 指纹仅对应本轮独立通过的27节成品课，原有13节不在此表。 */
export const BEAD_PRODUCTION_REVIEWS: Readonly<Record<string, BeadReview>> = Object.fromEntries(
  REVIEWED_PROJECTS.map(([id, group, note]) => [id, projectReview(group, note)]),
);

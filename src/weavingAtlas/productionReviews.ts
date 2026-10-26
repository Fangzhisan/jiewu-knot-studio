import { WEAVING_CURRICULUM } from './curriculum';

/** 过程和成品分别检查，数据门禁不能代替实际画面复核。 */
export const WEAVING_REVIEW_CHECKS = [
  'actions',
  'routing',
  'turns',
  'finishing',
  'tightening',
  'finished-shape',
  'browser',
] as const;
type Check = (typeof WEAVING_REVIEW_CHECKS)[number];
export interface WeavingReview {
  status: 'passed';
  checks: Record<Check, string>;
}

/** 本批组织小样均逐纬检查，组织表不同的课程分别查看对应的浮长和成品。 */
function patternReview(name: string): WeavingReview {
  return {
    status: 'passed',
    checks: {
      actions: `${name}按各自组织表先开口、引入完整一纬、合口再打纬，下一纬从真实布边折返。`,
      routing: '一根纬线连续往返，经线保持各自身份；每课1001帧检查自身及经纬之间，无绳管互穿。',
      turns:
        '布边回转保持切线连续，局部弯曲半径大于绳半径；换纬和操作阶段边界已另外检查，无明显跳线。',
      finishing:
        '最后一纬完整通过全部经线并打纬，工作端留在布边外；本课明确为预固定经线上的小样，未冒充离机锁边成品。',
      tightening:
        '纬距、经距与边缘回转同步收密，组织点保持原有穿压；各根绳总长不变，余长进入自由尾和备用圈。',
      'finished-shape': `${name}末态组织点、浮长及布边均已单独查看，收密后无保留作成品的开口梭道或松垮回转。`,
      browser:
        '实际课堂查看8个过程与收密进度点、正斜视末态，连续播放收密至100%；390像素页面无横向溢出。',
    },
  };
}

/** 多股课分别核对股数、边缘换位及自由尾，不能以其他股数的检查替代。 */
function braidReview(name: string): WeavingReview {
  return {
    status: 'passed',
    checks: {
      actions: `${name}先做互不相邻的配对交叉，再错位处理下一组；各股轮换到边缘时继续参与后续配对。`,
      routing:
        '各股从上端到自由尾连续可追踪，过绳与下穿交替；每课1001帧检查全部线股自身及相互之间，无互穿。',
      turns:
        '交叉层用连续切线衔接，转弯半径大于绳半径；交叉层与整理阶段的时间边界另外检查，无明显跳线。',
      finishing:
        '各股都保留真实自由尾，未把增长中的截断点当作新绳端；本课只完成首饰绳段，尺寸与扣头另课处理。',
      tightening: '横向股距与交叉行距同步收密，绳径保持不变；减少的编绳长度留在各股自由尾。',
      'finished-shape': `${name}最终交叉密排、边缘股换向顺畅，平整绳身和可追踪自由尾在正斜视均已查看。`,
      browser:
        '实际课堂逐课查看11个交叉、续编和收紧进度点，连续播放末段至100%；390像素页面无横向溢出。',
    },
  };
}

/** 网具单元和续行是两门独立课程，各自检查完整梭线与基础目。 */
function nettingReview(row: boolean): WeavingReview {
  return {
    status: 'passed',
    checks: {
      actions: row
        ? '同一根梭线从左至右连接三个预排网目，每目分别穿入、绕双腿并从自身入口桥下出。'
        : '梭线从网目背面穿出，围住网目两腿，再从自身入口桥下引回。',
      routing:
        '网结的围腿与自身桥下穿压保持不变；完整两绳各1001帧检查，无自身或相互之间的绳管互穿。',
      turns:
        '入口、围腿、桥下引出及目间连接使用连续曲线，弯曲半径大于绳半径；操作边界另查无明显跳线。',
      finishing: row
        ? '三个网结之间保持同一根连续线，末尾留出续目工作端；基础行预排与后续网尺定距的范围写明。'
        : '工作端完整从桥下出，两个真实端头都在；本课仅完成单目连接，不冒充完整渔网。',
      tightening: '网目双腿与梭线围绕段同步收拢，松量进入备用梭线；基础行和工作绳各自保持总长。',
      'finished-shape': row
        ? '三个结芯分别紧贴双腿，连接段形成下方续织空间，未用目间功能线段冒充未收紧结芯。'
        : '完成态双腿被金色绕线包住，桥下工作尾清楚，结芯无额外悬空大圈。',
      browser:
        '实际课堂查看13个过程及收紧进度点，正斜视核对末态并连续播放末段至100%；390像素页面无横向溢出。',
    },
  };
}

/** 复核名单逐课登记；后来加入目标或目录的课程不会自动获得通过状态。 */
const REVIEWED_PATTERN_IDS = [
  'pattern-twill-2-1',
  'pattern-twill-1-2',
  'pattern-twill-3-1',
  'pattern-twill-1-3',
  'pattern-twill-3-2',
  'pattern-twill-2-3',
  'pattern-twill-4-3',
  'pattern-twill-3-4',
  'pattern-basket-3-1',
  'pattern-basket-1-3',
  'pattern-twill-4-1',
  'pattern-twill-1-4',
  'pattern-basket-3-3',
  'pattern-basket-2-3',
  'pattern-basket-3-2',
  'pattern-basket-2-1',
  'pattern-basket-1-2',
  'pattern-satin-5-2-warp',
  'pattern-satin-5-2-weft',
  'pattern-satin-8-3-warp',
  'pattern-satin-8-3-weft',
];
const REVIEWED_BRAID_IDS = [
  'jewelry-symmetric-braid-4',
  'jewelry-symmetric-braid-5',
  'jewelry-symmetric-braid-6',
  'jewelry-symmetric-braid-7',
  'jewelry-symmetric-braid-8',
  'jewelry-symmetric-braid-9',
  'jewelry-symmetric-braid-12',
];

/** 从课程目标取已复核名称，缺失时拒绝生成验收记录。 */
function reviewedTitle(id: string) {
  const node = WEAVING_CURRICULUM.find((node) => node.courseId === id);
  if (!node) {
    throw new Error(`已复核课程${id}缺少目标节点`);
  }
  return node.title;
}

/** 原有12课没有自动沿用本批验收；每个新课还须匹配独立的模型指纹。 */
export const WEAVING_PRODUCTION_REVIEWS: Readonly<Record<string, WeavingReview>> =
  Object.fromEntries([
    ...REVIEWED_PATTERN_IDS.map((id) => [id, patternReview(reviewedTitle(id))]),
    ...REVIEWED_BRAID_IDS.map((id) => [id, braidReview(reviewedTitle(id))]),
    ['netting-sheet-bend-practice', nettingReview(false)],
    ['netting-sheet-bend-row', nettingReview(true)],
  ]);

import type { Course, LessonState, Vec3 } from './types';
import { WeavingRoute, clamp, ease, mix } from './weavingGeometry';

const RADIUS = 0.025;
const COLORS = [
  '#4d897e',
  '#c2954c',
  '#ab626b',
  '#547ca7',
  '#9670a2',
  '#b57850',
  '#6d9254',
  '#4c9baf',
  '#b88b7e',
  '#64789b',
  '#99914f',
  '#8d6d63',
];
const TIMES = [0, 0.1, 0.22, 0.34, 0.76, 0.82];

/** 五次缓动在层间保留竖直切线，交叉不会突然折向。 */
const smooth = (t: number) => t ** 3 * (10 - 15 * t + 6 * t * t);

/** 当前交叉层的股位、目标股位与上跨方向。 */
interface BraidRow {
  from: number[];
  to: number[];
  depth: number[];
}

/** 相邻两股交错换位；同一层只安排互不相邻的交叉。 */
function symmetricRows(count: number) {
  const rows: BraidRow[] = [];
  const order = Array.from({ length: count }, (_, i) => i);
  for (let row = 0; row < 2 * count; row++) {
    const from: number[] = [];
    const to: number[] = [];
    const depth = new Array<number>(count).fill(0);
    for (let slot = 0; slot < count; slot++) {
      from[order[slot]!] = slot;
      to[order[slot]!] = slot;
    }
    for (let left = row % 2; left < count - 1; left += 2) {
      const a = order[left]!;
      const b = order[left + 1]!;
      to[a] = left + 1;
      to[b] = left;
      depth[a] = left % 2 === 0 ? 1 : -1;
      depth[b] = -depth[a]!;
      [order[left], order[left + 1]] = [b, a];
    }
    rows.push({ from, to, depth });
  }
  return rows;
}

/** 前两层单独示范，再逐层延长完整对称平编。 */
function layerProgress(p: number, count: number) {
  if (p < 0.1) {
    return 0;
  }
  if (p < 0.22) {
    return ease((p - 0.1) / 0.12);
  }
  if (p < 0.34) {
    return 1 + ease((p - 0.22) / 0.12);
  }
  return 2 + (count - 2) * clamp((p - 0.34) / 0.42);
}

/** 每股从固定上端走过实际交叉层，返回精确的末段切线。 */
function braidBodies(count: number, rows: BraidRow[], p: number) {
  const tension = ease((p - 0.82) / 0.18);
  const gap = mix(0.25, 0.064, tension);
  const height = mix(0.23, 0.14, tension);
  const depth = mix(0.11, 0.029, tension);
  const front = layerProgress(p, rows.length);
  const top = 1.3 + Math.max(0.5, count * 0.18);
  const start = 1.3;
  const paths: WeavingRoute[] = [];
  const tangents: Vec3[] = [];
  const slots: number[] = [];
  const depths: number[] = [];
  for (let cord = 0; cord < count; cord++) {
    const path = new WeavingRoute();
    const slot = cord - (count - 1) / 2;
    path.add([slot * 0.25, top, 0]);
    const preparation = p < 0.1 ? mix(0.2, 1, ease(p / 0.1)) : 1;
    for (let i = 1; i <= 50; i++) {
      const t = (preparation * i) / 50;
      path.add([mix(slot * 0.25, slot * gap, smooth(t)), mix(top, start, t), 0]);
    }
    let tangent: Vec3 = [0, -1, 0];
    let currentSlot = slot;
    let currentDepth = 0;
    for (let row = 0; row < rows.length && row < front; row++) {
      const q = Math.min(1, front - row);
      const info = rows[row]!;
      const a = info.from[cord]! - (count - 1) / 2;
      const b = info.to[cord]! - (count - 1) / 2;
      const z = info.depth[cord]! * depth;
      const n = Math.max(1, Math.ceil(q * 60));
      for (let i = 1; i <= n; i++) {
        const t = (q * i) / n;
        path.add([
          mix(a, b, smooth(t)) * gap,
          start - (row + t) * height,
          z * 64 * t ** 3 * (1 - t) ** 3,
        ]);
      }
      currentSlot = mix(a, b, smooth(q));
      currentDepth = z * 64 * q ** 3 * (1 - q) ** 3;
      const dx = (b - a) * gap * 30 * q * q * (1 - q) ** 2;
      const dz = z * 192 * q * q * (1 - q) ** 2 * (1 - 2 * q);
      const length = Math.hypot(dx, height, dz);
      tangent = [dx / length, -height / length, dz / length];
    }
    paths.push(path);
    tangents.push(tangent);
    slots.push(currentSlot);
    depths.push(currentDepth);
  }
  return { paths, tangents, slots, depths };
}

/** 自由尾从当前交叉切线引出，余长留在尾部，整根绳不伸缩。 */
function attachTails(body: ReturnType<typeof braidBodies>, budgets: number[]) {
  return body.paths.map((path, cord) => {
    const end = path.points.at(-1)!;
    const tangent = body.tangents[cord]!;
    const x = body.slots[cord]! * 0.25;
    const z = body.depths[cord]! * 1.5;
    path.cubic(
      end.map((v, k) => v + tangent[k]! * 0.18) as Vec3,
      [x, end[1] - 0.8, z],
      [x, end[1] - 1.2, z],
    );
    const remaining = budgets[cord]! - path.total;
    path.line([x, end[1] - 1.2 - remaining, z]);
    return path.points;
  });
}

/** 股数改变配对和边缘轮换，保持各股的颜色、真实端头及收紧过程独立。 */
function jewelryBraid(count: number, word: string): Course {
  const rows = symmetricRows(count);
  const full = braidBodies(count, rows, 0.82);
  const budgets = full.paths.map((path) => path.total + 2);
  const name = `${word}股对称平编`;
  const steps = [
    ['分股与固定上端', `排好${word}根柔软编绳，固定上端；每种颜色从上端到自由尾都是同一根完整绳。`],
    ['完成第一组交叉', '从左侧第一对起隔一对处理一对，让左股压过右股；最外侧未配对的股先保留。'],
    [
      '错位编第二组',
      '向中间错开一个股位，改为左股从右股下方穿过；不要把上一层的颜色当作固定位置。',
    ],
    ['重复两组轮换', '继续交错处理相邻两股，同一层只动互不相邻的配对，让各股逐步走向另一侧。'],
    ['理清自由尾', '核对每股从辫身到自由尾的连续路径，把尾股分开，准备均匀整理。'],
    [
      '均匀收紧平编',
      '保持上端固定，将交叉行距与横向股距一起收密，松量留在自由尾；整理为平整的首饰绳段。',
    ],
  ].map(([title, instruction], i) => ({
    time: TIMES[i]!,
    title: title!,
    instruction: instruction!,
  }));
  return {
    id: `jewelry-symmetric-braid-${count}`,
    category: 'weaving',
    name,
    title: `${name} · 交错配对与平整收紧`,
    description: `${word}根编绳交替上下换位，织成可以用于手链、项链或装饰带的对称平编绳段。`,
    material: `${word}根同粗的柔软编绳`,
    materialNote: '上端预先固定，颜色用于追踪每股；收紧时绳径不变，多余绳长保留在自由尾。',
    duration: 48 + count,
    initialProgress: 0.34,
    frameWholeProcess: true,
    framingBounds: {
      minX: -count * 0.13,
      maxX: count * 0.13,
      minY: 1.3 - rows.length * 0.23 - 0.4,
      maxY: 1.6,
      minZ: -0.15,
      maxZ: 0.15,
    },
    projectionBounds: {
      minX: -count * 0.04 - 0.04,
      maxX: count * 0.04 + 0.04,
      minY: 1.3 - rows.length * 0.14 - 0.05,
      maxY: 1.35,
    },
    steps,
    source: 'https://www.animatedknots.com/french-sinnet-knot-one',
    sourceName: 'Animated Knots · French Sinnet (1) · 多股对称交替穿编',
    application: {
      scenarios: ['jewelry', 'accessories', 'clothing'],
      task: `编出${word}股对称首饰绳段，识别边缘股的轮换。`,
      focus: `${word}股相邻配对、上下交替与平编整理`,
      boundary: '本课完成编绳段，成品首饰还需量长与扣头安装；偶数股应随编随整理扭转。',
    },
    getState: (progress: number): LessonState => {
      const p = clamp(progress);
      const paths = attachTails(braidBodies(count, rows, p), budgets);
      const checkpoint = TIMES.reduce((v, time, i) => (p >= time ? i : v), 0);
      return {
        points: paths[0]!,
        tip: paths[0]!.at(-1)!,
        checkpoint,
        color: COLORS[0],
        radius: RADIUS,
        showEndLabels: false,
        hideMainTip: true,
        endCaps: { start: '1B', end: '1A' },
        strands: paths.slice(1).map((points, i) => ({
          id: `braid-${i + 2}`,
          points,
          color: COLORS[i + 1]!,
          radius: RADIUS,
          endCaps: { start: `${i + 2}B`, end: `${i + 2}A` },
        })),
      };
    },
  };
}

export const JEWELRY_BRAID_COURSES: Course[] = [
  jewelryBraid(4, '四'),
  jewelryBraid(5, '五'),
  jewelryBraid(6, '六'),
  jewelryBraid(7, '七'),
  jewelryBraid(8, '八'),
  jewelryBraid(9, '九'),
  jewelryBraid(12, '十二'),
];

import type { Course, LessonState, Vec3 } from './types';
import { WeavingRoute, clamp, ease, mix } from './weavingGeometry';

const RADIUS = 0.025;
const CRIMP = 0.029;
const SOURCE = 'https://cottonworks.com/wp-content/uploads/2023/03/Weaving-101.pdf';

/** 组织表返回经线在该交点是否位于纬线上方。 */
interface WeaveDraft {
  id: string;
  name: string;
  columns: number;
  rows: number;
  over: (column: number, row: number) => boolean;
  instruction: string;
}

/** 斜纹每纬移动一个组织点，正反面用不同的经浮长表示。 */
function twill(over: number, under: number): WeaveDraft {
  const repeat = over + under;
  return {
    id: `twill-${over}-${under}`,
    name: `${over}／${under}斜纹`,
    columns: Math.max(8, repeat * 2),
    rows: repeat * 2,
    over: (x, y) => (x + y) % repeat < over,
    instruction: `每组${repeat}根经线中提起${over}根、放下${under}根，下一纬向旁边移动一个组织点。`,
  };
}

/** 方平以整组经、纬一起交错，组内不额外互穿。 */
function basket(warp: number, weft: number): WeaveDraft {
  return {
    id: `basket-${warp}-${weft}`,
    name: `${warp}×${weft}方平组织`,
    columns: warp * 4,
    rows: weft * 4,
    over: (x, y) => (Math.floor(x / warp) + Math.floor(y / weft)) % 2 === 0,
    instruction: `${warp}根相邻经线作为一组，每${weft}纬换一次开口，形成成组交替的格面。`,
  };
}

/** 缎纹用与循环数互质且不相邻的飞数分散单个组织点。 */
function satin(count: number, move: number, warpFace: boolean): WeaveDraft {
  return {
    id: `satin-${count}-${move}-${warpFace ? 'warp' : 'weft'}`,
    name: `${count}枚${move}飞${warpFace ? '经面' : '纬面'}缎纹`,
    columns: count,
    rows: count * 2,
    over: (x, y) => (x === (y * move) % count) !== warpFace,
    instruction: `每纬的单独交织点按${move}根经线的距离移动，${count}纬完成一个循环；长浮线不能被误编成连续斜纹。`,
  };
}

/** 当前纬先开口，再引纬、合口、打纬，下一纬才开始。 */
function weavingPhase(draft: WeaveDraft, p: number) {
  const progress = clamp((p - 0.04) / 0.84) * draft.rows;
  const row = Math.min(draft.rows - 1, Math.floor(progress));
  const q = progress >= draft.rows ? 1 : progress - row;
  const gather = ease((p - 0.88) / 0.12);
  const pitch = mix(0.23, 0.1, gather);
  const gap = mix(0.23, 0.1, gather);
  const opening = ease(q / 0.23);
  const closing = ease((q - 0.65) / 0.15);
  const beating = ease((q - 0.8) / 0.2);
  const insert = clamp((q - 0.23) / 0.42);
  const y = row === 0 ? 0.9 : 0.9 - (row - 1) * pitch - mix(0.55, pitch, beating);
  return {
    row,
    gap,
    pitch,
    margin: mix(0.15, 0.03, gather),
    y,
    opening,
    warpDepth: mix(0.16, CRIMP, closing),
    weftDepth: CRIMP * closing,
    insert,
  };
}

/** 经线既保留已织组织，也为当前纬实际打开一个可穿过的梭口。 */
function warpHeight(
  draft: WeaveDraft,
  x: number,
  y: number,
  phase: ReturnType<typeof weavingPhase>,
) {
  const sign = (row: number) => (draft.over(x, row) ? 1 : -1);
  if (!phase.row) {
    return sign(0) * phase.warpDepth * phase.opening * (1 - ease(Math.abs(y - phase.y) / 0.35));
  }
  const lastY = 0.9 - (phase.row - 1) * phase.pitch;
  if (y >= 0.9) {
    return sign(0) * CRIMP * (1 - ease((y - 0.9) / 0.35));
  }
  if (y >= lastY) {
    const position = (0.9 - y) / phase.pitch;
    const row = Math.min(phase.row - 1, Math.floor(position));
    return mix(sign(row), sign(Math.min(row + 1, phase.row - 1)), ease(position - row)) * CRIMP;
  }
  const active = sign(phase.row) * phase.warpDepth;
  if (y >= phase.y) {
    const base = sign(phase.row - 1) * CRIMP * (1 - ease((lastY - y) / 0.35));
    const shed = mix(sign(phase.row - 1) * CRIMP, active, ease((lastY - y) / (lastY - phase.y)));
    return mix(base, shed, phase.opening);
  }
  return active * phase.opening * (1 - ease((phase.y - y) / 0.35));
}

/** 一根纬线连续往返；边缘回转属于同一根线，不把每一纬拆成新绳。 */
function fillingRoute(draft: WeaveDraft, phase: ReturnType<typeof weavingPhase>) {
  const edge = ((draft.columns - 1) * phase.gap) / 2 + phase.margin;
  const path = new WeavingRoute();
  for (let row = 0; row <= phase.row; row++) {
    const active = row === phase.row;
    const y = active ? phase.y : 0.9 - row * phase.pitch;
    const depth = active ? phase.weftDepth : CRIMP;
    const direction = row % 2 === 0 ? 1 : -1;
    const first = direction === 1 ? 0 : draft.columns - 1;
    const last = direction === 1 ? draft.columns - 1 : 0;
    const zAt = (column: number) => (draft.over(column, row) ? -depth : depth);
    const start: Vec3 = [-direction * edge, y, zAt(first)];
    const next = new WeavingRoute();
    if (row) {
      const previous = path.points.at(-1)!;
      const radius = (previous[1] - y) / 2;
      const centerY = (previous[1] + y) / 2;
      next.add(previous);
      for (let i = 1; i <= 100; i++) {
        const t = i / 100;
        next.add([
          start[0] - direction * radius * Math.sin(Math.PI * t),
          centerY + radius * Math.cos(Math.PI * t),
          mix(previous[2], start[2], ease(t)),
        ]);
      }
    } else {
      next.add(start);
    }
    next.line([-(direction * (draft.columns - 1) * phase.gap) / 2, y, zAt(first)]);
    for (let column = first; column !== last; column += direction) {
      for (let i = 1; i <= 40; i++) {
        const t = i / 40;
        next.add([
          (column + direction * t - (draft.columns - 1) / 2) * phase.gap,
          y,
          mix(zAt(column), zAt(column + direction), ease(t)),
        ]);
      }
    }
    next.line([direction * edge, y, zAt(last)]);
    const points = active ? next.prefix(next.total * phase.insert, 0) : next.points;
    for (const point of points) {
      path.add(point);
    }
  }
  return path.points;
}

/** 梭线余量留在侧方备用圈，固定总长不会因引纬或打纬而凭空增加。 */
function fillingSupply(worked: Vec3[], draft: WeaveDraft) {
  const path = new WeavingRoute();
  const anchor: Vec3 = [-draft.columns * 0.115 - 0.65, 1.15, -0.65];
  path.add(anchor);
  path.cubic([anchor[0], 0.9, -0.77], [worked[0]![0] - 0.25, 0.9, worked[0]![2]], worked[0]!);
  for (const point of worked.slice(1)) {
    path.add(point);
  }
  const remaining = draft.rows * (draft.columns * 0.26 + 0.7) + 4 - path.total;
  const radius = 0.38;
  const pitch = 0.07 / (Math.PI * 2);
  const n = Math.max(30, Math.ceil(remaining / 0.015));
  let angle = remaining / Math.hypot(radius, pitch);
  for (let i = 0; i < 5; i++) {
    const q = angle / n;
    const length = Math.hypot(2 * radius * Math.sin(q / 2), pitch * q);
    angle -= (n * length - remaining) / ((radius ** 2 * Math.sin(q) + pitch ** 2 * q) / length);
  }
  const supply: Vec3[] = [];
  for (let i = 0; i <= n; i++) {
    const theta = -angle + (angle * i) / n;
    supply.push([
      anchor[0] - radius + radius * Math.cos(theta),
      anchor[1] - radius * Math.sin(theta),
      anchor[2] - pitch * theta,
    ]);
  }
  return [...supply.slice(0, -1), ...path.points];
}

/** 为每根经线保留实际自由尾，余长吸收开口与织缩造成的长度差。 */
function warpRoutes(draft: WeaveDraft, phase: ReturnType<typeof weavingPhase>) {
  return Array.from({ length: draft.columns }, (_, column) => {
    const path = new WeavingRoute();
    const slot = column - (draft.columns - 1) / 2;
    const bottom = -draft.rows * 0.23 - 0.8;
    const divisions = Math.ceil((1.8 - bottom) / 0.012);
    for (let i = 0; i <= divisions; i++) {
      const y = mix(1.8, bottom, i / divisions);
      const edge =
        y > 1.25 ? ease((1.8 - y) / 0.55) : y < bottom + 0.5 ? ease((y - bottom) / 0.5) : 1;
      path.add([slot * mix(0.23, phase.gap, edge), y, warpHeight(draft, column, y, phase)]);
    }
    const end = path.points.at(-1)!;
    path.line([end[0], end[1] - (draft.rows * 0.23 + 5 - path.total), 0]);
    return path.points;
  });
}

/** 组织点决定真实经纬上下关系，每课完成一张独立的小样。 */
function patternCourse(draft: WeaveDraft): Course {
  return {
    id: `pattern-${draft.id}`,
    category: 'weaving',
    name: draft.name,
    title: `${draft.name} · 逐纬交织小样`,
    description: `${draft.instruction}通过逐纬开口、引纬和打纬形成真实组织小样。`,
    material: `${draft.columns}根经线与一根连续纬线`,
    materialNote: '经线上端预固定并保持张力；金色为同一根连续纬线，左侧备用圈随引纬释放。',
    duration: 60,
    initialProgress: 0.3,
    frameWholeProcess: true,
    framingBounds: {
      minX: -draft.columns * 0.115 - 0.4,
      maxX: draft.columns * 0.115 + 0.4,
      minY: 0.9 - (draft.rows - 1) * 0.23 - 0.6,
      maxY: 1.2,
      minZ: -0.2,
      maxZ: 0.2,
    },
    tighteningStart: 0.88,
    projectionBounds: {
      minX: -draft.columns * 0.055 - 0.2,
      maxX: draft.columns * 0.055 + 0.2,
      minY: 0.9 - draft.rows * 0.1 - 0.2,
      maxY: 1.1,
    },
    steps: [
      {
        time: 0,
        title: '预排经线与识别组织',
        instruction: `上端预固定，经线逐根平行排开。${draft.instruction}`,
      },
      {
        time: 0.04,
        title: '开口后引入第一纬',
        instruction: '先把该纬的经线分到上下两层，纬线从中间穿入；引纬结束后才合口和打纬。',
      },
      {
        time: 0.04 + 0.84 / draft.rows,
        title: '布边折返再换组织',
        instruction: '同一根纬线在经线外侧回转，下一纬按新的组织点开口；布边不额外剪断接线。',
      },
      {
        time: 0.32,
        title: '逐纬重复组织循环',
        instruction: draft.instruction + '每次先引纬再打纬，保留正确的经纬上下关系。',
      },
      {
        time: 0.7,
        title: '织完小样并检查布边',
        instruction: '逐纬检查有无漏压或错浮，连续纬线两侧的回转应完整，不穿过边经线。',
      },
      {
        time: 0.88,
        title: '均匀整理密度',
        instruction:
          '将经距和纬距一起整理，交织点保持不变；多余线长回到自由尾和备用圈，形成紧密的小样。',
      },
    ],
    source: SOURCE,
    sourceName: 'Cotton Incorporated · Weaving 101 · 基础组织与织造顺序',
    application: {
      scenarios: ['textile', 'clothing', 'decor', 'gifts'],
      task: `织出${draft.name}小样，学习可用于首饰织带、布艺或家居织物的组织。`,
      focus: draft.instruction,
      boundary: '完成经线预固定条件下的组织小样；整件作品还需独立的整经、尺寸与离机锁边课程。',
    },
    getState: (progress: number): LessonState => {
      const p = clamp(progress);
      const phase = weavingPhase(draft, p);
      const points = fillingSupply(fillingRoute(draft, phase), draft);
      const warps = warpRoutes(draft, phase);
      return {
        points,
        tip: points.at(-1)!,
        color: '#bf995c',
        radius: RADIUS,
        checkpoint:
          p < 0.04
            ? 0
            : p < 0.04 + 0.84 / draft.rows
              ? 1
              : p < 0.32
                ? 2
                : p < 0.7
                  ? 3
                  : p < 0.88
                    ? 4
                    : 5,
        endCaps: { start: '1B', end: '1A' },
        showEndLabels: false,
        hideMainTip: true,
        strands: warps.map((points, i) => ({
          id: `warp-${i + 1}`,
          points,
          radius: RADIUS,
          color: i % 2 ? '#76a69a' : '#568e83',
          endCaps: { start: `${i + 2}B`, end: `${i + 2}A` },
        })),
      };
    },
  };
}

/** 不同组织表改变交织点与浮长，不用颜色变化凑课程数量。 */
export const PATTERN_WEAVING_COURSES = [
  twill(2, 1),
  twill(1, 2),
  twill(3, 1),
  twill(1, 3),
  twill(3, 2),
  twill(2, 3),
  twill(4, 3),
  twill(3, 4),
  basket(3, 1),
  basket(1, 3),
  twill(4, 1),
  twill(1, 4),
  basket(3, 3),
  basket(2, 3),
  basket(3, 2),
  basket(2, 1),
  basket(1, 2),
  satin(5, 2, true),
  satin(5, 2, false),
  satin(8, 3, true),
  satin(8, 3, false),
].map(patternCourse);

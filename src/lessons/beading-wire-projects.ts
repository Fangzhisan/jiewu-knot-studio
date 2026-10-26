import type { Course, LessonBead, LessonState, LessonSupport, Vec3 } from './types';
import { BeadProjectPath, add, clamp, connectorEye, ease, mix } from './beadProjectGeometry';

const THREAD = 0.005;
const TIMES = [0, 0.1, 0.22, 0.42, 0.62, 0.72, 0.78, 0.88, 0.94];
const GOLD = '#b59358';

/** 整件珠串的排珠和结构要求，配色不会单独增加课程。 */
export interface WireDesign {
  id: string;
  name: string;
  kind: 'necklace' | 'bracelet';
  radii: number[];
  instruction: string;
  colors?: string[];
  layers?: number;
  stations?: boolean;
  wrap?: boolean;
  frontClasp?: boolean;
  centerGap?: number;
  bodyFactory?: (g: number) => {
    beads: LessonBead[];
    visits: { bead: LessonBead; direction: number }[];
  };
}

/** 相邻珠按真实半径和细小活动余隙排开，成品不保留教学大间距。 */
function beadLayout(design: WireDesign, g: number, pressed: number): LessonBead[] {
  const span = design.wrap
    ? 4 * Math.PI - 1.25
    : design.frontClasp
      ? 2 * Math.PI - 0.8
      : design.kind === 'necklace'
        ? Math.PI + 0.36
        : 2 * Math.PI - 1.25;
  const radii = design.radii;
  const gap = (i: number) =>
    design.centerGap && i === Math.floor(radii.length / 2) + 1
      ? design.centerGap
      : design.stations && i % 3 === 0
        ? 0.45
        : 0.018;
  const angleSum = (radius: number) =>
    radii
      .slice(1)
      .reduce((sum, r, i) => sum + 2 * Math.asin((r + radii[i]! + gap(i + 1)) / (2 * radius)), 0);
  let low = Math.max(...radii) * 2,
    high = 20;
  for (let i = 0; i < 60; i++) {
    const middle = (low + high) / 2;
    if (angleSum(middle) > span) {
      low = middle;
    } else {
      high = middle;
    }
  }
  const radius = (low + high) / 2;
  let angle = design.frontClasp
    ? (3 * Math.PI) / 2 + 0.4
    : design.kind === 'necklace'
      ? Math.PI - 0.18
      : Math.PI / 2 + 0.625;
  const beads = radii.map((r, i): LessonBead => {
    if (i) {
      angle += 2 * Math.asin((r + radii[i - 1]! + gap(i)) / (2 * radius));
    }
    return {
      id: `body-${i}`,
      position: [
        radius * Math.cos(angle) * mix(1.5, 1, g),
        radius * Math.sin(angle) * mix(1.5, 1, g),
        design.wrap ? 0.55 * (1 - Math.cos((Math.PI * i) / (radii.length - 1))) : 0,
      ],
      axis: [-Math.sin(angle), Math.cos(angle), 0],
      radius: r,
      color: design.colors?.[i % design.colors.length] ?? (r > 0.145 ? '#e1d5cc' : '#a9bac7'),
      active: false,
      label: '',
    };
  });
  if (design.stations) {
    for (let i = 0; i < beads.length; i++) {
      if (i % 3 === 1) {
        continue;
      }
      const pearl = beads[i % 3 === 0 ? i + 1 : i - 1]!,
        stop = beads[i]!;
      const final = add(
        pearl.position,
        pearl.axis,
        (i % 3 === 0 ? -1 : 1) * (pearl.radius + 0.055),
      );
      stop.position = stop.position.map((v, k) => mix(v, final[k]!, pressed)) as Vec3;
      stop.axis = pearl.axis;
      stop.axialScale = 0.55;
      stop.radialScale = mix(1, 0.3, pressed);
      stop.color = GOLD;
    }
  }
  return beads;
}

/** 一端用闭合环，另一端用带焊接小眼的T扣；线实际绕住各自的金属管。 */
function endHardware(bead: LessonBead, side: number, pressed: number, toggle: boolean) {
  const outward = add([0, 0, 0], bead.axis, side);
  const contact = add(bead.position, outward, bead.radius + 0.25);
  const r = toggle ? 0.065 : 0.14;
  const center = add(contact, outward, r);
  const crimp: LessonBead = {
    id: side < 0 ? 'left-crimp' : 'right-crimp',
    position: add(bead.position, outward, bead.radius + 0.08),
    axis: bead.axis,
    radius: 0.08,
    axialScale: 0.55,
    radialScale: mix(1, 0.3, pressed),
    color: GOLD,
    active: false,
    label: '',
  };
  const ring: LessonSupport = {
    id: side < 0 ? 'catch-ring' : 'toggle-eye',
    kind: 'ring',
    position: center,
    axis: [0, 0, 1],
    radius: r,
    length: 0.026,
    color: GOLD,
  };
  const supports = [ring];
  if (toggle) {
    supports.push({
      id: 'toggle-bar',
      kind: 'cylinder',
      position: add(center, outward, r + 0.008),
      axis: [-outward[1], outward[0], 0],
      radius: 0.014,
      length: 0.38,
      color: GOLD,
    });
  }
  return { outward, contact, crimp, supports };
}

/** 两端分别绕扣眼并回穿，留三颗藏尾珠，压管前保持可整理的线圈。 */
function wireModel(design: WireDesign, g: number, pressed: number) {
  const plan = design.bodyFactory?.(g);
  const body = plan?.beads ?? beadLayout(design, g, pressed);
  const visits = plan?.visits ?? body.map((bead) => ({ bead, direction: 1 }));
  const first = visits[0]!,
    last = visits.at(-1)!;
  const firstBead = plan
    ? {
        ...first.bead,
        position: add(first.bead.position, [-mix(0.3, 0.16, g), 0, 0]),
        axis: [1, 0, 0] as Vec3,
      }
    : { ...first.bead, axis: add([0, 0, 0], first.bead.axis, first.direction) };
  const lastBead = plan
    ? {
        ...last.bead,
        position: add(last.bead.position, [mix(0.3, 0.16, g), 0, 0]),
        axis: [1, 0, 0] as Vec3,
      }
    : { ...last.bead, axis: add([0, 0, 0], last.bead.axis, last.direction) };
  const left = endHardware(firstBead, -1, pressed, false);
  const right = endHardware(lastBead, 1, pressed, true);
  const path = new BeadProjectPath();
  const head = visits.slice(0, 3).reverse(),
    tail = visits.slice(-3).reverse();
  const totals = new Map<string, number>(),
    counts = new Map<string, number>();
  for (const visit of [...head, ...visits, ...tail]) {
    totals.set(visit.bead.id, (totals.get(visit.bead.id) ?? 0) + 1);
  }
  const visitBody = (visit: { bead: LessonBead; direction: number }, reverse = false) => {
    const count = counts.get(visit.bead.id) ?? 0;
    const lane = plan
      ? (count - (totals.get(visit.bead.id)! - 1) / 2) * 0.014
      : reverse
        ? -0.009
        : 0.009;
    counts.set(visit.bead.id, count + 1);
    path.visit(visit.bead, visit.direction * (reverse ? -1 : 1), lane);
  };
  for (const visit of head) {
    visitBody(visit, true);
  }
  path.mark();
  path.visit(left.crimp, -1, -0.009);
  connectorEye(path, left.contact, left.outward, mix(0.1, 0.023, g));
  path.visit(left.crimp, 1, 0.009);
  path.mark();
  for (let i = 0; i < visits.length; i++) {
    visitBody(visits[i]!);
    if (i === Math.floor(visits.length / 2)) {
      path.mark();
    }
  }
  path.mark();
  const rightLane = plan ? -0.009 : 0.009;
  path.visit(right.crimp, 1, rightLane);
  connectorEye(path, right.contact, right.outward, mix(0.1, 0.023, g), plan ? -1 : 1);
  path.visit(right.crimp, -1, -rightLane);
  path.mark();
  for (const visit of tail) {
    visitBody(visit, true);
  }
  path.mark();
  return {
    path,
    beads: [...body, left.crimp, right.crimp],
    supports: [...left.supports, ...right.supports],
  };
}

/** 成品按穿珠、回穿、收拢和压管固定的顺序完成。 */
function singleWireProject(design: WireDesign): Course {
  const initial = wireModel(design, 0, 0);
  const positions = initial.beads.map((b) => b.position);
  const bounds = {
    minX: Math.min(...positions.map((p) => p[0])) - 0.65,
    maxX: Math.max(...positions.map((p) => p[0])) + 0.65,
    minY: Math.min(...positions.map((p) => p[1])) - 0.3,
    maxY: Math.max(...positions.map((p) => p[1])) + 0.8,
  };
  return {
    id: design.id,
    category: 'beads',
    name: design.name,
    title: `${design.name} · 从排珠到压管收尾`,
    description: `${design.instruction}完成整件珠身、两端回穿、T扣与闭合环的安装。`,
    material: `${design.radii.length}颗主体珠、柔性串珠钢丝、2颗压管、T扣套件`,
    materialNote:
      '使用预裁柔性串珠钢丝；两股在孔内并排。动画逐段呈现已穿入的线段，画面外余线不显示；实作先按佩戴尺寸量长。',
    duration: 60,
    initialProgress: 0.42,
    frameWholeProcess: true,
    tighteningStart: 0.78,
    framingBounds: { ...bounds, minZ: -0.2, maxZ: 0.2 },
    steps: [
      ['核对排珠和回穿余量', design.instruction + '先预留三颗珠的回穿长度，珠子暂由教学支架托住。'],
      [
        '绕闭合环并回穿左压管',
        '钢丝穿压管、绕住闭合环的金属边，再从压管另一条通道穿回；暂不压紧。',
      ],
      [
        design.bodyFactory ? '绕回共用珠形成珠圈' : '串起前半段珠身',
        design.bodyFactory
          ? design.instruction + '新珠串成闭合圈后，回到共用珠，再换位续编。'
          : '沿每颗珠的真实孔轴穿入，回穿短尾与主线在孔内分开。',
      ],
      ['完成整件珠身', '按对称顺序串完后半段，检查中心珠位置和两侧排珠。'],
      [
        '绕T扣小眼并回穿压管',
        '穿过右压管，绕T扣的焊接小眼，再从压管返回；不要把线只搭在金属表面。',
      ],
      ['回穿末端三颗珠', '工作端沿相邻珠孔返回，留出短尾，随后才调节松紧。'],
      ['均匀收拢珠身和端圈', '缩小端圈、整理珠间松量，同时保留珠身弯曲活动所需的细小余量。'],
      ['压紧两端压管', '同时核对两股钢丝并排，压管径向收拢固定；普通珠子大小不变。'],
      [
        '检查两端短尾和成品',
        '两端均压紧并回穿三珠，检查短尾和扣件。成品以扣件分开的摊放状态展示，可检查两端是否装齐。',
      ],
    ].map(([title, instruction], i) => ({
      time: TIMES[i]!,
      title: title!,
      instruction: instruction!,
    })),
    source: 'https://beadaholique.com/products/how-to-use-crimp-beads-and-tubes',
    sourceName: 'Beadaholique · 串珠钢丝回穿与压管收尾',
    application: {
      scenarios: ['jewelry', 'gifts'],
      task: `从排珠到扣件收尾完成一件${design.name}。`,
      focus: design.instruction,
      boundary:
        '使用柔性串珠钢丝和匹配压管，成品扣件在摊放展示时保持分开；尺寸需按实际材料和佩戴者调整。',
    },
    getState: (progress: number): LessonState => {
      const p = clamp(progress),
        g = ease((p - 0.78) / 0.1),
        press = ease((p - 0.88) / 0.06);
      const model = wireModel(design, g, press);
      const checkpoint = TIMES.reduce((n, t, i) => (p >= t ? i : n), 0);
      const cuts = [model.path.passages[0]!.to, ...model.path.marks];
      const amount =
        p >= 0.78
          ? model.path.length
          : mix(
              cuts[checkpoint]!,
              cuts[checkpoint + 1]!,
              ease((p - TIMES[checkpoint]!) / (TIMES[checkpoint + 1]! - TIMES[checkpoint]!)),
            );
      const worked = model.path.prefix(amount);
      const points = worked;
      const active =
        p < 0.78
          ? model.path.passages.find((v) => amount >= v.from && amount <= v.to)?.beadId
          : undefined;
      return {
        points,
        tip: points.at(-1)!,
        checkpoint,
        color: '#8d7665',
        radius: THREAD,
        showEndLabels: false,
        hideMainTip: true,
        endCaps: { start: '1B', end: '1A' },
        beads: model.beads.map((b) => ({
          ...b,
          active:
            press > 0 && press < 1
              ? b.id.endsWith('crimp') || b.radialScale !== undefined
              : b.id === active,
        })),
        supports: model.supports,
      };
    },
  };
}

/** 多排各有独立的两端回穿，连接片把各排扣眼合到同一副T扣。 */
export function wireProject(design: WireDesign): Course {
  const base = singleWireProject(design);
  const layers = design.layers ?? 1;
  if (layers === 1) {
    return base;
  }
  const bounds = base.framingBounds!;
  return {
    ...base,
    material: `${design.radii.length * layers}颗主体珠、${layers}根柔性串珠钢丝、${layers * 2}颗压管、多孔连接片及T扣`,
    materialNote:
      '连接片预制为相连的闭合金属眼；每排各自绕眼、回穿、整理和压管，最后共用同一副扣件。动画分段显示已穿入的线段。',
    framingBounds: {
      ...bounds,
      minY: bounds.minY - (layers - 1) * 0.4,
      maxZ: (layers - 1) * 0.5 + 0.2,
    },
    getState: (p: number): LessonState => {
      const state = base.getState(p);
      const all = Array.from({ length: layers }, (_, i) => {
        const offset: Vec3 = [0, -0.4 * i, 0.5 * i];
        return {
          points: state.points.map((v) => add(v, offset)),
          beads: state.beads!.map((b) => ({
            ...b,
            id: `layer-${i}-${b.id}`,
            position: add(b.position, offset),
          })),
          supports: state
            .supports!.filter((s) => i === 0 || s.id !== 'toggle-bar')
            .map((s) => ({ ...s, id: `layer-${i}-${s.id}`, position: add(s.position, offset) })),
        };
      });
      const supports = all.flatMap((s) => s.supports);
      for (let i = 1; i < layers; i++) {
        for (const id of ['catch-ring', 'toggle-eye']) {
          const a = all[i - 1]!.supports.find((s) => s.id.endsWith(id))!;
          const b = all[i]!.supports.find((s) => s.id.endsWith(id))!;
          const crimpA = all[i - 1]!.beads.find((b) =>
            b.id.endsWith(id === 'catch-ring' ? 'left-crimp' : 'right-crimp'),
          )!;
          const crimpB = all[i]!.beads.find((b) =>
            b.id.endsWith(id === 'catch-ring' ? 'left-crimp' : 'right-crimp'),
          )!;
          const outA = add(a.position, crimpA.position, -1),
            outB = add(b.position, crimpB.position, -1);
          const unitA = outA.map((v) => v / Math.hypot(...outA)) as Vec3,
            unitB = outB.map((v) => v / Math.hypot(...outB)) as Vec3;
          const first = add(a.position, unitA, a.radius + 0.12),
            last = add(b.position, unitB, b.radius + 0.12);
          const bar = (key: string, from: Vec3, to: Vec3) => {
            const axis = add(to, from, -1),
              length = Math.hypot(...axis);
            supports.push({
              id: key,
              kind: 'cylinder',
              position: from.map((v, k) => (v + to[k]!) / 2) as Vec3,
              axis: axis.map((v) => v / length) as Vec3,
              radius: 0.012,
              length,
              color: GOLD,
            });
          };
          if (i === 1) {
            bar(`stem-${id}-0`, add(a.position, unitA, a.radius), first);
          }
          bar(`stem-${id}-${i}`, add(b.position, unitB, b.radius), last);
          bar(`connector-${id}-${i}`, first, last);
        }
      }
      return {
        ...state,
        beads: all.flatMap((s) => s.beads),
        supports,
        strands: all.slice(1).map((s, i) => ({
          id: `layer-${i + 2}`,
          points: s.points,
          radius: THREAD,
          color: '#8d7665',
          endCaps: { start: `${i + 2}B`, end: `${i + 2}A` },
        })),
      };
    },
  };
}

export const BEAD_WIRE_PROJECT_COURSES: Course[] = [
  wireProject({
    id: 'bead-complete-graduated-necklace',
    name: '渐变珍珠整串项链',
    kind: 'necklace',
    radii: Array.from({ length: 25 }, (_, i) => 0.11 + 0.08 * Math.sin((Math.PI * i) / 24) ** 2),
    instruction: '中间大、两侧小，按尺寸渐变对称排出整条项链。',
  }),
  wireProject({
    id: 'bead-complete-spacer-bracelet',
    name: '隔珠整串手链',
    kind: 'bracelet',
    radii: Array.from({ length: 24 }, (_, i) => (i % 3 === 1 ? 0.18 : 0.1)),
    instruction: '以一颗主珠配两颗小隔珠的完整节奏串成一圈手链。',
  }),

  wireProject({
    id: 'bead-complete-station-necklace',
    name: '浮珠定位项链',
    kind: 'necklace',
    stations: true,
    radii: Array.from({ length: 27 }, (_, i) => (i % 3 === 1 ? 0.17 : 0.08)),
    instruction: '每颗主珠由两颗定位压管夹住，逐站排布并固定，保留设计中的露线间距。',
  }),
  wireProject({
    id: 'bead-complete-double-necklace',
    name: '双层弧线项链',
    kind: 'necklace',
    layers: 2,
    radii: new Array(25).fill(0.11),
    instruction: '两根独立珠线各自回穿和压管，通过双孔连接片汇到同一副扣件。',
  }),
  wireProject({
    id: 'bead-complete-triple-necklace',
    name: '三层珠串项链',
    kind: 'necklace',
    layers: 3,
    radii: new Array(23).fill(0.1),
    instruction: '三排珠身逐排检查，两侧连接片把六个线端分别固定到共用扣件。',
  }),
  wireProject({
    id: 'bead-complete-double-bracelet',
    name: '双排隔珠手链',
    kind: 'bracelet',
    layers: 2,
    radii: Array.from({ length: 24 }, (_, i) => (i % 3 === 1 ? 0.17 : 0.1)),
    instruction: '双排珠身采用主珠与隔珠组合，每排独立回穿，连接到一副多孔扣件。',
  }),
  wireProject({
    id: 'bead-complete-triple-bracelet',
    name: '三排渐变手链',
    kind: 'bracelet',
    layers: 3,
    radii: Array.from({ length: 25 }, (_, i) => 0.1 + 0.065 * Math.sin((Math.PI * i) / 24) ** 2),
    instruction: '三排渐变珠身组成宽幅手链，两侧逐排锁紧压管，保持各排独立活动。',
  }),
  wireProject({
    id: 'bead-complete-wrap-bracelet',
    name: '双圈绕腕珠链',
    kind: 'bracelet',
    wrap: true,
    radii: new Array(49).fill(0.1),
    instruction: '一根连续珠线绕腕两周，两圈在空间中错开，最后只安装一副扣件。',
  }),
  wireProject({
    id: 'bead-complete-graduated-bracelet',
    name: '渐变珍珠手链',
    kind: 'bracelet',
    radii: Array.from({ length: 23 }, (_, i) => 0.1 + 0.08 * Math.sin((Math.PI * i) / 22) ** 2),
    instruction: '让中心主珠向两端逐步减小，按一圈腕围组织完整珠身和两端扣件。',
  }),
  wireProject({
    id: 'bead-complete-front-toggle-necklace',
    name: '前置T扣项链',
    kind: 'necklace',
    frontClasp: true,
    radii: new Array(39).fill(0.12),
    instruction: '把T扣作为佩戴前方的装饰扣件，珠身从两端向后绕成完整长链。',
  }),
];

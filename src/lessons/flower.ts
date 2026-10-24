/**
 * Original, seekable six-petal daisy-chain teaching geometry.
 * Method reference and limits are documented in ./sources.md.
 *
 * The petals are laid out before threading, like a teaching jig. They only
 * move during the final gathering action; every thread passage is generated
 * from the SAME bead position and bore axis used by the renderer.
 * Render this polyline directly: a global spline can cut across a bead wall.
 * Suggested thread radius <= 0.025 and bead bore radius >= 0.10 scene units.
 */

export type FlowerPoint = [number, number, number];

export interface FlowerBead {
  id: string;
  position: FlowerPoint;
  axis: FlowerPoint;
  radius: number;
  color: string;
  active: boolean;
}

export interface FlowerState {
  points: FlowerPoint[];
  tip: FlowerPoint;
  checkpoint: number;
  beads: FlowerBead[];
}

export const FLOWER_STEPS = [
  {
    time: 0,
    title: '串起六颗花瓣',
    instruction: '按 1 → 6 的顺序穿过六颗花瓣珠的珠孔。珠子预先分开放置，便于看清线的路线。',
  },
  {
    time: 0.5,
    title: '回穿第一颗',
    instruction: '从第 6 颗珠出来后，回到第 1 颗珠，沿第一次的方向再穿一次，闭合花瓣圈。',
  },
  {
    time: 0.64,
    title: '穿入中心珠',
    instruction: '把线从金色中心珠朝前的孔口穿入、从背面穿出，让中心珠留在花瓣圈内。',
  },
  {
    time: 0.76,
    title: '穿过对侧花瓣',
    instruction: '从第 1 颗起数到对侧第 4 颗，沿高亮线路穿过它的珠孔，把中心珠固定在两侧之间。',
  },
  {
    time: 0.88,
    title: '整理并收拢',
    instruction: '沿线尾轻拉，把六颗花瓣珠整理到中心珠周围，收成彼此贴合的七珠小花。',
  },
] as const;

const PETAL_RADIUS = 0.4;
const CENTER_RADIUS = 0.4;
const LOOSE_RADIUS = 1.45;
const GATHERED_RADIUS = 0.801;
// Small allowance beyond the real hole mouth, rather than beyond the
// uncut sphere's pole. Long straight extensions steal the space needed
// for the outer connector to round off when the six petals gather.
const BORE_LIP_CLEARANCE = 0.012;
const PASS_LANE = 0.035;
const TAIL: FlowerPoint = [-2.55, -2.18, -PASS_LANE];
const START: FlowerPoint = [-1.72, -2.02, -PASS_LANE];

const copy = (p: FlowerPoint): FlowerPoint => [p[0], p[1], p[2]];
const add = (a: FlowerPoint, b: FlowerPoint, scale = 1): FlowerPoint => [
  a[0] + b[0] * scale,
  a[1] + b[1] * scale,
  a[2] + b[2] * scale,
];
const lerp = (a: FlowerPoint, b: FlowerPoint, t: number): FlowerPoint => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const distance = (a: FlowerPoint, b: FlowerPoint) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const clamp = (n: number) => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));
const smooth = (t: number) => t * t * (3 - 2 * t);

function makeBeads(progress: number): FlowerBead[] {
  const gather = smooth(clamp((progress - 0.88) / 0.12));
  const ringRadius = LOOSE_RADIUS + (GATHERED_RADIUS - LOOSE_RADIUS) * gather;
  const petals: FlowerBead[] = Array.from({ length: 6 }, (_, i) => {
    const angle = -Math.PI / 2 + (i * Math.PI) / 3;
    // Let all six bores follow the perimeter naturally. Radial bores at
    // P1/P4 would force the outer thread into a tight hairpin. The center
    // bridge instead approaches these same real bores with eased curves.
    const axis: FlowerPoint = [-Math.sin(angle), Math.cos(angle), 0];
    return {
      id: `petal-${i + 1}`,
      position: [Math.cos(angle) * ringRadius, Math.sin(angle) * ringRadius, 0],
      axis,
      radius: PETAL_RADIUS,
      color: '#ede3ff',
      active: false,
    };
  });
  return [...petals, {
    id: 'center', position: [0, 0, 0], axis: [0, 0, -1],
    radius: CENTER_RADIUS, color: '#edb85b', active: false,
  }];
}

function boreEnds(bead: FlowerBead, lane: number): [FlowerPoint, FlowerPoint] {
  const center = add(bead.position, [0, 0, 1], lane);
  const length = boreHalfLength(bead);
  return [add(center, bead.axis, -length), add(center, bead.axis, length)];
}

function boreHalfLength(bead: FlowerBead): number {
  // Match scene.ts's perforated-sphere profile. Its hole radius is 0.12
  // for the current beads, so the actual mouth is before the sphere pole.
  const holeRadius = Math.max(0.055, Math.min(0.12, bead.radius * 0.36));
  return Math.sqrt(bead.radius * bead.radius - holeRadius * holeRadius) + BORE_LIP_CLEARANCE;
}

/**
 * Quintic Bezier with two collinear controls at either end. Its second
 * derivative is zero at each endpoint, so curvature eases to zero where
 * the connector meets a straight bore. This changes the curve itself,
 * rather than merely adding vertices to the old tight cubic bends.
 */
function easedConnector(
  a: FlowerPoint, d: FlowerPoint, startAxis: FlowerPoint, endAxis: FlowerPoint,
  startHandle: number, endHandle: number, t: number,
): FlowerPoint {
  const u = 1 - t;
  const controls = [
    a, add(a, startAxis, startHandle), add(a, startAxis, startHandle * 2),
    add(d, endAxis, -endHandle * 2), add(d, endAxis, -endHandle), d,
  ];
  const weights = [u ** 5, 5 * u ** 4 * t, 10 * u ** 3 * t ** 2,
    10 * u ** 2 * t ** 3, 5 * u * t ** 4, t ** 5];
  return [0, 1, 2].map((i) =>
    controls.reduce((value, control, index) => value + control[i] * weights[index], 0),
  ) as FlowerPoint;
}

function appendLine(path: FlowerPoint[], end: FlowerPoint): void {
  const start = path[path.length - 1];
  const count = Math.max(1, Math.ceil(distance(start, end) / 0.016));
  for (let i = 1; i <= count; i++) path.push(lerp(start, end, i / count));
}

/** Travel above/below the touching beads, with rounded turns into each bore. */
function surfaceBridge(path: FlowerPoint[], destination: FlowerPoint, side: number): void {
  const start = path[path.length - 1];
  const radius = 0.06, height = 0.43;
  const span = Math.hypot(destination[0] - start[0], destination[1] - start[1]);
  const heading: FlowerPoint = [(destination[0] - start[0]) / span, (destination[1] - start[1]) / span, 0];
  appendLine(path, [start[0], start[1], side * height]);
  for (let i = 1; i <= 20; i++) {
    const angle = Math.PI * 0.5 * i / 20;
    path.push([start[0] + heading[0] * radius * (1 - Math.cos(angle)), start[1] + heading[1] * radius * (1 - Math.cos(angle)), side * (height + radius * Math.sin(angle))]);
  }
  appendLine(path, [destination[0] - heading[0] * radius, destination[1] - heading[1] * radius, side * (height + radius)]);
  for (let i = 1; i <= 20; i++) {
    const angle = Math.PI * 0.5 * i / 20;
    path.push([destination[0] - heading[0] * radius * (1 - Math.sin(angle)), destination[1] - heading[1] * radius * (1 - Math.sin(angle)), side * (height + radius * Math.cos(angle))]);
  }
}

function centerConnector(path: FlowerPoint[], entry: FlowerPoint, visit: number): void {
  const start = path[path.length - 1], radius = 0.06;
  if (visit === 7) {
    // Leave P1 along its actual tangent, then lift before passing P2.
    for (let i = 1; i <= 20; i++) {
      const angle = Math.PI * 0.5 * i / 20;
      path.push([start[0] + radius * Math.sin(angle), start[1], start[2] + radius * (1 - Math.cos(angle))]);
    }
    surfaceBridge(path, entry, 1);
    appendLine(path, entry);
  } else {
    const outside: FlowerPoint = [entry[0] + radius, entry[1], entry[2] - radius];
    surfaceBridge(path, outside, -1);
    appendLine(path, outside);
    for (let i = 1; i <= 20; i++) {
      const angle = Math.PI * 0.5 * i / 20;
      path.push([entry[0] + radius * Math.cos(angle), entry[1], entry[2] - radius * (1 - Math.sin(angle))]);
    }
  }
}

/** Each item ends AFTER passing through a bore, never on its front surface. */
function makePasses(beads: FlowerBead[]): FlowerPoint[][] {
  const order = [0, 1, 2, 3, 4, 5, 0, 6, 3];
  const passes: FlowerPoint[][] = [];
  let previous = copy(START);
  const leadLength = distance(TAIL, START);
  let previousAxis: FlowerPoint = START.map((value, i) => (value - TAIL[i]) / leadLength) as FlowerPoint;

  for (let visit = 0; visit < order.length; visit += 1) {
    const beadIndex = order[visit];
    const bead = beads[beadIndex];
    const lane = visit < 6 ? -PASS_LANE : beadIndex === 6 ? 0 : PASS_LANE;
    const [entry, exit] = boreEnds(bead, lane);
    const pass: FlowerPoint[] = [copy(previous)];

    const span = distance(previous, entry);
    // Scale handles with the gap. Constant long handles create a loop in
    // short gaps; short fixed handles concentrate a turn at the bore lip.
    const handle = Math.min(0.28, span * 0.24);
    if (visit === 7 || visit === 8) {
      centerConnector(pass, entry, visit);
    } else {
      for (let sample = 1; sample <= 24; sample += 1) {
        pass.push(easedConnector(previous, entry, previousAxis, bead.axis, handle, handle, sample / 24));
      }
    }

    // Dense collinear samples preserve the physical bore passage even if
    // the consumer uses fixed-size buffers. The center is explicitly present.
    for (let sample = 1; sample <= 12; sample += 1) {
      pass.push(lerp(entry, exit, sample / 12));
    }
    passes.push(pass);
    previous = exit;
    previousAxis = bead.axis;
  }
  return passes;
}

// Threading only reveals prefixes; the loose bead layout does not move.
// Rebuild its bore routes only once, then regenerate them during gathering.
const LOOSE_PASSES = makePasses(makeBeads(0));

function appendPrefix(output: FlowerPoint[], path: FlowerPoint[], fraction: number): void {
  const lengths = path.slice(1).map((point, index) => distance(path[index], point));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let remaining = total * clamp(fraction);
  for (let index = 1; index < path.length; index += 1) {
    const length = lengths[index - 1];
    if (remaining >= length - 1e-10) {
      if (distance(output[output.length - 1], path[index]) > 1e-9) output.push(copy(path[index]));
      remaining -= length;
    } else {
      if (remaining > 1e-9 && length > 0) output.push(lerp(path[index - 1], path[index], remaining / length));
      break;
    }
  }
}

function passageCursor(progress: number): number {
  if (progress < 0.5) return (progress / 0.5) * 6;
  if (progress < 0.64) return 6 + (progress - 0.5) / 0.14;
  if (progress < 0.76) return 7 + (progress - 0.64) / 0.12;
  if (progress < 0.88) return 8 + (progress - 0.76) / 0.12;
  return 9;
}

/** Pure random-access evaluation; does not depend on previous frames. */
export function getFlowerState(progress: number): FlowerState {
  const p = clamp(progress);
  const checkpoint = p < 0.5 ? 0 : p < 0.64 ? 1 : p < 0.76 ? 2 : p < 0.88 ? 3 : 4;
  const beads = makeBeads(p);
  const passes = p <= 0.88 ? LOOSE_PASSES : makePasses(beads);
  const cursor = passageCursor(p);
  const completed = Math.min(9, Math.floor(cursor + 1e-10));
  const points: FlowerPoint[] = [copy(TAIL), copy(START)];

  for (let index = 0; index < completed; index += 1) appendPrefix(points, passes[index], 1);
  if (completed < passes.length) appendPrefix(points, passes[completed], cursor - completed);

  // The held end rounds away from the flower perimeter during gathering,
  // so it cannot graze the newly touching neighboring petal.
  if (p > 0.88) {
    const heldLength = LOOSE_RADIUS - Math.abs(beads[3].position[1]);
    const start = copy(points[points.length - 1]), tail = [start], radius = 0.12;
    for (let i = 1; i <= 24; i++) {
      const angle = Math.PI * 0.5 * i / 24;
      tail.push([start[0] - radius * Math.sin(angle), start[1] + radius * (1 - Math.cos(angle)), start[2]]);
    }
    appendLine(tail, [start[0] - radius, start[1] + radius + 0.55, start[2]]);
    const total = tail.slice(1).reduce((sum, point, i) => sum + distance(tail[i], point), 0);
    appendPrefix(points, tail, heldLength / total);
  }

  const activeVisit = checkpoint === 0 ? Math.min(5, completed) : checkpoint === 1 ? 6 : checkpoint === 2 ? 7 : 8;
  const order = [0, 1, 2, 3, 4, 5, 0, 6, 3];
  if (p < 1) beads[order[activeVisit]].active = true;

  return {
    points,
    tip: copy(points[points.length - 1]),
    checkpoint,
    beads,
  };
}

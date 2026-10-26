import {
  inspectRoundCordState,
  segmentSupportClearance,
  segmentDistance,
} from './knot-geometry.mjs';

const dot = (a, b) => a.reduce((sum, v, i) => sum + v * b[i], 0);
const sub = (a, b) => a.map((v, i) => v - b[i]);
const distance = (a, b) => Math.hypot(...sub(a, b));

/** 使用与实际珠体相同的36段闭合母线，保留轴向及压管径向缩放。 */
function beadProfile(bead) {
  const hole = Math.max(0.055, Math.min(0.12, bead.radius * 0.36));
  const cutoff = Math.acos(Math.min(0.8, hole / bead.radius));
  const radial = bead.radialScale ?? 1,
    axial = bead.axialScale ?? 1;
  return Array.from({ length: 37 }, (_, i) => {
    const a = -cutoff + (2 * cutoff * i) / 36;
    return [bead.radius * Math.cos(a) * radial, bead.radius * Math.sin(a) * axial];
  });
}

/** 求点到闭合珠体截面的有符号距离，孔内空间与实体明确分开。 */
function profileDistance(point, profile) {
  let inside = false,
    best = Infinity;
  for (let i = 0, j = profile.length - 1; i < profile.length; j = i++) {
    const a = profile[j],
      b = profile[i];
    if (
      a[1] > point[1] !== b[1] > point[1] &&
      point[0] < ((b[0] - a[0]) * (point[1] - a[1])) / (b[1] - a[1]) + a[0]
    ) {
      inside = !inside;
    }
    const x = b[0] - a[0],
      y = b[1] - a[1],
      d = x * x + y * y;
    const t = d ? Math.max(0, Math.min(1, ((point[0] - a[0]) * x + (point[1] - a[1]) * y) / d)) : 0;
    best = Math.min(best, Math.hypot(point[0] - a[0] - t * x, point[1] - a[1] - t * y));
  }
  return inside ? -best : best;
}

/** 对所有细线及带孔珠体逐段检查，不借用只支持圆绳的检查结果冒充穿珠验收。 */
export function inspectBeadProjectState(state, carabinerWorldLines) {
  const cords = [
    { id: 'main', points: state.points, radius: state.radius ?? 0.005 },
    ...(state.strands ?? []),
  ];
  const round = inspectRoundCordState({ ...state, beads: [], supports: [] }, carabinerWorldLines);
  const profiles = (state.beads ?? []).map((bead) => ({
    bead,
    profile: beadProfile(bead),
    bound: bead.radius * Math.max(bead.axialScale ?? 1, bead.radialScale ?? 1) + 0.02,
  }));
  const size = 0.3,
    grid = new Map();
  const maxWire = Math.max(...cords.map((c) => c.radius));
  for (const item of profiles) {
    const n = item.bound + maxWire;
    for (
      let x = Math.floor((item.bead.position[0] - n) / size);
      x <= Math.floor((item.bead.position[0] + n) / size);
      x++
    ) {
      for (
        let y = Math.floor((item.bead.position[1] - n) / size);
        y <= Math.floor((item.bead.position[1] + n) / size);
        y++
      ) {
        for (
          let z = Math.floor((item.bead.position[2] - n) / size);
          z <= Math.floor((item.bead.position[2] + n) / size);
          z++
        ) {
          const key = `${x},${y},${z}`;
          const cell = grid.get(key) ?? [];
          cell.push(item);
          grid.set(key, cell);
        }
      }
    }
  }
  let beadClearance = Infinity,
    beadWorst;
  const passages = new Map();
  for (const cord of cords) {
    for (let i = 1; i < cord.points.length; i++) {
      const a = cord.points[i - 1],
        b = cord.points[i];
      const count = Math.max(1, Math.ceil(distance(a, b) / 0.006));
      for (let k = 0; k <= count; k++) {
        const p = a.map((v, j) => v + ((b[j] - v) * k) / count);
        for (const item of grid.get(
          `${Math.floor(p[0] / size)},${Math.floor(p[1] / size)},${Math.floor(p[2] / size)}`,
        ) ?? []) {
          const delta = sub(p, item.bead.position);
          if (Math.hypot(...delta) > item.bound + cord.radius) {
            continue;
          }
          const axial = dot(delta, item.bead.axis);
          const radial = Math.sqrt(Math.max(0, dot(delta, delta) - axial * axial));
          const clearance = profileDistance([radial, axial], item.profile) - cord.radius;
          if (clearance < beadClearance) {
            beadClearance = clearance;
            beadWorst = { cord: cord.id, bead: item.bead.id, segment: i - 1, point: p };
          }
          const hole =
            Math.min(
              0.8 * item.bead.radius,
              Math.max(0.055, Math.min(0.12, item.bead.radius * 0.36)),
            ) * (item.bead.radialScale ?? 1);
          if (radial < hole - cord.radius && cord.id !== 'trimmed-wire') {
            const before = passages.get(item.bead.id) ?? { min: Infinity, max: -Infinity };
            before.min = Math.min(before.min, axial);
            before.max = Math.max(before.max, axial);
            passages.set(item.bead.id, before);
          }
        }
      }
    }
  }
  const supportResults = [];
  for (const support of state.supports ?? []) {
    const lines = support.kind === 'carabiner' ? carabinerWorldLines(support) : null;
    const bound =
      support.kind === 'ring'
        ? support.radius + support.length / 2
        : support.kind === 'carabiner'
          ? Math.hypot(support.width ?? support.length, support.length) / 2 + support.radius
          : support.length / 2 + support.radius;
    for (const cord of cords) {
      let clearance = Infinity,
        segment = -1;
      for (let i = 1; i < cord.points.length; i++) {
        const a = cord.points[i - 1],
          b = cord.points[i];
        if (
          segmentDistance(a, b, support.position, support.position) >
          bound + cord.radius + 0.03
        ) {
          continue;
        }
        let current = Infinity;
        if (lines) {
          for (const line of lines) {
            for (let j = 1; j < line.length; j++) {
              const c = line[j - 1],
                d = line[j],
                reach = cord.radius + support.radius + 0.03;
              if (
                [0, 1, 2].some(
                  (k) =>
                    Math.min(a[k], b[k]) - Math.max(c[k], d[k]) > reach ||
                    Math.min(c[k], d[k]) - Math.max(a[k], b[k]) > reach,
                )
              ) {
                continue;
              }
              current = Math.min(
                current,
                segmentDistance(a, b, c, d) - cord.radius - support.radius,
              );
            }
          }
        } else {
          current = segmentSupportClearance(a, b, cord.radius, support);
        }
        if (current < clearance) {
          clearance = current;
          segment = i - 1;
        }
      }
      supportResults.push({ cord: cord.id, support: support.id, clearance, segment });
    }
  }
  const beadContacts = [];
  const beads = state.beads ?? [];
  for (let i = 0; i < beads.length; i++) {
    for (let j = i + 1; j < beads.length; j++) {
      const a = beads[i],
        b = beads[j];
      const gap =
        distance(a.position, b.position) -
        a.radius * Math.max(a.radialScale ?? 1, a.axialScale ?? 1) -
        b.radius * Math.max(b.radialScale ?? 1, b.axialScale ?? 1);
      if (gap < -1e-5) {
        beadContacts.push({ a: a.id, b: b.id, gap });
      }
    }
  }
  return {
    ...round,
    contacts: round.contacts,
    supports: supportResults,
    beadClearance,
    beadWorst,
    beadContacts,
    passages: Object.fromEntries(passages),
  };
}

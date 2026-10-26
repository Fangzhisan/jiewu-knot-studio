// 圆绳的离散几何检查；结法、动作含义和成品紧实度仍需逐课目视复核。
const dot = (a, b) => a.reduce((sum, value, i) => sum + value * b[i], 0);
const sub = (a, b) => a.map((value, i) => value - b[i]);
const lerp = (a, b, t) => a.map((value, i) => value + (b[i] - value) * t);
const clamp = (value) => Math.max(0, Math.min(1, value));
const distance = (a, b) => Math.hypot(...sub(a, b));

/** 端点候选加内部驻点，覆盖平行、退化、长线段和斜交情况。 */
export function segmentDistance(a, b, c, d) {
  const u = sub(b, a),
    v = sub(d, c),
    w = sub(a, c);
  const uu = dot(u, u),
    vv = dot(v, v),
    uv = dot(u, v);
  const uw = dot(u, w),
    vw = dot(v, w);
  const candidates = [
    [0, vv ? clamp(vw / vv) : 0],
    [1, vv ? clamp((vw + uv) / vv) : 0],
    [uu ? clamp(-uw / uu) : 0, 0],
    [uu ? clamp((uv - uw) / uu) : 0, 1],
  ];
  const determinant = uu * vv - uv * uv;
  if (determinant > 1e-14 * uu * vv) {
    const s = (uv * vw - vv * uw) / determinant;
    const t = (uu * vw - uv * uw) / determinant;
    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      candidates.push([s, t]);
    }
  }
  return Math.min(...candidates.map(([s, t]) => distance(lerp(a, b, s), lerp(c, d, t))));
}

/** 由三点外接圆估计局部弯曲半径，重复点与直线不产生假尖角。 */
export function turningRadius(a, b, c) {
  const u = sub(b, a),
    v = sub(c, b);
  const cross = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  const area = Math.hypot(...cross);
  return area > 1e-14
    ? (Math.hypot(...u) * Math.hypot(...v) * distance(a, c)) / (2 * area)
    : Infinity;
}

/** 将每段扩张到绳管包围盒；长线段也登记全部覆盖单元，避免只查中点漏穿线。 */
export function cordContacts(cords, tolerance = 1e-5) {
  // 混合粗绳芯和细缠绳时按细绳分桶，避免整列细绳挤入同一大格。
  const size = Math.max(0.08, Math.min(...cords.map((cord) => cord.radius * 4)));
  const grid = new Map();
  const segments = [];
  const issues = [];
  let nearestClearance = Infinity;
  let closest = null;
  for (const [cordIndex, cord] of cords.entries()) {
    let arc = 0;
    for (let i = 1; i < cord.points.length; i++) {
      const a = cord.points[i - 1],
        b = cord.points[i];
      const length = distance(a, b);
      if (length < 1e-10) {
        continue;
      }
      const segment = { a, b, arc, length, radius: cord.radius, cordIndex, index: i - 1 };
      const padding = cord.radius + tolerance;
      const low = a.map((value, axis) => Math.floor((Math.min(value, b[axis]) - padding) / size));
      const high = a.map((value, axis) => Math.floor((Math.max(value, b[axis]) + padding) / size));
      const visited = new Set();
      for (let x = low[0]; x <= high[0]; x++) {
        for (let y = low[1]; y <= high[1]; y++) {
          for (let z = low[2]; z <= high[2]; z++) {
            const key = `${x},${y},${z}`;
            const cell = grid.get(key) ?? [];
            for (const previousId of cell) {
              if (visited.has(previousId)) {
                continue;
              }
              visited.add(previousId);
              const previous = segments[previousId];
              if (
                previous.cordIndex === cordIndex &&
                arc - previous.arc - previous.length < 4 * cord.radius
              ) {
                continue;
              }
              const reach = cord.radius + previous.radius + size * 0.25;
              if (
                [0, 1, 2].some(
                  (axis) =>
                    Math.min(a[axis], b[axis]) - Math.max(previous.a[axis], previous.b[axis]) >
                      reach ||
                    Math.min(previous.a[axis], previous.b[axis]) - Math.max(a[axis], b[axis]) >
                      reach,
                )
              ) {
                continue;
              }
              const clearance =
                segmentDistance(a, b, previous.a, previous.b) - cord.radius - previous.radius;
              if (clearance < nearestClearance) {
                nearestClearance = clearance;
                closest = {
                  cords: [cords[previous.cordIndex].id, cord.id],
                  segments: [previous.index, segment.index],
                  clearance,
                };
              }
              if (clearance < -tolerance && issues.length < 12) {
                issues.push({
                  cords: [cords[previous.cordIndex].id, cord.id],
                  segments: [previous.index, segment.index],
                  clearance,
                });
              }
            }
            cell.push(segments.length);
            grid.set(key, cell);
          }
        }
      }
      segments.push(segment);
      arc += length;
    }
  }
  return { nearestClearance, closest, issues };
}

/** 有限圆柱及圆环的有符号表面距离；轴向统一归一化。 */
export function supportDistance(point, support) {
  const delta = sub(point, support.position);
  const magnitude = Math.hypot(...support.axis);
  const axis =
    magnitude > 1e-10
      ? support.axis.map((v) => v / magnitude)
      : support.kind === 'ring'
        ? [0, 0, 1]
        : [0, 1, 0];
  const axial = dot(delta, axis);
  const radial = Math.sqrt(Math.max(0, dot(delta, delta) - axial * axial));
  if (support.kind === 'ring') {
    return Math.hypot(radial - support.radius, axial) - support.length / 2;
  }
  if (support.kind !== 'cylinder') {
    throw new Error(`未支持的支撑物：${support.kind}`);
  }
  const a = radial - support.radius,
    b = Math.abs(axial) - support.length / 2;
  return Math.hypot(Math.max(a, 0), Math.max(b, 0)) + Math.min(Math.max(a, b), 0);
}

/** 利用距离场的 Lipschitz 下界递分，连线穿过实体时不能只靠端点判断。 */
export function segmentSupportClearance(a, b, radius, support, tolerance = 1e-5) {
  const visit = (left, right, dl, dr, depth) => {
    const middle = lerp(left, right, 0.5);
    const dm = supportDistance(middle, support) - radius;
    const lower = Math.min(dl, dm, dr) - distance(left, right) / 4;
    if (
      lower >= 0 ||
      Math.min(dl, dm, dr) < -tolerance ||
      depth >= 18 ||
      distance(left, right) < tolerance
    ) {
      return Math.min(dl, dm, dr);
    }
    return Math.min(
      visit(left, middle, dl, dm, depth + 1),
      visit(middle, right, dm, dr, depth + 1),
    );
  };
  return visit(a, b, supportDistance(a, support) - radius, supportDistance(b, support) - radius, 0);
}

/** 检查完整主绳和每条独立细绳，粗绳芯也参与绳间接触检查。 */
export function inspectRoundCordState(state, carabinerWorldLines) {
  const cords = [
    {
      id: 'main',
      points: state.points,
      radius: state.radius ?? 0.06,
      flatness: state.flatness,
      thicknessScales: state.thicknessScales,
    },
    ...(state.strands ?? []),
  ].filter((cord) => cord.points.length > 1);
  if (
    cords.some(
      (cord) => (cord.flatness !== undefined && cord.flatness !== 1) || cord.thicknessScales,
    )
  ) {
    throw new Error('此检查只支持等截面圆绳，扁绳或变径线须使用对应检查器');
  }
  if ((state.beads ?? []).length) {
    throw new Error('珠孔穿线需单独检查，不能用圆绳检查器代替');
  }
  for (const cord of cords) {
    if (
      !(Number.isFinite(cord.radius) && cord.radius > 0) ||
      cord.points.some((p) => p.length !== 3 || !p.every(Number.isFinite))
    ) {
      throw new Error(`绳股 ${cord.id} 含无效半径或坐标`);
    }
  }
  const lengths = {},
    bends = [],
    supports = [];
  for (const cord of cords) {
    let length = 0,
      minimum = Infinity,
      at = -1;
    for (let i = 1; i < cord.points.length; i++) {
      length += distance(cord.points[i - 1], cord.points[i]);
      if (i < cord.points.length - 1) {
        const radius = turningRadius(cord.points[i - 1], cord.points[i], cord.points[i + 1]);
        if (radius < minimum) {
          minimum = radius;
          at = i;
        }
      }
    }
    lengths[cord.id] = length;
    bends.push({ cord: cord.id, radius: cord.radius, minimum, at });
    for (const support of state.supports ?? []) {
      if (
        !(
          Number.isFinite(support.radius) &&
          support.radius > 0 &&
          Number.isFinite(support.length) &&
          support.length > 0
        ) ||
        !support.position.every(Number.isFinite) ||
        !support.axis.every(Number.isFinite)
      ) {
        throw new Error(`支撑物 ${support.id} 含无效尺寸或坐标`);
      }
      const lines = support.kind === 'carabiner' ? carabinerWorldLines(support) : null;
      let clearance = Infinity,
        segment = -1;
      for (let i = 1; i < cord.points.length; i++) {
        let current = Infinity;
        if (lines) {
          for (const line of lines) {
            for (let j = 1; j < line.length; j++) {
              current = Math.min(
                current,
                segmentDistance(cord.points[i - 1], cord.points[i], line[j - 1], line[j]) -
                  cord.radius -
                  support.radius,
              );
            }
          }
        } else {
          current = segmentSupportClearance(
            cord.points[i - 1],
            cord.points[i],
            cord.radius,
            support,
          );
        }
        if (current < clearance) {
          clearance = current;
          segment = i - 1;
        }
      }
      supports.push({ cord: cord.id, support: support.id, clearance, segment });
    }
  }
  return { lengths, bends, supports, contacts: cordContacts(cords) };
}

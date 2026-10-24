import type { Course, LessonState, Vec3 } from './lessons/types'
import { HEAVY_COURSE_PROJECTIONS } from './lessons/generated/heavy-projections'

export type ProjectionMark =
  | { kind: 'line'; depth: number; d: string; width: number; shade: string }
  | { kind: 'bead'; depth: number; x: number; y: number; radius: number; axisRadius: number; angle: number; hole: string }
  | { kind: 'support'; depth: number; x1: number; y1: number; x2: number; y2: number; width: number }
export interface CourseProjection { marks: ProjectionMark[]; viewBox: string }
const cache = new WeakMap<Course, CourseProjection>()
const shades = ['#626262', '#9c9c9c', '#777777', '#b0b0b0']
const dist = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])

function focusPoints(state: LessonState, course: Course): Vec3[] {
  if (course.projectionBounds) {
    const { minX, maxX, minY, maxY } = course.projectionBounds
    return [[minX, minY, 0], [maxX, maxY, 0]]
  }
  if (state.beads?.length) return state.beads.flatMap(bead => {
    const stretch = (bead.axialScale ?? 1) ** 2 - 1
    const rx = bead.radius * Math.sqrt(1 + stretch * bead.axis[0] ** 2)
    const ry = bead.radius * Math.sqrt(1 + stretch * bead.axis[1] ** 2)
    return [[bead.position[0] - rx, bead.position[1] - ry, 0],
      [bead.position[0] + rx, bead.position[1] + ry, 0]] as Vec3[]
  })
  const lines = [state.points, ...(state.strands ?? []).map(strand => strand.points)]
  if (course.projectionFocus === 'full' || (course.projectionFocus !== 'curves' && course.category !== 'knots')) return lines.flat()
  // Shorten only the thumbnail's framing, not the actual model. Long pulling
  // tails would otherwise reduce a finished knot to an indistinguishable dot.
  const curved: Vec3[] = []
  for (const line of lines) for (let i = 3; i < line.length - 3; i++) {
    const a = line[i - 3]!, b = line[i]!, c = line[i + 3]!
    const ab = dist(a, b), bc = dist(b, c)
    if (ab < 1e-8 || bc < 1e-8) continue
    const cosine = b.reduce((sum, value, axis) => sum + (value - a[axis]!) * (c[axis]! - value), 0) / ab / bc
    const curvature = Math.sqrt(Math.max(0, 2 - 2 * Math.min(1, cosine))) / ((ab + bc) / 2)
    if (curvature > 1.15) curved.push(b)
  }
  return curved.length >= 5 ? curved : lines.flat()
}

/** Compute from the actual prepared model, without cache or generated-data shortcuts. */
export function computeCourseProjection(course: Course): CourseProjection {
  const state = course.getState(1)
  const focus = focusPoints(state, course)
  if (!course.projectionBounds) for (const support of state.supports ?? []) {
    if (support.kind !== 'ring') continue
    const rx = support.radius * Math.sqrt(Math.max(0, 1 - support.axis[0] ** 2)) + support.length / 2
    const ry = support.radius * Math.sqrt(Math.max(0, 1 - support.axis[1] ** 2)) + support.length / 2
    focus.push([support.position[0] - rx, support.position[1] - ry, 0], [support.position[0] + rx, support.position[1] + ry, 0])
  }
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  for (const p of focus) { minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]); minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]) }
  const padding = course.category === 'knots' ? .16 : .08
  const scale = Math.min(68 / Math.max(.6, maxX - minX + padding * 2), 52 / Math.max(.6, maxY - minY + padding * 2))
  const centerX = (minX + maxX) / 2, centerY = (minY + maxY) / 2
  const point = (p: Vec3) => [40 + (p[0] - centerX) * scale, 32 - (p[1] - centerY) * scale] as const
  const n = (x: number) => Number(x.toFixed(2))
  const marks: ProjectionMark[] = []
  const lines = [{ points: state.points, radius: state.radius ?? (state.beads ? .025 : .06) }, ...(state.strands ?? [])]
  const allDepths = lines.flatMap(line => line.points.map(p => p[2]))
  const low = Math.min(...allDepths), high = Math.max(...allDepths)
  lines.forEach((line, index) => {
    // Group short segments by depth to show over/under crossings without
    // thousands of SVG nodes or a separate WebGL renderer for every icon.
    const buckets = new Map<number, string[]>()
    const stride = Math.max(1, Math.floor(line.points.length / 220))
    for (let i = 0; i < line.points.length - 1; i += stride) {
      const a = line.points[i]!, b = line.points[Math.min(line.points.length - 1, i + stride)]!
      const depth = high - low > 1e-8 ? Math.round((((a[2] + b[2]) / 2 - low) / (high - low)) * 8) : 4
      const [x1, y1] = point(a), [x2, y2] = point(b)
      const path = buckets.get(depth) ?? []
      path.push(`M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}`); buckets.set(depth, path)
    }
    for (const [bucket, paths] of buckets) marks.push({ kind: 'line', depth: low + bucket / 8 * (high - low), d: paths.join(''), width: Math.max(1.5, line.radius * 2 * scale), shade: shades[index % shades.length]! })
  })
  for (const bead of state.beads ?? []) {
    const [x, y] = point(bead.position), r = bead.radius * scale
    const axisLength = Math.hypot(bead.axis[0], bead.axis[1])
    const axisRadius = r * Math.sqrt(1 + ((bead.axialScale ?? 1) ** 2 - 1) * axisLength ** 2)
    const angle = Math.atan2(-bead.axis[1], bead.axis[0]) * 180 / Math.PI
    let hole = ''
    if (axisLength > .2) {
      const dx = bead.axis[0] / axisLength, dy = -bead.axis[1] / axisLength
      hole = [-1, 1].map(sign => `M${n(x + sign * dx * axisRadius * .64)} ${n(y + sign * dy * axisRadius * .64)}L${n(x + sign * dx * axisRadius * .9)} ${n(y + sign * dy * axisRadius * .9)}`).join('')
    }
    marks.push({ kind: 'bead', depth: bead.position[2], x: n(x), y: n(y), radius: n(r), axisRadius: n(axisRadius), angle: n(angle), hole })
  }
  for (const support of state.supports ?? []) {
    // A braiding disk is a teaching fixture; the icon shows the finished braid.
    if (support.kind === 'ring') {
      const nrm = support.axis;
      const seed: Vec3 = Math.abs(nrm[2]) < .9 ? [0, 0, 1] : [0, 1, 0];
      const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
      const raw = cross(nrm, seed), magnitude = Math.hypot(...raw);
      const u = raw.map(v => v / magnitude) as Vec3, v = cross(nrm, u);
      const ringPoint = (angle: number) => support.position.map((x, i) => x + support.radius * (u[i]! * Math.cos(angle) + v[i]! * Math.sin(angle))) as Vec3;
      for (let i = 0; i < 64; i++) {
        const a = ringPoint(i / 64 * Math.PI * 2), b = ringPoint((i + 1) / 64 * Math.PI * 2);
        const [x1, y1] = point(a), [x2, y2] = point(b);
        marks.push({ kind: 'support', depth: (a[2] + b[2]) / 2, x1, y1, x2, y2, width: support.length * scale });
      }
      continue;
    }
    if (support.kind !== 'cylinder') continue
    const half = support.length / 2
    const [x1, y1] = point(support.position.map((v, i) => v - support.axis[i]! * half) as Vec3)
    const [x2, y2] = point(support.position.map((v, i) => v + support.axis[i]! * half) as Vec3)
    marks.push({ kind: 'support', depth: support.position[2], x1, y1, x2, y2, width: support.radius * 2 * scale })
  }
  marks.sort((a, b) => a.depth - b.depth)
  return { marks, viewBox: '0 0 80 64' }
}

/** Heavy-course icons never request animation data; other projections are cached once. */
export function getCourseProjection(course: Course): CourseProjection {
  const generated = HEAVY_COURSE_PROJECTIONS[course.id]
  if (generated) return generated
  const existing = cache.get(course)
  if (existing) return existing
  const result = computeCourseProjection(course)
  cache.set(course, result)
  return result
}

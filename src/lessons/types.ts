export type Vec3 = [number, number, number]
export type CategoryId = 'knots' | 'weaving' | 'beads'
export interface LessonStep { time: number; title: string; instruction: string }
export interface LessonBead {
  id: string; position: Vec3; axis: Vec3; radius: number; color: string; active: boolean; label?: string; labelOpacity?: number
  /** Stretch along the bead's hole axis; 1 preserves the round bead. */
  axialScale?: number
}
export interface LessonStrand {
  id: string; points: Vec3[]; color: string; radius: number; flatness?: number; thicknessScales?: number[]; label?: string
  endCaps?: { start?: string | false; end?: string | false }
}
export interface LessonSupport {
  id: string; kind: 'cylinder' | 'braiding-disk' | 'ring'; position: Vec3; axis: Vec3; radius: number; length: number; color?: string
  /** Ring: axis is the plane normal, radius the centerline radius, length the tube diameter. */
  /** Braiding disk: local XY face, +Z normal, 32 numbered slots. */
  innerRadius?: number; rotation?: number; activeSlots?: number[]
}
export interface LessonState {
  points: Vec3[]; tip: Vec3; checkpoint: number; beads?: LessonBead[]
  strands?: LessonStrand[]
  supports?: LessonSupport[]
  color?: string; radius?: number; flatness?: number; thicknessScales?: number[]; guideOpacity?: number; showEndLabels?: boolean; hideMainTip?: boolean
  endCaps?: { start?: string | false; end?: string | false }
}
export interface Course {
  id: string; category: CategoryId; name: string; title: string; description: string
  material: string; materialNote: string; duration: number; initialProgress: number
  steps: readonly LessonStep[]; source: string; sourceName: string
  application?: { scenarios: string[]; task: string; focus: string; boundary?: string }
  projectionFocus?: 'curves' | 'full'
  /** Optional XY framing of the finished work, excluding long working tails. */
  projectionBounds?: { minX: number; maxX: number; minY: number; maxY: number }
  /** Load optional authored data once before calling the synchronous getState. */
  prepare?: () => Promise<void>
  getState: (progress: number) => LessonState
}

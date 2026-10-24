import type { CategoryId } from '../lessons/types'

export type GuideKind = 'foundation' | 'project'
export type DiagramKind = 'parcel' | 'bundle' | 'line' | 'lanyard' | 'bracelet' | 'necklace' | 'earrings' | 'pendant' | 'coaster' | 'bookmark' | 'wall-hanging' | 'plant-hanger' | 'pouch' | 'pattern' | 'closure'
export interface MakingGuide {
  id: string
  kind: GuideKind
  category: CategoryId
  title: string
  subtitle: string
  scenarios: string[]
  difficulty: '入门' | '进阶' | '综合'
  minutes: number
  outcome: string
  /** What the project is for, and what the result includes. */
  overview: string
  /** Short, concrete restrictions; omit when ordinary material guidance suffices. */
  boundary?: string
  materials: { name: string; amount: string; note: string }[]
  preparation: string[]
  steps: { title: string; instruction: string; check: string; tip?: string; techniqueIds?: string[] }[]
  finishChecks: string[]
  troubleshooting: { problem: string; fix: string }[]
  /** IDs of existing 3D lessons or foundational making guides, never invented links. */
  techniqueIds: string[]
  relatedGuideIds?: string[]
  sources: { title: string; url: string }[]
  diagram: { kind: DiagramKind; caption: string; colors?: string[]; pattern?: string[]; labels?: string[] }
}

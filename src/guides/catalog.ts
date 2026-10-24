import { KNOT_GUIDES } from './knots'
import { WEAVING_GUIDES } from './weaving'
import { BEAD_GUIDES } from './beads'
import type { MakingGuide } from './types'
export const GUIDES: MakingGuide[] = [...KNOT_GUIDES, ...WEAVING_GUIDES, ...BEAD_GUIDES]
export const getGuide = (id: string) => GUIDES.find(guide => guide.id === id)

import * as THREE from 'three'
import type { LessonState, Vec3 } from './lessons/types'

type CordState = Omit<LessonState, 'checkpoint'>
export interface CordEnd {
  id: string; label: string; point: Vec3; direction: Vec3
  radius: number; flatness: number; color: string
}

/** Only real free ends receive a cap; split representations can suppress their shared join. */
export function getCordEnds(state: CordState): CordEnd[] {
  const cords = [
    { id: 'main', points: state.points, radius: state.radius ?? (state.beads ? .025 : .06), color: state.color ?? (state.beads ? '#b87e52' : '#326558'), flatness: state.flatness, endCaps: state.endCaps },
    ...(state.strands ?? []),
  ]
  const ends: CordEnd[] = []
  cords.forEach((cord, index) => {
    if (cord.points.length < 2) return
    for (const side of ['start', 'end'] as const) {
      const override = cord.endCaps?.[side]
      if (override === false) continue
      const first = side === 'start', at = first ? 0 : cord.points.length - 1
      const point = cord.points[at]!
      let direction: Vec3 = [first ? -1 : 1, 0, 0]
      // Repeated samples at the beginning of a lesson must not make the cap flicker.
      for (let offset = 1; offset < cord.points.length; offset++) {
        const next = cord.points[at + (first ? offset : -offset)]!
        const delta: Vec3 = [point[0] - next[0], point[1] - next[1], point[2] - next[2]]
        const length = Math.hypot(...delta)
        if (length > 1e-6) { direction = delta.map(value => value / length) as Vec3; break }
      }
      ends.push({ id: `${cord.id}:${side}`, label: override ?? `${index + 1}${first ? 'B' : 'A'}`, point, direction, radius: cord.radius, flatness: cord.flatness ?? 1, color: cord.color })
    }
  })
  return ends
}

interface Marker {
  root: THREE.Group; body: THREE.Mesh; material: THREE.MeshStandardMaterial
  secondRing: THREE.Mesh; label: THREE.Sprite; texture: THREE.CanvasTexture
  leader: THREE.Line; text: string; color: string; anchor: THREE.Vector3; direction: THREE.Vector3
}

/** Cached solid ferrules plus compact, camera-facing identifiers. No animation loop of their own. */
export class CordEndMarkers {
  readonly group = new THREE.Group()
  private readonly markers = new Map<string, Marker>()
  private readonly geometry = new THREE.CylinderGeometry(1, 1, 1, 16)
  private readonly metal = new THREE.MeshStandardMaterial({ color: '#dce2e2', roughness: .28, metalness: .75 })
  private readonly tangent = new THREE.Vector3()
  private readonly normal = new THREE.Vector3()
  private readonly across = new THREE.Vector3()
  private readonly basis = new THREE.Matrix4()

  private paintLabel(marker: Marker, text: string, color: string) {
    const canvas = marker.texture.image as HTMLCanvasElement
    const context = canvas.getContext('2d')!
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = 'rgba(252,252,250,.98)'
    context.strokeStyle = color
    context.lineWidth = 5
    context.beginPath()
    context.roundRect(4, 4, 136, 72, 23)
    context.fill(); context.stroke()
    context.fillStyle = '#222c2c'
    context.font = '600 44px system-ui, sans-serif'
    context.textAlign = 'center'; context.textBaseline = 'middle'
    context.fillText(text, 72, 42)
    marker.texture.needsUpdate = true
    marker.text = text; marker.color = color
  }

  update(state: CordState) {
    for (const marker of this.markers.values()) marker.root.visible = marker.label.visible = marker.leader.visible = false
    for (const end of getCordEnds(state)) {
      let marker = this.markers.get(end.id)
      if (!marker) {
        const root = new THREE.Group()
        const material = new THREE.MeshStandardMaterial({ color: end.color, roughness: .4, metalness: .3 })
        const body = new THREE.Mesh(this.geometry, material)
        body.castShadow = true
        const ring = new THREE.Mesh(this.geometry, this.metal)
        ring.scale.set(1.015, .1, 1.015); ring.position.y = .34
        const secondRing = new THREE.Mesh(this.geometry, this.metal)
        secondRing.scale.set(1.015, .1, 1.015); secondRing.position.y = .12
        root.add(body, ring, secondRing)
        const canvas = document.createElement('canvas'); canvas.width = 144; canvas.height = 80
        const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace
        const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: false, depthWrite: false, toneMapped: false }))
        label.renderOrder = 12
        const lineGeometry = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3))
        const leader = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: end.color, transparent: true, opacity: .5, depthTest: false, depthWrite: false }))
        leader.frustumCulled = false; leader.renderOrder = 11
        marker = { root, body, material, secondRing, label, texture, leader, text: '', color: '', anchor: new THREE.Vector3(), direction: new THREE.Vector3() }
        this.markers.set(end.id, marker); this.group.add(root, label, leader)
      }
      marker.root.visible = marker.label.visible = marker.leader.visible = true
      marker.material.color.set(end.color)
      ;(marker.leader.material as THREE.LineBasicMaterial).color.set(end.color)
      if (marker.text !== end.label || marker.color !== end.color) this.paintLabel(marker, end.label, end.color)
      marker.secondRing.visible = end.label.endsWith('B')
      this.tangent.fromArray(end.direction)
      this.normal.set(0, 0, 1).addScaledVector(this.tangent, -this.tangent.z)
      if (this.normal.lengthSq() < 1e-8) this.normal.set(1, 0, 0).addScaledVector(this.tangent, -this.tangent.x)
      this.normal.normalize(); this.across.crossVectors(this.tangent, this.normal).normalize()
      marker.root.quaternion.setFromRotationMatrix(this.basis.makeBasis(this.across, this.tangent, this.normal))
      const shape = Math.sqrt(Math.max(.25, Math.min(1, end.flatness)))
      // A snug ferrule preserves the clearance between neighboring finished strands.
      // Fine bead threads must not inherit the minimum size used for coarse ropes:
      // an oversized cap hits neighbouring return passes and drilled bead walls.
      const radius = state.beads ? end.radius * .985 : Math.max(end.radius * .985, .028)
      // A short sleeve also stays clear as the working end rounds a tight return.
      const length = state.beads ? end.radius * 1.5 : Math.max(end.radius * 3.1, .11)
      marker.root.scale.set(radius / shape, length, radius * shape)
      marker.root.position.fromArray(end.point).addScaledVector(this.tangent, length * .25)
      marker.anchor.fromArray(end.point).addScaledVector(this.tangent, length * .8)
      marker.direction.copy(this.tangent)
    }
  }

  layout(camera: THREE.OrthographicCamera, width: number, height: number) {
    const visible = [...this.markers.values()].filter(marker => marker.root.visible)
    const worldPerPixel = (camera.top - camera.bottom) / camera.zoom / height
    const labelWidth = 29, labelHeight = 17, gap = 4
    const layouts = visible.map(marker => {
      const anchor = marker.anchor.clone().project(camera)
      const target = marker.anchor.clone().addScaledVector(marker.direction, .32).project(camera)
      let dx = (target.x - anchor.x) * width / 2, dy = (anchor.y - target.y) * height / 2
      if (Math.hypot(dx, dy) < 1) { dx = 0; dy = anchor.y >= 0 ? -1 : 1 }
      const length = Math.hypot(dx, dy), offset = 23
      const x = (anchor.x + 1) * width / 2 + dx / length * offset
      const anchorY = (1 - anchor.y) * height / 2
      let y = anchorY + dy / length * offset
      // The top strip belongs to the view controls. End identifiers near it
      // move below their cap instead of being covered by an HTML button.
      if (y < 78) y = Math.max(78, anchorY + offset)
      return { marker, anchor, x, y, horizontal: Math.abs(dy) > Math.abs(dx) }
    })
    const bounds = { x: [20, Math.max(20, width - 20)], y: [78, Math.max(78, height - 18)] }
    for (const item of layouts) {
      item.x = Math.max(bounds.x[0]!, Math.min(bounds.x[1]!, item.x))
      item.y = Math.max(bounds.y[0]!, Math.min(bounds.y[1]!, item.y))
    }
    type LabelLayout = typeof layouts[number]
    const separate = (a: LabelLayout, b: LabelLayout, axis: 'x' | 'y', overlap: number) => {
      const forward = axis === 'x' ? b.anchor.x >= a.anchor.x : b.anchor.y <= a.anchor.y
      const sign = forward ? 1 : -1, [min, max] = bounds[axis] as [number, number]
      const roomA = forward ? a[axis] - min : max - a[axis]
      const roomB = forward ? max - b[axis] : b[axis] - min
      // When one label reaches an edge, its neighbour takes the remaining
      // displacement. Clamping only after separation put the last labels back
      // on top of each other on narrow screens.
      let moveA = Math.min(overlap / 2 + .1, roomA)
      const moveB = Math.min(overlap + .2 - moveA, roomB)
      moveA = Math.min(overlap + .2 - moveB, roomA)
      a[axis] -= sign * moveA; b[axis] += sign * moveB
      return moveA + moveB
    }
    // Deterministic, bounded separation keeps dense warp-end labels legible.
    for (let pass = 0; pass < 96; pass++) {
      let moved = false
      for (let i = 0; i < layouts.length; i++) for (let j = i + 1; j < layouts.length; j++) {
        const a = layouts[i]!, b = layouts[j]!, dx = b.x - a.x, dy = b.y - a.y
        const overlapX = labelWidth + gap - Math.abs(dx), overlapY = labelHeight + gap - Math.abs(dy)
        if (overlapX <= 0 || overlapY <= 0) continue
        const horizontal = a.horizontal && b.horizontal
        const displacement = horizontal ? separate(a, b, 'x', overlapX) : separate(a, b, 'y', overlapY)
        if (displacement < (horizontal ? overlapX : overlapY)) {
          if (horizontal) separate(a, b, 'y', overlapY)
          else separate(a, b, 'x', overlapX)
        }
        moved = true
      }
      if (!moved) break
    }
    for (const item of layouts) {
      const { marker, anchor } = item
      const { x, y } = item
      marker.label.position.set(x / width * 2 - 1, 1 - y / height * 2, anchor.z).unproject(camera)
      marker.label.scale.set(labelWidth * worldPerPixel, labelHeight * worldPerPixel, 1)
      const line = marker.leader.geometry.getAttribute('position') as THREE.BufferAttribute
      line.setXYZ(0, marker.anchor.x, marker.anchor.y, marker.anchor.z)
      line.setXYZ(1, marker.label.position.x, marker.label.position.y, marker.label.position.z)
      line.needsUpdate = true
    }
  }

  getState() {
    return [...this.markers.values()].filter(marker => marker.root.visible).map(marker => ({ label: marker.text, position: marker.root.position.toArray(), direction: marker.direction.toArray(), color: marker.color }))
  }

  disposeTextures() { for (const marker of this.markers.values()) marker.texture.dispose() }
}

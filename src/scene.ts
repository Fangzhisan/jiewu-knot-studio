import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { CordEndMarkers } from './cordEnds';
import { BraidingDisk } from './braidingDisk';

import type { Vec3, LessonState, LessonStrand } from './lessons/types';
export type { Vec3 } from './lessons/types';
export type TeachingState = Omit<LessonState, 'checkpoint'>;

/** A parallel-transport tube: it follows the supplied centreline without spline overshoot. */
class DynamicCord {
  readonly mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
  private capacity = 0;
  private readonly sides = 16;
  private tangent = new THREE.Vector3();
  private normal = new THREE.Vector3();
  private binormal = new THREE.Vector3();
  private radial = new THREE.Vector3();

  constructor(material: THREE.MeshStandardMaterial) {
    this.mesh = new THREE.Mesh(new THREE.BufferGeometry(), material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.frustumCulled = false;
  }

  update(points: Vec3[], radius: number, flatness = 1, thicknessScales?: number[]) {
    if (points.length < 2) {
      this.mesh.visible = false;
      return;
    }
    this.mesh.visible = true;
    if (points.length > this.capacity) {
      this.capacity = Math.max(128, 2 ** Math.ceil(Math.log2(points.length)));
      const geometry = new THREE.BufferGeometry();
      const vertices = this.capacity * (this.sides + 1);
      for (const [name, count] of [['position', 3], ['normal', 3], ['uv', 2]] as const) {
        geometry.setAttribute(name, new THREE.BufferAttribute(new Float32Array(vertices * count), count).setUsage(THREE.DynamicDrawUsage));
      }
      const indices = new Uint32Array((this.capacity - 1) * this.sides * 6);
      let k = 0;
      for (let i = 0; i < this.capacity - 1; i++) {
        for (let j = 0; j < this.sides; j++) {
          const a = i * (this.sides + 1) + j;
          const b = a + 1;
          const c = b + this.sides + 1;
          const d = a + this.sides + 1;
          indices[k++] = a; indices[k++] = b; indices[k++] = c;
          indices[k++] = a; indices[k++] = c; indices[k++] = d;
        }
      }
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
      this.mesh.geometry.dispose();
      this.mesh.geometry = geometry;
    }
    const positions = this.mesh.geometry.getAttribute('position') as THREE.BufferAttribute;
    const normals = this.mesh.geometry.getAttribute('normal') as THREE.BufferAttribute;
    const uvs = this.mesh.geometry.getAttribute('uv') as THREE.BufferAttribute;
    const shape = Math.sqrt(Math.max(0.25, Math.min(1, flatness)));
    const baseThickness = radius * shape, width = radius / shape;
    let distance = 0;
    this.normal.set(0, 0, 1);
    for (let i = 0; i < points.length; i++) {
      const thickness = baseThickness * Math.max(.1, Math.min(1, thicknessScales?.[i] ?? 1));
      const before = points[Math.max(0, i - 1)]!;
      const after = points[Math.min(points.length - 1, i + 1)]!;
      this.tangent.set(after[0] - before[0], after[1] - before[1], after[2] - before[2]);
      if (this.tangent.lengthSq() < 1e-12) this.tangent.set(1, 0, 0);
      this.tangent.normalize();
      if (flatness < 1) this.normal.set(0, 0, 1);
      this.normal.addScaledVector(this.tangent, -this.normal.dot(this.tangent));
      if (this.normal.lengthSq() < 1e-8) {
        this.normal.set(Math.abs(this.tangent.x) < 0.9 ? 1 : 0, Math.abs(this.tangent.x) < 0.9 ? 0 : 1, 0);
        this.normal.addScaledVector(this.tangent, -this.normal.dot(this.tangent));
      }
      this.normal.normalize();
      this.binormal.crossVectors(this.tangent, this.normal).normalize();
      const point = points[i]!;
      if (i > 0) distance += Math.hypot(point[0] - points[i - 1]![0], point[1] - points[i - 1]![1], point[2] - points[i - 1]![2]);
      for (let j = 0; j <= this.sides; j++) {
        const angle = j / this.sides * Math.PI * 2;
        this.radial.copy(this.normal).multiplyScalar(Math.cos(angle) * thickness).addScaledVector(this.binormal, Math.sin(angle) * width);
        const vertex = i * (this.sides + 1) + j;
        positions.setXYZ(vertex, point[0] + this.radial.x, point[1] + this.radial.y, point[2] + this.radial.z);
        this.radial.copy(this.normal).multiplyScalar(Math.cos(angle) / thickness).addScaledVector(this.binormal, Math.sin(angle) / width).normalize();
        normals.setXYZ(vertex, this.radial.x, this.radial.y, this.radial.z);
        uvs.setXY(vertex, j / this.sides, distance * 3.5);
      }
    }
    positions.needsUpdate = true;
    normals.needsUpdate = true;
    uvs.needsUpdate = true;
    this.mesh.geometry.setDrawRange(0, (points.length - 1) * this.sides * 6);
  }
}

/** On-demand 3D renderer: paused demonstrations do not keep a render loop alive. */
export class StudioScene {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.OrthographicCamera(-5, 5, 3.6, -3.6, 0.05, 80);
  readonly controls: OrbitControls;
  readonly renderer: THREE.WebGLRenderer;
  private readonly canvas: HTMLCanvasElement;
  private readonly cord: DynamicCord;
  private readonly ropeMaterial: THREE.MeshStandardMaterial;
  private readonly endMarkers = new CordEndMarkers();
  private readonly ropeTexture: THREE.DataTexture;
  private environment: THREE.WebGLRenderTarget;
  private readonly resizeObserver: ResizeObserver;
  private pixelRatioQuery: MediaQueryList | null = null;
  private readonly extraCords = new Map<string, { cord: DynamicCord; material: THREE.MeshStandardMaterial }>();
  private readonly beadMeshes = new Map<string, THREE.Mesh<THREE.LatheGeometry, THREE.MeshPhysicalMaterial>>();
  private readonly beadGeometryCache = new Map<string, THREE.LatheGeometry>();
  private readonly beadLabels = new Map<string, THREE.Sprite>();
  private readonly supportMeshes = new Map<string, THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>>();
  private readonly braidingDisks = new Map<string, BraidingDisk>();
  private readonly labelTextures = new Set<THREE.CanvasTexture>();
  private readonly upAxis = new THREE.Vector3(0, 1, 0);
  private frameId = 0;
  private disposed = false;
  private contextLost = false;
  private baseState: TeachingState | null = null;
  private renderedFrames = 0;
  private geometryUpdates = 0;
  private userOrbitPending = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.scene.background = new THREE.Color('#e6e7e9');
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.shadowMap.autoUpdate = false;
    this.environment = this.createEnvironment();
    this.scene.environment = this.environment.texture;
    this.scene.environmentIntensity = 0.4;

    this.scene.add(new THREE.HemisphereLight('#fffaf2', '#81958b', 2.1));
    const key = new THREE.DirectionalLight('#fff8eb', 3.2);
    key.position.set(-3, 5, 9);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -6;
    key.shadow.camera.right = 6;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -6;
    key.shadow.normalBias = 0.025;
    key.shadow.bias = -0.0002;
    key.shadow.radius = 5;
    this.scene.add(key);
    const fill = new THREE.DirectionalLight('#e6f5f2', 1.15);
    fill.position.set(4, -3, 4);
    this.scene.add(fill);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.ShadowMaterial({ opacity: 0.12 }));
    ground.position.z = -1.05;
    ground.receiveShadow = true;
    this.scene.add(ground);

    this.ropeTexture = this.createRopeTexture();
    this.ropeMaterial = new THREE.MeshStandardMaterial({ color: '#326558', roughness: 0.79, metalness: 0.03, bumpMap: this.ropeTexture, bumpScale: 0.018 });
    this.cord = new DynamicCord(this.ropeMaterial);
    this.scene.add(this.cord.mesh);
    this.scene.add(this.endMarkers.group);

    this.camera.position.set(0, -2.2, 10);
    this.camera.lookAt(0, 0, 0);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.enablePan = false;
    this.controls.minZoom = 0.35;
    this.controls.maxZoom = 4.2;
    this.controls.rotateSpeed = 0.65;
    this.controls.zoomSpeed = 0.75;
    this.controls.target.set(0, 0, 0);
    this.controls.saveState();
    this.controls.addEventListener('start', this.handleOrbitStart);
    this.controls.addEventListener('end', this.handleOrbitEnd);
    this.controls.addEventListener('change', this.handleOrbitChange);
    canvas.addEventListener('webglcontextlost', this.handleContextLost);
    canvas.addEventListener('webglcontextrestored', this.handleContextRestored);
    canvas.addEventListener('keydown', this.handleCameraKey);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    canvas.style.touchAction = 'none';
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.watchPixelRatio();
    this.resize();
    this.requestRender();
  }

  update(state: TeachingState) {
    if (this.disposed) return;
    this.baseState = state;
    this.updateSupports(state.supports ?? []);
    this.updateBeads(state.beads ?? []);
    this.updateCord();
    this.updateExtraCords(state.strands ?? []);
    this.endMarkers.update(state);
    this.requestRender();
  }

  private updateCord() {
    if (!this.baseState) return;
    const state = this.baseState;
    const radius = state.radius ?? (state.beads ? 0.025 : 0.06);
    const points = state.points;
    this.cord.update(points, radius, state.flatness, state.thicknessScales);
    this.geometryUpdates++;
    this.renderer.shadowMap.needsUpdate = true;
    this.ropeMaterial.color.set(state.color ?? (state.beads ? '#b87e52' : '#326558'));
    this.ropeMaterial.bumpScale = state.beads ? 0.004 : 0.018;
  }

  private updateExtraCords(strands: LessonStrand[]) {
    const visible = new Set(strands.map(strand => strand.id));
    for (const [id, item] of this.extraCords) {
      if (!visible.has(id)) item.cord.mesh.visible = false;
    }
    for (const strand of strands) {
      let item = this.extraCords.get(strand.id);
      if (!item) {
        const material = new THREE.MeshStandardMaterial({ color: strand.color, roughness: 0.72, metalness: 0.02, bumpMap: this.ropeTexture, bumpScale: 0.012 });
        const cord = new DynamicCord(material);
        item = { cord, material };
        this.extraCords.set(strand.id, item);
        this.scene.add(cord.mesh);
      }
      item.material.color.set(strand.color);
      item.cord.update(strand.points, strand.radius, strand.flatness, strand.thicknessScales);
      this.geometryUpdates++;
    }
    this.renderer.shadowMap.needsUpdate = true;
  }

  private updateSupports(supports: NonNullable<TeachingState['supports']>) {
    const cylinders = new Set(supports.filter(support => support.kind !== 'braiding-disk').map(support => `${support.kind}:${support.id}`));
    const disks = new Set(supports.filter(support => support.kind === 'braiding-disk').map(support => support.id));
    for (const [id, mesh] of this.supportMeshes) mesh.visible = cylinders.has(id);
    for (const [id, disk] of this.braidingDisks) disk.group.visible = disks.has(id);
    for (const support of supports) {
      if (support.kind === 'braiding-disk') {
        let disk = this.braidingDisks.get(support.id);
        if (!disk) {
          disk = new BraidingDisk();
          this.braidingDisks.set(support.id, disk); this.scene.add(disk.group);
        }
        disk.update(support);
        continue;
      }
      const key = `${support.kind}:${support.id}`;
      let mesh = this.supportMeshes.get(key);
      if (!mesh) {
        const geometry = support.kind === 'ring'
          ? new THREE.TorusGeometry(support.radius, support.length / 2, 16, 80)
          : new THREE.CylinderGeometry(1, 1, 1, 32);
        mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ roughness: .64, metalness: .12 }));
        mesh.userData.ringSize = `${support.radius}:${support.length}`;
        mesh.castShadow = true; mesh.receiveShadow = true;
        this.supportMeshes.set(key, mesh); this.scene.add(mesh);
      } else if (support.kind === 'ring' && mesh.userData.ringSize !== `${support.radius}:${support.length}`) {
        mesh.geometry.dispose();
        mesh.geometry = new THREE.TorusGeometry(support.radius, support.length / 2, 16, 80);
        mesh.userData.ringSize = `${support.radius}:${support.length}`;
      }
      mesh.visible = true;
      mesh.position.fromArray(support.position);
      const axis = new THREE.Vector3(...support.axis);
      if (axis.lengthSq() < 1e-8) axis.copy(this.upAxis);
      mesh.quaternion.setFromUnitVectors(support.kind === 'ring' ? new THREE.Vector3(0, 0, 1) : this.upAxis, axis.normalize());
      if (support.kind === 'ring') mesh.scale.set(1, 1, 1);
      else mesh.scale.set(support.radius, support.length, support.radius);
      mesh.material.color.set(support.color ?? '#b6b9ba');
    }
  }

  private updateBeads(beads: NonNullable<TeachingState['beads']>) {
    const visible = new Set(beads.map(bead => bead.id));
    for (const [id, mesh] of this.beadMeshes) mesh.visible = visible.has(id);
    for (const [id, label] of this.beadLabels) label.visible = visible.has(id);
    for (const bead of beads) {
      let item = this.beadMeshes.get(bead.id);
      const key = bead.radius.toFixed(4);
      let geometry = this.beadGeometryCache.get(key);
      if (!geometry) {
        const holeRadius = Math.max(0.055, Math.min(0.12, bead.radius * 0.36));
        const cutoff = Math.acos(Math.min(0.8, holeRadius / bead.radius));
        const profile: THREE.Vector2[] = [];
        for (let i = 0; i <= 36; i++) {
          const angle = -cutoff + 2 * cutoff * i / 36;
          profile.push(new THREE.Vector2(bead.radius * Math.cos(angle), bead.radius * Math.sin(angle)));
        }
        profile.push(profile[0]!.clone());
        geometry = new THREE.LatheGeometry(profile, 48);
        this.beadGeometryCache.set(key, geometry);
      }
      if (!item) {
        item = new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial({ color: bead.color, roughness: 0.23, metalness: 0.08, clearcoat: 0.72, clearcoatRoughness: 0.16 }));
        item.castShadow = true;
        item.receiveShadow = true;
        this.scene.add(item);
        this.beadMeshes.set(bead.id, item);
      }
      item.geometry = geometry;
      item.visible = true;
      item.position.fromArray(bead.position);
      item.scale.set(1, bead.axialScale ?? 1, 1);
      const axis = new THREE.Vector3(...bead.axis);
      if (axis.lengthSq() < 1e-8) axis.set(1, 0, 0);
      item.quaternion.setFromUnitVectors(this.upAxis, axis.normalize());
      item.material.color.set(bead.color);
      item.material.emissive.set(bead.active ? '#8a612c' : '#000000');
      item.material.emissiveIntensity = bead.active ? 0.13 : 0;
      // Some courses deliberately use unlabelled beads. Do not allocate a
      // canvas texture and sprite that will stay hidden for the whole lesson.
      if (bead.label === '') {
        const existingLabel = this.beadLabels.get(bead.id);
        if (existingLabel) existingLabel.visible = false;
        continue;
      }
      let label = this.beadLabels.get(bead.id);
      if (!label) {
        label = this.createLabel(bead.label ?? (bead.id === 'center' ? '心' : bead.id.replace('petal-', '')));
        this.beadLabels.set(bead.id, label);
        this.scene.add(label);
      }
      label.material.opacity = Math.min(bead.labelOpacity ?? 1, this.baseState?.guideOpacity ?? 1);
      label.visible = bead.label !== '' && label.material.opacity > 0;
      const outward = new THREE.Vector3(bead.position[0], bead.position[1], 0);
      if (outward.lengthSq() < 1e-8) outward.set(1, 0, 0);
      outward.normalize().multiplyScalar(bead.radius * Math.max(1, bead.axialScale ?? 1) + 0.25);
      label.position.set(bead.position[0] + outward.x, bead.position[1] + outward.y, bead.position[2] + 0.12);
    }
  }

  private createLabel(text: string) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 96;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = 'rgba(250, 249, 245, 0.94)';
      context.strokeStyle = '#d6ded5';
      context.lineWidth = 2;
      context.beginPath();
      context.arc(48, 48, 39, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.fillStyle = '#303534';
      context.font = '500 44px "PingFang SC", "Microsoft YaHei", sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, 48, 50);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.labelTextures.add(texture);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false, toneMapped: false }));
    sprite.scale.set(0.4, 0.4, 1);
    sprite.renderOrder = 10;
    return sprite;
  }

  setView(view: 'top' | 'front' | 'reset') {
    // Flush a previous orbit gesture so damping cannot move a newly selected view.
    const damping = this.controls.enableDamping;
    this.controls.enableDamping = false;
    this.controls.update();
    if (view === 'top') this.camera.position.set(0, 0.001, 10);
    else if (view === 'front') this.camera.position.set(0, -7, 6.5);
    else this.camera.position.set(0, -2.2, 10);
    this.camera.up.set(0, 1, 0);
    this.camera.zoom = 1;
    this.controls.target.set(0, 0, 0);
    this.camera.lookAt(this.controls.target);
    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.controls.enableDamping = damping;
    this.requestRender();
  }

  /** Fit only on request. Scrubbing never changes the learner's camera. */
  fitToModel() {
    if (!this.baseState || this.disposed || this.contextLost) return;
    const damping = this.controls.enableDamping;
    this.controls.enableDamping = false;
    this.controls.update();
    this.camera.updateMatrixWorld();
    const right = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 0);
    const up = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 1);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    const position = new THREE.Vector3();
    const include = (point: Vec3, radius: number) => {
      position.fromArray(point);
      const x = position.dot(right), y = position.dot(up);
      minX = Math.min(minX, x - radius); maxX = Math.max(maxX, x + radius);
      minY = Math.min(minY, y - radius); maxY = Math.max(maxY, y + radius);
    };
    const state = this.baseState;
    for (const cord of [{ points: state.points, radius: state.radius ?? .06, flatness: state.flatness }, ...(state.strands ?? [])]) {
      const radius = cord.radius / Math.sqrt(Math.max(.25, cord.flatness ?? 1));
      for (const point of cord.points) include(point, radius);
    }
    for (const bead of state.beads ?? []) include(bead.position, bead.radius * Math.max(1, bead.axialScale ?? 1));
    for (const support of state.supports ?? []) {
      if (support.kind === 'ring') include(support.position, support.radius + support.length / 2);
      else for (const sign of [-1, 1]) {
        include(support.position.map((v, i) => v + sign * support.axis[i]! * support.length / 2) as Vec3, support.radius);
      }
    }
    if (Number.isFinite(minX + maxX + minY + maxY)) {
      // Leave room for endpoint labels, view controls and the rotation hint.
      const zoom = Math.min((this.camera.right - this.camera.left) * .72 / Math.max(.5, maxX - minX), (this.camera.top - this.camera.bottom) * .72 / Math.max(.5, maxY - minY));
      const offset = right.multiplyScalar((minX + maxX) / 2 - this.controls.target.dot(right));
      offset.addScaledVector(up, (minY + maxY) / 2 - this.controls.target.dot(up));
      this.controls.target.add(offset);
      this.camera.position.add(offset);
      this.camera.zoom = Math.max(this.controls.minZoom, Math.min(this.controls.maxZoom, zoom));
      this.camera.updateProjectionMatrix();
      this.controls.update();
    }
    this.controls.enableDamping = damping;
    this.requestRender();
  }

  resize() {
    if (this.disposed) return;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    if (this.renderer.getPixelRatio() !== pixelRatio) this.renderer.setPixelRatio(pixelRatio);
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    const aspect = width / height;
    const halfHeight = Math.max(3.5, 3.6 / aspect);
    this.camera.left = -halfHeight * aspect;
    this.camera.right = halfHeight * aspect;
    this.camera.top = halfHeight;
    this.camera.bottom = -halfHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.requestRender();
  }

  private watchPixelRatio() {
    this.pixelRatioQuery?.removeEventListener('change', this.handlePixelRatioChange);
    this.pixelRatioQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
    this.pixelRatioQuery.addEventListener('change', this.handlePixelRatioChange);
  }

  private handlePixelRatioChange = () => {
    if (this.disposed) return;
    // A display/zoom change can alter DPR without changing the canvas CSS size.
    // Re-arm against the actual DPR, including values above the rendering cap.
    this.watchPixelRatio();
    this.resize();
  };

  getCameraState() {
    return { position: this.camera.position.toArray(), quaternion: this.camera.quaternion.toArray(), zoom: this.camera.zoom, target: this.controls.target.toArray() };
  }

  getRenderStats() {
    return {
      renderedFrames: this.renderedFrames, geometryUpdates: this.geometryUpdates, framePending: this.frameId !== 0,
      visibleCords: Number(this.cord.mesh.visible) + [...this.extraCords.values()].filter(item => item.cord.mesh.visible).length,
      visibleBeads: [...this.beadMeshes.values()].filter(mesh => mesh.visible).length,
      visibleSupports: [...this.supportMeshes.values()].filter(mesh => mesh.visible).length
        + [...this.braidingDisks.values()].filter(disk => disk.group.visible).length,
      cachedBeadLabels: this.beadLabels.size,
      endCaps: this.endMarkers.getState(),
    };
  }

  private handleOrbitStart = () => { this.userOrbitPending = true; };
  private handleOrbitEnd = () => { this.userOrbitPending = false; };
  private handleOrbitChange = () => {
    if (this.userOrbitPending) {
      this.userOrbitPending = false;
      this.canvas.dispatchEvent(new Event('studio-camera-interaction'));
    }
    this.requestRender();
  };

  private handleCameraKey = (event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey || this.disposed || this.contextLost) return;
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', '_'].includes(event.key)) return;
    event.preventDefault();
    const damping = this.controls.enableDamping;
    this.controls.enableDamping = false;
    this.controls.update();
    if (event.key.startsWith('Arrow')) {
      const offset = this.camera.position.clone().sub(this.controls.target);
      const spherical = new THREE.Spherical().setFromVector3(offset);
      const step = 0.12;
      if (event.key === 'ArrowLeft') spherical.theta -= step;
      if (event.key === 'ArrowRight') spherical.theta += step;
      if (event.key === 'ArrowUp') spherical.phi -= step;
      if (event.key === 'ArrowDown') spherical.phi += step;
      spherical.phi = Math.max(this.controls.minPolarAngle + 1e-5, Math.min(this.controls.maxPolarAngle - 1e-5, spherical.phi));
      this.camera.position.copy(this.controls.target).add(offset.setFromSpherical(spherical));
      this.camera.lookAt(this.controls.target);
    } else {
      const factor = event.key === '+' || event.key === '=' ? 1.1 : 1 / 1.1;
      this.camera.zoom = Math.max(this.controls.minZoom, Math.min(this.controls.maxZoom, this.camera.zoom * factor));
      this.camera.updateProjectionMatrix();
    }
    this.controls.update();
    this.controls.enableDamping = damping;
    this.canvas.dispatchEvent(new Event('studio-camera-interaction'));
    this.requestRender();
  };

  private handleContextLost = (event: Event) => {
    event.preventDefault();
    this.contextLost = true;
    cancelAnimationFrame(this.frameId);
    this.frameId = 0;
    this.canvas.dispatchEvent(new CustomEvent('studio-error', { detail: '三维画面暂时中断，请刷新页面重试。', bubbles: true }));
  };

  private createEnvironment() {
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const room = new RoomEnvironment();
    try {
      return pmrem.fromScene(room, 0.04);
    } finally {
      room.dispose();
      pmrem.dispose();
    }
  }

  private handleContextRestored = () => {
    // Render-target pixels are lost with the context and have no CPU image to
    // upload again. Recreate the lighting before showing the restored model.
    const previousEnvironment = this.environment;
    this.environment = this.createEnvironment();
    this.scene.environment = this.environment.texture;
    previousEnvironment.dispose();
    this.contextLost = false;
    this.canvas.dispatchEvent(new CustomEvent('studio-restored', { bubbles: true }));
    this.updateCord();
    this.updateExtraCords(this.baseState?.strands ?? []);
    this.requestRender();
  };

  private handleVisibilityChange = () => {
    if (document.hidden) {
      cancelAnimationFrame(this.frameId);
      this.frameId = 0;
    } else this.requestRender();
  };

  private requestRender = () => {
    if (this.disposed || this.contextLost || document.hidden || this.frameId) return;
    this.frameId = requestAnimationFrame(this.renderFrame);
  };

  private renderFrame = () => {
    this.frameId = 0;
    if (this.disposed || this.contextLost || document.hidden) return;
    // Damping emits change events until it settles, requesting only those frames.
    this.controls.update();
    this.camera.updateMatrixWorld();
    this.endMarkers.layout(this.camera, this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.render(this.scene, this.camera);
    this.renderedFrames++;
  };

  private createRopeTexture() {
    const size = 128;
    const pixels = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const fiber = Math.sin((x / size * 8 + y / size * 2) * Math.PI * 2);
        const micro = Math.sin((x / size * 24 - y / size * 4) * Math.PI * 2);
        const value = Math.round(128 + 58 * fiber + 18 * micro);
        const offset = (y * size + x) * 4;
        pixels[offset] = pixels[offset + 1] = pixels[offset + 2] = value;
        pixels[offset + 3] = 255;
      }
    }
    const texture = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
    return texture;
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    this.resizeObserver.disconnect();
    this.pixelRatioQuery?.removeEventListener('change', this.handlePixelRatioChange);
    this.pixelRatioQuery = null;
    this.controls.removeEventListener('start', this.handleOrbitStart);
    this.controls.removeEventListener('end', this.handleOrbitEnd);
    this.controls.removeEventListener('change', this.handleOrbitChange);
    this.controls.dispose();
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    this.canvas.removeEventListener('webglcontextlost', this.handleContextLost);
    this.canvas.removeEventListener('webglcontextrestored', this.handleContextRestored);
    this.canvas.removeEventListener('keydown', this.handleCameraKey);
    // The helper owns its geometry, materials and atlas. Detach it before the
    // generic traversal so each GPU resource is disposed exactly once.
    for (const disk of this.braidingDisks.values()) {
      this.scene.remove(disk.group);
      disk.dispose();
    }
    this.braidingDisks.clear();
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    this.scene.traverse(object => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
        geometries.add(object.geometry);
        const values = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of values) materials.add(material);
      }
      if (object instanceof THREE.Sprite) materials.add(object.material);
      if (object instanceof THREE.DirectionalLight) object.shadow.dispose();
    });
    for (const geometry of this.beadGeometryCache.values()) geometries.add(geometry);
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    this.ropeTexture.dispose();
    this.endMarkers.disposeTextures();
    for (const texture of this.labelTextures) texture.dispose();
    this.environment.dispose();
    this.renderer.dispose();
  }
}

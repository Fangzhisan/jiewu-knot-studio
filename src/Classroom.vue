<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import { Box, RotateCcw, ChevronRight, Rotate3D, CircleHelp, Maximize2 } from '@lucide/vue'
import LessonMark from './components/LessonMark.vue'
import CourseBrowser from './components/ClassroomCoursePicker.vue'
import PlaybackBar from './components/PlaybackBar.vue'
import { StudioScene } from './scene'
import { CATEGORIES, COURSES, getCourse } from './lessons/catalog'
import { getApplication, scenarioName } from './courseScenarios'
import type { CategoryId, Course } from './lessons/types'
import { practice } from './practice'
const props = defineProps<{ courseId: string }>()
const emit = defineEmits<{ select: [id: string]; browse: [category: CategoryId] }>()

const initialCourse = getCourse(props.courseId)
const lesson = ref(initialCourse.id)
const progress = ref(practice.progress[initialCourse.id] ?? initialCourse.initialProgress)
const playing = ref(false)
const seekTarget = ref<number | null>(null)
const speed = ref(practice.speed)
const canvas = ref<HTMLCanvasElement|null>(null)
const instructionContent = ref<HTMLElement|null>(null)
const ready = ref(false)
const error = ref('')
const courseStatus = ref<'loading' | 'ready' | 'error'>('loading')
const courseError = ref('')
const showSources = ref(false)
const showLineDiagram = ref(false)
const currentView = ref('reset')
let studio: StudioScene|undefined
let diagramMedia: MediaQueryList | undefined
let raf = 0
let seekRaf = 0
let lastTime = 0
let courseRequest = 0
let disposed = false

const config = computed(() => getCourse(lesson.value))
const application = computed(() => getApplication(config.value))
const criticalScope = computed(() => application.value.scenarios.some(id => ['mountaineering', 'climbing', 'rescue'].includes(id)))
const category = computed(() => CATEGORIES.find(item => item.id === config.value.category)!)
const courseReady = computed(() => courseStatus.value === 'ready')
const state = computed(() => {
  if (!courseReady.value) return null
  const phase = Math.max(0, Math.min(1, (progress.value - config.value.steps[4]!.time) / (1 - config.value.steps[4]!.time)))
  return { ...config.value.getState(progress.value), guideOpacity: 1 - phase * phase * (3 - 2 * phase) }
})
const stepIndex = computed(() => config.value.steps.reduce((index, step, i) => progress.value >= step.time ? i : index, 0))
const currentStep = computed(() => config.value.steps[stepIndex.value]!)
const playbackAvailable = computed(() => ready.value && !error.value && courseReady.value)
watch([lesson,stepIndex],()=>{if(instructionContent.value)instructionContent.value.scrollTop=0},{flush:'post'})
const lineDiagrams = computed(() => {
  const model = state.value
  if (!model) return []
  const lines = [model.points, ...(model.strands ?? []).map(strand => strand.points)]
  const points = lines.flat()
  if (!points.length) return []
  const xs = points.map(p => p[0]), ys = points.map(p => p[1])
  const minx = Math.min(...xs), maxx = Math.max(...xs), miny = Math.min(...ys), maxy = Math.max(...ys)
  const scale = Math.min(190 / Math.max(maxx - minx, 1), 110 / Math.max(maxy - miny, 1))
  return lines.map(line => line.filter((_, i) => i % 3 === 0 || i === line.length - 1)
    .map(p => `${120 + (p[0] - (maxx + minx) / 2) * scale},${75 - (p[1] - (maxy + miny) / 2) * scale}`).join(' '))
})

function renderScene(){
  if(!studio||!state.value) return
  studio.update(state.value)
}
function cancelSeekTransition() {
  if (seekRaf) cancelAnimationFrame(seekRaf)
  seekRaf = 0
  seekTarget.value = null
}
function beginSeek() { playing.value = false; cancelSeekTransition() }
function seek(value: number, animate = true) {
  if (!courseReady.value) return
  beginSeek()
  const target = Math.min(1, Math.max(0, value))
  const from = progress.value
  if (!animate || !ready.value || error.value || document.hidden || Math.abs(target - from) < 1e-8
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    progress.value = target
    return
  }
  seekTarget.value = target
  const started = performance.now()
  const frame = (time: number) => {
    seekRaf = 0
    if (disposed || !courseReady.value) { cancelSeekTransition(); return }
    const t = Math.min(1, Math.max(0, (time - started) / 220))
    const eased = t * t * (3 - 2 * t)
    progress.value = t === 1 ? target : from + (target - from) * eased
    if (t < 1) seekRaf = requestAnimationFrame(frame)
    else seekTarget.value = null
  }
  seekRaf = requestAnimationFrame(frame)
}
watch([progress, speed], () => {
  practice.progress[lesson.value] = progress.value
  practice.speed = speed.value
})
async function prepareLesson(course: Course, request: number, resetCamera: boolean) {
  try {
    if (course.prepare) await course.prepare()
    if (disposed || request !== courseRequest || lesson.value !== course.id) return
    courseStatus.value = 'ready'
    if (resetCamera) setView('reset')
  } catch {
    if (disposed || request !== courseRequest || lesson.value !== course.id) return
    courseError.value = '这节课暂时加载失败，请重试。'
    courseStatus.value = 'error'
  }
}
function loadLesson(id: string, restoreProgress: boolean, resetCamera: boolean) {
  if (disposed) return
  beginSeek()
  practice.progress[lesson.value] = progress.value
  const course = getCourse(id)
  const request = ++courseRequest
  // The synchronous scene watcher must stop reading the old model before the
  // selected course changes to one whose data has not finished preparing.
  courseStatus.value = 'loading'
  courseError.value = ''
  lesson.value = course.id
  practice.lastLesson = course.id
  if (restoreProgress) progress.value = practice.progress[course.id] ?? course.initialProgress
  void prepareLesson(course, request, resetCamera)
}
function selectLesson(id: string) { emit('select', id) }
watch(() => props.courseId, id => { if (id !== lesson.value) loadLesson(id, true, true) })
function retryLesson() { loadLesson(lesson.value, false, true) }
function selectCategory(id: CategoryId) {
  if (id === config.value.category) return
  selectLesson(COURSES.find(item => item.category === id)!.id)
}
function jumpStep(index:number){seek(config.value.steps[Math.max(0,Math.min(config.value.steps.length-1,index))]!.time)}
function requestedStepIndex() { return config.value.steps.reduce((index, step, i) => (seekTarget.value ?? progress.value) >= step.time ? i : index, 0) }
function previousStep(){jumpStep(requestedStepIndex()-1)}
function nextStep(){const index=requestedStepIndex();if(index===config.value.steps.length-1)seek(1);else jumpStep(index+1)}
function togglePlay(){if(!playbackAvailable.value)return;cancelSeekTransition();if(progress.value>=1)progress.value=0;playing.value=!playing.value}
function restart(){if(!playbackAvailable.value)return;seek(0,false);playing.value=true}
function setView(view:'top'|'front'|'reset'){if(!courseReady.value)return;currentView.value=view;studio?.setView(view)}
function fitView(){if(!courseReady.value)return;currentView.value='custom';studio?.fitToModel()}
function guardSceneKeyboard(event: KeyboardEvent) {
  if (!courseReady.value) { event.preventDefault(); event.stopImmediatePropagation() }
}
// Queue the scene's frame before scheduling the next playback frame. Deferring
// this watcher made playback update geometry twice for every visible render.
watch(state,renderScene,{flush:'sync'})
function stopPlaybackLoop(){
  if(raf)cancelAnimationFrame(raf)
  raf=0;lastTime=0
}
function playbackFrame(time:number){
  raf=0
  if(!playing.value||document.hidden||!playbackAvailable.value)return
  const delta=Math.min(Math.max(0,(time-lastTime)/1000),.08)
  lastTime=time
  progress.value=Math.min(1,progress.value+delta*speed.value/config.value.duration)
  if(progress.value>=1){playing.value=false;return}
  raf=requestAnimationFrame(playbackFrame)
}
function startPlaybackLoop(){
  if(raf||!playing.value||document.hidden||!playbackAvailable.value)return
  lastTime=performance.now()
  raf=requestAnimationFrame(playbackFrame)
}
watch(playing,value=>{if(value)startPlaybackLoop();else stopPlaybackLoop()},{flush:'sync'})
function onVisibilityChange(){
  if(document.hidden){beginSeek();stopPlaybackLoop()}
}
function onContextLost(){error.value='三维画面暂时中断，正在等待恢复。';beginSeek()}
function onContextRestored(){error.value='';renderScene()}
function syncDiagramVisibility() { showLineDiagram.value = diagramMedia?.matches === false }
onMounted(async()=>{
  await nextTick()
  if (disposed) return
  diagramMedia = window.matchMedia('(max-width: 1000px)')
  syncDiagramVisibility()
  diagramMedia.addEventListener('change', syncDiagramVisibility)
  document.addEventListener('visibilitychange',onVisibilityChange)
  try{
    studio=new StudioScene(canvas.value!);renderScene();ready.value=true
    canvas.value?.addEventListener('webglcontextlost',onContextLost)
    canvas.value?.addEventListener('webglcontextrestored',onContextRestored)
    startPlaybackLoop()
  }catch(e){error.value='当前浏览器无法显示三维画面，请使用支持 WebGL 2 的新版浏览器。';console.error(e)}
  if(import.meta.env.DEV)(window as any).__JIEWU__={getState:()=>({lesson:lesson.value,category:config.value.category,courseCount:COURSES.length,progress:progress.value,playing:playing.value,speed:speed.value,step:stepIndex.value,courseStatus:courseStatus.value,courseError:courseError.value,tip:state.value?.tip,camera:studio?.getCameraState()}),getGeometry:()=>state.value,getRenderStats:()=>studio?.getRenderStats()}
  loadLesson(lesson.value, false, false)
})
onUnmounted(()=>{
  disposed = true
  ++courseRequest
  cancelSeekTransition()
  diagramMedia?.removeEventListener('change', syncDiagramVisibility)
  diagramMedia = undefined
  stopPlaybackLoop()
  document.removeEventListener('visibilitychange',onVisibilityChange)
  canvas.value?.removeEventListener('webglcontextlost',onContextLost)
  canvas.value?.removeEventListener('webglcontextrestored',onContextRestored)
  studio?.dispose()
  if(import.meta.env.DEV)delete (window as any).__JIEWU__
})
</script>

<template>
  <main class="studio-shell compact-classroom">
    <div class="lesson-heading"><div class="lesson-title-row"><h1>{{ config.title }}</h1></div>
      <div class="compact-course-meta"><span class="course-purpose">{{ application.task }}</span><span v-for="scene in application.scenarios" :key="scene" class="compact-tag">{{ scenarioName(scene) }}</span></div>
      <p v-if="criticalScope && application.boundary" class="critical-scope">{{ application.boundary }}</p>
    </div>
    <div class="workspace">
      <aside class="lesson-sidebar panel">
        <CourseBrowser :lesson="lesson" :category="category.id" @select="selectLesson" @category="selectCategory" @browse="emit('browse', category.id)"/>
        <ol class="step-list" aria-label="教学步骤"><li v-for="(step,i) in config.steps" :key="i"><button :disabled="!courseReady" :class="{active:stepIndex===i}" :aria-current="stepIndex===i?'step':undefined" :title="step.title" @click="jumpStep(i)"><span class="step-number">{{ String(i+1).padStart(2,'0') }}</span><span class="step-label">{{ step.title }}</span></button></li></ol>
      </aside>
      <section class="scene-panel panel" aria-label="三维教学操作区" :aria-busy="courseStatus==='loading'">
        <div class="canvas-toolbar"><span class="scene-label">{{ progress >= 1 ? '本课完成形态' : '三维演示' }}</span><div class="view-controls"><button :disabled="!courseReady" :class="{active:currentView==='top'}" :aria-pressed="currentView==='top'" @click="setView('top')" aria-label="切换俯视"><Box :size="19"/><span>俯视</span></button><button :disabled="!courseReady" :class="{active:currentView==='front'}" :aria-pressed="currentView==='front'" @click="setView('front')" aria-label="切换正视"><Box :size="19" class="front-icon"/><span>正视</span></button><button :disabled="!courseReady" @click="fitView" aria-label="适合画面" title="按当前模型适配画面"><Maximize2 :size="19"/><span>适配</span></button><button :disabled="!courseReady" @click="setView('reset')" aria-label="复位视角"><RotateCcw :size="19"/><span>复位视角</span></button></div></div>
        <canvas ref="canvas" class="scene-canvas" :class="{'is-course-pending':!courseReady}" :tabindex="courseReady?0:-1" :aria-hidden="!courseReady" @studio-camera-interaction="currentView='custom'" @keydown.capture="guardSceneKeyboard" @keydown.0.exact.prevent="setView('reset')" aria-describedby="camera-keyboard-help" aria-label="可旋转的三维教学模型。拖动空白处旋转，滚轮或双指缩放。端帽数字区分绳线，A、B 区分两端。"/>
        <span v-show="courseReady" id="camera-keyboard-help" class="canvas-keyboard-help">方向键旋转 · + / − 缩放 · 0 复位</span>
        <div v-if="!ready||error||!courseReady" class="canvas-status" role="status">
          <p v-if="courseStatus==='loading'">正在加载这节课…</p>
          <template v-else-if="courseStatus==='error'"><p>{{ courseError }}</p><button class="course-retry" @click="retryLesson">重新加载</button></template>
          <p v-else>{{ error||'正在准备三维画面…' }}</p>
        </div>
        <div v-show="courseReady" class="canvas-hint"><Rotate3D :size="16"/><span>拖动空白处旋转</span><span class="hint-dot">·</span><span>滚轮 / 双指缩放</span></div>
      </section>
      <aside class="instruction-panel panel">
        <div class="step-eyebrow">当前步骤 <span>{{ String(stepIndex+1).padStart(2,'0') }} <i>/ {{ String(config.steps.length).padStart(2,'0') }}</i></span></div>
        <!-- Keep lesson copy out of canvas/slider sizing, even for long lessons. -->
        <div ref="instructionContent" class="instruction-content" role="region" aria-label="当前步骤说明" tabindex="0">
          <h2>{{ currentStep.title }}</h2><p class="instruction-copy">{{ currentStep.instruction }}</p>
        </div>
        <div v-if="showLineDiagram && !state?.supports?.length" class="mini-diagram"><svg viewBox="0 0 240 150" role="img" aria-label="当前步骤的线路示意"><g v-for="(line,i) in lineDiagrams" :key="i"><polyline :points="line" fill="none" stroke="#bcbcbc" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/><polyline :points="line" fill="none" stroke="#555" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/></g></svg><span>当前线路示意</span></div>
        <div class="materials"><h3>所需材料<span/></h3><div class="material-detail"><LessonMark :kind="category.mark"/><div><strong>{{ config.material }}</strong><p>{{ config.materialNote }}</p></div></div></div>
      </aside>
    </div>
    <PlaybackBar :progress="progress" :seek-target="seekTarget" :playing="playing" :speed="speed" :steps="config.steps" :disabled="!playbackAvailable" :seeking-disabled="!courseReady" @seek-start="beginSeek" @seek="seek" @play="togglePlay" @previous="previousStep" @next="nextStep" @speed="speed=$event" @restart="restart"/>
    <footer class="studio-footer"><span>端帽数字区分绳线，A / B 区分两端。</span><button @click="showSources=!showSources" :aria-expanded="showSources"><CircleHelp :size="15"/>关于这节课</button></footer>
    <div v-if="showSources" class="source-note"><p>{{ config.description }}</p><p v-if="application.boundary"><strong>演示范围：</strong>{{ application.boundary }}</p><p>课程动画为结构示意，尚未完成实物工艺验收。</p><a :href="config.source" target="_blank" rel="noopener noreferrer">工艺参考：{{ config.sourceName }}<ChevronRight :size="15"/></a></div>
  </main>
</template>

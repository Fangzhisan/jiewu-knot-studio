<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ArrowLeft, BookOpen } from '@lucide/vue'
import Classroom from './Classroom.vue'
import LibraryBrowser from './components/LibraryBrowser.vue'
import GuideReader from './components/GuideReader.vue'
import { COURSES } from './lessons/catalog'
import { getGuide } from './guides/catalog'
import { EMPTY_FILTERS, LIBRARY_ENTRIES, type LibraryEntry, type LibraryFilters } from './library'
import { practice } from './practice'
import type { CategoryId } from './lessons/types'

const lastLesson = () => practice.lastLesson
function readRoute() {
  let parsed: URL
  try { parsed = new URL(location.hash.slice(1) || `/lesson/${lastLesson()}`, 'https://local.invalid') }
  catch { parsed = new URL('/library', 'https://local.invalid') }
  const [view, id = ''] = parsed.pathname.split('/').filter(Boolean)
  const known = view === 'lesson' ? COURSES.some(course => course.id === id) : view === 'guide' ? !!getGuide(id) : view === 'library'
  return { view: known ? view as 'lesson' | 'guide' | 'library' : 'library' as const, id, params: parsed.searchParams, missing: !known }
}
const route = ref(readRoute())
const activeGuide = computed(() => getGuide(route.value.id))
const filters = computed<LibraryFilters>(() => ({
  kind: ['all','interactive','foundation','project'].includes(route.value.params.get('kind') ?? '') ? route.value.params.get('kind')! : 'all',
  category: ['knots','weaving','beads'].includes(route.value.params.get('category') ?? '') ? route.value.params.get('category')! : 'all',
  scenario: route.value.params.get('scenario') ?? '', query: route.value.params.get('q') ?? '',
}))
const guideStep = computed(() => {
  const value = Number(route.value.params.get('step') ?? -1)
  return Number.isInteger(value) && value >= 0 && value <= (activeGuide.value?.steps.length ?? 0) ? value : -1
})
const returnTarget = computed(() => {
  const target = route.value.params.get('return')
  return target && /^#\/(?:library|lesson\/|guide\/)/.test(target) ? target : '#/library'
})
const backLabel = computed(() => returnTarget.value.startsWith('#/guide/') ? '返回原攻略' : returnTarget.value.startsWith('#/lesson/') ? '返回三维课堂' : '返回课程目录')
function readNavigation() { route.value = readRoute(); if (route.value.view !== 'guide') window.scrollTo({ top: 0, behavior: 'instant' }) }
function navigate(hash: string) { if (location.hash === hash) readNavigation(); else location.hash = hash }
function filterHash(value: LibraryFilters): string {
  const params = new URLSearchParams()
  if (value.kind !== 'all') params.set('kind',value.kind)
  if (value.category !== 'all') params.set('category',value.category)
  if (value.scenario) params.set('scenario',value.scenario)
  if (value.query) params.set('q',value.query)
  return '#/library' + (params.size ? '?' + params.toString() : '')
}
function setFilters(value: LibraryFilters) { history.replaceState(null,'',filterHash(value)); route.value = readRoute() }
function library(kind = 'all', category = 'all') { navigate(filterHash({ ...EMPTY_FILTERS, kind, category })) }
function openEntry(entry: LibraryEntry) {
  const from = location.hash || `#/lesson/${route.value.id}`
  const params = new URLSearchParams({ return: from })
  navigate(`#/${entry.kind === 'interactive' ? 'lesson' : 'guide'}/${entry.id}?${params}`)
}
function selectLesson(id: string) {
  const params = new URLSearchParams()
  if (route.value.params.has('return')) params.set('return',returnTarget.value)
  navigate(`#/lesson/${id}${params.size?'?'+params:''}`)
}
function setGuideStep(index: number) {
  const params = new URLSearchParams(route.value.params)
  if (index < 0) params.delete('step'); else params.set('step',String(index))
  history.replaceState(null,'',`#/guide/${route.value.id}${params.size?'?'+params:''}`)
  route.value = readRoute()
}
onMounted(() => { window.addEventListener('hashchange',readNavigation); })
onUnmounted(() => { window.removeEventListener('hashchange',readNavigation); })
</script>

<template>
  <header class="encyclopedia-header"><a class="brand" href="#/library" aria-label="结物课程目录"><svg viewBox="0 0 52 52" aria-hidden="true"><path d="M25 27C10 7 44 1 36 20S9 43 8 26S33 15 42 28S16 48 24 29" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg><span>结物</span></a><span class="encyclopedia-tagline">绳结 · 编织 · 珠串</span><nav class="main-nav" aria-label="课程导航"><button :class="{selected:route.view==='lesson'}" @click="navigate(`#/lesson/${lastLesson()}`)">三维课堂</button><button :class="{selected:route.view==='library'&&filters.kind==='foundation'||route.view==='guide'&&activeGuide?.kind==='foundation'}" @click="library('foundation')">基础补课</button><button :class="{selected:route.view==='library'&&filters.kind==='project'||route.view==='guide'&&activeGuide?.kind==='project'}" @click="library('project')">进阶攻略</button><button :class="{selected:route.view==='library'&&['all','interactive'].includes(filters.kind)}" @click="library()"><BookOpen :size="14"/>全部课程</button></nav><span class="encyclopedia-count">{{ LIBRARY_ENTRIES.length }} 项课程</span></header>
  <p v-if="route.missing" class="route-message" role="status">未找到这节课程，已显示课程目录。</p>
  <template v-if="route.view==='lesson'"><div v-if="route.params.has('return')" class="return-strip"><button @click="navigate(returnTarget)"><ArrowLeft :size="13"/>{{ backLabel }}</button><span v-if="returnTarget.startsWith('#/guide/')">学完技法后，可返回攻略原步骤继续制作</span></div><Classroom :course-id="route.id" @select="selectLesson" @browse="(category:CategoryId)=>library('interactive',category)"/></template>
  <GuideReader v-else-if="route.view==='guide'&&activeGuide" :key="activeGuide.id" :guide="activeGuide" :step="guideStep" :back-label="backLabel" @back="navigate(returnTarget)" @open="openEntry" @step="setGuideStep"/>
  <LibraryBrowser v-else :filters="filters" @filter="setFilters" @open="openEntry"/>
</template>

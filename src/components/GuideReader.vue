<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { ArrowUpRight, ArrowLeft, Check, Clock, Layers, ChevronRight } from '@lucide/vue'
import type { MakingGuide } from '../guides/types'
import { practice } from '../practice'
import { LIBRARY_ENTRIES, type LibraryEntry } from '../library'
import { scenarioName } from '../courseScenarios'
import ProjectDiagram from './ProjectDiagram.vue'
const props = defineProps<{ guide: MakingGuide; step: number; backLabel: string }>()
const emit = defineEmits<{ open: [entry: LibraryEntry]; step: [index: number]; back: [] }>()
const checked = ref<boolean[]>([]), outlineOpen = ref(false)
const completed = computed(() => checked.value.filter(Boolean).length)
const linked = (ids: string[]) => ids.map(id => LIBRARY_ENTRIES.find(entry => entry.id === id)).filter((entry): entry is LibraryEntry => !!entry)
const techniques = computed(() => linked(props.guide.techniqueIds))
const applications = computed(() => props.guide.kind === 'foundation' ? LIBRARY_ENTRIES.filter(entry => entry.guide?.kind === 'project' && entry.guide.techniqueIds.includes(props.guide.id)).slice(0,6) : linked(props.guide.relatedGuideIds ?? []))
function loadChecks() { checked.value = practice.checks[props.guide.id] ?? props.guide.steps.map(() => false) }
function toggleStep(index: number) { checked.value[index] = !checked.value[index]; practice.checks[props.guide.id] = checked.value }
async function revealStep(index = props.step) {
  await nextTick()
  if (index >= 0) document.getElementById(`guide-step-${index}`)?.scrollIntoView({ block: 'start', behavior: 'instant' })
  else window.scrollTo({ top: 0, behavior: 'instant' })
}
function goToStep(index: number) { emit('step', index); outlineOpen.value = false; void revealStep(index) }
watch(() => props.guide.id, () => { loadChecks(); void revealStep() })
watch(() => props.step, revealStep)
onMounted(() => { loadChecks(); void revealStep() })
</script>
<template>
  <main class="guide-shell">
    <div class="guide-breadcrumb"><button @click="emit('back')"><ArrowLeft :size="14"/>{{ backLabel }}</button><ChevronRight :size="12"/><span>{{ guide.kind==='project'?'进阶攻略':'基础补课' }}</span></div>
    <div class="guide-title"><div><h1>{{ guide.title }}</h1><p>{{ guide.subtitle }}</p><div class="guide-meta"><span><Layers :size="13"/>{{ guide.difficulty }}</span><span><Clock :size="13"/>约 {{ guide.minutes }} 分钟</span><span v-for="scene in guide.scenarios" :key="scene">{{ scenarioName(scene) }}</span></div></div></div>
    <div class="guide-layout">
      <nav class="guide-outline" :class="{expanded:outlineOpen}" aria-label="攻略目录"><span class="outline-heading">制作路线</span><button class="outline-toggle" :aria-expanded="outlineOpen" @click="outlineOpen=!outlineOpen">{{ outlineOpen?'收起目录':'展开目录' }}</button><div class="outline-links"><button :class="{active:step<0}" @click="goToStep(-1)">准备材料与尺寸</button><button v-for="(item,i) in guide.steps" :key="i" :class="{active:step===i}" @click="goToStep(i)"><span>{{ String(i+1).padStart(2,'0') }}</span>{{ item.title }}<Check v-if="checked[i]" :size="12"/></button><button :class="{active:step===guide.steps.length}" @click="goToStep(guide.steps.length)">成品检查与排错</button></div><div class="guide-check-progress"><span>练习进度</span><strong>{{ completed }} / {{ guide.steps.length }}</strong><progress :max="guide.steps.length" :value="completed"/><small>仅在当前页面临时保留，刷新后重置</small></div></nav>
      <article class="guide-content">
        <section class="guide-overview"><div><span class="section-kicker">做完会得到</span><h2>{{ guide.outcome }}</h2><p>{{ guide.overview }}</p><p v-if="guide.boundary" class="guide-boundary">{{ guide.boundary }}</p><span class="guide-format">步骤攻略 · 配套技法可跳转学习</span></div><ProjectDiagram :diagram="guide.diagram" :guide="guide"/></section>
        <section class="guide-materials"><h2>材料与用量</h2><p class="section-note">以下为本篇示例；先按自己的尺寸和材料试做，再确定最终用量。</p><div class="material-table-wrap"><table><thead><tr><th>材料</th><th>示例用量</th><th>选择与准备</th></tr></thead><tbody><tr v-for="item in guide.materials" :key="item.name"><td>{{ item.name }}</td><td>{{ item.amount }}</td><td>{{ item.note }}</td></tr></tbody></table></div><ul class="preparation-list"><li v-for="item in guide.preparation" :key="item">{{ item }}</li></ul></section>
        <section v-if="techniques.length" class="guide-techniques"><h2>这篇攻略会用到</h2><p class="section-note">遇到不熟悉的动作，先打开对应技法；返回后仍在当前步骤。</p><div class="technique-links"><button v-for="entry in techniques" :key="entry.id" @click="emit('open',entry)"><span>{{ entry.kind==='interactive'?'3D':'基础' }}</span>{{ entry.title }}<ArrowUpRight :size="14"/></button></div></section>
        <section v-for="(item,i) in guide.steps" :id="`guide-step-${i}`" :key="i" class="making-step" :class="{checked:checked[i]}"><div class="making-step-title"><span class="making-step-number">{{ String(i+1).padStart(2,'0') }}</span><h2>{{ item.title }}</h2><label class="step-complete"><input type="checkbox" :checked="checked[i]" @change="toggleStep(i)" :aria-label="`标记完成第${i+1}步：${item.title}`"/><span>{{ checked[i]?'已练习':'标记练习' }}</span></label></div><p class="making-instruction">{{ item.instruction }}</p><div class="step-check"><Check :size="15"/><p><strong>做到这里，检查</strong>{{ item.check }}</p></div><p v-if="item.tip" class="step-tip">{{ item.tip }}</p><div v-if="item.techniqueIds?.length" class="step-techniques"><button v-for="entry in linked(item.techniqueIds)" :key="entry.id" @click="emit('step',i);emit('open',entry)">学习 {{ entry.title }} <ArrowUpRight :size="13"/></button></div></section>
        <section :id="`guide-step-${guide.steps.length}`" class="guide-finish"><h2>成品检查</h2><ul><li v-for="item in guide.finishChecks" :key="item"><Check :size="16"/>{{ item }}</li></ul><p class="section-note">页面勾选是学习记录，不代表实物已经通过检验。</p></section>
        <section class="guide-troubleshooting"><h2>遇到问题时</h2><details v-for="item in guide.troubleshooting" :key="item.problem"><summary>{{ item.problem }}</summary><p>{{ item.fix }}</p></details></section>
        <section v-if="applications.length" class="guide-next"><h2>{{ guide.kind==='foundation'?'把这项技法用起来':'接着做什么' }}</h2><div class="technique-links"><button v-for="entry in applications" :key="entry.id" @click="emit('open',entry)">{{ entry.title }}<ArrowUpRight :size="14"/></button></div></section>
        <section class="guide-sources"><h2>工艺参考</h2><p>本篇为结合用途编排的制作攻略，示意图用于辨认成品结构；具体穿绕、尺寸与收尾以步骤和材料说明为准。</p><a v-for="source in guide.sources" :key="source.url" :href="source.url" target="_blank" rel="noopener noreferrer">{{ source.title }}<ArrowUpRight :size="13"/></a></section>
      </article>
    </div>
  </main>
</template>

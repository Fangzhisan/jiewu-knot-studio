<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Search, X, ArrowUpRight, SlidersHorizontal } from '@lucide/vue'
import { CATEGORIES } from '../lessons/catalog'
import { SCENARIOS, scenarioName } from '../courseScenarios'
import { EMPTY_FILTERS, LIBRARY_ENTRIES, KIND_NAMES, filterLibrary, type LibraryEntry, type LibraryFilters } from '../library'
import CourseThumbnail from './CourseThumbnail.vue'
import ProjectDiagram from './ProjectDiagram.vue'
const props = defineProps<{ filters: LibraryFilters }>()
const emit = defineEmits<{ filter: [filters: LibraryFilters]; open: [entry: LibraryEntry] }>()
const limit = ref(24)
const filtered = computed(() => filterLibrary(props.filters))
const shown = computed(() => filtered.value.slice(0, limit.value))
const kinds = [{ id: 'all', name: '全部课程' }, ...Object.entries(KIND_NAMES).map(([id, name]) => ({ id, name }))]
const count = (kind: string) => LIBRARY_ENTRIES.filter(entry => kind === 'all' || entry.kind === kind).length
const hasFilters = computed(() => props.filters.category !== 'all' || !!props.filters.query || !!props.filters.scenario)
function change(patch: Partial<LibraryFilters>) { emit('filter', { ...props.filters, ...patch }) }
watch(() => JSON.stringify(props.filters), () => { limit.value = 24 })
const quickTerms = ['手链', '项链', '耳环', '吊坠', '钥匙', '收纳', '杯垫', '露营']
</script>
<template>
  <main class="library-shell">
    <div class="library-heading"><div><span class="eyebrow">从一个用途，到一件作品</span><h1>课程目录</h1><p>先找想做的物品，再沿攻略学习需要的技法。</p></div><div class="library-totals"><strong>{{ count('project') }}</strong><span>进阶攻略</span><i>＋</i><strong>{{ count('foundation') }}</strong><span>基础补课</span><i>＋</i><strong>{{ count('interactive') }}</strong><span>三维课</span></div></div>
    <section class="library-tools" aria-label="筛选课程目录">
      <div class="library-kind-tabs" role="group" aria-label="课程类型"><button v-for="kind in kinds" :key="kind.id" :class="{selected:filters.kind===kind.id}" :aria-pressed="filters.kind===kind.id" @click="change({kind:kind.id})">{{ kind.name }}<span>{{ count(kind.id) }}</span></button></div>
      <div class="library-search-row"><div class="library-search"><Search :size="18"/><input :value="filters.query" @input="change({query:($event.target as HTMLInputElement).value})" type="search" placeholder="搜索想做的物品、用途、技法或材料" aria-label="搜索全部课程"/><button v-if="filters.query" @click="change({query:''})" aria-label="清空目录搜索"><X :size="16"/></button></div></div>
      <div class="library-filter-row"><div class="library-category-tabs" role="group" aria-label="筛选手作分类"><button :class="{selected:filters.category==='all'}" :aria-pressed="filters.category==='all'" @click="change({category:'all'})">全部分类</button><button v-for="category in CATEGORIES" :key="category.id" :class="{selected:filters.category===category.id}" :aria-pressed="filters.category===category.id" @click="change({category:category.id})">{{ category.name }}</button></div><label class="library-scene"><SlidersHorizontal :size="14"/><span>使用场景</span><select :value="filters.scenario" @change="change({scenario:($event.target as HTMLSelectElement).value})" aria-label="筛选使用场景"><option value="">全部场景</option><option v-for="scene in SCENARIOS" :key="scene.id" :value="scene.id">{{ scene.name }}</option></select></label></div>
      <div class="quick-terms"><span>想做什么</span><button v-for="term in quickTerms" :key="term" :class="{selected:filters.query===term}" @click="change({query:term,kind:'project',scenario:'',category:'all'})">{{ term }}</button></div>
    </section>
    <div class="library-results" aria-live="polite"><span>{{ filtered.length }} 项{{ filters.kind==='all'?'课程':KIND_NAMES[filters.kind as keyof typeof KIND_NAMES] }}<small v-if="filters.query"> · “{{ filters.query }}”</small></span><button v-if="hasFilters" @click="emit('filter',{...EMPTY_FILTERS,kind:filters.kind})">清除筛选 <X :size="12"/></button><span v-else class="results-note">按成品和用途发现 · 点开查看完整步骤</span></div>
    <div class="library-grid">
      <article v-for="entry in shown" :key="entry.id" class="library-card">
        <button class="library-card-main" @click="emit('open',entry)" :aria-label="`打开${entry.title}`">
          <div class="library-cover" :class="`cover-${entry.category}`"><CourseThumbnail v-if="entry.course" :course="entry.course"/><ProjectDiagram v-else-if="entry.guide" :diagram="entry.guide.diagram" :guide="entry.guide" compact/><span class="cover-kind">{{ KIND_NAMES[entry.kind] }}</span></div>
          <div class="library-card-copy"><div class="entry-meta">{{ CATEGORIES.find(c=>c.id===entry.category)?.name }}<template v-if="entry.guide"> · {{ entry.guide.difficulty }} · 约 {{ entry.guide.minutes }} 分钟</template><template v-else> · 可旋转 / 分步播放</template></div><h2>{{ entry.title }}</h2><p>{{ entry.summary }}</p><div class="entry-tags"><span v-for="scene in entry.scenarios.slice(0,2)" :key="scene">{{ scenarioName(scene) }}</span><ArrowUpRight :size="16"/></div></div>
        </button>
      </article>
    </div>
    <div v-if="!filtered.length" class="library-empty"><Search :size="30"/><h2>还没有匹配的课程</h2><p>可以减少筛选条件，或换一个成品、材料名称。</p><button @click="emit('filter',{...EMPTY_FILTERS})">查看全部课程</button></div>
    <button v-if="shown.length<filtered.length" class="load-more" @click="limit+=24">再看 {{ Math.min(24,filtered.length-shown.length) }} 项 <span>已显示 {{ shown.length }} / {{ filtered.length }}</span></button>
    <p class="library-footnote">制作时间为练习估计；用量以材料与试编结果调整。三维课演示单项技法，攻略串起选材、组合与收尾。</p>
  </main>
</template>

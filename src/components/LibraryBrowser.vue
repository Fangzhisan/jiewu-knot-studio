<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { Search, X, ArrowUpRight, SlidersHorizontal } from '@lucide/vue';
  import { CATEGORIES } from '../lessons/catalog';
  import { SCENARIOS, scenarioName } from '../courseScenarios';
  import {
    EMPTY_FILTERS,
    LIBRARY_ENTRIES,
    filterLibrary,
    type LibraryEntry,
    type LibraryFilters,
  } from '../library';
  import CourseThumbnail from './CourseThumbnail.vue';
  import { WEAVING_FAMILIES } from '../weavingAtlas/families';
  import { BEAD_FAMILIES } from '../beadAtlas/families';

  const props = defineProps<{ filters: LibraryFilters }>();
  const emit = defineEmits<{ filter: [filters: LibraryFilters]; open: [entry: LibraryEntry] }>();
  const limit = ref(24);
  const filtered = computed(() => filterLibrary(props.filters));
  const shown = computed(() => filtered.value.slice(0, limit.value));
  const count = (category: string) =>
    LIBRARY_ENTRIES.filter((entry) => entry.category === category).length;
  // 类型只列出已有三维课的分组，规划清单不会变成空课程入口。
  const craftTypes = computed(() =>
    (props.filters.category === 'beads' ? BEAD_FAMILIES : WEAVING_FAMILIES)
      .map((family) => ({
        ...family,
        count: LIBRARY_ENTRIES.filter((entry) => entry.family === family.id).length,
      }))
      .filter((family) => family.count),
  );
  // 只列当前分类和工艺已有的场景；保留已选项，方便理解和清除空结果。
  const availableScenarios = computed(() =>
    SCENARIOS.filter(
      (scene) =>
        scene.id === props.filters.scenario ||
        LIBRARY_ENTRIES.some(
          (entry) =>
            (props.filters.category === 'all' || entry.category === props.filters.category) &&
            (!props.filters.family || entry.family === props.filters.family) &&
            entry.scenarios.includes(scene.id),
        ),
    ),
  );

  const hasFilters = computed(
    () =>
      props.filters.category !== 'all' ||
      !!props.filters.query ||
      !!props.filters.scenario ||
      !!props.filters.family,
  );

  // 只覆盖这次改动的筛选条件。
  function change(patch: Partial<LibraryFilters>) {
    const value = { ...props.filters, ...patch };
    if (
      !['weaving', 'beads'].includes(value.category) ||
      (patch.category && patch.category !== props.filters.category)
    ) {
      value.family = '';
    }
    emit('filter', value);
  }

  watch(
    () => JSON.stringify(props.filters),
    () => {
      limit.value = 24;
    },
  );

  const quickTerms = ['固定', '收纳', '钓鱼', '首饰', '杯垫', '挂件'];
</script>

<template>
  <main class="library-shell">
    <div class="library-heading"
      ><div
        ><span class="eyebrow">{{ LIBRARY_ENTRIES.length }} 节三维课程</span><h1>课程目录</h1
        ><p>按分类、用途与材料查找，进入三维课堂分步学习。</p></div
      ><div class="library-totals"
        ><strong>{{ count('knots') }}</strong
        ><span>绳结</span><i>＋</i><strong>{{ count('weaving') }}</strong
        ><span>编织</span><i>＋</i><strong>{{ count('beads') }}</strong
        ><span>珠串</span></div
      ></div
    >
    <!-- 搜索、分类和用途筛选集中在这里。 -->
    <section
      class="library-tools"
      aria-label="筛选课程目录"
    >
      <div class="library-search-row"
        ><div class="library-search"
          ><Search :size="18" />
          <!-- 搜索和清空只更新关键词，已经选好的分类与场景继续保留。 -->
          <input
            :value="filters.query"
            @input="change({ query: ($event.target as HTMLInputElement).value })"
            type="search"
            placeholder="搜索课程、用途、技法或材料"
            aria-label="搜索全部课程" /><button
            v-if="filters.query"
            @click="change({ query: '' })"
            aria-label="清空目录搜索"
            ><X :size="16" /></button></div
      ></div>
      <div class="library-filter-row">
        <!-- 分类是单选；在实际分类前补上全部分类，选中状态和筛选值一起更新。 -->
        <div
          class="library-category-tabs segmented-control"
          role="radiogroup"
          aria-label="筛选手作分类"
          ><label
            v-for="category in [{ id: 'all', name: '全部分类' }, ...CATEGORIES]"
            :key="category.id"
            :class="{ selected: filters.category === category.id }"
            ><input
              type="radio"
              name="course-category"
              :value="category.id"
              :checked="filters.category === category.id"
              @change="change({ category: category.id })"
            /><span>{{ category.name }}</span></label
          ></div
        ><div class="library-selects"
          ><label
            v-if="['weaving', 'beads'].includes(filters.category)"
            class="library-scene library-weaving-type"
          >
            <span>{{ filters.category === 'beads' ? '珠串类型' : '编织类型' }}</span
            ><select
              :value="filters.family"
              @change="change({ family: ($event.target as HTMLSelectElement).value })"
              :aria-label="filters.category === 'beads' ? '筛选珠串类型' : '筛选编织类型'"
              ><option value="">{{
                filters.category === 'beads' ? '全部珠串类型' : '全部编织类型'
              }}</option
              ><option
                v-for="family in craftTypes"
                :key="family.id"
                :value="family.id"
                >{{ family.name }} · {{ family.count }}</option
              ></select
            > </label
          ><label class="library-scene"
            ><SlidersHorizontal :size="14" /><span>使用场景</span>
            <!-- 选择场景后只更新场景字段，其他筛选不动。 -->
            <select
              :value="filters.scenario"
              @change="change({ scenario: ($event.target as HTMLSelectElement).value })"
              aria-label="筛选使用场景"
              ><option value="">全部场景</option
              ><option
                v-for="scene in availableScenarios"
                :key="scene.id"
                :value="scene.id"
                >{{ scene.name }}</option
              ></select
            ></label
          ></div
        ></div
      >
      <!-- 点击常见用途会清掉分类和场景，再把该用途填成搜索词，避免旧条件把结果挡掉。 -->
      <div class="quick-terms"
        ><span>常见用途</span
        ><button
          v-for="term in quickTerms"
          :key="term"
          :class="{ selected: filters.query === term }"
          @click="change({ query: term, scenario: '', family: '', category: 'all' })"
          >{{ term }}</button
        ></div
      >
    </section>
    <!-- 结果数随筛选更新并温和通知读屏；有条件时可恢复默认筛选，无条件时显示浏览提示。 -->
    <div
      class="library-results"
      aria-live="polite"
      ><span
        >{{ filtered.length }} 节课程<small v-if="filters.query">
          · “{{ filters.query }}”</small
        ></span
      ><button
        v-if="hasFilters"
        @click="emit('filter', { ...EMPTY_FILTERS })"
        >清除筛选 <X :size="12" /></button
      ><span
        v-else
        class="results-note"
        >按用途发现 · 点开查看三维步骤</span
      ></div
    >
    <!-- 按当前展开数量逐课生成卡片；分类名称按编号查找，用途最多显示两项，整张卡片都能打开课堂。 -->
    <div class="library-grid">
      <article
        v-for="entry in shown"
        :key="entry.id"
        class="library-card"
      >
        <button
          class="library-card-main"
          @click="emit('open', entry)"
          :aria-label="`打开${entry.title}`"
        >
          <div
            class="library-cover"
            :class="`cover-${entry.category}`"
            ><CourseThumbnail :course="entry.course" /><span class="cover-kind">{{
              entry.finishedProject ? '三维成品课' : '三维基础课'
            }}</span></div
          >
          <div class="library-card-copy"
            ><div class="entry-meta"
              >{{ CATEGORIES.find((c) => c.id === entry.category)?.name }} · 可旋转 / 分步播放</div
            ><h2>{{ entry.title }}</h2
            ><p>{{ entry.summary }}</p
            ><div class="entry-tags"
              ><span
                v-for="scene in entry.scenarios.slice(0, 2)"
                :key="scene"
                >{{ scenarioName(scene) }}</span
              ><ArrowUpRight :size="16" /></div
          ></div>
        </button>
      </article>
    </div>
    <!-- 没有匹配课程时显示明确的空结果提示。 -->
    <div
      v-if="!filtered.length"
      class="library-empty"
      ><Search :size="30" /><h2>还没有匹配的课程</h2
      ><p>可以减少筛选条件，或换一个技法、材料名称。</p
      ><button @click="emit('filter', { ...EMPTY_FILTERS })">查看全部课程</button></div
    >
    <!-- 仍有未展开课程时，每次再显示最多 24 项。 -->
    <button
      v-if="shown.length < filtered.length"
      class="load-more"
      @click="limit += 24"
      >再看 {{ Math.min(24, filtered.length - shown.length) }} 项
      <span>已显示 {{ shown.length }} / {{ filtered.length }}</span></button
    >
    <p class="library-footnote"
      >所有课程均支持三维旋转、逐步播放与进度拖动；具体用途和演示范围见课程说明。</p
    >
  </main>
</template>

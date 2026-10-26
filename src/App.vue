<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { ArrowLeft, BookOpen } from '@lucide/vue';
  import Classroom from './Classroom.vue';
  import LibraryBrowser from './components/LibraryBrowser.vue';
  import { COURSES } from './lessons/catalog';
  import {
    EMPTY_FILTERS,
    LIBRARY_ENTRIES,
    type LibraryEntry,
    type LibraryFilters,
  } from './library';
  import { practice } from './practice';
  import type { CategoryId } from './lessons/types';
  import { WEAVING_FAMILIES } from './weavingAtlas/families';
  import { BEAD_FAMILIES } from './beadAtlas/families';

  // 解析哈希路由；无效地址回到目录。
  function readRoute() {
    let parsed: URL;

    try {
      parsed = new URL(
        location.hash.slice(1) || `/lesson/${practice.lastLesson}`,
        'https://local.invalid',
      );
    } catch {
      parsed = new URL('/library', 'https://local.invalid');
    }

    const [view, id = ''] = parsed.pathname.split('/').filter(Boolean);
    const known =
      view === 'lesson' ? COURSES.some((course) => course.id === id) : view === 'library';

    return {
      view: known && view === 'lesson' ? ('lesson' as const) : ('library' as const),
      id,
      params: parsed.searchParams,
      missing: !known,
    };
  }

  const route = ref(readRoute());
  const filters = computed<LibraryFilters>(() => ({
    category: ['knots', 'weaving', 'beads'].includes(route.value.params.get('category') ?? '')
      ? route.value.params.get('category')!
      : 'all',
    scenario: route.value.params.get('scenario') ?? '',
    query: route.value.params.get('q') ?? '',
    family:
      ['weaving', 'beads'].includes(route.value.params.get('category') ?? '') &&
      (route.value.params.get('category') === 'beads' ? BEAD_FAMILIES : WEAVING_FAMILIES).some(
        (family) => family.id === route.value.params.get('family'),
      )
        ? route.value.params.get('family')!
        : '',
  }));

  const returnTarget = computed(() => {
    const target = route.value.params.get('return');

    return target && /^#\/library(?:\?|$)/.test(target) ? target : '#/library';
  });

  // 同步地址并回到页首。
  function readNavigation() {
    route.value = readRoute();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // 同一地址也要刷新路由状态。
  function navigate(hash: string) {
    if (location.hash === hash) {
      readNavigation();
    } else {
      location.hash = hash;
    }
  }

  // 把非空筛选条件写进目录地址。
  function filterHash(value: LibraryFilters): string {
    const params = new URLSearchParams();

    if (value.category !== 'all') {
      params.set('category', value.category);
    }

    if (value.scenario) {
      params.set('scenario', value.scenario);
    }

    if (['weaving', 'beads'].includes(value.category) && value.family) {
      params.set('family', value.family);
    }

    if (value.query) {
      params.set('q', value.query);
    }

    return '#/library' + (params.size ? '?' + params.toString() : '');
  }

  // 筛选时替换当前地址，避免输入过程塞满后退历史。
  function setFilters(value: LibraryFilters) {
    history.replaceState(null, '', filterHash(value));
    route.value = readRoute();
  }

  // 按分类打开目录，清掉旧搜索条件。
  function library(category = 'all') {
    navigate(filterHash({ ...EMPTY_FILTERS, category }));
  }

  // 打开课程时记住目录筛选，方便原路返回。
  function openEntry(entry: LibraryEntry) {
    const params = new URLSearchParams({ return: filterHash(filters.value) });
    navigate(`#/lesson/${entry.id}?${params}`);
  }

  // 换课时沿用已有的目录返回地址。
  function selectLesson(id: string) {
    const params = new URLSearchParams();

    if (route.value.params.has('return')) {
      params.set('return', returnTarget.value);
    }

    navigate(`#/lesson/${id}${params.size ? '?' + params : ''}`);
  }

  onMounted(() => window.addEventListener('hashchange', readNavigation));
  onUnmounted(() => window.removeEventListener('hashchange', readNavigation));
</script>

<template>
  <header class="encyclopedia-header">
    <a
      class="brand"
      href="#/library"
      aria-label="结物课程目录"
    >
      <svg
        viewBox="0 0 52 52"
        aria-hidden="true"
      >
        <path
          d="M25 27C10 7 44 1 36 20S9 43 8 26S33 15 42 28S16 48 24 29"
          fill="none"
          stroke="currentColor"
          stroke-width="3.5"
          stroke-linecap="round"
        />
      </svg>

      <span>结物</span></a
    >

    <span class="encyclopedia-tagline">绳结 · 编织 · 珠串</span>
    <!-- 课堂保留上次课程，目录入口清空筛选。 -->
    <nav
      class="main-nav"
      aria-label="课程导航"
    >
      <button
        :class="{ selected: route.view === 'lesson' }"
        @click="navigate(`#/lesson/${practice.lastLesson}`)"
        >三维课堂</button
      >

      <button
        :class="{ selected: route.view === 'library' }"
        @click="library()"
      >
        <BookOpen :size="14" />全部课程</button
      ></nav
    >

    <span class="encyclopedia-count">{{ LIBRARY_ENTRIES.length }} 节课程</span></header
  >
  <!-- 无效地址回到目录，同时显示提示。 -->
  <p
    v-if="route.missing"
    class="route-message"
    role="status"
    >未找到这节课程，已显示课程目录。</p
  >
  <!-- 从目录进入的课程保留返回地址。 -->
  <template v-if="route.view === 'lesson'">
    <div
      v-if="route.params.has('return')"
      class="return-strip"
    >
      <button @click="navigate(returnTarget)"> <ArrowLeft :size="13" />返回课程目录</button></div
    >
    <!-- 选课交给路由，浏览分类回到对应目录。 -->
    <Classroom
      :course-id="route.id"
      @select="selectLesson"
      @browse="(category: CategoryId) => library(category)"
  /></template>
  <!-- 目录筛选与地址同步，复制链接也能保留条件。 -->
  <LibraryBrowser
    v-else
    :filters="filters"
    @filter="setFilters"
    @open="openEntry"
  />
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { Search, X, ArrowUpRight } from '@lucide/vue';
  import { COURSES, CATEGORIES } from '../lessons/catalog';
  import { courseSearchText, getApplication } from '../courseScenarios';
  import type { CategoryId } from '../lessons/types';
  import CourseThumbnail from './CourseThumbnail.vue';

  const props = defineProps<{ lesson: string; category: CategoryId }>();
  const emit = defineEmits<{ select: [id: string]; category: [id: CategoryId]; browse: [] }>();
  const query = ref('');
  const current = computed(() => COURSES.find((course) => course.id === props.lesson)!);
  const matches = computed(() => {
    const term = query.value.trim().normalize('NFKC').toLocaleLowerCase();

    if (term) {
      return COURSES.filter((course) => courseSearchText(course).includes(term));
    }

    const scenes = getApplication(current.value).scenarios;
    const others = COURSES.filter(
      (course) => course.id !== props.lesson && course.category === props.category,
    ).sort(
      (a, b) =>
        Number(getApplication(b).scenarios.some((id) => scenes.includes(id))) -
        Number(getApplication(a).scenarios.some((id) => scenes.includes(id))),
    );

    return [current.value, ...others.slice(0, 3)];
  });

  watch(
    () => props.lesson,
    () => {
      query.value = '';
    },
  );
</script>

<template>
  <div class="quick-picker-heading"
    ><h2>课程导航</h2
    ><button
      @click="emit('browse')"
      aria-label="打开完整课程目录"
      >课程目录 <ArrowUpRight :size="14" /></button
  ></div>
  <!-- 快捷搜索只影响侧栏候选，换课后会清空；完整目录仍从标题旁的入口打开。 -->
  <div class="quick-course-search"
    ><Search :size="14" /><input
      v-model="query"
      type="search"
      aria-label="快速查找三维课程"
      placeholder="快速查找三维课" /><button
      v-if="query"
      @click="query = ''"
      aria-label="清空快速查找"
      ><X :size="13" /></button
  ></div>
  <div class="quick-result-label">{{
    query ? `${matches.length} 节匹配课程` : '当前课程与相关技法'
  }}</div>
  <!-- 有关键词时列出匹配课程，否则列当前课和相关技法；分类名称按编号查找，点击条目把课程编号交回课堂。 -->
  <div
    class="quick-course-list"
    role="region"
    aria-label="三维课程快捷列表"
    tabindex="0"
  >
    <button
      v-for="item in matches"
      :key="item.id"
      class="quick-course"
      :class="{ selected: item.id === lesson }"
      :aria-pressed="item.id === lesson"
      @click="emit('select', item.id)"
    >
      <CourseThumbnail :course="item" /><span
        ><strong>{{ item.name }}</strong
        ><small
          >{{ CATEGORIES.find((c) => c.id === item.category)?.name }} ·
          {{ getApplication(item).focus }}</small
        ></span
      >
    </button>
    <!-- 没有匹配时说明情况，并给出完整目录入口。 -->
    <p
      v-if="!matches.length"
      class="quick-empty"
      >未找到匹配课程，可到完整目录按用途筛选。<button @click="emit('browse')"
        >打开完整目录</button
      ></p
    >
  </div>
</template>

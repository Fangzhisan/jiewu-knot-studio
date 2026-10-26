<script setup lang="ts">
  import { computed } from 'vue';
  import { getCourseProjection } from '../courseProjection';
  import type { Course } from '../lessons/types';

  const props = defineProps<{ course: Course }>();
  const projection = computed(() => getCourseProjection(props.course));
</script>

<template>
  <svg
    class="course-thumbnail"
    :viewBox="projection.viewBox"
    aria-hidden="true"
    focusable="false"
  >
    <!-- 按深度顺序绘制绳段、珠子和支架，后画的部分遮住前面。 -->
    <g
      v-for="(mark, i) in projection.marks"
      :key="i"
    >
      <!-- 绳段用浅色外沿和灰色绳身两层路径，把上下交叉的位置分清。 -->
      <template v-if="mark.kind === 'line'">
        <path
          :d="mark.d"
          fill="none"
          stroke="#f8f8f8"
          :stroke-width="mark.width + 1.5"
          stroke-linecap="butt"
          stroke-linejoin="round"
        />
        <path
          :d="mark.d"
          fill="none"
          :stroke="mark.shade"
          :stroke-width="mark.width"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </template>
      <!-- 珠子按孔轴方向画椭圆；孔轴在画面里可见时画两端孔口，正对镜头时改画圆点。 -->
      <template v-else-if="mark.kind === 'bead'">
        <ellipse
          :cx="mark.x"
          :cy="mark.y"
          :rx="mark.axisRadius"
          :ry="mark.radius"
          :transform="`rotate(${mark.angle} ${mark.x} ${mark.y})`"
          fill="#e6e6e6"
          stroke="#777"
          stroke-width=".9"
        />
        <path
          v-if="mark.hole"
          :d="mark.hole"
          stroke="#777"
          stroke-width="1.2"
          stroke-linecap="round"
        />
        <circle
          v-else
          :cx="mark.x"
          :cy="mark.y"
          r="1.2"
          fill="#888"
        />
      </template>
      <line
        v-else
        :x1="mark.x1"
        :y1="mark.y1"
        :x2="mark.x2"
        :y2="mark.y2"
        :stroke-width="mark.width"
        stroke="#d4d4d4"
        stroke-linecap="round"
      />
    </g>
  </svg>
</template>

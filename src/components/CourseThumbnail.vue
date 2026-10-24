<script setup lang="ts">
import { computed } from 'vue'
import { getCourseProjection } from '../courseProjection'
import type { Course } from '../lessons/types'
const props = defineProps<{ course: Course }>()
const projection = computed(() => getCourseProjection(props.course))
</script>

<template>
  <svg class="course-thumbnail" :viewBox="projection.viewBox" aria-hidden="true" focusable="false">
    <g v-for="(mark, i) in projection.marks" :key="i">
      <template v-if="mark.kind === 'line'">
        <path :d="mark.d" fill="none" stroke="#f8f8f8" :stroke-width="mark.width + 1.5" stroke-linecap="butt" stroke-linejoin="round"/>
        <path :d="mark.d" fill="none" :stroke="mark.shade" :stroke-width="mark.width" stroke-linecap="round" stroke-linejoin="round"/>
      </template>
      <template v-else-if="mark.kind === 'bead'">
        <ellipse :cx="mark.x" :cy="mark.y" :rx="mark.axisRadius" :ry="mark.radius" :transform="`rotate(${mark.angle} ${mark.x} ${mark.y})`" fill="#e6e6e6" stroke="#777" stroke-width=".9"/>
        <path v-if="mark.hole" :d="mark.hole" stroke="#777" stroke-width="1.2" stroke-linecap="round"/>
        <circle v-else :cx="mark.x" :cy="mark.y" r="1.2" fill="#888"/>
      </template>
      <line v-else :x1="mark.x1" :y1="mark.y1" :x2="mark.x2" :y2="mark.y2" :stroke-width="mark.width" stroke="#d4d4d4" stroke-linecap="round"/>
    </g>
  </svg>
</template>

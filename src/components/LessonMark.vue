<script setup lang="ts">
defineProps<{ kind: 'knot' | 'flower' | 'weaving'; small?: boolean }>()
</script>
<template>
  <svg v-if="kind === 'knot'" viewBox="0 0 90 78" fill="none" aria-hidden="true">
    <path d="M15 65L31 46C-1 20 57 9 54 34C51 60 22 50 32 33C42 17 64 28 49 45L76 13" stroke="#819c90" stroke-width="10" stroke-linecap="round"/>
    <path d="M15 65L31 46C-1 20 57 9 54 34C51 60 22 50 32 33C42 17 64 28 49 45L76 13" stroke="#d4dfd5" stroke-width="5" stroke-linecap="round"/>
  </svg>
  <svg v-else-if="kind === 'weaving'" viewBox="0 0 90 78" fill="none" aria-hidden="true">
    <path d="M24 12C24 26 64 24 64 40S24 52 24 66M45 12C45 26 24 25 24 40S65 54 65 66M65 12C65 26 45 26 45 40S45 53 45 66" stroke="#9a9a9a" stroke-width="7" stroke-linecap="round"/>
    <path d="M24 12C24 26 64 24 64 40S24 52 24 66" stroke="#d4d4d4" stroke-width="3" stroke-linecap="round"/>
  </svg>
  <svg v-else viewBox="0 0 90 78" aria-hidden="true">
    <circle v-for="i in 6" :key="i" :cx="45 + 22 * Math.cos((i - 1) * Math.PI / 3)" :cy="39 + 22 * Math.sin((i - 1) * Math.PI / 3)" r="10" fill="#e0ebe3" stroke="#8fa99b" stroke-width="2"/>
    <circle cx="45" cy="39" r="9" fill="#c5a76d" stroke="#a98d57" stroke-width="2"/>
  </svg>
</template>

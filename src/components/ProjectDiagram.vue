<script setup lang="ts">
import { computed } from 'vue'
import type { MakingGuide } from '../guides/types'
const props = defineProps<{ diagram: MakingGuide['diagram']; guide: MakingGuide; compact?: boolean }>()
const beaded = computed(() => props.guide.category === 'beads')
const caption = computed(() => props.diagram.caption.startsWith('结构示意：') ? `${props.guide.title} · 部件组合示意` : props.diagram.caption.replace('；成品结构示意，非真实逐线穿绕图。', ''))
const kind = computed(() => props.diagram.kind)
const colors = computed(() => props.diagram.colors?.length ? props.diagram.colors : ['#466860','#c2a16a','#a96e59'])
const color = (i: number) => colors.value[i % colors.value.length]
const circle = (count: number, rx: number, ry: number, cx = 160, cy = 100) => Array.from({ length: count }, (_, i) => ({ x: cx + Math.cos(i / count * Math.PI * 2) * rx, y: cy + Math.sin(i / count * Math.PI * 2) * ry }))
const pattern = computed(() => props.diagram.pattern?.filter(row => row.length).slice(0, 18) ?? [])
const symbols = computed(() => [...new Set(pattern.value.join('').split(''))])
</script>
<template>
  <figure class="project-diagram" :class="{compact}">
    <svg viewBox="0 0 320 210" role="img" :aria-label="caption">
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <template v-if="guide.kind==='foundation' && !pattern.length">
          <path d="M65 102H255" stroke="#d4cec2" stroke-width="2" stroke-dasharray="4 6"/>
          <g v-for="(label,i) in (diagram.labels?.slice(0,3) ?? ['准备','操作','检查'])" :key="i">
            <circle :cx="67+i*93" cy="92" r="23" :fill="color(i)"/>
            <text :x="67+i*93" y="97" text-anchor="middle" fill="white" font-size="13">{{ i+1 }}</text>
            <text :x="67+i*93" y="139" text-anchor="middle" fill="#6e6b62" font-size="10">{{ label }}</text>
          </g>
        </template>
        <template v-else-if="pattern.length">
          <g v-for="(row,y) in pattern" :key="y">
            <rect v-for="(symbol,x) in row" :key="x" :x="(320-row.length*12)/2+x*12" :y="(200-pattern.length*10)/2+y*10" width="10" height="8" rx="2" :fill="symbol==='0'?'#e6e0d3':symbol==='1'?color(0):color(symbols.indexOf(symbol))"/>
          </g>
        </template>
        <template v-else-if="kind==='parcel' || kind==='bundle'">
          <rect x="78" y="49" width="164" height="112" :rx="kind==='bundle'?54:8" fill="#e9e3d7" stroke="#c6bba5" stroke-width="2"/>
          <path :d="kind==='bundle'?'M113 50V160M207 50V160':'M156 46V165M77 105H243'" :stroke="color(0)" stroke-width="6"/>
          <path v-if="kind==='parcel' && /bow|book/.test(guide.id)" d="M157 105C106 63 111 126 157 105C211 63 210 126 157 105M157 105L137 139M157 105L186 140" :stroke="color(1)" stroke-width="4"/>
        </template>
        <template v-else-if="kind==='line'">
          <path d="M50 42V177M270 42V177" stroke="#b7aa90" stroke-width="12"/>
          <path d="M45 77Q160 130 275 77M44 68L61 91M261 92L278 68" :stroke="color(0)" stroke-width="4"/>
          <path v-for="(x,i) in [100,152,204]" :key="x" :d="`M${x} 100v43m-12 0h24l5 20h-34z`" :stroke="color(i+1)" stroke-width="3" fill="#eeeae2"/>
        </template>
        <template v-else-if="kind==='bracelet' || kind==='necklace'">
          <ellipse cx="160" :cy="kind==='necklace'?94:105" :rx="kind==='necklace'?76:81" :ry="kind==='necklace'?72:49" :stroke="color(0)" stroke-width="6"/>
          <circle v-for="(p,i) in (beaded ? circle(kind==='necklace'?28:22,kind==='necklace'?76:81,kind==='necklace'?72:49,160,kind==='necklace'?94:105) : [])" :key="i" :cx="p.x" :cy="p.y" :r="i%5===0?5.7:4.3" :fill="color(i)" stroke="#faf8f4" stroke-width="1"/>
          <ellipse v-if="!beaded" cx="160" :cy="kind==='necklace'?94:105" :rx="kind==='necklace'?76:81" :ry="kind==='necklace'?72:49" :stroke="color(1)" stroke-width="3" stroke-dasharray="2 6"/>
          <rect x="153" :y="kind==='necklace'?19:53" width="14" height="7" rx="3" fill="#a9a69c" stroke="#f7f6f2" stroke-width="2"/>
          <path v-if="kind==='necklace' && guide.id.includes('pendant')" d="M160 163L151 179L160 192L169 179Z" :fill="color(1)"/>
        </template>
        <template v-else-if="guide.id.includes('headpin-earrings') || guide.id.includes('picot-drop')">
          <g v-for="x in [113,207]" :key="x">
            <path :d="`M${x} 54c-20-43 20-45 9-12`" stroke="#a7a090" stroke-width="3"/>
            <circle :cx="x" cy="58" r="5" stroke="#a7a090" stroke-width="2"/>
            <template v-if="guide.id.includes('headpin')">
              <path :d="`M${x} 63v35M${x-4} 65l-13 69M${x+4} 65l13 89`" stroke="#a7a090" stroke-width="2" stroke-dasharray="3 3"/>
              <circle :cx="x" cy="105" r="10" :fill="color(1)"/><circle :cx="x-17" cy="140" r="14" :fill="color(0)"/><circle :cx="x+17" cy="162" r="9" :fill="color(2)"/>
            </template>
            <template v-else>
              <path :d="`M${x} 63v48`" stroke="#a7a090" stroke-width="2"/><circle :cx="x" cy="126" r="17" :fill="color(0)"/>
              <circle v-for="(p,i) in circle(10,25,28,x,126)" :key="i" :cx="p.x" :cy="p.y" r="3" :fill="color(i)"/>
            </template>
          </g>
        </template>
        <template v-else-if="guide.id.includes('flower-pendant')">
          <path d="M160 40v24" stroke="#a7a090" stroke-width="3"/><circle cx="160" cy="35" r="7" stroke="#a7a090" stroke-width="3"/>
          <circle v-for="(p,i) in circle(7,35,35,160,110)" :key="i" :cx="p.x" :cy="p.y" r="15" :fill="color(0)"/><circle cx="160" cy="110" r="17" :fill="color(1)"/>
        </template>
        <template v-else-if="kind==='earrings' || kind==='pendant'">
          <g v-for="(x,n) in kind==='earrings'?[113,207]:[160]" :key="x">
            <path :d="`M${x} 66c-23-48 23-51 10-13`" stroke="#a7a090" stroke-width="3"/>
            <circle :cx="x" cy="70" r="6" stroke="#a7a090" stroke-width="3"/>
            <path :d="`M${x} 80L${x-31} 117L${x} 151L${x+31} 117Z`" :stroke="color(n)" stroke-width="4"/>
            <circle v-for="(p,i) in circle(12,25,28,x,116)" :key="i" :cx="p.x" :cy="p.y" r="4" :fill="color(i+n)"/>
            <path v-for="(dx,i) in [-18,0,18]" :key="dx" :d="`M${x+dx} 143v${i===1?36:22}`" :stroke="color(i)" stroke-width="3"/>
          </g>
        </template>
        <template v-else-if="kind==='lanyard' || kind==='bookmark'">
          <circle v-if="kind==='lanyard'" cx="160" cy="40" r="23" stroke="#b1a793" stroke-width="5"/>
          <rect x="144" :y="kind==='lanyard'?64:30" width="32" :height="kind==='lanyard'?94:136" rx="5" fill="#e9e3d7"/>
          <path v-for="(x,i) in [149,160,171]" :key="x" :d="`M${x} ${kind==='lanyard'?65:31}q18 11 0 22t0 22t0 22t0 22`" :stroke="color(i)" stroke-width="4"/>
          <path d="M144 162H176M149 168l-5 24M160 168v28M171 168l5 24" :stroke="color(1)" stroke-width="3"/>
        </template>
        <template v-else-if="kind==='wall-hanging' || kind==='plant-hanger' || kind==='pouch'">
          <path d="M96 43H224M112 43L160 21L208 43" stroke="#b3a58b" stroke-width="6"/>
          <path v-for="(x,i) in [105,123,142,160,178,197,215]" :key="x" :d="`M${x} 45l${160-x} 113l${x-160} 30`" :stroke="color(i%2)" stroke-width="2.7"/>
          <path d="M107 80l53 30l53-30M122 119l38 27l38-27" :stroke="color(2)" stroke-width="3"/>
          <path v-if="kind==='plant-hanger'" d="M125 117h70l-13 44h-44z" fill="#c4b39a" stroke="#a2937c" stroke-width="2"/>
          <path v-if="kind==='pouch'" d="M101 70v97q59 35 118 0V70" :stroke="color(0)" stroke-width="6"/>
        </template>
        <template v-else-if="kind==='closure'">
          <path d="M51 110H131M189 110H269" :stroke="color(0)" stroke-width="5"/>
          <ellipse cx="160" cy="110" rx="30" ry="20" stroke="#a59b83" stroke-width="5"/>
          <path d="M85 101h58q23 9 0 18H85" :stroke="color(1)" stroke-width="3"/>
          <rect x="109" y="95" width="12" height="30" rx="5" fill="#c2ac80"/>
        </template>
        <template v-else>
          <rect x="97" y="44" width="126" height="122" rx="5" fill="#ece5d7"/>
          <path v-for="(x,i) in [106,121,136,151,166,181,196,211]" :key="x" :d="`M${x} 48v113`" :stroke="color(i%2)" stroke-width="6"/>
          <path v-for="(y,i) in [56,71,86,101,116,131,146,158]" :key="y" :d="`M101 ${y}h118`" :stroke="color((i+1)%3)" stroke-width="4" opacity=".75"/>
        </template>
      </g>
      <text v-if="!compact" x="160" y="205" text-anchor="middle" fill="#8a877f" font-size="9">{{ pattern.length ? '配色格图 · 读图规则见正文' : guide.kind==='foundation' ? '技法要点 · 按正文分步练习' : '用途示意 · 针路与收尾见正文' }}</text>
    </svg>
    <figcaption v-if="!compact">{{ caption }}</figcaption>
    <div v-if="!compact && diagram.labels?.length" class="diagram-labels"><span v-for="label in diagram.labels" :key="label">{{ label }}</span></div>
  </figure>
</template>

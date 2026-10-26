<script setup lang="ts">
  import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
  import { Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronUp } from '@lucide/vue';

  const props = defineProps<{
    progress: number;
    seekTarget: number | null;
    playing: boolean;
    speed: number;
    steps: readonly { time: number; title: string }[];
    disabled: boolean;
    seekingDisabled: boolean;
  }>();

  const emit = defineEmits<{
    seek: [value: number, animate?: boolean];
    seekStart: [];
    play: [];
    previous: [];
    next: [];
    speed: [value: number];
    restart: [];
  }>();

  const displayProgress = computed(() => props.seekTarget ?? props.progress);
  // 区分点击定位与拖动，拖动时不播放过渡动画。
  let rangePointer: { id: number; x: number; y: number; dragging: boolean } | undefined;

  // 记录主指针起点，并暂停自动播放。
  function beginRangeGesture(event: PointerEvent) {
    if (event.button !== 0 || !event.isPrimary || props.seekingDisabled) {
      return;
    }

    rangePointer = { id: event.pointerId, x: event.clientX, y: event.clientY, dragging: false };
    emit('seekStart');
  }

  // 移动超过 3 像素后按拖动处理。
  function trackRangeGesture(event: PointerEvent) {
    if (
      rangePointer?.id === event.pointerId &&
      Math.hypot(event.clientX - rangePointer.x, event.clientY - rangePointer.y) > 3
    ) {
      rangePointer.dragging = true;
    }
  }

  // 只结束当前指针的手势。
  function endRangeGesture(event: PointerEvent) {
    if (rangePointer?.id === event.pointerId) {
      rangePointer = undefined;
    }
  }

  // 失焦或键盘操作时清除旧手势。
  function clearRangeGesture() {
    rangePointer = undefined;
  }

  // 千分刻度转为课程进度，拖动时直接定位。
  function seekFromInput(event: Event) {
    emit('seek', Number((event.target as HTMLInputElement).value) / 1000, !rangePointer?.dragging);
  }

  const speedOpen = ref(false);
  const speedMenu = ref<HTMLElement | null>(null);
  const speedTrigger = ref<HTMLButtonElement | null>(null);
  const speedRange = ref<HTMLInputElement | null>(null);
  const speedPopover = ref<HTMLElement | null>(null);
  const speedPosition = ref({ left: '0px', top: '0px' });

  // 在按钮附近选择空间足够的一侧摆放面板。
  function positionSpeed() {
    if (!speedOpen.value || !speedTrigger.value || !speedPopover.value) {
      return;
    }

    const trigger = speedTrigger.value.getBoundingClientRect();
    const panel = speedPopover.value.getBoundingClientRect();
    // 优先放在按钮上方，空间不足时再比较上下余量。
    const above = trigger.top >= panel.height + 14 || trigger.top > innerHeight - trigger.bottom;
    const top = above ? trigger.top - panel.height - 12 : trigger.bottom + 12;
    speedPosition.value = {
      left: `${Math.max(8, Math.min(innerWidth - panel.width - 8, trigger.left + trigger.width / 2 - panel.width / 2))}px`,
      top: `${Math.max(8, Math.min(innerHeight - panel.height - 8, top))}px`,
    };
  }

  const speedLabel = computed(() => `${Number(props.speed.toFixed(1))}×`);

  // 展开面板后测量位置，并聚焦速度滑块。
  async function toggleSpeed() {
    speedOpen.value = !speedOpen.value;

    if (speedOpen.value) {
      await nextTick();
      positionSpeed();
      speedRange.value?.focus({ preventScroll: true });
    }
  }

  // 点到菜单外部时收起。
  function dismissOutside(event: PointerEvent) {
    if (
      speedOpen.value &&
      event.target instanceof Node &&
      !speedMenu.value?.contains(event.target)
    ) {
      speedOpen.value = false;
    }
  }

  // 焦点离开菜单时收起。
  function dismissFocusOutside(event: FocusEvent) {
    if (
      speedOpen.value &&
      (!(event.relatedTarget instanceof Node) || !speedMenu.value?.contains(event.relatedTarget))
    ) {
      speedOpen.value = false;
    }
  }

  // Escape 关闭面板，并把菜单内的焦点还给按钮。
  function dismissEscape(event: KeyboardEvent) {
    if (event.key === 'Escape' && speedOpen.value) {
      const insideMenu = event.target instanceof Node && speedMenu.value?.contains(event.target);
      speedOpen.value = false;

      if (insideMenu) {
        speedTrigger.value?.focus({ preventScroll: true });
      }
    }
  }

  // 监听完整指针手势和浮层定位变化。
  onMounted(() => {
    document.addEventListener('pointerdown', dismissOutside);
    document.addEventListener('keydown', dismissEscape);
    document.addEventListener('pointermove', trackRangeGesture, { passive: true });
    document.addEventListener('pointerup', endRangeGesture);
    document.addEventListener('pointercancel', endRangeGesture);
    window.addEventListener('blur', clearRangeGesture);
    window.addEventListener('resize', positionSpeed);
    window.addEventListener('scroll', positionSpeed, true);
  });
  // 清除全局监听和未结束的手势。
  onUnmounted(() => {
    document.removeEventListener('pointerdown', dismissOutside);
    document.removeEventListener('keydown', dismissEscape);
    document.removeEventListener('pointermove', trackRangeGesture);
    document.removeEventListener('pointerup', endRangeGesture);
    document.removeEventListener('pointercancel', endRangeGesture);
    window.removeEventListener('blur', clearRangeGesture);
    rangePointer = undefined;
    window.removeEventListener('resize', positionSpeed);
    window.removeEventListener('scroll', positionSpeed, true);
  });
</script>

<template>
  <section
    class="playback"
    aria-label="教学播放控制"
  >
    <!-- 播放与暂停共用一个入口，前后步骤另设定位开关；课程尚未就绪时保持禁用。 -->
    <div class="transport">
      <button
        class="play-button"
        :disabled="disabled"
        :aria-label="playing ? '暂停演示' : '播放演示'"
        :title="playing ? '暂停演示' : '播放演示'"
        @click="emit('play')"
        ><Pause
          v-if="playing"
          :size="20"
          fill="currentColor" /><Play
          v-else
          :size="20"
          fill="currentColor"
      /></button>
      <div
        class="step-actions"
        role="group"
        aria-label="切换步骤"
      >
        <button
          class="step-button"
          :disabled="seekingDisabled"
          aria-label="上一步"
          @click="emit('previous')"
          ><SkipBack :size="15" /><span>上一步</span></button
        >
        <button
          class="step-button"
          :disabled="seekingDisabled"
          aria-label="下一步"
          @click="emit('next')"
          ><span>下一步</span><SkipForward :size="15"
        /></button>
      </div>
    </div>
    <div class="timeline">
      <div class="range-line">
        <div class="range-track">
          <!-- 千分刻度映射到课程进度，样式变量同步已完成长度；指针拖动、键盘和失焦分别维护手势状态。 -->
          <input
            id="lesson-progress"
            class="progress-range"
            type="range"
            min="0"
            max="1000"
            step="1"
            :disabled="seekingDisabled"
            :value="Math.round(displayProgress * 1000)"
            :style="{ '--progress': `${displayProgress * 100}%` }"
            aria-label="教学进度"
            :aria-valuetext="`${Math.round(displayProgress * 100)}%`"
            @pointerdown="beginRangeGesture"
            @keydown="clearRangeGesture"
            @blur="clearRangeGesture"
            @input="seekFromInput"
          />
          <div
            class="timeline-stops"
            aria-hidden="true"
          >
            <!-- 每个编号按步骤时间定位，已经越过的步骤使用完成样式。 -->
            <span
              v-for="(step, i) in steps"
              :key="i"
              :style="{ left: `${step.time * 100}%` }"
              :class="{ passed: displayProgress >= step.time - 0.005 }"
              >{{ i + 1 }}</span
            ></div
          ></div
        >
        <output for="lesson-progress"
          >{{ Math.round(displayProgress * 100) }}<small>%</small></output
        >
      </div>
    </div>
    <div class="speed-control">
      <!-- 速度按钮和浮层共用焦点边界；外部点击、Escape 或焦点离开都会收起面板。 -->
      <div
        ref="speedMenu"
        class="speed-menu"
        @focusout="dismissFocusOutside"
      >
        <button
          ref="speedTrigger"
          class="speed-trigger"
          :class="{ active: speedOpen }"
          aria-label="调整播放速度"
          aria-haspopup="dialog"
          :aria-expanded="speedOpen"
          aria-controls="speed-popover"
          @click="toggleSpeed"
          ><span>{{ speedLabel }}</span
          ><ChevronUp :size="13"
        /></button>
        <!-- 展开后按按钮位置摆放速度面板；竖向滑块在 0.2 到 5 倍之间调整，变化交回课堂。 -->
        <div
          v-if="speedOpen"
          id="speed-popover"
          ref="speedPopover"
          :style="speedPosition"
          class="speed-popover"
          role="dialog"
          aria-label="播放速度设置"
        >
          <span class="speed-popover-label">播放速度</span
          ><output for="speed-range">{{ speedLabel }}</output>
          <span class="speed-limit">5×</span>
          <input
            id="speed-range"
            ref="speedRange"
            class="vertical-speed"
            type="range"
            min="0.2"
            max="5"
            step="0.1"
            :value="speed"
            aria-label="播放速度"
            aria-orientation="vertical"
            :aria-valuetext="speedLabel"
            @input="emit('speed', Number(($event.target as HTMLInputElement).value))"
          />
          <span class="speed-limit">0.2×</span>
        </div>
      </div>
      <button
        class="replay"
        :disabled="disabled"
        aria-label="从头重播"
        title="从头重播"
        @click="emit('restart')"
        ><RotateCcw :size="17"
      /></button>
    </div>
  </section>
</template>

<style scoped>
  /* 不可操作时统一降低对比、取消位移，并明确显示禁用光标。 */
  .play-button:disabled,
  .replay:disabled,
  .step-button:disabled,
  .progress-range:disabled {
    cursor: not-allowed;
    opacity: 0.45;
    transform: none;
  }
  /* 禁用的播放按钮保留原底色，悬停不再显得可以点击。 */
  .play-button:disabled:hover {
    background: #222;
  }
  /* 禁用的步骤和重播按钮不显示悬停背景。 */
  .replay:disabled:hover,
  .step-button:disabled:hover {
    background: transparent;
  }
</style>

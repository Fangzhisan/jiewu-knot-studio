<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
  import { Box, RotateCcw, ChevronRight, Rotate3D, CircleHelp, Maximize2 } from '@lucide/vue';
  import LessonMark from './components/LessonMark.vue';
  import CourseBrowser from './components/ClassroomCoursePicker.vue';
  import PlaybackBar from './components/PlaybackBar.vue';
  import { StudioScene } from './scene';
  import { CATEGORIES, COURSES, getCourse } from './lessons/catalog';
  import { getApplication, scenarioName } from './courseScenarios';
  import type { CategoryId, Course, LessonState, Vec3 } from './lessons/types';
  import { practice } from './practice';
  import { COURSE_KNOT_REFERENCES } from './knotAtlas/courseReferences';

  const props = defineProps<{ courseId: string }>();
  const emit = defineEmits<{ select: [id: string]; browse: [category: CategoryId] }>();
  const initialCourse = getCourse(props.courseId);
  const lesson = ref(initialCourse.id);
  const progress = ref(practice.progress[initialCourse.id] ?? initialCourse.initialProgress);
  const playing = ref(false);
  // 跳转时滑块先指向目标，画面再平滑跟上。
  const seekTarget = ref<number | null>(null);
  const speed = ref(practice.speed);
  const canvas = ref<HTMLCanvasElement | null>(null);
  const instructionContent = ref<HTMLElement | null>(null);
  const stepList = ref<HTMLOListElement | null>(null);
  // 渲染器状态与课程加载状态分别保存。
  const ready = ref(false);
  const error = ref('');
  const courseStatus = ref<'loading' | 'ready' | 'error'>('loading');
  const courseError = ref('');
  const showSources = ref(false);
  const showLineDiagram = ref(false);
  const currentView = ref('reset');
  let studio: StudioScene | undefined;
  let diagramMedia: MediaQueryList | undefined;
  let raf = 0;
  let seekRaf = 0;
  let lastTime = 0;
  // 递增序号让旧课程请求失效。
  let courseRequest = 0;
  let disposed = false;
  const config = computed(() => getCourse(lesson.value));
  const knotReference = computed(() => COURSE_KNOT_REFERENCES[lesson.value]);
  const application = computed(() => getApplication(config.value));
  const criticalScope = computed(() =>
    application.value.scenarios.some((id) => ['mountaineering', 'climbing', 'rescue'].includes(id)),
  );

  const category = computed(() => CATEGORIES.find((item) => item.id === config.value.category)!);
  const courseReady = computed(() => courseStatus.value === 'ready');
  const state = computed(() => {
    if (!courseReady.value) {
      return null;
    }

    // 完成阶段逐渐收起辅助标记。
    const finalStep = config.value.steps[config.value.steps.length - 1]!;
    const phase = Math.max(
      0,
      Math.min(1, (progress.value - finalStep.time) / (1 - finalStep.time)),
    );

    return {
      ...config.value.getState(progress.value),
      guideOpacity: 1 - phase * phase * (3 - 2 * phase),
    };
  });

  const stepIndex = computed(() =>
    config.value.steps.reduce((index, step, i) => (progress.value >= step.time ? i : index), 0),
  );

  const currentStep = computed(() => config.value.steps[stepIndex.value]!);
  const playbackAvailable = computed(() => ready.value && !error.value && courseReady.value);
  watch(
    [lesson, stepIndex],
    () => {
      if (instructionContent.value) {
        instructionContent.value.scrollTop = 0;
      }
      const list = stepList.value;
      const activeStep = list?.children[stepIndex.value] as HTMLElement | undefined;

      if (list && activeStep && list.scrollHeight > list.clientHeight) {
        const bounds = list.getBoundingClientRect();
        const activeBounds = activeStep.getBoundingClientRect();

        if (activeBounds.bottom > bounds.bottom) {
          list.scrollTop += activeBounds.bottom - bounds.bottom;
        } else if (activeBounds.top < bounds.top) {
          list.scrollTop -= bounds.top - activeBounds.top;
        }
      }
    },
    { flush: 'post' },
  );
  const lineDiagrams = computed(() => {
    const model = state.value;

    if (!model) {
      return [];
    }

    const lines = [model.points, ...(model.strands ?? []).map((strand) => strand.points)];
    const points = lines.flat();

    if (!points.length) {
      return [];
    }

    const xs = points.map((p) => p[0]),
      ys = points.map((p) => p[1]);

    const minx = Math.min(...xs),
      maxx = Math.max(...xs),
      miny = Math.min(...ys),
      maxy = Math.max(...ys);

    const scale = Math.min(190 / Math.max(maxx - minx, 1), 110 / Math.max(maxy - miny, 1));

    return lines.map((line) =>
      line
        .filter((_, i) => i % 3 === 0 || i === line.length - 1)
        .map(
          (p) =>
            `${120 + (p[0] - (maxx + minx) / 2) * scale},${75 - (p[1] - (maxy + miny) / 2) * scale}`,
        )
        .join(' '),
    );
  });

  // 把当前课程状态交给三维场景。
  function renderScene() {
    if (!studio || !state.value) {
      return;
    }

    studio.update(state.value);
  }

  // 取消旧的进度过渡。
  function cancelSeekTransition() {
    if (seekRaf) {
      cancelAnimationFrame(seekRaf);
    }

    seekRaf = 0;
    seekTarget.value = null;
  }

  // 手动定位前停下播放和旧过渡。
  function beginSeek() {
    playing.value = false;
    cancelSeekTransition();
  }

  // 定位到指定进度，按需平滑过渡。
  function seek(value: number, animate = true) {
    if (!courseReady.value) {
      return;
    }

    beginSeek();
    const target = Math.min(1, Math.max(0, value));
    const from = progress.value;

    // 减少动态效果、页面隐藏或场景不可用时直接定位。
    if (
      !animate ||
      !ready.value ||
      error.value ||
      document.hidden ||
      Math.abs(target - from) < 1e-8 ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      progress.value = target;

      return;
    }

    seekTarget.value = target;
    const started = performance.now();

    // 在 220 毫秒内平滑到达目标。
    const frame = (time: number) => {
      seekRaf = 0;

      if (disposed || !courseReady.value) {
        cancelSeekTransition();

        return;
      }

      const t = Math.min(1, Math.max(0, (time - started) / 220));
      const eased = t * t * (3 - 2 * t);
      progress.value = t === 1 ? target : from + (target - from) * eased;

      if (t < 1) {
        seekRaf = requestAnimationFrame(frame);
      } else {
        seekTarget.value = null;
      }
    };

    seekRaf = requestAnimationFrame(frame);
  }

  watch([progress, speed], () => {
    practice.progress[lesson.value] = progress.value;
    practice.speed = speed.value;
  });

  // 准备课程数据，忽略换课后迟到的结果。
  async function prepareLesson(course: Course, request: number, resetCamera: boolean) {
    try {
      if (course.prepare) {
        await course.prepare();
      }

      if (disposed || request !== courseRequest || lesson.value !== course.id) {
        return;
      }

      const bounds = course.framingBounds;
      // 长备用线不挤占操作区；“适合画面”仍按完整实际模型取景。
      const framingBox: Vec3[] = bounds
        ? [bounds.minX, bounds.maxX].flatMap((x) =>
            [bounds.minY, bounds.maxY].flatMap((y) =>
              [bounds.minZ, bounds.maxZ].map((z) => [x, y, z] as Vec3),
            ),
          )
        : [];
      studio?.setFramingStates(
        bounds
          ? [
              {
                points: framingBox,
                tip: framingBox[0]!,
                checkpoint: 0,
                radius: 0.01,
              } satisfies LessonState,
            ]
          : course.frameWholeProcess
            ? Array.from({ length: 101 }, (_, i) => course.getState(i / 100))
            : null,
      );
      courseStatus.value = 'ready';

      if (resetCamera) {
        setView('reset');
      } else if (course.frameWholeProcess || bounds) {
        studio?.fitToModel(true);
      }
    } catch {
      if (disposed || request !== courseRequest || lesson.value !== course.id) {
        return;
      }

      courseError.value = '这节课暂时加载失败，请重试。';
      courseStatus.value = 'error';
    }
  }

  // 保存旧课进度，再加载选中的课程。
  function loadLesson(id: string, restoreProgress: boolean, resetCamera: boolean) {
    if (disposed) {
      return;
    }

    beginSeek();
    practice.progress[lesson.value] = progress.value;
    const course = getCourse(id);

    const request = ++courseRequest;
    // 先停止读取旧模型，再切到尚未准备好的课程。
    courseStatus.value = 'loading';
    courseError.value = '';
    lesson.value = course.id;
    practice.lastLesson = course.id;

    if (restoreProgress) {
      progress.value = practice.progress[course.id] ?? course.initialProgress;
    }

    void prepareLesson(course, request, resetCamera);
  }

  // 由外层路由完成换课。
  function selectLesson(id: string) {
    emit('select', id);
  }

  watch(
    () => props.courseId,
    (id) => {
      if (id !== lesson.value) {
        loadLesson(id, true, true);
      }
    },
  );

  // 保留进度，重试当前课程。
  function retryLesson() {
    loadLesson(lesson.value, false, true);
  }

  // 打开目标分类的第一节课。
  function selectCategory(id: CategoryId) {
    if (id === config.value.category) {
      return;
    }

    selectLesson(COURSES.find((item) => item.category === id)!.id);
  }

  // 限制步骤索引，再定位到对应时间。
  function jumpStep(index: number) {
    seek(config.value.steps[Math.max(0, Math.min(config.value.steps.length - 1, index))]!.time);
  }

  // 连续跳步时以目标进度为准。
  function requestedStepIndex() {
    return config.value.steps.reduce(
      (index, step, i) => ((seekTarget.value ?? progress.value) >= step.time ? i : index),
      0,
    );
  }

  // 回到前一步。
  function previousStep() {
    jumpStep(requestedStepIndex() - 1);
  }

  // 最后一步之后直接展示完成形态。
  function nextStep() {
    const index = requestedStepIndex();

    if (index === config.value.steps.length - 1) {
      seek(1);
    } else {
      jumpStep(index + 1);
    }
  }

  // 切换播放状态；播完后再点则从头开始。
  function togglePlay() {
    if (!playbackAvailable.value) {
      return;
    }

    cancelSeekTransition();

    if (progress.value >= 1) {
      progress.value = 0;
    }

    playing.value = !playing.value;
  }

  // 立即从头播放。
  function restart() {
    if (!playbackAvailable.value) {
      return;
    }

    seek(0, false);
    playing.value = true;
  }

  // 切换预设视角并同步按钮状态。
  function setView(view: 'top' | 'front' | 'reset') {
    if (!courseReady.value) {
      return;
    }

    currentView.value = view;
    studio?.setView(view);
  }

  // 让当前模型完整入镜。
  function fitView() {
    if (!courseReady.value) {
      return;
    }

    currentView.value = 'custom';
    studio?.fitToModel();
  }

  // 加载期间不允许操作旧模型的镜头。
  function guardSceneKeyboard(event: KeyboardEvent) {
    if (!courseReady.value) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  // 场景绘制先于下一播放帧入队，避免一帧重复更新两次几何。
  watch(state, renderScene, { flush: 'sync' });

  // 停掉播放帧并清除旧时间戳。
  function stopPlaybackLoop() {
    if (raf) {
      cancelAnimationFrame(raf);
    }

    raf = 0;
    lastTime = 0;
  }

  // 按实际时间推进，单帧最多补 80 毫秒，避免卡顿后猛跳。
  function playbackFrame(time: number) {
    raf = 0;

    if (!playing.value || document.hidden || !playbackAvailable.value) {
      return;
    }

    const delta = Math.min(Math.max(0, (time - lastTime) / 1000), 0.08);
    lastTime = time;
    progress.value = Math.min(1, progress.value + (delta * speed.value) / config.value.duration);

    if (progress.value >= 1) {
      playing.value = false;

      return;
    }

    raf = requestAnimationFrame(playbackFrame);
  }

  // 只保留一条播放循环。
  function startPlaybackLoop() {
    if (raf || !playing.value || document.hidden || !playbackAvailable.value) {
      return;
    }

    lastTime = performance.now();
    raf = requestAnimationFrame(playbackFrame);
  }

  watch(
    playing,
    (value) => {
      if (value) {
        startPlaybackLoop();
      } else {
        stopPlaybackLoop();
      }
    },
    { flush: 'sync' },
  );

  // 页面退到后台时暂停课程。
  function onVisibilityChange() {
    if (document.hidden) {
      beginSeek();
      stopPlaybackLoop();
    }
  }

  // 画面中断时暂停，等待上下文恢复。
  function onContextLost() {
    error.value = '三维画面暂时中断，正在等待恢复。';
    beginSeek();
  }

  // 恢复后重画当前状态。
  function onContextRestored() {
    error.value = '';
    renderScene();
  }

  // 窄屏省去辅助线路图。
  function syncDiagramVisibility() {
    showLineDiagram.value = diagramMedia?.matches === false;
  }

  // 画布挂载后建立场景，再准备课程。
  onMounted(async () => {
    await nextTick();

    if (disposed) {
      return;
    }

    diagramMedia = window.matchMedia('(max-width: 1000px)');
    syncDiagramVisibility();
    diagramMedia.addEventListener('change', syncDiagramVisibility);
    document.addEventListener('visibilitychange', onVisibilityChange);

    try {
      studio = new StudioScene(canvas.value!);
      renderScene();
      ready.value = true;
      canvas.value?.addEventListener('webglcontextlost', onContextLost);
      canvas.value?.addEventListener('webglcontextrestored', onContextRestored);
      startPlaybackLoop();
    } catch (e) {
      error.value = '当前浏览器无法显示三维画面，请使用支持 WebGL 2 的新版浏览器。';
      console.error(e);
    }

    if (import.meta.env.DEV) {
      (window as any).__JIEWU__ = {
        getState: () => ({
          lesson: lesson.value,
          category: config.value.category,
          courseCount: COURSES.length,
          progress: progress.value,
          playing: playing.value,
          speed: speed.value,
          step: stepIndex.value,
          courseStatus: courseStatus.value,
          courseError: courseError.value,
          tip: state.value?.tip,
          camera: studio?.getCameraState(),
        }),
        getGeometry: () => state.value,
        getRenderStats: () => studio?.getRenderStats(),
      };
    }

    loadLesson(lesson.value, false, false);
  });
  // 卸载时停掉异步更新并释放场景。
  onUnmounted(() => {
    disposed = true;
    ++courseRequest;
    cancelSeekTransition();

    diagramMedia?.removeEventListener('change', syncDiagramVisibility);
    diagramMedia = undefined;
    stopPlaybackLoop();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    canvas.value?.removeEventListener('webglcontextlost', onContextLost);
    canvas.value?.removeEventListener('webglcontextrestored', onContextRestored);
    studio?.dispose();

    if (import.meta.env.DEV) {
      delete (window as any).__JIEWU__;
    }
  });
</script>

<template>
  <main class="studio-shell compact-classroom">
    <div class="lesson-heading"
      ><div class="lesson-title-row"
        ><h1>{{ config.title }}</h1></div
      >
      <div class="compact-course-meta"
        ><span class="course-purpose">{{ application.task }}</span
        ><span
          v-for="scene in application.scenarios"
          :key="scene"
          class="compact-tag"
          >{{ scenarioName(scene) }}</span
        ></div
      >
      <!-- 涉及登山、攀岩或救援时，提前显示演示范围边界。 -->
      <p
        v-if="criticalScope && application.boundary"
        class="critical-scope"
        >{{ application.boundary }}</p
      >
    </div>
    <div class="workspace">
      <aside class="lesson-sidebar panel">
        <!-- 快捷课程选择器负责选课与分类切换，目录按钮沿用当前分类。 -->
        <CourseBrowser
          :lesson="lesson"
          :category="category.id"
          @select="selectLesson"
          @category="selectCategory"
          @browse="emit('browse', category.id)"
        />
        <!-- 按课程顺序生成步骤列表；数据未就绪时禁止跳步，选中样式和读屏状态跟随当前步骤。 -->
        <ol
          ref="stepList"
          class="step-list"
          aria-label="教学步骤"
          ><li
            v-for="(step, i) in config.steps"
            :key="i"
            ><button
              :disabled="!courseReady"
              :class="{ active: stepIndex === i }"
              :aria-current="stepIndex === i ? 'step' : undefined"
              :title="step.title"
              @click="jumpStep(i)"
              ><span class="step-number">{{ String(i + 1).padStart(2, '0') }}</span
              ><span class="step-label">{{ step.title }}</span></button
            ></li
          ></ol
        >
      </aside>
      <!-- 三维操作区在课程准备期间向辅助技术报告忙碌状态。 -->
      <section
        class="scene-panel panel"
        aria-label="三维教学操作区"
        :aria-busy="courseStatus === 'loading'"
      >
        <div class="canvas-toolbar"
          ><span class="scene-label">{{ progress >= 1 ? '本课完成形态' : '三维演示' }}</span>
          <!-- 这组按钮共用课程就绪状态；俯视和正视有选中态，适配按当前模型取景，复位回到默认视角。 -->
          <div class="view-controls"
            ><button
              :disabled="!courseReady"
              :class="{ active: currentView === 'top' }"
              :aria-pressed="currentView === 'top'"
              @click="setView('top')"
              aria-label="切换俯视"
              ><Box :size="19" /><span>俯视</span></button
            ><button
              :disabled="!courseReady"
              :class="{ active: currentView === 'front' }"
              :aria-pressed="currentView === 'front'"
              @click="setView('front')"
              aria-label="切换正视"
              ><Box
                :size="19"
                class="front-icon"
              /><span>正视</span></button
            ><button
              :disabled="!courseReady"
              @click="fitView"
              aria-label="适合画面"
              title="按当前模型适配画面"
              ><Maximize2 :size="19" /><span>适配</span></button
            ><button
              :disabled="!courseReady"
              @click="setView('reset')"
              aria-label="复位视角"
              ><RotateCcw :size="19" /><span>复位视角</span></button
            ></div
          ></div
        >
        <!-- 承载三维模型；课程未就绪时隐藏并退出键盘焦点，手势后改为自定义视角，按 0 可复位。 -->
        <canvas
          ref="canvas"
          :data-rendered-progress="progress.toFixed(6)"
          class="scene-canvas"
          :class="{ 'is-course-pending': !courseReady }"
          :tabindex="courseReady ? 0 : -1"
          :aria-hidden="!courseReady"
          @studio-camera-interaction="currentView = 'custom'"
          @keydown.capture="guardSceneKeyboard"
          @keydown.0.exact.prevent="setView('reset')"
          aria-describedby="camera-keyboard-help"
          aria-label="可旋转的三维教学模型。拖动旋转，右键或双指平移，滚轮指向细节缩放。端帽数字区分绳线，A、B 区分两端。"
        />
        <span
          v-show="courseReady"
          id="camera-keyboard-help"
          class="canvas-keyboard-help"
          >方向键旋转 · + / − 缩放 · 0 复位</span
        >
        <!-- 课程加载、加载失败和画面错误在这里分开显示；只有课程加载失败才提供重试入口。 -->
        <div
          v-if="!ready || error || !courseReady"
          class="canvas-status"
          role="status"
        >
          <p v-if="courseStatus === 'loading'">正在加载这节课…</p>
          <template v-else-if="courseStatus === 'error'"
            ><p>{{ courseError }}</p
            ><button
              class="course-retry"
              @click="retryLesson"
              >重新加载</button
            ></template
          >
          <p v-else>{{ error || '正在准备三维画面…' }}</p>
        </div>
        <div
          v-show="courseReady"
          class="canvas-hint"
          ><Rotate3D :size="16" /><span>拖动旋转 · 右键平移</span><span class="hint-dot">·</span
          ><span>指向缩放 / 双指操作</span></div
        >
      </section>
      <aside class="instruction-panel panel">
        <div class="step-eyebrow"
          >当前步骤
          <span
            >{{ String(stepIndex + 1).padStart(2, '0') }}
            <i>/ {{ String(config.steps.length).padStart(2, '0') }}</i></span
          ></div
        >

        <!-- 步骤说明独立滚动，长课程文字不会挤压画布和进度条。 -->
        <div
          ref="instructionContent"
          class="instruction-content"
          role="region"
          aria-label="当前步骤说明"
          tabindex="0"
        >
          <h2>{{ currentStep.title }}</h2
          ><p class="instruction-copy">{{ currentStep.instruction }}</p>
        </div>
        <!-- 宽屏且没有支架时才显示辅助线路图，避免把支架课程误画成纯绳图。 -->
        <div
          v-if="showLineDiagram && !state?.supports?.length"
          class="mini-diagram"
          ><svg
            viewBox="0 0 240 150"
            role="img"
            aria-label="当前步骤的线路示意"
          >
            <!-- 每根绳的粗轮廓和细中心线一起分组。 -->
            <g
              v-for="(line, i) in lineDiagrams"
              :key="i"
            >
              <polyline
                :points="line"
                fill="none"
                stroke="#bcbcbc"
                stroke-width="6"
                stroke-linejoin="round"
                stroke-linecap="round"
              />
              <polyline
                :points="line"
                fill="none"
                stroke="#555"
                stroke-width="1.5"
                stroke-linejoin="round"
                stroke-linecap="round"
              />
            </g></svg
          ><span>当前线路示意</span></div
        >
        <!-- 材料区按课程分类选图案，同时列出材料和准备说明。 -->
        <div class="materials"
          ><h3>所需材料<span /></h3
          ><div class="material-detail"
            ><LessonMark :kind="category.mark" /><div
              ><strong>{{ config.material }}</strong
              ><p>{{ config.materialNote }}</p></div
            ></div
          ></div
        >
      </aside>
    </div>
    <!-- 汇集播放、跳步、拖动和速度操作；进度条在动画过渡中先显示目标位置。 -->
    <PlaybackBar
      :progress="progress"
      :seek-target="seekTarget"
      :playing="playing"
      :speed="speed"
      :steps="config.steps"
      :disabled="!playbackAvailable"
      :seeking-disabled="!courseReady"
      @seek-start="beginSeek"
      @seek="seek"
      @play="togglePlay"
      @previous="previousStep"
      @next="nextStep"
      @speed="speed = $event"
      @restart="restart"
    />
    <footer class="studio-footer"
      ><span>端帽数字区分绳线，A / B 区分两端。</span>
      <!-- 切换课程背景说明，同时同步展开状态供读屏识别。 -->
      <button
        @click="showSources = !showSources"
        :aria-expanded="showSources"
        ><CircleHelp :size="15" />关于这节课</button
      ></footer
    >
    <!-- 展开后显示课程简介、范围限制和工艺参考。 -->
    <div
      v-if="showSources"
      class="source-note"
      ><p>{{ config.description }}</p
      ><p v-if="application.boundary"><strong>演示范围：</strong>{{ application.boundary }}</p
      ><p>课程动画为结构示意，尚未完成实物工艺验收。</p
      ><a
        v-if="knotReference && knotReference.url !== config.source"
        :href="knotReference.url"
        target="_blank"
        rel="noopener noreferrer"
        >Knots 3D 对照：{{ knotReference.name }}<ChevronRight :size="15" /></a
      ><a
        :href="config.source"
        target="_blank"
        rel="noopener noreferrer"
        >工艺参考：{{ config.sourceName }}<ChevronRight :size="15" /></a
    ></div>
  </main>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { useData } from 'vitepress'

type Mode = 'light' | 'auto' | 'dark'

// 与 VitePress 内建 appearance（防闪烁脚本、auto 模式的系统监听）共用同一存储键。
// 内核写入时会把「与系统一致的选择」坍缩为 auto；为保留显式三态，
// 在内核 watcher flush 之后（nextTick）覆写回用户的选择。
const KEY = 'vitepress-theme-appearance'

const { isDark } = useData()
const mode = ref<Mode>('auto')
const modes: Mode[] = ['light', 'auto', 'dark']
const labels: Record<Mode, string> = { light: '浅色', auto: '跟随系统', dark: '深色' }

onMounted(() => {
  let saved: string | null = null
  try {
    saved = localStorage.getItem(KEY)
  } catch {}
  mode.value = saved === 'light' || saved === 'dark' ? saved : 'auto'
})

function switchTheme(next: Mode, willDark: boolean) {
  isDark.value = willDark
  mode.value = next
  void nextTick().then(() => {
    try {
      localStorage.setItem(KEY, next)
    } catch {}
  })
}

function choose(next: Mode) {
  if (next === mode.value) return
  const willDark =
    next === 'auto' ? window.matchMedia('(prefers-color-scheme: dark)').matches : next === 'dark'
  // 明暗实际变化时做整页交叉渐变（View Transitions 默认 crossfade，
  // 结束帧即新渲染本身，无过渡截断问题）；无 API 或 reduced-motion 直切。
  // 时长与缓动在 main.css 的 ::view-transition-* 规则中定义。
  if (
    willDark === isDark.value ||
    !document.startViewTransition ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    switchTheme(next, willDark)
    return
  }
  document.startViewTransition(async () => {
    switchTheme(next, willDark)
    await nextTick()
  })
}
</script>

<template>
  <div
    role="radiogroup"
    aria-label="主题"
    class="relative flex items-center rounded-full border border-mist-200 bg-mist-100 p-0.5 dark:border-mist-700 dark:bg-mist-800"
  >
    <span
      aria-hidden="true"
      class="theme-thumb absolute left-0.5 top-0.5 h-7 w-7 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out dark:bg-mist-600"
      :style="{ transform: `translateX(${modes.indexOf(mode) * 100}%)` }"
    ></span>
    <button
      v-for="m in modes"
      :key="m"
      type="button"
      role="radio"
      :aria-checked="mode === m"
      :aria-label="labels[m]"
      :title="labels[m]"
      class="relative z-[1] flex h-7 w-7 items-center justify-center rounded-full transition-colors"
      :class="
        mode === m
          ? 'text-mist-900 dark:text-mist-100'
          : 'text-mist-600 hover:text-glow-600 dark:text-mist-400 dark:hover:text-glow-300'
      "
      @click="choose(m)"
    >
      <!-- 浅色：太阳 -->
      <svg
        v-if="m === 'light'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        class="h-4 w-4"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path
          d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        />
      </svg>
      <!-- 跟随系统：显示器 -->
      <svg
        v-else-if="m === 'auto'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-4 w-4"
        aria-hidden="true"
      >
        <rect x="2" y="4" width="20" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
      <!-- 深色：月亮 -->
      <svg
        v-else
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useData } from 'vitepress'

type Mode = 'light' | 'dark' | 'auto'

// 与 VitePress 内建 appearance（防闪烁脚本、系统偏好监听）共用同一存储键。
// 内核写入时会把「与系统一致的选择」坍缩为 auto；为支持显式三态，
// 在内核切换完 html.dark 后覆写回用户的显式选择。
const KEY = 'vitepress-theme-appearance'

const { isDark } = useData()
const open = ref(false)
const mode = ref<Mode>('auto')
const container = ref<HTMLElement>()

const options: { value: Mode; label: string }[] = [
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
  { value: 'auto', label: '跟随系统' },
]

function apply(next: Mode) {
  isDark.value =
    next === 'auto' ? window.matchMedia('(prefers-color-scheme: dark)').matches : next === 'dark'
  mode.value = next
  // 内核 watcher 在本轮 flush 时会按坍缩语义写存储，覆写必须排在其后
  void nextTick().then(() => {
    try {
      localStorage.setItem(KEY, next)
    } catch {}
  })
}

async function choose(next: Mode, event: MouseEvent) {
  open.value = false
  if (next === mode.value) return
  const willDark =
    next === 'auto' ? window.matchMedia('(prefers-color-scheme: dark)').matches : next === 'dark'
  // 视觉不变（如浅色系统下 浅色↔跟随系统）或不支持/减弱动效：直切
  if (
    willDark === isDark.value ||
    !document.startViewTransition ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    apply(next)
    return
  }
  // View Transitions 圆形扩散，以点击处为圆心（vuejs.org 同款）
  const x = event.clientX
  const y = event.clientY
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]
  await document.startViewTransition(async () => {
    apply(next)
    await nextTick()
  }).ready
  document.documentElement.animate(
    { clipPath: willDark ? [...clipPath].reverse() : clipPath },
    {
      duration: 350,
      easing: 'ease-in',
      pseudoElement: `::view-transition-${willDark ? 'old' : 'new'}(root)`,
    },
  )
}

function onClickOutside(e: MouseEvent) {
  if (open.value && !container.value?.contains(e.target as Node)) open.value = false
}
function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  const saved = localStorage.getItem(KEY)
  mode.value = saved === 'light' || saved === 'dark' ? saved : 'auto'
  document.addEventListener('click', onClickOutside)
  document.addEventListener('keydown', onEscape)
})
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onEscape)
})
</script>

<template>
  <div ref="container" class="relative">
    <button
      type="button"
      aria-label="主题设置"
      aria-haspopup="menu"
      :aria-expanded="open"
      class="rounded-full p-2 text-mist-600 transition hover:bg-mist-100 hover:text-glow-600 dark:text-mist-300 dark:hover:bg-mist-800 dark:hover:text-glow-300"
      @click="open = !open"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        class="h-5 w-5 dark:hidden"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path
          d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        />
      </svg>
      <svg viewBox="0 0 24 24" fill="currentColor" class="hidden h-5 w-5 dark:block" aria-hidden="true">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </button>
    <Transition name="menu">
    <ul
      v-show="open"
      role="menu"
      aria-label="主题选择"
      class="absolute right-0 top-full z-20 mt-2 w-36 rounded-xl border border-mist-200 bg-white p-1 shadow-lg dark:border-mist-700 dark:bg-mist-800"
    >
      <li v-for="opt in options" :key="opt.value" role="none">
        <button
          type="button"
          role="menuitemradio"
          :aria-checked="mode === opt.value"
          class="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-mist-700 transition hover:bg-mist-100 dark:text-mist-200 dark:hover:bg-mist-700"
          :class="mode === opt.value ? 'font-semibold text-glow-700 dark:text-glow-300' : ''"
          @click="choose(opt.value, $event)"
        >
          <span>{{ opt.label }}</span>
          <svg
            v-if="mode === opt.value"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M4 12l5 5L20 6" />
          </svg>
        </button>
      </li>
    </ul>
    </Transition>
  </div>
</template>

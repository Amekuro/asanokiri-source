<script setup lang="ts">
import { useData } from 'vitepress'

// 深浅色切换走 VitePress 内建 appearance：写 isDark 即可，内核负责
// html.dark 切换、localStorage（vitepress-theme-appearance）持久化、
// 防闪烁脚本注入，以及「选择与系统一致时回退为跟随系统」的语义。
const { isDark } = useData()
</script>

<template>
  <button
    type="button"
    aria-label="切换深浅色主题"
    class="rounded-full p-2 text-mist-600 transition hover:bg-mist-100 hover:text-glow-600 dark:text-mist-300 dark:hover:bg-mist-800 dark:hover:text-glow-300"
    @click="isDark = !isDark"
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
</template>

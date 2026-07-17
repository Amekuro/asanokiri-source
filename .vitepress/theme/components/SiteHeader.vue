<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as site } from '../site.data'
</script>

<template>
  <header
    class="sticky top-0 z-10 border-b border-mist-200/70 bg-mist-50/85 backdrop-blur dark:border-mist-800/70 dark:bg-mist-950/85"
  >
    <div class="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
      <a
        :href="withBase('/')"
        class="flex items-baseline gap-2.5 rounded-md font-bold text-mist-900 dark:text-mist-100"
      >
        <span>{{ site.name }}</span>
        <span
          v-if="site.name_ja"
          class="hidden text-xs font-normal tracking-[0.25em] text-mist-600 sm:inline dark:text-mist-400"
        >
          {{ site.name_ja }}
        </span>
      </a>
      <nav class="flex items-center gap-5 text-sm" aria-label="站点导航">
        <a
          :href="withBase('/posts')"
          class="rounded-md font-medium text-mist-600 transition hover:text-glow-600 dark:text-mist-300 dark:hover:text-glow-300"
        >
          活动记录
        </a>
        <a
          v-if="site.join_url"
          :href="site.join_url"
          target="_blank"
          rel="noopener"
          class="rounded-full bg-dawn-700 px-3.5 py-1.5 font-medium text-white transition hover:bg-dawn-800"
        >
          加入我们
        </a>
      </nav>
    </div>
  </header>
</template>

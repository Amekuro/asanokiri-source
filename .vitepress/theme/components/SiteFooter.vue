<script setup lang="ts">
import { data as site } from '../site.data'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-mist-200 bg-mist-100 dark:border-mist-800 dark:bg-mist-900">
    <div class="mx-auto max-w-5xl px-5 py-10">
      <div class="flex flex-wrap items-start justify-between gap-8">
        <div>
          <div class="flex items-baseline gap-2.5">
            <span class="font-bold text-mist-900 dark:text-mist-100">{{ site.name }}</span>
            <span
              v-if="site.name_ja"
              class="text-xs tracking-[0.25em] text-mist-600 dark:text-mist-400"
            >
              {{ site.name_ja }}
            </span>
          </div>
          <p v-if="site.tagline" class="mt-2 text-sm text-mist-600 dark:text-mist-400">
            {{ site.tagline }}
          </p>
        </div>
        <ul class="space-y-2 text-sm text-mist-600 dark:text-mist-300">
          <li v-if="site.qq_group">QQ 群：{{ site.qq_group }}</li>
          <li v-if="site.wechat">微信公众号：{{ site.wechat }}</li>
          <li v-if="site.bilibili">
            <a
              :href="site.bilibili"
              target="_blank"
              rel="noopener"
              class="rounded-md text-glow-600 transition hover:text-glow-700 dark:text-glow-300 dark:hover:text-glow-200"
            >
              bilibili 官方账号
            </a>
          </li>
        </ul>
      </div>
      <div
        aria-hidden="true"
        class="mt-8 h-px w-full bg-gradient-to-r from-dawn-400/60 via-mist-300 to-glow-500/60 dark:via-mist-700"
      ></div>
      <p class="mt-4 text-xs text-mist-600 dark:text-mist-400">© {{ year }} {{ site.name }}</p>
    </div>
  </footer>
</template>

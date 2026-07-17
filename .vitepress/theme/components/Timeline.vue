<script setup lang="ts">
import { withBase } from 'vitepress'
import type { HistoryItem } from '../history.data'

defineProps<{ items: HistoryItem[] }>()
</script>

<template>
  <ol class="relative space-y-10 border-l-2 border-mist-200 pl-8 dark:border-mist-800">
    <li v-for="item in items" :key="`${item.year}-${item.title}`" class="relative">
      <span
        aria-hidden="true"
        class="absolute -left-[41px] top-1 h-3.5 w-3.5 rounded-full bg-gradient-to-br from-dawn-400 to-glow-500 ring-4 ring-mist-50 dark:ring-mist-950"
      ></span>
      <span
        class="inline-flex rounded-full bg-dawn-100 px-2.5 py-0.5 text-sm font-semibold tracking-wide text-dawn-800 dark:bg-mist-800 dark:text-dawn-300"
      >
        {{ item.year }}
      </span>
      <h3 class="mt-2 font-bold text-mist-900 dark:text-mist-100">{{ item.title }}</h3>
      <p v-if="item.text" class="mt-1.5 max-w-xl text-sm leading-relaxed text-mist-600 dark:text-mist-300">
        {{ item.text }}
      </p>
      <img
        v-if="item.image"
        :src="withBase(item.image)"
        :alt="item.title"
        loading="lazy"
        class="mt-4 w-full max-w-sm rounded-xl border border-mist-200 dark:border-mist-800"
      />
    </li>
  </ol>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress'
import type { HistoryItem } from '../history.data'

defineProps<{ items: HistoryItem[] }>()
</script>

<template>
  <ol class="relative space-y-8 border-l-2 border-mist-200 pl-6">
    <li v-for="item in items" :key="`${item.year}-${item.title}`" class="relative">
      <span
        class="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-gradient-to-br from-dawn-400 to-glow-500"
      ></span>
      <div class="text-sm font-semibold tracking-wide text-dawn-600">{{ item.year }}</div>
      <h3 class="mt-0.5 font-bold text-mist-900">{{ item.title }}</h3>
      <p v-if="item.text" class="mt-1 text-sm leading-relaxed text-mist-600">{{ item.text }}</p>
      <img
        v-if="item.image"
        :src="withBase(item.image)"
        :alt="item.title"
        class="mt-3 max-w-sm rounded-lg border border-mist-200"
        loading="lazy"
      />
    </li>
  </ol>
</template>

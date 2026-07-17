<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { frontmatter } = useData()

// frontmatter.date 在客户端为 ISO 字符串，取日期部分展示
const date = computed(() => String(frontmatter.value.date ?? '').slice(0, 10))
</script>

<template>
  <article class="mx-auto max-w-3xl px-5 py-16">
    <header>
      <time v-if="date" class="text-sm font-medium tracking-wide text-mist-600 dark:text-mist-400">
        {{ date }}
      </time>
      <h1 class="mt-2 text-3xl font-black tracking-tight text-mist-900 dark:text-mist-100">
        {{ frontmatter.title }}
      </h1>
      <div
        aria-hidden="true"
        class="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-dawn-400 to-glow-500"
      ></div>
      <img
        v-if="frontmatter.cover"
        :src="withBase(frontmatter.cover)"
        :alt="frontmatter.title"
        class="mt-8 w-full rounded-2xl border border-mist-200 dark:border-mist-800"
      />
    </header>
    <div class="prose mt-10 max-w-none">
      <Content />
    </div>
  </article>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress'
import type { Post } from '../posts.data'

defineProps<{ post: Post }>()
</script>

<!--
  活动卡片：封面图铺满卡片作背景，底部深色渐变压暗保证文字对比度（WCAG AA）。
  无封面时退化为品牌渐变 + 「朝」水印，两种状态均可用。
-->
<template>
  <a
    :href="withBase(post.url)"
    class="group relative block aspect-[16/10] overflow-hidden rounded-2xl border border-mist-200 bg-mist-100 transition hover:shadow-lg motion-safe:hover:-translate-y-1 dark:border-mist-800 dark:bg-mist-900"
  >
    <img
      v-if="post.cover"
      :src="withBase(post.cover)"
      alt=""
      loading="lazy"
      class="absolute inset-0 h-full w-full object-cover transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
    />
    <div
      v-else
      aria-hidden="true"
      class="absolute inset-0 bg-gradient-to-br from-mist-200 via-mist-100 to-dawn-100 dark:from-mist-800 dark:via-mist-900 dark:to-mist-950"
    >
      <span
        class="absolute -right-2 -top-4 select-none text-8xl font-black text-mist-300/70 dark:text-mist-700/50"
      >
        朝
      </span>
    </div>
    <span
      v-if="post.featured"
      class="absolute left-4 top-4 rounded-full bg-dawn-700/95 px-2.5 py-1 text-xs font-medium text-white"
    >
      精选
    </span>
    <div
      class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-mist-950/95 via-mist-950/40 to-transparent px-5 pb-4 pt-12"
    >
      <time class="text-xs font-medium tracking-wide text-mist-200">{{ post.date }}</time>
      <h3 class="mt-1 font-bold text-white transition group-hover:text-dawn-200">
        {{ post.title }}
      </h3>
    </div>
  </a>
</template>

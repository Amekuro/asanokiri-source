<script setup lang="ts">
import { withBase } from 'vitepress'
import type { Post } from '../posts.data'

defineProps<{ post: Post }>()
</script>

<template>
  <a
    :href="withBase(post.url)"
    class="group block overflow-hidden rounded-xl border border-mist-200 bg-white transition hover:border-dawn-300 hover:shadow-md"
  >
    <img
      v-if="post.cover"
      :src="withBase(post.cover)"
      :alt="post.title"
      class="aspect-[5/2] w-full object-cover"
      loading="lazy"
    />
    <div class="p-5">
      <time class="text-xs tracking-wide text-mist-400">{{ post.date }}</time>
      <h3 class="mt-1 font-bold text-mist-900 transition group-hover:text-glow-600">{{ post.title }}</h3>
    </div>
  </a>
</template>

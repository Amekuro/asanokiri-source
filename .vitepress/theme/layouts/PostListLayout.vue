<script setup lang="ts">
import { useData } from 'vitepress'
import { data as posts } from '../posts.data'
import PostCard from '../components/PostCard.vue'

const { frontmatter } = useData()
</script>

<template>
  <div class="mx-auto max-w-5xl px-5 py-16">
    <h1 class="text-3xl font-black tracking-tight text-mist-900">
      {{ frontmatter.title ?? '活动记录' }}
    </h1>
    <div class="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-dawn-400 to-glow-500"></div>
    <div v-if="posts.length" class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <PostCard v-for="post in posts" :key="post.url" :post="post" />
    </div>
    <p v-else class="mt-10 text-mist-500">暂无活动记录。</p>
  </div>
</template>

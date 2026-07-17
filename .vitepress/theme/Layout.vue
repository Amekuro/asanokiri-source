<script setup lang="ts">
import { useData } from 'vitepress'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import HomeLayout from './layouts/HomeLayout.vue'
import PostListLayout from './layouts/PostListLayout.vue'
import PostLayout from './layouts/PostLayout.vue'

const { frontmatter } = useData()
</script>

<template>
  <div class="flex min-h-screen flex-col bg-mist-50 font-sans text-mist-800 antialiased">
    <SiteHeader />
    <main class="flex-1">
      <HomeLayout v-if="frontmatter.layout === 'home'" />
      <PostListLayout v-else-if="frontmatter.layout === 'posts'" />
      <PostLayout v-else />
    </main>
    <SiteFooter />
  </div>
</template>

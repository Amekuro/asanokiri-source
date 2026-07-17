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
  <div
    class="flex min-h-screen flex-col bg-mist-50 font-sans text-mist-800 antialiased dark:bg-mist-950 dark:text-mist-200"
  >
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-glow-700 focus:px-4 focus:py-2 focus:font-medium focus:text-white"
    >
      跳到主要内容
    </a>
    <SiteHeader />
    <main id="main" class="flex-1">
      <HomeLayout v-if="frontmatter.layout === 'home'" />
      <PostListLayout v-else-if="frontmatter.layout === 'posts'" />
      <PostLayout v-else />
    </main>
    <SiteFooter />
  </div>
</template>

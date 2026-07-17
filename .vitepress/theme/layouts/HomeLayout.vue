<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as site } from '../site.data'
import { data as history } from '../history.data'
import { data as posts } from '../posts.data'
import Timeline from '../components/Timeline.vue'
import PostCard from '../components/PostCard.vue'

const latest = posts.slice(0, 3)
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-mist-100 to-mist-50"></div>
      <div class="relative mx-auto max-w-5xl px-5 pb-20 pt-20 sm:pt-28">
        <p v-if="site.name_ja" class="text-sm tracking-[0.5em] text-mist-400">{{ site.name_ja }}</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight text-mist-900 sm:text-6xl">{{ site.name }}</h1>
        <div class="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-dawn-400 to-glow-500"></div>
        <p v-if="site.tagline" class="mt-6 max-w-xl text-lg text-mist-600">{{ site.tagline }}</p>
        <div v-if="site.join_url" class="mt-8">
          <a
            :href="site.join_url"
            target="_blank"
            rel="noopener"
            class="inline-block rounded-full bg-dawn-500 px-6 py-2.5 font-bold text-white shadow-sm transition hover:bg-dawn-600"
          >
            加入我们
          </a>
        </div>
      </div>
    </section>

    <!-- 简介 + 部门 -->
    <section v-if="site.description || site.departments?.length" class="mx-auto max-w-5xl px-5 py-14">
      <h2 class="text-2xl font-bold text-mist-900">关于我们</h2>
      <p v-if="site.description" class="mt-4 max-w-2xl leading-relaxed text-mist-600">
        {{ site.description }}
      </p>
      <ul v-if="site.departments?.length" class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="dept in site.departments"
          :key="dept.name"
          class="rounded-xl border border-mist-200 bg-white p-4"
        >
          <div class="font-bold text-mist-900">{{ dept.name }}</div>
          <p v-if="dept.blurb" class="mt-1 text-sm leading-relaxed text-mist-600">{{ dept.blurb }}</p>
        </li>
      </ul>
    </section>

    <!-- 沿革：history.yml 非空时渲染 -->
    <section v-if="history.length" class="mx-auto max-w-5xl px-5 py-14">
      <h2 class="mb-8 text-2xl font-bold text-mist-900">社团沿革</h2>
      <Timeline :items="history" />
    </section>

    <!-- 最新活动 -->
    <section v-if="latest.length" class="mx-auto max-w-5xl px-5 py-14">
      <div class="flex items-baseline justify-between">
        <h2 class="text-2xl font-bold text-mist-900">最新活动</h2>
        <a :href="withBase('/posts')" class="text-sm text-glow-600 transition hover:text-glow-700">
          全部活动 →
        </a>
      </div>
      <div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <PostCard v-for="post in latest" :key="post.url" :post="post" />
      </div>
    </section>
  </div>
</template>

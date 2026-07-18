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
    <!-- Hero：晨雾场景为纯装饰（aria-hidden），文字内容置于其上 -->
    <section class="relative overflow-hidden">
      <div aria-hidden="true" class="absolute inset-0">
        <div
          class="absolute inset-0 bg-gradient-to-b from-dawn-100 via-mist-100 to-mist-50 dark:from-mist-900 dark:via-mist-950 dark:to-mist-950"
        ></div>
        <div
          class="absolute -top-20 right-[8%] h-72 w-72 rounded-full bg-dawn-300/50 blur-3xl dark:bg-dawn-600/30"
        ></div>
        <div
          class="absolute top-16 left-[12%] h-48 w-48 rounded-full bg-glow-500/15 blur-3xl dark:bg-glow-500/20"
        ></div>
        <svg
          class="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
        >
          <path
            d="M0 180 L0 110 L210 55 L430 130 L650 35 L910 140 L1150 65 L1440 120 L1440 180 Z"
            class="fill-mist-200/70 dark:fill-mist-800/60"
          />
          <path
            d="M0 180 L0 150 L260 105 L520 160 L790 85 L1090 170 L1310 115 L1440 150 L1440 180 Z"
            class="fill-mist-300/50 dark:fill-mist-700/40"
          />
        </svg>
      </div>
      <div class="relative mx-auto max-w-5xl px-5 pb-28 pt-20 sm:pt-28">
        <p v-if="site.name_ja" class="text-sm tracking-[0.5em] text-mist-600 dark:text-mist-400">
          {{ site.name_ja }}
        </p>
        <h1
          class="mt-3 text-4xl font-black tracking-tight text-mist-900 sm:text-6xl dark:text-mist-100"
        >
          {{ site.name }}
        </h1>
        <div
          aria-hidden="true"
          class="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-dawn-400 to-glow-500"
        ></div>
        <p v-if="site.tagline" class="mt-6 max-w-xl text-lg text-mist-700 dark:text-mist-300">
          {{ site.tagline }}
        </p>
        <div class="mt-8 flex flex-wrap items-center gap-4">
          <a
            v-if="site.join_url"
            :href="site.join_url"
            target="_blank"
            rel="noopener"
            class="rounded-full bg-dawn-700 px-6 py-2.5 font-bold text-white shadow-sm transition hover:bg-dawn-800"
          >
            加入我们
          </a>
          <a
            :href="withBase('/posts')"
            class="rounded-full font-medium text-glow-700 transition hover:text-glow-600 dark:text-glow-300 dark:hover:text-glow-200"
          >
            看看我们的活动 →
          </a>
        </div>
      </div>
    </section>

    <!-- 简介 + 部门 -->
    <section
      v-if="site.description || site.departments?.length"
      class="mx-auto max-w-5xl px-5 py-16"
    >
      <div class="flex items-center gap-3">
        <span
          aria-hidden="true"
          class="h-6 w-1.5 rounded-full bg-gradient-to-b from-dawn-400 to-glow-500"
        ></span>
        <h2 class="text-2xl font-bold text-mist-900 dark:text-mist-100">关于我们</h2>
      </div>
      <p
        v-if="site.description"
        class="mt-5 max-w-3xl leading-relaxed text-mist-700 dark:text-mist-300"
      >
        {{ site.description }}
      </p>
      <ul v-if="site.departments?.length" class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="dept in site.departments"
          :key="dept.name"
          class="overflow-hidden rounded-2xl border border-mist-200 bg-white dark:border-mist-800 dark:bg-mist-900"
        >
          <img
            v-if="dept.image"
            :src="withBase(dept.image)"
            :alt="dept.name"
            loading="lazy"
            class="aspect-[16/9] w-full object-cover"
          />
          <div
            v-else
            aria-hidden="true"
            class="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-mist-100 via-mist-50 to-dawn-50 dark:from-mist-800 dark:via-mist-900 dark:to-mist-950"
          >
            <span
              class="absolute -right-1 top-1 select-none text-7xl font-black text-mist-200/80 dark:text-mist-700/40"
            >
              {{ dept.name.slice(0, 1) }}
            </span>
            <span
              class="absolute bottom-4 left-5 h-1 w-10 rounded-full bg-gradient-to-r from-dawn-400 to-glow-500 opacity-70"
            ></span>
          </div>
          <div class="p-5">
            <h3 class="font-bold text-mist-900 dark:text-mist-100">{{ dept.name }}</h3>
            <p
              v-if="dept.text"
              class="mt-2 text-sm leading-relaxed text-mist-600 dark:text-mist-300"
            >
              {{ dept.text }}
            </p>
          </div>
        </li>
      </ul>
    </section>

    <!-- 沿革：history.yml 的 items 非空时渲染 -->
    <section v-if="history.length" class="mx-auto max-w-5xl px-5 py-16">
      <div class="mb-10 flex items-center gap-3">
        <span
          aria-hidden="true"
          class="h-6 w-1.5 rounded-full bg-gradient-to-b from-dawn-400 to-glow-500"
        ></span>
        <h2 class="text-2xl font-bold text-mist-900 dark:text-mist-100">社团沿革</h2>
      </div>
      <Timeline :items="history" />
    </section>

    <!-- 最新活动 -->
    <section v-if="latest.length" class="mx-auto max-w-5xl px-5 py-16">
      <div class="flex items-baseline justify-between">
        <div class="flex items-center gap-3">
          <span
            aria-hidden="true"
            class="h-6 w-1.5 rounded-full bg-gradient-to-b from-dawn-400 to-glow-500"
          ></span>
          <h2 class="text-2xl font-bold text-mist-900 dark:text-mist-100">最新活动</h2>
        </div>
        <a
          :href="withBase('/posts')"
          class="rounded-md text-sm font-medium text-glow-600 transition hover:text-glow-700 dark:text-glow-300 dark:hover:text-glow-200"
        >
          全部活动 →
        </a>
      </div>
      <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <PostCard v-for="post in latest" :key="post.url" :post="post" />
      </div>
    </section>
  </div>
</template>

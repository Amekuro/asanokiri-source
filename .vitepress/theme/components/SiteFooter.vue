<script setup lang="ts">
import { data as site } from '../site.data'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-mist-200 bg-mist-100">
    <div class="mx-auto max-w-5xl px-5 py-8 text-sm text-mist-500">
      <ul class="flex flex-wrap gap-x-8 gap-y-2">
        <li v-if="site.qq_group">QQ 群：{{ site.qq_group }}</li>
        <li v-if="site.wechat">微信公众号：{{ site.wechat }}</li>
        <li v-if="site.bilibili">
          <a :href="site.bilibili" target="_blank" rel="noopener" class="transition hover:text-glow-600">
            bilibili 官方账号
          </a>
        </li>
      </ul>
      <p class="mt-4 text-xs text-mist-400">© {{ year }} {{ site.name }}</p>
    </div>
  </footer>
</template>

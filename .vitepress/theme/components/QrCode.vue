<script setup lang="ts">
import { withBase } from 'vitepress'
import type { Contact } from '../site.data'

defineProps<{ contact: Contact }>()
</script>

<!--
  二维码展示：qr_image（上传图）优先，否则用构建期生成的矢量二维码。
  底色恒为白（深色模式下也保持深码白底，保证可扫描），avatar 叠加在中心。
-->
<template>
  <div class="relative aspect-square w-full overflow-hidden rounded-lg bg-white p-1.5">
    <img
      v-if="contact.qr_image"
      :src="withBase(contact.qr_image)"
      :alt="`${contact.name}二维码`"
      loading="lazy"
      class="h-full w-full object-contain"
    />
    <svg
      v-else-if="contact.qr_path"
      :viewBox="`0 0 ${contact.qr_size} ${contact.qr_size}`"
      role="img"
      :aria-label="`${contact.name}二维码`"
      class="h-full w-full"
    >
      <path :d="contact.qr_path" fill="#1b212b" />
    </svg>
    <img
      v-if="contact.avatar"
      :src="withBase(contact.avatar)"
      alt=""
      class="absolute left-1/2 top-1/2 h-[24%] w-[24%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-0.5"
    />
  </div>
</template>

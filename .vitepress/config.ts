import { defineConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'

// base 唯一定义处：迁移到根路径部署时只改这一行
const base = '/asanokiri/'

export default defineConfig({
  base,
  lang: 'zh-CN',
  title: '朝之雾动漫社',
  description: '朝之雾动漫社官方网站：社团介绍与活动存档',
  cleanUrls: true,
  srcExclude: ['CLAUDE.md', 'README.md'],
  markdown: {
    theme: 'github-light',
  },
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: base + 'favicon.svg' }]],
  vite: {
    plugins: [tailwindcss()],
  },
})

import { defineConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'

// base 唯一定义处。默认 /asanokiri/（GitHub Pages 项目页）。
// 部署到根路径的平台（如 Cloudflare Pages 默认域名）时，构建环境设
// SITE_BASE=/ 覆盖即可，内容零改动、GitHub Pages 侧不受影响。
const base = process.env.SITE_BASE ?? '/asanokiri/'

export default defineConfig({
  base,
  lang: 'zh-CN',
  title: '朝之雾动漫社',
  description: '朝之雾动漫社官方网站：社团介绍与活动存档',
  cleanUrls: true,
  srcExclude: ['CLAUDE.md', 'README.md', 'docs/**'],
  markdown: {
    // 双主题 + main.css 中的媒体查询实现代码块自适应深色
    theme: { light: 'github-light', dark: 'github-dark' },
  },
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: base + 'favicon.svg' }]],
  vite: {
    plugins: [tailwindcss()],
  },
})

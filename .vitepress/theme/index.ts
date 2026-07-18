import type { Theme } from 'vitepress'
import type { Directive } from 'vue'
import Layout from './Layout.vue'
import './styles/main.css'

/**
 * v-reveal：滚动入场（配合 main.css 的 .reveal-hidden / .reveal-shown）。
 * 交错延迟用内联 `--reveal-delay` 自定义属性。
 * 降级：reduced-motion、无 JS、以及首屏内的元素都不做入场，避免闪烁。
 */
const reveal: Directive<HTMLElement> = {
  mounted(el) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.88) return
    el.classList.add('reveal-hidden')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('reveal-shown')
            observer.disconnect()
          }
        }
      },
      { threshold: 0.08 },
    )
    observer.observe(el)
  },
  getSSRProps: () => ({}),
}

export default {
  Layout,
  enhanceApp({ app }) {
    app.directive('reveal', reveal)
  },
} satisfies Theme

import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  date: string
  cover?: string
  featured?: boolean
  url: string
}

declare const data: Post[]
export { data }

function formatDate(raw: unknown): string {
  const d = raw instanceof Date ? raw : new Date(String(raw))
  return Number.isNaN(+d) ? String(raw ?? '') : d.toISOString().slice(0, 10)
}

// 文件名以日期开头（YYYY-MM-DD-<slug>.md），glob 排除非文章文件
export default createContentLoader('posts/[0-9]*.md', {
  transform(raw) {
    return raw
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title as string,
        date: formatDate(frontmatter.date),
        cover: frontmatter.cover as string | undefined,
        featured: frontmatter.featured as boolean | undefined,
        url,
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
  },
})

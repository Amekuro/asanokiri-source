import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { load } from 'js-yaml'
import { defineLoader } from 'vitepress'

export interface HistoryItem {
  year: string | number
  title: string
  text?: string
  image?: string
}

declare const data: HistoryItem[]
export { data }

const file = fileURLToPath(new URL('../../data/history.yml', import.meta.url))

export default defineLoader({
  watch: [file],
  load(): HistoryItem[] {
    if (!fs.existsSync(file)) return []
    const parsed = load(fs.readFileSync(file, 'utf-8')) as { items?: HistoryItem[] } | null
    return parsed?.items ?? []
  },
})

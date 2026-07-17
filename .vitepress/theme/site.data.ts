import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { load } from 'js-yaml'
import { defineLoader } from 'vitepress'

export interface Department {
  name: string
  blurb?: string
}

export interface SiteInfo {
  name: string
  name_ja?: string
  tagline?: string
  description?: string
  departments?: Department[]
  join_url?: string
  qq_group?: string
  wechat?: string
  bilibili?: string
}

declare const data: SiteInfo
export { data }

const file = fileURLToPath(new URL('../../data/site.yml', import.meta.url))

export default defineLoader({
  watch: [file],
  load(): SiteInfo {
    return load(fs.readFileSync(file, 'utf-8')) as SiteInfo
  },
})

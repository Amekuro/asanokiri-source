import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { load } from 'js-yaml'
import { defineLoader } from 'vitepress'
import { encode } from 'uqr'

export interface Department {
  name: string
  text?: string
  image?: string
}

export interface Contact {
  name: string
  text?: string
  link?: string
  /** 二维码内容链接：构建期生成二维码（qr_image 未设置时生效） */
  qr_link?: string
  /** 上传的二维码图片，优先于 qr_link 生成 */
  qr_image?: string
  /** 二维码中心头像 */
  avatar?: string
  /** 以下两项构建期由 qr_link 生成，内容文件不要手写 */
  qr_path?: string
  qr_size?: number
}

export interface SiteInfo {
  name: string
  name_ja?: string
  tagline?: string
  description?: string
  departments?: Department[]
  contacts?: Contact[]
}

declare const data: SiteInfo
export { data }

const file = fileURLToPath(new URL('../../data/site.yml', import.meta.url))

export default defineLoader({
  watch: [file],
  load(): SiteInfo {
    const site = load(fs.readFileSync(file, 'utf-8')) as SiteInfo
    for (const contact of site.contacts ?? []) {
      if (contact.qr_link && !contact.qr_image) {
        // ECC H（约 30% 容错）：中心叠头像后仍可扫描
        const { size, data: modules } = encode(contact.qr_link, { ecc: 'H', border: 1 })
        let path = ''
        modules.forEach((row, y) => {
          row.forEach((on, x) => {
            if (on) path += `M${x} ${y}h1v1h-1z`
          })
        })
        contact.qr_path = path
        contact.qr_size = size
      }
    }
    return site
  },
})

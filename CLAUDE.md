# CLAUDE.md — 朝之雾社团门户（原型）

面向本仓库中的 Claude 会话。架构级改动（技术栈、内容模型、部署）须同步更新本文件。

## 现状

个人仓库中的原型，由 Claude Code 会话直接开发维护；经 GitHub Actions 部署到个人 GitHub Pages 的项目路径（`https://<user>.github.io/<repo>/`），用于确认最终效果。定稿后迁往社团 org，正式部署平台届时三选一（GitHub Pages / Cloudflare Pages / EdgeOne Pages）。

站点定位：社团对外门面 + 活动存档，低频更新。内容与微信公众号同步发布，站点侧用 markdown 重新排版，不搬运公众号 HTML。未来内容维护者：映像研究部部员，不要求会 Git。

## 原则（冲突时以此裁决）

1. 网站要活很多年：三年后无人懂代码，仍能正常更新内容。
2. 内容与代码分离：内容 = markdown + YAML，改内容不碰 `.vitepress/`。
3. 依赖冻结：版本精确 pin，`package-lock.json` 提交，不接入自动升级。
4. 纯静态无后端：报名外链飞书 Bitable 表单，视频走 B 站 embed。
5. 不为不存在的内容建页面。

## 技术栈

- VitePress 2.x（npm `next` 渠道，版本精确 pin）+ 完全自定义主题（不 extend 默认主题）
- Tailwind CSS v4（`@tailwindcss/vite`）+ `@tailwindcss/typography`；样式纯自写，不引入任何 UI 组件库
- Sveltia CMS（挂载于 `/admin/`）
- Node 最新 LTS（当前 24），pin 于 `.nvmrc` 与 `package.json#engines`，CI 以 `.nvmrc` 为准
- 原型部署：GitHub Pages 项目页，Pages 源设为 GitHub Actions，官方 `actions/deploy-pages` workflow

## 目录结构

```
.github/workflows/deploy.yml   # build + 官方 Pages 部署
.vitepress/
  config.ts            # base 唯一定义处；vite.plugins 挂 tailwindcss()
  theme/
    index.ts
    Layout.vue         # 按 frontmatter.layout 分发三种模板
    layouts/           # HomeLayout / PostListLayout / PostLayout
    styles/main.css    # Tailwind 入口 CSS；设计 token 唯一定义处（取色自 B 站官号头像）
    components/        # Timeline.vue、PostCard.vue、SiteHeader.vue、SiteFooter.vue
    posts.data.ts      # createContentLoader 聚合 posts/
    site.data.ts       # 读 data/site.yml（js-yaml）
    history.data.ts    # 读 data/history.yml（js-yaml）
data/
  site.yml             # 全局信息（唯一必需的数据文件）
  history.yml          # 沿革 timeline（items 为空则首页不渲染该区块）
posts/
  YYYY-MM-DD-<slug>.md
public/
  admin/               # Sveltia：index.html（CDN 引入，版本 pin 死）+ config.yml
  uploads/             # Sveltia 媒体目录（WebP）
  favicon.svg
index.md               # 首页（纯数据驱动，正文为空）
posts.md               # 文章列表页；放根目录以保持 posts/ 只含文章（Sveltia folder collection 不能排除单个文件）
```

## 内容模型

posts frontmatter 保持最小：`title`（必）、`date`（必）、`cover`（选）、`featured`（选，未来精选页的过滤钩子，当前无消费方）。

`data/site.yml`：`name`、`name_ja`（装饰用日文读法，可删）、`tagline`、`description`、`departments: [{ name, text?, image? }]`（各部门一段自述 + 可选配图）、`join_url`（Bitable 表单）、`qq_group`、`wechat`、`bilibili`。留空的字段不渲染。

`data/history.yml`：`items: [{ year, title, text?, image? }]`（顶层包 `items` 键，适配 CMS file collection 编辑；根级列表 CMS 无法编辑）。

已裁决不建：`departments.yml`、独立作品集合。

## 页面（仅三个模板）

1. 首页：区块化、数据驱动。hero + 简介必有（首屏含「加入我们」→ `join_url`）；timeline 仅当 `history.yml` 非空时渲染；最新活动列表。页脚：QQ 群 / 公众号 / B 站。新增区块遵循同一模式：数据文件出现 → 区块出现。
2. 文章列表：按 `date` 倒序。
3. 文章详情：正文容器统一 `prose`。

## 实现约定

- `base` 仅在 `.vitepress/config.ts` 一处定义（原型为 `/<repo>/`）。内容文件（frontmatter、YAML）中的资源路径一律写站根绝对路径（如 `/uploads/x.webp`）；VitePress 只自动处理 markdown 正文内的引用，主题代码消费 frontmatter / YAML 路径时必须经 `withBase()`。迁移到根路径部署时只改 base 一行，内容零改动。
- Tailwind 入口 CSS 用 `source()` 显式指定扫描根：v4 自动探测会跳过 `.vitepress` 目录（tailwindlabs/tailwindcss#16050）。
- markdown 正文排版一律交给 `prose`，不为文章内容手写样式。
- 深色模式：默认跟随系统，页头 ThemeToggle 手动切换。状态走 VitePress 内建 appearance（写 `useData().isDark`，内核管 `html.dark`、localStorage 记忆与防闪烁脚本，选择与系统一致时回退为跟随系统）；Tailwind `dark:` 为 class 策略（`@custom-variant` 定义）；代码块用 shiki 双主题。对比度按 WCAG AA：浅色端次要文字最浅 `mist-600`，深色端最浅 `mist-400`，实心按钮 `dawn-700` 底白字，链接浅/深端分别 `glow-600` / `glow-300`。
- `public/uploads/sample-*.svg` 为示例占位插画，`data/` 与 `posts/` 中标注（示例）的内容同理，正式内容就位后替换删除。
- 图片一律经 Sveltia 上传（自动 WebP）；禁止外链公众号图床 `mmbiz.qpic.cn`（防盗链）。视频不入仓库，一律 B 站 iframe。
- Sveltia `config.yml`：`backend: github`；posts 为 folder collection，site / history 为 file collection；字段定义与本文件内容模型保持同步。

## 鉴权（/admin）

`/admin` 是纯静态页面，无需服务端保护；Sveltia 在浏览器直连 GitHub API，门禁即 GitHub 仓库权限。

- 本地开发：Sveltia 本地模式直接读写工作目录，无需登录（Chrome/Edge）。
- 上线初期：编辑者用 fine-grained PAT（仅本仓库 Contents 读写）登录。
- 之后可选：部署 sveltia-cms-auth（Cloudflare Worker）走 GitHub OAuth；写权限仍由仓库 ACL 裁决。

## 命令

```bash
npm run dev / build / preview   # 对应 vitepress dev / build / preview
```

每次改动后以 `npm run build` 验证（与 CI 同款命令）。

## 不做

后端、数据库、自建登录体系、评论（未来若需要：giscus）、UI 组件库、CSS 预处理器、自动依赖升级。

## 路线图

- [x] 骨架：VitePress + Tailwind + Sveltia config + Actions workflow，本地跑通
- [ ] 部署到个人 Pages 项目路径，线上跑通
- [ ] 三个模板的设计与实现（原型核心）
- [ ] Sveltia 编辑流程实测（PAT 登录）
- [ ] 定稿：迁社团 org，选定正式部署平台，补交接文档

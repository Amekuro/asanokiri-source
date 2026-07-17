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

- VitePress（stable，pin 死）+ 完全自定义主题（不 extend 默认主题）
- Tailwind CSS v4（`@tailwindcss/vite`）+ `@tailwindcss/typography`；样式纯自写，不引入任何 UI 组件库
- Sveltia CMS（挂载于 `/admin/`）
- Node LTS，pin 于 `.nvmrc` 与 `package.json#engines`
- 原型部署：GitHub Pages 项目页，Pages 源设为 GitHub Actions，官方 `actions/deploy-pages` workflow

## 目录结构（目标）

```
.github/workflows/deploy.yml   # build + 官方 Pages 部署
.vitepress/
  config.ts            # base 唯一定义处；vite.plugins 挂 tailwindcss()
  theme/
    index.ts
    Layout.vue         # 按 frontmatter.layout 分发三种模板
    styles/main.css    # Tailwind 入口 CSS
    components/        # Timeline.vue、PostCard.vue 等
    posts.data.ts      # createContentLoader 聚合 posts/
data/
  site.yml             # 全局信息（唯一必需的数据文件）
  history.yml          # 沿革 timeline（可选，存在即渲染）
posts/
  YYYY-MM-DD-<slug>.md
public/
  admin/               # Sveltia：index.html + config.yml
  uploads/             # Sveltia 媒体目录（WebP）
index.md               # 首页
```

## 内容模型

posts frontmatter 保持最小：`title`（必）、`date`（必）、`cover`（选）、`featured`（选，未来精选页的过滤钩子，当前无消费方）。

`data/site.yml`：社团名、tagline、简介（含各部门一句话）、`join_url`（Bitable 表单）、QQ 群、公众号名、B 站空间链接。

`data/history.yml`：`[{ year, title, text, image? }]`。

已裁决不建：`departments.yml`、独立作品集合。

## 页面（仅三个模板）

1. 首页：区块化、数据驱动。hero + 简介必有（首屏含「加入我们」→ `join_url`）；timeline 仅当 `history.yml` 非空时渲染；最新活动列表。页脚：QQ 群 / 公众号 / B 站。新增区块遵循同一模式：数据文件出现 → 区块出现。
2. 文章列表：按 `date` 倒序。
3. 文章详情：正文容器统一 `prose`。

## 实现约定

- `base` 仅在 `.vitepress/config.ts` 一处定义（原型为 `/<repo>/`）。内容文件（frontmatter、YAML）中的资源路径一律写站根绝对路径（如 `/uploads/x.webp`）；VitePress 只自动处理 markdown 正文内的引用，主题代码消费 frontmatter / YAML 路径时必须经 `withBase()`。迁移到根路径部署时只改 base 一行，内容零改动。
- Tailwind 入口 CSS 用 `source()` 显式指定扫描根：v4 自动探测会跳过 `.vitepress` 目录（tailwindlabs/tailwindcss#16050）。
- markdown 正文排版一律交给 `prose`，不为文章内容手写样式。
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

- [ ] 骨架：VitePress + Tailwind + Sveltia config + Actions workflow，本地跑通
- [ ] 部署到个人 Pages 项目路径，线上跑通
- [ ] 三个模板的设计与实现（原型核心）
- [ ] Sveltia 编辑流程实测（PAT 登录）
- [ ] 定稿：迁社团 org，选定正式部署平台，补交接文档

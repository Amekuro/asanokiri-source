# 设计与踩坑记录

面向本仓库的开发者（含未来的 Claude 会话）。记录原型开发过程中每个易错点**当时的写法、遇到的问题、修改思路与原因**，用于保留经验、避免重蹈覆辙。

与 `CLAUDE.md` 的分工：`CLAUDE.md` 记录**当前生效的约定**（是什么），本文件记录**为什么是这样、曾经错在哪**（怎么来的）。改动架构时，两份都要顾及。

> 阅读提示：下文「✗ 当时写法」是**已被否定的历史写法**，不要照抄；「✓ 现行」才是当前代码。

---

## 一、主题切换：五版演进（迭代最多，教训最集中）

深浅色切换从「无按钮纯自适应」一路改到「三段式开关 + 整页交叉淡入」，前后五版，几乎每版都踩了坑。按时间顺序：

| 版本 | commit | 交互 | 切换动画 | 被否定的原因 |
| --- | --- | --- | --- | --- |
| v1 | `ce1c12e` | 无手动开关，纯跟随系统 | 无 | 用户需要手动开关 |
| v2 | `8c4eec1` | 单按钮（太阳/月亮）二态 | 无 | 需要显式「跟随系统」+ 三态 |
| v3 | `821ae93` | 下拉菜单三态 | View Transitions 圆形扩散 | 菜单不够直观；圆形扩散是记忆错误 |
| v4 | `8a172a5` | 三段式开关 | 全站颜色 transition（`.theme-fade`） | 结束帧文字渲染差异 |
| v5 | `1547d3e` | 三段式开关（保留） | View Transitions 整页交叉淡入 | ——（现行） |

### v1 → v2：不要与框架的 appearance 机制打架

**背景**：v1 只有 `prefers-color-scheme` 自适应，用户要求加手动切换按钮。

**✗ v2 初次写法**：自己造轮子——写了一段内联防闪烁脚本 + 自定义 localStorage 键 `asanokiri-theme`，按钮里手动 `document.documentElement.classList.toggle('dark')` 并写存储。

**问题**：切换当下生效，但**刷新后失效**。VitePress 2 内核自带 appearance 管理（`config.ts` 的 `appearance: true` 默认开启），它有自己的防闪烁脚本和存储键 `vitepress-theme-appearance`，页面水合后会依据它自己的存储把 `html.dark` 重新计算一遍，把我们手动加的 class 覆盖掉。

**✓ 修改思路**：不与框架抢方向盘。按钮只写 `useData().isDark`，`html.dark` 的切换、localStorage 持久化、防闪烁脚本注入、系统偏好监听全部交给内核。代码反而更短。

```ts
// ✓ 现行：状态完全托管给 VitePress 内建 appearance
const { isDark } = useData()
// 切换 = isDark.value = true/false，其余内核全包
```

**教训**：接入成熟框架的既有能力前，先确认它是否已经做了这件事。重复实现不仅冗余，还会和框架的生命周期（水合、watcher）打架，产生「首次生效、刷新失效」这类隐蔽 bug。

同一版还把 Tailwind 的 `dark:` 变体从媒体查询策略改成 class 策略，以配合 `html.dark`：

```css
/* ✓ main.css：dark: 跟随 html.dark 而非系统媒体查询 */
@custom-variant dark (&:where(.dark, .dark *));
```

### v2 → v3：三态存储的「坍缩」陷阱

**背景**：二态按钮无法表达「显式跟随系统」。改为三态（浅色 / 深色 / 跟随系统）。

**✗ v3 写法**：选择后**同步**写存储 `localStorage.setItem(KEY, next)`。

**问题**：在浅色系统下选「浅色」，刷新后却变回「跟随系统」。原因是 VitePress 内核的 appearance watcher 有一条**坍缩规则**——当显式选择与当前系统偏好一致时，它会把存储值坍缩成 `auto`（这样系统切换时能继续跟随）。我们的同步写入发生在内核 watcher flush **之前**，随后就被内核覆盖了。

**✓ 修改思路**：把覆写排到内核 watcher 之后（`nextTick`）。

```ts
// ✓ 现行：nextTick 后再覆写，压过内核的坍缩
function switchTheme(next: Mode, willDark: boolean) {
  isDark.value = willDark
  mode.value = next
  void nextTick().then(() => {
    try { localStorage.setItem(KEY, next) } catch {}
  })
}
```

**教训**：与框架共享状态（这里是同一个 localStorage 键）时，要清楚各自的写入时机。框架的响应式 watcher 通常在 microtask（`nextTick`）里 flush，想覆盖它的结果就必须排在其后。用 Playwright 实测三种选择的存储落值（`light`/`dark`/`auto`）是确认这类时序 bug 的可靠手段。

### v3：圆形扩散动画是「记忆错误」——核实而非凭印象

**✗ v3 写法**：主题切换用 View Transitions 做**圆形扩散**（以点击点为圆心 `clip-path: circle()` 扩散），自称「vuejs.org 同款」。

**问题**：用户指出 vuejs.org 根本不是圆形扩散，是整体渐变。**核实**：拉取 `@vue/theme` npm 包源码，其 `VTSwitchAppearance.vue` 无任何 View Transitions 代码，切换效果仅来自 `base.css` 一行 `transition: color .5s, background-color .5s`。圆形扩散实为 antfu 个人博客的实现，被我记混。

**✓ 修改思路**：先撤掉圆形扩散（见 v4），按 vuejs.org 的真实做法（整体渐变）重做。

**教训**：涉及「某某站是怎么做的」这类事实断言，**不要凭记忆**，拆包 / 看源码核实。记忆里的「常识」经常张冠李戴。此坑之后确立习惯：宁可花几分钟 `npm pack` 拆包验证，也不写没核实的实现。

### v3 → v4：菜单换三段式开关；顺带修「默认浅色」与白闪

**✗ v3 交互**：下拉菜单。**问题**：菜单收起时看不到当前处于哪个模式，用户误以为「网站默认浅色」——实际是之前测试时往存储写了 `light`，菜单不显示状态所以无从察觉。

**✓ v4 改为三段式开关**：浅色 – 自动 – 深色，太阳 / 显示器 / 月亮图标 + 滑块，当前档位**永远可见**。`radiogroup` 语义。

**白闪修复**：v3 及之前浅→深切换瞬间会闪一下白。**原因**：只有内层容器设了背景色，`html` 元素本身没设，切换的一帧里露出了浏览器 UA 默认白底。**✓ 修改**：给 `html` 两端都显式设背景色。

```css
/* ✓ main.css：html 显式背景色，杜绝切换/滚动越界露白 */
:root { color-scheme: light; background-color: var(--color-mist-50); }
:root.dark { color-scheme: dark; background-color: var(--color-mist-950); }
```

**教训**：下拉菜单把状态藏起来了，三段式开关把状态摊开——**能常显的状态就别藏进弹层**，很多「行为不对」的错觉源于状态不可见。

### v4 → v5：全站 transition 的「结束帧」硬伤 → 改整页交叉淡入

这是最烧脑的一坑，值得完整记录。

**✗ v4 写法**：仿 vuejs.org，切换瞬间给 `.theme-fade *` 全站元素挂 `transition: color/background-color/... 0.45s`，动画结束后摘掉这个临时 class。

**问题（用户反馈）**：切换渐变的**结束帧**，多处**纯文本**（あさのきり、大标题、各区块标题、部门卡片段落、页脚……）与静止态有肉眼可辨的细微差异；而带 `transition` 工具类的按钮、白字压暗渐变的活动卡片却完全正常。

**关键线索**：用户精准报出「谁正常谁异常」。异常的全是**无过渡工具类的纯文本**，正常的全是**有自身过渡的按钮**或**颜色恒定的白字卡片**。这条规律是破案钥匙。

**两次失败的补救尝试**（都在「全站 transition」框架内打转）：

1. `setTimeout(摘 class, 500)`：定时器与过渡实际结束不同帧，摘早了就截断过渡。
2. 改监听 `html` 背景色的 `transitionend` 再摘：逐像素静止态测试（verify6）通过了，但**逐帧**测试（verify7）仍抓到结束前最后一帧 `rgb(121,135,153)` 与最终 `rgb(150,164,182)` 的跳变——证明只要走「元素各自 transition」这条路，就绕不开截断与合成层问题。

**根因**（两条叠加）：

- **合成层抗锯齿差异**：过渡期间文本被提升到合成层，其抗锯齿方式与静止后的原生渲染不同，肉眼看到「些许差别」。
- **过渡截断**：摘 class 的时机无论如何都难与所有属性的过渡结束严格对齐，utility-class 着色下必然截断部分元素。

按钮为何无恙——它们本就带 `transition` 工具类，残差被自身过渡掩盖；活动卡片白字压在图片压暗渐变上，颜色不随明暗变，自然不受影响。与用户观察完全吻合。

**✓ v5 修改思路**：跳出「元素各自过渡」的框架，改用 `document.startViewTransition` 做**整页交叉淡入**——浏览器把切换前后各拍一张整页快照做 crossfade，动画一结束就**交还原生渲染**。结束帧即原生渲染本身，与全新加载**逐像素一致**，合成层与截断问题从根上消失。仍是整页渐变（不做圆形扩散等自定义几何），观感符合预期。

```ts
// ✓ 现行：整页 crossfade，结束即原生渲染
if (willDark === isDark.value || !document.startViewTransition ||
    matchMedia('(prefers-reduced-motion: reduce)').matches) {
  switchTheme(next, willDark)          // 无 API / 减弱动效 / 无明暗变化：直切
  return
}
document.startViewTransition(async () => { switchTheme(next, willDark); await nextTick() })
```

```css
/* ✓ 时长/缓动只在此定义；不写 clip-path，即默认交叉淡入 */
::view-transition-old(root), ::view-transition-new(root) {
  animation-duration: 0.45s; animation-timing-function: ease;
}
```

同版还把 hero 入场动画的 `animation-fill-mode` 从 `both` 改为 `backwards`，让动画结束后释放合成层，避免大标题长期停在合成层上产生同类抗锯齿差异。

**教训**：
- **视觉动画的结束态必须严格等于静态渲染态**，否则「动画跑完那一下」会有突变。验收动画不能只看「静止后颜色对不对」，要**逐帧**确认结束帧无跳变（Playwright `requestAnimationFrame` 采样）。
- 给大量元素挂 CSS transition 会把它们提升到合成层，带来抗锯齿变化——文本尤其敏感。需要「整页级」过渡时，**View Transitions 的快照 crossfade 优于给每个元素挂 transition**，因为它结束后干净地交还原生渲染。
- 用户反馈里「谁正常谁异常」的差异模式，往往比「哪里不对」更能定位根因。

---

## 二、深色模式底层实现的两个坑（v1 引入时）

### prose 深色不要用 `prose-invert`

**✗ 当时写法**：`.prose` 上加 `dark:prose-invert`。

**问题**：文章页深色下标题隐形。`@tailwindcss/typography` 的 `prose-invert` 是通过重新指派一批 CSS 变量（`--tw-prose-invert-*` → `--tw-prose-*`）实现的；而我们在 `.prose` 上写了未分层的变量覆写（`--tw-prose-headings: ...`），特异度/层级压过了 `prose-invert` 的变量重指派，深色端拿不到反色。

**✓ 修改**：不用 `prose-invert`，直接在 `.dark .prose {}` 里覆写同名变量。

```css
.dark { .prose { --tw-prose-headings: var(--color-mist-100); /* ... */ } }
```

### shiki 双主题需自行应用

**✗ 当时以为**：配了 `markdown.theme: { light, dark }` 就会自动切换。

**问题**：VitePress 只把两套颜色输出成 CSS 变量 `--shiki-light` / `--shiki-dark`，**不自动应用**。深色下代码块仍是浅色配色。

**✓ 修改**：手动在深色端应用 dark 变量。

```css
.dark .shiki, .dark .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}
```

---

## 三、其他关键决策与踩坑

### 部署架构：单仓库 → 双仓库（源码 + 构建产物）

**v1 写法**：单仓库 `asanokiri`，`deploy.yml` 用官方 `actions/deploy-pages`——构建产物直接上传到 Pages CDN，**不落任何 git 仓库**，源码天然干净。

**为何改双仓库**：不是为了「让构建产物离开源码仓库」——deploy-pages 已经做到了。真实动机是**产物可移植**：把 `.vitepress/dist` 存成一个独立的纯静态仓库（`asanokiri`），是一份任何平台都能直接消费的成品，契合路线图「迁 org 后在 GitHub / Cloudflare / EdgeOne Pages 三选一」。源码仓库更名为 `asanokiri-source`，新建空仓库 `asanokiri` 承接产物。

**✓ 现行机制**：`asanokiri-source` 的 Actions 构建后，把 `dist` 以**单提交强制推送**到 `amekuro/asanokiri` 的 `main`，由后者自身的 GitHub Pages（源＝分支）服务。要点：

- **URL 与 base 零改动**：部署仓库名仍是 `asanokiri`、仍作项目页服务，故 `https://amekuro.github.io/asanokiri/` 不变，`base` 仍 `/asanokiri/`，内容与主题代码一行不改。
- **跨仓库推送用 SSH 部署密钥**，不用 PAT：deploy key 锁定单仓库、**无有效期**；PAT 会过期，一年后静默失效——与「网站要活很多年」冲突。私钥存源码仓库 secret `DEPLOY_KEY`，公钥作为 `asanokiri` 的 write deploy key。
- **不用第三方 action**（如 peaceiris）：手写十余行 bash（`git init` 一个 orphan、`.nojekyll`、force push）即可，透明、无第三方依赖腐烂风险，契合「三年后能懂」。
- **单提交强制覆盖**：部署仓库每次只留最新产物，不累积历史、不膨胀。
- `permissions: contents: read` 足矣：不再需要 `pages: write` / `id-token: write`（那是 deploy-pages 的要求）。

**踩坑提示**：GitHub 仓库改名后旧名会**重定向**，`git remote` 仍显示旧 URL 但实际指向新库；而在旧名上**新建**同名空库会**顶掉重定向**。本次即：`asanokiri` 从「重定向到 asanokiri-source」变成「独立空库（0 refs）」。改名后本地旧 clone 的 `origin` 会指向那个新空库，源码工作务必重新指向 `asanokiri-source`，别把源码推进部署仓库。

### 构建 / 工具链

- **VitePress 2.x 在 `next`/alpha 渠道**：npm `latest` 仍是 1.6.x，2.x 走 `next`（当前 pin `2.0.0-alpha.18`）。选它是因为它是积极开发线、官方文档站在用；接受其 alpha 状态并精确 pin。
- **Tailwind v4 必须显式 `source()`**：v4 自动探测扫描根时会跳过 `.vitepress` 目录（tailwindlabs/tailwindcss#16050），主题里写的 class 不生成。入口 CSS 用 `@import "tailwindcss" source("../../..")` 指到仓库根。
- **CI/本地 Node 版本一致**：CI 以 `.nvmrc` 为准（Node 24）。本地验证构建时下载**同一 Node 版本**跑 `npm run build`，避免「本地过、CI 挂」。

### 内容 / 数据

- **中文长文本 YAML 不用 `>-` 折行**：YAML 折叠标量在换行处会注入一个**英文空格**，中文里会多出难看的空格。长文案写成单行。
- **`history.yml` 顶层包 `items:` 键**：Sveltia file collection 能编辑对象下的列表字段，但**不能编辑根级就是列表**的文件。故结构设计为 `{ items: [...] }` 而非顶层直接 `[...]`。
- **`posts.md` 放在仓库根**而非 `posts/` 内：Sveltia folder collection **无法排除目录内的单个文件**，把列表页放根目录可让 `posts/` 只含文章，保持 CMS 里干净。
- **内容路径写站根绝对路径 + `withBase()`**：frontmatter / YAML 里的资源路径写 `/uploads/x.webp`（迁移到根路径部署时只改 `base` 一行）。VitePress 只自动处理 markdown 正文里的引用，**主题代码消费 frontmatter/YAML 路径时必须过 `withBase()`**，否则项目路径部署下 404。
- **内容模型宁简勿繁，按需扩容**：部门介绍最初设计成一句话 `blurb`，用户明确要「一段文字 + 可能配图」后才扩成 `{ text, image }`。不预先为「可能用得上」的字段建模。

### 二维码（联系方式）

- **构建期生成，客户端零依赖**：用 `uqr` 在数据加载器（`site.data.ts`）里把 `qr_link` 编码成矢量 path，随数据注入；`uqr` 不进客户端 bundle。
- **容错等级用 ECC-H**：中心要叠 LOGO/头像会遮挡部分码点，高容错（≈30%）保证仍可扫。
- **深色模式保持白底深码**：二维码不跟随深色反相——反相后多数扫码器识别率骤降。深色页面里也强制白底。

### Sveltia CMS 的 i18n（已知限制）

- UI 语言目前**只有 en / ja**，无中文。经查其 `src/lib/locales/README.md`：1.0 前字符串未冻结，**暂不接受任何社区翻译**，日语也只是作者为自有客户维护。缓解：`config.yml` 里所有 collection/字段 label 写中文，编辑者高频接触的是中文。
- 注意区分：Sveltia 宣传的 "first-class i18n" 指**内容多语言**（条目翻译），与 **UI 界面语言**是两回事，别被官网文案误导。
- 跟进时机：等 Sveltia 1.0 字符串冻结后再考虑贡献 zh-Hans。因低频使用，当前不投入。

---

## 四、通用经验（元教训）

1. **不与框架打架**：接入成熟能力前先确认框架是否已实现（appearance 案例）。重复造轮子会与框架生命周期冲突。
2. **事实断言必须核实**：「某站怎么做的」不凭记忆，拆包/看源码（圆形扩散乌龙）。
3. **动画结束态 == 静态态**：逐帧验收，不能只看静止结果（全站 transition 结束帧案例）。
4. **状态要可见**：能常显的状态别藏进弹层（下拉菜单 → 三段开关）。
5. **用工具而非肉眼验收**：Playwright 采样 computed style / 逐帧颜色，做逐像素断言，比截图目测可靠。
6. **重视用户的「差异模式」**：「谁正常谁异常」的规律常比「哪里坏了」更快指向根因。

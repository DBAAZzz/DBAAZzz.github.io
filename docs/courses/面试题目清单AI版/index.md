---
title: 前端面试题库完整分类
author: DBAAZzz
date: 2025/12/21 16:15
categories:
  - 面试
tags:
  - 面试
---

# 前端面试题库完整分类

> 来源：https://feinterview.poetries.top/docs/docs/base

---

## 一、HTML、HTTP、WEB 综合问题

---

### 1. 前端需要注意哪些 SEO 问题？

在现代前端工程体系下，SEO 不再只是 TDK 的堆砌，而是一场涵盖**渲染链路**与**核心 Web 指标**的系统优化：

- **基础标签优化 (TDK)**：

  - **Title**：页面标题，权重最高，需包含核心关键词。
  - **Description**：页面描述，影响点击率，需简明扼要。
  - **Keywords**：关键词（权重已降低，但仍有参考价值）。
  - **Meta 标签**：合理使用 `viewport`、`robots` 等 meta 属性控制爬虫行为。

- **核心 Web 指标 (Core Web Vitals)**：Google 已将 **LCP**（最大内容绘制）、**INP**（交互延迟）、**CLS**（累计布局偏移）作为排名权重。可以说，**性能优化即 SEO**。
- **渲染方案选型**：
  - **SSR (服务端渲染)**：如 Next.js/Nuxt.js，对搜索引擎提供最完整的 HTML 结构。
  - **SSG (静态站点生成)**：适用于纯展示类内容，利用构建时预热实现极致的索引速度。
  - **预渲染 (Prerendering)**：通过 `Puppeteer` 等工具在静态服务器端为爬虫输出快照。
- **语义化与结构化数据**：
  - 符合 W3C 规范的 HTML5 标签增加权重。
  - 使用 **JSON-LD** 或 **Schema.org** 规范配置结构化数据，获取“富媒体摘要” (Rich Snippets) 以提升搜索结果点击率。
- **单页应用特殊处理**：利用 `react-helmet` 动态注入 Meta，并结合 `Sitemap.xml` 指引爬虫高效抓取核心路径。

---

### 2. `<img>`的 title 和 alt 有什么区别

- **alt (Alternative Text)**：替代文本。当图片无法加载（如网络错误、路径错误）时显示的文本。它是为了**无障碍访问**（屏幕阅读器会读取 alt）和 **SEO**（搜索引擎通过 alt 理解图片含义）而设计的。
- **title**：提示文本。当鼠标悬停在图片上时显示的工具提示（Tooltip）。它不仅适用于 img，也适用于其他 HTML 元素，用于提供额外的咨询信息。

---

### 3. HTTP 的几种请求方法及其幂等性

在资深面试中，判断开发者对 RESTful 规范的掌握程度，关键在于理解**幂等性 (Idempotency)** 和**安全性**：

- **GET**：安全且幂等。用于资源获取，参数应严格遵循规范放在 URL 中。
- **POST**：**非安全且非幂等**。常用于创建资源，多次重复请求可能产生多条记录（这也是为什么刷新 POST 提交后的页面浏览器会提示“重新发送数据”）。
- **PUT**：幂等。用于资源的**全量覆盖**。
- **PATCH**：**通常不幂等**。用于资源的局部更新，例如“对计数器进行 +1 操作”的 PATCH 请求执行多次会导致结果不同。
- **DELETE**：幂等。资源删除，同一个请求发 10 次，资源的删除状态是确定的。
- **OPTIONS**：预检请求。在涉及自定义 Header 或复杂 Content-Type 的**非简单跨域请求**中，浏览器会自动发起 OPTIONS 请求探测服务器权限。

浏览器在发送跨域请求时，如果请求不满足 CORS 定义的“简单请求”条件，就会自动先发送一次 OPTIONS 预检请求，用来确认服务器是否允许该跨域请求的方法、请求头和来源。常见触发场景包括使用 PUT、DELETE 等方法，携带 Authorization 等自定义请求头，或使用 application/json 作为 Content-Type。

---

### 4. 从浏览器地址栏输入 URL 到页面显示的完整链路

这是一个考察广度与深度的综合题，现代化的回答应包含 **HSTS、TLS 1.3、浏览器多进程协作**：

1.  **URL 处理与 HSTS 校验**：浏览器判断 URL 合法性。检查 **HSTS 预加载列表**，若在列表中则强制使用 HTTPS（防范 SSL 降级攻击）。
2.  **DNS 解析 (递归搜索与缓存)**：涉及多级检查（内核缓存 -> 系统缓存 -> 运营商 DNS）。性能点：应用 `dns-prefetch` 预解析。
3.  **连接建立 (TCP & TLS 1.3 握手)**：经过 TCP 三次握手后，引入 **TLS 1.3 协议**。现代协议仅需 1 个 RTT 即可完成握手，并支持 **0-RTT** 会话恢复。
4.  **HTTP 请求转发 (多路复用)**：如果采用 HTTP/2 或 HTTP/3 (QUIC)，会通过单一连接实现资源的并行传输，并解决队头阻塞问题。
5.  **服务端处理与 CDN 调度**：LB 负载均衡 -> Nginx 反向代理 -> CDN 边缘节点 -> 缓存策略校验。
6.  **CRP (关键渲染路径) 构建**：
    - **Main Thread**：解析解析 HTML/CSS，构建组件 DOM 与 CSSOM 树，计算布局树 (Layout Tree)。
    - **Compositor/GPU Thread**：执行图层拆分，通过光栅化产生位图，由 GPU 在独立进程中完成图层合并，最终显示。
7.  **资源利用优化**：提及 `Preload` / `Preconnect` 指令对关键路径的加速。

---

### 5. 如何进行网站性能优化？

在 8 年大厂视角下，性能优化不仅是资源的压缩，更是一场关于 **RAIL 模型** (Response, Animation, Idle, Load) 的全链路治理：

- **资源传输层**：
  - **协议升级**：开启 HTTP/2 或 HTTP/3，利用多路复用减少连接开销。
  - **智能压缩**：使用 `Brotli` 替代 `Gzip`；图片采用 `WebP` 或 `AVIF` 格式。
  - **CDN 加速**：动静分离，利用边缘计算处理首屏逻辑。
- **渲染构建层**：
  - **原子化包体积**：Tree-shaking、组件异步加载 (Dynamic Import)。
  - **关键路径优化**：内联 Critical CSS，推迟非关键 JS 执行。
  - **RAIL 指标治理**：减少长任务 (Long Tasks)，确保交互响应在 100ms 内。
- **感知性能层**：
  - **预加载策略**：使用 `Quicklink` 或 `Guess.js` 根据视口预测加载。
  - **骨架屏/占位符**：缓解用户焦虑，减少布局偏移 (CLS)。

---

### 6. HTTP 状态码及其生产环境语义

作为面试官，我更希望你理解状态码背后的**业务影响**与**处理逻辑**：

- **2xx (成功)**：
  - `204 No Content`：请求成功但无返回，常用于埋点上报或探测。
- **3xx (重定向/缓存)**：
  - `301` vs `302`：前者是 SEO 权重的永久转移；后者是临时的路径切换。
  - `304 Not Modified`：**协商缓存命中**。不仅节省带宽，更直接减少了主线程重解析的开销。
- **4xx (客户端错误)**：
  - `401 Unauthorized`：登录态过期。
  - `403 Forbidden`：权限不足，非登录问题。
  - `429 Too Many Requests`：触发了服务端的限流策略。
- **5xx (服务端错误)**：
  - `502 Bad Gateway` vs `504 Gateway Timeout`：前者通常是后端应用挂了；后者通常是 Nginx 等网关等太久了。

---

### 7. 对 HTML 语义化的理解

在资深开发者的视角中，语义化不仅仅是“用对标签”，而是**构建良好的文档对象模型 (DOM) 与无障碍树 (Accessibility Tree)** 的基础。

- **核心价值**：

  - **无障碍性 (A11y) 的基石**：语义化标签直接映射到浏览器的 **Accessibility Tree**。例如，屏幕阅读器能自动识别 `<nav>` 为导航地标，识别 `<button>` 为可交互控件，而无需额外的 ARIA 属性配置。
  - **SEO 与机器可读性**：搜索引擎爬虫依赖 `h1-h6` 构建内容大纲，依赖 `article`、`section` 区分独立内容块。语义化是 SEO 的第一步。
  - **代码的可维护性**：`header`、`main`、`footer` 相比满屏的 `div`，提供了天然的代码分层，降低了团队协作的认知负荷。

- **进阶理解：交互与行为的封装**：
  语义化标签往往附带了**浏览器原生的交互行为**。

  - **Focus Management**：`<button>` 和 `<a>` 天然支持 Tab 键聚焦和 Enter 键触发，而用 `div` 模拟按钮则需要手动处理 `tabindex` 和键盘事件，增加了代码复杂度和出错率。
  - **表单增强**：在移动端，`<input type="email">` 会自动唤起带 @ 的键盘，这是纯样式无法模拟的用户体验优化。

- **总结**：语义化是用最标准的方式描述数据，让浏览器、爬虫和辅助技术都能以最低的成本理解内容。

---

### 8. 介绍一下你对浏览器内核的理解？

浏览器内核主要分为两部分：**渲染引擎 (Rendering Engine)** 和 **JS 引擎 (JavaScript Engine)**。

1.  **渲染引擎**：负责解析 HTML、CSS，计算网页布局并渲染。
    - **Trident**：IE 内核。
    - **Gecko**：Firefox 内核。
    - **Webkit**：Safari 内核（由 Apple 开发）。
    - **Blink**：Chrome、Edge、Opera 内核（Google 此时基于 Webkit 分支开发）。
2.  **JS 引擎**：负责解析和执行 JavaScript 代码。
    - **V8**：Chrome、Node.js。
    - **SpiderMonkey**：Firefox。
    - **JavaScriptCore**：Safari。

---

### 9. html5 有哪些新特性、移除了那些元素？

**新特性：**

- **语义化标签**：`header`, `footer`, `nav`, `section`, `article`, `aside` 等。
- **增强型表单**：`input` 类型 (date, email, number, url) 和属性 (placeholder, required, pattern)。
- **媒体元素**：`audio`, `video`。
- **Canvas** 和 **SVG** 绘图。
- **地理定位** (Geolocation)。
- **拖拽 API** (Drag and Drop)。
- **本地存储**：`localStorage`, `sessionStorage`。
- **新 API**：Web Workers, WebSocket, History API。

**移除的元素：**

- 纯表现的元素：`big`, `center`, `font`, `s`, `strike`, `tt`, `u`。
- 对可用性产生负面影响的元素：`frame`, `frameset`, `noframes`。

---

### 10. HTML5 的离线储存怎么使用，工作原理能不能解释一下？

> 注：Application Cache (Manifest) 已废弃，现代开发推荐使用 **Service Worker** + **Cache API**。但面试中仍可能考察原理。

**使用方法 (AppCache)：**

1.  在 html 标签添加 `manifest` 属性：`<html manifest="site.appcache">`。
2.  创建 `.appcache` 文件，列出需要缓存的资源（CACHE, NETWORK, FALLBACK）。

**工作原理：**

- 在线时：浏览器发现 html 头部有 manifest 属性，会请求该 manifest 文件。如果是第一次访问，浏览器会下载 manifest 文件中列出的所有资源并进行本地存储。
- 如果 manifest 文件未发生变化，浏览器使用本地缓存的资源，不发送请求。
- 如果 manifest 文件更新了，浏览器会重新下载所有资源并更新缓存。
- 离线时：浏览器直接使用本地缓存的资源。

---

### 11. 浏览器是怎么对 HTML5 的离线储存资源进行管理和加载的呢

1.  **加载阶段**：
    - 浏览器首次访问页面时，解析 html，发现 `manifest` 属性。
    - 浏览器在后台下载 manifest 文件及其列出的所有文件，并存入 Application Cache。
2.  **更新阶段**：
    - 再次访问时，浏览器会先发送请求检查 manifest 文件是否有更新（对比文件 hash 或修改时间）。
    - 如果 manifest **没有变化**，或者是离线状态，直接从 Application Cache 加载资源，**HTTP 请求此时不会发生**。
    - 如果 manifest **发生变化**，浏览器会重新下载 manifest 中的所有文件。注意：本次加载依然使用旧缓存，新缓存将在下一次刷新页面时生效。
3.  **状态管理**：通过 `window.applicationCache` 对象可以监听缓存状态（updateready, cached, checking 等）。

---

### 12. Cookie、LocalStorage 与 SessionStorage 的深度选型

大厂面试关注的是方案背后的**安全性**与**主线程性能影响**：

| 特性         | Cookie                                                          | LocalStorage                                       | SessionStorage               |
| :----------- | :-------------------------------------------------------------- | :------------------------------------------------- | :--------------------------- |
| **定位**     | **身份认证** (Auth)                                             | **偏好设置** (Persist)                             | **一次性会话** (Transient)   |
| **存储量**   | 4KB (受限)                                                      | 5MB~10MB (充足)                                    | 5MB~10MB                     |
| **安全性**   | **高风险**。需开启 `HttpOnly` 防 XSS，开启 `SameSite` 防 CSRF。 | 易受 XSS 污染。                                    | 易受 XSS 污染。              |
| **性能表现** | **影响网络性能**。每个请求均携带，导致额外带宽消耗。            | **阻塞主线程**。同步读写，若存取大数据会导致卡顿。 | 同 LocalStorage。            |
| **数据共享** | 同源标签页共享。                                                | 同源标签页永久共享。                               | 仅限**当前标签页**内部共享。 |

- **扩展方案：IndexedDB**。对于大型静态资源缓存或大量结构化数据，应首选 **IndexedDB**，它是**异步执行**且支持事务的，不会阻塞主线程渲染。

---

### 13. iframe 的工程隐患（为什么现在少用了？）

目前在微前端 (Micro-frontends) 等场景下，iframe 已逐渐被 `Web Components` 或 `Sandbox` 取代，原因如下：

1.  **加载阻塞**：iframe 会阻塞主页面的 `onload`。
2.  **连接限制**：共享浏览器并发连接数。
3.  **安全性**：面临点击劫持 (Clickjacking) 风险。建议设置 `X-Frame-Options: DENY`。
4.  **体验割裂**：跨域 iframe 无法同步滚动、弹窗定位，且 `history` 栈管理混乱。
5.  **SEO 与 A11y**：对爬虫及屏幕阅读器极其不友好。

---

### 14. WEB 标准以及 W3C 标准是什么?

- **WEB 标准**：不是某一个标准，而是一系列标准的集合。主要包括：
  - **结构 (Structure)**：HTML (XHTML, XML)。
  - **表现 (Presentation)**：CSS。
  - **行为 (Behavior)**：ECMAScript (JavaScript), DOM。
- **W3C 标准**：由万维网联盟 (World Wide Web Consortium) 制定的标准。
- **核心思想**：**结构、表现和行为的分离**。这样做的好处是利于维护、语义化更好、SEO 更好、跨设备兼容性更高。

---

### 15. xhtml 和 html 有什么区别?

- **XHTML (Extensible HyperText Markup Language)**：是基于 XML 的 HTML，更严格。
- **HTML (HyperText Markup Language)**：超文本标记语言。

**主要区别 (XHTML 的严格性)**：

1.  **标签必须闭合**：如 `<br />`, `<img />`。
2.  **标签和属性必须小写**。
3.  **属性值必须用引号包围**。
4.  **属性必须有值**：不能简写（如 `checked="checked"` 而不是 `checked`）。
5.  **必须有根元素**。
    html5 的出现使得语法更加宽松，现在主流开发都使用 HTML5。

---

### 16. Doctype 作用? 严格模式与混杂模式如何区分？它们有何意义?

- **Doctype (Document Type)**：声明位于文档中的最前面，处于 `<html>` 标签之前。告知浏览器解析器用什么文档类型规范来解析这个文档。
- **严格模式 (Standards Mode)**：浏览器按照 W3C 标准解析代码。
- **混杂模式 (Quirks Mode)**：浏览器为了兼容旧版本（如 IE5），模拟老式浏览器的行为（例如错误的盒模型）。
- **区分**：
  - 如果文档包含严格的 `DOCTYPE`，浏览器会进入严格模式。
  - 如果 `DOCTYPE` 不存在或者形式不正确，浏览器会进入混杂模式。
  - 可以通过 `document.compatMode` 查看（`CSS1Compat` 为严格模式，`BackCompat` 为混杂模式）。
- **意义**：决定了浏览器如何渲染页面，特别是盒模型的计算方式。

---

### 17. 行内元素有哪些？块级元素有哪些？ 空(void)元素有那些？行内元素和块级元素有什么区别？

- **块级元素 (Block)**：`div`, `p`, `h1-h6`, `ul`, `ol`, `li`, `dl`, `dt`, `dd`, `table`, `form`, `header`, `footer`, `nav`, `section` 等。
- **行内元素 (Inline)**：`span`, `a`, `img`, `b`, `strong`, `i`, `em`, `label`, `input`, `select`, `textarea`, `br` 等。
- **空元素 (Void)**：`<br>`, `<hr>`, `<img>`, `<input>`, `<link>`, `<meta>`。

**区别**：

1.  **布局**：块级元素独占一行，宽度默认 100%；行内元素和其他元素在一行，宽度由内容决定。
2.  **宽高**：块级元素可以设置 `width`, `height`, `margin`, `padding`；行内元素设置 `width`, `height` 无效，垂直方向的 `margin`, `padding` 虽然有效但不会撑开父容器（对周围元素布局无影响）。
3.  **嵌套**：块级元素可以包含块级和行内元素；行内元素一般只能包含文本和其他行内元素。

---

### 18. HTML 全局属性(global attribute)有哪些

全局属性是可以配置在任何 HTML 元素上的属性：

- `class`：类名。
- `id`：唯一标识。
- `style`：行内样式。
- `title`：额外咨询信息（Tooltip）。
- `data-*`：自定义数据属性。
- `hidden`：隐藏元素。
- `tabindex`：Tab 键顺序。
- `contenteditable`：是否可编辑。
- `draggable`：是否可拖拽。
- `lang`：语言设置。

---

### 19. Canvas 和 SVG 有什么区别？

| 特性         | Canvas                                     | SVG                                                    |
| :----------- | :----------------------------------------- | :----------------------------------------------------- |
| **基础**     | 位图 (Raster)，基于像素                    | 矢量图 (Vector)，基于 XML                              |
| **绘制方式** | 通过 JavaScript 绘制 (getContext)          | 通过 HTML 标签绘制 (DOM)                               |
| **事件处理** | 不支持 DOM 事件（只能监听 Canvas 整体）    | 支持 DOM 事件（每个元素都是 DOM 节点）                 |
| **分辨率**   | 依赖分辨率，放大失真                       | 不依赖分辨率，放大清晰                                 |
| **性能**     | **动态渲染高性能**（适合游戏、大数据图表） | **DOM 操作昂贵**（对象多了会卡顿，适合静态图表、地图） |
| **保存**     | `toDataURL` 保存为图片                     | 保存为 SVG 文件                                        |

---

### 20. HTML5 为什么只需要写 `<!DOCTYPE HTML>`

- HTML5 不基于 SGML（标准通用标记语言），因此不需要对 DTD（文档类型定义）进行引用。
- 这是一个标准写法，旨在让所有现代浏览器进入**标准模式 (Standards Mode)** 进行渲染。它简洁且向前向后兼容。

---

### 21. 如何在页面上实现一个圆形的可点击区域？

1.  **CSS border-radius**：将 `div` 或 `button` 宽高设为相等，`border-radius: 50%`。
2.  **HTML Map Area**：使用 `<map>` 和 `<area shape="circle" coords="x,y,r" href="...">`。
3.  **SVG**：使用 `<circle>` 标签，并添加点击事件。
4.  **JavaScript**：监听点击事件，计算点击坐标到圆心的距离。

---

### 22. 网页验证码是干嘛的，是为了解决什么安全问题

- **作用**：区分用户是计算机还是人（Turing Test）。
- **解决的安全问题**：
  - **防止暴力破解**（如密码撞库）。
  - **防止恶意注册**（批量注册垃圾账号）。
  - **防止刷票/刷帖/垃圾评论**。
  - **防止爬虫抓取**。

---

### 23. viewport

**Viewport (视口)** 是用户在网页上可见的区域。在移动端，viewport 极为重要，分为：

1.  **Layout Viewport (布局视口)**：默认宽度通常是 980px，为了在手机上完整展示 PC 网页。
2.  **Visual Viewport (视觉视口)**：用户当前看到的屏幕区域（受缩放影响）。
3.  **Ideal Viewport (理想视口)**：屏幕分辨率宽度，不需要缩放和滚动就能完美阅读。
    通常使用 `<meta name="viewport" content="width=device-width, initial-scale=1.0">` 来设置理想视口。

---

### 24. 渲染优化

**HTML/CSS:**

- 避免深层嵌套。
- 避免使用 CSS 表达式。
- 使用 `transform` 和 `opacity` 做动画（触发硬件加速，避开重排）。
  **JS:**
- 批量修改 DOM（`documentFragment`, `display: none` 修改后还原）。
- 避免 强制同步布局（读取 layout 属性如 `offsetWidth` 会强制重排）。
- 使用 `requestAnimationFrame`。
- 防抖 (Debounce) 和 节流 (Throttle)。

---

### 25. meta viewport 相关

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>
```

- `width=device-width`：宽度等于设备宽度。
- `initial-scale=1.0`：初始缩放比例 1:1。
- `maximum-scale=1.0`：允许用户缩放到的最大比例。
- `minimum-scale=1.0`：允许用户缩放到的最小比例。
- `user-scalable=no`：禁止用户缩放（出于无障碍考虑，现在不建议完全禁止）。

---

### 26. 你做的页面在哪些流览器测试过？这些浏览器的内核分别是什么?

- **Chrome**: Blink 内核 (以前是 Webkit)。
- **Firefox**: Gecko 内核。
- **Safari**: Webkit 内核。
- **Edge**: Blink 内核 (早期是 EdgeHTML)。
- **IE**: Trident 内核 (已逐渐淘汰)。
- **Opera**: Blink 内核 (以前是 Presto)。

---

### 27. div+css 的布局较 table 布局有什么优点？

- **语义化好**：内容与和表现分离，结构清晰。
- **渲染快**：Table 需要等待整个表格内容加载完才渲染，Div 可以逐步渲染。
- **SEO 友好**：爬虫更容易抓取重要内容。
- **维护方便**：修改 CSS 即可改变布局，无需改动结构。
- **灵活性高**：容易实现响应式布局。

---

### 28. a：img 的 alt 与 title 有何异同？b：strong 与 em 的异同？

- **alt vs title**：
  - `alt` 是图片内容的替代，用于加载失败或屏幕阅读器（SEO 重要）。
  - `title` 是鼠标悬停提示，用于补充信息。
- **strong vs em**：
  - `strong` 表示**语气的强烈重要性**（通常加粗）。
  - `em` 表示**语气的强调**（Usually emphasis, 通常斜体）。
  - `b` 和 `i` 只是单纯的视觉效果（加粗、斜体），无语义。HTML5 中推荐使用语义化标签。

---

### 29. 你能描述一下渐进增强和优雅降级之间的不同吗

- **渐进增强 (Progressive Enhancement)**：
  - **向上兼容**。从最基础的浏览器支持开始构建（保障核心内容和功能），然后为支持 CSS3/HTML5 的现代浏览器增加更丰富的交互和样式。
- **优雅降级 (Graceful Degradation)**：
  - **向下兼容**。先构建功能最完善的现代版本，然后针对旧版本浏览器进行修补或提供替代方案，确保其能“优雅”地展示（哪怕功能被阉割）。

---

### 30. 为什么利用多个域名来存储网站资源会更有效？

这是一个典型的**协议演进题**：

- **HTTP/1.x 时代 (Domain Sharding)**：
  - **原因**：浏览器对单一域名的最大 TCP 连接数限制（通常为 6 个）。使用多域名可以突破该限制，提升静态资源的并行下载效率。
  - **副作用**：增加了 DNS 解析时间、TLS 握手开销。
- **HTTP/2 时代 (Antipattern)**：
  - **现状**：**反向模式**。由于 HTTP/2 支持**多路复用 (Multiplexing)**，在单一长连接上性能最优。
  - **结论**：多域名反而会降低压缩率（头部字典不共享），增加连接建立成本。建议资源收敛到单一域名（CDN 除外）。

---

### 31. 简述一下 src 与 href 的区别

- **src (Source)**：指向**外部资源的位置**，指向的内容将会**嵌入到文档中当前标签所在的位置**。
  - 例如：`<script src="js.js">`、`<img src="img.png">`。
  - 当浏览器解析到 `src` 时，会暂停页面的渲染，下载并执行该资源（这也是把 js 放底部的理由）。
- **href (Hypertext Reference)**：指向**网络资源所在位置**，建立和当前元素（锚点）或当前文档（链接）之间的**链接**。
  - 例如：`<link href="style.css">`、`<a href="url">`。
  - 浏览器会并行下载资源（如 CSS），不会停止对当前文档的处理。

---

### 32. 知道的网页制作会用到的图片格式有哪些？

- **JPG/JPEG**：有损压缩，色彩丰富。适用于：照片、复杂的颜色渐变图。不支持透明。
- **PNG**：无损压缩，支持透明。适用于：图标、LOGO、透明背景图。
- **GIF**：支持动画，色彩有限（256 色）。适用于：简单的动态图。
- **WebP**：Google 开发，兼具 JPG 和 PNG 的优点，压缩率更高，支持透明和动画。兼容性越来越好。
- **SVG**：矢量图，体积小，不失真。适用于：图标、矢量插画。
- **Base64**：将图片编码为字符串嵌入代码，减少 HTTP 请求，但体积会增加 1/3。适用于：极小的图标。

---

### 33. 在 CSS/JS 代码上线之后，开发人员经常会优化性能。从用户刷新网页开始，一次 JS 请求一般情况下有哪些地方会有缓存处理？

1.  **浏览器缓存 (Browser Cache)**：强缓存 (Expires/Cache-Control) 和 协商缓存 (Last-Modified/ETag)。
2.  **DNS 缓存**：浏览器 DNS 缓存 -> 系统 DNS 缓存 -> 路由器缓存。
3.  **CDN 缓存**：内容分发网络节点缓存。
4.  **服务器缓存**：网关 (Nginx) 缓存、应用层缓存。

---

### 34. 大型电商网站首屏图片优化方案 (Large Image Loading)

这种业务场景考察的是你对**用户感知性能**的极致追求：

1.  **图片格式治理**：利用 CDN 能力实现**自适应格式转换**，优先输出 `AVIF` 或 `WebP`。
2.  **分级预加载**：
    - **LCP 元素 (首屏核心图)**：使用 `<link rel="preload" as="image">` 提升加载优先级。
    - **非核心资源**：推迟非关键图片加载，开启原生 `loading="lazy"`。
3.  **响应式加载 (`srcset` & `sizes`)**：根据客户端 PPI 及视口宽度下发不同分辨率的图片，减少无效带宽损耗。
4.  **低质量影像占位 (LQIP)**：使用模糊缩略图或 Canvas 渐进式渲染，缓解加载过程中的视觉突兀。
5.  **CDN 边缘处理**：结合 HTTP `Accept` 请求头，在网关层做动态压缩与裁剪。

---

### 35. 常见排序算法的时间复杂度,空间复杂度

| 排序算法     | 平均时间复杂度 | 最好情况 | 最坏情况 | 空间复杂度 | 稳定性 |
| :----------- | :------------- | :------- | :------- | :--------- | :----- |
| **冒泡排序** | O(n²)          | O(n)     | O(n²)    | O(1)       | 稳定   |
| **选择排序** | O(n²)          | O(n²)    | O(n²)    | O(1)       | 不稳定 |
| **插入排序** | O(n²)          | O(n)     | O(n²)    | O(1)       | 稳定   |
| **快速排序** | O(nlogn)       | O(nlogn) | O(n²)    | O(logn)    | 不稳定 |
| **归并排序** | O(nlogn)       | O(nlogn) | O(nlogn) | O(n)       | 稳定   |

---

### 36. web 开发中会话跟踪的方法有哪些

1.  **Cookie**：最常用，数据存储在客户端。
2.  **Session**：数据存储在服务器端，通过 Cookie (JSESSIONID/PHPSESSID) 关联。
3.  **Token (JWT)**：无状态认证，适合前后端分离和移动端。
4.  **HTML5 本地存储 (localStorage/sessionStorage)**：配合 Token 使用。
5.  **URL 重写**：将 SessionID 拼接到 URL 后面（如 `?sid=xxx`），用于禁用 Cookie 的场景。
6.  **隐藏表单域**：表单提交时带上 SessionID。

---

### 37. HTTP request 报文结构是怎样的

HTTP 请求报文由四部分组成：

1.  **请求行 (Request Line)**：包括请求方法 (GET/POST)、请求 URL、HTTP 版本。
    > 示例：`GET /index.html HTTP/1.1`
2.  **请求头 (Request Headers)**：键值对，包含 Host, User-Agent, Content-Type, Cookie 等。
3.  **空行**：表示请求头结束。
4.  **请求体 (Request Body)**：POST 请求提交的数据（GET 请求通常没有）。

---

### 38. HTTP response 报文结构是怎样的

HTTP 响应报文由四部分组成：

1.  **状态行 (Status Line)**：包括 HTTP 版本、状态码、状态描述。
    > 示例：`HTTP/1.1 200 OK`
2.  **响应头 (Response Headers)**：键值对，包含 Content-Type, Content-Length, Set-Cookie, Date 等。
3.  **空行**：表示响应头结束。
4.  **响应体 (Response Body)**：服务器返回的数据（HTML, JSON, 图片等）。

---

### 39. title 与 h1 的区别、b 与 strong 的区别、i 与 em 的区别

- **title vs h1**：`title` 是网页标题（标签栏显示），面向 SEO 和浏览器；`h1` 是文章主题（页面内显示），面向用户。
- **b vs strong**：`b` 是**视觉加粗**；`strong` 是**语义强调**（重要性高）。
- **i vs em**：`i` 是**视觉斜体**；`em` 是**语义强调**（侧重语气）。

---

### 40. 请你谈谈 Cookie 的弊端

1.  **大小受限**：每个 Cookie 只有 4KB 左右。
2.  **性能浪费**：Cookie 会被附加在同域名的每一个 HTTP 请求中，消耗带宽。
3.  **安全风险**：容易被拦截（明文传输），存在 XSS（跨站脚本攻击）获取 Cookie 和 CSRF（跨站请求伪造）风险。
4.  **操作麻烦**：原生 API `document.cookie` 操作简陋，需要自行封装。

---

### 41. git fetch 和 git pull 的区别

- **git fetch**：从远程仓库拉取最新的代码和 commit 到本地仓库，但**不会自动合并**到当前工作分支。它更新的是 `origin/master` 指针。
  - 安全，可以先查看更新情况再合并。
- **git pull**：从远程仓库拉取最新代码并**立即合并** (Merge) 到当前工作分支。
  - 等同于 `git fetch + git merge`。
  - 可能会产生冲突。

---

### 42. HTTP/2 与 HTTP/3 的工程化升级

面试官在考察你对网络底层协议演变的洞察力：

- **HTTP/2 (基于 TCP)**：
  - **二进制分帧 (Binary Framing)**：将信息拆分为更小的帧，提升解析效率。
  - **多路复用 (Multiplexing)**：解决 HTTP/1.1 的**资源级队头阻塞**，允许多个请求交错发送。
  - **头部压缩 (HPACK)**：建立静态/动态字典，大幅节省重复 Headers 占用的字节。
  - **服务端推送**：在浏览器请求 HTML 时主动推送 JS/CSS。
- **HTTP/3 (基于 UDP/QUIC)**：
  - **解决 TCP 队头阻塞**：TCP 丢包会导致整个连接重传，而基于 UDP 的 QUIC 协议仅影响受损的流 (Stream)。
  - **0-RTT 建立连接**：结合 TLS 1.3，大幅缩短首字节时间 (TTFB)。
  - **连接迁移**：用户在 WIFI 与 4G/5G 切换时，无需重新建立握手（基于 Connection ID）。

---

## 二、CSS 相关

---

### 1. 简述一下你对 CSS 盒模型的理解

在 8 年大厂实践中，核心在于**布局的可预测性**：

- **内容定义**：所有 HTML 元素都可以看作矩形盒子，由 `content`, `padding`, `border`, `margin` 组成。
- **标准模型 (Object Model)**：`width` 仅包含 content。一旦增加内边距或边框，盒子就会被“撑大”，在复杂布局中极其容易导致页面错行。
- **怪异/IE 模型 (border-box)**：`width` 包含了 content + padding + border。
- **大厂共识**：现代前端项目（如 Ant Design, Tailwind）基本统一在根元素设置 `* { box-sizing: border-box; }`。这极大降低了 CSS 布局的计算心智，确保响应式容器的尺寸符合预期。

---

### 2. CSS 选择器有哪些？优先级算法如何计算？

- **常见选择器**：
  - 基础：`*` (通配符), `tag` (标签), `#id` (ID), `.class` (类)。
  - 组合：`,` (群组), ` ` (后代), `>` (子), `+` (相邻兄弟), `~` (通用兄弟)。
  - 属性：`[attr]`, `[attr=value]` 等。
  - 伪类：`:hover`, `:nth-child`, `:first-child`, `:not`, `:focus` 等。
  - 伪元素：`::before`, `::after` 等。
- **优先级 (Specificity)**：
  - `!important` > 内联样式 (1000) > ID 选择器 (0100) > 类/伪类/属性选择器 (0010) > 标签/伪元素选择器 (0001) > 通配符/继承/默认 (0000)。
  - 遵循“就近原则”（同权重）。

---

### 3. CSS 中哪些属性可以继承？

- **字体系列属性**：`font`, `font-family`, `font-weight`, `font-size`, `font-style`, `line-height`。
- **文本系列属性**：`color`, `text-align`, `text-indent`, `letter-spacing`, `word-spacing`, `white-space`, `visibility`。
- **列表属性**：`list-style` 等。
- **不可继承**：`border`, `padding`, `margin`, `width`, `height`, `background` 等盒子模型属性。

---

### 4. 伪类 (Pseudo-classes) 和 伪元素 (Pseudo-elements) 的区别？

- **伪类 (`:`)**：用于选择处于**特定状态**的元素（如 `:hover`）或**结构关系**的元素（如 `:first-child`）。它只是弥补了 CSS 选择器的不足，修饰已存在的元素。
- **伪元素 (`::`)**：用于**创建**一些不在文档树中的元素（如 `::before`, `::after`）或选择元素的**特定部分**（如 `::first-letter`）。它创建了新的虚拟元素。
- **写法**：CSS3 规范建议伪类用单冒号 `:`，伪元素用双冒号 `::`（但浏览器为了兼容性通常支持单冒号写法）。

---

### 5. link 与 @import 的区别？

| 特性         | link                      | @import                                   |
| :----------- | :------------------------ | :---------------------------------------- |
| **归属**     | HTML 标签                 | CSS 语法                                  |
| **加载顺序** | 页面加载时**同时加载**    | 等页面加载**完后**才加载（可能导致 FOUC） |
| **兼容性**   | 无兼容性问题              | IE5+ 才支持                               |
| **DOM 操作** | 可以通过 JS 操作 DOM 插入 | 无法通过 JS 操作                          |

---

### 6. px、em、rem、vw/vh、% 的区别？

- **px**：绝对单位，像素。
- **em**：相对单位。相对于**父元素**的字体大小（如果在 font-size 中使用是相对于父元素，在其他属性中使用是相对于当前元素字体大小）。
- **rem**：相对单位。相对于**根元素 (html)** 的字体大小。
- **vw/vh**：相对单位。1vw = 视口宽度的 1%，1vh = 视口高度的 1%。
- **%**：相对于父元素的宽高（具体取决于属性，如 width 相对父 width，font-size 相对父 font-size）。

---

### 7. display: none; 与 visibility: hidden; 与 opacity: 0 的区别？

| 属性                   | 空间占据          | 是否渲染 | 事件响应 | 重排/重绘                          | 子元素显示                                  |
| :--------------------- | :---------------- | :------- | :------- | :--------------------------------- | :------------------------------------------ |
| **display: none**      | **不占据** (消失) | 否       | 否       | **重排** + 重绘                    | 即使子元素设 display:block 也不显示         |
| **visibility: hidden** | **占据** (透明)   | 是       | 否       | **只重绘**                         | 子元素设 visibility: visible **可以显示**   |
| **opacity: 0**         | **占据** (透明)   | 是       | **是**   | **只重绘** (如果用了 GPU 加速则无) | 子元素设 opacity: 1 **不显示** (会一起透明) |

---

### 8. 什么是 FOUC (Flash of Unstyled Content)？如何避免？

- **现象**：页面加载时，先显示无样式的 HTML 内容，然后 CSS 加载完成后突然闪烁变成有样式的效果。
- **原因**：CSS 加载慢或使用 `@import` 导致 CSS 在 DOM 树构建完后才加载。
- **避免**：
  - 使用 `<link>` 标签代替 `@import`。
  - 将 CSS 放在 `<head>` 中。

---

### 9. 谈谈你对 BFC (Block Formatting Context) 的理解？

- **定义**：块级格式化上下文，是一个独立的渲染区域，内部元素的渲染不会影响到外部。
- **触发条件 (构建 BFC)**：
  - 根元素 (`<html>`)。
  - 浮动元素 (`float` 不为 `none`)。
  - 绝对定位元素 (`position` 为 `absolute` 或 `fixed`)。
  - 行内块元素 (`display` 为 `inline-block`)。
  - 表格单元格 (`display` 为 `table-cell`)。
  - `overflow` 不为 `visible` (`hidden`, `auto`, `scroll`)。
  - 弹性盒/网格项 (`display: flex/grid` 的子元素)。
- **作用 (应用场景)**：
  - **清除浮动**：父元素触发 BFC 可以包裹浮动子元素（解决高度塌陷）。
  - **防止 Margin 重叠**：同一个 BFC 内的相邻块级元素 Margin 会重叠，不同 BFC 不会。
  - **自适应两栏布局**：浮动元素 + 触发 BFC 的普通流元素（不会与浮动元素重叠）。

---

### 10. 谈谈清除浮动 (Float) 的几种方式及优缺点？

1.  **clear: both**：添加一个空 div 或 br 标签。
    - 缺点：增加无意义的 HTML 标签。
2.  **触发 BFC**：父元素设置 `overflow: hidden` 或 `auto`。
    - 优点：代码少。
    - 缺点：可能剪裁内容。
3.  **使用伪元素 (推荐)**：给父元素添加 `.clearfix` 类。
    ```css
    .clearfix::after {
      content: "";
      display: block; // 或 table
      clear: both;
    }
    ```
    - 优点：语义化好，无需额外标签，通用。

---

### 11. display、float、position 的关系？

1.  **position: absolute/fixed**：优先级最高，display 变为 `block` (flex/grid 除外)，float 失效。
2.  **float** (不为 none)：diplay 变为 `block` (table 等除外)，position 为 static/relative。
3.  **以上都无**：display 按设定值显示。

---

### 12. position 的属性值有哪些？relative 和 absolute 的定位原点分别是？

- **static**：默认值，正常文档流。
- **relative**：相对定位。相对于**自身原本的位置**。不脱离文档流。
- **absolute**：绝对定位。相对于**最近的已定位（非 static）祖先元素**。脱离文档流。
- **fixed**：固定定位。相对于**浏览器视口 (viewport)**。脱离文档流。
- **sticky**：粘性定位。基于 scroll 的阈值，在 relative 和 fixed 之间切换。

---

### 13. display: inline-block 什么时候会显示间隙？如何解决？

- **原因**：代码中的**换行符**或**空格**会被解析为一个空格字符（约 4px）。
- **解决**：
  1.  HTML 中**不换行**（代码难看）。
  2.  父元素设置 `font-size: 0`（子元素需重置 font-size）。
  3.  使用 `float` 替代。
  4.  使用 `flex` 布局（推荐）。

---

### 14. 什么是外边距重叠 (Margin Collapsing)？

- **现象**：垂直方向上相邻的两个块级元素，其 margin 会合并成一个（取绝对值最大的那个）。
- **发生场景**：
  1.  相邻兄弟元素。
  2.  父元素与第一个/最后一个子元素（甚至没有 border/padding 分隔）。
  3.  空块元素。
- **解决**：
  - 触发 **BFC**。
  - 父元素添加 `border` 或 `padding`。

---

### 15. 介绍一下 Flex 布局（弹性盒模型）及适用场景？

- **主轴 (justify-content)** 和 **交叉轴 (align-items)**。
- **常见属性**：
  - 容器：`flex-direction`, `flex-wrap`, `justify-content`, `align-items`.
  - 项目：`flex-grow` (放大), `flex-shrink` (缩小, 默认 1), `flex-basis` (基准大小).
  - 简写：`flex: 1` (= `flex: 1 1 0%`)，`flex: auto` (= `1 1 auto`)，`flex: none` (= `0 0 auto`)。
- **场景**：几乎所有的一维布局，垂直居中，自适应布局。

---

### 16. 介绍一下 Grid 布局（网格布局）？

- **二维布局**（行和列）。
- **属性**：
  - `grid-template-columns`, `grid-template-rows` (定义网格线，支持 `fr` 单位).
  - `grid-gap` (间距).
  - `grid-area` (区域命名).
- **场景**：复杂的页面骨架布局，仪表盘。

---

### 17. 移动端响应式布局有哪些方案？

1.  **Media Query (媒体查询)**：`@media screen and (max-width: 768px) { ... }`。
2.  **Rem 适配**：根据屏幕宽度动态设置 html 的 font-size (如 `amfe-flexible`)。
3.  **Viewport 适配 (vw/vh)**：直接使用 vw 单位布局（现代浏览器推荐）。
4.  **Flex / Grid 弹性布局**。
5.  **百分比布局** (已少用)。

---

### 18. 水平居中、垂直居中、水平垂直居中的方法有哪些？

- **行内元素**：`text-align: center`, `line-height` 等高。
- **块级元素**：
  1.  **Flex (推荐)**：`display: flex; justify-content: center; align-items: center;`
  2.  **Absolute + transform**：
      ```css
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      ```
  3.  **Absolute + margin auto**：
      ```css
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      ```
  4.  **Grid**：`display: grid; place-items: center;`

---

### 19. 几种常见的 CSS 布局实现（两栏、三栏、圣杯、双飞翼、Sticky Footer）？

- **两栏/三栏**：Flex (`flex: 1` 对自适应部分) 最简单。
- **圣杯/双飞翼**：用于 PC 端（左右固定，中间自适应且优先渲染）。
  - **圣杯**：浮动 + 负 margin + 父容器 padding + 相对定位。
  - **双飞翼**：浮动 + 负 margin + 中间元素内部加子元素的 margin。
  - **现代方案**：直接 Flex 或 Grid。
- **Sticky Footer**：
  - 内容不足一屏时，footer 贴底；内容超出一屏时，footer 随内容滚动。
  - 方案：`min-height: 100vh` + Flex (`flex-direction: column` + 内容区 `flex: 1`)。

---

### 20. CSS3 有哪些新特性？

- **选择器**：`:nth-child`, `:not`, `::before` 等。
- **视觉效果**：`border-radius`, `box-shadow`, `text-shadow`, `gradient` (渐变).
- **布局**：`Flex`, `Grid`, `Multi-column`.
- **变换与动画**：`transform` (2D/3D), `transition`, `animation` (`@keyframes`).
- **媒体查询**：`@media`.
- **其他**：`calc()`, `var()` (CSS 变量)。

---

### 21. CSS3 动画 (Animation) 和 过渡 (Transition) 的区别？

| 特性         | Transition (过渡)                       | Animation (动画)                                 |
| :----------- | :-------------------------------------- | :----------------------------------------------- |
| **触发方式** | 需要事件触发（hover, click, JS 修改类） | 可以自动通过 keyframes 触发，无需事件            |
| **控制力**   | 只有开始和结束两个状态                  | 可以在 `@keyframes` 中定义多个关键帧，控制更精细 |
| **循环**     | 只有一次，不能重复                      | 可以设置 `iteration-count` 进行循环              |
| **脚本控制** | 较弱                                    | 可以暂停、恢复、倒播                             |

---

### 22. CSS 动画与 JS 动画的区别？

- **CSS 动画**：
  - **优势**：
    - 浏览器优化（如 GPU 加速），性能更好，不占用 JS 主线程。
    - 代码简单，声明式。
    - 在 Tab 切换到后台时会暂停，节省资源。
  - **劣势**：
    - 控制力较弱（如暂停、回放、动态修改参数麻烦）。
    - 兼容性问题（老旧浏览器）。
- **JS 动画**：
  - **优势**：
    - 控制能力强，可实现复杂逻辑（如物理效果、碰撞检测）。
    - 兼容性好。
  - **劣势**：
    - 占用主线程，可能导致页面卡顿。
    - 代码复杂。
- **推荐**：简单的 UI 过渡用 CSS，复杂的逻辑动画用 JS (`requestAnimationFrame` > `setInterval` > `jQuery.animate`).

---

### 23. 如何实现 CSS 硬件加速 (GPU Acceleration)？

- **原理**：将元素提升为独立的**合成层 (Compositing Layer)**，交给 GPU 渲染，避免 CPU 重绘。
- **触发方法**：
  - `transform: translate3d(0, 0, 0)` 或 `translateZ(0)`。
  - `will-change` 属性（推荐）：`will-change: transform, opacity;`。
  - `opacity` 动画。
- **注意**：过度使用会导致内存占用增加。

---

### 24. 什么是重绘 (Repaint) 和 回流 (Reflow/Layout)？如何优化？

- **回流 (Reflow)**：当 DOM 的**几何属性**（宽、高、位置、显示隐藏）发生变化时，浏览器需要重新计算元素的几何属性，称为回流。
- **重绘 (Repaint)**：当 DOM 的**外观属性**（颜色、背景、阴影）发生变化，但不影响布局时，浏览器重新绘制元素，称为重绘。
- **关系**：**回流必将引起重绘，重绘不一定引起回流**。回流性能开销 > 重绘。
- **优化**：
  - 避免频繁操作 DOM，使用 documentFragment 或先 `display: none` 修改后再显示。
  - 避免直接读取导致强制同步布局的属性（`offsetWidth`, `scrollTop` 等），应缓存结果。
  - 这里使用 `transform` 做动画（不触发布局变化）。
  - 使用 `absolute` 或 `fixed` 脱离文档流。

---

### 25. 预处理器 (Sass/Less/Stylus) 的原理与优势？

- **原理**：在 CSS 之上增加了一层语法（变量、嵌套、混合、循环），通过编译器转换为标准的 CSS。
- **优势**：
  - **变量**：方便主题定制和维护。
  - **嵌套**：结构清晰，减少重复编写父选择器。
  - **Mixins (混合)**：复用代码块（如自动处理浏览器前缀）。
  - **函数与运算**：增强逻辑能力。

---

### 26. PostCSS 是什么？有什么作用？

- **定义**：PostCSS 是一个用 JS 工具和插件转换 CSS 代码的工具（类似于 Babel 之于 JS）。
- **常见插件**：
  - `autoprefixer`：自动添加浏览器前缀。
  - `postcss-preset-env`：允许使用未来的 CSS 语法。
  - `cssnano`：压缩 CSS。
  - `postcss-pxtorem`：将 px 转换为 rem。

---

### 27. CSS 模块化方案有哪些？(BEM, CSS Modules, CSS-in-JS)

- **BEM (Block Element Modifier)**：
  - 命名规范：`.block__element--modifier`。
  - 优点：减少嵌套，降低优先级冲突。
  - 缺点：类名过长。
- **CSS Modules**：
  - 构建工具（Webpack）将类名编译为唯一哈希值（如 `.btn` -> `.btn_3s8d`）。
  - 优点：彻底解决全局污染。
- **CSS-in-JS (Styled-components, Emotion)**：
  - 在 JS 中写 CSS。
  - 优点：动态样式方便，组件化彻底。
  - 缺点：增加了 JS 包体积，运行时开销。

---

### 28. CSS Sprites (雪碧图) 与 Base64 的原理及优缺点？

- **CSS Sprites**：
  - **原理**：将多个小图标合并成一张大图，通过 `background-position` 显示。
  - **优点**：减少 HTTP 请求。
  - **缺点**：维护困难（修改图片坐标），HTTP/2 多路复用下优势减弱。
- **Base64**：
  - **原理**：将图片编码为字符串嵌入 CSS/HTML。
  - **优点**：减少 HTTP 请求。
  - **缺点**：体积比原图大约 1/3，CSS 文件变大导致阻塞渲染。

---

### 29. 媒体查询 (Media Query) 的使用？

```css
/* PC */
@media screen and (min-width: 1024px) {
  body {
    background: blue;
  }
}
/* Mobile */
@media screen and (max-width: 768px) {
  body {
    background: red;
  }
}
```

---

### 30. line-height 的继承与计算规则？

- **具体数值 (px/em)**：子元素继承计算后的**绝对像素值**。
  - 父 `20px` \* `1.5em` = `30px`，子元素继承 `30px`。
- **百分比 (%)**：子元素继承计算后的**绝对像素值**。
  - 父 `20px` \* `150%` = `30px`，子元素继承 `30px`。
- **纯数字 (无单位)**（推荐）：子元素继承**缩放比例**。
  - 父 `line-height: 1.5`，子元素 `font-size: 30px` -> 行高 `30 * 1.5 = 45px`。

---

### 31. 如何画一个三角形、圆形、扇形？

- **圆形**：`width = height`, `border-radius: 50%`.
- **三角形**：
  - 宽高设为 0。
  - `border` 设为透明 (`transparent`)。
  - `border-bottom` 设为颜色。
    ```css
    width: 0;
    height: 0;
    border: 50px solid transparent;
    border-bottom-color: red;
    ```
- **扇形**：基于三角形，添加 `border-radius`。

---

### 32. 视差滚动与全屏滚动的原理？

- **视差滚动 (Parallax Scrolling)**：多层背景以不同速度移动，形成 3D 纵深感。
  - 实现：监听 `scroll` 事件，根据 `scrollTop` 修改 `background-position` 或 `transform`。
- **全屏滚动**：每次滚动鼠标滚轮切换一整屏。
  - 实现：容器 `overflow: hidden`，监听 `wheel` 事件，改变容器 `transform: translateY`。

---

### 33. CSS Hack 与浏览器兼容性处理？

- **条件注释** (IE9 及以下)：`<!--[if IE]>...<![endif]-->`。
- **属性前缀**：`_prop` (IE6), `*prop` (IE6/7), `prop\0` (IE8/9)。
- **Modernizr**：JS 检测浏览器特性，动态添加类名（`no-flexbox`）。
- **Autoprefixer**：工程化自动添加厂商前缀（`-webkit-`, `-moz-`）。

---

### 34. 网页中应该使用奇数还是偶数字号？为什么？

- **推荐偶数**（12px, 14px, 16px）。
- 原因：
  - 偶数容易被平分（如 `line-height`, `margin` 居中计算），奇数可能出现 `.5px` 渲染差异。
  - Windows 系统点阵字体通常针对偶数号优化。

---

### 35. 如何解决小于 12px 字体的问题？

- Chrome 浏览器默认最小字体限制为 12px。
- **解决**：使用 `transform: scale(0.8)`。
  ```css
  font-size: 10px; // 无效
  font-size: 12px;
  transform: scale(0.8);
  transform-origin: left center; // 修正缩放中心
  ```

---

### 36. 1px 边框问题如何解决？

- **现象**：在高分屏 (Retina) 下，CSS 的 `1px` 对应物理像素 `2px` 或 `3px`，看起来变粗。
- **解决**：
  - **伪元素 + scale**（最常用）：
    ```css
    .box::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 200%;
      height: 200%;
      border: 1px solid #000;
      transform: scale(0.5);
      transform-origin: 0 0;
    }
    ```
  - **viewport + rem**：动态设置 viewport scale 为 0.5。

---

### 37. content 属性的作用？应用场景？

- **作用**：用于在伪元素 (`::before`, `::after`) 中插入生成内容。
- **场景**：
  - 清除浮动 (`clearfix`).
  - 插入小图标/装饰性字符。
  - 计数器 (`counter-reset`, `counter-increment`).
  - 面包屑分隔符 (`content: "/" `).

---

### 38. 什么是 CSS 变量 (Custom Properties)？如何使用？

- **定义**：`--color-primary: blue;` (通常定义在 `:root` 中全域可用)。
- **使用**：`color: var(--color-primary, red)` (第二个参数为 fallback)。
- **优势**：
  - 运行时修改（JS 可操作），方便做**动态换肤**。
  - 作用域控制（可只在局部定义）。

---

### 7. CSS 性能优化方案：如何达成 60FPS 丝滑体验？

大厂面试中，我们需要关注的是**样式引擎的渲染流水线 (Layout -> Paint -> Composite)**：

1.  **利用硬件加速 (Composite Only)**：频繁变化的动画（如弹窗、侧边栏、动效）应仅操作 `transform` 和 `opacity`。这两个属性不会触发 Layout 和 Paint，由合成线程 (Compositor Thread) 在 GPU 中完成。
2.  **强制开启层合成**：对关键动画元素设置 `will-change: transform` 或 `translateZ(0)`，将其提升为**独立合成层**，避免频繁重排 (Reflow) 污染全局图层。
3.  **减少重排 (Batching Rules)**：
    - 避免逐条修改样式，应通过切换 `class` 完成。
    - 读写分离：避免在 JS 中交替读写 DOM 属性（如 `offsetTop` 后紧跟 `style.height`），这会强制浏览器排空渲染队列，导致样式计算抖动 (Layout Thrashing)。
4.  **原子化 CSS (Atomic CSS)**：利用 Tailwind 等方案，不仅能通过工具链删除无用代码 (Purge)，还能极大复用样式类名，减少 CSS 解析树的体积。

---

### 40. rgba() 和 opacity 的区别？

- **rgba(r, g, b, alpha)**：只改变**背景色或文本颜色**的透明度，**子元素不会继承**透明效果。
- **opacity**：改变**整个元素**（包括内容和子元素）的透明度，**子元素会继承**透明效果（实际上是一起变淡）。

---

## 三、JavaScript 相关

---

### 1. 闭包 (Closure) 的底层机制与大厂实战

面试官想听到的不是简单的“访问变量”，而是**内存管理与模块化设计**：

- **底层原理**：JS 引擎在 AST 解析阶段，如果发现内部函数引用了外部非全局变量，会将该变量标记并存储在堆内存的 **[[Scope]]** 槽位（V8 的 Scope 对象中）。即使外部函数弹出执行栈，该对象依然生存。
- **正面场景**：
  - **模块化保护**：封装私有变量（如单例模式的基础）。
  - **状态持久化**：Currying（柯里化）和防抖/节流的计时器维护。
- **副作用防御**：
  - **内存管理**：闭包可能导致不再需要的变量无法被 GC 回收。在 React 的 `useEffect` 中，必须通过清理函数销毁副作用。
  - **性能损耗**：由于跨作用域查找，深度闭包会导致属性查找耗时。

---

### 2. 说说你对作用域链的理解

- **作用域**：规定了变量和函数的可访问范围。
- **链式查找**：当在某个作用域查找变量时，如果自身没有，就会向父级作用域查找，直到全局作用域（Global）。
- **特点**：作用域在函数**声明时**（静态）就确定了，而不是调用时。

---

### 3. JavaScript 原型与原型链的工程意义

面试官考查此题，实际上是在看你对 **JS 内存复用** 的理解力：

- **核心架构**：每个构造函数都有一个 `prototype` 对象。当通过 `new` 创建实例时，实例会有一个隐式指针 `__proto__` 指向该对象。
- **查找机制**：如果在当前对象找不到属性，会沿着 `__proto__` 链条向上查询。
- **大厂实战：内存 vs 性能**：
  - **内存优势**：将方法写在原型上而非构造函数内，能确保数万个实例共享同一指针，极大节省了堆内存。
  - **Object.create(null)**：在高性能场景（如构建词法解析器）中，由于普通的 `{}` 会继承 `Object.prototype` 上的各种方法（如 `toString`），我们会使用 `Object.create(null)` 创建无原型链负担的“纯净对象”，加速属性索引操作。

---

### 4. 请解释什么是事件代理

- **定义**：也叫事件委托，将子元素的事件监听器绑定到**父元素**上，利用**事件冒泡**机制触发。
- **优点**：
  - 减少内存占用（无需为每个子元素绑定）。
  - 动态处理：新增加的子元素也能触发事件。
- **应用**：`ul` 点击监听 `li`。

---

### 5. Javascript 如何实现继承？

1.  **原型链继承**：`Child.prototype = new Parent()`（缺点：共享引用类型，无法传参）。
2.  **借用构造函数继承**：`Parent.call(this)`（缺点：无法继承原型方法）。
3.  **组合继承**：结合上述两者（缺点：调用两次构造函数）。
4.  **原型式继承**：`Object.create()`。
5.  **寄生组合继承 (推荐)**：最理想的继承方式。
6.  **ES6 Class 继承**：使用 `extends` 和 `super`（语法糖）。

---

### 6. 谈谈你对 This 对象的深度理解

在 V8 引擎中，`this` 是执行上下文 (Execution Context) 的一个动态属性，其指向取决于**调用调用位置**：

1.  **显式绑定**：通过 `call/apply/bind` 强行指定。在 Hook 时代之前，这是解决类组件回调引用的核心手段。
2.  **隐式绑定**：由对象调用（如 `obj.fn()`），指向该对象。
3.  **构造绑定**：`new` 关键字会将 `this` 指向新生成的空对象实例。
4.  **箭头函数的词法穿透**：这是面试的高频点。箭头函数**不产生自己的 this**，它在编译阶段就会捕获父级执行上下文的 `this`。这使得它在处理异步回调（如 `setTimeout`）时，能天然保持上下文一致性，无需 `.bind(this)`。
5.  **默认绑定**：非严格模式指向 `window`，严格模式 (`'use strict'`) 指向 `undefined`。

---

### 7. 对 JS 事件模型的深度理解

面试官通过此题考察你对浏览器交互基石的掌握，需区分**标准模型**与**历史差异**：

- **DOM0 级模型**：通过 `element.onclick = fn` 绑定。
  - **局限**：同一事件只能绑定一个处理函数（后续会覆盖前者）；不支持捕获，仅支持冒泡。
- **DOM2 级标准模型 (`addEventListener`)**：现代浏览器的标准实现，包含三个阶段：
  1. **捕获阶段 (Capturing)**：事件从 `window` 向下穿过各个祖先节点直到目标元素。在此阶段，我们可以通过设置 `useCapture: true` 来拦截某些全局行为（如点击外部关闭弹窗）。
  2. **目标阶段 (Target)**：事件到达触发源。
  3. **冒泡阶段 (Bubbling)**：事件从目标元素逐级向上传递。这是最常用的阶段，也是**事件代理**的技术基础。
- **IE 事件模型 (attachEvent)**：仅支持冒泡，且回调函数内部的 `this` 指向 `window` 而非触发元素。
- **最佳实践**：优先使用 `addEventListener`，并在组件销毁时及时 `removeEventListener` 以防内存泄漏。

---

### 8. `new` 操作符的执行过程及手写实现

`new` 关键字在 JS 中不仅是语法糖，它实质上完成了一次**对象创建与原型嫁接**：

1. **创建纯净对象**：在堆内存中开辟空间，创建一个新的空对象 `{}`。
2. **原型链接 (Inheritance)**：将该空对象的 `__proto__` 指向构造函数的 `prototype` 属性。这一步确立了实例与类（原型）的继承关系。
3. **环境切换 (Binding)**：通过 `apply/call` 将构造函数的 `this` 绑定到新创建的对象，并执行构造函数逻辑（如 `this.name = name`）。
4. **结果判定**：如果构造函数显式返回了一个**对象类型**，则 `new` 的结果为该对象；否则，静默返回第一步创建的对象。

- **手写核心逻辑**：

```javascript
function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const res = Constructor.apply(obj, args);
  return res instanceof Object ? res : obj;
}
```

---

### 9. Ajax 的底层原理与异步治理

虽然现代开发多用 `axios`，但理解 `XMLHttpRequest` 是掌握网络请求的基础：

- **核心机制**：利用浏览器提供的 `XHR` 对象实现**非阻塞式**的数据交换。
- **执行生命周期 (`readyState`)**：
  - `0 (UNSENT)`：已创建。
  - `1 (OPENED)`：已调用 `open()`，此时可设置请求头。
  - `2 (HEADERS_RECEIVED)`：已收到响应头，这是判断请求成败（status）的最早时机。
  - `3 (LOADING)`：正在下载响应体，此时可以进行下载进度展示。
  - `4 (DONE)`：数据传输彻底完成。
- **工程化挑战**：原生 Ajax 容易陷入“回调地狱”，且无法直接处理异步异常。现代方案通过 **Promise** 封装，将请求逻辑转化为流水线式的 `.then().catch()` 结构。

---

### 10. 现代跨域方案的权衡与选择

在严格的同源策略 (Same-origin policy) 下，跨域是必备的攻防战：

1. **CORS (主流工业标准)**：服务器端配置 `Access-Control-Allow-Origin`。支持所有 HTTP 请求，是最安全、最标准的方案。需注意 **Preflight (OPTIONS)** 预检请求对性能的影响。
2. **Nginx 反向代理 (生产首选)**：通过配置 `proxy_pass` 让前端请求同源接口，后端在内网转发。对前端代码零入侵，且隐藏了真实的后端拓扑。
3. **Node.js 中间层 (BFF)**：在开发环境下利用 `webpack-dev-server` 的 `proxy` 功能；在生产环境可通过 Node Server 作为中转，还能顺便处理数据聚合。
4. **WebSocket**：由于该协议建立在 TCP 之上，握手通过 HTTP，建立连接后不受同源策略限制。适用于实时通讯（聊天、股票）。
5. **JSONP (历史包袱)**：利用 `<script>` 标签可跨域的特性，仅支持 GET，且容易遭受反射型 XSS 攻击，现已基本淘汰。

---

### 11. 前端模块化演进史：从 Ad-hoc 到 ESM

- **CommonJS (CJS)**：Node.js 的基石。
  - **特性**：同步加载，运行时执行。
  - **精髓**：导出的是值的**拷贝**，模块被加载一次后会被缓存，后续引用直接读缓存。
- **ES Modules (ESM)**：现行标准（Vue/React 生产方案）。
  - **特性**：**编译时输出接口 (Static Analysis)**，支持 Tree-shaking。
  - **优势**：导出的是值的**只读引用**，能更早发现代码风险，且支持异步 `dynamic import()`。
- **Webpack 中的处理**：在构建阶段，这些不同的规范都会被转化为统一的 Webpack 内部函数调用，确保浏览器端能稳定运行。

---

### 12. 异步加载 JS 的性能影响与选型

在“性能即生命”的前端应用中，`<script>` 的放置位置决定了 TTI（可交互时间）：

1. **Default (无属性)**：浏览器解析 HTML 时遇到即阻塞，下载并执行。必须放在 `</body>` 之前以确保首屏渲染。
2. **`defer` (延迟执行 - 推荐)**：
   - **原理**：由于在后台并行下载，脚本加载不阻塞 DOM 解析。
   - **时机**：脚本会等到 **DOM 树构建完成**（`DOMContentLoaded` 触发前）按文档顺序执行。
3. **`async` (异步执行)**：
   - **行为**：下载不阻塞，但**下载完立即执行**，执行时依然会中断 DOM 解析。
   - **注意**：执行顺序不确定，不适合有依赖关系的第三方 SDK（如埋点 SDK）。
4. **动态插入 Script 标签**：适合懒加载场景，可以在用户操作后再按需载入。

---

### 13. JS 内存泄漏的典型场景与排查

资深开发者必须具备主动规避“长生命周期引用短生命周期”带来的顽疾：

- **典型场景**：
  1. **隐式全局变量**：如函数内部未声明变量，导致其挂载在 `window` 上，无法被回收。
  2. **未清理的闭包外部引用**：大对象在闭包中被引用，即使闭包自身生命周期结束，若该大对象还处在某个长连接中。
  3. **DOM 外溢 (Detached DOM)**：JS 代码持有了已移除 DOM 的引用，导致整个 DOM 树无法从内存抹除。
  4. **监听器遗忘**：在 SPA 路由切换时，若未在销毁钩子中 `removeEventListener`，这些堆积的监听器会持续吞噬 CPU。
- **排查利器**：使用 Chrome DevTools 的 **Memory (Heap Snapshot)** 进行堆快照对比，寻找黄色背景的 Detached 节点。

---

### 14. 数据交换格式：JSON 的工程优势

在 Ajax 革命之后，JSON 彻底取代了 XML 成为互联网流通的“货币”：

- **解析效率**：JSON 结构天然对应 JS 的对象与数组，通过 `JSON.parse` 即可快速反序列化，而 XML 需要走昂贵的 DOM 解析树。
- **传输密度**：JSON 没有任何冗余标签，在移动端弱网环境下能显著节省带宽。
- **安全性**：XML 容易面临 XXE（XML 外部实体攻击），而 JSON 的处理逻辑更直观，结合 CSP 能有效防御。
- **局限性**：JSON 不能存储 `undefined`、函数或循环引用的对象。

---

### 15. 说说你对 Webpack 的底层看法与现代替代方案

Webpack 是目前工业级项目的动态心脏，其核心价值在于**依赖图谱 (Dependency Graph)** 的构建：

- **核心链路**：从 `Entry` 出发，通过 `Loader` 解决非 JS 资源的加载，利用 `Plugin` 在其生命周期的各个 Hook 点介入构建。
- **痛点治理**：针对构建慢的问题，大厂方案通常采用 `DDR` (Durable Cache) 或通过 `Rspack`（Rust 编写）进行原生重构。
- **对比 Vite**：
  - **Webpack**：先打包，再启动。适合大型、需要复杂插件定制的存量项目。
  - **Vite**：No-bundle 模式，利用浏览器原生 ESM。秒级启动，极适合现代中小型项目的极速开发。

---

### 16. CommonJS 与 ESM 的互操作性与差异

这是面试中区分初中级的关键点：

1. **加载方式**：CommonJS 是同步阻塞加载（适合磁盘 IO 读取）；ESM 是异步非阻塞（适合网络环境）。
2. **导出机制**：
   - **CJS**：导出的是值的**深拷贝**。
   - **ESM**：导出的是值的**符号连接 (Read-only reference)**。这意味着 ESM 能够实时感应到模块内部变量的变化。
3. **顶层限制**：ESM 支持顶层 `await`，而 CJS 需要封装在 async 函数中。
4. **Tree Shaking**：由于 ESM 的静态特性，Webpack/Rollup 能在打包阶段剔除死代码 (DCE)，而 CJS 很难做到极致优化。

---

### 17. 资深前端必备的 Web 安全攻防战

优化逻辑：不仅要防，更要理解**攻击者的链路**：

1. **XSS (脚本注入)**：
   - **防御**：不仅是转义，更应优先使用 `HttpOnly` 防止 Cookie 被盗，配合 **CSP** (内容安全策略) 禁止加载来源不明的脚本。
2. **CSRF (跨站请求伪造)**：
   - **底层原理**：利用浏览器自动携带 Cookie 的特性，伪造用户在另一个站点的请求。
   - **防御**：核心是增加**外部不可预测性**。使用 `Verify Token`、`Custom Header` 或开启 `Cookie SameSite` 策略。
3. **SSRF 与 SQL 注入**：主要依靠后端的参数化查询。
4. **权限防护**：前端通过路由守卫拦截 UI 展示，后端通过 RBAC (基于角色的访问控制) 对数据接口进行二次校验。

---

### 18. 前端高阶设计模式的实战投影

高级工程师应能根据业务场景准确匹配设计模式：

- **观察者/发布订阅模式**：用于解耦。如 Vue 的响应式系统、Redux 的 Store 监听。
- **单例模式**：用于全局状态唯一化。Vuex、React 全局上下文。
- **装饰器模式 (`Decorator`)**：在不改变原逻辑的情况下注入增强功能。如 AOP (面向切面编程) 用于埋点上报。
- **策略模式**：消除冗长的 `if-else`。将各种复杂的计费逻辑封装进策略映射对象中，极大地提升了系统的可维护性。
- **桥接模式**：在混合开发 (Hybrid) 中通过 JSBridge 连接 JS 与 Native 能力。

---

### 19. 浏览器同源限制的底层防御

- **目标**：如果没有同源策略，任何恶意网页都能通过 `iframe` 甚至 `Ajax` 读取你在支付宝或社交软件上的关键敏感数据。
- **同源三要素**：协议 (Protocol)、域名 (Domain)、端口 (Port)。
- **限制范围**：
  1. **存储读写**：禁止读取 `Cookie`、`LocalStorage`、`IndexedDB`。
  2. **DOM 劫持**：无法操作跨域站点的 DOM 树。
  3. **网络阻断**：由浏览器引擎拦截跨域的 `XMLHttpRequest` 响应结果。

---

### 20. 元素几何属性的精确度量：Offset vs Client vs Scroll

作为视图计算的基础，必须理解其物理语义：

1. **`clientWidth/Height` (可视区)**：这是元素内容的“净空区”加上 `padding`，**不含** `border` 和滚动条。常用于计算容器内部可展示的空间。
2. **`offsetWidth/Height` (物理区)**：元素在页面上实际占用的盒子尺寸。包含内容、`padding`、`border` 以及**滚动条**。这是布局对齐时的首选指标。
3. **`scrollWidth/Height` (全量区)**：当内容溢出时，表示内容的**全尺寸**（含不可见部分）。常用于判断是否触发了滚动动画。

- **避坑预警**：频繁读取这些属性会触发同步重排 (Forced Synchronous Layout)，在动画循环中应提前缓存。

---

### 21. JavaScript 对象创建的多维形态

在不同的工程阶段，我们需要根据**语义**与**性能**选择最合适的创建方式：

1. **对象字面量 (`{}`)**：最直观、性能最高的方式。由于无需经过构造函数链查找，它是创建普通数据结构的物理首选。
2. **`Object.create(proto)`**：**指定原型系统**的核心手段。常用于实现基于原型的继承，或者通过 `Object.create(null)` 创建无原型污染的绝对纯净对象（常用于缓存 Map）。
3. **构造函数与 `new`**：传统面向对象模式。通过 `this` 绑定，适合需要大量产出具有相同方法（写在 `prototype` 上以节省内存）的实例场景。
4. **ES6 `Class`**：现代工业级规范。虽是构造函数的语法糖，但提供了更清晰的 `extends`、`super` 及静态成员管理，是目前 SPA 开发的主流。
5. **工厂方法**：通过函数封装创建逻辑，返回具体对象。适用于隐藏创建细节或根据参数动态返回不同类实例的场景（如 UI 组件库的按钮创建）。

---

### 22. 经典的浏览器兼容性治理（历史与现代）

作为资深前端，不仅要记得 API 差异，更要理解**工程化屏蔽掉的细节**：

- **事件系统差异**：
  - 绑定：`addEventListener` (W3C) vs `attachEvent` (IE)。
  - 传播：通过 `e.stopPropagation()` vs `e.cancelBubble = true` 阻止冒泡。
- **几何与视口**：
  - 获取滚动高度：`document.documentElement.scrollTop` vs `document.body.scrollTop`。
- **环境嗅探与转译**：
  - **Babel**：将 ES6+ 的高级语法转为 ES5（如将箭头函数转为普通函数并处理 `_this`）。
  - **Polyfill**：针对 API 缺失（如 `Promise`, `InternalArray`），通过在 `window` 上手动挂载垫片补全功能。
- **目前共识**：现代项目基本放弃 IE11 以下，通过 `Browserslist` 配置配合 `Autoprefix` 实现自动兼容。

---

### 23. Promise 的状态机原理与异步编排

Promise 是解决 JS “异步本质”带来的代码组织问题的银弹：

- **状态机属性**：`Pending` (等待) -> `Fulfilled` (成) 或 `Rejected` (败)。**状态固化**是其核心，一旦确立不可更改，确保了回调的可预测性。
- **链式调用的魔力**：每个 `.then()` 都会返回一个**全新的 Promise**，这使得我们可以像写同步代码一样通过瀑布流处理逻辑，彻底告别了“横向发展”的回调地狱。
- **高阶并发控制**：
  - **`Promise.all`**：全成才成。适用于并行请求多个独立接口。
  - **`Promise.race`**：最快者胜。常用于设置请求超时。
  - **`Promise.allSettled`**（新）：无论成败皆返回，常用于批量任务审计。
- **底层微任务**：Promise 的回调被塞入 **Microtask Queue**，优先级高于 `setTimeout`，这保证了页面响应的即时性。

---

### 24. jQuery 源码的工程艺术（虽过时但精湛）

虽然现代开发已是框架天下，但 jQuery 的设计哲学深深影响了前端：

1. **链式表达 (Chaining)**：通过在方法末尾返回 `this`，极大提升了代码的连贯性。
2. **隐式迭代 (Implicit Iteration)**：一个简单的 `$('p').css(...)` 会自动遍历页面所有 p 标签，无需开发者手写 `for` 循环，极简 API 的典范。

- **基础封装**：`Object`, `Array`, `String`, `Boolean`。
- **科学计算**：`Math`（非构造函数，直接调用）、`BigInt`（处理大数溢出）。
- **日期与正则**：`Date`, `RegExp`。
- **错误机制**：`Error`, `TypeError`, `ReferenceError` 等。
- **ESNext 容器**：`Set` (唯一集合)、`Map` (键值对字典)、`Proxy` (元编程代理)。

---

### 32. 如何编写具备可维护性的 JavaScript 代码

面试官实际上考查的是**团队工程素养**：

1. **声明准则**：严禁使用 `var`。优先 `const` 以确保不可变性，必须修改时用 `let`。
2. **判等机制**：严禁使用 `==`（隐式转换太坑），统一使用 `===` (Strict Equality)。
3. **命名工程**：语义化变量名（拒绝 `a`, `b`, `c`），布尔值使用 `is` / `has` 前缀。
4. **函数设计**：单一职责原则。一个函数只做一件事，长度控制在 50 行内。
5. **防御式编程**：对于对象属性访问，优先使用可选链 `?.` 和空值合并运算符 `??`。
6. **副作用管理**：外部交互逻辑（定时器、事件监听）必须有明确的清理逻辑（Cleanup）。

---

### 33. JavaScript 有几种类型的值

- **简单数据类型**：7 种（见 30 题）。
- **复杂数据类型**：1 种（Object）。
- **存储位置**：简单类型存在栈内存，引用类型存在堆内存。

---

### 34. 为什么 `eval()` 是前端开发的禁区？

1. **安全黑洞**：字符串如果来自服务端或用户输入，极易触发 XSS。
2. **性能墓地**：由于字符串是动态的，JS 引擎（如 V8）无法在编译阶段进行内联优化、类型推断等预处理，代码运行效率断崖式下跌。
3. **作用域灾难**：它会修改当前的词法作用域，导致变量混淆，使静态分析工具（Lint）失效。

- **资深建议**：如果你需要动态执行逻辑，尝试使用 `new Function()` 或在对象映射中查找方法。

---

### 35. Null vs Undefined：语义与工程处理

- **`undefined` (无中生有)**：系统级别的默认值。表示“原本应该有，但现在还没给”。如未初始化的变量、缺失的函数参数。
- **`null` (无中生无)**：开发者主动产生的语义值。表示“我有这个槽位，但我要把它设置为空对象”。常用于释放引用。
- **工程细节**：
  - `typeof null === 'object'` (JS 遗留的物理存储标记错误)。
  - 在接口返回时，通常用 `null` 表示该属性目前没数据，而非不生成该属性（`undefined`）。

---

### 36. 经典的 JS 陷阱：`["1", "2", "3"].map(parseInt)`

这是一道考察**函数签名匹配**的经典题：

- **现象**：输出结果为 `[1, NaN, NaN]`。
- **原因剖析**：
  1. `map` 的完整签名是 `callback(value, index, array)`。
  2. `parseInt` 的核心签名是 `parseInt(string, radix)`。
  3. 组合执行过程：
     - 第一轮：`parseInt('1', 0)` -> 基数为 0，系统默认以 10 进制处理，结果为 **1**。
     - 第二轮：`parseInt('2', 1)` -> **逻辑错误**。parseInt 基数必须在 2-36 之间，结果为 **NaN**。
     - 第三轮：`parseInt('3', 2)` -> 二进制中不可能出现字符 '3'，结果为 **NaN**。
- **修正方案**：调用时明确参数 `map(str => parseInt(str))`。

---

### 37. `'use strict'`：现代 JS 的安全底线

- **语义核心**：开启严格模式，使代码运行在更严谨的 W3C 规范下。
- **资深视角：为什么要开启？** 1. **静默错误显性化**：赋值给只读属性、删除变量等原本静默失败的操作，现在会直接抛出 Error，方便调试。 2. **提升执行性能**：由于去除了 `with` 语句并限制了动态作用域，JS 引擎在编译阶段能进行更激进的静态优化。 3. **安全性保护**：强制 `this` 在全局调用下为 `undefined`（而非 `window`），有效防止了敏感数据在全局作用域的意外泄露。 4. **未来兼容性**：禁用了某些未来可能被用作关键字的标识符（如 `implements`, `interface`）。
  （参见第 12 题：`defer`, `async`, 动态创建 script 标签, `setTimeout` 等）。

---

### 40. 同步和异步的区别

- **同步 (Synchronous)**：任务按顺序执行，前一任务未完成，后一任务必须等待（阻塞式）。
- **异步 (Asynchronous)**：任务在后台处理，不阻塞主线程。执行完成后通过回调、Promise 或事件通知（非阻塞式）。

---

### 41. Script 加载策略：Defer vs Async 的性能权衡

在现代 Web 指标 (Core Web Vitals) 的考核下，脚本加载策略直接影响 LCP：

1. **`defer` (推荐方案)**：
   - **加载**：异步下载，不阻塞解析。
   - **执行**：保证在 **DOM 解析彻底完成**后、`DOMContentLoaded` 事件前触发。
   - **顺序**：维持脚本在 HTML 中的**先后顺序**。适用于有依赖关系的业务逻辑。
2. **`async` (独立方案)**：
   - **加载**：异步下载。
   - **执行**：**一经下载完成立即执行**，此时会暂停 HTML 解析。
   - **顺序**：谁快谁先执行。适用于不依赖 DOM 且无内部耦合的第三方插件（如埋点、广告）。

---

### 42. 说说严格模式的限制

1.  变量必须先声明再使用。
2.  禁止使用 `with` 语句。
3.  创建 `eval` 作用域。
4.  禁止 `this` 指向全局对象（默认为 `undefined`）。
5.  禁止删除不可删除的属性和普通变量。
6.  对象属性名、函数参数名不能重复。

---

### 43. Attribute vs Property：DOM 属性的双面性

这是处理复杂表单和组件状态时的必修课：

- **Attribute (特性)**：HTML 标签上的静态属性。可以通过 `getAttribute` 获取。其值永远是**字符串**。
- **Property (属性)**：DOM 节点在 JS 中的对象属性。其实时反映了 DOM 的当前状态。
- **非对称表现 (陷阱)**：
  - **`input.value`**：修改 Property 会让用户看到新值，但源码中的 Attribute 保持不变。
  - **`input.checked`**：Property 返回布尔值，而 Attribute 返回字符串 `"checked"`。
- **结论**：在逻辑驱动的开发中，应**优先操作 Property**。

---

### 44. ES6+ 工程语法的革新意义

ES6 (ES2015) 是 JS 进化史上的分水岭，其核心价值在于**代码的可维护性与模块化**：

1. **声明体系**：`let`/`const` 引入块级作用域，根治了 `var` 带来的作用域污染。
2. **异步编排**：`Promise` -> `Generator` -> `async/await`。将异步逻辑从“回调地狱”拉回“线性思维”。
3. **语言糖**：解构赋值、模板字符串、箭头函数。极大减少了冗余模板代码。
4. **元编程与容器**：`Proxy`、`Reflect` (Vue 3 的基石)；`Set`/`Map` 解决了 Object 作为字典时的类型与原型干扰。
5. **原生模块化 (ESM)**：统一了构建工具的依赖解析标准。

---

### 45. 编程范式：OOP (面向对象) vs POP (面向过程)

- **面向过程 (POP)**：描述“如何做”。类似于按菜谱炒菜，步骤严谨。
  - **场景**：算法密集、简单的自动化脚本。
- **面向对象 (OOP)**：描述“谁来做”。通过对象封装、继承、多态实现功能复用。
  - **场景**：复杂的 UI 组件系统、大型企业级应用。其**内聚性**与**可扩展性**是软件工程的核心支撑。

---

### 46. OOP 的三大支柱与 JS 的独特性

1. **封装**：隐藏内部状态。虽然 JS 以前没有真正的私有变量，但现在可以通过 `#` (Private fields) 或闭包实现。
2. **继承**：JS 通过**原型链**实现继承（不同于 Java 的类拷贝）。
3. **多态**：由于 JS 是弱类型语言，天然支持多态（同一个函数名接收不同类型参数并表现不同），无需显式接口声明。

---

### 47. Web 素质三剑客：标准、可用、可访问

- **Web 标准**：确保跨浏览器一致性（HTML5/CSS3 规范）。
- **可用性 (Usability)**：衡量用户完成任务的**效率与满意度**。
- **可访问性 (A11y)**：技术的**普适性**（如色彩对比度是否合理、是否支持键盘操作、是否能被屏幕阅读器理解）。这是现代大厂出海项目的必备底线。

---

### 48. 数组判定的万全之策

1. **`Array.isArray(obj)`**：最现代、语义最精准的方案。
2. **`Object.prototype.toString.call(obj)`**：**跨 iframe** 等极端场景的首选，能准确返回 `[object Array]`。
3. **`instanceof Array`**：基本操作，但在涉及多个全局执行上下文（如多个 window）时可能失效。

---

### 49. 变量声明的终极对决：Let vs Var

- **作用域**：`let` 绑定在块级（如 `if` 块），`var` 逃逸到函数级。
- **安全机制**：`let` 不允许在声明前使用（TDZ 暂时性死区），严查变量提升带来的 Bug。
- **全局污染**：`let` 不会挂载到 `window`，有效减少了全局状态冲突风险。
- **重复声明**：`let` 显式禁止相同作用域下的二次声明。

---

### 50. Map vs ForEach：迭代语义的选择

虽然两者都能遍历数组，但在大规模工程中需区分其**意图 (Intent)**：

- **`map` (映射)**：
  - **逻辑**：将原数组的每个元素加工后，返回一个**等长的新数组**。
  - **特质**：纯函数思想，不修改原数组。支持 `.map().filter()` 的函数式链式调用。
- **`forEach` (执行)**：
  - **逻辑**：仅遍历数组并对每个元素执行回调。
  - **特质**：主要用于产生**副作用**（如修改外部变量、打印日志、操作 DOM）。返回值永远是 `undefined`。
- **结论**：如果你需要处理结果，用 `map`；如果你只是想“运行一下”，用 `forEach`。

---

### 51. 谈谈你对函数式编程 (FP) 的理解

FP 是现代前端（如 React Hooks, Redux）的灵魂：

- **核心概念**：函数是程序构建的**一等公民**。
- **关键特质**：
  1. **纯函数 (Pure Function)**：输入相同，输出必相同；无外部状态依赖，无副作用。极大提升了代码的可测试性。
  2. **声明式 (Declarative)**：告诉机器“我想要什么”（如 `filter`），而非“如何遍历并删除”（如 `for` 循环）。
  3. **不可变性 (Immutability)**：数据一旦产生就不再修改，而是产生新数据。这在 React 性能优化（浅比较）中至关重要。
  4. **高阶函数 (HOF)**：接收函数并返回函数。是逻辑抽象（如 `Currying`, `Compose`）的基石。

---

（参见第 6 题：由调用位置决定，bind/call/apply 显式绑定，箭头函数继承外层）。

---

### 54. 异步编程的进化阶梯

1. **Callback (原始时代)**：逻辑割裂，容易陷入“回调地狱”。
2. **Promise (白银时代)**：利用链式调用将异步扁平化，引入了状态管理（成/败）。
3. **Generator (过渡时代)**：赋予了函数“暂停”和“恢复”执行的能力（配合 co 库实现半自动异步）。
4. **Async/Await (黄金时代)**：异步编程的终极方案。它是 Generator 的语法糖，让异步代码看起像同步代码，极大降低了心智负担。

---

### 55. 资深前端的原生 JS “内功”范畴

作为高级工程师，你应该在以下维度展示深度：

- **编译原理**：理解 V8 的 JIT (即时编译)、AST 解析、作用域提升。
- **并发模型**：透彻掌握 Event Loop (宏任务/微任务/渲染帧的交替)。
- **内存安全**：能够识别闭包带来的内存泄漏，熟练使用 Heap Snapshot 排查。
- **标准洞察**：能够区分 ESM 与 CJS 的底层差异，理解 TC39 各阶段提案的演进方向。

---

### 56. Js 动画与 CSS 动画区别及相应实现

（参见第二部分第 22 题：CSS 性能好但逻辑弱；JS 控制力强但需防卡顿）。

---

### 57. 数据遍历的深度博弈

- **数组遍历 (Array Iteration)**：
  - `for...of`：**最推荐**。语法简洁，支持 `break/continue`，能处理异步 `await` 循环。
  - `Array.prototype.forEach`：函数式风格，但不支持中断。
- **对象遍历 (Object Traversal)**：
  - `Object.keys()`：返回自身可枚举属性的键名（最常用）。
  - `for...in`：**慎用**。它会遍历原型链上的可枚举属性，且顺序不一定可靠。
  - `Reflect.ownKeys()`：获取所有键名（包含 Symbol 和不可枚举属性）。

---

### 58. Gulp：流式自动化的先驱

- **核心**：基于 **Node Streams** 的任务跑批工具。
- **原理**：将文件读入内存流，经过一系列插件（压缩、混淆、转译）处理后输出。
- **现状**：虽在大规模工程中被 Webpack 取代，但在**纯静态页面**或**简单工具库**的轻量化构建中依然具备极致的速度优势。

---

### 59. Vue 双向绑定的演进逻辑

面试官想通过此题考查你对 Vue 2 vs 3 变革的技术理解深度：

- **Vue 2 (Object.defineProperty)**：
  - **原理**：通过 API 劫持对象的 `getter/setter`，并在初始化时深度递归对象。
  - **局限性**：无法监测对象属性的新增/删除，无法监听数组通过索引的修改。
- **Vue 3 (ES6 Proxy)**：
  - **原理**：直接拦截整个对象的操作（如 `get`, `set`, `deleteProperty`）。
  - **优势**：**惰性监听**。只有当访问到深层属性时，Proxy 才会对其进行下一层嵌套。原生支持 `Map`, `Set` 及数组变化。
- **闭环思维**：两者核心都是 **观察者模式 (Observer)**。在 `getter` 中进行依赖收集 (`Track`)，在 `setter` 中触发更新通知 (`Trigger`)。

---

### 60. 变量声明声明的权衡：Var vs Let vs Const

- **`var` (历史陈疾)**：由于函数作用域和变量提升，容易产生不可预测的行为，现代开发应彻底弃用。
- **`let` (变量首选)**：引入块级作用域约束。
- **`const` (常量首选)**：强约束。确保变量引用不被修改。
- **资深建议**：默认使用 `const`。只有当你确定变量必须被重新赋值时，才退化到 `let`。这有助于代码静态分析并提高可读性。

---

### 61. 数组乱序：从“半吊子”到“洗牌算法”

- **业余方案**：`arr.sort(() => Math.random() - 0.5)`。
  - **致命缺陷**：由于 `sort` 底层算法限制，每个位置出现的概率并不均等，是不纯碎的乱序。
- **科学方案：Fisher-Yates (洗牌算法)**：
  - **逻辑**：从数组末尾开始，随机选取一个前面的元素与其交换。
  - **优势**：时间复杂度 O(n)，数学证明每个数值在每个位置出现的概率是完全相等的。

---

### 62. 海量数据渲染：如何维持 60FPS 丝滑感？

当面临“万条数据”挑战时，核心策略是**规避 DOM 爆炸**：

1. **虚拟列表 (Virtual List) - 首选方案**：仅渲染用户视口内的几十个 DOM。随着滚动动态替换内容。目前的极致工程实践（如 react-window）。
2. **时间分片 (Time Slicing)**：利用 `requestAnimationFrame` 将大批量的渲染任务拆分成多个 16.ms 的小任务，确保不阻塞主线程动画。
3. **Web Worker**：将复杂的数据预处理、格式化逻辑移出主线程，利用多核 CPU 优势。

---

### 63. 希望获取到页面中所有的 checkbox 怎么做？

1.  `document.querySelectorAll('input[type="checkbox"]')`。
2.  循环 `document.getElementsByTagName('input')` 并判断 `type`。

---

### 64. DOM 操作的性能与现代工程重构

虽然在 React/Vue 中很少直接操作 DOM，但理解底层代价至关重要：

- **低效操作**：频繁使用 `appendChild` 导致频繁重排。
- **高性能策略**：
  1. **`document.createDocumentFragment()`**：在内存中构建一棵虚拟树，最后一次性挂载到真实 DOM。
  2. **`cloneNode(true)`**：直接克隆现有模版，性能优于动态拼写 HTML。
- **核心心智**：现代框架的 VDOM 实质上就是为了避免这种昂贵的直接操作，通过 Diff 算法计算出最小补丁，实现局部高效更新。

---

### 65. 正则表达式：前端字符串处理的“手术刀”

- **核心考点**：
  - **贪婪与非贪婪**：默认为最长匹配，使用 `?` 开启最小匹配。
  - **元字符**：`^` (边界), `\d` (数字), `\w` (字符), `.*` (万能匹配)。
  - **捕获组**：使用 `()` 获取子字符串，常用于复杂格式替换。
- **最佳实践**：复杂的正则应拆解并注释，防止成为“离职补偿金代码”。

---

### 66. Javascript 中 callee 和 caller 的作用？

- **caller**：返回一个对函数的引用，该函数调用了当前函数。
- **callee** (arguments 的属性)：返回正被执行的 Function 对象。常在递归中用于解耦匿名函数（但在严格模式下已禁用）。

---

### 67. 页面加载时机的精准度量：Onload vs Ready

- **`$(document).ready` (或原生的 `DOMContentLoaded`)**：
  - **触发时机**：只要 **DOM 树构建完成**，不等待图片、CSS 资源。
  - **意义**：这是 JS 操作 DOM 的最早安全时间点。
- **`window.onload`**：
  - **触发时机**：必须等页面**所有资源**（含高清大图、外部脚本、视频广告）全部下完。
  - **应用**：计算首屏加载时间 (LCP)、执行依赖全量资源的逻辑（如 canvas 截图）。

---

### 68. addEventListener()和 attachEvent()的区别

1.  **参数**：前者三个（事件名、回调、冒泡/捕获）；后者两个（带 `on` 的事件名、回调）。
2.  **阶段**：前者支持冒泡和捕获；后者仅支持冒泡。
3.  **this 指向**：前者指向触发元素；后者指向 `window`。
4.  **顺序**：前者按绑定顺序；后者不确定（旧版 IE）。

---

### 69. 获取页面所有的 checkbox

（参见第 63 题）。

---

### 70. 数组去重：从“业务完成”到“极致性能”

1. **`new Set(arr)` - 首选方案**：ES6 提供的原生集合数据结构，语义最简洁，利用哈希查找，性能 O(n)。适用于绝大多数基础数据去重。
2. **`Map/Object` 键值对**：针对**对象数组**去重。利用 `Map` 的键唯一性存储已出现的 `id` 或特征值。
3. **`filter + indexOf`**：利用 `indexOf` 总是返回第一个索引的特性。逻辑清晰但由于嵌套查找，在大数组下性能较差（O(n²)）。

---

### 71. 原生拖拽的物理交互建模

手写拖拽不仅是监听事件，更是对**分阶段状态**的管理：

1. **`mousedown`**：记录初始位移。计算鼠标点击位置与元素左上角的偏差 (`offsetX`, `offsetY`)。
2. **`mousemove` (必须绑定在 document)**：防止鼠标移动过快脱离元素导致的丢帧。计算 `clientX - offsetX` 得到元素新坐标。
3. **`mouseup`**：注销监听器，防止冗余计算。

- **性能优化**：建议在拖拽过程中使用 `transform: translate(x, y)` 而非修改 `left/top`，以利于 GPU 硬件加速并规避 Layout 阶段。

---

### 72. Javascript 全局函数和全局变量

- **变量**：`window`, `document`, `navigator`, `location` (浏览器端)。
- **函数**：`decodeURI()`, `encodeURI()`, `parseInt()`, `parseFloat()`, `isNaN()`, `eval()`。

---

### 73. 物理级动画的最佳实践：RAF

- **`requestAnimationFrame (RAF)`**：浏览器渲染流水线的“发令枪”。
- **三大优势**：
  1. **帧同步**：由浏览器决定回调频率，自动匹配屏幕刷新率（通常 60Hz），告别 `setTimeout` 因执行积压导致的“跳帧”。
  2. **自动节能**：当标签页切换到后台或隐藏在 `iframe` 中时，RAF 会自动暂停，大幅节省 CPU 和移动端电力。
  3. **集中更新**：浏览器会将同一帧内的所有 DOM 修改合并处理，减少重绘次数。

---

### 74. 封装一个函数，参数是定时器的时间，.then 执行回调函数

```javascript
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
// 使用
sleep(1000).then(() => console.log("done"));
```

---

### 75. Object 对等性校验：浅比较与深比对

1. **绝对相等 (`===`)**：检查内存指针。仅当引用同一个对象地址时成立。
2. **浅比较 (Shallow Equal)**：React 性能优化的核心（如 `memo`, `PureComponent`）。仅对比对象第一层属性的 `===`。
3. **深比较 (Deep Equal)**：递归校验。
   - **快照法**：`JSON.stringify(a) === JSON.stringify(b)`。缺点是无法处理函数、正则及属性顺序。
   - **逻辑递归**：逐一对比所有 Nest 属性。工业级推荐使用 `lodash.isEqual` 以处理极端边缘情况。

---

### 76. 全链路性能优化的知识图谱

作为技术负责人，优化应分为四个战区：

- **网络层 (Transmission)**：
  - 资源收敛：由于 HTTP2 支持多路复用，应减少域名碎片。
  - 静态压缩：Brotli (优于 Gzip)、WebP。
- **构建层 (Bundle)**：
  - **Code Splitting**：按路由分割代码，实现核心资源优先加载。
  - **Tree Shaking**：消除无用代码导出。
- **渲染层 (Rendering)**：
  - **关键路径优化**：对 LCP 元素进行 `Preload`。
  - **长列表治理**：虚拟滚动 (Virtual Scroll)。
- **代码执行层 (Execution)**：
  - **计算分流**：Worker 执行重计算。
  - **交互响应**：防抖、节流。

---

### 77. 浏览器缓存的精密控制

- **强缓存**：`Cache-Control: max-age=31536000`。浏览器直接从磁盘读取，不产生任何网络 IO。
- **协商缓存**：当强缓存失效，带上 `If-None-Match (ETag)` 询问后端。
  - **返回 304**：资源未变，节省回传数据体积。
- **最佳生产实践**：**HTML 设置协商缓存，静态资源 (JS/CSS) 设置一年强缓存**。通过 Webpack 给资源文件加上 **ContentHash**，实现“覆盖式更新”。

---

### 78. WebSocket：解决 HTTP “半双工”顽疾

- **底层演进**：HTTP 是请求-响应式（从客户端开始）。WebSocket 利用 HTTP 协议进行一次 **Upgrade 握手**后，升级为全双工 TCP 连接。
- **业务价值**：
  - **服务器推送 (Push)**：实时消息、大屏看板。不用再走昂贵的 Ajax 轮询。
  - **低延时**：头部极其轻量（仅几字节），在高频通讯场景下带宽利用率极高。

---

### 79. Electron：JS 征战桌面的“终极武器”

- **物理架构**：Chromium (展现层) + Node.js (系统层)。
- **通信模型 (IPC)**：
  - **主进程 (Main)**：拥有完整的 Node 能力，负责窗口管理、原生 API（文件系统、菜单）调用。
  - **渲染进程 (Renderer)**：由于安全限制无法直接访问系统。二者通过 `ipcMain` 和 `ipcRenderer` 进行异步消息通讯。
- **底层思考**：虽然它带来了内存占用的争议，但其极高的跨端开发效率和丰富的 Node 生效，使其成为 VSCode、Slack 等现象级产品的首选。

---

### 80. 深浅拷贝：内存引用管理

- **浅拷贝 (Shallow Copy)**：创建一个新对象，仅复制原始对象的属性值或指针。`Object.assign` 或 `spread (...)`。修改嵌套对象会互相干扰。
- **深拷贝 (Deep Copy)**：在堆中开辟全新空间，递归克隆整个树状结构。
  - **原生方案**：`structuredClone(obj)` (现代浏览器推荐，由于底层实现，速度极快且支持循环引用)。
  - **序列化方案**：`JSON.parse(JSON.stringify(obj))`。快但在遇到函数或 `undefined` 时会丢失数据。

---

### 81. 防抖与节流：交互频率节律控制

- **防抖 (Debounce) - “等最后一下”**：
  - **逻辑**：在事件触发 n 秒后再执行。如果 n 秒内再次触发，重新计时。
  - **场景**：搜索框输入、编辑器自动保存（防止频繁写库）。
- **节流 (Throttle) - “按频率执行”**：
  - **逻辑**：在一段固定时间内，不管触发多频繁，只执行一次。
  - **场景**：滚动高度计算、抢购点击、窗口缩放重绘（保持稳定的 FPS）。

---

### 82. 变量提升 (Hoisting) 的底层表现

- **物理机制**：JS 引擎在**编译阶段**扫描到变量声明，并将其存入词法环境（Lexical Environment）中。
- **三大表现**：
  1. **`var`**：声明提升，初始化为 `undefined`。
  2. **`function`**：整体提升（包括函数体），这意味着可以在声明前调用该函数。
  3. **`let/const`**：虽然声明被提升，但引擎将其标记为未初始化。在程序执行到声明行之前，该变量处于 **TDZ (暂时性死区)**，访问会抛出 ReferenceError。
  - `var`：声明提升，赋值不提升（初始为 `undefined`）。
  - `function`：整函数提升。
  - `let/const`：存在“暂时性死区”，在声明前使用会报错。

---

### 83. 单线程与异步的哲学博弈

- **单线程模型**：JavaScript 的设计初衷是作为浏览器脚本语言。由于它需要频繁操作 DOM，如果采用多线程，会产生复杂的同步问题（如一个线程在删 DOM，另一个在改 DOM）。因此，单线程确保了操作的**原子性**。
- **异步的救赎**：为了不让单线程被网络请求、文件 I/O 等耗时任务阻塞。JS 采用了异步机制。
- **底层驱动**：主线程仅负责“执行栈”。耗时任务被托管给浏览器的其他线程（如网络线程、定时器线程）。任务完成后，其回调被塞入任务队列，等待主线程空闲时通过 **Event Loop** 取回并执行。

---

### 84. Hybrid 开发：Native 与 Web 的混合动力

- **核心架构**：基于 **WebView** 容器。UI 层由 HTML5 负责（快渲染、易迭代），系统能力由 Native 负责（高权限、高性能）。
- **JSBridge 通信协议**：
  1. **注入 API**：Native 直接在 WebView 的 `window` 对象上挂载 JS 方法（类似 `window.AndroidApp.postMessage`）。
  2. **URL Scheme 拦截**：Web 发起一个伪 URL 请求（如 `jsbridge://method?params`），Native 容器拦截并解析该请求。
- **工程价值**：一套代码多端运行，且支持**热更新**，绕过应用商店审核。

---

### 85. 组件化：现代前端工程的微缩宇宙

- **定义**：将复杂的 UI 拆分为**高内聚、低耦合**的逻辑单元。
- **资深视角：组件化四要素**：
  1. **标准属性 (Props)**：外部数据的单向注入，确保行为可控。
  2. **自定义事件 (Emits)**：子组件对外部的异步通知，实现解耦通信。
  3. **插槽 (Slots)**：布局权限的委派，实现极强的 UI 灵活性（如 `Render Props` 思想）。
  4. **生命周期钩子**：赋予组件在不同阶段（装载、更新、卸载）进行副作用管理的能力。
- **价值**：极大提升了代码的可维护性，并促进了诸如 Storybook 这种组件库开发生态的建立。

---

### 86. 前端面试之 MVVM 浅析

- **Model**：数据模型。
- **View**：UI 视图。
- **ViewModel**：连接器。
  - 负责**数据绑定**：Model 变，View 自动更新。
  - 负责**事件监听**：View 操作，Model 自动同步。
- **核心优点**：解耦视图与逻辑，开发者只需关注数据。

---

### 87. 实现效果，点击容器内的图标，图标边框变成 border 1px solid red，点击空白处重置

- **实现**：利用**事件冒泡**。
  - 监听容器点击事件。
  - 若 `e.target` 是图标，则给它加类/边框。
  - 若 `e.target` 是容器本身，则清除所有图标边框。

---

### 88. 手写极简 MVVM：响应式系统初探

```javascript
// 模拟 Vue 2 的基本实现
class TinyVue {
  constructor(options) {
    this.$data = options.data();
    this.observe(this.$data);
  }

  observe(data) {
    Object.keys(data).forEach((key) => {
      let value = data[key];
      Object.defineProperty(data, key, {
        set: (newVal) => {
          if (newVal === value) return;
          value = newVal;
          this.updateView(key, newVal); // 触发视图更新
        },
      });
    });
  }

  updateView(key, val) {
    // 简化版：查找所有绑定了该 key 的 DOM 进行同步
    const els = document.querySelectorAll(`[v-bind="${key}"]`);
    els.forEach((el) => (el.innerText = val));
  }
}
```

---

### 89. 实现 Storage，使得该对象为单例，并对 localStorage 进行封装设置值 setItem(key,value)和 getItem(key)

```javascript
class MyStorage {
  static getInstance() {
    if (!this.instance) this.instance = new MyStorage();
    return this.instance;
  }
  setItem(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }
  getItem(key) {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  }
}
const storage = MyStorage.getInstance();
```

---

### 90. 谈谈你对 Event Loop 的理解（宏观视角）

作为资深工程师，必须理解 **Event Loop 与渲染帧 (Render Frame)** 的精确交织：

1.  **宏任务 (Macrotask)**：Script 全部代码、`setTimeout`、`I/O`、UI 渲染。
2.  **微任务 (Microtask)**：`Promise.then`、`MutationObserver`、`Process.nextTick` (Node)。
3.  **执行顺序的真相**：
    - 取出一个宏任务执行（如 Initial script）。
    - **同步清空微任务队列**：直到队列完全为空。如果微任务里产生新的微任务，按顺序继续执行，这会循环式阻塞。
    - **检查渲染更新**：如果当前渲染帧周期到了（通常 16.6ms），浏览器会按顺序执行 `requestAnimationFrame` -> `Layout` -> `Paint`。
    - 执行下一个宏任务。

- **大厂实战技巧**：如果有高耗时计算任务，不要放在微任务中（会卡死页面），应利用 **Web Worker** 在独立线程处理，或者通过 `requestIdleCallback` 在帧空闲时分片执行。

---

### 91. JavaScript 对象生命周期的理解

1.  **分配内存**：对象创建时（声明变量、创建对象）。
2.  **使用内存**：读取、修改对象属性。
3.  **回收内存**：当对象不再被引用时，由垃圾回收器 (GC) 自动释放。

---

### 92. 我现在有一个 canvas，上面随机布着一些黑块，请实现方法，计算 canvas 上有多少个黑块

- **思路**：使用 **BFS (广度优先搜索)** 或 **DFS** 寻找连通分量。
  1. 通过 `getImageData` 获取像素数组。
  2. 遍历每个像素，发现黑色像素且未被访问时，计数器 +1。
  3. 以该像素为起点，将相连的所有黑色像素标记为“已访问”。

---

### 93. Dialog 组件：不仅仅是浮层

作为高级组件，设计时应考虑以下工程细节：

1. **渲染挂载 (Portal)**：利用 `ReactDOM.createPortal` 或 `append to body` 将 Dialog 移出当前 DOM 树结构。
   - **目的**：规避父元素的 `z-index` 覆盖或 `overflow: hidden` 导致的遮挡问题。
2. **状态驱动**：不仅仅是 `visible` 属性，还应支持**命令式调用** (`Dialog.show({ ... })`)。
3. **交互规范**：
   - **锁定滚动**：弹出时应锁定 `body` 滚动条，防止“穿透滑动”。
   - **键盘友好**：支持 `Esc` 关闭。
   - **深度自定义**：提供 `footer` 插槽和 `maskClosable` 开关。
4. **过渡动效**：通过 CSS Transition 实现出现时的缩放或淡入，提升温润感。

---

### 94. 请求技术栈：Ajax vs Axios vs Fetch

1. **Ajax (XMLHttpRequest)**：传统的底层异步通讯方式。由于 API 极其繁琐（状态码判断、回调嵌套），目前仅作为底层原理学习，不建议在业务中使用。
2. **Axios (企业首选)**：
   - **成熟度**：基于 Promise 的封装，极其强大的**拦截器 (Interceptors)** 机制。
   - **安全性**：原生支持防范 **CSRF** (跨站请求伪造)。
   - **友好性**：自动转换 JSON，支持 Node.js 环境及浏览器端同构。
3. **Fetch (原生新选)**：
   - **定位**：更语义化的原生 API。
   - **缺点**：默认不带 Cookie (需配置 `credentials`)、**404 状态不报错**（需手动判断 ok 属性）。目前通过 `AbortController` 支持请求中断。

---

### 95. JavaScript 的组成

1.  **ECMAScript**：核心语法、标准。
2.  **BOM (Browser Object Model)**：浏览器对象模型，操作浏览器功能（window, location）。
3.  **DOM (Document Object Model)**：文档对象模型，操作页面节点。

---

### 96. 检测浏览器版本有哪些方式？

1.  `navigator.userAgent`：解析 UA 字符串。
2.  **特性检测**：通过判断 API 是否存在（如 `'IntersectionObserver' in window`）。

---

### 97. 介绍 JS 有哪些内置对象

（参见第 31 题：Object, Array, Date, Math, RegExp, Error, Promise 等）。

---

### 98. 说几条写 JavaScript 的基本规范

（参见第 32 题：命名规范、分号、不使用 var、注释等）。

---

### 99. 编写高性能 JavaScript 的银弹锦囊

从执行效率、内存管理、渲染负载三个维度调优：

1. **算法级优化**：
   - 空间换时间：建立哈希索引（`Map`）代替 `.find()` 中的线性查找。
   - 避免 `O(n²)`：严禁在循环中嵌套循环进行数据比对。
2. **DOM 操作极致收敛**：
   - **读写分离**：利用 `FastDOM` 思想，批量读取、批量写入，防止触发 Forced Synchronous Layout。
   - **离线更改**：在 `DocumentFragment` 中完成后再一次性应用。
3. **内存安全保障**：
   - 及时清理闭包、定时器和 Event Listener。
   - 避免产生大量的**瞬时短命对象**，减缓 GC 压力。
4. **计算分流**：
   - 使用 **Web Worker** 将由于复杂计算带来的卡顿移出主线程。

---

### 100. 描述浏览器的渲染过程，DOM 树和渲染树的区别

- **过程**：HTML -> DOM Tree；CSS -> CSSOM；合并 -> Render Tree -> Layout -> Paint。
- **区别**：
  - **DOM 树**：包含所有节点（包括 `display: none`、`head` 标签等）。
  - **渲染树**：只包含**可见节点**（不含 `display: none`、`head` 等），以及元素的几何属性和样式。

---

### 101. script 的位置是否会影响首屏显示时间

- **会影响**。在默认情况下，浏览器解析 HTML 时遇到 `<script>` 会停止解析，先下载并执行脚本。执行脚本会阻塞 DOM 树的构建，从而延迟首屏渲染。
- **解决**：将脚本放在 `</body>` 前，或使用 `defer`/`async` 属性。

---

### 102. 介绍 DOM 的发展

- **DOM 0**：不是标准，是早期 Netscape 的实现（如 `onclick`）。
- **DOM 1**：W3C 第一个标准，主要解决 HTML/XML 文档结构。
- **DOM 2**：引入了**事件模型** (`addEventListener`)、遍历和范围。
- **DOM 3**：增加了文件保存、验证、XPath、更高级的事件。

---

### 103. 介绍 DOM0，DOM2，DOM3 事件处理方式区别

- **DOM0**：将函数赋值给事件属性（如 `onclick`）。只能绑定一个。
- **DOM2**：使用 `addEventListener`。支持冒泡和捕获，可绑定多个。
- **DOM3**：在 DOM2 基础上增加了更多的事件类型（如 `focusin`, `mouseenter`）和自定义事件的支持。

---

### 104. 区分什么是"客户区坐标"、"页面坐标"、"屏幕坐标"

1.  **客户区坐标 (clientX/Y)**：相对于浏览器可视视口（viewport）的坐标。
2.  **页面坐标 (pageX/Y)**：相对于整个 HTML 文档的坐标（含滚动距离）。
3.  **屏幕坐标 (screenX/Y)**：相对于电脑屏幕左上角的坐标。

---

### 105. 精准理解垃圾回收 (GC) 演进

1. **引用计数 (早期方案)**：简单的“记账”模式。
   - **致命缺陷**：无法处理**循环引用**（A 引用 B，B 引用 A，两者的计数永远不为 0）。曾导致早期 IE 的严重内存泄漏。
2. **标记清除 (现代标准)**：
   - **过程**：GC 从 **GC Roots** (全局对象、执行栈、内置对象等) 出发，通过指针追踪所有可达对象并打标。
   - **回收**：未被标记的对象即为垃圾。
3. **V8 的分代回收 (高级进阶)**：
   - **新生代 (New Space)**：存储寿命短的对象。采用 `Scavenge` 算法，利用 Space 翻转实现高频清理。
   - **老生代 (Old Space)**：存储存活时间久的对象。采用 `Mark-Sweep` 与 `Mark-Compact` (整理内存碎片)。

---

### 106. 请解释一下 JavaScript 的同源策略

（参见第 19 题：同协议、同域名、同端口。旨在保证用户数据安全）。

---

### 107. 如何删除一个 cookie

- **原理**：将该 Cookie 的过期时间 (`expires`) 设置为一个过去的时间。
- **代码**：`document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";`。

---

### 108. 页面编码和被请求的资源编码如果不一致如何处理

- 在请求标签上指定 `charset`。
  - 如：`<script src="..." charset="gbk"></script>`。
- 更好的方案是统一使用 `UTF-8`。

---

### 109. 把`<script>`放在`</body>`之前和之后有什么区别？浏览器会如何解析它们？

- **区别**：基本无差别。现代浏览器都会等 DOM 解析到该位置时再解析脚本。脚本放在 `</body>` 之后实际上也是不规范的，浏览器通常会将其解析并移动到 `</body>` 之前。

---

### 110. JavaScript 中，调用函数有哪几种方式

1.  **函数调用**：`foo()`。
2.  **方法调用**：`obj.foo()`。
3.  **构造函数调用**：`new Foo()`。
4.  **间接调用**：`foo.call(obj)` / `foo.apply(obj)`。

---

### 111. 列举一下 JavaScript 数组和对象有哪些原生方法？

- **数组**：`push`, `pop`, `shift`, `unshift`, `splice`, `slice`, `concat`, `join`, `sort`, `reverse`, `forEach`, `map`, `filter`, `reduce`, `every`, `some`。
- **对象**：`hasOwnProperty`, `toString`, `valueOf`, `isPrototypeOf`, `propertyIsEnumerable`。

---

### 112. Array.slice() 与 Array.splice() 的区别？

- **slice(start, end)**：
  - **切片**。返回选定元素的新数组。
  - **原数组不变**。
- **splice(index, howmany, item1, ...)**：
  - **剪切/插入**。删除或添加元素。
  - **原数组会变**。

---

### 113. MVVM

（参见第 86 题：Model-View-ViewModel 架构）。

---

### 114. 服务器端数据推送 (Server Push) 集锦

1. **WebSocket**：全双工、低延时、高性能。最现代的即时通讯方案。
2. **SSE (Server-Sent Events)**：
   - **特点**：基于 HTTP 协议的长连接，仅限服务端向客户端发送。
   - **优势**：轻量级、原生支持自动断线重连。适用于股价走势、实时监控预览。
3. **长轮询 (Long Polling)**：服务器收到请求后暂时挂起，直到有数据或超时再响应。
4. **短轮询 (Polling)**：效率最低，产生大量冗余 HTTP 头部开销。

---

### 115. 继承

（参见第 5 题：寄生组合继承、Class 继承等）。

---

### 116. 有四个操作会忽略 enumerable 为 false 的属性

1.  `for...in` 循环。
2.  `Object.keys()` 方法。
3.  `JSON.stringify()`。
4.  `Object.assign()`。

---

### 117. 属性的遍历

（参见第 57 题：`for...in`, `Object.keys`, `Object.getOwnPropertyNames`）。

---

### 118. 为什么通常在发送数据埋点请求的时候使用的是 1x1 像素的透明 gif 图片

1.  **无跨域限制**：图片请求不受同源策略限制。
2.  **不占用资源**：不需要额外的 DOM 操作或 JS 库，不阻碍页面关闭。
3.  **体积最小**：1x1 gif 是所有图片格式中合法的二进制体积最小的（仅 35 字节）。
4.  **性能高**：不需要服务器返回响应体，状态码 204 或 200 即可。

---

### 119. 在输入框中如何判断输入的是一个正确的网址

- **使用正则表达式**：判断是否以 `http://` 或 `https://` 开头，且后续符合域名/路径规范。
- **使用 URL Constructor**：`try { new URL(str); } catch { return false; }`。

---

### 120. 常用设计模式有哪些并举例使用场景

（参见第 18 题：单例、工厂、观察者、装饰器等）。

---

### 121. 原型链判断

- 使用 `instanceof`。
- 使用 `isPrototypeOf`。
- 手写遍历 `__proto__` 对比。

---

### 122. RAF 和 RIC 是什么

- **RAF (requestAnimationFrame)**：在每帧渲染前执行，适合做动画。
- **RIC (requestIdleCallback)**：在浏览器**空闲时**执行，适合处理低权重的后台计算（如 React Fiber 调度）。

---

### 123. js 自定义事件

```javascript
// 创建
const event = new CustomEvent("myEvent", { detail: { name: "js" } });
// 监听
element.addEventListener("myEvent", (e) => console.log(e.detail));
// 触发
element.dispatchEvent(event);
```

---

### 124. 前端性能定位、优化指标以及计算方法

- **指标**：FP, FCP, LCP (最大内容绘制), TTI (可交互时间), CLS (布局偏移)。
- **定位**：Chrome DevTools - **Performance** 面板、**Lighthouse**。
- **计算**：通过 `PerformanceObserver` API 获取。

---

### 125. 谈谈你对函数是一等公民的理解

意味着函数在 JS 中可以像其他值（如数字、字符串）一样被对待：

1.  可以赋值给变量。
2.  可以作为参数传递。
3.  可以作为函数的返回值。
4.  具有属性和方法。

## 六、微信小程序相关

---

### 1. 微信小程序的物理构造

小程序的每个页面由四个核心文件协同工作：

- **`.wxml`**：类似 HTML，用于结构化描述视图层。
- **`.wxss`**：类似 CSS，具备 **rpx** (抗锯齿自适应单位) 能力。
- **`.js`**：逻辑层，通过 `Page()` 构造，操作数据模型。
- **`.json`**：页面的静态配置，控制顶部标题颜色、组件引用的本地化作用域。

---

### 2. 小程序通信链路与 setData 性能陷阱

- **架构原理**：小程序是**双线程架构**（逻辑层 AppService 与 视图层 WebView）。二者通过微信原生的 JSBridge 进行数据交换。
- **性能红线**：由于线程间通信是**序列化字符串传递**，极其耗时。
  - **优化之道**：
    1. 严禁在 `onPageScroll` 等高频回调中直接 `setData`。
    2. 局部更新：`this.setData({ 'list[0].text': 'new' })` 而非重传整个 list。

---

### 3. WXSS 的“现代性”与 CSS 的差异

1. **响应式单位 rpx**：将屏幕宽度强制定义为 750 份，自适应全平台各尺寸手机屏幕。
2. **样式隔离**：默认开启组件级样式隔离。
3. **内置扩展**：支持全局公共样式 `app.wxss` 的自动导入。

---

### 5. 跨端选型：微信小程序 vs Vue.js

1. **渲染模式**：小程序是原生包装的 Webview 或混合渲染；Vue 是浏览器渲染。
2. **数据流机制**：小程序手动调用 `this.setData` 同步到视图（异步渲染）；Vue 利用 `Getter/Setter` 实现响应式同步。
3. **API 权限**：小程序可直接调用微信原生的扫码、支付、地理位置等高权限 API。
4. **生命周期**：小程序具备 `onLoad`, `onReady`, `onUnload` (页面级) 与 `onLaunch`, `onShow` (应用级) 的多维管控。

---

## 七、Webpack 相关

---

### 1. 优化 webpack 打包体积的思路

1.  **Tree Shaking**：移除无用代码。
2.  **代码分割 (Scope Hoisting)**：合并函数作用域。
3.  **外部引入 (Externals)**：如 CDN 引入 React/Vue。
4.  **按需加载**：`import()`。
5.  **压缩代码**：TerserPlugin (JS), CssMinimizerPlugin (CSS)。
6.  **图片转 Base64**：针对小图减少请求。

---

### 2. 优化 webpack 打包效率的方法

1.  **多进程/多实例**：`thread-loader`。
2.  **缓存**：`cache-loader` 或 Webpack 5 的 `filesystem cache`。
3.  **热更新 (HMR)**：局部更新。
4.  **减少查找**：配置 `alias`, `extensions`, `exclude` (排除 node_modules)。
5.  **DLLPlugin**：分离第三方库（Webpack 5 已不推荐，推荐持久缓存）。

---

### 3. 编写 Loader

- **原理**：Loader 是一个导出为函数的 JavaScript 模块。它接收资源源文件内容，处理后输出。
- **参数**：`content` (文件内容), `map`, `meta`。
- **示例**：
  ```javascript
  module.exports = function (source) {
    return source.replace("var", "const");
  };
  ```

---

### 4. 编写 plugin

- **原理**：Plugin 是一个类，具有 `apply` 方法。它是基于**插件机制**（Tapable）在 Webpack 生命周期钩子上挂载逻辑。
- **示例**：
  ```javascript
  class MyPlugin {
    apply(compiler) {
      compiler.hooks.done.tap("MyPlugin", (stats) => {
        console.log("Build finished!");
      });
    }
  }
  ```

---

### 5. 说一下 webpack 的一些 plugin，怎么使用 webpack 对项目进行优化

- **常用 Plugin**：
  - `HtmlWebpackPlugin`：自动生成 HTML。
  - `MiniCssExtractPlugin`：提取 CSS 为独立文件。
  - `DefinePlugin`：定义全局常量（如开发/生产环境）。
  - `BundleAnalyzerPlugin`：分析打包体积。
- **优化**：分包分包、CDN 加速、开启 Gzip。

---

### 6. webpack Plugin 和 Loader 的底层区别

作为工程化负责人，应从 **构建生命周期** 角度理解两者的差异：

- **Loader (内容转换器)**：
  - **职责**：Webpack 自身只理解 JS/JSON。Loader 让其具备处理 CSS、图片或 TS 的能力。
  - **性质**：属于单纯的“函数”，输入 A 内容，输出 B 内容。运行在 **Module 解析阶段**。
- **Plugin (流程干预器)**：
  - **职责**：基于 **Tapable** 事件流机制，在 Webpack 全生命周期（Compile -> Emit -> Done）中广播事件。
  - **性质**：具备 `compiler` 和 `compilation` 的完全访问权。它可以修改输出文件、注入环境变量甚至启动本地服务器。
- **大厂方案**：在极大规模的项目中，我们会手写 **Custom Webpack Plugin** 来实现特定的自动化分析（如：自动扫描未使用的图片资源并报错）。

---

### 7. Tree Shaking 的底层原理与实战屏障

- **前提条件**：由于 Tree Shaking 需要**静态分析**，因此必须使用 **ESM** (`import/export`)。
- **执行过程**：
  1. Webpack 标记出模块的导出位（Exported Names）。
  2. 追踪实际被引用的导出（Used Exports）。
  3. **死代码删除 (DCE)**：利用 Terser 对未引用的代码块进行最终剔除。
- **大厂避坑：副作用 (Side Effects)**：
  - 许多 npm 包由于在顶层修改了全局变量或调用了控制台，Webpack 会保守地认为该模块具有“副作用”而不敢删除。
  - **工程实践**：在项目 `package.json` 中配置 `"sideEffects": false`，能显著提升打包后的体积收益（尤其是引入大型 UI 组件库时）。

---

### 8. common.js 和 es6 中模块引入的区别

1.  **加载时间**：CommonJS 是运行阶段同步加载；ES6 是编译阶段静态解析。
2.  **导出内容**：CommonJS 是值的**拷贝**；ES6 是值的**引用**（只读）。
3.  **this 指向**：CommonJS `this` 指向当前模块；ES6 `this` 为 `undefined`。

---

### 9. babel 原理

1.  **解析 (Parse)**：将代码转为 **AST (抽象语法树)**（包括词法分析和语法分析）。
2.  **转换 (Transform)**：遍历 AST，根据配置的插件（Plugin/Preset）对树进行修改（如 ES6 语法转 ES5）。
3.  **生成 (Generate)**：将修改后的 AST 重新生成代码字符串。

---

## 八、框架相关

---

### 1. Vue 响应式原理：从“追回”到“预防”

面试官在考察你对 Vue 2 vs 3 变革的技术理解深度：

- **Vue 2 (Object.defineProperty)**：
  - **局限性**：无法监测对象属性的新增/删除，无法监听数组通过索引的修改。初始化时需要一次性全量递归，如果状态对象极大，会导致显著的由于 CPU 占用产生的白屏卡顿。
- **Vue 3 (ES6 Proxy)**：
  - **优势**：
    - **层级懒监听**：只有当访问到深层属性时，Proxy 才会对其进行下一层嵌套。
    - **支持全类型**：原生支持 `Set`, `Map` 的响应式。
    - **性能上限**：省去了大量 `Object.keys` 的遍历操作。
- **闭环思维**：两者核心都是 **观察者模式 (Observer)**。在 `getter` 中进行依赖收集 (`Track`)，在 `setter` 中触发更新通知 (`Trigger`)。

---

### 2. Vue nextTick 的异步批处理机制

面试官通过此题考察你对**高性能 DOM 更新策略**的认知：

- **核心矛盾**：DOM 操作是极其昂贵的。如果数据每变动一次就同步渲染一次 DOM，复杂的表单操作会导致页面彻底卡死。
- **解决方案：异步队列 (Async Queue)**：
  - Vue 在检测到数据变化后，并不会立即开启渲染流，而是将所有 Watcher 推入一个 **Queue**。
  - 在当前同步代码（Task）执行完毕后，通过**微任务 (Microtask)** 开启 `nextTick` 回调。
- **底层优先序**：Vue 会优先尝试使用 `Promise.then` 或 `MutationObserver` 这种微任务方案。只有在极个别不支持的环境下，才会降级到宏任务。
- **实战结论**：在一次事件循环中不管修改多少次状态，DOM 只会经历一次完整的 Diff 与重绘。

---

### 3. DOM Diff 算法：最小化代价的博弈

Diff 算法是虚拟 DOM 渲染器的心脏，其核心是**在 O(n) 的复杂度内通过比对找到最小更新路径**：

1. **同层比对 (Level-by-level)**：由于前端 UI 跨层级移动的情况极少，Diff 默认只对同层节点进行比对，若节点跨层，则直接销毁重建。
2. **Key 的物理意义**：Key 不是随机数，而是**节点的唯一标识符**。有了 Key，Diff 算法可以通过 Map 快速检索旧节点，将原本无序的 O(n²) 查找变为 O(n) 的位置复用。
3. **策略演进**：
   - **双端对比 (Vue 2)**：通过四个指针（旧前/后、新前/后）向中间收拢，优先处理位置未变或仅发生首尾交换的节点。
   - **最长递增子序列 (Vue 3 / React)**：在处理需要大规模移动的序列时，通过求解“最长递增子序列”，找出那些**不需要动**的节点，从而将 DOM 操作降至物理极限。

---

### 4. SPA 路由驱动：Hash vs History

这是构建现代单页应用 (SPA) 的基石，其本质是**改变 URL 却不刷新页面**：

- **Hash 模式 (`/#/path`)**：
  - **原理**：监听 `hashchange` 事件。`#` 后的部分不包含在 HTTP 请求中。
  - **优势**：兼容性极佳（支持到 IE8），部署时无需服务器任何额外配置。
- **History 模式 (`/path`)**：
  - **原理**：利用 HTML5 `history.pushState` 操控浏览器历史堆栈。
  - **挑战**：当用户手动刷新页面时，浏览器会向服务器请求该全路径。如果服务器没有对应的静态资源，会报 **404**。
  - **资深方案**：需要在 Nginx 配置 `try_files $uri $uri/ /index.html;`，将所有未匹配路径重定向回入口 HTML。

---

## 九、编程题相关

---

### 1. 通用事件监听器：跨代兼容封装

```javascript
const EventUtil = {
  // 绑定事件
  on: (el, type, handler, useCapture = false) => {
    if (el.addEventListener) {
      el.addEventListener(type, handler, useCapture);
    } else if (el.attachEvent) {
      // 兼容旧版 IE，注意 attachEvent 的 this 指向 window
      el.attachEvent(`on${type}`, handler);
    } else {
      el[`on${type}`] = handler;
    }
  },
  // 解绑事件
  off: (el, type, handler) => {
    if (el.removeEventListener) {
      el.removeEventListener(type, handler, false);
    } else if (el.detachEvent) {
      el.detachEvent(`on${type}`, handler);
    } else {
      el[`on${type}`] = null;
    }
  },
  // 获取事件对象与目标
  getEvent: (e) => (e ? e : window.event),
  getTarget: (e) => e.target || e.srcElement,
};
```

---

### 2. 如何判断一个对象是否为数组

```javascript
function isArray(obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
}
// 或 ES6
Array.isArray(obj);
```

---

### 3. 冒泡排序

```javascript
function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    }
  }
  return arr;
}
```

---

### 4. 快速排序：分治思想的工业实现

```javascript
/**
 * 快速排序 (O(n log n))
 * 原地排序版 (In-place) 性能更佳
 */
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return;
  let pivotIndex = partition(arr, left, right);
  quickSort(arr, left, pivotIndex - 1);
  quickSort(arr, pivotIndex + 1, right);
  return arr;
}

function partition(arr, left, right) {
  let pivot = arr[right];
  let i = left;
  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[right]] = [arr[right], arr[i]];
  return i;
}
```

---

### 5. 编写一个方法 求一个字符串的字节长度

```javascript
function getByteLen(str) {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    str.charCodeAt(i) > 255 ? (len += 2) : len++;
  }
  return len;
}
```

---

### 6. 手写 `bind`：闭包与原型链的综合考察

```javascript
Function.prototype.myBind = function (context, ...args) {
  const self = this; // 缓存原函数

  const fBound = function (...innerArgs) {
    // 处理构造函数场景：如果被 new 调用，this 指向实例
    // 否则指向指定的 context
    const isConstructor = this instanceof fBound;
    return self.apply(isConstructor ? this : context, args.concat(innerArgs));
  };

  // 继承原型链
  fBound.prototype = Object.create(this.prototype);
  return fBound;
};
```

---

### 7. 实现一个函数 clone

（浅克隆）

```javascript
function clone(obj) {
  if (typeof obj !== "object" || obj == null) return obj;
  return Array.isArray(obj) ? [...obj] : { ...obj };
}
```

---

### 8. 下面这个 ul，如何点击每一列的时候 alert 其 index

```javascript
// 使用事件委托
ul.onclick = function (e) {
  let target = e.target;
  if (target.nodeName === "LI") {
    let index = Array.from(ul.children).indexOf(target);
    alert(index);
  }
};
```

---

### 9. 定义一个 log 方法，让它可以代理 console.log 的方法

```javascript
function log() {
  console.log.apply(console, arguments);
}
```

---

### 10. 输出今天的日期

```javascript
const d = new Date();
console.log(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`);
```

---

### 11. 用 js 实现随机选取 10–100 之间的 10 个数字，存入一个数组，并排序

```javascript
let res = [];
for (let i = 0; i < 10; i++) {
  res.push(Math.floor(Math.random() * 91 + 10)); // [10, 100]
}
res.sort((a, b) => a - b);
```

---

### 12. 写一段 JS 程序提取 URL 中的各个 GET 参数

```javascript
function getParams(url) {
  let res = {};
  url.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => (res[k] = v));
  return res;
}
```

---

### 13. 写一个 function，清除字符串前后的空格

```javascript
function trim(str) {
  return str.replace(/^\s+|\s+$/g, "");
}
// 或直接
str.trim();
```

---

### 14. 实现每隔一秒钟输出 1,2,3…数字

```javascript
// 方式 1: let
for (let i = 1; i <= 10; i++) {
  setTimeout(() => console.log(i), i * 1000);
}
```

---

### 15. 实现一个函数，判断输入是不是回文字符串

````javascript
function isPalindrome(str) {
  return str === str.split("").reverse().join("");
}

---

### 16. 数组扁平化处理

```javascript
// 递归
function flatten(arr) {
  return arr.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b),
    []
  );
}
// 或 ES6
arr.flat(Infinity);
````

---

### 17. 健壮的深拷贝 (Deep Clone) 工业实现

不仅支持基础类型，更需处理**循环引用**与**特殊对象**：

```javascript
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);

  // 处理循环引用
  if (hash.has(obj)) return hash.get(obj);

  let cloneObj = new obj.constructor();
  hash.set(obj, cloneObj);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }
  return cloneObj;
}
```

---

### 28. 最长不重复子串 (滑动窗口算法)

```javascript
function lengthOfLongestSubstring(s) {
  let map = new Map();
  let max = 0,
    left = 0;
  for (let i = 0; i < s.length; i++) {
    // 如果字符已出现过，且在当前窗口内，移动左指针
    if (map.has(s[i])) {
      left = Math.max(left, map.get(s[i]) + 1);
    }
    map.set(s[i], i);
    max = Math.max(max, i - left + 1);
  }
  return max;
}
```

---

## 十、前端综合问题

---

### 1. 资深视角：如何理解重构 (Refactoring)

作为 8 年经验的前端，重构不是“推倒重来”，而是一场**渐进式的技术债务偿还**：

- **重构的红线**：在不改变代码**外部可观察行为**的前提下，优化内部结构。如果改变了业务逻辑，那叫“重写”而非“重构”。
- **工程化链路**：
  1. **建立安全网**：在重构前，必须确保核心业务逻辑已有 **Unit Tests** 或 **E2E Tests** 覆盖。
  2. **小步快跑**：每次只重构一个小模块，完成后提交并发布。
  3. **灰度验证**：对于核心架构的重构，应配合 **Feature Flag** 开启线上 AB 测试或百分比灰度。
- **价值体现**：提高代码的可测试性（Testability）与可扩展性（Extensibility），通过“熵减”维持系统长期的高效吞吐。

---

### 2. 资深前端心目中的“现代好代码”

除了满足逻辑正确，资深工程师更看重代码的**演进能力**：

1. **可测试性 (Testability)**：代码是否解耦？是否能通过 Mock 轻松进行自动化测试？
2. **单一职责 (Single Responsibility)**：每一个函数是否只做一件事且能被一眼看穿意图？
3. **自文档化 (Self-documenting)**：变量命名是否具备语义化（如 `isUserAuthenticated` 优于 `isAuth`），减少了对注释的依赖。
4. **防御式编程**：是否预判了非法输入？是否优雅地处理了异步异常？
5. **工程的一致性**：代码风格是否符合团队规范，让其他协作成员“如见故人”。

---

### 3. 微前端 (Micro Frontends)：解决巨无霸应用的终极方案

在 2024 年，资深前端必须理解这种架构模式：

- **核心价值**：将大型 Web 应用拆分为多个**独立开发、独立部署、技术栈无关**的小型应用。
- **底层技术**：
  - **乾坤 (qiankun)**：基于 Single-spa 封装，提供了完美的 JS 沙箱隔离与样式隔离。
  - **Module Federation (Webpack 5)**：极致的运行时依赖共享模式。
- **适用场景**：上百人的大型研发团队、需要聚合多个技术栈历史遗留系统的平台。

---

### 4. 前端工程化的价值罗盘

1. **稳定性 (Stability)**：通过 CI/CD、代码 Lint、自动化测试减少线上事故率。
2. **交付效率 (Velocity)**：极致的构建速度（Vite/RSPack）与脚手架自动化，缩短从需求到上线的周期。
3. **一致性 (Consistency)**：统一的技术栈、UI 组件库、交互规范，降低团队心智负担。
4. **可度量性 (Observability)**：通过埋点、错误监控 (Sentry) 实现对业务数据的量化感知。

---

### 5. 平时如何管理你的项目

1.  **版本控制**：Git 规范化提交。
2.  **文档管理**：编写 Readme, 维护技术文档。
3.  **任务拆解**：使用 Jira/飞书文档拆分需求点。
4.  **质量保障**：代码评审 (CR), 自动化测试。

---

### 6. 组件封装

- **原则**：职责单一、低耦合。
- **三要素**：Props (输入), Events (输出), Slot (扩展内容)。
- **注意**：合理设置默认值、完善的类型定义、解耦业务逻辑与 UI 展示。

---

### 7. Web 前端开发的注意事项

1.  **安全**：防范 XSS, CSRF。
2.  **兼容性**：移动端真机适配。
3.  **性能**：避免大图加载、减少重绘重排。
4.  **SEO**：语义化标签、合理的 Meta 信息。

---

### 8. 在设计 Web APP 时，应当遵循以下几点

1.  **离线可用**：Service Worker, 缓存策略。
2.  **快速响应**：骨架屏, 异步组件。
3.  **适配多端**：响应式布局。
4.  **安全性**：HTTPS, 内容安全策略 (CSP)。

---

### 9. 你怎么看待 Web App/hybrid App/Native App？（移动端前端 和 Web 前端区别？）

- **Web App**：纯网页。开发成本最低，但无法调用系统底层 API，体验受网络限制。
- **Native App**：原生应用。性能最强，体验最好，但开发成本高，迭代慢。
- **Hybrid App**：混合应用。折中方案，Web 负责 UI，Native 负责底层。
- **异同**：移动端前端更关注触摸事件、网络环境不稳定、屏幕适配；Web 前端涉及的场景更广。

---

### 10. 页面重构怎么操作

1.  **备份与环境搭建**。
2.  **分析旧代码**：保留业务逻辑，识别可复用部分。
3.  **解耦与模块化**：先拆分组件，再重写样式。
4.  **小步快跑**：逐步替换功能，每步都要经过测试验证。
5.  **上线与监控**：分批引流，观察异常指标。

---

## 十一、HR 面相关

---

### 资深候选人的面试心理博弈

- **关于“不足之处”与“缺点”**：
  - **逻辑**：展示你的**自我驱动力**与**成长复盘能力**。
  - **话术**：不要说“粗心”，要说“早期在大规模系统的架构选型上更依赖经验，现在通过深入研读源码和性能度量体系，学会了数据驱动的科学决策”。
- **关于 Offer 情况**：
  - **逻辑**：建立**稀缺性**与**专业性**。
  - **话术**：坦诚有其他一线大厂在最后阶段，但你的技术方向与本司的 XXX 业务（要具体）高度契合，这是你目前的首选。
- **为什么离职？ (管理颗粒度)**：
  - **逻辑**：不留后患。
  - **话术**：强调个人在当前的平台已达到边际收益递减期。你渴望进入一个更具规模或业务更深水的战场（如：从 C 端工具类转向复杂的 B 端 PaaS 平台），去验证你已建立的架构方法论。
- **关于加班的工程视角**：
  - **话术**：我不赞成“低效磨洋工”。但在业务攻坚期或重大架构重构上线时，我个人有极强的责任心去 Lead 或配合团队完成冲刺。良好的身心状态也是长期高产出的保障。

---

### 结语

高级工程师的面试，拼的不再是“API 的记忆量”，而是**对复杂度治理的审美**与**对底层原理的穿透力**。祝每一位热爱技术的开发者，都能找到属于自己的“星辰大海”。

```

```

---
title: HTML 的性能与资源加载
author: DBAAZzz
date: 2025/12/03 23:50
categories:
  - 面试
tags:
  - HTML
  - 性能优化
  - 资源加载
---

## src 与 href 的区别

### href

- **作用**：用于建立当前文档与外部资源的联系。

- **典型场景**：`<link href="style.css">`、`<a href="page.html">`。

- **加载行为**：
  1. **并行下载**：浏览器会并行下载 CSS，不会暂停 HTML 解析器构建 DOM 树。
  2. **渲染阻塞**：但在 CSSOM 构建完成前，浏览器不会进行渲染，以防止样式闪烁 (FOUC)
  3. **脚本阻塞**：如果在 CSS 后面紧跟 JavaScript，为了确保 JS 能操作最终的样式，浏览器会等待 CSS 加载完再执行 JS，这可能间接导致解析阻塞。

::: tip 提示
相比之下，`<a href>` 仅是超链接，不涉及上述的自动下载和阻塞行为。
:::

### src

- **作用**：用于替换当前元素，引入外部资源。

- **典型场景**：`<script src="script.js">`、`<img src="image.png">`、`<iframe src="page.html">`。

- **加载行为**
  - 对于 JS 脚本：默认情况下，`src` 确实会阻塞 HTML 解析，因为 JS 可能修改 DOM。这也是为什么推荐把脚本放底部或使用 `defer/async`
  - `src` 不会阻塞 HTML 解析。浏览器会并行下载这些资源，同时继续构建 DOM。图片下载完成后，会触发浏览器的重排或重绘，但绝不会让解析器停下来等待。

::: tip 总结
`href` 是引用（并行加载，不阻塞）

`src` 是替换（串行加载，阻塞渲染）。
:::

---

## script 的 defer 与 async

默认情况下，`<script>` 标签会阻塞 HTML 解析。为了优化性能，HTML5 提供了 `defer` 和 `async` 两个属性。

### 1. 执行时机对比

| 模式                  | HTML 解析 | 脚本下载 | 脚本执行                                        |
| :-------------------- | :-------- | :------- | :---------------------------------------------- |
| **`<script>`** (默认) | 停止      | 立即下载 | 下载完立即执行（阻塞 HTML）                     |
| **`<script async>`**  | 继续      | 并行下载 | 下载完立即执行（暂停 HTML 解析）                |
| **`<script defer>`**  | 继续      | 并行下载 | 等 HTML 全部解析完，`DOMContentLoaded` 之前执行 |

### 2. 核心区别

- **顺序性**：
  - `async`：**无序**。谁先下载完谁先执行。适合独立的脚本（如统计代码、广告）。
  - `defer`：**有序**。严格按照在 HTML 中出现的顺序执行。适合有依赖关系的脚本（如 jQuery 插件依赖 jQuery）。
- **最佳实践**：
  - 如果脚本不依赖其他脚本，也不被其他脚本依赖，用 `async`。
  - 如果脚本依赖 DOM 元素（需要操作 DOM），或者脚本之间有依赖关系，用 `defer`。
  - 现代前端工程（如 Webpack 打包）通常默认使用 `defer` 将脚本注入到 `<head>` 中。

---

## 资源预加载策略 (Resource Hints)

浏览器提供了一系列 `<link rel="...">` 属性，允许开发者手动控制资源的加载优先级。

### 1. dns-prefetch (DNS 预解析)

**作用**：在后台提前把域名解析成 IP 地址。

**场景**：页面中引用了大量第三方资源（如 CDN、统计代码、字体）。

```html
<link rel="dns-prefetch" href="//example.com" />
```

### 2. preconnect (预连接)

**作用**：提前完成 DNS 解析 + TCP 握手 + TLS 协商。比 `dns-prefetch` 更进一步。

**场景**：你确定页面稍后**一定**会请求该域名的资源（如 API 接口域名）。

```html
<link rel="preconnect" href="//api.example.com" crossorigin />
```

### 3. preload (预加载)

**作用**：告诉浏览器“这个资源非常重要，现在就去下载，别等解析到了再下载”。

**场景**：核心 CSS、首屏关键图片、字体文件。

**特点**：**高优先级**下载，下载完暂不执行，等真正用到时再执行。

```html
<link rel="preload" href="main.css" as="style" />
<link rel="preload" href="font.woff2" as="font" crossorigin />
```

### 4. prefetch (预获取)

**作用**：告诉浏览器“这个资源将来可能用到，空闲的时候下载一下”。

**场景**：用户下一步可能访问的页面的资源（如点击“下一页”后需要的 JS/CSS）。

**特点**：**低优先级**下载。

```html
<link rel="prefetch" href="next-page.js" />
```

---

## 图片优化

### 1. 图片懒加载 (Lazy Loading)

**原生方案 (推荐)**：
直接在 `<img>` 标签上添加 `loading="lazy"` 属性。

```html
<img src="large-image.jpg" loading="lazy" alt="Lazy Image" />
```

- **优点**：浏览器原生支持，无需 JS，性能最好。
- **缺点**：Safari 和旧版浏览器兼容性稍差（但会优雅降级为立即加载）。

**JS 方案 (IntersectionObserver)**：
使用 `IntersectionObserver` API 监听图片是否进入视口。

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // 将 data-src 替换为 src
      observer.unobserve(img);
    }
  });
});

document
  .querySelectorAll("img[data-src]")
  .forEach((img) => observer.observe(img));
```

### 2. 响应式图片

**srcset & sizes**：
根据屏幕宽度或像素密度（DPR）加载不同分辨率的图片。

```html
<!-- 根据屏幕宽度选择 -->
<img
  src="small.jpg"
  srcset="small.jpg 500w, medium.jpg 1000w, large.jpg 2000w"
  sizes="(max-width: 600px) 500px, 100vw"
  alt="Responsive Image"
/>

<!-- 根据 DPR 选择 (Retina 屏) -->
<img src="icon.png" srcset="icon.png 1x, icon-2x.png 2x" alt="Icon" />
```

**picture 标签**：
提供更强大的控制能力，可以根据媒体查询加载**不同格式**或**不同裁剪**的图片（Art Direction）。

```html
<picture>
  <!-- 优先加载 WebP 格式 -->
  <source srcset="image.webp" type="image/webp" />
  <!-- 屏幕小于 600px 加载 mobile.jpg -->
  <source srcset="mobile.jpg" media="(max-width: 600px)" />
  <!-- 兜底 -->
  <img src="desktop.jpg" alt="Art Direction" />
</picture>
```

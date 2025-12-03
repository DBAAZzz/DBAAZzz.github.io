---
title: iframe 的优缺点、通信机制及安全限制
author: DBAAZzz
date: 2025/12/03 23:45
categories:
  - 面试
tags:
  - HTML
  - iframe
  - 安全
  - 跨域
---

## iframe 是什么？

`iframe` (Inline Frame) 是 HTML 中的一个标签，允许你在当前的网页中嵌入另一个完整的网页。

简单来说，就是**画中画**。你的页面是主画面，`iframe` 是里面嵌着的一个小电视，播放着别人的频道。

## 优缺点分析

在现代前端开发中，`iframe` 的使用场景越来越少，但在某些特定领域（如微前端、广告、第三方插件）依然不可替代。

### 优点

1.  **天然的沙箱隔离 (Isolation)**：
    `iframe` 内部的 JS 变量、CSS 样式完全独立，不会污染父页面。这是它最大的优势。
2.  **引入第三方内容**：
    非常适合嵌入广告、地图、视频（YouTube/Bilibili）、富文本编辑器等不可控的第三方内容。
3.  **并行加载**：
    `iframe` 中的资源加载通常不会阻塞主页面的 `onload` 事件（除非处理不当），可以实现一种形式的并行加载。

### 缺点

1.  **性能开销大**：
    创建 `iframe` 比创建普通的 DOM 元素要昂贵得多。它需要独立的内存空间、渲染进程（在某些浏览器中）。
2.  **阻塞主页面加载**：
    虽然资源是并行的，但 `window.onload` 事件会等待所有 `iframe` 加载完毕才会触发。如果 `iframe` 很慢，用户会感觉整个页面一直在转圈。
    _解决办法_：用 JS 动态创建 `iframe` 或在 `onload` 之后加载。
3.  **SEO 不友好**：
    搜索引擎爬虫（Crawler）可能不会去抓取 `iframe` 内部的内容，或者无法将内部内容与主页面关联起来。
4.  **用户体验差**：
    - 滚动条混乱（页面里套个滚动条）。
    - 后退按钮失效（点击后退可能只是 `iframe` 后退了，主页面没动）。
    - 移动端适配困难。
    - 弹窗可能会被限制在 `iframe` 内部，无法覆盖全屏。

## 通信机制

面试重点：**父子页面如何传值？**

### 1. 跨域通信 (Cross-Origin) —— 标准方案

如果父页面和 `iframe` 不同源（域名、协议、端口任一不同），必须使用 `postMessage`。

**父页面发送：**

```javascript
const iframe = document.getElementById("myIframe");
// targetWindow.postMessage(message, targetOrigin)
iframe.contentWindow.postMessage(
  { type: "LOGIN_SUCCESS", token: "xxx" },
  "https://child.com"
);
```

**子页面接收：**

```javascript
window.addEventListener("message", (event) => {
  // 安全检查：必须验证消息来源！
  if (event.origin !== "https://parent.com") return;

  console.log("收到父页面消息:", event.data);

  // 回复父页面
  event.source.postMessage("收到啦", event.origin);
});
```

### 2. 同域通信 (Same-Origin)

如果两个页面同源，可以直接访问对方的 `window` 对象（不推荐，耦合度太高）。

- **父访子**：`document.getElementById('iframe').contentWindow.document`
- **子访父**：`window.parent.document`

## 安全限制

因为 `iframe` 可以嵌入别人的网站，所以存在很大的安全风险（如点击劫持）。

### 1. `sandbox` 属性 (前端控制)

给 `iframe` 加上 `sandbox` 属性，可以启用最严格的限制（禁止脚本、禁止表单、禁止弹窗等）。

```html
<!-- 启用沙箱，但允许运行脚本和同域请求 -->
<iframe src="demo.html" sandbox="allow-scripts allow-same-origin"></iframe>
```

常用值：

- (空值): 启用所有限制。
- `allow-scripts`: 允许执行 JS。
- `allow-forms`: 允许提交表单。
- `allow-same-origin`: 允许被视为同源（否则即使同域也被视为跨域）。
- `allow-top-navigation`: 允许修改父页面的 URL。

### 2. `X-Frame-Options` (后端控制)

这是一个 HTTP 响应头，用来告诉浏览器：**我的页面是否允许被嵌入到 iframe 中**。这是防止**点击劫持 (Clickjacking)** 的主要手段。

- `DENY`: 拒绝被任何页面嵌入（最安全）。
- `SAMEORIGIN`: 只允许同源的页面嵌入。
- `ALLOW-FROM uri`: 只允许指定域名嵌入（现代浏览器已废弃，改用 CSP）。

### 3. CSP (Content Security Policy)

更强大的安全策略，通过 `frame-ancestors` 指令控制谁能嵌入我。

```http
Content-Security-Policy: frame-ancestors 'self' https://trusted.com;
```

## 面试常见问题

**Q: 如何解决 iframe 阻塞 window.onload 的问题？**
A: 使用 JavaScript 动态创建 `iframe`，或者在主页面的 `load` 事件触发后再设置 `iframe` 的 `src`。

```javascript
window.addEventListener("load", () => {
  const iframe = document.createElement("iframe");
  iframe.src = "...";
  document.body.appendChild(iframe);
});
```

**Q: 什么是点击劫持 (Clickjacking)？如何防御？**
A: 攻击者将你的网页通过 `iframe` 嵌入到他们的恶意网站中，并设置透明度为 0（看不见），覆盖在诱导按钮上。用户以为在点恶意网站的按钮，实际点到了你网页上的“转账”或“关注”按钮。
**防御**：后端设置 `X-Frame-Options: DENY` 或 `SAMEORIGIN`。

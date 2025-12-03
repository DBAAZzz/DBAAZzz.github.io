---
title: Shadow DOM 与 Web Components 原理
author: DBAAZzz
date: 2025/12/03 23:30
categories:
  - 面试
tags:
  - HTML
  - CSS
  - Web Components
  - Shadow DOM
---

## 通俗理解：Shadow DOM 是什么？

如果把普通的 DOM 树比作一个**公共广场**，所有人（CSS 样式、JS 脚本）都可以在这里大声喧哗，互相干扰。

那么 **Shadow DOM** 就是广场上搭建的一个**隔音帐篷**。

- **外面听不到里面的声音**：帐篷里的样式（CSS）不会泄露到外面。
- **里面听不到外面的声音**：外面的全局样式通常也影响不到帐篷里面。
- **它依然在广场上**：它依附于某个 DOM 元素存在，但内部是一个独立的小世界。

在前端工程化出现之前，我们为了解决“CSS 样式冲突”这个问题，发明了 BEM 命名规范，后来又有了 CSS Modules 和 CSS-in-JS。而 **Shadow DOM 是浏览器原生提供的“样式隔离”方案**，它是 Web Components 标准的核心基石。

---

## 核心概念图解

要理解 Shadow DOM，只需要记住这三个角色：

1.  **Shadow Host（宿主）**：帐篷搭在谁身上？比如一个普通的 `<div id="app">`。
2.  **Shadow Tree（影子树）**：帐篷里面有什么？这里面的 DOM 结构对外部是隐藏的。
3.  **Shadow Root（根节点）**：帐篷的入口。

```javascript
// 1. 找个宿主 (Host)
const host = document.querySelector("#host");

// 2. 创建入口 (Root)
// mode: 'open' 意味着你可以通过 host.shadowRoot 找到这个入口
// mode: 'closed' 意味着入口是隐形的，外部无法访问（稍微安全点，但很少用）
const shadowRoot = host.attachShadow({ mode: "open" });

// 3. 往里面塞东西 (Tree)
shadowRoot.innerHTML = `
  <style>
    p { color: red; } /* 这个红色只在 Shadow DOM 内部生效！ */
  </style>
  <p>我是影子里的内容</p>
`;
```

---

## 为什么它很重要？（面试考点）

### 1. 真正的样式隔离 (Scoped CSS)

这是 Shadow DOM 最核心的价值。
在 Shadow DOM 内部写的 CSS，**绝对不会**影响到外部，通常也不会受外部影响。

- **组件库开发**：你写了一个 `<my-button>`，不用担心使用者的全局 CSS (`div { color: blue }`) 把你的按钮样式搞乱。
- **微前端 (Micro-frontends)**：在 `qiankun` 等微前端框架中，为了防止子应用之间的样式冲突，Shadow DOM 是一个非常理想的沙箱方案（尽管因为一些工程化问题，目前主流方案还是 CSS Scoping 或动态样式表）。

### 2. 事件重定向 (Event Retargeting)

为了保护内部细节，当 Shadow DOM 内部的事件冒泡出来时，浏览器会**“撒谎”**。
在外部监听事件时，`event.target` 指向的是 **Shadow Host**（宿主元素），而不是内部具体的某个按钮。

**例子**：你点击了 `<video>` 播放器里的“播放按钮”，但对外部来说，浏览器只告诉你“你点击了 video 元素”，而不会暴露内部复杂的 DOM 结构。

---

## 进阶：如何“打破”隔离？

面试官可能会问：“如果我非要从外部修改 Shadow DOM 里的样式，怎么办？”

虽然 Shadow DOM 强调隔离，但也留了几个“后门”给开发者：

### 1. CSS 变量 (CSS Variables) —— 推荐方案

CSS 变量是可以**穿透** Shadow DOM 的。这是修改内部样式最优雅的方式。

```css
/* 外部定义 */
my-element {
  --main-color: blue;
}

/* 内部使用 */
p {
  color: var(--main-color, red); /* 如果外部没传，就用红色 */
}
```

### 2. `::part` 伪元素

组件开发者可以主动给内部元素打上 `part` 标记，允许外部通过 `::part()` 选择器来修改它。

```html
<!-- 内部 -->
<div part="title">标题</div>
```

```css
/* 外部 */
my-element::part(title) {
  font-weight: bold;
}
```

---

## 常见面试题 (Q&A)

### Q1: Web Components 和 React/Vue 组件有什么区别？

| 维度         | Web Components                                               | React / Vue 组件                                     |
| :----------- | :----------------------------------------------------------- | :--------------------------------------------------- |
| **本质**     | **浏览器原生标准** (W3C)。不依赖任何库，直接在浏览器跑。     | **JS 库的运行时抽象**。需要下载 React/Vue 库才能跑。 |
| **互操作性** | **极高**。可以在 React 里用，在 Vue 里用，在原生 HTML 里用。 | **低**。React 组件很难直接在 Vue 里用。              |
| **样式隔离** | **强隔离** (Shadow DOM)。                                    | **模拟隔离** (CSS Modules / Scoped CSS)。            |
| **数据驱动** | 比较原始，主要靠 `setAttribute` 和 DOM 事件。                | 拥有完善的 Props, State, Context 机制。              |

**总结**：Web Components 适合做**跨框架的通用 UI 组件库**（比如 Adobe 的 Spectrum, Google 的 Material Web Components），而 React/Vue 更适合做**业务应用开发**。

### Q2: 为什么 React 对 Web Components 支持不好？

这是一个历史遗留问题。
React 的事件系统（Synthetic Events）是自己搞了一套代理机制，挂载在 `document` 上。而 Shadow DOM 的**事件重定向**机制，会让 React 抓瞎，导致 React 经常捕获不到 Shadow DOM 内部的事件。
_注：React 19 已经大幅改进了对 Web Components 的支持。_

### Q3: `attachShadow({ mode: 'closed' })` 真的安全吗？

**不完全安全。**
虽然 `closed` 模式下 `host.shadowRoot` 返回 `null`，但这只是防君子不防小人。开发者依然可以通过劫持 `Element.prototype.attachShadow` 等原型链手段拿到引用。所以不要把敏感数据（比如密码）单纯依赖 Shadow DOM 来隐藏。

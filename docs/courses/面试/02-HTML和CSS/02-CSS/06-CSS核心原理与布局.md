---
title: CSS 核心原理与布局深度解析
author: DBAAZzz
date: 2025/12/04 00:40
categories:
  - 面试
tags:
  - CSS
---

# CSS 核心原理与布局深度解析

> 💡 **面试重点**：高级前端面试中，CSS 不再仅仅是考察“怎么写样式”，而是考察“这是如何工作的”以及“如何优化渲染性能”。重点关注渲染机制、重排重绘、BFC 机制以及复杂的布局计算。

## 一、BFC (块级格式化上下文)

**BFC (Block Formatting Context)** 是 Web 页面中盒模型布局的 CSS 渲染模式。它是一个独立的渲染区域，内部的元素渲染不会影响边界以外的元素。

### 1. 如何触发 BFC？

- 根元素 (`<html>`)。
- 浮动元素 (`float` 不为 `none`)。
- 绝对定位元素 (`position` 为 `absolute` 或 `fixed`)。
- `display` 为 `inline-block`, `table-cell`, `flow-root`, `flex` 或 `grid`。
- `overflow` 不为 `visible` (`hidden`, `auto`, `scroll`)。

### 2. BFC 的特性与应用场景

| 特性 / 现象                                                | 实际应用场景                                                                                   |
| :--------------------------------------------------------- | :--------------------------------------------------------------------------------------------- |
| **内部 Box 垂直排列**                                      | 标准流默认行为。                                                                               |
| **计算 BFC 高度时，浮动元素也参与计算**                    | **清除浮动**：解决父元素高度塌陷问题（给父元素加 `overflow: hidden` 或 `flow-root`）。         |
| **BFC 区域不会与 float box 重叠**                          | **自适应两栏布局**：左边 float，右边利用 `overflow: hidden` 触发 BFC，自动填满剩余空间。       |
| **属于同一个 BFC 的两个相邻 Box 的各类 margin 会发生重叠** | **防止 Margin 重叠**：将两个 p 元素分别放在不同的 BFC 容器中（虽然不常用，但利用了隔离特性）。 |

---

## 二、层叠上下文 (Stacking Context)

很多时候 `z-index` 不生效，都是因为不理解层叠上下文。

### 1. 层叠顺序 (Stacking Order)

当元素重叠时，浏览器按照以下顺序从下到上绘制：

1.  **Background & Borders** (背景和边框)
2.  **Negative z-index** (负 z-index)
3.  **Block Level Box** (块级盒, 文档流)
4.  **Float Box** (浮动盒)
5.  **Inline Box** (行内盒, text/inline)
6.  **z-index: auto / 0** (没有创建新层叠上下文的定位元素)
7.  **Positive z-index** (正 z-index)

### 2. 谁创建了层叠上下文？

不仅仅是 `position: relative/absolute` + `z-index`。以下属性也会创建新的上下文，**导致子元素的 z-index 只能在父级上下文内比较**：

- `opacity` 小于 1。
- `transform`, `filter`, `perspective` 不为 `none`。
- `will-change` (设定了任一属性)。
- `mix-blend-mode` 不为 `normal`。

> **经典 Bug**: 为什么我的 `z-index: 9999` 被覆盖了？
> **答**: 可能是因为父元素被某个 CSS 属性（如 `transform`）隐式创建了层叠上下文，且父元素的层级低于对方。

---

## 三、Flexbox 布局深入

### 1. Flex 属性简写

`flex` 是 `flex-grow`, `flex-shrink`, `flex-basis` 的缩写。

- **`flex: 1`** = `1 1 0%` (最常用：自动放大占满剩余空间)
- **`flex: auto`** = `1 1 auto` (根据内容大小分配，再放大)
- **`flex: none`** = `0 0 auto` (常用于固定宽度的侧边栏，防止被挤压)

### 2. `flex-basis` vs `width`

- `flex-basis` 优先级高于 `width`。
- 如果 `flex-basis: auto`，则参考 `width`。
- 如果 `flex-basis` 是具体数值，则忽略 `width`。

---

## 四、移动端适配核心

### 1. Viewport

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>
```

### 2. 1px 边框问题

**原因**: Retina 屏幕的 DPR (Device Pixel Ratio) > 1。

CSS 中的 `1px` 对应物理像素可能是 `2px` 或 `3px`，导致看起来边框变粗。

**解决方案**:

- **伪元素 + transform scale**:
  ```css
  .border-1px {
    position: relative;
  }
  .border-1px::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: #000;
    transform: scaleY(0.5); /* 针对 DPR=2 */
    transform-origin: 0 0;
  }
  ```

### 3. 刘海屏适配

使用 CSS 环境变量：

```css
padding-bottom: constant(safe-area-inset-bottom); /* iOS < 11.2 */
padding-bottom: env(safe-area-inset-bottom); /* iOS >= 11.2 */
```

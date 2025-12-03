---
title: 现代 CSS 特性：变量、函数与高级选择器
author: DBAAZzz
date: 2025/12/04 00:40
categories:
  - 面试
tags:
  - CSS
  - CSS Variables
  - 响应式设计
  - Dark Mode
---

## 1. CSS 变量 (Custom Properties)

CSS 变量（自定义属性）是现代 CSS 最强大的特性之一，它让 CSS 真正拥有了“编程”能力。

### 基础用法

变量名必须以 `--` 开头，使用 `var()` 函数读取。

```css
:root {
  /* 全局作用域 */
  --primary-color: #007bff;
  --spacing: 16px;
}

.card {
  /* 局部作用域：只在 .card 及其子元素内有效 */
  --card-bg: #fff;

  background: var(--card-bg);
  color: var(--primary-color);
  /* 提供默认值：如果 --text-color 未定义，使用 black */
  color: var(--text-color, black);
}
```

### 作用域与继承

CSS 变量遵循 CSS 的**层叠与继承**规则。

- **继承**：子元素会自动继承父元素的变量值。
- **覆盖**：在子元素中重新定义同名变量，会覆盖父元素的值（仅在该子元素范围内）。

### JS 交互

这是 CSS 变量相比 SASS 变量最大的优势：**可以被 JS 实时读取和修改**。

```javascript
const root = document.documentElement

// 读取
const color = getComputedStyle(root).getPropertyValue('--primary-color')

// 修改 (实现动态换肤的核心)
root.style.setProperty('--primary-color', 'red')
```

---

## 2. 强大的 CSS 函数

### `calc()`

用于动态计算。注意运算符前后**必须有空格**。

```css
/* 100% 宽度减去 20px */
width: calc(100% - 20px);
```

### `min()`, `max()`, `clamp()` (响应式三剑客)

这三个函数让响应式排版变得极其简单，甚至不需要媒体查询。

- **`min(a, b)`**：取最小值。
  - `width: min(500px, 100%)` -> 宽度最大 500px，但在小屏幕上是 100%。
- **`max(a, b)`**：取最大值。
  - `width: max(300px, 50%)` -> 宽度至少 300px。
- **`clamp(min, val, max)`**：区间限制。
  - `font-size: clamp(1rem, 2.5vw, 2rem)` -> 字体大小随视口变化，但最小 1rem，最大 2rem。

---

## 3. 伪类与伪元素的高级选择器

### `:is()` 与 `:where()`

用于简化长选择器列表。

```css
/* 传统写法 */
header h1,
header h2,
header h3,
footer h1,
footer h2,
footer h3 {
  ...;
}

/* :is() 写法 */
:is(header, footer) :is(h1, h2, h3) {
  ...;
}
```

**区别（面试考点）：**

- **`:is()`**：优先级取决于括号内**权重最高**的选择器。
- **`:where()`**：优先级**总是 0**。非常适合编写“可被轻易覆盖”的默认样式（如 Reset CSS 或组件库的基础样式）。

### `:not()`

否定伪类。

```css
/* 选中除了 .active 之外的所有 li */
li:not(.active) {
  opacity: 0.5;
}
```

### `:has()` (父选择器)

CSS 终于有了“父选择器”！虽然叫 `:has`，但它不仅能查子元素，还能查兄弟元素。

```css
/* 选中包含 img 的 a 标签 */
a:has(img) {
  border: 1px solid red;
}

/* 选中后面紧跟着 p 的 h1 */
h1:has(+ p) {
  margin-bottom: 0;
}
```

---

## 4. 深色模式适配 (Dark Mode)

使用媒体查询 `prefers-color-scheme` 可以检测用户的系统主题偏好。

### 最佳实践：结合 CSS 变量

```css
/* 1. 定义默认（浅色）变量 */
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
}

/* 2. 定义深色模式变量 */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
  }
}

/* 3. 应用变量 */
body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s; /* 切换时平滑过渡 */
}
```

这样，当用户切换系统主题时，网页会自动无缝切换，无需刷新。

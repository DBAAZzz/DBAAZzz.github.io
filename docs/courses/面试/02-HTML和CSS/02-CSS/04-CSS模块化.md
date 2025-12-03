---
title: CSS 模块化：CSS Modules 与 CSS-in-JS
author: DBAAZzz
date: 2025/12/04 00:35
categories:
  - 面试
tags:
  - CSS
  - 模块化
  - React
  - 工程化
---

## 为什么需要 CSS 模块化？

在 BEM 等命名规范出现之前，CSS 最大的痛点是 **全局作用域污染**。
你引入了一个第三方组件库，结果它的 `.active` 类名把你自己的 `.active` 样式给覆盖了。

为了彻底解决这个问题，工程化方案应运而生：**让 CSS 类名自动变成唯一的**，不再依赖人工约定。

---

## 1. CSS Modules

CSS Modules 不是一个官方标准，而是一种**构建步骤**（通常依赖 Webpack 或 Vite）。
它规定：**CSS 文件中的所有类名默认都是局部作用域的**。

### 原理

构建工具会将 CSS 类名编译成一个**哈希字符串**。

**源码 (style.css)：**

```css
.title {
  color: red;
}
```

**源码 (Component.js)：**

```javascript
import styles from './style.css'

// styles.title 对应编译后的哈希类名
element.innerHTML = `<h1 class="${styles.title}">Hello</h1>`
```

**编译结果 (HTML)：**

```html
<h1 class="style__title___3x9Y8">Hello</h1>
```

### 优点

1. **彻底解决命名冲突**：你只管写 `.title`，工具帮你生成唯一 ID。
2. **零运行时成本**：编译成标准的 CSS 文件，浏览器直接加载，性能和普通 CSS 一样好。
3. **代码复用**：可以通过 `composes` 关键字复用其他文件的样式。

### 缺点

1. **JS 引用繁琐**：必须用 `styles.className` 的方式引用，不能直接写字符串。
2. **驼峰命名限制**：为了方便 JS 调用，CSS 类名最好使用驼峰（`.headerTitle`），这违背了 CSS 习惯（`.header-title`）。

### 如何开启 CSS Modules？

**Vite (开箱即用)**

Vite 对 CSS Modules 提供了**零配置**支持。
只要你的样式文件以 `.module.css`（或 `.module.scss` / `.module.less`）结尾，Vite 就会自动将其视为 CSS Modules 处理。

```javascript
// Component.jsx
import styles from './index.module.css' // 自动识别为 Module
import './global.css' // 普通全局 CSS
```

**2. Webpack**

需要配置 `css-loader` 的 `modules` 选项。

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // 开启 CSS Modules
              modules: {
                auto: true, // 只有 .module.css 结尾的文件才启用
                localIdentName: '[name]__[local]--[hash:base64:5]', // 自定义类名格式
              },
            },
          },
        ],
      },
    ],
  },
}
```

---

## 2. CSS-in-JS

CSS-in-JS 是一个更激进的方案：**直接在 JavaScript 中写 CSS**。
代表库：**Styled-components** (React), **Emotion**, **JSS**。

### 核心思想

既然我们已经是组件化开发（React/Vue），HTML 和 JS 都在一个文件里，为什么 CSS 还要分开呢？
CSS-in-JS 将样式视为组件的一部分，实现了真正的“高内聚”。

### 代码示例 (Styled-components)

```javascript
import styled from 'styled-components'

// 创建一个带样式的 h1 组件
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  /* 动态样式：根据 props 改变颜色 */
  color: ${(props) => (props.primary ? 'palevioletred' : 'white')};
`

// 使用
;<Title primary>Hello World</Title>
```

### 优点

1. **动态样式能力**：这是最杀手级的特性。可以直接利用 JS 变量、Props、State 来控制样式，无需手动切换 class。
2. **组件级隔离**：样式和组件绑定，删除组件时，对应的样式自动“死亡”（Dead Code Elimination），不会有残留 CSS。
3. **关键 CSS (Critical CSS)**：自动提取当前页面渲染所需的 CSS，减少首屏加载体积。

### 缺点

1. **运行时开销 (Runtime Overhead)**：浏览器需要下载 JS -> 解析 JS -> JS 计算生成 CSS -> 插入 `<style>` 标签。这比直接加载 CSS 文件要慢。
2. **包体积增大**：需要引入运行时库（Styled-components 约 12KB）。
3. **学习成本**：需要适应在 JS 里写 CSS 的心智模型。

---

## 3. 终极对比：CSS Modules vs CSS-in-JS

| 维度         | CSS Modules                       | CSS-in-JS (Styled-components)             |
| :----------- | :-------------------------------- | :---------------------------------------- |
| **作用域**   | 局部作用域 (Hash 类名)            | 组件级作用域 (Hash 类名)                  |
| **写法**     | 独立的 `.css/.scss` 文件          | JS 文件中的模板字符串                     |
| **动态能力** | 弱 (依赖 class 切换或 CSS 变量)   | **强** (直接使用 JS 变量/Props)           |
| **性能**     | **高** (静态编译，浏览器原生解析) | 中 (有 JS 执行和注入开销)                 |
| **包体积**   | 小 (无运行时库)                   | 大 (包含运行时库)                         |
| **适用场景** | 追求性能、传统项目迁移、Vue 项目  | **重交互的 React 应用**、需要复杂动态主题 |

---

## 面试总结

**“你在项目中怎么选型？”**

- 如果是 **Vue 项目**：首选 **Scoped CSS**（Vue 内置方案，类似 CSS Modules），简单好用。
- 如果是 **React 项目**：
  - **B 端管理后台/复杂交互应用**：推荐 **CSS-in-JS (Emotion/Styled-components)**。开发体验极佳，动态能力强，性能损耗在 PC 端可忽略。
  - **C 端 H5/追求极致性能**：推荐 **CSS Modules** 或 **Tailwind CSS**（原子化 CSS）。避免 JS 运行时的性能开销。

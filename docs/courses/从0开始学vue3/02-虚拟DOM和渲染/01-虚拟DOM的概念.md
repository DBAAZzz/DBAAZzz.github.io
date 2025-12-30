---
title: 虚拟 DOM 的概念
author: DBAAZzz
date: 2025/12/29
categories:
  - vue3
tags:
  - virtual-dom
---

# 虚拟 DOM 的概念

## 1. 什么是虚拟 DOM (Virtual DOM)？

**定义**：
虚拟 DOM 本质上是一个 **JavaScript 对象**，它是对真实 DOM 的一层抽象描述。它通过对象属性来描述节点类型、属性、子节点等信息。

**代码对比**：

真实 DOM 结构：

```html
<div id="app" class="container">
  <h1>Hello Vue 3</h1>
</div>
```

对应的虚拟 DOM (VNode) 大致结构：

```javascript
const vnode = {
  type: "div",
  props: {
    id: "app",
    class: "container",
  },
  children: [
    {
      type: "h1",
      children: "Hello Vue 3",
    },
  ],
};
```

---

## 2. 为什么需要虚拟 DOM？

很多开发者误以为虚拟 DOM 一定比真实 DOM 快，这其实是不准确的。

我们需要从多个维度来解释它的价值：

### 2.1 声明式编程与开发效率 (最主要原因)

- **解放生产力**：传统 jQuery 时代我们需要手动操作 DOM（命令式），容易出错且难以维护。
- **数据驱动**：Vue 通过虚拟 DOM 帮我们处理了视图更新的脏活累活，开发者只需关注 `状态（State）`的变化，无需关心 DOM 操作细节。

### 2.2 跨平台能力 (Cross-Platform)

- 由于 VNode 只是一个 JS 对象，它不依赖于浏览器环境。
- 这也使得 Vue 可以运行在非浏览器环境中，例如：
  - **服务端渲染 (SSR)**：直接将 VNode 序列化为 HTML 字符串。
  - **原生应用 (Weex/Uni-app)**：将 VNode 映射为原生移动端组件。
  - **Canvas/WebGL**：渲染到图形引擎。

### 2.3 性能保障

- **下限保障**：在不进行任何手动优化的情况下，虚拟 DOM 能提供不错的性能表现。
- **批量更新**：通过 Diff 算法和批量更新机制，减少因为频繁数据变化导致的每一次重排（Reflow）和重绘（Repaint）。

  它会把多次变更合并成一次 DOM 更新。

:::tip
**注意**：首次渲染时，虚拟 DOM 因为多了一层计算，通常比直接操作 DOM 慢。它的优势在于**频繁更新**的大量数据场景。
:::

---

## 3. 工作原理简述

1.  **编译 (Compile)**：Vue 模板被编译成**渲染函数 (Render Function)**。
2.  **挂载 (Mount)**：运行时执行渲染函数，生成虚拟 DOM 树，并转化为真实 DOM 挂载。
3.  **更新 (Patch)**：当响应式数据发生变化时，触发更新，生成新的虚拟 DOM 树。
4.  **对比 (Diff)**：新旧虚拟 DOM 树进行对比，计算出最小变更集。
5.  **渲染 (Renderer)**：将变更应用到真实 DOM 上。

---

## 4. Vue 3 对虚拟 DOM 的优化

面试官可能会问："Vue 3 相比 Vue 2 在虚拟 DOM 上做了哪些优化？"

1.  **静态提升 (Static Hoisting)**：

    - 对于静态的（不会变的）节点，Vue 3 会将其提升到渲染函数之外，只创建一次，后续更新直接复用，不再参与 Diff。

2.  **Patch Flags (靶向更新)**：

    - 编译时分析节点，通过位运算标记节点是动态文本、动态 Class 还是动态 Style。
    - Diff 时只对比有标记的动态部分，跳过完全静态的节点。

3.  **Block Tree**：
    - 通过 Block 收集动态节点，将树形结构的 Diff 拍平成数组结构的遍历，大大提升了对比性能。

---

## 5. 总结 (一句话回答)

虚拟 DOM 是用 JS 对象描述真实 DOM 的技术，它让我们能以**声明式**的方式开发，提供了**跨平台**的能力，并通过**Diff 算法**保证了在复杂场景下更新视图的性能下限。

Vue 3 进一步通过**编译时优化**（如 PatchFlags）极大提升了虚拟 DOM 的 Diff 效率。

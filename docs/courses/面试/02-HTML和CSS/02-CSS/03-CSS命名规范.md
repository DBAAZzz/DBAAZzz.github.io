---
title: CSS 命名规范：BEM, OOCSS, SMACSS
author: DBAAZzz
date: 2025/12/04 00:30
categories:
  - 面试
tags:
  - CSS
  - BEM
  - 架构设计
---

## 为什么 CSS 需要命名规范？

CSS 是一门“全局作用域”的语言。在大型项目中，如果不遵守一定的命名规范，很容易出现以下灾难：

1. **样式冲突**：你写了个 `.title`，同事也写了个 `.title`，结果互相覆盖。
2. **特异性权重地狱**：为了覆盖样式，不得不写出 `.header .nav ul li a.active` 这样又长又臭的选择器，最后甚至加上 `!important`。
3. **难以维护**：看到 `.box` 这个类名，完全不知道它是干嘛的，也不敢删。

为了解决这些问题，业界诞生了多种 CSS 架构思想，其中最著名的是 BEM。

---

## 1. BEM (Block Element Modifier) —— 业界标准

BEM 是目前最流行、最实用的 CSS 命名方法论。它的核心思想是把 UI 拆分成独立的**块 (Block)**。

### 语法规则

`block__element--modifier`

- **Block (块)**：独立的、有意义的组件实体。
  - 例如：`.header`, `.menu`, `.button`
- **Element (元素)**：块的一部分，没有独立的意义，必须依赖于块。
  - 连接符：双下划线 `__`
  - 例如：`.menu__item`, `.header__logo`
- **Modifier (修饰符)**：块或元素的状态、外观或行为的变体。
  - 连接符：双中划线 `--`
  - 例如：`.button--primary`, `.menu__item--active`

### 代码示例

```html
<!-- 这是一个标准的 BEM 结构 -->
<form class="search-form">
  <!-- Block: search-form -->

  <div class="search-form__content">
    <!-- Element: content -->

    <input class="search-form__input" />
    <!-- Element: input -->

    <button class="search-form__button search-form__button--primary">
      <!-- Element: button + Modifier: primary -->
      搜索
    </button>
  </div>
</form>
```

```scss
/* SASS 写法非常舒服 */
.search-form {
  &__input { ... }
  &__button {
    &--primary { ... }
  }
}
```

### BEM 的优点

1.  **扁平化**：通常只需要一个类名就能选中元素，避免了深层嵌套，渲染性能好。
2.  **自解释**：看到 `.news-list__item--featured`，不用看 HTML 就知道它是“新闻列表”里的“条目”，且是“推荐”状态。
3.  **隔离性**：虽然 CSS 还是全局的，但通过唯一的 Block 前缀，人为实现了“软隔离”。

---

## 2. OOCSS (Object Oriented CSS) —— 面向对象

OOCSS 的核心思想是**分离**。它不规定具体的命名格式，而是强调一种设计原则。

### 两大原则

1.  **结构与皮肤分离 (Separate Structure and Skin)**

    - 不要把布局样式（宽、高、padding）和视觉样式（颜色、背景、阴影）写在一起。
    - _例子_：把 `.button` (结构) 和 `.btn-red` (皮肤) 分开，这样 `.btn-red` 就可以复用到其他元素上。

2.  **容器与内容分离 (Separate Container and Content)**
    - 尽量避免使用后代选择器（如 `.sidebar h3`），因为这让 `h3` 依赖于 `.sidebar`。
    - 应该给 `h3` 一个独立的类名（如 `.sidebar-title`），这样它就可以在任何地方使用。

### 常用库体现

Bootstrap 就是 OOCSS 的典型代表：

```html
<button class="btn btn-primary btn-lg">Click me</button>
```

- `btn`: 基础结构
- `btn-primary`: 皮肤颜色
- `btn-lg`: 尺寸修饰

---

## 3. SMACSS (Scalable and Modular Architecture for CSS)

SMACSS 更多的是一种**文件组织结构**的规范。它把 CSS 分为五大类：

1.  **Base (基础)**：重置浏览器默认样式（Reset/Normalize），设置 HTML 标签的默认样式（`h1`, `a`, `body`）。
2.  **Layout (布局)**：页面大的布局区域，通常用 ID 或 `l-` 前缀（如 `#header`, `.l-grid`）。
3.  **Module (模块)**：可复用的组件（如 `.card`, `.btn`）。这是项目中最多的部分，类似 BEM 的 Block。
4.  **State (状态)**：描述模块在特定状态下的外观，通常用 `is-` 前缀（如 `.is-active`, `.is-hidden`）。
5.  **Theme (主题)**：可选，用于定义皮肤（如夜间模式）。

---

## 总结与对比

| 规范       | 核心思想                   | 关键词                   | 适用场景                                     |
| :--------- | :------------------------- | :----------------------- | :------------------------------------------- |
| **BEM**    | **组件化**，严格的命名格式 | `__` (元素), `--` (修饰) | **绝大多数现代项目**。特别是配合 SASS 使用。 |
| **OOCSS**  | **复用**，结构与样式分离   | 组合类名 (原子类的前身)  | 基础组件库开发，追求极致复用。               |
| **SMACSS** | **分类**，文件组织架构     | Base, Layout, Module...  | 大型项目的目录结构规划。                     |

**面试回答策略：**
“在实际开发中，我们通常会**混合使用**。以 **BEM** 为主作为命名规范（解决命名冲突和关联性），吸取 **OOCSS** 的‘结构皮肤分离’思想来编写公共工具类（Utility Classes），并参考 **SMACSS** 来组织项目的目录结构。”

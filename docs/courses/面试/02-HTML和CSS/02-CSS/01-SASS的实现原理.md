---
title: SASS 的实现原理
author: DBAAZzz
date: 2025/12/04 00:20
categories:
  - 面试
tags:
  - CSS
  - SASS
  - 编译原理
---

## SASS 是什么？

SASS (Syntactically Awesome Style Sheets) 是一种 **CSS 预处理器**。

简单来说，浏览器只认识 CSS，不认识 SASS。SASS 就像是一个“高级语言”，允许你使用变量、嵌套、函数、继承等编程特性来写样式。写完后，需要一个**编译器**（Compiler）把它“翻译”成标准的 CSS，浏览器才能看懂。

## 核心实现原理：编译过程

SASS 的工作原理本质上就是一个**编译器**的工作流程。它把 `.scss` 或 `.sass` 文件当作源代码，经过一系列处理，输出 `.css` 文件。

这个过程主要分为三个阶段：

### 1. 解析 (Parsing)

编译器读取你的代码，进行词法分析和语法分析。

- **词法分析**：把代码拆成一个个最小的单位（Token），比如变量名 `$color`、冒号 `:`、大括号 `{` 等。
- **语法分析**：根据语法规则，把这些 Token 组装成一棵**抽象语法树 (AST)**。AST 是代码的树状结构表示，比如“这是一个嵌套规则，里面有一个属性声明”。

### 2. 转换 (Transformation)

这是 SASS 发挥魔法的地方。编译器遍历 AST，处理各种 SASS 特有的特性：

- **变量替换**：遇到 `$primary-color`，就去查找它的值，替换成 `#ff0000`。
- **嵌套展开**：遇到嵌套结构，就把它拆解成扁平的 CSS 选择器。比如 `.nav { .item {} }` 转换成 `.nav .item {}`。
- **Mixin 注入**：遇到 `@include`，就把对应的 Mixin 代码块复制过来。
- **运算**：遇到 `10px + 20px`，就计算出 `30px`。

### 3. 生成 (Code Generation)

把处理好的 AST 重新转换成字符串形式的 CSS 代码，并格式化（压缩或美化），最后输出文件。

---

## 关键特性的实现细节

### 1. 嵌套 (Nesting) 与 父选择器 (&)

SASS 最常用的功能。编译器在处理嵌套时，本质上是在做**字符串拼接**。

**源码：**

```scss
.card {
  color: black;
  &:hover {
    color: red;
  }
  .title {
    font-size: 16px;
  }
}
```

**编译逻辑：**

1. 记录当前父选择器是 `.card`。
2. 遇到 `&`，直接用 `.card` 替换 `&` -> 得到 `.card:hover`。
3. 遇到 `.title`，默认用空格连接 -> 得到 `.card .title`。

### 2. 变量 (Variables) 与 作用域

SASS 的变量是有**作用域 (Scope)** 的。
编译器内部维护了一个**环境栈 (Environment Stack)**。

- 当定义变量时，存入当前环境。
- 当使用变量时，先在当前环境找；找不到就去父环境找（类似 JS 的原型链）。

```scss
$color: red; // 全局作用域

.box {
  $width: 100px; // 局部作用域
  width: $width; // 查找到局部变量 -> 100px
  color: $color; // 局部没找到，向上查找 -> red
}
```

### 3. Mixin vs Extend (面试常考)

它们都能复用代码，但**编译结果**截然不同。

- **Mixin (`@include`)**：**复制粘贴**。
  编译器把 Mixin 里的代码**拷贝**到每一个引用的地方。

  - _优点_：可以传参，灵活。
  - _缺点_：如果大量使用，生成的 CSS 体积会变大（代码冗余）。

- **Extend (`@extend`)**：**选择器分组**。
  编译器会把当前选择器**挂载**到被继承的选择器后面。
  - _优点_：生成的 CSS 代码少，复用率高。
  - _缺点_：不能传参；容易破坏选择器顺序，导致样式覆盖问题（这也是为什么现在的最佳实践通常不推荐滥用 `@extend`）。

**对比图解：**

```scss
// 源码
%btn {
  padding: 10px;
}
.btn-a {
  @extend %btn;
}
.btn-b {
  @extend %btn;
}

@mixin card {
  background: #fff;
}
.card-a {
  @include card;
}
.card-b {
  @include card;
}
```

**编译后：**

```css
/* Extend 结果：合并选择器 */
.btn-a,
.btn-b {
  padding: 10px;
}

/* Mixin 结果：代码复制 */
.card-a {
  background: #fff;
}
.card-b {
  background: #fff;
}
```

---

## Dart Sass vs Node Sass

面试中可能会问到 SASS 的版本问题。

- **Node Sass (LibSass)**：
  - 基于 C++ 实现，通过 Node.js 绑定调用。
  - _缺点_：安装极其痛苦（经常因为网络或编译环境报错），且官方已停止维护。
- **Dart Sass**：
  - SASS 的**官方主要实现**，基于 Dart 语言编写，编译成纯 JS 运行。
  - _优点_：安装简单（纯 JS 依赖），功能最新（支持 `@use`, `@forward` 模块化语法）。
  - _现状_：**现在的新项目请无脑选 Dart Sass (`sass` 包)。**

---

## 面试常见问题

**Q: SASS 中的 `@import` 和 CSS 原生的 `@import` 有什么区别？**

- **SASS `@import`**：**编译时合并**。编译器会把被引入的文件内容直接**插入**到当前位置，最终生成一个 CSS 文件。减少了 HTTP 请求。
- **CSS `@import`**：**运行时加载**。浏览器解析到这行代码时，才会发起新的网络请求去下载 CSS。会阻塞渲染，增加请求数，通常**不推荐使用**。
- _注：SASS 官方正在逐步废弃 `@import`，推荐使用新的模块化系统 `@use`。_

**Q: 什么时候用 Mixin，什么时候用 Extend？**

- 需要**传参数**（动态生成样式）时，必须用 **Mixin**。
- 样式是**静态的**，且希望**减少 CSS 体积**时，可以用 **Extend**。
- _最佳实践_：大部分情况下优先使用 **Mixin**（gzip 压缩后体积差异其实不大），因为 Mixin 的依赖关系更清晰，不容易产生副作用。

**Q: 如何在 SASS 中使用 JS 变量？**

SASS 是编译时运行，JS 是运行时运行，两者无法直接通信。
但可以通过 **CSS Modules** (Webpack) 或 **CSS Variables** (CSS 自定义属性) 作为桥梁。

- **推荐方案**：SASS 中定义 CSS 变量，JS 通过 `style.setProperty` 修改变量值。

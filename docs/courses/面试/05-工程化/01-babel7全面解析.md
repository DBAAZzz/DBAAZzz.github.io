---
title: Babel 7 全面解析
author: DBAAZzz
date: 2025/12/21 16:15
categories:
  - 面试
tags:
  - babel
  - 工程化
---

## 1. Babel 是什么？

Babel 是一个 JavaScript 编译器。主要用于将 ECMAScript 2015+ (ES6+) 版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。

Babel 的主要功能包括：

1.  **语法转换**：将箭头函数、解构赋值、Class 等新语法转换为 ES5。
2.  **Polyfill（垫片）**：通过引入 Polyfill 也就是代码填充，来支持新 API（如 Promise，Array.from，Set，Map 等）。
3.  **源码转换**：比如 JSX (React)，Flow，TypeScript 等非标准 JS 代码的转换。

## 2. Babel 的工作原理 (面试重点)

Babel 的处理流程分为三个阶段：**解析 (Parse)** -> **转换 (Transform)** -> **生成 (Generate)**。

1. **解析 (Parse)**：将代码字符串解析成抽象语法树 (AST)。
   - **词法分析 (Lexical Analysis)**：将代码分割成 token 流（语法单元）。
   - **语法分析 (Syntax Analysis)**：将 token 流分析成 AST。
   - 使用的包：`@babel/parser` (原 babylon)。
2. **转换 (Transform)**：遍历 AST，根据配置的插件（Plugins）或预设（Presets）对 AST 节点进行增删改操作。
   - 这是 Babel 最核心的部分，插件就在这里工作。
   - 使用的包：`@babel/traverse` (用于遍历和维护 AST 状态)， `@babel/types` (用于判断和构建 AST 节点)。
3. **生成 (Generate)**：将修改后的 AST 转换回字符串形式的 Code，同时生成 SourceMap。
   - 使用的包：`@babel/generator`。

## 3. 核心包与概念

### 3.1 @babel/core

核心库，提供了 Babel 的编译 API（如 `transform`），整合了 parser， traverse， generator。如果不安装在这个包，Babel 无法工作。

```bash
npm install --save-dev @babel/core
```

### 3.2 @babel/cli & @babel/node

- `@babel/cli`: 命令行工具，允许在终端使用 `babel` 命令进行文件编译。
- `@babel/node`: 提供 `babel-node` 命令，可以直接运行 ES6+ 代码（类似于 node 命令，但支持实时编译）。**注意：`babel-node` 性能较差，不建议在生产环境使用，只适合开发调试。**

### 3.3 插件 (Plugin) 与 预设 (Preset)

- **插件 (Plugin)**：Babel 本身（Parser -> Generator）不进行任何转换，转换功能完全由插件完成。
  - **语法插件**：只开启解析新语法的能力 (如 `@babel/plugin-syntax-dynamic-import`)。
  - **转换插件**：进行代码转换 (如 `@babel/plugin-transform-arrow-functions`)，通常开启了转换插件会自动开启对应的语法插件。
- **预设 (Preset)**：插件的集合。为了避免开发者一个个配置几十个插件，Babel 提供了预设。
  - `@babel/preset-env`: 最常用的预设，智能化编译 ES6+ 语法。
  - `@babel/preset-react`: 编译 React/JSX。
  - `@babel/preset-typescript`: 编译 TS。

**执行顺序 (面试点)**：

1.  **Plugins** 在 **Presets** 之前执行。
2.  **Plugins** 从前向后执行 (Array order)。
3.  **Presets** 从后向前执行 (Array reverse order)。

## 4. 深度配置与 Polyfill 方案

这是 Babel 配置中最容易混乱的地方。目标是：**既兼容旧浏览器，又保持包体积最小。**

### 4.1 @babel/preset-env

它能根据 `browserslist` (如 `.browserslistrc` 文件) 配置的目标环境，自动决定应用哪些转换插件。

**推荐配置**：

```bash
# .browserslistrc
> 0.25%
not dead
```

### 4.2 Polyfill 的两种主流方案

众所周知，`@babel/preset-env` 默认只转换新的 **JavaScript 语法**（Syntax），如箭头函数， `const/let`， `class`。但它不会转换新的 **API**（Built-in），如 `Promise`， `Set`， `Symbol`， `Array.from`， `[].includes`。

这时候就需要 Polyfill。

#### 方案一：`@babel/preset-env` + `useBuiltIns: "usage"` + `core-js`

这是目前**业务项目**推荐的方案。

- **useBuiltIns: "usage"**：按需引入。Babel 会扫描你的代码，自动在每个文件中引入你用到的且目标浏览器不支持的 `core-js` 模块。
- **corejs**: 指定 core-js 的版本（推荐 v3，因为 v2 已经停止维护且不再添加新特性）。

```javascript
// babel.config.js / .babelrc
{
  "presets": [
    [
      "@babel/preset-env"，
      {
        "useBuiltIns": "usage"， // 核心配置：按需注入
        "corejs": 3，            // 核心配置：指定版本
        // "targets": "> 0.25%， not dead" // 也可以在此处配置 targets
      }
    ]
  ]
}
```

**优点**：按需加载，体积小。
**缺点**：Polyfill 会污染全局作用域（例如修改 `Array.prototype.includes`），如果开发组件库可能会影响使用者的环境。

#### 方案二：`@babel/plugin-transform-runtime`

这是**开发类库/工具库**推荐的方案。

它通过辅助函数（Helper）的模块化复用，以及沙盒垫片（Sandboxed Polyfill）来解决问题。

- **助手函数复用**：Babel 转换代码时会生成很多辅助函数（如 `_classCallCheck`），默认每个文件都会生成一份。此插件让它们引用 `@babel/runtime` 中的库文件，减少体积。
- **沙盒环境**：配合 `corejs: 3` 选项，它会将 Promise， Set 等 API 转换为引用局部变量，而不是修改全局对象，从而**避免全局污染**。

```javascript
// 安装依赖
// npm install --save-dev @babel/plugin-transform-runtime
// npm install --save @babel/runtime @babel/runtime-corejs3

// .babelrc
{
  "presets": ["@babel/preset-env"]，
  "plugins": [
    [
      "@babel/plugin-transform-runtime"，
      {
        "corejs": 3 // 开启沙盒模式，避免全局污染
      }
    ]
  ]
}
```

**优点**：不污染全局，适合写库。
**缺点**：实例方法（如 `[1，2，3].includes(1)`）在旧版本中可能因为无法修改原型链而需要更复杂的转换 (core-js 3 已改进此问题，但仍比全局 polyfill 稍微复杂)。

### 总结

- **开发业务应用 (App)**：使用 `@babel/preset-env` + `useBuiltIns: "usage"`。因为应用是可以确定运行环境的，污染全局也没关系。
- **开发类库 (Library)**：使用 `@babel/plugin-transform-runtime`。避免污染使用者的环境。

## 5. 如何开发一个 Babel 插件

Babel 插件本质上是一个函数，返回一个包含 visitor 对象的对象。Visitor 使用访问者模式，定义了遇到特定 AST 节点时如何处理。

**示例：实现一个移除所有 `console.log` 的插件**

```javascript
// my-plugin.js
module.exports = function ({ types: t }) {
  return {
    visitor: {
      // 访问调用表达式 (CallExpression)
      CallExpression(path) {
        // 判断 callee 是否是 console.log
        // 这里的逻辑简化示意，实际需要更严谨的判断
        const callee = path.get("callee");
        if (callee.isMemberExpression()) {
          const object = callee.get("object");
          const property = callee.get("property");

          if (
            object.isIdentifier({ name: "console" }) &&
            property.isIdentifier({ name: "log" })
          ) {
            // 移除该节点
            path.remove();
          }
        }
      }，
    }，
  };
};
```

## 6. Babel 7 vs Babel 6 的主要区别

1.  **npm 包名变更**：从 `babel-core` 变为 `@babel/core`，`babel-preset-env` 变为 `@babel/preset-env`。所有核心包都放到了 `@babel` scope 下。
2.  **不再支持 Node.js 6 以前的版本**。
3.  **配置文件变化**：新增 `babel.config.js`（项目级别配置，支持 Monorepo），`.babelrc` 依然支持（文件级别配置）。
4.  **Preset 变更**：废弃了 `stage-x` 预设 (如 `preset-stage-0`)，建议手动安装需要的 proposal 插件。废弃了 `es2015`， `es2016` 等年度预设，统一使用 `preset-env`。

## 7. 常见面试题总结

1.  **Babel 的原理是什么？**
    - 解析 (Parse) [Parser] -> 转换 (Transform) [Traverse] -> 生成 (Generate) [Generator]。
2.  **`babel-polyfill` 和 `babel-runtime` 的区别？**
    - `babel-polyfill` (现推荐 preset-env usage) 会修改全局对象，适合业务开发。
    - `babel-runtime` (配合 plugin-transform-runtime) 封装局部变量，不污染全局，适合组件库开发。
3.  **AST 是什么？有什么应用？**
    - 抽象语法树。应用：代码编译 (Babel)， 代码格式化 (Prettier)， 代码检查 (ESLint)， CSS 预处理， 代码压缩。

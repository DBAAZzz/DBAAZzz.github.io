---
title: Babel Template 与 Generator
author: DBAAZzz
date: 2025/12/28 22:23
categories:
  - 面试
tags:
  - babel
  - 工程化
---

在 Babel 插件开发中，除了 `@babel/types` 和 `@babel/traverse`，还有两个重要的工具：`@babel/template` 和 `@babel/generator`。

它们分别解决了"快速生成 AST"和"AST 转回代码"的问题。

## 1. @babel/template：代码模板生成器

### 为什么需要 Template？

在编写插件时，我们经常需要创建复杂的 AST 节点。如果用 `@babel/types` 手动构建，代码会非常冗长。

**对比示例**：创建 `const a = 1;`

```javascript
// ❌ 使用 types 手动构建（繁琐）
const ast = t.variableDeclaration("const", [
  t.variableDeclarator(t.identifier("a"), t.numericLiteral(1)),
]);

// ✅ 使用 template（简洁）
const buildConst = template(`const a = 1;`);
const ast = buildConst();
```

### 核心 API

| API                         | 描述                          | 示例                                 |
| :-------------------------- | :---------------------------- | :----------------------------------- |
| `template(code)`            | 将代码字符串解析为 AST 生成器 | `template('const a = 1;')()`         |
| `template.statement(code)`  | 生成语句节点                  | `template.statement('return x;')()`  |
| `template.expression(code)` | 生成表达式节点                | `template.expression('a + b')()`     |
| `template.program(code)`    | 生成完整程序节点              | `template.program('const a = 1;')()` |

### 使用占位符

Template 最强大的功能是支持**占位符**，可以动态插入变量。

```javascript
const template = require("@babel/template").default;
const t = require("@babel/types");

// 使用 %%name%% 作为占位符
const buildRequire = template(`
  const %%importName%% = require(%%source%%);
`);

// 传入实际的 AST 节点
const ast = buildRequire({
  importName: t.identifier("myModule"),
  source: t.stringLiteral("./utils"),
});

// 生成的代码：const myModule = require('./utils');
```

### 实战：转换 import 为 require

这是一个常见的面试题和实际需求。

```javascript
module.exports = function (api) {
  const { types: t, template } = api;

  // 定义模板
  const buildRequire = template(`
    const %%importName%% = require(%%source%%);
  `);

  return {
    visitor: {
      ImportDeclaration(path) {
        const { specifiers, source } = path.node;

        // 只处理默认导入：import foo from 'bar'
        if (
          specifiers.length === 1 &&
          t.isImportDefaultSpecifier(specifiers[0])
        ) {
          const importName = specifiers[0].local;

          // 使用模板生成新节点
          const requireNode = buildRequire({
            importName,
            source,
          });

          // 替换原节点
          path.replaceWith(requireNode);
        }
      },
    },
  };
};
```

**转换效果**：

```javascript
// 输入
import React from "react";

// 输出
const React = require("react");
```

---

## 2. @babel/generator：AST 转代码

### 作用

`@babel/generator` 负责将 AST 转换回 JavaScript 代码字符串。这是 Babel 编译流程的最后一步。

### 完整的编译流程

```javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const t = require("@babel/types");

// 1. Parse：代码 -> AST
const code = `const a = 1;`;
const ast = parser.parse(code);

// 2. Transform：修改 AST
traverse(ast, {
  NumericLiteral(path) {
    // 将所有数字改为 42
    path.node.value = 42;
  },
});

// 3. Generate：AST -> 代码
const output = generator(
  ast,
  {
    /* options */
  },
  code
);

console.log(output.code); // const a = 42;
```

### Generator 选项

| 选项          | 描述                     | 默认值   |
| :------------ | :----------------------- | :------- |
| `sourceMaps`  | 是否生成 source map      | `false`  |
| `compact`     | 是否压缩代码（去除空格） | `"auto"` |
| `comments`    | 是否保留注释             | `true`   |
| `minified`    | 是否最小化输出           | `false`  |
| `retainLines` | 是否保持原始行号         | `false`  |

**示例**：

```javascript
const output = generator(
  ast,
  {
    compact: false, // 不压缩
    comments: true, // 保留注释
    sourceMaps: true, // 生成 source map
  },
  code
);

console.log(output.code); // 生成的代码
console.log(output.map); // source map 对象
```

---

## 3. 三者配合：完整示例

### 需求：将箭头函数转换为普通函数

```javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const template = require("@babel/template").default;
const t = require("@babel/types");

const code = `const add = (a, b) => a + b;`;

// 1. 解析
const ast = parser.parse(code);

// 2. 定义转换模板
const buildFunction = template(`
  function %%name%%(%%params%%) {
    return %%body%%;
  }
`);

// 3. 遍历并转换
traverse(ast, {
  VariableDeclarator(path) {
    const { id, init } = path.node;

    // 检查是否是箭头函数
    if (t.isArrowFunctionExpression(init)) {
      const { params, body } = init;

      // 使用模板生成普通函数
      const funcDeclaration = buildFunction({
        name: id,
        params: params,
        body: t.isBlockStatement(body) ? body.body : body,
      });

      // 替换整个变量声明
      path.parentPath.replaceWith(funcDeclaration);
    }
  },
});

// 4. 生成代码
const output = generator(ast, {}, code);
console.log(output.code);
// 输出：function add(a, b) { return a + b; }
```

---

## 4. 面试常见问题

### Q1: Template 和 Types 的区别是什么？什么时候用哪个？

- **Types**：适合创建**简单、单一**的节点（如 `t.identifier('a')`）。
- **Template**：适合创建**复杂、多层嵌套**的代码结构（如整个函数、语句块）。
- **原则**：能用 Template 就用 Template，代码更清晰。

### Q2: Generator 在 Babel 插件中需要手动调用吗？

**不需要**。在编写插件时，你只需要修改 AST，Babel Core 会自动调用 Generator。

只有在**独立使用 Babel 工具链**（不通过 `@babel/core`）时，才需要手动调用。

### Q3: 如何保证生成的代码格式良好？

使用 Generator 的 `compact: false` 选项，或者在生成后使用 Prettier 等格式化工具。

### Q4: Template 占位符有哪些写法？

```javascript
// 1. %%name%% - 标识符占位符
template(`const %%name%% = 1;`)({ name: t.identifier("foo") });

// 2. %%expression%% - 表达式占位符
template(`console.log(%%expr%%);`)({ expr: t.numericLiteral(42) });

// 3. 直接使用变量名（推荐）
template(`const NAME = VALUE;`)({
  NAME: t.identifier("foo"),
  VALUE: t.numericLiteral(1),
});
```

---

## 5. 总结

| 工具                 | 作用               | 使用场景                               |
| :------------------- | :----------------- | :------------------------------------- |
| **@babel/parser**    | 代码 → AST         | 独立解析代码（插件中由 Core 自动完成） |
| **@babel/types**     | 创建/验证 AST 节点 | 创建简单节点、类型检查                 |
| **@babel/template**  | 代码模板 → AST     | 快速生成复杂 AST 结构                  |
| **@babel/traverse**  | 遍历 AST           | 查找和修改节点                         |
| **@babel/generator** | AST → 代码         | 生成最终代码（插件中由 Core 自动完成） |

**完整流程**：

```
源代码 → Parser → AST → Traverse + Types/Template → 修改后的 AST → Generator → 目标代码
```

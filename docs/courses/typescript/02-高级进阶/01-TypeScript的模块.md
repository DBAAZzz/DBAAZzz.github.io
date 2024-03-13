---
title: TypeScript 的模块
author: DBAAZzz
date: 2024/03/14 01:00
categories:
  - TypeScript入门学习
tags:
  - TypeScript
---

# TypeScript 的模块

**任何包含 `import` 或 `export` 语句的文件，就是一个模块（module）**，如果一个模块文件只需要运行代码，没有需要导出的变量，可以添加一个：

```ts
export {};
```

来形成模块。

在 Vue3 中需要新增用于增强组件实例类型以支持自定义全局属性，Vue 暴露了一个被设计为可以通过 **`TypeScript` 模块扩展**来扩展的 `ComponentCustomProperties` 接口，

```ts
import axios from 'axios';

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios;
    $translate: (key: string) => string;
  }
}
```

```ts
// 不工作，将覆盖原始类型。
declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string;
  }
}
```

```ts
// 正确的模块，正常工作。
export {};

declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string;
  }
}
```

具体链接为：[指南-拓展全局属性](https://cn.vuejs.org/guide/typescript/options-api.html#augmenting-global-properties)

## TypeScript 中模块的作用

我们知道给一个文件添加 `import` 或者 `export` 就能让文件形成模块，这个模块的作用是什么？

答案是：**模块本身就是一个作用域，不属于全局作用域。模块内部的变量、函数、类只在内部可见，对于模块外部是不可见的。这样就不会有全局副作用。**

举例说明：

```ts
// global.d.ts
declare var MyGlobalVar: any;

// file1.ts
MyGlobalVar = 'Hello';

// file2.ts
console.log(MyGlobalVar); // output: "Hello"
```

在这个例子中，`MyGlobalVar` 是一个全局变量（在 `global.d.t`s 文件中声明）。在 `file1.ts` 脚本中，我们直接给它赋值。由于 `file1.ts` 是一个脚本文件，它有权限访问和修改全局变量。然后，`file2.ts` 就能访问到修改后的 `MyGlobalVar。`

然而，如果我们在 `file1.ts` 添加 `export {}`：

```ts
export {};
MyGlobalVar = 'Hello';
```

此时，`file1.ts` 被视为一个模块，这意味着它无法直接访问或修改全局变量（除非这些变量被显式地导入）。因此，`MyGlobalVar` 在 `file1.ts` 中将被视为未定义，反过来也就无法影响 `file2.ts` 中 `MyGlobalVar` 的值。

**`export {}` 的作用是预防全局命名空间污染，并确保模块之间的严格封装和隔离。**

## import type 语句

**TypeScript 模块除了支持所有 ES 模块的语法，特别之处在于允许输出和输入类型。**

`import` 在一条语句中，可以同时输入类型和正常接口

```ts
// a.ts
export interface A {
  foo: string;
}

export let a = 123;

// b.ts
import { A, a } from './a';
```

这样很不利于区分类型和正常接口，容易造成混淆。为了解决这个问题，`TypeScript` 引入了两个解决方法。

- 第一个方法是在 `import` 语句输入的类型前面加上 `type` 关键字。

```ts
import { type A, a } from './a';
```

- 第二个方法是使用 `import type` 语句，这个语句只用来输入类型，不用来输入正常接口

```ts
// 正确
import type { A } from './a';
let b: A = 'hello';

// 报错
import type { a } from './a';
let b = a;
```

同样的，`export` 语句也有两种方法，表示输出的是类型。

```ts
type A = 'a';
type B = 'b';

// 方法一
export { type A, type B };

// 方法二
export type { A, B };
```

## import type 和 import 的区别

`import type`是 `TypeScript` 中特有的语法，它允许你导入类型而不导入运行时的值。这通常用于导入类型定义，例如接口、类型别名或类类型。**这种导入方式不会影响生成的 JavaScript 代码，因为类型信息在编译时会被移除**。

- 使用 `import type` 的一个主要优点是它可以避免循环依赖和副作用。

- `import` 用于导入值，这会影响生成的 JavaScript 代码。

## importsNotUsedAsValues 编译设置

`TypeScript` 特有的输入类型（type）的 `import` 语句，编译成 `JavaScript` 时怎么处理呢？

`TypeScript` 提供了 `importsNotUsedAsValues` 编译设置项，有三个可能的值。

1. `remove`：这是默认值，自动删除输入类型的 `import` 语句。
2. `preserve`：保留输入类型的 `import` 语句。
3. `error`：保留输入类型的 `import` 语句（与 `preserve` 相同），但是必须写成 `import type` 的形式，否则报错。

假设在 ts 文件中有如下语句：

```ts
import { TypeA } from './a';
```

- `remove` 的编译结果会将该语句删掉。

- `preserve` 的编译结果会保留该语句，但会删掉其中涉及类型的部分。编译后的 js 文件结果为：

```js
import './a';
```

可以看到编译后的 `import` 语句不从 `a.js` 输入任何接口（包括类型），但是**会引发 a.js 的执行，因此会保留 a.js 里面的副作用**。

- `error` 的编译结果与 `preserve` 相同，但在编译过程中会报错，因为它要求输入类型的 `import` 语句必须写成 `import type` 的形式。原始语句改成下面的形式，就不会报错。

```ts
import type { TypeA } from './a';
```

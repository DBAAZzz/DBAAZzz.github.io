---
title: declare 关键字
author: DBAAZzz
date: 2024/03/15 01:00
categories:
  - TypeScript入门学习
tags:
  - declare
---

# declare 关键字

## declare 关键字的作用

`declare` 关键字用来告诉编译器，某个类型是存在的，可以在当前文件中使用。

最常用的场景是，我们在 `TypeScript` 使用第三方库的变量时，但是 `TypeScript` 并不能识别这些变量，那么我们就可以使用 declare 来声明这些不能被识别的变量，从而让编译器可以识别这些变量。

举个例子：我们在 `TypeScript` 中使用 `Jquery`，我们通常使用 `$` 或 `jQuery` 来获取一个元素，

```ts
$('#foo');
// or
jQuery('#foo');
```

如果不做任何处理，编译器完全不知道 `$` 和 `jQuery` 是什么东西，这时我们就需要使用 `declare` 来定义 `jQuery` 的类型

```ts
declare var jQuery: (selector: string) => any;

jQuery('#foo');
```

### declare 的几种语法

`declare` 可以描述以下类型：

- 变量（const、let、var 命令声明）
- type 或者 interface 命令声明的类型
- class
- enum
- 函数（function）
- 模块（module）
- 命名空间（namespace）

### d.ts 文件的作用

我们通常将 `declare` 声明的变量存放在 `d.ts` 声明文件中。

### 加载 d.ts 文件

使用时，自己的脚本使用三斜杠命令，加载这个类型声明文件。

```ts
/// <reference path="node.d.ts"/>
```

## declare module 和 declare namespace

如果想把变量、函数、类组织在一起，可以将 declare 与 module 或 namespace 一起使用。

```ts
declare namespace AnimalLib {
  class Animal {
    constructor(name: string);
    eat(): void;
    sleep(): void;
  }

  type Animals = 'Fish' | 'Dog';
}

// 或者
declare module AnimalLib {
  class Animal {
    constructor(name: string);
    eat(): void;
    sleep(): void;
  }

  type Animals = 'Fish' | 'Dog';
}
```

上面示例中，declare 关键字给出了 module 或 namespace 的类型描述。

declare module 和 declare namespace 里面，加不加 export 关键字都可以。

### declare 实现模块增强

**declare 关键字的另一个用途，是为外部模块添加属性和方法时，给出新增部分的类型描述。**

```ts
import { Foo as Bar } from 'moduleA';

declare module 'moduleA' {
  interface Foo {
    custom: {
      prop1: string;
    };
  }
}
```

上面示例中，从模块 `moduleA` 导入了类型 `Foo`，它是一个接口（`interface`），并将其重命名为 `Bar`，然后用 `declare` 关键字为 `Foo` 增加一个属性 `custom`。这里需要注意的是，虽然接口 `Foo` 改名为 `Bar`，但是扩充类型时，还是扩充原始的接口 `Foo`，因为同名 `interface` 会自动合并类型声明。

我们在 Vue3 也是通过 `declare` 来实现扩展全局属性的

```ts
import axios from 'axios';

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios;
    $translate: (key: string) => string;
  }
}
```

### declare 模块增强的限制

1. `declare` 不能在拓展中声明新的顶级声明，只能允许对现有声明进行扩展。
2. 默认导出也无法拓展，只能对 `export` 命令输出的命名接口进行拓展。具体可以参考[#148080](https://github.com/Microsoft/TypeScript/issues/14080)

## declare global

如果要为 JavaScript 引擎的原生对象添加属性和方法，可以使用 `declare global {}` 语法。

```ts
export {};

declare global {
  interface String {
    toSmallString(): string;
  }
}

String.prototype.toSmallString = (): string => {
  // 具体实现
  return '';
};
```

这个示例第一行的空导出语句 `export {}`，作用是强制编译器将这个脚本当作模块处理。这是因为 `declare global` 必须用在模块里面。

:::tip
除了 `export` 外，使用 `import` 语句也能将脚本当成模块处理
:::

## 自动生成 d.ts 文件

如果我们的第三方库是由 `TypeScript` 来编写的，那么我们在使用 `tsc` 命令编译成 js 时，将 `tsconfig.json` 中的 `declaration` 选项开启，就能生成 `d.ts` 文件

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "lib",
    "declaration": true
  }
}
```

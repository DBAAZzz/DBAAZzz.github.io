---
title: TypeScript 的基础类型
author: DBAAZzz
date: 2023/09/25 00:00
categories:
  - TypeScript入门学习
tags:
  - TypeScript
---

# TypeScript 基础类型

## 类型声明和类型推断

TypeScript 代码最明显的特征，就是为 JavaScript 变量加上了类型声明。

```ts
// 给 name 变量声明为 string 类型
let name: string;
```

那是不是要我们每次声明变量的时候都要进行类型声明呢？答案是否定的。

类型声明并不是必须的，如果没有，TypeScript 会自己进行类型推断。

**TypeScript 会根据一些简单的规则推断（检查）变量的类型，这就叫类型推断。**

### 赋值时推断

举例说明：

```ts
let number = 123; // TypeScript 会将 number 变量推断为 number 类型

// 将 string 类型赋值给 number 类型就会报错，
// Type 'string' is not assignable to type 'number'.
number = '100';
```

### 推断函数返回类型

TypeScript 也可以推断函数的返回类型

```ts
// TypeScript 会将add函数的返回类型推断为 number 类型
function add(num1: number, num2: number) {
  return num1 + num2;
}

// Type 'number' is not assignable to type 'string'
// 不能将 number 类型赋值给 string 类型
let result: string = add(1, 2);
```

:::tip 提示
正因为 TypeScript 的类型推断，函数的返回类型通常是省略不写的
:::

### 结构化对象类型推断

同时，TypeScriptd 的推断也适用于结构化的存在（对象字面量）

```ts
const foo = {
  a: 123,
  b: 456,
};

foo.a = 'hello'; // 不能把 string 类型赋值给 number 类型
```

### 解构推断

适用于解构中

```ts
const foo = {
  a: 123,
  b: 456,
};
let { a } = foo;

a = 'hello'; // 不能把 string 类型赋值给 number 类型
```

## TypeScript 的基础类型

`TypeScript` 是继承了 `JavaScript` 的类型设计，以下 8 种是 `JavaScript` 的类型，同时也是 `TypeScript` 的基础类型

- boolean
- number
- bigint
- string
- symbol
- object
- undefined
- null

需要注意的是，上面的类型名称都是小写的，首字母大写的 **Number**、**String**、**Boolean** 等在 JavaScript 中是内置对象，而不是类型名称。

### boolean 类型

boolean 类型只包含 true 和 false 两个布尔值。

```ts
let isMen: boolean = false;
```

### number 类型

number 类型包含所有整数和浮点数。

```ts
let age: number = 20;
```

### bigint 类型

bigint 类型包含所有的大整数。

```ts
const x: bigint = 123n;
const y: bigint = 0xffffn;
```

### string 类型

string 类型包含所有字符串。

```ts
let songName: string = 'xiaomimg';
```

### symbol 类型

symbol 类型包含所有的 Symbol 值。

```ts
const x: symbol = Symbol();
```

### object 类型

根据 JavaScript 的设计，object 类型包含了所有对象、数组和函数。

```ts
const x: object = { foo: 123 };
const y: object = [1, 2, 3];
const z: object = (n: number) => n + 1;
```

### undefined 类型、null 类型

undefined 和 null 是两种独立类型，它们各自都只有一个值。

undefined 类型只包含一个值 **undefined**，表示未定义（即还未给出定义，以后可能会有定义）。

```ts
let x: undefined = undefined;
```

## Object 类型和 object 类型

TypeScript 的对象类型分为 Object 和 object 类型两种。

### Object 类型

大写的 Object 类型代表 JavaScript 语言里的广义对象。所有可以转为对象的值，都是 Object 类型，**几乎包括了所有的值**。

```ts
let obj: Object;

obj = true; // boolean 类型
obj = 'hi'; // string 类型
obj = 1; // number 类型
obj = { foo: 123 }; // 对象类型
obj = [1, 2]; // 数组类型
obj = (a: number) => a + 1; // 函数类型
```

事实上，除了 undefined 和 null 这两个值不能转为对象，其他任何的值都可以赋值给 Object 类型。

**另外，Object 类型的另一种写法为空对象{}，所以通常使用{}空对象来代替 Object。**

### object 类型

小写的 object 类型代表 JavaScript 里面的狭义对象，即可以使用字面量表示的对象，只包含**对象**、**数组**、**函数**，不包括原始类型。

```ts
let obj: object;

obj = { foo: 123 };
obj = [1, 2];
obj = (a: number) => a + 1;
obj = true; // 报错
obj = 'hi'; // 报错
obj = 1; // 报错
```

上面的示例中，`object` 类型不包括原始类型，只有对象、数组、函数可以赋值给 `object` 类型。

大多数时候，我们使用对象类型，只希望包含真正的对象，不希望包含原始类型。所以，**建议总是使用小写类型 object，不使用大写类型 Object。**

注意，无论是大写的 `Object` 类型，还是小写的 `object` 类型，都只包含 `JavaScript` 内置对象原生的属性和方法，用户自定义的属性和方法都不存在于这两个类型之中。

## undefined 和 null 类型的特殊性

`undefined` 和 `null` 既是值也是类型

### 任何其他类型都可以赋值为 undefined 或 null

作为值，任何其他类型都可以赋值为 `undefined` 或 `null。`

```ts
let age: number = 24;

age = null; // 正确
age = undefined; // 正确
```

这样设计的目的是为了跟 `JavaScript` 的行为保持一致。在 `JavaScript` 中变量如果等于 undefined 就表示还没有赋值，如果等于 null 就表示值为空。

但是有时候，这并不是开发者想要的行为，也不利于发挥类型系统的优势。

```ts
const obj: object = undefined;
obj.toString(); // 编译不报错，运行就报错
```

上面的例子中，`undefined` 赋值给 `object` 对象编译阶段不会报错，但在运行阶段，`obj` 变量执行 `toString()` 方法，就报错了，因为 `undefined` 类型不是对象，没有这个方法。

为了避免这种情况，TypeScript 提供了一个编译选项 `StrictNullCheck`。只要打开这个选项，`undefined` 和 `null` 就不能赋值给其他类型（除了 `any` 和 `unknown`类型）

命令行打开：

```bash
tsc --strictNullChecks index.ts
```

在 tsconfig.json 中的写法：

```json
{
  "compilerOptions": {
    "strictNullChecks": true
    // ...
  }
}
```

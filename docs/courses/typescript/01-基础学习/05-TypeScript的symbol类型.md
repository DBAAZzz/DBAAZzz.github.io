---
title: TypeScript 的symbol类型
author: DBAAZzz
date: 2023/09/25 00:00
categories:
  - TypeScript入门学习
tags:
  - TypeScript
  - symbol
---

# TypeScript 的 symbol 类型

自 ECMAScript 2015 起，symbol 成为了一种新的原生类型，就像 number 和 string 一样。

symbol 类型的值是通过 Symbol 构造函数创建的。在 TypeScript 里面，Symbol 的类型使用 symbol 表示。

```ts
let x: symbol = Symbol();
let y: symbol = Symbol();

x === y; // false
```

## unique symbol

symbol 类型包含所有的 Symbol 值，但是无法表示某一个具体的 Symbol 值。

比如，5 是一个具体的数值，就用 5 这个字面量来表示，这也是它的值类型。但是，Symbol 值不存在字面量，必须通过变量来引用，所以写不出只包含单个 Symbol 值的那种值类型。

为了解决这个问题，TypeScript 设计了 symbol 的一个子类型 unique symbol，它表示单个的、某个具体的 Symbol 值。

因为 unique symbol 表示单个值，所以**这个类型的变量是不能修改值的，只能用 const 命令声明，不能用 let 声明**。

```ts
// 正确
const x: unique symbol = Symbol();

// 报错
let y: unique symbol = Symbol();
```

const 命令为变量赋值 Symbol 值时，变量类型默认就是 unique symbol，所以类型可以省略不写。

```ts
const x: unique symbol = Symbol();
// 等同于
const x = Symbol();
```

每个声明为 unique symbol 类型的变量，它们的值都是不一样的，其实属于两个值类型。

```ts
const a: unique symbol = Symbol();
const b: unique symbol = Symbol();

a === b; // 报错
```

## symbol 的类型推断

如果变量声明没有给出类型，TypeScript 会推断某个 Symbol 值变量的类型。

let 命令声明的变量，推断类型为 symbol。

```ts
// 类型为 symbol
let x = Symbol();
```

const 命令声明的变量，推断类型为 unique symbol。

```ts
// 类型为 unique symbol
const x = Symbol();
```

但是，const 命令声明的变量，如果赋值为另一个 symbol 类型的变量，则推断类型为 symbol。

```ts
let x = Symbol();

// 类型为 symbol
const y = x;
```

let 命令声明的变量，如果赋值为另一个 unique symbol 类型的变量，则推断类型还是 symbol。

```ts
const x = Symbol();

// 类型为 symbol
let y = x;
```

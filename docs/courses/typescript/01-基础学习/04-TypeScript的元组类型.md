---
title: TypeScript 的元组类型
author: DBAAZzz
date: 2023/09/25 00:00
categories:
  - TypeScript入门学习
tags:
  - TypeScript
  - 元组
---

# TypeScript 的元组类型

元组 tuple 是 TypeScript 特有的数据类型，JavaScript 没有单独区分这种类型。它表示成员类型可以自由设置的数组，**即数组的各个成员的类型可以不同**。

由于成员的类型可以不一样，所以元组必须明确声明每个成员的类型。

```ts
const s: [string, string, boolean] = ['a', 'b', true];
```

数组的成员类型写在方括号外面（`number[]`），元组的成员类型是写在方括号里面（`[number]`）。TypeScript 的区分方法就是，成员类型写在方括号里面的就是元组，写在外面的就是数组。

元组成员的类型可以添加问号后缀（?），表示该成员是可选的。

```ts
let a: [number, number?] = [1];
```

**注意，问号只能用于元组的尾部成员，也就是说，所有可选成员必须在必选成员之后。**

```ts
type myTuple = [number, number, number?, string?];
```

上面示例中，元组 myTuple 的最后两个成员是可选的。也就是说，它的成员数量可能有两个、三个和四个。

由于需要声明每个成员的类型，所以大多数情况下，元组的成员数量是有限的，从类型声明就可以明确知道，元组包含多少个成员，越界的成员会报错。

```ts
let x: [string, string] = ['a', 'b'];

x[2] = 'c'; // 报错
```

## 读取元组的成员类型

元组可以通过方括号，读取成员类型。

```ts
type Tuple = [string, number];
type Age = Tuple[1]; // number
```

由于元组的成员都是数值索引，即索引类型都是 number，所以可以像下面这样读取。

```ts
type Tuple = [string, number, Date];
type TupleEl = Tuple[number]; // string|number|Date
```

上面示例中，Tuple[number]表示元组 Tuple 的所有数值索引的成员类型，所以返回 string|number|Date，即这个类型是三种值的联合类型。

:::tip
获取元组的成员类型，在体操类型中可能用到
:::

## 只读元组

元组也可以是只读的，不允许修改，有两种写法。

```ts
// 写法一
type t = readonly [number, string];

// 写法二
type t = Readonly<[number, string]>;
```

## 元组的具体使用场景

1. 处理异构数据

当你需要处理异构（不同类型）的数据结构时，元组类型可以很方便地表示和操作这些数据。例如，解析 CSV 文件时，每行可能包含不同类型的数据，你可以使用元组来表示每一行的数据。

```ts
type CSVRow = [string, number, boolean];
const csvData: CSVRow[] = [
  ['Alice', 30, true],
  ['Bob', 25, false],
  // ...
];
```

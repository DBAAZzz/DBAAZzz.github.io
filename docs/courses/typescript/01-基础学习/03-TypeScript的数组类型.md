---
title: 数组类型
author: DBAAZzz
date: 2023/09/25 00:00
categories:
  - TypeScript入门学习
tags:
  - TypeScript
  - 数组
---

# TypeScript 的数组类型

TypeScript 数组有一个根本特征：所有成员的类型必须相同，但是成员数量是不确定的，可以是无限数量的成员也可以是零成员。

数组类型有两种写法：

- 一种是在数组成员的类型后面加上一对方括号
- 另一种写法是使用 TypeScript 内置的 Array 接口

```ts
let arr1: number[] = [1, 2, 3];
let arr2: Array<number> = [1, 2, 3];
```

TypeScript 和 JavaScript 中数组的成员数量是不做限制的，也就是动态变化的。由于成员数量可以动态变化，所以 **TypeScript 不会对数组边界进行检查，越界访问数组并不会报错**。

```ts
let arr: number[] = [1, 2, 3];
let foo = arr[3]; // 正确
```

## 数组的类型推断

如果数组变量没有声明类型，TypeScript 就会推断数组成员的类型。这时，推断行为会因为值的不同，而有所不同。

```ts
// 推断为 any[]
const arr = [];

arr.push(123);
arr; // 推断类型为 number[]

arr.push('abc');
arr; // 推断类型为 (string|number)[]
```

上面的例子中可以看到，随着新成员的加入，TypeScript 会自动修改推断的数组类型。但是，**类型推断的自动更新只会发生在初始值为空数组的情况，如果初始值不是空数组，类型推断就不会更新。**

```ts
let arr = [1, 2, 3]; // 推断为number[]

arr.push('4'); // 报错
```

可以看到，由于数组的初始值不为空，TypeScript 就推断成员类型为 number，后续数组 push 类型为 string 的变量就会报错。

## 只读数组

JavaScript 规定，const 命令声明的数组变量是可以改变成员的。

```js
const arr = [1, 2];
arr[0] = 2;
```

在 TypeScript 中，当我们有声明只读数组的需求时，可以在数组类型的前面加上 `readonly` 关键字。

```ts
const arr: readonly number[] = [0, 1];

arr[1] = 2; // 报错
arr.push(3); // 报错
delete arr[0]; // 报错
```

TypeScript 将 `readonly number[]` 与 `number[]` 视为两种不一样的类型，后者是前者的子类型。

我们知道，子类型继承了父类型的所有特征，并加上了自己的特征，所以子类型 `number[]` 可以用于所有使用父类型的场合，反过来就不行。

### 只读数组不能和数组的范型写法一起使用

注意，readonly 关键字不能与数组的泛型写法一起使用。

```ts
// 报错
const arr: readonly Array<number> = [0, 1];
```

TypeScript 提供了两个专门的范型，用来生成只读数组的类型。

```ts
const a1: ReadonlyArray<number> = [0, 1];

const a2: Readonly<number[]> = [0, 1];
```

---
title: TypeScript 的Enum类型
author: DBAAZzz
date: 2023/09/27 00:00
categories:
  - TypeScript入门学习
tags:
  - TypeScript
---

# TypeScript 的 Enum（枚举） 类型

枚举是 TypesScript 添加到 JavaScript 的一项功能。与大多数 TypeScript 功能不同，**这不是对 JavaScript 的类型级别的拓展，而是对语言和运行时的扩展。**

枚举允许开发人员定义一组命名常量，TypeScript 提供基于数字和字符串的枚举。

## 数字枚举

```ts
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}
```

上面，我们定义了一个数字枚举，其中 Up 用来初始化 1。那么 Up 以下所有成员都会自动递增。换句话说，Up 是值 1，Down 是值 2，Left 是值 3，Right 是值 4。

## 字符串枚举

在字符串枚举中，每个成员都必须使用字符串文字或另一个字符串枚举成员进行常量初始化。

```ts
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}
```

## 反向映射

除了创建具有成员属性名称的对象之外，数字枚举成员还可以获得从枚举值到枚举名称的反向映射。

```ts
enum Enum {
  A,
}

let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```

## keyof 运算符

keyof 运算符可以取出 Enum 结构的所有成员名，作为联合类型返回

```ts
enum MyEnum {
  A = 'a',
  B = 'b',
}

// 'A'|'B'
type Foo = keyof typeof MyEnum;
```

注意，这里的 typeof 是必需的，否则 keyof MyEnum 相当于 keyof number。

---
title: interface 类型
author: DBAAZzz
date: 2023/09/25 00:00
categories:
  - TypeScript入门学习
tags:
  - TypeScript
  - interface
---

# TypeScript 的 interface

interface 是对象的模版，可以看作是一种类型约定，中文译为“接口”。

## interface 的继承

interface 可以继承其他的类型

### interface 继承 interface

interface 可以使用 extends 关键字，继承其他的 interface

```ts
interface Style {
  color: string;
}

interface Shape {
  name: string;
}

// 可以多种继承
interface Circle extends Style, Shape {
  radius: number;
}
```

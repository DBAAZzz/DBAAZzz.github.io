---
title: interface 类型和 type 命令
author: DBAAZzz
date: 2023/09/25 00:00
categories:
  - TypeScript入门学习
tags:
  - TypeScript
  - interface
---

# interface 类型和 type 命令

## interface

`interface` 是对象的模版，可以看作是一种类型约定，中文译为“接口”。

### interface 的拓展性

`interface` 可以继承其他的类型，使用 `extends` 关键字，继承其他的 `interface`

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

## type 命令（类型别名）

`type` 命令用来定义一个类型的别名。

```ts
type Point = {
  x: number
  y: number
  z?: number
}
```

### type 的拓展性

`type` 命令可以通过交叉类型（&）与其他类型合并，而不是通过 `extend`

## type 和 interface 的差异和使用场景

在 `TypeScript` 中 `type` 和 `interface` 都可以定义对象的类型或者函数签名。

但是两个之间有着明显的差异：

- **声明合并**

`interface` 支持声明合并，也就是说你可以分散到多个地方声明同一个 `interface`，`TypeScript` 会将它们合并为一个接口。

- **扩展性**

`interface` 可以通过 `extends` 关键字扩展其他 `interface`。
`type` 可以通过交叉类型（&）与其他类型合并，但不是通过 `extends`。


### 使用场景

`interface` 更适合公共 API 的定义，特别是当你希望消费者可以扩展或实现这些 API 时。

`type` 更适合定义类型别名，包括联合类型、元组类型和其他你不需要扩展的类型。

如 `Vue3` 中就是使用 `interface` 定义 `Vue` 对象的类型，`interface` 提供了更好的拓展性和合并声明的能力。

用户可以通过 `interface` 的这一个特性轻松的拓展 `Vue` 的属性。

```ts
import axios from 'axios';

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios;
    $translate: (key: string) => string;
  }
}
```

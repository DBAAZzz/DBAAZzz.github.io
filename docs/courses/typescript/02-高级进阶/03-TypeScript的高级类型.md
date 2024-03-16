---
title: TypeScript 的高级类型
author: DBAAZzz
date: 2024/03/17 01:00
categories:
  - TypeScript 入门学习
tags:
  -
---

# TypeScript 的高级类型

TypeScript 提供了多种实用类型实现常见的类型转换，这些类型是全局可用的。

## `Partial<T>`

作用：生成一个新类型，该类型与 T 拥有相同的属性，但是所有属性为可选项。

源码：

```ts
type Partial<T> = {
  [p in keyof T]?: T[p];
};
```

举例：

```ts
interface Foo {
  name: string;
  age: number;
}
type Bar = Partial<Foo>;

// Bar的类型为
type Bar = {
  name?: string;
  age?: number;
};
```

## `Required<T>`

作用：生成一个新类型，该类型与 T 拥有相同的属性，但是所有属性为必选项

源码：

```ts
type Required<T> = {
  [p in keyof T]-?: T[p];
};
```

上面源码中的 `-?` 是一个映射类型修饰符，用于从一个类型中移除 `optional`（可选）标记。

举例：

```ts
interface Foo {
  name: string;
  age?: number;
}

type Bar = Required<Foo>;

// 相当于
type Bar = {
  name: string;
  age: number;
};
```

## `Readonly<T>`

作用： 生成一个新类型，该类型与 T 拥有相同的属性，但是所有属性为自读

源码：

```ts
type Readonly<T> = {
  readonly [p in keyof T]: T[p];
};
```

举例：

```ts
interface Foo {
  name: string;
  age: number;
}

type Bar = Readonly<Foo>;

// 等同于
type Bar = {
  readonly name: string;
  readonly age: number;
};
```

## `Pick<T, K>`

作用：从类型定义的属性中，选取指定一组属性，返回一个新的类型定义

源码：

```ts
type Pick<T, K extends keyof T> = {
  [p in K]: T[K];
};
```

举例：

```ts
interface Foo {
  name: string;
  age?: number;
  gender: string;
}

type Bar = Pick<Foo, 'age' | 'gender'>;

type Bar = {
  age?: number;
  gender: string;
};
```

## `Record<K, T>`

作用：以 `typeof` 格式快速创建一个类型，此类型包含一组指定的属性且都是必填

源码：

```ts
type Record<K extends keyof any, T> = {
  [p in K]: T;
};
```

:::tip
1、值得注意的是 keyof any 得到的是 `string` | `number` | `symbol`

2、原因在于类型 key 的类型只能为 `string` | `number` | `symbol`
:::

举例：

```ts
type Coord = Record<'x' | 'y', number>;

// 等同于
type Coord = {
  x: number;
  y: number;
};
```

## `Exclude<T, U>`

作用：提取存在于 `T`，但不存在于 `U` 的类型组成的联合类型，也就是 `T` 相对于 `U` 的差集或者补集

源码：

```ts
type Exclude<T, U> = T extends U ? never : T;
```

:::tip
1、`never` 表示一个不存在的类型

2、`never` 与其他类型的联合后，是没有 `never` 的
:::

举例：

```ts
type A = number | string | boolean;
type B = number | boolean;

type C = Exclude<A, B>;

// 等同于
type C = string;
```

## `Extract<T, U>`

作用：Extract 提取联合类型 `T` 和联合类型 `U` 的所有交集

源码：

```ts
type Extract<T, U> = T extends U ? T : never;
```

举例：

```ts
type A = number | string | boolean;
type B = number | boolean;

type Foo = Exclude<A, B>;

type Foo = number | boolean;
```

## `Omit<T, K>`

作用：生成一个新类型，该类型拥有 `T` 中除了 `K` 属性以外的所有属性。 也就是从 `T` 中选取所有属性然后删除 `K` 属性

源码：

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

举例：

```ts
type Foo = {
  name: string;
  age: number;
};

type Bar = Omit<Foo, 'age'>;

// 相当于
type Bar = {
  name: string;
};
```

## `NonNullable<T>`

作用：用来过滤类型中的 `null` 以及 `undefind` 类型

源码：

```ts
type NonNullable<T> = T extends null | undefined ? never : T;
```

举例:

```ts
// type Foo = string
type Foo = NonNullable<string | null | undefined>;

// type Bar = number[]
type Bar = NonNullable<number[] | null>;
```

## `Parameters<T>`

作用：获取函数的参数类型，将每个参数类型放在一个元组中

源码：

```ts
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
```

:::tip
首先 Paraments 首先约束参数 T 必须是个函数类型，所以(...args: any) => any 替换成 Function 也是可以的

具体实现就是，判断 T 是否为函数类型，如果是则使用 infer P 让 ts 自己推导出函数的参数类型，并将推导结果存到类型 P 上，否则就返回 never
:::

举例:

```ts
type Eg = Parameters<(arg1: string, arg2: number) => void>;

// 等同于
type Eg = [arg1: string, arg2: number];
```

**重点**

- `infer` 关键词作用是让 `ts` 自己推导类型，并将推导结果存储在其参数绑定的类型上，。
- `infer` 关键词只能在 `extends` 条件上使用，不能在其他地方使用

**重点！重点！重点！**

- `type Eg = [arg1: string, arg2: number]` 是一个元组，我们可以把这个作为类似元组，或者具名元组的意思去理解

## `ConstructorParameters<T>`

作用：获取类的构造函数的参数类型，存在一个元组中

源码：

```ts
type ConstructorParmaters<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never;
```

:::tip
首先约束参数 `T` 为拥有构造函数的类。注意这里有个 `abstact` 修饰符

实现时，判断 `T` 为满足约束的类时，利用 `inter P` 自动推导构造函数的参数类型，并最终返回该类型
:::

举例：

```ts
interface ErrorConstructor {
  new (message?: string): Error;
  (message?: string): Error;
  readonly prototype: Error;
}
// type Eg = string
type Eg = ConstructorParamters<ErrorConstructor>;

class People {
  constructor(public name: string, sex?: number) {}
}
// type Eg2 = [name: string, sex?: number]
type Eg = ConstructorParameters<typeof People>;
```

## `ReturnType<T>`

作用：获取 function 的返回类型，存在一个元组中

举例：

```ts
declare function f1(): { a: number; b: string };

type T0 = ReturnType<() => string>; //string

type T1 = ReturnType<(s: string) => void>; // void

type T2 = ReturnType<<T>() => T>; // unknown

type T3 = ReturnType<typeof f1>; // { a: number; b: string; }
```

## `InstanceType<T>`

作用：接收一个构造函数类型作为参数，然后返回这个构造函数的实例类型。

`InstanceType` 在处理类和构造函数时特别有用，因为它允许你动态地获取一个类的实例类型，而不是硬编码这个类型。

举例：

```ts
class MyClass {
  x = 0;
  y = 0;
}

type MyClassInstance = InstanceType<typeof MyClass>;

let instance: MyClassInstance;
instance = new MyClass();
```

在各种组件库中都是 `InstanceType` 工具类型导出组件实例类型

```ts
import type Divider from './divider.vue';

export type DividerInstance = InstanceType<typeof Divider>;
```

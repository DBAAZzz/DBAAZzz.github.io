---
title: any、unknow、never 类型
author: DBAAZzz
date: 2023/09/25 00:00
categories:
  - TypeScript入门学习
tags:
  - TypeScript
---

# TypeScript 的 any、unknow、never 类型

## any 类型

`any` 类型表示没有任何限制，该类型的变量可以赋予任意类型的值

```ts
let x: any;

x = 1; // 正确
x = 'foo'; // 正确
x = true; // 正确
```

变量类型一旦设为 ` any``，TypeScript ` 实际上会关闭这个变量的类型检查，即使有明显的类型错误，只要句法正确，都不会报错。

总之，`TypeScript` 认为，只要开发者使用了 `any` 类型，就表示开发者想要自己来处理这些代码，所以就不对 `any` 类型进行任何限制，怎么使用都可以。

从集合论的角度看，`any` 类型可以看成是所有其他类型的全集，**包含了一切可能的类型**`。TypeScript` 将这种类型称为“顶层类型”（top type），意为涵盖了所有下层。

### 类型推断问题

对于开发者没有指定类型，`TypeScript` 必须自己推断那些变量的类型，如果无法推断出类型，`TypeScript` 就会认为该变量的类型为 any

```ts
// x 和 y 变量被推断为 any 类型
function add(x, y) {
  return x + y;
}

add(1, [1, 2, 3]); // 不报错
```

由于 `TypeScript` 无法推断出他们的类型，就会认为 x 和 y 变量的类型为 `any`，这样就后续就不会对 add 函数进行类型检查了。

显然这是一个很糟糕的情况，对于那些类型不明显的变量一定要显式声明类型，防止被推断为 `any` 类型。

`TypeScript` 还提供了一个编译选项 `noImplicitAny`，打开该选项，只要推断出 `any` 类型就会报错。

### any 带来的污染问题

`any` 类型除了关闭类型检查，还有一个很大的问题，就是它会“污染”其他的变量。它可以赋值给其他任何类型的变量，导致其他变量出错。

```ts
let x: any = 'hello';
let y: number;

y = x; // 编译不报错

y * 123; // 编译不报错
y.toFixed(); // 编译不报错
```

上面的例子中，变量 x 是一个 `any` 类型，实际的值是一个字符串。变量 y 是一个 `number` 类型，但是它被赋值为 x，静态类型编译阶段并不会报错。后面对变量 y 的一系列的数值运算，`TypeScript` 也检查不出问题。

这样问题就留到运行时才会暴露。

:::tip
污染其他具有正确类型的变量，把错误留到运行时，这就是不宜使用 `any` 类型的另一个主要原因。
:::

## unknow 类型

为了解决 `any` 类型带来的“污染”问题，`TypeScript` 引入了 `unknow` 类型。它与 `any` 含义相同，表示类型不确定，可能是任意类型。

但是它的使用有一些限制，不像 `any` 一样自由，可以看成是严格版的 `any` 类型。

```ts
let x: unknown;

x = true; // 正确
x = 42; // 正确
x = 'Hello World'; // 正确
```

上面示例中，变量 x 的类型是 `unknown`，可以赋值为各种类型的值。这与 any 的行为一致。

### unknow 的使用限制

`unknown` 类型跟 `any` 类型的不同之处在于，它不能直接使用。主要有以下几个限制：

- `unknown` 类型的变量，不能直接赋值给其他类型的变量（除了 any 类型和 unknown 类型）
- 不能直接调用 `unknown` 类型变量的方法和属性。
- `unknown` 类型变量能够进行的运算是有限的，只能进行比较运算（运算符==、===、!=、!==、||、&&、?）、取反运算（运算符!）、typeof 运算符和 instanceof 运算符这几种，其他运算都会报错。

```ts
let v: unknown = 123;

// 不能直接赋值给其他类型的变量
let v1: boolean = v; // 报错
let v2: number = v; // 报错
```

```ts
let v1: unknown = { foo: 123 };
v1.foo; // 报错

let v2: unknown = 'hello';
v2.trim(); // 报错

let v3: unknown = (n = 0) => n + 1;
v3(); // 报错
```

```ts
let a: unknown = 1;

a + 1; // 报错
a === 1; // 正确
```

那么，怎么才能使用 `unknown` 类型变量呢？

答案是只有经过“类型缩小”，`unknown` 类型变量才可以使用。**所谓“类型缩小”，就是缩小 unknown 变量的类型范围，确保不会出错。**

```ts
let a: unknown = 1;

if (typeof a === 'number') {
  let r = a + 10; // 正确
}
```

`unknown` 可以看作是更安全的 `any`。一般来说，凡是需要设为 `any` 类型的地方，通常都应该优先考虑设为 `unknown` 类型。

## never 类型

由于不存在任何属于“空类型”的值，所以该类型被称为 `never`，即不可能有这样的值。

```ts
let x: never;

let foo: never = 123; // 报错 number 类型不能赋值给 never 类型
```

```ts
function f(): never {
  throw new Error('Error');
}

let v1: number = f(); // 不报错
let v2: string = f(); // 不报错
let v3: boolean = f(); // 不报错
```

函数 f()会抛出错误，所以返回值类型可以写成 `never`，即不可能返回任何值。各种其他类型的变量都可以赋值为 f()的运行结果（`never` 类型）。

为什么 `never` 类型可以赋值给任意其他类型呢？这也跟集合论有关，空集是任何集合的子集。TypeScript 就相应规定，任何类型都包含了 `never` `类型。因此，never` 类型是任何其他类型所共有的，`TypeScript` 把这种情况称为“底层类型”（bottom type）。

总之，TypeScript 有两个“顶层类型”（`any` 和 `unknown`），但是“底层类型”只有 `never` 唯一一个。

### 与 void 的区别

`never` 表示一个从来不会优雅的返回的函数时，你可能马上就会想到与此类似的 `void`，然而实际上，`void` 表示没有任何类型，`never` 表示永远不存在的值的类型。

当一个函数返回空值时，它的返回值为 void 类型，但是，当一个函数永不返回时（或者总是抛出错误），它的返回值为 `never` 类型。`void` 类型可以被赋值（在 `strictNullChecking` 为 `false` 时），但是除了 `never` 本身以外，其他任何类型不能赋值给 `never`。

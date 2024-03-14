---
title: 函数类型
author: DBAAZzz
date: 2023/09/25 00:00
categories:
  - TypeScript入门学习
tags:
  - TypeScript
  - 函数
---

# TypeScript 的函数类型

函数的类型声明，需要在声明函数时，给出参数的类型和返回值的类型。

```ts
function hello(txt: string): void {
  console.log('hello ' + txt);
}
```

如果变量被赋值为一个函数，变量的类型有两种写法。

```ts
// 写法一
const hello = function (txt: string) {
  console.log('hello ' + txt);
};

// 写法二
const hello: (txt: string) => void = function (txt) {
  console.log('hello ' + txt);
};
```

第二种写法需要注意的是，函数的参数要放在圆括号里面，不放会报错。其次，类型里面的参数名（本例是 txt）是必须的。有的语言的函数类型可以不写参数名（比如 C 语言），但是 `TypeScript` 不行。如果写成 `(string) => void`，`TypeScript` 会理解成函数有一个名叫 `string` 的参数，并且这个 `string` 参数的类型是 `any`。

**函数类型里面的参数名与实际参数名，可以不一致。**

```ts
let f: (x: number) => number;

f = function (y: number) {
  return y;
};
```

## 函数类型可以采用对象的写法

```ts
let add: {
  (x: number, y: number): number;
};

add = function (x, y) {
  return x + y;
};
```

```
{
  (参数列表): 返回值
}
```

函数类型也可以使用 `interface` 来声明，这种写法就是对象写法的翻版。

```ts
interface myfn {
  (a: number, b: number): number;
}

var add: myfn = (a, b) => a + b;
```

这种写法和函数重载结合起来，会更加优雅。下面部分讲箭头函数的时候会贴出相关代码

## 箭头函数

箭头函数是普通函数的一种简化写法，它的类型写法与普通函数类似。

```ts
const repeat = (str: string, times: number): string => str.repeat(times);
```

面示例中，变量 repeat 被赋值为一个箭头函数，类型声明写在箭头函数的定义里面。其中，参数的类型写在参数名后面，返回值类型写在参数列表的圆括号后面。

## 可选参数

如果函数的某个参数可以省略，则在参数名后面加问号表示。

```ts
function f(x?: number) {
  // ...
}

f(); // OK
f(10); // OK
```

上面示例中，参数 `x` 后面有问号，表示该参数可以省略。

参数名带有问号，表示该参数的类型实际上是 `原始类型 | undefined`，它有可能为 `undefined`。比如，上例的 `x` 虽然类型声明为 `number`，但是实际上是 `number | undefined`。

```ts
function f(x?: number) {
  return x;
}

f(undefined); // 正确
```

上面示例中，参数 `x` 是可选的，等同于说 `x` 可以赋值为 `undefined`。

但是，反过来就不成立，类型显式设为 `undefined` 的参数，就不能省略。

```ts
function f(x: number | undefined) {
  return x;
}

f(); // 报错
```

**函数的可选参数只能在参数列表的尾部，跟在必选参数的后面。**

```ts
let myFunc: (a?: number, b: number) => number; // 报错
```

### 参数默认值

`TypeScript` 函数的参数默认值写法，与 JavaScript 一致。

**设置了默认值的参数，就是可选的**。如果不传入该参数，它就会等于默认值。

```ts
function createPoint(x: number = 0, y: number = 0): [number, number] {
  return [x, y];
}

createPoint(); // [0, 0]
```

**可选参数与默认值不能同时使用。**

```ts
// 报错
function f(x?: number = 0) {
  // ...
}
```

设有默认值的参数，如果传入 `undefined`，也会触发默认值。

```ts
function f(x = 456) {
  return x;
}

f2(undefined); // 456
```

## readonly 只读参数

如果函数内部不能修改某个参数，可以在函数定义时，在参数类型前面加上 `readonly` 关键字，表示这是只读参数。

```ts
function arraySum(arr: readonly number[]) {
  // ...
  arr[0] = 0; // 报错
}
```

## 函数重载

有些函数可以接受不同类型或不同个数的参数，并且根据参数的不同，会有不同的函数行为。这种根据参数类型不同，执行不同逻辑的行为，称为函数重载（function overload）。

```ts
reverse('abc'); // 'cba'
reverse([1, 2, 3]); // [3, 2, 1]
```

上面示例中，函数 reverse()可以将参数颠倒输出。参数可以是字符串，也可以是数组。

这意味着，该函数内部有处理字符串和数组的两套逻辑，根据参数类型的不同，分别执行对应的逻辑。这就叫“函数重载”。

`TypeScript` 对于“函数重载”的类型声明方法是，逐一定义每一种情况的类型。

```ts
function reverse(str: string): string;
function reverse(arr: any[]): any[];
```

上面示例中，分别对函数 `reverse()` 的两种参数情况，给予了类型声明。但是，到这里还没有结束，**后面还必须对函数 `reverse()` 给予完整的类型声明**。

```ts
function reverse(str: string): string;
function reverse(arr: any[]): any[];
function reverse(stringOrArray: string | any[]): string | any[] {
  if (typeof stringOrArray === 'string')
    return stringOrArray.split('').reverse().join('');
  else return stringOrArray.slice().reverse();
}
```

上面示例中，前两行类型声明列举了重载的各种情况。第三行是函数本身的类型声明，它必须与前面已有的重载声明兼容。

有一些编程语言允许不同的函数参数，对应不同的函数实现。但是，JavaScript 函数只能有一个实现，必须在这个实现当中，处理不同的参数。因此，函数体内部就需要判断参数的类型及个数，并根据判断结果执行不同的操作。

**注意，重载的各个类型描述与函数的具体实现之间，不能有其他代码，否则报错。**

**函数重载的每个类型声明之间，以及类型声明与函数实现的类型之间，不能有冲突。** 用上面例子说明的话，具体实现的类型就一定要是 `string | any[]`，否则就会报错。

重载声明的排序很重要，因为 `TypeScript` 是按照顺序进行检查的，一旦发现符合某个类型声明，就不再往下检查了，所以类型最宽的声明应该放在最后面，防止覆盖其他类型声明。

```ts
function f(x: any): number;
function f(x: string): 0 | 1;
function f(x: any): any {
  // ...
}

const a: 0 | 1 = f('hi'); // 报错，匹配到第一个函数
```

下面的代码箭头函数重载的一种写法：

```ts
const is: {
  (name: string, state: boolean | undefined): string;
  (name: string): string;
} = (name: string, ...args: [boolean | undefined] | []) => {
  const state = args.length >= 1 ? args[0]! : true;
  return name && state ? `${statePrefix}${name}` : '';
};
```

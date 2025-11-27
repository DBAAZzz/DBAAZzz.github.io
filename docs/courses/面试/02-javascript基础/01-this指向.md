---
title: this 指向
author: DBAAZzz
date: 2025/11/27 18:00
categories:
  - 面试
tags:
  - this
---

## this 的本质

**`this` 是函数运行时的执行上下文**，它的指向是在函数调用时确定的，而不是在函数定义时确定的。

## this 的五种绑定规则

- 默认绑定（独立函数调用）

```javascript
function foo() {
  console.log(this) // 非严格模式: window, 严格模式: undefined
}
foo()

var a = 1
function bar() {
  console.log(this.a) // 非严格模式: 1, 严格模式: 报错
}
bar()
```

- 隐式绑定（对象方法调用）

```javascript
const obj = {
  name: 'Alice',
  sayName: function () {
    console.log(this.name)
  },
}
obj.sayName() // this指向obj，输出'Alice'

// 隐式丢失问题
const fn = obj.sayName
fn() // this 指向 window (非严格模式)或 undefined (严格模式)

// 回调函数中的隐式丢失
setTimeout(obj.sayName, 1000) // this丢失
```

- 显式绑定（`call`/`apply`/`bind`）

```javascript
function greet() {
  console.log(this.name)
}

const person = { name: 'Bob' }

greet.call(person) // 'Bob'
greet.apply(person) // 'Bob'

const boundGreet = greet.bind(person)
boundGreet() // 'Bob'

// call和apply的区别：参数传递方式
function sum(a, b) {
  return a + b
}
sum.call(null, 1, 2) // 参数逐个传递
sum.apply(null, [1, 2]) // 参数以数组传递
```

- new 绑定（构造函数调用）

```javascript
function Person(name) {
  this.name = name
}

const p = new Person('Charlie')
console.log(p.name) // 'Charlie'

// new的执行过程:
// 1. 创建一个新对象
// 2. 将this指向这个新对象
// 3. 执行构造函数代码
// 4. 返回这个新对象（如果构造函数没有显式返回对象）
```

- 特殊：箭头函数的 this 绑定

箭头函数不遵循 `this` 绑定规则，它在定义时捕获外层 `this` 值，且无法通过 `call`/`apply`/`bind` 或 `new` 改变。

```javascript
const obj = {
  name: 'David',
  sayName: function () {
    const arrow = () => {
      console.log(this.name)
    }
    arrow()
  },
}

obj.sayName() // 'David'，箭头函数的 this 继承自外层sayName的this

// 箭头函数没有自己的this
const obj2 = {
  name: 'Eve',
  sayName: () => {
    console.log(this)
  },
}

// window 或 undefined（严格模式）
obj2.sayName()
```

## this 优先级

**new 绑定** > **显示绑定** > **隐式绑定** > **默认绑定**

```javascript
function foo() {
  console.log(this.name)
}

const obj1 = { name: 'obj1', foo }
const obj2 = { name: 'obj2' }

// 隐式绑定 vs 显式绑定
obj1.foo.call(obj2) // 'obj2'，显式绑定优先级更高

// 显式绑定 vs new绑定
const boundFoo = foo.bind(obj1)
const instance = new boundFoo() // undefined，new 绑定优先级更高
```

## 实现`call`/`apply`/`bind`

- 手写 call

```javascript
Function.prototype.myCall = function (context, ...args) {
  context = context || window
  const fn = Symbol()
  // 获取当前函数
  context[fn] = this
  const result = context[fn](...args)
  delete context[fn]
  return result
}
```

- 手写 apply

```javascript
Function.prototype.myApply = function (context, args) {
  context = context || window
  const fn = Symbol()
  context[fn] = this
  const result = args ? context[fn](...args) : context[fn]()
  delete context[fn]
  return result
}
```

- 手写 bind

```javascript
Function.prototype.myBind = function (context, ...args) {
  const fn = this
  return function (...newArgs) {
    return fn.apply(context, [...args, ...newArgs])
  }
}
```

进阶版手写 bind（支持 new 调用）

```javascript
Function.prototype.myBind = function (context, ...args) {
  const fn = this

  function boundFunction(...newArgs) {
    // 判断是否通过 new 调用
    return fn.apply(this instanceof boundFunction ? this : context, [
      ...args,
      ...newArgs,
    ])
  }

  // 继承原函数的原型链
  boundFunction.prototype = Object.create(fn.prototype)
  return boundFunction
}
```

## 引用类型和值类型

在 `JavaScript` 规范中，有两个重要概念： `Reference`（引用类型） 和 `Value`（值类型）。

- `Reference`（引用类型）
  包含三个组成部分：
  - `base`：引用所属的对象
  - `name`：属性名
  - `strict`：是否严格模式

```javascript
obj.getName
// Reference类型：
// {
//   base: obj,
//   name: 'getName',
//   strict: false
// }
```

::: tip 提示
`this` 绑定本质是 `Reference` 类型的 `thisValue` 决定的。

当函数作为对象属性被调用（如 `obj.fn()`）时，`Reference` 的 `base` 值为 obj；

独立调用时 `base` 为 `undefined`，最终通过 `GetValue` 操作确定 `this`。

箭头函数没有 `Reference` 绑定，直接继承词法作用域的 `this`。
:::

- Value（值类型）

就是纯粹的函数对象本身，没有 base 信息

```javascript
obj.getName = obj.getName
// 返回的是Value类型：
// function() { return this.name; }
// 没有base对象信息
```

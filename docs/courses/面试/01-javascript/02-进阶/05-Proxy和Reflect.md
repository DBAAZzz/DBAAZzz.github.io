---
title: Proxy和Reflect
author: DBAAZzz
date: 2025/11/24 23:21
categories:
  - 面试
tags:
  - Proxy
  - Reflect
  - 元编程
---

## Proxy

`Proxy` 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

::: tip 提示
`Proxy` 比 `Object.defineProperty` 性能稍差，但提供更强大的拦截能力。

在 Vue 3 中虽然用 Proxy，但会通过合理设计减少不必要的触发。
:::

语法：

```javascript
const p = new Proxy(target, handler)
```

举例：

```javascript
const target = {
  name: 'Alice',
  age: 25,
}

const handler = {
  get(target, property, receiver) {
    console.log(`读取属性: ${property}`)
    return target[property]
  },
  set(target, property, value, receiver) {
    console.log(`设置属性: ${property} = ${value}`)
    target[property] = value
    return true
  },
}

const proxy = new Proxy(target, handler)

proxy.name // 输出: 读取属性: name
proxy.age = 30 // 输出: 设置属性: age = 30

target.age // 30 操作已经被正确地转发
```

常见的 `Proxy` 捕获器（`traps`）包括：

- `get`: 拦截属性读取
- `set`: 拦截属性赋值
- `has`: 拦截 in 操作符
- `deleteProperty`: 拦截 delete 操作
- `apply`: 拦截函数调用
- `construct`: 拦截构造函数调用
- `getPrototypeOf`: 拦截 `Object.getPrototypeOf` 调用
- `setPrototypeOf`: 拦截 `Object.setPrototypeOf` 调用
- `ownKeys`: 拦截 `Object.getOwnPropertyNames` 和 `Object.keys` 调用

```javascript
const handler = {
  has(target, property) {
    console.log(`检查属性是否存在: ${property}`)
    return property in target
  },
  deleteProperty(target, property) {
    console.log(`删除属性: ${property}`)
    delete target[property]
    return true
  },
  apply(target, thisArg, argumentsList) {
    console.log(`调用函数: ${target.name}，参数: ${argumentsList}`)
    return target.apply(thisArg, argumentsList)
  },
  construct(target, args) {
    console.log(`使用 new 调用构造函数: ${target.name}，参数: ${args}`)
    return new target(...args)
  },
  // const proxy = new Proxy(obj, handler);
  // const proto = Object.getPrototypeOf(proxy);
  getPrototypeOf(target) {
    console.log(`获取原型: ${target}`)
    return Object.getPrototypeOf(target)
  },
  // const proxy = new Proxy(obj, handler);
  // Object.setPrototypeOf(proxy, Object.prototype); // 成功
  setPrototypeOf(target, proto) {
    console.log(`设置原型: ${proto}`)
    Object.setPrototypeOf(target, proto)
    return true
  },
  // const proxy = new Proxy(user, handler);
  // console.log(Object.keys(proxy));       // ["name", "age"]
  // console.log(Object.getOwnPropertyNames(proxy)); // ["name", "age"]
  // console.log(Reflect.ownKeys(proxy));   // ["name", "age"]
  ownKeys(target) {
    console.log(`获取所有属性键`)
    return Object.keys(target)
  },
}
```

## Reflect

`Reflect` 是一个内置对象，提供了拦截 JavaScript 操作的方法。这些方法与 `Proxy` 的 `handler` 方法一一对应，用于在 `Proxy` 捕获器中调用默认行为。

`Reflect` 的所有属性和方法都是静态的（就像 `Math` 对象），不能使用 `new` 操作符进行调用。

- `Object[指定方法]` 方法（如 `Object.defineProperty`）在失败时可能抛出异常（如定义不可扩展对象属性）。
- 而 `Reflect[指定方法]` 统一返回布尔值，更适合程序化控制流。

### Reflect 常用方法示例

- `Reflect.apply(target, thisArgument, argumentsList)`

  调用函数并传入参数数组，等价于 `Function.prototype.apply`。

  ```javascript
  function sum(a, b) {
    return a + b
  }
  const result = Reflect.apply(sum, null, [1, 2]) // 3
  ```

- `Reflect.construct(target, argumentsList[, newTarget])`  
  使用构造函数创建实例，等价于 `new target(...argumentsList)`。

  ```javascript
  function Person(name) {
    this.name = name
  }
  const p = Reflect.construct(Person, ['Alice'])
  // p instanceof Person -> true
  ```

- `Reflect.defineProperty(target, propertyKey, attributes)`  
  定义或修改属性描述符，成功返回 true（类似 `Object.defineProperty`）。

  ```javascript
  const obj = {}
  Reflect.defineProperty(obj, 'x', {
    value: 1,
    writable: true,
    configurable: true,
  })
  // obj.x -> 1
  ```

- `Reflect.deleteProperty(target, propertyKey)`  
  删除对象属性，返回删除是否成功（类似 `delete` 操作符）。

  ```javascript
  const obj = { a: 1 }
  Reflect.deleteProperty(obj, 'a') // true
  // obj.a -> undefined
  ```

- `Reflect.get(target, propertyKey[, receiver])`  
  获取属性值，行为与标准属性访问一致，可传入 `receiver` 用于 `getter` 的 `this`。

  ```javascript
  const obj = { a: 1 }
  Reflect.get(obj, 'a') // 1
  ```

- `Reflect.getOwnPropertyDescriptor(target, propertyKey)`  
  返回属性的描述符，若不存在则返回 `undefined`（类似 `Object.getOwnPropertyDescriptor`）。

  ```javascript
  const desc = Reflect.getOwnPropertyDescriptor({ x: 1 }, 'x')
  // desc -> { value: 1, writable: true, enumerable: true, configurable: true }
  ```

- `Reflect.getPrototypeOf(target)`  
  获取对象原型（类似 `Object.getPrototypeOf`）。

  ```javascript
  Reflect.getPrototypeOf([]) === Array.prototype // true
  ```

- `Reflect.has(target, propertyKey)`  
  检查属性是否存在，等价于 `in` 操作符。

  ```javascript
  Reflect.has({ a: 1 }, 'a') // true
  ```

- `Reflect.isExtensible(target)`  
  判断对象是否可扩展（类似 `Object.isExtensible`）。

  ```javascript
  const o = {}
  Reflect.isExtensible(o) // true
  Object.preventExtensions(o)
  Reflect.isExtensible(o) // false
  ```

- `Reflect.ownKeys(target)`
  返回对象自身的所有键（包括不可枚举和符号键），类似于 `Object.getOwnPropertyNames` + `Object.getOwnPropertySymbols`。

  ```javascript
  Reflect.ownKeys({ a: 1, [Symbol('s')]: 2 }) // ['a', Symbol(s)]
  ```

- `Reflect.preventExtensions(target)`  
  禁止对象新增属性，返回布尔表示是否成功。

  ```javascript
  const o = {}
  Reflect.preventExtensions(o) // true
  ```

- `Reflect.set(target, propertyKey, value[, receiver])`  
  设置属性值，返回布尔表示是否成功；receiver 可用于 `setter` 的 `this`。

  ```javascript
  const obj = {}
  Reflect.set(obj, 'x', 42) // true
  // obj.x -> 42
  ```

- `Reflect.setPrototypeOf(target, prototype)`  
  设置对象原型，返回 `Boolean` 表示是否成功（类似 `Object.setPrototypeOf`）。

  ```javascript
  const o = {}
  Reflect.setPrototypeOf(o, Array.prototype) // true
  // Object.getPrototypeOf(o) === Array.prototype
  ```

使用场景：在 Proxy 的捕获器中可通过 Reflect 调用默认行为，也可在需要以函数形式操作对象元行为时直接使用 Reflect 方法（它们与内建操作一一对应并返回布尔/结果，便于在程序中做条件判断）。

## Reflect 解决了哪些问题？

### this 指向问题

```javascript
const target = {
  _value: 100,
  get value() {
    return this._value
  },
}

// ❌ 错误方式：不使用 Reflect
const proxy = new Proxy(target, {
  get(target, property) {
    return target[property] // this 指向 target
  },
})

// 当有继承关系时出现问题
const child = Object.create(proxy)
child._value = 200

console.log(child.value) // 期望 200，实际得到 100
```

```javascript
// ✅ 正确方式：使用 Reflect
const proxy = new Proxy(target, {
  get(target, property, receiver) {
    return Reflect.get(target, property, receiver) // this 指向 receiver
  },
})

const child = Object.create(proxy)
child._value = 200

console.log(child.value) // 正确得到 200
```

原因：`Reflect.get` 的第三个参数 `receiver` 确保了 `getter` 中的 `this` 指向正确的对象（代理对象或其继承者），而不是原始目标对象。

### 无法正确处理操作失败

```javascript
const handler = {
  // ❌ 不使用 Reflect
  set(target, property, value) {
    if (typeof value !== 'number') {
      throw new TypeError('必须是数字')
    }
    target[property] = value
    return true // 手动返回
  },
}

// ✅ 使用 Reflect
const handler2 = {
  set(target, property, value) {
    if (typeof value !== 'number') {
      return false // Reflect.set 会返回操作是否成功
    }
    return Reflect.set(target, property, value)
  },
}
```

### 代码不够优雅和统一

```javascript
const handler = {
  // ❌ 不使用 Reflect：需要处理各种边界情况
  get(target, property) {
    if (property === 'prototype') {
      return Object.getPrototypeOf(target)
    }
    return target[property]
  },

  // ✅ 使用 Reflect：简洁统一
  get(target, property, receiver) {
    // 自动处理各种情况
    return Reflect.get(target, property, receiver)
  },
}
```

### 无法正确代理某些内置对象

```javascript
const map = new Map([['key', 'value']])

// ❌ 不使用 Reflect
const proxy1 = new Proxy(map, {
  get(target, property) {
    const value = target[property]
    if (typeof value === 'function') {
      return value.bind(target) // this 绑定到 target
    }
    return value
  },
})

// ✅ 使用 Reflect
const proxy2 = new Proxy(map, {
  get(target, property, receiver) {
    const value = Reflect.get(target, property, receiver)
    if (typeof value === 'function') {
      return value.bind(target)
    }
    return value
  },
})
```

## Revocable Proxy

`Proxy.revocable()` 方法可以用来创建一个可撤销的代理对象。

```javascript
const { proxy, revoke } = Proxy.revocable(
  {},
  {
    get(target, name) {
      return '[[' + name + ']]'
    },
  }
)
// 使用proxy
const proxy = revocable.proxy
proxy.foo // "[[foo]]"

revoke() // 之后所有操作抛出 TypeError
```

适用于临时权限、安全沙箱场景。

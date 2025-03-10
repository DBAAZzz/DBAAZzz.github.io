---
title: 实现一个简易的reactive
author: DBAAZzz
date: 2024/12/18 15:48
categories:
  - vue3
tags:
  - reactivity
---

# 简易的 reactive 的实现

响应式思路：

1、定义某个数据为响应式数据，它会拥有收集访问它的函数的能力。**「依赖收集」**

2、定义观察函数（`effect`），在这个函数内部去访问响应式数据，访问到响应式数据的某个 key 的时候，会建立一个依赖关系 **key -> reaction** 观察函数。

3、检测到响应式数据的 key 的值更新的时候，会去重新执行一遍它所收集的所有 reaction 观察函数。

```tsx
const num = reactive({ a: 1, b: 2 })

effect(() => {
  console.log(num.a)
})

effect(() => {
  console.log(num.b)
})

<template>
  <div>
    {{num.a}}
  </div>
</template>

// 收集到的数据格式应该是：

// reactiveMap = {
//   [object Object]: {
//      [key]: new Set()
//   }
// }

// reactiveMap = {
//   num: {
//      a: [sideEffect, sideEffect],
//      b: [sideEffect]
//   }
// }
```

让我们停下来重新思考，reactive 中需要收集访问该对象的函数，在 reactive 函数中如何获取这个关键的函数呢？

effect 函数接受一个回调函数，当回调函数运行时，如果它访问了响应式数据，reactive 就会将该回调函数收集起来，用于后续的依赖追踪。

在执行回调函数之前，我们可以设置一个全局变量 activeEffect，将当前即将执行的副作用函数赋值给它。在响应式对象的 get 操作中，借助 activeEffect 收集依赖。回调函数执行完毕后，立即将 activeEffect 重置为 null，以避免影响其他依赖的收集过程。

## reactive 的实现

```ts
const reactive = new Proxy(raw, baseHandlers)
```

这个 `baseHandlers` 里就是对于数据的 get、set 之类的劫持。

这里有两个 WeakMap： proxyToRaw 和 rawToProxy，
可以看到在定义响应式数据为一个 Proxy 的时候，会进行一个双向的存储，
这样后续无论是拿到原始对象还是拿到响应式 proxy，都可以很容易的拿到它们的另一半。

```ts
import { proxyToRaw, rawToProxy, shouldInstrument } from '@/internals'
import { getHandlers } from '@/handlers'
import { Raw, ReactiveProxy } from 'types'
import { storeObservable } from '@/store'

export function reactive<T extends Raw>(raw: T): T {
  // 已经被定义成响应式proxy了 或者传入的是内置对象 就直接原封不动的返回
  if (proxyToRaw.has(raw) || !shouldInstrument(raw)) {
    return raw
  }

  // 如果这个原始对象已经被定义过响应式 就返回存储的响应式proxy
  const existProxy = rawToProxy.get(raw)
  if (existProxy) {
    return existProxy as T
  }

  // 新建响应式proxy
  return createReactive(raw)
}

function createReactive<T extends Raw>(raw: T): T {
  const reactive = new Proxy(raw, getHandlers(raw))

  // 双向存储原始值和响应式proxy的映射
  rawToProxy.set(raw, reactive)
  proxyToRaw.set(reactive, raw)

  // 建立一个映射
  // 原始值 -> 存储这个原始值的各个key收集到的依赖函数的Map
  // 也就是上文中 reactiveMap 数据结构的key
  storeObservable(raw)

  // 返回响应式proxy
  return reactive as T
}

export function raw<T extends ReactiveProxy>(proxy: T) {
  return proxyToRaw.get(proxy) as T
}
```

proxy 代理的 getHandlers 处理

```ts
const wellKnownSymbols = new Set(
  Object.getOwnPropertyNames(Symbol)
    .map((key) => Symbol[key])
    .filter((value) => typeof value === 'symbol')
)

/** 劫持get访问 收集依赖 */
function get(target: Raw, key: Key, receiver: ReactiveProxy) {
  const result = Reflect.get(target, key, receiver)
  // 内置的Symbol不观察
  if (typeof key === 'symbol' && wellKnownSymbols.has(key)) {
    return result
  }
  // 收集依赖
  registerRunningReaction({ target, key, receiver, type: 'get' })

  // 如果访问的是对象 则返回这个对象的响应式proxy
  // 如果没有就重新调用reactive新建一个proxy
  const reativeResult = rawToProxy.get(result)
  if (isObject(result)) {
    if (reativeResult) {
      return reativeResult
    }
    return reactive(result)
  }

  return result
}

/** 劫持一些遍历访问 比如Object.keys */
function ownKeys(target: Raw) {
  registerRunningReaction({ target, type: 'iterate' })
  return Reflect.ownKeys(target)
}

/** 劫持set访问 触发收集到的观察函数 */
function set(target: Raw, key: Key, value: any, receiver: ReactiveProxy) {
  // 确保原始值里不要被响应式对象污染
  if (isObject(value)) {
    value = proxyToRaw.get(value) || value
  }
  // 先检查一下这个key是不是新增的
  const hadKey = hasOwnProperty.call(target, key)
  // 拿到旧值
  const oldValue = target[key]
  // 设置新值
  const result = Reflect.set(target, key, value, receiver)

  if (!hadKey) {
    // 新增key值时以type: add触发观察函数
    queueReactionsForOperation({ target, key, value, receiver, type: 'add' })
  } else if (value !== oldValue) {
    // 已存在的key的值发生变化时以type: set触发观察函数
    queueReactionsForOperation({
      target,
      key,
      value,
      oldValue,
      receiver,
      type: 'set',
    })
  }

  return result
}

/** 劫持删除操作 触发收集到的观察函数 */
function deleteProperty(target: Raw, key: Key) {
  // 先检查一下是否存在这个key
  const hadKey = hasOwnProperty.call(target, key)
  // 拿到旧值
  const oldValue = target[key]
  // 删除这个属性
  const result = Reflect.deleteProperty(target, key)
  // 只有这个key存在的时候才触发更新
  if (hadKey) {
    // type为delete的话 会触发遍历相关的观察函数更新
    queueReactionsForOperation({ target, key, oldValue, type: 'delete' })
  }
  return result
}

export const baseHandlers = {
  get,
  set,
  ownKeys,
  deleteProperty,
}
```

```ts
/** 值更新时触发观察函数 */
export function queueReactionsForOperation(operation: Operation) {
  getReactionsForOperation(operation).forEach((reaction) => reaction())
}
```

get 就是收集访问该响应式数据的 effect 回调函数，set 则是触发之前收集到的 effect 回调函数

## effect 函数的实现

```ts
let activeEffect = null

export function effect(fn: Function): ReactionFunction {
  const reactEffect = new ReactiveEffect(fn)
  reactEffect.run() //第一次立刻执行副作用函数

  // 先执行一遍reaction
  reaction()

  // 返回出去 让外部也可以手动调用
  return reaction
}

//存放副作用的类
class ReactiveEffect {
  constructor(fn, scheduler) {
    this.fn = fn
    this.scheduler = scheduler //调度器
  }
  run() {
    try {
      //执行之前先修改activeEffect
      activeEffect = this
      return this.fn()
    } finally {
      //执行完设置activeEffect为null
      activeEffect = null
    }
  }
}
```

## 参考

[带你彻底搞懂 Vue3 的 Proxy 响应式原理！TypeScript 从零实现基于 Proxy 的响应式库](https://pjuejin.cn/post/6844904050014552072#heading-14)

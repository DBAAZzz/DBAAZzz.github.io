---
title: Promise 的实现原理
date: 2025/12/05 00:20
categories:
  - 面试
tags:
  - promise
---

## Promise 的实现原理

### promise 的产生

我们可以想象这样一种应用场景，需要连续执行两个或者多个异步操作，每一个后来的操作都在前面的操作执行成功之后，带着上一步操作所返回的结果开始执行

在过去，我们会做多重的异步操作，比如

```js
doFirstThing((firstResult) => {
  doSecondThing(firstResult, (secondResult) => {
    console.log(`The secondResult is:` + secondResult)
  })
})
```

这种多层嵌套来解决一个异步操作依赖前一个异步操作的需求，不仅层次不够清晰，当异步操作过多时，还会出现经典的回调地狱。

那正确的打开方式是怎样的呢？Promise 提供了一个解决上述问题的模式，我们先回到上面那个多层异步嵌套的问题，接下来转变为 Promise 的实现方式：

```js
function doFirstThing() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('获取第一个数据')
      let firstResult = 3 + 4
      resolve(firstResult)
    }, 400)
  })
}

function doSecondThing(firstResult) {
  console.log('获取第二个数据')
  let secondResult = firstResult * 5
  return secondResult
}

doFirstThing()
  .then((firstResult) => doSecondThing(firstResult))
  .then((secondResult) => {
    console.log(`The secondResult Result: ${secondResult}`)
  })
  .catch((err) => {
    console.log('err', err)
  })
```

### Promise 到底是什么

promsie 是对异步编程的一种抽象，是一个代理对象，代表一个必须进行异步处理的函数返回的值或抛出的异常

简单来说，Promise 主要就是为了解决异步回调的问题，正如上面的例子所示

可以将异步对象和回调函数脱离开来，通过 then 方法在这个异步操作上绑定回调函数

用 Promise 来处理异步回调函数使得代码更加清晰，便于理解，且更加容易维护，目前其主流规范主要是 Promise/A+ ，下面介绍具体的 API

### Promise/A+ 规范

Promise 规范内容很多，我们挑几个简单的说明下：

1. Promise 本身是一个状态机，每一个 Promise 实例只能有 3 个状态，pending、fulfilled、rejected，状态之间的转化只能是 `pending -> fulfilled`、`pending -> rejected`
2. Promise 有一个 then 方法，该方法可以被调用多次，并且返回一个 Promise 对象
3. 支持链式调用
4. 内存保存有一个 value 值，用来保存上次执行的结果值，如果报错，则保存的是异常信息

### 手写 Promise 全解

实现一个符合 Promise/A+ 规范的 Promise 是高级前端面试中的高频考题。我们需要掌握其核心逻辑：**状态管理**、**发布订阅模式**以及**链式调用**。

#### 1. 基础骨架与状态管理

Promise 是一个类，构造函数接收一个执行器 `executor`，该执行器会立即执行。

```javascript
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor(executor) {
    // 初始化状态
    this.status = PENDING
    // 成功的值
    this.value = undefined
    // 失败的原因
    this.reason = undefined
    // 成功回调队列（发布订阅模式，支持异步）
    this.onFulfilledCallbacks = []
    // 失败回调队列
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      // 只有 pending 状态才能改变
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value
        // 执行所有订阅的成功回调
        this.onFulfilledCallbacks.forEach((fn) => fn())
      }
    }

    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        // 执行所有订阅的失败回调
        this.onRejectedCallbacks.forEach((fn) => fn())
      }
    }

    try {
      // 立即执行 executor
      executor(resolve, reject)
    } catch (error) {
      // 如果 executor 执行报错，直接 reject
      reject(error)
    }
  }
}
```

#### 2. 实现 then 方法（核心）

`then` 方法是 Promise 最复杂的部分。为了支持**链式调用**，它必须返回一个新的 Promise (`promise2`)。我们需要判断回调函数的返回值 `x` 的类型，来决定 `promise2` 的状态。

```javascript
  then(onFulfilled, onRejected) {
    // 参数校验：值穿透特性
    // 如果 onFulfilled 不是函数，则忽略它，将 value 传递下去
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    // 如果 onRejected 不是函数，则忽略它，将 error 抛出
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };

    let promise2 = new MyPromise((resolve, reject) => {
      // 封装处理函数，处理异步和异常
      const handle = (callback, data) => {
        // 规范要求：onFulfilled/onRejected 必须异步执行（微任务）
        // 这里使用 setTimeout 模拟（宏任务），实际环境可用 queueMicrotask
        setTimeout(() => {
          try {
            let x = callback(data);
            // 解析 x，决定 promise2 的状态
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      };

      if (this.status === FULFILLED) {
        handle(onFulfilled, this.value);
      } else if (this.status === REJECTED) {
        handle(onRejected, this.reason);
      } else {
        // Pending 状态，将回调保存到队列中（订阅）
        this.onFulfilledCallbacks.push(() => handle(onFulfilled, this.value));
        this.onRejectedCallbacks.push(() => handle(onRejected, this.reason));
      }
    });

    return promise2;
  }
```

#### 3. 解析过程 (Resolution Procedure)

`resolvePromise` 函数用于处理 `then` 回调的返回值 `x`。这是 Promise/A+ 规范中最细节的部分，用于兼容不同的 Promise 实现（Interop）。

```javascript
function resolvePromise(promise2, x, resolve, reject) {
  // 1. 循环引用检测：不能返回 promise2 本身
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }

  // 2. 防止多次调用（resolve 和 reject 只能调用一次）
  let called

  // 3. 判断 x 是否为对象或函数（可能是 Promise 或 thenable）
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    try {
      // 尝试取 then 方法
      let then = x.then
      if (typeof then === 'function') {
        // x 是 Promise (或 thenable)，执行它的 then
        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            // 递归解析，因为 y 可能还是 Promise
            resolvePromise(promise2, y, resolve, reject)
          },
          (r) => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        // x 是普通对象，直接成功
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    // x 是普通值，直接成功
    resolve(x)
  }
}
```

#### 4. 静态方法实现

面试中常考 `Promise.all` 和 `Promise.race`。

**Promise.resolve**

```javascript
MyPromise.resolve = function (value) {
  return new MyPromise((resolve, reject) => {
    resolve(value)
  })
}
```

**Promise.reject**

```javascript
MyPromise.reject = function (reason) {
  return new MyPromise((resolve, reject) => {
    reject(reason)
  })
}
```

**Promise.all**

特点：

1. 接收一个 Promise 数组（或可迭代对象）。
2. 返回一个新的 Promise。
3. 只有所有 Promise 都成功，才返回成功（结果数组）。
4. 只要有一个失败，就立即返回失败（第一个失败的原因）。

```javascript
MyPromise.all = function (promises) {
  return new MyPromise((resolve, reject) => {
    let arr = []
    let count = 0

    if (promises.length === 0) {
      resolve(arr)
      return
    }

    promises.forEach((item, i) => {
      // item 可能不是 Promise，需要用 MyPromise.resolve 包装
      MyPromise.resolve(item).then((data) => {
        arr[i] = data // 保证结果顺序与入参顺序一致
        count++
        if (count === promises.length) {
          resolve(arr)
        }
      }, reject) // 只要有一个失败，直接 reject
    })
  })
}
```

**Promise.race**

特点：谁快谁先回（无论是成功还是失败）。

```javascript
MyPromise.race = function (promises) {
  return new MyPromise((resolve, reject) => {
    promises.forEach((item) => {
      MyPromise.resolve(item).then(resolve, reject)
    })
  })
}
```

#### 5. 实例方法实现

**catch**

`catch` 本质上就是 `then(null, onRejected)` 的语法糖。

```javascript
MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}
```

**finally**

特点：无论成功还是失败都会执行，且不接收参数，通常用于清理工作。`finally` 后面的 `then` 会接收到前面的值（如果是成功）或错误（如果是失败）。

```javascript
MyPromise.prototype.finally = function (callback) {
  return this.then(
    (value) => MyPromise.resolve(callback()).then(() => value),
    (reason) =>
      MyPromise.resolve(callback()).then(() => {
        throw reason
      })
  )
}
```

### 总结

实现 Promise 的关键点回顾：

1.  **状态机**：严格控制状态流转 (`pending` -> `fulfilled` / `rejected`)。
2.  **异步队列**：使用数组存储 `pending` 状态下的回调，实现发布订阅。
3.  **链式调用**：`then` 必须返回新的 Promise，并利用 `resolvePromise` 递归处理返回值，确保能处理返回 Promise 的情况。
4.  **微任务**：规范要求 `then` 的回调是微任务，手写时常用 `setTimeout` 模拟，实际可用 `queueMicrotask` 或 `MutationObserver`。

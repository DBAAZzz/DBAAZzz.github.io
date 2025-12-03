---
title: Generator与Iterator
author: DBAAZzz
date: 2025/11/25 17:30
categories:
  - 面试
tags:
  - Generator
  - Iterator
  - 迭代器
---

## Iterator

`Iterator` 是一种接口规范，任何实现了 `next()` 方法的对象都是迭代器。`next()` 方法返回 `{value: any, done: boolean}` 格式的对象。

```javascript
// 手动实现一个迭代器
const myIterator = {
  current: 0,
  last: 5,
  next() {
    if (this.current <= this.last) {
      return { value: this.current++, done: false };
    }
    return { value: undefined, done: true };
  },
};

console.log(myIterator.next()); // {value: 0, done: false}
console.log(myIterator.next()); // {value: 1, done: false}
```

## Generator

`Generator` 是创建迭代器的便捷方式，通过 `function*` 语法定义，使用 `yield` 关键字暂停和恢复执行。

- `yield` 表达式会暂停执行并返回一个值
- `next(value)` 方法会恢复执行并向 `yield` 表达式传入一个值

```javascript
function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numberGenerator();
console.log(gen.next()); // {value: 1, done: false}
console.log(gen.next()); // {value: 2, done: false}
```

```javascript
function* dataProcessPipeline() {
  console.log("步骤1：开始处理");
  const rawData = yield fetch("/api/data"); // 这里 yield 返回的值就是 next() 传入的值
  // ...
}

// 外部控制器
async function controller() {
  const gen = dataProcessPipeline();

  // 步骤1：启动 generator，执行到第一个 yield
  let result = gen.next(); // result.value 是 fetch("/api/data") 的 Promise
  const data = await result.value; // 等待 fetch 完成

  // 步骤2：恢复执行，并将 data 传递给 rawData 变量
  result = gen.next(data); // 这里的 data 会成为上面 yield 表达式的返回值
}
```

### 核心特性

`Generator` 的三大能力：

1. 惰性求值：只在需要时才计算下一个值
2. 状态保持：函数执行可以暂停并保存状态
3. 双向通信：可以通过 `next(value)` 向 `Generator` 内部传值

## Generator 的使用场景

`Generator` 的核心优势是可暂停与可控制。

- 手动控制执行流程

  这是 `Generator` 最独特的能力 - 外部可以控制函数的执行节奏。

  ```javascript
  // 场景：需要在异步操作间插入条件判断或用户交互
  function* dataProcessPipeline() {
    console.log("步骤1：开始处理");
    const rawData = yield fetch("/api/data");

    console.log("步骤2：等待用户确认是否继续");
    const userConfirm = yield "WAIT_USER_CONFIRM"; // 暂停，等待外部控制

    if (!userConfirm) {
      return "用户取消";
    }

    console.log("步骤3：数据转换");
    const processed = yield transformData(rawData);

    console.log("步骤4：保存");
    yield saveData(processed);

    return "完成";
  }

  // 外部控制器
  async function controller() {
    const gen = dataProcessPipeline();

    // 步骤1
    let result = gen.next();
    const data = await result.value;

    // 步骤2 - 暂停，显示确认对话框
    result = gen.next(data);
    const userConfirmed = await showConfirmDialog("是否继续？");

    // 根据用户选择决定是否继续
    if (userConfirmed) {
      result = gen.next(true);
      // ... 继续执行
    } else {
      gen.return("用户取消"); // 可以随时终止
    }
  }
  ```

  用 `async/await` 无法做到：

  ```javascript
  // async 函数一旦开始就停不下来
  async function asyncVersion() {
    const rawData = await fetch("/api/data");
    // ❌ 这里无法暂停等待外部条件
    // 只能在函数内部 await 一个 Promise
    const processed = await transformData(rawData);
    await saveData(processed);
  }
  ```

### Generator 的独特价值

1. 延迟决策：可以在执行中途改变后续逻辑
2. 声明式副作用：`yield call(fn)` 只是描述要做什么，不立即执行
3. 统一错误处理：所有 `yield` 的错误都可在一处捕获
4. 时间旅行：理论上可以记录每一步，实现重放

`Generator` 在复杂异步编排中的核心价值是可控制性 - 能在函数外部精确控制执行流程，这是 `async/await` 做不到的。虽然 `90%` 的场景 `async/await` 足够，但在需要**暂停**、**取消**、**竞态处理**、**复杂测试**的场景下，`Generator`（特别是 `Redux-Saga`）仍然是最优雅的方案。

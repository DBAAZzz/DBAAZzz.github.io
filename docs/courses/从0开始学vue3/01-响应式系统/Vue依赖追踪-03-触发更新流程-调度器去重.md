---
title: Vue 3 依赖追踪原理(三)：触发更新流程 - 调度器去重机制
author: DBAAZzz
date: 2025/12/30
categories:
  - vue3
tags:
  - reactivity
  - source-code
  - scheduler
---

# Vue 3 依赖追踪进阶：调度器去重机制

> 在上一篇文章中，我们提到了对于“渲染副作用（Render Effect）”，Vue 会通过**调度器（Scheduler）**来实现跨多个同步操作的最终去重。

很多开发者认为去重是通过遍历任务数组（`queue.includes(job)`）来实现的，但这种方式的时间复杂度是`O(n)`。

Vue 内部为了极致的性能，采用了基于**位运算的标志位**来实现`O(1)`的去重。

本文将详细拆解 `queueJob` 的核心逻辑。

---

## 一、`queueJob` 的核心逻辑

当数据发生变化触发调度器时，Vue 会调用 `queueJob`。

```typescript
// packages/runtime-core/src/scheduler.ts
export function queueJob(job: SchedulerJob): void {
  // ⭐ 去重核心：检查 QUEUED 标志位
  if (!(job.flags! & SchedulerJobFlags.QUEUED)) {
    const jobId = getId(job);
    const lastJob = queue[queue.length - 1];

    // 插入逻辑：保持队列按 id 排序
    if (
      !lastJob ||
      // 快速路径：新 job 的 id 大于队尾
      (!(job.flags! & SchedulerJobFlags.PRE) && jobId >= getId(lastJob))
    ) {
      queue.push(job);
    } else {
      // 否则使用二分查找，将 job 插入到合适的位置
      queue.splice(findInsertionIndex(jobId), 0, job);
    }

    // ⭐ 入队后立即设置 QUEUED 标志
    job.flags! |= SchedulerJobFlags.QUEUED;

    // 开启微任务刷新队列
    queueFlush();
  }
}
```

---

## 二、去重机制详解

### 1. 使用标志位去重

Vue 为每个 `SchedulerJob` 定义了位掩码标志位：

```typescript
// SchedulerJobFlags 枚举
export enum SchedulerJobFlags {
  QUEUED = 1 << 0, // ⭐ 已入队标志
  PRE = 1 << 1, // pre 钩子标志（如 watch 的 flush: 'pre'）
  ALLOW_RECURSE = 1 << 2, // 允许递归执行
  DISPOSED = 1 << 3, // 已销毁
}
```

**去重判断逻辑：**

```typescript
if (!(job.flags! & SchedulerJobFlags.QUEUED)) {
  // 如果没有 QUEUED 标志，说明不在队列中，可以入队
  job.flags! |= SchedulerJobFlags.QUEUED; // 入队后立即“上锁”
}
```

**性能优势**：

- **时间复杂度：`O(1)`**。无论队列中有 10 个还是 1000 个任务，判断是否重复只需要一次位运算。

---

### 2. ID 排序与二分寻找

除了去重，`queueJob` 还通过 `id` 保持队列有序：

```typescript
const jobId = getId(job);
const lastJob = queue[queue.length - 1];

// 快速路径：如果新任务 id >= 队尾 id，直接 push
if (!lastJob || jobId >= getId(lastJob)) {
  queue.push(job);
} else {
  // 慢速路径：二分查找插入位置，保证队列有序
  queue.splice(findInsertionIndex(jobId), 0, job);
}
```

**排序的意义：**

1.  **先父后子**：父组件的 `id` 小于子组件。排序保证了父组件先更新，避免子组件在父组件销毁后还进行无谓的更新。
2.  **正确执行生命周期**：确保渲染流程符合组件树的层级顺序。

---

## 三、`queueFlush`：异步防抖调度

在 `queueJob` 的结尾，会调用一个关键函数：`queueFlush()`。它的职责是**防抖调度**，确保刷新队列的任务在同一个“Tick”内只被创建一次。

### 1. 核心代码

```typescript
// packages/runtime-core/src/scheduler.ts
let currentFlushPromise: Promise<void> | null = null;
const resolvedPromise = Promise.resolve() as Promise<any>;

function queueFlush() {
  // ⭐ 防抖核心：检查 currentFlushPromise 是否已存在
  if (!currentFlushPromise) {
    // 如果不存在，创建一个微任务，并缓存该 Promise
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
```

### 2. 执行时序详解

`queueFlush` 不会阻塞 `dep.notify()`。所有 Effect 收集完毕后，微任务阶段才会执行 `flushJobs()`。

```javascript
// 同步代码开始
state.count++; // 第 1 次修改

// ├─ trigger() 调用
// │   ├─ dep.notify()
// │   │   ├─ effect1.notify() -> queueJob(effect1)
// │   │   │   ├─ 入队: [effect1]
// │   │   │   └─ queueFlush() -> 创建微任务 #1 (Promise.then)
// │   │   ├─ effect2.notify() -> queueJob(effect2)
// │   │   │   ├─ 入队: [effect1, effect2]
// │   │   │   └─ queueFlush() -> ⭐ 防抖：currentFlushPromise 已存在，跳过
// ...
// ✅ 同步代码执行完毕

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 微任务队列开始执行（浏览器事件循环）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// └─ flushJobs()  ← 唯一一次执行，处理队列中所有的 effect1, effect2...
```

### 3. 为什么需要防抖？

如果没有 `currentFlushPromise` 的检查，连续 100 次 `state.count++` 会创建 100 个 `Promise.then` 回调。虽然第 2-100 个回调执行时队列可能已经空了，但频繁地往微任务队列里塞任务会造成不必要的调度开销和性能抖动。

---

## 四、`flushJobs`：队列刷新任务

`flushJobs` 是调度器中负责执行任务队列的函数，在大规模更新时，它通过遍历和递归保证了任务的有序执行。

### 1. 核心逻辑拆解

```typescript
// packages/runtime-core/src/scheduler.ts
function flushJobs(seen?: CountMap) {
  // 1. 开发环境下的递归检测逻辑
  if (__DEV__) seen = seen || new Map()

  try {
    // 2. ⭐ 核心循环：遍历队列并执行 Job
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex]
      if (job && !(job.flags! & SchedulerJobFlags.DISPOSED)) {

        // 允许递归的 job：在执行前先清除 QUEUED 标志
        if (job.flags! & SchedulerJobFlags.ALLOW_RECURSE) {
          job.flags! &= ~SchedulerJobFlags.QUEUED
        }

        // ⭐ 真正调用 Job 函数 (即 Effect.run)
        callWithErrorHandling(job, ...)

        // 普通 job：在执行结束后才清除 QUEUED 标志
        if (!(job.flags! & SchedulerJobFlags.ALLOW_RECURSE)) {
          job.flags! &= ~SchedulerJobFlags.QUEUED
        }
      }
    }
  } finally {
    // 3. 状态重置
    flushIndex = -1
    queue.length = 0

    // 4. 执行 PostFlush 回调
    flushPostFlushCbs(seen)

    // 5. 释放微任务锁
    currentFlushPromise = null

    // 6. ⭐ 循环检查：
    // 如果在执行过程中产生了新的任务，递归调用以清空队列
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs(seen)
    }
  }
}
```

### 2. 回调注册时机

在 `queueFlush` 中，`flushJobs` 被作为回调函数注册到 Promise 的任务项中。

```javascript
function queueFlush() {
  if (!currentFlushPromise) {
    // ⭐ 建立微任务关联
    // 将 flushJobs 引用传递给 resolvedPromise.then
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
```

**执行逻辑：**

- **同步阶段**：`queueFlush` 仅负责确保 `flushJobs` 已被加入微任务队列。
- **异步阶段**：当前宏任务执行完毕后，浏览器 JS 引擎回调 `flushJobs` 开始处理任务队列。

---

## 五、递归刷新的必要性

在 `finally` 块中递归调用 `flushJobs` 是为了处理**嵌套更新（Nested Updates）**。

当执行当前的 `job` 时，如果其逻辑又修改了响应式数据并触发了新的 `job` 入队，这些新任务会被添加到 `queue` 的末尾。`finally` 块中的检查逻辑确保了这些新任务能在当前的微任务周期内被立即处理，从而保证了状态更新的实时性与完整性。

---

## 六、完整的触发链路 (精准版)

我们将响应式底层和运行时的机制结合起来看：

1.  **数据变化**：调用 `trigger`。
2.  **响应式去重 (同步)**：`effect.notify()` 检查 `NOTIFIED` 标志位。
3.  **调度器入队 (同步)**：`queueJob(job)` 检查 `QUEUED` 标志位，入队并按 `id` 排序。
4.  **防抖调度 (同步注册)**：`queueFlush()` 检查 `currentFlushPromise`，将 `flushJobs` 注册为微任务。
5.  **微任务刷新 (异步执行)**：浏览器完成同步任务后，回调 `flushJobs`。
6.  **执行与解锁**：遍历队列，调用 `job()` 并通过位掩码清除 `QUEUED`。
7.  **递归检查**：若有嵌套更新，重复步骤 6 流程。

---

## 七、完整生命周期流程

### 1. 任务入队流程

假设我们连续修改三次数据：

```javascript
// 第 1 次修改
queueJob(effect)
  → 检查 flags & QUEUED: false
  → 入队: queue = [effect]
  → 设置标志: flags |= QUEUED
  → 触发 queueFlush() (PromisePool)

// 第 2 次修改（同一次微任务循环中）
queueJob(effect)
  → 检查 flags & QUEUED: true ⭐ 命中锁定
  → 跳过！不重复入队

// 第 3 次修改
queueJob(effect)
  → 检查 flags & QUEUED: true ⭐ 命中锁定
  → 跳过！
```

### 2. 队列刷新与解锁

当微任务（`Promise.then`）触发时，`flushJobs` 开始工作：

```typescript
// 简化后的逻辑
function flushJobs() {
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex]
      if (job) {
        // ⭐ 执行 job 之前或之后，清除标志位
        // 只有清除标志位后，该 job 未来才能再次入队
        if (job.flags! & SchedulerJobFlags.ALLOW_RECURSE) {
          job.flags! &= ~SchedulerJobFlags.QUEUED // 允许递归的预先清除
        }

        callWithErrorHandling(job, ...) // 真正执行任务

        if (!(job.flags! & SchedulerJobFlags.ALLOW_RECURSE)) {
          job.flags! &= ~SchedulerJobFlags.QUEUED // 普通任务执行后清除
        }
      }
    }
  } finally {
    // 重置状态
    queue.length = 0
    flushIndex = -1
  }
}
```

---

## 六、实战演示

```javascript
import { reactive, effect } from "vue";

const state = reactive({ count: 0 });

// 模拟 Vue 组件渲染副作用
const renderEffect = {
  id: 1,
  flags: 0,
  fn: () => console.log("Render 执行，当前值:", state.count),
};

// 代理调度器
effect(renderEffect.fn, {
  scheduler: (job) => queueJob(job),
});

// 连续执行三次同步修改
state.count++;
state.count++;
state.count++;

console.log("同步代码执行结束");

// 输出结果：
// > 同步代码执行结束
// > Render 执行，当前值: 3  ⭐ 最终只执行了一次
```

---

## 五、总结对比

| 特性         | 实现方式                 | 复杂度      | 核心目的                           |
| :----------- | :----------------------- | :---------- | :--------------------------------- |
| **去重判断** | 位运算 `flags & QUEUED`  | `O(1)`      | 极致性能，避免重复刷新             |
| **入队管理** | 数组 `push` / `splice`   | $O(n)$      | 维护任务清单                       |
| **顺序维护** | 基于 `id` 的二分查找排序 | $O(\log n)$ | 保证父子组件更新顺序               |
| **状态重置** | `flags &= ~QUEUED`       | `O(1)`      | 确保任务完成后由再次响应数据的能力 |

通过标志位判定实现的去重，体现了 Vue 源码在“如何用最少的开销完成最高频率操作”上的深刻思考。

下一篇，我们将探讨《副作用函数的执行与清理》，回到 `ReactiveEffect` 类内部看看它如何管理自己的依赖生命周期。

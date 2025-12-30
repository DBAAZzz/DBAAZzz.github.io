---
title: Vue 3 依赖追踪原理(五)：批量更新与性能优化
author: DBAAZzz
date: 2025/12/29
categories:
  - vue3
tags:
  - reactivity
  - source-code
---

# Vue 3 依赖追踪原理(五)：批量更新与性能优化

> 本文是《Vue 3 依赖追踪原理》系列的第五篇。在掌握了依赖收集和副作用执行的基本闭环后，我们需要了解 Vue 是如何处理高频更新的。为了避免“牵一发而动全身”带来的性能损耗，Vue 设计了一套精妙的批量更新和版本控制机制。

## 一、为什么需要批量更新？

试想以下场景：

```javascript
const state = reactive({ count: 0, name: "vue" });

effect(() => {
  console.log(state.count, state.name);
});

// 用户连续修改多个属性
state.count++;
state.name = "vue3";
state.count++;
```

如果没有批量更新，上述代码会触发 **3 次** Effect 执行。但在实际应用中（特别是 DOM 更新），我们往往希望无论修改多少次状态，最终只在同一个“Tick”内刷新一次视图。

Vue 3 的调度器（Scheduler）和批处理机制就是为了解决这个问题。

## 二、批量更新机制

Vue 的批量更新类似于浏览器的事件循环机制，它会将同一个 Tick 内触发的所有副作用收集起来，去重后统一执行。

### 1. 核心 API：`batch`

`batch` 函数负责将副作用加入全局的待处理队列。

```typescript
// packages/reactivity/src/effect.ts
let batchDepth = 0;
let batchedSub: Subscriber | undefined;
let batchedComputed: Subscriber | undefined;

export function batch(sub: Subscriber, isComputed = false): void {
  // 标记该 Effect 已经被通知过了，防止重复加入
  sub.flags |= EffectFlags.NOTIFIED;

  if (!batchDepth) {
    // 如果没有开启深层批处理，直接把 sub 暂存
    batchedSub = sub;
    if (isComputed) {
      batchedComputed = sub;
    }
  } else {
    // 关键：构建链表
    // 所有的待处理 sub 会通过 .next 指针串联起来，形成一个队列
    sub.next = undefined;

    // 找到当前队列的末尾，接上去
    let curr = isComputed ? batchedComputed : batchedSub;
    if (curr) {
      while (curr!.next) {
        curr = curr!.next;
      }
      curr!.next = sub;
    } else {
      // 队列为空，直接作为头部
      if (isComputed) {
        batchedComputed = sub;
      } else {
        batchedSub = sub;
      }
    }
  }
}
```

### 2. `startBatch` 与 `endBatch`

这两个函数通常成对出现，定义了一个“批处理事务”的范围。例如在 `Dep.notify` 中，就会包裹这两个函数。

```typescript
export function startBatch(): void {
  batchDepth++;
}

export function endBatch(): void {
  // 只有当 depth 归零时（最外层的 batch 结束），才真正执行
  if (--batchDepth > 0) {
    return;
  }

  // 执行所有排队的 effects
  executeBatch();
}
```

## 三、性能优化详解

除了批量更新，Vue 3 还引入了多项底层优化来减少开销。

### 1. 版本号 (Version) 机制：O(1) 脏检查

这是 Vue 3.2+ 最大的改进之一。

**问题**：在 Vue 之前或传统的响应式实现中，要判断一个 Effect 是否需要重新运行（特别是在计算属性中），通常需要遍历它的所有依赖，逐个对比值是否变化。
**解决**：Vue 3 为每个 `Dep` 增加了一个自增的 `version`。

```typescript
// 场景：计算属性检查是否需要重新计算
if (link.version !== dep.version) {
  // 这意味着自从上次 Effect 运行后，Dep 又发生过变化 (trigger)
  // 所以需要重新计算
  return true; // dirty
}
```

只需要一次整数比较，就能判断依赖是否过期，效率极高。

### 2. 双向链表 (Doubly Linked List)

在前文中反复提到的 `Link` 结构。

- **Vue 2 (Set)**: 移除依赖需要 `Set.delete(item)`，这通常是 O(1) 但哈希查找有开销，且无法保证确定性的顺序。
- **Vue 3 (Link)**: 移除依赖只需要修改 `prev` 和 `next` 指针，纯粹的 O(1) 操作，且无需哈希计算。同时，链表天然维护了依赖的**添加顺序**，这对于按顺序清理无效依赖（cleanup）至关重要。

### 3. `activeLink` 缓存

为了减少对象创建，`Dep` 实例上会缓存当前正在活动的 `Link`。

```typescript
class Dep {
  activeLink?: Link = undefined; // 缓存

  track() {
    let link = this.activeLink;
    // 如果是同一个 effect 连续访问同一个 key
    // 直接复用 link，完全跳过 new Link() 的开销
    if (link && link.sub === activeSub) {
      return link;
    }
    // ...
  }
}
```

这一优化在组件渲染等高频读取属性的场景下，显著减少了内存碎片的产生。

---

## 四、总结

Vue 3 的响应式系统不仅仅是功能的实现，更是算法层面的工程杰作：

1.  利用 **Bitwise 标志位** 管理状态，快且省内存。
2.  利用 **链表** 替代 Set/Array 管理依赖集合，优化增删性能。
3.  利用 **版本号** 替代全量比对，优化脏检查性能。
4.  利用 **批处理** 机制，避免无效的中间状态渲染。

这些优化共同造就了 Vue 3 极度高效的运行时表现。

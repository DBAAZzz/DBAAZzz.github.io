---
title: Vue 3 依赖追踪原理(四)：副作用函数的执行与清理
author: DBAAZzz
date: 2025/12/29
categories:
  - vue3
tags:
  - reactivity
  - source-code
---

# Vue 3 依赖追踪原理(四)：副作用函数的执行与清理

> 本文是《Vue 3 依赖追踪原理》系列的第四篇。前文我们从数据的角度看了依赖收集和触发，本文将以“副作用函数”（Effect）为第一视角，解析它是如何执行、如何清理过期依赖以及如何避免无限循环的。

## 一、ReactiveEffect 的生命周期

`ReactiveEffect` 是响应式系统的执行单元。无论是 `watchEffect(() => console.log(state.count))` 还是组件的渲染函数，本质上都是在运行一个 `ReactiveEffect`。

它的执行不仅仅是调用用户函数那么简单，还包含着极其重要的**环境准备**和**善后工作**。

### 核心方法：`run()`

`run()` 方法是副作用执行的主入口。

```typescript
// packages/reactivity/src/effect.ts
class ReactiveEffect {
  run(): T {
    // 1. 如果 Effect 已经失活 (stopped)，直接执行函数但不收集依赖
    if (!(this.flags & EffectFlags.ACTIVE)) {
      return this.fn();
    }

    // 2. 标记正在运行 (用于避免递归调用等)
    this.flags |= EffectFlags.RUNNING;

    // 3. 清理旧依赖 (Cleanup)
    // 注意：Vue 3.2 之前是清空所有依赖重新收集
    // Vue 3.2+ 则是通过标记法进行"差量更新"，这里仅做一些不需要的清理
    cleanupEffect(this);

    // 4. 准备依赖追踪 (Prepare)
    // 这一步非常关键：将所有当前持有依赖的 Link.version 重置为 -1
    prepareDeps(this);

    // 5. 保存并切换全局上下文
    const prevEffect = activeSub;
    const prevShouldTrack = shouldTrack;
    activeSub = this;
    shouldTrack = true;

    try {
      // 6. === 执行用户函数 ===
      // 执行过程中会触发 Proxy.get -> track -> 建立依赖连接
      // 在 track 过程中，Link.version 会被更新为 Dep.version (非 -1)
      return this.fn();
    } finally {
      // 7. 恢复环境
      if (__DEV__ && activeSub !== this) {
        warn("Active effect was not restored correctly");
      }

      // 8. 清理无效依赖 (Post-Cleanup)
      // 检查哪些 Link 的 version 依然是 -1 (说明本次执行没用到)
      // 并将其从依赖列表中移除
      cleanupDeps(this);

      // 9. 恢复上一层级的 Effect (支持嵌套 Effect)
      activeSub = prevEffect;
      shouldTrack = prevShouldTrack;
      this.flags &= ~EffectFlags.RUNNING;
    }
  }
}
```

---

## 二、依赖清理机制详解

在 Vue 2 或 Vue 3 早起版本中，每次副作用执行前，都会把旧的依赖全部断开，然后重新收集。
Vue 3.2+ 引入了**基于位图/版本号的清理机制**，性能大幅提升。

### 1. 准备阶段：`prepareDeps`

在 Effect 执行前，先把所有已存在的依赖标记为“待验证”。

```typescript
function prepareDeps(sub: Subscriber) {
  // 遍历当前 Effect 所有的依赖 Link
  for (let link = sub.deps; link; link = link.nextDep) {
    // 将版本号设为 -1
    // 意为："我不确定这轮运行还会不会用到你"
    link.version = -1;
  }
}
```

### 2. 执行阶段：验证依赖

当用户函数执行时，如果再次访问了某个属性：

1. `track` 被触发。
2. 找到已有的 `Dep` 和 `Link`。
3. `Link.version` 被更新为 `Dep.version` (不再是 -1)。

这意味着该依赖被**确认**继续有效。

### 3. 清理阶段：`cleanupDeps`

Effect 执行完毕后，扫描依赖列表，清理掉那些版本号仍为 `-1` 的 Link。这意味着这些属性在本次执行中没有被访问到（例如被 `v-if` 移除了）。

```typescript
function cleanupDeps(sub: Subscriber) {
  let link = sub.deps;
  let tail = sub.depsTail;

  while (link) {
    const next = link.nextDep;

    // 如果 version 还是 -1，说明本次没用到
    if (link.version === -1) {
      // 移除该依赖 (断开 Link)
      removeSub(link);

      // 更新链表结构...
      if (link === tail) {
        sub.deps = sub.depsTail = undefined;
        break;
      }
    } else {
      // 本次用到了，保留。
      // ...
      tail = link;
    }
    link = next;
  }

  sub.depsTail = tail;
}
```

---

## 三、如何移除订阅 (`removeSub`)

这就是双向链表发挥威力的地方。移除一个依赖只需要操作指针，不需要遍历数组。

```typescript
// packages/reactivity/src/dep.ts
function removeSub(link: Link, soft = false) {
  const { sub, dep } = link;

  // 1. 从 Dep 的订阅列表 (subs) 中移除 Link
  if (dep.subs === link) dep.subs = link.nextSub;
  if (link.prevSub) link.prevSub.nextSub = link.nextSub;
  if (link.nextSub) link.nextSub.prevSub = link.prevSub;

  dep.sc--; // 减少订阅计数

  if (!soft) {
    // 2. 从 Effect 的依赖列表 (deps) 中移除 Link
    if (sub.deps === link) sub.deps = link.nextDep;
    if (sub.depsTail === link) sub.depsTail = link.prevDep;
    if (link.prevDep) link.prevDep.nextDep = link.nextDep;
    if (link.nextDep) link.nextDep.prevDep = link.prevDep;
  }
}
```

---

## 四、总结

Vue 3 的 Effect 执行流程是一个严密的闭环：

1.  **Mark**: 执行前将所有旧依赖标记为“潜在过时” (`version = -1`)。
2.  **Run**: 运行用户代码，访问到的依赖会被重新“激活” (`version = dep.version`)。
3.  **Sweep**: 运行结束后，清除那些依然标记为“过时”的依赖。

这种机制完美解决了条件分支（如 `v-if`）导致的依赖残留问题，同时相比完全重建依赖，通过复用 Link 节点极大地减少了内存 GC 的压力。

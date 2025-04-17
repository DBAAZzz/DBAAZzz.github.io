---
title: vue3中effectScope详解
author: DBAAZzz
date: 2025/04/17 15:00
categories:
  - Vue3
tags:
  - Vue3、effectScope
---

# effectScope(官方文档)

创建一个 `effect` 作用域，可以捕获其中所创建的响应式副作用 (即**计算属性**和**侦听器**)，这样捕获到的副作用可以一起处理。

```ts
function effectScope(detached?: boolean): EffectScope;

interface EffectScope {
  run<T>(fn: () => T): T | undefined; // 如果作用域不活跃就为 undefined
  stop(): void;
}
```

示例：

```ts
const scope = effectScope();

scope.run(() => {
  const doubled = computed(() => counter.value * 2);

  watch(doubled, () => console.log(doubled.value));

  watchEffect(() => console.log("Count: ", doubled.value));
});

// 处理掉当前作用域内的所有 effect
scope.stop();
```

## 使用场景

Vue 组件的 `setup()` 函数会自动管理其中创建的响应式效果，确保组件卸载时这些效果被清理。然而，在组件外部使用响应式系统时，这些自动清理机制不再适用，可能导致内存泄漏。

`effectScope` 就是用来解决这个问题的。

它的实际应用场景包括：

1. 在组件外部创建和管理响应式逻辑，特别是当你需要在组件之外使用响应式系统时
2. 开发可复用的响应式逻辑（如自定义组合式函数），确保资源能够被正确清理
3. 将相关的响应式效果分组管理，一次性处理它们的生命周期
4. 避免内存泄漏，尤其是在动态创建响应式效果的场景中
5. 开发插件或库时，需要隔离响应式效果并确保它们能够被正确清理

例如，当你开发一个复杂的状态管理模块时，可以使用 `effectScope` 来确保所有相关的计算属性和侦听器在不再需要时被正确清理：

```js
// hook.ts
import { ref, effectScope } from "vue";

// 创建一个全局的 effectScope
const globalScope = effectScope(true);

// 声明变量但不立即初始化
let count;
let add;
let initialized = false;

// 延迟初始化函数
function ensureInitialized() {
  if (!initialized) {
    globalScope.run(() => {
      count = ref(0);

      add = () => {
        count.value++;
      };
    });

    initialized = true;
  }
}

export function useFeatureModule() {
  // 首次调用时才初始化
  ensureInitialized();

  return {
    count,
    add,
  };
}

// 提供清理函数
export function cleanupFeatureModule() {
  if (initialized) {
    globalScope.stop();
    initialized = false;
  }
}
```

## effectScope 与 pinia 的关系

`effectScope` 与 `Pinia` 的关系是深入且紧密的。`Pinia` 在其内部架构中大量使用了 `effectScope` 来管理响应式状态和效果。

主要的关系点包括：

1. **核心实现机制**：`Pinia` 在内部使用 `effectScope` 来创建和管理每个 store 的响应式效果。当你创建一个 `Pinia store` 时，`Pinia` 会自动创建一个 `effectScope` 实例来将该 `store` 的所有响应式效果（计算属性、侦听器等）包裹在内。

2. **自动清理**：当应用卸载或 store 被销毁时，`Pinia` 利用 `effectScope` 的 `stop()` 功能一次性清理所有相关的响应式效果，防止内存泄漏。

3. **SSR 支持**：`Pinia` 使用 `effectScope` 来实现更好的服务器端渲染支持，确保在服务器端创建的响应式效果不会产生持久性影响。

4. **插件系统**：`Pinia` 的插件系统部分依赖于 `effectScope` 来管理插件创建的响应式效果。

5. **热更新支持**：`Pinia` 使用 `effectScope` 来实现开发环境下的热更新功能，使得 `store` 可以在不丢失状态的情况下重新创建响应式系统。

从技术角度看，可以说 `effectScope` 是 `Pinia` 内部响应式系统管理的基础设施，为 `Pinia` 提供了高效管理响应式效果生命周期的能力。

这种关系让 `Pinia` 能够提供更清晰的状态管理体验，同时自动处理内存管理的复杂性，让开发者可以专注于业务逻辑而不是手动管理响应式效果的生命周期。

---
title: requestIdleCallback
author: DBAAZzz
date: 2025/03/31 11:00
categories:
  - requestIdleCallback
tags:
  - requestIdleCallback
---

# requestIdleCallback API 总结

请求浏览器在主线程空闲时执行 callback 函数。用于执行低优先级、非关键性的后台任务，而不会影响动画、输入响应等关键用户体验。

## 概述

`requestIdleCallback` 是一个 Web API，**允许开发者在浏览器事件循环的空闲时段内调度后台任务执行**，确保这些任务不会干扰关键操作，如输入处理、动画和帧合成。

## 目的

该 API 帮助开发者协作式地调度以下类型的后台任务：

- 非时间敏感型（指的是那些不需要立即执行、可以延迟处理且不会明显影响用户体验或页面功能的任务）
- 可能需要较长时间执行
- 不应延迟高优先级操作的任务（这类任务指的是如果执行时间过长或调度不当，会直接影响用户体验或页面核心功能的任务。）

## 相比传统方法的优势

使用 `requestIdleCallback` 相比传统方法（如 `setTimeout`）提供以下优势：

1. **明确空闲时间通知**：该 API 明确告知浏览器回调可以延迟到空闲时间执行
2. **截止时间提示**：浏览器提供时间余量，帮助代码判断可执行时长而不影响用户体验
3. **优化任务执行**：仅在真正空闲时执行回调，而非强制在任意时间点运行
4. **提升性能**：减少频繁向事件循环添加小任务的开销

## 空闲时段

空闲时段发生在浏览器主线程完成当前帧所有关键任务后，直到出现以下情况前的间隔：

- 新一帧渲染开始
- 其他待处理任务需要执行
- 接收到用户输入

主要有两种类型的空闲时段：

1. **帧间空闲**：动画帧渲染间隙（在 60Hz 显示器上通常 <16ms）
2. **延长空闲**：无屏幕更新时的空闲期，最长不超过 50ms

50ms 上限基于人类感知研究，该研究表明 100ms 内的响应被认为是即时的，这使浏览器能够响应可能在空闲回调期间发生的用户输入。

## API 接口

### Window 接口扩展

```javascript
partial interface Window {
  unsigned long requestIdleCallback(IdleRequestCallback callback,
                                   optional IdleRequestOptions options = {});
  void cancelIdleCallback(unsigned long handle);
};
```

### 回调类型

```javascript
callback IdleRequestCallback = void (IdleDeadline deadline);
```

### 选项字典

```javascript
dictionary IdleRequestOptions {
  unsigned long timeout;
};
```

### IdleDeadline 接口

```javascript
interface IdleDeadline {
  DOMHighResTimeStamp timeRemaining();
  readonly attribute boolean didTimeout;
};
```

## 使用方法

### 基本示例

```javascript
function backgroundTask(deadline) {
  // 在此处执行后台工作

  // 检查是否有剩余时间
  if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
    // 继续执行任务
  } else {
    // 若需要更多时间则重新调度
    requestIdleCallback(backgroundTask);
  }
}

// 调度后台任务
requestIdleCallback(backgroundTask);
```

回调函数会接收一个 `IdleDeadline` 对象，包含 `timeRemaining()` 方法（告诉你当前空闲时间还剩多少）和 `didTimeout` 属性（告知是否因为超时而被强制执行）。

应检查 `timeRemaining()`，如果时间不足，应将任务拆分，并在下一个 `requestIdleCallback` 中继续。

### 带超时选项

```javascript
requestIdleCallback(backgroundTask, { timeout: 2000 });
```

如果到了超时时间回调还没被执行，浏览器会强制将其加入任务队列尽快执行（但此时可能就不在空闲时段了，可能会影响性能）

## 关键行为

1. **FIFO 执行**：回调在空闲时段内按先进先出顺序运行
2. **不保证执行**：若系统持续繁忙，回调可能不会执行
3. **超时保障**：通过 timeout 参数确保最长延迟（即使无空闲时段）
4. **单次执行**：每个回调仅在一个空闲时段执行一次
5. **循环调度机制**：重新调度的回调会进入队列末尾
6. **节能优化**：当页面不可见时，浏览器可能会限制空闲时段以减少电量消耗

## 隐私和安全考量

- `IdleDeadline` 的时间精度会根据跨源隔离能力进行调整，防止时序攻击
- 不会暴露比其他 Web API 更多的时序信息

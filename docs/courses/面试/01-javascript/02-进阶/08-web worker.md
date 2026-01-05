---
title: Web Worker
date: 2025/12/05 00:20
categories:
  - 面试
tags:
  - web worker
---

## Web Worker 是什么？

`Web Worker` 是**浏览器**提供的一种多线程技术，让 JavaScript 可以在后台线程中运行，不会阻塞页面的主线程。

JavaScript 语言本身是单线程的，这意味着所有任务都在同一个主线程上运行。如果执行计算密集型任务（如复杂算法、大图片处理），主线程会被阻塞，导致页面卡顿、UI 无响应。Web Worker 的出现就是为了解决这个问题，它允许主线程创建 Worker 线程，将耗时任务分配给 Worker 运行。

> **核心特点：**
>
> - **独立运行**：Worker 在后台独立运行，不干扰主线程（UI 线程）。
> - **消息传递**：主线程和 Worker 通过 `postMessage` 和 `onmessage` 进行通信。
> - **沙箱环境**：Worker 拥有独立的全局作用域，不能直接操作 DOM。

---

## 基本使用示例和 API

### 创建 Worker

主线程通过 `new Worker()` 构造函数创建一个 Worker 实例。

```javascript
// main.js
// 参数是 Worker 脚本的路径
const myWorker = new Worker("worker.js");
```

**错误处理**：如果 Worker 文件加载失败（404）或有语法错误，可以通过 `onerror` 捕获。

```javascript
myWorker.onerror = function (e) {
  console.error("Worker Error:", e.message, e.filename, e.lineno);
};
```

### 通信（主线程 <-> Worker）

通信是双向的，都使用 `postMessage` 发送，`onmessage` 接收。

**主线程代码：**

```javascript
// 发送消息给 Worker
myWorker.postMessage("Hello, Worker!");
myWorker.postMessage({ type: "calc", data: [1, 2, 3] });

// 接收 Worker 返回的消息
myWorker.onmessage = function (e) {
  console.log("Main received:", e.data);
};
```

**Worker 线程代码 (worker.js)：**

```javascript
// 监听主线程消息
// self 代表 Worker 的全局作用域 (DedicatedWorkerGlobalScope)
self.onmessage = function (e) {
  console.log("Worker received:", e.data);

  // 处理任务...
  const result = e.data.length ? e.data.length * 2 : "Received";

  // 发回结果
  self.postMessage(result);
};
```

### 终止 Worker

Worker 创建后会一直运行，直到被显式终止。

- **主线程终止**：`myWorker.terminate()` (立即停止，不会等待正在进行的任务)
- **Worker 自身终止**：`self.close()`

### 加载其他脚本

Worker 内部可以使用 `importScripts()` 同步加载其他 JS 文件。

```javascript
// worker.js
importScripts("utils.js", "math.js");
```

---

## 通信机制深入

Web Worker 的通信是基于**拷贝**的，而不是共享内存。

### 结构化克隆算法 (Structured Clone)

当你通过 `postMessage` 发送对象（Array, Object, Date, RegExp, File, etc.）时，浏览器会使用**结构化克隆算法**深度拷贝数据。

- **优点**：即使 Worker 修改了数据，主线程的数据也不会受影响（安全，无竞态条件）。
- **缺点**：拷贝大文件（如几十 MB 的数据）有显著的性能开销，尤其是大排队时间。
- **支持类型**：除 Function、Error、DOM 节点外，几乎所有内置类型都支持。

### 转移对象 (Transferable Objects)

为了解决大数据拷贝的性能问题，可以使用 **Transferable Objects** 将数据的所有权**转移**给 Worker。

- **机制**：通过“零拷贝”操作，将内存块的所有权移交。移交后，**原线程无法再访问该数据**。
- **适用场景**：`ArrayBuffer` (二进制数据), `MessagePort`, `ImageBitmap`。

```javascript
// 创建 100MB 的二进制数据
const uInt8Array = new Uint8Array(1024 * 1024 * 100);

// 使用转移模式（第二个参数是 transfer list）
myWorker.postMessage(uInt8Array, [uInt8Array.buffer]);

// 发送后，主线程中的 uInt8Array.buffer 长度变为 0，无法访问
console.log(uInt8Array.byteLength); // 0
```

### MessageChannel

用于创建直接的点对点通信管道，常用于 **两个 Worker 之间直接通信**，而不需要经过主线程中转。

```javascript
const channel = new MessageChannel();
worker1.postMessage({ port: channel.port1 }, [channel.port1]);
worker2.postMessage({ port: channel.port2 }, [channel.port2]);
// 之后 worker1 和 worker2 可以直接通过 port 通信
```

---

## 三种 Worker 的详细对比

| 特性         | Dedicated Worker (专用)        | Shared Worker (共享)                           | Service Worker                                           |
| :----------- | :----------------------------- | :--------------------------------------------- | :------------------------------------------------------- |
| **使用场景** | 耗时计算、图像处理、大文件处理 | 多 Tab 页间状态共享、Socket 连接复用           | 离线缓存(PWA)、网络拦截、后台推送                        |
| **作用域**   | Deduced to **single** page     | Shared across **multiple** pages (same origin) | Shared across **entire** origin                          |
| **生命周期** | 随页面关闭而销毁               | 所有连接的页面关闭后才销毁                     | 独立于页面，后台常驻 (install -> activate -> fetch/idle) |
| **通信方式** | `postMessage`                  | 通过 `MessagePort` 对象通信                    | `postMessage` (Client API) / Fetch Event                 |
| **调试**     | 简单 (DevTools -> Sources)     | 较麻烦 (chrome://inspect/#workers)             | Application 面板 -> Service Workers                      |
| **DOM 访问** | 不可                           | 不可                                           | 不可                                                     |

> **Shared Worker 注意**：创建时使用 `new SharedWorker('worker.js')`，通信时必须使用 `port` 对象：`worker.port.start()` 和 `worker.port.postMessage()`。

---

## 性能优化与最佳实践

### Worker 创建成本与复用 (Worker Pool)

- **成本**：创建一个 Worker 线程有内存和 CPU 开销（约为几百 KB 到几 MB 内存）。频繁创建/销毁 Worker 是反模式。
- **优化**：对于频繁的小任务，实现 **Worker Pool (线程池)**。维护一组常驻的 Worker，任务来了就分配给空闲 Worker，这类似于后端的数据库连接池。
  - 推荐库：`workerpool`, `piscina`.

### 数据传输考量

- **小数据**：直接拷贝 (`postMessage`)。
- **大数据 (>1MB)**：务必使用 `Transferable Objects` (ArrayBuffer) 或 `SharedArrayBuffer` (共享内存，需处理原子锁)。
- **字符串化**：避免手动 `JSON.stringify` 传输，浏览器内置的结构化克隆通常比 JS 序列化更快且支持更多类型。

### 何时使用 Worker？

不要滥用 Worker。

- **不适合**：耗时极短的简单计算（通信开销 > 计算收益）、涉及频繁 DOM 交互的任务。
- **适合**：图像解码、Excel 解析、加密哈希、代码高亮、大数据排序过滤，任何超过 100ms 的纯 JS 运算。

---

## 限制和注意事项

### 权限限制 (API 访问能力)

Worker 运行在受限环境中：

- **无法访问**：
  - `DOM` 节点 (document.getElementById 等)
  - `window` 对象 (绝大多数属性)
  - `parent` 对象
- **可以访问**：
  - `navigator` (userAgent, onLine, etc)
  - `location` (只读)
  - `XMLHttpRequest` / `fetch` (发送网络请求)
  - `setTimeout` / `setInterval`
  - `IndexedDB`
  - `Cache API`
  - `importScripts`

### 同源策略

分配给 Worker 的脚本 URL 必须与主页面**同源**（协议、域名、端口一致）。

- **Data URL**：可以使用 Blob URL (`URL.createObjectURL`) 绕过多文件限制，实现内联 Worker。

### 调试难度

虽然 Chrome DevTools 支持 Worker 调试，但 `console.log` 虽然能打印，断点调试有时会比主线程麻烦（在 Sources -> Threads 面板切换）。

---

## 实际开发中的应用

### 在构建工具中使用 (Vite / Webpack 5)

现代构建工具原生支持 Worker，无需手动配置 loader。

**Vite / Webpack 5 标准写法**：
使用 `new URL` 语法，工具会自动识别并分包。

```javascript
// 这种写法兼容 Vite 和 Webpack 5
const worker = new Worker(new URL("./worker.js", import.meta.url), {
  type: "module", // 允许在 Worker 中使用 ES Module (import X from Y)
});
```

### 常见应用场景

1.  **图片处理**：读取 Canvas 像素数据 (`getImageData`)，传给 Worker 进行滤镜处理（黑白、模糊），转回主线程绘制。
2.  **大文件上传**：在 Worker 中计算文件 MD5（SparkMD5），避免计算 Hash 时页面假死。
3.  **实时数据处理**：WebSocket 数据量巨大时，在 Worker 中接收并清洗数据，只把最终视图需要的数据传给主线程。
4.  **代码编辑器**：Monaco Editor (VSCode 内核) 大量使用 Worker 进行代码语法分析、TypeScript 校验。

---

## 面试常见问题

### Q1: Web Worker 和主线程的区别？

- **内存**：独立内存，不共享（除非用 SharedArrayBuffer）。
- **环境**：Worker 无 DOM 访问权，全局对象是 `self` 不是 `window`。
- **通信**：通过消息机制异步通信。

### Q2: 为什么 Worker 不能操作 DOM？

- DOM API 是非线程安全的。如果主线程和 Worker 同时修改 DOM，会产生复杂的竞态条件。
- 为了简化浏览器实现和保证 UI 稳定性，浏览器限制 UI 更新只能在主线程（UI 线程）。

### Q3: 如何在 Worker 中解决“不能操作 DOM”的问题？

- 只在 Worker 做数据计算，计算出最终结果（如 Virtual DOM 的 Diff 结果，或 HTML 字符串），发给主线程。
- 主线程只负责“傻瓜式”渲染。

### Q4: 如何选择 Worker 还是 RequestIdleCallback？

- **RequestIdleCallback**：利用主线程空闲时间。适合**低优先级、必须访问 DOM** 或不想引入多线程复杂性的短任务。任务过长仍会阻塞。
- **Web Worker**：真正的并行。适合**高耗时、纯计算、不需要 DOM** 的任务。

---

## 完整代码示例

### 业务场景：计算斐波那契数列（CPU 密集型）

如果不使用 Worker，计算 `fib(45)` 会导致页面卡死几秒钟。

#### 1. worker.js

```javascript
// 递归计算斐波那契，非常耗时
function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}

// 监听消息
self.onmessage = function (e) {
  const { num } = e.data;
  const startTime = performance.now();

  const result = fib(num);

  const timeTaken = performance.now() - startTime;

  // 返回结果和耗时
  self.postMessage({
    result,
    time: timeTaken,
  });
};
```

#### 2. main.js (UI 逻辑)

```javascript
const worker = new Worker(new URL("./fib-worker.js", import.meta.url));

const btn = document.getElementById("calcBtn");
const status = document.getElementById("status");

btn.addEventListener("click", () => {
  status.textContent = "计算中...UI 仍然响应";

  // 发送任务
  worker.postMessage({ num: 42 });
});

worker.onmessage = (e) => {
  const { result, time } = e.data;
  status.textContent = `结果: ${result}, 耗时: ${time.toFixed(2)}ms`;
};

worker.onerror = (err) => {
  console.error("计算出错", err);
  status.textContent = "出错啦";
};
```

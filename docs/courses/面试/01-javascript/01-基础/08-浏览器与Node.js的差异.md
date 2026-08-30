---
title: 浏览器与 Node.js 的差异
author: DBAAZzz
date: 2026/08/24 00:00
categories:
  - 面试
tags:
  - javascript
  - browser
  - Node.js
---

# 浏览器与 Node.js 的差异

> **核心结论**：浏览器和 Node.js 都能执行 ECMAScript，但它们是两个不同的**宿主环境（Host Environment）**。JavaScript 语言核心大体相同，真正不同的是宿主提供的全局对象、模块加载、事件循环、I/O 能力、安全模型和进程生命周期。

## 面试中的一分钟回答

可以先回答下面这段，再根据面试官追问展开：

> 浏览器和 Node.js 执行的是同一种 JavaScript 语言，但运行时目标不同。浏览器面向页面、用户交互和渲染，提供 DOM、BOM、同源策略等 Web Platform API；Node.js 面向服务端和工具开发，提供文件系统、网络、进程等操作系统能力。浏览器事件循环由 HTML 标准定义，并与渲染时机相关；Node.js 的事件循环基于 libuv，分为 poll、check、timers 等阶段，还有 `process.nextTick()` 和 `setImmediate()`。模块方面，浏览器原生使用 ESM，Node.js 同时支持 ESM 和 CommonJS。两者都默认在一个事件循环线程上执行 JavaScript，也都可以通过 Worker 实现并行，所以“JavaScript 是单线程”不能理解成整个浏览器或 Node 进程只有一个线程。

这段答案有三个关键点：

1. **ECMAScript 是语言，浏览器和 Node.js 是宿主环境**。
2. 不只罗列 API，还要讲清楚**事件循环、模块和安全边界**。
3. 避免“浏览器和 Node.js 都是 V8，所以完全一样”这种错误表述。

---

## 先分清三层：语言、引擎、运行时

很多回答不准确，是因为把 JavaScript、V8、浏览器和 Node.js 混成了同一个概念。

```text
JavaScript 程序
    ↓
ECMAScript：语法、类型、作用域、Promise 等语言规范
    ↓
JavaScript 引擎：解析、编译、执行、垃圾回收
    ↓
宿主运行时：提供 I/O、事件循环和环境专属 API
```

以常见实现为例：

```text
浏览器：JavaScript 引擎 + Web Platform API + HTML Event Loop + 渲染引擎 + 安全沙箱
Node.js：V8 + Node.js API/C++ Bindings + libuv + 操作系统能力
```

需要注意：

- Node.js 使用 V8。
- Chrome、Edge 使用 V8，但 Firefox 使用 SpiderMonkey，Safari 使用 JavaScriptCore。
- 因此，“浏览器与 Node.js 的差异”本质上是**宿主运行时差异**，不是简单的 V8 差异。
- `document`、`setTimeout`、`fetch`、`process`、`fs` 都不是 ECMAScript 语言本身定义的核心能力，而是由宿主提供。

---

## 核心差异总览

| 维度 | 浏览器 | Node.js |
| :--- | :--- | :--- |
| **主要目标** | 页面渲染、交互、多媒体、Web 应用 | 服务端、CLI、构建工具、自动化脚本 |
| **典型全局对象** | Window 环境中的 `window`，Worker 中的 `self` | `globalThis`；历史上常见 `global` |
| **通用全局访问** | `globalThis` | `globalThis` |
| **环境 API** | DOM、BOM、Web Storage、IndexedDB、Canvas 等 | `node:fs`、`node:path`、`node:http`、`process`、`Buffer` 等 |
| **模块系统** | 原生 ESM | ESM + CommonJS，并有 Node 包解析规则 |
| **事件循环** | HTML Event Loop，与用户交互、网络和渲染协调 | 基于 libuv，按阶段处理定时器、I/O、`setImmediate()` 等 |
| **渲染能力** | Window 主线程需要参与样式、布局、绘制等流程 | 默认没有 DOM 和页面渲染流程 |
| **安全边界** | 沙箱、同源策略、CORS、权限授权 | 默认继承进程的操作系统权限；权限模型可减少受信代码的误操作，但不是恶意代码沙箱 |
| **I/O 特征** | 高权限能力通常受沙箱和用户授权限制 | 可通过内置模块访问文件、网络、进程等系统资源 |
| **生命周期** | 与页面、Worker、导航和标签页状态相关 | 与进程及仍被引用的活跃资源相关 |
| **并行手段** | Web Worker、Service Worker、Worklet 等 | `worker_threads`、`child_process`、`cluster` 等 |

> 表格描述的是典型运行环境，不代表某个 API 永远只存在于一端。现代 Node.js 已实现不少兼容 Web 标准的 API，例如 `fetch`、`URL`、Web Streams、`AbortController`、`EventTarget`。判断能力时应查看运行时版本并进行特性检测。

---

## 全局对象和顶层作用域

### 使用 globalThis 访问当前全局对象

跨运行时访问全局对象，优先使用标准的 `globalThis`：

```javascript
console.log(globalThis)
```

规范级别上，`globalThis` 提供的是当前 Realm 的全局 `this` 值。在浏览器 Window 环境中，由于跨源访问等历史和安全原因，开发者通常接触到的是代理全局对象的 `WindowProxy`；日常面试中把它近似理解为 `window` 即可。

不要把 `window` 当成所有 JavaScript 环境的全局对象：

- 浏览器页面的 Window 环境有 `window`。
- Web Worker 没有 `window` 和 `document`，通常使用 `self` 或 `globalThis`。
- Node.js 没有浏览器的 `window`；`global` 是 Node.js 的历史 API，现代代码优先使用 `globalThis`。

### 浏览器经典脚本、浏览器 ESM、Node.js CJS、Node.js ESM

顶层 `this` 和顶层变量是高频陷阱：

| 执行方式 | 顶层 `this` | 顶层 `var` 是否成为全局对象属性 | 环境特有变量 |
| :--- | :--- | :--- | :--- |
| 浏览器经典 `<script>` | 通常是 `window` | 是 | `window`、`document` |
| 浏览器 `<script type="module">` | `undefined` | 否，模块有独立作用域 | `import.meta` |
| Node.js CommonJS 文件 | `module.exports` | 否，文件有模块作用域 | `require`、`module`、`exports`、`__filename`、`__dirname` |
| Node.js ESM 文件 | `undefined` | 否，模块有独立作用域 | `import.meta`；没有 CJS 包装变量 |

浏览器经典脚本还有一个细节：顶层 `var` 声明可以映射成全局对象属性，但顶层 `let`、`const`、`class` 不会。

```html
<script>
  var a = 1
  let b = 2

  console.log(window.a) // 1
  console.log(window.b) // undefined
  console.log(this === window) // true（经典脚本的顶层）
</script>
```

Node.js CommonJS 模块在执行前会被包装成一个函数，概念上类似：

```javascript
(function (exports, require, module, __filename, __dirname) {
  // 模块代码
})
```

所以 CommonJS 文件中的顶层变量不是全局变量：

```javascript
// example.cjs
var count = 1

console.log(globalThis.count) // undefined
console.log(this === module.exports) // true
console.log(this === globalThis) // false
```

> **面试避坑**：不要只回答“浏览器的全局对象是 `window`，Node.js 的全局对象是 `global`”。这忽略了 Worker、ESM 和标准的 `globalThis`，也混淆了“全局对象”和“顶层 `this`”。

---

## API 和能力边界

### 浏览器擅长操作 Web 平台

浏览器主要提供与页面和用户相关的能力：

- DOM：`document`、Element、事件传播
- BOM：`location`、`history`、`navigator`
- 渲染与动画：Canvas、`requestAnimationFrame`
- 客户端存储：Cookie、Web Storage、IndexedDB
- 网络：`fetch`、WebSocket、EventSource
- 用户能力：Clipboard、Geolocation、Notification、MediaDevices

这些能力通常受到安全上下文、同源策略或用户授权的限制。

### Node.js 擅长访问系统资源

Node.js 主要提供服务端和系统级能力：

```javascript
import { readFile } from 'node:fs/promises'
import { cpus } from 'node:os'
import { createServer } from 'node:http'

const text = await readFile('./package.json', 'utf8')
console.log(cpus().length, text.length, createServer)
```

典型能力包括：

- 文件系统：`node:fs`
- 路径与操作系统信息：`node:path`、`node:os`
- TCP、UDP、HTTP：`node:net`、`node:dgram`、`node:http`
- 进程和环境变量：`process`
- 二进制数据：`Buffer`
- 子进程与工作线程：`child_process`、`worker_threads`

浏览器不能直接提供同等的任意系统访问，否则网页只要被打开就可能读取用户文件或启动进程。浏览器中的文件选择器、File System Access API 等能力受到用户操作、授权和浏览器支持范围的约束，不能等同于 Node.js 的 `node:fs`。

### 同名 API 也不保证语义完全相同

现代 Node.js 和浏览器都提供 `fetch`、`URL`、`TextEncoder`、Web Streams 等 API，但代码仍可能因为宿主上下文而表现不同。

例如：

```javascript
await fetch('/api/user')
```

- 在浏览器页面中，`'/api/user'` 可以相对当前文档地址解析。
- 普通 Node.js 脚本没有“当前页面地址”，直接向内置 `fetch` 传入相对 URL 字符串会解析失败；应传入可独立解析的绝对 URL，或先用自定义基准地址构造 `URL`。
- 浏览器会执行 CORS 检查，并有浏览器管理的 Cookie 上下文。
- Node.js 发起 HTTP 请求时不会替你复刻浏览器的同源、CORS 和 Cookie 管理模型。

因此，“Node.js 有 `fetch`”只表示它提供兼容该接口的实现，不表示 Node.js 变成了浏览器。

---

## 模块系统的差异

### 浏览器原生模块：ESM

```html
<script type="module" src="/src/main.js"></script>
```

```javascript
// main.js
import { sum } from './math.js'
```

浏览器原生模块有这些特点：

- 使用 `import` / `export`。
- 模块标识符按 URL 精确解析，浏览器不会像 Node.js CommonJS 加载器那样自动尝试补 `.js` 或查找目录下的 `index.js`；静态文件部署时因此通常显式写扩展名。
- 裸模块标识符需要通过 Import Maps 映射，或先由打包工具处理。
- 浏览器本身不原生提供 CommonJS 的 `require`、`module.exports`。

如果浏览器项目里能直接使用 `require()` 或导入 npm 包名，通常是 Vite、Webpack、Rollup 等工具在开发或构建阶段完成了解析和转换，并不是浏览器原生支持 CommonJS 或 Node.js 包解析。

### Node.js：CommonJS 与 ESM 并存

CommonJS：

```javascript
// math.cjs
module.exports = { sum: (a, b) => a + b }

// main.cjs
const { sum } = require('./math.cjs')
```

ESM：

```javascript
// math.mjs
export const sum = (a, b) => a + b

// main.mjs
import { sum } from './math.mjs'
```

Node.js 通过文件扩展名和最近的 `package.json` 中的 `type` 等信息判断模块类型：

- `.mjs`：ESM
- `.cjs`：CommonJS
- `.js`：优先受最近的 `package.json#type` 影响。对没有明确类型标记的歧义文件，Node.js v20.19.0+/v22.7.0+ 默认启用语法检测；如果包含只能按 ESM 解析的语法，会被判定为 ESM。最佳实践仍是显式声明 `type` 或使用明确扩展名

Node.js ESM 与 CommonJS 还有这些重要差异：

| 特性 | CommonJS | ESM |
| :--- | :--- | :--- |
| 加载语法 | `require()` | `import` / `import()` |
| 导出语法 | `module.exports` / `exports` | `export` |
| 典型加载模型 | `require()` 同步返回 | 静态依赖图，支持异步模块和顶层 `await` |
| `__filename` / `__dirname` | 有 | 不提供同名 CJS 包装变量；较新的 Node.js 可使用 `import.meta.filename` / `import.meta.dirname` |
| 顶层 `this` | `module.exports` | `undefined` |

> **准确表述**：现代 Node.js 对 ESM 与 CommonJS 的互操作能力持续增强，但它们仍是两套不同的加载器和语义。不要简单回答“`require` 是同步的，`import` 是异步的”——静态 `import` 声明本身不是一个返回 Promise 的函数，模块的链接、实例化和求值规则也不能只用“异步”二字概括。

版本边界也可能成为追问：Node.js v20.19.0+/v22.12.0+ 的 `require()` 可以同步加载不含顶层 `await` 的 ESM 模块图，ESM 也可以导入 CommonJS。跨版本获取 ESM 当前文件路径时，可以使用 `fileURLToPath(import.meta.url)`；使用 `import.meta.filename` / `import.meta.dirname` 前应确认目标 Node.js 版本。

---

## 事件循环的差异

浏览器和 Node.js 都使用事件循环实现异步调度，但两者不是同一个事件循环实现。

### 浏览器：任务、微任务与渲染机会

浏览器的事件循环需要协调：

- 脚本执行
- 用户输入
- 网络回调
- 定时器
- 微任务
- 动画回调和页面渲染

可以将常见流程简化为：

```text
取出一个可运行任务
    ↓
执行任务中的 JavaScript
    ↓
执行微任务检查点，清空微任务队列
    ↓
如果存在渲染机会，执行与渲染相关的更新
    ↓
进入后续循环
```

需要比“一个宏任务队列”更严谨：HTML 标准中可以有多个任务队列和多个**任务源（Task Source）**，用户代理可以在符合规范约束的前提下选择可运行的任务。`Promise.then` 和 `queueMicrotask` 使用微任务队列；`requestAnimationFrame` 属于渲染步骤，不应简单归类为普通宏任务。

### Node.js：libuv 的阶段

Node.js 的事件循环基于 libuv。常见阶段可以简化为：

```text
（进入事件循环前，出于兼容性可能先处理一次 timers）

pending callbacks
  ↓
idle / prepare（内部使用）
  ↓
poll：等待并处理大部分 I/O
  ↓
check：执行 setImmediate 回调
  ↓
close callbacks
  ↓
timers（libuv 1.45.0+ / Node.js 20.3.0+ 的每轮循环中位于 poll 之后）
  ↓
下一轮 pending callbacks
```

理解三个最常考的 API：

- `setTimeout(fn, delay)`：`delay` 是可以执行的最小时间阈值，不是精确执行时间。
- `setImmediate(fn)`：在 check 阶段执行；浏览器没有这个标准 API。
- `process.nextTick(fn)`：不属于 libuv 阶段；当前操作完成后会先处理 next tick 队列。递归安排会导致 I/O 饥饿。

libuv 1.45.0+（Node.js 20.3.0+）起，每轮事件循环中的定时器处理改到 poll 阶段之后；进入事件循环前仍保留一次兼容性 timers 处理。更早版本每轮还会在 poll 前处理 timers。这可能影响 `setImmediate()` 与 timer 的相对时序，因此高级面试中不要脱离 Node.js 版本和调用上下文死记输出。

`process.nextTick()` 队列和 V8 的微任务队列都不属于上面的 libuv 阶段图。Node.js 会在 JavaScript 回调边界处理这些队列，具体先后还要结合 CJS、ESM 和当前执行上下文分析。

### setTimeout 与 setImmediate 谁先执行

在主模块中同时调度时，顺序不能作为稳定保证：

```javascript
setTimeout(() => console.log('timeout'), 0)
setImmediate(() => console.log('immediate'))
```

如果二者像下面这样在同一个 I/O 回调中调度，`setImmediate` 会先执行，因为当前 poll 阶段结束后会进入 check 阶段。这个结论不要泛化到主模块或任意异步上下文：

```javascript
import { readFile } from 'node:fs'

readFile(new URL(import.meta.url), () => {
  setTimeout(() => console.log('timeout'), 0)
  setImmediate(() => console.log('immediate'))
})

// immediate
// timeout
```

### process.nextTick 与 Promise：CJS、ESM 结果不同

下面这段代码如果作为 CommonJS 顶层代码运行：

```javascript
Promise.resolve().then(() => console.log('promise'))
queueMicrotask(() => console.log('microtask'))
process.nextTick(() => console.log('nextTick'))
```

输出为：

```text
nextTick
promise
microtask
```

但作为 ESM 顶层代码运行时，模块求值本身已经处于微任务处理过程，输出为：

```text
promise
microtask
nextTick
```

这说明“`process.nextTick` 永远比 Promise 先执行”并不准确。当前 Node.js 文档已将 `process.nextTick()` 标记为 Legacy；多数用户代码如果只需要跨平台延期执行，应优先考虑 `queueMicrotask()`。

---

## “JavaScript 是单线程”的准确含义

更准确的说法是：**同一个 ECMAScript Agent 在任一时刻至多有一个执行上下文正在执行，一段任务中的 JavaScript 具有 run-to-completion 特性**。宿主可以创建多个 Agent 或 Worker，进程内部也可以有其他线程。

ECMAScript Agent 是语言规范中的并发抽象，V8 Isolate 是引擎实现概念，事件循环是宿主调度机制，三者有关联但不能画等号，也不保证与物理线程一一对应。

### 浏览器

浏览器内部通常还包括：

- 渲染、合成等相关线程
- 网络和存储相关线程
- 其他页面或进程
- Web Worker 的执行线程

主线程执行长任务时，用户输入和页面更新可能无法及时处理，所以 CPU 密集型任务可以拆分，或放入 Web Worker。

### Node.js

Node.js 默认在一个事件循环线程上执行用户 JavaScript，但异步工作还可能依赖：

- 操作系统提供的异步 I/O 能力
- libuv worker pool，例如多数异步文件系统操作、`dns.lookup()` / `dns.lookupService()`、部分 crypto 和 zlib 操作；`dns.resolve*()` 使用异步网络查询，不依赖该线程池
- `worker_threads` 执行并行 JavaScript
- 子进程

`worker_threads` 更适合 CPU 密集型 JavaScript，不是普通 I/O 的默认优化手段。I/O 密集型任务通常应先使用 Node.js 已有的异步 I/O API。

> **面试避坑**：V8 有垃圾回收线程、JIT 编译相关线程，浏览器和 libuv 也可能使用其他线程。“单线程”描述的是通常情况下用户 JavaScript 的串行执行模型，不是整个运行时的物理线程数量。

---

## 安全模型与 I/O 权限

### 浏览器：默认不信任网页

浏览器加载的是来自网络的代码，因此需要强安全边界：

- 同源策略隔离不同源的数据
- 同源策略默认限制脚本读取跨源响应；CORS 允许服务器通过响应头向特定源授权，由浏览器执行检查（`no-cors` 等模式还有不透明响应等限制）
- Cookie 有 Domain、Path、SameSite、Secure、HttpOnly 等约束
- 摄像头、定位、剪贴板等敏感能力需要权限或用户手势
- 页面默认不能任意读取本机文件和环境变量

### Node.js：默认按本地进程权限运行

Node.js 代码通常被视为由部署者主动运行，可在操作系统允许范围内访问文件、网络、环境变量和子进程。现代 Node.js 也提供可选的权限模型，可以通过 `--permission` 等机制降低**受信代码意外访问资源**的风险，但官方明确它不是针对恶意代码的安全边界，也可能被绕过。运行不可信代码仍需要操作系统用户隔离、容器、虚拟机或专门沙箱。

这带来两个高级前端常见问题：

1. **CORS 主要是浏览器安全模型**。Node.js HTTP 客户端不会像页面脚本一样执行浏览器 CORS 拦截，但仍要处理鉴权、授权、SSRF、网络 ACL 和出口控制。CSRF 是服务端接收浏览器自动携带凭据的请求时需要处理的另一类威胁，与 Node.js 客户端是否执行 CORS 没有直接关系。
2. **不要把服务端秘密注入浏览器包**。`process.env` 中的密钥如果在构建时被内联进前端产物，用户可以下载并查看它。

---

## 定时器返回值也不同

浏览器中，`setTimeout` 通常返回一个数字 ID：

```javascript
const timer = setTimeout(() => {}, 1000)
console.log(typeof timer) // 浏览器中通常是 "number"
```

Node.js 中返回 `Timeout` 对象，它还提供 `ref()`、`unref()` 等能力：

```javascript
const timer = setTimeout(() => {}, 1000)
timer.unref()
```

默认情况下，被引用的 timer 会让 Node.js 事件循环继续存活；调用 `unref()` 后，如果只剩这个 timer，进程不必等待它执行就可以退出。

这也是 TypeScript 中常见的跨环境类型问题：

```typescript
let timer: ReturnType<typeof setTimeout>
```

用 `ReturnType<typeof setTimeout>` 通常比手写 `number` 或 `NodeJS.Timeout` 更适合跨环境代码。

---

## 生命周期差异

### 浏览器页面

浏览器页面生命周期受到以下行为影响：

- 页面导航、刷新、关闭
- 页面进入后台或被冻结
- 后台标签页的 timer 节流
- Page Visibility、Page Lifecycle、`beforeunload` 等机制

因此，不应该依赖页面关闭前一定完成异步请求或执行清理代码。

### Node.js 进程

Node.js 通常在没有仍被引用的活跃 handle 或 request 时自然退出，例如没有待处理的 server、socket、timer、I/O 等。

```javascript
setInterval(() => {
  console.log('running')
}, 1000)
```

上面的 interval 默认会使进程持续运行。Node.js 的进程生命周期与“页面是否可见”无关，而与事件循环中仍然活跃并被引用的资源相关。

---

## 同构代码与 SSR 中的常见问题

### window is not defined 的根因

```javascript
const width = window.innerWidth
```

这段代码在浏览器中可用，在 SSR 或 Node.js 构建脚本中会报错，因为模块在服务端求值时没有 `window`。

只把访问放进函数还不一定够，关键是这个函数**何时、在哪个运行时执行**：

```javascript
export function getViewportWidth() {
  if (typeof window === 'undefined') return undefined
  return window.innerWidth
}
```

### 优先做能力检测

运行时检测可以用于分支，但能力检测通常更精确：

```javascript
const canUseDOM =
  typeof globalThis.document !== 'undefined' &&
  typeof globalThis.document.createElement === 'function'
```

为什么不能只检查 `window`：

- Web Worker 是浏览器环境，但没有 `window`。
- 测试环境可能模拟 `window`，却没有完整浏览器能力。
- Electron、边缘运行时等环境可能同时具有不同宿主的部分特征。

### 通过适配层隔离宿主能力

比在业务代码中到处写环境判断更好的方式，是把差异放到边界：

```typescript
interface StorageAdapter {
  get(key: string): Promise<string | null>
  set(key: string, value: string): Promise<void>
}
```

- 浏览器实现可以使用 IndexedDB 或 Web Storage。
- Node.js 实现可以使用数据库或文件系统。
- 业务层只依赖 `StorageAdapter`，不直接依赖 `window` 或 `node:fs`。

如果要发布同时支持浏览器和 Node.js 的包，还要考虑：

- 不在浏览器入口顶层导入 `node:fs` 等 Node 内置模块。
- 使用 `package.json#exports` 的条件导出提供不同入口。
- 明确支持的 Node.js 和浏览器版本。
- 对共享 Web API 做特性检测，不只根据名称猜测语义。
- 避免在模块顶层读取 DOM，使 SSR 导入阶段保持安全。

---

## 高频面试追问

### Q1：浏览器和 Node.js 都使用 V8 吗？

**答**：Node.js 使用 V8，Chrome 和 Edge 也使用 V8，但不是所有浏览器都使用 V8。Firefox 使用 SpiderMonkey，Safari 使用 JavaScriptCore。浏览器与 Node.js 的主要差异来自宿主 API、事件循环和安全模型，而不是“是否都叫 JavaScript”。

### Q2：为什么 Node.js 没有 document？能不能安装一个？

**答**：`document` 是浏览器 DOM 的入口，不属于 ECMAScript。Node.js 默认没有 DOM。可以使用 jsdom 等库模拟一部分 DOM，或使用无头浏览器操作真实浏览器环境，但这不等于 Node.js 原生拥有完整的布局、绘制和浏览器安全模型。

### Q3：Node.js 有 fetch 后，与浏览器 fetch 完全一样吗？

**答**：接口设计兼容 Web 标准，但宿主上下文不同。Node.js 没有当前页面 URL、浏览器 Cookie Jar 和浏览器 CORS 执行环境，代理、连接管理等实现细节也可能不同。跨环境代码不能只看函数名相同。

### Q4：为什么 Node.js 请求跨域接口不会出现浏览器 CORS 报错？

**答**：CORS 是浏览器用来保护用户的一套响应读取策略。Node.js 是服务端进程，不处于网页的同源安全模型中，所以不会自动执行同样的 CORS 拦截。服务端仍需处理鉴权、授权、SSRF、网络边界等安全问题。

### Q5：浏览器能用 require 吗？

**答**：浏览器原生不提供 CommonJS 的 `require`。项目里能用通常是打包工具进行了依赖解析和转换，或某个运行时库自己实现了同名函数。浏览器原生模块系统是 ESM。

### Q6：Node.js 是单线程吗？

**答**：默认情况下，一个 Node.js 实例在一个事件循环线程上串行执行用户 JavaScript，但运行时并非只有一个线程。操作系统、libuv worker pool、V8 内部线程和 `worker_threads` 都可能并行工作。

### Q7：浏览器事件循环和 Node.js 事件循环最大的区别是什么？

**答**：浏览器事件循环需要和用户交互及渲染协调，由 HTML 标准描述任务、微任务和渲染机会；Node.js 基于 libuv 的阶段模型处理 I/O，具有 `poll`、`check`、timers 等阶段，以及 `setImmediate`、`process.nextTick` 等 Node 特有机制。

### Q8：为什么 SSR 中不要在模块顶层访问 window？

**答**：SSR 会先在 Node.js 或其他服务端运行时加载和求值模块。顶层访问会在组件真正渲染前发生，服务端又没有 `window`，因此导入阶段就会失败。应把浏览器专属逻辑放在客户端生命周期或明确的适配层中。

### Q9：一份代码如何同时支持浏览器和 Node.js？

**答**：优先依赖两端共有的 ECMAScript 和 Web 标准能力，对宿主 API 使用适配层；通过条件导出拆分 browser/node 入口；避免顶层副作用；做能力检测；测试真实的目标运行时，而不是假设“能编译就能运行”。

---

## 面试代码题

### 题目一：判断不同环境中的顶层 this

```javascript
console.log(this)
```

不能在不知道执行方式时直接给出唯一答案：

- 浏览器经典脚本：通常为 `window`。
- 浏览器 ESM：`undefined`。
- Node.js CommonJS 文件：`module.exports`。
- Node.js ESM：`undefined`。
- 浏览器 DevTools Console、Node.js REPL 等交互环境可能有自己的特殊行为，不能替代文件和模块语义。

### 题目二：这段代码为什么不能直接同构运行

```javascript
export async function loadConfig() {
  const response = await fetch('/config.json')
  return response.json()
}
```

浏览器可以相对当前页面解析 URL；普通 Node.js 脚本没有页面基准 URL。改造时应由调用方注入完整地址或基准地址：

```javascript
export async function loadConfig(baseURL) {
  const url = new URL('/config.json', baseURL)
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Load config failed: ${response.status}`)
  }

  return response.json()
}
```

### 题目三：为什么无限微任务会造成不同后果

```javascript
function loop() {
  queueMicrotask(loop)
}

loop()
```

- 在浏览器主线程中，微任务队列无法清空，后续任务和渲染机会得不到执行，页面会失去响应。
- 在 Node.js 中，事件循环也无法推进到后续 I/O 阶段，I/O 会被饿死。

这体现了两者共有的微任务饥饿问题，但浏览器还会直接表现为交互和渲染阻塞。

---

## 最终总结

回答“浏览器与 Node.js 的差异”时，可以按以下顺序组织：

1. **定性**：相同 ECMAScript，不同宿主环境。
2. **API**：DOM/BOM 与文件、网络、进程能力。
3. **全局和模块**：`globalThis`、顶层作用域、ESM 与 CommonJS。
4. **事件循环**：浏览器任务/微任务/渲染，Node.js libuv 阶段。
5. **线程模型**：单个 JavaScript 执行线程不等于整个运行时只有一个线程。
6. **安全模型**：浏览器沙箱与同源策略，Node.js 操作系统进程权限。
7. **工程实践**：SSR、条件导出、能力检测和宿主适配层。

真正高级的回答不是背诵“一个有 window，一个有 global”，而是能说明：**ECMAScript 负责语言语义，宿主环境负责把 JavaScript 接到页面、网络、文件系统和操作系统上。**

## 官方资料

- [ECMAScript Language Specification：Hosts and Implementations](https://tc39.es/ecma262/#sec-hosts-and-implementations)
- [HTML Standard：Event loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)
- [Node.js：Differences between Node.js and the Browser](https://nodejs.org/learn/getting-started/differences-between-nodejs-and-the-browser)
- [Node.js：Global objects](https://nodejs.org/api/globals.html)
- [Node.js：Permission Model](https://nodejs.org/api/permissions.html)
- [Node.js：The Node.js Event Loop](https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick)
- [Node.js：Process - queueMicrotask 与 process.nextTick](https://nodejs.org/api/process.html#when-to-use-queuemicrotask-vs-processnexttick)
- [Node.js：CommonJS modules](https://nodejs.org/api/modules.html)
- [Node.js：ECMAScript modules](https://nodejs.org/api/esm.html)
- [Node.js：Packages](https://nodejs.org/api/packages.html)
- [Node.js：Worker threads](https://nodejs.org/api/worker_threads.html)

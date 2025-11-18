---
title: CJS 和 EMS 的区别
author: DBAAZzz
date: 2025/11/18 22:34
categories:
  - 面试
tags:
  - CJS
  - EMS
---

## CJS 和 ESM

### CJS (CommonJS)

- Node.js 最初采用的模块系统
- 使用 `require()` 导入，`module.exports` 或 `exports` 导出
- 同步加载模块
- 主要用于服务器端（Node.js）

```javascript
// 导出
module.exports = { name: 'test' }
// 或
exports.name = 'test'

// 导入
const module = require('./module')
```

### ESM (ES Modules / ECMAScript Modules)

- JavaScript 官方标准的模块系统（ES6+）
- 使用 `import` 导入，`export` 导出
- 支持异步加载
- 现代浏览器和 Node.js（v12+）都支持

```javascript
// 导出
export const name = 'test'
export default obj

// 导入
import { name } from './module.js'
import obj from './module.js'
```

## 导出的本质：深拷贝 or 浅拷贝？

核心结论：模块导出的本质是 值传递，但行为取决于数据类型：

- 基本类型（number/string/boolean 等）：按值传递（类似深拷贝，修改原模块变量不影响导入方）。
- 引用类型（object/array/function 等）：按引用传递（浅拷贝，双方共享同一内存地址）。

| 模块系统         | 导出机制                                                                                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| CJS (CommonJS)   | 导出的是 module.exports 当前值的“快照”。模块首次加载时求值并缓存导出对象，后续 require 会复用该缓存（导出方后续修改不会反映到已导入的副本上）。 |
| ESM (ES Modules) | 导出的是变量的 Live Binding（实时绑定）。import 方与 export 方共享同一绑定，导入方始终能观察到导出方的最新值。                                  |

**CJS 示例：**

```javascript
// module.js
exports.obj = { count: 0 }

// a.js
const mod = require('./module')
mod.obj.count = 1

// b.js
const mod = require('./module')
console.log(mod.obj.count) // 1 - 共享引用
```

**ESM 示例：**

```javascript
// module.js
export const obj = { count: 0 }

// a.js
import { obj } from './module.js'
obj.count = 1

// b.js
import { obj } from './module.js'
console.log(obj.count) // 1 - 同样共享引用！
```

**ESM 导出的绑定是活动的（live binding）**

- ESM:

```javascript
export let count = 0
export function increment() {
  count++
}

// main.js
import { count, increment } from './module.js'
console.log(count) // 0
increment()
console.log(count) // 1 - 自动更新！
```

- CJS:

```javascript
// module.js (CJS)
let count = 0
module.exports = {
  count,
  increment: () => count++,
}

// main.js
const { count, increment } = require('./module')
console.log(count) // 0
increment()
console.log(count) // 0 - 不会更新，因为导出时是值拷贝
```

## CJS 和 ESM 的核心区别？

CJS 缓存瞬时值，ESM 提供实时绑定（但两者都不改变引用类型的浅拷贝本质）。

- ESM 的绑定是只读的（导入方无法直接修改导出变量）
- 唯一修改方式：通过导出方提供的函数（如 increment()）间接修改。

```javascript
// module.js (ESM)
export let count = 0
export const obj = { val: 0 }

// main.js
import { count, obj } from './module.js'

obj.val = 1 // ✅ 允许（修改引用类型的属性）
count = 2 // ❌ 报错！"count" is read-only
```

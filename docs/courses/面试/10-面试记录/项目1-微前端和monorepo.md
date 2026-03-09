---
title: 微前端 + Monorepo 基座
author: DBAAZzz
date: 2026/03/04
categories:
  - 面试
tags:
  - 面试
---

面试官提问：

## 架构设计层面

### 为什么选 micro-app 而不是 qiankun 或 Module Federation？做过哪些技术选型对比？

当时这个项目有几个核心诉求：子应用独立部署、低侵入接入、样式隔离稳定、不同技术栈接入。所以选择了 `micro-app`。

有对 `qiankun`、`wujie`、`micro-app` 做过技术调研。当时为了几个维度去做对比：接入成本、隔离能力、性能、社区活跃度。

`qiankun` 的接入成本较高，需要对子应用做生命周期的配置；`micro-app` 是基于 Web Components + Proxy 做 JS 沙箱隔离，偏组件化接入，接入成本较低；`wujie` 的接入成本也较轻。

`qiankun` 的 JS 隔离是通过 Proxy 实现，样式隔离则是可以改写样式表/Shadow DOM 去实现的；`wujie` 是通过 iframe 做 JS 隔离，隔离程度最高；`micro-app` 则是通过 Web Component + Proxy 实现 JS 沙箱，样式表/Shadow DOM 实现样式隔离。

性能方面的话，`wujie` 的性能损耗是最大的，并且整体生态没有很完善。综合考虑下来，就选择了 `micro-app` 做微前端框架。

### 子应用独立部署的具体方案是什么？Serverless 用的什么平台，怎么处理版本管理？

具体方案是：子应用单独构建+单独静态托管

### 应用路由架构设计

基座只注册子应用的入口壳路由，比如 /asset/\* 挂载对应的 micro-app 容器，业务路由完全由子应用自己管理。侧边栏菜单是基座根据后端下发的菜单树渲染的，作为导航契约和 fallback。

子应用路由切换后通过 micro-app 的 dispatch 把当前路由信息同步给基座，基座据此更新侧边栏高亮和面包屑。这样基座管应用调度和导航状态，子应用管页面路由，职责不交叉

### pnpm + Turborepo 的 apps/packages 具体是怎么划分的？哪些逻辑放 packages，判断标准是什么？

`apps` 目录放基座和各个子应用，每个子应用对应一个独立的运维后台，比如云资产管理、事件管理等，它们各自有独立的构建配置和部署流程。

`packages` 大概分这么几类：

- **ui 组件库**：跨子应用复用的通用业务组件，比如表格、表单这些后台高频组件
- **shared/utils**：工具函数、常量、类型定义这些纯逻辑的东西
- **bridge**：就是简历里提到的 `bridgeHelper` 和 `MicroAppSyncPlugin`，主子应用通信层
- **eslint-config / tsconfig**：统一的工程规范配置

我判断一个模块该不该抽到 `packages`，主要看两个条件：一是被两个及以上 `apps` 引用，只有一个应用用的就留在应用内部；二是变更频率和业务耦合度，如果逻辑跟特定业务强绑定、经常跟着业务需求改，就不适合抽出来，抽出来反而增加协调成本。

再补一句 Turborepo 的价值：
Turborepo 在这个结构里主要解决构建顺序的问题，通过拓扑排序保证 ui 组件库这些底层包先构建，上层 `apps` 再构建，配合缓存机制，没改动的包直接跳过。

### "共享逻辑源码直引消除热更新割裂"——具体怎么做的？为什么不用构建产物引用？

`packages` 里的共享包分两种策略：

`utils`、`types` 这类纯逻辑包导出的是源码，`apps` 通过 `workspace:*` 直接引用源文件。这样做的好处是改了 `utils` 里的代码，Vite 的 HMR 能直接感知到文件变化并热更新，跟改应用内部代码体验一样。如果走构建产物引用，改了 `utils` 源码还得先重新 build 出产物，`apps` 才能感知到变化，开发时就会出现"改了代码没效果、要手动重新构建"的割裂感。

ui 组件库因为涉及样式编译、组件注册这些比较重的处理，不适合源码直引，所以走构建产物。这就需要 Turborepo 的拓扑排序来保证 ui 库先构建完，`apps` 再构建。

## 依赖治理层面：

### pnpm overrides 和 strict-peer-dependencies 分别解决什么问题？能举个实际踩过的坑吗？

`pnpm overrides` 解决的是"强制统一版本"

Monorepo 里多个子应用各自声明依赖，很容易出现同一个包存在多个版本的情况。
比如基座用 Vue 3.3，某个子应用的某个第三方依赖间接引入了 Vue 3.2，运行时就会出现两个 Vue 实例，典型的症状是 `inject`/`provide` 失效、响应式丢失这类诡异的 bug。
`overrides` 的作用就是在根 `package.json` 里强制把所有 Vue 相关的版本收敛到同一个版本，不管子依赖声明的是什么版本，最终安装的都是我指定的那个。

`strict-peer-dependencies` 解决的是 "安装阶段提前拦截"。默认情况下 pnpm 遇到 `peerDependencies` 版本不匹配只是警告，不会阻断安装。
开了 `strict-peer-dependencies` 之后，只要有 peer 版本冲突就直接报错、安装失败。
这相当于把问题从运行时提前到了安装时，在 CI 阶段就能发现，不会让有问题的依赖悄悄混进去。

### 循环依赖扫描脚本的原理是什么？AST 分析还是基于 import 路径静态分析？

都不是。我们没有做 AST 分析去扫描 `import` 语句，也不是分析源码文件级别的引用关系。我们的思路更简单直接——基于 `package.json` 的依赖声明做包级别的检查。

先扫描 `apps` 和 `packages` 目录，读取每个包的 `package.json`，把所有包和它们的依赖关系收集到一个 `Map` 里。

做了以下几种检测：

第一是横向依赖检查，确保子应用之间不能互相依赖，app 只能依赖 `packages` 下的共享包。

第二是循环依赖检测

第三是检查 workspace 内部包是否都用了 `workspace:*` 协议，没用的给警告。

追问"为什么不做文件级的 AST 分析"：

文件级的 `import` 分析成本高、速度慢，而且 Monorepo 里包的边界本身就是通过 `package.json` 定义的，直接基于声明来检查既快又准。
如果真的需要文件级的分析，可以用 `madge` 这类工具，但对我们的场景来说没有必要。

### 通信与状态同步：

### bridgeHelper 底层是基于什么通信机制？CustomEvent、postMessage 还是 props？

`bridgeHelper` 封装的是控制基座 UI 层面的方法。`bridgeHelper` 就是基座初始化时把一组方法挂到 `window.bridgeHelper` 这一命名空间下，子应用在 mount 阶段直接通过 `window.bridgeHelper` 调用。
`micro-app` 的 with 沙箱对 `window` 上已有的属性不会拦截，所以子应用能正常访问到。

`micro-app` 自带的 `getData`/`setData` 和 `dispatch` 也能通信，但它是数据驱动的，适合传递状态。

我们的场景更多是子应用需要调用基座的能力，这种命令式调用用方法直接调比数据派发更直观，语义也更清晰。

### MicroAppSyncPlugin 怎么做到按 Store ID 自动水合？如果主子应用 Pinia 版本不一致怎么办？

**自动水合的原理：**
核心就是一个命名约定——基座通过 `microApp.setGlobalData` 广播状态时用的 key，和子应用 `defineStore` 的 Store ID 保持一致。

插件在子应用 store 初始化时通过 `store.$id` 取出 ID，去 `globalData` 里查找同名 key，找到就自动 `$patch` 进去。不需要手动写映射关系，名字对上就自动水合。

**版本不一致的问题：**
实际上不会有问题。主子应用各自创建独立的 Pinia 实例，两边没有共享任何对象引用。数据传输走的是 `microApp` 的 `globalData` 通道，基座端用 `toRaw()` 剥离 Vue 的 Proxy 后再 `setGlobalData`，子应用端拿到的就是纯 JS 对象，直接 `$patch` 进去。所以本质上就是普通对象的传递，`$patch` 接收纯对象这个 API 从 Pinia v2 起就是稳定的，不涉及内部数据结构的兼容性。

### 状态同步有没有遇到过时序问题或者数据冲突？

实际开发中没有遇到过时序问题或数据冲突。主要是架构设计上提前规避了：
第一，状态的写入权收归基座，子应用只消费不修改。子应用需要触发全局行为都是通过 `bridgeHelper` 委托基座执行，不会直接改共享状态，所以不存在多个子应用竞争写入的问题。
第二，用户信息、Token 这些关键数据在登录页就已经拿到了，进入基座时数据一定是就绪的，子应用挂载时直接水合就行，不存在"数据还没回来"的情况。
第三，子应用卸载时会销毁 `MicroAppSyncPlugin` 对应的 watch 监听，避免已卸载的子应用还在响应状态变化。

# Monorepo 依赖版本冲突 — 面试速记

## 解决方案（三层防线）

| 层面     | 手段                           | 作用                                    |
| -------- | ------------------------------ | --------------------------------------- |
| 安装拦截 | `strict-peer-dependencies`     | `peerDeps` 版本不匹配直接报错，阻断安装 |
| 版本收敛 | `pnpm overrides`               | 根 `package.json` 强制锁定关键依赖版本  |
| 工程规范 | 自定义脚本 + `pre-commit` hook | 检查内部包是否用 `workspace:*` 协议引用 |

## 高频追问

### `overrides` 和 `strict-peer-dependencies` 区别？

- **`overrides`**：强制统一版本，不管子包声明什么，最终装的是我指定的版本
- **`strict-peer-dependencies`**：安装阶段拦截，`peerDeps` 不匹配就报错，把问题从运行时提前到安装时

### 什么依赖需要强制收敛？

- **必须收敛**：Vue、React、Pinia 这类全局单例库，多实例会导致 `inject/provide` 失效、响应式丢失
- **不必收敛**：`lodash` 这类纯函数库，多版本共存只影响包体积，不会有运行时冲突

### `peerDependencies` vs `dependencies`？

- **`dependencies`**：自己带，pnpm 严格隔离，各用各的，不冲突
- **`peerDependencies`**：自己不带，要求宿主提供。宿主没装 → 运行时报 `Cannot find module`

### 组件库构建时 `peerDeps` 没装会报错吗？

不会。打包工具把 `peerDeps` 当 `external` 处理，产物里只保留 `import` 语句，不实际打包。报错发生在**子应用运行时**去 `node_modules` 找不到的时候。

### 实际踩过的坑？

某子应用引入的组件库间接依赖了不同版本的 Pinia，没开 `strict` 时安装没报错，运行时 `$subscribe` 行为异常，排查很久才定位到双 Pinia 实例问题。之后加了 `overrides` 锁版本 + `strict-peer-dependencies` 拦截，双重保障。

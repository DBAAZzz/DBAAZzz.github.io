---
title: 微前端 + Monorepo 基座
author: DBAAZzz
date: 2026/02/04
categories:
  - 面试
tags:
  - 面试
---

面试官提问：

## 架构设计层面

### 为什么选 micro-app 而不是 qiankun 或 Module Federation？做过哪些技术选型对比？

当时这个项目有几个核心诉求：子应用独立部署、低侵入接入、样式隔离稳定、不同技术栈接入。所以选择了mircapp。

有对qiankuan、wujie、micro-app做过技术调研。当时为了几个维度去做对比：接入成本、隔离能力、性能。

qiankun的接入成本较高，需要对子应用做生命周期的配置；micro-app是基于web components + proxy做JS 沙箱隔离，编组件化接入，接入成本较低；wujie的接入成本也较轻。
qiankun的JS隔离是通过proxy实现，样式隔离则是可以改写样式表/ShadowDOM去实现的；wujie是通过ifame做JS隔离，隔离程度最高；micro-app则是通过web component + proxy实现JS沙箱，样式表/ShadowDOM实现样式隔离。
性能方面的话，wujie的性能损耗是最大的，并且整体生态没有很完善。综合考虑下来，就选择了micro-app做微前端框架。

### 子应用独立部署的具体方案是什么？Serverless 用的什么平台，怎么处理版本管理？

具体方案是：子应用单独构建+单独静态托管

### pnpm + Turborepo 的 apps/packages 具体是怎么划分的？哪些逻辑放 packages，判断标准是什么？

apps 目录放基座和各个子应用，每个子应用对应一个独立的运维后台，比如云资产管理、事件管理等，它们各自有独立的构建配置和部署流程。

packages 大概分这么几类：

- ui 组件库：跨子应用复用的通用业务组件，比如表格、表单这些后台高频组件
- shared/utils：工具函数、常量、类型定义这些纯逻辑的东西
- bridge：就是简历里提到的 bridgeHelper 和 MicroAppSyncPlugin，主子应用通信层
- eslint-config / tsconfig：统一的工程规范配置

我判断一个模块该不该抽到 packages，主要看两个条件：一是被两个及以上 apps 引用，只有一个应用用的就留在应用内部；二是变更频率和业务耦合度，如果逻辑跟特定业务强绑定、经常跟着业务需求改，就不适合抽出来，抽出来反而增加协调成本。

再补一句 Turborepo 的价值：
Turborepo 在这个结构里主要解决构建顺序的问题，通过拓扑排序保证 ui 组件库这些底层包先构建，上层 apps 再构建，配合缓存机制，没改动的包直接跳过。

### "共享逻辑源码直引消除热更新割裂"——具体怎么做的？为什么不用构建产物引用？

依赖治理层面：

pnpm overrides 和 strict-peer-dependencies 分别解决什么问题？能举个实际踩过的坑吗？
循环依赖扫描脚本的原理是什么？AST 分析还是基于 import 路径静态分析？

通信与状态同步：

bridgeHelper 底层是基于什么通信机制？CustomEvent、postMessage 还是 props？
MicroAppSyncPlugin 怎么做到按 Store ID 自动水合？如果主子应用 Pinia 版本不一致怎么办？
状态同步有没有遇到过时序问题或者数据冲突？

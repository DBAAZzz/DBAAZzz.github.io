---
title: 小程序Vite插件及钩子库
author: DBAAZzz
date: 2026/03/06
categories:
  - 面试
tags:
  - 面试
---

### 这个插件拦截返回的底层原理是什么？

微信小程序本身没有提供类似 Vue Router 的 `beforeRouteLeave` 钩子，`onUnload` 和 `onHide` 都是页面已经开始离开后才触发的，属于事后通知，没法阻止返回。

我的方案是利用微信的 `<page-container>` 组件。这个组件本来是做页面内弹出层的，但它有一个特性：当 `show` 为 `true` 时，用户触发手势返回或点导航栏返回，微信底层会优先关闭这个容器而不是执行页面出栈，并且在关闭前触发 `beforeleave` 事件。

所以我在构建阶段往需用用到的页面的 `template` 里注入一个不可见的 `<page-container>`（`overlay` 为 `false`、`duration` 为 `false`），让它视觉上完全透明。

用户触发返回时，`beforeleave` 回调就是我们的拦截时机，开发者可以在这里弹确认框、做埋点，或者直接阻止返回。

### 为什么选择在构建阶段用 Vite 插件做代码注入，而不是运行时方案？

运行时方案比如全局 mixin 或者重写 `uni.navigateBack`，有几个问题。全局 mixin 只能注入生命周期钩子，没法往 `template` 里加组件；

构建阶段的好处是我能同时操作 `template` 和 `script` — 往 `template` 注入 `<page-container>` 组件，往 `script` 注入响应式变量和事件处理函数。

开发者完全不需要改任何页面代码，只要在 `vite.config` 里加一行插件配置就行。

### 你简历写"保留完整 SourceMap 映射"，具体是怎么做的？

第一层是架构层面的 SourceMap 友好性。我选择 `MagicString` 而不是字符串拼接或正则替换，核心原因就是 `MagicString` 内部维护了一张原始位置到新位置的映射表。

每次 `remove`、`prepend`、`overwrite` 操作，它都会记录"新代码的第 N 个字符对应原始代码的第 M 个字符"。

所以理论上随时可以调用 `generateMap({ hires: true })` 拿到精确的 SourceMap。

相比之下，如果用正则替换，位置关系就完全丢失了；用 `@babel/generator` 整体重生成，也只能拿到重新格式化后的代码，原始位置信息也没了。


### 
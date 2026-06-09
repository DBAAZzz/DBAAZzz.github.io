---
title: RPC
author: DBAAZzz
date: 2026/01/03 15:00
categories:
  - 后端
  - 前端
  - 架构
tags:
  - RPC
  - 远程过程调用
  - JSBridge
  - LSP
  - MCP
  - stdio
---

# RPC 理解

## 一、什么是 RPC

RPC 是 Remote Procedure Call，远程过程调用。它的作用是让开发者能够像调用本地方法一样，去调用远程服务器里的方法，而不需要了解底层网络的细节。

RPC解决的不是"怎么发请求"的问题，而是"怎么把远程服务抽象成函数调用"的问题。

一句话总结：RPC的初衷就是用抽象去掩盖分布式通信的复杂度。

在前端其实也有RPC的实际应用，以JSBridge为例，本质上就是WebView去调用客户端的方法，通过协议的方式去传输我们序列化后的数据。

## 二、RPC 的调用过程

一个RPC的调用过程：

```ts
const user = await userClient.getUserById({ id: 123 })
```

实际发生的是：

```txt
1. 你的代码调用本地 client 方法
2. client 把参数序列化
3. 通过网络发给远程服务
4. 远程服务收到请求
5. 找到对应方法 getUserById
6. 执行业务逻辑
7. 把结果序列化返回
8. client 反序列化结果
9. 你的代码拿到 user
```

## 三、RPC 的传输协议

绝大多数RPC都是走的TCP、UDP或者HTTP网络协议的。但stdio也能作为RPC的通信通道。目前市面上流行的RPC框架基本上都走的是网络协议，而不是stdio。原因是显而易见的，为了满足分布式的需求。

## 四、基于 stdio 的 RPC 应用场景

### 4.1 代码编辑器的插件通信（LSP）

以VS Code为例，我们在编辑器中去编写Java、Python、Go代码，为什么能实现自动补全呢？因为VS Code内部运行的一个Node主进程，它会在后台去运行对应语言的服务器（Language Server，比如 gopls 或 pylsp）。

VS Code 和这个底层服务器之间，就是用基于 stdio 的 JSON-RPC 进行通信的（这被称为 LSP 协议）。

### 4.2 本地跨语言调用

假如我们用Node去写的一个服务，想去调用Python的一个方法。然后我们又不想给这个Python服务去单独写HTTP服务。Node.js 就可以直接 spawn 启动这个 Python 脚本，通过 stdio 传参数进去，再通过 stdio 读出 Python 处理好的结果。

### 4.3 AI 场景：MCP 协议

MCP协议就是最经典的一个例子。MCP官方其实规定了两种 Transport标准，一个是基于网络的SSE，另外一个就是标准的stdio。

---
title: AI应用和Agent
author: DBAAZzz
date: 2026/03/07
categories:
  - 面试
tags:
  - 面试
---

### Partial JSON 增量解析，能解释一下这是什么问题，为什么需要它？

LLM 的流式输出本质上是逐 token 吐字符串，如果要求它输出 JSON，那这个 JSON 在流传输过程中是不完整的——比如一个数组 ["a", "b", "c"]，可能先收到 ["a", "b，这时候直接 JSON.parse 会抛异常。

如果等到整个 JSON 输出完再解析，用户就只能盯着加载动画等到最后才能看到结果，体验很差。我需要在 JSON 还在流式传输时，就能识别出哪些部分已经"完整"了，提前推送给前端渲染，这就是增量解析要解决的问题。

## 深入机制

### LLM 的输出为什么格式不稳定？你是怎么解决的？

有两个层面的不稳定：

第一是格式层面：即使 prompt 里要求输出 JSON，模型可能在 JSON 外面加 markdown 代码块（`json...`），或者字段顺序跟 Schema 定义不一致，甚至在特殊情况下输出截断的内容。

第二是内容层面：模型可能捏造字段、幻觉数据。

我的解决方案是用 Zod Schema 强约束输出结构。

具体来说，通过 Vercel AI SDK 的 Output.object({ schema }) 参数，SDK 会在调用 API 时自动将 Zod Schema 转成 JSON Schema 注入到 system prompt 里，同时在接收到输出后做格式修正和校验，大幅降低格式不稳定的概率。

### 流式输出的 JSON 是不完整的，你怎么知道什么时候一个对象'已经完整'可以渲染了？

我用的是 Vercel AI SDK 提供的 partialOutputStream。它内部在每次收到新的 text delta 时，会尝试用专门的 partial JSON parser 解析当前累积的文本，把能解析出来的部分作为一个类型安全的 partial 对象推送出来。

对于数组类型的字段（比如 weakness 列表），partial object 里数组的长度会随着流的推进逐渐增加——从 0 条到 1 条到 2 条。我在消费端维护一个"已发送计数"，每次收到新的 partial 对象就跟上次做 diff，只把新增的条目推送给前端。同时我会校验新增条目的关键字段是否非空，确保这个条目已经"完整"再发送，而不是把一个字段还在传输中的半成品推出去。

### Zod Schema 在这里起什么作用？是运行时校验还是别的？

两个作用都有，但更核心的是类型推导和结构约束。

Zod Schema 定义了 LLM 输出的数据结构，SDK 会自动把它转换成 JSON Schema 告诉模型"你必须按这个格式输出"，这是约束 LLM 行为的手段。

同时，TypeScript 可以通过 `z.infer<typeof schema>` 从 Schema 反推出类型，让 partialOutputStream 吐出来的 partial 对象是有类型的 `Partial<T>`，而不是 unknown，这样在前端消费端就有完整的类型提示和保护，不会写出访问不存在字段的代码。

### 你是用什么方式解析不完整的 JSON 的？自己写的还是用了库

最终用的是 Vercel AI SDK 内置的 partialOutputStream，没有自己造轮子。

但我要诚实说，早期版本是自己用正则表达式做的手动解析——对累积的 JSON 字符串用 regex 匹配已经完整的字段。这个方案能跑，但有几个明显缺陷：依赖 JSON 字段的输出顺序、对转义字符的处理不健壮、嵌套结构很难正确处理。后来发现 SDK 的 partialOutputStream 已经把这些 edge case 都处理好了，就切换过去了。这也是我在这个项目里学到的一个教训——先看 SDK 有没有提供，再考虑自己实现。

### Vercel AI SDK 在这里帮你做了什么？你用的是哪个 API？

核心用的是 streamText 配合 Output.object({ schema }) 参数，以及返回结果上的 partialOutputStream。

streamText 本身负责跟 LLM 建立流式连接，Output.object 告诉 SDK 期望输出是一个符合 Zod Schema 的对象，SDK 会在内部做 prompt 注入和输出处理。partialOutputStream 是一个 AsyncIterable，每次收到新 token 时，SDK 内部会增量解析当前已收到的文本，如果能解析出新的 partial 对象就 emit 出来，消费端直接 for await 遍历就能拿到类型安全的增量数据。

## 取舍与权衡

### "DeepSeek-Reasoner 有思维链输出，你是怎么处理的？流式结构化输出和思维链能同时拿到吗？"

这是一个实际踩过的坑。

如果直接用 streamObject（SDK 提供的纯结构化输出 API），思维链就完全丢失了，因为 streamObject 只暴露 partialObjectStream，没有办法拿到原始的 reasoning-delta 事件。

所以我的方案是用 streamText 而不是 streamObject。streamText 的 fullStream 里包含所有事件类型，包括 reasoning-delta（思维链 token）和 text-delta（正文 token）。同时 streamText 返回的结果对象上也暴露了 partialOutputStream，每次 text delta 来的时候 SDK 内部也会同步 emit partial object。

所以我同时消费这两个 stream：fullStream 用来过滤 reasoning-delta 事件转发给前端显示思考过程，partialOutputStream 用来拿类型安全的增量结构化数据。两个 AsyncIterable 并发消费，我写了一个 mergeStreams 工具函数来合并它们，按到达顺序处理，保证思维链和结构化数据都能实时推送给前端。

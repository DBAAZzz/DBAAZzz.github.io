---
title: 浏览器渲染原理-chatgpt
author: DBAAZzz
date: 2025/12/04 01:00
categories:
  - 面试
tags:
  - 浏览器原理
  - 性能优化
  - 渲染机制
  - V8
---

# 浏览器渲染原理

## Chrome 架构概览

Chrome 浏览器采用多进程架构：浏览器进程（Browser Process）负责界面管理、导航控制、网络请求等，渲染进程（Renderer Process）负责页面内容渲染，GPU 进程负责图形硬件加速，插件进程或扩展进程各司其职[1][2]。每个标签页通常对应一个渲染进程（不同网站还可隔离在不同进程），这样一来某个标签页崩溃只影响自身，提升稳定性[3][4]。每个渲染进程内含多线程，如主线程负责 HTML/CSS 解析、布局、绘制和执行脚本等，其他线程（如 JS 引擎内部线程、Worker 线程、网络线程等）并行处理编译、脚本、网络等任务[5][6]。Chrome 使用 Blink 渲染引擎（浏览器内核）解析 HTML/CSS 构建页面结构，使用 V8 JavaScript 引擎处理和执行 JS 代码[7][8]。渲染进程在沙箱内运行，无法直接访问硬件或操作系统 API，所有 GPU 调用均通过独立的 GPU 进程来完成[2]。

## 渲染流程五大阶段

浏览器将网页呈现为像素的过程包括以下五大阶段：

### 解析 HTML 构建 DOM 树

主线程开始解析 HTML 源码，将标记转换为 DOM 节点，构建起 DOM 树（Document Object Model）[9][10]。浏览器边下载边解析，一旦遇到 `<script>`（无 async/defer）会暂停解析并执行脚本，因为脚本可能修改 DOM（如 document.write）[11][12]。同时，浏览器并行触发预加载扫描（preload scanner）任务，遇到 `<img>`、`<link>` 等资源时提前发起网络请求以加速后续加载[13][14]。

### 解析 CSS 构建 CSSOM 树

同时主线程解析所有 CSS（内联与外部），根据选择器和规则构建 CSSOM（CSS Object Model）树[9][15]。CSSOM 是 CSS 的内部表示，浏览器合并来自用户样式和用户代理默认样式的规则，对每个 DOM 节点计算出最终的样式（computed style）[9][16]。

### 构建渲染树（Render Tree）

浏览器将 DOM 树和 CSSOM 树合并成渲染树。渲染树只包含需要渲染的节点（可见的 DOM 元素），每个节点携带其计算好的样式和内容[17][15]。例如 `<head>`、脚本、`display: none` 的元素不会出现在渲染树中，而 `visibility:hidden` 的元素仍在渲染树中但不绘制内容[18][15]。构建渲染树时，浏览器遍历 DOM 树的可见节点，查找并应用对应的 CSSOM 规则，生成具有内容和样式信息的渲染树节点[19][15]。

### 布局（Reflow）

布局阶段根据渲染树计算每个节点的几何尺寸和位置[20]。浏览器从渲染树根节点开始，结合视口大小和盒模型属性，依次计算出每个可见元素在屏幕上的绝对位置和大小。第一次计算称为“布局”，后续若 DOM 树、渲染树或样式发生变化，则需重新计算（回流，reflow）[21][22]。例如，如果首屏图片加载后才知道真实尺寸，浏览器会触发一次回流来调整布局[23]。

### 绘制（Paint/Rasterization）

在得到最终的布局信息后，浏览器开始绘制阶段，将渲染树节点转化为实际像素[24]。主线程沿着布局树遍历节点，将每个节点的背景、边框、文字、图像等内容绘制到屏幕上（或者绘制到离屏缓存中准备合成）。这个过程也称为光栅化（rasterization），使用 Skia 等绘图库完成对元素的像素绘制[25][26]。为保证 60FPS 流畅（每帧 <16.7ms），绘制通常会分解到 GPU 图层以并行处理[27][28]。绘制完成后，如果有多个图层，还需进行合成（compositing）阶段把各图层合并为最终图像。

在以上流程中，每一步都依赖上一步的数据。例如修改样式会导致重计算布局和重绘，修改布局则需要重新绘制受影响部分[29][30]。优化渲染流程的核心思路是减少阻塞操作和不必要的重排重绘，尽早呈现有意义的内容。

![图 0](../../../../public/images/2025-12-04-fa3e084693ce38ebae43e3e68fba833293008bd4a9a2c4d31aa8520b0bbd9fda.png)

## Blink 与 V8

Blink 是 Chromium 项目的渲染引擎，负责加载和渲染网页。它的职责包括发送网络请求获取资源、解析 HTML/CSS、构建 DOM/CSSOM/渲染树、执行布局和绘制等[7][31]。在渲染进程中，Blink 提供 DOM API 和 Web API 给 JavaScript 调用。V8 是 Chrome 的 JavaScript 引擎，嵌入在渲染进程内，负责编译、优化和执行 JavaScript 以及 WebAssembly 代码[8]。Blink 调用 V8 来执行脚本，通过 V8 访问 DOM 和浏览器功能（例如事件处理、网络请求等）[8]。V8 采用即时编译和高效垃圾回收技术，使复杂的脚本逻辑尽可能高效运行。简而言之，Blink 负责页面结构和样式的处理，V8 负责脚本的解析和执行，两者协同工作完成页面的渲染与交互。

## 关键渲染路径（Critical Rendering Path）及优化

关键渲染路径指浏览器完成从请求资源到首次绘制内容的关键步骤序列[32]。其主要阶段包括：下载并解析 HTML 构建 DOM、下载解析 CSS 构建 CSSOM、构建渲染树、执行布局、最终绘制。这一过程中，任何阻塞如同步脚本或外部样式表都可能延迟后续渲染[11][31]。优化关键渲染路径的目的是尽快把有意义的内容呈现给用户。常见优化策略包括：

- **减少阻塞资源**：例如，将关键 CSS 内联或使用 Critical CSS，将不影响首屏的脚本加上 async 或 defer（这样解析 HTML 时可以并行下载执行，不阻塞 DOM 构建）[33][14]。
- **提前加载重要资源**：使用 `<link rel="preload">` 为关键图像、字体等资源预先发起请求[33][14]。
- **延迟加载非关键内容（Lazy Loading）**：如延迟加载屏幕外图片和下方内容[34]。
- **骨架屏或占位符技术**：也可提升首屏体验，在首屏未完全绘制前显示简化布局轮廓，让用户尽早看到“页面框架”。

通过这些方法可以 **缩短关键渲染路径长度** （Critical Path Length），从而加快首次可绘制时间（FCP）和最大内容绘制时间（LCP），改善用户感知的速度[32][34]。

## 合成与光栅化流程

合成（Compositing）是多个图层（layer）合并为最终图像的过程。现代浏览器会自动为特定元素或效果（如 CSS 3D 变换、opacity、will-change 等）单独创建合成层，这些层可以交由 GPU 处理以提速[35]。在图层合成前，每个图层都需要被光栅化（Rasterization）：即将其绘制指令或记录（display list）转换为像素位图。Chrome 中，光栅化可发生在主线程（软件方式）或 GPU 进程（硬件加速）上[36][2]。在硬件加速模式下，Blink 的合成器（Compositor）会通过 OpenGL/Direct3D 等 3D API 将每个图层作为纹理绘制在最终帧缓冲上[36]。Chrome 会将渲染进程中的绘制命令序列化，通过共享内存传递给 GPU 进程执行[2]。GPU 进程位于沙箱外，仅负责执行底层 GL/D3D 调用，保证安全性[2]。使用 GPU 处理图层绘制和合成的好处是：即使主线程繁忙，Compositor 线程仍可在 GPU 上合成新帧，实现平滑动画和滚动[37][36]。

## GPU 加速机制

Chrome 利用 GPU 加速渲染流程中的密集计算。主要机制包括 **图层分离** 和 **硬件合成** 。如上所述，一旦元素被提升为 GPU 图层（例如视频、Canvas、具有 3D 变换的元素等），该层的光栅化与合成可由 GPU 负责[35]。合成时，Chrome 的合成器线程（位于渲染进程）会将分层后的场景提交给 GPU 进程，通过 OpenGL ES 2.0 命令将每个图层纹理绘制到屏幕[36]。Chrome 为此维护一个专门的 GPU 进程，渲染进程把 3D 绘制调用序列化到该进程的命令缓冲区[2]。GPU 进程解析这些命令并真正调用底层图形 API。[2]中指出，GPU 进程的独立性提高了安全性（渲染进程受限于沙箱）和健壮性（GPU 崩溃不致整个浏览器崩溃），也让渲染进程和 GPU 并行工作以发挥多核 CPU 和 GPU 的性能[38][39]。

## 性能优化策略

为了提升加载和渲染性能，前端工程师常用以下策略：

- **懒加载（Lazy Loading）** ：将屏幕外资源（如下方的图片或不重要的脚本）延后加载，只在需要时才请求，以缩短首屏关键渲染路径[34]。现代浏览器支持 `<img loading="lazy">` 等原生方式，也可使用 IntersectionObserver 手动懒加载。
- **异步资源** ：对 JavaScript 使用 async/defer，确保脚本下载和执行不阻塞 HTML 解析[33]。对样式与脚本之外的资源（例如字体）使用 `<link rel="preload">` 或 `<link rel="prefetch">` 做加载提示，加速关键内容。
- **预渲染/预加载** ：使用 rel=preload/preconnect 预先建立连接或下载关键资源，缩短真实加载开始时间[33]。HTTP/2/3 和早期提示（Early Hints 103）等新特性也可提前发送资源加载指令。
- **资源优化** ：压缩与合并 CSS/JS，使用更高效的图片格式（WebP/AVIF）、启用缓存和 CDNs，尽量减少首屏的网络往返。
- **骨架屏/渐进加载** ：在真实内容加载之前，先渲染页面框架或占位内容，让用户“看到”页面结构，提升感知性能。
- **代码分割和缓存** ：通过拆分 Webpack 等包，对首屏必要的代码进行懒加载；使用 ServiceWorker 等缓存策略缓存可复用资源。

## 渲染性能指标及优化

现代浏览器和监控工具提供多种指标来量化渲染性能：

- **首次内容绘制（FCP，First Contentful Paint）** ：从用户触发导航到页面绘制出第一个内容（文本、图片、SVG、canvas 等）的时间[40]。这是衡量用户感知加载速度的重要指标。通常建议 FCP 目标不超过~1.8 秒[41]。优化方法包括优先加载 CSS 和关键资源、减少 DOM 复杂度等。
- **最大内容绘制（LCP，Largest Contentful Paint）** ：页面视口内最大的图像或文本块渲染完成的时间[42]。它反映了用户看到主要内容的时间。通常建议 LCP 不超过~2.5 秒[43]。为优化 LCP，可确保关键图片或背景图像尺寸合适并快速加载，对关键文本块使用系统字体或快速加载的 Web 字体，避免体积过大的阻塞资源。
- **累计布局偏移（CLS，Cumulative Layout Shift）** ：页面生命周期内所有意外布局移动的累积得分[44]。CLS 衡量视觉稳定性，分数越低越好（理想 <0.1）。网页在加载中如果出现元素无预留空间导致的闪动（如图片、广告或字体异步加载引起的位移），都会增加 CLS[45]。优化方法包括为图片、iframe 等指定固定宽高属性，避免动态注入内容不预留空间，以及减少加载延迟造成的重排。
- **可交互时间（TTI，Time to Interactive）** ：指页面何时能够可靠响应用户输入的时间[46]。TTI 考虑资源加载完成后，主线程不再忙于脚本执行，页面能快速响应点击/输入。过去一般要求 TTI 在 5 秒以内（移动设备环境）[47]。优化 TTI 的关键是缩短主线程工作量，如拆分 JS 包、使用 Web Worker、避免大型长任务。值得注意的是，Chrome 已在 Lighthouse 10 中用其他指标（如交互到下一绘制 INP）替代了 TTI，但概念同样适用于衡量可交互性。[46][47]

## 回流与重绘机制

回流（Reflow）和重绘（Repaint）是浏览器渲染中两个昂贵的操作。
**回流** 指修改了元素布局相关属性（如几何尺寸、字体等）或添加/删除节点时，浏览器需要重新计算受影响区域或整个页面的几何信息[48][30]。例如动态添加大量 DOM 元素、改变元素的 width/height、display 等都会触发回流。回流非常耗费性能，因为它涉及计算多个元素的位置和大小。
**重绘** 指对已有布局进行视觉绘制，当只修改元素外观（如 color、background、visibility 等）且不影响布局时，就会触发重绘[49]。重绘开销相对较小，但仍需要在回流或样式变化后重新绘制像素。一般来说，每次回流都会伴随重绘[48][30]。因此，应尽量减少频繁的回流重绘。例如，将对样式的批量修改合并后再应用，或者使用 DocumentFragment 批量插入节点以避免多次回流[50][51]。理解不同 CSS 属性对回流/重绘的影响（如 csstriggers.com）也是优化的关键。

## 渲染流程图示

**渲染流水线示意图**： 从左到右依次是解析、构建 DOM/CSSOM、生成渲染树、布局和绘制等阶段。箭头表示数据流动和转换过程。有些阶段可并行或被跳过（如滚动时可跳过布局/绘制，直接重合成）[52][48]。

**DOM 与渲染树对照图**： 左侧是 HTML 源码对应的 DOM 树结构，右侧是合并了样式后的渲染树。可以看到，某些 DOM 节点（如脚本、display:none 元素）未出现在渲染树中，而渲染树只保留需显示的内容和它们的样式[17][15]。渲染树的建立确保浏览器只为可见节点计算布局和绘制。

## 参考文档

[30] Chrome 官方文档：《Inside look at modern web browser》系列（Chrome 开发者博客）。
[31] Chromium 官方设计文档：GPU 加速合成（GPU Accelerated Compositing in Chrome）等。
[32] MDN Web Docs： Performance 指南、《How browsers work》文章、 Glossary 中关于渲染指标和 CSS 渲染的条目。
[33] W3C/WHATWG 规范：HTML 解析模型、CSSOM、Web Performance API 等相关规范。
[34] 相关教程与书籍：《Web 性能优化》、《深入理解 Chrome 渲染机制》等。
[35] 以上内容基于最新公开资料和官方文档撰写，以帮助开发者深入理解 Chrome 浏览器的渲染原理并应对面试相关问题。

[1] [3] [4] Inside look at modern web browser (part 1) | Blog | Chrome for Developers
https://developer.chrome.com/blog/inside-browser-part1

[2] [6] [36] [38] [39] GPU Accelerated Compositing in Chrome
https://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome/

[5] [11] [13] [16] [29] [33] Inside look at modern web browser (part 3) | Blog | Chrome for Developers
https://developer.chrome.com/blog/inside-browser-part3

[7] [8] [25] [52] What is Blink? | Web Platform | Chrome for Developers
https://developer.chrome.com/docs/web-platform/blink

[9] [10] [12] [14] [17] [18] [19] [20] [21] [22] [23] [24] [26] [27] [28] [31] [35] [48] Populating the page: how browsers work - Performance | MDN
https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

[15] Render-tree Construction, Layout, and Paint | Articles | web.dev
https://web.dev/articles/critical-rendering-path/render-tree-construction

[30] [49] [50] [51] javascript - What's the difference between reflow and repaint? - Stack Overflow
https://stackoverflow.com/questions/2549296/whats-the-difference-between-reflow-and-repaint

[32] [34] Web performance | MDN
https://developer.mozilla.org/en-US/docs/Web/Performance

[37] Inside look at modern web browser (part 4) | Blog | Chrome for Developers
https://developer.chrome.com/blog/inside-browser-part4

[40] [41] First Contentful Paint (FCP) | Articles | web.dev
https://web.dev/articles/fcp

[42] [43] Largest Contentful Paint (LCP) | Articles | web.dev
https://web.dev/articles/lcp

[44] [45] Cumulative Layout Shift (CLS) | Articles | web.dev
https://web.dev/articles/cls

[46] [47] Time to Interactive (TTI) | Articles | web.dev
https://web.dev/articles/tti

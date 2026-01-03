---
title: HTTP
author: DBAAZzz
date: 2026/01/03
categories:
  - 面试
  - 网络
tags:
  - HTTP
  - HTTPS
  - TCP/IP
---

## HTTP 状态码

HTTP 状态码由**三位数字**组成，第一位定义了响应的类别。

| 状态码 | 类别             | 描述                       |
| :----- | :--------------- | :------------------------- |
| 1xx    | 信息性状态码     | 接收的请求正在处理         |
| 2xx    | 成功状态码       | 请求正常处理完毕           |
| 3xx    | 重定向状态码     | 需要进行附加操作以完成请求 |
| 4xx    | 客户端错误状态码 | 服务器无法处理请求         |
| 5xx    | 服务器错误状态码 | 服务器处理请求出错         |

### 1xx 信息性状态码

- **100 Continue**：客户端应继续其请求（通常用于大文件上传前的预检）。
- **101 Switching Protocols**：服务器正在切换协议（如 HTTP 升级到 WebSocket）。

### 2xx 成功状态码

- **200 OK**：请求成功，是最常见的状态码。
- **201 Created**：请求成功并创建了新资源（常用于 POST/PUT）。
- **204 No Content**：请求成功但无内容返回（常用于 DELETE）。
- **206 Partial Content**：范围请求成功，用于断点续传和视频流。

```javascript
// 206 示例：视频流加载
fetch("video.mp4", {
  headers: { Range: "bytes=0-1023" }, // 只请求前 1KB
});
```

### 3xx 重定向状态码

- **301 Moved Permanently**：永久重定向，搜索引擎会更新索引。
- **302 Found**：临时重定向，搜索引擎不会更新索引。
- **304 Not Modified**：资源未修改，使用本地缓存（配合 ETag/Last-Modified）。
- **307 Temporary Redirect**：临时重定向，但不允许 POST 变 GET。
- **308 Permanent Redirect**：永久重定向，但不允许 POST 变 GET。

```javascript
// 304 缓存协商
// 请求头
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"

// 响应头（资源未变化）
HTTP/1.1 304 Not Modified
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**301 vs 302 的选择：**

- **301**：网站域名迁移、URL 结构调整（永久性变更）。
- **302**：A/B 测试、临时维护页面跳转。

### 4xx 客户端错误状态码

- **400 Bad Request**：请求语法错误，服务器无法理解。
- **401 Unauthorized**：需要身份验证（通常返回 `WWW-Authenticate` 头）。
- **403 Forbidden**：服务器理解请求但拒绝执行（权限不足）。
- **404 Not Found**：请求的资源不存在。
- **405 Method Not Allowed**：请求方法不被允许（如只支持 GET 却发送了 POST）。
- **408 Request Timeout**：客户端请求超时。
- **429 Too Many Requests**：请求过于频繁，触发限流。

**401 vs 403 的区别：**

- **401**：你是谁？需要登录认证。
- **403**：我知道你是谁，但你没权限访问这个资源。

### 5xx 服务器错误状态码

- **500 Internal Server Error**：服务器内部错误（代码异常、未捕获的错误）。
- **502 Bad Gateway**：网关/代理服务器从上游服务器收到无效响应。
- **503 Service Unavailable**：服务器暂时无法处理请求（过载或维护中）。
- **504 Gateway Timeout**：网关/代理服务器等待上游服务器响应超时。

**502 vs 504 的区别：**

- **502**：上游服务器返回了错误的响应（如崩溃、返回格式错误）。
- **504**：上游服务器根本没响应（超时）。

### 实际应用场景

```javascript
// 前端根据状态码处理
fetch("/api/data").then((response) => {
  if (response.status === 401) {
    // 跳转登录页
    location.href = "/login";
  } else if (response.status === 403) {
    // 提示无权限
    alert("没有访问权限");
  } else if (response.status === 429) {
    // 请求限流，延迟重试
    setTimeout(() => retry(), 1000);
  }
  return response.json();
});
```

## 1. HTTP 前生今世

HTTP (HyperText Transfer Protocol) 超文本传输协议，是 Web 的基础。

### HTTP 版本演进

| 版本    | 发布时间 | 核心特性                                           | 解决的问题                  |
| :------ | :------- | :------------------------------------------------- | :-------------------------- |
| **0.9** | 1991     | 仅支持 GET，只能传输 HTML                          | 实现基础的文档传输          |
| **1.0** | 1996     | 增加 POST/HEAD，支持多种数据格式，非持久连接       | 支持多媒体内容              |
| **1.1** | 1997     | 持久连接 (Keep-Alive)，管道化，断点续传，Host 头   | 减少 TCP 连接开销           |
| **2.0** | 2015     | 多路复用，头部压缩 (HPACK)，二进制分帧，服务端推送 | 解决 HTTP/1.1 队头阻塞      |
| **3.0** | 2022     | 基于 QUIC (UDP)，0-RTT 握手，连接迁移              | 解决 TCP 队头阻塞、提高性能 |

### 各版本详解

**HTTP/0.9** (单行协议)

```http
GET /index.html
```

- 极简设计，只有请求行。
- 服务器响应后立即断开连接。

**HTTP/1.0**

```http
GET /index.html HTTP/1.0
User-Agent: Mozilla/5.0
Accept: text/html

```

- 引入请求头和响应头。
- 每个请求都需要建立新的 TCP 连接（**短连接**）。
- 性能问题：3 次握手 + 慢启动浪费资源。

**HTTP/1.1** (当前主流)

```http
GET /api/users HTTP/1.1
Host: example.com
Connection: keep-alive

```

关键改进：

1. **持久连接**：默认 `Connection: keep-alive`，复用 TCP 连接。
2. **管道化 (Pipelining)**：允许多个请求同时发送，但响应仍需按顺序返回（**队头阻塞**）。
3. **Host 头**：支持虚拟主机，一个 IP 可托管多个域名。
4. **分块传输编码**：`Transfer-Encoding: chunked`，支持流式传输。

**HTTP/2** (二进制协议)

```
# 二进制帧结构（不可读）
+-----------------------------------------------+
| Length (24) | Type (8) | Flags (8) | Stream |
+-----------------------------------------------+
|                   Frame Payload               |
+-----------------------------------------------+
```

核心改进：

1. **多路复用 (Multiplexing)**：一个 TCP 连接上可同时传输多个请求/响应，不阻塞。
2. **头部压缩 (HPACK)**：减少冗余头部，节省带宽。
3. **服务端推送**：服务器主动推送资源（如 CSS/JS），无需客户端再请求。
4. **二进制分帧**：更高效的解析和传输。

**HTTP/3** (基于 UDP)

```
应用层: HTTP/3
传输层: QUIC (Quick UDP Internet Connections)
网络层: UDP
```

革命性改进：

1. **解决 TCP 队头阻塞**：QUIC 的每个流独立，一个流丢包不影响其他流。
2. **连接迁移**：网络切换（Wi-Fi ↔ 4G）时连接不中断。
3. **0-RTT 握手**：初次连接 1-RTT，后续连接 0-RTT（极速建连）。

### 为什么要不断升级？

| 问题                 | HTTP/1.1       | HTTP/2     | HTTP/3     |
| :------------------- | :------------- | :--------- | :--------- |
| TCP 建连开销         | 持久连接缓解   | 仍存在     | 0-RTT 解决 |
| HTTP 队头阻塞        | 存在（管道化） | **已解决** | ✓          |
| TCP 队头阻塞         | 存在           | **仍存在** | **已解决** |
| 头部冗余             | 存在           | **已解决** | ✓          |
| 连接迁移（网络切换） | 中断           | 中断       | **不中断** |

### 实际应用

```javascript
// 浏览器 HTTP 版本检测
fetch("https://example.com").then((response) => {
  console.log(response.headers.get("Alt-Svc"));
  // 如果支持 HTTP/3，会返回：h3=":443"
});
```

**采用现状（2026 年）：**

- HTTP/1.1：仍是主流，兼容性最好。
- HTTP/2：大型网站广泛采用（Google、Facebook、CDN）。
- HTTP/3：快速普及中，Chrome/Firefox/Safari 已默认支持。

## 2. HTTP 世界全览

HTTP 是一个**无状态**、**基于文本**（HTTP/2 之前）、**请求/响应模式**的应用层协议。它构建在 TCP/IP 协议栈之上，用于在客户端（User Agent）和服务器之间传输超文本。

### HTTP 核心特性

**1. 无状态 (Stateless)**

- 每个请求都是独立的，服务器不会记住之前的请求。
- 优点：服务器不需要维护会话信息，简化设计，易于扩展。
- 缺点：需要 Cookie/Session 机制来维持用户状态（如登录态）。

**2. 请求/响应模式**

```
客户端                        服务器
   |                             |
   |-------- HTTP Request -----→ |
   |                             | (处理请求)
   |←------- HTTP Response ----- |
   |                             |
```

**3. 灵活可扩展**

- 通过 `Content-Type` 支持任意数据类型（JSON、XML、图片、视频）。
- 通过自定义 Header 扩展功能。

**4. 基于 TCP/IP**

- 可靠传输（三次握手、错误重传、流量控制）。
- HTTP/1.x 和 HTTP/2 运行在 TCP 上，HTTP/3 运行在 QUIC (UDP) 上。

### HTTP 工作流程

```
1. DNS 解析：example.com → 192.168.1.1
2. TCP 连接：三次握手建立连接
3. 发送 HTTP 请求
4. 服务器处理请求
5. 返回 HTTP 响应
6. TCP 连接：四次挥手断开连接（HTTP/1.0）或保持连接（HTTP/1.1+）
```

### HTTP 实体关系

```
浏览器 (User Agent)
  ↓
HTTP 请求
  ↓
代理服务器 (可选，如 Nginx)
  ↓
源服务器 (Origin Server)
  ↓
HTTP 响应
  ↓
浏览器渲染
```

## 3. HTTP 分层

从网络协议栈的角度（TCP/IP 模型）：

| 层级           | 协议示例               | 职责                           | 数据单位  |
| :------------- | :--------------------- | :----------------------------- | :-------- |
| **应用层**     | HTTP, FTP, DNS, SMTP   | 为应用程序提供网络服务         | 报文      |
| **传输层**     | TCP, UDP               | 提供端到端的数据传输           | 段/数据报 |
| **网络层**     | IP, ICMP, ARP          | 处理数据包在网络中的路由和转发 | 数据包    |
| **数据链路层** | 以太网, Wi-Fi, PPP     | 处理与物理网络的连接           | 帧        |
| **物理层**     | 双绞线, 光纤, 无线电波 | 传输原始比特流                 | 比特      |

### HTTP 在协议栈中的位置

```
┌─────────────────────────────┐
│   应用层: HTTP/HTTPS        │ ← 我们关注的层
├─────────────────────────────┤
│   传输层: TCP (80/443)      │ ← 可靠传输
├─────────────────────────────┤
│   网络层: IP                │ ← 寻址和路由
├─────────────────────────────┤
│   数据链路层: 以太网        │ ← 局域网传输
├─────────────────────────────┤
│   物理层: 网线/Wi-Fi        │ ← 物理信号
└─────────────────────────────┘
```

### 数据封装过程

```javascript
// 应用层：HTTP 请求
GET /api/users HTTP/1.1
Host: example.com

// 传输层：添加 TCP 头部（源端口、目标端口、序列号）
[TCP Header | HTTP Data]

// 网络层：添加 IP 头部（源 IP、目标 IP）
[IP Header | TCP Header | HTTP Data]

// 数据链路层：添加以太网帧头（源 MAC、目标 MAC）
[Ethernet Header | IP Header | TCP Header | HTTP Data | Ethernet Trailer]
```

### 为什么需要分层？

1. **模块化**：每层只关注自己的职责，互不干扰。
2. **易于替换**：可以替换某一层的实现（如 TCP → UDP，HTTP/1.1 → HTTP/2）。
3. **互操作性**：不同厂商的设备可以通过标准协议通信。

## 4. HTTP 报文是什么样子的

HTTP 报文是客户端和服务器之间通信的数据格式。

### 请求报文 (Request)

```http
GET /api/users?page=1 HTTP/1.1          ← 请求行
Host: api.example.com                   ← 请求头
User-Agent: Mozilla/5.0
Accept: application/json
Authorization: Bearer token123
Connection: keep-alive
                                        ← 空行（CRLF）
{"filter": "active"}                     ← 请求体（可选）
```

**请求行组成：**

- **方法 (Method)**：GET, POST, PUT, DELETE 等。
- **URL**：请求的资源路径。
- **版本**：HTTP/1.1, HTTP/2 等。

**常见请求头：**

- `Host`: 目标主机（HTTP/1.1 必需）。
- `User-Agent`: 客户端信息。
- `Accept`: 期望的响应格式。
- `Content-Type`: 请求体的数据类型。
- `Cookie`: 携带的 Cookie。
- `Authorization`: 认证信息。

### 响应报文 (Response)

```http
HTTP/1.1 200 OK                         ← 状态行
Content-Type: application/json          ← 响应头
Content-Length: 125
Cache-Control: max-age=3600
Set-Cookie: sessionId=abc123; HttpOnly
Connection: keep-alive
                                        ← 空行（CRLF）
{"users": [{"id": 1, "name": "Alice"}]} ← 响应体
```

**状态行组成：**

- **版本**：HTTP/1.1
- **状态码**：200, 404, 500 等。
- **状态短语**：OK, Not Found, Internal Server Error。

**常见响应头：**

- `Content-Type`: 响应体的数据类型。
- `Content-Length`: 响应体的字节数。
- `Cache-Control`: 缓存策略。
- `Set-Cookie`: 设置 Cookie。
- `ETag`: 资源的版本标识。

### 实际抓包示例

```javascript
// 使用 fetch 发送请求
fetch("https://api.example.com/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer token123",
  },
  body: JSON.stringify({ name: "Alice" }),
});

// 抓包看到的请求：
/*
POST /users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer token123
Content-Length: 16

{"name":"Alice"}
*/
```

### 报文大小限制

- **URL 长度**：浏览器通常限制 2KB-8KB（IE 限制 2KB，Chrome 限制 8KB）。
- **请求头**：服务器通常限制 8KB-16KB（Nginx 默认 8KB）。
- **请求体**：服务器配置决定（Nginx 默认 1MB，可调整）。

## 5. HTTP 之 URL

URL (Uniform Resource Locator) 统一资源定位符。
格式：`schema://host:port/path?query#fragment`

- **schema**: 协议 (http/https)
- **host**: 域名或 IP
- **port**: 端口 (http 默认为 80, https 默认为 443)
- **path**: 路径
- **query**: 查询参数
- **fragment**: 锚点 (哈希)，不会发送给服务器。

## 6. HTTP 实体数据

HTTP 实体包括**实体首部**和**实体主体**。

- **Content-Type**: 数据类型 (text/html, application/json, image/jpeg)。
- **Content-Encoding**: 压缩方式 (gzip, deflate, br)。
- **Content-Length**: 数据长度。
- **Transfer-Encoding: chunked**: 分块传输（不知道长度时使用）。

## 7. 谈一谈 HTTP 协议优缺点

- **优点**：
  - **简单**：报文格式简单易读。
  - **灵活**：允许传输任意类型的数据对象 (Content-Type)。
  - **无状态**：服务器不需要保存上下文，减轻负担（但也变成缺点）。
- **缺点**：
  - **无状态**：需要 Cookie/Session 维持会话。
  - **明文传输**：HTTP/1.x 报文未加密，不安全 ( -> HTTPS)。
  - **队头阻塞**：HTTP/1.1 管道化仍有此问题 ( -> HTTP/2 多路复用)。

## 8. 说一说 HTTP 的请求方法

HTTP 定义了一组请求方法，用于指示对资源执行的操作。

### 核心方法详解

**GET - 获取资源**

```javascript
// 获取用户列表
fetch("/api/users?page=1&limit=10")
  .then((res) => res.json())
  .then((data) => console.log(data));
```

- **特性**：安全、幂等、可缓存
- **参数位置**：URL Query String
- **使用场景**：查询数据、获取页面、下载文件

**POST - 创建资源/提交数据**

```javascript
// 创建新用户
fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Alice", email: "alice@example.com" }),
});
```

- **特性**：不安全、不幂等、不可缓存
- **参数位置**：Request Body
- **使用场景**：表单提交、文件上传、创建资源

**PUT - 全量更新资源**

```javascript
// 完整替换用户信息（必须提供所有字段）
fetch("/api/users/123", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Alice Updated",
    email: "alice@example.com",
    age: 30,
    address: "New York",
  }),
});
```

- **特性**：不安全、幂等
- **语义**：完整替换资源，缺失字段会被删除

**PATCH - 部分更新资源**

```javascript
// 只更新用户名（其他字段保持不变）
fetch("/api/users/123", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Alice Updated" }),
});
```

- **特性**：不安全、幂等
- **语义**：部分更新，只修改指定字段

**DELETE - 删除资源**

```javascript
// 删除用户
fetch("/api/users/123", { method: "DELETE" });
```

- **特性**：不安全、幂等
- **注意**：多次删除同一资源，结果相同（资源不存在）

**HEAD - 获取元数据**

```javascript
// 检查资源是否存在，不下载内容
fetch("/api/large-file.zip", { method: "HEAD" }).then((res) => {
  console.log("文件大小:", res.headers.get("Content-Length"));
  console.log("最后修改:", res.headers.get("Last-Modified"));
});
```

- **特性**：安全、幂等、可缓存
- **使用场景**：检查资源是否存在、获取文件大小、检查更新时间

**OPTIONS - 查询支持的方法**

```javascript
// CORS 预检请求（浏览器自动发送）
/*
OPTIONS /api/users HTTP/1.1
Origin: https://example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type

响应：
HTTP/1.1 204 No Content
Allow: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type
*/
```

- **使用场景**：CORS 预检、API 能力探测

**TRACE - 路径追踪**

- **作用**：回显服务器收到的请求，用于诊断
- **安全问题**：可能导致 XST 攻击，生产环境通常禁用

### 方法特性对比

| 方法    | 安全 | 幂等 | 可缓存 | 请求体 | 响应体 |
| :------ | :--- | :--- | :----- | :----- | :----- |
| GET     | ✓    | ✓    | ✓      | ✗      | ✓      |
| POST    | ✗    | ✗    | ✗      | ✓      | ✓      |
| PUT     | ✗    | ✓    | ✗      | ✓      | ✓      |
| PATCH   | ✗    | ✓    | ✗      | ✓      | ✓      |
| DELETE  | ✗    | ✓    | ✗      | ✗      | ✓      |
| HEAD    | ✓    | ✓    | ✓      | ✗      | ✗      |
| OPTIONS | ✓    | ✓    | ✗      | ✗      | ✓      |

**术语解释：**

- **安全 (Safe)**：不修改服务器资源状态（只读操作）
- **幂等 (Idempotent)**：多次执行与一次执行效果相同
- **可缓存 (Cacheable)**：响应可以被缓存

## 9. 谈一谈 GET 和 POST 的区别

### 核心差异对比

| 特性           | GET                                 | POST                                     |
| :------------- | :---------------------------------- | :--------------------------------------- |
| **语义**       | 获取数据（查询）                    | 提交数据（创建/修改）                    |
| **缓存**       | 默认可缓存                          | 默认不缓存（除非显式设置 Cache-Control） |
| **参数位置**   | URL Query String                    | Request Body                             |
| **安全性**     | 参数暴露在 URL，不安全              | 相对安全（需 HTTPS 加密）                |
| **幂等性**     | 是（多次请求结果一致）              | 否（每次可能产生新资源）                 |
| **长度限制**   | 受浏览器/服务器限制（通常 2KB-8KB） | 无限制（受服务器配置限制）               |
| **书签/历史**  | 可保存为书签，出现在浏览器历史      | 不可保存为书签                           |
| **后退/刷新**  | 无副作用，可安全后退                | 浏览器会警告（可能重复提交）             |
| **数据类型**   | 仅 ASCII 字符                       | 无限制（支持二进制）                     |
| **可见性**     | 参数在 URL 中可见                   | 参数在请求体中，不可见                   |
| **CORS 预检**  | 简单请求，无需预检                  | 非简单请求，可能触发 OPTIONS 预检        |
| **TCP 数据包** | 1 个（Header + Data 一起发送）      | 2 个（先发 Header，再发 Body）           |

### 详细说明

**1. 参数传递方式**

```javascript
// GET: 参数在 URL 中
fetch("/api/search?keyword=javascript&page=1");
// 实际请求：
// GET /api/search?keyword=javascript&page=1 HTTP/1.1

// POST: 参数在请求体中
fetch("/api/search", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ keyword: "javascript", page: 1 }),
});
// 实际请求：
// POST /api/search HTTP/1.1
// Content-Type: application/json
//
// {"keyword":"javascript","page":1}
```

**2. 安全性差异**

```javascript
// ❌ GET 传递敏感信息（不安全）
fetch("/api/login?username=admin&password=123456");
// 问题：
// - 密码暴露在 URL 中
// - 会被记录在浏览器历史、服务器日志、代理服务器日志
// - 可能被缓存

// ✅ POST 传递敏感信息（相对安全）
fetch("/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "admin", password: "123456" }),
});
// 优势：
// - 密码在请求体中，不会出现在 URL
// - 不会被浏览器历史记录
// - 仍需 HTTPS 加密传输
```

**3. 缓存行为**

```javascript
// GET 请求会被缓存
fetch("/api/users/123"); // 第一次请求服务器
fetch("/api/users/123"); // 可能使用缓存，不请求服务器

// 防止 GET 缓存的方法
fetch(`/api/users/123?_t=${Date.now()}`); // 添加时间戳

// POST 请求默认不缓存
fetch("/api/users", { method: "POST", body: data }); // 每次都请求服务器
```

**4. 幂等性实例**

```javascript
// GET 是幂等的
fetch("/api/users/123"); // 获取用户信息
fetch("/api/users/123"); // 再次获取，结果相同

// POST 不是幂等的
fetch("/api/orders", {
  method: "POST",
  body: JSON.stringify({ product: "iPhone", quantity: 1 }),
}); // 创建订单 1
fetch("/api/orders", {
  method: "POST",
  body: JSON.stringify({ product: "iPhone", quantity: 1 }),
}); // 创建订单 2（重复提交）
```

**5. 长度限制**

```javascript
// GET URL 长度限制
const params = new Array(1000).fill("item").join("&");
fetch(`/api/search?${params}`); // 可能被截断或拒绝

// 不同浏览器/服务器限制：
// - IE: 2KB
// - Chrome: 8KB
// - Firefox: 65KB
// - Nginx: 默认 8KB (large_client_header_buffers)

// POST 无长度限制（受服务器配置限制）
fetch("/api/upload", {
  method: "POST",
  body: largeFile, // 可以上传大文件
});
// Nginx 默认限制: client_max_body_size 1m
```

### 常见误区

**误区 1: GET 不安全，POST 安全**

- ❌ 错误：POST 只是把参数放在 Body，HTTP 明文传输仍不安全
- ✅ 正确：GET 和 POST 都需要 HTTPS 加密才安全

**误区 2: GET 只能传少量数据，POST 能传大量数据**

- ❌ 错误：HTTP 协议本身没有限制 GET 的数据量
- ✅ 正确：限制来自浏览器和服务器实现，不是协议规定

**误区 3: POST 比 GET 慢**

- 部分正确：POST 可能发送 2 个 TCP 包（Header + Body），GET 发送 1 个
- 但实际性能差异微乎其微，主要取决于网络和服务器处理

### 使用建议

```javascript
// ✅ 使用 GET 的场景
- 查询数据（搜索、列表、详情）
- 无副作用的操作
- 需要缓存的请求
- 需要分享链接的场景

fetch('/api/articles?category=tech&page=1'); // ✅
fetch('/api/users/123'); // ✅

// ✅ 使用 POST 的场景
- 创建/修改数据
- 提交表单
- 上传文件
- 传递敏感信息
- 数据量大

fetch('/api/login', { method: 'POST', body: credentials }); // ✅
fetch('/api/upload', { method: 'POST', body: formData }); // ✅
```

## 10. 谈一谈队头阻塞问题

队头阻塞（Head-of-Line Blocking, HOL Blocking）是影响 HTTP 性能的关键问题，分为 **HTTP 层队头阻塞**和 **TCP 层队头阻塞**。

### HTTP/1.1 队头阻塞

**问题描述：**

在 HTTP/1.1 中，虽然支持持久连接（Keep-Alive），但同一个 TCP 连接上的请求必须**串行处理**，即使使用管道化（Pipelining），响应也必须按请求顺序返回。

```
客户端                           服务器
  |                                |
  |------ Request 1 (fast) ------→ |  处理时间: 100ms
  |------ Request 2 (slow) ------→ |  处理时间: 5000ms ⚠️
  |------ Request 3 (fast) ------→ |  处理时间: 100ms
  |                                |
  |←----- Response 1 ------------- |  100ms 返回
  |                                |  等待 Request 2...
  |←----- Response 2 ------------- |  5100ms 返回 ⚠️
  |←----- Response 3 ------------- |  5200ms 返回 (被阻塞)
```

**实际案例：**

```javascript
// HTTP/1.1 场景
// 浏览器同时请求 3 个资源，但只有 1 个 TCP 连接
fetch("/api/fast1"); // 100ms
fetch("/api/slow"); // 5000ms ⚠️ 慢查询
fetch("/api/fast2"); // 100ms

// 结果：
// fast1: 100ms 完成
// slow:  5100ms 完成
// fast2: 5200ms 完成 ← 被 slow 阻塞了 5000ms！
```

**HTTP/1.1 的解决方案：**

1. **多个 TCP 连接**：浏览器对同一域名开启 6-8 个并发连接

```javascript
// 浏览器自动管理多个连接
// 连接 1: /api/fast1
// 连接 2: /api/slow
// 连接 3: /api/fast2
// 这样 fast2 不会被 slow 阻塞
```

2. **域名分片（Domain Sharding）**：将资源分散到多个子域名

```html
<!-- 绕过浏览器的并发连接数限制 -->
<img src="https://cdn1.example.com/img1.jpg" />
<img src="https://cdn2.example.com/img2.jpg" />
<img src="https://cdn3.example.com/img3.jpg" />
```

**缺点：**

- 多个 TCP 连接增加服务器负担
- 每个连接都需要三次握手
- 域名分片增加 DNS 查询开销

### HTTP/2 的解决方案：多路复用

**核心机制：**

HTTP/2 通过**二进制分帧**和**流（Stream）**实现真正的多路复用，多个请求/响应可以在同一个 TCP 连接上**并行**传输。

```
客户端                           服务器
  |                                |
  |--- Stream 1 (Request 1) -----→ |
  |--- Stream 2 (Request 2) -----→ |  并行处理
  |--- Stream 3 (Request 3) -----→ |
  |                                |
  |←-- Stream 1 (Response 1) ----- |  100ms 返回
  |←-- Stream 3 (Response 3) ----- |  100ms 返回 ✅ 不被阻塞
  |←-- Stream 2 (Response 2) ----- |  5000ms 返回
```

**实际效果：**

```javascript
// HTTP/2 场景（同一个 TCP 连接）
fetch("/api/fast1"); // Stream 1: 100ms 完成
fetch("/api/slow"); // Stream 2: 5000ms 完成
fetch("/api/fast2"); // Stream 3: 100ms 完成 ✅ 不被阻塞

// 结果：
// fast1: 100ms 完成
// fast2: 100ms 完成 ← 不受 slow 影响！
// slow:  5000ms 完成
```

**HTTP/2 解决了 HTTP 层队头阻塞，但仍存在 TCP 层队头阻塞！**

### TCP 层队头阻塞

**问题描述：**

TCP 是可靠传输协议，必须保证数据包**按序到达**。如果某个数据包丢失，后续已到达的数据包会被缓存，等待丢失的包重传后才能交给应用层。

```
发送端                           接收端
  |                                |
  |------ Packet 1 --------------→ | ✅ 收到
  |------ Packet 2 ----✗           | ❌ 丢失
  |------ Packet 3 --------------→ | ✅ 收到，但缓存等待
  |------ Packet 4 --------------→ | ✅ 收到，但缓存等待
  |                                |
  |------ Packet 2 (重传) -------→ | ✅ 收到
  |                                | 现在才能将 2,3,4 交给应用层
```

**对 HTTP/2 的影响：**

即使 HTTP/2 实现了多路复用，但所有流共享同一个 TCP 连接。如果 TCP 层发生丢包，**所有流都会被阻塞**。

```javascript
// HTTP/2 场景，TCP 丢包
// Stream 1, 2, 3 在同一个 TCP 连接上

// 假设 Stream 2 的某个数据包丢失
// 结果：Stream 1 和 Stream 3 也会被阻塞，等待 Stream 2 的包重传

// 这比 HTTP/1.1 的多个 TCP 连接还糟糕！
// 因为 HTTP/1.1 的其他连接不受影响
```

### HTTP/3 的终极解决方案：QUIC

**核心机制：**

HTTP/3 基于 **QUIC 协议**（运行在 UDP 上），每个流都是独立的，一个流的丢包不影响其他流。

```
应用层: HTTP/3
传输层: QUIC (基于 UDP)
  ├─ Stream 1 (独立)
  ├─ Stream 2 (独立)
  └─ Stream 3 (独立)
网络层: UDP
```

**QUIC 的优势：**

1. **流级别的可靠性**：每个流独立重传，互不影响

```
Stream 1: Packet 1 ✅ → Packet 2 ✅ → Packet 3 ✅
Stream 2: Packet 1 ✅ → Packet 2 ❌ → Packet 3 ✅ (等待 Packet 2 重传)
Stream 3: Packet 1 ✅ → Packet 2 ✅ → Packet 3 ✅ ← 不受 Stream 2 影响
```

2. **0-RTT 连接建立**：首次 1-RTT，后续 0-RTT
3. **连接迁移**：网络切换（Wi-Fi ↔ 4G）不中断连接
4. **前向纠错（FEC）**：减少重传次数

### 队头阻塞对比总结

| 协议版本 | HTTP 层队头阻塞 | TCP 层队头阻塞 | 解决方案                      |
| :------- | :-------------- | :------------- | :---------------------------- |
| HTTP/1.0 | ✅ 存在         | ✅ 存在        | 每个请求新建连接（性能差）    |
| HTTP/1.1 | ✅ 存在         | ✅ 存在        | 多个并发连接（6-8 个）        |
| HTTP/2   | ❌ 已解决       | ✅ 存在        | 多路复用（但 TCP 丢包影响大） |
| HTTP/3   | ❌ 已解决       | ❌ 已解决      | QUIC 独立流（完美解决）       |

### 实际性能对比

```javascript
// 模拟 2% 丢包率环境下加载 100 个资源

// HTTP/1.1 (6 个并发连接)
// 平均加载时间: 8.5s
// 丢包只影响对应连接的资源

// HTTP/2 (1 个连接，多路复用)
// 平均加载时间: 12.3s ⚠️ 更慢！
// 丢包影响所有资源（TCP 队头阻塞）

// HTTP/3 (QUIC)
// 平均加载时间: 4.2s ✅ 最快！
// 丢包只影响对应流的资源
```

**结论：**

- 在**低丢包率**网络（有线、Wi-Fi）：HTTP/2 > HTTP/1.1
- 在**高丢包率**网络（移动网络）：HTTP/3 > HTTP/1.1 > HTTP/2
- HTTP/3 是未来趋势，彻底解决了队头阻塞问题

## 11. 谈一谈 HTTP 数据传输

HTTP 使用 TCP 作为传输层协议，支持多种数据传输方式以适应不同场景。

### 1. 定长传输 (Content-Length)

**使用场景：** 服务器明确知道响应体的大小。

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 58

{"id":1,"name":"Alice","email":"alice@example.com"}
```

**特点：**

- 客户端根据 `Content-Length` 知道何时接收完毕
- 适合静态文件、小型响应
- 必须在发送前计算好完整内容大小

```javascript
// Node.js 示例
const http = require("http");

http
  .createServer((req, res) => {
    const data = JSON.stringify({ message: "Hello World" });
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data), // 必须精确计算
    });
    res.end(data);
  })
  .listen(3000);
```

### 2. 不定长传输 (Chunked Transfer Encoding)

**使用场景：** 服务器无法预先知道响应体大小（动态生成、流式传输）。

**格式：**

```http
HTTP/1.1 200 OK
Content-Type: text/plain
Transfer-Encoding: chunked

5\r\n          ← 块大小（十六进制）
Hello\r\n      ← 块数据
7\r\n
 World!\r\n
0\r\n          ← 最后的 0 长度块，表示结束
\r\n
```

**实际应用：**

```javascript
// Node.js 流式响应（实时日志）
const http = require("http");

http
  .createServer((req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked",
    });

    // 模拟实时日志推送
    let count = 0;
    const interval = setInterval(() => {
      res.write(`Log entry ${count++}\n`);

      if (count >= 10) {
        clearInterval(interval);
        res.end(); // 发送 0 长度块
      }
    }, 1000);
  })
  .listen(3000);
```

**优势：**

- 无需等待全部数据生成完毕即可开始传输
- 适合大文件、实时数据流、SSE (Server-Sent Events)
- 降低首字节时间 (TTFB)

**注意事项：**

- HTTP/1.1 默认支持
- 不能与 `Content-Length` 同时使用
- HTTP/2 使用二进制分帧，不需要 chunked encoding

### 3. 范围请求 (Range Requests) - 断点续传

**使用场景：** 大文件下载、视频流播放、断点续传。

**请求示例：**

```http
GET /large-file.zip HTTP/1.1
Host: example.com
Range: bytes=0-1023        ← 请求前 1KB
```

**响应示例：**

```http
HTTP/1.1 206 Partial Content
Content-Type: application/zip
Content-Range: bytes 0-1023/10485760  ← 0-1023 字节，总大小 10MB
Content-Length: 1024

[二进制数据...]
```

**实际应用：**

```javascript
// 1. 断点续传下载
async function resumableDownload(url, filePath) {
  const fs = require("fs");
  const axios = require("axios");

  // 检查已下载的大小
  let downloadedSize = 0;
  if (fs.existsSync(filePath)) {
    downloadedSize = fs.statSync(filePath).size;
  }

  // 请求剩余部分
  const response = await axios({
    url,
    method: "GET",
    headers: {
      Range: `bytes=${downloadedSize}-`, // 从已下载位置继续
    },
    responseType: "stream",
  });

  // 追加写入文件
  const writer = fs.createWriteStream(filePath, { flags: "a" });
  response.data.pipe(writer);
}

// 2. 视频流播放（只加载可见部分）
fetch("/video.mp4", {
  headers: {
    Range: "bytes=0-1048575", // 只请求前 1MB
  },
}).then((res) => {
  if (res.status === 206) {
    // Partial Content
    console.log("Range request successful");
    return res.blob();
  }
});

// 3. 多线程下载（分段并发）
async function multiThreadDownload(url, threads = 4) {
  // 1. 获取文件总大小
  const headRes = await fetch(url, { method: "HEAD" });
  const totalSize = parseInt(headRes.headers.get("Content-Length"));

  // 2. 计算每个线程的范围
  const chunkSize = Math.ceil(totalSize / threads);
  const promises = [];

  for (let i = 0; i < threads; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize - 1, totalSize - 1);

    promises.push(
      fetch(url, {
        headers: { Range: `bytes=${start}-${end}` },
      }).then((res) => res.arrayBuffer())
    );
  }

  // 3. 合并所有分片
  const chunks = await Promise.all(promises);
  return new Blob(chunks);
}
```

**服务器支持检测：**

```javascript
// 检查服务器是否支持范围请求
fetch("/file.zip", { method: "HEAD" }).then((res) => {
  const acceptRanges = res.headers.get("Accept-Ranges");
  if (acceptRanges === "bytes") {
    console.log("✅ 服务器支持断点续传");
  } else {
    console.log("❌ 服务器不支持断点续传");
  }
});
```

### 4. 数据压缩 (Content-Encoding)

**常见压缩算法：**

| 算法        | 压缩率 | 速度 | 浏览器支持 | 适用场景               |
| :---------- | :----- | :--- | :--------- | :--------------------- |
| **gzip**    | 中     | 快   | 100%       | 通用，兼容性最好       |
| **br**      | 高     | 慢   | 95%+       | 静态资源，构建时预压缩 |
| **deflate** | 中     | 快   | 100%       | 较少使用               |

**请求与响应：**

```http
# 客户端请求
GET /api/data HTTP/1.1
Accept-Encoding: gzip, deflate, br  ← 告知支持的压缩算法

# 服务器响应
HTTP/1.1 200 OK
Content-Type: application/json
Content-Encoding: gzip              ← 使用 gzip 压缩
Content-Length: 1024                ← 压缩后的大小

[压缩后的二进制数据]
```

**实际配置：**

```javascript
// 1. Express.js 启用压缩
const express = require("express");
const compression = require("compression");

const app = express();
app.use(
  compression({
    level: 6, // 压缩级别 0-9
    threshold: 1024, // 只压缩 > 1KB 的响应
    filter: (req, res) => {
      // 自定义过滤规则
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);
```

```nginx
# 2. Nginx 配置 gzip
http {
  gzip on;
  gzip_comp_level 6;
  gzip_min_length 1024;
  gzip_types text/plain text/css application/json application/javascript;
  gzip_vary on;  # 添加 Vary: Accept-Encoding 响应头
}
```

**Brotli 预压缩（最佳实践）：**

```javascript
// 构建时预压缩静态资源
const fs = require("fs");
const zlib = require("zlib");
const { promisify } = require("util");
const brotli = promisify(zlib.brotliCompress);

async function precompressAssets() {
  const files = ["bundle.js", "styles.css"];

  for (const file of files) {
    const content = fs.readFileSync(`dist/${file}`);

    // 生成 .br 文件
    const compressed = await brotli(content, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11, // 最高压缩率
      },
    });

    fs.writeFileSync(`dist/${file}.br`, compressed);

    console.log(`${file}: ${content.length} → ${compressed.length} bytes`);
    console.log(
      `压缩率: ${((1 - compressed.length / content.length) * 100).toFixed(2)}%`
    );
  }
}
```

### 5. 多部分传输 (Multipart)

**使用场景：** 文件上传、表单提交（包含文件）。

```http
POST /upload HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="username"

Alice
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="avatar"; filename="photo.jpg"
Content-Type: image/jpeg

[二进制图片数据]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

**实际应用：**

```javascript
// 前端上传文件
const formData = new FormData();
formData.append("username", "Alice");
formData.append("avatar", fileInput.files[0]);

fetch("/upload", {
  method: "POST",
  body: formData, // 浏览器自动设置 Content-Type
});
```

### 传输方式对比总结

| 传输方式         | 适用场景               | 优点                 | 缺点               |
| :--------------- | :--------------------- | :------------------- | :----------------- |
| Content-Length   | 静态文件、小响应       | 简单、可预知大小     | 需提前计算完整大小 |
| Chunked Encoding | 动态内容、流式传输     | 实时传输、降低 TTFB  | 无法预知总大小     |
| Range Requests   | 大文件下载、视频播放   | 断点续传、节省带宽   | 需服务器支持       |
| Content-Encoding | 所有文本类响应         | 减少传输量、提升速度 | 增加 CPU 开销      |
| Multipart        | 文件上传、混合数据提交 | 支持多种数据类型     | 格式复杂           |

## 12. cookie 和 session

- **Cookie**:
  - 存储在客户端。
  - 服务器通过 `Set-Cookie` 响应头设置。
  - 请求时自动携带。
  - 大小有限制 (4KB)，不安全。
- **Session**:
  - 存储在服务器端。
  - 依赖 Cookie 传输 Session ID。
  - 更安全，但占用服务器内存。

## 13. 介绍一下 HTTPS 和 HTTP 区别

- **安全性**：HTTP 是明文传输；HTTPS = HTTP + SSL/TLS，加密传输，防窃听、防这类、防篡改。
- **端口**：HTTP 80，HTTPS 443。
- **证书**：HTTPS 需要向 CA 申请证书。
- **性能**：HTTPS 握手耗时，且加密解密消耗 CPU，比 HTTP 稍慢。

## 14. HTTPS 握手过程 (TLS 1.2)

1.  **Client Hello**: 客户端发送支持的加密套件、随机数 R1。
2.  **Server Hello**: 服务端选择加密套件，发送随机数 R2，发送**证书**。
3.  **Client Key Exchange**:
    - 客户端验证证书。
    - 生成预主密钥 (Pre-Master Secret)，用证书公钥加密发送给服务器。
4.  **Change Cipher Spec**: 双方根据 R1, R2, Pre-Master Secret 生成会话密钥 (Session Key)，并通知对方后续使用对称加密。
5.  **Finished**: 双方发送加密的握手验证消息。

_(TLS 1.3 简化了握手过程，只需 1 RTT)_

## 15. 介绍一个 HTTPS 工作原理

核心是**非对称加密**交换密钥，**对称加密**传输数据。

1.  **身份认证**：通过 CA 证书验证服务器身份。
2.  **密钥协商**：利用非对称加密（如 RSA 或 ECDHE）安全协商出一个对称密钥。
3.  **数据传输**：使用协商好的对称密钥（如 AES）进行加密通信，保证效率。

## 16. SSL 连接断开后如何恢复

- **Session ID**: 首次连接时，服务器生成 Session ID 传给客户端。重连时客户端带上 Session ID，服务器查找缓存，若存在则直接复用密钥（1 RTT）。
- **Session Ticket**: 服务器将会话信息加密成 Ticket 发给客户端存储。重连时客户端发送 Ticket，服务器解密恢复会话（服务端无状态）。

## 17. 谈一谈你对 HTTP/2 理解

HTTP/2 旨在解决 HTTP/1.1 的性能问题。

- **二进制分帧**：将报文拆分为二进制 Frame，更易解析，健壮性高。
- **多路复用**：同一个连接上并发发送多个请求/响应，互不干扰，解决 HTTP 队头阻塞。
- **头部压缩 (HPACK)**：使用静态字典/动态字典/哈夫曼编码压缩 Header，减少体积。
- **服务端推送 (Server Push)**：服务器主动推送资源给客户端。

## 18. HTTP3

基于 **QUIC** 协议（运行在 UDP 之上）。

- **解决 TCP 队头阻塞**：QUIC 的流是独立的，丢包只影响该流。
- **建连快**：0-RTT 或 1-RTT 握手。
- **连接迁移**：基于 Connection ID 识别连接，网络切换（Wifi -> 4G）不中断连接。
- **前向纠错**：减少重传。

## 19. HTTP/1.0 HTTP1.1 HTTP2.0 版本之间的差异

| 特性         | HTTP/1.0 | HTTP/1.1              | HTTP/2.0          |
| :----------- | :------- | :-------------------- | :---------------- |
| **长连接**   | 默认关闭 | 默认开启 (Keep-Alive) | 默认开启          |
| **多路复用** | 无       | 管道化 (伪并行)       | **支持 (真并行)** |
| **传输格式** | 文本     | 文本                  | **二进制**        |
| **头部压缩** | 无       | 无                    | **HPACK**         |
| **推送**     | 无       | 无                    | **Server Push**   |

## 20. DNS 如何工作的

DNS (Domain Name System) 将域名解析为 IP。
查询过程：

1.  **浏览器缓存**。
2.  **OS 缓存** (hosts 文件)。
3.  **LDNS** (本地 DNS 服务器，ISP 提供)。
4.  **根域名服务器** (.) -> **顶级域名服务器** (.com) -> **权威域名服务器** (example.com)。
5.  **递归查询** vs **迭代查询**。

## 21. 短轮询、长轮询和 WebSocket 间的区别

- **短轮询**：客户端每隔固定时间请求一次。效率低，浪费资源。
- **长轮询 (Long Polling)**：客户端请求，服务端 Hold 住连接直到有新数据才返回。解决实时性，但服务器压力大。
- **WebSocket**：全双工通信协议。握手后，Client 和 Server 可自由双向通信。低延迟，低开销。

## 22. 说一说正向代理和反向代理

- **正向代理 (Forward Proxy)**：
  - 代理**客户端**。
  - 客户端需配置代理。
  - 用途：翻墙、隐藏客户端 IP、缓存。
- **反向代理 (Reverse Proxy)**：
  - 代理**服务器**。
  - 客户端无感知（以为直接访问了服务器）。
  - 用途：负载均衡 (Nginx)、隐藏服务器 IP、HTTPS 卸载、缓存。

## 23. 介绍一下 Connection:keep-alive

- **作用**：在 HTTP/1.1 中默认开启，用于建立**持久连接**。
- **好处**：复用 TCP 连接，避免通过 socket 建立和断开连接的开销（三次握手、四次挥手），减少延迟（慢启动）。
- **参数**：`Keep-Alive: timeout=5, max=100` (空闲超时时间，最大请求数)。

## 24. http/https 协议总结

- HTTP 是互联网的基础，简单灵活但明文不安全。
- HTTPS 增加了 SSL/TLS 层，保证了安全，是当前标准。
- 协议在不断进化：1.1 (持久连接) -> 2.0 (多路复用) -> 3.0 (UDP 高速)。
- 优化方向：减少 RTT，减少数据量，解决阻塞。

## 25. TCP 为什么要三次握手

为了**防止已失效的连接请求报文段突然又传送到了服务端，因而产生错误**，并**同步双方的初始序列号 (ISN)**。

1.  **SYN**: 客户端请求建立连接。
2.  **SYN + ACK**: 服务端确认并请求建立连接。
3.  **ACK**: 客户端确认。

_两次握手不行吗？_ 不行。如果客户端发送的第一个 SYN 滞留后到达，服务端以为是新连接并回复 ACK，建立连接，等待客户端发数据，导致资源浪费。

## 26. 为什么要有 WebSocket

HTTP 的缺陷：

- **单向通信**：只能客户端发起。
- **Header 冗余**：每次请求都带大堆 Header。
- **实时性差**：轮询效率低。

WebSocket 解决了这些问题，提供**全双工、低开销、低延迟**的通信能力，适合聊天室、即时游戏、股票行情等场景。

## 27. UDP 和 TCP 有什么区别

| 特性         | TCP                         | UDP                       |
| :----------- | :-------------------------- | :------------------------ |
| **连接**     | 面向连接 (三次握手)         | 无连接                    |
| **可靠性**   | 可靠 (确认重传、排序、流控) | 不可靠 (可能丢包、乱序)   |
| **传输效率** | 慢 (首部大 20 字节)         | 快 (首部小 8 字节)        |
| **传播模式** | 一对一                      | 一对一、一对多、多对多    |
| **场景**     | 文件传输、邮件、Web         | 视频会议、直播、DNS、游戏 |

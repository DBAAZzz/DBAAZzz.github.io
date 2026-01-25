---
title: react 学习
author: DBAAZzz
date: 2024/04/15 17：37
categories:
  - react 学习
tags:
  - React
---


# 从0开始学习React进阶计划

> 目标：1个月冲刺大厂高级前端面试，深入掌握React底层原理与性能优化

---

## 1. 学习目标与整体规划

### 1.1 核心目标

**终极目标**：1个月后能在大厂（阿里/字节/腾讯）高级前端面试中，清晰讲解React底层原理并应对面试官追问。

**具体要求**：
- 能用自己的话讲清楚Fiber架构的设计思想和工作流程
- 能对比Vue和React的底层差异，展现技术深度
- 能针对实际场景给出React性能优化方案和原理解释
- 能回答React18新特性的原理和使用场景

---

### 1.2 时间分配

**总时长**：4周，约72小时
- 工作日：每天2小时（连续学习）× 5天 = 10小时/周
- 周末：每天4小时 × 2天 = 8小时/周
- **每周合计**：18小时

**学习优先级分配**（基于面试重要性）：
- 🔥 **Fiber架构原理**：40%（~29小时）— 最高优先级
- ⚡ **性能优化实战**：30%（~22小时）— 次高优先级
- 🆕 **React18新特性**：20%（~14小时）
- 📚 **其他核心机制**：10%（~7小时）

---

### 1.3 四周学习路线图

| 周次 | 核心目标 | 可衡量成果 |
|------|---------|-----------|
| **Week 1** | 理解React核心机制（渲染流程、Hooks原理） | 能讲清楚首次渲染和更新渲染的完整流程，能对比Vue响应式和React更新机制 |
| **Week 2** | 攻克Fiber架构（数据结构、双缓存、调和、调度） | 能画出Fiber树结构，能解释为什么需要Fiber，能讲清楚diff算法 |
| **Week 3** | 掌握性能优化（memo/useMemo/useCallback/lazy等） | 能针对5种常见场景给出优化方案，能解释优化原理 |
| **Week 4** | React18新特性 + 面试冲刺 | 能回答并发特性面试题，完成模拟面试，整理必背清单 |

---

### 1.4 每日学习流程

**推荐流程**（2小时连续学习）：
1. **理论学习**（60-70分钟）：阅读技术文章/书籍/源码
2. **笔记总结**（30-40分钟）：用自己的话总结 + 对比Vue
3. **模拟面试题**（20-30分钟）：回答3-5个相关面试题，检验理解

**周末流程**（4小时）：
- 前3小时：深度学习（源码阅读 + AI辅助理解）
- 后1小时：本周总结 + 模拟面试 + 下周预习

---

### 1.5 学习方法

**三位一体学习法**：
1. **技术博客/文章**：快速建立框架理解（推荐：图解React、卡颂的博客）
2. **《React进阶实践指南》选读**：参考但不依赖（版本较老，选择性阅读）
3. **源码阅读 + AI辅助**：重点读核心流程，用AI解释难点

**Vue源码经验迁移**：
- 你已熟悉Vue的响应式和依赖收集，可类比学习React的setState和Fiber更新
- 对比学习能加深理解，建议每学一个知识点都思考"Vue是怎么做的？"

---

### 1.6 笔记方法

**高效笔记三原则**：
1. **用自己的话解释**：不要抄原文，强迫自己理解后转述
2. **对比Vue**：每个知识点都对比Vue的实现方式，加深记忆
3. **标注面试点**：用🔥标记面试高频必背知识点

**笔记模板示例**：
```
### [知识点名称]
- **是什么**：一句话概括
- **为什么需要**：解决什么问题
- **怎么实现**：核心原理（简化版）
- **vs Vue**：Vue中对应的是什么
- 🔥 **面试必背**：三句话标准答案
```

---

### 1.7 源码阅读策略

**原则**：不求全部读完，重点读核心流程

**必读部分**（优先级排序）：
1. **Fiber节点创建与更新**：`ReactFiber.js`、`beginWork`、`completeWork`
2. **调和算法（Reconciler）**：`ReactChildFiber.js`、diff逻辑
3. **调度器（Scheduler）**：时间切片、优先级调度
4. **Hooks实现**：`ReactFiberHooks.js`、链表结构

**可跳过部分**（时间不够就放弃）：
- 事件系统的细节实现
- SSR相关源码
- DevTools相关代码

**阅读技巧**：
- 先看整体流程图，再看源码
- 遇到不懂的函数，用AI解释
- 不要纠结每一行代码，理解主流程即可

---

### 1.8 验收标准

**每周验收方式**：
- **笔记总结**：本周核心知识点整理成笔记（用自己的话）
- **模拟面试**：周末用AI模拟一次技术面试，回答本周5个核心问题

**每周必答5题示例**：
- Week 1: React渲染流程、Hooks为什么不能在条件语句中、useState原理、useEffect原理、Hooks vs Class
- Week 2: Fiber是什么、为什么需要Fiber、Fiber双缓存、调和算法、调度优先级
- Week 3: React性能优化手段、memo原理、useMemo vs useCallback、虚拟列表实现、性能分析工具
- Week 4: 并发模式是什么、useTransition原理、Suspense原理、React18更新了什么、自动批处理

---

### 1.9 标注说明

文档中使用以下标记：
- 🔥 **面试高频必背**：必须能背出标准答案的知识点
- ⚡ **重要但可简答**：理解原理即可，不必逐字背诵
- 💡 **对比Vue**：与Vue的实现差异对比
- 🎯 **实战场景**：真实项目中的应用场景

---

### 1.10 避免的坑

1. **不要陷入细节**：React源码很复杂，只读核心流程，不要每个函数都要理解
2. **不要追求完美理解**：1个月时间有限，面试够用即可，通过面试后可以继续深化
3. **不要忽视对比学习**：你的优势是懂Vue源码，要充分利用这个优势
4. **不要只看不练**：每天必须做笔记和回答面试题，输出倒逼输入

---

### 1.11 模拟面试说明

**频率**：每周末进行一次AI模拟面试

**形式**：
1. 准备本周核心知识点的5-10个面试题
2. 用AI扮演面试官，进行追问
3. 录音或记录自己的回答
4. 复盘：哪里答得不好，哪里需要补充

**目标**：
- 训练语言组织能力（技术理解 ≠ 能讲清楚）
- 发现知识盲区
- 适应面试节奏

---

## 2. Week 1: React核心机制深入

> **本周目标**：理解React的渲染流程和Hooks底层原理，为学习Fiber打下基础

### 2.1 学习路线

**Day 1-2: 首次渲染流程**
- React元素（JSX）→ 虚拟DOM → Fiber节点 → 真实DOM 的完整流程
- `ReactDOM.createRoot` 和 `render` 做了什么
- 💡 对比Vue：Vue的模板编译 → render函数 → VNode → 真实DOM

**Day 3-4: 更新渲染流程**
- `setState` / `useState` 触发更新的完整流程
- 更新队列（Update Queue）的概念
- 批量更新（Batching）机制
- 💡 对比Vue：Vue的响应式触发 vs React的主动setState

**Day 5-6: Hooks底层原理**
- Hooks为什么不能在条件语句中使用（链表结构）
- `useState` 的实现原理：Fiber节点上的memoizedState链表
- `useEffect` 的实现原理：effect链表和执行时机
- 💡 对比Vue：Composition API的响应式 vs React Hooks的链表

**Day 7: 本周总结 + 模拟面试**

---

### 2.2 核心知识点详解

#### 2.2.1 React渲染流程概览

🔥 **面试必背**：
> React渲染分为两个阶段：
> 1. **Render阶段**（可中断）：调和（Reconciliation），构建Fiber树，标记副作用
> 2. **Commit阶段**（不可中断）：将变更同步到DOM，执行生命周期/Hooks副作用
>
> 这种分离设计使React能够实现时间切片和优先级调度。

**详细流程**：
1. **触发渲染**：`ReactDOM.createRoot().render()` 或 `setState`
2. **创建更新对象**：创建Update对象，加入更新队列
3. **调度更新**：Scheduler根据优先级调度任务
4. **Render阶段**：
   - 从根节点开始，深度优先遍历Fiber树
   - 调用组件的render函数，生成新的React元素
   - Diff算法比较新旧Fiber节点，标记增删改
   - 收集副作用（effectList）
5. **Commit阶段**：
   - Before Mutation：执行getSnapshotBeforeUpdate
   - Mutation：操作真实DOM（插入、更新、删除）
   - Layout：执行useLayoutEffect、componentDidMount/Update

💡 **对比Vue**：
- Vue是响应式的，数据变化自动触发更新；React是主动调用setState触发
- Vue的更新是同步的（nextTick异步批处理）；React的更新可以被中断和恢复
- Vue没有Fiber架构，直接操作VNode；React有Fiber中间层

---

#### 2.2.2 Hooks底层原理

🔥 **面试必背（useState）**：
> useState在Fiber节点的memoizedState上维护一个单向链表，每个Hook对应链表中的一个节点。
> 调用useState时，按顺序从链表中取出对应的Hook节点。
> 这就是为什么Hooks不能在条件语句中使用：条件语句会导致链表顺序错乱。

**useState实现原理**：
```javascript
// Fiber节点结构（简化）
{
  memoizedState: hook0, // 指向第一个Hook
  // ...
}

// Hook链表结构
hook0 = {
  memoizedState: stateValue,  // 当前state值
  queue: updateQueue,         // 更新队列
  next: hook1                 // 下一个Hook
}

hook1 = {
  memoizedState: effectList,
  next: hook2
}
```

**调用流程**：
1. 首次渲染：调用`useState(0)`，创建Hook对象，加入链表，返回`[state, setState]`
2. 更新渲染：调用`useState()`，从链表中按顺序取出对应Hook，返回当前state
3. 调用`setState`：创建Update对象，加入Hook的updateQueue，触发调度

⚡ **重要**：
- 每个组件实例对应一个Fiber节点
- 每个Fiber节点维护自己的Hooks链表
- 多次调用useState会在链表上依次添加节点
- 更新时必须保证调用顺序一致，否则取错Hook

🔥 **面试必背（useEffect）**：
> useEffect在Fiber节点上维护effect链表，包含依赖数组和回调函数。
> Commit阶段会遍历effect链表，对比依赖是否变化，决定是否执行副作用。
> 执行时机：Layout阶段之后，异步执行（不阻塞渲染）。

**useEffect vs useLayoutEffect**：
- `useEffect`：Layout阶段后异步执行，不阻塞浏览器绘制
- `useLayoutEffect`：Layout阶段同步执行，阻塞绘制，类似componentDidMount

💡 **对比Vue**：
- Vue的Composition API（setup）是响应式的，不需要依赖数组
- React Hooks需要手动声明依赖，否则闭包陷阱
- Vue的副作用（watchEffect）是自动追踪依赖的；React的useEffect需要手动指定

---

#### 2.2.3 为什么Hooks不能在条件语句中

🔥 **面试必背**：
> Hooks基于链表实现，React通过调用顺序来确定每个Hook对应链表中的哪个节点。
> 如果在条件语句中使用Hook，条件变化会导致调用顺序改变，Hook节点对应错乱，导致状态混乱或报错。

**错误示例**：
```javascript
function MyComponent({ condition }) {
  if (condition) {
    const [state1, setState1] = useState(0); // ❌ 条件渲染，链表顺序会变
  }
  const [state2, setState2] = useState(1);
}

// 首次渲染condition=true：hook0 -> hook1
// 二次渲染condition=false：hook0（原本是state2，但取到了state1的Hook）
```

**正确写法**：
```javascript
function MyComponent({ condition }) {
  const [state1, setState1] = useState(0); // ✅ 始终调用
  const [state2, setState2] = useState(1);

  if (condition) {
    // 使用state1
  }
}
```

---

### 2.3 本周学习任务清单

- [ ] Day 1: 理解首次渲染流程，阅读相关博客，做笔记
- [ ] Day 2: 阅读`ReactFiberWorkLoop.js`中的`renderRootSync`函数，理解Render阶段
- [ ] Day 3: 理解更新流程，阅读`ReactFiberClassComponent.js`中的`setState`实现
- [ ] Day 4: 理解批量更新机制，阅读`ReactFiberWorkLoop.js`中的`batchedUpdates`
- [ ] Day 5: 理解Hooks链表结构，阅读`ReactFiberHooks.js`中的`renderWithHooks`
- [ ] Day 6: 理解useState和useEffect实现，做对比Vue的笔记
- [ ] Day 7: 完成本周模拟面试，回答5个核心问题

---

### 2.4 本周必答面试题（5题）

1. **React渲染流程是什么？Render阶段和Commit阶段分别做什么？**
   - 🔥 必背上面2.2.1的答案

2. **Hooks为什么不能在条件语句中使用？**
   - 🔥 必背上面2.2.3的答案

3. **useState的实现原理是什么？**
   - 🔥 必背上面2.2.2的答案

4. **useEffect和useLayoutEffect的区别？**
   - useEffect异步执行，不阻塞绘制；useLayoutEffect同步执行，阻塞绘制
   - 使用场景：useEffect用于副作用，useLayoutEffect用于需要同步读取DOM布局的场景

5. **React和Vue的更新机制有什么区别？**
   - Vue是响应式的，依赖收集自动触发；React是主动setState触发
   - Vue更新是同步的；React更新可中断（Fiber）
   - Vue直接操作VNode；React有Fiber中间层

---

### 2.5 推荐学习资源

- [React技术揭秘 - 卡颂](https://react.iamkasong.com/)：最好的React源码解析
- [图解React原理系列](https://7kms.github.io/react-illustration-series/)：可视化理解
- 官方文档：[React Hooks](https://react.dev/reference/react)
- 源码阅读：`ReactFiberHooks.js`、`ReactFiberWorkLoop.js`

---

## 3. Week 2: Fiber架构核心

> **本周目标**：深入理解Fiber架构，能画出Fiber树结构，讲清楚为什么需要Fiber，掌握调和算法和调度机制

### 3.1 学习路线

**Day 1-2: Fiber是什么 + 为什么需要Fiber**
- React 15的问题：递归更新，无法中断，长任务阻塞
- Fiber的设计目标：可中断、可恢复、优先级调度
- Fiber的本质：虚拟DOM + 链表结构 + 工作单元
- 💡 对比Vue：为什么Vue不需要Fiber

**Day 3-4: Fiber数据结构 + 双缓存机制**
- Fiber节点的数据结构（return、child、sibling）
- Fiber树的遍历算法（深度优先）
- 双缓存机制：current树 和 workInProgress树
- 💡 对比Vue：Vue的patch是直接操作VNode

**Day 5-6: 调和算法（Reconciliation）**
- Diff算法：单节点、多节点的Diff策略
- 副作用标记（Placement、Update、Deletion）
- effectList的收集和遍历
- 💡 对比Vue：Vue的双端diff vs React的单向遍历

**Day 7: 调度机制（Scheduler）+ 本周总结**
- 时间切片（Time Slicing）原理
- 优先级调度（Lane模型）
- 浏览器的空闲时间检测（requestIdleCallback）
- 模拟面试

---

### 3.2 核心知识点详解

#### 3.2.1 为什么需要Fiber？

🔥 **面试必背**：
> React 15使用递归方式更新组件，一旦开始无法中断。
> 当组件树很大时，递归更新可能超过16ms（浏览器一帧的时间），导致页面卡顿、掉帧。
>
> Fiber架构通过以下方式解决这个问题：
> 1. **可中断**：将递归改为循环，每个Fiber节点作为工作单元，可随时暂停
> 2. **可恢复**：记录当前工作进度，下次继续
> 3. **优先级调度**：高优先级任务（如用户输入）可以打断低优先级任务（如数据请求）
> 4. **时间切片**：将长任务拆分成多个小任务，每个任务执行5ms后让出主线程

**React 15 的问题示例**：
```javascript
// React 15：递归更新，无法中断
function updateComponent(vnode) {
  // 处理当前组件
  updateCurrentNode(vnode);

  // 递归更新子组件
  vnode.children.forEach(child => {
    updateComponent(child); // ❌ 递归调用，无法中断
  });
}

// 假设有1000个组件，递归调用1000次，阻塞主线程
```

**Fiber的解决方案**：
```javascript
// Fiber：循环 + 链表，可中断
function workLoop(deadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    // 处理一个Fiber节点
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    // 检查是否超时，超时则让出主线程
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 如果还有工作，继续调度
  if (nextUnitOfWork) {
    requestIdleCallback(workLoop);
  }
}
```

💡 **对比Vue（为什么Vue不需要Fiber）**：
- **Vue的响应式粒度更细**：Vue的依赖收集精确到组件级别，更新时只重新渲染变化的组件，不需要遍历整棵树
- **Vue的模板静态分析**：Vue编译器会标记静态节点，更新时跳过静态节点，性能更好
- **Vue 3的优化**：Block Tree、PatchFlag等编译优化，减少了diff范围
- **React的更新范围更大**：React的setState会从触发点向下遍历整棵子树，即使使用了memo，也需要对比props

**结论**：Vue通过响应式和编译优化避免了大范围更新，而React选择用Fiber解决大范围更新的性能问题。两者是不同的技术路线。

---

#### 3.2.2 Fiber数据结构

🔥 **面试必背**：
> Fiber节点是一个JavaScript对象，包含三个核心指针构成链表结构：
> - **return**：指向父节点
> - **child**：指向第一个子节点
> - **sibling**：指向下一个兄弟节点
>
> 这种链表结构使得Fiber树可以通过循环遍历，随时中断和恢复。

**Fiber节点结构（简化）**：
```javascript
function FiberNode(tag, pendingProps, key) {
  // 实例属性
  this.tag = tag;                    // 标记Fiber类型（函数组件、类组件、DOM节点等）
  this.key = key;                    // React元素的key
  this.type = null;                  // 对应的组件类型（函数、类、DOM标签名）
  this.stateNode = null;             // 对应的真实DOM节点或组件实例

  // Fiber链表结构
  this.return = null;                // 指向父Fiber节点
  this.child = null;                 // 指向第一个子Fiber节点
  this.sibling = null;               // 指向下一个兄弟Fiber节点
  this.index = 0;                    // 在父节点中的索引

  // 状态和副作用
  this.pendingProps = pendingProps;  // 新的props
  this.memoizedProps = null;         // 上一次渲染的props
  this.memoizedState = null;         // 上一次渲染的state（Hooks链表）
  this.updateQueue = null;           // 更新队列

  // 副作用标记
  this.flags = NoFlags;              // 副作用标记（Placement、Update、Deletion等）
  this.subtreeFlags = NoFlags;       // 子树的副作用标记
  this.deletions = null;             // 要删除的子节点

  // 双缓存
  this.alternate = null;             // 指向另一棵树中对应的Fiber节点

  // 调度优先级
  this.lanes = NoLanes;              // 当前Fiber的优先级
  this.childLanes = NoLanes;         // 子树的优先级
}
```

**示例：Fiber树结构**
```jsx
<div>
  <h1>Title</h1>
  <p>Content</p>
</div>
```

对应的Fiber树：
```
       div (root)
        |
       child
        |
        v
       h1  ----sibling----> p
        |                   |
      return              return
        |                   |
        +-------------------+
                |
                v
              div
```

**遍历算法**（深度优先）：
1. 从根节点开始，处理当前节点（beginWork）
2. 如果有child，移动到child
3. 如果没有child，处理当前节点（completeWork），然后移动到sibling
4. 如果没有sibling，返回到return（父节点）
5. 重复2-4，直到回到根节点

**遍历顺序**：div -> h1 -> p -> div（completeWork）

---

#### 3.2.3 双缓存机制

🔥 **面试必背**：
> React使用双缓存技术，同时存在两棵Fiber树：
> - **current树**：当前屏幕上显示的内容对应的Fiber树
> - **workInProgress树**：正在内存中构建的Fiber树
>
> 两棵树通过alternate指针相互引用。
> 更新时，在workInProgress树上进行操作，不影响当前页面。
> 更新完成后，直接切换根指针，workInProgress树变成current树（双缓存切换）。
> 这样避免了在当前树上修改导致的中间状态显示。

**工作流程**：
```
首次渲染：
1. 创建rootFiber（current树的根）
2. 基于JSX创建workInProgress树
3. Commit阶段：rootFiber.current指向workInProgress树
4. workInProgress树变成新的current树

更新渲染：
1. 基于current树创建新的workInProgress树
2. 复用current树的Fiber节点（通过alternate获取）
3. Diff对比，标记副作用
4. Commit阶段：切换指针，workInProgress变成current
```

**示例代码**：
```javascript
// 创建workInProgress Fiber
function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate;

  if (workInProgress === null) {
    // 首次渲染，创建新Fiber
    workInProgress = createFiber(current.tag, pendingProps, current.key);
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;

    // 建立双向指针
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    // 更新渲染，复用Fiber
    workInProgress.pendingProps = pendingProps;
    workInProgress.flags = NoFlags;
    workInProgress.subtreeFlags = NoFlags;
    workInProgress.deletions = null;
  }

  // 复用其他属性
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;

  return workInProgress;
}
```

💡 **对比Vue**：
- Vue没有双缓存机制，直接在VNode树上进行patch操作
- Vue的patch是同步的，而React的Fiber可以异步（时间切片）
- Vue依赖响应式精确更新，React依赖Fiber全树遍历

---

#### 3.2.4 调和算法（Reconciliation）- Diff算法

🔥 **面试必背**：
> React的Diff算法基于三个假设（启发式算法）：
> 1. **不同类型的元素会产生不同的树**：直接销毁旧树，创建新树
> 2. **同层级比较**：只比较同一层级的节点，不跨层级比较
> 3. **通过key标识元素**：同一层级的子节点，通过key判断是移动还是新增/删除
>
> Diff分为两种情况：
> - **单节点Diff**：新节点只有一个子节点
> - **多节点Diff**：新节点有多个子节点（列表）

**单节点Diff**：
```javascript
// 单节点Diff流程
function reconcileSingleElement(returnFiber, currentFirstChild, element) {
  const key = element.key;
  let child = currentFirstChild;

  // 遍历旧的子节点
  while (child !== null) {
    // 1. 比较key
    if (child.key === key) {
      // 2. key相同，比较type
      if (child.type === element.type) {
        // 3. type也相同，复用Fiber节点，标记Update
        deleteRemainingChildren(returnFiber, child.sibling); // 删除其他兄弟节点
        const existing = useFiber(child, element.props);
        existing.return = returnFiber;
        return existing;
      } else {
        // type不同，删除旧节点及其兄弟节点
        deleteRemainingChildren(returnFiber, child);
        break;
      }
    } else {
      // key不同，删除旧节点
      deleteChild(returnFiber, child);
    }
    child = child.sibling;
  }

  // 4. 没有可复用的，创建新Fiber节点
  const created = createFiberFromElement(element);
  created.return = returnFiber;
  return created;
}
```

**多节点Diff**（最复杂、最重要）：

🔥 **面试必背**：
> 多节点Diff分为三轮遍历：
> 1. **第一轮**：处理节点更新（key和type都相同）
>    - 从头开始遍历，比较新旧子节点
>    - 如果key和type相同，复用节点，继续下一个
>    - 如果不同，跳出第一轮
> 2. **第二轮**：处理节点新增和删除
>    - 如果新节点遍历完，旧节点还有，删除剩余旧节点
>    - 如果旧节点遍历完，新节点还有，新增剩余新节点
> 3. **第三轮**：处理节点位置变化
>    - 将剩余旧节点存入Map（key -> oldFiber）
>    - 遍历剩余新节点，从Map中查找可复用的旧节点
>    - 如果找到，标记移动（Placement）；如果找不到，创建新节点
>    - 遍历完成后，删除Map中剩余的旧节点

**示例**：
```jsx
// 旧节点：a b c d
// 新节点：a c d e

// 第一轮：a key和type相同，复用，index=0
//        b vs c，key不同，跳出第一轮

// 第二轮：新旧节点都没遍历完，进入第三轮

// 第三轮：
// 1. 将剩余旧节点存入Map：{ b: oldFiberB, c: oldFiberC, d: oldFiberD }
// 2. 遍历剩余新节点：
//    - c: 在Map中找到，复用oldFiberC，标记Placement（移动）
//    - d: 在Map中找到，复用oldFiberD，标记Placement（移动）
//    - e: 在Map中找不到，创建新节点，标记Placement（新增）
// 3. 删除Map中剩余的旧节点：b 标记Deletion
```

💡 **对比Vue的双端Diff**：
- **React**：单向遍历（从左到右），使用Map查找，时间复杂度O(n)
- **Vue 2**：双端Diff，同时从头尾对比（头头、尾尾、头尾、尾头），减少遍历次数
- **Vue 3**：最长递增子序列，优化移动次数

**为什么React不用双端Diff？**
- React的Fiber是链表结构，没有反向指针（从尾部开始很困难）
- React优先保证时间切片的可中断性，而不是最小移动次数

---

#### 3.2.5 调度机制（Scheduler）

🔥 **面试必背**：
> React Scheduler负责任务的调度和优先级管理：
> 1. **时间切片**：将长任务拆分成5ms的小任务，每个任务执行完让出主线程，避免阻塞
> 2. **优先级调度**：高优先级任务（用户输入）可以打断低优先级任务（数据请求）
> 3. **饥饿问题**：低优先级任务长期被打断，Scheduler会提升其优先级，防止饿死
>
> 实现原理：
> - 使用MessageChannel模拟requestIdleCallback（宏任务，更稳定）
> - 维护任务队列，按优先级和过期时间排序
> - 每5ms检查一次是否需要让出主线程

**时间切片原理**：
```javascript
// 简化版Scheduler实现
let nextUnitOfWork = null;
let shouldYield = false;

function workLoop() {
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    // 每处理一个Fiber节点，检查是否超时
    shouldYield = unstable_shouldYield(); // 检查当前时间片是否用完
  }

  if (nextUnitOfWork) {
    // 还有工作，继续调度
    scheduleCallback(workLoop);
  } else {
    // 没有工作，进入Commit阶段
    commitRoot();
  }
}

function unstable_shouldYield() {
  const currentTime = getCurrentTime();
  return currentTime >= deadline; // deadline = startTime + 5ms
}

// 使用MessageChannel模拟requestIdleCallback
const channel = new MessageChannel();
const port = channel.port2;

channel.port1.onmessage = () => {
  // 执行任务
  workLoop();
};

function scheduleCallback(callback) {
  // 发送消息，触发宏任务
  port.postMessage(null);
}
```

**优先级模型（Lane）**：

⚡ **重要**：
- React 18使用Lane模型（车道模型）表示优先级
- 用二进制位表示优先级，支持批量优先级操作（位运算）

```javascript
// Lane优先级（从高到低）
export const SyncLane = 0b0000000000000000000000000000001;           // 同步优先级（点击事件）
export const InputContinuousLane = 0b0000000000000000000000000000100; // 连续输入（滚动、拖拽）
export const DefaultLane = 0b0000000000000000000000000010000;         // 默认优先级（数据请求）
export const TransitionLane = 0b0000000000000000000000001000000;      // 过渡优先级（useTransition）
export const IdleLane = 0b0100000000000000000000000000000;            // 空闲优先级
```

**优先级调度示例**：
```jsx
// 用户输入（高优先级）打断数据请求（低优先级）
function App() {
  const [input, setInput] = useState('');
  const [list, setList] = useState([]);

  // 高优先级：用户输入
  const handleInput = (e) => {
    setInput(e.target.value); // SyncLane
  };

  // 低优先级：数据请求
  useEffect(() => {
    fetchData().then(data => {
      setList(data); // DefaultLane
    });
  }, []);

  // 如果用户正在输入，Scheduler会：
  // 1. 暂停DefaultLane的更新（setList）
  // 2. 优先处理SyncLane的更新（setInput）
  // 3. 等SyncLane完成后，继续DefaultLane
}
```

💡 **对比Vue**：
- Vue没有Scheduler，更新是同步的（虽然有nextTick批量处理）
- Vue 3的任务调度更简单，因为响应式粒度更细
- React的Scheduler是为了应对大范围更新+时间切片的需求

---

### 3.3 本周学习任务清单

- [ ] Day 1: 理解为什么需要Fiber，写对比Vue的笔记
- [ ] Day 2: 阅读相关博客，理解Fiber的设计目标
- [ ] Day 3: 理解Fiber数据结构，画出Fiber树结构图
- [ ] Day 4: 理解双缓存机制，阅读`ReactFiber.js`中的`createWorkInProgress`
- [ ] Day 5: 理解单节点Diff，阅读`ReactChildFiber.js`的`reconcileSingleElement`
- [ ] Day 6: 理解多节点Diff，重点理解三轮遍历逻辑
- [ ] Day 7: 理解调度机制，完成模拟面试

---

### 3.4 本周必答面试题（5题）

1. **为什么需要Fiber？Fiber解决了什么问题？**
   - 🔥 必背3.2.1的答案

2. **Fiber数据结构是什么？如何通过链表实现可中断？**
   - 🔥 必背3.2.2的答案

3. **什么是双缓存机制？为什么需要两棵Fiber树？**
   - 🔥 必背3.2.3的答案

4. **React的Diff算法是怎样的？多节点Diff的三轮遍历是什么？**
   - 🔥 必背3.2.4的答案

5. **React的调度机制是怎样的？时间切片如何实现？**
   - 🔥 必背3.2.5的答案

---

### 3.5 额外追问题（大厂高级岗必问）

⚡ **进阶问题**：

1. **为什么Vue不需要Fiber？**
   - 参考3.2.1的对比Vue部分

2. **React的Diff为什么不用双端Diff？**
   - 参考3.2.4的对比Vue部分

3. **Fiber架构下，为什么生命周期会执行多次？**
   - Render阶段可中断，组件可能被渲染多次
   - 解决方案：React 18移除了不安全的生命周期（componentWillMount等），推荐使用Hooks

4. **Lane模型相比优先级数字有什么优势？**
   - 位运算性能更高
   - 支持批量优先级（一个更新可以有多个优先级）
   - 更灵活的优先级管理

5. **如果有10000个节点需要更新,Fiber是如何保证不卡顿的？**
   - 时间切片：每5ms处理一部分节点，然后让出主线程
   - 优先级调度：用户交互优先处理
   - 可中断：高优先级任务到来时，暂停当前任务

---

### 3.6 推荐学习资源

- [React技术揭秘 - Fiber架构](https://react.iamkasong.com/process/fiber.html)
- [图解React - Fiber数据结构](https://7kms.github.io/react-illustration-series/main/fibertree-prepare)
- [React源码解析 - Diff算法](https://react.iamkasong.com/diff/prepare.html)
- 源码阅读：`ReactFiber.js`、`ReactChildFiber.js`、`ReactFiberWorkLoop.js`、`Scheduler.js`

---

## 4. Week 3: 性能优化实战

> **本周目标**：掌握React性能优化的各种手段，理解其底层原理，能针对实际场景给出优化方案

### 4.1 学习路线

**Day 1-2: 组件层面优化**
- React.memo、PureComponent原理
- shouldComponentUpdate的使用和注意事项
- 💡 对比Vue：Vue的响应式自动优化 vs React的手动优化

**Day 3-4: Hooks层面优化**
- useMemo、useCallback的原理和使用场景
- 如何避免不必要的重新渲染
- 闭包陷阱和依赖数组
- 💡 对比Vue：Vue的computed vs React的useMemo

**Day 5-6: 代码分割和懒加载**
- React.lazy和Suspense的原理
- 路由级别的代码分割
- 组件级别的按需加载
- 虚拟列表（react-window / react-virtualized）

**Day 7: 性能分析工具 + 本周总结**
- React DevTools Profiler使用
- 性能瓶颈定位
- 模拟面试

---

### 4.2 核心知识点详解

#### 4.2.1 React.memo - 组件级缓存

🔥 **面试必背**：
> React.memo是一个高阶组件，对组件的props进行浅比较。
> 如果props没有变化，跳过组件的重新渲染，直接复用上次的渲染结果。
>
> 原理：在Fiber的beginWork阶段，对比新旧props，如果相同，跳过render函数调用。

**使用示例**：
```jsx
// 没有优化的组件
function Child({ name }) {
  console.log('Child rendered');
  return <div>{name}</div>;
}

// 父组件每次渲染，Child都会重新渲染，即使name没变
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <Child name="Tom" />  {/* name始终是"Tom"，但每次都重新渲染 */}
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </>
  );
}

// 使用React.memo优化
const Child = React.memo(function Child({ name }) {
  console.log('Child rendered');
  return <div>{name}</div>;
});

// 现在Parent更新时，如果name没变，Child不会重新渲染
```

**自定义比较函数**：
```jsx
const Child = React.memo(
  function Child({ user }) {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => {
    // 返回true表示props相等，不需要重新渲染
    // 返回false表示props不相等，需要重新渲染
    return prevProps.user.id === nextProps.user.id;
  }
);
```

⚡ **注意事项**：
- React.memo只进行浅比较，对象引用变化会导致重新渲染
- 不要过度使用，增加了比较成本
- 适用于：纯展示组件、props复杂但变化频率低的组件

💡 **对比Vue**：
- Vue的组件默认就是"智能"更新的，因为响应式系统精确追踪依赖
- React需要手动使用memo，因为默认是"父组件更新，子组件全部更新"
- Vue 3的编译优化（Block Tree）自动跳过静态节点

---

#### 4.2.2 useMemo - 计算结果缓存

🔥 **面试必背**：
> useMemo缓存计算结果，只有依赖项变化时才重新计算。
>
> 原理：useMemo在Fiber节点的Hooks链表中存储计算结果和依赖数组。
> 更新时，对比新旧依赖数组，如果相同，直接返回缓存的结果。

**使用示例**：
```jsx
function TodoList({ todos, filter }) {
  // 没有优化：每次渲染都重新计算
  const filteredTodos = todos.filter(todo => todo.type === filter);

  // 使用useMemo优化：只有todos或filter变化时才重新计算
  const filteredTodos = useMemo(() => {
    console.log('Filtering...');
    return todos.filter(todo => todo.type === filter);
  }, [todos, filter]);

  return <ul>{/* 渲染filteredTodos */}</ul>;
}
```

**原理**：
```javascript
// useMemo简化实现
function useMemo(create, deps) {
  const hook = updateWorkInProgressHook(); // 获取当前Hook节点

  const prevDeps = hook.memoizedState?.[1]; // 上次的依赖数组

  if (prevDeps !== null) {
    if (areHookInputsEqual(deps, prevDeps)) {
      // 依赖没变，返回缓存的值
      return hook.memoizedState[0];
    }
  }

  // 依赖变化，重新计算
  const value = create();
  hook.memoizedState = [value, deps];
  return value;
}

// 浅比较依赖数组
function areHookInputsEqual(nextDeps, prevDeps) {
  for (let i = 0; i < prevDeps.length; i++) {
    if (Object.is(nextDeps[i], prevDeps[i])) {
      continue;
    }
    return false;
  }
  return true;
}
```

⚡ **使用场景**：
- 计算成本高（如大列表过滤、排序、复杂计算）
- 避免子组件不必要的重新渲染（配合React.memo）

💡 **对比Vue**：
- Vue的computed自动追踪依赖，不需要手动指定依赖数组
- React的useMemo需要手动维护依赖数组，容易遗漏导致bug

---

#### 4.2.3 useCallback - 函数缓存

🔥 **面试必背**：
> useCallback缓存函数引用，只有依赖项变化时才创建新函数。
> 本质上，useCallback(fn, deps) 等价于 useMemo(() => fn, deps)。
>
> 使用场景：
> 1. 传递给子组件的回调函数（配合React.memo）
> 2. 作为useEffect的依赖项

**使用示例**：
```jsx
function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('Tom');

  // 没有优化：每次渲染都创建新函数，导致Child重新渲染
  const handleClick = () => {
    console.log(name);
  };

  // 使用useCallback优化：只有name变化时才创建新函数
  const handleClick = useCallback(() => {
    console.log(name);
  }, [name]); // count变化时，handleClick引用不变

  return <Child onClick={handleClick} />;
}

const Child = React.memo(function Child({ onClick }) {
  console.log('Child rendered');
  return <button onClick={onClick}>Click</button>;
});

// 现在count变化时，handleClick引用不变，Child不会重新渲染
```

**useMemo vs useCallback**：
```jsx
// 这两者等价
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

const memoizedCallback = useMemo(() => {
  return () => {
    doSomething(a, b);
  };
}, [a, b]);
```

⚡ **注意事项**：
- 只有配合React.memo才有意义，否则子组件仍会重新渲染
- 不要过度使用，增加内存占用和比较成本
- 依赖数组遗漏会导致闭包陷阱

**闭包陷阱示例**：
```jsx
function Counter() {
  const [count, setCount] = useState(0);

  // ❌ 错误：依赖数组为空，handleClick永远访问的是初始的count（0）
  const handleClick = useCallback(() => {
    console.log(count); // 永远打印0
  }, []);

  // ✅ 正确：依赖数组包含count
  const handleClick = useCallback(() => {
    console.log(count);
  }, [count]);

  // ✅ 更好：使用函数式更新，避免依赖count
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <button onClick={handleClick}>Count: {count}</button>;
}
```

---

#### 4.2.4 React.lazy + Suspense - 代码分割

🔥 **面试必背**：
> React.lazy允许组件懒加载，配合Suspense实现加载状态。
>
> 原理：
> 1. React.lazy返回一个特殊的组件，内部包含一个Promise
> 2. 首次渲染时，触发Promise（动态import）
> 3. Promise pending时，向上查找最近的Suspense边界，显示fallback
> 4. Promise resolved后，渲染实际组件

**使用示例**：
```jsx
// 懒加载组件
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

**路由级别代码分割**：
```jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

**Suspense原理**（简化）：
```javascript
function Suspense({ children, fallback }) {
  try {
    return children;
  } catch (promise) {
    if (promise instanceof Promise) {
      // 捕获到Promise，显示fallback
      promise.then(() => {
        // Promise resolved，触发重新渲染
        forceUpdate();
      });
      return fallback;
    }
    throw promise;
  }
}

// React.lazy抛出Promise
function lazy(loader) {
  return function LazyComponent(props) {
    const Component = readLazyComponent(loader);
    return <Component {...props} />;
  };
}

function readLazyComponent(loader) {
  if (cache.has(loader)) {
    return cache.get(loader); // 已加载，直接返回
  }

  const promise = loader(); // 动态import，返回Promise
  throw promise; // 抛出Promise，被Suspense捕获
}
```

⚡ **最佳实践**：
- 路由级别必须做代码分割
- 大型组件（如富文本编辑器、图表库）建议懒加载
- 小组件不建议懒加载，增加网络请求反而更慢

---

#### 4.2.5 虚拟列表 - 长列表优化

⚡ **重要**：
> 虚拟列表只渲染可见区域的列表项，大幅减少DOM节点数量。
>
> 原理：
> 1. 计算可见区域能容纳多少个列表项
> 2. 监听滚动事件，计算当前应该渲染哪些项
> 3. 只渲染可见区域的项 + 上下缓冲区的项
> 4. 通过padding撑开容器高度，模拟完整列表

**手写简易虚拟列表**：
```jsx
function VirtualList({ items, itemHeight, containerHeight }) {
  const [scrollTop, setScrollTop] = useState(0);

  // 计算可见区域
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = startIndex + visibleCount;

  // 只渲染可见区域的项
  const visibleItems = items.slice(startIndex, endIndex + 1);

  // 总高度（撑开滚动条）
  const totalHeight = items.length * itemHeight;

  // 偏移量（让可见项出现在正确位置）
  const offsetY = startIndex * itemHeight;

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**使用现成库**：
```jsx
import { FixedSizeList } from 'react-window';

function App() {
  return (
    <FixedSizeList
      height={600}        // 容器高度
      itemCount={10000}   // 总项数
      itemSize={50}       // 每项高度
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>Item {index}</div>
      )}
    </FixedSizeList>
  );
}
```

💡 **对比Vue**：
- Vue和React的虚拟列表实现思路完全相同
- Vue可以用vue-virtual-scroller，React用react-window

---

### 4.3 性能优化场景总结

🎯 **5种常见优化场景**：

#### 场景1：父组件频繁更新，子组件不需要更新
```jsx
// ❌ 问题：Parent每次更新，Child都重新渲染
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <Child data={staticData} />
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </>
  );
}

// ✅ 解决：使用React.memo
const Child = React.memo(function Child({ data }) {
  return <div>{data}</div>;
});
```

#### 场景2：列表渲染，传递回调函数
```jsx
// ❌ 问题：每次渲染都创建新函数，导致所有ListItem重新渲染
function List({ items }) {
  return items.map(item => (
    <ListItem
      key={item.id}
      item={item}
      onClick={() => handleClick(item.id)}  // 每次都是新函数
    />
  ));
}

// ✅ 解决：使用useCallback
function List({ items }) {
  const handleClick = useCallback((id) => {
    console.log(id);
  }, []);

  return items.map(item => (
    <ListItem
      key={item.id}
      item={item}
      onClick={handleClick}
    />
  ));
}

const ListItem = React.memo(function ListItem({ item, onClick }) {
  return <div onClick={() => onClick(item.id)}>{item.name}</div>;
});
```

#### 场景3：复杂计算
```jsx
// ❌ 问题：每次渲染都重新计算
function TodoList({ todos, filter }) {
  const filteredTodos = todos.filter(todo => {
    // 假设这是一个很复杂的计算
    return expensiveFilter(todo, filter);
  });

  return <ul>{/* ... */}</ul>;
}

// ✅ 解决：使用useMemo
function TodoList({ todos, filter }) {
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => expensiveFilter(todo, filter));
  }, [todos, filter]);

  return <ul>{/* ... */}</ul>;
}
```

#### 场景4：长列表渲染
```jsx
// ❌ 问题：渲染10000个DOM节点，页面卡顿
function App() {
  const items = Array.from({ length: 10000 });
  return (
    <div>
      {items.map((_, i) => <div key={i}>Item {i}</div>)}
    </div>
  );
}

// ✅ 解决：使用虚拟列表
import { FixedSizeList } from 'react-window';

function App() {
  return (
    <FixedSizeList
      height={600}
      itemCount={10000}
      itemSize={50}
    >
      {({ index, style }) => (
        <div style={style}>Item {index}</div>
      )}
    </FixedSizeList>
  );
}
```

#### 场景5：首屏加载慢
```jsx
// ❌ 问题：打包后bundle.js体积过大
import Dashboard from './Dashboard';
import Settings from './Settings';
import Profile from './Profile';

// ✅ 解决：路由级别代码分割
const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));
const Profile = lazy(() => import('./Profile'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Suspense>
  );
}
```

---

### 4.4 性能分析工具

**React DevTools Profiler使用**：

1. 打开Chrome DevTools，切换到Profiler标签
2. 点击"Record"，操作应用，点击"Stop"
3. 查看Flamegraph（火焰图）：
   - 横轴：组件渲染时间
   - 颜色：黄色/红色表示渲染慢
4. 查看Ranked（排名）：按渲染时间排序
5. 定位性能瓶颈：找到渲染慢的组件，检查是否需要优化

**性能优化checklist**：
- [ ] 是否有不必要的重新渲染？（React.memo）
- [ ] 是否有重复计算？（useMemo）
- [ ] 是否有不必要的函数创建？（useCallback）
- [ ] 是否有长列表？（虚拟列表）
- [ ] 是否有大组件可以懒加载？（React.lazy）
- [ ] 是否有状态提升过度？（状态下沉，减少影响范围）

---

### 4.5 本周学习任务清单

- [ ] Day 1: 理解React.memo原理，写对比Vue的笔记
- [ ] Day 2: 实践React.memo，测试性能提升
- [ ] Day 3: 理解useMemo和useCallback原理
- [ ] Day 4: 学习避免闭包陷阱，练习依赖数组
- [ ] Day 5: 理解React.lazy和Suspense原理
- [ ] Day 6: 实践虚拟列表，使用react-window
- [ ] Day 7: 使用React DevTools Profiler分析性能，模拟面试

---

### 4.6 本周必答面试题（5题）

1. **React性能优化有哪些手段？**
   - 🔥 必背：React.memo、useMemo、useCallback、React.lazy、虚拟列表、状态下沉

2. **React.memo的原理是什么？**
   - 🔥 必背4.2.1的答案

3. **useMemo和useCallback的区别？使用场景是什么？**
   - useMemo缓存计算结果，useCallback缓存函数引用
   - useCallback(fn, deps) === useMemo(() => fn, deps)
   - 使用场景参考4.2.2和4.2.3

4. **如何优化长列表渲染？**
   - 🔥 必背：使用虚拟列表，只渲染可见区域的项
   - 原理参考4.2.5

5. **Vue和React的性能优化有什么区别？**
   - Vue响应式自动优化，React需要手动优化（memo、useMemo）
   - Vue的computed自动追踪依赖，React的useMemo需要手动维护依赖数组
   - 虚拟列表思路相同

---

### 4.7 推荐学习资源

- [React性能优化 - 官方文档](https://react.dev/learn/render-and-commit#optimizing-performance)
- [useMemo和useCallback使用指南](https://react.dev/reference/react/useMemo)
- [react-window文档](https://react-window.vercel.app/)
- [Web性能优化 - MDN](https://developer.mozilla.org/en-US/docs/Web/Performance)

---

## 5. Week 4: React18新特性 + 面试冲刺

> **本周目标**：掌握React18的并发特性，整理必背知识点，完成面试模拟

### 5.1 学习路线

**Day 1-2: 并发模式（Concurrent Mode）**
- 并发渲染的概念和意义
- 自动批处理（Automatic Batching）
- useTransition和useDeferredValue
- 💡 对比Vue：Vue 3的调度机制

**Day 3-4: Suspense深入**
- Suspense的原理和使用场景
- 数据获取场景下的Suspense（Suspense for Data Fetching）
- Streaming SSR

**Day 5: React18其他新特性**
- useId
- useSyncExternalStore
- useInsertionEffect

**Day 6-7: 面试冲刺**
- 整理4周必背知识点
- 完成3-5次模拟面试
- 梳理高频面试题答案

---

### 5.2 核心知识点详解

#### 5.2.1 并发模式（Concurrent Mode）

🔥 **面试必背**：
> React 18默认启用并发模式。并发渲染允许React同时准备多个版本的UI。
>
> 核心特性：
> 1. **可中断渲染**：渲染过程可以被更高优先级任务打断
> 2. **并发更新**：可以同时存在多个更新，根据优先级决定哪个先提交
> 3. **自动批处理**：在事件处理器、setTimeout、Promise中的setState自动批量处理
>
> 意义：
> - 保持UI响应性，即使在大量计算时用户交互也不会卡顿
> - 更流畅的用户体验

**启用并发模式**：
```jsx
// React 17 - Legacy模式
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));

// React 18 - 并发模式
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

---

#### 5.2.2 自动批处理（Automatic Batching）

🔥 **面试必背**：
> React 18中，所有更新都会自动批处理，包括Promise、setTimeout、原生事件中的setState。
>
> React 17中，只有React事件处理器中的setState会批处理。

**示例**：
```jsx
// React 17
function handleClick() {
  setCount(c => c + 1); // 批处理
  setFlag(f => !f);     // 批处理
  // 只渲染一次 ✅
}

setTimeout(() => {
  setCount(c => c + 1); // 不批处理，渲染一次
  setFlag(f => !f);     // 不批处理，渲染一次
  // 渲染两次 ❌
}, 1000);

// React 18
function handleClick() {
  setCount(c => c + 1); // 批处理
  setFlag(f => !f);     // 批处理
  // 只渲染一次 ✅
}

setTimeout(() => {
  setCount(c => c + 1); // 批处理
  setFlag(f => !f);     // 批处理
  // 只渲染一次 ✅
}, 1000);

fetch('/api/data').then(() => {
  setCount(c => c + 1); // 批处理
  setFlag(f => !f);     // 批处理
  // 只渲染一次 ✅
});
```

**退出批处理**（如果确实需要同步更新）：
```jsx
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCount(c => c + 1); // 立即渲染
  });
  // 此时DOM已更新，可以读取新值
  flushSync(() => {
    setFlag(f => !f); // 立即渲染
  });
  // 总共渲染两次
}
```

---

#### 5.2.3 useTransition - 标记低优先级更新

🔥 **面试必背**：
> useTransition允许将某些更新标记为"过渡"（低优先级），不阻塞用户交互。
>
> 使用场景：
> - 搜索框输入时，输入是高优先级，搜索结果渲染是低优先级
> - 标签页切换时，标签切换是高优先级，内容渲染是低优先级
>
> 返回值：
> - isPending：过渡更新是否正在进行
> - startTransition：标记低优先级更新的函数

**使用示例**：
```jsx
import { useState, useTransition } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [list, setList] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    // 高优先级：立即更新输入框
    setInput(e.target.value);

    // 低优先级：更新搜索结果
    startTransition(() => {
      const filtered = filterList(e.target.value); // 假设这是一个很慢的操作
      setList(filtered);
    });
  }

  return (
    <>
      <input value={input} onChange={handleChange} />
      {isPending && <Spinner />}  {/* 显示加载状态 */}
      <List items={list} />
    </>
  );
}
```

**原理**：
- 用户输入时，setInput触发高优先级更新（SyncLane），立即渲染输入框
- startTransition中的setList触发低优先级更新（TransitionLane），可以被打断
- 如果用户继续输入，低优先级更新会被取消，重新开始
- 这样保证输入框始终流畅，即使列表渲染很慢

⚡ **useTransition vs useDeferredValue**：
```jsx
// useTransition：主动标记低优先级更新
const [isPending, startTransition] = useTransition();
startTransition(() => {
  setList(newList);
});

// useDeferredValue：被动延迟值的更新
const deferredList = useDeferredValue(list);
```

---

#### 5.2.4 useDeferredValue - 延迟值更新

🔥 **面试必背**：
> useDeferredValue返回一个延迟版本的值，当有更高优先级更新时，延迟值保持旧值。
>
> 使用场景：和useTransition类似，但更简单，不需要包裹setState。

**使用示例**：
```jsx
import { useState, useDeferredValue } from 'react';

function App() {
  const [input, setInput] = useState('');
  const deferredInput = useDeferredValue(input); // 延迟版本的input

  // input是高优先级的，立即更新
  // deferredInput是低优先级的，可能延迟更新

  return (
    <>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <SlowList text={deferredInput} />  {/* 使用延迟的值 */}
    </>
  );
}

function SlowList({ text }) {
  // 假设这个组件渲染很慢
  const items = useMemo(() => {
    return generateItems(text); // 很慢的操作
  }, [text]);

  return <ul>{/* 渲染items */}</ul>;
}
```

**工作流程**：
1. 用户输入"a"，input立即变成"a"，deferredInput还是""
2. React开始渲染SlowList（text=""），但这是低优先级更新
3. 用户继续输入"ab"，input立即变成"ab"，deferredInput还是""
4. React取消之前的低优先级更新，重新开始
5. 用户停止输入，React完成低优先级更新，deferredInput变成"ab"

---

#### 5.2.5 Suspense for Data Fetching

⚡ **重要**：
> Suspense不仅可以用于代码分割，还可以用于数据获取的加载状态。
>
> 注意：目前需要配合支持Suspense的数据获取库（如Relay、SWR、React Query），直接在组件中fetch不会触发Suspense。

**使用示例**：
```jsx
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <UserProfile userId={1} />
    </Suspense>
  );
}

function UserProfile({ userId }) {
  // 使用支持Suspense的数据获取库
  const user = use(fetchUser(userId)); // use是React的新Hook（实验性）

  return <div>{user.name}</div>;
}
```

**原理**（简化）：
```javascript
// 数据获取函数抛出Promise
function fetchUser(userId) {
  if (cache.has(userId)) {
    return cache.get(userId); // 数据已加载，直接返回
  }

  const promise = fetch(`/api/user/${userId}`).then(res => res.json());

  promise.then(user => {
    cache.set(userId, user); // 缓存数据
  });

  throw promise; // 抛出Promise，被Suspense捕获
}

// Suspense捕获Promise，显示fallback
function Suspense({ children, fallback }) {
  try {
    return children;
  } catch (promise) {
    if (promise instanceof Promise) {
      promise.then(() => forceUpdate()); // Promise resolved，重新渲染
      return fallback;
    }
    throw promise;
  }
}
```

**嵌套Suspense**：
```jsx
<Suspense fallback={<PageLoading />}>
  <Header />
  <Suspense fallback={<SidebarLoading />}>
    <Sidebar />
  </Suspense>
  <Suspense fallback={<ContentLoading />}>
    <Content />
  </Suspense>
</Suspense>
```

---

#### 5.2.6 其他新特性

**useId - 生成唯一ID**：
```jsx
function NameFields() {
  const id = useId(); // 生成唯一ID，SSR安全

  return (
    <>
      <label htmlFor={id + '-firstName'}>First Name</label>
      <input id={id + '-firstName'} type="text" />

      <label htmlFor={id + '-lastName'}>Last Name</label>
      <input id={id + '-lastName'} type="text" />
    </>
  );
}
```

**useSyncExternalStore - 订阅外部状态**：
```jsx
// 用于状态管理库（Redux、Zustand等）
import { useSyncExternalStore } from 'react';

function useStore(store) {
  const state = useSyncExternalStore(
    store.subscribe,   // 订阅函数
    store.getState,    // 获取快照函数
    store.getState     // 获取服务端快照
  );
  return state;
}
```

**useInsertionEffect - 插入样式**：
```jsx
// 在DOM变更之前执行，用于CSS-in-JS库
function useCSS(rule) {
  useInsertionEffect(() => {
    document.head.appendChild(createStyleElement(rule));
  }, [rule]);
}
```

---

### 5.3 面试冲刺清单

#### 5.3.1 核心原理必背（20题）

🔥 **Fiber相关（5题）**：
1. 为什么需要Fiber？Fiber解决了什么问题？
2. Fiber数据结构是什么？
3. 什么是双缓存机制？
4. React的Diff算法是怎样的？多节点Diff的三轮遍历？
5. React的调度机制是怎样的？时间切片如何实现？

🔥 **Hooks相关（5题）**：
6. Hooks为什么不能在条件语句中使用？
7. useState的实现原理是什么？
8. useEffect的实现原理和执行时机？
9. useEffect和useLayoutEffect的区别？
10. 如何避免Hooks的闭包陷阱？

🔥 **性能优化（5题）**：
11. React性能优化有哪些手段？
12. React.memo的原理是什么？
13. useMemo和useCallback的区别？
14. 如何优化长列表渲染？
15. 如何分析React应用的性能瓶颈？

🔥 **React18新特性（5题）**：
16. React18有哪些新特性？
17. 并发模式是什么？有什么意义？
18. useTransition的使用场景和原理？
19. 自动批处理是什么？和React17有什么区别？
20. Suspense的原理是什么？

#### 5.3.2 对比Vue必背（10题）

💡 **底层机制对比**：
1. React和Vue的更新机制有什么区别？
2. 为什么Vue不需要Fiber？
3. React的Diff为什么不用双端Diff？
4. Vue的computed和React的useMemo有什么区别？
5. Vue的响应式和React的setState有什么区别？

💡 **性能优化对比**：
6. Vue和React的性能优化有什么区别？
7. Vue的组件为什么不需要memo？
8. Vue和React的虚拟列表有什么区别？
9. Vue和React的代码分割有什么区别？
10. Vue和React哪个性能更好？为什么？

#### 5.3.3 高频追问（10题）

⚡ **深入追问**：
1. Fiber架构下，为什么生命周期会执行多次？
2. Lane模型相比优先级数字有什么优势？
3. 为什么useEffect不能直接使用async函数？
4. React的事件系统和原生事件有什么区别？
5. 虚拟DOM一定比真实DOM快吗？
6. React的key为什么不建议用index？
7. Context为什么会导致性能问题？如何优化？
8. React18的并发渲染和Vue3的调度有什么区别？
9. Suspense抛出Promise，会不会导致组件重新mount？
10. 如果有10000个节点需要更新，Fiber是如何保证不卡顿的？

---

### 5.4 本周学习任务清单

- [ ] Day 1: 理解并发模式，阅读React18更新日志
- [ ] Day 2: 理解useTransition和useDeferredValue，写对比笔记
- [ ] Day 3: 理解Suspense原理，阅读相关源码
- [ ] Day 4: 实践Suspense for Data Fetching
- [ ] Day 5: 了解useId、useSyncExternalStore等新特性
- [ ] Day 6: 整理必背知识点，制作速查表
- [ ] Day 7: 完成3-5次模拟面试，查漏补缺

---

### 5.5 模拟面试题库

**Round 1: 基础轮**
- 讲一下React的渲染流程
- Hooks为什么不能在条件语句中使用
- React和Vue有什么区别

**Round 2: 原理轮**
- 讲一下Fiber架构
- 为什么需要Fiber
- React的Diff算法是怎样的

**Round 3: 优化轮**
- 你做过哪些React性能优化
- useMemo和useCallback有什么区别
- 如何优化长列表

**Round 4: React18轮**
- React18有哪些新特性
- useTransition的使用场景是什么
- Suspense的原理是什么

**Round 5: 对比轮**
- Vue和React的更新机制有什么区别
- 为什么Vue不需要Fiber
- Vue和React哪个性能更好

---

### 5.6 面试答题技巧

1. **结构化回答（总分总）**：
   - 一句话概括
   - 分点详细说明
   - 总结或对比

2. **示例法**：
   - 原理 + 代码示例
   - 问题 + 解决方案

3. **对比法**：
   - React vs Vue
   - React 17 vs React 18
   - 旧方案 vs 新方案

4. **深度优先**：
   - 先讲清楚核心原理
   - 等面试官追问再深入细节

5. **诚实**：
   - 不懂就说不懂
   - 不要瞎编

---

### 5.7 推荐学习资源

- [React 18官方文档](https://react.dev/blog/2022/03/29/react-v18)
- [React Conf 2021 - 并发特性演讲](https://www.youtube.com/watch?v=FZ0cG47msEk)
- [useTransition详解](https://react.dev/reference/react/useTransition)
- [Suspense详解](https://react.dev/reference/react/Suspense)

---

## 6. 学习资源清单

### 6.1 必读资源（按优先级排序）

#### 🔥 核心资源（必看）

1. **React技术揭秘 - 卡颂**
   - 网址：https://react.iamkasong.com/
   - 内容：React源码解析，从Fiber到Hooks，讲解最清晰
   - 推荐指数：⭐⭐⭐⭐⭐
   - 适用阶段：Week 1-4全程

2. **图解React原理系列**
   - 网址：https://7kms.github.io/react-illustration-series/
   - 内容：可视化图解React原理，配合上面的文章效果更好
   - 推荐指数：⭐⭐⭐⭐⭐
   - 适用阶段：Week 2 Fiber架构

3. **React官方文档**
   - 网址：https://react.dev/
   - 内容：官方文档，最权威，新版文档质量很高
   - 推荐指数：⭐⭐⭐⭐⭐
   - 适用阶段：全程查阅

4. **React源码（GitHub）**
   - 网址：https://github.com/facebook/react
   - 内容：React源码，建议克隆到本地，配合AI阅读
   - 推荐指数：⭐⭐⭐⭐
   - 适用阶段：Week 2-3，重点读packages/react-reconciler

---

#### ⚡ 补充资源（选看）

5. **《React进阶实践指南》- 我不是外星人**
   - 内容：你正在看的书，选择性阅读
   - 推荐指数：⭐⭐⭐
   - 注意：基于React16/17，部分内容过时，重点看Hooks和性能优化章节

6. **React Conf演讲视频**
   - 网址：https://www.youtube.com/c/ReactConf
   - 内容：React官方会议，了解新特性
   - 推荐指数：⭐⭐⭐⭐
   - 适用阶段：Week 4 React18新特性

7. **React设计原理 - 卡颂（书籍）**
   - 内容：卡颂的新书，更系统化
   - 推荐指数：⭐⭐⭐⭐
   - 适用阶段：面试后深化理解

---

### 6.2 技术博客推荐

**国内优质博客**：
- [卡颂的博客](https://github.com/kasong)：React源码解析
- [神三元的博客](https://github.com/sanyuan0704/frontend_daily_question)：前端面试题
- [冴羽的博客](https://github.com/mqyqingfeng/Blog)：JavaScript深入系列

**英文博客**：
- [Dan Abramov博客](https://overreacted.io/)：React核心开发者的博客
- [Kent C. Dodds博客](https://kentcdodds.com/blog)：React最佳实践
- [React官方博客](https://react.dev/blog)：新特性发布

---

### 6.3 视频教程推荐（如果你喜欢看视频）

⚡ **注意**：视频教程效率较低，只推荐在理解困难时辅助学习

1. **B站搜索**："React源码"、"Fiber原理"、"React18新特性"
2. **YouTube**：搜索"React Fiber architecture"、"React Concurrent Mode"

---

### 6.4 实战项目推荐（面试后练手）

1. **ahooks源码**
   - 网址：https://github.com/alibaba/hooks
   - 学习：如何封装自定义Hooks

2. **React Router源码**
   - 网址：https://github.com/remix-run/react-router
   - 学习：如何实现路由库

3. **Zustand源码**
   - 网址：https://github.com/pmndrs/zustand
   - 学习：如何实现轻量级状态管理

---

### 6.5 源码阅读路径

**推荐阅读顺序**（不要全读，重点读核心流程）：

#### Week 1: Hooks原理
```
packages/react-reconciler/src/
├── ReactFiberHooks.js          // Hooks实现（重点）
├── ReactFiberWorkLoop.js       // 渲染流程
└── ReactFiberClassComponent.js // setState实现
```

#### Week 2: Fiber架构
```
packages/react-reconciler/src/
├── ReactFiber.js               // Fiber节点创建（重点）
├── ReactChildFiber.js          // Diff算法（重点）
├── ReactFiberBeginWork.js      // beginWork（重点）
├── ReactFiberCompleteWork.js   // completeWork
└── ReactFiberCommitWork.js     // Commit阶段
```

#### Week 3: 调度器
```
packages/scheduler/src/
├── Scheduler.js                // 调度器核心（重点）
└── SchedulerMinHeap.js         // 最小堆实现
```

#### Week 4: React18新特性
```
packages/react-reconciler/src/
├── ReactFiberLane.js           // Lane模型
└── ReactFiberSuspenseComponent.js // Suspense实现
```

**阅读技巧**：
1. 不要从头到尾读，只读核心函数
2. 遇到不懂的函数，用AI解释
3. 画流程图帮助理解
4. 对比Vue源码加深印象

---

### 6.6 AI辅助学习技巧

**高效使用AI的方法**：

1. **源码解释**：
   ```
   "解释这段React源码的作用：[粘贴代码]"
   "这个函数在Fiber更新流程中的作用是什么？"
   ```

2. **概念理解**：
   ```
   "用简单的话解释React的双缓存机制"
   "Fiber的链表结构是如何实现可中断的？"
   ```

3. **对比学习**：
   ```
   "对比Vue和React的Diff算法"
   "Vue的computed和React的useMemo有什么区别？"
   ```

4. **模拟面试**：
   ```
   "你是一个React面试官，问我5个关于Fiber的问题，并追问我的答案"
   "评价我的回答，指出不足"
   ```

5. **代码调试**：
   ```
   "为什么这个useEffect会无限循环？[粘贴代码]"
   "如何优化这个组件的性能？[粘贴代码]"
   ```

---

### 6.7 学习工具推荐

1. **VS Code插件**：
   - React DevTools：调试React应用
   - ES7+ React/Redux/React-Native snippets：代码片段

2. **Chrome插件**：
   - React Developer Tools：查看组件树、Profiler性能分析
   - Redux DevTools：状态管理调试（如果用Redux）

3. **在线工具**：
   - [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
   - [CodeSandbox](https://codesandbox.io/)：在线编码
   - [StackBlitz](https://stackblitz.com/)：在线React项目

4. **笔记工具**：
   - Notion / Obsidian：做知识管理
   - Excalidraw：画流程图
   - 语雀：整理面试题

---

### 6.8 学习资源使用时间分配

**每日2小时分配建议**：

| 时间段 | 内容 | 资源 |
|--------|------|------|
| 0-40分钟 | 阅读技术文章/文档 | React技术揭秘、图解React |
| 40-70分钟 | 阅读源码（AI辅助） | React源码 + ChatGPT/Claude |
| 70-100分钟 | 做笔记总结 | Notion/Markdown |
| 100-120分钟 | 回答面试题 | 模拟面试 |

**周末4小时分配建议**：

| 时间段 | 内容 | 资源 |
|--------|------|------|
| 0-120分钟 | 深度阅读源码 | React源码 + AI |
| 120-180分钟 | 实践练习 | 写Demo验证理解 |
| 180-210分钟 | 本周总结 | 整理笔记 |
| 210-240分钟 | 模拟面试 | AI模拟面试 |

---

## 7. 附录：面试速查表

> 这是必背知识点的速查表，建议打印或保存到手机，面试前快速复习

---

### 7.1 核心原理一句话总结

#### 渲染流程
🔥 **React渲染分为Render阶段（可中断，构建Fiber树）和Commit阶段（不可中断，同步到DOM）。**

#### Fiber架构
🔥 **Fiber是虚拟DOM+链表结构+工作单元，通过可中断、可恢复、优先级调度解决React15递归更新无法中断的问题。**

#### Fiber数据结构
🔥 **Fiber节点通过return、child、sibling三个指针构成链表，支持循环遍历，可随时中断和恢复。**

#### 双缓存
🔥 **React同时维护current树（屏幕显示）和workInProgress树（内存构建），更新完成后直接切换指针，避免中间状态。**

#### Diff算法
🔥 **单节点Diff比较key和type；多节点Diff分三轮：处理更新、处理新增删除、处理移动（Map查找）。**

#### 调度机制
🔥 **Scheduler通过时间切片（5ms）和优先级调度（Lane模型）实现可中断更新，使用MessageChannel模拟requestIdleCallback。**

#### Hooks原理
🔥 **Hooks在Fiber节点的memoizedState上维护链表，通过调用顺序确定Hook节点，这是为什么不能在条件语句中使用。**

#### useState
🔥 **useState在Hook链表中存储state值和更新队列，setState触发调度，更新时对比新旧state决定是否渲染。**

#### useEffect
🔥 **useEffect在Hook链表中存储effect和依赖数组，Commit阶段对比依赖决定是否执行，Layout阶段后异步执行。**

#### React.memo
🔥 **React.memo浅比较props，相同则跳过render，在beginWork阶段对比新旧props实现。**

#### useMemo
🔥 **useMemo缓存计算结果，对比依赖数组决定是否重新计算，避免重复计算和不必要的子组件渲染。**

#### useCallback
🔥 **useCallback缓存函数引用，等价于useMemo(() => fn, deps)，配合React.memo避免子组件重新渲染。**

#### 并发模式
🔥 **React18默认并发渲染，允许同时准备多个版本UI，高优先级更新可打断低优先级更新，保持UI响应性。**

#### useTransition
🔥 **useTransition标记低优先级更新，返回isPending和startTransition，用于输入响应、标签切换等场景。**

#### Suspense
🔥 **Suspense捕获组件抛出的Promise，显示fallback，Promise resolved后重新渲染，用于代码分割和数据获取。**

---

### 7.2 Vue vs React 快速对比表

| 对比项 | Vue | React |
|--------|-----|-------|
| **更新机制** | 响应式，依赖收集自动触发 | 主动setState触发 |
| **更新粒度** | 组件级别，精确追踪 | 从触发点向下遍历子树 |
| **Fiber架构** | 不需要（响应式+编译优化） | 需要（解决大范围更新卡顿） |
| **Diff算法** | 双端Diff（Vue2）、最长递增子序列（Vue3） | 单向遍历+Map查找 |
| **性能优化** | 自动优化（响应式） | 手动优化（memo、useMemo） |
| **计算属性** | computed自动追踪依赖 | useMemo手动维护依赖数组 |
| **组件缓存** | 默认智能更新 | 需要手动memo |
| **时间切片** | 无 | 有（5ms切片） |
| **优先级调度** | 无（简单调度） | 有（Lane模型） |
| **虚拟列表** | 实现思路相同 | 实现思路相同 |
| **代码分割** | defineAsyncComponent | React.lazy + Suspense |
| **学习曲线** | 较平缓 | 较陡峭 |

---

### 7.3 高频面试题标准答案

#### Q1: 为什么需要Fiber？

**标准答案**（3句话）：
1. React15使用递归更新，无法中断，组件树大时超过16ms导致卡顿
2. Fiber通过链表结构+循环遍历实现可中断、可恢复的更新
3. 配合时间切片和优先级调度，保证UI响应性和流畅度

**追问：为什么Vue不需要Fiber？**
- Vue的响应式粒度更细，精确到组件，不需要遍历整棵树
- Vue的编译优化（静态标记、Block Tree）减少了diff范围
- React选择Fiber解决大范围更新，Vue选择响应式避免大范围更新

---

#### Q2: Hooks为什么不能在条件语句中使用？

**标准答案**（3句话）：
1. Hooks基于链表实现，React通过调用顺序确定Hook对应链表中的节点
2. 条件语句会导致调用顺序变化，Hook节点对应错乱
3. 导致状态混乱或报错

**代码示例**：
```jsx
// ❌ 错误
if (condition) {
  useState(0); // 条件变化导致链表顺序变化
}

// ✅ 正确
const [state, setState] = useState(0); // 始终调用
if (condition) {
  // 使用state
}
```

---

#### Q3: React的Diff算法是怎样的？

**标准答案**（分单节点和多节点）：

**单节点**：
1. 比较key，相同进入下一步，不同删除旧节点
2. 比较type，相同复用节点，不同删除旧节点
3. 无可复用节点，创建新节点

**多节点（三轮遍历）**：
1. 第一轮：从头遍历，处理更新（key和type都相同），不同跳出
2. 第二轮：新节点完了删除剩余旧节点，旧节点完了新增剩余新节点
3. 第三轮：剩余旧节点存入Map，遍历剩余新节点从Map查找可复用节点，标记移动或新增

**追问：为什么不用双端Diff？**
- Fiber是链表结构，没有反向指针，从尾部遍历困难
- React优先保证时间切片的可中断性，而非最小移动次数

---

#### Q4: useMemo和useCallback有什么区别？

**标准答案**：
1. useMemo缓存计算结果，useCallback缓存函数引用
2. useCallback(fn, deps) === useMemo(() => fn, deps)
3. useMemo用于避免重复计算，useCallback用于避免子组件重新渲染（配合memo）

**使用场景**：
```jsx
// useMemo：缓存计算结果
const filteredList = useMemo(() => {
  return list.filter(item => item.type === filter);
}, [list, filter]);

// useCallback：缓存函数引用
const handleClick = useCallback(() => {
  console.log(name);
}, [name]);
```

---

#### Q5: React18有哪些新特性？

**标准答案**（列举5个核心）：
1. **并发模式**：默认启用，允许同时准备多个版本UI
2. **自动批处理**：所有更新自动批处理（包括Promise、setTimeout）
3. **useTransition**：标记低优先级更新，保持UI响应性
4. **useDeferredValue**：延迟值更新，类似useTransition但更简单
5. **Suspense增强**：支持数据获取、Streaming SSR

**追问：并发模式有什么意义？**
- 保持UI响应性，即使在大量计算时用户交互也不会卡顿
- 高优先级任务（输入）可打断低优先级任务（数据请求）
- 更流畅的用户体验

---

#### Q6: 如何优化React性能？

**标准答案**（列举6个手段）：
1. **React.memo**：避免不必要的组件重新渲染
2. **useMemo**：缓存计算结果，避免重复计算
3. **useCallback**：缓存函数引用，配合memo优化
4. **React.lazy + Suspense**：代码分割，按需加载
5. **虚拟列表**：长列表只渲染可见区域
6. **状态下沉**：减少状态影响范围

**场景示例**：
- 父组件频繁更新，子组件不需要更新 → React.memo
- 列表渲染，传递回调函数 → useCallback
- 复杂计算 → useMemo
- 长列表 → 虚拟列表
- 首屏加载慢 → 代码分割

---

#### Q7: 如何避免Hooks的闭包陷阱？

**标准答案**：
1. **完整的依赖数组**：确保所有使用的变量都在依赖数组中
2. **函数式更新**：setState使用函数形式，避免依赖state
3. **useRef**：存储可变值，不受闭包影响

**示例**：
```jsx
// ❌ 闭包陷阱
const [count, setCount] = useState(0);
const handleClick = useCallback(() => {
  console.log(count); // 永远是0
}, []); // 依赖数组为空

// ✅ 解决方案1：完整依赖数组
const handleClick = useCallback(() => {
  console.log(count);
}, [count]);

// ✅ 解决方案2：函数式更新
const handleClick = useCallback(() => {
  setCount(c => c + 1); // 不依赖count
}, []);

// ✅ 解决方案3：useRef
const countRef = useRef(count);
useEffect(() => {
  countRef.current = count;
}, [count]);
```

---

### 7.4 面试前最后检查清单

**前一天晚上**：
- [ ] 复习本速查表，确保能背出核心答案
- [ ] 复习自己的笔记，特别是标注🔥的部分
- [ ] 准备3-5个你做过的React项目，能讲清楚技术难点
- [ ] 准备好对比Vue的话术，展现技术深度
- [ ] 早点睡，保证精神状态

**面试当天**：
- [ ] 提前30分钟到达或登录
- [ ] 再快速浏览一遍速查表
- [ ] 准备好纸笔（可能需要画图）
- [ ] 保持自信，不会的诚实说不会
- [ ] 多用"我的理解是..."、"从原理上讲..."这种话术

**面试中**：
- [ ] 先概括，后详细（总分总结构）
- [ ] 适当举例，增加说服力
- [ ] 主动对比Vue，展现技术广度
- [ ] 听清问题再回答，不要抢答
- [ ] 不确定的地方说"我的理解是..."，留有余地

---

### 7.5 常见追问的应对策略

**追问1：你刚才说XXX，能具体讲讲吗？**
→ 准备好每个知识点的详细版本，参考本文档的详解部分

**追问2：你在项目中遇到过XXX问题吗？怎么解决的？**
→ 提前准备3-5个实际场景，最好是性能优化相关

**追问3：Vue和React的XXX有什么区别？**
→ 参考7.2对比表，准备好每个对比点的详细说明

**追问4：如果我这样做会怎样？**
→ 如果不确定，诚实说"我没试过，但我觉得可能会XXX，因为..."

**追问5：你还有什么想问我的吗？**
→ 准备好问题：
  - 团队技术栈是什么？
  - 项目中最大的技术挑战是什么？
  - 团队如何做技术分享和成长？

---

### 7.6 面试后复盘

**当天晚上**：
- [ ] 记录所有被问到的问题
- [ ] 记录没答好的问题，查资料补充
- [ ] 记录面试官的追问点，下次重点准备
- [ ] 总结本次面试的优点和不足

**持续改进**：
- 面试是双向选择，不要因为一次失败就气馁
- 每次面试都是学习机会，记录问题比拿offer更重要
- 多面几家，找到最适合自己的公司

---

## 结语

这份学习计划是为你量身定制的1个月冲刺方案。记住：

1. **不要追求完美**：1个月时间有限，面试够用即可
2. **重点突出**：Fiber架构 > 性能优化 > React18新特性
3. **对比学习**：充分利用你的Vue经验，对比加深理解
4. **输出倒逼输入**：每天做笔记和回答面试题，比只看不练强100倍
5. **保持信心**：你有Vue源码经验，理解React原理不会太难

**最后的建议**：
- 学习过程中遇到不懂的，随时用AI辅助理解
- 每周末的模拟面试很重要，不要跳过
- 面试前一天再复习一遍本速查表
- 面试时保持自信，讲清楚原理比背书更重要

祝你面试成功！💪

---

> 文档版本：v1.0
> 创建时间：2026-01-25
> 目标：1个月冲刺大厂高级前端React面试
> 作者：Claude Code (基于你的背景定制)


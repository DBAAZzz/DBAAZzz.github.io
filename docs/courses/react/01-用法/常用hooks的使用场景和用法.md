---
title: 常用hooks的使用场景和用法
author: DBAAZzz
date: 2024/04/15 17：37
categories:
  - react 学习
tags:
  - hooks
---

# 常用 hooks 的使用场景和用法

## useState

### 作用

useState 的作用是保证函数式组件在重复渲染时保留这个 state。函数式组件重新渲染都是独立的闭包，函数式组件里的函数都是独立的，取到的值不会受后面操作的影响。

```ts
function Counter2() {
  let [number, setNumber] = useState(0);

  function alertNumber() {
    setTimeout(() => {
      // alert 只能获取到点击按钮时的那个状态
      alert(number);
    }, 3000);
  }

  return (
    <>
      <p>{number}</p>
      <button onClick={() => setNumber(number + 1)}>+</button>
      <button onClick={alertNumber}>alertNumber</button>
    </>
  );
}
```

### 基本用法

```ts
const [state, dispatch] = useState(initData);
```

- state，目的提供给 UI ，作为渲染视图的数据源。
- dispatch 改变 state 的函数，可以理解为推动函数组件渲染的渲染函数
- initData 有两种情况，第一种情况是非函数，将作为 state 初始化的值。 第二种情况是函数，函数的返回值作为 useState 初始化的值。

对于 dispatch 的参数，有两种情况：

- 第一种非函数情况，此时将作为新的值，赋予给 state，作为下一次渲染使用;

- 第二种是函数的情况，如果 dispatch 的参数为一个函数，这里可以称它为 reducer，reducer 参数，是上一次返回最新的 state，返回值作为新的 state。

### 注意事项

-在使用 useState 的 dispatchAction 更新 state 的时候，记得不要传入相同的 state，这样会使视图不更新。useState 的 dispatchAction 方法会默认比较两次 state 是否相同，然后决定是否更新组件。

```ts
export default function Index() {
  const [state, dispatchState] = useState({ name: 'xiaoming' });
  const handleClick = () => {
    // 点击按钮，视图没有更新
    state.name = 'xiaohong';
    dispatchState(state);
  };
  return (
    <div>
      <span> {state.name}</span>
      <button onClick={handleClick}>changeName++</button>
    </div>
  );
}
```

### 如何监听 state 的变化

在函数式组件中只能通过 useEffect 来执行 state 变化引起的副作用。

## useEffect

### 基本用法

```ts
useEffect(() => {
  return destory;
}, dep);
```

- 第一个参数 callback，返回的 destory 函数， destory 作为下一次 callback 执行之前调用，用于清除上一次 callback 产生的副作用。如清除定时器
- 第二个参数作为依赖项，是一个数组，可以有多个依赖项，依赖项改变，**执行上一次 callback 返回的 destory**，和执行新的 effect 第一个参数 callback

useEffect 是采用**异步调用** ，对于每一个 effect 的 callback， React 会向 setTimeout 回调函数一样，放入任务队列，等到主线程任务完成，DOM 更新、js 执行完成、视图绘制完毕才执行。所以 effect 回调函数不会阻塞浏览器绘制视图。

### 常用用法

```ts
// 依赖项是一个空数组，只执行一次
// 告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行
useEffect(() => {
  const users = new User();
}, []);

// dep1 或者 dep2 任意一个发生变化都会执行
useEffect(() => {
  const users = new User();
}, [dep1, dep2]);
```

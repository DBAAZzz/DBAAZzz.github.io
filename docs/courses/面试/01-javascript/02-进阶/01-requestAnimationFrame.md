---
title: requestAnimationFrame
author: DBAAZzz
date: 2025/06/05 18:00
categories:
  - 面试
tags:
  - requestAnimationFrame
---

`requestAnimationFrame` 是浏览器提供的一个用于优化动画性能的 `API`，它会在浏览器下次重绘之前调用指定的回调函数。

## 基本概念

**语法**：

```javascript
requestAnimationFrame(callback);
```

**作用**：让动画与浏览器的刷新频率同步，通常是 `60FPS`（每秒 60 帧）。

## 与传统方法的对比

**传统方法（setTimeout/setInterval）**：

```javascript
// 问题：固定时间间隔，不考虑浏览器刷新
setInterval(() => {
  // 动画代码
}, 16); // 约60FPS
```

**requestAnimationFrame 方法**：

```javascript
function animate() {
  // 动画代码
  requestAnimationFrame(animate); // 递归调用
}
animate();
```

## 主要优势

1. **性能优化**：

   - 与浏览器刷新率同步，避免不必要的渲染
   - 页面不可见时自动暂停，节省 CPU

2. **流畅性**：

   - 避免丢帧和卡顿
   - 适应不同设备的刷新率

3. **电池友好**：
   - 在后台标签页时停止执行
   - 减少移动设备耗电

## 实际应用示例

```javascript
let position = 0;
const element = document.getElementById("box");

function moveBox() {
  position += 2;
  element.style.left = position + "px";

  if (position < 500) {
    requestAnimationFrame(moveBox);
  }
}

requestAnimationFrame(moveBox);
```

## 高级用法

**获取时间戳**：

```javascript
function animate(timestamp) {
  console.log("当前时间:", timestamp);
  // timestamp是DOMHighResTimeStamp，从页面加载开始计算
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

**取消动画**：

```javascript
const animationId = requestAnimationFrame(animate);
cancelAnimationFrame(animationId); // 取消动画
```

## Canvas 动画中的应用

```javascript
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function draw() {
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制动画内容
  ctx.fillRect(x, y, 50, 50);

  // 更新位置
  x += 2;

  // 继续动画
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
```

## 浏览器兼容性

现代浏览器都支持，对于老版本可以用 polyfill：

```javascript
window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function (callback) {
    setTimeout(callback, 1000 / 60);
  };
```

requestAnimationFrame 是现代 web 动画的标准做法，它让动画更流畅、更节能、性能更好。

# requestAnimationFrame 面试题集

## 基础概念题

### 1. requestAnimationFrame 的基本作用是什么？与 setTimeout 相比有什么优势？

**参考答案：**

- **作用**：在浏览器下次重绘之前执行动画，与浏览器刷新率同步
- **优势**：
  - 与显示器刷新频率同步，通常 60FPS，避免丢帧
  - 页面不可见时自动暂停，节省 CPU 和电池
  - 浏览器可以优化并行的动画任务
  - 避免 setTimeout 的时间不准确问题

### 2. requestAnimationFrame 的回调函数接收什么参数？这个参数有什么用？

**参考答案：**

- 接收一个**DOMHighResTimeStamp**参数，表示回调函数被触发的时间
- 时间戳从页面加载开始计算，精度可达微秒级
- **用途**：
  - 计算帧间时间差，实现基于时间的动画
  - 控制动画速度，确保不同帧率设备上动画速度一致
  - 性能监控，计算 FPS

```javascript
let lastTime = 0;
function animate(currentTime) {
  const deltaTime = currentTime - lastTime;
  console.log(`帧间隔: ${deltaTime}ms`);
  lastTime = currentTime;
  requestAnimationFrame(animate);
}
```

## 实践应用题

### 3. 请写一个函数，使用 requestAnimationFrame 实现一个可以控制速度的匀速运动动画

**参考答案：**

```javascript
function createSmoothAnimation(element, targetX, duration, callback) {
  const startX = parseFloat(element.style.left) || 0;
  const distance = targetX - startX;
  let startTime = null;

  function animate(currentTime) {
    if (!startTime) startTime = currentTime;

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const currentX = startX + distance * progress;
    element.style.left = currentX + "px";

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else if (callback) {
      callback();
    }
  }

  requestAnimationFrame(animate);
}
```

### 4. 如何正确地取消一个 requestAnimationFrame 动画？

**参考答案：**

```javascript
let animationId;

function startAnimation() {
  function animate() {
    // 动画逻辑
    animationId = requestAnimationFrame(animate);
  }
  animationId = requestAnimationFrame(animate);
}

function stopAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}
```

## 性能优化题

### 5. 在使用 requestAnimationFrame 时，如何避免不必要的重绘和性能问题？

**参考答案：**

- **批量 DOM 操作**：在一次重绘中完成所有 DOM 修改
- **避免强制同步布局**：读取布局属性时要小心
- **使用 transform 替代改变 layout 属性**
- **适时停止动画**：不要让无用动画持续运行

```javascript
// ❌ 错误做法 - 频繁触发layout
function badAnimate() {
  element.style.left = element.offsetLeft + 1 + "px"; // 读写混合
  requestAnimationFrame(badAnimate);
}

// ✅ 正确做法
let position = 0;
function goodAnimate() {
  position += 1;
  element.style.transform = `translateX(${position}px)`;

  if (position < 500) {
    requestAnimationFrame(goodAnimate);
  }
}
```

### 6. 如何使用 requestAnimationFrame 实现一个 FPS 监控器？

**参考答案：**

```javascript
class FPSMonitor {
  constructor() {
    this.fps = 0;
    this.lastTime = 0;
    this.frameCount = 0;
    this.lastFpsUpdate = 0;
  }

  start() {
    const measure = (currentTime) => {
      this.frameCount++;

      if (currentTime - this.lastFpsUpdate >= 1000) {
        this.fps = Math.round(
          (this.frameCount * 1000) / (currentTime - this.lastFpsUpdate)
        );
        this.frameCount = 0;
        this.lastFpsUpdate = currentTime;
        console.log(`FPS: ${this.fps}`);
      }

      requestAnimationFrame(measure);
    };
    requestAnimationFrame(measure);
  }
}
```

## 复杂场景题

### 7. 在 React 或 Vue 等框架中使用 requestAnimationFrame 时需要注意什么？

**参考答案：**

- **生命周期管理**：组件卸载时要取消动画
- **避免闭包陷阱**：状态更新可能不会反映到动画回调中
- **性能考虑**：避免在每次渲染时创建新的动画

```javascript
// React Hook示例
function useAnimation(callback, deps) {
  const callbackRef = useRef(callback);
  const animationId = useRef();

  useEffect(() => {
    callbackRef.current = callback;
  });

  const start = useCallback(() => {
    const animate = () => {
      callbackRef.current();
      animationId.current = requestAnimationFrame(animate);
    };
    animationId.current = requestAnimationFrame(animate);
  }, []);

  const stop = useCallback(() => {
    if (animationId.current) {
      cancelAnimationFrame(animationId.current);
    }
  }, []);

  useEffect(() => {
    return () => stop(); // 清理
  }, [stop]);

  return { start, stop };
}
```

### 8. 请实现一个支持暂停、恢复、速度控制的动画管理器

**参考答案：**

```javascript
class AnimationManager {
  constructor() {
    this.animations = [];
    this.isRunning = false;
    this.lastTime = 0;
    this.speed = 1;
  }

  add(animation) {
    this.animations.push({
      ...animation,
      elapsed: 0,
      paused: false,
    });
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.tick();
  }

  pause() {
    this.isRunning = false;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  tick() {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) * this.speed;
    this.lastTime = currentTime;

    this.animations = this.animations.filter((animation) => {
      if (animation.paused) return true;

      animation.elapsed += deltaTime;
      const progress = Math.min(animation.elapsed / animation.duration, 1);

      animation.update(progress);

      if (progress >= 1) {
        animation.onComplete?.();
        return false; // 移除完成的动画
      }
      return true;
    });

    if (this.animations.length > 0) {
      requestAnimationFrame(() => this.tick());
    } else {
      this.isRunning = false;
    }
  }
}
```

## 浏览器兼容性题

### 9. 如何处理 requestAnimationFrame 的浏览器兼容性问题？

**参考答案：**

```javascript
// Polyfill实现
(function () {
  let lastTime = 0;
  const vendors = ["webkit", "moz"];

  for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    window.cancelAnimationFrame =
      window[vendors[x] + "CancelAnimationFrame"] ||
      window[vendors[x] + "CancelRequestAnimationFrame"];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) {
      const currTime = new Date().getTime();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = setTimeout(() => {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }
})();
```

## 综合应用题

### 10. 使用 requestAnimationFrame 实现一个性能友好的无限滚动列表

**参考答案：**

```javascript
class VirtualScrollList {
  constructor(container, itemHeight, items) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.items = items;
    this.scrollTop = 0;
    this.visibleStart = 0;
    this.visibleEnd = 0;
    this.animationId = null;

    this.init();
  }

  init() {
    this.container.addEventListener("scroll", this.onScroll.bind(this));
    this.render();
  }

  onScroll() {
    if (this.animationId) return;

    this.animationId = requestAnimationFrame(() => {
      this.scrollTop = this.container.scrollTop;
      this.updateVisibleRange();
      this.render();
      this.animationId = null;
    });
  }

  updateVisibleRange() {
    const containerHeight = this.container.clientHeight;
    this.visibleStart = Math.floor(this.scrollTop / this.itemHeight);
    this.visibleEnd = Math.min(
      this.visibleStart + Math.ceil(containerHeight / this.itemHeight) + 1,
      this.items.length
    );
  }

  render() {
    // 只渲染可见区域的元素
    const fragment = document.createDocumentFragment();

    for (let i = this.visibleStart; i < this.visibleEnd; i++) {
      const item = document.createElement("div");
      item.style.height = this.itemHeight + "px";
      item.style.position = "absolute";
      item.style.top = i * this.itemHeight + "px";
      item.textContent = this.items[i];
      fragment.appendChild(item);
    }

    this.container.innerHTML = "";
    this.container.appendChild(fragment);
  }
}
```

---
title: requestAnimationFrame和animtion的对比
author: DBAAZzz
date: 2025/06/05 18:00
categories:
  - 面试
tags:
  - requestAnimationFrame
---

CSS `Animation` 和 `requestAnimationFrame` 在实现动画时有很大差异，各有优劣势：

## 性能对比

### CSS Animation（更优）

**优势**：

- **硬件加速**：浏览器可以将动画交给 `GPU` 处理，避免占用主线程
- **浏览器优化**：浏览器内部高度优化，减少重绘和重排
- **独立线程**：动画在合成器线程执行，不受 `JavaScript` 阻塞影响
- **自动优化**：浏览器自动处理帧率匹配和性能调节

**性能表现**：

```css
/* 高性能 - 触发合成层 */
.element {
  transform: translateX(0);
  transition: transform 1s ease;
}
.element:hover {
  transform: translateX(100px);
}
```

### requestAnimationFrame

**劣势**：

- **主线程执行**：在 JavaScript 主线程运行，可能被其他任务阻塞
- **手动优化**：需要开发者手动处理性能优化
- **CPU 密集**：复杂计算会影响整体性能

## 适用场景对比

### CSS Animation 适合：

```css
/* 简单的状态变化 */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.slide {
  animation: slideIn 0.3s ease-out;
}
```

**适用情况**：

- 简单的 UI 动画（淡入淡出、滑动、旋转）
- 状态切换动画
- 循环动画
- 响应用户交互的简单动画

### requestAnimationFrame 适合：

```javascript
// 复杂的游戏动画
function gameLoop(timestamp) {
  // 复杂的物理计算
  updatePlayerPosition();
  checkCollisions();
  updateParticles();
  render();

  requestAnimationFrame(gameLoop);
}
```

**适用情况**：

- 复杂的交互动画
- 游戏开发
- 数据可视化
- 需要精确控制的动画
- 基于用户输入的实时动画

## 详细差异对比

| 特性         | CSS Animation    | requestAnimationFrame |
| ------------ | ---------------- | --------------------- |
| **性能**     | 更好（GPU 加速） | 较差（CPU 计算）      |
| **流畅度**   | 更流畅           | 取决于代码质量        |
| **控制精度** | 有限             | 精确控制              |
| **复杂度**   | 简单             | 复杂                  |
| **调试难度** | 困难             | 容易                  |
| **兼容性**   | 需要前缀         | 需要 polyfill         |

## 性能测试示例

**CSS 方式**：

```css
.box {
  width: 50px;
  height: 50px;
  background: red;
  /* 触发硬件加速 */
  will-change: transform;
}

.move {
  animation: moveRight 2s linear infinite;
}

@keyframes moveRight {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(300px);
  }
}
```

**JavaScript 方式**：

```javascript
let position = 0;
const box = document.querySelector(".box");

function animate() {
  position += 2;
  // 使用transform而不是left来优化性能
  box.style.transform = `translateX(${position}px)`;

  if (position < 300) {
    requestAnimationFrame(animate);
  }
}
```

## 性能优化建议

### CSS Animation 优化：

```css
.optimized {
  /* 明确告诉浏览器要变化的属性 */
  will-change: transform, opacity;

  /* 创建新的合成层 */
  transform: translateZ(0);
  /* 或者 */
  backface-visibility: hidden;
}
```

### requestAnimationFrame 优化：

```javascript
// 批量处理DOM操作
const elements = document.querySelectorAll(".animate");
let positions = new Array(elements.length).fill(0);

function batchAnimate() {
  // 批量计算
  for (let i = 0; i < positions.length; i++) {
    positions[i] += 2;
  }

  // 批量应用
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.transform = `translateX(${positions[i]}px)`;
  }

  requestAnimationFrame(batchAnimate);
}
```

## 混合使用策略

最佳实践是根据场景选择：

```javascript
// 用CSS处理简单动画
function showModal() {
  modal.classList.add("fade-in");
}

// 用RAF处理复杂逻辑
function complexAnimation() {
  requestAnimationFrame(function animate(timestamp) {
    // 复杂计算
    const progress = calculateComplexProgress(timestamp);

    // 最终还是通过CSS属性应用
    element.style.transform = `translateX(${progress}px)`;

    if (!isComplete) {
      requestAnimationFrame(animate);
    }
  });
}
```

## 总结

**性能排序**：

1. **CSS Animation** - 最优（硬件加速）
2. **CSS Transition** - 次优（简单状态变化）
3. **requestAnimationFrame + transform** - 良好
4. **requestAnimationFrame + layout 属性** - 较差
5. **setTimeout/setInterval** - 最差

**选择建议**：

- 🎯 **优先使用 CSS Animation**用于简单、重复的 UI 动画
- 🔧 **使用 requestAnimationFrame**处理复杂逻辑和交互
- 🚀 **混合使用**：RAF 计算 + CSS 属性应用，获得最佳效果

简单来说：**CSS Animation 性能更好，requestAnimationFrame 控制更精确**。

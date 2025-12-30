---
title: setup 函数揭秘
author: DBAAZzz
date: 2024/12/11 00：56
categories:
  - vue3
tags:
  - setup
---

# setup 函数揭秘

## 概述

Vue 3 引入的 `Composition API` 是一个全新的组件逻辑组织方式，而 `setup` 函数是 Composition API 的核心入口点。它为开发者提供了一种更灵活、更易于维护的代码组织方式。

### 为什么需要 setup 函数？

在 Vue 2 的 Options API 中，我们通过 `data`、`methods`、`computed`、`watch` 等选项来组织代码。这种方式在小型组件中运作良好，但在大型组件中会导致：

1. **逻辑分散**：同一个功能的代码被分散在不同的选项中
2. **代码复用困难**：mixins 存在命名冲突、来源不清等问题
3. **类型推导不友好**：TypeScript 支持不够完善

`setup` 函数解决了这些问题，它允许我们：

- ✅ 将相关逻辑组织在一起
- ✅ 更好的代码复用（通过组合式函数）
- ✅ 更好的 TypeScript 类型推导
- ✅ 更小的生产包体积（更好的 tree-shaking）

### setup 函数的基本使用

```vue
<script>
import { ref, computed } from "vue";

export default {
  setup(props, context) {
    // 响应式状态
    const count = ref(0);

    // 计算属性
    const doubleCount = computed(() => count.value * 2);

    // 方法
    const increment = () => {
      count.value++;
    };

    // 暴露给模板
    return {
      count,
      doubleCount,
      increment,
    };
  },
};
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

### setup 语法糖（推荐）

Vue 3.2+ 引入了 `<script setup>` 语法糖，使代码更简洁：

```vue
<script setup>
import { ref, computed } from "vue";

// 自动暴露给模板，无需 return
const count = ref(0);
const doubleCount = computed(() => count.value * 2);
const increment = () => {
  count.value++;
};
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

接下来我们将深入分析 `setup` 函数的实现原理。

## setup 函数在组件生命周期中的定位

在使用 `setup` 函数的作用域里不能使用 `this` 来获取 `Vue` 实例，也就是无法和 Vue2 一样通过 `this.number`、`this.getInfo()` 来获取实例上的数据或执行实例上的方法。

下面将分析 `setup` 函数的执行时机和位置：

`setup` 函数的具体执行顺序为：

```
mount -> render -> patch -> processComponent
-> mountComponent -> setupComponent -> setupStatefulComponent
```

`setupStatefulComponent` 源码如下：

```ts
function setupStatefulComponent(
  instance: ComponentInternalInstance,
  isSSR: boolean
) {
  const Component = instance.type;

  // 1. create public instance / render proxy
  // 创建 ctx 的 proxy 代理，用于this的取值
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);

  const { setup } = Component;
  if (setup) {
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      ErrorCodes.SETUP_FUNCTION,
      [__DEV__ ? shallowReadonly(instance.props) : instance.props, setupContext]
    );
  }
}
```

`callWithErrorHandling` 源码为：

```ts
export function callWithErrorHandling(
  fn: Function,
  instance: ComponentInternalInstance | null | undefined,
  type: ErrorTypes,
  args?: unknown[]
): any {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
```

由上面的源码我们能看出 `callWithErrorHandling` 方法执行了 `setup` 函数，具体代码为`args ? fn(...args) : fn()`。

在调用 `setup` 时 `this` 并没有被显式绑定，在严格模式下（JavaScript ES6 默认严格模式或 setup 运行环境是模块化代码），未绑定 `this` 的函数会使 `this` 变为 `undefined`。

**因此，setup 内部访问 this 并不会指向组件实例。**

## setup 函数为什么能通过 getCurrentInstance 访问当前实例

`instance` 实例初始化会在 `setup` 函数执行前，所以在 `setup` 函数里能访问到 `instance`。

`getCurrentInstance` 方法的源码实现：

```ts
export const getCurrentInstance: () => ComponentInternalInstance | null = () =>
  currentInstance || currentRenderingInstance;
```

`getCurrentInstance` 返回当前模块的 `currentInstance` 或 `currentRenderingInstance` 变量，初始值为 `undefined`。

`currentInstance` 是什么时候被赋值的呢？答案是在 `setupStatefulComponent` 函数。

`setupStatefulComponent` 源码：

```ts
function setupStatefulComponent(
  instance: ComponentInternalInstance,
  isSSR: boolean
) {
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    // 将当前实例赋值给 currentInstance
    // 必须要在调用 setup 之前，否则通过在 setup函数里调用 getCurrentInstance 方法会获取不到当前实例
    const reset = setCurrentInstance(instance);
    // 执行 setup 函数并获取 setup 的返回值
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      ErrorCodes.SETUP_FUNCTION,
      [__DEV__ ? shallowReadonly(instance.props) : instance.props, setupContext]
    );
    resetTracking();
    // 取消赋值
    reset();

    // 处理 setup 函数的返回值，实现自动浅层解包
    handleSetupResult(instance, setupResult, isSSR);
  }
}
```

`setCurrentInstance` 函数源码：

```ts
export const setCurrentInstance = (instance: ComponentInternalInstance) => {
  const prev = currentInstance;
  currentInstance = instance;
  instance.scope.on();
  return (): void => {
    currentInstance = pre;
  };
};
```

`setup` 函数被执行时将当前实例赋值给 `currentInstance`，执行成功后又将 `currentInstance` 重置回 `currentInstance` 上次的值（null）。

所以这导致了 `setup` 函数里的异步操作中用 `getCurrentInstance()` 方法是获取不到当前实例的。

解决办法是 `setup` 方法被执行时将当前 `getCurrentInstance()` 的值保存下来。

```vue
<script setup lang="ts">
import { getCurrentInstance } from "vue";

const instance = getCurrentInstance();

function clickEvent() {
  console.log("当前实例：", instance);
}
</script>
```

### 实践建议

#### ❌ 错误用法

```ts
<script setup>
import { getCurrentInstance } from 'vue'

// 错误：异步操作中无法获取实例
setTimeout(() => {
  const instance = getCurrentInstance() // null
  console.log(instance)
}, 1000)

// 错误：在异步回调中使用
fetch('/api/data').then(() => {
  const instance = getCurrentInstance() // null
})
</script>
```

#### ✅ 正确用法

```ts
<script setup>
import { getCurrentInstance, onMounted } from 'vue'

// 正确：在 setup 顶层保存实例
const instance = getCurrentInstance()

// 正确：在异步操作中使用保存的实例
setTimeout(() => {
  console.log('当前实例：', instance) // 可以访问
}, 1000)

// 正确：在生命周期钩子中使用
onMounted(() => {
  console.log('当前实例：', instance) // 可以访问
})
</script>
```

### 实际应用场景

```ts
<script setup>
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()

// 场景1：访问全局属性
const globalProperties = instance?.appContext.config.globalProperties
console.log(globalProperties?.$axios)

// 场景2：获取父组件实例
const parent = instance?.parent

// 场景3：调试时查看组件信息
if (import.meta.env.DEV) {
  console.log('组件名称：', instance?.type.name)
  console.log('组件 props：', instance?.props)
}
</script>
```

### ⚠️ 注意事项

1. **不推荐在生产环境中过度使用**：`getCurrentInstance` 主要用于高级场景和库开发
2. **优先使用组合式 API**：大多数情况下应该使用 `props`、`emit`、`provide/inject` 等标准 API
3. **类型安全**：使用时要注意 null 检查，因为在某些情况下可能返回 null

## setup 函数是如何实现自动浅层解包

以下是官方描述：

---

在模板中访问从 `setup` 返回的 **ref** 时，它会**自动浅层解包**，因此你无须再在模板中为它写 `.value`。当通过 `this` 访问时也会同样如此解包。

`setup()` 自身并不含对组件实例的访问权，即在 `setup()` 中访问 `this` 会是 `undefined`。你可以在选项式 API 中访问组合式 API 暴露的值，但反过来则不行。

`setup()` 应该同步地返回一个对象。唯一可以使用 `async setup()` 的情况是，该组件是 `Suspense` 组件的后裔。

```ts
<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    // 返回值会暴露给模板和其他的选项式 API 钩子
    return {
      count
    }
  },

  mounted() {
    console.log(this.count) // 0
  }
}
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

---

那么 `setup` 函数是如何实现 ref 解包的？我们截取 vue 源码来看看是如何实现的。

通过上文我们知道 `setup` 函数会被 `callWithErrorHandling` 函数执行并得到 setup 的返回值 `setupResult`。

而 `setupResult` 会被 `handleSetupResult(instance, setupResult, isSSR)` 进行处理。

`handleSetupResult` 源码定义为：

```ts
// 挂载组件时处理 setup 的返回值
export function handleSetupResult(
  instance: ComponentInternalInstance,
  setupResult: unknown
): void {
  // proxyRefs 的作用就是把 setupResult 对象做一层代理
  // 方便用户直接访问 ref 类型的值
  instance.setupState = proxyRefs(setupResult);
}

export function proxyRefs<T extends object>(
  objectWithRefs: T
): ShallowUnwrapRef<T> {
  // 如果是 reactive 就不做处理
  return isReactive(objectWithRefs)
    ? objectWithRefs
    : new Proxy(objectWithRefs, shallowUnwrapHandlers); // proxy 代理
}

const shallowUnwrapHandlers: ProxyHandler<any> = {
  get: (target, key, receiver) =>
    key === ReactiveFlags.RAW
      ? target
      : unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  },
};
```

````
{{ ... }}
通过上面的源码我们能清楚的知道自动解包的原理是用了 `proxy` 进行了代理，当我们访问 setup 函数的返回对象时，通过 get 函数统一拦截，直接访问到 `unref` 解包后的结果。

而在 set 函数中有 `oldValue.value = value` 和 `Reflect.set(target, key, value, receiver)` 两种处理的区分在于 Reflect.set 会丢失响应式。举例说明：

```ts
const state = reactive({ count: ref(0) })

// 错误赋值
state.count = 10
````

如果不特殊处理，这只是替换了 count 这个 ref，导致原来的响应式丢失

### 自动解包的实际应用

#### 示例 1：模板中的自动解包

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);
const message = ref("Hello");
</script>

<template>
  <!-- 自动解包，无需 .value -->
  <div>{{ count }}</div>
  <div>{{ message }}</div>

  <!-- 在 JavaScript 表达式中也会自动解包 -->
  <div>{{ count + 1 }}</div>
  <div>{{ message.toUpperCase() }}</div>
</template>
```

#### 示例 2：reactive 中的 ref 解包

```ts
import { ref, reactive } from "vue";

const count = ref(0);
const state = reactive({
  count,
  nested: {
    count: ref(10), // 嵌套的 ref 不会自动解包
  },
});

// 顶层 ref 会自动解包
console.log(state.count); // 0（自动解包）
state.count = 1; // 正确：会更新 ref

// 嵌套的 ref 不会自动解包
console.log(state.nested.count); // Ref 对象（不会解包）
console.log(state.nested.count.value); // 10（需要手动 .value）
```

#### 示例 3：数组和集合中的 ref

```ts
import { ref, reactive } from "vue";

const count = ref(0);

// 数组中的 ref 不会自动解包
const arr = reactive([count]);
console.log(arr[0]); // Ref 对象（不会解包）
console.log(arr[0].value); // 0

// Map 中的 ref 不会自动解包
const map = reactive(new Map([["count", count]]));
console.log(map.get("count")); // Ref 对象（不会解包）
console.log(map.get("count").value); // 0
```

### 解包规则总结

| 场景                     | 是否自动解包 | 示例                       |
| ------------------------ | ------------ | -------------------------- |
| 模板中访问               | ✅ 是         | `{{ count }}`              |
| reactive 对象的顶层属性  | ✅ 是         | `state.count`              |
| reactive 对象的嵌套属性  | ❌ 否         | `state.nested.count.value` |
| 数组元素                 | ❌ 否         | `arr[0].value`             |
| Map/Set 中的值           | ❌ 否         | `map.get('key').value`     |
| setup 返回对象的顶层属性 | ✅ 是         | `this.count`               |

### 最佳实践

```ts
<script setup>
import { ref, reactive } from 'vue'

// ✅ 推荐：简单值使用 ref
const count = ref(0)
const message = ref('Hello')

// ✅ 推荐：复杂对象使用 reactive
const user = reactive({
  name: 'John',
  age: 30
})

// ❌ 不推荐：在 reactive 中嵌套 ref
const state = reactive({
  count: ref(0), // 会自动解包，但容易混淆
  nested: {
    count: ref(10) // 不会自动解包，容易出错
  }
})

// ✅ 推荐：保持一致性
const state2 = reactive({
  count: 0, // 直接使用普通值
  nested: {
    count: 10
  }
})
</script>
```

## 为什么在 vue2 options 中能通过 this.[ref 定义的变量]访问到 setup 函数定义的变量

`setupStatefulComponent` 函数最后会执行 `finishComponentSetup` 函数

`finishComponentSetup` 源码：

```ts
export function finishComponentSetup(
  instance: ComponentInternalInstance,
  isSSR: boolean,
  skipOptions?: boolean
) {
  //...忽略代码

  // support for 2.x options
  if (__FEATURE_OPTIONS_API__ && !(__COMPAT__ && skipOptions)) {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
}
```

`applyOptions` 源码：

```ts
export function applyOptions(instance: ComponentInternalInstance): void {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy! as any;
  const ctx = instance.ctx;

  // call beforeCreate first before accessing other options since
  // the hook may mutate resolved options (#2791)
  if (options.beforeCreate) {
    callHook(options.beforeCreate, instance, LifecycleHooks.BEFORE_CREATE);
  }

  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters,
  } = options;

  if (methods) {
    for (const key in methods) {
      const methodHandler = (methods as MethodOptions)[key];
      if (isFunction(methodHandler)) {
        ctx[key] = methodHandler.bind(publicThis);
      }
    }
  }

  if (dataOptions) {
    instance.data = reactive(data);
  }
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = (computedOptions as ComputedOptions)[key];
      const get = isFunction(opt)
        ? opt.bind(publicThis, publicThis)
        : isFunction(opt.get)
        ? opt.get.bind(publicThis, publicThis)
        : NOOP;

      const set =
        !isFunction(opt) && isFunction(opt.set)
          ? opt.set.bind(publicThis)
          : NOOP;
      const c = computed({
        get,
        set,
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => (c.value = v),
      });
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions)
      ? provideOptions.call(publicThis)
      : provideOptions;
  }

  // 对optionsAPI的生命周期做处理，主要是执行生命周期函数时通过bind方法将publicThis传入
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
}
```

`applyOptions` 函数的作用是兼容 vue2 的 options 写法，通过 bind 方法将 `methods` 和 **生命周期函数** 的 `this` 显式绑定为 `publicThis`（即 `instance.proxy`），从而允许它们访问组件实例上下文（`instance.ctx`）上的属性

## 暴露公共属性是如何实现的

官网描述：

`expose` 函数用于显式地限制该组件暴露出的属性，当父组件通过**模板引用**访问该组件的实例时，将仅能访问 `expose` 函数暴露出的内容：

```ts
export default {
  setup(props, { expose }) {
    // 让组件实例处于 “关闭状态”
    // 即不向父组件暴露任何东西
    expose();

    const publicCount = ref(0);
    const privateCount = ref(0);
    // 有选择地暴露局部状态
    expose({ count: publicCount });
  },
};
```

源码实现为：

挂载渲染一个组件时会调用 `createSetupContext` 方法，将传入的 `exposed` 属性添加到 `instance.exposed` 。

```ts
export function createSetupContext(
  instance: ComponentInternalInstance
): SetupContext {
  const expose: SetupContext["expose"] = (exposed) => {
    instance.exposed = exposed || {};
  };

  return {
    attrs: new Proxy(instance.attrs, attrsProxyHandlers),
    slots: instance.slots,
    emit: instance.emit,
    expose,
  };
}
```

`vue` 获取组件时实例时是通过 `getComponentPublicInstance` 方法，该方法只返回 `instance` 上的 `exposed` 属性

`getComponentPublicInstance` 方法会在以下场景下被调用：

- `renderTemplateRefs` 文件的 `setRef` 方法中被调用
- 执行 `mount` 函数时调用并将结果值返回

`getComponentPublicInstance`源码如下：

```ts
export function getComponentPublicInstance(
  instance: ComponentInternalInstance
): ComponentPublicInstance | ComponentInternalInstance["exposed"] | null {
  if (instance.exposed) {
    return (
      // 缓存
      instance.exposeProxy ||
      (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
        get(target, key: string) {
          if (key in target) {
            return target[key];
          } else if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance);
          }
        },
        has(target, key: string) {
          return key in target || key in publicPropertiesMap;
        },
      }))
    );
  } else {
    return instance.proxy;
  }
}
```

```ts
export function setRef(
  rawRef: VNodeNormalizedRef,
  oldRawRef: VNodeNormalizedRef | null,
  parentSuspense: SuspenseBoundary | null,
  vnode: VNode,
  isUnmount = false
): void {
  // 如果是组件就获取 getComponentPublicInstance 的值，否则就获取 el 实例
  const refValue =
    vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT
      ? getComponentPublicInstance(vnode.component!)
      : vnode.el;
  const value = isUnmount ? null : refValue;
  // i 是当前组件实例，r 是传入组件的ref值
  const { i: owner, r: ref } = rawRef;
  // ... 省略一些过程

  const _isRef = isRef(ref);
  const doSet = () => {
    if (_isRef) {
      // 就将 getComponentPublicInstance 方法获取到的值传入组件的 ref 上
      ref.value = value;
    }
  };

  if (value) {
    (doSet as SchedulerJob).id = -1;
    queuePostRenderEffect(doSet, parentSuspense);
  } else {
    doSet();
  }
}
```

我们能清楚的看到 **setRef 函数会将 `getComponentPublicInstance` 的返回值赋值给组件的 ref 属性**。

需要注意的是，**更新操作是在 `queuePostRenderEffect` 方法里执行的，这是因为调用 `setRef` 函数时组件的 `instance` 以及各个属性都还没有更新或初始化，需要等组件完成渲染后才执行赋值操作，确保赋值给组件 `ref` 的值是正确的**

`setRef` 函数的执行时机是：当页面 render 时会进行 patch 操作，在 patch 函数里对比新旧节点的差异进而更新，同时也会执行上面的 `setRef` 函数。源码如下：

```ts
const patch: (
  n1: VNode | null, // null means this is a mount
  n2: VNode,
  container: RendererElement,
  anchor?: RendererNode | null,
  parentComponent?: ComponentInternalInstance | null,
  parentSuspense?: SuspenseBoundary | null,
  namespace?: ElementNamespace,
  slotScopeIds?: string[] | null,
  optimized?: boolean
) => void = (
  n1,
  n2,
  container,
  anchor = null,
  parentComponent = null,
  parentSuspense = null,
  namespace = undefined,
  slotScopeIds = null,
  optimized = __DEV__ && isHmrUpdating ? false : !!n2.dynamicChildren
) => {
  const { type, ref, shapeFlag } = n2;

  // set ref
  if (ref != null && parentComponent) {
    setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
  }
};
```

而从下面源码中能看出 vnode 的 ref 属性的值来源于 props 上的 ref 变量。

```ts
function createVNode() {
  return createBaseVNode(...)
}

function createBaseVNode(
  type: VNodeTypes | ClassComponent | typeof NULL_DYNAMIC_COMPONENT,
  props: (Data & VNodeProps) | null = null,
  children: unknown = null,
  patchFlag = 0,
  dynamicProps: string[] | null = null,
  shapeFlag: number = type === Fragment ? 0 : ShapeFlags.ELEMENT,
  isBlockNode = false,
  needFullChildrenNormalization = false
): VNode {
  const vnode = {
    // ...
    ref: props && normalizeRef(props),
    // ...
  };
}
```

**总结：赋值给组件 ref 的值是 getComponentPublicInstance 的返回值，而 getComponentPublicInstance 的返回值获取的是 setup 函数里执行的 exposed 函数的结果。**
## setup 函数的参数详解

### props 参数

`setup` 函数的第一个参数是 `props`，它是响应式的，当传入新的 props 时，它会被更新。

```vue
<script>
import { watch, toRefs } from "vue";

export default {
  props: {
    title: String,
    count: Number,
  },
  setup(props) {
    // ✅ 可以直接访问 props
    console.log(props.title);

    // ✅ 可以监听 props 的变化
    watch(
      () => props.count,
      (newVal, oldVal) => {
        console.log(`count changed from ${oldVal} to ${newVal}`);
      }
    );

    // ❌ 不要解构 props，会失去响应性
    // const { title } = props // 错误！

    // ✅ 使用 toRefs 解构并保持响应性
    const { title, count } = toRefs(props);

    return { title, count };
  },
};
</script>
```

### context 参数

`setup` 函数的第二个参数是 `context`，它是一个普通的 JavaScript 对象，暴露了其他可能在 `setup` 中有用的值：

```vue
<script>
export default {
  setup(props, context) {
    // attrs（非响应式对象，等同于 $attrs）
    console.log(context.attrs);

    // slots（非响应式对象，等同于 $slots）
    console.log(context.slots);

    // emit（方法，等同于 $emit）
    context.emit("custom-event", payload);

    // expose（方法，用于暴露公共属性）
    context.expose({
      publicMethod() {
        console.log("This is a public method");
      },
    });
  },
};
</script>
```

#### context 解构示例

```vue
<script>
export default {
  setup(props, { attrs, slots, emit, expose }) {
    // 可以安全地解构 context
    // 因为 attrs 和 slots 是有状态的对象，它们总是会随组件本身的更新而更新

    const handleClick = () => {
      emit("click", { message: "Button clicked" });
    };

    expose({
      handleClick,
    });

    return { handleClick };
  },
};
</script>
```

## setup 函数的实际应用场景

### 场景 1：组合式函数（Composables）

组合式函数是 Vue 3 中代码复用的主要方式：

```ts
// composables/useCounter.ts
import { ref, computed } from "vue";

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  const doubleCount = computed(() => count.value * 2);

  const increment = () => {
    count.value++;
  };

  const decrement = () => {
    count.value--;
  };

  const reset = () => {
    count.value = initialValue;
  };

  return {
    count,
    doubleCount,
    increment,
    decrement,
    reset,
  };
}
```

使用组合式函数：

```vue
<script setup>
import { useCounter } from "@/composables/useCounter";

const { count, doubleCount, increment, decrement, reset } = useCounter(10);
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="reset">Reset</button>
  </div>
</template>
```

### 场景 2：异步数据获取

```vue
<script setup>
import { ref, onMounted } from "vue";

const users = ref([]);
const loading = ref(false);
const error = ref(null);

const fetchUsers = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch("https://api.example.com/users");
    users.value = await response.json();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <ul v-else>
      <li v-for="user in users" :key="user.id">
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>
```

### 场景 3：表单处理

```vue
<script setup>
import { reactive, computed } from "vue";

const form = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const errors = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const isValid = computed(() => {
  return (
    form.username.length >= 3 &&
    form.email.includes("@") &&
    form.password.length >= 6 &&
    form.password === form.confirmPassword
  );
});

const validateUsername = () => {
  errors.username =
    form.username.length < 3 ? "Username must be at least 3 characters" : "";
};

const validateEmail = () => {
  errors.email = !form.email.includes("@") ? "Invalid email address" : "";
};

const validatePassword = () => {
  errors.password =
    form.password.length < 6 ? "Password must be at least 6 characters" : "";
};

const validateConfirmPassword = () => {
  errors.confirmPassword =
    form.password !== form.confirmPassword ? "Passwords do not match" : "";
};

const handleSubmit = () => {
  if (isValid.value) {
    console.log("Form submitted:", form);
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <input
        v-model="form.username"
        @blur="validateUsername"
        placeholder="Username"
      />
      <span v-if="errors.username" class="error">{{ errors.username }}</span>
    </div>

    <div>
      <input
        v-model="form.email"
        @blur="validateEmail"
        placeholder="Email"
        type="email"
      />
      <span v-if="errors.email" class="error">{{ errors.email }}</span>
    </div>

    <div>
      <input
        v-model="form.password"
        @blur="validatePassword"
        placeholder="Password"
        type="password"
      />
      <span v-if="errors.password" class="error">{{ errors.password }}</span>
    </div>

    <div>
      <input
        v-model="form.confirmPassword"
        @blur="validateConfirmPassword"
        placeholder="Confirm Password"
        type="password"
      />
      <span v-if="errors.confirmPassword" class="error">{{
        errors.confirmPassword
      }}</span>
    </div>

    <button type="submit" :disabled="!isValid">Submit</button>
  </form>
</template>
```

### 场景 4：生命周期钩子

```vue
<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from "vue";

const count = ref(0);

onBeforeMount(() => {
  console.log("Component is about to be mounted");
});

onMounted(() => {
  console.log("Component has been mounted");
  // 适合进行 DOM 操作、发起网络请求等
});

onBeforeUpdate(() => {
  console.log("Component is about to update");
});

onUpdated(() => {
  console.log("Component has been updated");
});

onBeforeUnmount(() => {
  console.log("Component is about to be unmounted");
  // 清理工作：移除事件监听器、取消定时器等
});

onUnmounted(() => {
  console.log("Component has been unmounted");
});
</script>
```

## setup 函数的最佳实践

### 1. 逻辑组织

将相关的逻辑组织在一起，而不是按照选项类型分散：

```vue
<script setup>
import { ref, computed, watch } from "vue";

// ===== 用户相关逻辑 =====
const user = ref(null);
const isLoggedIn = computed(() => user.value !== null);

const login = async (credentials) => {
  // 登录逻辑
};

const logout = () => {
  user.value = null;
};

watch(user, (newUser) => {
  console.log("User changed:", newUser);
});

// ===== 主题相关逻辑 =====
const theme = ref("light");
const isDark = computed(() => theme.value === "dark");

const toggleTheme = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
};

watch(theme, (newTheme) => {
  document.body.className = newTheme;
});
</script>
```

### 2. 提取可复用逻辑

将可复用的逻辑提取为组合式函数：

```ts
// composables/useFetch.ts
import { ref } from "vue";

export function useFetch(url) {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(false);

  const fetchData = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(url);
      data.value = await response.json();
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  return { data, error, loading, fetchData };
}
```

```vue
<script setup>
import { onMounted } from "vue";
import { useFetch } from "@/composables/useFetch";

const { data: users, error, loading, fetchData } = useFetch("/api/users");

onMounted(() => {
  fetchData();
});
</script>
```

### 3. TypeScript 支持

充分利用 TypeScript 的类型推导：

```vue
<script setup lang="ts">
import { ref, computed } from "vue";

interface User {
  id: number;
  name: string;
  email: string;
}

const users = ref<User[]>([]);
const currentUser = ref<User | null>(null);

const userNames = computed(() => users.value.map((u) => u.name));

const addUser = (user: User) => {
  users.value.push(user);
};
</script>
```

### 4. 避免常见陷阱

```vue
<script setup>
import { ref, reactive, toRefs } from "vue";

// ❌ 错误：解构会失去响应性
const props = defineProps({
  user: Object,
});
// const { user } = props // 失去响应性

// ✅ 正确：使用 toRefs
const { user } = toRefs(props);

// ❌ 错误：直接修改 props
// props.user = newUser

// ✅ 正确：通过 emit 通知父组件
const emit = defineEmits(["update:user"]);
const updateUser = (newUser) => {
  emit("update:user", newUser);
};

// ❌ 错误：reactive 对象被整体替换会失去响应性
const state = reactive({ count: 0 });
// state = { count: 1 } // 失去响应性

// ✅ 正确：修改属性而不是替换对象
state.count = 1;
</script>
```

## setup 与 Options API 的对比

### Options API

```vue
<script>
export default {
  data() {
    return {
      count: 0,
      message: "Hello",
    };
  },
  computed: {
    doubleCount() {
      return this.count * 2;
    },
  },
  methods: {
    increment() {
      this.count++;
    },
  },
  mounted() {
    console.log("Component mounted");
  },
};
</script>
```

### Composition API (setup)

```vue
<script setup>
import { ref, computed, onMounted } from "vue";

const count = ref(0);
const message = ref("Hello");

const doubleCount = computed(() => count.value * 2);

const increment = () => {
  count.value++;
};

onMounted(() => {
  console.log("Component mounted");
});
</script>
```

### 对比总结

| 特性            | Options API    | Composition API (setup) |
| --------------- | -------------- | ----------------------- |
| 代码组织        | 按选项类型分组 | 按逻辑功能分组          |
| 代码复用        | Mixins         | 组合式函数              |
| TypeScript 支持 | 较弱           | 强大                    |
| 学习曲线        | 较平缓         | 稍陡峭                  |
| 适用场景        | 简单组件       | 复杂组件、逻辑复用      |
| Tree-shaking    | 较差           | 优秀                    |

## 总结

### 核心要点

1. **setup 函数是 Composition API 的入口**，在组件创建之前执行，此时 `this` 为 `undefined`
2. **自动解包机制**通过 Proxy 实现，让我们在模板中可以直接访问 ref 而无需 `.value`
3. **getCurrentInstance** 只能在 setup 同步代码中调用，异步操作中需要提前保存实例引用
4. **expose 函数**用于控制组件向外暴露的属性，增强组件封装性
5. **与 Options API 兼容**，可以在 Options API 中通过 `this` 访问 setup 返回的属性

### 何时使用 setup

- ✅ 构建大型、复杂的应用
- ✅ 需要更好的 TypeScript 支持
- ✅ 需要复用逻辑（通过组合式函数）
- ✅ 需要更好的代码组织和可维护性
- ✅ 追求更小的打包体积

### 学习路径建议

1. 掌握基本的 ref、reactive、computed 等响应式 API
2. 理解生命周期钩子在 setup 中的使用
3. 学习编写和使用组合式函数
4. 深入理解响应式原理和自动解包机制
5. 在实际项目中实践，积累经验

### 参考资源

- [Vue 3 官方文档 - Composition API](https://cn.vuejs.org/guide/extras/composition-api-faq.html)
- [Vue 3 源码](https://github.com/vuejs/core)
- [组合式函数示例](https://vueuse.org/)

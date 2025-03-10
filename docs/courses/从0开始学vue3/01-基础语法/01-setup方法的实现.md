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

我们知道 vue3 的 Composition API 系列里，推出了一个全新的 setup 函数。接下来我们将对 setup 函数做分析。

## setup 函数在组件生命周期中的定位

在使用 `setup` 函数的作用域里不能使用 `this` 来获取 Vue 实例，也就是无法和 Vue2 一样通过 `this.number`、`this.getInfo()` 来获取实例上的数据或执行实例上的方法。

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
  const Component = instance.type

  // 1. create public instance / render proxy
  // 创建 ctx 的 proxy 代理，用于this的取值
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers)

  const { setup } = Component
  if (setup) {
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      ErrorCodes.SETUP_FUNCTION,
      [__DEV__ ? shallowReadonly(instance.props) : instance.props, setupContext]
    )
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
    return args ? fn(...args) : fn()
  } catch (err) {
    handleError(err, instance, type)
  }
}
```

由上面的源码我们能看出 `callWithErrorHandling` 方法执行了 `setup` 函数，具体代码为`args ? fn(...args) : fn()`。

在调用 `setup` 时 `this` 并没有被显式绑定，在严格模式下（JavaScript ES6 默认严格模式或 setup 运行环境是模块化代码），未绑定 `this` 的函数会使 `this` 变为 `undefined。`

**因此，setup 内部访问 this 并不会指向组件实例。**

## setup 函数为什么能通过 getCurrentInstance 访问当前实例

instance 实例初始化会在 setup 函数执行前，所以在 setup 函数里能访问到 instance。

`getCurrentInstance` 方法的源码实现：

```ts
export const getCurrentInstance: () => ComponentInternalInstance | null = () =>
  currentInstance || currentRenderingInstance
```

`getCurrentInstance` 返回当前模块的 `currentInstance` 或 `currentRenderingInstance` 变量，初始值为 undefined。

`currentInstance` 是什么时候被赋值的呢？答案是在 `setupStatefulComponent` 函数。

`setupStatefulComponent` 源码：

```ts
function setupStatefulComponent(
  instance: ComponentInternalInstance,
  isSSR: boolean
) {
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers)
  const { setup } = Component
  if (setup) {
    // 将当前实例赋值给 currentInstance
    // 必须要在调用 setup 之前，否则通过在 setup函数里调用 getCurrentInstance 方法会获取不到当前实例
    const reset = setCurrentInstance(instance)
    // 执行 setup 函数并获取 setup 的返回值
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      ErrorCodes.SETUP_FUNCTION,
      [__DEV__ ? shallowReadonly(instance.props) : instance.props, setupContext]
    )
    resetTracking()
    // 取消赋值
    reset()

    // 处理 setup 函数的返回值，实现自动浅层解包
    handleSetupResult(instance, setupResult, isSSR)
  }
}
```

`setCurrentInstance` 函数源码：

```ts
export const setCurrentInstance = (instance: ComponentInternalInstance) => {
  const prev = currentInstance
  currentInstance = instance
  instance.scope.on()
  return (): void => {
    currentInstance = pre
  }
}
```

`setup` 函数被执行时将当前实例赋值给 `currentInstance`，执行成功后又将 `currentInstance` 重置回 currentInstance 上次的值（null）。

所以这导致了 `setup` 函数里的异步操作中用 `getCurrentInstance()` 方法是获取不到当前实例的。

解决办法是 `setup` 方法被执行时将当前 `getCurrentInstance()` 的值保存下来。

```ts
<script setup lang='ts'>
  import {getCurrentInstance} from 'vue' const instance = getCurrentInstance()
  function clickEvent() {console.log('当前实例：', instance)}
</script>
```

## setup 函数是如何实现自动浅层解包

以下是官方描述：

---

在模板中访问从 `setup` 返回的 **ref** 时，它会**自动浅层解包**，因此你无须再在模板中为它写 `.value`。当通过 `this` 访问时也会同样如此解包。

`setup()` 自身并不含对组件实例的访问权，即在 `setup()` 中访问 this 会是 undefined。你可以在选项式 API 中访问组合式 API 暴露的值，但反过来则不行。

`setup()` 应该同步地返回一个对象。唯一可以使用 async setup() 的情况是，该组件是 Suspense 组件的后裔。

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
  instance.setupState = proxyRefs(setupResult)
}

export function proxyRefs<T extends object>(
  objectWithRefs: T
): ShallowUnwrapRef<T> {
  // 如果是 reactive 就不做处理
  return isReactive(objectWithRefs)
    ? objectWithRefs
    : new Proxy(objectWithRefs, shallowUnwrapHandlers) // proxy 代理
}

const shallowUnwrapHandlers: ProxyHandler<any> = {
  get: (target, key, receiver) =>
    key === ReactiveFlags.RAW
      ? target
      : unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key]
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value
      return true
    } else {
      return Reflect.set(target, key, value, receiver)
    }
  },
}
```

通过上面的源码我们能清楚的知道自动解包的原理是用了 `proxy` 进行了代理，当我们访问 setup 函数的返回对象时，通过 get 函数统一拦截，直接访问到 `unref` 解包后的结果。

而在 set 函数中有 `oldValue.value = value` 和 `Reflect.set(target, key, value, receiver)` 两种处理的区分在于 Reflect.set 会丢失响应式。举例说明：

```ts
const state = reactive({ count: ref(0) })

// 错误赋值
state.count = 10
```

如果不特殊处理，这只是替换了 count 这个 ref，导致原来的响应式丢失

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
    const reset = setCurrentInstance(instance)
    pauseTracking()
    try {
      applyOptions(instance)
    } finally {
      resetTracking()
      reset()
    }
  }
}
```

`applyOptions` 源码：

```ts
export function applyOptions(instance: ComponentInternalInstance): void {
  const options = resolveMergedOptions(instance)
  const publicThis = instance.proxy! as any
  const ctx = instance.ctx

  // call beforeCreate first before accessing other options since
  // the hook may mutate resolved options (#2791)
  if (options.beforeCreate) {
    callHook(options.beforeCreate, instance, LifecycleHooks.BEFORE_CREATE)
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
  } = options

  if (methods) {
    for (const key in methods) {
      const methodHandler = (methods as MethodOptions)[key]
      if (isFunction(methodHandler)) {
        ctx[key] = methodHandler.bind(publicThis)
      }
    }
  }

  if (dataOptions) {
    instance.data = reactive(data)
  }
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = (computedOptions as ComputedOptions)[key]
      const get = isFunction(opt)
        ? opt.bind(publicThis, publicThis)
        : isFunction(opt.get)
        ? opt.get.bind(publicThis, publicThis)
        : NOOP

      const set =
        !isFunction(opt) && isFunction(opt.set)
          ? opt.set.bind(publicThis)
          : NOOP
      const c = computed({
        get,
        set,
      })
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => (c.value = v),
      })
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions)
      ? provideOptions.call(publicThis)
      : provideOptions
  }

  // 对optionsAPI的生命周期做处理，主要是执行生命周期函数时通过bind方法将publicThis传入
  registerLifecycleHook(onBeforeMount, beforeMount)
  registerLifecycleHook(onMounted, mounted)
  registerLifecycleHook(onBeforeUpdate, beforeUpdate)
  registerLifecycleHook(onUpdated, updated)
  registerLifecycleHook(onActivated, activated)
  registerLifecycleHook(onDeactivated, deactivated)
  registerLifecycleHook(onErrorCaptured, errorCaptured)
  registerLifecycleHook(onRenderTracked, renderTracked)
  registerLifecycleHook(onRenderTriggered, renderTriggered)
  registerLifecycleHook(onBeforeUnmount, beforeUnmount)
  registerLifecycleHook(onUnmounted, unmounted)
  registerLifecycleHook(onServerPrefetch, serverPrefetch)
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
    expose()

    const publicCount = ref(0)
    const privateCount = ref(0)
    // 有选择地暴露局部状态
    expose({ count: publicCount })
  },
}
```

源码实现为：

挂载渲染一个组件时会调用 `createSetupContext` 方法，将传入的 `exposed` 属性添加到 `instance.exposed` 。

```ts
export function createSetupContext(
  instance: ComponentInternalInstance
): SetupContext {
  const expose: SetupContext['expose'] = (exposed) => {
    instance.exposed = exposed || {}
  }

  return {
    attrs: new Proxy(instance.attrs, attrsProxyHandlers),
    slots: instance.slots,
    emit: instance.emit,
    expose,
  }
}
```

vue 获取组件时实例时是通过 `getComponentPublicInstance` 方法，该方法只返回 `instance` 上的 `exposed` 属性

`getComponentPublicInstance` 方法会在 `renderTemplateRefs` 文件的 `setRef` 方法中被调用，源码如下：

```ts
export function getComponentPublicInstance(
  instance: ComponentInternalInstance
): ComponentPublicInstance | ComponentInternalInstance['exposed'] | null {
  if (instance.exposed) {
    return (
      // 缓存
      instance.exposeProxy ||
      (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
        get(target, key: string) {
          if (key in target) {
            return target[key]
          } else if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance)
          }
        },
        has(target, key: string) {
          return key in target || key in publicPropertiesMap
        },
      }))
    )
  } else {
    return instance.proxy
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
      : vnode.el
  const value = isUnmount ? null : refValue
  // i 是当前组件实例，r 是传入组件的ref值
  const { i: owner, r: ref } = rawRef
  // ... 省略一些过程

  const _isRef = isRef(ref)
  const doSet = () => {
    if (_isRef) {
      // 就将 getComponentPublicInstance 方法获取到的值传入组件的 ref 上
      ref.value = value
    }
  }

  if (value) {
    ;(doSet as SchedulerJob).id = -1
    queuePostRenderEffect(doSet, parentSuspense)
  } else {
    doSet()
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
  const { type, ref, shapeFlag } = n2

  // set ref
  if (ref != null && parentComponent) {
    setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2)
  }
}
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

---
title: reactivity原理
author: DBAAZzz
date: 2024/12/19 15:48
categories:
  - vue3
tags:
  - reactivity
---

## reacitve 的实现原理

先看 reactive 方法的实现逻辑，reactive 方法接收一个对象参数，返回一个代理对象。

```ts
// 用于存储已经代理过的对象，可以对应上一节的 reactiveMap 结构
export const reactiveMap: WeakMap<Target, any> = new WeakMap<Target, any>()

export function reactive(target: object) {
  // 如果试图观察一个只读代理，返回只读版本。
  if (isReadonly(target)) {
    return target
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  )
}
```

reactive 方法中调用了 createReactiveObject 方法，看下 createReactiveObject 方法具体的实现逻辑：

```ts
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>
) {
  // 不能代理非对象
  if (!isObject(target)) {
    return target
  }

  // 已经代理过的对象不需要在进行二次代理
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  // 为1表示 Array，Object 类型用 baseHandlers 处理
  // 为2表示 map、set、weakMap、weakSet 用 collectionHandlers 处理
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  )
  proxyMap.set(target, proxy)
  return proxy
}
```

先只看 `baseHandlers` 的实现逻辑，`baseHandlers` 是 `MutableReactiveHandler` 类的实例，它继承了 `BaseReactiveHandler` `类，BaseReactiveHandler` 类实现了 `ProxyHandler` 接口。

`BaseReactiveHandler` 源码：

```ts
class BaseReactiveHandler implements ProxyHandler<Target> {
  constructor(
    protected readonly _isReadonly = false,
    protected readonly _isShallow = false
  ) {}

  get(target: Target, key: string | symbol, receiver: object): any {
    if (key === ReactiveFlags.SKIP) return target[ReactiveFlags.SKIP]

    const isReadonly = this._isReadonly,
      isShallow = this._isShallow
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (key === ReactiveFlags.IS_SHALLOW) {
      return isShallow
    } else if (key === ReactiveFlags.RAW) {
      if (
        receiver ===
          (isReadonly
            ? isShallow
              ? shallowReadonlyMap
              : readonlyMap
            : isShallow
            ? shallowReactiveMap
            : reactiveMap
          ).get(target) ||
        // receiver 不是响应式代理，但具有相同的原型
        // 这意味着 receiver 是响应式代理的用户代理
        Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)
      ) {
        return target
      }
      // early return undefined
      return
    }

    const targetIsArray = isArray(target)

    if (!isReadonly) {
      let fn: Function | undefined
      // 如果调用的 push pop shift unshift splice includes indexOf lastIndexOf
      if (targetIsArray && (fn = arrayInstrumentations[key])) {
        return fn
      }
      if (key === 'hasOwnProperty') {
        return hasOwnProperty
      }
    }

    const res = Reflect.get(
      target,
      key,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      isRef(target) ? target : receiver
    )

    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res
    }
    // 如果不是只读的，就收集依赖
    if (!isReadonly) {
      track(target, TrackOpTypes.GET, key)
    }

    if (isShallow) {
      return res
    }

    // 如果是 ref 对象，返回 value 属性实现解包
    if (isRef(res)) {
      // ref unwrapping - skip unwrap for Array + integer key.
      return targetIsArray && isIntegerKey(key) ? res : res.value
    }

    // 如果是对象，递归代理
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}
```

`MutableReactiveHandler` 源码：

```ts
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow = false) {
    super(false, isShallow)
  }

  set(
    target: Record<string | symbol, unknown>,
    key: string | symbol,
    value: unknown,
    receiver: object
  ): boolean {
    let oldValue = target[key]
    if (!this._isShallow) {
      const isOldValueReadonly = isReadonly(oldValue)
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue)
        value = toRaw(value)
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) {
          return false
        } else {
          oldValue.value = value
          return true
        }
      }
    } else {
      // in shallow mode, objects are set as-is regardless of reactive or not
    }

    const hadKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key)
    const result = Reflect.set(
      target,
      key,
      value,
      isRef(target) ? target : receiver
    )
    // don't trigger if target is something up in the prototype chain of original
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        // 触发更新
        trigger(target, TriggerOpTypes.ADD, key, value)
      } else if (hasChanged(value, oldValue)) {
        trigger(target, TriggerOpTypes.SET, key, value, oldValue)
      }
    }
    return result
  }

  deleteProperty(
    target: Record<string | symbol, unknown>,
    key: string | symbol
  ): boolean {
    const hadKey = hasOwn(target, key)
    const oldValue = target[key]
    const result = Reflect.deleteProperty(target, key)
    if (result && hadKey) {
      trigger(target, TriggerOpTypes.DELETE, key, undefined, oldValue)
    }
    return result
  }

  has(target: Record<string | symbol, unknown>, key: string | symbol): boolean {
    const result = Reflect.has(target, key)
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, TrackOpTypes.HAS, key)
    }
    return result
  }

  ownKeys(target: Record<string | symbol, unknown>): (string | symbol)[] {
    track(
      target,
      TrackOpTypes.ITERATE,
      isArray(target) ? 'length' : ITERATE_KEY
    )
    return Reflect.ownKeys(target)
  }
}
```

总结：在执行 `effect` 时，修改当前 `activeEffect` 的指向，以便在执行过程中通过 Proxy 的原生 API 拦截 `get`、`has`、`ownKeys` 等操作，完成依赖收集。同时，在 `set` 和 `delete` 操作时触发依赖更新。对于边界情况，如修改数组的 length，或使用 pop、push、includes 等方法，也进行了相应的处理。

## ref 的实现原理

`ref` 的源码为：

```ts
export function ref(value?: unknown) {
  return createRef(value, false)
}

function createRef(rawValue: unknown, shallow: boolean) {
  // 如果是 ref 对象，直接返回
  if (isRef(rawValue)) {
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}
```

能看出 `ref` 函数返回的是一个 `RefImpl` 类的实例，`RefImpl` 的具体实现为：

```ts
class RefImpl<T = any> {
  _value: T
  private _rawValue: T

  dep: Dep = new Dep()

  public readonly [ReactiveFlags.IS_REF] = true
  public readonly [ReactiveFlags.IS_SHALLOW]: boolean = false

  constructor(value: T, isShallow: boolean) {
    // 未代理的value
    this._rawValue = isShallow ? value : toRaw(value)
    // 代理过后的value
    this._value = isShallow ? value : toReactive(value)
    //是否由 shallowRef 创建
    this[ReactiveFlags.IS_SHALLOW] = isShallow
  }

  get value() {
    // 依赖收集
    this.dep.track()
    return this._value
  }

  set value(newValue) {
    const oldValue = this._rawValue
    const useDirectValue =
      this[ReactiveFlags.IS_SHALLOW] ||
      isShallow(newValue) ||
      isReadonly(newValue)
    newValue = useDirectValue ? newValue : toRaw(newValue)
    if (hasChanged(newValue, oldValue)) {
      this._rawValue = newValue
      // toReactive的实现为：
      // return isObject(value) ? reactive(value) : value
      this._value = useDirectValue ? newValue : toReactive(newValue)
      // 触发依赖更新
      this.dep.trigger()
    }
  }
}
```

也就是说如果 `ref` 传入的是一个对象，那么这个对象将通过 `reactive()` 转为具有深层次响应式的对象。这也意味着如果对象中包含了嵌套的 `ref`，它们将被深层地解包。

`ref` 传入基本数据类型会直接返回，通过 `getter` 实现依赖收集，`setter` 实现依赖更新。

官网描述：

`ref` 对象是可更改的，也就是说你可以为 `.value` 赋予新的值。它也是响应式的，即所有对 .`value` 的操作都将被追踪，并且写操作会触发与之相关的副作用。

如果将一个对象赋值给 `ref`，那么这个对象将通过 `reactive()` 转为具有深层次响应式的对象。这也意味着如果对象中包含了嵌套的 `ref`，它们将被深层地解包。

这里可以引申出另外一个问题：reactive 为什么会丢失响应式？

### reactive 为什么会丢失响应式？

我们知道使用以下代码时 reactive 会丢失响应式：

```ts
const form = reactive({
  name: '张三',
  age: 18,
})

// 丢失响应式
form = { name: '李四', age: 20 }

const form2 = ref({
  name: '张三',
  age: 18,
})

// 不会丢失响应式
form2.value = { name: '李四', age: 20 }
```

使用 `ref` 会返回一个 `RefImpl` 实例，无论是修改还是重新赋值都会调用 `RefImpl` 里的 `setter` 方法，`setter` 方法里都会经过 `reactive` 方法处理成响应式对象。

而 `reactive` 会通过 `creteReactiveObject` 方法创建一个 `Proxy` 对象，并直接返回。对重新赋值时会变成一个新的引用地址，所以会丢失响应式。

## 响应式核心 API 的实现

响应式核心 API 除了 reactive 和 ref 外，还有 computed、readonly、watch、watchEffect

### computed

功能描述：接受一个 `getter` 函数，返回一个只读的响应式 `ref` 对象。该 `ref` 通过 `.value` 暴露 `getter` 函数的返回值。

它也可以接受一个带有 `get` 和 `set` 函数的对象来创建一个可写的 `ref` 对象。



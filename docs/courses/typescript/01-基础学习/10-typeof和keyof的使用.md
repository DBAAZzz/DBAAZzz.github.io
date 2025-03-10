---
title: typeof和keyof的使用
author: DBAAZzz
date: 2025/03/10 17:00:00
categories:
  - TypeScript入门学习
tags:
  - TypeScript
---

## typeof 操作符

`typeof` 主要用于获取**获取变量或对象的类型**（`作用于真实变量`）的类型，常用于类型推导。

```ts
const person = { name: 'Alice', age: 30 }
// 推断出 PersonType 的类型为 { name: string; age: number }
type PersonType = typeof person
```

## keyof 操作符

`keyof` 用于**获取某个对象类型**（`作用于类型`）的所有键（key）作为联合类型。

```ts
interface Person {
  name: string;
  age: number;
}

type PersonKeys = keyof Person; // "name" | "age"

// 示例：安全访问对象属性
function getProperty(obj: Person, key: PersonKeys) {
  return obj[key]; // key 必须是 Person 的键之一
}
```


## typeof 和 keyof 结合使用


两者结合可以实现更灵活的类型操作。例如，动态获取对象的类型，再提取其键的联合类型：

```ts
const config = { width: 100, height: 200 };
type ConfigType = typeof config; // { width: number; height: number }
type ConfigKeys = keyof ConfigType; // "width" | "height"

// 使用示例：确保函数参数是 config 的键
function updateConfig(key: ConfigKeys, value: number) {
  config[key] = value;
}
```
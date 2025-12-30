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

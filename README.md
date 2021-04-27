# Vue3.0 + tsx 开发模式

## 前言
### 简介

本文主要介绍在 vue3.0 下 tsx 组件的书写方式

请先阅读 vue3.0 文档、typescript 文档以及 jsx 语法

**基于 2021年4月份 vue@3.0.11，不保证后续版本更新之后还适用**

### 为什么使用 tsx

1. 更好的 ts 支持，智能提示和 lint
2. 更加灵活（原生 js）的语法

## 定义组件的几种方法

### 1. function component

```typescript
import { defineComponent, HTMLAttributes, SetupContext } from "vue";

interface IAProps extends HTMLAttributes {
  name: string;
}

function A(props: IAProps, ctx: SetupContext) {
  return <div class={ctx.attrs.class}>A {props.name}</div>;
}

// 注入灵魂
A.props = ["name"];
```

### 2. defindComponent

### 2.1 setup 

使用 setup 返回函数的模式

```typescript 
export const B1 = defineComponent({
  name: "B1",
  props: { name: String },
  // 此时的 props 类型能够自动推断
  setup(props) {
    return () => <div>B1 {props.name}</div>;
  },
});
```

### 2.2 render

单独使用 render 方法，使用 this 获取 props 和 setup 返回值

```typescript 
export const B2 = defineComponent({
  name: "B2",
  props: { name: String },
  setup(props, ctx) {
    return {
      type: "B2",
    };
  },
  render() {
    return (
      <div>
        {/* this 为 props & setup 返回值 */}
        {this.type} {this.name}
      </div>
    );
  },
});
```

### 2.3 props PropType

复杂对象的定义

```typescript
import { PropType } from "vue";
export const B3 = defineComponent({
  name: "B3",
  props: {
    data: Object as PropType<{ name: string }>,
    onChange: {
      type: Function as PropType<(name: string) => void>,
      required: true,
    },
  },
  render() {
    return <div onClick={() => this.onChange("B3")}>B3 {this.data?.name}</div>;
  },
});
```

### 2.4 props interface

使用 defineCompoent 泛型，注意
1. 需将 props 定义在外部
2. render 中的 this 类型不正确，请使用 setup render 模式 

```typescript
interface B4Props {
  name: string;
}

export const B4 = defineComponent<B4Props>({
  name: "B4",
  // ts error
  // props: ["name"],
  setup(props) {
    return () => <div>B4 {props.name}</div>;
  },
  // ts error, name not exists
  // render() {
  //   return <div>b4 {this.name}</div>;
  // }
});

B4.props = ["name"];
```

### 2.4.1 propts interface and render this type
同上，在 render 方法中注入 this 类型

```typescript
interface B4Props {
  name: string;
}

interface B4SetupProps {
  setupProps: number;
}

export const B41 = defineComponent<B4Props, B4SetupProps>({
  name: "B41",
  setup(props) {
    return {
      setupProps: 1,
    };
  },
  render(this: ComponentPublicInstance<B4Props, B4SetupProps>) {
    return (
      <div>
        b4 {this.name} {this.setupProps}
      </div>
    );
  },
});

B4.props = ["name"];
```

### 2.5 props generic type

泛型无法在对象上定义，只能借助 warp 函数。  
*只作为学习使用，不建议使用*

```typescript
interface B5Props<T extends { name: string }> {
  data: T;
  onChange: (data: T) => void;
}

export function B5Wrap<T extends { name: string }>() {
  const B5 = defineComponent<B5Props<T>>({
    name: "B5",
    setup(props) {
      return () => <div>B5 {props.data.name}</div>;
    },
  });

  B5.props = ["data", "onChange"];
  return B5;
}

const B5 = B5Wrap<{ name: string; age: number }>();

<B5 
  data={{ name: "b5", age: 10 }}
  onChange={(d) => { console.log(d) }}
/>
```

### 小结

### 核心问题

1. 定义组件的 props，提供给 vue 在运行时
2. 定义组件的 PropsType，提供给 ts 编译时

所有的写法都是为了达成上述两个目标

#### functionComponent  vs  defineComponent

1. 执行逻辑
    1. functionComponent 每次在 props or attrs 变化的时候都被执行
    2. defineComponent setup 只在初始化时，执行一次
2. functionComponent
    1. 避免使用 ref、reactive 维护状态，会导致非预期的效果
    2. 避免使用生命周期函数

建议：

1. 纯展示组件使用 functionComponent
2. 业务组件使用defineComponent，定义 props 对象，自动推导类型

## 一些痒点
### 指令
建议使用原生 js 实现
1. v-model，请参阅 [vue jsx v-model](https://github.com/vuejs/jsx-next)。建议自行实现
  ```typescript
  <A v-model={value} />
  
  // A.tsx
  const { modelValue: value, "onUpdate:modelValue": onChange } = ctx.attrs;
  <input value={value} onChange={(e) => onChange((e.target as HTMLInputElement).value)} />
  ```
2. v-if ×

3. v-show √

### 类型定义

1. Props 建议继承 HTMLAttributes，以便使用 attrs 中的 style 和 class

2. 封装组件场景下的继承 props
   1. 建议父组件导出 props 以便复用
   2. 在父组件没有提供 props 的情况下，尝试自行推导 props 类型：src/views/type.tsx + 2.4 模式创建组件

```typescript
import { VNodeProps, AllowedComponentProps } from "vue";

// 通过观察 defineCompoent 返回类型。转换出 props 类型

type GetConstructorReturnType<T> = T extends new (...args: any[]) => infer R
  ? R
  : never;

type GetProps<T> = T extends { $props: any } ? T["$props"] : never;

type OmitProps<T> = Omit<T, keyof VNodeProps | keyof AllowedComponentProps>;

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type GetPropsType<T> = Writeable<
  OmitProps<GetProps<GetConstructorReturnType<T>>>
>;


// 父组件
export const P = defineComponent({
  props: { a: String, b: String, c: String },
  render() {...},
});

// 获取 props 类型，此时 PPropsType ≈ {a?: stirng, b?:stirng, c?: stirng}
type PPropsType = GetPropsType<typeof P>;

// 使用 2.4 模式创建
export const C = defineComponent<Omit<P2PropsType, 'a'> & { d: string }>({
  setup(props) {
    return () => (
      <div>
        <P1 {...props} a={"a"} />
        {props.d}
      </div>
    );
  },
});

C3.props = { ...P2Props, d: String };
```

> vue 提供了 ExtractPropTypes，从 props 对象转换为 type。
> 暂时没找到从组件提取 props type 的方式
```
const props = {
  type: String,
};

type PropType = ExtractPropTypes<typeof props>;
= 
type PropType = { type?: string; }
```

### 性能

 [为什么我感觉 Vue 3 TypeScript 还是不行？ - 尤雨溪的回答](https://www.zhihu.com/question/453332049/answer/1844784032)，没做过相关实验

## 意犹未尽 Composition API

useXXX 逻辑与表现分离
推荐 https://ahooks.js.org/hooks/async

## 展望未来
屏蔽掉框架的内部的逻辑，从开发体验上保持一致
React + hooks + mobx ≈ vue + composition  + tsx

## 参考文档
1. [jsx-next](https://github.com/vuejs/jsx-next)

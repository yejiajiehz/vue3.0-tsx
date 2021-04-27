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

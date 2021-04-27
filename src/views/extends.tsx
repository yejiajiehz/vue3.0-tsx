import _ from "lodash";
import { defineComponent } from "@vue/runtime-core";

import { GetPropsType } from "./type";

export const P1 = defineComponent({
  props: {
    a: String,
    b: String,
    c: String,
  },
  render() {
    return (
      <div>
        {this.a} {this.b} {this.c}
      </div>
    );
  },
});

export const C1 = defineComponent({
  props: {
    // props 是 any 类型，丢失了类型
    ..._.omit(P1.props, "a"),
    d: String,
  },
  render() {
    return (
      <div>
        <P1 {...this.$props} a={"a"} />
        {this.d}
      </div>
    );
  },
});

// 导出 props 对象
const P2Props = {
  a: String,
  b: String,
  c: String,
};

export const P2 = defineComponent({
  props: P2Props,
  render() {
    return (
      <div>
        {this.a} {this.b} {this.c}
      </div>
    );
  },
});

// 使用该对象
export const C2 = defineComponent({
  props: {
    ...P2Props,
    d: String,
  },
  render() {
    return (
      <div>
        <P1 {...this.$props} a={"a"} />
        {this.d}
      </div>
    );
  },
});

type P2PropsType = GetPropsType<typeof P1>;

export const C3 = defineComponent<P2PropsType & { d: string }>({
  setup(props) {
    return () => (
      <div>
        <P1 {...props} a={"a"} />
        {props.d}
      </div>
    );
  },
});

C3.props = P2Props;

export default function () {
  return (
    <div>
      <C1 d="d" />
      <C2 a="a" b="b" c="c" d="d" />
      <C3 a="a" b="b" c="c" d="d" />
    </div>
  );
}

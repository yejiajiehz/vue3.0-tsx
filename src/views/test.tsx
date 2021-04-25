import { defineComponent, HTMLAttributes, SetupContext } from "vue";

// 1. function component
interface IAProps extends HTMLAttributes {
  name: string;
}

export function A(props: IAProps, ctx: SetupContext) {
  return <div class={ctx.attrs.class}>A {props.name}</div>;
}

A.props = ["name"];

// 2. defineComponent and setup
export const B1 = defineComponent({
  name: "B1",
  props: { name: String },
  setup(props) {
    return () => <div>B1 {props.name}</div>;
  },
});

// 2.1 defineComponent and render
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
        {/* NOTE: this is props and setup return value */}
        {this.type} {this.name}
      </div>
    );
  },
});

// 2.2 defineComponent PropType
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

// 2.4 defineComponent props type
interface B4Props {
  name: string;
}

export const B4 = defineComponent<B4Props>({
  name: "B4",
  // not work
  // props: ["name"],
  setup(props) {
    return () => <div>B4 {props.name}</div>;
  },
  // this not work
  // render() {
  //   return <div>b4 {this.name}</div>;
  // }
});

B4.props = ["name"];

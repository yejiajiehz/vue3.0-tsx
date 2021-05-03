import {
  defineComponent,
  HTMLAttributes,
  SetupContext,
  ComponentPublicInstance,
  ref,
} from "vue";

// 1. function component
interface IAProps extends HTMLAttributes {
  name: string;
}

export function A(props: IAProps, ctx: SetupContext) {
  console.log("A render", props, ctx.attrs);
  const innerValue = ref(0);

  const { modelValue: value, "onUpdate:modelValue": onChange } = ctx.attrs as {
    modelValue: string;
    "onUpdate:modelValue": (v: string) => void;
  };

  return (
    <div class={ctx.attrs.class} onClick={() => (innerValue.value += 1)}>
      A {props.name} {innerValue.value}
      <input
        value={value}
        onChange={(e) => onChange((e.target as HTMLInputElement).value)}
      ></input>
    </div>
  );
}

A.props = ["name", "value"];

// 2. defineComponent and setup
export const B1 = defineComponent({
  name: "B1",
  props: { name: String },
  setup(props) {
    const innerValue = ref(0);
    console.log("B1 render");

    return () => (
      <div
        onClick={(e) => {
          innerValue.value += 1;
        }}
      >
        B1 {props.name} {innerValue.value}
      </div>
    );
  },
});

try {

} finally

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
  // ts this not work
  // render() {
  //   return (
  //     <div>
  //       b4 {this.name}
  //     </div>
  //   );
  // },
});

B4.props = ["name"];

// 2.4.2 defineComponent props type render this type
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

// 2.5 defineComponent props generics type
interface B5Props<T extends { name: string }> {
  data: T;
  onChange: (data: T) => void;
}

// 性能损耗，目前没有更好的方法
// https://github.com/vuejs/vue-next/issues/3102
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

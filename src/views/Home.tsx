import "./style.css";

import { defineComponent, ref } from "vue";
import { A, B1, B2, B3, B4, B5Wrap } from "./component";

const B5 = B5Wrap<{ name: string; age: number }>();

// TODO: codepen
export default defineComponent({
  setup() {
    const value = ref(0);
    return {
      value,
    };
  },
  render() {
    return (
      <div class="home">
        <div onClick={() => (this.value += 1)}>parent value: {this.value}</div>

        <A
          v-model={this.value}
          v-show={this.value !== 0}
          name={"A_" + this.value}
          class={"a1-" + this.value}
        ></A>
        <B1 name={"B1_" + this.value}></B1>
        <B2 name="B2"></B2>
        <B3 data={{ name: "B3" }} onChange={(v) => console.log(v)}></B3>
        <B4 name="B4"></B4>
        <B5
          data={{ name: "b5", age: 10 }}
          onChange={(d) => {
            console.log(d);
          }}
        ></B5>
      </div>
    );
  },
});

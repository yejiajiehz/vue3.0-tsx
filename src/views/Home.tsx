import { A, B1, B2, B3, B4 } from "./test";

// TODO: codepen
export default () => {
  return (
    <div>
      <A name="A"></A>
      <B1 name="B1"></B1>
      <B2 name="B2"></B2>
      <B3 data={{ name: "B3" }} onChange={(v) => console.log(v)}></B3>
      <B4 name="B4"></B4>
    </div>
  );
};

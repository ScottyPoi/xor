import { useContext } from "react";
import { ActionTypes, BinaryTreeContext } from "./BinaryTreeProvider";

export default function Header() {
  const { state, dispatch } = useContext(BinaryTreeContext);
  const changeDepth = (newDepth: number) => {
    dispatch({ type: ActionTypes.ChangeDepth, payload: newDepth });
  };
  const incrementDepth = () => {
    if (state.depth > 16) return;
    changeDepth(state.depth + 1);
  };
  const decrementDepth = () => {
    if (state.depth < 1) return;
    changeDepth(state.depth - 1);
  };

  return (
    <div className="controls">
      <div>
        <button className="button" onClick={incrementDepth}>
          Increase Depth
        </button>
        <button className="button" onClick={decrementDepth}>
          Decrease Depth
        </button>
      </div>
      <span
        style={{
          fontSize: "x-large",
        }}
      >
        Depth: {state.depth - 1}
      </span>
    </div>
  );
}

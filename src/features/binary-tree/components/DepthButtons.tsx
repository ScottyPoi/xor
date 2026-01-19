import { useContext } from "react";
import { ActionTypes, BinaryTreeContext } from "../context/BinaryTreeProvider";
import Button from "@mui/material/Button";
import { Remove, Add } from "@mui/icons-material";
import { Typography } from "@mui/material";
export default function DepthButton({ inc }: { inc: boolean }) {
  const { state, dispatch } = useContext(BinaryTreeContext);
  const handleClick = () => {
    const newDepth = inc ? state.depth + 1 : state.depth - 1;
    dispatch({ type: ActionTypes.ChangeDepth, payload: newDepth });
  };
  const disabled = inc ? state.depth >= 13 : state.depth <= 1;
  const Icon = inc ? Add : Remove;
  return (
    <Button
      variant="contained"
      style={{ height: "40px", paddingInline: 10 }}
      disabled={disabled}
      onClick={handleClick}
      startIcon={<Icon />}
    />
  );
}

export function ChangeDepth() {
  const { state } = useContext(BinaryTreeContext);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "33%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <DepthButton inc={false} />
      <Typography
        padding={2}
        fontSize={"x-large"}
        fontWeight={"bold"}
        style={{ color: "yellow" }}
        height={"40px"}
        justifyContent={"space-around"}
      >
        Depth:{state.depth - 1}
      </Typography>
      <DepthButton inc />
    </div>
  );
}

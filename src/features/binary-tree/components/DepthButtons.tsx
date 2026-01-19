import { useContext } from "react";
import { ActionTypes, BinaryTreeContext } from "../context/BinaryTreeProvider";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Remove, Add } from "@mui/icons-material";
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
      sx={{ height: 40, px: 1.25 }}
      disabled={disabled}
      onClick={handleClick}
      startIcon={<Icon />}
    />
  );
}

export function ChangeDepth() {
  const { state } = useContext(BinaryTreeContext);

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent="center"
      sx={{ width: "33%" }}
    >
      <DepthButton inc={false} />
      <Typography
        sx={{
          px: 2,
          fontSize: "x-large",
          fontWeight: "bold",
          color: "warning.main",
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        Depth:{state.depth - 1}
      </Typography>
      <DepthButton inc />
    </Stack>
  );
}

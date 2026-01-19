import { useContext } from "react";
import { ActionTypes, BinaryTreeContext } from "../context/BinaryTreeProvider";
import Button from "@mui/material/Button";
import {
  Remove,
  Add,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";
import { Slider, Stack, Typography } from "@mui/material";
export default function RadiusButton({ inc }: { inc: boolean }) {
  const { state, dispatch } = useContext(BinaryTreeContext);
  const handleClick = () => {
    const newRadius = inc ? state.radius + 1 : state.radius - 1;
    dispatch({ type: ActionTypes.SetRadius, payload: newRadius });
  };
  const disabled = inc ? state.radius >= state.depth - 1 : state.radius <= 0;
  const endIcon = inc ? <KeyboardDoubleArrowRight /> : <></>;
  const startIcon = inc ? <></> : <KeyboardDoubleArrowLeft />;
  return (
    <Button
      variant="contained"
      sx={{ height: 40, m: 1 }}
      disabled={disabled}
      onClick={handleClick}
      startIcon={startIcon}
      endIcon={endIcon}
    >
      2X
    </Button>
  );
}
export function RadiusNButton({ inc }: { inc: boolean }) {
  const { state, dispatch } = useContext(BinaryTreeContext);
  const handleClick = () => {
    inc
      ? dispatch({ type: ActionTypes.RadiusNInc })
      : dispatch({ type: ActionTypes.RadiusNDec });
  };
  const disabled = inc ? state.radius >= state.depth - 1 : state.radius <= 0;
  const Icon = inc ? Add : Remove;

  return (
    <Button
      variant="contained"
      sx={{ height: 40, m: 1 }}
      disabled={disabled}
      onClick={handleClick}
      startIcon={<Icon />}
    >
      1
    </Button>
  );
}

export function ChangeRadius() {
  const { state, dispatch } = useContext(BinaryTreeContext);

  const setRadiusN = (val: number | number[]) => {
    const payload = val instanceof Array ? val[0] : val;
    dispatch({ type: ActionTypes.SetRadiusN, payload: BigInt(payload) });
  };

  return (
    <div>
      <Slider
        min={0}
        max={2 ** (state.depth - 1) - 1}
        value={Number(state.radiusN)}
        onChange={(_, n, __) => setRadiusN(n)}
        sx={{ color: "warning.main" }}
      />
      <Stack direction="row" alignItems="center" justifyContent="center">
        <RadiusNButton inc={false} />
        <RadiusButton inc={false} />
        <Stack
          direction="column"
          sx={{
            height: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "x-large",
              fontWeight: "bold",
              color: "warning.main",
              height: "50%",
              pb: 1,
            }}
          >
            Radius: 2^{state.radius}
            {2n ** BigInt(state.radius) - state.radiusN - 1n > 0n &&
              " -" + (2n ** BigInt(state.radius) - state.radiusN - 1n).toString()}
          </Typography>
          <Typography
            sx={{
              fontSize: "x-large",
              fontWeight: "bold",
              color: "warning.main",
              height: "50%",
            }}
          >
            Distance {"<"} {(state.radiusN + 1n).toString()}
          </Typography>
        </Stack>
        <RadiusButton inc />
        <RadiusNButton inc />
      </Stack>
    </div>
  );
}

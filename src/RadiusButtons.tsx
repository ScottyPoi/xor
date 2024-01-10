import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ActionTypes, BinaryTreeContext } from "./BinaryTreeProvider";
import Button from "@mui/material/Button";
import {
  Remove,
  Add,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";
import { Slider, Typography } from "@mui/material";
import * as d3 from "d3";
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
      style={{ height: "40px", margin: "10px" }}
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
      style={{ height: "40px", margin: "10px" }}
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
  const [width, setWidth] = useState<number>((window.innerWidth * 2) / 3);

  const setRadiusN = (val: number | number[]) => {
    const payload = val instanceof Array ? val[0] : val;
    dispatch({ type: ActionTypes.SetRadiusN, payload: BigInt(payload) });
  };

  useEffect(() => {
    setWidth((window.innerWidth * 2) / 3);
  }, [state.center]);

  return (
    <div>
      <Slider
        min={0}
        max={2 ** (state.depth - 1) - 1}
        value={Number(state.radiusN)}
        onChange={(_, n, __) => setRadiusN(n)}
        style={{
          color: "yellow",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          // width: width,
          justifyContent: "center",
          alignItems: "center",
          // position: "fixed",
          // bottom: 0,
        }}
      >
        <RadiusNButton inc={false} />
        <RadiusButton inc={false} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "40px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
        <Typography
          fontSize={"x-large"}
          fontWeight={"bold"}
          style={{ color: "yellow" }}
          height={"50%"}
          paddingBottom={1}
        >
          Radius: 2^{state.radius}
          {2n ** BigInt(state.radius) - state.radiusN - 1n > 0n &&
            " -" + (2n ** BigInt(state.radius) - state.radiusN - 1n).toString()}
        </Typography>
        <Typography
          fontSize={"x-large"}
          fontWeight={"bold"}
          style={{ color: "yellow" }}
          height={"50%"}
        >
          Distance {"<"} {(state.radiusN + 1n).toString()}
        </Typography>
        </div>
        <RadiusButton inc />
        <RadiusNButton inc />
      </div>
    </div>
  );
}

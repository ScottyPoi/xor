import * as d3 from "d3";
import { ILeafHeatProps } from "./types";
import { useContext } from "react";
import { ActionTypes, BinaryTreeContext } from "./BinaryTreeProvider";
import {
  fillColorByDistance,
  fillColorById,
  textStartAngle,
} from "./treeUtils";

export default function LeafHeat({
  nodeData,
  startAngle,
  endAngle,
  colorScale,
  distance,
  dimensions: {
    heat_innerRadius,
    node_innerRadius,
    heat_outerRadius,
    node_outerRadius,
  },
}: ILeafHeatProps) {
  const { state, dispatch } = useContext(BinaryTreeContext);

  const setSelected = (id: string) => {
    dispatch({ type: ActionTypes.SetSelected, payload: id });
  };

  const inRadius = BigInt(distance) <= state.radiusN;

  const handleMouseOver = () => {
    dispatch({
      type: ActionTypes.SetTooltip,
      payload: { id: nodeData.id, x: nodeData.x, y: nodeData.y },
    });
  };

  const handleMouseOut = () => {
    dispatch({ type: ActionTypes.SetTooltip, payload: null });
  };

  const arcGenerator = d3.arc();
  const hovered = state.tooltip?.id === nodeData.id;
  const selected = state.selected === nodeData.id;
  const fontSize = hovered
    ? "7rem"
    : selected
    ? "7rem"
    : state.depth < 4
    ? "7rem"
    : `${3 - state.depth / 3}rem`;

  const textAngle = textStartAngle({
    startAngle,
    endAngle,
    distance,
    depth: state.depth,
    id: nodeData.id,
    hovered,
    selected,
  });

  const textRadius = hovered
    ? {
        inner: heat_outerRadius + 16,
        outer: heat_outerRadius + 32,
      }
    : {
        inner: node_outerRadius,
        outer: heat_outerRadius + 16,
      };

  

  return (
    <>
      {state.heatVisible && (
        <>
          <path
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={() => setSelected(nodeData.id)}
            d={
              arcGenerator({
                innerRadius: heat_innerRadius,
                outerRadius: heat_outerRadius,
                startAngle,
                endAngle,
              }) ?? undefined
            }
            fill={
              state.depth > 2
                ? fillColorByDistance(colorScale, distance)
                : "none"
            }
            opacity={0.65}
            transform={`translate(${state.center.x},${state.center.y})`}
          />
          <path
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={() => setSelected(nodeData.id)}
            d={
              arcGenerator({
                innerRadius: node_innerRadius,
                outerRadius: node_outerRadius,
                startAngle,
                endAngle,
              }) ?? undefined
            }
            fill={fillColorById(nodeData.id)}
            opacity={1}
            transform={`translate(${state.center.x},${state.center.y})`}
          />
        </>
      )}
      {state.radiusN > 0n && (
        <path
          onMouseOver={() => handleMouseOver}
          onMouseOut={() => handleMouseOut}
          onClick={() => setSelected(nodeData.id)}
          d={
            arcGenerator({
              innerRadius: node_outerRadius,
              outerRadius: heat_outerRadius + 8,
              startAngle,
              endAngle,
            }) ?? undefined
          }
          fill={inRadius ? "yellow" : "none"}
          opacity={1}
          transform={`translate(${state.center.x},${state.center.y})`}
        />
      )}

      <path
        onMouseOver={() => handleMouseOver}
        onMouseOut={() => handleMouseOut}
        onClick={() => setSelected(nodeData.id)}
        id={`${nodeData.id}Arc`}
        d={
          arcGenerator({
            innerRadius: textRadius.inner,
            outerRadius: textRadius.outer,
            startAngle: textAngle,
            endAngle:
              state.tooltip?.id === nodeData.id ||
              state.selected === nodeData.id
                ? endAngle + Math.PI
                : endAngle,
          }) ?? undefined
        }
        fill={"none"}
        opacity={1}
        transform={`translate(${state.center.x},${state.center.y})`}
      />
      <text
        overflow={"hidden"}
        fill={BigInt(distance) === 0n ? "yellow" : "darkpurple"}
      >
        {
          <textPath
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={() => setSelected(nodeData.id)}
            lengthAdjust={"spacing"}
            fontSize={fontSize}
            href={`#${nodeData.id}Arc`}
            opacity={1}
          >
            {hovered || selected || state.depth < 9
              ? BigInt(distance).toString()
              : "."}
          </textPath>
        }
      </text>
      <path
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={() => setSelected(nodeData.id)}
        d={
          arcGenerator({
            innerRadius: state.heatVisible ? textRadius.inner : 16,

            outerRadius: heat_outerRadius + 400,
            startAngle,
            endAngle,
          }) ?? undefined
        }
        fill={"transparent"}
        opacity={0.1}
        transform={`translate(${state.center.x},${state.center.y})`}
      />
    </>
  );
}

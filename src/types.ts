// types.ts
export interface ITreeNode {
  id: string;
  x: number;
  y: number;
  angle: number;
  children?: ITreeNode[];
}

export interface HeatMapProps {
  nodes: d3.HierarchyNode<ITreeNode>[];
}

export interface ILeafHeatProps {
  nodeData: ITreeNode;
  distance: string;
  startAngle: number;
  endAngle: number;
  colorScale: d3.ScaleSequential<string, never>;
  dimensions: ILeafHeatDimensions;
}
export interface ILeafHeatDimensions {
  heat_innerRadius: number;
  node_innerRadius: number;
  heat_outerRadius: number;
  node_outerRadius: number;
}
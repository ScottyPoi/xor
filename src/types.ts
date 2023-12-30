// types.ts
export interface ITreeNode {
  id: string;
  x: number;
  y: number;
  angle: number;
  children?: ITreeNode[];
}

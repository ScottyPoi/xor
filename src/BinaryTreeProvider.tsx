import { Dispatch, createContext, useReducer } from "react";

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum ActionTypes {
  OpenApp = "OPEN_APP",
  CloseApp = "CLOSE_APP",
  SetDepth = "SET_DEPTH",
  ChangeDepth = "CHANGE_DEPTH",
  IncDepth = "INC_DEPTH",
  DecDepth = "DEC_DEPTH",
  SetSelected = "SET_SELECTED",
  SetTooltip = "SET_TOOLTIP",
  SetDownstream = "SET_DOWNSTREAM",
  SetRadius = "SET_RADIUS",
  SetRadiusN = "SET_RADIUS_N",
  RadiusNInc = "RADIUS_N_INC",
  RadiusNDec = "RADIUS_N_DEC",
  SetCenter = "SET_CENTER",
  ShowBinaryNodes = "SHOW_BINARY_NODES",
  ShowBinaryLinks = "SHOW_BINARY_LINKS",
  ShowHexaryNodes = "SHOW_HEXARY_NODES",
  ShowHexaryLinks = "SHOW_HEXARY_LINKS",
  HideBinaryNodes = "HIDE_BINARY_NODES",
  HideBinaryLinks = "HIDE_BINARY_LINKS",
  HideHexaryNodes = "HIDE_HEXARY_NODES",
  HideHexaryLinks = "HIDE_HEXARY_LINKS",
  ShowHeat = "SHOW_HEAT",
  HideHeat = "HIDE_HEAT",
}

type BinaryTreeContextPayload = {
  [ActionTypes.OpenApp]: undefined;
  [ActionTypes.CloseApp]: undefined;
  [ActionTypes.SetDepth]: number;
  [ActionTypes.IncDepth]: undefined;
  [ActionTypes.DecDepth]: undefined;
  [ActionTypes.SetSelected]: string;
  [ActionTypes.SetDownstream]: string[];
  [ActionTypes.SetTooltip]: {
    x: number;
    y: number;
    id: string;
  } | null;
  [ActionTypes.SetRadius]: number;
  [ActionTypes.SetRadiusN]: bigint;
  [ActionTypes.RadiusNInc]: undefined;
  [ActionTypes.RadiusNDec]: undefined;
  [ActionTypes.SetCenter]: { x: number; y: number };
  [ActionTypes.ChangeDepth]: number;
  [ActionTypes.ShowBinaryNodes]: undefined;
  [ActionTypes.ShowBinaryLinks]: undefined;
  [ActionTypes.ShowHexaryNodes]: undefined;
  [ActionTypes.ShowHexaryLinks]: undefined;
  [ActionTypes.HideBinaryNodes]: undefined;
  [ActionTypes.HideBinaryLinks]: undefined;
  [ActionTypes.HideHexaryNodes]: undefined;
  [ActionTypes.HideHexaryLinks]: undefined;
  [ActionTypes.ShowHeat]: undefined;
  [ActionTypes.HideHeat]: undefined;
};

type BinaryTreeContextAction =
  ActionMap<BinaryTreeContextPayload>[keyof ActionMap<BinaryTreeContextPayload>];

type BinaryTreeContextState = {
  home: boolean;
  depth: number;
  selected: string;
  downstream: string[];
  tooltip: {
    x: number;
    y: number;
    id: string;
  } | null;
  radius: number;
  radiusN: bigint;
  center: { x: number; y: number };
  binaryNodesVisible: boolean;
  binaryLinksVisible: boolean;
  hexaryNodesVisible: boolean;
  hexaryLinksVisible: boolean;
  heatVisible: boolean;
};

const initialState: BinaryTreeContextState = {
  home: true,
  depth: 1,
  selected: "",
  downstream: [],
  tooltip: null,
  radius: 0,
  radiusN: 0n,
  center: { x: 0, y: 0 },
  binaryNodesVisible: true,
  binaryLinksVisible: true,
  hexaryNodesVisible: true,
  hexaryLinksVisible: false,
  heatVisible: false,
};

// Step 1: Create a context
export const BinaryTreeContext = createContext<{
  state: BinaryTreeContextState;
  dispatch: Dispatch<BinaryTreeContextAction>;
}>({ state: initialState, dispatch: () => null });

// Step 2: Create a reducer
const treeContextReducer = (
  state: BinaryTreeContextState,
  action: BinaryTreeContextAction
) => {
  switch (action.type) {
    case "OPEN_APP":
      return {
        ...state,
        home: false,
      };
    case "CLOSE_APP":
      return {
        ...state,
        home: true,
      };
    case "SET_DEPTH":
      return {
        ...state,
        depth: action.payload,
      };
    case "CHANGE_DEPTH": {
      const newSelected = "0b" + "0".repeat(action.payload - 1);
      return {
        ...state,
        depth: action.payload,
        selected: newSelected,
        radius: 0,
        radiusN: 0n,
      };
    }
    case "INC_DEPTH": {
      const { depth } = state;
      const newSelected = "0b" + "0".repeat(depth);
      return {
        ...state,
        depth: depth + 1,
        selected: newSelected,
        radius: 0,
        radiusN: 0n,
      };
    }
    case "DEC_DEPTH": {
      const { depth } = state;
      const newSelected = "0b" + "0".repeat(depth - 2);
      return {
        ...state,
        depth: depth >= 2 ? depth - 1 : depth,
        selected: newSelected,
        radius: 0,
        radiusN: 0n,
      };
    }
    case "SET_SELECTED":
      return {
        ...state,
        selected: action.payload,
      };
    case "SET_TOOLTIP":
      return {
        ...state,
        tooltip: action.payload,
      };
    case "SET_DOWNSTREAM":
      return {
        ...state,
        downstream: action.payload,
      };
    case "SET_RADIUS":
      return {
        ...state,
        radius: action.payload,
        radiusN: BigInt(2) ** BigInt(action.payload) - 1n,
      };
    case "SET_RADIUS_N":
      const up = action.payload >= 2n ** BigInt(state.radius);
      const down = action.payload < 2n ** BigInt(state.radius) / 2n;
      const newradius = up
        ? state.radius + 1
        : down
        ? state.radius - 1
        : state.radius;
      return {
        ...state,
        radiusN: action.payload,
        radius: newradius,
      };
    case "RADIUS_N_INC":
      const levelup = state.radiusN === 2n ** BigInt(state.radius) - 1n;
      return {
        ...state,
        radiusN: state.radiusN + 1n,
        radius: levelup ? state.radius + 1 : state.radius,
      };
    case "RADIUS_N_DEC":
      if (state.radiusN === 0n) return state
      const leveldown = state.radiusN === 2n ** BigInt(state.radius) / 2n;
      return {
        ...state,
        radius: leveldown ? state.radius - 1 : state.radius,
        radiusN: state.radiusN - 1n,
      };
    case "SET_CENTER":
      return {
        ...state,
        center: action.payload,
      };
    case "SHOW_BINARY_NODES":
      return {
        ...state,
        binaryNodesVisible: true,
      };
    case "HIDE_BINARY_NODES":
      return {
        ...state,
        binaryNodesVisible: false,
      };
    case "SHOW_BINARY_LINKS":
      return {
        ...state,
        binaryLinksVisible: true,
      };
    case "HIDE_BINARY_LINKS":
      return {
        ...state,
        binaryLinksVisible: false,
      };
    case "SHOW_HEXARY_NODES":
      return {
        ...state,
        hexaryNodesVisible: true,
      };
    case "HIDE_HEXARY_NODES":
      return {
        ...state,
        hexaryNodesVisible: false,
      };
    case "SHOW_HEXARY_LINKS":
      return {
        ...state,
        hexaryLinksVisible: true,
      };
    case "HIDE_HEXARY_LINKS":
      return {
        ...state,
        hexaryLinksVisible: false,
      };
    case "SHOW_HEAT":
      return {
        ...state,
        heatVisible: true,
      };
    case "HIDE_HEAT":
      return {
        ...state,
        heatVisible: false,
      };

    // add other cases as needed
    default:
      throw new Error();
  }
};

const BinaryTreeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(treeContextReducer, initialState);
  return (
    <BinaryTreeContext.Provider value={{ state, dispatch }}>
      {children}
    </BinaryTreeContext.Provider>
  );
};

export default BinaryTreeProvider;

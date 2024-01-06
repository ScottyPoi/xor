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
  SetDepth = "SET_DEPTH",
  ChangeDepth = "CHANGE_DEPTH",
  SetSelected = "SET_SELECTED",
  SetTooltip = "SET_TOOLTIP",
  SetRadius = "SET_RADIUS",
  SetCenter = "SET_CENTER",
}

type BinaryTreeContextPayload = {
  [ActionTypes.SetDepth]: number;
  [ActionTypes.SetSelected]: string;
  [ActionTypes.SetTooltip]: {
    x: number;
    y: number;
    id: string;
  } | null;
  [ActionTypes.SetRadius]: number;
  [ActionTypes.SetCenter]: { x: number; y: number };
  [ActionTypes.ChangeDepth]: number;
};

type BinaryTreeContextAction =
  ActionMap<BinaryTreeContextPayload>[keyof ActionMap<BinaryTreeContextPayload>];

type BinaryTreeContextState = {
  depth: number;
  selected: string;
  tooltip: {
    x: number;
    y: number;
    id: string;
  } | null;
  radius: number;
  center: { x: number; y: number };
};

const initialState: BinaryTreeContextState = {
  depth: 1,
  selected: "",
  tooltip: null,
  radius: 0,
  center: { x: 0, y: 0 },
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
    case "SET_DEPTH":
      return {
        ...state,
        depth: action.payload,
      };
    case "CHANGE_DEPTH": {
      const newSelected = '0b' + '0'.repeat(action.payload - 1)
      let newRadius = state.radius
      while (
        state.radius >= 2 ** action.payload
      ) {
        newRadius = newRadius / 2
      }
      return {
        ...state,
        depth: action.payload,
        selected: newSelected,
        radius: newRadius,
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
    case "SET_RADIUS":
      return {
        ...state,
        radius: action.payload,
      };
    case "SET_CENTER":
      return {
        ...state,
        center: action.payload,
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

import { create } from "zustand";
import type { MappedColumnType } from "../../../utils/data-mapping/mapAttributeToColumn.util";

const initialState = {
  displayColumns: [] as MappedColumnType[],
};

type StoreType = typeof initialState;

export const useColumnsStore = create<{
  state: StoreType;
  functions: { updateStore: (state: Partial<StoreType>) => void };
}>((set) => ({
  state: {
    ...initialState,
  },
  functions: {
    updateStore(state) {
      set((cur) => ({ state: { ...cur.state, ...state } }));
    },
  },
}));

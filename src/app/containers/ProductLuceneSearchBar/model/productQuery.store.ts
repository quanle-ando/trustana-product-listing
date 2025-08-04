import { InternalFilterValue } from "@/app/types/query-engine/common";
import { create } from "zustand";

const initialState = {
  /**
   * Pre-transformed query, i.e. value can be dt(2020-10010), regexp((apple|banana))
   */
  filters: undefined as undefined | Record<string, InternalFilterValue>,
  luceneQuery: "",
};

type StoreType = typeof initialState;

export const useProductQueryStore = create<{
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

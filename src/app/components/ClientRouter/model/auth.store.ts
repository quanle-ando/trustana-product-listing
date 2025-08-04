import { create } from "zustand";

const initialState = {
  xTrackingId: "",
};

type StoreType = typeof initialState;

export const useAuthStore = create<{
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

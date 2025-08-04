import { nanoid } from "nanoid";
import { create } from "zustand";
import { OperationType } from "../QueryBuilderModal";

const initialState = {
  isOpen: false,
  internalQuery: new Map<string, Partial<OperationType>>(),
};

type StoreType = typeof initialState;

export const useQueryBuilderModalStore = create<{
  state: StoreType;
  functions: {
    updateStore: (state: Partial<StoreType>) => void;
    clearStore(): void;
    updateOperation(payload: {
      key: string;
      value: Partial<OperationType>;
    }): void;
    addNewCondition(): void;
    deleteCondition(payload: { key: string }): void;
  };
}>((set) => ({
  state: {
    ...initialState,
  },
  functions: {
    updateStore(state) {
      set((cur) => ({ state: { ...cur.state, ...state } }));
    },

    clearStore() {
      set((cur) => ({ ...cur, state: { ...initialState } }));
    },

    updateOperation(payload) {
      set((cur) => {
        const op = cur.state.internalQuery.get(payload.key);

        cur.state.internalQuery.set(payload.key, { ...op, ...payload.value });

        return {
          state: {
            ...cur.state,
            internalQuery: new Map(cur.state.internalQuery),
          },
        };
      });
    },

    addNewCondition() {
      set((cur) => {
        const internalQuery = cur.state.internalQuery;
        internalQuery.set(nanoid(), {});
        return {
          ...cur,
          state: { ...cur.state, internalQuery: new Map(internalQuery) },
        };
      });
    },

    deleteCondition(payload: { key: string }) {
      set((cur) => {
        const internalQuery = cur.state.internalQuery;
        internalQuery.delete(payload.key);
        return {
          ...cur,
          state: { ...cur.state, internalQuery: new Map(internalQuery) },
        };
      });
    },
  },
}));

import { create } from "zustand";
import { MappedProductType } from "../../../utils/data-mapping/mapProduct.util";

const initialState = {
  products: [] as MappedProductType[],
  isLoadingProducts: false,
  page: 0,
  totalCount: 0,
  sort: undefined as undefined | { field: string; dir: "ascend" | "descend" },
  selectedProductSkuIds: new Set<string>(),
};

export type ProductStoreType = typeof initialState;

export const useProductsStore = create<{
  state: ProductStoreType;
  functions: { updateStore: (state: Partial<ProductStoreType>) => void };
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

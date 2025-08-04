import { create } from "zustand";
import { MappedAttributeType } from "../AttributeColumnServer";
import { InternalFilterValue } from "@/app/types/query-engine/common";

const initialState = {
  searchedAttributesMap: new Map<string, MappedAttributeType>(),
  isSearchingAttributes: false,
  isSearchingFirstAttributes: false,
  filters: undefined as
    | Partial<Record<string, InternalFilterValue>>
    | undefined,
  page: 0,
  hasMore: true,
  totalCountOfSearchedAttributes: 0,
  sort: undefined as undefined | { key: string; dir: "ASC" | "DESC" },
};

type StoreType = typeof initialState;

export const useSearchedAttributesStore = create<{
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

export function updateSearchedAttributeMap(
  attributes: MappedAttributeType[] | MapIterator<MappedAttributeType>
) {
  const attributeMap =
    useSearchedAttributesStore.getState().state.searchedAttributesMap;

  attributes.forEach((attr) => {
    attributeMap.set(attr.key, attr);
  });

  useSearchedAttributesStore
    .getState()
    .functions.updateStore({ searchedAttributesMap: new Map(attributeMap) });
}

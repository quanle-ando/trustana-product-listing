import { create } from "zustand";
import { MappedAttributeType } from "../AttributeColumnServer";
import { createSelector } from "reselect";
import { AttributeFieldType, AttributeGroup } from "@/app/enums/attribute";
import { SupplierAttribute } from "@/app/types/attribute";

const initialState = {
  selectedAttributes: new Set<string>(["name", "brand"]),
  attributeMap: new Map<string, MappedAttributeType>(),
  isAttributeQueryBarFocused: false,
};

type StoreType = typeof initialState;

export const useAttributesStore = create<{
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

export function updateAttributeMap(
  attributes: MappedAttributeType[] | MapIterator<MappedAttributeType>
) {
  const attributeMap = useAttributesStore.getState().state.attributeMap;

  attributes.forEach((attr) => {
    attributeMap.set(attr.key, attr);
  });

  useAttributesStore
    .getState()
    .functions.updateStore({ attributeMap: new Map(attributeMap) });
}

export type PartialAttributePropsType = Pick<
  SupplierAttribute,
  "key" | "name" | "type" | "description" | "option"
> & { group?: AttributeGroup | "Product Metadata" | undefined };

const PRODUCT_METADATA_ATTRIBUTE: Array<PartialAttributePropsType> = [
  {
    key: "pdt.skuId",
    name: "SKU ID",
    type: AttributeFieldType.TEXT,
    group: "Product Metadata",
    description: "Product SKU ID",
  },
  {
    key: "pdt.createdAt",
    name: "Created At",
    type: AttributeFieldType.DATE,
    group: "Product Metadata",
    description: "Product's Creation Time",
  },
  {
    key: "pdt.updatedAt",
    name: "Updated At",
    type: AttributeFieldType.DATE,
    group: "Product Metadata",
    description: "Product's Updated Time",
  },
];

export const SelectTopAttributesFromMapSelector = createSelector(
  (store: { state: StoreType }) => store.state.attributeMap,
  (attributeMap) => {
    return [
      ...PRODUCT_METADATA_ATTRIBUTE,
      ...Array.from(attributeMap.values()),
    ];
  }
);

export const CompositeAttributeMapSelector = createSelector(
  (store: { state: StoreType }) => store.state.attributeMap,
  (attributeMap) => {
    const newMap = new Map(
      PRODUCT_METADATA_ATTRIBUTE.map((attr) => [attr.key, attr])
    );
    attributeMap.forEach((value, key) => {
      newMap.set(key, value);
    });

    return { compositeAttributeMap: newMap };
  }
);

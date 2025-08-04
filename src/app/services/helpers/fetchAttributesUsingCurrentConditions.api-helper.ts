import { formatObject } from "@/app/utils/formatObject";
import { fetchAttributes } from "../fetchAttributes.api";
import { SupplierAttributeQuery } from "@/app/types/query-engine/attribute";
import { useSearchedAttributesStore } from "@/app/containers/AttributeColumn/model/searchedAttributes.store";
import { updateAttributeMap } from "@/app/containers/AttributeColumn/model/attributes.store";

export const ATTRIBUTE_SIZE_LIMIT = 25;

export async function fetchAttributesUsingCurrentConditions() {
  const store = useSearchedAttributesStore.getState();
  const page = store.state.page;

  store.functions.updateStore({
    isSearchingAttributes: true,
    isSearchingFirstAttributes: !page,
    hasMore: true,
  });

  return fetchAttributes({
    body: JSON.stringify(
      formatObject<SupplierAttributeQuery>({
        filter: store.state.filters,

        ...(store.state.sort && {
          sort: { field: store.state.sort.key, order: store.state.sort.dir },
        }),

        pagination: {
          limit: ATTRIBUTE_SIZE_LIMIT,
          offset: page * ATTRIBUTE_SIZE_LIMIT,
        },
      })
    ),
  })
    .then((response) => {
      const newData = !page
        ? new Map()
        : new Map(
            useSearchedAttributesStore.getState().state.searchedAttributesMap
          );

      response.data.forEach((attr) => {
        newData.set(attr.key, attr);
      });

      useSearchedAttributesStore.getState().functions.updateStore({
        searchedAttributesMap: newData,
        total: response.total,
        hasMore: response.pagination.hasMore,
      });

      updateAttributeMap(response.data);
    })
    .finally(() => {
      useSearchedAttributesStore.getState().functions.updateStore({
        isSearchingAttributes: false,
        isSearchingFirstAttributes: false,
      });
    });
}

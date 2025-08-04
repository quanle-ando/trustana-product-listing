import { useAttributesStore } from "../../containers/AttributeColumn/model/attributes.store";
import { useProductQueryStore } from "../../containers/ProductLuceneSearchBar/model/productQuery.store";
import { useProductsStore } from "../../containers/ProductTable/model/products.store";
import { isValidNumber } from "../isValidNumber";
import { convertQueryStringToFilterObject } from "../query-parser/convertQueryStringToFilterObject.util";

export type QueryType = {
  attributes?: string;
  query?: string;
  sort?: string;
  sortDir?: string;
  page?: string;
  skuIds?: string;
};

export function rehydrateStoresWithQueryParams({
  queries,
}: {
  queries: QueryType;
}) {
  const { attributes, query, sort, sortDir, page } = queries;

  if (query) {
    useProductQueryStore.getState().functions.updateStore({
      luceneQuery: query,
      filters: convertQueryStringToFilterObject({ luceneQuery: query }),
    });
  }

  if (attributes) {
    useAttributesStore.getState().functions.updateStore({
      selectedAttributes: new Set(attributes.split(",")),
    });
  }

  if (sort) {
    useProductsStore.getState().functions.updateStore({
      sort: {
        field: sort,
        dir: sortDir === "ascend" ? "ascend" : "descend",
      },
    });
  }

  if (page) {
    useProductsStore.getState().functions.updateStore({
      page: Math.max(0, isValidNumber(+page) ? +page : 0),
    });
  }
}

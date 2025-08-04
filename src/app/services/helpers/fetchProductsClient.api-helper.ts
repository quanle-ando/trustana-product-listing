"use client";

import { useProductQueryStore } from "@/app/containers/ProductLuceneSearchBar/model/productQuery.store";
import { useProductsStore } from "@/app/containers/ProductTable/model/products.store";
import { generateProductFilters } from "@/app/utils/query-parser/generateProductFilters.util";
import { fetchProducts, PRODUCT_SIZE_LIMIT } from "../fetchProducts.api";
import { mapProduct } from "@/app/utils/data-mapping/mapProduct.util";

export default async function fetchProductsClient() {
  const store = useProductsStore.getState();

  store.functions.updateStore({ isLoadingProducts: true });

  const { sort, page } = store.state;

  const filters = generateProductFilters(
    useProductQueryStore.getState().state.filters
  );

  useProductsStore
    .getState()
    .functions.updateStore({ isLoadingProducts: true });

  return fetchProducts({
    body: {
      filter: filters,
      ...(sort && {
        sort: {
          field: sort.field,
          order: sort.dir === "ascend" ? "ASC" : "DESC",
        },
      }),
      pagination: {
        limit: PRODUCT_SIZE_LIMIT,
        offset: page * PRODUCT_SIZE_LIMIT,
      },
    },
  })
    .then((response) => {
      useProductsStore.getState().functions.updateStore({
        products: response.data.map((pdt, index) =>
          mapProduct({ index, pdt, offset: page })
        ),
        totalCount: response.total,
      });

      return response;
    })
    .finally(() => {
      useProductsStore
        .getState()
        .functions.updateStore({ isLoadingProducts: false });
    });
}

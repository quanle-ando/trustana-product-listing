import { getRouter } from "@/app/components/ClientRouter/ClientRouter";
import { useAttributesStore } from "@/app/containers/AttributeColumn/model/attributes.store";
import { useProductQueryStore } from "@/app/containers/ProductLuceneSearchBar/model/productQuery.store";
import { useProductsStore } from "@/app/containers/ProductTable/model/products.store";
import { fetchProductsUsingCurrentConditions } from "@/app/services/helpers/fetchProductsUsingCurrentConditions.api-helper";
import { useEffect, useTransition } from "react";

function pushLuceneQueryToUrl() {
  const { luceneQuery } = useProductQueryStore.getState().state;
  const { selectedAttributes } = useAttributesStore.getState().state;
  const { sort, page } = useProductsStore.getState().state;

  const params = new URLSearchParams({
    query: luceneQuery,
    attributes: Array.from(selectedAttributes).join(","),
    ...(sort && { sort: sort.field, sortDir: sort.dir }),
    page: page.toString(),
  });
  getRouter().push(`?${params.toString()}`);

  if (process.env.NODE_ENV === "test") {
    return fetchProductsUsingCurrentConditions();
  }
}

export function usePushLuceneQueryToUrl() {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    useProductsStore
      .getState()
      .functions.updateStore({ isLoadingProducts: isPending });
  }, [isPending]);

  return {
    pushLuceneQueryToUrl: () => {
      startTransition(() => {
        pushLuceneQueryToUrl();
      });
    },
  };
}

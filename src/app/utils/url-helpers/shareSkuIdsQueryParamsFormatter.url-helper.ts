import { useProductsStore } from "@/app/containers/ProductTable/model/products.store";

export function shareSkuIdsQueryParamsFormatter() {
  const { selectedProductSkuIds } = useProductsStore.getState().state;
  const { sort } = useProductsStore.getState().state;

  const params = new URLSearchParams({
    query: `pdt.skuId:(${Array.from(selectedProductSkuIds).join(" OR ")})`,
    ...(sort && { sort: sort.field, sortDir: sort.dir }),
  });

  return `?${params.toString()}`;
}

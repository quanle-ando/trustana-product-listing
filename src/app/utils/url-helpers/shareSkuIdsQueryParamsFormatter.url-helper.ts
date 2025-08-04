import { useAttributesStore } from "@/app/containers/AttributeColumn/model/attributes.store";
import { useProductsStore } from "@/app/containers/ProductTable/model/products.store";

export function shareSkuIdsQueryParamsFormatter() {
  const { selectedAttributes } = useAttributesStore.getState().state;
  const { selectedProductSkuIds } = useProductsStore.getState().state;
  const { sort } = useProductsStore.getState().state;

  const params = new URLSearchParams({
    attributes: Array.from(selectedAttributes).join(","),
    query: `pdt.skuId:(${Array.from(selectedProductSkuIds).join(" OR ")})`,
    ...(sort && { sort: sort.field, sortDir: sort.dir }),
  });

  return `?${params.toString()}`;
}

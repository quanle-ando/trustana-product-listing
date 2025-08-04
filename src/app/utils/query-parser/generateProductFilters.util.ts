import { InternalFilterValue } from "@/app/types/query-engine/common";
import { ProductQueryStoreType } from "../../containers/ProductLuceneSearchBar/model/productQuery.store";

export function generateProductFilters(
  filters: ProductQueryStoreType["filters"]
) {
  const attributeFilters: Record<string, InternalFilterValue> = {};
  const productFilters: Record<string, InternalFilterValue> = {};

  Object.entries(filters || {}).forEach(([key, val]) => {
    const [prefixOrAttr, field] = key.split(".");

    if (prefixOrAttr === "pdt" && field) {
      productFilters[field] = val;
      return;
    }

    attributeFilters[prefixOrAttr] = val;
  });

  return {
    ...productFilters,
    ...(Object.keys(attributeFilters).length && {
      attributes: attributeFilters,
    }),
  };
}

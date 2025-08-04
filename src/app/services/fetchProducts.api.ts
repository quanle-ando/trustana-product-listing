import { BASE_URL } from "@/app/constants/BASE_URL";
import { Product } from "@/app/types/product";
import { InternalQueryResponse } from "@/app/types/query-engine/common";
import { useProductsStore } from "../containers/ProductTable/model/products.store";
import { fetcher } from "./fetcher";

export async function fetchProducts(payload?: { body: string }) {
  useProductsStore
    .getState()
    .functions.updateStore({ isLoadingProducts: true });

  return fetcher(`${BASE_URL}/api/products`, {
    method: "POST",
    body: payload?.body,
  })
    .then((res) => res.json() as Promise<InternalQueryResponse<Product>>)
    .then((res) => {
      useProductsStore
        .getState()
        .functions.updateStore({ totalCount: res.total });
      return res;
    })
    .finally(() => {
      useProductsStore
        .getState()
        .functions.updateStore({ isLoadingProducts: false });
    });
}

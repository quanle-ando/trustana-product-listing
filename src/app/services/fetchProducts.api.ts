import { BASE_URL } from "@/app/constants/BASE_URL";
import { Product } from "@/app/types/product";
import { InternalQueryResponse } from "@/app/types/query-engine/common";
import { fetcher } from "./fetcher";
import { ProductQuery } from "../types/query-engine/product";
import { formatObject } from "../utils/formatObject";
import { merge } from "lodash";

export const PRODUCT_SIZE_LIMIT = 100;

export async function fetchProducts(payload?: {
  body: ProductQuery | undefined;
}) {
  return fetcher(`${BASE_URL}/api/products`, {
    method: "POST",
    body: JSON.stringify(
      merge(
        formatObject<ProductQuery>({
          pagination: { limit: PRODUCT_SIZE_LIMIT, offset: 0 },
        }),
        payload?.body
      )
    ),
  }).then((res) => res.json() as Promise<InternalQueryResponse<Product>>);
}

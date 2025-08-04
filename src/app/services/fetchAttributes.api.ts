import { BASE_URL } from "@/app/constants/BASE_URL";
import { SupplierAttribute } from "@/app/types/attribute";
import { InternalQueryResponse } from "@/app/types/query-engine/common";
import { mapAttribute } from "../utils/data-mapping/mapAttribute.util";
import { fetcher } from "./fetcher";

export const ATTRIBUTE_SIZE_LIMIT = 25;

export type FetchedAttributeResponseType = Awaited<
  ReturnType<typeof fetchAttributes>
>;

export async function fetchAttributes(payload?: { body?: string | undefined }) {
  return fetcher(`${BASE_URL}/api/attributes`, {
    method: "POST",
    body: payload?.body,
  })
    .then(
      (res) => res.json() as Promise<InternalQueryResponse<SupplierAttribute>>
    )
    .then((res) => {
      return {
        ...res,
        data: res.data.map((attr) => {
          return mapAttribute(attr);
        }),
      };
    });
}

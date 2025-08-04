import { chunk, flatten } from "lodash";
import {
  ATTRIBUTE_SIZE_LIMIT,
  fetchAttributes,
  FetchedAttributeResponseType,
} from "../fetchAttributes.api";
import { ValidSupplierAttributeForMatching } from "@/app/types/attribute";
import { InternalQueryFilter } from "@/app/types/query-engine/common";
import { formatObject } from "@/app/utils/formatObject";

const MAX_THREADS = 4;

export async function fetchAllAttributesByKeys({
  attributeKeys,
}: {
  attributeKeys: string[];
}) {
  const chunks = chunk(attributeKeys, ATTRIBUTE_SIZE_LIMIT);
  const threads = chunk(chunks, MAX_THREADS);

  return Promise.all(
    threads.map(async (thread) => {
      const responses: FetchedAttributeResponseType["data"] = [];
      for (const chunked of thread) {
        const response = await fetchAttributes({
          body: JSON.stringify({
            filter: formatObject<
              InternalQueryFilter<ValidSupplierAttributeForMatching>
            >({
              key: {
                $in: chunked,
              },
            }),
          }),
        });

        response.data.forEach((attr) => {
          responses.push(attr);
        });
      }

      return responses;
    })
  )
    .then(flatten)
    .then((attributes) => {
      return attributes;
    });
}

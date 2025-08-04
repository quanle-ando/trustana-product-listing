import { fetchAttributes } from "@/app/services/fetchAttributes.api";
import AttributeColumnClient from "./AttributeColumnClient";
import { ArrayElement } from "@/app/types/typeUtils";
import keyBy from "lodash/keyBy";

export type MappedAttributeType = ArrayElement<
  Awaited<ReturnType<typeof fetchAttributes>>["data"]
>;

export default async function AttributeColumnServer() {
  const attributeResponse = await fetchAttributes({
    body: JSON.stringify({
      sort: { field: "group", order: "ASC" },
    }),
  });

  const attributeMap = new Map(
    Object.entries(keyBy(attributeResponse.data, "key"))
  );

  return (
    <AttributeColumnClient
      initialAttributes={attributeResponse.data}
      initialTotal={attributeResponse.total}
      initialAttributeMap={attributeMap}
    />
  );
}

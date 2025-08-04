import { fetchAttributes } from "@/app/services/fetchAttributes.api";
import AttributeColumnClient from "./AttributeColumnClient";
import { ArrayElement } from "@/app/types/typeUtils";
import keyBy from "lodash/keyBy";
import { use } from "react";
import { InternalQueryResponse } from "@/app/types/query-engine/common";

export type MappedAttributeType = ArrayElement<
  Awaited<ReturnType<typeof fetchAttributes>>["data"]
>;

export default function AttributeColumnServer({
  promisedSelectedAttributesResopnse,
  promisedAttributesResopnse,
}: {
  promisedSelectedAttributesResopnse: Promise<MappedAttributeType[]>;
  promisedAttributesResopnse: Promise<
    InternalQueryResponse<MappedAttributeType>
  >;
}) {
  const [initialAttributes, initialSelectedAttributes] = [
    use(promisedAttributesResopnse),
    use(promisedSelectedAttributesResopnse),
  ];

  const attributeMap = new Map(
    Object.entries(
      keyBy([...initialAttributes.data, ...initialSelectedAttributes], "key")
    )
  );

  return (
    <AttributeColumnClient
      initialSelectedAttributes={initialSelectedAttributes}
      initialTotal={initialAttributes.total}
      initialAttributeMap={attributeMap}
      initialTotalAttributeCount={initialAttributes.total}
    />
  );
}

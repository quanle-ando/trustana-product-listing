import { fetchAttributes } from "@/app/services/fetchAttributes.api";
import AttributeColumnClient from "./AttributeColumnClient";
import { ArrayElement } from "@/app/types/typeUtils";
import keyBy from "lodash/keyBy";
import { use } from "react";

export type MappedAttributeType = ArrayElement<
  Awaited<ReturnType<typeof fetchAttributes>>["data"]
>;

export default function AttributeColumnServer({
  promisedSelectedAttributesResopnse,
  promisedAttributesResopnse,
}: {
  promisedSelectedAttributesResopnse: Promise<MappedAttributeType[]>;
  promisedAttributesResopnse: Promise<MappedAttributeType[]>;
}) {
  const [initialAttributes, initialSelectedAttributes] = [
    use(promisedAttributesResopnse),
    use(promisedSelectedAttributesResopnse),
  ];

  const attributeMap = new Map(
    Object.entries(
      keyBy([...initialAttributes, ...initialSelectedAttributes], "key")
    )
  );

  return (
    <AttributeColumnClient
      initialSelectedAttributes={initialSelectedAttributes}
      initialAttributes={initialAttributes}
      initialTotal={attributeMap.size}
      initialAttributeMap={attributeMap}
    />
  );
}

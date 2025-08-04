import { Select } from "antd";
import React, { useMemo } from "react";
import { useQueryBuilderModalStore } from "../model/queryBuilderModal.model";
import { AttributeFieldType } from "@/app/enums/attribute";
import { InternalFilterValue } from "@/app/types/query-engine/common";
import {
  CompositeAttributeMapSelector,
  useAttributesStore,
} from "@/app/containers/AttributeColumn/model/attributes.store";
import { twJoin } from "tailwind-merge";

const OPERATOR_MAP = Object.fromEntries([
  ["$eq", { value: "$eq", label: "Equals" }],
  ["$ne", { value: "$ne", label: "Not equals" }],
  ["$regex", { value: "$regex", label: "Matches pattern" }],
  ["$gt", { value: "$gt", label: ">" }],
  ["$gte", { value: "$gte", label: ">=" }],
  ["$lt", { value: "$lt", label: "<" }],
  ["$lte", { value: "$lte", label: "<=" }],
  ["$exists", { value: "$exists", label: "Exists" }],
  ["$in", { value: "$in", label: "In" }],
] satisfies Array<[keyof InternalFilterValue, { value: keyof InternalFilterValue; label: string }]>) as Record<
  keyof InternalFilterValue,
  { value: keyof InternalFilterValue; label: string }
>;

const ALL_OPTIONS = Object.values(OPERATOR_MAP);

const TYPE_OPTIONS: Record<string, typeof ALL_OPTIONS> = {
  [AttributeFieldType.DATE]: [
    OPERATOR_MAP["$eq"],
    OPERATOR_MAP["$gt"],
    OPERATOR_MAP["$gte"],
    OPERATOR_MAP["$lt"],
    OPERATOR_MAP["$lte"],
    OPERATOR_MAP["$ne"],
    OPERATOR_MAP["$exists"],
  ],

  [AttributeFieldType.DATETIME]: [
    OPERATOR_MAP["$eq"],
    OPERATOR_MAP["$gt"],
    OPERATOR_MAP["$gte"],
    OPERATOR_MAP["$lt"],
    OPERATOR_MAP["$lte"],
    OPERATOR_MAP["$ne"],
    OPERATOR_MAP["$exists"],
  ],

  [AttributeFieldType.DROPDOWN]: [
    OPERATOR_MAP["$in"],
    OPERATOR_MAP["$ne"],
    OPERATOR_MAP["$exists"],
  ],

  [AttributeFieldType.MULTI_SELECT]: [
    OPERATOR_MAP["$in"],
    OPERATOR_MAP["$ne"],
    OPERATOR_MAP["$exists"],
  ],

  [AttributeFieldType.NUMBER]: [
    OPERATOR_MAP["$eq"],
    OPERATOR_MAP["$gt"],
    OPERATOR_MAP["$gte"],
    OPERATOR_MAP["$in"],
    OPERATOR_MAP["$lt"],
    OPERATOR_MAP["$lte"],
    OPERATOR_MAP["$ne"],
    OPERATOR_MAP["$exists"],
  ],

  [AttributeFieldType.TEXT]: [
    OPERATOR_MAP["$eq"],
    OPERATOR_MAP["$ne"],
    OPERATOR_MAP["$exists"],
    OPERATOR_MAP["$in"],
    OPERATOR_MAP["$regex"],
  ],

  [AttributeFieldType.LONG_TEXT]: [
    OPERATOR_MAP["$eq"],
    OPERATOR_MAP["$ne"],
    OPERATOR_MAP["$exists"],
    OPERATOR_MAP["$in"],
    OPERATOR_MAP["$regex"],
  ],

  [AttributeFieldType.RICH_TEXT]: [
    OPERATOR_MAP["$eq"],
    OPERATOR_MAP["$ne"],
    OPERATOR_MAP["$exists"],
    OPERATOR_MAP["$in"],
    OPERATOR_MAP["$regex"],
  ],
};

export default function OperatorField({
  operationKey,
}: {
  operationKey: string;
}) {
  const { internalQuery } = useQueryBuilderModalStore().state;

  const operation = internalQuery.get(operationKey);
  const { compositeAttributeMap } = CompositeAttributeMapSelector(
    useAttributesStore()
  );

  const options = useMemo(() => {
    const attribute = compositeAttributeMap.get(
      String(operation?.attributeKey)
    );
    if (!attribute) {
      return ALL_OPTIONS;
    }

    return TYPE_OPTIONS[attribute.type] || ALL_OPTIONS;
  }, [compositeAttributeMap, operation?.attributeKey]);

  return (
    <div className={twJoin("bg-white", "z-0")}>
      <Select
        value={operation?.operator}
        showSearch
        disabled={!operation?.attributeKey}
        popupMatchSelectWidth={false}
        className="min-w-[150px]"
        placeholder="Operator"
        options={options}
        onChange={(val) => {
          useQueryBuilderModalStore.getState().functions.updateOperation({
            key: operationKey,
            value: {
              operator: val,
              condition: (() => {
                if (val === "$exists") {
                  return "true";
                }

                return operation?.operator === "$exists"
                  ? ""
                  : operation?.condition;
              })(),
            },
          });
        }}
      />
    </div>
  );
}

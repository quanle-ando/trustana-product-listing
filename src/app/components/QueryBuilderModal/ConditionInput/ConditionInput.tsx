import { DatePicker, Input, InputNumber, Select } from "antd";
import React, { useMemo } from "react";
import { useQueryBuilderModalStore } from "../model/queryBuilderModal.model";
import {
  CompositeAttributeMapSelector,
  useAttributesStore,
} from "@/app/containers/AttributeColumn/model/attributes.store";
import { AttributeFieldType } from "@/app/enums/attribute";
import { twJoin } from "tailwind-merge";
import { castArray } from "lodash";
import FriendlyDateTextField, {
  processCombinedDateText,
} from "./FriendlyDateTextField/FriendlyDateTextField";

export default function ConditionInput({
  operationKey,
}: {
  operationKey: string;
}) {
  const { internalQuery } = useQueryBuilderModalStore().state;
  const { compositeAttributeMap } = CompositeAttributeMapSelector(
    useAttributesStore()
  );

  const operation = internalQuery.get(operationKey);

  const isDisabled = !operation?.attributeKey || !operation.operator;

  const { isDatetime, isNumber, options } = useMemo(() => {
    const { attributeKey } = operation || {};
    const attribute = compositeAttributeMap.get(String(attributeKey));
    const type = attribute?.type;

    return {
      isNumber: type === AttributeFieldType.NUMBER,
      isDatetime:
        type === AttributeFieldType.DATE ||
        type === AttributeFieldType.DATETIME,
      options: attribute?.option?.selection,
    };
  }, [compositeAttributeMap, operation]);

  if (isNumber) {
    return (
      <InputNumber
        stringMode
        changeOnWheel
        value={operation?.condition?.toString()}
        className={twJoin("flex-1")}
        placeholder="Type number here"
        onChange={(e) => {
          useQueryBuilderModalStore.getState().functions.updateOperation({
            key: operationKey,
            value: { condition: e?.toString() || undefined },
          });
        }}
      />
    );
  }

  if (options) {
    return (
      <div className={twJoin("bg-white", "flex-1", "z-0")}>
        <Select
          mode="tags"
          disabled={isDisabled}
          className={twJoin("w-full")}
          popupMatchSelectWidth={false}
          placeholder="Search and select values ..."
          options={options.map((option) => ({ value: option, label: option }))}
          value={operation?.condition}
          onChange={(_, selectedOption) => {
            const selectedOptions = castArray(selectedOption);
            useQueryBuilderModalStore.getState().functions.updateOperation({
              key: operationKey,
              value: { condition: selectedOptions.map((o) => o.value) },
            });
          }}
        />
      </div>
    );
  }

  if (isDatetime) {
    return (
      <div className={twJoin("flex", "flex-row", "gap-[16px]", "z-0")}>
        <div className={twJoin("bg-white", "w-[170px]")}>
          <DatePicker
            placeholder="Select a date"
            disabled={isDisabled}
            className={twJoin("w-full")}
            value={processCombinedDateText(operation?.condition).dayjsObj}
            onChange={(val) => {
              useQueryBuilderModalStore.getState().functions.updateOperation({
                key: operationKey,
                value: { condition: !val ? undefined : String(+val.toDate()) },
              });
            }}
          />
        </div>

        <div className={twJoin("bg-white", "w-[270px]")}>
          <FriendlyDateTextField
            rawValue={operation?.condition}
            isDisabled={isDisabled}
            operationKey={operationKey}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={twJoin("flex-1", "bg-white", "z-0")}>
      <Input
        value={operation?.condition}
        disabled={isDisabled}
        placeholder="Type text here ..."
        className="z-10"
        onChange={(e) => {
          useQueryBuilderModalStore.getState().functions.updateOperation({
            key: operationKey,
            value: { condition: e.target.value },
          });
        }}
      />
    </div>
  );
}

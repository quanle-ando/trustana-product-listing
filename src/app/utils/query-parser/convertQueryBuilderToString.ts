import { useQueryBuilderModalStore } from "../../components/QueryBuilderModal/model/queryBuilderModal.model";
import {
  CompositeAttributeMapSelector,
  useAttributesStore,
} from "@/app/containers/AttributeColumn/model/attributes.store";
import { AttributeFieldType } from "@/app/enums/attribute";
import dayjs from "dayjs";

function handleConditionValue({
  value,
  isDateField,
}: {
  value: string | string[];
  isDateField: boolean;
}) {
  if (isDateField) {
    const [dateString, friendlyDateString] = String(value).split("|");

    return `dt(${
      friendlyDateString || dayjs(+dateString).format("YYYY-MM-DD")
    })`;
  }

  if (Array.isArray(value)) {
    return `(${value.map((val) => `"${val}"`).join(" OR ")})`;
  }

  return value;
}

export function convertQueryBuilderToString() {
  const { internalQuery } = useQueryBuilderModalStore.getState().state;
  const { compositeAttributeMap } = CompositeAttributeMapSelector(
    useAttributesStore.getState()
  );
  const queries: string[] = [];

  internalQuery.forEach((value) => {
    const { attributeKey, condition, operator } = value;
    const attribute = compositeAttributeMap.get(String(attributeKey));

    if (!attributeKey || !condition || !operator || !attribute) {
      return;
    }

    const isDateField =
      attribute.type === AttributeFieldType.DATE ||
      attribute.type === AttributeFieldType.DATETIME;

    queries.push(
      (() => {
        switch (operator) {
          case "$eq": {
            return `${attributeKey}:${handleConditionValue({
              isDateField: isDateField,
              value: condition,
            })}`;
          }
          case "$exists": {
            return `${attributeKey}:*`;
          }
          case "$gt": {
            return `${attributeKey}>=${handleConditionValue({
              isDateField: isDateField,
              value: condition,
            })}`;
          }
          case "$gte": {
            return `${attributeKey}>=${handleConditionValue({
              isDateField: isDateField,
              value: condition,
            })}`;
          }
          case "$in": {
            return `${attributeKey}:(${String(condition)
              .trim()
              .split(",")
              .map((val) => `"${val.trim()}"`)
              .join(" OR ")})`;
          }
          case "$lt": {
            return `${attributeKey}<${handleConditionValue({
              isDateField: isDateField,
              value: condition,
            })}`;
          }
          case "$lte": {
            return `${attributeKey}<=${handleConditionValue({
              isDateField: isDateField,
              value: condition,
            })}`;
          }
          case "$ne": {
            return `NOT ${attributeKey}:${handleConditionValue({
              isDateField: isDateField,
              value: condition,
            })}`;
          }
          case "$regex": {
            return `${attributeKey}:regexp(${condition})`;
          }
        }
      })()
    );
  });

  return queries;
}

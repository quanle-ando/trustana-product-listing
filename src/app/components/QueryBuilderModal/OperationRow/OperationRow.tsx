import { Button } from "antd";
import { twJoin } from "tailwind-merge";
import LazySearchAttribute from "../LazySearchAttribute/LazySearchAttribute";
import { useQueryBuilderModalStore } from "../model/queryBuilderModal.model";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import OperationRowModuleCss from "./_OperationRow.module.css";
import ConditionInput from "../ConditionInput/ConditionInput";
import OperatorField from "../OperatorField/OperatorField";
import {
  CompositeAttributeMapSelector,
  useAttributesStore,
} from "@/app/containers/AttributeColumn/model/attributes.store";
import { AttributeFieldType } from "@/app/enums/attribute";

export default function OperationRow({
  operationKey,
  isFirst,
  isLast,
}: {
  operationKey: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const { internalQuery } = useQueryBuilderModalStore().state;
  const { compositeAttributeMap } = CompositeAttributeMapSelector(
    useAttributesStore()
  );
  const operation = internalQuery.get(operationKey);

  const attribute = compositeAttributeMap.get(String(operation?.attributeKey));

  const lastOp = useMemo(
    () => Array.from(internalQuery.values()).pop(),
    [internalQuery]
  );

  const disableAddAnotherFilter = useMemo(() => {
    return !lastOp?.attributeKey || !lastOp.operator || !lastOp.condition;
  }, [lastOp?.attributeKey, lastOp?.condition, lastOp?.operator]);

  const isDateRow =
    attribute?.type === AttributeFieldType.DATE ||
    attribute?.type === AttributeFieldType.DATETIME;

  return (
    <div className={twJoin("relative")}>
      {!isFirst && (
        <>
          <div
            className={twJoin(
              "connect-to-prev",
              OperationRowModuleCss.connectingLine,
              operation?.operator === "$exists" && "exist-row",
              isDateRow && "date-row",
              isLast && "is-last-op",
              "border-gray-300"
            )}
          />
          <div className={twJoin(OperationRowModuleCss.andConnector)}>AND</div>
        </>
      )}
      {!isLast && (
        <div
          className={twJoin(
            isFirst && "first",
            OperationRowModuleCss.connectingLine,
            operation?.operator === "$exists" && "exist-row",
            isDateRow && "date-row",
            "border-gray-300"
          )}
        />
      )}
      <div className={twJoin("flex", "flex-row", "gap-[16px]", "ml-[24px]")}>
        <LazySearchAttribute operationKey={operationKey} />
        <OperatorField operationKey={operationKey} />
        {operation?.operator !== "$exists" && (
          <ConditionInput operationKey={operationKey} />
        )}

        {!isFirst && (
          <CloseOutlined
            className={twJoin("cursor-pointer")}
            data-testid={`remove-${operation?.attributeKey}`}
            onClick={() => {
              useQueryBuilderModalStore
                .getState()
                .functions.deleteCondition({ key: operationKey });
            }}
          />
        )}
      </div>
      {isLast && (
        <div className={twJoin("text-center")}>
          <Button
            size="small"
            type="link"
            icon={<PlusOutlined />}
            disabled={disableAddAnotherFilter}
            onClick={() => {
              useQueryBuilderModalStore.getState().functions.addNewCondition();
            }}
          >
            Add another filter
          </Button>
        </div>
      )}
    </div>
  );
}

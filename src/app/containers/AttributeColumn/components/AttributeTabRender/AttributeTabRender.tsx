"use client";

import { twJoin } from "tailwind-merge";
import { useColumnsStore } from "../../../ProductTable/model/columns.store";
import { mapAttributeToColumn } from "../../../../utils/data-mapping/mapAttributeToColumn.util";
import { MappedAttributeType } from "../../AttributeColumnServer";
import { useAttributesStore } from "../../model/attributes.store";
import KeyLabel from "@/app/components/KeyLabel/KeyLabel";
import { EyeOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import { dayJsOrUndefined } from "@/app/utils/dayJsOrUndefined";
import useAppendQueryParamsOnClient from "@/app/utils/url-helpers/appendQueryParamsOnClient.url-helper";

export default function AttributeTabRender({
  attribute,
}: {
  attribute: MappedAttributeType;
}) {
  const { selectedAttributes, attributeMap } = useAttributesStore().state;

  const { appendQueryParamsOnClient } = useAppendQueryParamsOnClient();

  return (
    <div
      className={twJoin(
        "cursor-pointer",
        "hover:bg-blue-400/15",
        "px-[8px]",
        "py-[2px]",
        "rounded-[8px]",
        selectedAttributes.has(attribute.key) && "bg-blue-400/10",
        "flex",
        "flex-row"
      )}
      onClick={() => {
        if (!selectedAttributes.delete(attribute.key)) {
          selectedAttributes.add(attribute.key);
        }

        useAttributesStore.getState().functions.updateStore({
          selectedAttributes: new Set(selectedAttributes),
        });

        useColumnsStore.getState().functions.updateStore({
          displayColumns: Array.from(selectedAttributes).map((attrKey) => {
            const theAttr = attributeMap.get(attrKey);

            return mapAttributeToColumn({
              ...theAttr!,
              key: attrKey,
            });
          }),
        });

        appendQueryParamsOnClient({
          attributes: Array.from(selectedAttributes).join(),
        });
      }}
    >
      <div className={twJoin("flex-1", "overflow-hidden", "text-ellipsis")}>
        <div
          className={twJoin(
            "cursor-pointer",
            "text-[13px]",
            selectedAttributes.has(attribute.key) && "font-bold"
          )}
          title={attribute._nameConcat}
        >
          {attribute._nameConcatTruncated}
        </div>

        <div className={twJoin("w-full", "overflow-hidden", "break-words")}>
          <KeyLabel>{attribute.key}</KeyLabel>
        </div>
      </div>

      <Popover
        placement="right"
        title={
          <div
            className={twJoin(
              "flex",
              "flex-row",
              "gap-[8px]",
              "max-w-[30vw]",
              "text-[14px]",
              "items-center"
            )}
          >
            <div>{attribute.name}</div>
            <div className={twJoin("text-gray-400", "text-[13px]")}>
              • {attribute.key}
            </div>
          </div>
        }
        content={
          <div
            className={twJoin(
              "flex",
              "flex-col",
              "gap-[8px]",
              "max-w-[30vw]",
              "text-[12px]"
            )}
          >
            <div
              className={twJoin("grid", "grid-cols-[auto_auto]", "gap-[8px]")}
            >
              <div>
                <b>Group: </b>
              </div>
              <div>{attribute.group}</div>

              <div>
                <b>Type: </b>
              </div>
              <div>{attribute.type}</div>

              <div>
                <b>Description: </b>
              </div>
              <div>{attribute.description || "-"}</div>

              <div>
                <b>Created: </b>
              </div>
              <div>
                {dayJsOrUndefined(attribute.createdAt)?.format(
                  "YYYY-MM-DD HH:mm:ss"
                ) || "-"}
              </div>

              <div>
                <b>Updated: </b>
              </div>
              <div>
                {dayJsOrUndefined(attribute.updatedAt)?.format(
                  "YYYY-MM-DD HH:mm:ss"
                ) || "-"}
              </div>
            </div>
          </div>
        }
      >
        <EyeOutlined className={twJoin("text-[16px]", "cursor-pointer")} />
      </Popover>
    </div>
  );
}

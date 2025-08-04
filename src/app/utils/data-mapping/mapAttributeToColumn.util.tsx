import { AttributeFieldType } from "@/app/enums/attribute";
import { SupplierAttribute } from "@/app/types/attribute";
import { formatObject } from "@/app/utils/formatObject";
import { ColumnType } from "antd/es/table";

export function mapAttributeToColumn(attr: SupplierAttribute) {
  const isRichText = attr.type === AttributeFieldType.RICH_TEXT;

  return {
    ...formatObject<ColumnType<typeof attr>>({
      title: attr.name,
      dataIndex: `__attribute_${attr.key}`,
      width: 400,
    }),
    __isRichText: isRichText,
    __attr: attr,
  };
}

export type MappedColumnType = ReturnType<typeof mapAttributeToColumn>;

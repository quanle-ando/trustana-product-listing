import { SupplierAttribute } from "@/app/types/attribute";
import truncate from "lodash/truncate";

export function mapAttribute(attr: SupplierAttribute) {
  const nameConcat = [attr.group, attr.name].join(" - ");

  return {
    ...attr,
    _nameConcat: nameConcat,
    _nameConcatTruncated: truncate(nameConcat, {
      length: 50,
    }),
    _filterString: [attr.name, attr.group].join("\n").toUpperCase(),
    _alias: `{{ ${attr.name} }}`,
  };
}

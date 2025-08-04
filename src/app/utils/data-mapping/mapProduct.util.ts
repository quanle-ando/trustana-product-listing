import { Product } from "@/app/types/product";
import { VALID_DATE_FORMAT } from "@/app/utils/query-parser/parseValues.util";
import { dayJsOrUndefined } from "@/app/utils/dayJsOrUndefined";
import { PRODUCT_SIZE_LIMIT } from "@/app/services/fetchProducts.api";

export function mapProduct({
  pdt,
  index,
  offset,
}: {
  pdt: Product;
  index: number;
  offset: number;
}) {
  return {
    ...pdt,
    _createdAtDate: dayJsOrUndefined(pdt.createdAt)?.format(VALID_DATE_FORMAT),
    _updatedAtDate: dayJsOrUndefined(pdt.updatedAt)?.format(VALID_DATE_FORMAT),
    _counter: index + offset * PRODUCT_SIZE_LIMIT + 1,
    ...Object.fromEntries(
      pdt.attributes.map((attr) => {
        const { key, value } = attr;

        return [`__attribute_${key}`, value];
      })
    ),
  };
}

export type MappedProductType = ReturnType<typeof mapProduct>;

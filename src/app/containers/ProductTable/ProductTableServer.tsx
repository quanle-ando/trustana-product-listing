import ProductTableClient from "./ProductTableClient";
import { MappedAttributeType } from "../AttributeColumn/AttributeColumnServer";
import { mapAttributeToColumn } from "../../utils/data-mapping/mapAttributeToColumn.util";
import { mapProduct } from "../../utils/data-mapping/mapProduct.util";
import { mapAttribute } from "../../utils/data-mapping/mapAttribute.util";
import { InternalQueryResponse } from "@/app/types/query-engine/common";
import { Product } from "@/app/types/product";
import { ProductStoreType } from "./model/products.store";
import { use } from "react";

export default function ProductTableServer({
  promisedProductsResponse,
  promisedSelectedAttributesResopnse,
  initialColumnKeys,
  initialPage,
  initialSort,
}: {
  promisedSelectedAttributesResopnse: Promise<MappedAttributeType[]>;
  promisedProductsResponse: Promise<InternalQueryResponse<Product>>;
  initialColumnKeys: string[];
  initialPage: number;
  initialSort: undefined | ProductStoreType["sort"];
}) {
  const [productResponse, attributeResponses] = [
    use(promisedProductsResponse),
    use(promisedSelectedAttributesResopnse),
  ];

  const attributeMap = new Map<string, MappedAttributeType>(
    attributeResponses.map((attr) => {
      return [attr.key, mapAttribute(attr)];
    })
  );

  const mappedData = productResponse.data.map((pdt, index) => {
    return mapProduct({
      index,
      pdt,
      offset: initialPage,
    });
  });

  const columns = Array.from(attributeMap.entries()).map(([, attr]) => {
    return mapAttributeToColumn(attr);
  });

  return (
    <ProductTableClient
      initialData={mappedData}
      initialColumns={columns}
      initialColumnKeys={initialColumnKeys}
      initialAttributes={Array.from(attributeMap.values())}
      initialTotalCount={productResponse.total}
      initialPage={initialPage}
      initialSort={initialSort}
    />
  );
}

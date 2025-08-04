import {
  SupplierAttribute,
  ValidSupplierAttributeForMatching,
} from "@/app/types/attribute";
import {
  InternalQueryFilter,
  InternalQueryResponse,
} from "@/app/types/query-engine/common";
import { formatObject } from "@/app/utils/formatObject";
import ProductTableClient from "./ProductTableClient";
import { BASE_URL } from "@/app/constants/BASE_URL";
import { MappedAttributeType } from "../AttributeColumn/AttributeColumnServer";
import { mapAttributeToColumn } from "../../utils/data-mapping/mapAttributeToColumn.util";
import { mapProduct } from "../../utils/data-mapping/mapProduct.util";
import { mapAttribute } from "../../utils/data-mapping/mapAttribute.util";
import { useAttributesStore } from "../AttributeColumn/model/attributes.store";
import { fetchProductsUsingCurrentConditions } from "@/app/services/helpers/fetchProductsUsingCurrentConditions.api-helper";
import orderBy from "lodash/orderBy";
import { useProductsStore } from "./model/products.store";

export default async function ProductTableServer() {
  const initialColumnKeys = Array.from(
    useAttributesStore.getState().state.selectedAttributes
  );

  const initialColumnKeysMap = new Map(
    initialColumnKeys.map((key, index) => [key, index])
  );

  const [productResponse, attributeResponses] = await Promise.all([
    fetchProductsUsingCurrentConditions(),

    fetch(`${BASE_URL}/api/attributes`, {
      method: "POST",
      body: JSON.stringify({
        filter: formatObject<
          InternalQueryFilter<ValidSupplierAttributeForMatching>
        >({
          key: {
            $in: initialColumnKeys,
          },
        }),
      }),
    })
      .then(
        (res) => res.json() as Promise<InternalQueryResponse<SupplierAttribute>>
      )
      .then((res) => res.data),
  ]);

  const attributeMap = new Map<string, MappedAttributeType>(
    orderBy(attributeResponses, (attr) =>
      Number(initialColumnKeysMap.get(attr.key))
    ).map((attr) => {
      return [attr.key, mapAttribute(attr)];
    })
  );

  const mappedData = productResponse.data.map((pdt, index) => {
    return mapProduct({
      index,
      pdt,
      offset: useProductsStore.getState().state.page,
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
    />
  );
}

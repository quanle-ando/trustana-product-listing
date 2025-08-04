import ProductTableClient from "./ProductTableClient";
import { MappedAttributeType } from "../AttributeColumn/AttributeColumnServer";
import { mapAttributeToColumn } from "../../utils/data-mapping/mapAttributeToColumn.util";
import { mapProduct } from "../../utils/data-mapping/mapProduct.util";
import { mapAttribute } from "../../utils/data-mapping/mapAttribute.util";
import orderBy from "lodash/orderBy";
import { useProductsStore } from "./model/products.store";
import { fetchAllAttributesByKeys } from "@/app/services/helpers/fetchAllAttributesByKeys.api-helper";
import {
  fetchProducts,
  PRODUCT_SIZE_LIMIT,
} from "@/app/services/fetchProducts.api";
import { isValidNumber } from "@/app/utils/isValidNumber";
import { convertQueryStringToFilterObject } from "@/app/utils/query-parser/convertQueryStringToFilterObject.util";
import { generateProductFilters } from "@/app/utils/query-parser/generateProductFilters.util";

const DEFAULT_COLUMNS = ["name", "brand"];

export type QueryType = {
  attributes?: string;
  query?: string;
  sort?: string;
  sortDir?: string;
  page?: string;
  skuIds?: string;
};

export default async function ProductTableServer({
  queries,
}: {
  queries: QueryType;
}) {
  const { attributes, query, sort, sortDir, page } = queries;

  const initialColumnKeys =
    attributes?.split(",").map((key) => key.trim()) || DEFAULT_COLUMNS;

  const initialColumnKeysMap = new Map(
    initialColumnKeys.map((key, index) => [key, index])
  );

  const [productResponse, attributeResponses] = await Promise.all([
    fetchProducts({
      body: {
        filter: !query
          ? undefined
          : generateProductFilters(
              convertQueryStringToFilterObject({ luceneQuery: query })
            ),
        ...(sort && {
          sort: {
            field: sort,
            order: sortDir === "descend" ? "DESC" : "ASC",
          },
        }),
        pagination: {
          limit: PRODUCT_SIZE_LIMIT,
          offset: (isValidNumber(page) ? Number(page) : 0) * PRODUCT_SIZE_LIMIT,
        },
      },
    }),
    fetchAllAttributesByKeys({ attributeKeys: initialColumnKeys }),
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

import ClientRouter from "@/app/components/ClientRouter/ClientRouter";
import WebVitals from "@/app/components/WebVitals/WebVitals";
import AttributeColumnServer from "@/app/containers/AttributeColumn/AttributeColumnServer";
import ProductLuceneSearchBar from "@/app/containers/ProductLuceneSearchBar/ProductLuceneSearchBar";
import ProductTableServer from "@/app/containers/ProductTable/ProductTableServer";
import { fetchAttributes } from "@/app/services/fetchAttributes.api";
import {
  fetchProducts,
  PRODUCT_SIZE_LIMIT,
} from "@/app/services/fetchProducts.api";
import { fetchAllAttributesByKeys } from "@/app/services/helpers/fetchAllAttributesByKeys.api-helper";
import { isValidNumber } from "@/app/utils/isValidNumber";
import { convertQueryStringToFilterObject } from "@/app/utils/query-parser/convertQueryStringToFilterObject.util";
import { generateProductFilters } from "@/app/utils/query-parser/generateProductFilters.util";
import { Skeleton } from "antd";
import { orderBy } from "lodash";
import React, { Suspense } from "react";
import { twJoin } from "tailwind-merge";

export type QueryType = {
  attributes?: string;
  query?: string;
  sort?: string;
  sortDir?: "ascend" | "descend";
  page?: string;
  skuIds?: string;
};

const DEFAULT_COLUMNS = ["name", "brand"];

export default function Main({ queries }: { queries: QueryType }) {
  const { attributes, query, sort, sortDir, page } = queries;

  const initialColumnKeys =
    attributes?.split(",").map((key) => key.trim()) || DEFAULT_COLUMNS;

  const initialColumnKeysMap = new Map(
    initialColumnKeys.map((key, index) => [key, index])
  );

  const initialPage = isValidNumber(page) ? Number(page) : 0;

  const promisedProductsResponse = fetchProducts({
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
        offset: initialPage * PRODUCT_SIZE_LIMIT,
      },
    },
  });

  const promisedSelectedAttributesResopnse = fetchAllAttributesByKeys({
    attributeKeys: initialColumnKeys,
  }).then((attributeResponses) => {
    return orderBy(attributeResponses, (attr) =>
      Number(initialColumnKeysMap.get(attr.key))
    );
  });

  const promisedAttributesResopnse = fetchAttributes({
    body: JSON.stringify({
      sort: { field: "group", order: "ASC" },
    }),
  });

  return (
    <div
      className={twJoin(
        "flex",
        "flex-col",
        "gap-[8px]",
        "h-full",
        "h-screen",
        "overflow-hidden",
        "p-[16px]",
        "w-full",
        "w-screen",
        "text-[14px]"
      )}
    >
      <WebVitals />
      <ClientRouter queries={queries} />
      <ProductLuceneSearchBar initialQuery={query || ""} />
      <div
        className={twJoin(
          "flex",
          "flex-row",
          "h-full",
          "w-full",
          "flex-1",
          "overflow-hidden"
        )}
      >
        <div className={twJoin("pr-[16px]")}>
          <Suspense fallback={<Skeleton active />}>
            <AttributeColumnServer
              promisedSelectedAttributesResopnse={
                promisedSelectedAttributesResopnse
              }
              promisedAttributesResopnse={promisedAttributesResopnse}
            />
          </Suspense>
        </div>

        <div
          className={twJoin(
            "flex-1",
            "flex",
            "flex-col",
            "h-full",
            "w-full",
            "overflow-hidden"
          )}
        >
          <Suspense fallback={<Skeleton active data-testid="abc" />}>
            <ProductTableServer
              promisedSelectedAttributesResopnse={
                promisedSelectedAttributesResopnse
              }
              promisedProductsResponse={promisedProductsResponse}
              initialColumnKeys={initialColumnKeys}
              initialPage={initialPage}
              initialSort={
                !sort
                  ? undefined
                  : {
                      field: sort,
                      dir: sortDir === "descend" ? "descend" : "ascend",
                    }
              }
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

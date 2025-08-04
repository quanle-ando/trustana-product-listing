"use client";

import { useEffect, useMemo, useState } from "react";
import { twJoin } from "tailwind-merge";
import { Button, Skeleton, Table } from "antd";
import {
  updateAttributeMap,
  useAttributesStore,
} from "../AttributeColumn/model/attributes.store";
import { useColumnsStore } from "./model/columns.store";
import { MappedAttributeType } from "../AttributeColumn/AttributeColumnServer";
import { MappedColumnType } from "../../utils/data-mapping/mapAttributeToColumn.util";
import { ProductStoreType, useProductsStore } from "./model/products.store";
import { MappedProductType } from "../../utils/data-mapping/mapProduct.util";
import RenderProductAttribute from "./components/RenderProductAttribute/RenderProductAttribute";
import { castArray } from "lodash";
import KeyLabel from "@/app/components/KeyLabel/KeyLabel";
import { usePushLuceneQueryToUrl } from "@/app/utils/url-helpers/pushLuceneQueryToUrl.url-helper";
import SelectCheckbox from "./components/SelectCheckbox/SelectCheckbox";
import RowSelectionCaretDropdownHeader from "./components/RowSelectionCaretDropdownHeader/RowSelectionCaretDropdownHeader";
import { shareSkuIdsQueryParamsFormatter } from "@/app/utils/url-helpers/shareSkuIdsQueryParamsFormatter.url-helper";
import { PRODUCT_SIZE_LIMIT } from "@/app/services/fetchProducts.api";
import { formatObject } from "@/app/utils/formatObject";

const HEADER_HEIGHT = 55; // From Ant Design

export default function ProductTableClient({
  initialData,
  initialColumns,
  initialColumnKeys,
  initialAttributes,
  initialTotalCount,
  initialSort,
  initialPage,
}: {
  initialData: MappedProductType[];
  initialColumns: MappedColumnType[];
  initialColumnKeys: string[];
  initialAttributes: MappedAttributeType[];
  initialTotalCount: number;
  initialSort: undefined | { field: string; dir: "ascend" | "descend" };
  initialPage: number;
}) {
  const [ready, setReady] = useState(false);

  useEffect(function setComponentAsClientReady() {
    setReady(true);
  }, []);

  const [size, setSize] = useState({ width: 100, height: 100 });
  const { displayColumns } = useColumnsStore().state;

  const productStore = useProductsStore().state;

  const { products, sort, totalCount } = useMemo(
    () =>
      !ready
        ? formatObject<
            Pick<ProductStoreType, "products" | "sort" | "totalCount">
          >({
            products: initialData,
            sort: initialSort,
            totalCount: initialTotalCount,
          })
        : productStore,
    [initialData, initialSort, initialTotalCount, productStore, ready]
  );

  const dataMapped = useMemo(() => {
    return (!ready ? initialData : products).map((datum) => {
      return {
        ...datum,
        __hasMoreRow__: false,
        ...Object.fromEntries(
          (!ready ? initialColumns : displayColumns).map((attr) => {
            const { dataIndex } = attr;

            const value = datum[dataIndex as keyof MappedProductType];

            return [dataIndex, value];
          })
        ),
      };
    });
  }, [displayColumns, initialColumns, initialData, products, ready]);

  useEffect(
    function rehydrateColumnsStore() {
      useColumnsStore
        .getState()
        .functions.updateStore({ displayColumns: initialColumns });
    },
    [initialColumns]
  );

  useEffect(
    function rehydrateProductsStore() {
      useProductsStore.getState().functions.updateStore({
        products: initialData,
        totalCount: initialTotalCount,
        page: initialPage,
      });
    },
    [initialData, initialTotalCount, initialPage]
  );

  useEffect(
    function rehydrateAttributesStore() {
      useAttributesStore.getState().functions.updateStore({
        selectedAttributes: new Set(initialColumnKeys),
      });
    },
    [initialColumnKeys]
  );

  useEffect(
    function rehydrateAttributeMap() {
      updateAttributeMap(initialAttributes);
    },
    [initialAttributes]
  );

  const displayColumnsMapped = useMemo(
    () => [
      { title: "No", dataIndex: "_counter", width: 70, fixed: true },
      {
        title: (
          <div>
            <div>SKU ID</div>
            <KeyLabel>pdt.skuId</KeyLabel>
          </div>
        ),
        dataIndex: "skuId",
        width: 200,
        fixed: true,
        sorter: true,
        sortOrder: sort?.field === "skuId" ? sort.dir : null,
      },

      {
        title: (
          <div>
            <div>Created At</div>
            <KeyLabel>pdt.createdAt</KeyLabel>
          </div>
        ),
        dataIndex: "_createdAtDate",
        __sortKey: "createdAt",
        width: 200,
        sorter: true,
        sortOrder: sort?.field === "createdAt" ? sort.dir : null,
      },

      {
        title: (
          <div>
            <div>Updated At</div>
            <KeyLabel>pdt.updatedAt</KeyLabel>
          </div>
        ),
        dataIndex: "_updatedAtDate",
        __sortKey: "updatedAt",
        width: 200,
        sorter: true,
        sortOrder: sort?.field === "updatedAt" ? sort.dir : null,
      },

      ...(!ready ? initialColumns : displayColumns).map((col) => {
        return {
          ...col,
          title: (
            <div>
              <div>{String(col.title)}</div>
              <KeyLabel>{col.__attr.key}</KeyLabel>
            </div>
          ),
          render(value: unknown) {
            return (
              <RenderProductAttribute attribute={col.__attr} value={value} />
            );
          },
        };
      }),

      {
        title: <RowSelectionCaretDropdownHeader />,
        dataIndex: "skuId",
        width: 50,
        fixed: "right" as const,
        render(value: string) {
          return (
            <div className={twJoin("w-full", "text-right")}>
              <SelectCheckbox skuId={value} />
            </div>
          );
        },
      },
    ],
    [displayColumns, initialColumns, ready, sort?.dir, sort?.field]
  );

  const { pushLuceneQueryToUrl } = usePushLuceneQueryToUrl();

  const { selectedProductSkuIds, isLoadingProducts, page } = productStore;

  return (
    <>
      <div
        className={twJoin(
          "flex",
          "flex-row",
          "gap-[8px]",
          "w-full",
          "overflow-hidden"
        )}
      >
        <div className={twJoin("flex-1", "overflow-hidden")}>
          Displaying {Intl.NumberFormat().format(totalCount)} product(s) with{" "}
          {Intl.NumberFormat().format(
            !ready ? initialColumnKeys.length : displayColumns.length
          )}{" "}
          attributes
        </div>

        {!selectedProductSkuIds.size ? null : (
          <div>
            <Button
              type="link"
              onClick={() => {
                window.open(
                  shareSkuIdsQueryParamsFormatter(),
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              <b>
                {Intl.NumberFormat().format(selectedProductSkuIds.size)}{" "}
                selected
              </b>
            </Button>
          </div>
        )}
      </div>

      {!ready ? (
        <div data-testid="placeholder-for-product-table">
          <Skeleton active />
        </div>
      ) : (
        <div
          className={twJoin("flex-1", "overflow-hidden")}
          ref={(ref) => {
            if (!ref) {
              return;
            }
            const observer = new ResizeObserver((entries) => {
              for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setSize((cur) =>
                  cur.height === height && cur.width === width
                    ? cur
                    : { height: height, width: width }
                );
              }
            });

            observer.observe(ref);
          }}
        >
          <Table
            bordered
            scroll={{
              scrollToFirstRowOnChange: true,
              x: size.width,
              y: size.height - HEADER_HEIGHT - 100,
            }}
            loading={isLoadingProducts}
            dataSource={dataMapped}
            pagination={{
              current: page + 1,
              total: totalCount,
              pageSize: PRODUCT_SIZE_LIMIT,
              showSizeChanger: false,
            }}
            onChange={(pagination, _b, sorters) => {
              const sorter = castArray(sorters).at(0);
              const field =
                // @ts-expect-error -- __sortKey is a custom value
                sorter?.column?.__sortKey || sorter?.field;

              const updateProductStore =
                useProductsStore.getState().functions.updateStore;

              updateProductStore({
                page: Math.max(0, (pagination.current || 0) - 1),
              });

              if (!field || !sorter.order) {
                updateProductStore({ sort: undefined });
              } else {
                updateProductStore({
                  sort: { field: String(field), dir: sorter.order },
                });
              }
              pushLuceneQueryToUrl();
            }}
            showSorterTooltip
            rowKey="id"
            virtual={typeof vi === "undefined"}
            columns={displayColumnsMapped}
          />
        </div>
      )}
    </>
  );
}

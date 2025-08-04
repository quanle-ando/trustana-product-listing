import { Modal } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQueryBuilderModalStore } from "./model/queryBuilderModal.model";
import { useProductQueryStore } from "@/app/containers/ProductLuceneSearchBar/model/productQuery.store";
import { twJoin } from "tailwind-merge";
import {
  CompositeAttributeMapSelector,
  useAttributesStore,
} from "@/app/containers/AttributeColumn/model/attributes.store";
import { InternalFilterValue } from "@/app/types/query-engine/common";
import { nanoid } from "nanoid";
import OperationRow from "./OperationRow/OperationRow";
import { convertQueryBuilderToString } from "../../utils/query-parser/convertQueryBuilderToString";
import { convertQueryStringToFilterObject } from "../../utils/query-parser/convertQueryStringToFilterObject.util";
import { usePushLuceneQueryToUrl } from "@/app/utils/url-helpers/pushLuceneQueryToUrl.url-helper";

export type OperationType = {
  attributeKey: string;
  attributeName: string;
  operator: keyof InternalFilterValue;
  condition: string | string[];
};

function useInitInternalQueriesWithFilters() {
  const { filters } = useProductQueryStore().state;
  const { compositeAttributeMap } = CompositeAttributeMapSelector(
    useAttributesStore()
  );

  const flattendInitData = useMemo(() => {
    const entries = Object.entries(filters || {})
      .map(([key, filterValue]) => {
        return {
          attr: compositeAttributeMap.get(key),
          filterValue: filterValue,
        };
      })
      .filter(({ attr }) => attr);

    if (!entries.length) {
      return [{}];
    }

    const operations: Partial<OperationType>[] = [];

    entries.forEach(({ attr, filterValue }) => {
      const attribute = attr!;
      Object.entries(filterValue).forEach(([key, val]) => {
        operations.push({
          attributeKey: attribute.key,
          attributeName: attribute.name,
          condition: (() => {
            if (Array.isArray(val)) {
              return val.join(", ");
            }

            if (key === "$exists") {
              return "";
            }

            return val?.toString() || "";
          })(),
          operator: key as keyof InternalFilterValue,
        });
      });
    });

    return operations;
  }, [compositeAttributeMap, filters]);

  const cache = { flattendInitData: flattendInitData };
  const cacheRef = useRef(cache);
  cacheRef.current = cache;

  useEffect(() => {
    useQueryBuilderModalStore.getState().functions.updateStore({
      internalQuery: new Map(
        cacheRef.current.flattendInitData.map((op) => [
          nanoid(),
          {
            ...op,
            condition: op.operator === "$exists" ? "true" : op.condition,
          },
        ])
      ),
    });
  }, []);
}

function QueryBuilderModalComponent({ open }: { open: boolean }) {
  const [isOpenState, setIsOpenState] = useState(open);

  useInitInternalQueriesWithFilters();
  const { internalQuery } = useQueryBuilderModalStore().state;

  const { pushLuceneQueryToUrl } = usePushLuceneQueryToUrl();

  function onOk() {
    const queryString = convertQueryBuilderToString();
    const luceneQuery = queryString.join(" ");
    useProductQueryStore
      .getState()
      .functions.updateStore({ luceneQuery: luceneQuery });

    const filters = convertQueryStringToFilterObject({
      luceneQuery: luceneQuery,
    });
    useProductQueryStore.getState().functions.updateStore({ filters: filters });
    pushLuceneQueryToUrl();
  }

  return (
    <Modal
      open={isOpenState}
      onCancel={() => {
        setIsOpenState(false);
      }}
      afterClose={() => {
        useQueryBuilderModalStore.getState().functions.clearStore();
      }}
      width="max(1000px, 70vw)"
      title="Query Builder"
      okText="Apply Filters"
      okButtonProps={{ disabled: !internalQuery.size }}
      onOk={() => {
        setIsOpenState(false);
        onOk();
      }}
    >
      <div
        className={twJoin(
          "h-[60vh]",
          "overflow-hidden",
          "flex",
          "flex-col",
          "gap-[32px]"
        )}
      >
        {Array.from(internalQuery.entries()).map((entry, index, array) => {
          const [key] = entry;
          return (
            <OperationRow
              key={key}
              operationKey={key}
              isFirst={!index}
              isLast={entry === array.at(-1)}
            />
          );
        })}
      </div>
    </Modal>
  );
}

const QueryBuilderModal = Object.assign(
  function QueryBuilderModal() {
    const { isOpen } = useQueryBuilderModalStore().state;

    return !isOpen ? null : <QueryBuilderModalComponent open={isOpen} />;
  },
  {
    open() {
      useQueryBuilderModalStore
        .getState()
        .functions.updateStore({ isOpen: true });
    },
  }
);

export default QueryBuilderModal;

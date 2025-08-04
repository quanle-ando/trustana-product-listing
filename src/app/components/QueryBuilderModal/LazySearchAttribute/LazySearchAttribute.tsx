import { Select, Skeleton } from "antd";
import React, { useMemo, useRef, useState } from "react";
import { useQueryBuilderModalStore } from "../model/queryBuilderModal.model";
import {
  CompositeAttributeMapSelector,
  SelectTopAttributesFromMapSelector,
  updateAttributeMap,
  useAttributesStore,
} from "@/app/containers/AttributeColumn/model/attributes.store";
import { twJoin } from "tailwind-merge";
import { castArray, compact, escapeRegExp } from "lodash";
import debounce from "lodash/debounce";
import { formatObject } from "@/app/utils/formatObject";
import { SupplierAttributeQuery } from "@/app/types/query-engine/attribute";
import RenderAttributeOption from "./RenderAttributeOption/RenderAttributeOption";
import {
  ATTRIBUTE_SIZE_LIMIT,
  fetchAttributes,
} from "@/app/services/fetchAttributes.api";

export default function LazySearchAttribute({
  operationKey,
}: {
  operationKey: string;
}) {
  const { internalQuery } = useQueryBuilderModalStore().state;

  const { compositeAttributeMap } = CompositeAttributeMapSelector(
    useAttributesStore()
  );

  const fetchedAttributes = SelectTopAttributesFromMapSelector(
    useAttributesStore()
  );

  const operation = internalQuery.get(operationKey);

  const nextCallRef = useRef(undefined as undefined | (() => Promise<void>));

  const options = useMemo(() => {
    const topOptionsHaveSelected = fetchedAttributes.some(
      (attr) => attr.key === operation?.attributeKey
    );

    const topOptions = fetchedAttributes.map((attr) => {
      return {
        value: attr.key,
        attr,
      };
    });

    if (topOptionsHaveSelected || !operation?.attributeKey) {
      return topOptions;
    }

    const selectedAttr = compositeAttributeMap.get(
      String(operation?.attributeKey)
    );

    return compact([
      {
        value: operation?.attributeKey,
        label: selectedAttr ? (
          <RenderAttributeOption attr={selectedAttr} />
        ) : (
          <b>{operation?.attributeName}</b>
        ),
        attr: { name: operation?.attributeName },
      },

      ...topOptions,
    ]);
  }, [compositeAttributeMap, fetchedAttributes, operation]);

  const [searchText, setSearchText] = useState("");

  const textRegExp = useMemo(
    () => new RegExp(escapeRegExp(searchText), "i"),
    [searchText]
  );

  const filteredOptions = useMemo(
    () =>
      options
        .filter((option) => {
          if (!searchText) {
            return true;
          }

          return textRegExp.test(String(option.attr.name));
        })
        .map((option, _i, arr) => {
          const attr = option.attr;
          return !("key" in attr)
            ? option
            : {
                ...option,
                label: (
                  <RenderAttributeOption
                    attr={attr}
                    {...(option === arr.at(-1) && {
                      loadMoreCallback: async () => {
                        return nextCallRef.current?.();
                      },
                    })}
                  />
                ),
              };
        }),
    [options, searchText, textRegExp]
  );

  const [isSearching, setIsSearching] = useState(false);

  const debounced = useRef(debounce((cb) => cb(), 500));

  function onSearch({ text, offset }: { text: string; offset: number }) {
    return new Promise<void>((resolve) => {
      debounced.current.cancel();
      if (!text) {
        resolve();
        return;
      }

      setIsSearching(true);
      debounced.current(() => {
        fetchAttributes({
          body: JSON.stringify(
            formatObject<SupplierAttributeQuery>({
              filter: { name: { $regex: escapeRegExp(text) } },
              pagination: { offset: offset, limit: ATTRIBUTE_SIZE_LIMIT },
            })
          ),
        })
          .then((res) => {
            nextCallRef.current = !res.pagination.hasMore
              ? undefined
              : () => {
                  return onSearch({
                    offset: offset + ATTRIBUTE_SIZE_LIMIT,
                    text: text,
                  });
                };

            updateAttributeMap(res.data, res.total);
          })
          .finally(() => {
            resolve();
            setIsSearching(false);
          });
      });
    });
  }

  return (
    <Select
      value={
        !operation?.attributeKey
          ? undefined
          : {
              value: operation?.attributeKey,
              label: operation?.attributeName,
            }
      }
      className={twJoin("w-[23%]", "min-w-[200px]")}
      labelInValue
      showSearch
      filterOption={false}
      searchValue={searchText}
      onSearch={(value) => {
        setSearchText(value);
        nextCallRef.current = () => {
          return onSearch({
            offset: 0,
            text: value,
          });
        };
      }}
      placeholder="Type to search ..."
      loading={isSearching}
      popupMatchSelectWidth={false}
      options={filteredOptions}
      notFoundContent={
        isSearching ? (
          <div>
            <Skeleton active />
          </div>
        ) : (
          <div>No attributes found</div>
        )
      }
      virtual={typeof vi === "undefined"}
      onChange={(val, options) => {
        const option = castArray(options).at(0);
        useQueryBuilderModalStore.getState().functions.updateOperation({
          key: operationKey,
          value: { attributeKey: val.value, attributeName: option?.attr.name },
        });
      }}
    />
  );
}

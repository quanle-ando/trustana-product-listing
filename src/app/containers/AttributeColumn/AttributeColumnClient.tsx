"use client";

import { Skeleton, Spin } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { twJoin } from "tailwind-merge";
import { MappedAttributeType } from "./AttributeColumnServer";
import {
  updateAttributeMap,
  useAttributesStore,
} from "./model/attributes.store";
import AttributeTabRender from "./components/AttributeTabRender/AttributeTabRender";
import AttributeLuceneSearchBar from "./components/AttributeLuceneSearchBar/AttributeLuceneSearchBar";
import { useSearchedAttributesStore } from "./model/searchedAttributes.store";
import AttributeSorter from "./components/AttributeSorter/AttributeSorter";
import { useIntersectionObserver } from "@/app/hooks/useIntersectionObserver";
import { fetchAttributesClient } from "@/app/services/helpers/fetchAttributesClient.api-helper";

export default function AttributeColumnClient({
  initialAttributes,
  initialTotal,
  initialAttributeMap,
}: {
  initialAttributes: MappedAttributeType[];
  initialTotal: number;
  initialAttributeMap: Map<string, MappedAttributeType>;
}) {
  const { selectedAttributes, attributeMap, isAttributeQueryBarFocused } =
    useAttributesStore().state;
  const {
    searchedAttributesMap,
    isSearchingAttributes,
    isSearchingFirstAttributes,
    hasMore,
    total,
  } = useSearchedAttributesStore().state;

  const filteredItems = useMemo(
    () => Array.from(searchedAttributesMap.values()),
    [searchedAttributesMap]
  );

  useEffect(() => {
    updateAttributeMap(initialAttributes);
    updateAttributeMap(initialAttributeMap.values());
  }, [initialAttributeMap, initialAttributes]);

  useEffect(() => {
    useSearchedAttributesStore.getState().functions.updateStore({
      searchedAttributesMap: initialAttributeMap,
      page: 0,
      total: initialTotal,
    });
  }, [initialAttributeMap, initialTotal]);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const { targetRef } = useIntersectionObserver({
    onIntersecting() {
      const currentStoreState = useSearchedAttributesStore.getState().state;
      if (
        !currentStoreState.isSearchingAttributes &&
        !currentStoreState.isSearchingAttributes &&
        currentStoreState.hasMore
      ) {
        useSearchedAttributesStore.getState().functions.updateStore({
          page: useSearchedAttributesStore.getState().state.page + 1,
        });
        fetchAttributesClient();
      }
    },
  });

  if (!ready) {
    return <Skeleton active />;
  }

  return (
    <div
      className={twJoin(
        "flex",
        "flex-col",
        "gap-[4px]",
        "h-full",
        "overflow-auto",
        "pb-[16px]",
        "pr-[8px]",
        "text-[12px]",
        "transition-[width]",
        "duration-300",
        "ease-in-out",
        isAttributeQueryBarFocused ? "w-[450px]" : "w-[300px]"
      )}
    >
      <div
        className={twJoin("sticky", "top-0", "bg-white", "pb-[8px]", "z-50")}
      >
        <label>
          <b>Search Attributes</b>
        </label>

        <AttributeLuceneSearchBar />
      </div>

      {!selectedAttributes.size ? null : (
        <>
          <label>
            <b>Selected ({selectedAttributes.size})</b>
          </label>
          <div
            className={twJoin(
              "flex",
              "flex-col",
              "gap-[4px]",
              "border",
              "border-gray-300",
              "rounded-[8px]",
              "py-[8px]",
              "px-[4px]",
              "max-h-[30vh]",
              "shrink-0",
              "overflow-auto"
            )}
          >
            {Array.from(selectedAttributes)
              .map((attrKey) => attributeMap.get(attrKey)!)
              .filter(Boolean)
              .map((attr) => {
                return <AttributeTabRender attribute={attr} key={attr.key} />;
              })}
          </div>
        </>
      )}

      <div
        className={twJoin(
          "flex",
          "flex-row",
          "justify-between",
          "items-center"
        )}
      >
        <div>
          <label>
            <b>
              Attributes ({total} / {initialTotal})
            </b>
          </label>
        </div>

        <AttributeSorter />
      </div>

      <div
        className={twJoin(
          "flex",
          "flex-col",
          "gap-[4px]",
          "border",
          "border-gray-300",
          "rounded-[8px]",
          "py-[8px]",
          "px-[4px]",
          "shrink-0",
          "overflow-auto",
          "relative"
        )}
      >
        {filteredItems.map((attr) => {
          return <AttributeTabRender attribute={attr} key={attr.key} />;
        })}

        {isSearchingAttributes && <Skeleton active paragraph={{ rows: 2 }} />}

        {isSearchingFirstAttributes && (
          <div
            className={twJoin(
              "bg-white/70",
              "absolute",
              "top-0",
              "left-0",
              "right-0",
              "bottom-0",
              "text-center",
              "pt-[16px]"
            )}
          >
            <Spin spinning />
          </div>
        )}

        {hasMore && <div ref={targetRef} />}
      </div>
    </div>
  );
}

"use client";

import LuceneSearchBar from "@/app/components/LuceneSearchBar/LuceneSearchBar";
import React from "react";
import { useProductQueryStore } from "./model/productQuery.store";
import { twJoin } from "tailwind-merge";
import { PicRightOutlined } from "@ant-design/icons";
import QueryBuilderModal from "@/app/components/QueryBuilderModal/QueryBuilderModal";
import { usePushLuceneQueryToUrl } from "@/app/utils/url-helpers/pushLuceneQueryToUrl.url-helper";

export default function ProductLuceneSearchBar() {
  const { luceneQuery } = useProductQueryStore().state;

  const { pushLuceneQueryToUrl } = usePushLuceneQueryToUrl();

  return (
    <div className={twJoin("flex", "flex-row", "gap-[16px]")}>
      <LuceneSearchBar
        luceneQuery={luceneQuery}
        data-testid="product-lucene-textarea"
        setLuceneQuery={(val) => {
          useProductQueryStore
            .getState()
            .functions.updateStore({ luceneQuery: val });
        }}
        onSendQuery={(filters) => {
          useProductQueryStore
            .getState()
            .functions.updateStore({ filters: filters });

          pushLuceneQueryToUrl();
        }}
        placeholder="Query by attributes, e.g. brand:(Apple OR Spartan) name:reqexp(apple) netWeightPerUnitValue>=10 NOT amazonDietType:Vegetarian"
      />

      <PicRightOutlined
        className={twJoin("text-[24px]", "cursor-pointer")}
        data-testid="query-builder-icon"
        onClick={() => {
          QueryBuilderModal.open();
        }}
      />

      <QueryBuilderModal />
    </div>
  );
}

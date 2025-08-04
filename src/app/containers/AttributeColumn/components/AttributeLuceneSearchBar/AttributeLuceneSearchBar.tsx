"use client";

import LuceneSearchBar from "@/app/components/LuceneSearchBar/LuceneSearchBar";
import React from "react";
import { useSearchedAttributesStore } from "../../model/searchedAttributes.store";
import { useAttributesStore } from "../../model/attributes.store";
import { useAttributeQueryStore } from "./model/attributeQuery.store";
import { fetchAttributesUsingCurrentConditions } from "@/app/services/helpers/fetchAttributesUsingCurrentConditions.api-helper";

// e.g. "brand:(Apple OR Spartan) name:reqexp(apple) netWeightPerUnitValue>=10 NOT amazonDietType:Vegetarian"

export default function AttributeLuceneSearchBar() {
  const { luceneQuery } = useAttributeQueryStore().state;

  return (
    <LuceneSearchBar
      luceneQuery={luceneQuery}
      data-testid="attribute-lucene-textarea"
      setLuceneQuery={(val) => {
        useAttributeQueryStore
          .getState()
          .functions.updateStore({ luceneQuery: val });
      }}
      onSendQuery={(filters) => {
        useSearchedAttributesStore.getState().functions.updateStore({
          filters,
          page: 0,
        });

        fetchAttributesUsingCurrentConditions();
      }}
      onFocus={() => {
        useAttributesStore
          .getState()
          .functions.updateStore({ isAttributeQueryBarFocused: true });
      }}
      onBlur={() => {
        useAttributesStore
          .getState()
          .functions.updateStore({ isAttributeQueryBarFocused: false });
      }}
      placeholder={"e.g. name:regexp(description)"}
    />
  );
}

import WebVitals from "@/app/components/WebVitals/WebVitals";
import ProductLuceneSearchBar from "@/app/containers/ProductLuceneSearchBar/ProductLuceneSearchBar";
import React, { ReactNode } from "react";
import { twJoin } from "tailwind-merge";

export default function Main({
  attributeClient,
  clientRouter,
  productClient,
}: {
  clientRouter: ReactNode;
  attributeClient: ReactNode;
  productClient: ReactNode;
}) {
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
      {clientRouter}
      <ProductLuceneSearchBar />
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
        <div className={twJoin("pr-[16px]")}>{attributeClient}</div>

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
          {productClient}
        </div>
      </div>
    </div>
  );
}

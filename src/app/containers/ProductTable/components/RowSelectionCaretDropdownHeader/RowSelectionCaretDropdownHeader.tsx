import { CaretDownOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import React, { useState } from "react";
import { twJoin } from "tailwind-merge";
import { useProductsStore } from "../../model/products.store";

export default function RowSelectionCaretDropdownHeader() {
  const [isVisible, setIsVisible] = useState(false);

  const { products, selectedProductSkuIds } = useProductsStore().state;

  return (
    <div className={twJoin("w-full", "text-right")}>
      <Dropdown
        open={isVisible}
        onOpenChange={(open, { source }) => {
          if (source === "menu") {
            return;
          }

          setIsVisible(open);
        }}
        menu={{
          items: [
            {
              key: "select all shown",
              label: "Select all shown",
              onClick() {
                products.forEach((pdt) => {
                  selectedProductSkuIds.add(pdt.skuId);
                });

                useProductsStore.getState().functions.updateStore({
                  selectedProductSkuIds: new Set(selectedProductSkuIds),
                });
              },
            },
            {
              key: "deselect all shown",
              label: "Deselect all shown",
              onClick() {
                products.forEach((pdt) => {
                  selectedProductSkuIds.delete(pdt.skuId);
                });

                useProductsStore.getState().functions.updateStore({
                  selectedProductSkuIds: new Set(selectedProductSkuIds),
                });
              },
            },
            {
              key: "clear all selections",
              label: "Clear all selections",
              onClick() {
                useProductsStore.getState().functions.updateStore({
                  selectedProductSkuIds: new Set(),
                });
              },
            },
          ],
        }}
      >
        <CaretDownOutlined className="cursor-pointer" />
      </Dropdown>
    </div>
  );
}

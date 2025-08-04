import { SupplierAttribute } from "@/app/types/attribute";
import { SortAscendingOutlined } from "@ant-design/icons";
import { Select } from "antd";
import React, { useMemo, useState } from "react";
import { twJoin } from "tailwind-merge";
import AttributeSorterModuleCss from "./_AttributeSorter.module.css";
import castArray from "lodash/castArray";
import { useSearchedAttributesStore } from "../../model/searchedAttributes.store";
import { fetchAttributesClient } from "@/app/services/helpers/fetchAttributesClient.api-helper";

const SORT_OPTIONS = [
  ["Name A-Z", "name", "ASC"],
  ["Name Z-A", "name", "DESC"],
  ["Last-Created First", "createdAt", "DESC"],
  ["Last-Created Last", "createdAt", "ASC"],
  ["Last-Updated First", "updatedAt", "DESC"],
  ["Last-Updated Last", "updatedAt", "ASC"],
] as const satisfies Array<[string, keyof SupplierAttribute, "ASC" | "DESC"]>;

export default function AttributeSorter() {
  const [open, setOpen] = useState(false);

  const { sort } = useSearchedAttributesStore().state;

  const value = useMemo(
    () => (!sort ? undefined : [sort.key, sort.dir].join()),
    [sort]
  );

  return (
    <Select
      suffixIcon={
        <SortAscendingOutlined
          className={twJoin("text-[18px]")}
          onClick={() => {
            setOpen(true);
          }}
        />
      }
      size="small"
      className={twJoin(AttributeSorterModuleCss.attributeSorter)}
      popupMatchSelectWidth={false}
      placement="bottomRight"
      value={value}
      allowClear
      onChange={(_, options) => {
        const option = castArray(options).at(0);
        useSearchedAttributesStore.getState().functions.updateStore({
          sort: !option
            ? undefined
            : { key: option.option.key, dir: option.option.dir },
        });
        fetchAttributesClient();
      }}
      open={open}
      onOpenChange={setOpen}
      placeholder="No sorting"
      options={SORT_OPTIONS.map(([label, key, dir]) => ({
        label: String(label),
        value: [key, dir].join(),
        option: { key: key, dir: dir },
      }))}
    />
  );
}

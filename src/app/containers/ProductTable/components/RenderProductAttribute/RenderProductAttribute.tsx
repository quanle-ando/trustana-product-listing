"use client";

import React from "react";
import { SupplierAttribute } from "@/app/types/attribute";
import { AttributeFieldType } from "@/app/enums/attribute";
import DOMPurify from "dompurify";
import toString from "lodash/toString";
import { twJoin } from "tailwind-merge";
import { Tag } from "antd";
import castArray from "lodash/castArray";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import compact from "lodash/compact";
import RenderProductAttributeModuleCss from "./_RenderProductAttribute.module.css";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function RenderProductAttribute({
  value,
  attribute,
}: {
  value: unknown;
  attribute: SupplierAttribute;
}) {
  if (!value) {
    return undefined;
  }

  if (attribute.type === AttributeFieldType.RICH_TEXT) {
    return (
      <p
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(toString(value)),
        }}
      />
    );
  }

  if (attribute.type === AttributeFieldType.MEASURE) {
    const castVal = value as {
      value: string | number;
      unit: string;
    };

    return `${castVal.value} ${castVal.unit}`;
  }

  if (attribute.type === AttributeFieldType.PRICE) {
    const currency = attribute.option?.currency;

    return `${value} ${currency}`;
  }

  if (attribute.type === AttributeFieldType.URL) {
    return (
      <a href={String(value)} target="_blank" rel="noopener noreferrer">
        {String(value)}
      </a>
    );
  }

  if (
    attribute.type === AttributeFieldType.DATE ||
    attribute.type === AttributeFieldType.DATETIME
  ) {
    const dateFormat = attribute.option?.dateFormat;
    const timezone = attribute.option?.timezone;

    const dateObj = dayjs(Number(value));

    return dateObj.isValid()
      ? compact([
          dateObj.tz(timezone).format(String(dateFormat)),
          timezone ? `(${timezone})` : undefined,
        ]).join(" ")
      : undefined;
  }

  if (
    attribute.type === AttributeFieldType.DROPDOWN ||
    attribute.type === AttributeFieldType.MULTI_SELECT
  ) {
    return (
      <div
        className={twJoin(
          "flex",
          "flex-row",
          "gap-x-[8px]",
          "gap-y-[4px]",
          "flex-wrap"
        )}
      >
        {castArray(value).map((val, index) => (
          <Tag key={index} className={RenderProductAttributeModuleCss.tag}>
            {String(val)}
          </Tag>
        ))}
      </div>
    );
  }

  return String(value);
}

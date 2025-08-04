import { InternalFilterValue } from "@/app/types/query-engine/common";
import { splitQuery } from "./splitQuery.util";
import merge from "lodash/merge";
import trim from "lodash/trim";
import {
  checkIsDatetimeString,
  handleDateValue,
  parseValues,
} from "./parseValues.util";
import dayjs from "dayjs";

export function convertQueryStringToFilterObject({
  luceneQuery,
}: {
  luceneQuery: string;
}) {
  const filterArr = splitQuery({ query: luceneQuery });

  const filters: Record<string, InternalFilterValue> = {};

  filterArr.forEach((filter) => {
    if (filter.startsWith("NOT ")) {
      const [attributeKey, notVal] = filter.replace(/^NOT /, "").split(":");
      filters[attributeKey] = merge(filters[attributeKey], {
        $ne: (() => {
          if (notVal.startsWith("(") && notVal.endsWith(")")) {
            // Handles not equal with multiple values
            return notVal
              .slice(1, -1)
              .split(" OR ")
              .map((val) => trim(String(parseValues(val)), '"'))
              .join("\n");
          }

          return parseValues(notVal);
        })(),
      });
      return;
    }

    if (filter.includes(":(")) {
      // Range
      const [attributeKey, rangeInfo] = filter.split(":(");

      const theRange = rangeInfo
        ?.split(")")
        .at(0)
        ?.split(" OR ")
        .map((val) => trim(String(parseValues(val)), '"'));

      if (!theRange?.length) {
        return;
      }

      filters[attributeKey] = merge(filters[attributeKey], { $in: theRange });
      return;
    }

    if (filter.endsWith(":*")) {
      const [attributeKey] = filter.split(":*");
      filters[attributeKey] = merge(filters[attributeKey], { $exists: true });
      return;
    }

    if (filter.includes(":regexp(") && filter.endsWith(")")) {
      // Regular Expression
      const [attributeKey, luceneContains] = filter.split(":regexp(");
      filters[attributeKey] = merge(filters[attributeKey], {
        $regex: luceneContains.slice(0, -1),
      });
      return;
    }

    if (filter.includes(":")) {
      const [attributeKey, ...rest] = filter.split(":");
      const value = parseValues(rest.join(":"));
      const { dayjsObject } = checkIsDatetimeString(value);
      if (dayjsObject) {
        filters[attributeKey] = merge(filters[attributeKey], {
          $gte: +dayjsObject.toDate(),
          $lt: +dayjs(dayjsObject).add(1, "day").toDate(),
        });
        return;
      }

      filters[attributeKey] = merge(filters[attributeKey], {
        $eq: trim(String(value), '"'),
      });
      return;
    }

    if (filter.includes(">=")) {
      const [attributeKey, val] = filter.split(">=");

      filters[attributeKey] = merge(filters[attributeKey], {
        $gte: +handleDateValue(val),
      });

      return;
    }

    if (filter.includes("<=")) {
      const [attributeKey, val] = filter.split("<=");
      filters[attributeKey] = merge(filters[attributeKey], {
        $lte: +handleDateValue(val),
      });
      return;
    }

    if (filter.includes(">")) {
      const [attributeKey, val] = filter.split(">");
      filters[attributeKey] = merge(filters[attributeKey], {
        $gt: +handleDateValue(val),
      });
      return;
    }

    if (filter.includes("<")) {
      const [attributeKey, val] = filter.split("<");
      filters[attributeKey] = merge(filters[attributeKey], {
        $lt: +handleDateValue(val),
      });
      return;
    }
  });

  return filters;
}

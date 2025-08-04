import dayjs, { ManipulateType } from "dayjs";
import { dayJsOrUndefined } from "../dayJsOrUndefined";
import { isValidNumber } from "../isValidNumber";

export const VALID_DATE_FORMAT = "YYYY-MM-DD";

export const VALID_MANIPULATE_TYPES = new Set([
  "year",
  "years",
  "month",
  "months",
  "week",
  "weeks",
  "day",
  "days",
  "hour",
  "hours",
  "minute",
  "minutes",
  "second",
  "seconds",
  "millisecond",
  "milliseconds",
]);

export function checkIsDatetimeString<V>(val: V) {
  const stringVal = String(val);

  const isDatetimeString =
    stringVal.startsWith("dt(") && stringVal.endsWith(")");

  return {
    dayjsObject: !isDatetimeString
      ? undefined
      : dayJsOrUndefined(
          String(stringVal.split("dt(").at(-1)?.slice(0, -1)).split("|").at(0)
        ),
  };
}

export function handleDateValue(val: string) {
  const parsedVal = parseValues(val);
  const { dayjsObject } = checkIsDatetimeString(parsedVal);
  return dayjsObject ? dayjsObject.toDate() : parsedVal;
}

export function parseValues(value: unknown) {
  const stringVal = String(value).trim();

  if (stringVal.startsWith("dt(") && stringVal.endsWith(")")) {
    const datetimeString = String(stringVal.split("dt(").at(-1)?.slice(0, -1));

    // Should be "2020-10-10" or "1 week ago"
    const lowerCase = datetimeString.toLowerCase();

    if (lowerCase.endsWith(" ago")) {
      // Possibly a date string
      const [amount, unit] = lowerCase.split(" ");

      if (isValidNumber(amount) && VALID_MANIPULATE_TYPES.has(unit)) {
        const dateObj = dayjs().subtract(
          Number(amount),
          unit as ManipulateType
        );
        return `dt(${dateObj.format("YYYY-MM-DD")}|${lowerCase})`;
      }
    }

    const dateObj = dayjs(datetimeString, [VALID_DATE_FORMAT], true);
    if (dateObj.isValid()) {
      return `dt(${dateObj.format("YYYY-MM-DD")})`;
    }
  }

  return stringVal;
}

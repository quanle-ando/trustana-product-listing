import dayjs, { Dayjs } from "dayjs";

export function dayJsOrUndefined(
  value: string | number | Date | Dayjs | null | undefined
) {
  const dateObj = dayjs(value);
  if (!dateObj.isValid()) {
    return undefined;
  }

  return dateObj;
}

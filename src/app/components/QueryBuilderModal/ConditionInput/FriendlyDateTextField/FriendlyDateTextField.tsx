import { Input } from "antd";
import React, { useEffect, useState } from "react";
import { useQueryBuilderModalStore } from "../../model/queryBuilderModal.model";
import { dayJsOrUndefined } from "@/app/utils/dayJsOrUndefined";
import dayjs, { ManipulateType } from "dayjs";
import { VALID_MANIPULATE_TYPES } from "@/app/utils/query-parser/parseValues.util";

export function processCombinedDateText(value: string | string[] | undefined) {
  const parts = value?.toString().split("|");
  return {
    dayjsObj: dayJsOrUndefined(Number(parts?.at(0))),
    friendlyDateString: parts?.at(1)?.toString() || undefined,
  };
}

export default function FriendlyDateTextField({
  operationKey,
  isDisabled,
  rawValue,
}: {
  operationKey: string;
  isDisabled: boolean;
  rawValue: string | string[] | undefined;
}) {
  const { friendlyDateString } = processCombinedDateText(rawValue);
  const [text, setText] = useState(friendlyDateString);

  useEffect(() => {
    setText(friendlyDateString);
  }, [friendlyDateString]);

  function onValidate() {
    const [val, unit, ...rest] = String(text).toLowerCase().split(" ");
    if (
      rest.join("").toLowerCase() !== "ago" ||
      !VALID_MANIPULATE_TYPES.has(unit)
    ) {
      setText(friendlyDateString);
      return;
    }

    const dayjsObj = dayJsOrUndefined(
      dayjs().subtract(Number(val), unit as ManipulateType)
    );

    if (!dayjsObj) {
      setText(friendlyDateString);
      return;
    }

    setText(text?.trim().toLowerCase());
    useQueryBuilderModalStore.getState().functions.updateOperation({
      key: operationKey,
      value: { condition: [String(+dayjsObj.toDate()), text].join("|") },
    });
  }

  return (
    <Input
      value={text}
      disabled={isDisabled}
      placeholder="Or use friendly text (e.g. 1 week ago)"
      onChange={(e) => {
        setText(e.target.value);
      }}
      onBlur={() => {
        onValidate();
      }}
      onPressEnter={() => {
        onValidate();
      }}
    />
  );
}

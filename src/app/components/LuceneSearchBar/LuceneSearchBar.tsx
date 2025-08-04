"use client";

import { Input } from "antd";
import { convertQueryStringToFilterObject } from "../../utils/query-parser/convertQueryStringToFilterObject.util";
import { InternalFilterValue } from "@/app/types/query-engine/common";
import { twJoin } from "tailwind-merge";
import luceneSearchBarModuleCss from "./_LuceneSearchBar.module.css";
import { TextAreaProps } from "antd/es/input";

export default function LuceneSearchBar({
  onSendQuery,
  placeholder,
  luceneQuery,
  setLuceneQuery,
  ...rest
}: {
  onSendQuery(filters: Record<string, InternalFilterValue>): void;
  placeholder?: string;
} & Pick<TextAreaProps, "onFocus" | "onBlur"> & {
    luceneQuery: string;
    setLuceneQuery(luceneQuery: string): void;
  }) {
  return (
    <Input.TextArea
      {...rest}
      value={luceneQuery}
      name="lucene-search-bar"
      onPressEnter={(e) => {
        e.preventDefault();
        const filters = convertQueryStringToFilterObject({
          luceneQuery: luceneQuery,
        });
        onSendQuery(filters);
      }}
      autoComplete="off"
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck={false}
      className={twJoin(
        "overflow-hidden",
        luceneSearchBarModuleCss.luceneSearchBar
      )}
      allowClear
      onClear={() => {
        onSendQuery({});
      }}
      onPaste={(e) => {
        const clipboard = e.clipboardData.getData("text");
        if (!clipboard.includes("\n")) {
          return;
        }

        const cleaned = clipboard.replace(/\n/g, " ").trim(); // Remove all \n

        // Insert manually at current cursor position
        const target = e.target as HTMLTextAreaElement;
        const { selectionStart, selectionEnd, value } = target;

        e.preventDefault();

        const newValue =
          value.slice(0, selectionStart) + cleaned + value.slice(selectionEnd);

        setLuceneQuery(newValue);
      }}
      autoSize={{ maxRows: 4 }}
      rows={1}
      placeholder={placeholder}
      onChange={(e) => {
        setLuceneQuery(e.target.value);
      }}
    />
  );
}

import React, { PropsWithChildren } from "react";
import { twJoin } from "tailwind-merge";

export default function KeyLabel({ children }: PropsWithChildren) {
  return (
    <label
      className={twJoin("text-gray-400", "text-[13px]", "cursor-text")}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <i>{children}</i>
    </label>
  );
}

"use client";

import { useEffect } from "react";
import { Button } from "antd";
import { twJoin } from "tailwind-merge";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error boundary caught:", error);
  }, [error]);

  return (
    <div
      className={twJoin(
        "text-center",
        "pt-[50px]",
        "flex",
        "flex-col",
        "gap-[16px]"
      )}
    >
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <div>
        <Button type="primary" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  );
}

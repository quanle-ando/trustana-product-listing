import { PartialAttributePropsType } from "@/app/containers/AttributeColumn/model/attributes.store";
import { useIntersectionObserver } from "@/app/hooks/useIntersectionObserver";
import { Skeleton } from "antd";
import { useState, useRef } from "react";
import { twJoin } from "tailwind-merge";

export default function RenderAttributeOption({
  attr,
  loadMoreCallback,
}: {
  attr: PartialAttributePropsType;
  loadMoreCallback?(): Promise<void>;
}) {
  const [, forceUpdate] = useState({});
  const loadingRef = useRef({ isLoading: false });

  const { targetRef } = useIntersectionObserver({
    onIntersecting() {
      if (loadMoreCallback && !loadingRef.current.isLoading) {
        loadingRef.current.isLoading = true;
        forceUpdate({});
        loadMoreCallback().finally(() => {
          loadingRef.current.isLoading = false;
          forceUpdate({});
        });
      }
    },
    minHeightToTrack: 1,
    minWidthToTrack: 1,
  });

  return (
    <>
      <div
        className={twJoin("max-w-[500px]")}
        ref={(ref) => {
          targetRef(ref);
        }}
      >
        <div className={twJoin("flex", "flex-row", "gap-[8px]")}>
          <b>{attr.name}</b>

          <div className={twJoin("text-gray-400", "text-[13px]")}>
            • {attr.key}
          </div>
        </div>

        <div
          className={twJoin(
            "flex",
            "flex-row",
            "text-[13px]",
            "text-gray-400",
            "gap-[8px]",
            "w-full",
            "overflow-hidden"
          )}
        >
          <div>• {attr.group}</div>
          <div>• {attr.type}</div>
          <div
            className={twJoin("flex-1", "overflow-ellipsis", "overflow-hidden")}
            title={attr.description}
          >
            • {attr.description || "(No description)"}
          </div>
        </div>
      </div>

      {loadingRef.current.isLoading && (
        <Skeleton active paragraph={{ rows: 1 }} />
      )}
    </>
  );
}

"use client";

import {
  QueryType,
  rehydrateStoresWithQueryParams,
} from "@/app/utils/url-helpers/rehydrateStoresWithQueryParams";
import { noop } from "lodash";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const routerRef = {
  current: {
    back: noop,
    forward: noop,
    prefetch: noop,
    push: noop,
    refresh: noop,
    replace: noop,
  } as AppRouterInstance,
};

export function getRouter() {
  return routerRef.current;
}

export default function ClientRouter({ queries }: { queries: QueryType }) {
  const router = useRouter();

  useEffect(() => {
    rehydrateStoresWithQueryParams({ queries: queries });
  }, [queries]);

  routerRef.current = router;

  return null;
}

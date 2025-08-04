"use client";

import {
  QueryType,
  rehydrateStoresWithQueryParams,
} from "@/app/utils/url-helpers/rehydrateStoresWithQueryParams";
import { noop } from "lodash";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "./model/auth.store";

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

export default function ClientRouter({
  queries,
  xTrackingId,
}: {
  queries: QueryType;
  xTrackingId: string;
}) {
  const router = useRouter();

  useEffect(() => {
    useAuthStore.getState().functions.updateStore({ xTrackingId: xTrackingId });
  }, [xTrackingId]);

  useEffect(() => {
    rehydrateStoresWithQueryParams({ queries: queries });
  }, [queries]);

  routerRef.current = router;

  return null;
}

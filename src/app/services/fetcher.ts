import { useAuthStore } from "../components/ClientRouter/model/auth.store";

export const fetcher: typeof fetch = async function fetcher(url, options) {
  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      "x-tracking-id": useAuthStore.getState().state.xTrackingId,
    },
  });
};

import { useSearchParams } from "next/navigation";

export default function useAppendQueryParamsOnClient() {
  const searchParams = useSearchParams();

  return {
    /**
     * Modify queyr params withouth trigger server-side rerendering
     */
    appendQueryParamsOnClient(payload: Record<string, string>) {
      const params = new URLSearchParams(searchParams);
      Object.entries(payload).forEach(([key, val]) => {
        params.set(key, val);
      });

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState({}, "", newUrl); // no navigation/refetch}
    },
  };
}

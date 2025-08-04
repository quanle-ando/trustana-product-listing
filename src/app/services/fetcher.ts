const TRACKING_ID = crypto.randomUUID(); // Should be sent to client from server via cookies

export const fetcher: typeof fetch = async function fetcher(url, options) {
  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      "x-tracking-id": TRACKING_ID,
    },
  });
};

import "@testing-library/jest-dom";
import "@ant-design/v5-patch-for-react-19";
import "../../antd.min.css";
import "../../globals.css";
import "./Test.css";
import "antd/dist/reset.css";
import { setupServer } from "msw/node";
import { http } from "msw";
import { POST as ProductsPost } from "@/app/api/products/route";
import { formatPartialObject } from "./formatPartialObject";
import { POST as AttributesPost } from "@/app/api/attributes/route";

setupServer(
  http.post("/api/products", async ({ request }) => {
    return ProductsPost(formatPartialObject(request));
  }),

  http.post("/api/attributes", async ({ request }) => {
    return AttributesPost(formatPartialObject(request));
  })
).listen();

// @ts-expect-error -- mock getComputedStyle
window.getComputedStyle = vi.fn(() => ({}));

{
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });

  class ResizeObserver {
    callback: ResizeObserverCallback;
    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  global.ResizeObserver = ResizeObserver;
}

vi.mock(import("@/app/hooks/useIntersectionObserver"), async () => {
  return { useIntersectionObserver: vi.fn(() => ({ targetRef: vi.fn() })) };
});

vi.mock("next/headers", () => ({
  headers: () => new Map([["x-request-id", "mock-id"]]),
}));

vi.mock("next/font/google", () => ({
  Geist: () => ({ className: "font-geist" }),
  Geist_Mono: () => ({ className: "font-geist-mono" }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    pathname: "/",
    query: {},
  }),
  useSearchParams: vi.fn(() => ""),
}));

import { renderToReadableStream } from "react-dom/server.browser";
import Home from "../page";
import { debug } from "vitest-preview";
import { screen } from "@testing-library/react";

async function streamToString(stream: ReadableStream): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value);
  }

  return result;
}

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    pathname: "/",
    query: {},
    // add any router props you need for the test
  }),
}));

describe("Page.server", () => {
  it("renders Server Component with Client Component placeholder", async () => {
    const stream = await renderToReadableStream(
      <Home searchParams={Promise.resolve({})} />
    );

    const html = await streamToString(stream);

    document.body.innerHTML = html;

    expect(
      await screen.findByTestId("loading-product-table-client")
    ).toBeInTheDocument();

    expect(
      await screen.findByPlaceholderText(
        "Query by attributes, e.g. brand:(Apple OR Spartan) name:reqexp(apple) netWeightPerUnitValue>=10 NOT amazonDietType:Vegetarian"
      )
    ).toBeInTheDocument();
    debug();
  });
});

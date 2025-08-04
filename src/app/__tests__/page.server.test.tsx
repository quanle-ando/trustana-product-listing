import { renderToReadableStream } from "react-dom/server.browser";
import Home from "../page";
import { debug } from "vitest-preview";
import { screen } from "@testing-library/react";
import RootLayout from "../layout";

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

describe("Page.server", () => {
  it("renders Server Component with Client Component placeholder", async () => {
    const stream = await renderToReadableStream(
      <RootLayout>
        <Home searchParams={Promise.resolve({})} />
      </RootLayout>
    );

    const html = await streamToString(stream);

    document.body.innerHTML = html;

    expect(
      await screen.findByText("Displaying 300 product(s) with 2 attributes")
    ).toBeInTheDocument();

    expect(
      await screen.findByPlaceholderText(
        "Query by attributes, e.g. brand:(Apple OR Spartan) name:reqexp(apple) netWeightPerUnitValue>=10 NOT amazonDietType:Vegetarian"
      )
    ).toBeInTheDocument();
    debug();
  });
});

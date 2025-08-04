import { act, render, screen } from "@testing-library/react";
import { debug } from "vitest-preview";
import userEvent from "@testing-library/user-event";
import { sleep } from "@/app/utils/test-utils/sleep";
import Main from "@/app/pages/Main/Main";

describe("Page.client", () => {
  it("should render client page and handle all interactions correctly", async () => {
    await act(async () => {
      render(
        <Main
          queries={{
            attributes: [
              "name",
              "brand",
              "_basicInfoRtfGeneralDescription",
            ].join(","),
          }}
        />
      );
    });

    await screen.findByText(
      "Displaying 300 product(s) with 3 attributes",
      {},
      { timeout: 10_000 }
    );
    await userEvent.click(
      await screen.findByPlaceholderText(
        "Query by attributes, e.g. brand:(Apple OR Spartan) name:reqexp(apple) netWeightPerUnitValue>=10 NOT amazonDietType:Vegetarian"
      )
    );
    await userEvent.keyboard(
      "pdt.updatedAt:dt(2025-07-29) name:* brand:(Apple OR Spartan) _basicInfoRtfGeneralDescription:regexp(work and play){enter}"
    );
    expect(
      await screen.findByText("Displaying 1 product(s) with 3 attributes")
    ).toBeInTheDocument();

    await userEvent.click(await screen.findByTestId("query-builder-icon"));
    await userEvent.click(await screen.findByTestId("remove-brand"));
    await userEvent.click(await screen.findByText("Add another filter"));
    await clickSelectByPlaceholder({ placeholder: "Type to search ..." });
    await userEvent.keyboard("Specialty");
    await userEvent.click(await screen.findByText("• amazonSpecialty"));

    await clickSelectByPlaceholder({ placeholder: "Operator" });
    await userEvent.click(await screen.findByText("In"));

    await clickSelectByPlaceholder({
      placeholder: "Search and select values ...",
    });
    await userEvent.click(
      await screen.findByText("Certified-Humane-Raised-And-Handled")
    );

    await userEvent.click(await screen.findByText("Apply Filters"));

    const textarea = (await screen.findByTestId(
      "product-lucene-textarea"
    )) as HTMLTextAreaElement;
    expect(textarea.value).toMatchInlineSnapshot(
      `"pdt.updatedAt>=dt(2025-07-29) pdt.updatedAt<dt(2025-07-30) name:* _basicInfoRtfGeneralDescription:regexp(work and play) amazonSpecialty:("Certified-Humane-Raised-And-Handled")"`
    );

    expect(
      await screen.findByText("Displaying 0 product(s) with 3 attributes")
    ).toBeInTheDocument();

    await userEvent.click(await screen.findByTestId("query-builder-icon"));
    await userEvent.click(await screen.findByTestId("remove-amazonSpecialty"));
    await userEvent.click(await screen.findByText("Apply Filters"));

    expect(
      await screen.findByText("Displaying 1 product(s) with 3 attributes")
    ).toBeInTheDocument();

    expect(await screen.findByText("Selected (3)")).toBeInTheDocument();
    await userEvent.click(
      await screen.findByPlaceholderText("e.g. name:regexp(description)")
    );
    await userEvent.keyboard("name:regexp(description){enter}");
    await userEvent.click(
      await screen.findByText("Basic Info - Colour_Description")
    );

    expect(
      await screen.findByText("Displaying 1 product(s) with 4 attributes")
    ).toBeInTheDocument();
    expect(await screen.findByText("Selected (4)")).toBeInTheDocument();

    await userEvent.clear(
      await screen.findByTestId("attribute-lucene-textarea")
    );
    await userEvent.keyboard("type:DATE{enter}");
    await userEvent.click(
      await screen.findByText("Basic Info - Date First Available")
    );

    await userEvent.clear(await screen.findByTestId("product-lucene-textarea"));
    await userEvent.keyboard("_basicInfoDateFirstAvailable:*{enter}");

    expect(
      await screen.findByText("Displaying 36 product(s) with 5 attributes")
    ).toBeInTheDocument();

    expect(
      (await screen.findAllByText("01/04/2020")).length
    ).toMatchInlineSnapshot(`1`);

    await sleep();
    debug();
  });
});

async function clickSelectByPlaceholder({
  placeholder,
}: {
  placeholder: string;
}) {
  await userEvent.click(
    (
      await screen.findByText(placeholder)
    ).parentElement!.querySelector("input")!
  );
}

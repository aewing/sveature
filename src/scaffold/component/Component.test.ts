// @ts-nocheck
import "@testing-library/jest-dom";
import html from "svelte-htm";
import { render } from "@testing-library/svelte";

import DefaultFeature from "./features/Default.svelte";

describe("Component", () => {
  it("provides a default variant", () => {
    const { getByText } = render(html` <${DefaultFeature} /> `);
    const component = getByText("Hello, World!");
    expect(component).toHaveClass("default");
  });
});
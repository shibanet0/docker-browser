import { Page } from "playwright";
import { CustomOptions, GotoOptions } from "../../apiTypes.js";
import { pageAutoScroll } from "./pageAutoScroll.js";
import { pageBlockResource } from "./pageBlockResource.js";

export const pageBeforeGoto = async (page: Page, options?: CustomOptions) => {
  if (options?.blockResource) {
    await pageBlockResource(page, options.blockResource);
  }
};

export class PageGotoError extends Error {
  name: "PageGotoError";
  #status = 0;
  #statusText = "";
  #content = "";
  constructor(status: number, statusText: string, content: string) {
    super(`${status}: ${statusText}`);

    this.#status = status;
    this.#statusText = statusText;
    this.#content = content;
  }

  get status() {
    return this.#status;
  }

  get statusText() {
    return this.#statusText;
  }

  get content() {
    return this.#content;
  }
}

export const pageGoto = async (
  page: Page,
  url: string,
  gotoOptions?: GotoOptions,
  customOptions?: CustomOptions
) => {
  await pageBeforeGoto(page, customOptions);

  const response = await page.goto(url, gotoOptions);

  if (customOptions?.checkIsGoToOk && !response?.ok()) {
    const content = await page.content().catch(() => "");
    throw new PageGotoError(
      response?.status() || 0,
      response?.statusText() || "",
      content
    );
  }

  await pageAfterGoto(page, customOptions);
};

export const pageAfterGoto = async (page: Page, options?: CustomOptions) => {
  if (options?.autoScroll?.enable) {
    await pageAutoScroll(page, options.autoScroll);
  }
};

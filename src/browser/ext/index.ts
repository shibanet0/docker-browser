import { Page } from "playwright";
import { CustomOptions } from "../../apiTypes.js";
import { pageAutoScroll } from "./pageAutoScroll.js";
import { pageBlockResource } from "./pageBlockResource.js";

export const pageAfterGoto = async (page: Page, options?: CustomOptions) => {
  if (options?.autoScroll?.enable) {
    await pageAutoScroll(page, options.autoScroll);
  }
};

export const pageBeforeGoto = async (page: Page, options?: CustomOptions) => {
  if (options?.blockResource) {
    await pageBlockResource(page, options.blockResource);
  }
};

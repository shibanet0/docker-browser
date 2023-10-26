import { Page } from "playwright";
import { CustomOptionsBlockResource } from "../../apiTypes.js";

export const pageBlockResource = async (
  page: Page,
  list: CustomOptionsBlockResource[]
) => {
  for (const rule of list) {
    await page.route(rule.url, (route) => {
      const resourceType = route.request().resourceType();

      if ((rule.resourceType as string[]).includes(resourceType)) {
        return route.abort();
      } else {
        return route.continue();
      }
    });
  }
};

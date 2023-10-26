import { Page } from "playwright";
import { CustomOptionsAutoScroll } from "../../apiTypes.js";

export const pageAutoScroll = async (
  page: Page,
  options: CustomOptionsAutoScroll | undefined
) => {
  await page.evaluate(async (options: CustomOptionsAutoScroll | undefined) => {
    const frequency = options?.frequency || 100;
    const timing = options?.timing || 100;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let resolve = (value: unknown) => {
      return;
    };

    const deferred = new Promise((r) => (resolve = r));
    let scrolls = 0;

    const totalScrolls = window.document.body.scrollHeight / frequency;

    const scroll = () => {
      const scrollBy = totalScrolls * scrolls;
      window.setTimeout(() => {
        window.scrollTo(0, scrollBy);

        if (scrolls < frequency) {
          scrolls += 1;

          scroll();
        }

        // resolve the pending  once we've finished scrolling the page
        if (scrolls === frequency) resolve(true);
      }, timing);
    };

    scroll();

    await deferred;
  }, options);
};

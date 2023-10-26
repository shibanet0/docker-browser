import { HandlerFunc, handle } from "./_handle.js";
import { readBodyJSON } from "./_utils.js";
import { BrowserType } from "../types.js";
import { getBrowser } from "../getBrowser.js";
import { ScreenshotRequest } from "../apiTypes.js";
import { screenshotRequest } from "../apiJoi.js";
import { pageAfterGoto, pageBeforeGoto } from "../browser/ext/index.js";

const handler =
  (browserType: BrowserType): HandlerFunc =>
  async (req, res) => {
    const body = await readBodyJSON<ScreenshotRequest>(req, screenshotRequest);

    const type = body.options?.type || "png";

    const screenshot = await getBrowser(
      req,
      browserType,
      body.contextOptions || {},
      async (context) => {
        const page = await context.newPage();

        await pageBeforeGoto(page, body.customOptions);
        await page.goto(body.url, body.gotoOptions);
        await pageAfterGoto(page, body.customOptions);

        const screenshot = await page.screenshot({
          ...(body.options || {}),
          type,
        });
        return screenshot;
      }
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="screenshot.${type}"`
    );
    res.setHeader("Content-Type", `image/${type}`);
    res.statusCode = 200;

    res.end(screenshot);
  };

handle("POST", "/chromium/screenshot", handler("chromium"));
handle("POST", "/firefox/screenshot", handler("firefox"));
handle("POST", "/webkit/screenshot", handler("webkit"));

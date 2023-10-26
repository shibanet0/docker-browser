import { HandlerFunc, handle } from "../_handle.js";
import { readBodyJSON } from "../_utils.js";
import { BrowserType } from "../../types.js";
import { getBrowser } from "../../getBrowser.js";
import { ContentExtraResponse, ContentRequest } from "../../apiTypes.js";
import { contentRequest } from "../../apiJoi.js";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { getFavicon } from "./favicon.js";
import { getOpenGraph } from "./opengraph.js";
import { pageAfterGoto, pageBeforeGoto } from "../../browser/ext/index.js";

const getContentExtra = (html: string): ContentExtraResponse => {
  const window = new JSDOM("").window;
  const DOMPurify = createDOMPurify(window);
  const sanitized = DOMPurify.sanitize(html, { WHOLE_DOCUMENT: true });
  const readability = new Readability(
    new JSDOM(sanitized).window.document
  ).parse();

  const dom = new JSDOM(html);

  return {
    raw: html,
    sanitized,
    readability,
    favicon: getFavicon(dom),
    opengraph: getOpenGraph(dom),
  };
};

const handler =
  (browserType: BrowserType, extra?: boolean): HandlerFunc =>
  async (req, res) => {
    const body = await readBodyJSON<ContentRequest>(req, contentRequest);

    const content = await getBrowser(
      req,
      browserType,
      body.contextOptions || {},
      async (context) => {
        const page = await context.newPage();

        await pageBeforeGoto(page, body.customOptions);
        await page.goto(body.url, body.gotoOptions);
        await pageAfterGoto(page, body.customOptions);

        const content = await page.content();
        return content;
      }
    );

    if (extra) {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200;
      res.end(JSON.stringify(getContentExtra(content)));
      return;
    } else {
      res.setHeader("Content-Type", "text/html");
      res.statusCode = 200;
      res.end(content);
    }
  };

handle("POST", "/chromium/content", handler("chromium"));
handle("POST", "/firefox/content", handler("firefox"));
handle("POST", "/webkit/content", handler("webkit"));

handle("POST", "/chromium/content/extra", handler("chromium", true));
handle("POST", "/firefox/content/extra", handler("firefox", true));
handle("POST", "/webkit/content/extra", handler("webkit", true));

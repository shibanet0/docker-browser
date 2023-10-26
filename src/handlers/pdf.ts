import { HandlerFunc, handle } from "./_handle.js";
import { readBodyJSON } from "./_utils.js";
import { BrowserType } from "../types.js";
import { getBrowser } from "../getBrowser.js";
import { PdfRequest } from "../apiTypes.js";
import { pdfRequest } from "../apiJoi.js";
import {  pageGoto } from "../browser/ext/index.js";

const handler =
  (browserType: BrowserType): HandlerFunc =>
  async (req, res) => {
    const body = await readBodyJSON<PdfRequest>(req, pdfRequest);

    const pdf = await getBrowser(
      req,
      browserType,
      body.contextOptions || {},
      async (context) => {
        const page = await context.newPage();

        await pageGoto(page,body.url, body.gotoOptions, body.customOptions);

        const pdf = await page.pdf(body.options);
        return pdf;
      }
    );

    res.setHeader("Content-Disposition", 'attachment; filename="file.pdf"');
    res.setHeader("Content-Type", "application/pdf");
    res.statusCode = 200;

    res.end(pdf);
  };

handle("POST", "/chromium/pdf", handler("chromium"));

import puppeteer from "puppeteer";
import playwright from "playwright";
import { metrics } from "../metrics.js";
import { IncomingMessage } from "node:http";
import { getRequestOptions } from "./utils.js";

export const launch = async (
  req: IncomingMessage,
  options?: puppeteer.PuppeteerLaunchOptions
) => {
  const requestOptions = await getRequestOptions(req);

  const browser = await puppeteer
    .launch({
      ...(options || {}),
      headless: "new",
      executablePath: playwright.chromium.executablePath(),
      args: [...(options?.args || []), "--no-sandbox"],
    })
    .then((browser) => {
      metrics.browserType.inc("puppeteer", "chromium");

      return browser;
    });

  return browser;
};

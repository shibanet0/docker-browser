import playwright from "playwright";
import { BrowserType, mergeLaunchOptions } from "../types.js";
import { metrics } from "../metrics.js";
import { IncomingMessage } from "node:http";
import { getRequestOptions } from "./utils.js";

export const launch = async (
  req: IncomingMessage,
  browserType: BrowserType,
  options?: playwright.LaunchOptions
) => {
  const requestOptions = await getRequestOptions(req);

  const browser = await playwright[browserType]
    .launch({
      ...mergeLaunchOptions(browserType, options),
      proxy: requestOptions.proxy,
    })
    .then((browser) => {
      metrics.browserType.inc("playwright", browserType);

      return browser;
    });

  return browser;
};

export const launchServer = async (
  req: IncomingMessage,
  browserType: BrowserType,
  options?: playwright.LaunchOptions
) => {
  const requestOptions = await getRequestOptions(req);

  const browser = await playwright[browserType]
    .launchServer({
      ...mergeLaunchOptions(browserType, options),
      proxy: requestOptions.proxy,
    })
    .then((browser) => {
      metrics.browserType.inc("playwright", browserType);

      return browser;
    });

  return browser;
};

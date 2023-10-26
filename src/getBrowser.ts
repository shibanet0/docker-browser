import playwright from "playwright";
import { BrowserType } from "./types.js";
import { queue } from "./queue.js";
import { ContextOptions } from "./apiTypes.js";
import { browser as _browser } from "./browser/index.js";
import { IncomingMessage } from "node:http";
import { getStealthContext } from "./browser/stealth/index.js";

interface DeviceDescriptor {
  viewport: {
    width: number;
    height: number;
  };
  userAgent: string;
  deviceScaleFactor: number;
  isMobile: boolean;
  hasTouch: boolean;
}

const deviceChromium = playwright.devices["Desktop Chrome"];
const deviceFirefox = playwright.devices["Desktop Firefox"];
const deviceWebkit = playwright.devices["Desktop Safari"];

const devices: Record<BrowserType, DeviceDescriptor> = {
  chromium: {
    viewport: { width: 1920, height: 1080 },
    userAgent: deviceChromium.userAgent,
    deviceScaleFactor: deviceChromium.deviceScaleFactor,
    isMobile: deviceChromium.isMobile,
    hasTouch: deviceChromium.hasTouch,
  },
  firefox: {
    viewport: { width: 1920, height: 1080 },
    userAgent: deviceFirefox.userAgent,
    deviceScaleFactor: deviceFirefox.deviceScaleFactor,
    isMobile: deviceFirefox.isMobile,
    hasTouch: deviceFirefox.hasTouch,
  },
  webkit: {
    viewport: { width: 1920, height: 1080 },
    userAgent: deviceWebkit.userAgent,
    deviceScaleFactor: deviceWebkit.deviceScaleFactor,
    isMobile: deviceWebkit.isMobile,
    hasTouch: deviceWebkit.hasTouch,
  },
};

export const getBrowser = async <T = unknown>(
  req: IncomingMessage,
  browserType: BrowserType,
  contextOptions: ContextOptions,
  cb: (
    context: playwright.BrowserContext,
    browser: playwright.Browser
  ) => Promise<T>
): Promise<T> => {
  let cancel = () => {};

  const [promise] = queue.add(
    async () => {
      const { browser, requestOptions } = await _browser.playwright.launch(
        req,
        browserType
      );

      cancel = () => {
        browser.close();
      };

      const device = devices[browserType];

      let data = undefined as T;
      let err = undefined;

      try {
        const context = await browser
          .newContext({
            ...contextOptions,
            extraHTTPHeaders:
              (contextOptions.extraHTTPHeaders as { [key: string]: string }) ||
              undefined,

            viewport: {
              height:
                contextOptions?.viewport?.height || device.viewport.height,
              width: contextOptions?.viewport?.width || device.viewport.width,
            },
            userAgent: contextOptions?.userAgent || device.userAgent,
            deviceScaleFactor:
              contextOptions?.deviceScaleFactor || device.deviceScaleFactor,
            isMobile: contextOptions?.isMobile || device.isMobile,
            hasTouch: contextOptions?.hasTouch || device.hasTouch,
          })
          .then((context) => {
            if (requestOptions.stealth) return getStealthContext(context);
            return context;
          });

        data = await cb(context, browser);
      } catch (error) {
        err = error;
      } finally {
        browser.close();
      }

      if (err) {
        throw err;
      }

      return data;
    },
    () => {
      cancel();
    }
  );

  const data = await promise;

  return data;
};

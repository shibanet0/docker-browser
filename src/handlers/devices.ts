import { handle } from "./_handle.js";
import { Device } from "../apiTypes.js";
import playwright from "playwright";

handle("GET", "/devices", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  const data: Device[] = Object.keys(playwright.devices).map((key) => {
    const device = playwright.devices[key];

    return {
      name: key,
      userAgent: device.userAgent,
      viewport: device.viewport,
      deviceScaleFactor: device.deviceScaleFactor,
      isMobile: device.isMobile,
      hasTouch: device.hasTouch,
      defaultBrowserType: device.defaultBrowserType,
    };
  });
  res.end(JSON.stringify(data));
});

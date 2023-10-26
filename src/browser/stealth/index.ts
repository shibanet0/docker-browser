import { BrowserType } from "../../types.js";
import playwrightExtra from "playwright-extra";
import playwright from "playwright";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

export const getStealthPlaywright = (browserType: BrowserType) => {
  const el = playwrightExtra[browserType];

  const evasions = StealthPlugin().enabledEvasions;

  evasions.delete("user-agent-override");
  evasions.delete("navigator.webdriver");

  el.use(StealthPlugin({ enabledEvasions: evasions }));

  return el;
};

export const getStealthContext = async (context: playwright.BrowserContext) => {
  await context.addInitScript(
    "Object.defineProperty(navigator, 'webdriver', { get: () => false })"
  );
  return context;
};

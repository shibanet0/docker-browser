import { handle } from "./_handle.js";
import { InfoResponse } from "../apiTypes.js";
import { env } from "../env.js";
import { queue } from "../queue.js";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import * as fs from "node:fs";

const _versions = JSON.parse(
  fs.readFileSync(
    join(fileURLToPath(import.meta.url), "../../versions.json"),
    "utf-8"
  )
);
const version: InfoResponse["version"] = {
  npm: {
    "@mozilla/readability": _versions.npm["@mozilla/readability"],
    "adblock-rs": _versions.npm["adblock-rs"],
    dompurify: _versions.npm.dompurify,
    playwright: _versions.npm.playwright,
    "playwright-core": _versions.npm["playwright-core"],
    "playwright-extra": _versions.npm["playwright"],
    puppeteer: _versions.npm.puppeteer,
    "puppeteer-extra-plugin-stealth": _versions.npm["puppeteer-extra-plugin-stealth"],
  },
  browser: {
    chromium: _versions.browser.chromium,
    firefox: _versions.browser.firefox,
    webkit: _versions.browser.webkit,
  },
};

handle("GET", "/info", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  const data: InfoResponse = {
    maxParallelSessions: env.maxParallelSessions,
    maxQueueLength: env.maxQueueLength,
    queueLength: queue.length,
    isAddAllowed: queue.isAddAllowed,
    version,
  };
  res.end(JSON.stringify(data));
});

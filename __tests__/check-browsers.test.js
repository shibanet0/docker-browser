import http from "node:http";
import playwright from "playwright";
import puppeteer, { Browser } from "puppeteer";
import { describe, beforeAll, afterAll, test, expect } from "vitest";
import { env } from "../dist/env";
import { exec } from "node:child_process";

const hostname = "127.0.0.1";
const port = 3030;
const url = `http://${hostname}:${port}`;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end("<!DOCTYPE html><html><head><title>TESTDATA</title></head></html>");
});

const appURL = `ws://${env.host === "0.0.0.0" ? "127.0.0.1" : env.host}:${
  env.port
}`;

const appServer = exec("node --enable-source-maps ./dist/index.js");

beforeAll(async () => {
  await new Promise((resolve) => {
    appServer.on("spawn", () => resolve(null));
  }).then(() => new Promise((r) => setTimeout(r, 10_000)));

  await new Promise((resolve) => {
    server.listen(port, hostname, () => {
      resolve(null);
    });
  });
}, 30_000);

afterAll(() => {
  appServer.kill(9);

  return new Promise((resolve) => {
    server.close(() => {
      resolve();
    });
  });
});

describe("playwright/ws", () => {
  /**
   * @param {"chromium" | "firefox" | "webkit"} browserType
   */
  const runTest = async (browserType) => {
    let browser = null;

    try {
      browser = await playwright[browserType].connect(
        `${appURL}/${browserType}/ws`
      );

      const page = await browser.newPage();

      await page.goto(url);

      const title = await page.title();

      return title;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  };

  test.concurrent(
    "chromium",
    async () => {
      const title = await runTest("chromium");
      expect(title).toEqual("TESTDATA");
    },
    60_000
  );

  test.concurrent(
    "firefox",
    async () => {
      const title = await runTest("firefox");
      expect(title).toEqual("TESTDATA");
    },
    60_000
  );

  test.concurrent(
    "webkit",
    async () => {
      const title = await runTest("webkit");
      expect(title).toEqual("TESTDATA");
    },
    60_000
  );
});

describe("puppeteer/cdp", () => {
  /**
   * @param {"puppeteer" | "playwright"} engineType
   */
  const runTestCDP = async (engineType) => {
    /**
     * @type playwright.Browser|Browser|null
     */
    let browser = null;

    const wsURL = `${appURL}/chromium/ws/cdp`;

    try {
      if (engineType === "playwright") {
        browser = await playwright.chromium.connectOverCDP(wsURL);
      } else {
        browser = await puppeteer.connect({ browserWSEndpoint: wsURL });
      }

      const page = await browser.newPage();

      await page.goto(url);

      const title = await page.title();

      return title;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  };

  test.concurrent(
    "playwright",
    async () => {
      const title = await runTestCDP("playwright");
      expect(title).toEqual("TESTDATA");
    },
    60_000
  );

  test.concurrent(
    "puppeteer",
    async () => {
      const title = await runTestCDP("puppeteer");
      expect(title).toEqual("TESTDATA");
    },
    60_000
  );
});

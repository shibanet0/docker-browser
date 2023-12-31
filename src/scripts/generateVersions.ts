import { exec } from "node:child_process";
import fsPromise from "node:fs/promises";
import { join } from "node:path";
import playwright from "playwright";

const dependencies = await new Promise<string>((resolve, reject) => {
  exec("pnpm list --json", (error, data) => {
    if (error) {
      reject(error);
      return;
    }

    resolve(data);
  });
}).then((res) => JSON.parse(res).at(0).dependencies);

const npm = Object.entries(dependencies).reduce<Record<string, string>>(
  (acc, [key, value]) => {
    acc[key] = (value as any).version;
    return acc;
  },
  {}
);

const getPlaywrightWersion = (type: "chromium" | "firefox" | "webkit") => {
  return playwright[type].launch().then(async (browser) => {
    const version = browser.version();
    await browser.close();
    return version;
  });
};

const [chromiumVersion, firefoxVersion, webkitVersion] = await Promise.all([
  getPlaywrightWersion("chromium"),
  getPlaywrightWersion("firefox"),
  getPlaywrightWersion("webkit"),
]);

const browser = {
  chromium: chromiumVersion,
  firefox: firefoxVersion,
  webkit: webkitVersion,
};

fsPromise.writeFile(
  join(process.cwd(), "dist", "versions.json"),
  JSON.stringify({ npm, browser }, null, 2)
);

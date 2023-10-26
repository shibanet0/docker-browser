import client from "prom-client";
import { queue } from "./queue.js";
import { BrowserType } from "./types.js";

const Registry = client.Registry;
const register = new Registry();

// client.collectDefaultMetrics({ register });

const prefix = "docker_browser_";

new client.Gauge({
  name: prefix + "queue_length",
  help: prefix + "queue_length_help",
  registers: [register],
  async collect() {
    this.set(queue.length);
  },
});

new client.Gauge({
  name: prefix + "queue_max_jobs",
  help: prefix + "queue_max_jobs_help",
  registers: [register],
  async collect() {
    this.set(queue.maxJobs);
  },
});

const browserLaunch = new (class {
  #el = new client.Gauge({
    name: prefix + "launch",
    help: prefix + "launch_help",
    registers: [register],
    labelNames: ["browser", "type"],
  });

  inc(type: "playwright" | "puppeteer", browser: BrowserType) {
    this.#el.inc({ type, browser });
  }
})();

export const getMetrics = () => register.metrics();

export const metrics = { browserType: browserLaunch };

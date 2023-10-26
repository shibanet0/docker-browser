import { exec } from "node:child_process";
import { env } from "../dist/env";

export const hostname = env.host === "0.0.0.0" ? "127.0.0.1" : env.host;
export const port = env.port;

export class AppServer {
  #process = exec("node --enable-source-maps ./dist/index.js");
  #intervalId;

  async start() {
    await new Promise((resolve) => {
      this.#intervalId = setInterval(async () => {
        try {
          const res = await fetch(`http://${hostname}:${port}/info`, {
            signal: AbortSignal.timeout(900),
          });

          if (res.ok) {
            clearInterval(this.#intervalId);
            resolve(null);
          }
        } catch (err) {}
      }, 1000);
    });
  }

  stop() {
    if (this.#intervalId) {
      clearInterval(this.#intervalId);
    }
    this.#process.kill(9);
  }
}

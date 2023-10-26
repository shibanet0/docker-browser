import { WebSocketServer } from "ws";
import WebSocket from "ws";
import { BrowserType } from "./types.js";
import { IncomingMessage } from "node:http";
import { debug } from "./debug.js";
import { browser } from "./browser/index.js";
import { queue } from "./queue.js";

class Closable {
  #log = debug("ws:closable");
  #list: Array<() => void> = [];
  add(point: string, cb: () => void) {
    this.#log("add", point);
    this.#list.push(cb);
  }
  close(point: string) {
    this.#log("close", point);
    this.#list.reverse().forEach((cb) => cb());
  }
}

interface CreateServerOptions {
  req: IncomingMessage;
  closable: Closable;
  send: (msg: string) => void;
}

interface CreateServerResp {
  send: (msg: string) => void;
}

type CreateServerCb = (
  options: CreateServerOptions
) => Promise<CreateServerResp>;

const createServer = (cb: CreateServerCb) => {
  const websocketServer = new WebSocketServer({
    noServer: true,
    perMessageDeflate: false,
  });
  websocketServer.on("error", console.error);

  websocketServer.on("connection", async function (wsClient, req) {
    const closable = new Closable();
    closable.add("wsClient", () => wsClient.close());

    let initialMessages: string[] = [];
    let emitMessageFromClient = (msg: string) => {
      initialMessages.push(msg);
    };

    wsClient.addEventListener("close", () => closable.close("wsClient:close"));
    wsClient.on("error", () => closable.close("wsClient:error"));
    wsClient.on("message", (msg) => emitMessageFromClient(msg.toString()));

    const [promise] = queue.add(
      async () => {
        const { send } = await cb({
          req,
          closable,
          send: (msg) => wsClient.send(msg),
        });
        emitMessageFromClient = send;
        initialMessages.forEach(send);

        await new Promise((resolve) =>
          wsClient.addEventListener("close", () => resolve(null))
        );
      },
      () => closable.close("queue:cancel")
    );

    promise.catch(() => {
      closable.close("queue:add");
    });
  });

  return websocketServer;
};

const createWs = (browserType: BrowserType) => {
  return createServer(async ({ req, closable, send }) => {
    const browserServer = await browser.playwright.launchServer(
      req,
      browserType
    );
    closable.add("browserServer", () => browserServer.kill());
    browserServer.on("close", () =>
      closable.close("createWs:browserServer:close")
    );

    const wsBrowser = new WebSocket(browserServer.wsEndpoint());
    closable.add("wsBrowser", () => wsBrowser.close());
    wsBrowser.on("close", () => closable.close("createWs:wsBrowser:close"));
    wsBrowser.on("error", () => closable.close("createWs:wsBrowser:error"));

    wsBrowser.on("message", (msg) => send(msg.toString()));

    await new Promise((resolve) => wsBrowser.on("open", resolve));

    return {
      send: (msg) => wsBrowser.send(msg),
    };
  });
};

const createWsCDP = () => {
  return createServer(async ({ req, closable, send }) => {
    const browserServer = await browser.puppeteer.launch(req);
    closable.add("browserServer", () => browserServer.close());
    browserServer.on("close", () =>
      closable.close("createWsCDP:browserServer:close")
    );

    const wsBrowser = new WebSocket(browserServer.wsEndpoint());
    closable.add("wsBrowser", () => wsBrowser.close());
    wsBrowser.on("close", () => closable.close("createWsCDP:wsBrowser:close"));
    wsBrowser.on("error", () => closable.close("createWsCDP:wsBrowser:error"));

    wsBrowser.on("message", (msg) => send(msg.toString()));

    await new Promise((resolve) => wsBrowser.on("open", resolve));

    return {
      send: (msg) => wsBrowser.send(msg),
    };
  });
};

export const wsHandlers: Record<
  string,
  WebSocket.Server<typeof WebSocket, typeof IncomingMessage>
> = {
  "/chromium/ws/cdp": createWsCDP(),
  "/chromium/ws": createWs("chromium"),
  "/firefox/ws": createWs("firefox"),
  "/webkit/ws": createWs("webkit"),
};

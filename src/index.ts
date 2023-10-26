import { createServer, STATUS_CODES } from "http";
import { wsHandlers } from "./ws.js";
import { env } from "./env.js";
import { debug } from "./debug.js";
import internal from "stream";
import "./adblock.js";
import { handleRequest } from "./handlers/index.js";
import { utils } from "./utils/index.js";
import { checkIsAuthorized } from "./checkIsAuthorized.js";
import { queue } from "./queue.js";

const server = createServer();

const sendSockerError = (
  statusCode: number,
  socket: internal.Duplex,
  msg?: string
) => {
  const statusMessage = STATUS_CODES[statusCode];

  socket.write(
    `${[
      `HTTP/1.1 ${statusCode} ${statusMessage}`,
      ...(msg ? ["\r\n", msg] : []),
    ].join("\r\n")}\r\n\r\n`
  );

  socket.destroy();
};

server.on("request", (req, res) => {
  debug("http:request")(req.url);
  handleRequest(req, res);
});

server.on("upgrade", async function upgrade(req, socket, head) {
  debug("http:request")(req.url);

  try {
    if (!req?.url) {
      sendSockerError(400, socket);
      return;
    }

    const url = utils.parseURL(req);

    const isAuthorized = await checkIsAuthorized(url);
    if (!isAuthorized) {
      sendSockerError(403, socket);
      return;
    }

    if (!queue.isAddAllowed) {
      sendSockerError(400, socket, "queue overfilled");
      return;
    }

    const handler = wsHandlers[url.pathname];

    if (handler) {
      handler.handleUpgrade(req, socket, head, function done(ws) {
        handler.emit("connection", ws, req);
      });
    } else {
      socket.destroy();
    }
  } catch (error) {}
});

server.listen(env.port, env.host);

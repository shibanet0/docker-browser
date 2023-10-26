import { IncomingMessage, ServerResponse } from "node:http";
import { utils } from "../utils/index.js";
import Joi from "joi";
import { TimeoutError, CancelledError, OverfilledError } from "../queue.js";
import { checkIsAuthorized } from "../checkIsAuthorized.js";
import { PageGotoError } from "../browser/ext/index.js";

export type Method = "GET" | "POST";

export type HandlerFunc = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  }
) => Promise<void>;

export interface Handler {
  run: HandlerFunc;
  validate?: (url: URL, body: unknown) => Promise<boolean>;
}

export type HandlerMap = Record<string, HandlerFunc>;

const handlers: Record<Method, HandlerMap> = {
  GET: {},
  POST: {},
};

export const handleRequest = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  }
) => {
  const methodList: Array<Method> = ["GET", "POST"];
  const method: Method | undefined = methodList.includes(req.method as Method)
    ? (req.method as Method)
    : undefined;

  if (!method || !req.url) {
    return;
  }

  const url = utils.parseURL(req);

  const isAuthorized = await checkIsAuthorized(url);
  if (!isAuthorized) {
    res.statusCode = 403;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Forbidden" }));
    return;
  }

  const handler = handlers[method][url.pathname];

  if (!handler) {
    res.statusCode = 404;
    res.end();
    return;
  }

  handler(req, res).catch((err) => {
    if (err instanceof Joi.ValidationError) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(err.details));
      return;
    }

    if (err instanceof TimeoutError) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "timeout" }));
      return;
    }

    if (err instanceof CancelledError) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "cancelled" }));
      return;
    }

    if (err instanceof OverfilledError) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "queue overfilled" }));
      return;
    }

    if (err instanceof PageGotoError) {
      res.statusCode = err.status;
      if (err.content) {
        res.setHeader("Content-Type", "text/html");
        res.end(err.content);
      } else {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: err.statusText }));
      }
      return;
    }

    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: err?.message || err }));
  });
};

export const handle = (method: Method, url: string, handler: HandlerFunc) => {
  handlers[method][url] = handler;
};

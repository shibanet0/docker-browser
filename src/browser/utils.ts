import { IncomingMessage } from "node:http";
import { ProxyURL, parseProxyURL } from "../proxy.js";

interface RequestOptions {
  url: URL;
  proxy?: ProxyURL;
}
export const getRequestOptions = async (
  req: IncomingMessage
): Promise<RequestOptions> => {
  const url = new URL(req.url || "", `http://${req.headers.host}`);

  const params: RequestOptions = { url };

  params.proxy = await parseProxyURL(url.searchParams.get("proxy") || "");

  return params;
};
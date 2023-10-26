import { IncomingMessage } from "node:http";
import { ProxyURL, parseProxyURL } from "../proxy.js";

interface RequestOptions {
  url: URL;
  proxy?: ProxyURL;
  stealth: boolean;
}
export const getRequestOptions = async (
  req: IncomingMessage
): Promise<RequestOptions> => {
  const url = new URL(req.url || "", `http://${req.headers.host}`);

  const params: RequestOptions = {
    url,
    stealth:
      (url.searchParams.get("stealth") || "true").toLowerCase() === "true",
  };

  params.proxy = await parseProxyURL(url.searchParams.get("proxy") || "");

  return params;
};

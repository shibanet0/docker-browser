export type ProxyURLProtocol = "socks5" | "http";

export interface ProxyURL {
  server: string;
  protocol: ProxyURLProtocol;
  username?: string;
  password?: string;
}

export const parseProxyURL = async (
  url: string
): Promise<ProxyURL | undefined> => {
  if (!url) return undefined;

  

  const _url = new URL(url);


  if (_url.protocol === "http:") {
    return {
      server: `http://${_url.host}`,
      protocol: "http",
      username: _url.username,
      password: _url.password,
    };
  }

  if (_url.protocol === "socks5:") {
    const _url = new URL(url.replace("socks5://", "http://"));
    return {
      server: `socks5://${_url.host}`,
      protocol: "socks5",
      username: _url.username,
      password: _url.password,
    };
  }

  return undefined;
};

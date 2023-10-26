import { env } from "./env.js";

export const checkIsAuthorized = async (url: URL) => {
  if (!env.token && !env.tokenCheckerURL) return true;

  const token = url.searchParams.get("token");

  if (env.token && env.token === token) return true;

  if (env.tokenCheckerURL) {
    const res = await fetch(env.tokenCheckerURL, {
      method: "POST",
      body: JSON.stringify({ token }),
    });

    return res.ok && res.status === 200;
  }

  return false;
};

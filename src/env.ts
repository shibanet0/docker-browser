import { BrowserType } from "./types.js";
import os from "node:os";

const parseArgs = (envName: string) => {
  return process.env?.[envName]?.trim()?.split(/\s+/g);
};

const parseDefaultArgs = (envName: string) => {
  const value = process.env?.[envName];
  if (!value) return false;

  if (value.toLocaleLowerCase() === "true") return true;

  return value.trim().split(/\s+/g);
};

const additionalArgs: Record<BrowserType, string[] | undefined> = {
  chromium: parseArgs("CHROMIUM_ADDITIONAL_ARGS"),
  firefox: parseArgs("FIREFOX_ADDITIONAL_ARGS"),
  webkit: parseArgs("WEBKIT_ADDITIONAL_ARGS"),
};

const ignoreDefaultArgs: Record<BrowserType, string[] | boolean> = {
  chromium: parseDefaultArgs("CHROMIUM_IGNORE_DEFAULT_ARGS"),
  firefox: parseDefaultArgs("FIREFOX_IGNORE_DEFAULT_ARGS"),
  webkit: parseDefaultArgs("WEBKIT_IGNORE_DEFAULT_ARGS"),
};

const getTokenCheckerURL = () => {
  const value = process.env.TOKEN_CHECKER_URL;
  if (!value) return undefined;

  try {
    const url = new URL(value);
    return url;
  } catch (err) {
    throw new Error("TOKEN_CHECKER_URL is invalid");
  }
};

const parseBoolean = (value?: string) => value?.toLowerCase() === "true";

const halfCPU = Math.max(1, Math.ceil(os.cpus().length / 2));

export const env = {
  port: Number(process.env?.PORT || 8080),
  host: process.env?.HOST || "0.0.0.0",

  additionalArgs,
  ignoreDefaultArgs,

  tokenCheckerURL: getTokenCheckerURL(),
  token: process.env.TOKEN,
  blockAds: parseBoolean(process.env.DEFAULT_BLOCK_ADS),
  enableCors: parseBoolean(process.env.ENABLE_CORS),
  // DEFAULT_IGNORE_HTTPS_ERRORS

  jobTimeout: Number(process.env?.JOB_TIMEOUT) || 5 * 60_000,

  maxQueueLength: Number(process.env.MAX_QUEUE_LENGTH) || halfCPU,
  maxParallelSessions: Number(process.env.MAX_PARALLEL_SESSIONS) || halfCPU,
};

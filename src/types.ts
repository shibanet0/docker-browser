import { env } from "./env.js";

export type BrowserType = "chromium" | "firefox" | "webkit";

export interface LaunchOptions {
  /**
   * Additional arguments to pass to the browser instance. The list of Chromium flags can be found
   * [here](http://peter.sh/experiments/chromium-command-line-switches/).
   */
  args?: Array<string>;

  /**
   * Browser distribution channel.  Supported values are "chrome", "chrome-beta", "chrome-dev", "chrome-canary",
   * "msedge", "msedge-beta", "msedge-dev", "msedge-canary". Read more about using
   * [Google Chrome and Microsoft Edge](https://playwright.dev/docs/browsers#google-chrome--microsoft-edge).
   */
  channel?: string;

  /**
   * Enable Chromium sandboxing. Defaults to `false`.
   */
  chromiumSandbox?: boolean;

  /**
   * **Chromium-only** Whether to auto-open a Developer Tools panel for each tab. If this option is `true`, the
   * `headless` option will be set `false`.
   */
  devtools?: boolean;

  /**
   * If specified, accepted downloads are downloaded into this directory. Otherwise, temporary directory is created and
   * is deleted when browser is closed. In either case, the downloads are deleted when the browser context they were
   * created in is closed.
   */
  downloadsPath?: string;

  /**
   * Specify environment variables that will be visible to the browser. Defaults to `process.env`.
   */
  env?: { [key: string]: string|number|boolean; };

  /**
   * Path to a browser executable to run instead of the bundled one. If `executablePath` is a relative path, then it is
   * resolved relative to the current working directory. Note that Playwright only works with the bundled Chromium,
   * Firefox or WebKit, use at your own risk.
   */
  executablePath?: string;

  /**
   * Firefox user preferences. Learn more about the Firefox user preferences at
   * [`about:config`](https://support.mozilla.org/en-US/kb/about-config-editor-firefox).
   */
  firefoxUserPrefs?: { [key: string]: string|number|boolean; };

  /**
   * Close the browser process on SIGHUP. Defaults to `true`.
   */
  handleSIGHUP?: boolean;

  /**
   * Close the browser process on Ctrl-C. Defaults to `true`.
   */
  handleSIGINT?: boolean;

  /**
   * Close the browser process on SIGTERM. Defaults to `true`.
   */
  handleSIGTERM?: boolean;

  /**
   * Whether to run browser in headless mode. More details for
   * [Chromium](https://developers.google.com/web/updates/2017/04/headless-chrome) and
   * [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Headless_mode). Defaults to `true` unless the
   * `devtools` option is `true`.
   */
  headless?: boolean;

  /**
   * If `true`, Playwright does not pass its own configurations args and only uses the ones from `args`. If an array is
   * given, then filters out the given default arguments. Dangerous option; use with care. Defaults to `false`.
   */
  ignoreDefaultArgs?: boolean|Array<string>;


  /**
   * Port to use for the web socket. Defaults to 0 that picks any available port.
   */
  port?: number;

  /**
   * Network proxy settings.
   */
  proxy?: {
    /**
     * Proxy to be used for all requests. HTTP and SOCKS proxies are supported, for example `http://myproxy.com:3128` or
     * `socks5://myproxy.com:3128`. Short form `myproxy.com:3128` is considered an HTTP proxy.
     */
    server: string;

    /**
     * Optional comma-separated domains to bypass proxy, for example `".com, chromium.org, .domain.com"`.
     */
    bypass?: string;

    /**
     * Optional username to use if HTTP proxy requires authentication.
     */
    username?: string;

    /**
     * Optional password to use if HTTP proxy requires authentication.
     */
    password?: string;
  };

  /**
   * Maximum time in milliseconds to wait for the browser instance to start. Defaults to `30000` (30 seconds). Pass `0`
   * to disable timeout.
   */
  timeout?: number;

  /**
   * If specified, traces are saved into this directory.
   */
  tracesDir?: string;

  /**
   * Path at which to serve the Browser Server. For security, this defaults to an unguessable string.
   *
   * **NOTE** Any process or web page (including those running in Playwright) with knowledge of the `wsPath` can take
   * control of the OS user. For this reason, you should use an unguessable token when using this option.
   */
  wsPath?: string;
}

export const mergeLaunchOptions = (
  browserType: BrowserType,
  launchOptions?: LaunchOptions
) => ({
  ...(launchOptions || {}),
  args: env.additionalArgs[browserType],
  ignoreDefaultArgs: env.ignoreDefaultArgs[browserType],
});

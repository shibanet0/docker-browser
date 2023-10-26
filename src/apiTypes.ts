/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface GotoOptions {
  /**
   * Referer header value. If provided it will take preference over the referer header value set by
   * [page.setExtraHTTPHeaders(headers)](https://playwright.dev/docs/api/class-page#page-set-extra-http-headers).
   */
  referer?: string;
  /**
   * Maximum operation time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via
   * `navigationTimeout` option in the config, or by using the
   * [browserContext.setDefaultNavigationTimeout(timeout)](https://playwright.dev/docs/api/class-browsercontext#browser-context-set-default-navigation-timeout),
   * [browserContext.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-browsercontext#browser-context-set-default-timeout),
   * [page.setDefaultNavigationTimeout(timeout)](https://playwright.dev/docs/api/class-page#page-set-default-navigation-timeout)
   * or [page.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-page#page-set-default-timeout) methods.
   * @default 0
   */
  timeout?: number;
  /**
   * When to consider operation succeeded, defaults to `load`. Events can be either:
   * - `'domcontentloaded'` - consider operation to be finished when the `DOMContentLoaded` event is fired.
   * - `'load'` - consider operation to be finished when the `load` event is fired.
   * - `'networkidle'` - **DISCOURAGED** consider operation to be finished when there are no network connections for
   *   at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
   * - `'commit'` - consider operation to be finished when network response is received and the document started
   *   loading.
   * @default "load"
   */
  waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit";
}

export interface ContextOptions {
  /**
   * Toggles bypassing page's Content-Security-Policy. Defaults to `false`.
   * @default false
   */
  bypassCSP?: boolean;
  /**
   * Emulates `'prefers-colors-scheme'` media feature, supported values are `'light'`, `'dark'`, `'no-preference'`. See
   * [page.emulateMedia([options])](https://playwright.dev/docs/api/class-page#page-emulate-media) for more details.
   * Passing `null` resets emulation to system defaults. Defaults to `'light'`.
   * @default "light"
   */
  colorScheme?: "light" | "dark" | "no-preference";
  /**
   * Specify device scale factor (can be thought of as dpr). Defaults to `1`. Learn more about
   * [emulating devices with device scale factor](https://playwright.dev/docs/emulation#devices).
   */
  deviceScaleFactor?: number;
  /** An object containing additional HTTP headers to be sent with every request. Defaults to none. */
  extraHTTPHeaders?: object;
  /**
   * Emulates `'forced-colors'` media feature, supported values are `'active'`, `'none'`. See
   * [page.emulateMedia([options])](https://playwright.dev/docs/api/class-page#page-emulate-media) for more details.
   * Passing `null` resets emulation to system defaults. Defaults to `'none'`.
   * @default "none"
   */
  forcedColors?: "active" | "none";
  geolocation?: {
    /**
     * Latitude between -90 and 90.
     * @min -90
     * @max 90
     */
    latitude: number;
    /**
     * Longitude between -180 and 180.
     * @min -180
     * @max 180
     */
    longitude: number;
    /**
     * Non-negative accuracy value. Defaults to `0`.
     * @default 0
     */
    accuracy: number;
  };
  /**
   * Specifies if viewport supports touch events. Defaults to false. Learn more about
   * [mobile emulation](https://playwright.dev/docs/emulation#devices).
   */
  hasTouch?: boolean;
  /**
   * Credentials for [HTTP authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication). If no
   * origin is specified, the username and password are sent to any servers upon unauthorized responses.
   */
  httpCredentials?: {
    username: string;
    password: string;
    /** Restrain sending http credentials on specific origin (scheme://host:port). */
    origin?: string;
  };
  /**
   * Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
   * @default false
   */
  ignoreHTTPSErrors?: boolean;
  /**
   * Whether the `meta viewport` tag is taken into account and touch events are enabled. isMobile is a part of device,
   * so you don't actually need to set it manually. Defaults to `false` and is not supported in Firefox. Learn more
   * about [mobile emulation](https://playwright.dev/docs/emulation#ismobile).
   * @default false
   */
  isMobile?: boolean;
  /**
   * Whether or not to enable JavaScript in the context. Defaults to `true`. Learn more about
   * [disabling JavaScript](https://playwright.dev/docs/emulation#javascript-enabled).
   * @default true
   */
  javaScriptEnabled?: boolean;
  /** Specify user locale, for example `en-GB`, `de-DE`, etc. Locale will affect `navigator.language` value, `Accept-Language` request header value as well as number and date formatting rules. Defaults to the system default locale. Learn more about emulation in our [emulation guide](https://playwright.dev/docs/emulation#locale--timezone). */
  locale?: string;
  /**
   * Whether to emulate network being offline. Defaults to `false`. Learn more about
   * [network emulation](https://playwright.dev/docs/emulation#offline).
   * @default false
   */
  offline?: boolean;
  /**
   * A list of permissions to grant to all pages in this context. See
   * [browserContext.grantPermissions(permissions[, options])](https://playwright.dev/docs/api/class-browsercontext#browser-context-grant-permissions)
   * for more details. Defaults to none.
   */
  permissions?: string[];
  /**
   * Emulates `'prefers-reduced-motion'` media feature, supported values are `'reduce'`, `'no-preference'`. See
   * [page.emulateMedia([options])](https://playwright.dev/docs/api/class-page#page-emulate-media) for more details.
   * Passing `null` resets emulation to system defaults. Defaults to `'no-preference'`.
   * @default "no-preference"
   */
  reducedMotion?: "reduce" | "no-preference";
  /**
   * Emulates consistent window screen size available inside web page via `window.screen`. Is only used when the
   * `viewport` is set.
   */
  screen?: {
    /** page width in pixels. */
    width: number;
    /** page height in pixels. */
    height: number;
  };
  /**
   * Whether to allow sites to register Service workers. Defaults to `'allow'`.
   * - `'allow'`: [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) can be
   *   registered.
   * - `'block'`: Playwright will block all registration of Service Workers.
   */
  serviceWorkers?: "allow" | "block";
  /**
   * If set to true, enables strict selectors mode for this context. In the strict selectors mode all operations on
   * selectors that imply single target DOM element will throw when more than one element matches the selector. This
   * option does not affect any Locator APIs (Locators are always strict). Defaults to `false`. See {@link Locator} to
   * learn more about the strict mode.
   */
  strictSelectors?: boolean;
  /**
   * Changes the timezone of the context. See
   * [ICU's metaZones.txt](https://cs.chromium.org/chromium/src/third_party/icu/source/data/misc/metaZones.txt?rcl=faee8bc70570192d82d2978a71e2a615788597d1)
   * for a list of supported timezone IDs. Defaults to the system timezone.
   */
  timezoneId?: string;
  /** Specific user agent to use in this context. */
  userAgent?: string;
  /**
   * Emulates consistent viewport for each page. Defaults to an 1280x720 viewport. Use `null` to disable the consistent
   * viewport emulation. Learn more about [viewport emulation](https://playwright.dev/docs/emulation#viewport).
   *
   * **NOTE** The `null` value opts out from the default presets, makes viewport depend on the host window size defined
   * by the operating system. It makes the execution of the tests non-deterministic.
   */
  viewport?: {
    /** page width in pixels. */
    width: number;
    /** page height in pixels. */
    height: number;
  };
}

export interface ScreenshotRequestOptionsClip {
  /** x-coordinate of top-left corner of clip area */
  x: number;
  /** y-coordinate of top-left corner of clip area */
  y: number;
  /** width of clipping area */
  width: number;
  /** height of clipping area */
  height: number;
}

export interface ScreenshotRequestOptions {
  /**
   * When set to `"disabled"`, stops CSS animations, CSS transitions and Web Animations. Animations get different
   * treatment depending on their duration:
   * - finite animations are fast-forwarded to completion, so they'll fire `transitionend` event.
   * - infinite animations are canceled to initial state, and then played over after the screenshot.
   *
   * Defaults to `"allow"` that leaves animations untouched.
   * @default "allow"
   */
  animations?: "disabled" | "allow";
  /**
   * When set to `"hide"`, screenshot will hide text caret. When set to `"initial"`, text caret behavior will not be
   * changed.  Defaults to `"hide"`.
   * @default "hide"
   */
  caret?: "hide" | "initial";
  /** An object which specifies clipping of the resulting image. */
  clip?: ScreenshotRequestOptionsClip;
  /**
   * When true, takes a screenshot of the full scrollable page, instead of the currently visible viewport. Defaults to
   * `false`.
   * @default false
   */
  fullPage?: boolean;
  /**
   * Specify the color of the overlay box for masked elements, in
   * [CSS color format](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). Default color is pink `#FF00FF`.
   */
  maskColor?: string;
  /**
   * Hides default white background and allows capturing screenshots with transparency. Not applicable to `jpeg` images.
   * Defaults to `false`.
   * @default false
   */
  omitBackground?: boolean;
  /**
   * The file path to save the image to. The screenshot type will be inferred from file extension. If `path` is a
   * relative path, then it is resolved relative to the current working directory. If no path is provided, the image
   * won't be saved to the disk.
   */
  path?: string;
  /** The quality of the image, between 0-100. Not applicable to `png` images. */
  quality?: number;
  /**
   * When set to `"css"`, screenshot will have a single pixel per each css pixel on the page. For high-dpi devices, this
   * will keep screenshots small. Using `"device"` option will produce a single pixel per each device pixel, so
   * screenshots of high-dpi devices will be twice as large or even larger.
   *
   * Defaults to `"device"`.
   * @default "device"
   */
  scale?: "css" | "device";
  /**
   * Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout`
   * option in the config, or by using the
   * [browserContext.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-browsercontext#browser-context-set-default-timeout)
   * or [page.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-page#page-set-default-timeout) methods.
   */
  timeout?: number;
  /**
   * Specify screenshot type, defaults to `png`.
   * @default "png"
   */
  type?: "png" | "jpeg";
}

export interface PdfRequestOptions {
  /**
   * Display header and footer. Defaults to `false`.
   * @default false
   */
  displayHeaderFooter?: boolean;
  /** HTML template for the print footer. Should use the same format as the `headerTemplate`. */
  footerTemplate?: string;
  /**
   * Paper format. If set, takes priority over `width` or `height` options. Defaults to 'Letter'.
   * @default "Letter"
   */
  format?: string;
  /**
   * HTML template for the print header. Should be valid HTML markup with following classes used to inject printing
   * values into them:
   * - `'date'` formatted print date
   * - `'title'` document title
   * - `'url'` document location
   * - `'pageNumber'` current page number
   * - `'totalPages'` total pages in the document
   */
  headerTemplate?: string;
  /** Paper height, accepts values labeled with units. */
  height?: string | number;
  /**
   * Paper orientation. Defaults to `false`.
   * @default false
   */
  landscape?: boolean;
  /** Paper margins, defaults to none. */
  margin?: {
    /**
     * Top margin, accepts values labeled with units. Defaults to `0`.
     * @default 0
     */
    top?: string | number;
    /**
     * Right margin, accepts values labeled with units. Defaults to `0`.
     * @default 0
     */
    right?: string | number;
    /**
     * Bottom margin, accepts values labeled with units. Defaults to `0`.
     * @default 0
     */
    bottom?: string | number;
    /**
     * Left margin, accepts values labeled with units. Defaults to `0`.
     * @default 0
     */
    left?: string | number;
  };
  /** Paper ranges to print, e.g., '1-5, 8, 11-13'. Defaults to the empty string, which means print all pages. */
  pageRanges?: string;
  /**
   * The file path to save the PDF to. If `path` is a relative path, then it is resolved relative to the current working
   * directory. If no path is provided, the PDF won't be saved to the disk.
   */
  path?: string;
  /**
   * Give any CSS `@page` size declared in the page priority over what is declared in `width` and `height` or `format`
   * options. Defaults to `false`, which will scale the content to fit the paper size.
   */
  preferCSSPageSize?: boolean;
  /**
   * Print background graphics. Defaults to `false`.
   * @default false
   */
  printBackground?: boolean;
  /**
   * Scale of the webpage rendering. Defaults to `1`. Scale amount must be between 0.1 and 2.
   * @default 1
   */
  scale?: number;
  /** Paper width, accepts values labeled with units. */
  width?: string | number;
}

export interface ScreenshotRequest {
  gotoOptions?: GotoOptions;
  options?: ScreenshotRequestOptions;
  contextOptions?: ContextOptions;
  url: string;
}

export interface ContentRequest {
  gotoOptions?: GotoOptions;
  contextOptions?: ContextOptions;
  url: string;
}

export interface PdfRequest {
  gotoOptions?: GotoOptions;
  contextOptions?: ContextOptions;
  options?: PdfRequestOptions;
  url: string;
}

export interface Favicon {
  href: string;
  size: {
    width: number;
    height: number;
  };
}

export type ContentExtraResponse = {
  raw: string;
  sanitized: string;
  readability: {
    /** article title */
    title: string;
    /** HTML string of processed article content */
    content: string;
    /** text content of the article, with all the HTML tags removed */
    textContent: string;
    /** length of an article, in characters */
    length: number;
    /** article description, or short excerpt from the content */
    excerpt: string;
    /** author metadata */
    byline: string;
    /** content direction */
    dir: string;
    /** name of the site */
    siteName: string;
    /** content language */
    lang: string;
  } | null;
  favicon: {
    list: Favicon[];
    largest: Favicon | null;
  };
  opengraph: {
    title: string;
    type: string[];
    image: string;
    url: string;
    determiner: string;
    siteName: string;
    audio: string[];
    video: string[];
    description: string;
    locale: string;
    localeAlternate: string[];
  };
};

export interface InfoResponse {
  maxQueueLength: number;
  maxParallelSessions: number;
  queueLength: number;
  isAddAllowed: boolean;
  version: {
    npm: {
      "@mozilla/readability": string;
      "adblock-rs": string;
      dompurify: string;
      playwright: string;
      puppeteer: string;
    };
    browser: {
      chromium: string;
      firefox: string;
      webkit: string;
    };
  };
}

export interface Device {
  name: string;
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
  deviceScaleFactor: number;
  isMobile: boolean;
  hasTouch: boolean;
  defaultBrowserType: "chromium" | "firefox" | "webkit";
}

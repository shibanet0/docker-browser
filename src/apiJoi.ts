import Joi from "joi";
import {
  ContentRequest,
  ContextOptions,
  CustomOptions,
  CustomOptionsAutoScroll,
  CustomOptionsBlockResource,
  CustomOptionsBlockResourceResourceType,
  GotoOptions,
  PdfRequest,
  PdfRequestOptions,
  ScreenshotRequest,
  ScreenshotRequestOptions,
  ScreenshotRequestOptionsClip,
} from "./apiTypes.js";

const gotoOptions = Joi.object<GotoOptions, true>({
  referer: Joi.string(),
  timeout: Joi.string(),
  waitUntil: Joi.string(),
});

const contextOptions = Joi.object<ContextOptions, true>({
  bypassCSP: Joi.boolean(),
  colorScheme: Joi.string().valid("light", "dark", "no-preference"),
  deviceScaleFactor: Joi.number(),
  extraHTTPHeaders: Joi.object(),
  forcedColors: Joi.string().valid("active", "none"),
  geolocation: Joi.object<NonNullable<ContextOptions["geolocation"]>, true>({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    accuracy: Joi.number(),
  }),
  hasTouch: Joi.boolean(),
  httpCredentials: Joi.object<
    NonNullable<ContextOptions["httpCredentials"]>,
    true
  >({
    username: Joi.string().required(),
    password: Joi.string().required(),
    origin: Joi.string(),
  }),
  ignoreHTTPSErrors: Joi.boolean(),
  isMobile: Joi.boolean(),
  javaScriptEnabled: Joi.boolean(),
  locale: Joi.string(),
  offline: Joi.boolean(),
  permissions: Joi.array().items(Joi.string()),
  reducedMotion: Joi.string().valid("reduce", "no-preference"),
  screen: Joi.object<NonNullable<ContextOptions["screen"]>, true>({
    width: Joi.number().required(),
    height: Joi.number().required(),
  }),
  serviceWorkers: Joi.string().valid("allow", "block"),
  strictSelectors: Joi.boolean(),
  timezoneId: Joi.string(),
  userAgent: Joi.string(),
  viewport: Joi.object<NonNullable<ContextOptions["viewport"]>, true>({
    width: Joi.number().required(),
    height: Joi.number().required(),
  }),
});

const screenshotRequestOptionsClip = Joi.object<
  ScreenshotRequestOptionsClip,
  true
>({
  x: Joi.number().required(),
  y: Joi.number().required(),
  width: Joi.number().required(),
  height: Joi.number().required(),
});

const screenshotRequestOptions = Joi.object<ScreenshotRequestOptions, true>({
  animations: Joi.string().valid("disabled", "allow"),
  caret: Joi.string().valid("hide", "initial"),
  clip: screenshotRequestOptionsClip,
  fullPage: Joi.boolean(),
  maskColor: Joi.string(),
  omitBackground: Joi.boolean(),
  path: Joi.string(),
  quality: Joi.number(),
  scale: Joi.string().valid("css", "device"),
  timeout: Joi.number(),
  type: Joi.string().valid("png", "jpeg"),
});

const pdfRequestOptions = Joi.object<PdfRequestOptions, true>({
  displayHeaderFooter: Joi.boolean(),
  footerTemplate: Joi.string(),
  format: Joi.string(),
  headerTemplate: Joi.string(),
  height: Joi.alternatives(Joi.string(), Joi.number()),
  landscape: Joi.boolean(),
  margin: Joi.object<NonNullable<PdfRequestOptions["margin"]>, true>({
    top: Joi.alternatives(Joi.string(), Joi.number()),
    right: Joi.alternatives(Joi.string(), Joi.number()),
    bottom: Joi.alternatives(Joi.string(), Joi.number()),
    left: Joi.alternatives(Joi.string(), Joi.number()),
  }),
  pageRanges: Joi.string(),
  path: Joi.string(),
  preferCSSPageSize: Joi.boolean(),
  printBackground: Joi.boolean(),
  scale: Joi.number(),
  width: Joi.alternatives(Joi.string(), Joi.number()),
});

export const customOptionsBlockResource = Joi.array<
  CustomOptionsBlockResource[]
>().items(
  Joi.object<CustomOptionsBlockResource, true>({
    url: Joi.string().required(),
    resourceType: Joi.array()
      .items(
        Joi.string().valid(
          ...Object.values(CustomOptionsBlockResourceResourceType)
        )
      )
      .required(),
  })
);

export const customOptionsAutoScroll = Joi.object<
  CustomOptionsAutoScroll,
  true
>({
  enable: Joi.boolean().required(),
  frequency: Joi.number(),
  timing: Joi.number(),
});

export const customOptions = Joi.object<CustomOptions, true>({
  autoScroll: customOptionsAutoScroll,
  blockResource: customOptionsBlockResource,
});

export const screenshotRequest = Joi.object<ScreenshotRequest, true>({
  customOptions,
  gotoOptions,
  contextOptions,
  options: screenshotRequestOptions,
  url: Joi.string().required(),
});

export const contentRequest = Joi.object<ContentRequest, true>({
  customOptions,
  gotoOptions,
  contextOptions,
  url: Joi.string().required(),
});

export const pdfRequest = Joi.object<PdfRequest, true>({
  customOptions,
  gotoOptions,
  contextOptions,
  options: pdfRequestOptions,
  url: Joi.string().required(),
});

import { JSDOM } from "jsdom";

export interface OpenGraph {
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
}

const getOgContent = (document: Document, ...properties: string[]) => {
  return (
    document
      .querySelector(
        properties.map((el) => `meta[property="og:${el}"]`).join(", ")
      )
      ?.getAttribute("content") || ""
  );
};

const getOgContentList = (document: Document, ...properties: string[]) => {
  return Array.from(
    document
      .querySelectorAll(
        properties.map((el) => `meta[property="og:${el}"]`).join(", ")
      )
      .entries()
  )
    .map(([, el]) => el.getAttribute("content") || "")
    .filter((el) => !!el);
};

export const getOpenGraph = (dom: JSDOM) => {
  const document = dom.window.document;

  const title = getOgContent(document, "title");
  const type = getOgContentList(document, "type");
  const image = getOgContent(
    document,
    "image",
    "image:url",
    "image:secure_url"
  );
  const url = getOgContent(document, "url");

  const determiner = getOgContent(document, "determiner");
  const siteName = getOgContent(document, "site_name");
  const audio = getOgContentList(document, "audio", "audio:secure_url");
  const video = getOgContentList(document, "video", "video:secure_url");
  const description = getOgContent(document, "description");
  const locale = getOgContent(document, "locale");
  const localeAlternate = getOgContentList(document, "locale:alternate");

  return {
    title,
    description,
    type,
    image,
    url,
    determiner,
    siteName,
    audio,
    video,
    locale,
    localeAlternate,
  };
};

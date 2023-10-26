import { JSDOM } from "jsdom";

export interface FaviconItem {
  href: string;
  size: {
    width: number;
    height: number;
  };
}

export interface Favicon {
  list: FaviconItem[];
  largest: FaviconItem | null;
}

const parseSize = (size: string) => {
  try {
    if (!size) {
      throw new Error("size unknown");
    }

    const [height, width] = size.toLowerCase().split("x");
    return { height: parseInt(height), width: parseInt(width) };
  } catch (err) {
    return { width: 0, height: 0 };
  }
};

export const getFavicon = (dom: JSDOM): Favicon => {
  const list = Array.from(
    dom.window.document
      .querySelectorAll('link[rel*="icon"], link[rel="shortcut icon"]')
      .entries()
  )
    .map(
      ([, el]): FaviconItem => ({
        href: el.getAttribute("href") || "",
        size: parseSize(el.getAttribute("sizes") || ""),
      })
    )
    .filter((el) => el.href);

  return {
    list,
    largest: getLargestFaviconUrl(list),
  };
};

const getLargestFaviconUrl = (list: FaviconItem[]) => {
  if (!list.length) {
    return null;
  }

  return list.reduce<{ icon: FaviconItem | null; maxDimension: number }>(
    (acc, icon) => {
      const dimension = icon.size.width * icon.size.height;

      if (dimension > acc.maxDimension) {
        acc.maxDimension = dimension;
        acc.icon = icon;
      }

      return acc;
    },
    { icon: null, maxDimension: 0 }
  ).icon;
};

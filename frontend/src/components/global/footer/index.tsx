"use client";

import type { LAYOUT_FOOTER_QUERY_RESULT } from "@/sanity/types";
import type { StegaAware } from "@/sanity/page-builder";
import SimpleFooter from "./simple";
import MinimalFooter from "./minimal";
import TinyFooter from "./tiny";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/i18n-config";

type FooterData = StegaAware<NonNullable<LAYOUT_FOOTER_QUERY_RESULT>>;

type FooterProps = FooterData & {
  dictionary: Dictionary['footer'];
  locale: Locale;
  alternates?: Record<string, string>;
  languageNames?: Record<string, string>;
}

export default function FooterComponent(props: FooterProps) {
  const { variant = "simple", dictionary } = props;

  if (!dictionary) {
    return null;
  }

  switch (variant) {
    case "minimal":
      return <MinimalFooter {...props} dictionary={dictionary} />;
    case "tiny":
      return <TinyFooter {...props} dictionary={dictionary} />;
    case "simple":
    default:
      return <SimpleFooter {...props} dictionary={dictionary} />;
  }
}


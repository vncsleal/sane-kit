"use client";

import type { Footer } from "@/sanity/types";
import SimpleFooter from "./simple";
import MinimalFooter from "./minimal";
import TinyFooter from "./tiny";
import type { Dictionary } from "@/i18n/getDictionary";

interface FooterProps extends Footer {
  dictionary: Dictionary['footer'];
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


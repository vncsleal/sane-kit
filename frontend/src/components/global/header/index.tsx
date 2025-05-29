"use client";

import type { Header as SanityHeaderType } from "@/sanity/types";
import Default from "./default";
import Centered from "./centered";
import Minimal from "./minimal";
import Transparent from "./transparent";
import { Locale } from "@/i18n/i18n-config";
import { Dictionary } from "@/i18n/getDictionary"; // Import the Dictionary type

export type HeaderProps = {
  locale: Locale;
  dictionary: Dictionary; // Use the imported Dictionary type
} & Partial<Omit<SanityHeaderType, 'language'>>;

export default function HeaderRouter(props: HeaderProps) {
  const { variant = props.variant || "default" } = props;

  const commonProps = {
    ...props,
  };

  switch (variant) {
    case "centered":
      return <Centered {...commonProps} />;
    case "minimal":
      return <Minimal {...commonProps} />;
    case "transparent":
      return <Transparent {...commonProps} />;
    case "default":
    default:
      return <Default {...commonProps} />;
  }
}

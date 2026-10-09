"use client";

import type { ExtractPageBuilderType } from "@/sanity/page-builder";
import { stegaClean } from 'next-sanity';
import SideBySide from "./sideBySide";
import Centered from "./centered";

export default function FaqSectionRouter(props: ExtractPageBuilderType<"faqSection">) {
  const { variant = "sideBySide" } = props;

  // Route to the appropriate variant component
  switch (stegaClean(variant)) {
    case "centered":
      return <Centered {...props} />;
    case "sideBySide":
    default:
      return <SideBySide {...props} />;
  }
}

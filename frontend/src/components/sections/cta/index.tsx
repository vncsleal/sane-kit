"use client";

import type { ExtractPageBuilderType } from "@/sanity/page-builder";
import { stegaClean } from 'next-sanity';
import Default from "./default";
import Highlight from "./highlight";
import Minimal from "./minimal";
import Full from "./full";

export default function CtaSectionRouter(props: ExtractPageBuilderType<"ctaSection">) {
  const { variant = "default" } = props;

  // Route to the appropriate variant component
  switch (stegaClean(variant)) {
    case "highlight":
      return <Highlight {...props} />;
    case "minimal":
      return <Minimal {...props} />;
    case "full":
      return <Full {...props} />;
    case "default":
    default:
      return <Default {...props} />;
  }
}

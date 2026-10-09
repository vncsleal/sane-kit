"use client";

import type { ExtractPageBuilderType } from "@/sanity/page-builder";
import { stegaClean } from 'next-sanity';
import ButtonBanner from "./buttonBanner";
import BadgeBanner from "./badgeBanner";
import GridGallery from "./gridGallery";

export default function HeroSectionRouter(props: ExtractPageBuilderType<"heroSection">) {
  const { variant = "buttonBanner" } = props;

  // Route to the appropriate variant component
  switch (stegaClean(variant)) {
    case "badgeBanner":
      return <BadgeBanner {...props} />;
    case "gridGallery":
      return <GridGallery {...props} />;
    case "buttonBanner":
    default:
      return <ButtonBanner {...props} />;
  }
}

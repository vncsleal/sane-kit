"use client";

import type { ExtractPageBuilderType } from "@/sanity/page-builder";
import { stegaClean } from 'next-sanity';
import SlidingComparison from "./slidingComparison";
import CarouselFeature from "./carouselFeature";
import BigMasonryGrid from "./bigMasonryGrid";
import MasonryGrid from "./masonryGrid";
import ImageCards from "./imageCards";
import LeftImage from "./leftImage";
import RightImage from "./rightImage";
import WithImage from "./withImage";
import Default from "./default";

export default function FeatureSectionRouter(props: ExtractPageBuilderType<"featureSection">) {
  const { variant = "default" } = props;

  // Route to the appropriate variant component
  switch (stegaClean(variant)) {
    case "slidingComparison":
      return <SlidingComparison {...props} />;
    case "carouselFeature":
      return <CarouselFeature {...props} />;
    case "bigMasonryGrid":
      return <BigMasonryGrid {...props} />;
    case "masonryGrid":
      return <MasonryGrid {...props} />;
    case "imageCards":
      return <ImageCards {...props} />;
    case "leftImage":
      return <LeftImage {...props} />;
    case "rightImage":
      return <RightImage {...props} />;
    case "withImage":
      return <WithImage {...props} />;
    case "default":
    default:
      return <Default {...props} />;
  }
}

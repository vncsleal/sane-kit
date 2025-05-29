"use client";

import { useParams } from "next/navigation";
import type { BlogSection } from "@/sanity/types";
import type { Locale } from "@/i18n/i18n-config";
import type { BlogPostWithData } from "./shared";
import Default from "./default";
import Grid from "./grid";

interface BlogSectionComponentProps extends BlogSection {
  posts?: BlogPostWithData[];
}

export default function BlogSectionComponent(props: BlogSectionComponentProps) {
  const params = useParams();
  const locale = params.locale as Locale;
  const { variant = "default" } = props;

  switch (variant) {
    case "grid":
      return <Grid {...props} locale={locale} />;
    case "default":
    default:
      return <Default {...props} locale={locale} />;
  }
}

export type { BlogSection, BlogSectionComponentProps };

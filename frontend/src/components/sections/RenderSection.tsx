"use client";

import HeroSection from "./HeroSection";
import CasesSection from "./CasesSection";
import TestimonialsSection from "./TestimonialsSection";
import PricingSection from "./PricingSection";
import CompareFeaturesSection from "./CompareFeaturesSection";
import StatsSection from "./StatsSection";
import CTASection from "./CTASection";
import FAQSection from "./FAQSection";
import FeatureSection from "./FeatureSection";
import BlogSection from "./BlogSection";
import ContactSection from "./ContactSection";
import NewsletterSection from "./NewsletterSection";
import { logger } from "@/lib/logger";
import type { Locale } from "@/i18n/i18n-config";
import type { PageBuilderSection, ResolvedSectionData } from "@/sanity/page-builder";

interface RenderSectionProps {
	section: PageBuilderSection;
	locale: Locale;
	/** Server-resolved data for sections that reference other documents. */
	resolved?: ResolvedSectionData;
}

/**
 * Maps a page-builder block to its section component. Rendered inside the
 * client `<PageBuilder>` so optimistic edits pushed from the Studio reconcile.
 * Sections that reference other documents receive their resolved data via
 * `resolved` (see `resolvePageBuilderData`).
 */
export default function RenderSection({ section, locale, resolved }: RenderSectionProps) {
	switch (section._type) {
		case "heroSection":
			return <HeroSection {...section} />;
		case "casesSection":
			return <CasesSection {...section} />;
		case "testimonialsSection":
			return <TestimonialsSection {...section} />;
		case "pricingSection":
			return <PricingSection {...section} />;
		case "compareFeaturesSection":
			return <CompareFeaturesSection {...section} features={resolved?.features ?? []} />;
		case "statsSection":
			return <StatsSection {...section} />;
		case "ctaSection":
			return <CTASection {...section} />;
		case "faqSection":
			return <FAQSection {...section} />;
		case "featureSection":
			return <FeatureSection {...section} />;
		case "blogSection":
			return <BlogSection {...section} locale={locale} posts={resolved?.posts ?? []} />;
		case "contactSection":
			return <ContactSection {...section} />;
		case "newsletterSection":
			return <NewsletterSection {...section} />;
		default:
			logger.warn(`Unknown section type: ${(section as { _type: string })._type}`);
			return null;
	}
}

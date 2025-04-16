import type { SanitySection } from "@/sanity/types/schema";
import React from "react";
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

interface RenderSectionProps {
	section: SanitySection;
}

export default function RenderSection({ section }: RenderSectionProps) {
	// Use discriminated union pattern with _type property to determine which component to render
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
			return <CompareFeaturesSection {...section} />;
		case "statsSection":
			return <StatsSection {...section} />;
		case "ctaSection":
			return <CTASection {...section} />;
		case "faqSection":
			return <FAQSection {...section} />;
		case "featureSection":
			return <FeatureSection {...section} />;
		case "blogSection":
			return <BlogSection {...section} />;
		case "contactSection":
			return <ContactSection {...section} />;
		case "newsletterSection":
			return <NewsletterSection {...section} />;
		default:
			console.warn(
				`Unknown section type: ${(section as { _type: string })._type}`,
			);
			return null;
	}
}

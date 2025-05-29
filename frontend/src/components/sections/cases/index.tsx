"use client";

import type { CasesSection } from "@/sanity/types";
import LogoCarousel from "./logoCarousel";
import CompactSlider from "./compactSlider";

export default function CasesSection({
	heading,
	subheading,
	variant = "logoCarousel",
	cases = [],
}: CasesSection) {
	// Prepare just the props needed for variant components
	const variantProps = { 
		heading, 
		subheading, 
		cases 
	};
	
	// Route to the appropriate variant component based on the variant prop
	switch (variant) {
		case "logoCarousel":
			return <LogoCarousel {...variantProps} />;
		case "compactSlider":
			return <CompactSlider {...variantProps} />;
		default:
			// Fallback to logoCarousel as default variant
			return <LogoCarousel {...variantProps} />;
	}
}

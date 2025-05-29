"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/i18n/getDictionary";

interface ScrollToTopButtonProps {
	dictionary?: Pick<Dictionary['general'], 'scrollToTop'>;
}

export function ScrollToTopButton({ dictionary }: ScrollToTopButtonProps) {
	const [isVisible, setIsVisible] = useState(false);

	// Show button when page is scrolled down
	const toggleVisibility = useCallback(() => {
		if (window.scrollY > 300) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	}, []);

	// Set up scroll event listener
	useEffect(() => {
		window.addEventListener("scroll", toggleVisibility);
		return () => {
			window.removeEventListener("scroll", toggleVisibility);
		};
	}, [toggleVisibility]);

	// Scroll to top handler
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={scrollToTop}
			className={cn(
				"fixed bottom-4 right-4 z-50 rounded transition-opacity duration-300",
				isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
			)}
			aria-label={dictionary?.scrollToTop || "Back to top"}
		>
			<ArrowUp className="h-4 w-4" />
		</Button>
	);
}

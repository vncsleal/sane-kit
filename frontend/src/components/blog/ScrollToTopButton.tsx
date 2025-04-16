"use client";

import { useState, useEffect, useCallback } from "react"; // Import useCallback
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Assuming you have a utility function like this

export function ScrollToTopButton() {
	const [isVisible, setIsVisible] = useState(false);

	// Show button when page is scrolled down
	// Wrap toggleVisibility in useCallback
	const toggleVisibility = useCallback(() => {
		if (window.scrollY > 300) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	}, []); // Empty dependency array as it doesn't depend on props or state

	// Set up scroll event listener
	useEffect(() => {
		window.addEventListener("scroll", toggleVisibility);
		return () => {
			window.removeEventListener("scroll", toggleVisibility);
		};
	}, [toggleVisibility]); // Add toggleVisibility to dependency array

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
				isVisible ? "opacity-100" : "opacity-0 pointer-events-none", // Control visibility
			)}
			aria-label="Scroll to top"
		>
			<ArrowUp className="h-4 w-4" />
		</Button>
	);
}

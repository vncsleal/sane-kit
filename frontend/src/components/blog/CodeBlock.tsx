"use client";

import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, Check, FileCode } from "lucide-react";
import { useState, useEffect } from "react";
import { CodeBlock as Code } from "react-code-blocks";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface CodeBlockProps {
	code: string;
	language?: string;
	filename?: string;
	title?: string;
	highlightLines?: string;
	caption?: string;
	showLineNumbers?: boolean;
}

export function CodeBlock({
	code = "",
	language = "typescript",
	filename,
	title,
	highlightLines,
	caption,
	showLineNumbers = true,
}: CodeBlockProps) {
	const [copied, setCopied] = useState(false);
	useTheme();
	const [mounted, setMounted] = useState(false);
	const displayTitle = title || filename;

	// Only render theme-dependent UI after mounting to prevent hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		toast.success("Copied to clipboard");
		setTimeout(() => setCopied(false), 2000);
	};

	// Create a custom theme based on GitHub Dark theme for VS Code with updated colors
	const customTheme = {
		// Base colors - updated for visual effect
		lineNumberColor: "#6e7681", // Softer gray for line numbers
		lineNumberBgColor: "#0d1117", // GitHub dark background for line numbers
		backgroundColor: "#25292E", // Slightly lighter background for code area
		textColor: "#f0f6fc", // Bright white text for better readability

		// Core syntax elements - GitHub Dark theme inspired
		keywordColor: "#ff7b72", // Keywords like: import, export, return (pinkish-red)
		attributeColor: "#79c0ff", // Attributes and decorators (blue)
		selectorTagColor: "#ff7b72", // HTML tags and selectors (pinkish-red)
		nameColor: "#ffa657", // Function names, component names, AND interface names (yellow)

		// Types and interfaces
		typeColor: "#ffa657", // Type definitions and interfaces (orange)
		builtInColor: "#79c0ff", // Built-in types like string, number (blue)
		propertyColor: "#79c0ff", // Object properties (blue)

		// Add additional properties for interface highlighting
		interfaceColor: "#ffa657", // Interface names (yellow)
		classNameColor: "#ffa657", // Class/Interface names (yellow)
		entityNameColor: "#ffa657", // Entity names including interfaces (yellow)

		// Values
		stringColor: "#a5d6ff", // String literals (light blue)
		numberColor: "#79c0ff", // Numeric literals (blue)
		functionColor: "#d2a8ff", // Function calls (purple)
		constantColor: "#79c0ff", // Constants and enum values (blue)

		// Others
		punctuationColor: "#c9d1d9", // Punctuation marks (light gray)
		commentColor: "#8b949e", // Comments (gray)
		substringColor: "#a5d6ff", // Substrings and template literals (light blue)
		symbolColor: "#ffa657", // Symbols (orange)
		metaColor: "#79c0ff", // Meta information (blue)
		atomColor: "#79c0ff", // Atoms/boolean literals (blue)
		classColor: "#ffa657", // Class names (orange)
	};

	// Update custom style to conditionally apply border radius
	const customStyle = {
		// Apply different border radius based on whether title/filename exists
		borderRadius: displayTitle
			? "0 0 var(--radius-md) var(--radius-md)" // Only round bottom corners when title exists
			: "var(--radius-md)", // Round all corners when no title
		padding: "1rem 1rem",
		fontSize: "0.875rem",
		fontFamily: "var(--font-mono)",
		lineHeight: "1.7",
	};

	return (
		<div className="relative my-6">
			{/* Title/Filename header */}
			{displayTitle && (
				<div className="flex items-center gap-2 bg-[#25292E] px-4 py-2.5 text-sm font-mono text-white/50 rounded-t-md">
					<FileCode className="h-4 w-4 text-white/50" />
					<span className="flex-1 truncate">{displayTitle}</span>
					{language && (
						<span className="mr-6 px-2 text-xs text-muted-foreground">
							{language}
						</span>
					)}
				</div>
			)}
			{/* No need for dynamic class on this wrapper div since we're handling in customStyle */}
			<div className="overflow-hidden">
				{/* Render the CodeBlock with custom theme only after mounting */}
				{mounted ? (
					<Code
						text={code}
						language={language}
						showLineNumbers={showLineNumbers}
						theme={customTheme}
						customStyle={customStyle}
						highlight={highlightLines}
					/>
				) : (
					<div
						className="bg-[#25292E] text-[#f0f6fc] p-4 rounded-md"
						style={customStyle}
					>
						Loading code editor...
					</div>
				)}
			</div>

			{/* Caption if provided */}
			{caption && (
				<div className="mt-2 text-sm text-muted-foreground">{caption}</div>
			)}

			{/* Copy button with tooltip */}
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="absolute text-white hover:text-primary hover:bg-transparent top-1.5 right-2 h-8 w-8 p-0 z-10"
							onClick={handleCopy}
						>
							{copied ? (
								<Check className="h-4 w-4" />
							) : (
								<Copy className="h-4 w-4" />
							)}
							<span className="sr-only">Copy code</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>{copied ? "Copied!" : "Copy code"}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
}

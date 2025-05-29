import type { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/client";
import type { CodeBlock as SanityCodeBlock, Code as SanityCode, SanityImageHotspot, SanityImageCrop } from "@/sanity/types";
import { CodeBlock } from "./CodeBlock";

// Basic components, customize as needed
export const portableTextComponents: PortableTextComponents = {
	types: {
		image: ({ value }: { value: { 
			asset?: { _ref: string; _type: string };
			hotspot?: SanityImageHotspot;
			crop?: SanityImageCrop;
			alt?: string;
			caption?: string;
			_type: string;
		} }) => {
			if (!value?.asset?._ref) {
				return null;
			}
			return (
				<div className="relative my-6 aspect-video overflow-hidden rounded-md">
					<Image
						src={urlFor(value.asset._ref).url()}
						alt={value.alt || ""} // Provide fallback alt
						fill
						className="object-cover"
					/>
					{value.caption && (
						<figcaption className="mt-2 text-center text-sm text-muted-foreground">
							{value.caption}
						</figcaption>
					)}
				</div>
			);
		},
		// Fixed codeBlock component with proper property passing
		codeBlock: ({ value }: { value: SanityCodeBlock }) => {
			// With additional defensive null checks
			if (!value) {
				return null;
			}

			// Handle direct string code (legacy format)
			if (typeof value.code === "string") {
				return (
					<CodeBlock
						code={value.code}
						title={value.title || ""}
						language={"typescript"} // Default to typescript
						showLineNumbers={value.showLineNumbers === "true"}
						highlightLines={value.highlightLines}
						caption={value.caption}
					/>
				);
			}

			// Handle new code input format ({_type: 'code', code: '...', language: '...'})
			if (typeof value.code === "object" && value.code !== null) {
				// Extract simple string from the code object
				const codeText = (value.code as SanityCode).code || "";
				const language = (value.code as SanityCode).language || "typescript";
				const filename = (value.code as SanityCode).filename || "";

				return (
					<CodeBlock
						code={codeText}
						filename={filename}
						title={value.title || ""}
						language={language}
						showLineNumbers={value.showLineNumbers === "true"}
						highlightLines={value.highlightLines}
						caption={value.caption}
					/>
				);
			}

			// Fallback for unexpected format
			return <p>Error: Invalid code block format</p>;
		},
	},
	marks: {
		link: ({ children, value }) => {
			const rel = !value.href.startsWith("/")
				? "noreferrer noopener"
				: undefined;
			const target = value.blank ? "_blank" : undefined;
			return (
				<Link href={value.href} rel={rel} target={target}>
					{children}
				</Link>
			);
		},
	},
	block: {
		h1: ({ children }) => (
			<h1 className="text-4xl font-bold my-6">{children}</h1>
		),
		h2: ({ children }) => (
			<h2 className="text-3xl font-semibold my-5">{children}</h2>
		),
		h3: ({ children }) => (
			<h3 className="text-2xl font-semibold my-4">{children}</h3>
		),
		h4: ({ children }) => (
			<h4 className="text-xl font-semibold my-3">{children}</h4>
		),
		blockquote: ({ children }) => (
			<blockquote className="border-l-4 pl-4 italic my-4 text-muted-foreground">
				{children}
			</blockquote>
		),
	},
	list: {
		bullet: ({ children }) => (
			<ul className="list-disc ml-6 my-4">{children}</ul>
		),
		number: ({ children }) => (
			<ol className="list-decimal ml-6 my-4">{children}</ol>
		),
	},
	listItem: {
		bullet: ({ children }) => <li className="mb-1">{children}</li>,
		number: ({ children }) => <li className="mb-1">{children}</li>,
	},
};

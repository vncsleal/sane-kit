"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "./CodeBlock";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/i18n-config";
import {
	PortableText,
	type PortableTextReactComponents,
	type PortableTextComponentProps,
} from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/client";
import {
	Twitter,
	Linkedin,
	Github,
	Instagram,
	Globe,
	Youtube,
	Mail,
} from "lucide-react";
import type {
	Author,
	Category,
	CodeBlock as SanityCodeBlock,
	Code as SanityCode,
	PortableText as SanityPortableText,
	SanityImageHotspot,
	SanityImageCrop,
  Slug as SanitySlug // Import Slug as SanitySlug to avoid naming conflicts if any
} from "@/sanity/types";
import { BlogShareButton } from "./BlogShareButton";

// Define the structure that represents post data after it's been fetched
// and references have been expanded - modified to match BlogPostData
export interface ExpandedBlogPost {
	_id: string;
	_type: "blogPost";
	title: string;
	slug: {
		current: string;
	};
	publishedAt: string;
	excerpt?: string;
	mainImage?: {
		asset?: { _ref: string; _type: string };
		hotspot?: SanityImageHotspot;
		crop?: SanityImageCrop;
		alt?: string;
		_type: string;
	};
	body?: SanityPortableText;
	featured?: string | boolean;
	authors?: Author[];
	author: Author;
	categories?: Array<{
		originalReferenceId?: string;
		i18nId?: string;
    // localized is a full Category object, but we must ensure its _id and slug are what we expect.
		localized?: Category & { _id: string; slug: SanitySlug }; 
    // Fields from the direct reference as a fallback or for non-localized scenarios
    _id: string; 
    title?: string; 
    slug?: SanitySlug; 
    description?: string; 
	}>;
}

// Using SanityCodeBlock from the official types

interface BlogPostPageProps {
	post: ExpandedBlogPost;
	dictionary?: Dictionary;
	locale: Locale; // Add locale prop
}

// Social icon mapping
const SocialIcons = {
	twitter: Twitter,
	linkedin: Linkedin,
	github: Github,
	instagram: Instagram,
	website: Globe,
	youtube: Youtube,
} as const;

export default function BlogPostPage({ post, dictionary, locale }: BlogPostPageProps) {
	// Use dictionary from props with fallback
	const staticText = dictionary ? {
		...dictionary.general,
		...dictionary.post,
		...dictionary.notFound,
		...dictionary.blog,
		...dictionary.share,
		...dictionary.code,
	} : {
		// Fallback values
		minRead: "min read",
		aboutTheAuthor: "About the Author",
		email: "Email",
		noImage: "No image available",
		unknownType: "Unknown content type",
	};

	// PortableText components for rendering blog content with improved styling
	const components: PortableTextReactComponents = {
		types: {
			image: ({
				value,
			}: PortableTextComponentProps<{
				asset: { _ref: string };
				alt?: string;
				caption?: string;
			}>) => (
				<figure className="my-8">
					<div className="relative w-full rounded-md overflow-hidden">
						<Image
							src={urlFor(value.asset._ref).url()}
							alt={value.alt || ""}
							width={800}
							height={500}
							className="w-full h-auto object-cover"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
						/>
					</div>
					{value.caption && (
						<figcaption className="text-sm text-muted-foreground mt-2 text-center">
							{value.caption}
						</figcaption>
					)}
				</figure>
			),
			codeBlock: ({ value }: PortableTextComponentProps<SanityCodeBlock>) => {
				// Handle case where code is an object from Sanity code-input plugin
				if (typeof value.code === "object" && value.code !== null) {
					const codeObj = value.code as SanityCode;
					return (
						<CodeBlock
							code={codeObj.code || ""}
							language={codeObj.language || "typescript"}
							filename={codeObj.filename || ""}
							title={value.title || ""}
							highlightLines={value.highlightLines}
							showLineNumbers={value.showLineNumbers === "true"}
							caption={value.caption || ""}
						/>
					);
				}

				// Handle string code (legacy format)
				return (
					<CodeBlock
						code={typeof value.code === "string" ? value.code : ''}
						language={"typescript"} // Default to typescript
						filename={""}
						title={value.title || ""}
						highlightLines={value.highlightLines}
						showLineNumbers={value.showLineNumbers === "true"}
						caption={value.caption || ""}
					/>
				);
			},
		},
		block: {
			normal: ({ children }) => <p className="mb-4">{children}</p>,
			h1: ({ children }) => (
				<h1 className="text-4xl font-bold tracking-tight mt-12 mb-6">
					{children}
				</h1>
			),
			h2: ({ children }) => (
				<h2 className="text-3xl font-semibold tracking-tight mt-10 mb-4">
					{children}
				</h2>
			),
			h3: ({ children }) => (
				<h3 className="text-2xl font-semibold tracking-tight mt-8 mb-4">
					{children}
				</h3>
			),
			h4: ({ children }) => (
				<h4 className="text-xl font-semibold tracking-tight mt-6 mb-4">
					{children}
				</h4>
			),
			blockquote: ({ children }) => (
				<blockquote className="pl-6 py-2 my-6 border-l-4 border-primary bg-primary/5 italic">
					{children}
				</blockquote>
			),
			code: ({ children }) => {
				// Extract code content as string
				const codeString =
					typeof children === "string"
						? children
						: Array.isArray(children)
							? children.join("")
							: String(children || "");

				// Properly handle the string value
				return <CodeBlock code={codeString} />;
			},
		},
		marks: {
			code: ({ children }) => {
				// For inline code, keep it simple
				return (
					<code className="px-1.5 py-0.5 bg-muted text-sm font-mono rounded">
						{typeof children === "string" ? children : String(children)}
					</code>
				);
			},
			link: ({ value, children }) => {
				const href = value?.href || "";
				const isInternal = href.startsWith("/") || href.startsWith("#") || (!href.startsWith("http") && !href.startsWith("mailto"));
				const target = isInternal ? undefined : "_blank";
				const localizedHref = isInternal ? `/${locale}${href}` : href;

				return (
					<Link
						href={localizedHref}
						target={target}
						className="text-primary hover:underline"
					>
						{children}
					</Link>
				);
			},
		},
		list: {
			bullet: ({ children }) => (
				<ul className="list-disc pl-5 mb-4">{children}</ul>
			),
			number: ({ children }) => (
				<ol className="list-decimal pl-5 mb-4">{children}</ol>
			),
		},
		listItem: {
			bullet: ({ children }) => <li className="mb-2">{children}</li>,
			number: ({ children }) => <li className="mb-2">{children}</li>,
		},
		hardBreak: () => <br />, 
		unknownMark: ({ children }) => <>{children}</>, 
		unknownType: () => <div>{staticText.unknownType}</div>,
		unknownBlockStyle: ({ children }) => <div>{children}</div>, 
		unknownList: ({ children }) => <ul>{children}</ul>, 
		unknownListItem: ({ children }) => <li>{children}</li>, 
	};

	return (
		<article className="max-w-4xl mx-auto px-4 py-12 md:py-20">
			<header className="mb-12">
				
				<div className="flex gap-2 mb-4 flex-wrap">
					{post.categories?.map((categoryWrapper) => {
            // Use the localized data if available, otherwise fallback to the direct reference
            const categoryToDisplay = categoryWrapper.localized || categoryWrapper;
            
            // Ensure categoryToDisplay and its slug are defined before creating the link
            if (categoryToDisplay && categoryToDisplay.slug?.current && categoryToDisplay.title) {
              return (
                <Link
                  href={`/${locale}/blog/category/${categoryToDisplay.slug.current}`}
                  // Use the _id of the localized category if available, otherwise the original reference's _id.
                  key={categoryWrapper.localized?._id || categoryWrapper.originalReferenceId || categoryWrapper._id}
                >
                  <Badge>{categoryToDisplay.title}</Badge>
                </Link>
              );
            }
            return null; // Or some fallback UI if the category/slug is missing
          })}
				</div>

				{/* Title */}
				<h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
					{post.title}
				</h1>

				{/* Author and date */}
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-4">
						<Avatar className="h-12 w-12">
							{post.author.avatar?.asset?._ref ? (
								<AvatarImage
									src={urlFor(post.author.avatar.asset._ref).url()}
									alt={post.author.name}
								/>
							) : null}
							<AvatarFallback>
								{post.author.name 
									? post.author.name
										.split(" ")
										.map((n) => n[0])
										.join("")
										.toUpperCase()
										.substring(0, 2)
									: "AU"}
							</AvatarFallback>
						</Avatar>

						<div>
							<Link
								href={`/${locale}/blog/author/${post.author.slug?.current}`}
								className="font-medium hover:underline"
							>
								{post.author.name}
							</Link>
							<div className="flex items-center text-sm text-muted-foreground">
								<span>
									{new Date(post.publishedAt).toLocaleDateString("pt-BR", {
										year: "numeric",
										month: "short",
										day: "numeric",
									})}
								</span>
								<span className="mx-2">•</span>
								<span>
									{post.body
										? `${Math.ceil(
												post.body
													.filter((block) => block._type === "block")
													.map((block) => {
														if (block._type !== "block") return "";
														return (block.children || [])
															.map((child) => child.text || "")
															.join("");
													})
													.join(" ")
													.split(/\s+/).length / 200,
											)} ${staticText.minRead}`
										: `3 ${staticText.minRead}`}
								</span>
							</div>
						</div>
					</div>

					{/* Desktop share button */}
					<div className="hidden md:flex gap-2">
						<BlogShareButton title={post.title} dictionary={staticText} />
					</div>
				</div>

				{/* Featured image */}
				{post.mainImage?.asset?._ref ? (
					<div className="relative aspect-video w-full mb-10 rounded-lg overflow-hidden">
						<Image
							src={urlFor(post.mainImage.asset._ref).url()}
							alt={post.mainImage.alt || post.title}
							fill
							priority
							className="object-cover"
						/>
					</div>
				) : (
					<div className="w-full aspect-video mb-10 bg-muted rounded-lg flex items-center justify-center">
						<span className="text-muted-foreground">{staticText.noImage}</span>
					</div>
				)}
			</header>

			{/* Content */}
			{post.body ? (
				<div className="prose prose-lg dark:prose-invert max-w-none">
					<PortableText value={post.body} components={components} />
				</div>
			) : (
				<p className="text-muted-foreground">{post.excerpt}</p>
			)}

			{/* Author bio */}
			{post.author.bio && (
				<div className="mt-16 pt-8 border-t">
					<h2 className="text-xl font-semibold mb-4">{staticText.aboutTheAuthor}</h2>
					<div className="p-6 bg-muted/30 rounded-lg">
						<div className="flex flex-col md:flex-row gap-6">
							<Avatar className="h-20 w-20">
								{post.author.avatar?.asset?._ref ? (
									<AvatarImage
										src={urlFor(post.author.avatar.asset._ref).url()}
										alt={post.author.name}
									/>
								) : null}
								<AvatarFallback>
									{post.author.name 
										? post.author.name
											.split(" ")
											.map((n) => n[0])
											.join("")
											.toUpperCase()
											.substring(0, 2)
										: "AU"}
								</AvatarFallback>
							</Avatar>

							<div className="flex-1">
								<Link
									href={`/${locale}/blog/author/${post.author.slug?.current}`}
									className="text-lg font-medium hover:underline"
								>
									{post.author.name}
								</Link>

								{/* Social links */}
								{post.author.socialLinks &&
									post.author.socialLinks.length > 0 && (
										<div className="flex gap-2 mt-2 md:mt-0">
											{post.author.socialLinks.map((link) => {
												const platform =
													link.platform as keyof typeof SocialIcons;
												const Icon = SocialIcons[platform];
												return (
													<Button
														key={link._key}
														variant="ghost"
														size="sm"
														className="h-8 w-8 p-0 rounded"
														asChild
													>
														<Link
															href={link.url || '#'}
															target="_blank"
															rel="noopener noreferrer"
														>
															<Icon className="h-4 w-4" />
															<span className="sr-only">{platform}</span>
														</Link>
													</Button>
												);
											})}
											{post.author.email && (
												<Button
													variant="ghost"
													size="sm"
													className="h-8 w-8 p-0 rounded"
													asChild
												>
													<Link href={`mailto:${post.author.email}`}>
														<Mail className="h-4 w-4" />
														<span className="sr-only">{staticText.email}</span>
													</Link>
												</Button>
											)}
										</div>
									)}
								<p className="text-muted-foreground">{post.author.bio}</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</article>
	);
}

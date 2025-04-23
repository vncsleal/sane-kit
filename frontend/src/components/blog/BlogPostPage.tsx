"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "./CodeBlock";
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
	SanityBlogPost,
	SanityAuthor,
	SanityCategory,
	PortableTextImage as SanityPortableTextImage,
} from "@/sanity/types/schema";
import { BlogShareButton } from "./BlogShareButton";
import { useLanguage } from "@/lib/language-context";

// Define translations for static text
const staticText = {
	aboutTheAuthor: {
		en: "About the author",
		pt_BR: "Sobre o autor",
	},
	minRead: {
		en: "min read",
		pt_BR: "min de leitura",
	},
	noImage: {
		en: "No image",
		pt_BR: "Sem imagem",
	},
	unknownType: {
		en: "Unknown type",
		pt_BR: "Tipo desconhecido",
	},
};

// Define the structure that represents post data after it's been fetched
// and references have been expanded
interface ExpandedBlogPost
	extends Omit<SanityBlogPost, "author" | "categories"> {
	author: SanityAuthor;
	categories?: SanityCategory[];
}

// Define interface for Sanity code block value
interface CodeBlockValue {
	_type: "codeBlock";
	code:
		| string
		| {
				_type: "code";
				code: string;
				language?: string;
				filename?: string;
		  };
	language?: string;
	filename?: string;
	showLineNumbers?: boolean;
	title?: string; // Added missing property
	highlightLines?: string; // Added missing property
	caption?: string; // Added missing property
}

interface BlogPostPageProps {
	post: ExpandedBlogPost;
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

export default function BlogPostPage({ post }: BlogPostPageProps) {
	const { language } = useLanguage();

	// Get localized static text
	const localizedAboutAuthor =
		staticText.aboutTheAuthor[language] || staticText.aboutTheAuthor.en;
	const localizedMinRead =
		staticText.minRead[language] || staticText.minRead.en;
	const localizedNoImage =
		staticText.noImage[language] || staticText.noImage.en;
	const localizedUnknownType =
		staticText.unknownType[language] || staticText.unknownType.en;

	// PortableText components for rendering blog content with improved styling
	const components: PortableTextReactComponents = {
		types: {
			image: ({
				value,
			}: PortableTextComponentProps<SanityPortableTextImage>) => (
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
			codeBlock: ({ value }: PortableTextComponentProps<CodeBlockValue>) => {
				// Handle case where code is an object from Sanity code-input plugin
				if (typeof value.code === "object" && value.code !== null) {
					return (
						<CodeBlock
							code={value.code.code || ""}
							language={value.code.language || value.language || "typescript"}
							filename={value.code.filename || value.filename || ""}
							title={value.title || ""}
							highlightLines={value.highlightLines}
							showLineNumbers={
								value.showLineNumbers !== undefined
									? value.showLineNumbers
									: true
							}
							caption={value.caption || ""}
						/>
					);
				}

				// Handle string code (original format)
				return (
					<CodeBlock
						code={typeof value.code === "string" ? value.code : ""}
						language={value.language || "typescript"}
						filename={value.filename || ""}
						title={value.title || ""}
						highlightLines={value.highlightLines}
						showLineNumbers={
							value.showLineNumbers !== undefined ? value.showLineNumbers : true
						}
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
				const target = (value?.href || "").startsWith("http")
					? "_blank"
					: undefined;
				return (
					<Link
						href={value?.href || ""}
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
		hardBreak: () => <br />, // Handle line breaks
		unknownMark: ({ children }) => <>{children}</>, // Fallback for unknown marks
		unknownType: () => <div>{localizedUnknownType}</div>, // Use localized text for unknown types
		unknownBlockStyle: ({ children }) => <div>{children}</div>, // Fallback for unknown block styles
		unknownList: ({ children }) => <ul>{children}</ul>, // Fallback for unknown lists
		unknownListItem: ({ children }) => <li>{children}</li>, // Fallback for unknown list items
	};

	return (
		<article className="max-w-4xl mx-auto px-4 py-12 md:py-20">
			<header className="mb-12">
				{/* Categories - now TypeScript knows these are expanded category objects */}
				<div className="flex gap-2 mb-4 flex-wrap">
					{post.categories?.map((category) => (
						<Link
							href={`/blog/category/${category.slug.current}`}
							key={category._id}
						>
							<Badge>{category.title}</Badge>
						</Link>
					))}
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
									.split(" ")
									.map((n) => n[0])
									.join("")
									.toUpperCase()
									.substring(0, 2)}
							</AvatarFallback>
						</Avatar>

						<div>
							<Link
								href={`/blog/author/${post.author.slug?.current}`}
								className="font-medium hover:underline"
							>
								{post.author.name}
							</Link>
							<div className="flex items-center text-sm text-muted-foreground">
								<span>
									{new Date(post.publishedAt).toLocaleDateString("en-US", {
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
											)} ${localizedMinRead}`
										: `3 ${localizedMinRead}`}
								</span>
							</div>
						</div>
					</div>

					{/* Desktop share button - only using the ShareButton which now includes bookmark */}
					<div className="hidden md:flex gap-2">
						<BlogShareButton title={post.title} />
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
						<span className="text-muted-foreground">{localizedNoImage}</span>
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
					<h2 className="text-xl font-semibold mb-4">{localizedAboutAuthor}</h2>
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
										.split(" ")
										.map((n) => n[0])
										.join("")
										.toUpperCase()
										.substring(0, 2)}
								</AvatarFallback>
							</Avatar>

							<div className="flex-1">
								<Link
									href={`/blog/author/${post.author.slug?.current}`}
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
															href={link.url}
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
														<span className="sr-only">Email</span>
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

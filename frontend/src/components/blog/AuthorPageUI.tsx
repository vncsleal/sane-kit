"use client";

import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/client";
import type { Author, BlogPost, Category } from "@/sanity/types";
import { portableTextComponents } from "./PortableTextComponents";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Globe, Instagram, Linkedin, Mail, Twitter, Youtube } from "lucide-react";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/i18n-config";

export interface ExpandedBlogPost extends Omit<BlogPost, "categories" | "author"> {
	categories?: Category[];
	author?: Author;
}

export interface AuthorPageUIProps {
	author: Author;
	posts: ExpandedBlogPost[];
	dictionary: Dictionary;
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

// Helper function to format date
function formatDate(dateString?: string, locale?: Locale) {
	if (!dateString) return "";
	return new Date(dateString).toLocaleDateString(locale || "en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

// Function to get author initials for avatar fallback
function getInitials(name?: string) {
	if (!name) return "??";
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.substring(0, 2);
}

export default function AuthorPageUI({ author, posts, dictionary, locale }: AuthorPageUIProps) {
	const staticText = {
		...dictionary.general,
		...dictionary.author,
		...dictionary.category,
	};

	return (
		<main className="container mx-auto px-4 md:px-6 py-12">
			<div className="flex flex-col gap-16">
				{/* Author Profile */}
				<div className="max-w-4xl mx-auto w-full">
					{/* Author Header */}
					<div className="flex flex-row items-center space-x-6 mb-6">
						<Avatar className="h-24 w-24">
							{author.avatar?.asset?._ref ? (
								<AvatarImage
									src={urlFor(author.avatar.asset._ref).width(96).height(96).url()}
									alt={author.name || "Author image"}
									className="object-cover"
								/>
							) : (
								<AvatarFallback className="text-lg">
									{getInitials(author.name)}
								</AvatarFallback>
							)}
						</Avatar>
						<div className="space-y-1">
							<h1 className="text-3xl font-bold">{author.name}</h1>
							{author.role && (
								<p className="text-xl text-muted-foreground">{author.role}</p>
							)}
							{author.bio && (
								<p className="text-sm text-muted-foreground max-w-2xl">
									{author.bio}
								</p>
							)}
						</div>
					</div>

					{/* Social Links */}
					{author.socialLinks && author.socialLinks.length > 0 && (
						<div className="flex flex-wrap gap-2 mb-6">
							{author.socialLinks.map((link) => {
								const platform = link.platform as keyof typeof SocialIcons;
								const Icon = SocialIcons[platform];
								if (!Icon) return null;
								return (
									<Button
										key={link._key}
										variant="ghost"
										size="sm"
										className="h-8 px-2"
										asChild
									>
										<Link
											href={link.url || '#'}
											target="_blank"
											rel="noopener noreferrer"
										>
											<span className="flex items-center">
												<Icon className="h-4 w-4 mr-2" />
												<span>
													{platform.charAt(0).toUpperCase() + platform.slice(1)}
												</span>
											</span>
										</Link>
									</Button>
								);
							})}
							{author.email && (
								<Button variant="ghost" size="sm" className="h-8 px-2" asChild>
									<Link href={`mailto:${author.email}`}>
										<span className="flex items-center">
											<Mail className="h-4 w-4 mr-2" />
											<span>{staticText.email}</span>
										</span>
									</Link>
								</Button>
							)}
						</div>
					)}

					{/* Full Bio */}
					{author.fullBio && (
						<div className="prose max-w-none dark:prose-invert mb-3">
							<PortableText
								value={author.fullBio}
								components={portableTextComponents}
							/>
						</div>
					)}
				</div>

				{/* Featured Image */}
				{author.featuredImage?.asset?._ref && (
					<div className="relative w-full max-w-4xl mx-auto aspect-[21/9] rounded-xl overflow-hidden">
						<Image
							src={urlFor(author.featuredImage.asset._ref).url()}
							alt={author.name || ""}
							fill
							className="object-cover"
						/>
					</div>
				)}

				{/* Author's Posts */}
				<div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">
					<h2 className="text-3xl font-semibold tracking-tight">
						{staticText.articlesBy} {author.name}
					</h2>

					{!posts || posts.length === 0 ? (
						<p className="text-muted-foreground">{staticText.noArticlesFound}</p>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{posts.map((post) => (
								<Link
									href={`/${locale}/blog/${post.slug?.current}`}
									key={post._id}
									className="flex flex-col gap-4 group hover:opacity-80 transition-opacity"
								>
									<div className="bg-muted rounded-md aspect-video overflow-hidden">
										{post.mainImage?.asset?._ref ? (
											<Image
												src={urlFor(post.mainImage.asset._ref).width(600).height(337).url()}
												alt={post.mainImage?.alt || post.title || ""}
												width={600}
												height={337}
												className="w-full h-full object-cover transition-transform group-hover:scale-105"
											/>
										) : (
											<div className="w-full h-full bg-muted flex items-center justify-center">
												<span className="text-muted-foreground">{staticText.noImage}</span>
											</div>
										)}
									</div>

									<div className="flex flex-row gap-4 items-center">
										{post.categories?.[0]?.title && (
											<Badge variant="secondary">{post.categories[0].title}</Badge>
										)}
										<span className="text-sm text-muted-foreground">
											{formatDate(post.publishedAt, locale)}
										</span>
									</div>

									<h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
										{post.title}
									</h3>

									{post.excerpt && (
										<p className="text-muted-foreground line-clamp-2">
											{post.excerpt}
										</p>
									)}
								</Link>
							))}
						</div>
					)}

					<div className="flex justify-center pt-8">
						<Button asChild>
							<Link href={`/${locale}/blog`}>{staticText.viewAllBlogPosts}</Link>
						</Button>
					</div>
				</div>
			</div>
		</main>
	);
}

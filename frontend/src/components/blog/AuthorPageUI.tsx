"use client";

import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
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
	SanityAuthor,
	SanityBlogPost,
	SanityCategory,
	SanityLocalizedPortableText,
	SanityAuthorSocialLink,
	InternationalizedStringArray,
} from "@/sanity/types/schema";
import { useLanguage } from "@/lib/language-context";
import { portableTextComponents } from "./PortableTextComponents";

// Define Author type with i18n fields using InternationalizedStringArray
interface AuthorDetails extends Omit<SanityAuthor, "fullBio"> {
	i18n_name?: InternationalizedStringArray;
	i18n_role?: InternationalizedStringArray;
	i18n_bio?: InternationalizedStringArray;
	fullBio?: SanityAuthor["fullBio"];
	i18n_fullBio?: SanityLocalizedPortableText[];
}

// Define a type for blog post with expanded fields and i18n using InternationalizedStringArray
interface ExpandedBlogPost extends Omit<SanityBlogPost, "categories"> {
	i18n_title?: InternationalizedStringArray;
	i18n_excerpt?: InternationalizedStringArray;
	categories?: (SanityCategory & {
		i18n_title?: InternationalizedStringArray;
	})[];
}

interface AuthorPageUIProps {
	author: AuthorDetails;
	posts: ExpandedBlogPost[];
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
function formatDate(dateString?: string) {
	if (!dateString) return "";
	return new Date(dateString).toLocaleDateString("en-US", {
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

// Define translations for static text
const staticText = {
	articlesBy: {
		en: "Articles by",
		pt_BR: "Artigos por",
	},
	noArticlesFound: {
		en: "No articles found.",
		pt_BR: "Nenhum artigo encontrado.",
	},
	viewAllBlogPosts: {
		en: "View all blog posts",
		pt_BR: "Ver todos os posts",
	},
	email: {
		en: "Email",
		pt_BR: "E-mail",
	},
	noImage: {
		en: "No image",
		pt_BR: "Sem imagem",
	},
};

export default function AuthorPageUI({ author, posts }: AuthorPageUIProps) {
	const { getLocalizedValue, language } = useLanguage();

	const localizedName = getLocalizedValue(author.i18n_name, author.name);
	const localizedRole = getLocalizedValue(author.i18n_role, author.role);
	const localizedBio = getLocalizedValue(author.i18n_bio, author.bio);
	const localizedAvatarAlt = getLocalizedValue(
		author.avatar?.i18n_alt,
		author.avatar?.alt,
	);
	const localizedFeaturedImageAlt = getLocalizedValue(
		author.featuredImage?.i18n_alt,
		author.featuredImage?.alt,
	);

	// Find the localized full bio content
	const localizedFullBioContent =
		author.i18n_fullBio?.find((bio) => bio.language === language)?.content ||
		author.fullBio;

	// Localize static text
	const localizedArticlesBy =
		staticText.articlesBy[language] || staticText.articlesBy.en;
	const localizedNoArticles =
		staticText.noArticlesFound[language] || staticText.noArticlesFound.en;
	const localizedViewAll =
		staticText.viewAllBlogPosts[language] || staticText.viewAllBlogPosts.en;
	const localizedEmailLabel = staticText.email[language] || staticText.email.en;
	const localizedNoImage =
		staticText.noImage[language] || staticText.noImage.en;

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
									src={urlFor(author.avatar.asset._ref).url()}
									alt={localizedAvatarAlt || localizedName}
								/>
							) : (
								<AvatarFallback className="text-lg">
									{getInitials(localizedName)}
								</AvatarFallback>
							)}
						</Avatar>
						<div className="space-y-1">
							<h1 className="text-3xl font-bold">{localizedName}</h1>
							{localizedRole && (
								<p className="text-xl text-muted-foreground">{localizedRole}</p>
							)}
							{localizedBio && (
								<p className="text-sm text-muted-foreground">{localizedBio}</p>
							)}
						</div>
					</div>

					{/* Social Links */}
					{author.socialLinks && author.socialLinks.length > 0 && (
						<div className="flex flex-wrap gap-2 mb-6">
							{author.socialLinks.map((link: SanityAuthorSocialLink) => {
								const platform = link.platform as keyof typeof SocialIcons;
								const Icon = SocialIcons[platform];
								return (
									<Button
										key={link._key}
										variant="ghost"
										size="sm"
										className="h-8 px-2"
										asChild
									>
										<Link
											href={link.url}
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
											<span>{localizedEmailLabel}</span>
										</span>
									</Link>
								</Button>
							)}
						</div>
					)}

					{/* Full Bio */}
					{localizedFullBioContent && (
						<div className="prose mb-3 text-muted-foreground">
							<PortableText
								value={localizedFullBioContent}
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
							alt={localizedFeaturedImageAlt || localizedName || ""} // Provide fallback empty string
							fill
							className="object-cover"
						/>
					</div>
				)}

				{/* Author's Posts */}
				<div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">
					<h2 className="text-3xl font-semibold tracking-tight">
						{localizedArticlesBy} {localizedName}
					</h2>

					{posts.length === 0 ? (
						<p className="text-muted-foreground">{localizedNoArticles}</p>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{posts.map((post) => {
								const localizedPostTitle = getLocalizedValue(
									post.i18n_title,
									post.title,
								);
								const localizedExcerpt = getLocalizedValue(
									post.i18n_excerpt,
									post.excerpt,
								);
								const localizedCategoryTitle = getLocalizedValue(
									post.categories?.[0]?.i18n_title,
									post.categories?.[0]?.title,
								);
								const localizedImageAlt = getLocalizedValue(
									post.mainImage?.i18n_alt,
									post.mainImage?.alt,
								);

								return (
									<Link
										href={`/blog/${post.slug.current}`}
										key={post._id}
										className="flex flex-col gap-4 group hover:opacity-80 transition-opacity"
									>
										<div className="bg-muted rounded-md aspect-video overflow-hidden">
											{post.mainImage?.asset?._ref ? (
												<Image
													src={urlFor(post.mainImage.asset._ref).url()}
													alt={localizedImageAlt || localizedPostTitle || ""}
													width={600}
													height={337}
													className="w-full h-full object-cover transition-transform group-hover:scale-105"
												/>
											) : (
												<div className="w-full h-full bg-muted flex items-center justify-center">
													<span className="text-muted-foreground">
														{localizedNoImage}
													</span>
												</div>
											)}
										</div>

										<div className="flex flex-row gap-4 items-center">
											{localizedCategoryTitle && (
												<Badge variant="secondary">
													{localizedCategoryTitle}
												</Badge>
											)}
											<span className="text-sm text-muted-foreground">
												{formatDate(post.publishedAt)}
											</span>
										</div>

										<h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
											{localizedPostTitle}
										</h3>

										{localizedExcerpt && (
											<p className="text-muted-foreground line-clamp-2">
												{localizedExcerpt}
											</p>
										)}
									</Link>
								);
							})}
						</div>
					)}

					<div className="flex justify-center pt-8">
						<Button asChild>
							<Link href="/blog">{localizedViewAll}</Link>
						</Button>
					</div>
				</div>
			</div>
		</main>
	);
}

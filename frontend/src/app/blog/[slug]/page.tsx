import { client } from "@/sanity/client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogPostPage from "@/components/blog/BlogPostPage";
import { ScrollToTopButton } from "@/components/blog/ScrollToTopButton";
import { getLocalizedValueServer } from "@/lib/localization-server";
import { headers } from "next/headers";
import type {
	SanityAuthor,
	SanityCategory,
	SanityImage,
	SanityLocalizedPortableText,
	PortableTextContent,
} from "@/sanity/types/schema";

export interface BlogPostData {
	_id: string;
	_type: "blogPost";
	title: string;
	i18n_title?: Record<string, string>;
	slug: {
		current: string;
	};
	publishedAt: string;
	excerpt?: string;
	i18n_excerpt?: Record<string, string>;
	mainImage?: SanityImage;
	body?: PortableTextContent;
	i18n_body?: SanityLocalizedPortableText[];
	featured?: boolean;
	author: SanityAuthor;
	categories?: SanityCategory[];
}

// Generate metadata for SEO
export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}): Promise<Metadata> {
	// Ensure params is fully resolved before using slug
	const resolvedParams = await Promise.resolve(params);
	const slug = resolvedParams.slug;

	const post = await getPost(slug);

	if (!post) {
		return {
			title: "Post Not Found",
			description: "The requested blog post could not be found",
		};
	}

	// Determine language key
	const headersList = await headers();
	const acceptLanguage = headersList.get("accept-language");
	const preferredLanguage = acceptLanguage?.split(",")[0].split(";")[0];
	let langKey = "en";
	if (preferredLanguage?.startsWith("pt")) {
		langKey = "pt_BR";
	}

	const localizedTitle = getLocalizedValueServer(
		post.i18n_title,
		post.title,
		langKey,
	);
	const localizedExcerpt = getLocalizedValueServer(
		post.i18n_excerpt,
		post.excerpt,
		langKey,
	);

	return {
		title: localizedTitle,
		description:
			localizedExcerpt || `${localizedTitle} - Read more on our blog`,
		openGraph: post.mainImage?.asset?._ref
			? {
					images: [{ url: `${post.mainImage.asset._ref}` }],
				}
			: undefined,
	};
}

// Fetch the post by slug including i18n fields
async function getPost(slug: string): Promise<BlogPostData | null> {
	return client.fetch(
		`
    *[_type == "blogPost" && slug.current == $slug][0]{
      _id,
      title,
      i18n_title,
      slug,
      publishedAt,
      excerpt,
      i18n_excerpt,
      mainImage{..., i18n_alt},
      body,
      i18n_body,
      featured,
      "author": author->{
        _id,
        name,
        i18n_name,
        slug,
        avatar{..., i18n_alt},
        bio,
        i18n_bio,
        email,
        role,
        i18n_role,
        socialLinks[] {
          _key,
          platform,
          url,
          username
        }
      },
      "categories": categories[]->{
        _id,
        title,
        i18n_title,
        slug,
        description,
        i18n_description
      }
    }
  `,
		{ slug },
	);
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
	const posts = await client.fetch(`
    *[_type == "blogPost"]{ "slug": slug.current }
  `);

	return posts.map((post: { slug: string }) => ({
		slug: post.slug,
	}));
}

export default async function BlogPost({
	params,
}: { params: { slug: string } }) {
	// Ensure params is fully resolved before using slug
	const resolvedParams = await Promise.resolve(params);
	const slug = resolvedParams.slug;

	const post = await getPost(slug);

	if (!post) {
		notFound();
	}

	return (
		<>
			<BlogPostPage post={post} />
			<ScrollToTopButton />
		</>
	);
}

import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { getLocalizedValueServer } from "@/lib/localization-server"; // Import server helper
import { headers } from "next/headers"; // Import headers
import type {
	SanityBlogPage,
	SanityCategory,
	SanityImage,
} from "@/sanity/types/schema"; // Import correct types
import BlogIndexPageUI from "@/components/blog/BlogIndexPageUI";

// Use SanityBlogPage type
type BlogPageConfig = SanityBlogPage;

// Define the list item type with i18n fields
export interface BlogPostListItem {
	_id: string;
	title: string;
	i18n_title?: Record<string, string>; // Add i18n
	slug: { current: string };
	publishedAt?: string;
	excerpt?: string;
	i18n_excerpt?: Record<string, string>; // Add i18n
	mainImage?: SanityImage;
	featured?: boolean;
	author?: {
		_id: string;
		name: string;
		i18n_name?: Record<string, string>; // Add i18n
		avatar?: SanityImage;
	};
	categories?: (SanityCategory & { i18n_title?: Record<string, string> })[]; // Add i18n to categories
}

// Generate metadata based on config
export async function generateMetadata(): Promise<Metadata> {
	const config = await getBlogPageConfig();

	// Determine language key
	const headersList = await headers();
	const acceptLanguage = headersList.get("accept-language");
	const preferredLanguage = acceptLanguage?.split(",")[0].split(";")[0];
	let langKey = "en";
	if (preferredLanguage?.startsWith("pt")) {
		langKey = "pt_BR";
	}

	const localizedMetaTitle = getLocalizedValueServer(
		config.seo?.i18n_metaTitle,
		config.seo?.metaTitle,
		langKey,
	);
	const localizedTitle = getLocalizedValueServer(
		config.i18n_title,
		config.title,
		langKey,
	);
	const localizedMetaDescription = getLocalizedValueServer(
		config.seo?.i18n_metaDescription,
		config.seo?.metaDescription,
		langKey,
	);
	const localizedDescription = getLocalizedValueServer(
		config.i18n_description,
		config.description,
		langKey,
	);

	return {
		title: localizedMetaTitle || localizedTitle || "Blog",
		description: localizedMetaDescription || localizedDescription,
	};
}

// Fetch blog page configuration including i18n fields
async function getBlogPageConfig(): Promise<BlogPageConfig> {
	const config = await client.fetch(`*[_type == "blogPage"][0]{
    title,
    i18n_title, // Fetch i18n
    description,
    i18n_description, // Fetch i18n
    layout,
    postsPerPage,
    featuredPostsCount,
    showOnlyFeaturedPosts,
    "seo": {
      "metaTitle": seo.metaTitle,
      "i18n_metaTitle": seo.i18n_metaTitle, // Fetch i18n
      "metaDescription": seo.metaDescription,
      "i18n_metaDescription": seo.i18n_metaDescription // Fetch i18n
    }
  }`);

	return (
		config || {
			title: "Blog",
			description: "Latest articles, news and insights",
			layout: "grid",
			postsPerPage: 9,
		}
	);
}

// Fetch blog posts including i18n fields
async function getBlogPosts(
	config: BlogPageConfig,
): Promise<BlogPostListItem[]> {
	const postsPerPage = config.postsPerPage || 9; // Default posts per page
	return client.fetch(`
    *[_type == "blogPost"] | order(publishedAt desc)[0...${postsPerPage}]{
      _id,
      title,
      i18n_title, // Fetch i18n
      slug,
      publishedAt,
      excerpt,
      i18n_excerpt, // Fetch i18n
      mainImage{..., i18n_alt}, // Fetch i18n_alt for image
      featured,
      "author": author->{
        _id,
        name,
        i18n_name, // Fetch i18n
        avatar{..., i18n_alt} // Fetch i18n_alt for avatar
      },
      "categories": categories[]->{
        _id,
        title,
        i18n_title, // Fetch i18n
        slug
      }
    }
  `);
}

export default async function BlogIndexPage() {
	const config = await getBlogPageConfig();
	const posts = await getBlogPosts(config);

	// Pass fetched data to the client component
	return <BlogIndexPageUI config={config} posts={posts} />;
}

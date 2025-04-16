import { client } from "@/sanity/client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocalizedValueServer } from "@/lib/localization-server";
import { headers } from "next/headers";
import type {
	SanityAuthor,
	SanityBlogPost,
	SanityCategory,
} from "@/sanity/types/schema";
import AuthorPageUI from "@/components/blog/AuthorPageUI";

// Define a type for blog post with expanded fields and i18n
interface ExpandedBlogPost extends Omit<SanityBlogPost, "categories"> {
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

	const author = await getAuthor(slug);

	if (!author) {
		return {
			title: "Author Not Found",
			description: "The requested author could not be found",
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

	const localizedName = getLocalizedValueServer(
		author.i18n_name,
		author.name,
		langKey,
	);
	const localizedBio = getLocalizedValueServer(
		author.i18n_bio,
		author.bio,
		langKey,
	);

	return {
		title: `${localizedName} - Author Profile`,
		description: localizedBio || `Articles by ${localizedName}`,
		// ... rest of metadata ...
	};
}

// Fetch the author by slug including i18n fields
async function getAuthor(slug: string): Promise<SanityAuthor | null> {
	return client.fetch(
		`
    *[_type == "author" && slug.current == $slug][0]{
      _id,
      name,
      i18n_name, // Fetch i18n
      slug,
      role,
      i18n_role, // Fetch i18n
      bio,
      i18n_bio, // Fetch i18n
      fullBio,
      i18n_fullBio, // Fetch i18n
      email,
      avatar{..., i18n_alt}, // Fetch i18n_alt
      featuredImage{..., i18n_alt}, // Fetch i18n_alt
      socialLinks
    }
  `,
		{ slug },
	);
}

// Fetch recent posts by author including i18n fields
async function getAuthorPosts(authorId: string): Promise<ExpandedBlogPost[]> {
	return client.fetch(
		`
    *[_type == "blogPost" && author._ref == $authorId] | order(publishedAt desc)[0...6]{
      _id,
      title,
      i18n_title, // Fetch i18n
      slug,
      publishedAt,
      excerpt,
      i18n_excerpt, // Fetch i18n
      mainImage{..., i18n_alt}, // Fetch i18n_alt
      "categories": categories[]->{
        _id,
        title,
        i18n_title, // Fetch i18n
        slug
      }
    }
  `,
		{ authorId },
	);
}

// Generate static paths for all authors
export async function generateStaticParams() {
	const authors = await client.fetch(`
    *[_type == "author"]{ "slug": slug.current }
  `);

	return authors.map((author: { slug: string }) => ({
		slug: author.slug,
	}));
}

export default async function AuthorPage({
	params,
}: { params: { slug: string } }) {
	// Ensure params is fully resolved before using slug
	const resolvedParams = await Promise.resolve(params);
	const slug = resolvedParams.slug;

	const author = await getAuthor(slug);

	if (!author) {
		notFound();
	}

	const posts = await getAuthorPosts(author._id);

	// Pass fetched data to the client component
	return <AuthorPageUI author={author} posts={posts} />;
}

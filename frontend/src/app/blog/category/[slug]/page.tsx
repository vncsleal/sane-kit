import { client } from "@/sanity/client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocalizedValueServer } from "@/lib/localization-server"; // Import server helper
import { headers } from "next/headers"; // Import headers
import type { SanityCategory } from "@/sanity/types/schema"; // Import correct types
import CategoryPageUI from "@/components/blog/CategoryPageUI";
import type { BlogPostData } from "@/app/blog/[slug]/page";

// Define PageProps with Promise for params
interface PageProps {
	params: Promise<{ slug: string }>;
}

// Update function signature and use await params
export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params; // Await the promise here
	const category = await getCategory(slug);

	if (!category) {
		return {
			title: "Category Not Found",
			description: "The requested category could not be found",
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
		category.i18n_title,
		category.title,
		langKey,
	);
	const localizedDescription = getLocalizedValueServer(
		category.i18n_description,
		category.description,
		langKey,
	);

	return {
		title: `${localizedTitle} - Blog Category`,
		description:
			localizedDescription || `Browse all articles in ${localizedTitle}`,
	};
}

// Fetch the category by slug including i18n fields
async function getCategory(slug: string): Promise<SanityCategory | null> {
	return client.fetch(
		`
    *[_type == "category" && slug.current == $slug][0]{
      _id,
      title,
      i18n_title, // Fetch i18n
      slug,
      description,
      i18n_description // Fetch i18n
    }
  `,
		{ slug },
	);
}

// Fetch posts by category including i18n fields
async function getCategoryPosts(categoryId: string): Promise<BlogPostData[]> {
	return client.fetch(
		`
    *[_type == "blogPost" && references($categoryId)] | order(publishedAt desc){
      _id,
      _type,
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
        _type,
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
		{ categoryId },
	);
}

// Generate static paths for all categories
export async function generateStaticParams() {
	const categories = await client.fetch(`
    *[_type == "category"]{ "slug": slug.current }
  `);

	return categories.map((category: { slug: string }) => ({
		slug: category.slug,
	}));
}

// Update function signature and use await params
export default async function CategoryPage({ params }: PageProps) {
	const { slug } = await params; // Await the promise here
	const category = await getCategory(slug);

	if (!category) {
		notFound();
	}

	const posts = await getCategoryPosts(category._id);

	// Pass fetched data to the client component
	return <CategoryPageUI category={category} posts={posts} />;
}

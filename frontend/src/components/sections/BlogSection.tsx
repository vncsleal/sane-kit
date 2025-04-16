import { client } from "@/sanity/client"; // Keep client import
import type {
	SanityBlogSection,
	SanityBlogPost,
	SanityAuthor,
	SanityCategory,
} from "@/sanity/types/schema";
import BlogSectionUI from "../BlogSectionUI";

// Extended props to include fetched data - Keep this interface if needed elsewhere, or move to UI file if only used there
export interface BlogPostWithData
	extends Omit<SanityBlogPost, "author" | "categories"> {
	author: SanityAuthor;
	categories?: SanityCategory[];
}

// Keep the props interface for the main Server Component
export interface BlogSectionProps extends SanityBlogSection {
	posts: BlogPostWithData[];
}

// Main component remains async Server Component for data fetching
export default async function BlogSection(props: SanityBlogSection) {
	const { postsToShow = 3, featuredPostsOnly = false } = props;

	// Build the query for fetching blog posts
	let query = `*[_type == "blogPost"] | order(publishedAt desc, _updatedAt desc)`;

	if (featuredPostsOnly) {
		query = `*[_type == "blogPost" && featured == true] | order(publishedAt desc, _updatedAt desc)`;
	}

	try {
		// Fetch data directly in the server component
		const posts: BlogPostWithData[] = await client.fetch(`
			${query}[0...${postsToShow}]{
				_id,
				title,
				i18n_title,
				slug,
				publishedAt,
				excerpt,
				i18n_excerpt,
				mainImage{
					...,
					i18n_alt
				},
				featured,
				"author": author->{
					_id,
					name,
					i18n_name,
					slug,
					avatar{
						...,
						i18n_alt
					},
					bio,
					i18n_bio
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
		`);

		// Pass fetched posts and original props to the Client Component UI
		return <BlogSectionUI {...props} posts={posts} />;
	} catch (error) {
		console.error("Error fetching blog posts:", error);
		// Pass original props and empty posts array on error
		return <BlogSectionUI {...props} posts={[]} />;
	}
}

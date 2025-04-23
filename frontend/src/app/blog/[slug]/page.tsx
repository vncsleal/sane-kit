import { client, urlFor } from "@/sanity/client"; // Import urlFor
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogPostComponent from "@/components/blog/BlogPostPage";
import { ScrollToTopButton } from "@/components/blog/ScrollToTopButton";
import { getLocalizedValueServer } from "@/lib/localization-server";
import { headers } from "next/headers";
import type {
	SanityAuthor,
	SanityCategory,
	SanityImage,
	SanityLocalizedPortableText,
	PortableTextContent,
	InternationalizedStringArray,
} from "@/sanity/types/schema";

export interface BlogPostData {
	_id: string;
	_type: "blogPost";
	title: string;
	i18n_title?: InternationalizedStringArray;
	slug: {
		current: string;
	};
	publishedAt: string;
	excerpt?: string;
	i18n_excerpt?: InternationalizedStringArray;
	mainImage?: SanityImage;
	body?: PortableTextContent;
	i18n_body?: SanityLocalizedPortableText[];
	featured?: boolean;
	author: SanityAuthor;
	categories?: SanityCategory[];
}

interface PageProps {
	params: {
		slug: string;
	};
}

async function getPage(slug: string): Promise<BlogPostData | null> {
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

// Renamed function to avoid conflict with imported component
export default async function BlogPostPageRoute({ params }: PageProps) {
	const { slug } = params;
	const post = await getPage(slug);

	if (!post) {
		notFound();
	}

	return (
		<>
			<BlogPostComponent post={post} />
			<ScrollToTopButton />
		</>
	);
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = params;

	const post = await getPage(slug);

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
		openGraph: post.mainImage
			? {
					images: [
						{
							url: urlFor(post.mainImage).width(1200).height(630).url(),
						},
					],
				}
			: undefined,
	};
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

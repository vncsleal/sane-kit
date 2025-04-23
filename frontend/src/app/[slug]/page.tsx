import type { SanityPage } from "@/sanity/types/schema";
import { client } from "@/sanity/client";
import { notFound } from "next/navigation";
import RenderSection from "@/components/sections/RenderSection";
import { urlFor } from "@/sanity/client";
// Assume a server-side helper exists, e.g., in '@/lib/localization-server'
import { getLocalizedValueServer } from "@/lib/localization-server";
import { headers } from "next/headers"; // Import headers function

// Update query to fetch i18n fields for metadata
const pageQuery = `*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  i18n_title, // Fetch i18n title for metadata
  description, // Fetch description for metadata
  i18n_description, // Fetch i18n description for metadata
  ogImage, // Fetch ogImage for metadata
  pageBuilder[]{
    ...,
    _type == "compareFeaturesSection" => {
      ...,
      "features": features[]->{
        _id,
        _key,
        _type,
        title, // Fetch title instead of name if that's the field
        i18n_title // Fetch i18n title
        // Add other fields needed for compareFeaturesSection
      },
      "plans": plans[]{
        ...,
        "featureValues": featureValues[]{
          ...,
          "featureRef": featureRef->{
            _id,
            _type,
            _key,
            title, // Fetch title instead of name if that's the field
            i18n_title // Fetch i18n title
             // Add other fields needed for compareFeaturesSection featureRef
          }
        }
      }
    }
    // Add specific expansions for other section types if needed
  }
}`;

interface PageProps {
	params: Promise<{
		slug: string;
	}>;
}

async function getPage(slug: string): Promise<SanityPage | null> {
	// Ensure the client fetch uses appropriate cache/revalidation settings
	return client.fetch(
		pageQuery,
		{ slug },
		{ cache: "no-store" }, // Example: revalidate every hour
	);
}

export async function generateMetadata({ params }: PageProps) {
	const { slug } = await params; // Await params here
	const page = await getPage(slug);

	if (!page) {
		return {
			title: "Not Found",
			description: "The page you are looking for does not exist.",
		};
	}

	// Determine language key within generateMetadata
	const headersList = await headers(); // Let TypeScript infer the type
	const acceptLanguage = headersList.get("accept-language");
	const preferredLanguage = acceptLanguage?.split(",")[0].split(";")[0];
	let langKey = "en"; // Default language
	if (preferredLanguage?.startsWith("pt")) {
		langKey = "pt_BR";
	}
	// Add more language mappings as needed

	// Use synchronous server-side helper with the determined language key
	const localizedTitle = getLocalizedValueServer(
		page.i18n_title,
		page.title,
		langKey, // Pass langKey
	);
	const localizedDescription = getLocalizedValueServer(
		page.i18n_description,
		page.description,
		langKey, // Pass langKey
	);

	const metadata: {
		title: string;
		description?: string;
		openGraph?: { images: string[] };
	} = {
		title: localizedTitle || "Page", // Fallback title
	};

	if (localizedDescription) {
		metadata.description = localizedDescription;
	}

	// Add Open Graph image if available
	if (page.ogImage?.asset?._ref) {
		// Assuming imageUrlBuilder is available server-side or imported

		metadata.openGraph = {
			images: [urlFor(page.ogImage.asset._ref).width(1200).height(630).url()],
		};
	}

	return metadata;
}

export default async function Page({ params }: PageProps) {
	const { slug } = await params; // Await params here
	const page = await getPage(slug);

	if (!page) {
		notFound();
	}

	return (
		<main>
			{page.pageBuilder?.map((section) => (
				<RenderSection key={section._key} section={section} />
			))}
		</main>
	);
}

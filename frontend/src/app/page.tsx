import type { SanityPage } from "@/sanity/types/schema";
import { client } from "@/sanity/client";
import { notFound } from "next/navigation";
import RenderSection from "@/components/sections/RenderSection";
import { getLocalizedValueServer } from "@/lib/localization-server";
import { headers } from "next/headers";
import { urlFor } from "@/sanity/client"; // Import the correct urlFor function

// Query specifically for the page with slug '/'
const homePageQuery = `*[_type == "page" && slug.current == "/"][0]{
  _id,
  title,
  i18n_title,
  description,
  i18n_description,
  ogImage,
  pageBuilder[]{
    ...,
    _type == "compareFeaturesSection" => {
      ...,
      "features": features[]->{
        _id, _key, _type, title, i18n_title
      },
      "plans": plans[]{
        ...,
        "featureValues": featureValues[]{
          ...,
          "featureRef": featureRef->{
            _id, _type, _key, title, i18n_title
          }
        }
      }
    }
    // Add other specific expansions if needed
  }
}`;

async function getHomePage(): Promise<SanityPage | null> {
	// Fetch the homepage data
	return client.fetch(
		homePageQuery,
		{}, // No params needed as slug is hardcoded in query
		{ next: { revalidate: 3600 } }, // Example: revalidate every hour
	);
}

export async function generateMetadata() {
	const page = await getHomePage();

	if (!page) {
		return {
			title: "Not Found",
			description: "The page you are looking for does not exist.",
		};
	}

	// Determine language key
	const headersList = await headers();
	const acceptLanguage = headersList.get("accept-language");
	const preferredLanguage = acceptLanguage?.split(",")[0].split(";")[0];
	let langKey = "en"; // Default language
	if (preferredLanguage?.startsWith("pt")) {
		langKey = "pt_BR";
	}
	// Add more language mappings as needed

	const localizedTitle = getLocalizedValueServer(
		page.i18n_title,
		page.title,
		langKey,
	);
	const localizedDescription = getLocalizedValueServer(
		page.i18n_description,
		page.description,
		langKey,
	);

	const metadata: {
		title: string;
		description?: string;
		openGraph?: { images: string[] };
	} = {
		title: localizedTitle || "Home", // Fallback title
	};

	if (localizedDescription) {
		metadata.description = localizedDescription;
	}

	// Add Open Graph image if available
	if (page.ogImage?.asset?._ref) {
		metadata.openGraph = {
			images: [urlFor(page.ogImage).width(1200).height(630).url()],
		};
	}

	return metadata;
}

export default async function HomePage() {
	const page = await getHomePage();

	if (!page) {
		// If the page with slug '/' doesn't exist in Sanity, show 404
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

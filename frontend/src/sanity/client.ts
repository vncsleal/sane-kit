import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"; // Import the specific type

const projectId =
	process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const client = createClient({
	projectId,
	dataset,
	apiVersion: "2024-01-01",
	useCdn: false,
});

// Initialize image URL builder
const builder = imageUrlBuilder(client);

// Helper function to generate image URLs
export const urlFor = (source: SanityImageSource) => {
	// Use SanityImageSource type
	return builder.image(source);
};

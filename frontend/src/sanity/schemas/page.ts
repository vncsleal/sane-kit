import {
	DocumentIcon,
	InfoOutlineIcon,
	EarthGlobeIcon,
	StackCompactIcon,
} from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const pageGroups = [
	{
		name: "basic",
		title: "Basic Information",
		icon: InfoOutlineIcon,
		default: true,
	},
	{
		name: "seo",
		title: "SEO & Sharing",
		icon: EarthGlobeIcon,
	},
	{
		name: "content",
		title: "Page Content",
		icon: StackCompactIcon,
	},
];

export const page = defineType({
	name: "page",
	title: "Page",
	type: "document",
	icon: DocumentIcon,
	groups: pageGroups,
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Title",
			validation: (rule) => rule.required(),
			group: "basic",
		}),
		defineField({
			name: "slug",
			type: "slug",
			title: "Slug",
			options: {
				source: "title",
				maxLength: 96,
			},
			validation: (rule) => rule.required(),
			group: "basic",
		}),
		defineField({
			name: "description",
			title: "Meta Description",
			type: "text",
			description:
				"This description appears in search results and social media previews",
			group: "seo",
		}),
		defineField({
			name: "ogImage",
			title: "Social Media Image",
			type: "image",
			description: "Image for social media sharing (Facebook, Twitter, etc.)",
			options: {
				hotspot: true,
			},
			group: "seo",
		}),
		defineField({
			name: "pageBuilder",
			type: "array",
			title: "Page Builder",
			description: "Add and arrange sections to build your page",
			group: "content",
			of: [
				{ type: "heroSection" },
				{ type: "casesSection" },
				{ type: "testimonialsSection" },
				{ type: "pricingSection" },
				{ type: "compareFeaturesSection" },
				{ type: "statsSection" },
				{ type: "ctaSection" },
				{ type: "faqSection" },
				{ type: "featureSection" },
				{ type: "blogSection" },
				{ type: "contactSection" },
				{ type: "newsletterSection" },
			],
		}),
	],
	preview: {
		select: {
			title: "title",
			slug: "slug.current",
			sectionsCount: "pageBuilder.length",
		},
		prepare({ title, slug, sectionsCount = 0 }) {
			return {
				title: title || "Untitled Page",
				subtitle: `/${slug || ""} - ${sectionsCount} section(s)`,
				media: DocumentIcon,
			};
		},
	},
});

import { DocumentTextIcon, EarthGlobeIcon, ThLargeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const blogPageGroups = [
	{
		name: "content",
		title: "Content",
		icon: DocumentTextIcon,
		default: true,
	},
	{
		name: "display",
		title: "Display Options",
		icon: ThLargeIcon,
	},
	{
		name: "seo",
		title: "SEO Settings",
		icon: EarthGlobeIcon,
	},
];

export const blogPage = defineType({
	name: "blogPage",
	title: "Blog Page",
	type: "document",
	icon: DocumentTextIcon,
	groups: blogPageGroups,
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Page Title",
			description: "Title for the blog index page",
			initialValue: "Blog",
			validation: (rule) => rule.required(),
			group: "content",
		}),
		defineField({
			name: "description",
			type: "text",
			title: "Page Description",
			description: "Subtitle or brief description for the blog page",
			rows: 2,
			initialValue: "Latest articles, news and insights",
			group: "content",
		}),
		defineField({
			name: "layout",
			type: "string",
			title: "Layout",
			description: "Choose the layout for the blog listing",
			group: "display",
			options: {
				list: [
					{ title: "Standard Grid", value: "grid" },
					{ title: "Featured Posts", value: "featured" },
					{ title: "Compact List", value: "compact" },
				],
			},
			initialValue: "grid",
		}),
		defineField({
			name: "postsPerPage",
			type: "number",
			title: "Posts Per Page",
			description: "Number of posts to display per page",
			initialValue: 9,
			validation: (rule) => rule.min(1).max(24),
			group: "display",
		}),
		defineField({
			name: "featuredPostsCount",
			type: "number",
			title: "Featured Posts Count",
			description:
				"Number of posts to feature prominently (only applies to Featured Posts layout)",
			initialValue: 3,
			hidden: ({ parent }) => parent?.layout !== "featured",
			validation: (rule) => rule.min(1).max(6),
			group: "display",
		}),
		defineField({
			name: "showOnlyFeaturedPosts",
			type: "boolean",
			title: "Show Only Posts Marked as Featured",
			description:
				"When enabled, only posts with the featured flag will be shown as featured",
			initialValue: false,
			hidden: ({ parent }) => parent?.layout !== "featured",
			group: "display",
		}),
		defineField({
			name: "seo",
			title: "SEO Settings",
			type: "object",
			group: "seo",
			fields: [
				{
					name: "metaTitle",
					type: "string",
					title: "Meta Title",
					description: "Title used for the browser tab and search results",
				},
				{
					name: "metaDescription",
					type: "text",
					title: "Meta Description",
					description: "Description for search engine results",
					rows: 3,
				},
			],
		}),
	],
	preview: {
		select: {
			title: "title",
			layout: "layout",
		},
		prepare({ title, layout }) {
			return {
				title: title || "Blog Page",
				subtitle: `Layout: ${layout || "standard"}`,
				media: DocumentTextIcon,
			};
		},
	},
});

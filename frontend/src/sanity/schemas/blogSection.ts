import {
	DocumentTextIcon,
	InfoOutlineIcon,
	ComponentIcon,
	CogIcon,
} from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const blogSectionGroups = [
	{
		name: "content",
		title: "Content",
		icon: InfoOutlineIcon,
		default: true,
	},
	{
		name: "appearance",
		title: "Appearance",
		icon: ComponentIcon,
	},
	{
		name: "options",
		title: "Options",
		icon: CogIcon,
	},
];

export const blogSection = defineType({
	name: "blogSection",
	title: "Blog Section",
	type: "object",
	icon: DocumentTextIcon,
	groups: blogSectionGroups,
	fields: [
		defineField({
			name: "heading",
			type: "string",
			title: "Heading",
			initialValue: "Latest articles",
			validation: (rule) => rule.required(),
			group: "content",
		}),
		defineField({
			name: "variant",
			type: "string",
			title: "Layout Variant",
			group: "appearance",
			options: {
				list: [
					{ title: "Default with Featured Post", value: "default" },
					{ title: "Grid Layout (4 columns)", value: "grid" },
				],
			},
			initialValue: "default",
		}),
		defineField({
			name: "subheading",
			type: "text",
			title: "Subheading",
			rows: 2,
			hidden: ({ parent }) => parent?.variant === "grid",
			group: "content",
		}),
		defineField({
			name: "postsToShow",
			type: "number",
			title: "Number of Posts to Show",
			description: "Limit the number of posts displayed",
			initialValue: 4,
			validation: (rule) => rule.min(1).max(12),
			group: "options",
		}),
		defineField({
			name: "showFeaturedPostLarge",
			type: "boolean",
			title: "Show Featured Post in Large Format",
			description:
				"If enabled, the first post will be displayed in a larger format",
			initialValue: true,
			hidden: ({ parent }) => parent?.variant === "grid",
			group: "appearance",
		}),
		defineField({
			name: "featuredPostsOnly",
			type: "boolean",
			title: "Show Only Featured Posts",
			description: "If enabled, only posts marked as featured will be shown",
			initialValue: false,
			group: "options",
		}),
		defineField({
			name: "viewAllButton",
			type: "boolean",
			title: "Show 'View All' Button",
			initialValue: false,
			group: "options",
		}),
		defineField({
			name: "viewAllUrl",
			type: "string",
			title: "View All URL",
			description: "URL for the 'View all articles' button",
			initialValue: "/blog",
			hidden: ({ parent }) => !parent?.viewAllButton,
			group: "options",
		}),
	],
	preview: {
		select: {
			title: "heading",
			variant: "variant",
			posts: "postsToShow",
		},
		prepare({ title, variant, posts }) {
			return {
				title: title || "Blog Section",
				subtitle: `${variant || "default"} · ${posts || 4} posts`,
				media: DocumentTextIcon,
			};
		},
	},
});

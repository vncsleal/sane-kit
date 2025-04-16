import {
	ThLargeIcon,
	InfoOutlineIcon,
	ComponentIcon,
	LinkIcon,
} from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const footerGroups = [
	{
		name: "basic",
		title: "Basic Information",
		icon: InfoOutlineIcon,
		default: true,
	},
	{
		name: "appearance",
		title: "Appearance",
		icon: ComponentIcon,
	},
	{
		name: "content",
		title: "Content",
		icon: ThLargeIcon,
	},
	{
		name: "navigation",
		title: "Navigation",
		icon: LinkIcon,
	},
];

export const footer = defineType({
	name: "footer",
	title: "Footer",
	type: "document",
	icon: ThLargeIcon,
	groups: footerGroups,
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Site Name",
			description: "The name displayed in the footer",
			validation: (rule) => rule.required(),
			group: "basic",
		}),
		defineField({
			name: "variant",
			type: "string",
			title: "Layout Variant",
			options: {
				list: [
					{ title: "Simple", value: "simple" },
					{ title: "Minimal", value: "minimal" },
					{ title: "Tiny", value: "tiny" },
				],
			},
			initialValue: "simple",
			group: "appearance",
		}),
		defineField({
			name: "description",
			type: "text",
			title: "Footer Description",
			description: "A short description or tagline for the footer",
			rows: 2,
			group: "content",
		}),
		defineField({
			name: "address",
			type: "array",
			title: "Address Lines",
			of: [{ type: "string" }],
			description: "Enter the address line by line",
			group: "content",
		}),
		defineField({
			name: "legalLinks",
			type: "array",
			title: "Legal Links",
			group: "navigation",
			of: [
				{
					type: "object",
					name: "link",
					fields: [
						defineField({
							name: "title",
							type: "string",
							title: "Title",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "url",
							type: "string",
							title: "URL",
							validation: (rule) => rule.required(),
						}),
					],
				},
			],
		}),
		defineField({
			name: "navigationItems",
			type: "array",
			title: "Navigation Items",
			group: "navigation",
			of: [
				{
					type: "object",
					name: "navigationItem",
					fields: [
						defineField({
							name: "title",
							type: "string",
							title: "Title",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "href",
							type: "string",
							title: "Link",
							description: "Leave blank for categories without direct links",
						}),
						defineField({
							name: "description",
							type: "text",
							title: "Description",
							description: "Optional description for this category",
						}),
						defineField({
							name: "items",
							type: "array",
							title: "Sub Links",
							description: "Add links under this category",
							of: [
								{
									type: "object",
									name: "subItem",
									fields: [
										defineField({
											name: "title",
											type: "string",
											title: "Title",
											validation: (rule) => rule.required(),
										}),
										defineField({
											name: "href",
											type: "string",
											title: "Link",
											validation: (rule) => rule.required(),
										}),
									],
								},
							],
						}),
					],
				},
			],
		}),
	],
	preview: {
		select: {
			title: "title",
			variant: "variant",
		},
		prepare({ title, variant }) {
			return {
				title: title || "Website Footer",
				subtitle: `Variant: ${variant || "default"}`,
				media: ThLargeIcon,
			};
		},
	},
});

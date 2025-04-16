import {
	RocketIcon,
	InfoOutlineIcon,
	ComponentIcon,
	ImageIcon,
} from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const heroGroups = [
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
		name: "actions",
		title: "Actions",
		icon: RocketIcon,
	},
	{
		name: "media",
		title: "Media",
		icon: ImageIcon,
	},
	{
		name: "translations",
		title: "Translations",
		icon: InfoOutlineIcon,
	},
];

export const heroSection = defineType({
	name: "heroSection",
	title: "Hero Section",
	type: "object",
	icon: RocketIcon,
	groups: heroGroups,
	fields: [
		defineField({
			name: "variant",
			type: "string",
			title: "Variant",
			options: {
				list: [
					{ title: "Button Banner", value: "buttonBanner" },
					{ title: "Badge Banner", value: "badgeBanner" },
					{ title: "Grid Gallery", value: "gridGallery" },
				],
			},
			initialValue: "buttonBanner",
			group: "appearance",
		}),
		defineField({
			name: "bannerButton",
			type: "object",
			title: "Banner Button",
			hidden: ({ parent }) => parent?.variant !== "buttonBanner",
			group: "actions",
			fields: [
				{
					name: "label",
					type: "string",
					title: "Label",
				},
				{
					name: "i18n_label",
					type: "internationalizedArrayString",
					title: "Label (Translated)",
				},
				{
					name: "url",
					type: "string",
					title: "URL",
				},
			],
		}),
		defineField({
			name: "badgeText",
			type: "string",
			title: "Badge Text",
			group: "content",
			hidden: ({ parent }) =>
				parent?.variant !== "badgeBanner" && parent?.variant !== "gridGallery",
		}),
		defineField({
			name: "i18n_badgeText",
			type: "internationalizedArrayString",
			title: "Badge Text (Translated)",
			group: "content",
			hidden: ({ parent }) =>
				parent?.variant !== "badgeBanner" && parent?.variant !== "gridGallery",
		}),
		defineField({
			name: "heading",
			type: "string",
			title: "Heading",
			validation: (rule) => rule.required(),
			group: "content",
		}),
		defineField({
			name: "i18n_heading",
			type: "internationalizedArrayString",
			title: "Heading (Translated)",
			group: "content",
		}),
		defineField({
			name: "subheading",
			type: "text",
			title: "Subheading",
			rows: 3,
			group: "content",
		}),
		defineField({
			name: "i18n_subheading",
			type: "internationalizedArrayText",
			title: "Subheading (Translated)",
			group: "content",
		}),
		defineField({
			name: "buttons",
			type: "array",
			title: "Buttons",
			group: "actions",
			of: [
				{
					type: "object",
					name: "button",
					fields: [
						{
							name: "label",
							type: "string",
							title: "Label",
						},
						{
							name: "i18n_label",
							type: "internationalizedArrayString",
							title: "Label (Translated)",
						},
						{
							name: "url",
							type: "string",
							title: "URL",
						},
						{
							name: "variant",
							type: "string",
							title: "Variant",
							options: {
								list: [
									{ title: "Default", value: "default" },
									{ title: "Secondary", value: "secondary" },
									{ title: "Outline", value: "outline" },
									{ title: "Ghost", value: "ghost" },
									{ title: "Link", value: "link" },
								],
							},
							initialValue: "default",
						},
						{
							name: "icon",
							type: "string",
							title: "Icon",
							options: {
								list: [
									{ title: "Phone", value: "phone" },
									{ title: "Arrow Right", value: "arrowRight" },
									{ title: "Plus", value: "plus" },
									{ title: "Check", value: "check" },
									{ title: "Heart", value: "heart" },
									{ title: "Star", value: "star" },
									{ title: "Search", value: "search" },
									{ title: "Settings", value: "settings" },
									{ title: "Mail", value: "mail" },
									{ title: "Calendar", value: "calendar" },
								],
							},
						},
					],
				},
			],
		}),
		defineField({
			name: "media",
			type: "object",
			title: "Media",
			description: "Add images or videos to your hero section",
			group: "media",
			fields: [
				{
					name: "type",
					type: "string",
					title: "Type",
					options: {
						list: [
							{ title: "Image", value: "image" },
							{ title: "Video", value: "video" },
							{ title: "Placeholder", value: "placeholder" },
						],
					},
					initialValue: "placeholder",
				},
				{
					name: "image",
					type: "image",
					title: "Image",
					hidden: ({ parent }) => parent?.type !== "image",
					options: {
						hotspot: true,
					},
					fields: [
						{
							name: "alt",
							type: "string",
							title: "Alternative Text",
							hidden: ({ parent }) => parent?.type !== "image",
						},
						{
							name: "i18n_alt",
							type: "internationalizedArrayString",
							title: "Alternative Text (Translated)",
							hidden: ({ parent }) => parent?.type !== "image",
						},
					],
				},
				{
					name: "video",
					type: "object",
					title: "Video",
					hidden: ({ parent }) => parent?.type !== "video",
					fields: [
						{
							name: "url",
							type: "url",
							title: "Video URL",
							description:
								"Use Vimeo or uploadthing URLs for optimal performance.",
						},
						{
							name: "autoplay",
							type: "boolean",
							title: "Autoplay",
							initialValue: false,
						},
						{
							name: "loop",
							type: "boolean",
							title: "Loop",
							initialValue: true,
						},
						{
							name: "muted",
							type: "boolean",
							title: "Muted",
							initialValue: true,
						},
					],
				},
				{
					name: "additionalImages",
					type: "array",
					title: "Additional Images",
					description:
						"Add up to 3 additional images for the Grid Gallery variant (up to 4 images total)",
					hidden: ({ parent }) => {
						// Only show additional images for image type and gridGallery variant
						return parent?.type !== "image";
					},
					of: [
						{
							type: "image",
							title: "Image",
							options: {
								hotspot: true,
							},
							fields: [
								{
									name: "alt",
									type: "string",
									title: "Alternative Text",
								},
								{
									name: "i18n_alt",
									type: "internationalizedArrayString",
									title: "Alternative Text (Translated)",
								},
							],
						},
					],
					validation: (Rule) =>
						Rule.max(3).warning("You can add up to 3 additional images"),
				},
			],
		}),
	],
	preview: {
		select: {
			title: "heading",
			subtitle: "variant",
		},
		prepare({ title, subtitle }) {
			return {
				title: title || "Hero Section",
				subtitle: `Variant: ${subtitle || "buttonBanner"}`,
				media: RocketIcon,
			};
		},
	},
});

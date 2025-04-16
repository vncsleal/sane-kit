import {
	DocumentTextIcon,
	InfoOutlineIcon,
	ImageIcon,
	TagIcon,
} from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const blogPostGroups = [
	{
		name: "basic",
		title: "Basic Information",
		icon: InfoOutlineIcon,
		default: true,
	},
	{
		name: "content",
		title: "Content",
		icon: DocumentTextIcon,
	},
	{
		name: "metadata",
		title: "Metadata",
		icon: TagIcon,
	},
	{
		name: "media",
		title: "Media",
		icon: ImageIcon,
	},
	{
		name: "translations",
		title: "Translations",
		icon: DocumentTextIcon,
	},
];

export const blogPost = defineType({
	name: "blogPost",
	title: "Blog Post",
	type: "document",
	icon: DocumentTextIcon,
	groups: blogPostGroups,
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Title",
			validation: (rule) => rule.required(),
			group: "basic",
		}),
		defineField({
			name: "i18n_title",
			type: "internationalizedArrayString",
			title: "Title (Translated)",
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
			name: "publishedAt",
			type: "datetime",
			title: "Published At",
			initialValue: () => new Date().toISOString(),
			group: "basic",
		}),
		defineField({
			name: "excerpt",
			type: "text",
			title: "Excerpt",
			description: "A short summary of the article",
			validation: (rule) => rule.max(300),
			group: "basic",
		}),
		defineField({
			name: "i18n_excerpt",
			type: "internationalizedArrayText",
			title: "Excerpt (Translated)",
			description: "A translated summary of the article",
		}),
		defineField({
			name: "author",
			type: "reference",
			title: "Author",
			to: [{ type: "author" }],
			validation: (rule) => rule.required(),
			group: "metadata",
		}),
		defineField({
			name: "mainImage",
			type: "image",
			title: "Main Image",
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
				{
					name: "caption",
					type: "string",
					title: "Caption",
				},
				{
					name: "i18n_caption",
					type: "internationalizedArrayString",
					title: "Caption (Translated)",
				},
			],
			group: "media",
		}),
		defineField({
			name: "categories",
			type: "array",
			title: "Categories",
			of: [{ type: "reference", to: { type: "category" } }],
			group: "metadata",
		}),
		defineField({
			name: "body",
			title: "Content",
			type: "portableText", // This references the complete portable text type
			group: "content",
		}),
		defineField({
			name: "i18n_body",
			title: "Content (Translated)",
			type: "array",

			of: [
				{
					type: "object",
					name: "localizedContent",
					groups: [
						{ name: "translations", title: "Translations", default: true },
					],
					fields: [
						{
							name: "language",
							type: "string",
							title: "Language",
							options: {
								list: [{ title: "Brazilian Portuguese", value: "pt_BR" }],
							},
						},
						{
							name: "content",
							title: "Content",
							type: "portableText",
						},
					],
					preview: {
						select: {
							language: "language",
						},
						prepare({ language }) {
							return {
								title: `Content in ${language === "pt_BR" ? "Brazilian Portuguese" : language}`,
							};
						},
					},
				},
			],
		}),
		defineField({
			name: "featured",
			type: "boolean",
			title: "Featured Post",
			description: "Set this post as a featured article",
			initialValue: false,
			group: "metadata",
		}),
	],
	preview: {
		select: {
			title: "title",
			author: "author.name",
			media: "mainImage",
			date: "publishedAt",
		},
		prepare(selection) {
			const { title, author, media, date } = selection;
			const formattedDate = date
				? new Date(date).toLocaleDateString("en-US", {
						year: "numeric",
						month: "short",
						day: "numeric",
					})
				: "Unpublished";

			return {
				title,
				subtitle: `By ${author || "Unknown author"} · ${formattedDate}`,
				media: media || DocumentTextIcon,
			};
		},
	},
});

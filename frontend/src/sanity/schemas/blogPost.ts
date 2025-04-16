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
					name: "caption",
					type: "string",
					title: "Caption",
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

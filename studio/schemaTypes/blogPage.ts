import { DocumentTextIcon, EarthGlobeIcon, ThLargeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import {
	fields,
	groups,
	documents,
	descriptions,
	validation,
	sanityOptions,
} from "../dictionary";

// Define field groups
const blogPageGroups = [
	{
		name: "content",
		title: groups.content,
		icon: DocumentTextIcon,
		default: true,
	},
	{
		name: "display",
		title: groups.display,
		icon: ThLargeIcon,
	},
	{
		name: "seo",
		title: groups.seoSettings,
		icon: EarthGlobeIcon,
	},
];

export const blogPage = defineType({
	name: "blogPage",
	title: documents.blogPage,
	type: "document",
	icon: DocumentTextIcon,
	groups: blogPageGroups,
	fields: [
		defineField({
			name: "language",
			type: "string",
			hidden: true,
			readOnly: true,
		}),
		defineField({
			name: "title",
			title: fields.pageTitle,
			type: "string",
			description: descriptions.blogPageTitle,
			initialValue: "Blog",
			validation: (rule) =>
				rule.required().error(validation.blogPageTitleRequired),
			group: "content",
		}),
		defineField({
			name: "description",
			title: fields.pageDescription,
			type: "text",
			description: descriptions.blogPageDescription,
			rows: 2,
			initialValue: descriptions.blogDescription,
			group: "content",
		}),
		defineField({
			name: "layout",
			title: fields.layout,
			type: "string",
			description: descriptions.layoutDescription,
			group: "display",
			options: {
				list: sanityOptions.blogLayouts,
				layout: "radio",
			},
			initialValue: "grid",
		}),
		defineField({
			name: "postsPerPage",
			title: fields.postsPerPage,
			type: "number",
			description: descriptions.postsPerPageDescription,
			initialValue: 9,
			validation: (rule) => rule.min(1).max(24),
			group: "display",
		}),
		defineField({
			name: "featuredPostsCount",
			title: fields.featuredPostsCount,
			type: "number",
			description: descriptions.featuredPostsCountDescription,
			initialValue: 3,
			hidden: ({ parent }) => parent?.layout !== "featured",
			validation: (rule) => rule.min(1).max(6),
			group: "display",
		}),
		defineField({
			name: "showOnlyFeaturedPosts",
			title: fields.showOnlyFeaturedPosts,
			type: "string",
			description: descriptions.showOnlyFeaturedDescription,
			initialValue: "false",
			options: {
				list: sanityOptions.yesNo,
				layout: "radio",
			},
			hidden: ({ parent }) => parent?.layout !== "featured",
			group: "display",
		}),
		defineField({
			name: "seo",
			title: fields.seo,
			type: "object",
			description: descriptions.seoDescription,
			group: "seo",
			fields: [
				{
					name: "metaTitle",
					title: fields.metaTitle,
					type: "string",
					description: descriptions.metaTitleDescription,
					validation: (rule) => rule.warning(validation.metaTitleWarning),
				},
				{
					name: "metaDescription",
					title: fields.metaDescription,
					type: "text",
					description: descriptions.metaDescriptionDescription,
					validation: (rule) =>
						rule.warning(validation.metaDescriptionSeoWarning),
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
			const selectedLayout = sanityOptions.blogLayouts.find(
				(opt) => opt.value === layout,
			);
			const layoutTitle = selectedLayout ? selectedLayout.title : layout;
			return {
				title: title || descriptions.defaultBlogPage,
				subtitle: `Layout: ${layoutTitle || descriptions.defaultLayout}`,
				media: DocumentTextIcon,
			};
		},
	},
});

import {
	DocumentTextIcon,
	InfoOutlineIcon,
	ComponentIcon,
	CogIcon,
} from "@sanity/icons";
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
const blogSectionGroups = [
	{
		name: "content",
		title: groups.content,
		icon: InfoOutlineIcon,
		default: true,
	},
	{
		name: "appearance",
		title: groups.appearance,
		icon: ComponentIcon,
	},
	{
		name: "options",
		title: groups.options,
		icon: CogIcon,
	},
];

export const blogSection = defineType({
	name: "blogSection",
	title: documents.blogSection,
	type: "object",
	icon: DocumentTextIcon,
	groups: blogSectionGroups,
	fields: [
		defineField({
			name: "heading",
			title: fields.heading,
			type: "string",
			initialValue: descriptions.latestArticles,
			validation: (rule) =>
				rule.required().error(validation.blogSectionTitleRequired),
			group: "content",
		}),
		defineField({
			name: "variant",
			title: fields.variant,
			type: "string",
			group: "appearance",
			options: {
				list: sanityOptions.blogSectionVariants,
				layout: "radio",
			},
			initialValue: "default",
		}),
		defineField({
			name: "subheading",
			title: fields.subheading,
			type: "text",
			rows: 2,
			hidden: ({ parent }) => parent?.variant === "grid",
			validation: (rule) =>
				rule.max(200).warning(validation.subheadingWarning),
			group: "content",
		}),
		defineField({
			name: "postsToShow",
			title: fields.postsToShow,
			type: "number",
			description: descriptions.postsToShowDescription,
			initialValue: 4,
			validation: (rule) =>
				rule.min(1).max(12).error(validation.postsCountRange),
			group: "options",
		}),
		defineField({
			name: "showFeaturedPostLarge",
			title: fields.showFeaturedPostLarge,
			type: "string",
			description: descriptions.showFeaturedPostLargeDescription,
			initialValue: "true",
			options: {
				list: sanityOptions.yesNo,
				layout: "radio",
			},
			hidden: ({ parent }) => parent?.variant === "grid",
			group: "appearance",
		}),
		defineField({
			name: "featuredPostsOnly",
			title: fields.featuredPostsOnly,
			type: "string",
			description: descriptions.featuredPostsOnlyDescription,
			initialValue: "false",
			options: {
				list: sanityOptions.yesNo,
				layout: "radio",
			},
			group: "options",
		}),
		defineField({
			name: "viewAllButton",
			title: fields.viewAllButton,
			type: "string",
			initialValue: "false",
			options: {
				list: sanityOptions.yesNo,
				layout: "radio",
			},
			group: "options",
		}),
		defineField({
			name: "viewAllUrl",
			title: fields.viewAllUrl,
			type: "string",
			description: descriptions.viewAllUrlDescription,
			initialValue: "/blog",
			hidden: ({ parent }) => parent?.viewAllButton === "false",
			group: "options",
		}),
		defineField({
			name: "viewAllButtonText",
			title: fields.viewAllButtonText,
			type: "string",
			description: descriptions.viewAllButtonTextDescription,
			initialValue: descriptions.viewAllArticles,
			hidden: ({ parent }) => parent?.viewAllButton === "false",
			group: "content",
		}),
	],
	preview: {
		select: {
			title: "heading",
			variant: "variant",
		},
		prepare({ title, variant }) {
			const selectedVariant = sanityOptions.blogSectionVariants.find(
				(v) => v.value === variant,
			);
			const variantTitle = selectedVariant ? selectedVariant.title : variant;
			return {
				title: title || descriptions.defaultBlogSection,
				subtitle: variantTitle || descriptions.defaultLayout,
				media: DocumentTextIcon,
			};
		},
	},
});

import { TagIcon, InfoOutlineIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const categoryGroups = [
	{
		name: "basic",
		title: "Basic Information",
		icon: InfoOutlineIcon,
		default: true,
	},
	{
		name: "translations",
		title: "Translations",
		icon: InfoOutlineIcon,
	},
];

export const category = defineType({
	name: "category",
	title: "Category",
	type: "document",
	icon: TagIcon,
	groups: categoryGroups,
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
			name: "description",
			type: "text",
			title: "Description",
			group: "basic",
		}),
		defineField({
			name: "i18n_description",
			type: "internationalizedArrayText",
			title: "Description (Translated)",
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "description",
		},
		prepare({ title, subtitle }) {
			return {
				title,
				subtitle: subtitle || "No description",
				media: TagIcon,
			};
		},
	},
});

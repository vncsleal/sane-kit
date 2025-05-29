import { TagIcon, InfoOutlineIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { isUniqueOtherThanLanguage } from "../utils/isUniqueOtherThanLanguage";
import { fields, groups, documents, descriptions, validation } from "../dictionary";

// Define field groups
const categoryGroups = [
	{
		name: "basic",
		title: groups.basic,
		icon: InfoOutlineIcon,
		default: true,
	},
];

export const category = defineType({
	name: "category",
	title: documents.category,
	type: "document",
	icon: TagIcon,
	groups: categoryGroups,
	fields: [
		defineField({
			name: 'language',
			type: 'string',
			hidden: true,
			readOnly: true,
		}),
		defineField({
			name: "title",
			title: fields.title,
			type: "string",
			validation: (rule) =>
				rule.required().error(validation.titleRequired),
			group: "basic",
		}),
		defineField({
			name: "slug",
			title: fields.slug,
			type: "slug",
			options: {
				source: "title",
				maxLength: 96,
				isUnique: isUniqueOtherThanLanguage,
			},
			validation: (rule) =>
				rule.required().error(validation.slugRequired),
			group: "basic",
		}),
		defineField({
			name: "description",
			title: fields.description,
			type: "text",
			validation: (rule) =>
				rule
					.max(200)
					.warning(validation.descriptionWarning),
			group: "basic",
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
				subtitle: subtitle || descriptions.noDescription,
				media: TagIcon,
			};
		},
	},
});

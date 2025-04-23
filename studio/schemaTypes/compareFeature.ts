import { ComposeIcon, TranslateIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const compareFeatureGroups = [
	{
		name: "content",
		title: "Content",
		default: true,
	},
	{
		name: "translations",
		title: "Translations",
		icon: TranslateIcon,
	},
];

export const compareFeature = defineType({
	name: "compareFeature",
	title: "Compare Feature",
	type: "document", // Changed from "object" to "document"
	icon: ComposeIcon,
	groups: compareFeatureGroups,
	fields: [
		defineField({
			name: "title",
			title: "Feature Title",
			type: "string",
			validation: (rule) => rule.required(),
			group: "content",
		}),
		defineField({
			name: "i18n_title",
			title: "Feature Title (Translated)",
			type: "internationalizedArrayString",
			group: "translations",
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "text",
			rows: 2,
			group: "content",
		}),
		defineField({
			name: "i18n_description",
			title: "Description (Translated)",
			type: "internationalizedArrayText",
			group: "translations",
		}),
	],
	preview: {
		select: {
			title: "title",
			description: "description",
		},
		prepare({ title, description }) {
			return {
				title: title || "Compare Feature",
				subtitle: description
					? `${description.substring(0, 80)}${description.length > 80 ? "..." : ""}`
					: "No description",
				media: ComposeIcon,
			};
		},
	},
});

import { CheckmarkCircleIcon, InfoOutlineIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const compareFeatureGroups = [
	{
		name: "basic",
		title: "Basic Information",
		icon: InfoOutlineIcon,
		default: true,
	},
];

export const compareFeature = defineType({
	name: "compareFeature",
	title: "Compare Feature",
	type: "document",
	icon: CheckmarkCircleIcon,
	groups: compareFeatureGroups,
	fields: [
		defineField({
			name: "name",
			type: "string",
			title: "Feature Name",
			validation: (rule) => rule.required(),
			group: "basic",
		}),
	],
	preview: {
		select: { title: "name" },
		prepare({ title }) {
			return {
				title: title || "Feature",
				media: CheckmarkCircleIcon,
			};
		},
	},
});

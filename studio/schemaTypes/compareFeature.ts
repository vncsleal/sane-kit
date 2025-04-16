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
	type: "object",
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
		}),
		defineField({
			name: "options",
			title: "Feature Options",
			type: "array",
			validation: (rule) => rule.required().min(2),
			of: [
				{
					type: "object",
					fields: [
						defineField({
							name: "name",
							title: "Option Name",
							type: "string",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "i18n_name",
							title: "Option Name (Translated)",
							type: "internationalizedArrayString",
						}),
						defineField({
							name: "status",
							title: "Status",
							type: "string",
							options: {
								list: [
									{ title: "Included", value: "included" },
									{ title: "Not Included", value: "not-included" },
									{ title: "Partial", value: "partial" },
									{ title: "Custom Value", value: "custom" },
								],
							},
							initialValue: "included",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "customValue",
							title: "Custom Value",
							type: "string",
							description:
								"Custom text to display (only used when status is 'custom')",
							hidden: ({ parent }) => parent?.status !== "custom",
						}),
						defineField({
							name: "i18n_customValue",
							title: "Custom Value (Translated)",
							type: "internationalizedArrayString",
							description:
								"Translated custom text to display (only used when status is 'custom')",
							hidden: ({ parent }) => parent?.status !== "custom",
						}),
					],
					preview: {
						select: {
							name: "name",
							status: "status",
							customValue: "customValue",
						},
						prepare({ name, status, customValue }) {
							const getStatusIcon = (
								status: "included" | "not-included" | "partial" | "custom",
							) => {
								switch (status) {
									case "included":
										return "✅";
									case "not-included":
										return "❌";
									case "partial":
										return "⚠️";
									case "custom":
										return "🔤";
									default:
										return "❓";
								}
							};

							return {
								title: name || "Option",
								subtitle:
									status === "custom"
										? `Custom: ${customValue || ""}`
										: status || "included",
								media: () => getStatusIcon(status),
							};
						},
					},
				},
			],
			group: "content",
		}),
	],
	preview: {
		select: {
			title: "title",
			description: "description",
			optionsCount: "options.length",
		},
		prepare({ title, description, optionsCount = 0 }) {
			return {
				title: title || "Compare Feature",
				subtitle: `${optionsCount} option${optionsCount === 1 ? "" : "s"} · ${
					description ? `${description.substring(0, 50)}...` : "No description"
				}`,
				media: ComposeIcon,
			};
		},
	},
});

import {
	BellIcon,
	InfoOutlineIcon,
	BulbOutlineIcon,
	ComponentIcon,
} from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const ctaGroups = [
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
		title: "Call to Actions",
		icon: BulbOutlineIcon,
	},
	{
		name: "translations",
		title: "Translations",
		icon: InfoOutlineIcon,
	},
];

export const ctaSection = defineType({
	name: "ctaSection",
	title: "CTA Section",
	type: "object",
	icon: BellIcon,
	groups: ctaGroups,
	fields: [
		defineField({
			name: "variant",
			type: "string",
			title: "Variant",
			group: "appearance",
			options: {
				list: [
					{ title: "Default", value: "default" },
					{ title: "Highlight", value: "highlight" },
					{ title: "Minimal", value: "minimal" },
					{ title: "Full", value: "full" },
				],
			},
			initialValue: "default",
		}),
		defineField({
			name: "badgeText",
			type: "string",
			title: "Badge Text",
			description: "Optional badge text displayed above the heading",
			group: "content",
		}),
		defineField({
			name: "i18n_badgeText",
			type: "internationalizedArrayString",
			title: "Badge Text (Translated)",
			description:
				"Optional badge text displayed above the heading (translated)",
			group: "content",
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
							validation: (rule) => rule.required(),
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
							validation: (rule) => rule.required(),
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
									{ title: "None", value: "none" },
									{ title: "Arrow Right", value: "arrowRight" },
									{ title: "Phone", value: "phone" },
									{ title: "Plus", value: "plus" },
								],
							},
							initialValue: "none",
						},
					],
					preview: {
						select: {
							title: "label",
							subtitle: "url",
						},
					},
				},
			],
			validation: (rule) => rule.min(1).error("Add at least one button"),
		}),
	],
	preview: {
		select: {
			title: "heading",
			subtitle: "variant",
			buttonCount: "buttons.length",
		},
		prepare({ title, subtitle, buttonCount = 0 }) {
			return {
				title: title || "CTA Section",
				subtitle: `${subtitle || "default"} - ${buttonCount} button${buttonCount === 1 ? "" : "s"}`,
				media: BellIcon,
			};
		},
	},
});

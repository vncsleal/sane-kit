import { HelpCircleIcon, InfoOutlineIcon, ComponentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const faqGroups = [
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
		name: "questions",
		title: "FAQ Items",
		icon: HelpCircleIcon,
	},
	{
		name: "translations",
		title: "Translations",
		icon: InfoOutlineIcon,
	},
];

export const faqSection = defineType({
	name: "faqSection",
	title: "FAQ Section",
	type: "object",
	icon: HelpCircleIcon,
	groups: faqGroups,
	fields: [
		defineField({
			name: "variant",
			type: "string",
			title: "Layout Variant",
			group: "appearance",
			options: {
				list: [
					{ title: "Side by Side", value: "sideBySide" },
					{ title: "Centered", value: "centered" },
				],
			},
			initialValue: "sideBySide",
		}),
		defineField({
			name: "badgeText",
			type: "string",
			title: "Badge Text",
			description: "Text displayed in the badge (e.g. 'FAQ')",
			initialValue: "FAQ",
			group: "content",
		}),
		defineField({
			name: "i18n_badgeText",
			type: "internationalizedArrayString",
			title: "Badge Text (Translated)",
			description: "Text displayed in the badge (translated)",
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
			description: "Descriptive text that appears below the heading",
			rows: 3,
			group: "content",
		}),
		defineField({
			name: "i18n_subheading",
			type: "internationalizedArrayText",
			title: "Subheading (Translated)",
			description:
				"Descriptive text that appears below the heading (translated)",
			group: "content",
		}),
		defineField({
			name: "buttonText",
			type: "string",
			title: "Button Text",
			description: "Call-to-action button text",
			group: "content",
		}),
		defineField({
			name: "i18n_buttonText",
			type: "internationalizedArrayString",
			title: "Button Text (Translated)",
			description: "Call-to-action button text (translated)",
			group: "content",
		}),
		defineField({
			name: "buttonUrl",
			type: "string",
			title: "Button URL",
			description: "Where the button links to",
			hidden: ({ parent }) => !parent?.buttonText,
			group: "content",
		}),
		defineField({
			name: "buttonIcon",
			type: "string",
			title: "Button Icon",
			options: {
				list: [
					{ title: "None", value: "none" },
					{ title: "Phone", value: "phone" },
					{ title: "Arrow Right", value: "arrowRight" },
					{ title: "Plus", value: "plus" },
					{ title: "Check", value: "check" },
				],
			},
			initialValue: "phone",
			hidden: ({ parent }) => !parent?.buttonText,
			group: "content",
		}),
		defineField({
			name: "faqItems",
			type: "array",
			title: "FAQ Items",
			description: "Questions and answers for the FAQ section",
			group: "questions",
			of: [
				{
					type: "object",
					name: "faqItem",
					groups: [
						{ name: "content", title: "Content", default: true },
						{ name: "translations", title: "Translations" },
					],
					fields: [
						defineField({
							name: "question",
							type: "string",
							title: "Question",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "i18n_question",
							type: "internationalizedArrayString",
						}),
						defineField({
							name: "answer",
							type: "text",
							title: "Answer",
							rows: 3,
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "i18n_answer",
							type: "internationalizedArrayText",
							title: "Answer (Translated)",
						}),
					],
					preview: {
						select: {
							title: "question",
							subtitle: "answer",
						},
					},
				},
			],
			validation: (rule) => rule.min(1).error("Add at least one FAQ item"),
		}),
	],
	preview: {
		select: {
			title: "heading",
			itemCount: "faqItems.length",
		},
		prepare({ title, itemCount = 0 }) {
			return {
				title: title || "FAQ Section",
				subtitle: `${itemCount} question${itemCount === 1 ? "" : "s"}`,
				media: HelpCircleIcon,
			};
		},
	},
});

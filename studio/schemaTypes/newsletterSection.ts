import { EnvelopeIcon, InfoOutlineIcon, EarthGlobeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const newsletterGroups = [
	{
		name: "content",
		title: "Content",
		icon: InfoOutlineIcon,
		default: true,
	},
	{
		name: "appearance",
		title: "Appearance",
		icon: EarthGlobeIcon,
	},
	{
		name: "translations",
		title: "Translations",
		icon: InfoOutlineIcon,
	},
];

export const newsletterSection = defineType({
	name: "newsletterSection",
	title: "Newsletter Section",
	type: "object",
	icon: EnvelopeIcon,
	groups: newsletterGroups,
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
			group: "content",
			description: "Optional badge text displayed above the heading",
		}),
		defineField({
			name: "i18n_badgeText",
			type: "internationalizedArrayString",
			title: "Badge Text (Translated)",
		}),
		defineField({
			name: "heading",
			type: "string",
			title: "Heading",
			group: "content",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "i18n_heading",
			type: "internationalizedArrayString",
			title: "Heading (Translated)",
		}),
		defineField({
			name: "subheading",
			type: "text",
			title: "Subheading",
			group: "content",
			rows: 3,
		}),
		defineField({
			name: "i18n_subheading",
			type: "internationalizedArrayText",
			title: "Subheading (Translated)",
		}),
		defineField({
			name: "inputPlaceholder",
			type: "string",
			title: "Input Placeholder",
			group: "content",
			initialValue: "Enter your email",
		}),
		defineField({
			name: "i18n_inputPlaceholder",
			type: "internationalizedArrayString",
			title: "Input Placeholder (Translated)",
		}),
		defineField({
			name: "buttonText",
			type: "string",
			title: "Button Text",
			group: "content",
			initialValue: "Subscribe",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "i18n_buttonText",
			type: "internationalizedArrayString",
			title: "Button Text (Translated)",
		}),
		defineField({
			name: "buttonIcon",
			type: "string",
			title: "Button Icon",
			group: "appearance",
			options: {
				list: [
					{ title: "None", value: "none" },
					{ title: "Arrow Right", value: "arrowRight" },
					{ title: "Plus", value: "plus" },
					{ title: "Mail", value: "mail" },
				],
			},
			initialValue: "mail",
		}),
		defineField({
			name: "successMessage",
			type: "string",
			title: "Success Message",
			group: "content",
			initialValue: "Thank you for subscribing!",
		}),
		defineField({
			name: "i18n_successMessage",
			type: "internationalizedArrayString",
			title: "Success Message (Translated)",
		}),
		defineField({
			name: "privacyText",
			type: "text",
			title: "Privacy Text",
			group: "content",
			description: "Optional text about privacy policy",
			rows: 2,
		}),
		defineField({
			name: "i18n_privacyText",
			type: "internationalizedArrayText",
			title: "Privacy Text (Translated)",
		}),
	],
	preview: {
		select: {
			title: "heading",
			subtitle: "variant",
		},
		prepare({ title, subtitle }) {
			return {
				title: title || "Newsletter Section",
				subtitle: `Variant: ${subtitle || "default"}`,
				media: EnvelopeIcon,
			};
		},
	},
});

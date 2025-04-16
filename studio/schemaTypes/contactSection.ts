import {
	UserIcon,
	InfoOutlineIcon,
	ComponentIcon,
	CogIcon,
} from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const contactGroups = [
	{
		name: "content",
		title: "Content",
		icon: InfoOutlineIcon,
		default: true,
	},
	{
		name: "features",
		title: "Features",
		icon: ComponentIcon,
	},
	{
		name: "form",
		title: "Form Settings",
		icon: CogIcon,
	},
	{
		name: "translations",
		title: "Translations",
		icon: InfoOutlineIcon,
	},
];

export const contactSection = defineType({
	name: "contactSection",
	title: "Contact Section",
	type: "object",
	icon: UserIcon,
	groups: contactGroups,
	fields: [
		defineField({
			name: "badgeText",
			type: "string",
			title: "Badge Text",
			initialValue: "Contact",
			validation: (rule) => rule.required(),
			group: "content",
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
			validation: (rule) => rule.required(),
			group: "content",
		}),
		defineField({
			name: "i18n_heading",
			type: "internationalizedArrayString",
			title: "Heading (Translated)",
		}),
		defineField({
			name: "description",
			type: "text",
			title: "Description",
			rows: 3,
			group: "content",
		}),
		defineField({
			name: "i18n_description",
			type: "internationalizedArrayText",
			title: "Description (Translated)",
		}),
		defineField({
			name: "features",
			type: "array",
			title: "Features",
			group: "features",
			of: [
				{
					type: "object",
					name: "feature",
					fields: [
						defineField({
							name: "title",
							type: "string",
							title: "Title",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "i18n_title",
							type: "internationalizedArrayString",
							title: "Title (Translated)",
						}),
						defineField({
							name: "description",
							type: "text",
							title: "Description",
							rows: 2,
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
					},
				},
			],
			validation: (rule) => rule.min(1).error("Add at least one feature"),
		}),
		defineField({
			name: "formTitle",
			type: "string",
			title: "Form Title",
			initialValue: "Book a meeting",
			group: "form",
		}),
		defineField({
			name: "i18n_formTitle",
			type: "internationalizedArrayString",
			title: "Form Title (Translated)",
		}),
		defineField({
			name: "formFields",
			type: "object",
			title: "Form Fields",
			group: "form",
			fields: [
				defineField({
					name: "showDate",
					type: "boolean",
					title: "Show Date Picker",
					initialValue: true,
				}),
				defineField({
					name: "showFirstName",
					type: "boolean",
					title: "Show First Name Field",
					initialValue: true,
				}),
				defineField({
					name: "showLastName",
					type: "boolean",
					title: "Show Last Name Field",
					initialValue: true,
				}),
				defineField({
					name: "showFileUpload",
					type: "boolean",
					title: "Show File Upload Field",
					initialValue: true,
				}),
				defineField({
					name: "fileUploadLabel",
					type: "string",
					title: "File Upload Label",
					initialValue: "Upload resume",
					hidden: ({ parent }) => !parent?.showFileUpload,
				}),
				defineField({
					name: "i18n_fileUploadLabel",
					type: "internationalizedArrayString",
					title: "File Upload Label (Translated)",
					hidden: ({ parent }) => !parent?.showFileUpload,
				}),
			],
		}),
		defineField({
			name: "buttonText",
			type: "string",
			title: "Button Text",
			initialValue: "Book the meeting",
			validation: (rule) => rule.required(),
			group: "form",
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
			options: {
				list: [
					{ title: "Arrow Right", value: "arrowRight" },
					{ title: "Phone", value: "phone" },
					{ title: "None", value: "none" },
				],
			},
			initialValue: "arrowRight",
			group: "form",
		}),
	],
	preview: {
		select: {
			title: "heading",
			subtitle: "badgeText",
			featuresCount: "features.length",
		},
		prepare({ title, subtitle, featuresCount = 0 }) {
			return {
				title: title || "Contact Section",
				subtitle: `${subtitle ? `Badge: ${subtitle}` : "Contact section"} · ${featuresCount} feature${featuresCount === 1 ? "" : "s"}`,
				media: UserIcon,
			};
		},
	},
});

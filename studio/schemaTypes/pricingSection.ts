import {
	CreditCardIcon,
	InfoOutlineIcon,
	TagIcon,
	TranslateIcon,
} from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups for the main section
const pricingGroups = [
	{
		name: "content",
		title: "Section Content",
		icon: InfoOutlineIcon,
		default: true,
	},
	{ name: "plans", title: "Pricing Plans", icon: TagIcon },
	{ name: "translations", title: "Translations", icon: TranslateIcon },
];

export const pricingSection = defineType({
	name: "pricingSection",
	title: "Pricing Section",
	type: "object",
	icon: CreditCardIcon,
	groups: pricingGroups,
	fields: [
		defineField({
			name: "badgeText",
			type: "string",
			title: "Badge Text",
			initialValue: "Pricing",
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
			name: "subheading",
			type: "text",
			title: "Subheading",
			rows: 2,
			group: "content",
		}),
		defineField({
			name: "i18n_subheading",
			type: "internationalizedArrayText",
			title: "Subheading (Translated)",
		}),
		defineField({
			name: "plans",
			type: "array",
			title: "Pricing Plans",
			group: "plans",
			of: [
				{
					type: "object",
					name: "plan",
					// Define groups inline for the plan object
					groups: [
						{ name: "content", title: "Content", default: true },
						{
							name: "translations",
							title: "Translations",
							icon: TranslateIcon,
						},
					],
					fields: [
						{
							name: "title",
							type: "string",
							title: "Plan Title",
							validation: (rule) => rule.required(),
							group: "content",
						},
						{
							name: "i18n_title",
							type: "internationalizedArrayString",
							title: "Plan Title (Translated)",
						},
						{
							name: "description",
							type: "text",
							title: "Plan Description",
							group: "content",
						},
						{
							name: "i18n_description",
							type: "internationalizedArrayText",
							title: "Plan Description (Translated)",
						},
						{
							name: "highlighted",
							type: "boolean",
							title: "Highlight This Plan",
							description: "Add extra styling to make this plan stand out",
							initialValue: false,
							group: "content",
						},
						{
							name: "price",
							type: "string",
							title: "Price",
							description: "e.g. $40, Free, Contact Us",
							validation: (rule) => rule.required(),
							group: "content",
						},
						{
							name: "i18n_price",
							type: "internationalizedArrayString",
							title: "Price (Translated)",
							description: "e.g. $40, Free, Contact Us",
						},
						{
							name: "billingPeriod",
							type: "string",
							title: "Billing Period",
							description: "e.g. / month, / year, / user",
							group: "content",
						},
						{
							name: "i18n_billingPeriod",
							type: "internationalizedArrayString",
							title: "Billing Period (Translated)",
						},
						{
							name: "features",
							type: "array",
							title: "Features",
							group: "content",
							of: [
								{
									type: "object",
									name: "feature",
									// Define groups inline for the feature object
									groups: [
										{ name: "content", title: "Content", default: true },
										{
											name: "translations",
											title: "Translations",
											icon: TranslateIcon,
										},
									],
									fields: [
										{
											name: "title",
											type: "string",
											title: "Feature Title",
											validation: (rule) => rule.required(),
											group: "content",
										},
										{
											name: "i18n_title",
											type: "internationalizedArrayString",
											title: "Feature Title (Translated)",
										},
										{
											name: "description",
											type: "text",
											title: "Feature Description",
											group: "content",
										},
										{
											name: "i18n_description",
											type: "internationalizedArrayText",
											title: "Feature Description (Translated)",
										},
									],
								},
							],
							validation: (rule) =>
								rule.min(1).error("Add at least one feature"),
						},
						{
							name: "buttonText",
							type: "string",
							title: "Button Text",
							validation: (rule) => rule.required(),
							group: "content",
						},
						{
							name: "i18n_buttonText",
							type: "internationalizedArrayString",
							title: "Button Text (Translated)",
						},
						{
							name: "buttonUrl",
							type: "string",
							title: "Button URL",
							validation: (rule) => rule.required(),
							group: "content",
						},
						{
							name: "buttonIcon",
							type: "string",
							title: "Button Icon",
							options: {
								list: [
									{ title: "Arrow Right", value: "arrowRight" },
									{ title: "Phone", value: "phone" },
									{ title: "Plus", value: "plus" },
								],
							},
							initialValue: "arrowRight",
							group: "content",
						},
						{
							name: "buttonVariant",
							type: "string",
							title: "Button Variant",
							options: {
								list: [
									{ title: "Default", value: "default" },
									{ title: "Outline", value: "outline" },
									{ title: "Secondary", value: "secondary" },
								],
							},
							initialValue: "default",
							group: "content",
						},
					],
					preview: {
						select: {
							title: "title",
							price: "price",
						},
						prepare({ title, price }) {
							return {
								title: title || "Plan",
								subtitle: price ? `${price}` : "No price",
							};
						},
					},
				},
			],
			validation: (rule) => rule.min(1).error("Add at least one pricing plan"),
		}),
	],
	preview: {
		select: {
			title: "heading",
			plansCount: "plans.length",
		},
		prepare({ title, plansCount = 0 }) {
			return {
				title: title || "Pricing Section",
				subtitle: `${plansCount} plan${plansCount === 1 ? "" : "s"}`,
				media: CreditCardIcon,
			};
		},
	},
});

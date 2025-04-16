import { CreditCardIcon, InfoOutlineIcon, TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const pricingGroups = [
	{
		name: "content",
		title: "Section Content",
		icon: InfoOutlineIcon,
		default: true,
	},
	{
		name: "plans",
		title: "Pricing Plans",
		icon: TagIcon,
	},
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
			name: "heading",
			type: "string",
			title: "Heading",
			validation: (rule) => rule.required(),
			group: "content",
		}),
		defineField({
			name: "subheading",
			type: "text",
			title: "Subheading",
			rows: 2,
			group: "content",
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
					fields: [
						{
							name: "title",
							type: "string",
							title: "Plan Title",
							validation: (rule) => rule.required(),
						},
						{
							name: "description",
							type: "text",
							title: "Plan Description",
							rows: 3,
						},
						{
							name: "highlighted",
							type: "boolean",
							title: "Highlight This Plan",
							description: "Add extra styling to make this plan stand out",
							initialValue: false,
						},
						{
							name: "price",
							type: "string",
							title: "Price",
							description: "e.g. $40, Free, Contact Us",
							validation: (rule) => rule.required(),
						},
						{
							name: "billingPeriod",
							type: "string",
							title: "Billing Period",
							description: "e.g. / month, / year, / user",
						},
						{
							name: "features",
							type: "array",
							title: "Features",
							of: [
								{
									type: "object",
									name: "feature",
									fields: [
										{
											name: "title",
											type: "string",
											title: "Feature Title",
											validation: (rule) => rule.required(),
										},
										{
											name: "description",
											type: "text",
											title: "Feature Description",
											rows: 2,
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
						},
						{
							name: "buttonUrl",
							type: "string",
							title: "Button URL",
							validation: (rule) => rule.required(),
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

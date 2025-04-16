import {
	CheckmarkCircleIcon,
	InfoOutlineIcon,
	ThLargeIcon,
	TagIcon,
} from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const compareFeaturesGroups = [
	{
		name: "content",
		title: "Content",
		icon: InfoOutlineIcon,
		default: true,
	},
	{
		name: "features",
		title: "Features",
		icon: CheckmarkCircleIcon,
	},
	{
		name: "plans",
		title: "Plans",
		icon: TagIcon,
	},
];

export const compareFeaturesSection = defineType({
	name: "compareFeaturesSection",
	title: "Compare Features Section",
	type: "object",
	icon: ThLargeIcon,
	groups: compareFeaturesGroups,
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
			name: "features",
			type: "array",
			title: "Features to Compare",
			description: "Select features that will be compared across plans",
			group: "features",
			of: [
				{
					type: "reference",
					to: [{ type: "compareFeature" }],
				},
			],
			validation: (rule) => rule.min(1).error("Select at least one feature"),
		}),
		defineField({
			name: "plans",
			type: "array",
			title: "Plans to Compare",
			group: "plans",
			of: [
				{
					type: "object",
					name: "plan",
					fields: [
						defineField({
							name: "title",
							type: "string",
							title: "Plan Title",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "description",
							type: "text",
							title: "Plan Description",
							rows: 3,
						}),
						defineField({
							name: "price",
							type: "string",
							title: "Price",
							description: "e.g. $40, Free, Contact Us",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "billingPeriod",
							type: "string",
							title: "Billing Period",
							description: "e.g. / month, / year, / user",
						}),
						defineField({
							name: "highlighted",
							type: "boolean",
							title: "Highlight This Plan",
							description: "Add extra styling to make this plan stand out",
							initialValue: false,
						}),
						defineField({
							name: "featureValues",
							type: "array",
							title: "Feature Values",
							description: "Select the applicable status for each feature.",
							of: [
								{
									type: "object",
									name: "featureValue",
									fields: [
										defineField({
											name: "featureRef",
											type: "reference",
											title: "Feature",
											to: [{ type: "compareFeature" }],
											validation: (rule) => rule.required(),
										}),
										defineField({
											name: "value",
											type: "string",
											title: "Status",
											description: "Select the status for this feature",
											options: {
												list: [
													{ title: "✓ Included", value: "true" },
													{ title: "✗ Not included", value: "false" },
													{ title: "Custom", value: "custom" },
												],
												layout: "radio",
											},
											initialValue: "true",
											validation: (rule) => rule.required(),
										}),
										defineField({
											name: "customText",
											type: "string",
											title: "Custom Value",
											description:
												"Enter custom text (e.g. '5 users') if using custom value",
											hidden: ({ parent }) => parent?.value !== "custom",
										}),
									],
									preview: {
										select: {
											featureRef: "featureRef.name",
											value: "value",
											customText: "customText",
										},
										prepare({ featureRef, value, customText }) {
											let valueDisplay = "";
											if (value === "true") valueDisplay = "✓ Included";
											else if (value === "false")
												valueDisplay = "✗ Not included";
											else if (value === "custom")
												valueDisplay = customText || "Custom";
											return {
												title: featureRef
													? `Feature: ${featureRef}`
													: "No Feature",
												subtitle: valueDisplay,
											};
										},
									},
								},
							],
							validation: (rule) =>
								rule.custom((featureValues, context) => {
									const allFeatures = context.document?.features || [];
									if (!Array.isArray(allFeatures) || allFeatures.length === 0)
										return true;
									const usedRefs = Array.isArray(featureValues)
										? (
												featureValues as { featureRef: { _ref?: string } }[]
											).map((fv) => fv.featureRef?._ref || "")
										: [];
									const missing = allFeatures.filter(
										(f) => !usedRefs.includes(f._ref),
									);
									return missing.length === 0
										? true
										: `Missing feature values for: ${missing.map((f) => f.name || f._key).join(", ")}`;
								}),
						}),
						defineField({
							name: "buttonText",
							type: "string",
							title: "Button Text",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "buttonUrl",
							type: "string",
							title: "Button URL",
							validation: (rule) => rule.required(),
						}),
						defineField({
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
						}),
					],
				},
			],
			validation: (rule) => rule.min(1).error("Add at least one plan"),
		}),
	],
	preview: {
		select: {
			title: "heading",
			plansCount: "plans.length",
			featuresCount: "features.length",
		},
		prepare({ title, plansCount = 0, featuresCount = 0 }) {
			return {
				title: title || "Compare Features Section",
				subtitle: `${plansCount} plan${plansCount === 1 ? "" : "s"} · ${featuresCount} feature${featuresCount === 1 ? "" : "s"}`,
				media: ThLargeIcon,
			};
		},
	},
});

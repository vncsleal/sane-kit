import {
	CheckmarkCircleIcon,
	CloseCircleIcon, // Import CloseCircleIcon
	InfoOutlineIcon,
	TagIcon,
	TranslateIcon,
	ComposeIcon,
} from "@sanity/icons";
import {
	defineField,
	defineType,
	type ValidationContext,
	type PathSegment,
} from "sanity"; // Import PathSegment

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
	{
		name: "translations",
		title: "Translations",
		icon: TranslateIcon,
	},
];

export const compareFeaturesSection = defineType({
	name: "compareFeaturesSection",
	title: "Compare Features Section",
	type: "object",
	icon: ComposeIcon,
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
			name: "i18n_heading",
			title: "Heading (Translated)",
			type: "internationalizedArrayString",
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
			title: "Subheading (Translated)",
			type: "internationalizedArrayText",
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
					groups: [
						{ name: "content", title: "Content", default: true },
						{
							name: "translations",
							title: "Translations",
							icon: TranslateIcon,
						},
					],
					fields: [
						defineField({
							name: "title",
							type: "string",
							title: "Plan Title",
							validation: (rule) => rule.required(),
							group: "content",
						}),
						defineField({
							name: "i18n_title",
							title: "Plan Title (Translated)",
							type: "internationalizedArrayString",
						}),
						defineField({
							name: "description",
							type: "text",
							title: "Plan Description",
							rows: 3,
							group: "content",
						}),
						defineField({
							name: "i18n_description",
							title: "Plan Description (Translated)",
							type: "internationalizedArrayText",
						}),
						defineField({
							name: "price",
							type: "string",
							title: "Price",
							description: "e.g. $40, Free, Contact Us",
							validation: (rule) => rule.required(),
							group: "content",
						}),
						defineField({
							name: "i18n_price",
							title: "Price (Translated)",
							type: "internationalizedArrayString",
							description: "Translated price text (e.g. R$99/mês)",
						}),
						defineField({
							name: "billingPeriod",
							type: "string",
							title: "Billing Period",
							description: "e.g. / month, / year, / user",
							group: "content",
						}),
						defineField({
							name: "i18n_billingPeriod",
							title: "Billing Period (Translated)",
							type: "internationalizedArrayString",
							description: "Translated billing period text (e.g. /mês)",
							group: "translations",
						}),
						defineField({
							name: "highlighted",
							type: "boolean",
							title: "Highlight This Plan",
							description: "Add extra styling to make this plan stand out",
							initialValue: false,
							group: "content",
						}),
						defineField({
							name: "featureValues",
							type: "array",
							title: "Feature Values",
							description:
								"Define the status or value of each feature for this plan.",
							group: "content",
							of: [
								{
									type: "object",
									name: "featureValue",
									groups: [
										{ name: "content", title: "Content", default: true },
										{
											name: "translations",
											title: "Translations",
											icon: TranslateIcon,
										},
									],
									fields: [
										defineField({
											name: "featureRef",
											type: "reference",
											title: "Feature",
											to: [{ type: "compareFeature" }],
											validation: (rule) => rule.required(),
											group: "content",
											options: {
												filter: ({ parent }) => {
													const existingRefs = (
														parent as {
															_key: string;
															featureRef?: { _ref: string };
														}[]
													)
														.filter((item) => item.featureRef?._ref)
														.map((item) => item.featureRef?._ref);
													return {
														filter: "!(_id in $existingRefs)",
														params: { existingRefs },
													};
												},
											},
										}),
										defineField({
											name: "value",
											type: "string",
											title: "Status / Value",
											description:
												"Select status or provide a custom value for this feature.",
											options: {
												list: [
													{ title: "✓ Included", value: "true" },
													{ title: "✗ Not included", value: "false" },
													{ title: "Custom Text", value: "custom" },
												],
												layout: "radio",
											},
											initialValue: "true",
											validation: (rule) => rule.required(),
											group: "content",
										}),
										defineField({
											name: "customText",
											type: "string",
											title: "Custom Text",
											description:
												"Enter custom text (e.g. '5 users', 'Basic support') if using 'Custom Text' status.",
											hidden: ({ parent }) => parent?.value !== "custom",
											group: "content",
										}),
										defineField({
											name: "i18n_customText",
											title: "Custom Text (Translated)",
											type: "internationalizedArrayString",
											description: "Translated custom text.",
											hidden: ({ parent }) => parent?.value !== "custom",
											group: "translations",
										}),
									],
									preview: {
										select: {
											featureTitle: "featureRef.title",
											value: "value",
											customText: "customText",
										},
										prepare({ featureTitle, value, customText }) {
											let subtitle = "";
											let media = InfoOutlineIcon;

											if (value === "true") {
												subtitle = "✓ Included";
												media = CheckmarkCircleIcon;
											} else if (value === "false") {
												subtitle = "✗ Not included";
												media = CloseCircleIcon;
											} else if (value === "custom") {
												subtitle = customText || "Custom Text";
											}

											return {
												title: featureTitle || "Feature",
												subtitle: subtitle,
												media: media,
											};
										},
									},
								},
							],
							validation: (rule) =>
								rule
									.required()
									.min(1)
									.unique() // Ensures unique featureRef._ref per plan
									.custom((featureValues, context: ValidationContext) => {
										// Safely access document and pageBuilder
										const pageBuilder = context.document
											?.pageBuilder as unknown; // Cast to unknown first for safety
										const currentPath = context.path;

										// Ensure pageBuilder is an array and path exists and has enough segments
										if (
											!Array.isArray(pageBuilder) ||
											!currentPath ||
											currentPath.length < 2
										) {
											// Cannot determine parent section, skip validation or return an error
											// console.warn("Could not determine parent section for validation.");
											return true; // Or return specific error message if needed
										}

										// Safely access the key of the parent section in the path
										const parentPathSegment = currentPath[1];
										const parentSectionKey =
											typeof parentPathSegment === "object" &&
											parentPathSegment !== null &&
											"_key" in parentPathSegment
												? parentPathSegment._key
												: undefined;

										if (!parentSectionKey) {
											// console.warn("Could not determine parent section key.");
											return true; // Or return specific error message
										}

										// Find the parent section using the key
										const parentSection = pageBuilder.find(
											(
												section: unknown,
											): section is {
												_key?: string;
												_type?: string;
												features?: { _ref: string }[];
											} =>
												typeof section === "object" &&
												section !== null &&
												"_key" in section &&
												section._key === parentSectionKey,
										);

										const allFeaturesRefs =
											parentSection?.features?.map((f) => f._ref) || [];

										// If no features are defined in the section yet, validation passes
										if (allFeaturesRefs.length === 0) return true;

										// Get the _ref of features defined within this plan's featureValues
										const definedFeatureRefs = (
											featureValues as
												| { featureRef?: { _ref: string } }[]
												| undefined // Allow undefined
										)?.map((fv) => fv.featureRef?._ref);

										// Check if any features defined in the section are missing from the plan
										const missingRefs = allFeaturesRefs.filter(
											(ref) => !definedFeatureRefs?.includes(ref),
										);

										if (missingRefs.length > 0) {
											// Provide a more informative error message if possible
											// (Getting feature titles here is complex, so using refs)
											return `Missing values for some features. Please define a status/value for all features listed in the 'Features to Compare' tab. Missing feature refs: ${missingRefs.join(", ")}`;
										}

										// Check for duplicate featureRefs within the same plan (unique() rule handles this, but double-check)
										const refs = definedFeatureRefs?.filter(
											Boolean,
										) as string[];
										if (new Set(refs).size !== refs.length) {
											return "Each feature can only be listed once per plan.";
										}

										return true;
									}),
						}),
						defineField({
							name: "buttonText",
							type: "string",
							title: "Button Text",
							validation: (rule) => rule.required(),
							group: "content",
						}),
						defineField({
							name: "i18n_buttonText",
							title: "Button Text (Translated)",
							type: "internationalizedArrayString",
						}),
						defineField({
							name: "buttonUrl",
							type: "string",
							title: "Button URL",
							validation: (rule) => rule.required(),
							group: "content",
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
							group: "content",
						}),
						defineField({
							name: "buttonVariant",
							type: "string",
							title: "Button Variant",
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
							group: "content",
						}),
					],
					preview: {
						select: {
							title: "title",
							price: "price",
							highlighted: "highlighted",
						},
						prepare({ title, price, highlighted }) {
							return {
								title: `${highlighted ? "🌟 " : ""}${title || "Plan"}`,
								subtitle: price ? `${price}` : "No price",
							};
						},
					},
				},
			],
			validation: (rule) => rule.min(1).error("Add at least one plan"),
		}),
		defineField({
			name: "footnote",
			title: "Footnote",
			type: "text",
			rows: 2,
			description:
				"Optional footnote text at the bottom of the comparison table",
			group: "content",
		}),
		defineField({
			name: "i18n_footnote",
			title: "Footnote (Translated)",
			type: "internationalizedArrayText",
			description:
				"Translated footnote text at the bottom of the comparison table",
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
				media: ComposeIcon,
			};
		},
	},
});

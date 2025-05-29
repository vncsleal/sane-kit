import { CaseIcon, InfoOutlineIcon, ComponentIcon } from "@sanity/icons";
import { defineField, defineType, defineArrayMember } from "sanity";
import { fields, groups, documents, descriptions, validation, sanityOptions } from "../dictionary";

// Define field groups
const casesGroups = [
	{
		name: "content",
		title: groups.content,
		icon: InfoOutlineIcon,
		default: true,
	},
	{
		name: "appearance",
		title: groups.appearance,
		icon: ComponentIcon,
	},
	{
		name: "cases",
		title: groups.cases,
		icon: CaseIcon,
	},
];

export const casesSection = defineType({
	name: "casesSection",
	title: documents.casesSection,
	type: "object",
	icon: CaseIcon,
	groups: casesGroups,
	fields: [
		defineField({
			name: "variant",
			title: fields.variant,
			type: "string",
			group: "appearance",
			options: {
				list: sanityOptions.casesSectionVariants,
				layout: "radio",
			},
			initialValue: "logoCarousel",
		}),
		defineField({
			name: "heading",
			title: fields.heading,
			type: "string",
			validation: (rule) =>
				rule.required().error(validation.casesSectionTitleRequired),
			group: "content",
		}),
		defineField({
			name: "subheading",
			title: fields.subheading,
			type: "text",
			rows: 2,
			validation: (rule) =>
				rule
					.max(250)
					.warning(validation.casesSubheadingWarning),
			group: "content",
		}),
		defineField({
			name: "cases",
			title: fields.cases,
			type: "array",
			description: descriptions.casesDescription,
			group: "cases",
			validation: (rule) =>
				rule.min(1).error(validation.casesMinRequired),
			of: [
				defineArrayMember({
					type: "object",
					name: "caseItem",
					title: "Case",
					fields: [
						defineField({
							name: "name",
							title: fields.name,
							type: "string",
							validation: (rule) =>
								rule.required().error(validation.caseNameRequired),
						}),
						defineField({
							name: "logo",
							title: fields.logo,
							type: "image",
							options: {
								hotspot: true,
							},
							fields: [
								defineField({
									name: "alt",
									title: fields.alt,
									type: "string",
									validation: (rule) =>
										rule
											.required()
											.error(validation.logoAltRequired),
								}),
							],
							validation: (rule) => rule.required().error(validation.logoRequired),
						}),
						defineField({
							name: "url",
							title: fields.websiteUrl,
							type: "url",
							description: descriptions.websiteUrlDescription,
							validation: (rule) =>
								rule.uri({ allowRelative: false }).error(validation.validUrlRequired),
						}),
					],
					preview: {
						select: {
							title: "name",
							media: "logo",
						},
					},
				}),
			],
		}),
	],
	preview: {
		select: {
			title: "heading",
			variant: "variant",
		},
		prepare({ title, variant }) {
			const selectedVariant = sanityOptions.casesSectionVariants.find((v) => v.value === variant);
			const variantTitle = selectedVariant ? selectedVariant.title : variant;
			return {
				title: title || descriptions.defaultCasesSection,
				subtitle: variantTitle || "logoCarousel",
				media: CaseIcon,
			};
		},
	},
});

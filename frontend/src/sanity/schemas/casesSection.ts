import { CaseIcon, InfoOutlineIcon, ComponentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const casesGroups = [
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
		name: "cases",
		title: "Cases",
		icon: CaseIcon,
	},
];

export const casesSection = defineType({
	name: "casesSection",
	title: "Cases Section",
	type: "object",
	icon: CaseIcon,
	groups: casesGroups,
	fields: [
		defineField({
			name: "variant",
			type: "string",
			title: "Variant",
			group: "appearance",
			options: {
				list: [
					{ title: "Logo Carousel", value: "logoCarousel" },
					{ title: "Compact Slider", value: "compactSlider" },
				],
			},
			initialValue: "logoCarousel",
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
			name: "cases",
			type: "array",
			title: "Case Studies/Logos",
			description: "Add logos or case studies to display in this section",
			group: "cases",
			of: [
				{
					type: "object",
					name: "case",
					fields: [
						{
							name: "name",
							type: "string",
							title: "Name",
						},
						{
							name: "logo",
							type: "image",
							title: "Logo",
							options: {
								hotspot: true,
							},
							fields: [
								{
									name: "alt",
									type: "string",
									title: "Alternative Text",
								},
							],
						},
						{
							name: "url",
							type: "url",
							title: "Website URL",
							description: "Optional link to the company's website",
						},
					],
					preview: {
						select: {
							title: "name",
							media: "logo",
						},
					},
				},
			],
		}),
	],
	preview: {
		select: {
			title: "heading",
			subtitle: "variant",
			casesCount: "cases.length",
		},
		prepare({ title, subtitle, casesCount = 0 }) {
			return {
				title: title || "Cases Section",
				subtitle: `${subtitle || "logoCarousel"} · ${casesCount} item${casesCount === 1 ? "" : "s"}`,
				media: CaseIcon,
			};
		},
	},
});

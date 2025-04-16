import {
	SparklesIcon,
	InfoOutlineIcon,
	ImageIcon,
	ComponentIcon,
} from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const featureGroups = [
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
		name: "media",
		title: "Media",
		icon: ImageIcon,
	},
	{
		name: "features",
		title: "Features",
		icon: SparklesIcon,
	},
];

export const featureSection = defineType({
	name: "featureSection",
	title: "Feature Section",
	type: "object",
	icon: SparklesIcon,
	groups: featureGroups,
	fields: [
		defineField({
			name: "variant",
			type: "string",
			title: "Layout Variant",
			group: "appearance",
			options: {
				list: [
					{ title: "Default", value: "default" },
					{ title: "With Image", value: "withImage" },
					{ title: "Left Image", value: "leftImage" },
					{ title: "Right Image", value: "rightImage" },
					{ title: "Image Cards", value: "imageCards" },
					{ title: "Masonry Grid", value: "masonryGrid" },
					{ title: "Big Masonry Grid", value: "bigMasonryGrid" },
					{ title: "Carousel Feature", value: "carouselFeature" },
					{ title: "Sliding Comparison", value: "slidingComparison" },
				],
			},
			initialValue: "default",
		}),
		defineField({
			name: "badgeText",
			type: "string",
			title: "Badge Text",
			description: "Optional text to display in the badge (e.g. 'Platform')",
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
			name: "image",
			type: "image",
			title: "Image",
			description:
				"Image to display in the feature section (for 'With Image' variant)",
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
			hidden: ({ parent }) =>
				parent?.variant !== "withImage" &&
				parent?.variant !== "slidingComparison",
			group: "media",
		}),
		defineField({
			name: "comparisonImage",
			type: "image",
			title: "Comparison Image",
			description:
				"Second image used for the sliding comparison variant (usually dark mode version)",
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
			hidden: ({ parent }) => parent?.variant !== "slidingComparison",
			group: "media",
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
							title: "Feature Title",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "description",
							type: "text",
							title: "Feature Description",
							rows: 2,
						}),
						defineField({
							name: "icon",
							type: "string",
							title: "Icon",
							description:
								"Icon to display for this feature (used in Masonry Grid variant)",
							options: {
								list: [
									{ title: "User", value: "user" },
									{ title: "Settings", value: "settings" },
									{ title: "Lock", value: "lock" },
									{ title: "Star", value: "star" },
									{ title: "Heart", value: "heart" },
									{ title: "Chart", value: "barChart" },
									{ title: "Dollar", value: "dollar" },
									{ title: "Calendar", value: "calendar" },
									{ title: "Clock", value: "clock" },
									{ title: "Mail", value: "mail" },
								],
							},
							hidden: ({ document }) => document?.variant !== "masonryGrid",
						}),
						defineField({
							name: "highlighted",
							type: "boolean",
							title: "Highlighted (Wide Card)",
							description:
								"When enabled, this feature card will span 2 columns in masonry grid layout",
							initialValue: false,
							hidden: ({ document }) => document?.variant !== "masonryGrid",
						}),
						defineField({
							name: "image",
							type: "image",
							title: "Feature Image",
							description:
								"Image for this feature (required for Image Cards variant)",
							options: {
								hotspot: true,
							},
							fields: [
								{
									name: "alt",
									type: "string",
									title: "Alternative Text",
									hidden: false,
								},
							],
						}),
					],
					preview: {
						select: {
							title: "title",
							subtitle: "description",
							media: "image",
						},
						prepare({ title, subtitle, media }) {
							return {
								title: title || "Feature",
								subtitle: subtitle || "No description",
								media: media || SparklesIcon,
							};
						},
					},
				},
			],
			validation: (rule) => rule.min(1).error("Add at least one feature"),
		}),
	],
	preview: {
		select: {
			title: "heading",
			subtitle: "variant",
			featuresCount: "features.length",
		},
		prepare({ title, subtitle, featuresCount = 0 }) {
			return {
				title: title || "Feature Section",
				subtitle: `${subtitle} variant with ${featuresCount} feature${featuresCount === 1 ? "" : "s"}`,
				media: SparklesIcon,
			};
		},
	},
});

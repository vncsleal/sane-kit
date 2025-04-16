import { InfoOutlineIcon, BarChartIcon, ComponentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const statsGroups = [
	{
		name: "content",
		title: "Content",
		icon: InfoOutlineIcon,
		default: true,
	},
	{
		name: "layout",
		title: "Layout Options",
		icon: ComponentIcon,
	},
	{
		name: "stats",
		title: "Statistics",
		icon: BarChartIcon,
	},
];

export const statsSection = defineType({
	name: "statsSection",
	title: "Stats Section",
	type: "object",
	icon: BarChartIcon,
	groups: statsGroups,
	fields: [
		defineField({
			name: "variant",
			type: "string",
			title: "Layout Variant",
			group: "layout",
			options: {
				list: [
					{ title: "Stats Grid", value: "grid" },
					{ title: "Stats with Content", value: "withContent" },
				],
			},
			initialValue: "grid",
		}),
		defineField({
			name: "badgeText",
			type: "string",
			title: "Badge Text",
			description: "Text to display in the badge (used in With Content layout)",
			hidden: ({ parent }) => parent?.variant !== "withContent",
			group: "content",
		}),
		defineField({
			name: "contentHeading",
			type: "string",
			title: "Content Heading",
			description:
				"Main heading for content section (used in With Content layout)",
			hidden: ({ parent }) => parent?.variant !== "withContent",
			group: "content",
		}),
		defineField({
			name: "contentText",
			type: "text",
			title: "Content Text",
			description:
				"Descriptive text for content section (used in With Content layout)",
			rows: 4,
			hidden: ({ parent }) => parent?.variant !== "withContent",
			group: "content",
		}),
		defineField({
			name: "heading",
			type: "string",
			title: "Section Heading",
			description:
				"Optional heading above the stats (used in Stats Grid layout)",
			hidden: ({ parent }) => parent?.variant !== "grid",
			group: "content",
		}),
		defineField({
			name: "subheading",
			type: "text",
			title: "Section Subheading",
			description:
				"Optional subheading above the stats (used in Stats Grid layout)",
			rows: 2,
			hidden: ({ parent }) => parent?.variant !== "grid",
			group: "content",
		}),
		defineField({
			name: "stats",
			type: "array",
			title: "Stats",
			description: "Add stat cards to display metrics",
			group: "stats",
			of: [
				{
					type: "object",
					name: "stat",
					fields: [
						{
							name: "value",
							type: "string",
							title: "Value",
							description: "The primary statistic (e.g., '500.000', '$1052')",
							validation: (rule) => rule.required(),
						},
						{
							name: "label",
							type: "string",
							title: "Label",
							description: "Description of what the statistic represents",
							validation: (rule) => rule.required(),
						},
						{
							name: "trendDirection",
							type: "string",
							title: "Trend Direction",
							options: {
								list: [
									{ title: "Up", value: "up" },
									{ title: "Down", value: "down" },
									{ title: "None", value: "none" },
								],
								layout: "radio",
							},
							initialValue: "none",
						},
						{
							name: "trendValue",
							type: "string",
							title: "Trend Value",
							description: "Percentage change (e.g., '+20.1%', '-2%')",
						},
						{
							name: "color",
							type: "string",
							title: "Icon Color",
							options: {
								list: [
									{ title: "Primary", value: "primary" },
									{ title: "Success", value: "success" },
									{ title: "Warning", value: "warning" },
									{ title: "Destructive", value: "destructive" },
									{ title: "Muted", value: "muted" },
								],
							},
							initialValue: "primary",
						},
					],
					preview: {
						select: {
							value: "value",
							label: "label",
							trend: "trendValue",
						},
						prepare({ value, label, trend }) {
							return {
								title: value || "Stat",
								subtitle: `${label || ""}${trend ? ` (${trend})` : ""}`,
							};
						},
					},
				},
			],
			validation: (rule) => rule.min(1).error("Add at least one stat"),
		}),
	],
	preview: {
		select: {
			title: "heading",
			statsCount: "stats.length",
			variant: "variant",
		},
		prepare({ title, statsCount = 0, variant }) {
			return {
				title: title || "Stats Section",
				subtitle: `${variant || "grid"} - ${statsCount} stat${statsCount === 1 ? "" : "s"}`,
				media: BarChartIcon,
			};
		},
	},
});

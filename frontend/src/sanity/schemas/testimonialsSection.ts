import {
	StarIcon,
	InfoOutlineIcon,
	UsersIcon,
	ComponentIcon,
} from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const testimonialGroups = [
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
		name: "quotes",
		title: "Testimonials",
		icon: UsersIcon,
	},
];

export const testimonialsSection = defineType({
	name: "testimonialsSection",
	title: "Testimonials Section",
	type: "object",
	icon: StarIcon,
	groups: testimonialGroups,
	fields: [
		defineField({
			name: "variant",
			type: "string",
			title: "Variant",
			group: "appearance",
			options: {
				list: [
					{ title: "Carousel", value: "carousel" },
					{ title: "Grid", value: "grid" },
					{ title: "Masonry Grid", value: "masonry-grid" },
				],
			},
			initialValue: "carousel",
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
			name: "testimonials",
			type: "array",
			title: "Testimonials",
			group: "quotes",
			of: [
				{
					type: "object",
					name: "testimonial",
					fields: [
						{
							name: "title",
							type: "string",
							title: "Title",
							validation: (rule) => rule.required(),
						},
						{
							name: "content",
							type: "text",
							title: "Content",
							rows: 3,
							validation: (rule) => rule.required(),
						},
						{
							name: "author",
							type: "string",
							title: "Author Name",
							validation: (rule) => rule.required(),
						},
						{
							name: "role",
							type: "string",
							title: "Author Role/Company",
						},
						{
							name: "avatar",
							type: "image",
							title: "Author Avatar",
							options: {
								hotspot: true,
							},
						},
					],
					preview: {
						select: {
							title: "title",
							subtitle: "author",
							media: "avatar",
						},
					},
				},
			],
			validation: (rule) => rule.min(1).error("Add at least one testimonial"),
		}),
	],
	preview: {
		select: {
			title: "heading",
			testimonialCount: "testimonials.length",
		},
		prepare({ title, testimonialCount = 0 }) {
			return {
				title: title || "Testimonials Section",
				subtitle: `${testimonialCount} testimonial${testimonialCount === 1 ? "" : "s"}`,
				media: StarIcon,
			};
		},
	},
});

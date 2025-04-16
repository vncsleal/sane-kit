import {
	MenuIcon,
	InfoOutlineIcon,
	ComponentIcon,
	LinkIcon,
} from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const headerGroups = [
	{
		name: "basic",
		title: "Basic Information",
		icon: InfoOutlineIcon,
		default: true,
	},
	{
		name: "appearance",
		title: "Appearance",
		icon: ComponentIcon,
	},
	{
		name: "navigation",
		title: "Navigation",
		icon: MenuIcon,
	},
	{
		name: "actions",
		title: "Actions",
		icon: LinkIcon,
	},
];

export const header = defineType({
	name: "header",
	title: "Header",
	type: "document",
	icon: MenuIcon,
	groups: headerGroups,
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Site Name",
			description: "The name displayed in the header",
			validation: (rule) => rule.required(),
			group: "basic",
		}),
		defineField({
			name: "variant",
			type: "string",
			title: "Layout Variant",
			description: "Select the header layout style",
			options: {
				list: [
					{ title: "Default", value: "default" },
					{ title: "Centered", value: "centered" },
					{ title: "Minimal", value: "minimal" },
					{ title: "Transparent", value: "transparent" },
				],
			},
			initialValue: "default",
			group: "appearance",
		}),
		defineField({
			name: "navigationItems",
			type: "array",
			title: "Navigation Items",
			group: "navigation",
			of: [
				{
					type: "object",
					name: "navigationItem",
					fields: [
						defineField({
							name: "title",
							type: "string",
							title: "Title",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "href",
							type: "string",
							title: "Link",
							description: "Leave blank for dropdown menus",
						}),
						defineField({
							name: "description",
							type: "text",
							title: "Description",
							description: "Shown in dropdown menus",
						}),
						defineField({
							name: "items",
							type: "array",
							title: "Dropdown Items",
							description: "Items to show in dropdown menu",
							of: [
								{
									type: "object",
									name: "subItem",
									fields: [
										defineField({
											name: "title",
											type: "string",
											title: "Title",
											validation: (rule) => rule.required(),
										}),
										defineField({
											name: "href",
											type: "string",
											title: "Link",
											validation: (rule) => rule.required(),
										}),
									],
								},
							],
						}),
					],
					preview: {
						select: {
							title: "title",
							href: "href",
							itemCount: "items.length",
						},
						prepare({ title, href, itemCount = 0 }) {
							const isDropdown = itemCount > 0;
							return {
								title: title || "Navigation Item",
								subtitle: isDropdown
									? `Dropdown with ${itemCount} item${itemCount === 1 ? "" : "s"}`
									: `Link to ${href}`,
							};
						},
					},
				},
			],
		}),
		defineField({
			name: "ctaButtons",
			type: "array",
			title: "CTA Buttons",
			description: "Buttons displayed in the header",
			group: "actions",
			of: [
				{
					type: "object",
					name: "button",
					fields: [
						defineField({
							name: "label",
							type: "string",
							title: "Button Label",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "url",
							type: "string",
							title: "Button URL",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "variant",
							type: "string",
							title: "Button Style",
							options: {
								list: [
									{ title: "Default", value: "default" },
									{ title: "Outline", value: "outline" },
									{ title: "Secondary", value: "secondary" },
									{ title: "Ghost", value: "ghost" },
									{ title: "Link", value: "link" },
								],
							},
							initialValue: "default",
						}),
					],
				},
			],
		}),
		defineField({
			name: "dropdownCTALabel",
			type: "string",
			title: "Dropdown CTA Button Label",
			description:
				"Label for the call-to-action button shown in dropdown menus",
			initialValue: "Book a call today",
			group: "actions",
		}),
		defineField({
			name: "dropdownCTAUrl",
			type: "string",
			title: "Dropdown CTA Button URL",
			description: "URL for the call-to-action button shown in dropdown menus",
			initialValue: "/contact",
			group: "actions",
		}),
	],
	preview: {
		select: {
			title: "title",
			itemCount: "navigationItems.length",
		},
		prepare({ title, itemCount = 0 }) {
			return {
				title: title || "Website Header",
				subtitle: `${itemCount} navigation item${itemCount === 1 ? "" : "s"}`,
				media: MenuIcon,
			};
		},
	},
});

import { UserIcon, InfoOutlineIcon, BookIcon, LinkIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const authorGroups = [
	{
		name: "identity",
		title: "Identity",
		icon: InfoOutlineIcon,
		default: true,
	},
	{
		name: "biography",
		title: "Biography",
		icon: BookIcon,
	},
	{
		name: "contact",
		title: "Contact & Social",
		icon: LinkIcon,
	},
];

export const author = defineType({
	name: "author",
	title: "Author",
	type: "document",
	icon: UserIcon, // Add icon to the schema type
	groups: authorGroups, // Add defined groups
	fields: [
		defineField({
			name: "name",
			type: "string",
			title: "Name",
			validation: (rule) => rule.required(),
			group: "identity", // Assign field to group
		}),
		defineField({
			name: "slug",
			type: "slug",
			title: "Slug",
			options: {
				source: "name",
				maxLength: 96,
			},
			validation: (rule) => rule.required(),
			group: "identity", // Assign field to group
		}),
		defineField({
			name: "avatar",
			type: "image",
			title: "Avatar",
			options: {
				hotspot: true,
			},
			group: "identity", // Assign field to group
		}),
		defineField({
			name: "role",
			type: "string",
			title: "Role",
			description: "Job title or role in the organization",
			group: "identity", // Assign field to group
		}),
		defineField({
			name: "bio",
			type: "text",
			title: "Bio",
			description: "Short biography for previews and cards",
			rows: 3,
			group: "biography", // Assign field to group
		}),
		defineField({
			name: "fullBio",
			type: "array",
			title: "Full Bio",
			description: "Longer biography for author page",
			of: [{ type: "block" }],
			group: "biography", // Assign field to group
		}),
		defineField({
			name: "featuredImage",
			type: "image",
			title: "Featured Image",
			description: "Larger image used on author page",
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
			group: "biography", // Assign field to group
		}),
		defineField({
			name: "socialLinks",
			type: "array",
			title: "Social Media Links",
			group: "contact", // Assign field to group
			of: [
				{
					type: "object",
					name: "socialLink",
					fields: [
						defineField({
							name: "platform",
							type: "string",
							title: "Platform",
							options: {
								list: [
									{ title: "Twitter", value: "twitter" },
									{ title: "LinkedIn", value: "linkedin" },
									{ title: "GitHub", value: "github" },
									{ title: "Instagram", value: "instagram" },
									{ title: "Personal Website", value: "website" },
									{ title: "YouTube", value: "youtube" },
								],
							},
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "url",
							type: "url",
							title: "URL",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "username",
							type: "string",
							title: "Username",
							description: "Display name or username (without '@')",
						}),
					],
				},
			],
		}),
		defineField({
			name: "email",
			type: "string",
			title: "Email",
			validation: (rule) => rule.email(),
			group: "contact", // Assign field to group
		}),
	],
	preview: {
		select: {
			title: "name",
			subtitle: "role",
			media: "avatar",
		},
	},
});

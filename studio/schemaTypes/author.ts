import { UserIcon, InfoOutlineIcon, BookIcon, LinkIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { isUniqueOtherThanLanguage } from "../utils/isUniqueOtherThanLanguage";
import { fields, groups, documents, descriptions, validation, sanityOptions } from "../dictionary";

// Define field groups
const authorGroups = [
	{
		name: "identity",
		title: groups.identity,
		icon: InfoOutlineIcon,
		default: true,
	},
	{
		name: "biography",
		title: groups.biography,
		icon: BookIcon,
	},
	{
		name: "contact",
		title: groups.contact,
		icon: LinkIcon,
	},
];

export const author = defineType({
	name: "author",
	title: documents.author,
	type: "document",
	icon: UserIcon, 
	groups: authorGroups, 
	fields: [
		defineField({
			name: 'language',
			type: 'string',
			hidden: true,
			readOnly: true,
		}),
		defineField({
			name: "name",
			title: fields.name,
			type: "string",
			validation: (rule) => rule.required().error(validation.nameRequired),
			group: "identity", 
		}),
		defineField({
			name: "slug",
			title: fields.slug,
			type: "slug",
			options: {
				source: "name",
				maxLength: 96,
				isUnique: isUniqueOtherThanLanguage,
			},
			group: "identity", 
		}),
		defineField({
			name: "avatar",
			title: fields.avatar,
			type: "image",
			options: {
				hotspot: true,
			},
			group: "identity", 
		}),
		defineField({
			name: "role",
			title: fields.role,
			type: "string",
			description: descriptions.role,
			group: "identity", 
		}),
		defineField({
			name: "bio",
			title: fields.bio,
			type: "text",
			description: descriptions.bio,
			rows: 3,
			group: "biography", 
		}),
		defineField({
			name: "fullBio",
			title: fields.fullBio,
			type: "array",
			description: descriptions.fullBio,
			of: [{ type: "block" }],
			group: "biography", 
		}),
		defineField({
			name: "featuredImage",
			title: fields.featuredImage,
			type: "image",
			description: descriptions.featuredImage,
			options: {
				hotspot: true,
			},
			fields: [
				{
					name: "alt",
					title: fields.alt,
					type: "string",
				},
			],
			group: "biography", 
		}),
		defineField({
			name: "socialLinks",
			title: fields.socialLinks,
			type: "array",
			group: "contact", 
			of: [
				{
					type: "object",
					name: "socialLink",
					fields: [
						defineField({
							name: "platform",
							title: fields.platform,
							type: "string",
							options: {
								list: sanityOptions.socialPlatforms,
							},
							validation: (rule) => rule.required().error(validation.platformRequired),
						}),
						defineField({
							name: "url",
							title: fields.url,
							type: "url",
							validation: (rule) =>
								rule.required().error(validation.urlRequired),
						}),
						defineField({
							name: "username",
							title: fields.username,
							type: "string",
							description: descriptions.username,
						}),
					],
				},
			],
		}),
		defineField({
			name: "email",
			title: fields.email,
			type: "string",
			validation: (rule) => rule.email().error(validation.emailInvalid),
			group: "contact", 
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

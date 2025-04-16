import { DocumentTextIcon } from "@sanity/icons";
import { defineType, defineArrayMember } from "sanity";

export const portableText = defineType({
	name: "portableText",
	title: "Content",
	type: "array",
	icon: DocumentTextIcon,
	of: [
		defineArrayMember({
			type: "block",
			title: "Block",
			styles: [
				{ title: "Normal", value: "normal" },
				{ title: "H1", value: "h1" },
				{ title: "H2", value: "h2" },
				{ title: "H3", value: "h3" },
				{ title: "H4", value: "h4" },
				{ title: "Quote", value: "blockquote" },
			],
			lists: [
				{ title: "Bullet", value: "bullet" },
				{ title: "Number", value: "number" },
			],
			marks: {
				decorators: [
					{ title: "Strong", value: "strong" },
					{ title: "Emphasis", value: "em" },
					{ title: "Code", value: "code" },
					{ title: "Underline", value: "underline" },
					{ title: "Strike", value: "strike-through" },
				],
				annotations: [
					{
						name: "link",
						type: "object",
						title: "Link",
						fields: [
							{
								name: "href",
								type: "string",
								title: "URL",
								validation: (rule) => rule.required(),
							},
							{
								name: "blank",
								title: "Open in new tab",
								type: "boolean",
								initialValue: true,
							},
						],
					},
				],
			},
		}),
		// Add code block to the portable text array
		defineArrayMember({
			type: "codeBlock",
			title: "Code Block",
		}),
		defineArrayMember({
			type: "image",
			fields: [
				{
					name: "alt",
					type: "string",
					title: "Alternative Text",
				},
				{
					name: "i18n_alt",
					type: "internationalizedArrayString",
					title: "Alternative Text (Translated)",
				},
				{
					name: "caption",
					type: "string",
					title: "Caption",
				},
				{
					name: "i18n_caption",
					type: "internationalizedArrayString",
					title: "Caption (Translated)",
				},
			],
			options: {
				hotspot: true,
			},
		}),
	],
	// Remove the preview property as it's not supported for array type
});

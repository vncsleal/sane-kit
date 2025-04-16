import { CodeIcon, TranslateIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const codeBlockGroups = [
	{
		name: "content",
		title: "Content",
		default: true,
	},
	{
		name: "options",
		title: "Options",
	},
	{
		name: "translations",
		title: "Translations",
		icon: TranslateIcon,
	},
];

export const codeBlock = defineType({
	name: "codeBlock",
	title: "Code Block",
	type: "object",
	icon: CodeIcon,
	groups: codeBlockGroups,
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			description: "Optional title for this code snippet",
			group: "content",
		}),
		defineField({
			name: "i18n_title",
			title: "Title (Translated)",
			type: "internationalizedArrayString",
			description: "Optional translated title for this code snippet",
		}),
		defineField({
			name: "language",
			title: "Language",
			type: "string",
			options: {
				list: [
					{ title: "JavaScript", value: "javascript" },
					{ title: "TypeScript", value: "typescript" },
					{ title: "HTML", value: "html" },
					{ title: "CSS", value: "css" },
					{ title: "SCSS", value: "scss" },
					{ title: "JSX", value: "jsx" },
					{ title: "TSX", value: "tsx" },
					{ title: "Shell", value: "shell" },
					{ title: "Markdown", value: "markdown" },
					{ title: "JSON", value: "json" },
					{ title: "Python", value: "python" },
					{ title: "Ruby", value: "ruby" },
					{ title: "PHP", value: "php" },
					{ title: "Go", value: "go" },
					{ title: "Java", value: "java" },
					{ title: "C", value: "c" },
					{ title: "C++", value: "cpp" },
					{ title: "C#", value: "csharp" },
					{ title: "Plain Text", value: "text" },
				],
			},
			validation: (rule) => rule.required(),
			group: "content",
		}),
		defineField({
			name: "code",
			title: "Code",
			type: "text",
			rows: 10,
			validation: (rule) => rule.required(),
			group: "content",
		}),
		defineField({
			name: "i18n_code",
			title: "Code (Translated)",
			type: "array",

			of: [
				{
					type: "object",
					name: "localizedCode",
					fields: [
						{
							name: "language",
							type: "string",
							title: "Language",
							options: {
								list: [{ title: "Brazilian Portuguese", value: "pt_BR" }],
							},
						},
						{
							name: "content",
							type: "text",
							title: "Code",
							rows: 10,
						},
					],
					preview: {
						select: {
							language: "language",
						},
						prepare({ language }) {
							return {
								title: `Code in ${language === "pt_BR" ? "Brazilian Portuguese" : language}`,
							};
						},
					},
				},
			],
		}),
		defineField({
			name: "highlightLines",
			title: "Highlight Lines",
			type: "string",
			description:
				"Comma-separated list of line numbers or ranges (e.g. 1,3,5-8)",
			group: "options",
		}),
		defineField({
			name: "showLineNumbers",
			title: "Show Line Numbers",
			type: "boolean",
			initialValue: true,
			group: "options",
		}),
		defineField({
			name: "caption",
			title: "Caption",
			type: "string",
			description: "Optional caption text to display below the code block",
			group: "content",
		}),
		defineField({
			name: "i18n_caption",
			title: "Caption (Translated)",
			type: "internationalizedArrayString",
			description:
				"Optional translated caption text to display below the code block",
		}),
	],
	preview: {
		select: {
			title: "title",
			language: "language",
			code: "code",
		},
		prepare({ title, language, code }) {
			const shortCode = code
				? code.length > 50
					? `${code.slice(0, 50)}...`
					: code
				: "";
			return {
				title: title || "Code Block",
				subtitle: `${language || "text"}: ${shortCode}`,
				media: CodeIcon,
			};
		},
	},
});

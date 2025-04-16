import { CodeIcon, InfoOutlineIcon, CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define field groups
const codeGroups = [
	{
		name: "content",
		title: "Content",
		icon: InfoOutlineIcon,
		default: true,
	},
	{
		name: "settings",
		title: "Settings",
		icon: CogIcon,
	},
];

export const codeBlock = defineType({
	name: "codeBlock",
	title: "Code Block",
	type: "object",
	icon: CodeIcon,
	groups: codeGroups,
	fields: [
		defineField({
			name: "code",
			title: "Code",
			type: "text",
			rows: 10,
			validation: (rule) => rule.required(),
			group: "content",
		}),
		defineField({
			name: "language",
			title: "Language",
			type: "string",
			options: {
				list: [
					{ title: "TypeScript", value: "typescript" },
					{ title: "JavaScript", value: "javascript" },
					{ title: "HTML", value: "html" },
					{ title: "CSS", value: "css" },
					{ title: "SCSS", value: "scss" },
					{ title: "JSX", value: "jsx" },
					{ title: "TSX", value: "tsx" },
					{ title: "JSON", value: "json" },
					{ title: "Bash", value: "bash" },
					{ title: "Shell", value: "shell" },
					{ title: "Python", value: "python" },
					{ title: "Java", value: "java" },
					{ title: "C#", value: "csharp" },
					{ title: "PHP", value: "php" },
					{ title: "Ruby", value: "ruby" },
					{ title: "Go", value: "go" },
					{ title: "Rust", value: "rust" },
					{ title: "Swift", value: "swift" },
					{ title: "Kotlin", value: "kotlin" },
					{ title: "SQL", value: "sql" },
				],
			},
			initialValue: "typescript",
			validation: (rule) => rule.required(),
			group: "settings",
		}),
		defineField({
			name: "filename",
			title: "Filename (optional)",
			type: "string",
			description: "Optional filename to display above the code block",
			group: "settings",
		}),
		defineField({
			name: "showLineNumbers",
			title: "Show Line Numbers",
			type: "boolean",
			initialValue: true,
			group: "settings",
		}),
	],
	preview: {
		select: {
			language: "language",
			code: "code",
			filename: "filename",
		},
		prepare({ language, code, filename }) {
			return {
				title: `Code: ${language || "unknown"}${filename ? ` (${filename})` : ""}`,
				subtitle: code
					? `${code.substring(0, 50)}${code.length > 50 ? "..." : ""}`
					: "No code",
				media: CodeIcon,
			};
		},
	},
});

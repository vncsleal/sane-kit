import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { internationalizedArray } from "sanity-plugin-internationalized-array";
import { codeInput } from "@sanity/code-input";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "your-project-id";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig({
	name: "default",
	title: "Studio",
	projectId,
	dataset,
	plugins: [
		structureTool(),
		visionTool(),
		codeInput(),
		internationalizedArray({
			languages: [
				{ id: "en", title: "English" },
				{ id: "pt_BR", title: "Brazilian Portuguese" },
			],
			defaultLanguages: ["en"],
			fieldTypes: ["string", "text"],
		}),
	],
	schema: {
		types: schemaTypes,
	},
});

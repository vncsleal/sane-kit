import { defineConfig } from "sanity"; 
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { codeInput } from "@sanity/code-input";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import { structure } from './structure';
import Logo from "./components/Logo";
import { ptBRLocale } from "@sanity/locale-pt-br";
import { documentInternationalization } from '@sanity/document-internationalization';
import { studioConfig } from './config';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "your-project-id";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig({ 
	icon: Logo,
	name: "default",
	title: "Sane Kit Studio",
	projectId,
	dataset,
	plugins: [
		structureTool({ structure }),
		visionTool(),
		codeInput(),
		unsplashImageAsset(),
		documentInternationalization({
			supportedLanguages: [
				{ id: 'pt-BR', title: 'Português (Brasil)' },
				{ id: 'en', title: 'English' }
			],
			schemaTypes: ['page', 'blogPost', 'author', 'category','blogPage', 'header', 'footer','compareFeature', 'featureSection', 'heroSection', 'casesSection', 'testimonialsSection', 'pricingSection', 'compareFeaturesSection', 'statsSection', 'ctaSection', 'faqSection', 'contactSection', 'newsletterSection'],
		}),
		// Conditionally apply Portuguese locale based on config
		...(studioConfig.language === 'pt-BR' ? [ptBRLocale()] : []),
	],
	schema: {
		types: schemaTypes,
	},
});

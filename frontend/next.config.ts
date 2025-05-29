import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.sanity.io",
				pathname: "/images/**",
			},
		],
	},
	// Remove built-in i18n support as it's replaced by App Router filesystem routing
	// i18n: {
	// 	locales: ["pt-BR", "en"],
	// 	defaultLocale: "pt-BR",
	// },
	// This is required to support PostHog trailing slash API requests
	skipTrailingSlashRedirect: true,
	// Add PostHog rewrites
	async rewrites() {
		return [
			{
				source: "/ingest/static/:path*",
				destination: "https://us-assets.i.posthog.com/static/:path*",
			},
			{
				source: "/ingest/:path*",
				destination: "https://us.i.posthog.com/:path*",
			},
			{
				source: "/ingest/decide",
				destination: "https://us.i.posthog.com/decide",
			},
		];
	},
};

export default nextConfig;

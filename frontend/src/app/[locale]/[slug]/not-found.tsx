"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NotFound from "@/components/global/NotFound";
import { getDictionary } from "@/i18n/getDictionary";
import { i18n, type Locale } from "@/i18n/i18n-config";
import type { Dictionary } from "@/i18n/getDictionary";

export default function SlugNotFound() {
	const pathname = usePathname();
	const [dictionary, setDictionary] = useState<Dictionary | null>(null);
	
	// Extract locale from pathname
	const pathSegments = pathname.split('/').filter(Boolean);
	const potentialLocale = pathSegments[0] as Locale;
	const locale = i18n.locales.includes(potentialLocale) ? potentialLocale : i18n.defaultLocale;

	useEffect(() => {
		getDictionary(locale).then(setDictionary);
	}, [locale]);

	if (!dictionary) {
		return (
			<div className="container mx-auto px-4 md:px-6 py-24 flex flex-col items-center justify-center text-center min-h-[calc(100vh-10rem)]">
				<div className="animate-pulse">Loading...</div>
			</div>
		);
	}

	const { pageTitle, pageMessage, backToHome } = dictionary.notFound;

	return (
		<NotFound
			title={pageTitle}
			message={pageMessage}
			linkHref="/"
			linkText={backToHome}
			dictionary={dictionary}
		/>
	);
}

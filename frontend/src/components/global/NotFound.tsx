"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { i18n, type Locale } from "@/i18n/i18n-config";
import type { Dictionary } from "@/i18n/getDictionary";

interface NotFoundProps {
	title?: string;
	message?: string;
	linkHref?: string;
	linkText?: string;
	dictionary: Dictionary;
}

export default function NotFound({
	title,
	message,
	linkHref,
	linkText,
	dictionary,
}: NotFoundProps) {
	const pathname = usePathname();
	
	// Extract locale from pathname
	const pathSegments = pathname.split('/').filter(Boolean);
	const potentialLocale = pathSegments[0] as Locale;
	const locale = i18n.locales.includes(potentialLocale) ? potentialLocale : i18n.defaultLocale;
	
	const localizedHref = linkHref ? `/${locale}${linkHref.startsWith('/') ? linkHref : `/${linkHref}`}` : `/${locale}`;
	
	return (
		<div className="container mx-auto px-4 md:px-6 py-24 flex flex-col items-center justify-center text-center min-h-[calc(100vh-10rem)]">
			<h1 className="text-4xl font-bold tracking-tight mb-4">
				{title || dictionary.notFound.pageTitle}
			</h1>
			<p className="text-xl text-muted-foreground mb-8">
				{message || dictionary.notFound.pageMessage}
			</p>
			<Button asChild>
				<Link href={localizedHref}>
					{linkText || dictionary.notFound.backToHome}
				</Link>
			</Button>
		</div>
	);
}

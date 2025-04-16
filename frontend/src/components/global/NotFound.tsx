"use client"; // Make this a client component to use the hook

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context"; // Import useLanguage

interface NotFoundProps {
	title: string;
	i18n_title?: Record<string, string>; // Add i18n prop
	message: string;
	i18n_message?: Record<string, string>; // Add i18n prop
	linkHref: string;
	linkText: string;
	i18n_linkText?: Record<string, string>; // Add i18n prop
}

export default function NotFound({
	title,
	i18n_title,
	message,
	i18n_message,
	linkHref,
	linkText,
	i18n_linkText,
}: NotFoundProps) {
	const { getLocalizedValue } = useLanguage(); // Use the hook

	// Localize texts
	const localizedTitle = getLocalizedValue(i18n_title, title);
	const localizedMessage = getLocalizedValue(i18n_message, message);
	const localizedLinkText = getLocalizedValue(i18n_linkText, linkText);

	return (
		<div className="container mx-auto px-4 md:px-6 py-24 flex flex-col items-center justify-center text-center min-h-[calc(100vh-10rem)]">
			<h1 className="text-4xl font-bold tracking-tight mb-4">
				{localizedTitle}
			</h1>
			<p className="text-xl text-muted-foreground mb-8">{localizedMessage}</p>
			<Button asChild>
				<Link href={linkHref}>{localizedLinkText}</Link>
			</Button>
		</div>
	);
}

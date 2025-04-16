"use client";

import Link from "next/link";
import type { SanityFooter } from "@/sanity/types/schema";
import { useLanguage } from "@/lib/language-context";
import LanguageSwitcher from "@/components/global/LanguageSwitcher";

type FooterProps = SanityFooter;

export default function Footer({
	title,
	i18n_title,
	description,
	i18n_description,
	address = [],
	legalLinks = [],
	navigationItems = [],
	variant = "simple",
}: FooterProps) {
	const { getLocalizedValue } = useLanguage();

	// Get localized site title
	const siteTitle = getLocalizedValue(i18n_title, title);

	// Get localized description
	const localizedDescription = getLocalizedValue(i18n_description, description);

	// For tiny variant (ultra-compact footer with light background)
	if (variant === "tiny") {
		return (
			<footer className="w-full py-6 bg-background border-t">
				<div className="container mx-auto ">
					<div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
						<p className="font-medium">{siteTitle}</p>

						{/* Legal links in a row */}
						{legalLinks.length > 0 && (
							<div className="flex gap-4 flex-wrap justify-center">
								{legalLinks.map((link) => (
									<Link
										key={link._key}
										href={link.url.startsWith("/") ? link.url : `/${link.url}`}
										className="text-muted-foreground hover:text-foreground transition-colors"
									>
										{getLocalizedValue(link.i18n_title, link.title)}
									</Link>
								))}
							</div>
						)}

						{/* Copyright and Language Switcher */}
						<div className="flex items-center gap-4">
							<p className="text-muted-foreground">
								© {new Date().getFullYear()}
							</p>
							<LanguageSwitcher variant="minimal" />
						</div>
					</div>
				</div>
			</footer>
		);
	}

	// For minimal variant (condensed footer with just essential info)
	if (variant === "minimal") {
		return (
			<footer className="w-full py-8 bg-foreground text-background">
				<div className="container mx-auto ">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<p className="font-semibold text-lg">{siteTitle}</p>

						{/* Legal links in a row */}
						{legalLinks.length > 0 && (
							<div className="flex gap-6">
								{legalLinks.map((link) => (
									<Link
										key={link._key}
										href={link.url.startsWith("/") ? link.url : `/${link.url}`}
										className="text-sm text-background/75 hover:text-background"
									>
										{getLocalizedValue(link.i18n_title, link.title)}
									</Link>
								))}
							</div>
						)}

						{/* Copyright */}
						<div className="flex items-center gap-4">
							<p className="text-sm text-background/60">
								© {new Date().getFullYear()} {siteTitle}
							</p>
							<LanguageSwitcher variant="footer" />
						</div>
					</div>
				</div>
			</footer>
		);
	}

	// Simple variant (default)
	return (
		<footer className="w-full pt-10 lg:pt-20 bg-foreground text-background">
			<div className="container mx-auto px-4 md:px-6">
				<div className="grid lg:grid-cols-2 gap-10 items-start">
					{/* Left Column - Branding and Info */}
					<div className="flex gap-8 flex-col items-start">
						<div className="flex gap-2 flex-col">
							<h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
								{siteTitle}
							</h2>
							{(description || i18n_description) && (
								<p className="text-lg max-w-lg leading-relaxed tracking-tight text-background/75 text-left">
									{localizedDescription}
								</p>
							)}
						</div>

						<div className="flex gap-10 md:gap-20 flex-col md:flex-row">
							{/* Address */}
							{address.length > 0 && (
								<div className="flex flex-col text-sm max-w-lg leading-relaxed tracking-tight text-background/75 text-left">
									{address.map((line) => (
										<p key={`address-${line}`}>{line}</p>
									))}
								</div>
							)}

							{/* Legal Links */}
							{legalLinks.length > 0 && (
								<div className="flex flex-col text-sm max-w-lg leading-relaxed tracking-tight text-background/75 text-left">
									{legalLinks.map((link) => (
										<Link
											key={link._key}
											href={
												link.url.startsWith("/") ? link.url : `/${link.url}`
											}
											className="hover:text-background"
										>
											{getLocalizedValue(link.i18n_title, link.title)}
										</Link>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Right Column - Navigation */}
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 items-start">
						{navigationItems.map((item) => (
							<div
								key={item._key}
								className="flex text-base gap-1 flex-col items-start"
							>
								<div className="flex flex-col gap-2">
									{item.href ? (
										<Link
											href={
												item.href.startsWith("/") ? item.href : `/${item.href}`
											}
											className="flex justify-between items-center hover:text-background/80"
										>
											<span className="text-xl">
												{getLocalizedValue(item.i18n_title, item.title)}
											</span>
										</Link>
									) : (
										<p className="text-xl">
											{getLocalizedValue(item.i18n_title, item.title)}
										</p>
									)}
									{item.items?.map((subItem) => (
										<Link
											key={subItem._key}
											href={
												subItem.href.startsWith("/")
													? subItem.href
													: `/${subItem.href}`
											}
											className="flex justify-between items-center hover:text-background/80"
										>
											<span className="text-background/75">
												{getLocalizedValue(subItem.i18n_title, subItem.title)}
											</span>
										</Link>
									))}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Copyright text with Language Switcher */}
				<div className="mt-16 py-8 border-t border-background/10">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<p className="text-sm text-background/60">
							© {new Date().getFullYear()} {siteTitle}. All rights reserved.
						</p>
						<div className="mt-4 md:mt-0">
							<LanguageSwitcher variant="footer" />
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

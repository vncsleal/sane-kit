"use client";

import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { SanityHeader } from "@/sanity/types/schema";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from "@/lib/language-context";
import { urlFor } from "@/sanity/client";

type HeaderProps = SanityHeader;

export default function Header({
	title,
	i18n_title,
	logo,
	navigationItems = [],
	ctaButtons = [],
	dropdownCTALabel,
	i18n_dropdownCTALabel,
	dropdownCTAUrl = "/contact",
	variant = "default",
}: HeaderProps) {
	const [scrolled, setScrolled] = useState(false);
	const { getLocalizedValue } = useLanguage();

	// Get localized site name
	const siteName = getLocalizedValue(i18n_title, title);
	// Get localized dropdown CTA label
	const localizedDropdownCTALabel = getLocalizedValue(
		i18n_dropdownCTALabel,
		dropdownCTALabel || "Book a call today",
	);
	// Get localized alt text for logo
	const logoAlt = getLocalizedValue(logo?.i18n_alt, logo?.alt) || siteName;

	useEffect(() => {
		if (variant !== "transparent") return;
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [variant]);

	const headerClasses = cn("w-full z-40 fixed top-0 left-0", {
		"bg-background":
			variant === "default" || variant === "minimal" || variant === "centered",
		"transition-all duration-300": variant === "transparent",
		"bg-background/80 backdrop-blur-md": variant === "transparent" && scrolled,
		"bg-transparent": variant === "transparent" && !scrolled,
	});

	// Logo or site name component to reuse
	const LogoOrSiteName = () => (
		<>
			{logo?.asset?._ref ? (
				<Image
					src={urlFor(logo.asset._ref).url()}
					alt={logoAlt || ""}
					width={140}
					height={40}
					className="object-contain max-h-10"
				/>
			) : (
				<p
					className={cn("font-semibold", {
						"text-white": variant === "transparent" && !scrolled,
					})}
				>
					{siteName}
				</p>
			)}
		</>
	);

	return (
		<header className={headerClasses}>
			<div
				className={cn(
					"container px-4 md:px-2 mx-auto min-h-20 flex items-center ",
					{
						"gap-4 flex-row lg:grid lg:grid-cols-3":
							variant === "centered" || variant === "transparent",
						"justify-between": variant === "default" || variant === "minimal",
					},
				)}
			>
				{/* LEFT COLUMN */}
				{variant === "centered" || variant === "transparent" ? (
					<div className="justify-start items-center gap-4 lg:flex hidden flex-row">
						<NavigationMenu className="flex justify-start items-start">
							<NavigationMenuList className="flex justify-start gap-4 flex-row">
								{navigationItems.map((item) => {
									const navTitle = getLocalizedValue(
										item.i18n_title,
										item.title,
									);
									return (
										<NavigationMenuItem key={item._key}>
											{item.href ? (
												<NavigationMenuLink asChild>
													<Button variant="ghost" asChild>
															<Link href={item.href}>
																{navTitle || item.title}
															</Link>
													</Button>
												</NavigationMenuLink>
											) : (
												<>
													<NavigationMenuTrigger className="font-medium text-sm">
														{navTitle || item.title}
													</NavigationMenuTrigger>
													<NavigationMenuContent className="!w-[450px] p-4">
														<div className="flex flex-col lg:grid grid-cols-2 gap-4">
															<div className="flex flex-col h-full justify-between">
																<div className="flex flex-col">
																	<p className="text-base">
																		{navTitle || item.title}
																	</p>
																	<p className="text-muted-foreground text-sm">
																		{getLocalizedValue(
																			item.i18n_description,
																			item.description,
																		)}
																	</p>
																</div>
																<Button size="sm" className="mt-10" asChild>
																		<Link href={dropdownCTAUrl}>
																			{localizedDropdownCTALabel}
																		</Link>
																</Button>
															</div>
															<div className="flex flex-col text-sm h-full justify-end">
																{item.items?.map((subItem) => (
																	<NavigationMenuLink
																		href={subItem.href}
																		key={subItem._key}
																		className="flex flex-row justify-between items-center hover:bg-muted py-2 px-4 rounded"
																	>
																		<span>
																			{getLocalizedValue(
																				subItem.i18n_title,
																				subItem.title,
																			)}
																		</span>
																		<MoveRight className="w-4 h-4 text-muted-foreground" />
																	</NavigationMenuLink>
																))}
															</div>
														</div>
													</NavigationMenuContent>
												</>
											)}
										</NavigationMenuItem>
									);
								})}
							</NavigationMenuList>
						</NavigationMenu>
					</div>
				) : (
					<div className="flex justify-start">
						<LogoOrSiteName />
					</div>
				)}

				{/* MIDDLE COLUMN */}
				{variant === "centered" || variant === "transparent" ? (
					<div className="flex lg:justify-center">
						<LogoOrSiteName />
					</div>
				) : (
					variant === "default" && (
						<div className="hidden lg:flex flex-1 justify-center">
							<NavigationMenu>
								<NavigationMenuList className="flex justify-center gap-4">
									{navigationItems.map((item) => (
										<NavigationMenuItem key={item._key}>
											{item.href ? (
												<NavigationMenuLink asChild>
													<Button variant="ghost" asChild>
															<Link href={item.href}>
																{getLocalizedValue(item.i18n_title, item.title)}
															</Link>
													</Button>
												</NavigationMenuLink>
											) : (
												<>
													<NavigationMenuTrigger className="font-medium text-sm">
														{getLocalizedValue(item.i18n_title, item.title)}
													</NavigationMenuTrigger>
													<NavigationMenuContent className="!w-[450px] p-4">
														<div className="flex flex-col lg:grid grid-cols-2 gap-4">
															<div className="flex flex-col h-full justify-between">
																<div className="flex flex-col">
																	<p className="text-base">
																		{getLocalizedValue(
																			item.i18n_title,
																			item.title,
																		)}
																	</p>
																	<p className="text-muted-foreground text-sm">
																		{getLocalizedValue(
																			item.i18n_description,
																			item.description,
																		)}
																	</p>
																</div>
																<Button size="sm" className="mt-10" asChild>
																		<Link href={dropdownCTAUrl}>
																			{localizedDropdownCTALabel}
																		</Link>
																</Button>
															</div>
															<div className="flex flex-col text-sm h-full justify-end">
																{item.items?.map((subItem) => (
																	<NavigationMenuLink
																		href={subItem.href}
																		key={subItem._key}
																		className="flex flex-row justify-between items-center hover:bg-muted py-2 px-4 rounded"
																	>
																		<span>
																			{getLocalizedValue(
																				subItem.i18n_title,
																				subItem.title,
																			)}
																		</span>
																		<MoveRight className="w-4 h-4 text-muted-foreground" />
																	</NavigationMenuLink>
																))}
															</div>
														</div>
													</NavigationMenuContent>
												</>
											)}
										</NavigationMenuItem>
									))}
								</NavigationMenuList>
							</NavigationMenu>
						</div>
					)
				)}

				{/* RIGHT COLUMN */}
				<div className="flex justify-end w-full gap-4 items-center">
					<div className="hidden lg:flex gap-4">
						{ctaButtons.map((button) => (
							<Button
								key={button._key}
								variant={
									variant === "transparent" &&
									!scrolled &&
									button.variant === "outline"
										? "outline"
										: button.variant || "default"
								}
								className={cn({
									"text-white border-white hover:bg-white/20":
										variant === "transparent" &&
										!scrolled &&
										button.variant === "outline",
								})}
								asChild
							>
									<Link href={button.url}>
										{getLocalizedValue(button.i18n_label, button.label)}
									</Link>
							</Button>
						))}
					</div>
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className={cn("lg:hidden", {
									"text-white hover:text-white/80":
										variant === "transparent" && !scrolled,
								})}
							>
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent className="w-[300px] sm:w-[350px] px-4 sm:px-6">
							<SheetHeader>
								<SheetTitle>
									{logo?.asset?._ref ? (
										<Image
											src={urlFor(logo.asset._ref).url()}
											alt={logoAlt || ""}
											width={140}
											height={40}
											className="object-contain max-h-8"
										/>
									) : (
										siteName
									)}
								</SheetTitle>
							</SheetHeader>
							<div className="flex flex-col gap-6 py-6">
								{navigationItems.map((item) => (
									<div key={item._key} className="flex flex-col gap-2">
										{item.href ? (
											<Link
												href={item.href}
												className="text-lg font-medium hover:text-primary flex justify-between items-center"
											>
												<span>
													{getLocalizedValue(item.i18n_title, item.title)}
												</span>
												<MoveRight className="w-4 h-4 text-muted-foreground" />
											</Link>
										) : (
											<>
												<p className="text-lg font-medium">
													{getLocalizedValue(item.i18n_title, item.title)}
												</p>
												{(item.description || item.i18n_description) && (
													<p className="text-muted-foreground text-sm pb-1">
														{getLocalizedValue(
															item.i18n_description,
															item.description,
														)}
													</p>
												)}
											</>
										)}
										{item.items?.map((subItem) => (
											<Link
												key={subItem._key}
												href={subItem.href}
												className="ml-3 flex justify-between items-center py-1 text-muted-foreground hover:text-foreground"
											>
												<span>
													{getLocalizedValue(subItem.i18n_title, subItem.title)}
												</span>
												<MoveRight className="w-3.5 h-3.5" />
											</Link>
										))}
									</div>
								))}
								<div className="mt-6 flex flex-col gap-3 border-t pt-6">
									{ctaButtons.map((button) => (
										<Button
											key={button._key}
											variant={button.variant || "default"}
											asChild
											className="w-full"
										>
												<Link href={button.url}>
													{getLocalizedValue(button.i18n_label, button.label)}
												</Link>
										</Button>
									))}
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}

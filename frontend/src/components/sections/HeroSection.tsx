"use client";

import {
	MoveRight,
	PhoneCall,
	Plus,
	Check,
	Heart,
	Star,
	Search,
	Settings,
	Mail,
	Calendar,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type { SanityHeroSection } from "@/sanity/types/schema";
import { urlFor } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";

const IconMap = {
	arrowRight: MoveRight,
	phone: PhoneCall,
	plus: Plus,
	check: Check,
	heart: Heart,
	star: Star,
	search: Search,
	settings: Settings,
	mail: Mail,
	calendar: Calendar,
};

export default function HeroSection({
	heading,
	i18n_heading,
	subheading,
	i18n_subheading,
	variant = "buttonBanner",
	bannerButton,
	badgeText,
	i18n_badgeText,
	buttons = [],
	media,
}: SanityHeroSection) {
	const { getLocalizedValue } = useLanguage();

	const localizedHeading = getLocalizedValue(i18n_heading, heading);
	const localizedSubheading = getLocalizedValue(i18n_subheading, subheading);
	const localizedBadgeText = getLocalizedValue(i18n_badgeText, badgeText);
	const localizedBannerButtonLabel = getLocalizedValue(
		bannerButton?.i18n_label,
		bannerButton?.label,
	);

	// Function to render background media for buttonBanner and badgeBanner variants
	const renderBackgroundMedia = () => {
		if (!media || media.type === "placeholder") return null;

		if (media.type === "image" && media.image) {
			return (
				<div className="absolute inset-0 z-0">
					<div className="absolute inset-0 bg-black/50 dark:bg-black/70 z-10" />
					<Image
						src={urlFor(media.image).url()}
						alt={getLocalizedValue(media.image.i18n_alt, media.image.alt) || ""}
						fill
						className="object-cover z-0"
						priority
					/>
				</div>
			);
		}

		if (media.type === "video" && media.video?.url) {
			return (
				<div className="absolute inset-0 z-0">
					<div className="absolute inset-0 bg-black/50 dark:bg-black/70 z-10" />
					<video
						autoPlay={media.video.autoplay}
						loop={media.video.loop}
						muted={media.video.muted}
						playsInline
						className="absolute inset-0 w-full h-full object-cover z-0"
					>
						<source src={media.video.url} type="video/mp4" />
						Your browser does not support the video tag.
					</video>
				</div>
			);
		}

		return null;
	};

	const renderContent = () => {
		const contentSection = (
			<div
				className={`flex gap-4 flex-col ${variant !== "gridGallery" ? "items-center" : ""}`}
			>
				{(variant === "badgeBanner" || variant === "gridGallery") &&
					localizedBadgeText && (
						<div>
							<Badge variant="outline">{localizedBadgeText}</Badge>
						</div>
					)}
				<div
					className={`flex gap-4 flex-col ${variant !== "gridGallery" ? "items-center" : ""}`}
				>
					<h1
						className={`text-5xl md:text-7xl tracking-tighter font-regular ${
							variant === "gridGallery"
								? "text-left max-w-lg"
								: "text-center max-w-2xl"
						}`}
					>
						{localizedHeading}
					</h1>
					{localizedSubheading && (
						<p
							className={`text-xl leading-relaxed tracking-tight text-muted-foreground ${
								variant === "gridGallery"
									? "text-left max-w-md"
									: "text-center max-w-2xl"
							}`}
						>
							{localizedSubheading}
						</p>
					)}
				</div>
				{buttons.length > 0 && (
					<div
						className={`flex ${
							variant === "gridGallery" ? "flex-row gap-4" : "flex-row gap-3"
						}`}
					>
						{buttons.map((button) => {
							const Icon = button.icon ? IconMap[button.icon] : null;
							const localizedButtonLabel = getLocalizedValue(
								button.i18n_label,
								button.label,
							);
							return (
								<Button
									key={button._key}
									size="lg"
									className="gap-4"
									variant={button.variant || "default"}
									asChild
								>
									<Link href={button.url}>
										{localizedButtonLabel}
										{Icon && <Icon className="w-4 h-4" />}
									</Link>
								</Button>
							);
						})}
					</div>
				)}
			</div>
		);

		// Render media for non-gridGallery variants
		const renderBannerMedia = () => {
			if (!media || media.type === "placeholder") return null;

			if (media.type === "image" && media.image) {
				return (
					<div className="w-full max-w-md mx-auto mt-8">
						<div className="relative aspect-video rounded-md overflow-hidden">
							<Image
								src={urlFor(media.image).url()}
								alt={
									getLocalizedValue(media.image.i18n_alt, media.image.alt) ||
									localizedHeading ||
									""
								}
								fill
								className="object-cover"
							/>
						</div>
					</div>
				);
			}

			if (media.type === "video" && media.video?.url) {
				return (
					<div className="w-full max-w-md mx-auto mt-8">
						<div className="relative aspect-video rounded-md overflow-hidden">
							<iframe
								src={media.video.url}
								className="absolute inset-0 w-full h-full"
								allow={`${media.video.autoplay ? "autoplay;" : ""} fullscreen; picture-in-picture`}
								allowFullScreen
								title={`Video: ${localizedHeading}`}
							/>
						</div>
					</div>
				);
			}

			return null;
		};

		if (variant === "gridGallery") {
			const mainImage = media?.type === "image" && media.image ? 1 : 0;
			const additionalImagesCount =
				media?.type === "image" && media.additionalImages
					? media.additionalImages.length
					: 0;
			const totalImages = mainImage + additionalImagesCount;

			// For 1 image
			if (totalImages === 1) {
				return (
					<div className="w-full mx-auto max-w-7xl">
						<div className="grid grid-cols-1 gap-6 items-center md:grid-cols-12">
							<div className="md:col-span-5">{contentSection}</div>
							<div className="md:col-span-7 bg-muted rounded-md aspect-square">
								{media?.type === "image" && media.image && (
									<div className="relative w-full h-full">
										<Image
											src={urlFor(media.image).url()}
											alt={
												getLocalizedValue(
													media.image.i18n_alt,
													media.image.alt,
												) ||
												localizedHeading ||
												""
											}
											fill
											className="object-cover rounded-md"
										/>
									</div>
								)}
							</div>
						</div>
					</div>
				);
			}

			// For 2+ images
			return (
				<div className="w-full mx-auto max-w-7xl">
					<div className="grid grid-cols-1 gap-6 items-center md:grid-cols-12">
						<div className="md:col-span-5">{contentSection}</div>
						<div className="md:col-span-7">
							{totalImages === 2 && (
								<div className="grid grid-cols-2 gap-4">
									<div className="bg-muted rounded-md aspect-square">
										{media?.type === "image" && media.image && (
											<div className="relative w-full h-full">
												<Image
													src={urlFor(media.image).url()}
													alt={
														getLocalizedValue(
															media.image.i18n_alt,
															media.image.alt,
														) ||
														localizedHeading ||
														""
													}
													fill
													className="object-cover rounded-md"
												/>
											</div>
										)}
									</div>
									<div className="bg-muted rounded-md aspect-square">
										{media?.type === "image" && media.additionalImages?.[0] && (
											<div className="relative w-full h-full">
												<Image
													src={urlFor(media.additionalImages[0]).url()}
													alt={
														getLocalizedValue(
															media.additionalImages[0].i18n_alt,
															media.additionalImages[0].alt,
														) ||
														localizedHeading ||
														""
													}
													fill
													className="object-cover rounded-md"
												/>
											</div>
										)}
									</div>
								</div>
							)}
							{totalImages === 3 && (
								<div className="grid grid-cols-2 gap-4 auto-rows-min max-h-[calc(100vh-12rem)]">
									<div className="bg-muted rounded-md aspect-[4/3]">
										{media?.type === "image" && media.image && (
											<div className="relative w-full h-full">
												<Image
													src={urlFor(media.image).url()}
													alt={
														getLocalizedValue(
															media.image.i18n_alt,
															media.image.alt,
														) ||
														localizedHeading ||
														""
													}
													fill
													className="object-cover rounded-md"
												/>
											</div>
										)}
									</div>
									<div className="bg-muted rounded-md aspect-[4/3]">
										{media?.type === "image" && media.additionalImages?.[0] && (
											<div className="relative w-full h-full">
												<Image
													src={urlFor(media.additionalImages[0]).url()}
													alt={
														getLocalizedValue(
															media.additionalImages[0].i18n_alt,
															media.additionalImages[0].alt,
														) ||
														localizedHeading ||
														""
													}
													fill
													className="object-cover rounded-md"
												/>
											</div>
										)}
									</div>
									<div className="bg-muted rounded-md aspect-[4/3] col-span-2">
										{media?.type === "image" && media.additionalImages?.[1] && (
											<div className="relative w-full h-full">
												<Image
													src={urlFor(media.additionalImages[1]).url()}
													alt={
														getLocalizedValue(
															media.additionalImages[1].i18n_alt,
															media.additionalImages[1].alt,
														) ||
														localizedHeading ||
														""
													}
													fill
													className="object-cover rounded-md"
												/>
											</div>
										)}
									</div>
								</div>
							)}
							{totalImages >= 4 && (
								<div className="grid grid-cols-2 gap-4 max-h-[calc(100vh-12rem)]">
									<div className="bg-muted rounded-md aspect-[4/3]">
										{media?.type === "image" && media.image && (
											<div className="relative w-full h-full">
												<Image
													src={urlFor(media.image).url()}
													alt={
														getLocalizedValue(
															media.image.i18n_alt,
															media.image.alt,
														) ||
														localizedHeading ||
														""
													}
													fill
													className="object-cover rounded-md"
												/>
											</div>
										)}
									</div>
									<div className="bg-muted rounded-md aspect-[4/3]">
										{media?.type === "image" && media.additionalImages?.[0] && (
											<div className="relative w-full h-full">
												<Image
													src={urlFor(media.additionalImages[0]).url()}
													alt={
														getLocalizedValue(
															media.additionalImages[0].i18n_alt,
															media.additionalImages[0].alt,
														) ||
														localizedHeading ||
														""
													}
													fill
													className="object-cover rounded-md"
												/>
											</div>
										)}
									</div>
									<div className="bg-muted rounded-md aspect-[4/3]">
										{media?.type === "image" && media.additionalImages?.[1] && (
											<div className="relative w-full h-full">
												<Image
													src={urlFor(media.additionalImages[1]).url()}
													alt={
														getLocalizedValue(
															media.additionalImages[1].i18n_alt,
															media.additionalImages[1].alt,
														) ||
														localizedHeading ||
														""
													}
													fill
													className="object-cover rounded-md"
												/>
											</div>
										)}
									</div>
									<div className="bg-muted rounded-md aspect-[4/3]">
										{media?.type === "image" && media.additionalImages?.[2] && (
											<div className="relative w-full h-full">
												<Image
													src={urlFor(media.additionalImages[2]).url()}
													alt={
														getLocalizedValue(
															media.additionalImages[2].i18n_alt,
															media.additionalImages[2].alt,
														) ||
														localizedHeading ||
														""
													}
													fill
													className="object-cover rounded-md"
												/>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			);
		}

		return (
			<>
				{contentSection}
				{renderBannerMedia()}
			</>
		);
	};

	// For buttonBanner and badgeBanner, return the content with background media
	if (variant === "buttonBanner" || variant === "badgeBanner") {
		const hasMedia = media?.type && media.type !== "placeholder";

		return (
			<div className="w-full h-[calc(100vh-5rem)] relative">
				{renderBackgroundMedia()}
				<div className="absolute inset-0 flex items-center justify-center z-20">
					<div className="container mx-auto px-4">
						<div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
							{variant === "buttonBanner" && bannerButton && (
								<div>
									{/* Render the banner button if it exists */}
									{bannerButton.url && (
										<Button
											variant={hasMedia ? "secondary" : "outline"}
											size="sm"
											className="gap-4"
											asChild
										>
											<Link href={bannerButton.url || ""}>
												{localizedBannerButtonLabel}{" "}
												<MoveRight className="w-4 h-4" />
											</Link>
										</Button>
									)}
								</div>
							)}
							<div className="flex gap-4 flex-col">
								{variant === "badgeBanner" && localizedBadgeText && (
									<div className="flex justify-center">
										<Badge variant={hasMedia ? "secondary" : "outline"}>
											{localizedBadgeText}
										</Badge>
									</div>
								)}
								<h1
									className={`text-5xl md:text-7xl tracking-tighter font-regular text-center max-w-2xl ${
										hasMedia ? "text-white" : ""
									}`}
								>
									{localizedHeading}
								</h1>
								{localizedSubheading && (
									<p
										className={`text-lg md:text-xl leading-relaxed tracking-tight text-center max-w-2xl ${
											hasMedia ? "text-gray-100" : "text-muted-foreground"
										}`}
									>
										{localizedSubheading}
									</p>
								)}
							</div>
							{buttons.length > 0 && (
								<div className="flex flex-row gap-3">
									{buttons.map((button) => {
										const Icon = button.icon ? IconMap[button.icon] : null;
										const localizedButtonLabel = getLocalizedValue(
											button.i18n_label,
											button.label,
										);

										const buttonVariantMap: Record<
											string,
											| "default"
											| "secondary"
											| "outline"
											| "ghost"
											| "link"
											| "destructive"
										> = {
											default: hasMedia ? "default" : "default",
											secondary: hasMedia ? "secondary" : "secondary",
											outline: hasMedia ? "secondary" : "outline",
											ghost: hasMedia ? "secondary" : "ghost",
											link: "link",
											destructive: "destructive",
										};

										const buttonVariant =
											buttonVariantMap[button.variant || "default"];

										return (
											<Button
												key={button._key}
												size="lg"
												className="gap-4"
												variant={buttonVariant}
												asChild
											>
												<Link href={button.url}>
													{localizedButtonLabel}
													{Icon && <Icon className="w-4 h-4" />}
												</Link>
											</Button>
										);
									})}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">
			<div className="container mx-auto px-4">
				<div className="flex">{renderContent()}</div>
			</div>
		</div>
	);
}

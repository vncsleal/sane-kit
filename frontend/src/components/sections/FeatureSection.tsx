"use client";

import {
	Check,
	User,
	Settings,
	Lock,
	Star,
	Heart,
	BarChart,
	DollarSign,
	Calendar,
	Clock,
	Mail,
	GripVertical,
	type LucideProps,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { urlFor } from "@/sanity/client";
import { useState } from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { useLanguage } from "@/lib/language-context";
import type { SanityFeatureSection } from "@/sanity/types/schema";

export default function FeatureSection({
	variant = "default",
	badgeText,
	i18n_badgeText,
	heading,
	i18n_heading,
	subheading,
	i18n_subheading,
	features = [],
	image,
	comparisonImage,
}: SanityFeatureSection) {
	const { getLocalizedValue } = useLanguage();
	const [inset, setInset] = useState<number>(50);
	const [onMouseDown, setOnMouseDown] = useState<boolean>(false);

	const localizedBadgeText = getLocalizedValue(i18n_badgeText, badgeText);
	const localizedHeading = getLocalizedValue(i18n_heading, heading);
	const localizedSubheading = getLocalizedValue(i18n_subheading, subheading);

	const IconMap: Record<string, React.ComponentType<LucideProps>> = {
		user: User,
		settings: Settings,
		lock: Lock,
		star: Star,
		heart: Heart,
		barChart: BarChart,
		dollar: DollarSign,
		calendar: Calendar,
		clock: Clock,
		mail: Mail,
	};

	const onMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
		if (!onMouseDown || variant !== "slidingComparison") return;

		const rect = e.currentTarget.getBoundingClientRect();
		let x = 0;

		if ("touches" in e && e.touches.length > 0) {
			x = e.touches[0].clientX - rect.left;
		} else if ("clientX" in e) {
			x = e.clientX - rect.left;
		}

		const percentage = (x / rect.width) * 100;
		setInset(percentage);
	};

	const renderContent = () => (
		<div className="flex gap-4 flex-col">
			{localizedBadgeText && (
				<div>
					<Badge>{localizedBadgeText}</Badge>
				</div>
			)}
			<div className="flex gap-2 flex-col">
				<h2 className="text-xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
					{localizedHeading}
				</h2>
				{localizedSubheading && (
					<p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left">
						{localizedSubheading}
					</p>
				)}
			</div>
		</div>
	);

	const renderImage = () => (
		<div className="bg-muted rounded-md w-full aspect-video h-full flex-1">
			{image?.asset?._ref && (
				<div className="relative h-full w-full">
					<Image
						src={urlFor(image.asset._ref).url()}
						alt={
							getLocalizedValue(image.i18n_alt, image.alt) ||
							localizedHeading ||
							""
						}
						fill
						className="object-cover rounded-md"
					/>
				</div>
			)}
		</div>
	);

	if (variant === "slidingComparison") {
		return (
			<div className="w-full py-20 lg:py-40">
				<div className="container mx-auto">
					<div className="flex flex-col gap-4">
						{localizedBadgeText && (
							<div>
								<Badge>{localizedBadgeText}</Badge>
							</div>
						)}
						<div className="flex gap-2 flex-col">
							<h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular">
								{localizedHeading}
							</h2>
							{localizedSubheading && (
								<p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-muted-foreground">
									{localizedSubheading}
								</p>
							)}
						</div>
						{image?.asset?._ref && comparisonImage?.asset?._ref && (
							<div className="pt-12 w-full">
								<div
									className="relative aspect-video w-full h-full overflow-hidden rounded-2xl select-none"
									onMouseMove={onMouseMove}
									onMouseUp={() => setOnMouseDown(false)}
									onTouchMove={onMouseMove}
									onTouchEnd={() => setOnMouseDown(false)}
								>
									<div
										className="bg-muted h-full w-1 absolute z-20 top-0 -ml-1 select-none"
										style={{
											left: `${inset}%`,
										}}
									>
										<button
											type="button"
											className="bg-muted rounded hover:scale-110 transition-all w-5 h-10 select-none -translate-y-1/2 absolute top-1/2 -ml-2 z-30 cursor-ew-resize flex justify-center items-center"
											onTouchStart={(e) => {
												setOnMouseDown(true);
												onMouseMove(e);
											}}
											onMouseDown={(e) => {
												setOnMouseDown(true);
												onMouseMove(e);
											}}
											onTouchEnd={() => setOnMouseDown(false)}
											onMouseUp={() => setOnMouseDown(false)}
										>
											<GripVertical className="h-4 w-4 select-none" />
										</button>
									</div>
									<Image
										src={urlFor(image.asset._ref).url()}
										alt={
											getLocalizedValue(image.i18n_alt, image.alt) ||
											localizedHeading ||
											""
										}
										width={1920}
										height={1080}
										priority
										className="absolute left-0 top-0 z-10 w-full h-full aspect-video rounded-2xl select-none border"
										style={{
											clipPath: `inset(0 0 0 ${inset}%)`,
										}}
									/>
									<Image
										src={urlFor(comparisonImage.asset._ref).url()}
										alt={
											getLocalizedValue(
												comparisonImage.i18n_alt,
												comparisonImage.alt,
											) ||
											`${localizedHeading} comparison` ||
											""
										}
										width={1920}
										height={1080}
										priority
										className="absolute left-0 top-0 w-full h-full aspect-video rounded-2xl select-none border"
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}

	if (variant === "carouselFeature") {
		const featuresWithImages = features.filter(
			(feature) => feature.image?.asset?._ref,
		);
		const placeholderKeys = [
			"placeholder-slide-1",
			"placeholder-slide-2",
			"placeholder-slide-3",
		];

		return (
			<div className="w-full py-20 lg:py-40">
				<div className="container mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-2 justify-end items-end gap-10">
						<div className="flex gap-4 flex-col items-start">
							{localizedBadgeText && (
								<div>
									<Badge>{localizedBadgeText}</Badge>
								</div>
							)}
							<div className="flex gap-2 flex-col">
								<h2 className="text-xl md:text-3xl lg:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
									{localizedHeading}
								</h2>
								{localizedSubheading && (
									<p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left">
										{localizedSubheading}
									</p>
								)}
							</div>
						</div>
						<div className="w-full max-w-full px-6">
							<Carousel>
								<CarouselContent>
									{featuresWithImages.length > 0
										? featuresWithImages.map((feature) => {
												const localizedFeatureTitle = getLocalizedValue(
													feature.i18n_title,
													feature.title,
												);
												const localizedImageAlt = getLocalizedValue(
													feature.image?.i18n_alt,
													feature.image?.alt,
												);
												return (
													<CarouselItem key={feature._key}>
														<div className="rounded-md aspect-video bg-muted overflow-hidden">
															{feature.image?.asset?._ref ? (
																<div className="relative w-full h-full">
																	<Image
																		src={urlFor(feature.image.asset._ref).url()}
																		alt={
																			localizedImageAlt ||
																			localizedFeatureTitle ||
																			""
																		}
																		fill
																		className="object-cover"
																	/>
																</div>
															) : (
																<div className="flex items-center justify-center p-6 h-full">
																	<span className="text-sm">
																		{localizedFeatureTitle}
																	</span>
																</div>
															)}
														</div>
													</CarouselItem>
												);
											})
										: Array.from({ length: 3 }).map((_, index) => (
												<CarouselItem key={placeholderKeys[index]}>
													<div className="flex rounded-md aspect-video bg-muted items-center justify-center p-6">
														<span className="text-sm">
															Platform Screenshot {index + 1}
														</span>
													</div>
												</CarouselItem>
											))}
								</CarouselContent>
								<CarouselPrevious />
								<CarouselNext />
							</Carousel>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (variant === "bigMasonryGrid") {
		return (
			<div className="w-full py-20 lg:py-40">
				<div className="container mx-auto">
					<div className="flex flex-col gap-10">
						<div className="flex gap-4 flex-col items-start">
							{localizedBadgeText && (
								<div>
									<Badge>{localizedBadgeText}</Badge>
								</div>
							)}
							<div className="flex gap-2 flex-col">
								<h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
									{localizedHeading}
								</h2>
								{localizedSubheading && (
									<p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
										{localizedSubheading}
									</p>
								)}
							</div>
						</div>

						<div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-8">
							{features.map((feature, index) => {
								const Icon =
									feature.icon && IconMap[feature.icon]
										? IconMap[feature.icon]
										: User;

								const isFirstCard = index === 0;
								const isEighthCard = index === 7;

								const localizedFeatureTitle = getLocalizedValue(
									feature.i18n_title,
									feature.title,
								);
								const localizedFeatureDescription = getLocalizedValue(
									feature.i18n_description,
									feature.description,
								);
								const localizedImageAlt = getLocalizedValue(
									feature.image?.i18n_alt,
									feature.image?.alt,
								);

								return (
									<div
										key={feature._key}
										className={`relative bg-muted rounded-md overflow-hidden h-full
											${isFirstCard ? "lg:col-span-2 lg:row-span-2" : ""} 
											${isEighthCard ? "lg:col-span-2" : ""}
											${!isEighthCard ? "aspect-square" : ""} 
											p-6 flex justify-between flex-col`}
									>
										{feature.image?.asset?._ref ? (
											<div className="absolute inset-0 w-full h-full">
												<Image
													src={urlFor(feature.image.asset._ref).url()}
													alt={localizedImageAlt || localizedFeatureTitle || ""}
													fill
													className="object-cover"
												/>
												<div className="absolute inset-0 bg-black/30" />
											</div>
										) : (
											<Icon className="w-8 h-8 stroke-1" />
										)}

										<div className="relative z-10 flex flex-col mt-auto">
											<h3
												className={`text-xl tracking-tight ${
													feature.image?.asset?._ref ? "text-white" : ""
												}`}
											>
												{localizedFeatureTitle}
											</h3>
											{localizedFeatureDescription && (
												<p
													className={`max-w-xs text-base ${
														feature.image?.asset?._ref
															? "text-white/80"
															: "text-muted-foreground"
													}`}
												>
													{localizedFeatureDescription}
												</p>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (variant === "masonryGrid") {
		return (
			<div className="w-full py-20 lg:py-40">
				<div className="container mx-auto">
					<div className="flex flex-col gap-10">
						<div className="flex gap-4 flex-col items-start">
							{localizedBadgeText && (
								<div>
									<Badge>{localizedBadgeText}</Badge>
								</div>
							)}
							<div className="flex gap-2 flex-col">
								<h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
									{localizedHeading}
								</h2>
								{localizedSubheading && (
									<p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
										{localizedSubheading}
									</p>
								)}
							</div>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
							{features.map((feature, index) => {
								const Icon =
									feature.icon && IconMap[feature.icon]
										? IconMap[feature.icon]
										: User;

								const shouldSpanTwoColumns =
									index === 0 ||
									(index >= 3 &&
										Math.floor((index - 3) / 4) * 4 + 3 <= index &&
										index <= Math.floor((index - 3) / 4) * 4 + 4);

								const localizedFeatureTitle = getLocalizedValue(
									feature.i18n_title,
									feature.title,
								);
								const localizedFeatureDescription = getLocalizedValue(
									feature.i18n_description,
									feature.description,
								);
								const localizedImageAlt = getLocalizedValue(
									feature.image?.i18n_alt,
									feature.image?.alt,
								);

								return (
									<div
										key={feature._key}
										className={`relative bg-muted rounded-md overflow-hidden
											${
												shouldSpanTwoColumns
													? "h-full lg:col-span-2 aspect-square lg:aspect-auto"
													: "aspect-square"
											}`}
									>
										{feature.image?.asset?._ref ? (
											<div className="absolute inset-0 w-full h-full">
												<Image
													src={urlFor(feature.image.asset._ref).url()}
													alt={localizedImageAlt || localizedFeatureTitle || ""}
													fill
													className="object-cover"
												/>
												<div className="absolute inset-0 bg-black/30" />
											</div>
										) : (
											<div className="absolute top-6 left-6">
												<Icon className="w-8 h-8 stroke-1" />
											</div>
										)}

										<div className="relative z-10 flex justify-between flex-col h-full p-6">
											{!feature.image?.asset?._ref && <div className="mb-10" />}
											<div className="flex flex-col mt-auto">
												<h3
													className={`text-xl tracking-tight ${
														feature.image?.asset?._ref ? "text-white" : ""
													}`}
												>
													{localizedFeatureTitle}
												</h3>
												{localizedFeatureDescription && (
													<p
														className={`max-w-xs text-base ${
															feature.image?.asset?._ref
																? "text-white/80"
																: "text-muted-foreground"
														}`}
													>
														{localizedFeatureDescription}
													</p>
												)}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (variant === "imageCards") {
		return (
			<div className="w-full py-20 lg:py-40">
				<div className="container mx-auto">
					<div className="flex flex-col gap-10">
						<div className="flex gap-4 flex-col items-start">
							{localizedBadgeText && (
								<div>
									<Badge>{localizedBadgeText}</Badge>
								</div>
							)}
							<div className="flex gap-2 flex-col">
								<h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
									{localizedHeading}
								</h2>
								{localizedSubheading && (
									<p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
										{localizedSubheading}
									</p>
								)}
							</div>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
							{features.map((feature) => {
								const localizedFeatureTitle = getLocalizedValue(
									feature.i18n_title,
									feature.title,
								);
								const localizedFeatureDescription = getLocalizedValue(
									feature.i18n_description,
									feature.description,
								);
								const localizedImageAlt = getLocalizedValue(
									feature.image?.i18n_alt,
									feature.image?.alt,
								);
								return (
									<div key={feature._key} className="flex flex-col gap-2">
										<div className="bg-muted rounded-md aspect-video mb-2">
											{feature.image?.asset?._ref && (
												<div className="relative w-full h-full">
													<Image
														src={urlFor(feature.image.asset._ref).url()}
														alt={
															localizedImageAlt || localizedFeatureTitle || ""
														}
														fill
														className="object-cover rounded-md"
													/>
												</div>
											)}
										</div>
										<h3 className="text-xl tracking-tight">
											{localizedFeatureTitle}
										</h3>
										{localizedFeatureDescription && (
											<p className="text-muted-foreground text-base">
												{localizedFeatureDescription}
											</p>
										)}
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (variant === "leftImage") {
		return (
			<div className="w-full py-20 lg:py-40">
				<div className="container mx-auto">
					<div className="flex flex-col-reverse lg:flex-row gap-10 lg:items-center">
						{renderImage()}
						<div className="flex gap-4 pl-0 lg:pl-20 flex-col flex-1">
							{renderContent()}
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (variant === "rightImage") {
		return (
			<div className="w-full py-20 lg:py-40">
				<div className="container mx-auto">
					<div className="flex flex-col-reverse lg:flex-row-reverse gap-10 lg:items-center">
						{renderImage()}
						<div className="flex gap-4 pr-0 lg:pr-20 flex-col flex-1">
							{renderContent()}
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (variant === "withImage") {
		return (
			<div className="w-full py-20 lg:py-40">
				<div className="container mx-auto">
					<div className="grid border rounded-lg py-8 px-8 grid-cols-1 gap-8 items-center lg:grid-cols-2">
						<div className="flex gap-10 flex-col">
							<div className="flex gap-4 flex-col">
								{localizedBadgeText && (
									<div>
										<Badge variant="outline">{localizedBadgeText}</Badge>
									</div>
								)}
								<div className="flex gap-2 flex-col">
									<h2 className="text-3xl lg:text-5xl tracking-tighter max-w-xl text-left font-regular">
										{localizedHeading}
									</h2>
									{localizedSubheading && (
										<p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left">
											{localizedSubheading}
										</p>
									)}
								</div>
							</div>
							<div className="grid lg:pl-6 grid-cols-1 sm:grid-cols-3 items-start lg:grid-cols-1 gap-6">
								{features.map((feature) => {
									const localizedFeatureTitle = getLocalizedValue(
										feature.i18n_title,
										feature.title,
									);
									const localizedFeatureDescription = getLocalizedValue(
										feature.i18n_description,
										feature.description,
									);
									return (
										<div
											key={feature._key}
											className="flex flex-row gap-6 items-start"
										>
											<Check className="w-4 h-4 mt-2 text-primary" />
											<div className="flex flex-col gap-1">
												<p>{localizedFeatureTitle}</p>
												{localizedFeatureDescription && (
													<p className="text-muted-foreground text-sm">
														{localizedFeatureDescription}
													</p>
												)}
											</div>
										</div>
									);
								})}
							</div>
						</div>
						<div className="bg-muted rounded-md aspect-square">
							{image?.asset?._ref && (
								<div className="relative h-full w-full">
									<Image
										src={urlFor(image.asset._ref).url()}
										alt={
											getLocalizedValue(image.i18n_alt, image.alt) ||
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
			</div>
		);
	}

	if (variant === "default") {
		return (
			<div className="w-full py-20 lg:py-40">
				<div className="container mx-auto">
					<div className="flex gap-4 py-20 lg:py-40 flex-col items-start">
						{localizedBadgeText && (
							<div>
								<Badge>{localizedBadgeText}</Badge>
							</div>
						)}
						<div className="flex gap-2 flex-col">
							<h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular">
								{localizedHeading}
							</h2>
							{localizedSubheading && (
								<p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-muted-foreground">
									{localizedSubheading}
								</p>
							)}
						</div>
						<div className="flex gap-10 pt-12 flex-col w-full">
							<div className="grid grid-cols-2 items-start lg:grid-cols-3 gap-10">
								{features.map((feature) => {
									const localizedFeatureTitle = getLocalizedValue(
										feature.i18n_title,
										feature.title,
									);
									const localizedFeatureDescription = getLocalizedValue(
										feature.i18n_description,
										feature.description,
									);
									return (
										<div
											key={feature._key}
											className="flex flex-row gap-6 items-start"
										>
											<Check className="w-4 h-4 mt-2 text-primary" />
											<div className="flex flex-col gap-1">
												<p>{localizedFeatureTitle}</p>
												{localizedFeatureDescription && (
													<p className="text-muted-foreground text-sm">
														{localizedFeatureDescription}
													</p>
												)}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return null;
}

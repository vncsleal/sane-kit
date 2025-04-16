"use client";

import { useEffect, useState, useMemo } from "react";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import type { SanityCasesSection, SanityCase } from "@/sanity/types/schema";
import { urlFor } from "@/sanity/client"; // Use urlFor
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";

export default function CasesSection({
	heading,
	i18n_heading,
	subheading,
	i18n_subheading,
	variant = "logoCarousel",
	cases = [],
}: SanityCasesSection) {
	const { getLocalizedValue } = useLanguage();

	const localizedHeading = getLocalizedValue(i18n_heading, heading);
	const localizedSubheading = getLocalizedValue(i18n_subheading, subheading);

	if (variant === "logoCarousel") {
		return (
			<LogoCarousel
				heading={localizedHeading || ""}
				subheading={localizedSubheading}
				cases={cases}
			/>
		);
	}

	if (variant === "compactSlider") {
		return (
			<CompactSlider
				heading={localizedHeading || ""}
				subheading={localizedSubheading}
				cases={cases}
			/>
		);
	}

	return (
		<LogoCarousel
			heading={localizedHeading || ""}
			subheading={localizedSubheading}
			cases={cases}
		/>
	);
}

const LogoCarousel = ({
	heading,
	subheading,
	cases,
}: {
	heading: string;
	subheading?: string;
	cases: SanityCase[];
}) => {
	const { getLocalizedValue } = useLanguage();
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);

	const placeholderLogos = useMemo(
		() => Array.from({ length: 15 }, () => ({ id: crypto.randomUUID() })),
		[],
	);

	useEffect(() => {
		if (!api) {
			return;
		}

		const timer = setTimeout(() => {
			if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
				setCurrent(0);
				api.scrollTo(0);
			} else {
				api.scrollNext();
				setCurrent(current + 1);
			}
		}, 1000);

		return () => clearTimeout(timer);
	}, [api, current]);

	return (
		<div className="w-full py-20 lg:py-40">
			<div className="container mx-auto">
				<div className="flex flex-col gap-10">
					<h2 className="text-xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
						{heading || "Trusted by thousands of businesses worldwide"}
					</h2>
					{subheading && (
						<p className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl">
							{subheading}
						</p>
					)}
					<Carousel setApi={setApi} className="w-full">
						<CarouselContent>
							{cases.length > 0
								? cases.map((item) => {
										const localizedName = getLocalizedValue(
											item.i18n_name,
											item.name,
										);
										const localizedAlt = getLocalizedValue(
											item.logo?.i18n_alt,
											item.logo?.alt,
										);
										return (
											<CarouselItem
												className="basis-1/4 lg:basis-1/6"
												key={item._key}
											>
												<div className="flex rounded-md aspect-square bg-muted items-center justify-center p-6">
													{item.logo ? (
														<div className="relative w-full h-full">
															<Image
																src={urlFor(item.logo).url()} // Use urlFor
																alt={
																	localizedAlt ||
																	localizedName ||
																	"Company logo"
																}
																fill
																className="object-contain"
															/>
														</div>
													) : (
														<span className="text-sm">
															{localizedName || "Logo"}
														</span>
													)}
												</div>
											</CarouselItem>
										);
									})
								: placeholderLogos.map((logo, index) => (
										<CarouselItem
											className="basis-1/4 lg:basis-1/6"
											key={logo.id}
										>
											<div className="flex rounded-md aspect-square bg-muted items-center justify-center p-6">
												<span className="text-sm">Logo {index + 1}</span>
											</div>
										</CarouselItem>
									))}
						</CarouselContent>
					</Carousel>
				</div>
			</div>
		</div>
	);
};

const CompactSlider = ({
	heading,
	cases,
}: {
	heading: string;
	subheading?: string;
	cases: SanityCase[];
}) => {
	const { getLocalizedValue } = useLanguage();
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);

	const placeholderLogos = useMemo(
		() => Array.from({ length: 25 }, () => ({ id: crypto.randomUUID() })),
		[],
	);

	useEffect(() => {
		if (!api) {
			return;
		}

		const timer = setTimeout(() => {
			if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
				setCurrent(0);
				api.scrollTo(0);
			} else {
				api.scrollNext();
				setCurrent(current + 1);
			}
		}, 1000);

		return () => clearTimeout(timer);
	}, [api, current]);

	return (
		<div className="w-full py-20 lg:py-40">
			<div className="container mx-auto">
				<div className="grid grid-cols-5 gap-10 items-center">
					<h3 className="text-xl tracking-tighter lg:max-w-xl font-regular text-left">
						{heading || "Trusted by market leaders"}
					</h3>
					<div className="relative w-full col-span-4">
						<div className="bg-gradient-to-r from-background via-white/0 to-background z-10 absolute left-0 top-0 right-0 bottom-0 w-full h-full" />
						<Carousel setApi={setApi} className="w-full">
							<CarouselContent>
								{cases.length > 0
									? cases.map((item) => {
											const localizedName = getLocalizedValue(
												item.i18n_name,
												item.name,
											);
											const localizedAlt = getLocalizedValue(
												item.logo?.i18n_alt,
												item.logo?.alt,
											);
											return (
												<CarouselItem
													className="basis-1/4 lg:basis-1/6"
													key={item._key}
												>
													<div className="flex rounded-md aspect-square bg-muted items-center justify-center p-2">
														{item.logo ? (
															<div className="relative w-full h-full">
																<Image
																	src={urlFor(item.logo).url()} // Use urlFor
																	alt={
																		localizedAlt ||
																		localizedName ||
																		"Company logo"
																	}
																	fill
																	className="object-contain"
																/>
															</div>
														) : (
															<span className="text-sm">
																{localizedName || "Logo"}
															</span>
														)}
													</div>
												</CarouselItem>
											);
										})
									: placeholderLogos.map((logo, index) => (
											<CarouselItem
												className="basis-1/4 lg:basis-1/6"
												key={logo.id}
											>
												<div className="flex rounded-md aspect-square bg-muted items-center justify-center p-2">
													<span className="text-sm">Logo {index + 1}</span>
												</div>
											</CarouselItem>
										))}
							</CarouselContent>
						</Carousel>
					</div>
				</div>
			</div>
		</div>
	);
};

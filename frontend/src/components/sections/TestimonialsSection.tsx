"use client";

import { useEffect, useState } from "react";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { User, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type {
	SanityTestimonialsSection,
	SanityTestimonial,
} from "@/sanity/types/schema";
import { urlFor } from "@/sanity/client"; // Use urlFor
import { useLanguage } from "@/lib/language-context";

export default function TestimonialsSection(props: SanityTestimonialsSection) {
	const {
		heading,
		i18n_heading,
		subheading,
		i18n_subheading,
		variant = "carousel",
		testimonials, // Keep original testimonials prop
	} = props;
	const { getLocalizedValue } = useLanguage();

	const localizedHeading = getLocalizedValue(i18n_heading, heading);
	const localizedSubheading = getLocalizedValue(i18n_subheading, subheading);

	// Pass testimonials explicitly, defaulting to [] if undefined
	if (variant === "carousel") {
		return (
			<TestimonialsCarousel
				heading={localizedHeading || ""}
				subheading={localizedSubheading}
				testimonials={testimonials || []} // Default to empty array
			/>
		);
	}
	if (variant === "grid") {
		return (
			<TestimonialsGrid
				heading={localizedHeading || ""}
				subheading={localizedSubheading}
				testimonials={testimonials || []} // Default to empty array
			/>
		);
	}
	if (variant === "masonry-grid") {
		return (
			<TestimonialsMasonryGrid
				heading={localizedHeading || ""}
				subheading={localizedSubheading}
				testimonials={testimonials || []} // Default to empty array
			/>
		);
	}

	return (
		<TestimonialsCarousel
			heading={localizedHeading || ""}
			subheading={localizedSubheading}
			testimonials={testimonials || []} // Default to empty array
		/>
	);
}

interface TestimonialVariantProps {
	heading: string;
	subheading?: string;
	testimonials: SanityTestimonial[];
}

const TestimonialsCarousel = ({
	heading,
	subheading,
	testimonials,
}: TestimonialVariantProps) => {
	const { getLocalizedValue } = useLanguage();
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		if (!api || testimonials.length === 0) {
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
		}, 4000);

		return () => clearTimeout(timer);
	}, [api, current, testimonials.length]);

	return (
		<div className="w-full py-20 lg:py-40">
			<div className="container mx-auto">
				<div className="flex flex-col gap-10">
					<div className="flex flex-col gap-4">
						<h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
							{heading || "Trusted by thousands of businesses worldwide"}
						</h2>
						{subheading && (
							<p className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl">
								{subheading}
							</p>
						)}
					</div>
					<Carousel setApi={setApi} className="w-full">
						<CarouselContent>
							{testimonials.map((testimonial) => {
								const localizedTitle = getLocalizedValue(
									testimonial.i18n_title,
									testimonial.title,
								);
								const localizedContent = getLocalizedValue(
									testimonial.i18n_content,
									testimonial.content,
								);
								const localizedAuthor = getLocalizedValue(
									testimonial.i18n_author,
									testimonial.author,
								);
								const localizedRole = getLocalizedValue(
									testimonial.i18n_role,
									testimonial.role,
								);
								const localizedAvatarAlt = getLocalizedValue(
									testimonial.avatar?.i18n_alt,
									testimonial.avatar?.alt,
								);

								return (
									<CarouselItem className="lg:basis-1/2" key={testimonial._key}>
										<div className="bg-muted rounded-md h-full lg:col-span-2 p-6 aspect-video flex justify-between flex-col">
											<User className="w-8 h-8 stroke-1" />
											<div className="flex flex-col gap-4">
												<div className="flex flex-col">
													<h3 className="text-xl tracking-tight">
														{localizedTitle}
													</h3>
													<p className="text-muted-foreground max-w-xs text-base">
														{localizedContent}
													</p>
												</div>
												<p className="flex flex-row gap-2 text-sm items-center">
													<span className="text-muted-foreground">By</span>{" "}
													<Avatar className="h-6 w-6">
														{testimonial.avatar ? (
															<AvatarImage
																src={urlFor(testimonial.avatar).url()} // Use urlFor
																alt={
																	localizedAvatarAlt || localizedAuthor || ""
																}
																className="object-cover" // Add object-cover
															/>
														) : (
															<AvatarFallback>
																{localizedAuthor?.substring(0, 2).toUpperCase()}
															</AvatarFallback>
														)}
													</Avatar>
													<span>{localizedAuthor}</span>
													{localizedRole && (
														<span className="text-muted-foreground text-xs">
															{localizedRole}
														</span>
													)}
												</p>
											</div>
										</div>
									</CarouselItem>
								);
							})}
						</CarouselContent>
					</Carousel>
				</div>
			</div>
		</div>
	);
};

const TestimonialsGrid = ({
	heading,
	subheading,
	testimonials,
}: TestimonialVariantProps) => {
	const { getLocalizedValue } = useLanguage();
	return (
		<div className="w-full py-20 lg:py-40">
			<div className="container mx-auto">
				<div className="flex flex-col gap-10">
					<div className="flex flex-col gap-4">
						<h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
							{heading || "Trusted by thousands of businesses worldwide"}
						</h2>
						{subheading && (
							<p className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl">
								{subheading}
							</p>
						)}
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{testimonials.map((testimonial) => {
							const localizedTitle = getLocalizedValue(
								testimonial.i18n_title,
								testimonial.title,
							);
							const localizedContent = getLocalizedValue(
								testimonial.i18n_content,
								testimonial.content,
							);
							const localizedAuthor = getLocalizedValue(
								testimonial.i18n_author,
								testimonial.author,
							);
							const localizedRole = getLocalizedValue(
								testimonial.i18n_role,
								testimonial.role,
							);
							const localizedAvatarAlt = getLocalizedValue(
								testimonial.avatar?.i18n_alt,
								testimonial.avatar?.alt,
							);

							return (
								<div
									key={testimonial._key}
									className="bg-muted rounded-md p-6 flex flex-col justify-between"
								>
									<Quote className="w-8 h-8 stroke-1 mb-4 text-primary/40" />

									<div className="flex flex-col gap-4">
										<h3 className="text-xl tracking-tight">{localizedTitle}</h3>
										<p className="text-muted-foreground text-base flex-grow">
											{localizedContent}
										</p>
									</div>

									<div className="mt-6 pt-4 flex items-center gap-3">
										<Avatar className="h-10 w-10">
											{testimonial.avatar ? (
												<AvatarImage
													src={urlFor(testimonial.avatar).url()} // Use urlFor
													alt={localizedAvatarAlt || localizedAuthor || ""}
													className="object-cover" // Add object-cover
												/>
											) : (
												<AvatarFallback>
													{localizedAuthor?.substring(0, 2).toUpperCase()}
												</AvatarFallback>
											)}
										</Avatar>
										<div>
											<p className="font-medium">{localizedAuthor}</p>
											{localizedRole && (
												<p className="text-sm text-muted-foreground">
													{localizedRole}
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
};

const TestimonialsMasonryGrid = ({
	heading,
	subheading,
	testimonials,
}: TestimonialVariantProps) => {
	const { getLocalizedValue } = useLanguage();
	return (
		<div className="w-full py-20 lg:py-40">
			<div className="container mx-auto">
				<div className="flex flex-col gap-10">
					<div className="flex flex-col gap-4">
						<h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
							{heading || "What our clients are saying"}
						</h2>
						{subheading && (
							<p className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl">
								{subheading}
							</p>
						)}
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{testimonials.map((testimonial, i) => {
							const isHighlighted = i === 0 || i === 3;
							const localizedTitle = getLocalizedValue(
								testimonial.i18n_title,
								testimonial.title,
							);
							const localizedContent = getLocalizedValue(
								testimonial.i18n_content,
								testimonial.content,
							);
							const localizedAuthor = getLocalizedValue(
								testimonial.i18n_author,
								testimonial.author,
							);
							const localizedRole = getLocalizedValue(
								testimonial.i18n_role,
								testimonial.role,
							);
							const localizedAvatarAlt = getLocalizedValue(
								testimonial.avatar?.i18n_alt,
								testimonial.avatar?.alt,
							);
							const testimonialLength = localizedContent?.length || 0;

							let heightClass = "aspect-square";
							if (isHighlighted || testimonialLength > 200) {
								heightClass = "";
							}

							return (
								<div
									key={testimonial._key}
									className={`relative bg-muted rounded-lg overflow-hidden ${heightClass} ${
										isHighlighted ? "sm:col-span-2" : ""
									}`}
								>
									<div className="relative z-10 flex flex-col justify-between h-full p-6">
										<Quote className="w-8 h-8 stroke-1 mb-4 text-primary/40" />

										<div className="flex flex-col gap-4">
											<h3 className="text-xl tracking-tight font-medium">
												{localizedTitle}
											</h3>
											<p className="text-muted-foreground">
												{localizedContent}
											</p>
										</div>

										<div className="mt-6 pt-4 flex items-center gap-3">
											<Avatar className="h-10 w-10">
												{testimonial.avatar ? (
													<AvatarImage
														src={urlFor(testimonial.avatar).url()} // Use urlFor
														alt={localizedAvatarAlt || localizedAuthor || ""}
														className="object-cover" // Add object-cover
													/>
												) : (
													<AvatarFallback>
														{localizedAuthor?.substring(0, 2).toUpperCase()}
													</AvatarFallback>
												)}
											</Avatar>
											<div>
												<p className="font-medium">{localizedAuthor}</p>
												{localizedRole && (
													<p className="text-sm text-muted-foreground">
														{localizedRole}
													</p>
												)}
											</div>
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
};

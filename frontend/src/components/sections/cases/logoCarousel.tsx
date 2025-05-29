"use client";

import { useEffect, useState, useMemo } from "react";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import type { CasesSection } from "@/sanity/types";
import { urlFor } from "@/sanity/client";
import Image from "next/image";



type LogoCarouselProps = Pick<CasesSection, 'heading' | 'subheading' | 'cases'>;

export default function LogoCarousel({
	heading,
	subheading,
	cases = [],
}: LogoCarouselProps) {
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
						{heading || "Confiado por milhares de empresas no mundo todo"}
					</h2>
					{subheading && (
						<p className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl">
							{subheading}
						</p>
					)}
					<Carousel setApi={setApi} className="w-full">
						<CarouselContent>
							{cases.length > 0
								? cases.map((item) => (
										<CarouselItem
											className="basis-1/4 lg:basis-1/6"
											key={item._key}
										>
											<div className="flex rounded-md aspect-square bg-muted items-center justify-center p-6">
												{item.logo ? (
													<div className="relative w-full h-full">
														<Image
															src={urlFor(item.logo).url()}
															alt={item.logo.alt || item.name || "Logo da empresa"}
															fill
															className="object-cover"
														/>
													</div>
												) : (
													<span className="text-sm">
														{item.name || "Logo"}
													</span>
												)}
											</div>
										</CarouselItem>
									))
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
}

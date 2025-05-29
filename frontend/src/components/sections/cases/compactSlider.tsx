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

type CompactSliderProps = Pick<CasesSection, 'heading' | 'subheading' | 'cases'>;

export default function CompactSlider({
	heading,
	subheading,
	cases = [],
}: CompactSliderProps) {
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
					<div className="flex flex-col gap-2">
						<h3 className="text-xl tracking-tighter lg:max-w-xl font-regular text-left">
							{heading || "Confiado por líderes do mercado"}
						</h3>
						{subheading && (
							<p className="text-sm text-muted-foreground">{subheading}</p>
						)}
					</div>
					<div className="relative w-full col-span-4">
						<div className="bg-gradient-to-r from-background via-white/0 to-background z-10 absolute left-0 top-0 right-0 bottom-0 w-full h-full" />
						<Carousel setApi={setApi} className="w-full">
							<CarouselContent>
								{cases.length > 0
									? cases.map((item) => (
											<CarouselItem
												className="basis-1/4 lg:basis-1/6"
												key={item._key}
											>
												<div className="flex rounded-md aspect-square bg-muted items-center justify-center p-2">
													{item.logo ? (
														<div className="relative w-full h-full">
															<Image
																src={urlFor(item.logo).url()}
																alt={item.logo.alt || item.name || "Logo da empresa"}
																fill
																className="object-contain"
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
}

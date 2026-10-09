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
import { stegaClean } from "next-sanity";
import { Button } from "@/components/ui/button";
import type { ExtractPageBuilderType } from "@/sanity/page-builder";
import { urlFor } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";

// Icon mapping for buttons with proper typing
export const IconMap = {
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
} as const;

type IconKey = keyof typeof IconMap;

// Function to render hero media (image or video)
export const renderBackgroundMedia = (media: ExtractPageBuilderType<"heroSection">['media']) => {
  if (!media || stegaClean(media.type) === "placeholder") return null;

  if (stegaClean(media.type) === "image" && media.image) {
    return (
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70 z-10" />
        <Image
          src={urlFor(media.image).width(1920).height(1080).url()}
          alt={media.image.alt || "Hero background"}
          fill
          preload
          className="object-cover"
          sizes="100vw"
        />
      </div>
    );
  }

  if (media.type === "video" && media.video?.url) {
    const autoplay = stegaClean(media.video.autoplay) === "true";
    const loop = stegaClean(media.video.loop) === "true";
    const muted = stegaClean(media.video.muted) === "true";

    return (
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70 z-10" />
        <video
          src={media.video.url}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    );
  }

  return null;
};

// Buttons group component
export const ButtonsGroup = ({ 
  buttons = [] 
}: Pick<ExtractPageBuilderType<"heroSection">, 'buttons'>) => {
  if (!buttons.length) return null;

  return (
    <>
      {buttons.map((button) => {
        const Icon = button.icon && (button.icon as IconKey) in IconMap 
          ? IconMap[button.icon as IconKey] 
          : null;
        
        return (
          <Button
            key={button._key}
            variant={(button.variant as "default" | "secondary" | "outline" | "ghost" | "link") || "default"}
            asChild
            size="lg"
            className="gap-4"
          >
            <Link href={button.url || "#"}>
              {button.label}
              {Icon && <Icon className="h-4 w-4" />}
            </Link>
          </Button>
        );
      })}
    </>
  );
};

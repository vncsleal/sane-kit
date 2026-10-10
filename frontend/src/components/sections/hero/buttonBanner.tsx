'use client'

import type {ExtractPageBuilderType} from '@/sanity/page-builder'
import {renderBackgroundMedia, ButtonsGroup} from './shared'
import {buttonVariants} from '@/components/ui/button'
import {cn} from '@/lib/utils'
import Link from 'next/link'

export default function ButtonBanner({
  heading,
  subheading,
  bannerButton,
  buttons = [],
  media,
}: ExtractPageBuilderType<'heroSection'>) {
  return (
    <div className="w-full relative">
      {/* Background media */}
      {renderBackgroundMedia(media)}

      {/* Content */}
      <div className="container mx-auto relative z-20 text-primary">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          {/* Banner button */}
          {bannerButton?.label && (
            <div>
              <Link
                href={bannerButton.url || '#'}
                className={cn(buttonVariants({variant: 'secondary', size: 'sm'}), 'gap-4')}
              >
                {bannerButton.label}
              </Link>
            </div>
          )}

          {/* Heading and Subheading */}
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              {heading}
            </h1>

            {/* Subheading */}
            {subheading && (
              <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
                {subheading}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-row gap-3">
            <ButtonsGroup buttons={buttons} />
          </div>
        </div>
      </div>
    </div>
  )
}

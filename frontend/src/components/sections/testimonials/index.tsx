'use client'

import type {ExtractPageBuilderType} from '@/sanity/page-builder'
import {stegaClean} from 'next-sanity'
import Carousel from './carousel'
import Grid from './grid'
import MasonryGrid from './masonryGrid'

export default function TestimonialsSectionRouter(
  props: ExtractPageBuilderType<'testimonialsSection'>,
) {
  const {variant = 'carousel', heading, subheading, testimonials = []} = props

  // Route to the appropriate variant component with properly typed props
  const variantProps = {
    heading: heading || '',
    subheading,
    testimonials,
  }

  // Select the appropriate component based on the variant
  switch (stegaClean(variant)) {
    case 'carousel':
      return <Carousel {...variantProps} />
    case 'grid':
      return <Grid {...variantProps} />
    case 'masonry-grid':
      return <MasonryGrid {...variantProps} />
    default:
      return <Carousel {...variantProps} />
  }
}

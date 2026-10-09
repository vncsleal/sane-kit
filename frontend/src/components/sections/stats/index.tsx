'use client'

import type {ExtractPageBuilderType} from '@/sanity/page-builder'
import {stegaClean} from 'next-sanity'
import Grid from './grid'
import WithContent from './withContent'

export default function StatsSectionRouter(props: ExtractPageBuilderType<'statsSection'>) {
  const {variant = 'grid'} = props

  // Route to the appropriate variant component
  switch (stegaClean(variant)) {
    case 'withContent':
      return <WithContent {...props} />
    case 'grid':
    default:
      return <Grid {...props} />
  }
}

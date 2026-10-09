"use client";

import type { CompareFeatureWithTitle, ExtractPageBuilderType } from '@/sanity/page-builder'

import Default from './default'

export type { CompareFeatureWithTitle }

export type CompareFeaturesSectionProps = Omit<
  ExtractPageBuilderType<'compareFeaturesSection'>,
  'features'
> & {
  /** Feature rows resolved server-side by `resolvePageBuilderData`. */
  features: CompareFeatureWithTitle[]
}

/**
 * Presentational router for the compare-features section. The referenced
 * feature titles are resolved on the server (see `resolvePageBuilderData`) so
 * this stays a client component the optimistic page builder can render.
 */
export default function CompareFeaturesRouter(props: CompareFeaturesSectionProps) {
  return <Default {...props} plans={props.plans ?? []} isLoading={false} />
}

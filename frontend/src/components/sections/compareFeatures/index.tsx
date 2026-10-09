import type { ExtractPageBuilderType } from '@/sanity/page-builder'
import { sanityFetch } from '@/sanity/live'
import { COMPARE_FEATURES_QUERY } from '@/sanity/queries'

import Default from './default'

export interface CompareFeatureWithTitle {
  _id: string
  _key: string
  title: string
}

/**
 * Server component: resolves the referenced feature documents with `sanityFetch`
 * and hands them to the variant (no client-side fetching).
 */
export default async function CompareFeaturesRouter(
  props: ExtractPageBuilderType<'compareFeaturesSection'>
) {
  const refs = props.features ?? []
  const ids = refs.map((feature) => feature._ref).filter((ref): ref is string => Boolean(ref))

  const { data } = await sanityFetch({
    query: COMPARE_FEATURES_QUERY,
    params: { ids },
  })

  const features: CompareFeatureWithTitle[] = refs.map((originalFeature) => {
    const detail = data?.find((result) => result._id === originalFeature._ref)
    return {
      _id: originalFeature._ref ?? '',
      _key: originalFeature._key || `feature-${originalFeature._ref}`,
      title: detail?.title || `Feature not found (${originalFeature._ref?.slice(0, 8)})`,
    }
  })

  return <Default {...props} plans={props.plans ?? []} features={features} isLoading={false} />
}

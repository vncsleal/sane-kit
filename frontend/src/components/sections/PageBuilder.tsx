"use client";

import type { SanityDocument } from 'next-sanity'
import { useOptimistic } from 'next-sanity/hooks'

import type { Locale } from '@/i18n/i18n-config'
import type { PageBuilderSection, ResolvedSectionData, StegaAware } from '@/sanity/page-builder'
import type { PAGE_QUERY_RESULT } from '@/sanity/types'
import { dataAttr } from '@/sanity/utils'

import RenderSection from './RenderSection'

/** A page document as returned by the page queries. */
type PageBuilderPage = StegaAware<NonNullable<PAGE_QUERY_RESULT>>

interface PageBuilderProps {
  page: PageBuilderPage
  locale: Locale
  /** Referenced data resolved server-side, keyed by section `_key`. */
  resolvedSections: Record<string, ResolvedSectionData>
}

/**
 * Client page builder that renders the blocks and reconciles edits pushed from
 * the Studio optimistically — the official `sanity-template-nextjs-clean`
 * pattern.
 *
 * Sections that reference other documents get their data from
 * `resolvedSections` (a server prop) rather than the optimistic document, which
 * carries references only. This keeps an in-flight edit from dropping it.
 */
export default function PageBuilder({ page, locale, resolvedSections }: PageBuilderProps) {
  const pageBuilderSections = useOptimistic<
    PageBuilderSection[],
    SanityDocument<{ _id: string; _type: string; pageBuilder?: PageBuilderSection[] }>
  >(page.pageBuilder ?? [], (currentSections, action) => {
    if (action.id === page._id && action.document.pageBuilder) {
      return action.document.pageBuilder
    }
    return currentSections
  })

  return (
    <div
      data-sanity={dataAttr({
        id: page._id,
        type: page._type,
        path: 'pageBuilder',
      })}
    >
      {pageBuilderSections.map((section) => (
        <div
          key={section._key}
          data-sanity={dataAttr({
            id: page._id,
            type: page._type,
            path: `pageBuilder[_key=="${section._key}"]`,
          })}
        >
          <RenderSection
            section={section}
            locale={locale}
            resolved={resolvedSections[section._key]}
          />
        </div>
      ))}
    </div>
  )
}

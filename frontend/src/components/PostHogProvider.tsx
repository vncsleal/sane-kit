"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react"
import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check for user consent before initializing PostHog
    const consentChoice = typeof window !== 'undefined'
      ? window.localStorage.getItem('cookie-consent-choice')
      : null;
      
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    
    if (!posthogKey) {
      if (process.env.NODE_ENV === "development") {
        console.warn("PostHog key is missing. Analytics tracking is disabled.");
      }
      return;
    }
    
    posthog.init(posthogKey, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      capture_pageview: false, // We capture pageviews manually
      capture_pageleave: true, // Enable pageleave capture
      debug: process.env.NODE_ENV === "development",
      loaded: (posthog) => {
        // If consent is rejected or not yet given, opt out of tracking
        if (consentChoice !== 'accepted') {
          posthog.opt_out_capturing();
        }
      }
    })
    
    // Listen for consent changes
    const handleConsentChange = () => {
      const consentStatus = window.localStorage.getItem('cookie-consent-choice');
      if (consentStatus === 'accepted') {
        posthog.opt_in_capturing();
      } else {
        posthog.opt_out_capturing();
      }
    };
    
    window.addEventListener('storage', handleConsentChange);
    return () => window.removeEventListener('storage', handleConsentChange);
  }, [])

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  )
}

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      const search = searchParams.toString()
      if (search) {
        url += `?${search}`
      }
      posthog.capture("$pageview", { "$current_url": url })
    }
  }, [pathname, searchParams, posthog])

  return null
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  )
}
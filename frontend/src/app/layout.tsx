import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { Geist, Geist_Mono } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { VisualEditing } from 'next-sanity/visual-editing'

import './globals.css'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/global/ThemeProvider'
import { ThemeToggle } from '@/components/global/ThemeToggle'
import { PostHogProvider } from '@/components/PostHogProvider'
import { DisableDraftMode } from '@/components/global/DisableDraftMode'
import { SanityLive } from '@/sanity/live'
import { env } from '@/sanity/env'
import { getDictionary } from '@/i18n/getDictionary'
import { i18n } from '@/i18n/i18n-config'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary(i18n.defaultLocale)
  return {
    title: dictionary.app.title,
    description: dictionary.app.description,
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html suppressHydrationWarning lang={i18n.defaultLocale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PostHogProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
              <ThemeToggle />
            </div>
            <Toaster position="top-center" />
            <SanityLive />
            {isEnabled && (
              <>
                <VisualEditing />
                <DisableDraftMode />
              </>
            )}
          </ThemeProvider>
        </PostHogProvider>
      </body>
      {env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
        <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      ) : null}
    </html>
  )
}

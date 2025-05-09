'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const [consent, setConsent] = useState<'granted' | 'denied' | null>(null);
  
  // Check for consent status on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consentChoice = localStorage.getItem('cookie-consent-choice');
      if (consentChoice === 'accepted') {
        setConsent('granted');
      } else if (consentChoice === 'rejected') {
        setConsent('denied');
      }
    }
  }, []);
  
  // Return early but after hooks are called
  if (!measurementId) {
    return null;
  }
  
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', {
            'analytics_storage': '${consent || 'denied'}'
          });
          gtag('config', '${measurementId}', {
            'anonymize_ip': true
          });
        `}
      </Script>
    </>
  );
}
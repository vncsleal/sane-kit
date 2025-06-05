'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import posthog from "posthog-js";
import { Card, CardContent } from "../ui/card";
import { Cookie } from "lucide-react"; 
import type { Dictionary } from "@/i18n/getDictionary";

// Define global type definition for gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

interface CookieConsentProps {
  dictionary?: Partial<Dictionary['cookie']>;
}

export function CookieConsent({ dictionary = {} }: CookieConsentProps) {
  const [showConsent, setShowConsent] = useState(false);

  // Check if consent has already been provided
  useEffect(() => {
    const consentGiven = localStorage.getItem("cookie-consent-choice");
    if (!consentGiven) {
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle accept all cookies
  const handleAccept = () => {
    localStorage.setItem("cookie-consent-choice", "accepted");
    
    // Enable analytics tracking
    if (typeof window.gtag !== "undefined") {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted"
      });
    }

    // Enable PostHog tracking
    if (typeof posthog !== "undefined") {
      posthog.opt_in_capturing();
    }
    
    setShowConsent(false);
  };

  // Handle reject all cookies
  const handleReject = () => {
    localStorage.setItem("cookie-consent-choice", "rejected");
    
    // Disable analytics tracking
    if (typeof window.gtag !== "undefined") {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied"
      });
    }

    // Disable PostHog tracking
    if (typeof posthog !== "undefined") {
      posthog.opt_out_capturing();
    }
    
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-4 inset-x-2 z-50 mx-auto max-w-xl">
      <Card className="border shadow">
        <CardContent className="px-4 "> 
          <div className="flex items-center justify-between gap-3"> 
            <Cookie className="h-5 w-5 text-muted-foreground flex-shrink-0" /> 
            <div className="flex-grow"> 
              <p className="text-xs text-muted-foreground">
                {dictionary.description || "Usamos cookies para otimizar sua experiência. Eles são opcionais, mas apreciados. Você aceita?"}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0"> 
              <Button variant="outline" size={"sm"} onClick={handleReject}>
                {dictionary.reject || "Recusar"}
              </Button>
              <Button size={"sm"} onClick={handleAccept}>
                {dictionary.accept || "Aceitar"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


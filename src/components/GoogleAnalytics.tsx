"use client";

import Script from "next/script";

type GtagArg = string | Date | Record<string, unknown>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: GtagArg[]) => void;
  }
}

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-XBWWEC6TJT";

export function updateGtagConsent(granted: boolean) {
  const status = granted ? "granted" : "denied";
  try {
    localStorage.setItem("wtf_cookie_consent", status);
  } catch {
    // ignore local storage restrictions
  }

  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: status,
      ad_storage: status,
      ad_user_data: status,
      ad_personalization: status,
    });
  }
}

export function trackGAEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, eventParams ?? {});
  }
}

export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      {/* Google Consent Mode v2 Default Setup using standard head script */}
      <script
        id="google-consent-mode"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}

            var savedConsent = 'denied';
            try {
              if (localStorage.getItem('wtf_cookie_consent') === 'granted') {
                savedConsent = 'granted';
              }
            } catch (e) {}

            gtag('consent', 'default', {
              'analytics_storage': savedConsent,
              'ad_storage': savedConsent,
              'ad_user_data': savedConsent,
              'ad_personalization': savedConsent,
              'wait_for_update': 500
            });

            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true
            });
          `,
        }}
      />
      {/* Google Analytics gtag.js */}
      <Script
        id="google-analytics-tag"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
    </>
  );
}

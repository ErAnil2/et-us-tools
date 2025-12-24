'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface GoogleAdsenseProps {
  // Your AdSense Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
  publisherId?: string;
  // Ad slot ID from AdSense dashboard
  slotId: string;
  // Ad format: 'auto', 'rectangle', 'horizontal', 'vertical'
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  // Responsive ad
  responsive?: boolean;
  // Custom style
  style?: React.CSSProperties;
  // Custom class
  className?: string;
  // Layout key for in-feed/in-article ads
  layoutKey?: string;
}

// Default publisher ID - should be set in environment variable or Firebase config
const DEFAULT_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || '';

/**
 * Google AdSense Component
 *
 * Usage:
 * <GoogleAdsense slotId="1234567890" format="auto" responsive />
 *
 * NOTE: AdSense ads will NOT display on localhost.
 * They require a verified, publicly accessible domain with HTTPS.
 */
export default function GoogleAdsense({
  publisherId = DEFAULT_PUBLISHER_ID,
  slotId,
  format = 'auto',
  responsive = true,
  style,
  className = '',
  layoutKey,
}: GoogleAdsenseProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Only run on client and if not already loaded
    if (typeof window === 'undefined' || isLoaded.current) return;

    // Check if we're on localhost - show placeholder instead
    const isLocalhost = window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1';

    if (isLocalhost) {
      console.log('AdSense: Running on localhost - ads will not display');
      return;
    }

    // Don't load if no publisher ID
    if (!publisherId) {
      console.warn('AdSense: No publisher ID configured');
      return;
    }

    try {
      // Push ad to adsbygoogle queue
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isLoaded.current = true;
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [publisherId]);

  // Determine ad style based on format
  const getAdStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      display: 'block',
      ...style,
    };

    if (responsive) {
      return baseStyle;
    }

    switch (format) {
      case 'rectangle':
        return { ...baseStyle, width: '300px', height: '250px' };
      case 'horizontal':
        return { ...baseStyle, width: '728px', height: '90px' };
      case 'vertical':
        return { ...baseStyle, width: '160px', height: '600px' };
      default:
        return baseStyle;
    }
  };

  // Show placeholder on localhost
  const isLocalhost = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocalhost || !publisherId) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded-lg ${className}`}
        style={{ minWidth: '300px', minHeight: '100px', ...style }}
      >
        <div className="text-center text-gray-400 text-sm p-4">
          <div className="mb-1">AdSense Ad</div>
          <div className="text-xs">Slot: {slotId}</div>
          <div className="text-xs text-gray-300 mt-1">
            {isLocalhost ? '(Localhost - no ads)' : '(No publisher ID)'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={adRef} className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={getAdStyle()}
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format={responsive ? 'auto' : undefined}
        data-full-width-responsive={responsive ? 'true' : undefined}
        data-ad-layout-key={layoutKey}
      />
    </div>
  );
}

/**
 * AdSense Script Loader - Add this once in your layout
 * This loads the AdSense library globally
 */
export function AdSenseScript({ publisherId }: { publisherId?: string }) {
  const pubId = publisherId || DEFAULT_PUBLISHER_ID;

  if (!pubId) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

/**
 * Responsive AdSense Banner - For horizontal banners (header/footer)
 */
export function AdSenseBanner({
  slotId,
  className = ''
}: {
  slotId: string;
  className?: string;
}) {
  return (
    <div className={`flex justify-center w-full ${className}`}>
      <GoogleAdsense
        slotId={slotId}
        format="horizontal"
        responsive
      />
    </div>
  );
}

/**
 * AdSense MREC (Medium Rectangle) - 300x250 ad
 */
export function AdSenseMrec({
  slotId,
  className = ''
}: {
  slotId: string;
  className?: string;
}) {
  return (
    <div className={`flex justify-center ${className}`}>
      <GoogleAdsense
        slotId={slotId}
        format="rectangle"
        style={{ width: '300px', height: '250px' }}
        responsive={false}
      />
    </div>
  );
}

/**
 * AdSense In-Article Ad - For placing within content
 */
export function AdSenseInArticle({
  slotId,
  layoutKey,
  className = ''
}: {
  slotId: string;
  layoutKey?: string;
  className?: string;
}) {
  return (
    <div className={`flex justify-center my-4 ${className}`}>
      <GoogleAdsense
        slotId={slotId}
        format="auto"
        layoutKey={layoutKey}
        responsive
      />
    </div>
  );
}

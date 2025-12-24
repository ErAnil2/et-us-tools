'use client';

import { useEffect, useState, useRef } from 'react';

declare global {
  interface Window {
    googletag?: {
      cmd: Array<() => void>;
      defineSlot: (adUnitPath: string, size: number[][], divId: string) => any;
      pubads: () => any;
      enableServices: () => void;
      display: (divId: string) => void;
      destroySlots: (slots?: any[]) => boolean;
    };
    _gptSlotsRegistered?: Set<string>;
  }
}

interface AdBannerProps {
  bannerId: string;
  className?: string;
  lazy?: boolean;
}

interface BannerConfig {
  id: string;
  enabled: boolean;
  script: string;
  dimensions: string;
  platform?: 'desktop' | 'mobile' | 'all';
  minContainerSize?: string;
  fallbackAd: {
    text: string;
    width: number;
    height: number;
  };
}

// Simple in-memory cache for banner configs
const bannerCache: Map<string, BannerConfig | null> = new Map();

// Track if GPT library is loaded
let gptLibraryLoaded = false;
let gptLibraryLoading = false;

// Track registered GPT slots to avoid duplicate registration
function getRegisteredSlots(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  if (!window._gptSlotsRegistered) {
    window._gptSlotsRegistered = new Set();
  }
  return window._gptSlotsRegistered;
}

// Load GPT library
function loadGptLibrary(): Promise<void> {
  return new Promise((resolve) => {
    if (gptLibraryLoaded) {
      resolve();
      return;
    }

    if (gptLibraryLoading) {
      // Wait for existing load
      const checkLoaded = setInterval(() => {
        if (gptLibraryLoaded) {
          clearInterval(checkLoaded);
          resolve();
        }
      }, 100);
      return;
    }

    gptLibraryLoading = true;

    // Initialize googletag
    window.googletag = window.googletag || { cmd: [] };

    const script = document.createElement('script');
    script.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
    script.async = true;
    script.onload = () => {
      gptLibraryLoaded = true;
      gptLibraryLoading = false;
      resolve();
    };
    script.onerror = () => {
      gptLibraryLoading = false;
      resolve(); // Resolve anyway to not block
    };
    document.head.appendChild(script);
  });
}

// Hook to detect if we're on mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export default function AdBanner({ bannerId, className = "", lazy = true }: AdBannerProps) {
  const [bannerConfig, setBannerConfig] = useState<BannerConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazy);
  const containerRef = useRef<HTMLDivElement>(null);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const hasExecuted = useRef(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px',
        threshold: 0
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy]);

  // Fetch banner config when visible
  useEffect(() => {
    if (!isVisible) return;

    // Check cache first (including null/error results)
    if (bannerCache.has(bannerId)) {
      const cached = bannerCache.get(bannerId);
      setBannerConfig(cached || null);
      setLoading(false);
      if (!cached) setError(true);
      return;
    }

    let isMounted = true;

    fetch(`/api/banners/${bannerId}`)
      .then(res => {
        if (!res.ok) throw new Error('Banner not found');
        return res.json();
      })
      .then(data => {
        if (isMounted) {
          bannerCache.set(bannerId, data);
          setBannerConfig(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          bannerCache.set(bannerId, null);
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [bannerId, isVisible]);

  // Execute ad scripts after banner config is loaded
  useEffect(() => {
    if (!bannerConfig?.script || !bannerConfig.enabled || hasExecuted.current) return;
    if (!adContainerRef.current) return;

    const executeAd = async () => {
      if (!adContainerRef.current || hasExecuted.current) return;

      hasExecuted.current = true;
      const container = adContainerRef.current;
      const scriptContent = bannerConfig.script;

      // Check if this is a GPT ad
      const isGptAd = scriptContent.includes('googletag') || scriptContent.includes('gpt.js');

      if (isGptAd) {
        // Load GPT library first
        await loadGptLibrary();

        // Extract div ID from the script (e.g., 'div-gpt-ad-1759823213529-0')
        const divIdMatch = scriptContent.match(/['"]div-gpt-ad[^'"]+['"]/);
        const divId = divIdMatch ? divIdMatch[0].replace(/['"]/g, '') : null;

        if (divId) {
          const registeredSlots = getRegisteredSlots();

          // Create the target div if it doesn't exist in this container
          let targetDiv = container.querySelector(`#${divId}`) as HTMLElement;
          if (!targetDiv) {
            targetDiv = document.createElement('div');
            targetDiv.id = divId;
            targetDiv.style.minWidth = `${bannerConfig.fallbackAd.width}px`;
            targetDiv.style.minHeight = `${bannerConfig.fallbackAd.height}px`;
            container.appendChild(targetDiv);
          }

          // Check if this slot has already been registered
          if (registeredSlots.has(divId)) {
            // Slot already registered, just refresh/display it
            if (window.googletag) {
              window.googletag.cmd.push(function() {
                window.googletag!.display(divId);
              });
            }
            return;
          }

          // Mark this slot as registered
          registeredSlots.add(divId);

          // Also check for any HTML content with divs (for format that includes div in script)
          const htmlMatch = scriptContent.match(/<div[^>]*id=['"]div-gpt-ad[^'"]+['"][^>]*>/);
          if (htmlMatch) {
            // Extract and set the div from script
            const nonScriptHtml = scriptContent.replace(/<script[\s\S]*?<\/script>/gi, '').trim();
            if (nonScriptHtml) {
              container.innerHTML = nonScriptHtml;
            }
          }

          // Parse and execute all scripts for GPT
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = scriptContent;

          const scripts = tempDiv.querySelectorAll('script');
          scripts.forEach((oldScript) => {
            const newScript = document.createElement('script');

            // Copy attributes
            Array.from(oldScript.attributes).forEach(attr => {
              newScript.setAttribute(attr.name, attr.value);
            });

            // Copy inline content
            if (oldScript.textContent) {
              newScript.textContent = oldScript.textContent;
            }

            // Append to body to execute
            document.body.appendChild(newScript);
          });
        }
      } else {
        // For non-GPT ads (AdSense, etc.), extract and set non-script HTML content
        const nonScriptHtml = scriptContent.replace(/<script[\s\S]*?<\/script>/gi, '').trim();
        if (nonScriptHtml) {
          container.innerHTML = nonScriptHtml;
        }

        // Parse and execute all scripts
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = scriptContent;

        const scripts = tempDiv.querySelectorAll('script');
        scripts.forEach((oldScript) => {
          const newScript = document.createElement('script');

          // Copy attributes
          Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });

          // Copy inline content
          if (oldScript.textContent) {
            newScript.textContent = oldScript.textContent;
          }

          // Append to body to execute
          document.body.appendChild(newScript);
        });
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(executeAd, 100);
    return () => clearTimeout(timer);
  }, [bannerConfig]);

  // If there's an error or no config, just render nothing
  if (error || (!loading && !bannerConfig)) {
    return null;
  }

  // Placeholder while not visible (for lazy loading)
  if (!isVisible || loading) {
    return (
      <div
        ref={containerRef}
        className={`banner-placeholder ${className}`}
        style={{ minHeight: '50px' }}
      />
    );
  }

  // Banner disabled
  if (!bannerConfig.enabled) {
    return null;
  }

  // Note: Platform-based visibility is now handled by CSS classes (md:hidden, hidden md:block)
  // in the parent components (BannerPlacements.tsx) rather than JS-based checks.
  // This avoids SSR hydration issues where isMobile starts as false.

  return (
    <div ref={containerRef} className={`banner-container ${className}`} data-banner-id={bannerId}>
      {bannerConfig.script ? (
        <div
          ref={adContainerRef}
          className="banner-content"
          style={{
            minWidth: `${bannerConfig.fallbackAd.width}px`,
            minHeight: `${bannerConfig.fallbackAd.height}px`
          }}
        />
      ) : (
        <div
          className="w-full h-full bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs text-center"
          style={{
            width: `${bannerConfig.fallbackAd.width}px`,
            height: `${bannerConfig.fallbackAd.height}px`
          }}
        >
          <div>
            <div className="mb-1">Ad Space</div>
            <div>{bannerConfig.fallbackAd.text}</div>
            <div className="text-gray-300">{bannerConfig.dimensions}</div>
          </div>
        </div>
      )}

      <style jsx>{`
        .banner-container {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          width: 100%;
          overflow: visible;
        }

        .banner-placeholder {
          display: block;
        }

        .banner-content {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        @media (max-width: 768px) {
          [data-banner-id="topBanner"] .banner-content,
          [data-banner-id="footerBanner"] .banner-content {
            transform: scale(0.45);
            transform-origin: center;
          }

          [data-banner-id="topBanner"],
          [data-banner-id="footerBanner"] {
            width: 100%;
            max-width: 330px;
            height: 41px;
            margin: 0 auto;
            overflow: hidden;
          }
        }

        @media (max-width: 480px) {
          [data-banner-id="topBanner"] .banner-content,
          [data-banner-id="footerBanner"] .banner-content {
            transform: scale(0.4);
          }

          [data-banner-id="topBanner"],
          [data-banner-id="footerBanner"] {
            max-width: 290px;
            height: 36px;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          [data-banner-id="topBanner"] .banner-content,
          [data-banner-id="footerBanner"] .banner-content {
            transform: scale(0.8);
            transform-origin: center;
          }

          [data-banner-id="topBanner"],
          [data-banner-id="footerBanner"] {
            max-width: 580px;
            height: 72px;
            overflow: hidden;
          }
        }
      `}</style>
    </div>
  );
}

// Export a responsive banner component that automatically picks mobile/desktop version
interface ResponsiveAdBannerProps {
  desktopBannerId: string;
  mobileBannerId: string;
  className?: string;
  lazy?: boolean;
}

export function ResponsiveAdBanner({
  desktopBannerId,
  mobileBannerId,
  className = "",
  lazy = true
}: ResponsiveAdBannerProps) {
  const isMobile = useIsMobile();

  return (
    <AdBanner
      bannerId={isMobile ? mobileBannerId : desktopBannerId}
      className={className}
      lazy={lazy}
    />
  );
}

// Clear the banner cache (useful when admin updates banner config)
export function clearBannerCache() {
  bannerCache.clear();
}

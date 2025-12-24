'use client';

import { useEffect, useState } from 'react';
import AdBanner from './AdBanner';

// Hook to detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

// Above the Fold Banner - Shows at the very top
export function AboveFoldBanner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center w-full ${className}`}>
      {/* Desktop */}
      <div className="hidden md:block">
        <AdBanner bannerId="webAboveFold" lazy={false} />
      </div>
      {/* Mobile */}
      <div className="md:hidden">
        <AdBanner bannerId="mobileAboveFold" lazy={false} />
      </div>
    </div>
  );
}

// Below Header/Navigation Banner (Both Desktop and Mobile)
export function BelowHeaderBanner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center w-full ${className}`}>
      {/* Desktop */}
      <div className="hidden md:block">
        <AdBanner bannerId="webBelowFold" lazy={false} />
      </div>
      {/* Mobile */}
      <div className="md:hidden">
        <AdBanner bannerId="mobileBelowHeader" lazy={false} />
      </div>
    </div>
  );
}

// Desktop-only Below Header Banner (Mobile banner is placed in page content below H1/subheading)
export function DesktopBelowHeaderBanner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center w-full ${className}`}>
      <AdBanner bannerId="webBelowFold" lazy={false} />
    </div>
  );
}

// Mobile-only Below Subheading Banner - To be placed below H1 and subheading in calculator/game/app pages
export function MobileBelowSubheadingBanner({ className = '' }: { className?: string }) {
  return (
    <div className={`md:hidden flex justify-center w-full my-3 ${className}`}>
      <AdBanner bannerId="mobileBelowHeader" lazy={false} />
    </div>
  );
}

// MREC Banner 1 - For desktop sidebar and mobile after first section
export function MrecBanner1({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`}>
      {/* Desktop */}
      <div className="hidden md:block">
        <AdBanner bannerId="webMrec1" />
      </div>
      {/* Mobile */}
      <div className="md:hidden">
        <AdBanner bannerId="mobileMrec1" />
      </div>
    </div>
  );
}

// MREC Banner 2 - For desktop and mobile before last section
export function MrecBanner2({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`}>
      {/* Desktop */}
      <div className="hidden md:block">
        <AdBanner bannerId="webMrec2" />
      </div>
      {/* Mobile */}
      <div className="md:hidden">
        <AdBanner bannerId="mobileMrec2" />
      </div>
    </div>
  );
}

// Desktop-only MREC for sidebar
export function SidebarMrec({ className = '' }: { className?: string }) {
  return (
    <div className={`hidden md:flex justify-center ${className}`}>
      <AdBanner bannerId="webMrec1" />
    </div>
  );
}

// Mobile-only MREC 1 (after first section)
export function MobileMrec1({ className = '' }: { className?: string }) {
  return (
    <div className={`md:hidden flex justify-center my-4 ${className}`}>
      <AdBanner bannerId="mobileMrec1" />
    </div>
  );
}

// Mobile-only MREC 2 (before last section)
export function MobileMrec2({ className = '' }: { className?: string }) {
  return (
    <div className={`md:hidden flex justify-center my-4 ${className}`}>
      <AdBanner bannerId="mobileMrec2" />
    </div>
  );
}

// Left Skinner Banner
export function LeftSkinnerBanner() {
  return (
    <div className="hidden xl:block fixed left-0 top-0 w-[162px] h-screen z-40">
      <div className="pr-0.5 h-full flex items-start pt-4">
        <AdBanner bannerId="webSkinnerLeft" lazy={true} />
      </div>
    </div>
  );
}

// Right Skinner Banner
export function RightSkinnerBanner() {
  return (
    <div className="hidden xl:block fixed right-0 top-0 w-[162px] h-screen z-40">
      <div className="pl-0.5 h-full flex items-start pt-4">
        <AdBanner bannerId="webSkinnerRight" lazy={true} />
      </div>
    </div>
  );
}

// Footer Banner - Dedicated footer banner positions (above footer section)
// Uses appropriate banner for desktop and mobile
export function FooterBanner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center w-full ${className}`}>
      {/* Desktop */}
      <div className="hidden md:block">
        <AdBanner bannerId="webFooterBanner" />
      </div>
      {/* Mobile */}
      <div className="md:hidden">
        <AdBanner bannerId="mobileFooterBanner" />
      </div>
    </div>
  );
}

// Calculator Page MREC - Shows below Calculate button
export function CalculatorMrec({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center my-4 ${className}`}>
      {/* Desktop */}
      <div className="hidden md:block">
        <AdBanner bannerId="webMrec1" />
      </div>
      {/* Mobile */}
      <div className="md:hidden">
        <AdBanner bannerId="mobileMrec1" />
      </div>
    </div>
  );
}

// Dual MREC Banners - Two side by side on desktop, stacked on mobile
export function DualMrecBanners({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center my-4 px-2 ${className}`}>
      {/* Desktop - Two side by side */}
      <div className="hidden md:grid grid-cols-2 gap-4 md:gap-6 max-w-[680px] w-full">
        <div className="flex justify-center min-w-0">
          <div className="w-full max-w-[336px]">
            <AdBanner bannerId="webMrec1" />
          </div>
        </div>
        <div className="flex justify-center min-w-0">
          <div className="w-full max-w-[336px]">
            <AdBanner bannerId="webMrec2" />
          </div>
        </div>
      </div>

      {/* Mobile - Stacked */}
      <div className="md:hidden flex flex-col gap-4 w-full max-w-[336px]">
        <div className="flex justify-center">
          <AdBanner bannerId="mobileMrec1" />
        </div>
        <div className="flex justify-center">
          <AdBanner bannerId="mobileMrec2" />
        </div>
      </div>
    </div>
  );
}

// Content with Right Sidebar MREC - Wrapper component
interface ContentWithSidebarProps {
  children: React.ReactNode;
  showSidebarAd?: boolean;
  className?: string;
}

export function ContentWithSidebarMrec({ children, showSidebarAd = true, className = '' }: ContentWithSidebarProps) {
  return (
    <div className={`flex gap-6 ${className}`}>
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>

      {/* Right Sidebar with MREC - Desktop only */}
      {showSidebarAd && (
        <div className="hidden lg:block w-[336px] flex-shrink-0">
          <div className="sticky top-4">
            <AdBanner bannerId="webMrec1" />
          </div>
        </div>
      )}
    </div>
  );
}

// In-Content MREC - For placing within article content
export function InContentMrec({ position = 1, className = '' }: { position?: 1 | 2; className?: string }) {
  const desktopBannerId = position === 1 ? 'webMrec1' : 'webMrec2';
  const mobileBannerId = position === 1 ? 'mobileMrec1' : 'mobileMrec2';

  return (
    <div className={`flex justify-center my-6 ${className}`}>
      {/* Desktop */}
      <div className="hidden md:block">
        <AdBanner bannerId={desktopBannerId} />
      </div>
      {/* Mobile */}
      <div className="md:hidden">
        <AdBanner bannerId={mobileBannerId} />
      </div>
    </div>
  );
}

// Calculator Page MREC Banners - Desktop: Both after calculation, Mobile: MREC1 after calculation, MREC2 after 3rd section
// This component renders BOTH banners on desktop (side by side) and ONLY MREC1 on mobile
export function CalculatorAfterCalcBanners({ className = '' }: { className?: string }) {
  return (
    <div className={`my-4 sm:my-6 md:my-8 px-2 ${className}`}>
      {/* Desktop - Two side by side after calculation section */}
      <div className="hidden md:flex justify-center">
        <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-[680px] w-full">
          <div className="flex justify-center min-w-0">
            <div className="w-full max-w-[336px]">
              <AdBanner bannerId="webMrec1" />
            </div>
          </div>
          <div className="flex justify-center min-w-0">
            <div className="w-full max-w-[336px]">
              <AdBanner bannerId="webMrec2" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile - Only MREC1 after calculation section */}
      <div className="md:hidden flex justify-center">
        <AdBanner bannerId="mobileMrec1" />
      </div>
    </div>
  );
}

// Calculator Page Mobile MREC2 - To be placed after 3rd section on mobile only
export function CalculatorMobileMrec2({ className = '' }: { className?: string }) {
  return (
    <div className={`md:hidden flex justify-center my-4 sm:my-6 px-2 ${className}`}>
      <AdBanner bannerId="mobileMrec2" />
    </div>
  );
}

// ============================================================================
// GAMES & APPS SIDEBAR BANNER COMPONENTS
// ============================================================================

// Sidebar MREC1 - Top position in right sidebar (Desktop only)
// For Games/Apps pages: This goes at the very top of the right sidebar
// Mobile MRECs should be placed in main content area using GameAppMobileMrec1/2
export function SidebarMrec1({ className = '' }: { className?: string }) {
  return (
    <div className={`hidden lg:flex justify-center ${className}`}>
      <div className="bg-gray-50 rounded-2xl p-2">
        <AdBanner bannerId="webMrec1" />
      </div>
    </div>
  );
}

// Sidebar MREC2 - After 2 widgets in right sidebar (Desktop only)
// For Games/Apps pages: This goes after 2 sidebar widgets/sections
// Mobile MRECs should be placed in main content area using GameAppMobileMrec1/2
export function SidebarMrec2({ className = '' }: { className?: string }) {
  return (
    <div className={`hidden lg:flex justify-center ${className}`}>
      <div className="bg-gray-50 rounded-2xl p-2">
        <AdBanner bannerId="webMrec2" />
      </div>
    </div>
  );
}

// Mobile MREC1 for Games/Apps - After first section ends (Mobile only)
export function GameAppMobileMrec1({ className = '' }: { className?: string }) {
  return (
    <div className={`lg:hidden flex justify-center my-4 px-2 ${className}`}>
      <div className="w-full max-w-[336px] flex justify-center">
        <AdBanner bannerId="mobileMrec1" />
      </div>
    </div>
  );
}

// Mobile MREC2 for Games/Apps - Where sidebar starts on mobile (Mobile only)
// This appears where the right sidebar content would start on mobile
export function GameAppMobileMrec2({ className = '' }: { className?: string }) {
  return (
    <div className={`lg:hidden flex justify-center my-4 px-2 ${className}`}>
      <div className="w-full max-w-[336px] flex justify-center">
        <AdBanner bannerId="mobileMrec2" />
      </div>
    </div>
  );
}

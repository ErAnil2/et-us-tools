'use client';

import HeaderClient from './HeaderClient';
import {
  AboveFoldBanner,
  DesktopBelowHeaderBanner,
  LeftSkinnerBanner,
  RightSkinnerBanner
} from './BannerPlacements';

interface ETLayoutProps {
  children: React.ReactNode;
}

export default function ETLayout({ children }: ETLayoutProps) {
  return (
    <>
      {/* Left Side Skinner Banner - Fixed position, hidden on mobile/tablet */}
      <LeftSkinnerBanner />

      {/* Right Side Skinner Banner - Fixed position, hidden on mobile/tablet */}
      <RightSkinnerBanner />

      {/* Main Content Area - with margins for fixed banners on xl screens */}
      <div className="min-h-screen xl:ml-[164px] xl:mr-[164px] overflow-x-hidden">
        {/* Top Banner - Above the Fold */}
        <div className="py-2">
          <div className="max-w-[1200px] mx-auto px-2">
            <AboveFoldBanner />
          </div>
        </div>

        {/* ET Header - Client Component for interactivity */}
        <HeaderClient />

        {/* Below Navigation Banner - Desktop Only (Mobile banner is placed below H1/subheading in page content) */}
        <div className="py-2 bg-gray-50 hidden md:block">
          <div className="max-w-[1200px] mx-auto px-2">
            <DesktopBelowHeaderBanner />
          </div>
        </div>

        {/* Main Content */}
        <main className="px-2">
          {children}
        </main>
      </div>
    </>
  );
}

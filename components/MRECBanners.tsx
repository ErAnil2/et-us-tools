'use client';

import { DualMrecBanners, MrecBanner1, MrecBanner2, MobileMrec1, MobileMrec2, CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from './BannerPlacements';

interface MRECBannersProps {
  className?: string;
}

// Default export - Dual MREC Banners (two on desktop, stacked on mobile)
export default function MRECBanners({ className = '' }: MRECBannersProps) {
  return <DualMrecBanners className={className} />;
}

// Re-export individual components for flexibility
export { MrecBanner1, MrecBanner2, MobileMrec1, MobileMrec2, DualMrecBanners, CalculatorAfterCalcBanners, CalculatorMobileMrec2 };

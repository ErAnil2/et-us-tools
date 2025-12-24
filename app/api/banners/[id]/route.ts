import { NextRequest, NextResponse } from 'next/server';
import { getBanner } from '@/lib/firebase';

// Legacy banner ID mapping (old ID -> new ID)
const legacyBannerMapping: Record<string, string> = {
  'topBanner': 'webAboveFold',
  'footerBanner': 'webBelowFold',
  'leftSkinBanner': 'webSkinnerLeft',
  'rightSkinBanner': 'webSkinnerRight',
};

// Reverse mapping (new ID -> old ID) for fallback
const reverseBannerMapping: Record<string, string> = {
  'webAboveFold': 'topBanner',
  'webBelowFold': 'footerBanner',
  'webSkinnerLeft': 'leftSkinBanner',
  'webSkinnerRight': 'rightSkinBanner',
};

// Default banner configurations (fallback if not in Firebase)
const defaultBanners: Record<string, any> = {
  // Desktop Banners
  webAboveFold: {
    id: 'webAboveFold',
    name: 'WEB Above the Fold',
    enabled: true,
    script: '',
    dimensions: '728x90, 970x250, 970x90',
    minContainerSize: '728x90',
    platform: 'desktop',
    fallbackAd: { text: 'Advertisement', width: 728, height: 90 }
  },
  webBelowFold: {
    id: 'webBelowFold',
    name: 'WEB Below the Fold',
    enabled: true,
    script: '',
    dimensions: '728x90, 970x250, 970x90',
    minContainerSize: '728x90',
    platform: 'desktop',
    fallbackAd: { text: 'Advertisement', width: 728, height: 90 }
  },
  webMrec1: {
    id: 'webMrec1',
    name: 'WEB MREC 1',
    enabled: true,
    script: '',
    dimensions: '336x280, 300x250',
    minContainerSize: '300x250',
    platform: 'desktop',
    fallbackAd: { text: 'Advertisement', width: 300, height: 250 }
  },
  webMrec2: {
    id: 'webMrec2',
    name: 'WEB MREC 2',
    enabled: true,
    script: '',
    dimensions: '336x280, 300x250',
    minContainerSize: '300x250',
    platform: 'desktop',
    fallbackAd: { text: 'Advertisement', width: 300, height: 250 }
  },
  webSkinnerLeft: {
    id: 'webSkinnerLeft',
    name: 'WEB Skinner Left Side',
    enabled: true,
    script: '',
    dimensions: '120x600, 160x600, 125x600',
    minContainerSize: '120x600',
    platform: 'desktop',
    fallbackAd: { text: 'Ad', width: 160, height: 600 }
  },
  webSkinnerRight: {
    id: 'webSkinnerRight',
    name: 'WEB Skinner Right Side',
    enabled: true,
    script: '',
    dimensions: '160x600, 125x600, 120x600',
    minContainerSize: '120x600',
    platform: 'desktop',
    fallbackAd: { text: 'Ad', width: 160, height: 600 }
  },
  // Mobile Banners
  mobileAboveFold: {
    id: 'mobileAboveFold',
    name: 'Mobile Above the Fold',
    enabled: true,
    script: '',
    dimensions: '320x100, 320x50',
    minContainerSize: '320x50',
    platform: 'all',
    fallbackAd: { text: 'Advertisement', width: 320, height: 50 }
  },
  mobileBelowHeader: {
    id: 'mobileBelowHeader',
    name: 'Mobile Below Navigation/Header',
    enabled: true,
    script: '',
    dimensions: '320x50',
    minContainerSize: '320x50',
    platform: 'all',
    fallbackAd: { text: 'Advertisement', width: 320, height: 50 }
  },
  mobileMrec1: {
    id: 'mobileMrec1',
    name: 'Mobile MREC 1',
    enabled: true,
    script: '',
    dimensions: '336x280, 300x250',
    minContainerSize: '300x250',
    platform: 'all',
    fallbackAd: { text: 'Advertisement', width: 300, height: 250 }
  },
  mobileMrec2: {
    id: 'mobileMrec2',
    name: 'Mobile MREC 2',
    enabled: true,
    script: '',
    dimensions: '300x250, 336x280',
    minContainerSize: '300x250',
    platform: 'all',
    fallbackAd: { text: 'Advertisement', width: 300, height: 250 }
  },
  // Footer Banners (Above Footer Section)
  webFooterBanner: {
    id: 'webFooterBanner',
    name: 'WEB Footer Banner',
    enabled: true,
    script: '',
    dimensions: '728x90, 970x250, 970x90',
    minContainerSize: '728x90',
    platform: 'desktop',
    fallbackAd: { text: 'Advertisement', width: 728, height: 90 }
  },
  mobileFooterBanner: {
    id: 'mobileFooterBanner',
    name: 'Mobile Footer Banner',
    enabled: true,
    script: '',
    dimensions: '320x100, 320x50',
    minContainerSize: '320x50',
    platform: 'all',
    fallbackAd: { text: 'Advertisement', width: 320, height: 50 }
  },
  // Legacy banner IDs (for backward compatibility)
  topBanner: {
    id: 'topBanner',
    name: 'Top Banner (Legacy)',
    enabled: true,
    script: '',
    dimensions: '728x90',
    platform: 'all',
    fallbackAd: { text: 'Advertisement', width: 728, height: 90 }
  },
  footerBanner: {
    id: 'footerBanner',
    name: 'Footer Banner (Legacy)',
    enabled: true,
    script: '',
    dimensions: '728x90',
    platform: 'all',
    fallbackAd: { text: 'Advertisement', width: 728, height: 90 }
  },
  leftSkinBanner: {
    id: 'leftSkinBanner',
    name: 'Left Skin Banner (Legacy)',
    enabled: true,
    script: '',
    dimensions: '160x600',
    platform: 'desktop',
    fallbackAd: { text: 'Ad', width: 160, height: 600 }
  },
  rightSkinBanner: {
    id: 'rightSkinBanner',
    name: 'Right Skin Banner (Legacy)',
    enabled: true,
    script: '',
    dimensions: '160x600',
    platform: 'desktop',
    fallbackAd: { text: 'Ad', width: 160, height: 600 }
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bannerId } = await params;

    // Try to get from Firebase first
    let firebaseBanner = await getBanner(bannerId);

    // If banner exists but has no script, check legacy banner ID
    if (firebaseBanner && !firebaseBanner.script && reverseBannerMapping[bannerId]) {
      const legacyBanner = await getBanner(reverseBannerMapping[bannerId]);
      if (legacyBanner && legacyBanner.script) {
        // Use script from legacy banner
        firebaseBanner = {
          ...firebaseBanner,
          script: legacyBanner.script
        };
      }
    }

    // If no banner found, try legacy ID
    if (!firebaseBanner && reverseBannerMapping[bannerId]) {
      const legacyBanner = await getBanner(reverseBannerMapping[bannerId]);
      if (legacyBanner) {
        // Return legacy banner data with new ID
        return NextResponse.json({
          ...legacyBanner,
          id: bannerId
        });
      }
    }

    if (firebaseBanner) {
      return NextResponse.json(firebaseBanner);
    }

    // Fallback to default configuration
    if (defaultBanners[bannerId]) {
      return NextResponse.json(defaultBanners[bannerId]);
    }

    return NextResponse.json(
      { error: 'Banner not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching banner:', error);

    // On error, try to return default
    const { id: bannerId } = await params;
    if (defaultBanners[bannerId]) {
      return NextResponse.json(defaultBanners[bannerId]);
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

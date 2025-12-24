import { NextRequest, NextResponse } from 'next/server';
import { getAllBanners, getBanner, saveBanner, deleteBanner } from '@/lib/firebase';

// Default banners configuration based on placement specifications
const defaultBanners = {
  // ====== DESKTOP BANNERS ======
  webAboveFold: {
    id: 'webAboveFold',
    name: 'WEB Above the Fold',
    enabled: true,
    script: '',
    dimensions: '728x90, 970x250, 970x90',
    minContainerSize: '728x90',
    platform: 'desktop',
    category: 'desktop',
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
    category: 'desktop',
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
    category: 'desktop',
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
    category: 'desktop',
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
    category: 'desktop',
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
    category: 'desktop',
    fallbackAd: { text: 'Ad', width: 160, height: 600 }
  },
  // ====== MOBILE BANNERS ======
  mobileAboveFold: {
    id: 'mobileAboveFold',
    name: 'Mobile Above the Fold',
    enabled: true,
    script: '',
    dimensions: '320x100, 320x50',
    minContainerSize: '320x50',
    platform: 'mobile',
    category: 'mobile',
    fallbackAd: { text: 'Advertisement', width: 320, height: 50 }
  },
  mobileBelowHeader: {
    id: 'mobileBelowHeader',
    name: 'Mobile Below Navigation/Header',
    enabled: true,
    script: '',
    dimensions: '336x280, 300x250',
    minContainerSize: '300x250',
    platform: 'mobile',
    category: 'mobile',
    fallbackAd: { text: 'Advertisement', width: 336, height: 280 }
  },
  mobileMrec1: {
    id: 'mobileMrec1',
    name: 'Mobile MREC 1',
    enabled: true,
    script: '',
    dimensions: '336x280, 300x250',
    minContainerSize: '300x250',
    platform: 'mobile',
    category: 'mobile',
    fallbackAd: { text: 'Advertisement', width: 300, height: 250 }
  },
  mobileMrec2: {
    id: 'mobileMrec2',
    name: 'Mobile MREC 2',
    enabled: true,
    script: '',
    dimensions: '300x250, 336x280',
    minContainerSize: '300x250',
    platform: 'mobile',
    category: 'mobile',
    fallbackAd: { text: 'Advertisement', width: 300, height: 250 }
  }
};

// GET - Fetch all banners or specific banner
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bannerId = searchParams.get('id');

  try {
    if (bannerId) {
      const bannerData = await getBanner(bannerId);
      // Return default if not found in Firebase
      if (!bannerData && defaultBanners[bannerId as keyof typeof defaultBanners]) {
        return NextResponse.json(defaultBanners[bannerId as keyof typeof defaultBanners]);
      }
      return NextResponse.json(bannerData);
    }

    // Get all banners from Firebase
    const firebaseBanners = await getAllBanners();

    // Merge with defaults (Firebase data takes precedence)
    const mergedBanners = { ...defaultBanners, ...firebaseBanners };

    return NextResponse.json({ banners: mergedBanners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    // Return defaults on error
    return NextResponse.json({ banners: defaultBanners });
  }
}

// POST - Create or update banner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, enabled, script, dimensions, fallbackAd, platform, category, minContainerSize } = body;

    if (!id) {
      return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 });
    }

    // Get default banner to preserve any fields not provided
    const defaultBanner = defaultBanners[id as keyof typeof defaultBanners];

    const success = await saveBanner(id, {
      name: name || defaultBanner?.name || id,
      enabled: enabled !== undefined ? enabled : true,
      script: script || '',
      dimensions: dimensions || defaultBanner?.dimensions || '300x250',
      platform: platform || defaultBanner?.platform || 'desktop',
      category: category || defaultBanner?.category || 'desktop',
      minContainerSize: minContainerSize || defaultBanner?.minContainerSize || '300x250',
      fallbackAd: fallbackAd || defaultBanner?.fallbackAd || { text: 'Advertisement', width: 300, height: 250 }
    });

    if (success) {
      const savedBanner = await getBanner(id);
      return NextResponse.json({ success: true, data: savedBanner });
    } else {
      return NextResponse.json({ error: 'Failed to save banner data' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error saving banner:', error);
    return NextResponse.json({ error: 'Failed to save banner data' }, { status: 500 });
  }
}

// DELETE - Remove banner
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bannerId = searchParams.get('id');

    if (!bannerId) {
      return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 });
    }

    const success = await deleteBanner(bannerId);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}

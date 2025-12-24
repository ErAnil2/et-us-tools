import { NextRequest, NextResponse } from 'next/server';
import { getAllPageSEO, getPageSEO, savePageSEO, deletePageSEO, getPageSEOByPath } from '@/lib/seo-json';

// GET - Fetch all SEO data or specific page
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pagePath = searchParams.get('path');
  const pageId = searchParams.get('id');

  try {
    if (pageId) {
      const pageData = getPageSEO(pageId);
      return NextResponse.json(pageData);
    }

    if (pagePath) {
      // Return specific page data with all fields
      const pageData = getPageSEOByPath(pagePath);
      if (pageData) {
        // Format single page response
        const pages: { [key: string]: any } = {};
        pages[pagePath] = {
          metaTitle: pageData.metaTitle || '',
          metaDescription: pageData.metaDescription || '',
          h1: pageData.h1Title || '',
          subHeading: pageData.subHeading || '',
          keywords: pageData.keywords || '',
          canonical: pageData.canonical || '',
          ogTitle: pageData.ogTitle || '',
          ogDescription: pageData.ogDescription || '',
          ogImage: pageData.ogImage || '',
          faqs: (pageData.faqs || []).map((faq: any) => ({
            question: faq.question || '',
            answer: faq.answer || '',
            id: faq.id,
            order: faq.order
          }))
        };
        return NextResponse.json({ pages });
      }
      return NextResponse.json({ pages: {} });
    }

    // Get all pages and format for admin panel
    const allPages = getAllPageSEO();
    const pages: { [key: string]: any } = {};

    allPages.forEach(page => {
      pages[page.pagePath] = {
        metaTitle: page.metaTitle || '',
        metaDescription: page.metaDescription || '',
        h1: page.h1Title || '',
        subHeading: page.subHeading || '',
        keywords: page.keywords || '',
        canonical: page.canonical || '',
        ogTitle: page.ogTitle || '',
        ogDescription: page.ogDescription || '',
        ogImage: page.ogImage || '',
        faqs: (page.faqs || []).map((faq: any) => ({
          question: faq.question || '',
          answer: faq.answer || '',
          id: faq.id,
          order: faq.order
        }))
      };
    });

    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    return NextResponse.json({ pages: {} });
  }
}

// POST - Create or update SEO data for a page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      path: pagePath,
      metaTitle,
      metaDescription,
      h1,
      subHeading,
      keywords,
      canonical,
      ogTitle,
      ogDescription,
      ogImage,
      faqs
    } = body;

    if (!pagePath) {
      return NextResponse.json({ error: 'Page path is required' }, { status: 400 });
    }

    // Generate pageId from path
    const pageId = pagePath.split('/').pop() || pagePath.replace(/\//g, '-');

    // Determine category from path
    let category = 'calculators';
    if (pagePath.includes('/games/')) {
      category = 'games';
    } else if (pagePath.includes('/apps/')) {
      category = 'apps';
    }

    // Transform FAQs to include id and order if not present
    const transformedFaqs = (faqs || []).map((faq: { question: string; answer: string; id?: string; order?: number }, index: number) => ({
      id: faq.id || `faq-${Date.now()}-${index}`,
      question: faq.question || '',
      answer: faq.answer || '',
      order: faq.order !== undefined ? faq.order : index + 1
    }));

    const success = savePageSEO(pageId, {
      pagePath,
      pageName: pageId.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      category,
      metaTitle: metaTitle || '',
      metaDescription: metaDescription || '',
      h1Title: h1 || '',
      subHeading: subHeading || '',
      keywords: keywords || '',
      canonical: canonical || '',
      ogTitle: ogTitle || '',
      ogDescription: ogDescription || '',
      ogImage: ogImage || '',
      faqs: transformedFaqs,
      faqsEnabled: (transformedFaqs && transformedFaqs.length > 0),
      isActive: true
    });

    if (success) {
      return NextResponse.json({
        success: true,
        data: {
          metaTitle,
          metaDescription,
          h1,
          subHeading,
          keywords,
          canonical,
          ogTitle,
          ogDescription,
          ogImage,
          faqs: transformedFaqs
        }
      });
    } else {
      return NextResponse.json({ error: 'Failed to save SEO data' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error saving SEO data:', error);
    return NextResponse.json({ error: 'Failed to save SEO data' }, { status: 500 });
  }
}

// DELETE - Remove SEO data for a page
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pagePath = searchParams.get('path');

    if (!pagePath) {
      return NextResponse.json({ error: 'Page path is required' }, { status: 400 });
    }

    // Generate pageId from path
    const pageId = pagePath.split('/').pop() || pagePath.replace(/\//g, '-');

    const success = deletePageSEO(pageId);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to delete SEO data' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting SEO data:', error);
    return NextResponse.json({ error: 'Failed to delete SEO data' }, { status: 500 });
  }
}

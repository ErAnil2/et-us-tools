import { NextRequest, NextResponse } from 'next/server';
import { getAllPageSEO, savePageSEO, getPagesByCategory } from '@/lib/seo-json';

// GET all page SEO entries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let pages;
    if (category) {
      pages = getPagesByCategory(category);
    } else {
      pages = getAllPageSEO();
    }

    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching page SEO:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new page SEO entry
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.pageId) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    const success = savePageSEO(data.pageId, data);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to create page SEO' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating page SEO:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

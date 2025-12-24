import { NextRequest, NextResponse } from 'next/server';
import {
  getPageSEO,
  savePageSEO,
  deletePageSEO,
  addFAQToPage,
  updateFAQ,
  deleteFAQ
} from '@/lib/seo-json';

// GET specific page SEO
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pageId } = await params;
    const pageSEO = getPageSEO(pageId);

    if (!pageSEO) {
      return NextResponse.json(
        { error: 'Page SEO not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(pageSEO);
  } catch (error) {
    console.error('Error fetching page SEO:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update page SEO
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pageId } = await params;
    const data = await request.json();

    const success = savePageSEO(pageId, {
      ...data,
      updatedBy: data.updatedBy || 'admin'
    });

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update page SEO' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating page SEO:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete page SEO
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pageId } = await params;
    const success = deletePageSEO(pageId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete page SEO' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page SEO:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - FAQ operations
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pageId } = await params;
    const data = await request.json();
    const { action, faq, faqId, updates } = data;

    let success = false;

    switch (action) {
      case 'add-faq':
        if (!faq) {
          return NextResponse.json(
            { error: 'FAQ data is required' },
            { status: 400 }
          );
        }
        success = addFAQToPage(pageId, faq);
        break;

      case 'update-faq':
        if (!faqId || !updates) {
          return NextResponse.json(
            { error: 'FAQ ID and updates are required' },
            { status: 400 }
          );
        }
        success = updateFAQ(pageId, faqId, updates);
        break;

      case 'delete-faq':
        if (!faqId) {
          return NextResponse.json(
            { error: 'FAQ ID is required' },
            { status: 400 }
          );
        }
        success = deleteFAQ(pageId, faqId);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: add-faq, update-faq, or delete-faq' },
          { status: 400 }
        );
    }

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to perform FAQ action' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error performing FAQ action:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

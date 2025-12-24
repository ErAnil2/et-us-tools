import { NextRequest, NextResponse } from 'next/server';
import { readSEOJson, writeSEOJson, getAllPageSEO, bulkImportPageSEO, PageSEOData } from '@/lib/seo-json';

// Get all pages from the JSON data
function getAllPagesFromData(): PageSEOData[] {
  return getAllPageSEO();
}

// GET - Get bulk SEO status
export async function GET(request: NextRequest) {
  try {
    const data = readSEOJson();

    const allPages = getAllPagesFromData();

    return NextResponse.json({
      total: allPages.length,
      withSEO: allPages.length,
      missingSEO: 0,
      existing: allPages.length,
      missingPages: [],
      categories: {
        calculators: data.calculators.length,
        games: data.games.length,
        apps: data.apps.length
      }
    });
  } catch (error) {
    console.error('Error getting bulk SEO status:', error);
    return NextResponse.json({ error: 'Failed to get SEO status' }, { status: 500 });
  }
}

// POST - Bulk operations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, category } = body;

    if (action === 'export-all') {
      // Export all SEO data
      const data = readSEOJson();

      return NextResponse.json({
        success: true,
        message: `Exported ${data.calculators.length + data.games.length + data.apps.length} pages`,
        data: data,
        counts: {
          calculators: data.calculators.length,
          games: data.games.length,
          apps: data.apps.length,
          total: data.calculators.length + data.games.length + data.apps.length
        }
      });
    }

    if (action === 'get-stats') {
      const data = readSEOJson();
      return NextResponse.json({
        success: true,
        counts: {
          calculators: data.calculators.length,
          games: data.games.length,
          apps: data.apps.length,
          total: data.calculators.length + data.games.length + data.apps.length
        }
      });
    }

    if (action === 'import-category' && category) {
      if (!['calculators', 'games', 'apps'].includes(category)) {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
      }

      const data = readSEOJson();
      const categoryPages = data[category as keyof typeof data];

      return NextResponse.json({
        success: true,
        message: `Category ${category} has ${categoryPages.length} pages`,
        details: {
          category,
          total: categoryPages.length
        }
      });
    }

    return NextResponse.json({
      error: 'Invalid action. Use: export-all, get-stats, or import-category'
    }, { status: 400 });
  } catch (error) {
    console.error('Error in bulk SEO operation:', error);
    return NextResponse.json({ error: 'Bulk operation failed' }, { status: 500 });
  }
}

// DELETE - Clear SEO data (disabled for safety)
export async function DELETE(request: NextRequest) {
  return NextResponse.json({
    error: 'Bulk delete is disabled for safety. Delete individual pages from the admin panel.'
  }, { status: 403 });
}

import { NextRequest, NextResponse } from 'next/server';
import {
  getCalculatorFAQs,
  updateCalculatorFAQs,
  deleteCalculatorFAQs,
  addFAQToCalculator,
  updateFAQInCalculator,
  deleteFAQFromCalculator
} from '@/lib/database';

// GET specific calculator FAQs
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: calculatorId } = await params;
    const faqData = getCalculatorFAQs(calculatorId);

    if (!faqData) {
      return NextResponse.json(
        { error: 'Calculator FAQs not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(faqData);
  } catch (error) {
    console.error('Error fetching calculator FAQs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update calculator FAQs
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: calculatorId } = await params;
    const data = await request.json();

    const success = updateCalculatorFAQs(calculatorId, data);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update calculator FAQs' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating calculator FAQs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete calculator FAQs
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: calculatorId } = await params;
    const success = deleteCalculatorFAQs(calculatorId);

    if (!success) {
      return NextResponse.json(
        { error: 'Calculator FAQs not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting calculator FAQs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Add/Update/Delete individual FAQ
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: calculatorId } = await params;
    const data = await request.json();
    const { action, faq, faqId, updates } = data;

    let success = false;

    switch (action) {
      case 'add':
        if (!faq) {
          return NextResponse.json(
            { error: 'FAQ data is required for add action' },
            { status: 400 }
          );
        }
        success = addFAQToCalculator(calculatorId, faq);
        break;

      case 'update':
        if (!faqId || !updates) {
          return NextResponse.json(
            { error: 'FAQ ID and updates are required for update action' },
            { status: 400 }
          );
        }
        success = updateFAQInCalculator(calculatorId, faqId, updates);
        break;

      case 'delete':
        if (!faqId) {
          return NextResponse.json(
            { error: 'FAQ ID is required for delete action' },
            { status: 400 }
          );
        }
        success = deleteFAQFromCalculator(calculatorId, faqId);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: add, update, or delete' },
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

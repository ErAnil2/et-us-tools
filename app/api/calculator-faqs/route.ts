import { NextRequest, NextResponse } from 'next/server';
import { getAllCalculatorFAQs, updateCalculatorFAQs } from '@/lib/database';

// GET all calculator FAQs
export async function GET() {
  try {
    const allFaqs = getAllCalculatorFAQs();
    return NextResponse.json(allFaqs);
  } catch (error) {
    console.error('Error fetching calculator FAQs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new calculator FAQ entry
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.calculatorId) {
      return NextResponse.json(
        { error: 'Calculator ID is required' },
        { status: 400 }
      );
    }

    const success = updateCalculatorFAQs(data.calculatorId, {
      calculatorName: data.calculatorName || data.calculatorId,
      calculatorPath: data.calculatorPath || `/us/tools/calculators/${data.calculatorId}`,
      isActive: data.isActive ?? true,
      updatedBy: data.updatedBy || 'admin',
      faqs: data.faqs || []
    });

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to create calculator FAQs' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating calculator FAQs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

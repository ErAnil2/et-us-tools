'use client';

import { useState, useEffect } from 'react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

interface CalculatorFAQsProps {
  calculatorId: string;
  fallbackFaqs?: FAQ[];
  className?: string;
}

export default function CalculatorFAQs({ calculatorId, fallbackFaqs = [], className = '' }: CalculatorFAQsProps) {
  const [faqs, setFaqs] = useState<FAQ[]>(fallbackFaqs);
  const [loading, setLoading] = useState(true);
  const [schemaData, setSchemaData] = useState<object | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch(`/api/calculator-faqs/${calculatorId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.isActive && data.faqs && data.faqs.length > 0) {
            const sortedFaqs = data.faqs.sort((a: FAQ, b: FAQ) => a.order - b.order);
            setFaqs(sortedFaqs);

            // Generate Schema.org FAQPage data
            setSchemaData({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": sortedFaqs.map((faq: FAQ) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            });
          }
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        // Keep fallback FAQs if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [calculatorId]);

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 ${className}`}>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  return (
    <>
      {/* Schema.org FAQPage markup */}
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}

      <div className={`bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 ${className}`}>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.id} className="group border border-gray-200 rounded-lg">
              <summary className="flex justify-between items-center cursor-pointer p-4 font-semibold text-gray-900 hover:bg-gray-50">
                {faq.question}
                <span className="ml-2 text-gray-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-4 pb-4 text-gray-700">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}

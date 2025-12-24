'use client';

import { useState, useEffect } from 'react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

interface PageSEO {
  pageId: string;
  h1Title: string;
  subHeading: string;
  faqs: FAQ[];
  faqsEnabled: boolean;
  isActive: boolean;
}

interface PageSEOContentProps {
  pageId: string;
  // Fallback content to use if Firebase data is not available
  fallbackH1?: string;
  fallbackSubHeading?: string;
  fallbackFaqs?: FAQ[];
  // Control which sections to render
  showH1?: boolean;
  showSubHeading?: boolean;
  showFAQs?: boolean;
  // Custom class names
  containerClassName?: string;
  h1ClassName?: string;
  subHeadingClassName?: string;
  faqsClassName?: string;
}

export default function PageSEOContent({
  pageId,
  fallbackH1 = '',
  fallbackSubHeading = '',
  fallbackFaqs = [],
  showH1 = true,
  showSubHeading = true,
  showFAQs = true,
  containerClassName = '',
  h1ClassName = 'text-3xl md:text-4xl font-bold text-gray-900 mb-4',
  subHeadingClassName = 'text-lg text-gray-600 mb-6',
  faqsClassName = 'bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8'
}: PageSEOContentProps) {
  const [seoData, setSeoData] = useState<PageSEO | null>(null);
  const [loading, setLoading] = useState(true);
  const [faqSchemaData, setFaqSchemaData] = useState<object | null>(null);

  useEffect(() => {
    const fetchSEOData = async () => {
      try {
        const response = await fetch(`/api/page-seo/${pageId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.isActive) {
            setSeoData(data);

            // Generate Schema.org FAQPage data if FAQs are enabled
            if (data.faqsEnabled && data.faqs && data.faqs.length > 0) {
              const sortedFaqs = data.faqs.sort((a: FAQ, b: FAQ) => a.order - b.order);
              setFaqSchemaData({
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
        }
      } catch (error) {
        console.error('Error fetching SEO data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSEOData();
  }, [pageId]);

  // Use Firebase data or fallback
  const h1Title = seoData?.h1Title || fallbackH1;
  const subHeading = seoData?.subHeading || fallbackSubHeading;
  const faqs = (seoData?.faqsEnabled && seoData?.faqs?.length > 0)
    ? seoData.faqs.sort((a, b) => a.order - b.order)
    : fallbackFaqs;

  if (loading) {
    return (
      <div className={containerClassName}>
        {showH1 && (
          <div className="animate-pulse h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
        )}
        {showSubHeading && (
          <div className="animate-pulse h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* FAQ Schema.org markup */}
      {showFAQs && faqSchemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaData) }}
        />
      )}

      <div className={containerClassName}>
        {/* H1 Title */}
        {showH1 && h1Title && (
          <h1 className={h1ClassName}>{h1Title}</h1>
        )}

        {/* Sub Heading */}
        {showSubHeading && subHeading && (
          <p className={subHeadingClassName}>{subHeading}</p>
        )}

        {/* FAQs */}
        {showFAQs && faqs.length > 0 && (
          <div className={faqsClassName}>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details key={faq.id} className="group border border-gray-200 rounded-lg">
                  <summary className="flex justify-between items-center cursor-pointer p-4 font-semibold text-gray-900 hover:bg-gray-50">
                    {faq.question}
                    <span className="ml-2 text-gray-500 group-open:rotate-180 transition-transform">
                      &#9660;
                    </span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-700">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Separate component for just the header (H1 + SubHeading)
export function PageHeader({
  pageId,
  fallbackH1 = '',
  fallbackSubHeading = '',
  h1ClassName = 'text-3xl md:text-4xl font-bold text-gray-900 mb-4',
  subHeadingClassName = 'text-lg text-gray-600 mb-6',
  containerClassName = ''
}: {
  pageId: string;
  fallbackH1?: string;
  fallbackSubHeading?: string;
  h1ClassName?: string;
  subHeadingClassName?: string;
  containerClassName?: string;
}) {
  return (
    <PageSEOContent
      pageId={pageId}
      fallbackH1={fallbackH1}
      fallbackSubHeading={fallbackSubHeading}
      showH1={true}
      showSubHeading={true}
      showFAQs={false}
      containerClassName={containerClassName}
      h1ClassName={h1ClassName}
      subHeadingClassName={subHeadingClassName}
    />
  );
}

// Separate component for just the FAQs (Firebase-powered)
export function FirebaseFAQs({
  pageId,
  fallbackFaqs = [],
  className = 'bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8'
}: {
  pageId: string;
  fallbackFaqs?: FAQ[];
  className?: string;
}) {
  return (
    <PageSEOContent
      pageId={pageId}
      fallbackFaqs={fallbackFaqs}
      showH1={false}
      showSubHeading={false}
      showFAQs={true}
      faqsClassName={className}
    />
  );
}

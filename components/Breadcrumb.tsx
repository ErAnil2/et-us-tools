import Link from 'next/link';

export interface BreadcrumbItem {
  name: string;
  url: string;
  current?: boolean;
}

interface Props {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: Props) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.current ? undefined : `https://economictimes.indiatimes.com${item.url}`
    }))
  };

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center space-x-1 text-sm text-gray-600 mb-4 ${className}`}
      >
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <svg
                className="mx-2 h-4 w-4 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}

            {item.current ? (
              <span
                className="font-medium text-gray-900"
                aria-current="page"
              >
                {item.name}
              </span>
            ) : (
              <Link
                href={item.url}
                className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:underline"
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Structured Data for SEO - rendered server-side */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}

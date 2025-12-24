import Link from 'next/link';

interface Calculator {
  href: string;
  title: string;
  description: string;
  color: string;
}

interface Props {
  title?: string;
  calculators: Calculator[];
}

export default function RelatedCalculatorCards({ title = "Related Calculators", calculators }: Props) {
  const displayCalculators = calculators.slice(0, 6);

  return (
    <section className="bg-gray-50 rounded-xl p-8 mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayCalculators.map((calc, index) => (
          <Link key={index} href={calc.href} className="group">
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 group-hover:border-pink-300">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${calc.color} flex items-center justify-center flex-shrink-0`}>
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-pink-600 transition-colors">
                    {calc.title}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">{calc.description}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-pink-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

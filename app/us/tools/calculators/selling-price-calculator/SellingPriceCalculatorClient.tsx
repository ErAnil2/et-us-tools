'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Selling Price Calculator?",
    answer: "A Selling Price Calculator is a free online tool designed to help you quickly and accurately calculate selling price-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Selling Price Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Selling Price Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Selling Price Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function SellingPriceCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('selling-price-calculator');

  const [costPrice, setCostPrice] = useState(40.00);
  const [markupPercent, setMarkupPercent] = useState(60);

  const [sellingPrice, setSellingPrice] = useState(0);
  const [profitAmount, setProfitAmount] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);
  const [costPercentage, setCostPercentage] = useState(0);

  // Chart references
  const priceChartRef = useRef<HTMLCanvasElement>(null);
  const priceAnalysisChartRef = useRef<HTMLCanvasElement>(null);
  const priceChartInstance = useRef<any>(null);
  const priceAnalysisChartInstance = useRef<any>(null);

  // Calculate selling price
  useEffect(() => {
    calculateSellingPrice();
  }, [costPrice, markupPercent]);

  const calculateSellingPrice = () => {
    if (costPrice <= 0) {
      return;
    }

    const profit = costPrice * (markupPercent / 100);
    const selling = costPrice + profit;
    const margin = selling > 0 ? (profit / selling) * 100 : 0;
    const costPct = selling > 0 ? (costPrice / selling) * 100 : 0;

    setSellingPrice(selling);
    setProfitAmount(profit);
    setProfitMargin(margin);
    setCostPercentage(costPct);
  };

  // Load Chart.js and initialize charts
  useEffect(() => {
    const loadChartJS = async () => {
      if (typeof window !== 'undefined' && !window.Chart) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.async = true;
        document.body.appendChild(script);

        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Initialize charts after Chart.js is loaded
      setTimeout(() => {
        updatePriceChart();
        updatePriceAnalysisChart();
      }, 100);
    };

    loadChartJS();

    return () => {
      if (priceChartInstance.current) priceChartInstance.current.destroy();
      if (priceAnalysisChartInstance.current) priceAnalysisChartInstance.current.destroy();
    };
  }, []);

  // Update charts when values change
  useEffect(() => {
    if (window.Chart) {
      updatePriceChart();
    }
  }, [costPrice, profitAmount]);

  useEffect(() => {
    if (window.Chart) {
      updatePriceAnalysisChart();
    }
  }, [costPrice, markupPercent]);

  const updatePriceChart = () => {
    if (!priceChartRef.current || !window.Chart) return;

    const ctx = priceChartRef.current.getContext('2d');
    if (!ctx) return;

    if (priceChartInstance.current) {
      priceChartInstance.current.destroy();
    }

    priceChartInstance.current = new window.Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Cost', 'Profit'],
        datasets: [{
          data: [costPrice, Math.max(0, profitAmount)],
          backgroundColor: ['#F59E0B', '#10B981'],
          borderColor: ['#D97706', '#059669'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = total > 0 ? ((context.raw / total) * 100).toFixed(1) : '0';
                return context.label + ': $' + context.raw.toFixed(2) + ' (' + percentage + '%)';
              }
            }
          }
        }
      }
    });
  };

  const updatePriceAnalysisChart = () => {
    if (!priceAnalysisChartRef.current || !window.Chart) return;

    const ctx = priceAnalysisChartRef.current.getContext('2d');
    if (!ctx) return;

    if (priceAnalysisChartInstance.current) {
      priceAnalysisChartInstance.current.destroy();
    }

    priceAnalysisChartInstance.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: ['10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
        datasets: [{
          label: 'Selling Price ($)',
          data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(percent => costPrice * (1 + percent/100)),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }, {
          label: 'Current Markup',
          data: Array(10).fill(costPrice * (1 + markupPercent/100)),
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderDash: [5, 5],
          pointRadius: 6,
          pointBackgroundColor: '#EF4444'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value: any) {
                return '$' + value.toFixed(0);
              }
            },
            title: {
              display: true,
              text: 'Selling Price ($)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Markup Percentage'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context: any) {
                return context.dataset.label + ': $' + context.raw.toFixed(2);
              }
            }
          }
        }
      }
    });
  };

  return (
    <div className="max-w-[1180px] mx-auto p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Selling Price Calculator')}</h1>
        <p className="text-lg text-gray-600">Calculate the optimal selling price based on cost and desired markup percentage</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">Calculate Selling Price</h2>
          <p className="text-gray-600">Find the optimal selling price based on cost and desired markup</p>
        </div>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Enter Values</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price ($)</label>
              <input
                type="number"
                id="costPrice"
                value={costPrice}
                onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                step="0.01"
                placeholder="e.g., 40.00"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desired Markup (%)</label>
              <input
                type="number"
                id="markupPercent"
                value={markupPercent}
                onChange={(e) => setMarkupPercent(parseFloat(e.target.value) || 0)}
                min="0" step="0.1"
                placeholder="e.g., 60"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="text-center">
              <button
                onClick={calculateSellingPrice}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-3 sm:px-4 md:px-6 rounded-lg transition-colors"
              >
                Calculate Selling Price
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Results</h3>

              <div className="space-y-4">
                <div className="bg-green-100 rounded-lg p-4 text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600" id="sellingPrice">${sellingPrice.toFixed(2)}</div>
                  <div className="text-green-700">Selling Price</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Profit Amount:</span>
                    <span id="profitAmount" className="font-semibold text-green-600">${profitAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Profit Margin:</span>
                    <span id="profitMargin" className="font-semibold text-blue-600">{profitMargin.toFixed(1)}%</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Cost Percentage:</span>
                    <span id="costPercentage" className="font-semibold text-gray-600">{costPercentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Composition Chart */}
            <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 border">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Price Composition</h4>
              <div className="relative h-64">
                <canvas ref={priceChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Price Analysis Chart */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6 text-center">Price Structure Analysis</h3>
        <div className="relative h-80">
          <canvas ref={priceAnalysisChartRef}></canvas>
        </div>
      </div>
{/* Information Section */}
      <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-green-800 mb-4">Selling Price Formula</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-green-700">
          <div>
            <h4 className="font-semibold mb-2">Key Formula:</h4>
            <p className="mb-4">Selling Price = Cost Price + (Cost Price × Markup %)</p>
            <h4 className="font-semibold mb-2">Example:</h4>
            <p>If Cost = $40 and Markup = 60%</p>
            <p>Selling Price = $40 + ($40 × 0.60) = $64</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Key Points:</h4>
            <ul className="space-y-1">
              <li>• Markup is based on cost price</li>
              <li>• Higher markup = higher profit</li>
              <li>• Consider market competition</li>
              <li>• Factor in additional costs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Industry Examples */}
      <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-yellow-800 mb-4">Typical Markup Examples</h3>
        <div className="grid md:grid-cols-3 gap-4 text-yellow-700">
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Clothing Retail</h4>
            <p className="text-2xl font-bold text-green-600">100-300%</p>
            <p className="text-sm">High fashion markup</p>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Electronics</h4>
            <p className="text-2xl font-bold text-green-600">20-50%</p>
            <p className="text-sm">Competitive market</p>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Restaurants</h4>
            <p className="text-2xl font-bold text-green-600">200-400%</p>
            <p className="text-sm">Food + service</p>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
      {/* Enhanced Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Business Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">💰</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="selling-price-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}

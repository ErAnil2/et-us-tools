'use client';

import { useState, useEffect, useRef } from 'react';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Hra Calculator?",
    answer: "A Hra Calculator is a free online tool designed to help you quickly and accurately calculate hra-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Hra Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Hra Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Hra Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function HraCalculatorClient() {
  // Input state
  const [basicSalary, setBasicSalary] = useState<number>(50000);
  const [hraReceived, setHraReceived] = useState<number>(20000);
  const [rentPaid, setRentPaid] = useState<number>(25000);
  const [isMetroCity, setIsMetroCity] = useState<boolean>(true);

  // Results state
  const [hraExemption, setHraExemption] = useState<number>(0);
  const [yearlyExemption, setYearlyExemption] = useState<number>(0);
  const [taxableHra, setTaxableHra] = useState<number>(0);
  const [taxSavings, setTaxSavings] = useState<number>(0);

  // Component state
  const [compActualHra, setCompActualHra] = useState<number>(0);
  const [rentMinusBasic, setRentMinusBasic] = useState<number>(0);
  const [percentageOfBasic, setPercentageOfBasic] = useState<number>(0);

  // Chart refs
  const hraChartRef = useRef<HTMLCanvasElement>(null);
  const benefitsChartRef = useRef<HTMLCanvasElement>(null);
  const hraChartInstance = useRef<any>(null);
  const benefitsChartInstance = useRef<any>(null);

  // Calculate HRA
  const calculateHRA = () => {
    // Calculate components
    const rentMinusBasicValue = Math.max(0, rentPaid - (0.1 * basicSalary));
    const percentageOfBasicValue = isMetroCity ? 0.5 * basicSalary : 0.4 * basicSalary;

    // Calculate exemption (least of the three)
    const exemption = Math.min(
      hraReceived,
      rentMinusBasicValue,
      percentageOfBasicValue
    );

    const taxableHraValue = Math.max(0, hraReceived - exemption);
    const yearlyExemptionValue = exemption * 12;
    const taxSavingsValue = exemption * 0.3; // Assuming 30% tax bracket

    // Update state
    setHraExemption(exemption);
    setYearlyExemption(yearlyExemptionValue);
    setTaxableHra(taxableHraValue);
    setTaxSavings(taxSavingsValue);
    setCompActualHra(hraReceived);
    setRentMinusBasic(rentMinusBasicValue);
    setPercentageOfBasic(percentageOfBasicValue);

    // Update charts
    updateCharts(exemption, taxableHraValue, hraReceived);
  };

  // Update Chart.js charts
  const updateCharts = (exemption: number, taxableHraValue: number, hraReceivedValue: number) => {
    // Load Chart.js dynamically
    if (typeof window !== 'undefined' && window.Chart) {
      // Doughnut chart for HRA breakdown
      if (hraChartRef.current) {
        const ctx1 = hraChartRef.current.getContext('2d');
        if (ctx1) {
          // Destroy previous chart
          if (hraChartInstance.current) {
            hraChartInstance.current.destroy();
          }

          hraChartInstance.current = new window.Chart(ctx1, {
            type: 'doughnut',
            data: {
              labels: ['Exempt HRA', 'Taxable HRA'],
              datasets: [{
                data: [exemption, taxableHraValue],
                backgroundColor: ['#10B981', '#EF4444']
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom' },
                title: { display: true, text: 'HRA Tax Breakdown' }
              }
            }
          });
        }
      }

      // Bar chart for tax benefits
      if (benefitsChartRef.current) {
        const ctx2 = benefitsChartRef.current.getContext('2d');
        if (ctx2) {
          // Destroy previous chart
          if (benefitsChartInstance.current) {
            benefitsChartInstance.current.destroy();
          }

          benefitsChartInstance.current = new window.Chart(ctx2, {
            type: 'bar',
            data: {
              labels: ['Without HRA', 'With HRA Exemption'],
              datasets: [{
                label: 'Taxable Amount (₹)',
                data: [hraReceivedValue, taxableHraValue],
                backgroundColor: ['#EF4444', '#10B981'],
                borderWidth: 0
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: { display: true, text: 'Tax Benefits Comparison' }
              },
              scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Amount (₹)' } }
              }
            }
          });
        }
      }
    }
  };

  // Load Chart.js on mount
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.async = true;
    script.onload = () => {
      calculateHRA();
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup charts on unmount
      if (hraChartInstance.current) {
        hraChartInstance.current.destroy();
      }
      if (benefitsChartInstance.current) {
        benefitsChartInstance.current.destroy();
      }
      // Remove script
      const scriptElements = document.querySelectorAll('script[src="https://cdn.jsdelivr.net/npm/chart.js"]');
      scriptElements.forEach(s => s.remove());
    };
  }, []);

  // Auto-calculate when inputs change
  useEffect(() => {
    calculateHRA();
  }, [basicSalary, hraReceived, rentPaid, isMetroCity]);

  // Handle preset templates
  const handleTemplate = (salary: number, hra: number, rent: number, metro: boolean) => {
    setBasicSalary(salary);
    setHraReceived(hra);
    setRentPaid(rent);
    setIsMetroCity(metro);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 sm:px-2 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">HRA Calculator</h1>
        <p className="text-base sm:text-lg text-gray-600">Calculate your House Rent Allowance exemption and tax benefits with detailed analysis</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">HRA Details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary (₹/month)</label>
                <input
                  type="number"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(parseFloat(e.target.value) || 0)}
                  min="1000"
                  step="1000"
                  className="w-full px-2 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">HRA Received (₹/month)</label>
                <input
                  type="number"
                  value={hraReceived}
                  onChange={(e) => setHraReceived(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="1000"
                  className="w-full px-2 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rent Paid (₹/month)</label>
                <input
                  type="number"
                  value={rentPaid}
                  onChange={(e) => setRentPaid(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="1000"
                  className="w-full px-2 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City Type</label>
                <div className="grid grid-cols-1 gap-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="cityType"
                      value="metro"
                      checked={isMetroCity}
                      onChange={() => setIsMetroCity(true)}
                      className="form-radio text-blue-600"
                    />
                    <span className="ml-2 text-sm">Metro City (50% of Basic)</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="cityType"
                      value="non-metro"
                      checked={!isMetroCity}
                      onChange={() => setIsMetroCity(false)}
                      className="form-radio text-blue-600"
                    />
                    <span className="ml-2 text-sm">Non-Metro City (40% of Basic)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Quick HRA Scenarios */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick HRA Scenarios</h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleTemplate(30000, 12000, 15000, true)} className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-center transition-colors">
                  <div className="font-medium text-xs">Metro Resident</div>
                  <div className="text-xs">₹30K, ₹15K rent</div>
                </button>
                <button onClick={() => handleTemplate(50000, 20000, 25000, false)} className="p-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-center transition-colors">
                  <div className="font-medium text-xs">Non-Metro</div>
                  <div className="text-xs">₹50K, ₹25K rent</div>
                </button>
                <button onClick={() => handleTemplate(80000, 40000, 35000, true)} className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg text-center transition-colors">
                  <div className="font-medium text-xs">High Earner</div>
                  <div className="text-xs">₹80K, ₹35K rent</div>
                </button>
                <button onClick={() => handleTemplate(40000, 16000, 12000, false)} className="p-2 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg text-center transition-colors">
                  <div className="font-medium text-xs">Low Rent</div>
                  <div className="text-xs">₹40K, ₹12K rent</div>
                </button>
                <button onClick={() => handleTemplate(60000, 30000, 45000, true)} className="p-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-center transition-colors">
                  <div className="font-medium text-xs">High Rent</div>
                  <div className="text-xs">₹60K, ₹45K rent</div>
                </button>
                <button onClick={() => handleTemplate(25000, 10000, 8000, false)} className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-center transition-colors">
                  <div className="font-medium text-xs">Budget Living</div>
                  <div className="text-xs">₹25K, ₹8K rent</div>
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">HRA Exemption</h2>
            <div className="space-y-3">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-sm text-green-700">Monthly HRA Exemption</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">₹{Math.round(hraExemption).toLocaleString('en-IN')}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <div className="text-xs text-gray-600">Yearly Exemption</div>
                  <div className="text-lg font-bold">₹{Math.round(yearlyExemption).toLocaleString('en-IN')}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <div className="text-xs text-gray-600">Taxable HRA</div>
                  <div className="text-lg font-bold text-red-600">₹{Math.round(taxableHra).toLocaleString('en-IN')}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <div className="text-xs text-gray-600">HRA Received</div>
                  <div className="text-lg font-bold">₹{hraReceived.toLocaleString('en-IN')}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <div className="text-xs text-gray-600">Tax Savings*</div>
                  <div className="text-lg font-bold text-green-600">₹{Math.round(taxSavings).toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div className="mt-4">
                <canvas ref={hraChartRef} style={{ maxHeight: '250px' }}></canvas>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 HRA Calculation</h3>
            <p className="text-xs text-blue-800">HRA exemption is the least of: (1) Actual HRA received, (2) Rent paid - 10% of basic salary, (3) 50%/40% of basic salary for metro/non-metro cities. Keep rent receipts and rental agreements for tax filing.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-4 md:gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">HRA Components</h3>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-2 text-left border">Component</th>
                      <th className="px-2 py-2 text-right border">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="px-2 py-2 border">Actual HRA Received</td>
                      <td className="px-2 py-2 text-right border">{compActualHra.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-2 py-2 border">Rent - 10% of Basic</td>
                      <td className="px-2 py-2 text-right border">{Math.round(rentMinusBasic).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-2 py-2 border">50%/40% of Basic</td>
                      <td className="px-2 py-2 text-right border">{Math.round(percentageOfBasic).toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Tax Benefits Chart</h3>
              <canvas ref={benefitsChartRef} style={{ maxHeight: '240px' }}></canvas>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="hra-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* SEO Content */}
      <section className="prose max-w-none">
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">HRA Exemption Rules</h3>
            <p className="text-blue-800 mb-4">
              HRA exemption is calculated as the least of the following:
            </p>
            <div className="bg-white rounded-lg p-4">
              <ol className="text-sm text-gray-600 list-none mt-2 space-y-2">
                <li>1. Actual HRA received from employer</li>
                <li>2. Rent paid minus 10% of basic salary</li>
                <li>3. 50% of basic salary for metro cities OR 40% of basic salary for non-metro cities</li>
              </ol>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding HRA</h2>
          <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 md:mb-6">
            House Rent Allowance (HRA) is a component of salary provided by employers to help employees meet their
            rental expenses. The tax exemption on HRA helps reduce the taxable income of employees who live in rented
            accommodation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h4 className="text-lg font-semibold text-blue-900 mb-3">Basic Salary</h4>
              <p className="text-blue-800">Core component for HRA calculation</p>
            </div>

            <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h4 className="text-lg font-semibold text-green-900 mb-3">City Type</h4>
              <p className="text-green-800">Affects exemption percentage</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h4 className="text-lg font-semibold text-purple-900 mb-3">Rent Paid</h4>
              <p className="text-purple-800">Actual rent determines exemption</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">How to Use This Calculator</h2>
          <ol className="list-decimal pl-6 mb-4 sm:mb-6 md:mb-8">
            <li>Enter your monthly basic salary</li>
            <li>Input HRA received from employer</li>
            <li>Enter monthly rent paid</li>
            <li>Select your city type (Metro/Non-Metro)</li>
            <li>Click Calculate to see your HRA exemption</li>
          </ol>

          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Documents Required for HRA Claim</h2>
          <ul className="list-disc pl-6 mb-4 sm:mb-6 md:mb-8">
            <li>Rent receipts</li>
            <li>Rental agreement</li>
            <li>Landlord&apos;s PAN (if rent &gt; ₹1 lakh per year)</li>
            <li>Salary slips showing HRA component</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What is HRA?</h3>
              <p className="text-gray-700">
                House Rent Allowance (HRA) is a component of salary structure that employers provide to employees to
                meet their rental expenses. It&apos;s partially exempt from income tax under Section 10(13A).
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Which cities are considered Metro cities?</h3>
              <p className="text-gray-700">
                Delhi NCR, Mumbai, Kolkata, and Chennai are considered Metro cities for HRA calculation. The HRA
                exemption limit is 50% of basic salary for these cities compared to 40% for non-metro cities.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I claim HRA if living with parents?</h3>
              <p className="text-gray-700">
                You cannot claim HRA exemption if you live in your own house or in a house owned by your parents.
                HRA exemption is only available when you actually pay rent for accommodation.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is PAN of landlord mandatory?</h3>
              <p className="text-gray-700">
                PAN of landlord is mandatory if the annual rent exceeds ₹1 lakh. For rent below this amount, PAN
                is not mandatory but rent receipts and rental agreement should be maintained.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What if I don&apos;t receive HRA?</h3>
              <p className="text-gray-700">
                If you don&apos;t receive HRA but pay rent, you can claim deduction under Section 80GG of the Income
                Tax Act, subject to certain conditions and limits.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

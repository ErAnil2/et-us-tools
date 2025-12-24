'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface CryptoPortfolioClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface Holding {
  id: number;
  crypto: string;
  cryptoName: string;
  amount: number;
  purchasePrice: number;
  currentPrice: number;
}

const popularCryptos = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'binancecoin', symbol: 'BNB', name: 'Binance Coin' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Crypto Portfolio Calculator?",
    answer: "A Crypto Portfolio Calculator is a free online tool designed to help you quickly and accurately calculate crypto portfolio-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Crypto Portfolio Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Crypto Portfolio Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Crypto Portfolio Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function CryptoPortfolioClient({ relatedCalculators = defaultRelatedCalculators }: CryptoPortfolioClientProps) {
  const { getH1, getSubHeading } = usePageSEO('crypto-portfolio-calculator');

  const [holdings, setHoldings] = useState<Holding[]>([
    {
      id: 1,
      crypto: 'BTC',
      cryptoName: 'Bitcoin',
      amount: 1,
      purchasePrice: 50000,
      currentPrice: 65000
    }
  ]);

  const [totalValue, setTotalValue] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalGainLoss, setTotalGainLoss] = useState(0);
  const [totalReturnPercent, setTotalReturnPercent] = useState(0);
  const [bestPerformer, setBestPerformer] = useState('');
  const [largestHolding, setLargestHolding] = useState(0);
  const [diversityScore, setDiversityScore] = useState('Low');
  const [riskLevel, setRiskLevel] = useState('High');

  useEffect(() => {
    calculatePortfolio();
  }, [holdings]);

  const calculatePortfolio = () => {
    let value = 0;
    let investment = 0;
    let bestReturn = -Infinity;
    let bestCrypto = '';

    holdings.forEach(holding => {
      const currentValue = holding.amount * holding.currentPrice;
      const investmentValue = holding.amount * holding.purchasePrice;
      const returnPercent = investmentValue > 0 ? ((currentValue - investmentValue) / investmentValue) * 100 : 0;

      value += currentValue;
      investment += investmentValue;

      if (returnPercent > bestReturn) {
        bestReturn = returnPercent;
        bestCrypto = holding.crypto;
      }
    });

    const gainLoss = value - investment;
    const returnPercent = investment > 0 ? (gainLoss / investment) * 100 : 0;

    setTotalValue(value);
    setTotalInvestment(investment);
    setTotalGainLoss(gainLoss);
    setTotalReturnPercent(returnPercent);
    setBestPerformer(bestCrypto);

    // Calculate largest holding percentage
    if (holdings.length > 0 && value > 0) {
      const largest = Math.max(...holdings.map(h => (h.amount * h.currentPrice) / value * 100));
      setLargestHolding(largest);
    }

    // Diversity score based on number of holdings
    if (holdings.length === 1) {
      setDiversityScore('Low');
      setRiskLevel('High');
    } else if (holdings.length <= 3) {
      setDiversityScore('Medium');
      setRiskLevel('Medium');
    } else {
      setDiversityScore('High');
      setRiskLevel('Low');
    }
  };

  const addHolding = () => {
    const newId = Math.max(...holdings.map(h => h.id), 0) + 1;
    setHoldings([...holdings, {
      id: newId,
      crypto: 'BTC',
      cryptoName: 'Bitcoin',
      amount: 1,
      purchasePrice: 50000,
      currentPrice: 65000
    }]);
  };

  const removeHolding = (id: number) => {
    if (holdings.length > 1) {
      setHoldings(holdings.filter(h => h.id !== id));
    }
  };

  const updateHolding = (id: number, field: keyof Holding, value: any) => {
    setHoldings(holdings.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getHoldingMetrics = (holding: Holding) => {
    const currentValue = holding.amount * holding.currentPrice;
    const investmentValue = holding.amount * holding.purchasePrice;
    const gainLoss = currentValue - investmentValue;
    return { currentValue, investmentValue, gainLoss };
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Link href="/us/tools" className="text-blue-600 hover:text-blue-800 text-sm md:text-base">
          Home
        </Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600 text-sm md:text-base">Crypto Portfolio Calculator</span>
      </div>

      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4">{getH1('Crypto Portfolio Calculator')}</h1>
        <p className="text-sm md:text-base text-gray-600">
          Track your cryptocurrency investments, calculate returns, and analyze portfolio performance with real-time insights.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Holdings Input */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Portfolio Holdings</h2>

            <div className="space-y-4 mb-4">
              {holdings.map((holding) => (
                <div key={holding.id} className="border rounded-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cryptocurrency</label>
                      <select
                        value={holding.crypto}
                        onChange={(e) => {
                          const selected = popularCryptos.find(c => c.symbol === e.target.value);
                          updateHolding(holding.id, 'crypto', e.target.value);
                          if (selected) updateHolding(holding.id, 'cryptoName', selected.name);
                        }}
                        className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {popularCryptos.map(crypto => (
                          <option key={crypto.symbol} value={crypto.symbol}>
                            {crypto.name} ({crypto.symbol})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount Held</label>
                        <input
                          type="number"
                          value={holding.amount}
                          onChange={(e) => updateHolding(holding.id, 'amount', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.00001"
                          className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price ($)</label>
                        <input
                          type="number"
                          value={holding.purchasePrice}
                          onChange={(e) => updateHolding(holding.id, 'purchasePrice', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Price ($)</label>
                      <input
                        type="number"
                        value={holding.currentPrice}
                        onChange={(e) => updateHolding(holding.id, 'currentPrice', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {holdings.length > 1 && (
                      <div className="text-right">
                        <button
                          onClick={() => removeHolding(holding.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addHolding}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              + Add Another Crypto
            </button>
          </div>

          {/* Portfolio Analysis */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Portfolio Analysis</h2>
            <div className="space-y-3">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-sm text-green-700">Total Portfolio Value</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">{formatCurrency(totalValue)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 border">
                  <div className="text-xs text-gray-600">Total Investment</div>
                  <div className="text-lg font-bold text-blue-600">{formatCurrency(totalInvestment)}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border">
                  <div className="text-xs text-gray-600">Total Gain/Loss</div>
                  <div className={`text-lg font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)}
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 border">
                  <div className="text-xs text-gray-600">Return %</div>
                  <div className={`text-lg font-bold ${totalReturnPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalReturnPercent >= 0 ? '+' : ''}{totalReturnPercent.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <div className="text-xs text-gray-600">Best Performer</div>
                  <div className="text-lg font-bold">{bestPerformer}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimers */}
        <div className="mt-6">
          <div className="mb-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Crypto Investment Tips</h3>
            <p className="text-xs text-blue-800">Diversify your crypto portfolio across different cryptocurrencies and market caps. Never invest more than you can afford to lose. Consider dollar-cost averaging to reduce volatility impact. Keep your crypto in secure wallets and stay updated with market trends.</p>
          </div>

          <div className="mb-4 p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Price Data Disclaimer</h3>
            <p className="text-xs text-yellow-800">Cryptocurrency prices displayed may be delayed and can vary from actual market prices. This calculator is for informational purposes only. Always verify current prices on official exchanges or trading platforms before making investment decisions. Past performance does not guarantee future results.</p>
          </div>

          {/* Holdings Breakdown */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-4 md:gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Holdings Breakdown</h3>
              <div className="space-y-3">
                {holdings.map(holding => {
                  const metrics = getHoldingMetrics(holding);
                  return (
                    <div key={holding.id} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-800">{holding.cryptoName} ({holding.crypto})</span>
                        <span className="text-sm text-gray-600">{holding.amount.toFixed(5)} {holding.crypto}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="text-gray-600">Investment</div>
                          <div className="font-semibold">{formatCurrency(metrics.investmentValue)}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Current Value</div>
                          <div className="font-semibold">{formatCurrency(metrics.currentValue)}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Gain/Loss</div>
                          <div className={`font-semibold ${metrics.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {metrics.gainLoss >= 0 ? '+' : ''}{formatCurrency(metrics.gainLoss)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Portfolio Metrics */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Portfolio Metrics</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="text-sm text-gray-600">Largest Holding</div>
                  <div className="text-2xl font-bold text-blue-600">{largestHolding.toFixed(1)}%</div>
                  <p className="text-xs text-gray-500 mt-1">Of total portfolio</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="text-sm text-gray-600">Portfolio Diversity</div>
                  <div className="text-2xl font-bold text-green-600">{diversityScore}</div>
                  <p className="text-xs text-gray-500 mt-1">Diversification level</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="text-sm text-gray-600">Risk Level</div>
                  <div className={`text-2xl font-bold ${riskLevel === 'High' ? 'text-red-600' : riskLevel === 'Medium' ? 'text-orange-600' : 'text-green-600'}`}>
                    {riskLevel}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Based on allocation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Educational Content */}
      <section className="prose max-w-none mt-8 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 md:p-8">
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">Crypto Portfolio Calculation</h3>
            <p className="text-blue-800 mb-4">Calculate your cryptocurrency portfolio performance:</p>
            <div className="bg-white rounded-lg p-4">
              <p className="font-mono text-sm mb-2">Portfolio Value = Σ (Amount × Current Price)</p>
              <p className="font-mono text-sm mb-2">Total Return = (Current Value - Investment) / Investment × 100</p>
            </div>
</div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Cryptocurrency Portfolio Management</h2>
          <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 md:mb-6">
            Effective crypto portfolio management involves diversification, risk assessment, and regular rebalancing.
            Track your investments across different cryptocurrencies to optimize returns while managing risk.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h4 className="text-lg font-semibold text-blue-900 mb-3">Diversification</h4>
              <p className="text-blue-800 text-sm">Spread investments across different crypto assets to reduce risk</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h4 className="text-lg font-semibold text-green-900 mb-3">Risk Management</h4>
              <p className="text-green-800 text-sm">Only invest what you can afford to lose in volatile crypto markets</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h4 className="text-lg font-semibold text-purple-900 mb-3">Regular Monitoring</h4>
              <p className="text-purple-800 text-sm">Track performance and rebalance portfolio based on market conditions</p>
            </div>
          </div>
        </div>
      </section>
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Investment Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="group">
              <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all">
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Cryptocurrency Portfolio Management Strategies</h2>
        <div className="prose max-w-none text-gray-600 space-y-4">
          <p>
            Cryptocurrency portfolio management requires a different approach than traditional investing due to the asset class&apos;s extreme volatility and 24/7 market operation. While Bitcoin and Ethereum dominate most portfolios as relatively stable large-cap holdings, allocating portions to mid-cap altcoins and emerging projects can enhance returns—though with significantly higher risk. A well-constructed crypto portfolio balances potential upside with risk management through proper position sizing and diversification.
          </p>
          <p>
            Dollar-cost averaging (DCA) is particularly effective for cryptocurrency investing, helping smooth out volatility by investing fixed amounts at regular intervals regardless of price. This strategy removes emotional decision-making and reduces the impact of buying at market peaks. Many investors combine DCA for core holdings like Bitcoin with strategic lump-sum purchases during significant market corrections, treating 30-50% drawdowns as accumulation opportunities rather than panic triggers.
          </p>
          <p>
            Portfolio rebalancing maintains your target allocation as different assets appreciate at varying rates. If Bitcoin allocation grows from 50% to 70% of your portfolio during a bull run, rebalancing involves selling some Bitcoin and buying underweight assets. This systematic approach locks in gains and maintains risk levels. Many investors rebalance quarterly or when any position deviates more than 10% from its target allocation.
          </p>
          <p>
            Risk management in crypto extends beyond diversification. Position sizing limits individual asset exposure—many advise no single altcoin exceeding 5-10% of portfolio value. Using hardware wallets for long-term holdings, spreading assets across multiple exchanges, and maintaining detailed records for tax purposes are essential practices. The crypto market&apos;s volatility means realistic expectations: 80% drawdowns have occurred historically, and investors should only allocate funds they can afford to lose entirely.
          </p>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What percentage of my investment portfolio should be in cryptocurrency?</h3>
            <p className="text-gray-600">Most financial advisors recommend limiting crypto exposure to 1-5% of your total investment portfolio due to its high volatility and speculative nature. Conservative investors might allocate 1-2%, while those with higher risk tolerance and longer time horizons might go up to 10%. Never invest more than you can afford to lose completely, and ensure traditional investments (stocks, bonds, real estate) form your portfolio&apos;s foundation before adding crypto exposure.</p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">How should I diversify within my crypto portfolio?</h3>
            <p className="text-gray-600">A common framework allocates 50-70% to large-cap cryptocurrencies (Bitcoin, Ethereum), 20-30% to established mid-caps with strong use cases, and 10-20% to smaller, higher-risk projects with growth potential. Diversify across categories: store of value (Bitcoin), smart contract platforms (Ethereum, Solana), DeFi protocols, and specific sectors like gaming or infrastructure. Avoid over-diversification—holding 50+ small positions makes portfolio management impractical.</p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I calculate my cryptocurrency gains and losses for taxes?</h3>
            <p className="text-gray-600">In the US, cryptocurrency is taxed as property. Calculate gains by subtracting your cost basis (purchase price + fees) from sale proceeds. Use FIFO (First In, First Out) or specific identification methods to determine which coins were sold. Short-term gains (held less than one year) are taxed as ordinary income; long-term gains receive preferential rates. Track every transaction including trades between cryptocurrencies—each is a taxable event. Consider crypto tax software to automate calculations.</p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What is the best way to store my cryptocurrency holdings?</h3>
            <p className="text-gray-600">For long-term holdings exceeding $1,000, use hardware wallets (Ledger, Trezor) that store private keys offline, protecting against exchange hacks and online threats. Keep trading amounts on reputable exchanges for convenience. Never share seed phrases, store them in multiple secure physical locations (not digitally), and consider metal backup plates for fire/water protection. Enable two-factor authentication everywhere and use unique, strong passwords for each exchange account.</p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">How often should I rebalance my crypto portfolio?</h3>
            <p className="text-gray-600">Most investors rebalance quarterly or when any position deviates 10% or more from its target allocation. Given crypto&apos;s volatility, threshold-based rebalancing (triggered by allocation drift) often works better than calendar-based approaches. During extreme bull or bear markets, rebalancing more frequently can lock in gains or enable buying dips. Consider tax implications—frequent rebalancing triggers taxable events. Some investors only rebalance when adding new funds to avoid unnecessary tax events.</p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What metrics should I track for my crypto portfolio performance?</h3>
            <p className="text-gray-600">Track total portfolio value, cost basis (total invested), and overall return percentage. Monitor individual position sizes to ensure no single asset becomes overweight. Compare performance against benchmarks like Bitcoin or a crypto index. Calculate risk-adjusted returns considering volatility—a 50% gain with 80% drawdown differs from 50% gain with 30% drawdown. Review portfolio correlation—holding many highly-correlated altcoins provides false diversification. Regularly assess whether positions still align with your investment thesis.</p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="crypto-portfolio-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

type BusinessModel = 'dropshipping' | 'inventory' | 'printOnDemand';

interface CostBreakdown {
  product: number;
  payment: number;
  shipping: number;
  marketing: number;
  other: number;
}

interface OptimizationMetrics {
  profitMarginPercent: number;
  roas: number;
  conversionRate: number;
  averageOrderValue: number;
  customerAcquisitionCost: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Ecommerce Profit Calculator?",
    answer: "A Ecommerce Profit Calculator is a free online tool designed to help you quickly and accurately calculate ecommerce profit-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Ecommerce Profit Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Ecommerce Profit Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Ecommerce Profit Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function EcommerceProfitCalculatorClient() {
  // Business model
  const [businessModel, setBusinessModel] = useState<BusinessModel>('dropshipping');

  // Product Information
  const [sellingPrice, setSellingPrice] = useState<number>(50);
  const [productCost, setProductCost] = useState<number>(20);
  const [monthlyVolume, setMonthlyVolume] = useState<number>(100);
  const [averageOrderValue, setAverageOrderValue] = useState<number>(65);

  // Payment Processing
  const [paymentFeePercent, setPaymentFeePercent] = useState<number>(2.9);
  const [paymentFeeFixed, setPaymentFeeFixed] = useState<number>(0.3);

  // Platform Fees
  const [platformFee, setPlatformFee] = useState<number>(0);
  const [subscriptionFee, setSubscriptionFee] = useState<number>(29);

  // Shipping
  const [shippingCost, setShippingCost] = useState<number>(5);
  const [shippingCharged, setShippingCharged] = useState<number>(7);

  // Other Costs
  const [returnRate, setReturnRate] = useState<number>(5);
  const [miscCosts, setMiscCosts] = useState<number>(1);

  // Marketing
  const [adSpend, setAdSpend] = useState<number>(1000);
  const [conversionRate, setConversionRate] = useState<number>(2.5);
  const [cpc, setCpc] = useState<number>(0.75);
  const [organicTrafficPercent, setOrganicTrafficPercent] = useState<number>(30);

  // Inventory
  const [warehouseCost, setWarehouseCost] = useState<number>(500);
  const [inventoryTurnover, setInventoryTurnover] = useState<number>(6);

  // Pricing Strategy
  const [strategyProductCost, setStrategyProductCost] = useState<number>(25);
  const [targetMargin, setTargetMargin] = useState<number>(40);
  const [competitorPrice, setCompetitorPrice] = useState<number>(55);
  const [marketPosition, setMarketPosition] = useState<string>('competitive');

  // CLV
  const [clvAverageOrderValue, setClvAverageOrderValue] = useState<number>(65);
  const [purchaseFrequency, setPurchaseFrequency] = useState<number>(4);
  const [customerLifespan, setCustomerLifespan] = useState<number>(3);
  const [clvProfitMargin, setClvProfitMargin] = useState<number>(25);

  // Results state
  const [profitPerOrder, setProfitPerOrder] = useState<number>(0);
  const [profitMarginPercent, setProfitMarginPercent] = useState<number>(0);
  const [monthlyProfit, setMonthlyProfit] = useState<number>(0);
  const [breakEvenOrders, setBreakEvenOrders] = useState<number>(0);
  const [dailyBreakEven, setDailyBreakEven] = useState<number>(0);
  const [roas, setRoas] = useState<number>(0);
  const [cac, setCac] = useState<number>(0);
  const [revenuePerClick, setRevenuePerClick] = useState<number>(0);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown>({ product: 0, payment: 0, shipping: 0, marketing: 0, other: 0 });
  const [totalCosts, setTotalCosts] = useState<number>(0);
  const [optimizationTips, setOptimizationTips] = useState<string[]>([]);

  // Pricing strategy results
  const [recommendedPrice, setRecommendedPrice] = useState<number>(45);
  const [actualMargin, setActualMargin] = useState<number>(40);
  const [costPlusPrice, setCostPlusPrice] = useState<number>(41.67);
  const [competitivePriceResult, setCompetitivePriceResult] = useState<number>(55);
  const [premiumPrice, setPremiumPrice] = useState<number>(71.5);
  const [pricingStrategy, setPricingStrategy] = useState<string>('Competitive positioning allows for solid margins while remaining market competitive.');

  // CLV results
  const [customerLTV, setCustomerLTV] = useState<number>(195);
  const [annualCustomerValue, setAnnualCustomerValue] = useState<number>(65);
  const [maxAcquisitionCost, setMaxAcquisitionCost] = useState<number>(58.5);
  const [customerROI, setCustomerROI] = useState<number>(290);
  const [clvStrategies, setClvStrategies] = useState<string[]>([]);

  const formatNumber = (num: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const formatCurrency = (amount: number, showCents: boolean = true): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: showCents ? 2 : 0,
      maximumFractionDigits: showCents ? 2 : 0
    }).format(amount);
  };

  const calculateProfit = () => {
    if (sellingPrice <= 0 || monthlyVolume <= 0) {
      resetResults();
      return;
    }

    // Calculate costs per order
    const paymentFees = (averageOrderValue * (paymentFeePercent / 100)) + paymentFeeFixed;
    const platformFees = averageOrderValue * (platformFee / 100);
    const shippingNet = shippingCost - shippingCharged;
    const returnCost = (productCost + shippingCost) * (returnRate / 100);

    // Marketing cost per order
    const paidTrafficPercent = 1 - (organicTrafficPercent / 100);
    const paidOrders = monthlyVolume * paidTrafficPercent;
    const marketingCostPerOrder = paidOrders > 0 ? adSpend / paidOrders : 0;

    // Warehouse cost per order
    const warehouseCostPerOrder = businessModel === 'inventory' && monthlyVolume > 0 ? warehouseCost / monthlyVolume : 0;

    // Subscription cost per order
    const subscriptionCostPerOrder = monthlyVolume > 0 ? subscriptionFee / monthlyVolume : 0;

    // Total costs per order
    const totalCostsCalc = productCost + paymentFees + platformFees + Math.max(0, shippingNet) +
      returnCost + miscCosts + marketingCostPerOrder + warehouseCostPerOrder +
      subscriptionCostPerOrder;

    // Profit calculations
    const netProfitPerOrder = Math.max(0, averageOrderValue - totalCostsCalc);
    const profitMarginPercentCalc = averageOrderValue > 0 ? (netProfitPerOrder / averageOrderValue) * 100 : 0;
    const monthlyNetProfit = netProfitPerOrder * monthlyVolume;

    // Break-even analysis
    const fixedCosts = subscriptionFee + (businessModel === 'inventory' ? warehouseCost : 0);
    const variableCostPerOrder = totalCostsCalc - subscriptionCostPerOrder - warehouseCostPerOrder;
    const contributionMargin = averageOrderValue - variableCostPerOrder;
    const breakEvenOrdersCalc = contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : 0;
    const dailyBreakEvenCalc = breakEvenOrdersCalc / 30;

    // Marketing metrics
    const customerAcquisitionCost = marketingCostPerOrder;
    const roasCalc = marketingCostPerOrder > 0 ? averageOrderValue / marketingCostPerOrder : 0;
    const revenuePerClickCalc = (conversionRate / 100) > 0 ? averageOrderValue * (conversionRate / 100) : 0;

    // Update state
    setProfitPerOrder(netProfitPerOrder);
    setProfitMarginPercent(profitMarginPercentCalc);
    setMonthlyProfit(monthlyNetProfit);
    setBreakEvenOrders(breakEvenOrdersCalc);
    setDailyBreakEven(dailyBreakEvenCalc);
    setRoas(roasCalc);
    setCac(customerAcquisitionCost);
    setRevenuePerClick(revenuePerClickCalc);

    // Cost breakdown
    const breakdown: CostBreakdown = {
      product: productCost,
      payment: paymentFees + platformFees + subscriptionCostPerOrder,
      shipping: Math.max(0, shippingNet),
      marketing: marketingCostPerOrder,
      other: returnCost + miscCosts + warehouseCostPerOrder
    };
    setCostBreakdown(breakdown);
    setTotalCosts(totalCostsCalc);

    // Optimization tips
    updateOptimizationTips({
      profitMarginPercent: profitMarginPercentCalc,
      roas: roasCalc,
      conversionRate: conversionRate,
      averageOrderValue: averageOrderValue,
      customerAcquisitionCost: customerAcquisitionCost
    });
  };

  const updateOptimizationTips = (metrics: OptimizationMetrics) => {
    const tips: string[] = [];

    if (metrics.profitMarginPercent < 15) {
      tips.push("Low profit margin - consider raising prices or reducing costs");
    } else if (metrics.profitMarginPercent > 40) {
      tips.push("Excellent margins - consider scaling up advertising");
    }

    if (metrics.roas < 3) {
      tips.push("Low ROAS - optimize ad targeting or reduce ad spend");
    } else if (metrics.roas > 8) {
      tips.push("Great ROAS - consider increasing ad budget to scale");
    }

    if (metrics.conversionRate < 2) {
      tips.push("Low conversion rate - improve product pages and checkout");
    }

    if (metrics.averageOrderValue < 50) {
      tips.push("Increase AOV with bundles, upsells, and cross-sells");
    }

    if (metrics.customerAcquisitionCost > metrics.averageOrderValue * 0.3) {
      tips.push("High CAC - focus on organic growth and retention");
    }

    if (tips.length === 0) {
      tips.push("Great performance! Focus on scaling and optimization");
      tips.push("Consider expanding to new markets or products");
    }

    setOptimizationTips(tips.slice(0, 3));
  };

  const resetResults = () => {
    setProfitPerOrder(0);
    setProfitMarginPercent(0);
    setMonthlyProfit(0);
    setBreakEvenOrders(0);
    setDailyBreakEven(0);
    setRoas(0);
    setCac(0);
    setRevenuePerClick(0);
  };

  const applyBusinessPreset = (model: BusinessModel, cost: number, price: number, shipping: number, platform: number) => {
    setBusinessModel(model);
    setProductCost(cost);
    setSellingPrice(price);
    setAverageOrderValue(price);
    setShippingCost(shipping);
    setPlatformFee(platform);
  };

  const calculatePricingStrategy = () => {
    const costPlusPriceCalc = strategyProductCost / (1 - targetMargin / 100);

    let marketMultiplier = 1.0;
    switch (marketPosition) {
      case 'budget':
        marketMultiplier = 0.8;
        break;
      case 'competitive':
        marketMultiplier = 1.0;
        break;
      case 'premium':
        marketMultiplier = 1.2;
        break;
      case 'luxury':
        marketMultiplier = 1.5;
        break;
    }

    const competitivePriceAdjusted = competitorPrice * marketMultiplier;
    const premiumPriceCalc = competitorPrice * 1.3;

    let recommendedPriceCalc = costPlusPriceCalc;
    let strategyText = 'Cost-plus pricing ensures target margin';

    if (marketPosition === 'competitive' && competitorPrice > costPlusPriceCalc) {
      recommendedPriceCalc = Math.min(costPlusPriceCalc * 1.1, competitorPrice);
      strategyText = 'Competitive positioning allows for solid margins while remaining market competitive';
    } else if (marketPosition === 'premium' && competitorPrice > strategyProductCost * 2) {
      recommendedPriceCalc = competitivePriceAdjusted;
      strategyText = 'Premium positioning justified by market conditions and product value';
    } else if (marketPosition === 'luxury') {
      recommendedPriceCalc = premiumPriceCalc;
      strategyText = 'Luxury positioning targets high-end market segment with premium pricing';
    } else if (marketPosition === 'budget') {
      recommendedPriceCalc = Math.max(costPlusPriceCalc, competitivePriceAdjusted);
      strategyText = 'Budget positioning focuses on value while maintaining minimum margins';
    }

    const actualMarginPercentCalc = ((recommendedPriceCalc - strategyProductCost) / recommendedPriceCalc) * 100;

    setRecommendedPrice(recommendedPriceCalc);
    setActualMargin(actualMarginPercentCalc);
    setCostPlusPrice(costPlusPriceCalc);
    setCompetitivePriceResult(competitorPrice);
    setPremiumPrice(premiumPriceCalc);
    setPricingStrategy(strategyText);
  };

  const calculateCLV = () => {
    const annualCustomerValueCalc = clvAverageOrderValue * purchaseFrequency;
    const customerLTVCalc = annualCustomerValueCalc * customerLifespan * (clvProfitMargin / 100);
    const maxAcquisitionCostCalc = customerLTVCalc * 0.3;
    const customerROICalc = maxAcquisitionCostCalc > 0 ? (customerLTVCalc / maxAcquisitionCostCalc * 100) : 0;

    setCustomerLTV(customerLTVCalc);
    setAnnualCustomerValue(annualCustomerValueCalc);
    setMaxAcquisitionCost(maxAcquisitionCostCalc);
    setCustomerROI(customerROICalc);

    const strategies: string[] = [];

    if (customerLifespan < 2) {
      strategies.push('Focus on customer retention to increase lifespan');
    }
    if (clvAverageOrderValue < 50) {
      strategies.push('Implement upselling to increase average order value');
    }
    if (purchaseFrequency < 3) {
      strategies.push('Create loyalty programs to increase purchase frequency');
    }
    if (clvProfitMargin < 20) {
      strategies.push('Optimize costs or pricing to improve margins');
    }

    if (strategies.length === 0) {
      strategies.push('Excellent CLV metrics! Focus on scaling customer acquisition');
      strategies.push('Consider expanding to new customer segments');
      strategies.push('Invest in premium customer experiences');
    }

    setClvStrategies(strategies);
  };

  useEffect(() => {
    calculateProfit();
  }, [sellingPrice, productCost, monthlyVolume, averageOrderValue, paymentFeePercent, paymentFeeFixed,
      platformFee, subscriptionFee, shippingCost, shippingCharged, returnRate, miscCosts,
      adSpend, conversionRate, cpc, organicTrafficPercent, businessModel, warehouseCost, inventoryTurnover]);

  useEffect(() => {
    calculatePricingStrategy();
  }, [strategyProductCost, targetMargin, competitorPrice, marketPosition]);

  useEffect(() => {
    calculateCLV();
  }, [clvAverageOrderValue, purchaseFrequency, customerLifespan, clvProfitMargin]);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-6">
        <a href="/us/tools" className="text-blue-600 hover:text-blue-800">Home</a>
        <span className="text-gray-400">:</span>
        <span className="text-gray-600">E-commerce Profit Calculator</span>
      </div>

      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">E-commerce Profit Calculator</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Calculate profit margins, ROI, and break-even analysis for your online store. Optimize dropshipping, inventory, and print-on-demand businesses with comprehensive financial analysis.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8 mb-12">
        {/* Calculator Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6">

            {/* Business Model Selection */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Business Model:</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer hover:bg-orange-50 ${businessModel === 'dropshipping' ? 'border-orange-500 bg-orange-50' : ''}`}>
                  <input
                    type="radio"
                    name="businessModel"
                    value="dropshipping"
                    checked={businessModel === 'dropshipping'}
                    onChange={(e) => setBusinessModel(e.target.value as BusinessModel)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Dropshipping</span>
                </label>
                <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer hover:bg-orange-50 ${businessModel === 'inventory' ? 'border-orange-500 bg-orange-50' : ''}`}>
                  <input
                    type="radio"
                    name="businessModel"
                    value="inventory"
                    checked={businessModel === 'inventory'}
                    onChange={(e) => setBusinessModel(e.target.value as BusinessModel)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Own Inventory</span>
                </label>
                <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer hover:bg-orange-50 ${businessModel === 'printOnDemand' ? 'border-orange-500 bg-orange-50' : ''}`}>
                  <input
                    type="radio"
                    name="businessModel"
                    value="printOnDemand"
                    checked={businessModel === 'printOnDemand'}
                    onChange={(e) => setBusinessModel(e.target.value as BusinessModel)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Print on Demand</span>
                </label>
              </div>
            </div>

            {/* Product Information */}
            <div className="mb-4 sm:mb-6 md:mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📦 Product Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div>
                  <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700 mb-2">Selling Price</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2.5 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input
                      type="number"
                      id="sellingPrice"
                      className="flex-1 px-2 py-2.5 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="productCost" className="block text-sm font-medium text-gray-700 mb-2">Product Cost</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2.5 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input
                      type="number"
                      id="productCost"
                      className="flex-1 px-2 py-2.5 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={productCost}
                      onChange={(e) => setProductCost(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="monthlyVolume" className="block text-sm font-medium text-gray-700 mb-2">Monthly Sales Volume</label>
                  <input
                    type="number"
                    id="monthlyVolume"
                    className="w-full px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={monthlyVolume}
                    onChange={(e) => setMonthlyVolume(parseInt(e.target.value) || 0)}
                    min="1"
                    step="1"
                  />
                </div>

                <div>
                  <label htmlFor="averageOrderValue" className="block text-sm font-medium text-gray-700 mb-2">Average Order Value</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2.5 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input
                      type="number"
                      id="averageOrderValue"
                      className="flex-1 px-2 py-2.5 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={averageOrderValue}
                      onChange={(e) => setAverageOrderValue(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Costs & Fees */}
            <div className="mb-4 sm:mb-6 md:mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💳 Costs & Fees</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                {/* Payment Processing */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Payment Processing</h4>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="paymentFeePercent" className="block text-sm font-medium text-gray-700 mb-1">Payment Fee (%)</label>
                      <input
                        type="number"
                        id="paymentFeePercent"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        value={paymentFeePercent}
                        onChange={(e) => setPaymentFeePercent(parseFloat(e.target.value) || 0)}
                        min="0"
                        max="10"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label htmlFor="paymentFeeFixed" className="block text-sm font-medium text-gray-700 mb-1">Fixed Fee per Transaction</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-2 py-2 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">$</span>
                        <input
                          type="number"
                          id="paymentFeeFixed"
                          className="flex-1 px-3 py-2 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          value={paymentFeeFixed}
                          onChange={(e) => setPaymentFeeFixed(parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Platform Fees */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Platform Fees</h4>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="platformFee" className="block text-sm font-medium text-gray-700 mb-1">Platform Fee (%)</label>
                      <input
                        type="number"
                        id="platformFee"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        value={platformFee}
                        onChange={(e) => setPlatformFee(parseFloat(e.target.value) || 0)}
                        min="0"
                        max="20"
                        step="0.1"
                      />
                      <div className="text-xs text-gray-500 mt-1">Shopify: 0%, Amazon: 15%, eBay: 10%</div>
                    </div>
                    <div>
                      <label htmlFor="subscriptionFee" className="block text-sm font-medium text-gray-700 mb-1">Monthly Subscription</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-2 py-2 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">$</span>
                        <input
                          type="number"
                          id="subscriptionFee"
                          className="flex-1 px-3 py-2 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          value={subscriptionFee}
                          onChange={(e) => setSubscriptionFee(parseFloat(e.target.value) || 0)}
                          min="0"
                          step="1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Shipping</h4>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="shippingCost" className="block text-sm font-medium text-gray-700 mb-1">Shipping Cost per Order</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-2 py-2 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">$</span>
                        <input
                          type="number"
                          id="shippingCost"
                          className="flex-1 px-3 py-2 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          value={shippingCost}
                          onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.10"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="shippingCharged" className="block text-sm font-medium text-gray-700 mb-1">Shipping Charged to Customer</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-2 py-2 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">$</span>
                        <input
                          type="number"
                          id="shippingCharged"
                          className="flex-1 px-3 py-2 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          value={shippingCharged}
                          onChange={(e) => setShippingCharged(parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Costs */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Other Costs</h4>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="returnRate" className="block text-sm font-medium text-gray-700 mb-1">Return/Refund Rate (%)</label>
                      <input
                        type="number"
                        id="returnRate"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        value={returnRate}
                        onChange={(e) => setReturnRate(parseFloat(e.target.value) || 0)}
                        min="0"
                        max="50"
                        step="1"
                      />
                    </div>
                    <div>
                      <label htmlFor="miscCosts" className="block text-sm font-medium text-gray-700 mb-1">Misc Costs per Order</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-2 py-2 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">$</span>
                        <input
                          type="number"
                          id="miscCosts"
                          className="flex-1 px-3 py-2 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          value={miscCosts}
                          onChange={(e) => setMiscCosts(parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Marketing & Advertising */}
            <div className="mb-4 sm:mb-6 md:mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📱 Marketing & Advertising</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div>
                  <label htmlFor="adSpend" className="block text-sm font-medium text-gray-700 mb-2">Monthly Ad Spend</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2.5 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input
                      type="number"
                      id="adSpend"
                      className="flex-1 px-2 py-2.5 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={adSpend}
                      onChange={(e) => setAdSpend(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="conversionRate" className="block text-sm font-medium text-gray-700 mb-2">Conversion Rate (%)</label>
                  <input
                    type="number"
                    id="conversionRate"
                    className="w-full px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(parseFloat(e.target.value) || 0)}
                    min="0.1"
                    max="20"
                    step="0.1"
                  />
                </div>

                <div>
                  <label htmlFor="cpc" className="block text-sm font-medium text-gray-700 mb-2">Cost per Click (CPC)</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2.5 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input
                      type="number"
                      id="cpc"
                      className="flex-1 px-2 py-2.5 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={cpc}
                      onChange={(e) => setCpc(parseFloat(e.target.value) || 0)}
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="organicTrafficPercent" className="block text-sm font-medium text-gray-700 mb-2">Organic Traffic (%)</label>
                  <input
                    type="range"
                    id="organicTrafficPercent"
                    className="w-full"
                    value={organicTrafficPercent}
                    onChange={(e) => setOrganicTrafficPercent(parseFloat(e.target.value))}
                    min="0"
                    max="80"
                    step="5"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>{organicTrafficPercent}%</span>
                    <span>80%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Model Specific Settings */}
            {businessModel === 'inventory' && (
              <div className="mb-3 sm:mb-4 md:mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">📦 Inventory Management</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 p-4 bg-blue-50 rounded-lg">
                  <div>
                    <label htmlFor="warehouseCost" className="block text-sm font-medium text-gray-700 mb-2">Monthly Warehouse Cost</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-2.5 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                      <input
                        type="number"
                        id="warehouseCost"
                        className="flex-1 px-2 py-2.5 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={warehouseCost}
                        onChange={(e) => setWarehouseCost(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="50"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="inventoryTurnover" className="block text-sm font-medium text-gray-700 mb-2">Inventory Turnover (times/year)</label>
                    <input
                      type="number"
                      id="inventoryTurnover"
                      className="w-full px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={inventoryTurnover}
                      onChange={(e) => setInventoryTurnover(parseFloat(e.target.value) || 0)}
                      min="1"
                      max="24"
                      step="1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Business Model Presets */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Setup Presets</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  type="button"
                  className="p-3 text-sm border rounded-lg hover:bg-orange-50"
                  onClick={() => applyBusinessPreset('dropshipping', 15, 45, 3, 0)}
                >
                  <div className="font-semibold">Dropshipping</div>
                  <div className="text-xs text-gray-500">Low startup</div>
                </button>

                <button
                  type="button"
                  className="p-3 text-sm border rounded-lg hover:bg-orange-50"
                  onClick={() => applyBusinessPreset('inventory', 25, 75, 6, 0)}
                >
                  <div className="font-semibold">E-commerce Store</div>
                  <div className="text-xs text-gray-500">Own inventory</div>
                </button>

                <button
                  type="button"
                  className="p-3 text-sm border rounded-lg hover:bg-orange-50"
                  onClick={() => applyBusinessPreset('dropshipping', 0, 25, 0, 15)}
                >
                  <div className="font-semibold">Amazon FBA</div>
                  <div className="text-xs text-gray-500">15% platform fee</div>
                </button>

                <button
                  type="button"
                  className="p-3 text-sm border rounded-lg hover:bg-orange-50"
                  onClick={() => applyBusinessPreset('printOnDemand', 8, 28, 4, 0)}
                >
                  <div className="font-semibold">Print on Demand</div>
                  <div className="text-xs text-gray-500">T-shirts, mugs</div>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-xl p-3 sm:p-4 md:p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">💰 Profit Analysis</h2>

            <div className="space-y-4">
              {/* Net Profit per Order */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Net Profit per Order</div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(profitPerOrder)}</div>
                <div className="text-sm text-gray-500 mt-1">{formatNumber(profitMarginPercent, 1)}% margin</div>
              </div>

              {/* Monthly Profit */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Monthly Net Profit</div>
                <div className="text-xl font-bold text-green-600">{formatCurrency(monthlyProfit, false)}</div>
                <div className="text-sm text-gray-500 mt-1">Based on {monthlyVolume} orders</div>
              </div>

              {/* Break-even Analysis */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-3">Break-even Analysis</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Orders to break-even:</span>
                    <span className="font-semibold">{breakEvenOrders} orders</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily break-even:</span>
                    <span className="font-semibold">{formatNumber(dailyBreakEven, 1)} orders/day</span>
                  </div>
                </div>
              </div>

              {/* ROI & ROAS */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-3">Return on Investment</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ROAS (Return on Ad Spend):</span>
                    <span className="font-semibold text-blue-600">{formatNumber(roas, 2)}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer Acquisition Cost:</span>
                    <span className="font-semibold">{formatCurrency(cac)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue per Click:</span>
                    <span className="font-semibold">{formatCurrency(revenuePerClick)}</span>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-3">Cost Breakdown per Order</div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">🏷️ Product Cost</span>
                    <span className="font-semibold">{formatCurrency(costBreakdown.product)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${totalCosts > 0 ? (costBreakdown.product / totalCosts) * 100 : 0}%` }}></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">💳 Payment Fees</span>
                    <span className="font-semibold">{formatCurrency(costBreakdown.payment)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${totalCosts > 0 ? (costBreakdown.payment / totalCosts) * 100 : 0}%` }}></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">📦 Shipping</span>
                    <span className="font-semibold">{formatCurrency(costBreakdown.shipping)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${totalCosts > 0 ? (costBreakdown.shipping / totalCosts) * 100 : 0}%` }}></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">📱 Marketing</span>
                    <span className="font-semibold">{formatCurrency(costBreakdown.marketing)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${totalCosts > 0 ? (costBreakdown.marketing / totalCosts) * 100 : 0}%` }}></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">📝 Other Costs</span>
                    <span className="font-semibold">{formatCurrency(costBreakdown.other)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: `${totalCosts > 0 ? (costBreakdown.other / totalCosts) * 100 : 0}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Scaling Projections */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-3">Scaling Projections</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">500 orders/month:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(profitPerOrder * 500, false)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">1,000 orders/month:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(profitPerOrder * 1000, false)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">2,000 orders/month:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(profitPerOrder * 2000, false)}</span>
                  </div>
                </div>
              </div>

              {/* Optimization Tips */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-3">💡 Optimization Tips</div>
                <div className="space-y-2">
                  {optimizationTips.map((tip, index) => (
                    <div key={index} className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profit Margin Analysis by Product Category */}
      <div className="max-w-[1180px] mx-auto px-2 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Profit Margin Benchmarks by Product Category</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-2 py-3 text-left font-semibold">Product Category</th>
                  <th className="border border-gray-300 px-2 py-3 text-left font-semibold">Typical Margin</th>
                  <th className="border border-gray-300 px-2 py-3 text-left font-semibold">High-End Margin</th>
                  <th className="border border-gray-300 px-2 py-3 text-left font-semibold">Key Challenges</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-2 py-2 font-medium">Electronics & Tech</td>
                  <td className="border border-gray-300 px-2 py-2 text-orange-600">5-15%</td>
                  <td className="border border-gray-300 px-2 py-2 text-green-600">20-25%</td>
                  <td className="border border-gray-300 px-2 py-2 text-sm">High competition, fast depreciation</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-2 py-2 font-medium">Fashion & Apparel</td>
                  <td className="border border-gray-300 px-2 py-2 text-green-600">40-60%</td>
                  <td className="border border-gray-300 px-2 py-2 text-green-600">70-85%</td>
                  <td className="border border-gray-300 px-2 py-2 text-sm">Seasonal trends, returns</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-2 py-2 font-medium">Beauty & Cosmetics</td>
                  <td className="border border-gray-300 px-2 py-2 text-green-600">50-70%</td>
                  <td className="border border-gray-300 px-2 py-2 text-green-600">80-90%</td>
                  <td className="border border-gray-300 px-2 py-2 text-sm">Brand loyalty, regulations</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-2 py-2 font-medium">Home & Garden</td>
                  <td className="border border-gray-300 px-2 py-2 text-yellow-600">25-45%</td>
                  <td className="border border-gray-300 px-2 py-2 text-green-600">55-70%</td>
                  <td className="border border-gray-300 px-2 py-2 text-sm">Shipping costs, seasonality</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-2 py-2 font-medium">Health & Supplements</td>
                  <td className="border border-gray-300 px-2 py-2 text-green-600">45-65%</td>
                  <td className="border border-gray-300 px-2 py-2 text-green-600">75-90%</td>
                  <td className="border border-gray-300 px-2 py-2 text-sm">Compliance, customer acquisition</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-2 py-2 font-medium">Jewelry & Accessories</td>
                  <td className="border border-gray-300 px-2 py-2 text-green-600">50-70%</td>
                  <td className="border border-gray-300 px-2 py-2 text-green-600">80-95%</td>
                  <td className="border border-gray-300 px-2 py-2 text-sm">Quality perception, trust</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Advanced Pricing Strategy Calculator */}
      <div className="max-w-[1180px] mx-auto px-2 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Advanced Pricing Strategy Calculator</h2>

          <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Pricing Input */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Pricing Strategy Analysis</h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="strategyProductCost" className="block text-sm font-medium text-gray-700 mb-2">Product Cost</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="strategyProductCost"
                      value={strategyProductCost}
                      onChange={(e) => setStrategyProductCost(parseFloat(e.target.value) || 0)}
                      step="0.50"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="targetMargin" className="block text-sm font-medium text-gray-700 mb-2">Target Profit Margin (%)</label>
                  <input
                    type="number"
                    id="targetMargin"
                    value={targetMargin}
                    onChange={(e) => setTargetMargin(parseFloat(e.target.value) || 0)}
                    step="5"
                    min="5"
                    max="90"
                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label htmlFor="competitorPrice" className="block text-sm font-medium text-gray-700 mb-2">Competitor Average Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="competitorPrice"
                      value={competitorPrice}
                      onChange={(e) => setCompetitorPrice(parseFloat(e.target.value) || 0)}
                      step="1"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="marketPosition" className="block text-sm font-medium text-gray-700 mb-2">Market Position</label>
                  <select
                    id="marketPosition"
                    value={marketPosition}
                    onChange={(e) => setMarketPosition(e.target.value)}
                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="budget">Budget/Value (10-20% below market)</option>
                    <option value="competitive">Competitive (Market average)</option>
                    <option value="premium">Premium (10-30% above market)</option>
                    <option value="luxury">Luxury (50%+ above market)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing Results */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Pricing Recommendations</h3>

              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Recommended Price</h4>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(recommendedPrice)}</div>
                  <div className="text-sm text-green-800">{formatNumber(actualMargin, 1)}% margin achieved</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Cost-Plus Price:</span>
                    <span className="font-medium">{formatCurrency(costPlusPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Competitive Price:</span>
                    <span className="font-medium">{formatCurrency(competitivePriceResult)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Premium Price:</span>
                    <span className="font-medium">{formatCurrency(premiumPrice)}</span>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Pricing Strategy:</h4>
                  <div className="text-sm text-blue-800">{pricingStrategy}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Lifetime Value Calculator */}
      <div className="max-w-[1180px] mx-auto px-2 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Customer Lifetime Value (CLV) Calculator</h2>

          <div className="grid lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {/* CLV Input */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <div>
                  <label htmlFor="clvAverageOrderValue" className="block text-sm font-medium text-gray-700 mb-2">Average Order Value</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="clvAverageOrderValue"
                      value={clvAverageOrderValue}
                      onChange={(e) => setClvAverageOrderValue(parseFloat(e.target.value) || 0)}
                      step="5"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="purchaseFrequency" className="block text-sm font-medium text-gray-700 mb-2">Orders per Year</label>
                  <input
                    type="number"
                    id="purchaseFrequency"
                    value={purchaseFrequency}
                    onChange={(e) => setPurchaseFrequency(parseFloat(e.target.value) || 0)}
                    step="0.5"
                    min="0.5"
                    max="24"
                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="customerLifespan" className="block text-sm font-medium text-gray-700 mb-2">Customer Lifespan (years)</label>
                  <input
                    type="number"
                    id="customerLifespan"
                    value={customerLifespan}
                    onChange={(e) => setCustomerLifespan(parseFloat(e.target.value) || 0)}
                    step="0.5"
                    min="0.5"
                    max="10"
                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="clvProfitMargin" className="block text-sm font-medium text-gray-700 mb-2">Profit Margin (%)</label>
                  <input
                    type="number"
                    id="clvProfitMargin"
                    value={clvProfitMargin}
                    onChange={(e) => setClvProfitMargin(parseFloat(e.target.value) || 0)}
                    step="5"
                    min="5"
                    max="80"
                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* CLV Results */}
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Customer Lifetime Value</h4>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(customerLTV)}</div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Annual Customer Value</h4>
                  <div className="text-xl font-semibold text-blue-600">{formatCurrency(annualCustomerValue)}</div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Max Acquisition Cost</h4>
                  <div className="text-lg font-semibold text-purple-600">{formatCurrency(maxAcquisitionCost)}</div>
                  <div className="text-sm text-purple-800">30% of CLV</div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">Customer ROI</h4>
                  <div className="text-lg font-semibold text-orange-600">{formatNumber(customerROI, 0)}%</div>
                  <div className="text-sm text-orange-800">Return on acquisition</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">CLV Optimization Strategies:</h4>
                <div className="text-sm text-gray-700">
                  {clvStrategies.map((strategy, index) => (
                    <div key={index}>• {strategy}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* E-commerce Business Benchmarks & Trends */}
      <div className="max-w-[1180px] mx-auto px-2 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">E-commerce Business Benchmarks & Trends (2024)</h2>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Key Metrics Benchmarks */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Key Performance Benchmarks</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Average Conversion Rate</span>
                  <span className="text-blue-600 font-bold">2.3%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Cart Abandonment Rate</span>
                  <span className="text-orange-600 font-bold">69.9%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Mobile Traffic Share</span>
                  <span className="text-green-600 font-bold">58.3%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Return Customer Rate</span>
                  <span className="text-purple-600 font-bold">27.4%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Average Order Value</span>
                  <span className="text-blue-600 font-bold">$65.19</span>
                </div>
              </div>
            </div>

            {/* Industry Trends */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">📈 Current Industry Trends</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-800">Personalization Growth</h4>
                  <p className="text-sm text-gray-600">AI-driven personalization increasing conversions by 20%</p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-800">Social Commerce</h4>
                  <p className="text-sm text-gray-600">Social media sales growing 30% year-over-year</p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-800">Sustainability Focus</h4>
                  <p className="text-sm text-gray-600">73% of consumers willing to pay more for eco-friendly products</p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-gray-800">Voice Commerce</h4>
                  <p className="text-sm text-gray-600">Voice shopping expected to reach $40B by 2025</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {/* Platform Comparison */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">🏪 Platform Comparison</h4>
              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="font-semibold text-green-900">Shopify</div>
                  <div className="text-sm text-green-800">$29-299/mo + 2.9% fees</div>
                  <div className="text-xs text-green-700">Best for: Growing businesses</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="font-semibold text-blue-900">WooCommerce</div>
                  <div className="text-sm text-blue-800">Free + hosting costs</div>
                  <div className="text-xs text-blue-700">Best for: WordPress users</div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="font-semibold text-orange-900">Amazon FBA</div>
                  <div className="text-sm text-orange-800">15% + fulfillment fees</div>
                  <div className="text-xs text-orange-700">Best for: Scale quickly</div>
                </div>
              </div>
            </div>

            {/* Marketing Channels */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">🎯 Marketing Channel ROI</h4>
              <div className="space-y-3">
                <div className="flex justify-between p-2 border-l-4 border-green-500 pl-3">
                  <span className="text-sm font-medium">Email Marketing</span>
                  <span className="text-green-600 font-bold">4200% ROI</span>
                </div>
                <div className="flex justify-between p-2 border-l-4 border-blue-500 pl-3">
                  <span className="text-sm font-medium">Google Ads</span>
                  <span className="text-blue-600 font-bold">300-500% ROI</span>
                </div>
                <div className="flex justify-between p-2 border-l-4 border-purple-500 pl-3">
                  <span className="text-sm font-medium">Facebook Ads</span>
                  <span className="text-purple-600 font-bold">200-400% ROI</span>
                </div>
                <div className="flex justify-between p-2 border-l-4 border-orange-500 pl-3">
                  <span className="text-sm font-medium">Influencer Marketing</span>
                  <span className="text-orange-600 font-bold">520% ROI</span>
                </div>
              </div>
            </div>

            {/* Growth Strategies */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">🚀 Growth Strategies</h4>
              <div className="space-y-3 text-sm">
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="font-semibold text-yellow-900">Upselling & Cross-selling</div>
                  <div className="text-yellow-800">Can increase revenue by 10-30%</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="font-semibold text-green-900">Customer Retention</div>
                  <div className="text-green-800">5x cheaper than acquisition</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="font-semibold text-blue-900">International Expansion</div>
                  <div className="text-blue-800">Access to 7.8B global customers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="ecommerce-profit-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}

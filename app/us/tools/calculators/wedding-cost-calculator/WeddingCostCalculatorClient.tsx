'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface WeddingCostCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Wedding Cost Calculator?",
    answer: "A Wedding Cost Calculator is a free online tool designed to help you quickly and accurately calculate wedding cost-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Wedding Cost Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Wedding Cost Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Wedding Cost Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function WeddingCostCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: WeddingCostCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('wedding-cost-calculator');

  const [totalBudget, setTotalBudget] = useState(30000);
  const [guestCount, setGuestCount] = useState(100);
  const [weddingStyle, setWeddingStyle] = useState('moderate');
  const [location, setLocation] = useState('suburban');

  // Venue & Catering
  const [venueRental, setVenueRental] = useState(8000);
  const [catering, setCatering] = useState(75);
  const [alcohol, setAlcohol] = useState(2000);
  const [cake, setCake] = useState(500);

  // Photography
  const [photography, setPhotography] = useState(2500);
  const [videography, setVideography] = useState(1500);
  const [engagement, setEngagement] = useState(500);

  // Attire
  const [brideAttire, setBrideAttire] = useState(1500);
  const [groomAttire, setGroomAttire] = useState(400);
  const [beauty, setBeauty] = useState(600);
  const [accessories, setAccessories] = useState(300);

  // Music
  const [musicDJ, setMusicDJ] = useState(1200);
  const [ceremony, setCeremony] = useState(300);
  const [entertainment, setEntertainment] = useState(500);

  // Flowers
  const [brideFlowers, setBrideFlowers] = useState(200);
  const [centerpieces, setCenterpieces] = useState(800);
  const [ceremonyDecor, setCeremonyDecor] = useState(600);
  const [otherFlowers, setOtherFlowers] = useState(400);

  // Miscellaneous
  const [invitations, setInvitations] = useState(300);
  const [favors, setFavors] = useState(200);
  const [officiant, setOfficiant] = useState(500);
  const [transportation, setTransportation] = useState(500);
  const [insurance, setInsurance] = useState(200);

  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const updateStylePresets = () => {
    const styleMultipliers: Record<string, number> = { budget: 0.7, moderate: 1.0, upscale: 1.4, luxury: 2.0 };
    const locationMultipliers: Record<string, number> = { rural: 0.8, suburban: 1.0, urban: 1.3, destination: 1.5 };

    const totalMultiplier = styleMultipliers[weddingStyle] * locationMultipliers[location];

    setVenueRental(Math.round(8000 * totalMultiplier));
    setCatering(Math.round(75 * totalMultiplier));
    setAlcohol(Math.round(2000 * totalMultiplier));
    setCake(Math.round(500 * totalMultiplier));
    setPhotography(Math.round(2500 * totalMultiplier));
    setVideography(Math.round(1500 * totalMultiplier));
    setEngagement(Math.round(500 * totalMultiplier));
    setBrideAttire(Math.round(1500 * totalMultiplier));
    setGroomAttire(Math.round(400 * totalMultiplier));
    setBeauty(Math.round(600 * totalMultiplier));
    setAccessories(Math.round(300 * totalMultiplier));
    setMusicDJ(Math.round(1200 * totalMultiplier));
    setCeremony(Math.round(300 * totalMultiplier));
    setEntertainment(Math.round(500 * totalMultiplier));
    setBrideFlowers(Math.round(200 * totalMultiplier));
    setCenterpieces(Math.round(800 * totalMultiplier));
    setCeremonyDecor(Math.round(600 * totalMultiplier));
    setOtherFlowers(Math.round(400 * totalMultiplier));
    setInvitations(Math.round(300 * totalMultiplier));
    setFavors(Math.round(200 * totalMultiplier));
    setOfficiant(Math.round(500 * totalMultiplier));
    setTransportation(Math.round(500 * totalMultiplier));
    setInsurance(Math.round(200 * totalMultiplier));
  };

  useEffect(() => {
    updateStylePresets();
  }, [weddingStyle, location]);

  const venueTotal = venueRental + (catering * guestCount) + alcohol + cake;
  const photoTotal = photography + videography + engagement;
  const attireTotal = brideAttire + groomAttire + beauty + accessories;
  const musicTotal = musicDJ + ceremony + entertainment;
  const flowersTotal = brideFlowers + centerpieces + ceremonyDecor + otherFlowers;
  const miscTotal = invitations + favors + officiant + transportation + insurance;

  const totalEstimated = venueTotal + photoTotal + attireTotal + musicTotal + flowersTotal + miscTotal;
  const remainingBudget = totalBudget - totalEstimated;
  const costPerGuest = guestCount > 0 ? totalEstimated / guestCount : 0;

  const categories = [
    { name: 'Venue & Catering', amount: venueTotal, icon: '🏰' },
    { name: 'Photography & Video', amount: photoTotal, icon: '📸' },
    { name: 'Attire & Beauty', amount: attireTotal, icon: '👗' },
    { name: 'Music & Entertainment', amount: musicTotal, icon: '🎵' },
    { name: 'Flowers & Decorations', amount: flowersTotal, icon: '💐' },
    { name: 'Miscellaneous', amount: miscTotal, icon: '📝' }
  ].sort((a, b) => b.amount - a.amount);

  return (
    <div className="max-w-[1180px] mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Link href="/us/tools" className="text-blue-600 hover:text-blue-800 text-sm md:text-base">Home</Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600 text-sm md:text-base">Wedding Cost Calculator</span>
      </div>

      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">{getH1('Wedding Cost Calculator')}</h1>
        <p className="text-sm md:text-base text-gray-600">Plan your perfect wedding with comprehensive budget breakdown and expense tracking</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Calculator */}
        <div className="lg:col-span-2">
          {/* Wedding Overview */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              <span>💒</span> Wedding Overview
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Total Budget ($)</label>
                <input type="number" value={totalBudget} onChange={(e) => setTotalBudget(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500" min="1000" step="100" />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                <input type="number" value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500" min="10" step="1" />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Wedding Style</label>
                <select value={weddingStyle} onChange={(e) => setWeddingStyle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500">
                  <option value="budget">Budget-Friendly</option>
                  <option value="moderate">Moderate</option>
                  <option value="upscale">Upscale</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Location Type</label>
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500">
                  <option value="rural">Rural/Small Town</option>
                  <option value="suburban">Suburban</option>
                  <option value="urban">Urban/City</option>
                  <option value="destination">Destination</option>
                </select>
              </div>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Expense Categories (Accordion Style) */}
          <div className="space-y-3">
            {/* Venue & Catering */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <button className="w-full px-2 py-3 flex justify-between items-center hover:bg-gray-50" onClick={() => toggleCategory('venue')}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏰</span>
                  <span className="font-semibold text-sm md:text-base">Venue & Catering</span>
                  <span className="text-xs text-gray-500">(40-50% of budget)</span>
                </div>
                <span className="font-bold text-pink-600 text-sm md:text-base">${venueTotal.toLocaleString()}</span>
              </button>
              {openCategory === 'venue' && (
                <div className="px-4 pb-4">
                  <div className="grid md:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Venue Rental ($)</label>
                      <input type="number" value={venueRental} onChange={(e) => setVenueRental(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Catering (per person $)</label>
                      <input type="number" value={catering} onChange={(e) => setCatering(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Alcohol/Bar ($)</label>
                      <input type="number" value={alcohol} onChange={(e) => setAlcohol(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Wedding Cake ($)</label>
                      <input type="number" value={cake} onChange={(e) => setCake(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Photography & Video */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <button className="w-full px-2 py-3 flex justify-between items-center hover:bg-gray-50" onClick={() => toggleCategory('photo')}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">📸</span>
                  <span className="font-semibold text-sm md:text-base">Photography & Video</span>
                  <span className="text-xs text-gray-500">(10-15%)</span>
                </div>
                <span className="font-bold text-pink-600 text-sm md:text-base">${photoTotal.toLocaleString()}</span>
              </button>
              {openCategory === 'photo' && (
                <div className="px-4 pb-4">
                  <div className="grid md:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Photography ($)</label>
                      <input type="number" value={photography} onChange={(e) => setPhotography(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Videography ($)</label>
                      <input type="number" value={videography} onChange={(e) => setVideography(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Engagement Photos ($)</label>
                      <input type="number" value={engagement} onChange={(e) => setEngagement(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                  </div>
                </div>
              )}
            </div>
{/* Attire & Beauty */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <button className="w-full px-2 py-3 flex justify-between items-center hover:bg-gray-50" onClick={() => toggleCategory('attire')}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">👗</span>
                  <span className="font-semibold text-sm md:text-base">Attire & Beauty</span>
                  <span className="text-xs text-gray-500">(8-10%)</span>
                </div>
                <span className="font-bold text-pink-600 text-sm md:text-base">${attireTotal.toLocaleString()}</span>
              </button>
              {openCategory === 'attire' && (
                <div className="px-4 pb-4">
                  <div className="grid md:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Bride&apos;s Attire ($)</label>
                      <input type="number" value={brideAttire} onChange={(e) => setBrideAttire(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Groom&apos;s Attire ($)</label>
                      <input type="number" value={groomAttire} onChange={(e) => setGroomAttire(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Hair & Makeup ($)</label>
                      <input type="number" value={beauty} onChange={(e) => setBeauty(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Accessories ($)</label>
                      <input type="number" value={accessories} onChange={(e) => setAccessories(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Music & Entertainment */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <button className="w-full px-2 py-3 flex justify-between items-center hover:bg-gray-50" onClick={() => toggleCategory('music')}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎵</span>
                  <span className="font-semibold text-sm md:text-base">Music & Entertainment</span>
                  <span className="text-xs text-gray-500">(8-10%)</span>
                </div>
                <span className="font-bold text-pink-600 text-sm md:text-base">${musicTotal.toLocaleString()}</span>
              </button>
              {openCategory === 'music' && (
                <div className="px-4 pb-4">
                  <div className="grid md:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">DJ/Band ($)</label>
                      <input type="number" value={musicDJ} onChange={(e) => setMusicDJ(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Ceremony Music ($)</label>
                      <input type="number" value={ceremony} onChange={(e) => setCeremony(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Additional Entertainment ($)</label>
                      <input type="number" value={entertainment} onChange={(e) => setEntertainment(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Flowers & Decorations */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <button className="w-full px-2 py-3 flex justify-between items-center hover:bg-gray-50" onClick={() => toggleCategory('flowers')}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">💐</span>
                  <span className="font-semibold text-sm md:text-base">Flowers & Decorations</span>
                  <span className="text-xs text-gray-500">(8-10%)</span>
                </div>
                <span className="font-bold text-pink-600 text-sm md:text-base">${flowersTotal.toLocaleString()}</span>
              </button>
              {openCategory === 'flowers' && (
                <div className="px-4 pb-4">
                  <div className="grid md:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Bridal Bouquet ($)</label>
                      <input type="number" value={brideFlowers} onChange={(e) => setBrideFlowers(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Centerpieces ($)</label>
                      <input type="number" value={centerpieces} onChange={(e) => setCenterpieces(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Ceremony Decor ($)</label>
                      <input type="number" value={ceremonyDecor} onChange={(e) => setCeremonyDecor(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Other Flowers ($)</label>
                      <input type="number" value={otherFlowers} onChange={(e) => setOtherFlowers(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Miscellaneous */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <button className="w-full px-2 py-3 flex justify-between items-center hover:bg-gray-50" onClick={() => toggleCategory('misc')}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">📝</span>
                  <span className="font-semibold text-sm md:text-base">Miscellaneous</span>
                  <span className="text-xs text-gray-500">(5-8%)</span>
                </div>
                <span className="font-bold text-pink-600 text-sm md:text-base">${miscTotal.toLocaleString()}</span>
              </button>
              {openCategory === 'misc' && (
                <div className="px-4 pb-4">
                  <div className="grid md:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Invitations ($)</label>
                      <input type="number" value={invitations} onChange={(e) => setInvitations(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Wedding Favors ($)</label>
                      <input type="number" value={favors} onChange={(e) => setFavors(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Officiant ($)</label>
                      <input type="number" value={officiant} onChange={(e) => setOfficiant(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Transportation ($)</label>
                      <input type="number" value={transportation} onChange={(e) => setTransportation(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Wedding Insurance ($)</label>
                      <input type="number" value={insurance} onChange={(e) => setInsurance(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" min="0" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-6 bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              <span>💰</span> Wedding Budget Summary
            </h3>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
              <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-lg p-4 md:p-6">
                <h4 className="text-base md:text-lg font-semibold text-pink-900 mb-4">Total Estimated Cost</h4>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-pink-900">${totalEstimated.toLocaleString()}</div>
                  <div className="text-sm text-pink-700 mt-2">
                    {remainingBudget >= 0
                      ? `✓ Under budget by $${Math.abs(remainingBudget).toLocaleString()}`
                      : `⚠ Over budget by $${Math.abs(remainingBudget).toLocaleString()}`
                    }
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4 md:p-6">
                <h4 className="text-base md:text-lg font-semibold text-blue-900 mb-4">Cost per Guest</h4>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-900">${costPerGuest.toFixed(0)}</div>
                  <div className="text-sm text-blue-700 mt-2">
                    For {guestCount} guests
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">Budget Breakdown by Category</h4>
              <div className="space-y-2">
                {categories.map(cat => {
                  const percentage = totalEstimated > 0 ? (cat.amount / totalEstimated * 100).toFixed(1) : 0;
                  return (
                    <div key={cat.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span className="text-sm font-medium">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">${cat.amount.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{percentage}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h5 className="font-semibold text-amber-900 mb-2">💡 Budget Recommendations</h5>
              <ul className="text-sm text-amber-800 space-y-1">
                {remainingBudget < 0 ? (
                  <>
                    <li>• You&apos;re over budget by ${Math.abs(remainingBudget).toLocaleString()}. Consider reducing guest count or choosing a less expensive venue</li>
                    {venueTotal > totalBudget * 0.5 && <li>• Venue & catering is high - look for package deals or off-season dates</li>}
                  </>
                ) : (
                  <>
                    <li>• Great! You&apos;re {remainingBudget === 0 ? 'exactly on' : 'under'} budget</li>
                    <li>• Consider upgrading photography to capture memories</li>
                  </>
                )}
                <li>• Get everything in writing with vendors</li>
                <li>• Build in 5-10% contingency for unexpected costs</li>
                <li>• Book vendors 9-12 months in advance for best rates</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 md:p-6 border border-pink-200">
            <h3 className="text-base md:text-lg font-bold text-pink-900 mb-2 md:mb-3">💒 Quick Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-white rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Total Cost</div>
                <div className="text-2xl font-bold text-pink-600">${totalEstimated.toLocaleString()}</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Cost per Guest</div>
                <div className="text-xl font-bold text-blue-600">${costPerGuest.toFixed(0)}</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Budget Status</div>
                <div className={`text-sm font-semibold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {remainingBudget >= 0 ? 'Under Budget ✓' : 'Over Budget ⚠'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 border border-blue-200">
            <h3 className="text-base md:text-lg font-bold text-blue-900 mb-2 md:mb-3">📊 Average Costs</h3>
            <div className="space-y-1 text-xs md:text-sm text-blue-800">
              <div><strong>Budget Wedding:</strong> $10,000-20,000</div>
              <div><strong>Moderate:</strong> $25,000-35,000</div>
              <div><strong>Upscale:</strong> $40,000-60,000</div>
              <div><strong>Luxury:</strong> $70,000+</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 md:p-6 border border-purple-200">
            <h3 className="text-base md:text-lg font-bold text-purple-900 mb-2 md:mb-3">💡 Money-Saving Tips</h3>
            <ul className="space-y-1 text-xs md:text-sm text-purple-800">
              <li>• Off-season dates save 20-30%</li>
              <li>• Friday/Sunday weddings cost less</li>
              <li>• DIY invitations & favors</li>
              <li>• Choose seasonal flowers</li>
              <li>• Smaller guest list = big savings</li>
              <li>• Afternoon weddings need less food</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 md:p-6 border border-amber-200">
            <h3 className="text-base md:text-lg font-bold text-amber-900 mb-2 md:mb-3">📅 Planning Timeline</h3>
            <div className="space-y-1 text-xs md:text-sm text-amber-800">
              <div><strong>12+ Months:</strong> Venue, vendors</div>
              <div><strong>6-8 Months:</strong> Attire, flowers</div>
              <div><strong>3-4 Months:</strong> Final count, menu</div>
              <div><strong>1 Month:</strong> Final payments</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 md:p-6 border border-green-200">
            <h3 className="text-base md:text-lg font-bold text-green-900 mb-2 md:mb-3">🎯 Budget Allocation</h3>
            <div className="space-y-1 text-xs md:text-sm text-green-800">
              <div>Venue/Catering: 40-50%</div>
              <div>Photography: 10-15%</div>
              <div>Attire: 8-10%</div>
              <div>Music: 8-10%</div>
              <div>Flowers: 8-10%</div>
              <div>Other: 12-14%</div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedCalculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className={`${calc.color} rounded-xl p-6 text-white hover:opacity-90 transition-opacity`}
            >
              <h3 className="font-bold text-lg mb-2">{calc.title}</h3>
              <p className="text-sm opacity-90">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 mt-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Planning Your Wedding Budget</h2>
        <div className="prose max-w-none text-gray-700">
          <p className="mb-4">
            The average American wedding costs between $28,000-$35,000, but this varies dramatically by location, guest count, and style. Urban weddings in major metros can run 40-80% higher than suburban or rural celebrations. Understanding where your money goes helps you prioritize spending on what matters most to you.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Where the Money Goes</h3>
          <p className="mb-4">
            Venue and catering typically consume 40-50% of your budget—this is the single biggest expense and where negotiation can yield the largest savings. Photography and videography (10-15%) preserve memories forever, while attire, flowers, and music each account for 8-10%. Build in a 5-10% contingency for unexpected costs that inevitably arise.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Smart Ways to Save</h3>
          <p className="mb-4">
            Off-peak dates (November through March, excluding holidays) can save 20-40% on venues. Friday or Sunday weddings cost less than Saturdays. Brunch or lunch receptions reduce catering costs significantly. Consider all-inclusive venues that bundle services, DIY elements like centerpieces and favors, and prioritizing a few splurges over spreading budget thin across all categories.
          </p>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 mt-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-5">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">How much should I budget for a wedding with 100 guests?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              For 100 guests, expect to spend $20,000-$40,000 for a moderate wedding, with significant variation by location. Budget roughly $150-$350 per guest for the venue and catering alone. In expensive metros like NYC or LA, costs can reach $400-$600+ per guest. Lower-cost regions like the South or Midwest average $100-$200 per guest for similar quality.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">What is the biggest wedding expense and how can I reduce it?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Venue and catering typically consume 40-50% of your budget. Reduce costs by choosing off-peak dates (save 20-40%), opting for brunch or lunch instead of dinner (save 30-50%), selecting in-house catering over outside vendors, limiting bar options to beer and wine, and considering non-traditional venues like parks, restaurants, or private estates that may include decor.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">How much should I tip wedding vendors?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Typical gratuities: Catering staff (15-20% if not included), DJ/band ($50-$200), photographer/videographer ($50-$200), hair and makeup artist (15-20%), officiant ($50-$100), transportation drivers (15-20%). Many venues include gratuity in contracts—check before double-tipping. Budget $1,000-$2,000 for tips on a $30,000 wedding.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">When should I book wedding vendors?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Book venues 12-18 months ahead for peak dates. Secure photographer, caterer, and band/DJ 9-12 months out. Florists, videographers, and officiant can typically be booked 6-9 months before. Attire needs 6-8 months for ordering and alterations. Hair/makeup trials should happen 2-3 months ahead. Popular vendors book quickly—earlier is always safer.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">What hidden costs do couples often forget?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Common overlooked expenses include: alterations ($200-$800), vendor meals ($25-$75 each), cake cutting fees ($1-$3/slice), corkage fees ($10-$25/bottle), overtime charges ($150-$500/hour), ceremony fees, parking/valet, hotel room blocks, day-of coordinator, and marriage license. These can add $2,000-$5,000 to your total.
            </p>
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-800 mb-2">How do I prioritize my wedding budget?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Identify your top 3 priorities as a couple (food quality, photography, music, venue aesthetics, guest experience). Allocate more budget to these areas and reduce spending elsewhere. Most guests remember great food, music, and the couple&apos;s happiness—not centerpiece details. Save on lower-priority items through DIY, rentals, or skipping entirely. Your wedding should reflect what matters most to you.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="wedding-cost-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}

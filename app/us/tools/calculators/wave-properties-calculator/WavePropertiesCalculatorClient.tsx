'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
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

interface WavePreset {
  frequency: number;
  speed: number;
  name: string;
}

const wavePresets: Record<string, WavePreset> = {
  sound: { frequency: 440, speed: 343, name: 'Sound Wave (A4 note)' },
  light: { frequency: 5e14, speed: 3e8, name: 'Light Wave (Green)' },
  water: { frequency: 0.1, speed: 1.5, name: 'Ocean Wave' },
  radio: { frequency: 100e6, speed: 3e8, name: 'FM Radio Wave' },
  ultrasound: { frequency: 2e6, speed: 1540, name: 'Medical Ultrasound' },
  earthquake: { frequency: 1, speed: 5000, name: 'Seismic P-Wave' }
};

const fallbackFaqs = [
  {
    id: '1',
    question: 'What is the wave equation v = fλ?',
    answer: 'The wave equation v = fλ describes the relationship between wave speed (v), frequency (f), and wavelength (λ). Wave speed is how fast the wave travels, frequency is how many complete cycles occur per second (measured in Hertz), and wavelength is the distance between consecutive wave peaks. This fundamental equation applies to all types of waves.',
    order: 1
  },
  {
    id: '2',
    question: 'What is the difference between frequency and period?',
    answer: 'Frequency and period are inverse of each other: Period (T) = 1/Frequency (f). Frequency measures how many wave cycles occur per second (in Hertz), while period measures how long one complete cycle takes (in seconds). A 440 Hz sound wave has a period of 1/440 = 0.00227 seconds.',
    order: 2
  },
  {
    id: '3',
    question: 'What is the speed of sound in different media?',
    answer: 'Sound speed varies by medium: air at 20°C is ~343 m/s, water is ~1,480 m/s, steel is ~5,960 m/s, and human tissue is ~1,540 m/s (used in medical ultrasound). Sound travels faster in denser, stiffer materials because particles are closer together and transmit vibrations more efficiently.',
    order: 3
  },
  {
    id: '4',
    question: 'What is the speed of light and electromagnetic waves?',
    answer: 'The speed of light in a vacuum is exactly 299,792,458 m/s (approximately 3×10^8 m/s). All electromagnetic waves—including radio waves, microwaves, infrared, visible light, UV, X-rays, and gamma rays—travel at this speed in a vacuum. In other media, light travels slower based on the refractive index.',
    order: 4
  },
  {
    id: '5',
    question: 'What frequency range can humans hear?',
    answer: 'Humans can typically hear frequencies between 20 Hz and 20,000 Hz (20 kHz). Frequencies below 20 Hz are called infrasound, while those above 20 kHz are ultrasound. Hearing sensitivity decreases with age, especially for higher frequencies. Dogs can hear up to 65 kHz, and bats use ultrasound up to 200 kHz.',
    order: 5
  },
  {
    id: '6',
    question: 'What is the electromagnetic spectrum?',
    answer: 'The electromagnetic spectrum covers all EM waves by frequency/wavelength: radio waves (longest), microwaves, infrared, visible light (400-700nm), ultraviolet, X-rays, and gamma rays (shortest). All travel at light speed but differ in energy—higher frequency means higher energy. Visible light is a tiny portion of the full spectrum.',
    order: 6
  }
];

export default function WavePropertiesCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('wave-properties-calculator');

  const [frequency, setFrequency] = useState('440');
  const [wavelength, setWavelength] = useState('');
  const [waveSpeed, setWaveSpeed] = useState('343');
  const [period, setPeriod] = useState('');

  const [freqResult, setFreqResult] = useState('440 Hz');
  const [wavelengthResult, setWavelengthResult] = useState('0.78 m');
  const [speedResult, setSpeedResult] = useState('343 m/s');
  const [periodResult, setPeriodResult] = useState('0.0023 s');
  const [waveTypeDisplay, setWaveTypeDisplay] = useState('Sound Wave (Audible Range)');

  useEffect(() => {
    calculateWave();
  }, [frequency, wavelength, waveSpeed, period]);

  const setWavePreset = (type: string) => {
    const preset = wavePresets[type];
    setFrequency(preset.frequency.toString());
    setWaveSpeed(preset.speed.toString());
    setWavelength('');
    setPeriod('');
  };

  const calculateWave = () => {
    const freq = parseFloat(frequency) || 0;
    const wavelengthInput = parseFloat(wavelength);
    const speed = parseFloat(waveSpeed) || 0;
    const periodInput = parseFloat(period);

    let calcWavelength = wavelengthInput;
    let calcPeriod = periodInput;

    if (!calcWavelength || isNaN(calcWavelength)) {
      calcWavelength = freq > 0 ? speed / freq : 0;
    }

    if (!calcPeriod || isNaN(calcPeriod)) {
      calcPeriod = freq > 0 ? 1 / freq : 0;
    }

    // Determine wave type
    let waveType = 'Unknown Wave';
    if (freq >= 20 && freq <= 20000 && Math.abs(speed - 343) < 100) {
      waveType = 'Sound Wave (Audible Range)';
    } else if (freq >= 20000 && freq <= 1e9 && Math.abs(speed - 343) < 1000) {
      waveType = 'Ultrasonic Wave';
    } else if (freq >= 4e14 && freq <= 8e14 && Math.abs(speed - 3e8) < 1e7) {
      waveType = 'Visible Light';
    } else if (freq >= 3e4 && freq <= 3e11 && Math.abs(speed - 3e8) < 1e7) {
      waveType = 'Radio Wave';
    } else if (freq < 20 && speed > 1000) {
      waveType = 'Seismic Wave';
    }

    // Update results with smart formatting
    setFreqResult(formatNumber(freq) + ' Hz');
    setWavelengthResult(formatNumber(calcWavelength) + ' m');
    setSpeedResult(formatNumber(speed) + ' m/s');
    setPeriodResult(formatNumber(calcPeriod) + ' s');
    setWaveTypeDisplay(waveType);
  };

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    if (Math.abs(num) >= 1e6 || Math.abs(num) < 0.001) {
      return num.toExponential(2);
    }
    return num.toFixed(num < 1 ? 4 : 2);
  };

  // Schema.org structured data
  const webAppSchema = generateWebAppSchema(
    'Wave Properties Calculator',
    'Calculate frequency, wavelength, wave speed, and period using the wave equation v = fλ',
    'https://example.com/us/tools/calculators/wave-properties-calculator',
    'Utility'
  );

  return (
    <article className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 rounded-2xl p-3 sm:p-5 md:p-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {getH1('Wave Properties Calculator')}
        </h1>
        <p className="text-xl text-cyan-100">
          {getSubHeading('Calculate frequency, wavelength, wave speed, and period using v = fλ')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
        {/* Calculator Section */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">

          {/* Wave Properties Calculator */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Wave Properties Calculator</h3>

            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="bg-cyan-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-cyan-800">Basic Wave Parameters</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency (f) Hz</label>
                    <input
                      type="number"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Wavelength (λ) m</label>
                    <input
                      type="number"
                      value={wavelength}
                      onChange={(e) => setWavelength(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Auto-calculated"
                      step="0.001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Wave Speed (v) m/s</label>
                    <input
                      type="number"
                      value={waveSpeed}
                      onChange={(e) => setWaveSpeed(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      step="0.1"
                      placeholder="Speed of sound"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Period (T) s</label>
                    <input
                      type="number"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Auto-calculated"
                      step="0.000001"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-green-800">Wave Type Presets</h4>
                <div className="grid md:grid-cols-3 gap-2">
                  <button onClick={() => setWavePreset('sound')} className="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">Sound in Air</button>
                  <button onClick={() => setWavePreset('light')} className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">Light in Vacuum</button>
                  <button onClick={() => setWavePreset('water')} className="px-3 py-2 bg-cyan-600 text-white rounded-md text-sm hover:bg-cyan-700">Water Wave</button>
                  <button onClick={() => setWavePreset('radio')} className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700">Radio Wave</button>
                  <button onClick={() => setWavePreset('ultrasound')} className="px-3 py-2 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700">Ultrasound</button>
                  <button onClick={() => setWavePreset('earthquake')} className="px-3 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700">Seismic Wave</button>
                </div>
              </div>

              <button onClick={calculateWave} className="w-full bg-cyan-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-lg hover:bg-cyan-700 transition">
                Calculate Wave Properties
              </button>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Understanding Waves Section */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding Waves</h3>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Wave Equation</h4>
                <p className="text-lg font-mono text-blue-600 mb-2">v = fλ</p>
                <p className="text-sm text-blue-700">Wave speed equals frequency times wavelength</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Period-Frequency Relationship</h4>
                <p className="text-lg font-mono text-green-600 mb-2">T = 1/f</p>
                <p className="text-sm text-green-700">Period is the inverse of frequency</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Key Properties</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>Frequency: oscillations per second</li>
                    <li>Wavelength: distance between peaks</li>
                    <li>Period: time for one complete cycle</li>
                    <li>Speed: distance traveled per second</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Applications</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>Sound engineering</li>
                    <li>Radio communications</li>
                    <li>Medical ultrasound</li>
                    <li>Seismology</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Wave Types Section */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Common Wave Types</h3>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-2">🔊</div>
                <h4 className="font-semibold text-blue-800 mb-2">Sound Waves</h4>
                <p className="text-sm text-blue-700">20 Hz - 20 kHz<br />343 m/s in air</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl mb-2">💡</div>
                <h4 className="font-semibold text-green-800 mb-2">Light Waves</h4>
                <p className="text-sm text-green-700">400-700 nm<br />3×10⁸ m/s in vacuum</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-2">📻</div>
                <h4 className="font-semibold text-purple-800 mb-2">Radio Waves</h4>
                <p className="text-sm text-purple-700">3 kHz - 300 GHz<br />3×10⁸ m/s in vacuum</p>
              </div>
            </div>
          </div>
</div>

        {/* Results Sidebar - NOT sticky */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Wave Results */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Wave Results</h3>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="text-center p-3 bg-cyan-50 rounded-lg">
                <div className="text-sm font-bold text-cyan-600">{freqResult}</div>
                <div className="text-xs text-cyan-700">Frequency</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-sm font-bold text-green-600">{wavelengthResult}</div>
                <div className="text-xs text-green-700">Wavelength</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-sm font-bold text-purple-600">{speedResult}</div>
                <div className="text-xs text-purple-700">Wave Speed</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-sm font-bold text-orange-600">{periodResult}</div>
                <div className="text-xs text-orange-700">Period</div>
              </div>
            </div>

            {/* Wave Info */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">Wave Type</h4>
              <div className="text-xs text-gray-700">
                {waveTypeDisplay}
              </div>
            </div>
          </div>

          {/* Formula Reference */}
          <div className="bg-cyan-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-cyan-800 mb-3">Wave Formulas</h3>
            <div className="space-y-2 text-sm text-cyan-700">
              <div><strong>v = fλ</strong> (wave equation)</div>
              <div><strong>T = 1/f</strong> (period)</div>
              <div><strong>f = 1/T</strong> (frequency)</div>
              <div><strong>λ = v/f</strong> (wavelength)</div>
            </div>
          </div>

          {/* Unit Conversions */}
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-green-800 mb-3">Unit Conversions</h3>
            <div className="space-y-2 text-sm text-green-700">
              <div><strong>Frequency:</strong></div>
              <div>1 Hz = 1 cycle/second</div>
              <div>1 kHz = 1,000 Hz</div>
              <div>1 MHz = 10⁶ Hz</div>
              <div>1 GHz = 10⁹ Hz</div>
            </div>
          </div>

          {/* Common Speeds */}
          <div className="bg-purple-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-purple-800 mb-3">Wave Speeds</h3>
            <div className="space-y-2 text-sm text-purple-700">
              <div><strong>Sound in air:</strong> 343 m/s</div>
              <div><strong>Sound in water:</strong> 1,480 m/s</div>
              <div><strong>Sound in steel:</strong> 5,960 m/s</div>
              <div><strong>Light:</strong> 3×10⁸ m/s</div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Mobile MREC2 - Before FAQs */}


      

      <CalculatorMobileMrec2 />



      

      {/* FAQ Section */}
      <FirebaseFAQs pageId="wave-properties-calculator" fallbackFaqs={fallbackFaqs} className="mt-8 mb-4 sm:mb-6 md:mb-8" />

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Physics Calculators</h2>
        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="block p-3 sm:p-4 md:p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:border-cyan-300 border border-transparent transition-all">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{calc.title}</h3>
              <p className="text-gray-600 text-sm">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface PasswordStrengthCalculatorClientProps {
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
    question: "What is a Password Strength Calculator?",
    answer: "A Password Strength Calculator is a free online tool designed to help you quickly and accurately calculate password strength-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Password Strength Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Password Strength Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Password Strength Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function PasswordStrengthCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: PasswordStrengthCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('password-strength-calculator');

  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [strength, setStrength] = useState('');
  const [strengthColor, setStrengthColor] = useState('');
  const [strengthWidth, setStrengthWidth] = useState('0%');
  const [lengthDisplay, setLengthDisplay] = useState('');
  const [charTypesDisplay, setCharTypesDisplay] = useState('');
  const [entropyDisplay, setEntropyDisplay] = useState('');
  const [crackTimeDisplay, setCrackTimeDisplay] = useState('');
  const [checksList, setChecksList] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const [genLength, setGenLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copyMessage, setCopyMessage] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return '< 1 minute';
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000000) return `${Math.round(seconds / 31536000)} years`;
    return 'Centuries';
  };

  const analyzePassword = (pwd: string) => {
    // Character type analysis
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumbers = /\d/.test(pwd);
    const hasSymbols = /[^a-zA-Z0-9]/.test(pwd);

    const charTypes = [hasLower, hasUpper, hasNumbers, hasSymbols].filter(Boolean).length;

    // Calculate entropy
    let charsetSize = 0;
    if (hasLower) charsetSize += 26;
    if (hasUpper) charsetSize += 26;
    if (hasNumbers) charsetSize += 10;
    if (hasSymbols) charsetSize += 32;

    const entropy = pwd.length * Math.log2(charsetSize);

    // Estimate crack time (assuming 1 billion guesses per second)
    const guesses = Math.pow(charsetSize, pwd.length) / 2;
    const secondsToCrack = guesses / 1000000000;

    // Determine strength
    let currentStrength: string;
    let currentColor: string;
    let currentWidth: string;

    if (entropy < 40) {
      currentStrength = 'Very Weak';
      currentColor = 'bg-red-500';
      currentWidth = '20%';
    } else if (entropy < 56) {
      currentStrength = 'Weak';
      currentColor = 'bg-orange-500';
      currentWidth = '40%';
    } else if (entropy < 71) {
      currentStrength = 'Fair';
      currentColor = 'bg-yellow-500';
      currentWidth = '60%';
    } else if (entropy < 91) {
      currentStrength = 'Strong';
      currentColor = 'bg-blue-500';
      currentWidth = '80%';
    } else {
      currentStrength = 'Very Strong';
      currentColor = 'bg-green-500';
      currentWidth = '100%';
    }

    // Update display
    setStrength(currentStrength);
    setStrengthColor(currentColor);
    setStrengthWidth(currentWidth);
    setLengthDisplay(`${pwd.length} characters`);
    setCharTypesDisplay(`${charTypes}/4 types`);
    setEntropyDisplay(entropy.toFixed(1));
    setCrackTimeDisplay(formatTime(secondsToCrack));

    // Security checks
    updateSecurityChecks(pwd, hasLower, hasUpper, hasNumbers, hasSymbols);

    // Recommendations
    updateRecommendations(pwd, entropy, charTypes, hasLower, hasUpper, hasNumbers, hasSymbols);
  };

  const updateSecurityChecks = (pwd: string, hasLower: boolean, hasUpper: boolean, hasNumbers: boolean, hasSymbols: boolean) => {
    const checks = [
      { condition: pwd.length >= 12, text: 'At least 12 characters', icon: '✅' },
      { condition: pwd.length < 12, text: 'Less than 12 characters', icon: '❌' },
      { condition: hasLower, text: 'Contains lowercase letters', icon: '✅' },
      { condition: !hasLower, text: 'Missing lowercase letters', icon: '❌' },
      { condition: hasUpper, text: 'Contains uppercase letters', icon: '✅' },
      { condition: !hasUpper, text: 'Missing uppercase letters', icon: '❌' },
      { condition: hasNumbers, text: 'Contains numbers', icon: '✅' },
      { condition: !hasNumbers, text: 'Missing numbers', icon: '❌' },
      { condition: hasSymbols, text: 'Contains symbols', icon: '✅' },
      { condition: !hasSymbols, text: 'Missing symbols', icon: '❌' },
      { condition: !/(.)\1{2,}/.test(pwd), text: 'No repeated characters', icon: '✅' },
      { condition: /(.)\1{2,}/.test(pwd), text: 'Contains repeated characters', icon: '⚠️' },
      { condition: !/123|abc|qwe/i.test(pwd), text: 'No common sequences', icon: '✅' },
      { condition: /123|abc|qwe/i.test(pwd), text: 'Contains common sequences', icon: '⚠️' }
    ];

    const visibleChecks = checks.filter(check => check.condition);
    const checkStrings = visibleChecks.map(check => `${check.icon}|${check.text}`);
    setChecksList(checkStrings);
  };

  const updateRecommendations = (pwd: string, entropy: number, charTypes: number, hasLower: boolean, hasUpper: boolean, hasNumbers: boolean, hasSymbols: boolean) => {
    const recs: string[] = [];

    if (pwd.length < 12) recs.push('• Increase length to at least 12-16 characters');
    if (charTypes < 3) recs.push('• Use a mix of character types (uppercase, lowercase, numbers, symbols)');
    if (entropy < 60) recs.push('• Consider using a passphrase or password manager');
    if (/(.)\1{2,}/.test(pwd)) recs.push('• Avoid repeated characters');
    if (/123|abc|qwe/i.test(pwd)) recs.push('• Avoid common sequences');
    if (!/[^a-zA-Z0-9]/.test(pwd)) recs.push('• Add special characters for better security');

    if (recs.length === 0) {
      recs.push('• Excellent password! Consider using a password manager');
      recs.push('• Enable two-factor authentication where possible');
      recs.push('• Never reuse this password on other accounts');
    }

    setRecommendations(recs);
  };

  const generatePassword = () => {
    if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
      alert('Please select at least one character type.');
      return;
    }

    let charset = '';
    if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let pwd = '';
    for (let i = 0; i < genLength; i++) {
      pwd += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setGeneratedPassword(pwd);
    setCopyMessage('');
  };

  const copyToClipboard = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword).then(() => {
        setCopyMessage('✅ Password copied to clipboard!');
        setTimeout(() => {
          setCopyMessage('');
        }, 2000);
      });
    }
  };

  useEffect(() => {
    if (password.length > 0) {
      analyzePassword(password);
    }
  }, [password]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8">
        {/* Header */}
        <header className="text-center mb-6 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{getH1('Password Strength Calculator')}</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Test your password strength and security level with real-time analysis. Get insights on password complexity and time-to-crack estimates.
          </p>
        </header>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Left Column: Input & Analysis (2/3) */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Password Input */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Test Password Strength</h3>

              <div className="mb-4 md:mb-6">
                <label htmlFor="password" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Enter Password to Test
                  <span className="text-xs text-gray-500 ml-2">(Your password is not stored or transmitted)</span>
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    id="password"
                    className="w-full px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12"
                    placeholder="Enter your password here..."
                    autoComplete="off"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl hover:text-gray-700 text-gray-500"
                  >
                    {passwordVisible ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Strength Meter */}
              {password.length > 0 && (
                <div id="strengthMeter" className="mb-4 md:mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs md:text-sm font-medium text-gray-700">Password Strength</span>
                    <span id="strengthLabel" className="text-xs md:text-sm font-bold">{strength}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      id="strengthBar"
                      className={`h-3 rounded-full transition-all duration-300 ${strengthColor}`}
                      style={{ width: strengthWidth }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Real-time Analysis */}
              {password.length > 0 && (
                <div id="analysis" className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="p-3 md:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">Password Length</div>
                    <div id="lengthDisplay" className="text-base md:text-lg font-bold text-blue-700">{lengthDisplay}</div>
                  </div>
                  <div className="p-3 md:p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <div className="text-xs text-gray-600 mb-1">Character Types</div>
                    <div id="charTypesDisplay" className="text-base md:text-lg font-bold text-purple-700">{charTypesDisplay}</div>
                  </div>
                  <div className="p-3 md:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="text-xs text-gray-600 mb-1">Entropy (bits)</div>
                    <div id="entropyDisplay" className="text-base md:text-lg font-bold text-green-700">{entropyDisplay}</div>
                  </div>
                  <div className="p-3 md:p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
                    <div className="text-xs text-gray-600 mb-1">Time to Crack</div>
                    <div id="crackTimeDisplay" className="text-base md:text-lg font-bold text-orange-700">{crackTimeDisplay}</div>
                  </div>
                </div>
              )}

              {/* Security Checks */}
              {password.length > 0 && (
                <div id="securityChecks">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Security Analysis</h3>
                  <div id="checksList" className="space-y-2 text-xs md:text-sm">
                    {checksList.map((check, index) => {
                      const [icon, text] = check.split('|');
                      return (
                        <div key={index} className="flex items-center">
                          <span className="mr-2">{icon}</span>
                          <span>{text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {password.length > 0 && (
                <div id="recommendations" className="mt-4 md:mt-6 p-3 md:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                  <h3 className="text-base md:text-lg font-semibold text-blue-800 mb-2 md:mb-3">💡 Recommendations</h3>
                  <div id="recommendationsList" className="text-xs md:text-sm text-blue-700">
                    {recommendations.map((rec, index) => (
                      <div key={index}>{rec}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

            {/* Password Generator */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Generate Secure Password</h3>

              <div className="mb-4 md:mb-6">
                <label htmlFor="genLength" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Password Length: <span id="lengthValue" className="text-blue-600 font-bold">{genLength} characters</span>
                </label>
                <input
                  type="range"
                  id="genLength"
                  min="8"
                  max="32"
                  value={genLength}
                  onChange={(e) => setGenLength(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>8</span>
                  <span>16 (Recommended)</span>
                  <span>32</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-all ${useUppercase ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                  <input
                    type="checkbox"
                    id="useUppercase"
                    checked={useUppercase}
                    onChange={(e) => setUseUppercase(e.target.checked)}
                    className="mr-2 accent-blue-600"
                  />
                  <span className="text-xs md:text-sm">Uppercase (A-Z)</span>
                </label>
                <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-all ${useLowercase ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                  <input
                    type="checkbox"
                    id="useLowercase"
                    checked={useLowercase}
                    onChange={(e) => setUseLowercase(e.target.checked)}
                    className="mr-2 accent-blue-600"
                  />
                  <span className="text-xs md:text-sm">Lowercase (a-z)</span>
                </label>
                <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-all ${useNumbers ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                  <input
                    type="checkbox"
                    id="useNumbers"
                    checked={useNumbers}
                    onChange={(e) => setUseNumbers(e.target.checked)}
                    className="mr-2 accent-blue-600"
                  />
                  <span className="text-xs md:text-sm">Numbers (0-9)</span>
                </label>
                <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-all ${useSymbols ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                  <input
                    type="checkbox"
                    id="useSymbols"
                    checked={useSymbols}
                    onChange={(e) => setUseSymbols(e.target.checked)}
                    className="mr-2 accent-blue-600"
                  />
                  <span className="text-xs md:text-sm">Symbols (!@#$)</span>
                </label>
              </div>

              <button
                onClick={generatePassword}
                className="w-full bg-green-600 text-white py-2 md:py-3 px-4 rounded-lg text-sm md:text-base font-semibold hover:bg-green-700 transition-colors mb-3 md:mb-4"
              >
                🎲 Generate Secure Password
              </button>

              {generatedPassword ? (
                <div
                  onClick={copyToClipboard}
                  className="p-3 md:p-4 bg-green-100 rounded-lg font-mono text-sm md:text-base border-2 border-green-300 text-center text-green-800 cursor-pointer break-all"
                >
                  {copyMessage || generatedPassword}
                </div>
              ) : (
                <div className="p-3 md:p-4 bg-gray-100 rounded-lg font-mono text-sm md:text-base border-2 border-dashed border-gray-300 text-center text-gray-500 break-all">
                  Generated password will appear here
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Info Sidebar (1/3) */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl shadow-lg p-4 md:p-6 border-2 border-red-200">
              <h3 className="text-base md:text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
                <span>🔒</span> Best Practices
              </h3>
              <ul className="space-y-2 text-xs md:text-sm text-red-700">
                <li>• Use at least 12-16 characters</li>
                <li>• Mix uppercase, lowercase, numbers, symbols</li>
                <li>• Avoid dictionary words</li>
                <li>• Don&apos;t reuse passwords</li>
                <li>• Use a password manager</li>
              </ul>
            </div>
<div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg p-4 md:p-6 border-2 border-amber-200">
              <h3 className="text-base md:text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
                <span>⚠️</span> Avoid Mistakes
              </h3>
              <ul className="space-y-2 text-xs md:text-sm text-amber-700">
                <li>• Personal information (birthday, names)</li>
                <li>• Common patterns (123456, qwerty)</li>
                <li>• Simple substitutions (@ for a)</li>
                <li>• Single word with numbers</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-4 md:p-6 border-2 border-green-200">
              <h3 className="text-base md:text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                <span>🛡️</span> Strength Levels
              </h3>
              <div className="space-y-2 text-xs md:text-sm text-green-700">
                <div><strong>Very Weak:</strong> &lt;40 bits entropy</div>
                <div><strong>Weak:</strong> 40-55 bits</div>
                <div><strong>Fair:</strong> 56-70 bits</div>
                <div><strong>Strong:</strong> 71-90 bits</div>
                <div><strong>Very Strong:</strong> &gt;90 bits</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-4 md:p-6 border-2 border-blue-200">
              <h3 className="text-base md:text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                <span>🔐</span> Privacy Notice
              </h3>
              <p className="text-xs md:text-sm text-blue-700">
                Your passwords are analyzed locally in your browser and are never sent to our servers or stored anywhere.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 text-center">
          Related Finance Calculators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {relatedCalculators.map((calc, index) => (
            <Link
              key={index}
              href={calc.href}
              className="block group"
            >
              <div className={`${calc.color || 'bg-gray-500'} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1`}>
                <h3 className="text-lg font-bold mb-2 group-hover:underline">
                  {calc.title}
                </h3>
                <p className="text-sm opacity-90">
                  {calc.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="password-strength-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </>
  );
}

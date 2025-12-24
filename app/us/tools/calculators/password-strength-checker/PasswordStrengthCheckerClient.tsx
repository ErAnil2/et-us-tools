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

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const commonPasswords = new Set([
  '123456', 'password', '123456789', '12345678', '12345', '1234567',
  'qwerty', 'abc123', 'password123', 'admin', 'letmein', 'welcome',
  'monkey', '1234567890', 'dragon', 'princess', 'football', 'iloveyou'
]);

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Password Strength Checker Calculator?",
    answer: "A Password Strength Checker Calculator is a free online tool designed to help you quickly and accurately calculate password strength checker-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Password Strength Checker Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Password Strength Checker Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Password Strength Checker Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function PasswordStrengthCheckerClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('password-strength-checker');

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [passwordLength, setPasswordLength] = useState('0 characters');
  const [characterTypes, setCharacterTypes] = useState('0/4');
  const [entropy, setEntropy] = useState('0 bits');
  const [crackTime, setCrackTime] = useState('Instantly');
  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthText, setStrengthText] = useState('Enter password');
  const [strengthColor, setStrengthColor] = useState('text-gray-600');
  const [strengthBarWidth, setStrengthBarWidth] = useState('0%');
  const [strengthBarColor, setStrengthBarColor] = useState('bg-gray-300');

  const [feedbackClass, setFeedbackClass] = useState('mt-4 md:mt-6 p-3 md:p-4 rounded-lg bg-gray-100 border-l-4 border-gray-400');
  const [feedbackTitle, setFeedbackTitle] = useState('Password Feedback');
  const [feedbackContent, setFeedbackContent] = useState('Enter a password to see detailed security analysis and recommendations.');

  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    numbers: false,
    symbols: false,
    common: true
  });

  // Generator state
  const [genLength, setGenLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [generatedStrength, setGeneratedStrength] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copy');

  useEffect(() => {
    analyzePassword();
  }, [password]);

  useEffect(() => {
    generatePassword();
  }, []);

  const analyzePassword = () => {
    if (!password) {
      resetAnalysis();
      return;
    }

    const length = password.length;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);
    const charTypes = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;

    let charset = 0;
    if (hasLowercase) charset += 26;
    if (hasUppercase) charset += 26;
    if (hasNumbers) charset += 10;
    if (hasSymbols) charset += 32;

    const ent = Math.log2(Math.pow(charset, length));
    const combinations = Math.pow(charset, length);
    const crack = calculateCrackTime(combinations);
    const isCommon = commonPasswords.has(password.toLowerCase());
    const score = calculateStrengthScore(password, length, charTypes, isCommon, ent);

    setPasswordLength(`${length} characters`);
    setCharacterTypes(`${charTypes}/4`);
    setEntropy(`${Math.round(ent)} bits`);
    setCrackTime(crack);
    setStrengthScore(score);

    setRequirements({
      length: length >= 12,
      uppercase: hasUppercase,
      lowercase: hasLowercase,
      numbers: hasNumbers,
      symbols: hasSymbols,
      common: !isCommon
    });

    updateStrengthIndicator(score);
    updateFeedback(password, score, length, charTypes, isCommon);
  };

  const calculateStrengthScore = (pwd: string, length: number, charTypes: number, isCommon: boolean, ent: number) => {
    let score = 0;

    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (length >= 20) score += 1;

    score += charTypes;

    if (ent >= 30) score += 1;
    if (ent >= 60) score += 1;
    if (ent >= 90) score += 1;

    if (isCommon) score = Math.max(0, score - 4);
    if (/(.)\1{2,}/.test(pwd)) score = Math.max(0, score - 2);
    if (/123|abc|qwe/i.test(pwd)) score = Math.max(0, score - 2);

    return Math.min(10, Math.max(0, score));
  };

  const calculateCrackTime = (combinations: number) => {
    const guessesPerSecond = 1e9;
    const secondsToCrack = combinations / (2 * guessesPerSecond);

    if (secondsToCrack < 1) return 'Instantly';
    if (secondsToCrack < 60) return `${Math.ceil(secondsToCrack)} seconds`;
    if (secondsToCrack < 3600) return `${Math.ceil(secondsToCrack / 60)} minutes`;
    if (secondsToCrack < 86400) return `${Math.ceil(secondsToCrack / 3600)} hours`;
    if (secondsToCrack < 31536000) return `${Math.ceil(secondsToCrack / 86400)} days`;
    if (secondsToCrack < 31536000 * 1000) return `${Math.ceil(secondsToCrack / 31536000)} years`;
    return 'Centuries';
  };

  const updateStrengthIndicator = (score: number) => {
    const width = (score / 10) * 100;
    setStrengthBarWidth(`${width}%`);

    if (score <= 2) {
      setStrengthBarColor('bg-red-500');
      setStrengthText('Very Weak');
      setStrengthColor('text-red-600');
    } else if (score <= 4) {
      setStrengthBarColor('bg-orange-500');
      setStrengthText('Weak');
      setStrengthColor('text-orange-600');
    } else if (score <= 6) {
      setStrengthBarColor('bg-yellow-500');
      setStrengthText('Fair');
      setStrengthColor('text-yellow-600');
    } else if (score <= 8) {
      setStrengthBarColor('bg-blue-500');
      setStrengthText('Good');
      setStrengthColor('text-blue-600');
    } else {
      setStrengthBarColor('bg-green-500');
      setStrengthText('Very Strong');
      setStrengthColor('text-green-600');
    }
  };

  const updateFeedback = (pwd: string, score: number, length: number, charTypes: number, isCommon: boolean) => {
    let panelClass, titleText, feedback;

    if (score <= 2) {
      panelClass = 'mt-4 md:mt-6 p-3 md:p-4 rounded-lg bg-red-100 border-l-4 border-red-500';
      titleText = '🚨 Very Weak Password';
      feedback = `Your password is extremely vulnerable. ${getImprovementSuggestions(length, charTypes, isCommon)}`;
    } else if (score <= 4) {
      panelClass = 'mt-4 md:mt-6 p-3 md:p-4 rounded-lg bg-orange-100 border-l-4 border-orange-500';
      titleText = '⚠️ Weak Password';
      feedback = `Your password needs significant improvement. ${getImprovementSuggestions(length, charTypes, isCommon)}`;
    } else if (score <= 6) {
      panelClass = 'mt-4 md:mt-6 p-3 md:p-4 rounded-lg bg-yellow-100 border-l-4 border-yellow-500';
      titleText = '🔶 Fair Password';
      feedback = `Your password is okay but could be stronger. ${getImprovementSuggestions(length, charTypes, isCommon)}`;
    } else if (score <= 8) {
      panelClass = 'mt-4 md:mt-6 p-3 md:p-4 rounded-lg bg-blue-100 border-l-4 border-blue-500';
      titleText = '🔷 Good Password';
      feedback = 'Your password is quite secure! Consider adding more length or complexity for maximum security.';
    } else {
      panelClass = 'mt-4 md:mt-6 p-3 md:p-4 rounded-lg bg-green-100 border-l-4 border-green-500';
      titleText = '🛡️ Very Strong Password';
      feedback = 'Excellent! Your password is very secure and follows best practices.';
    }

    setFeedbackClass(panelClass);
    setFeedbackTitle(titleText);
    setFeedbackContent(feedback);
  };

  const getImprovementSuggestions = (length: number, charTypes: number, isCommon: boolean) => {
    const suggestions = [];
    if (length < 12) suggestions.push('make it at least 12 characters long');
    if (charTypes < 3) suggestions.push('use a mix of uppercase, lowercase, numbers, and symbols');
    if (isCommon) suggestions.push('avoid common passwords');
    return suggestions.length > 0 ? 'Try to ' + suggestions.join(', ') + '.' : '';
  };

  const resetAnalysis = () => {
    setPasswordLength('0 characters');
    setCharacterTypes('0/4');
    setEntropy('0 bits');
    setCrackTime('Instantly');
    setStrengthBarWidth('0%');
    setStrengthBarColor('bg-gray-300');
    setStrengthText('Enter password');
    setStrengthColor('text-gray-600');
    setFeedbackClass('mt-4 md:mt-6 p-3 md:p-4 rounded-lg bg-gray-100 border-l-4 border-gray-400');
    setFeedbackTitle('Password Feedback');
    setFeedbackContent('Enter a password to see detailed security analysis and recommendations.');
    setRequirements({
      length: false,
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: false,
      common: true
    });
  };

  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += excludeAmbiguous ? 'ABCDEFGHJKMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += excludeAmbiguous ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += excludeAmbiguous ? '23456789' : '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      alert('Please select at least one character type');
      return;
    }

    let pwd = '';
    for (let i = 0; i < genLength; i++) {
      pwd += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setGeneratedPassword(pwd);

    const score = calculateStrengthScore(pwd, genLength,
      [includeUppercase, includeLowercase, includeNumbers, includeSymbols].filter(Boolean).length,
      false, Math.log2(Math.pow(charset.length, genLength)));

    const strengthTexts = ['Very Weak', 'Very Weak', 'Weak', 'Weak', 'Fair', 'Fair', 'Good', 'Good', 'Very Strong', 'Very Strong', 'Very Strong'];
    setGeneratedStrength(`Strength: ${strengthTexts[score]} (${score}/10)`);
  };

  const copyPassword = () => {
    if (!generatedPassword) {
      alert('Generate a password first');
      return;
    }

    navigator.clipboard.writeText(generatedPassword).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => {
        setCopyButtonText('Copy');
      }, 2000);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8">
      <header className="text-center mb-6 md:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{getH1('Password Strength Checker')}</h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
          Test your password strength with real-time security analysis. Generate secure passwords and learn best practices to protect your online accounts.
        </p>
        <div className="mt-4 inline-block px-2 py-2 bg-green-100 border-2 border-green-300 rounded-lg">
          <p className="text-xs md:text-sm text-green-800 font-medium">
            🔒 Your password is analyzed locally - nothing is sent to our servers
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Test Your Password</h3>

            <div className="mb-4 md:mb-6">
              <label htmlFor="passwordInput" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Enter Password to Analyze
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="passwordInput"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12"
                  placeholder="Type your password here..."
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl hover:text-gray-700 text-gray-500"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="mb-4 md:mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs md:text-sm font-medium text-gray-700">Password Strength</span>
                <span className={`text-xs md:text-sm font-bold ${strengthColor}`}>{strengthText}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${strengthBarColor}`}
                  style={{ width: strengthBarWidth }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="p-3 md:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="text-xs text-gray-600 mb-1">Password Length</div>
                <div className="text-base md:text-lg font-bold text-blue-700">{passwordLength}</div>
              </div>
              <div className="p-3 md:p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="text-xs text-gray-600 mb-1">Character Types</div>
                <div className="text-base md:text-lg font-bold text-purple-700">{characterTypes}</div>
              </div>
              <div className="p-3 md:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="text-xs text-gray-600 mb-1">Entropy</div>
                <div className="text-base md:text-lg font-bold text-green-700">{entropy}</div>
              </div>
              <div className="p-3 md:p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
                <div className="text-xs text-gray-600 mb-1">Time to Crack</div>
                <div className="text-base md:text-lg font-bold text-orange-700">{crackTime}</div>
              </div>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Security Requirements</h3>
              <div className="space-y-2 text-xs md:text-sm">
                <div className={`flex items-center gap-2 p-2 rounded-lg ${requirements.length ? 'bg-green-50' : 'bg-red-50'}`}>
                  <span className={`w-4 h-4 rounded-full ${requirements.length ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-gray-600">At least 12 characters</span>
                </div>
                <div className={`flex items-center gap-2 p-2 rounded-lg ${requirements.uppercase ? 'bg-green-50' : 'bg-red-50'}`}>
                  <span className={`w-4 h-4 rounded-full ${requirements.uppercase ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-gray-600">Uppercase letters (A-Z)</span>
                </div>
                <div className={`flex items-center gap-2 p-2 rounded-lg ${requirements.lowercase ? 'bg-green-50' : 'bg-red-50'}`}>
                  <span className={`w-4 h-4 rounded-full ${requirements.lowercase ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-gray-600">Lowercase letters (a-z)</span>
                </div>
                <div className={`flex items-center gap-2 p-2 rounded-lg ${requirements.numbers ? 'bg-green-50' : 'bg-red-50'}`}>
                  <span className={`w-4 h-4 rounded-full ${requirements.numbers ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-gray-600">Numbers (0-9)</span>
                </div>
                <div className={`flex items-center gap-2 p-2 rounded-lg ${requirements.symbols ? 'bg-green-50' : 'bg-red-50'}`}>
                  <span className={`w-4 h-4 rounded-full ${requirements.symbols ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-gray-600">Special characters (!@#$%)</span>
                </div>
                <div className={`flex items-center gap-2 p-2 rounded-lg ${requirements.common ? 'bg-green-50' : 'bg-red-50'}`}>
                  <span className={`w-4 h-4 rounded-full ${requirements.common ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-gray-600">Not a common password</span>
                </div>
              </div>
            </div>

            <div className={feedbackClass}>
              <h3 className="text-base md:text-lg font-medium mb-2">{feedbackTitle}</h3>
              <div className="text-xs md:text-sm text-gray-700">{feedbackContent}</div>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Secure Password Generator</h3>

            <div className="mb-4 md:mb-6">
              <label htmlFor="lengthSlider" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Password Length: <span className="text-blue-600 font-bold">{genLength}</span>
              </label>
              <input
                type="range"
                id="lengthSlider"
                min="8"
                max="50"
                value={genLength}
                onChange={(e) => setGenLength(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>8</span>
                <span>16 (Recommended)</span>
                <span>50</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
              <label className="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="mr-2 accent-blue-600"
                />
                <span className="text-xs md:text-sm">Uppercase (A-Z)</span>
              </label>
              <label className="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  className="mr-2 accent-blue-600"
                />
                <span className="text-xs md:text-sm">Lowercase (a-z)</span>
              </label>
              <label className="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="mr-2 accent-blue-600"
                />
                <span className="text-xs md:text-sm">Numbers (0-9)</span>
              </label>
              <label className="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="mr-2 accent-blue-600"
                />
                <span className="text-xs md:text-sm">Symbols (!@#$)</span>
              </label>
            </div>

            <div className="mb-4">
              <label className="flex items-center text-xs md:text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={excludeAmbiguous}
                  onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                  className="mr-2 accent-blue-600"
                />
                <span>Exclude ambiguous characters (0oO, 1lI)</span>
              </label>
            </div>

            <button
              onClick={generatePassword}
              className="w-full bg-green-600 text-white py-2 md:py-3 px-4 rounded-lg text-sm md:text-base font-semibold hover:bg-green-700 transition-colors mb-3 md:mb-4"
            >
              🎲 Generate Secure Password
            </button>

            <div className="relative">
              <input
                type="text"
                value={generatedPassword}
                readOnly
                className="w-full px-3 md:px-2 py-2 md:py-3 pr-20 border-2 border-gray-300 rounded-lg bg-gray-50 font-mono text-sm md:text-base break-all"
                placeholder="Click Generate to create password"
              />
              <button
                onClick={copyPassword}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white text-xs md:text-sm rounded hover:bg-blue-700 transition-colors"
              >
                {copyButtonText}
              </button>
            </div>

            <div className="text-xs text-gray-500 mt-2">{generatedStrength}</div>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-4 md:p-6 border-2 border-green-200">
            <h3 className="text-base md:text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
              <span>✅</span> Best Practices
            </h3>
            <ul className="space-y-2 text-xs md:text-sm text-green-700">
              <li>• Use unique passwords for each account</li>
              <li>• Make passwords at least 12 characters</li>
              <li>• Mix letters, numbers, and symbols</li>
              <li>• Use a password manager</li>
              <li>• Enable two-factor authentication</li>
              <li>• Update passwords after breaches</li>
            </ul>
          </div>
<div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl shadow-lg p-4 md:p-6 border-2 border-red-200">
            <h3 className="text-base md:text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
              <span>❌</span> Avoid These
            </h3>
            <ul className="space-y-2 text-xs md:text-sm text-red-700">
              <li>• Personal information (names, birthdays)</li>
              <li>• Dictionary words or common phrases</li>
              <li>• Sequential patterns (123456, qwerty)</li>
              <li>• Reusing passwords across sites</li>
              <li>• Storing passwords in plain text</li>
              <li>• Sharing passwords via email/text</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg p-4 md:p-6 border-2 border-amber-200">
            <h3 className="text-base md:text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
              <span>⚠️</span> Common Passwords
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-red-100 rounded border border-red-200 font-mono text-red-700">123456</div>
              <div className="p-2 bg-red-100 rounded border border-red-200 font-mono text-red-700">password</div>
              <div className="p-2 bg-red-100 rounded border border-red-200 font-mono text-red-700">qwerty</div>
              <div className="p-2 bg-red-100 rounded border border-red-200 font-mono text-red-700">admin</div>
            </div>
            <p className="text-xs text-amber-700 mt-3">
              These can be cracked instantly. Never use them!
            </p>
          </div>
        </div>
      </div>
      <div className="mb-4 sm:mb-6 md:mb-8 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6 text-center">Related Finance Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link
              key={index}
              href={calc.href}
              className={`${calc.color || 'bg-gray-500'} rounded-xl p-6 text-white hover:opacity-90 transition-opacity`}
            >
              <h3 className="text-lg font-semibold mb-2">{calc.title}</h3>
              <p className="text-sm opacity-90">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="password-strength-checker" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}

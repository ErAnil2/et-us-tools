'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

interface PasswordHistory {
  password: string;
}

const fallbackFaqs = [
  {
    id: '1',
    question: 'How does the password generator work?',
    answer: 'Our password generator uses cryptographically secure random number generation to create truly random passwords. You can customize the length and character types to meet your specific security requirements.',
    order: 1
  },
  {
    id: '2',
    question: 'What makes a strong password?',
    answer: 'A strong password should be at least 12 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special symbols. Avoid using personal information, dictionary words, or common patterns.',
    order: 2
  },
  {
    id: '3',
    question: 'Is it safe to use this password generator?',
    answer: 'Yes! All password generation happens entirely in your browser. No passwords are ever sent to our servers or stored anywhere. Your generated passwords remain completely private on your device.',
    order: 3
  },
  {
    id: '4',
    question: 'How long should my password be?',
    answer: 'We recommend at least 12 characters for standard accounts and 16+ characters for sensitive accounts like banking or email. Longer passwords are exponentially harder to crack.',
    order: 4
  },
  {
    id: '5',
    question: 'Should I use a different password for each account?',
    answer: 'Absolutely! Using unique passwords for each account prevents a breach on one site from compromising all your accounts. Use a password manager to keep track of different passwords.',
    order: 5
  },
  {
    id: '6',
    question: 'What are similar and ambiguous characters?',
    answer: 'Similar characters like "l", "1", "I", "0", and "O" can be confused when reading passwords. Ambiguous characters include brackets and quotes that may cause issues in some systems. Excluding these makes passwords easier to use.',
    order: 6
  }
];

export default function PasswordGeneratorClient() {
  const [password, setPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [beginWithLetter, setBeginWithLetter] = useState(false);
  const [noRepeats, setNoRepeats] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('Not Generated');
  const [strengthColor, setStrengthColor] = useState('#6B7280');
  const [strengthDescription, setStrengthDescription] = useState('Generate a password to see strength analysis');
  const [passwordHistory, setPasswordHistory] = useState<PasswordHistory[]>([]);
  const [multipleCount, setMultipleCount] = useState(5);
  const [multiplePasswords, setMultiplePasswords] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    numbers: false,
    symbols: false
  });

  const { getH1, getSubHeading, faqSchema } = usePageSEO('strong-password-generator');

  const webAppSchema = generateWebAppSchema(
    'Strong Password Generator - Free Online Secure Password Tool',
    'Free online password generator. Create strong, secure passwords with customizable length and character types. Generate multiple passwords instantly.',
    'https://economictimes.indiatimes.com/us/tools/apps/strong-password-generator',
    'Utility'
  );

  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      alert('Please select at least one character type.');
      return;
    }

    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '');
    }

    if (excludeAmbiguous) {
      charset = charset.replace(/[(){}[\]()"'`~,;.<>]/g, '');
    }

    let newPassword = '';
    const usedChars = new Set<string>();

    if (beginWithLetter) {
      const letters = charset.match(/[a-zA-Z]/g);
      if (letters && letters.length > 0) {
        const firstChar = letters[Math.floor(Math.random() * letters.length)];
        newPassword += firstChar;
        if (noRepeats) usedChars.add(firstChar);
      }
    }

    while (newPassword.length < passwordLength) {
      const randomChar = charset[Math.floor(Math.random() * charset.length)];

      if (noRepeats && usedChars.has(randomChar)) {
        continue;
      }

      newPassword += randomChar;
      if (noRepeats) usedChars.add(randomChar);

      if (noRepeats && usedChars.size >= charset.length && newPassword.length < passwordLength) {
        break;
      }
    }

    setPassword(newPassword);
    setPasswordVisible(true);
    analyzePasswordStrength(newPassword);
    addToHistory(newPassword);
  };

  const analyzePasswordStrength = (pwd: string) => {
    let score = 0;
    const feedback: string[] = [];

    const hasLength = pwd.length >= 8;
    if (hasLength) {
      score += 20;
    } else {
      feedback.push('Use at least 8 characters');
    }

    const hasUppercase = /[A-Z]/.test(pwd);
    if (hasUppercase) {
      score += 15;
    } else {
      feedback.push('Add uppercase letters');
    }

    const hasLowercase = /[a-z]/.test(pwd);
    if (hasLowercase) {
      score += 15;
    } else {
      feedback.push('Add lowercase letters');
    }

    const hasNumbers = /[0-9]/.test(pwd);
    if (hasNumbers) {
      score += 15;
    } else {
      feedback.push('Add numbers');
    }

    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(pwd);
    if (hasSymbols) {
      score += 15;
    } else {
      feedback.push('Add symbols');
    }

    if (pwd.length >= 12) score += 10;
    if (pwd.length >= 16) score += 10;

    setCriteria({
      length: hasLength,
      uppercase: hasUppercase,
      lowercase: hasLowercase,
      numbers: hasNumbers,
      symbols: hasSymbols
    });

    updateStrengthDisplay(score, feedback);
  };

  const updateStrengthDisplay = (score: number, feedback: string[]) => {
    let color: string, label: string, description: string;

    if (score < 30) {
      color = '#EF4444';
      label = 'Very Weak';
      description = 'This password is very weak. ' + feedback.join(', ') + '.';
    } else if (score < 50) {
      color = '#F97316';
      label = 'Weak';
      description = 'This password is weak. ' + feedback.join(', ') + '.';
    } else if (score < 70) {
      color = '#EAB308';
      label = 'Fair';
      description = 'This password is fair. Consider: ' + feedback.join(', ') + '.';
    } else if (score < 90) {
      color = '#22C55E';
      label = 'Strong';
      description = 'This password is strong! ' + (feedback.length ? 'To improve: ' + feedback.join(', ') : 'Good security.');
    } else {
      color = '#16A34A';
      label = 'Very Strong';
      description = 'Excellent! This password provides very strong security.';
    }

    setStrengthScore(score);
    setStrengthColor(color);
    setStrengthLabel(label);
    setStrengthDescription(description);
  };

  const addToHistory = (pwd: string) => {
    setPasswordHistory(prev => {
      const newHistory = [{ password: pwd }, ...prev].slice(0, 10);
      return newHistory;
    });
  };

  const clearHistory = () => {
    setPasswordHistory([]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1000);
    });
  };

  const copyPassword = () => {
    if (!password) {
      alert('Please generate a password first.');
      return;
    }
    copyToClipboard(password);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const generateMultiple = () => {
    const passwords: string[] = [];
    for (let i = 0; i < multipleCount; i++) {
      let charset = '';
      if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
      if (includeNumbers) charset += '0123456789';
      if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

      if (excludeSimilar) {
        charset = charset.replace(/[il1Lo0O]/g, '');
      }

      if (excludeAmbiguous) {
        charset = charset.replace(/[(){}[\]()"'`~,;.<>]/g, '');
      }

      let newPassword = '';
      const usedChars = new Set<string>();

      if (beginWithLetter) {
        const letters = charset.match(/[a-zA-Z]/g);
        if (letters && letters.length > 0) {
          const firstChar = letters[Math.floor(Math.random() * letters.length)];
          newPassword += firstChar;
          if (noRepeats) usedChars.add(firstChar);
        }
      }

      while (newPassword.length < passwordLength) {
        const randomChar = charset[Math.floor(Math.random() * charset.length)];

        if (noRepeats && usedChars.has(randomChar)) {
          continue;
        }

        newPassword += randomChar;
        if (noRepeats) usedChars.add(randomChar);

        if (noRepeats && usedChars.size >= charset.length && newPassword.length < passwordLength) {
          break;
        }
      }

      passwords.push(newPassword);
    }
    setMultiplePasswords(passwords);

    if (passwords.length > 0) {
      const lastPassword = passwords[passwords.length - 1];
      setPassword(lastPassword);
      analyzePasswordStrength(lastPassword);
      addToHistory(lastPassword);
    }
  };

  const setPreset = (type: string) => {
    switch (type) {
      case 'strong':
        setPasswordLength(16);
        setIncludeUppercase(true);
        setIncludeLowercase(true);
        setIncludeNumbers(true);
        setIncludeSymbols(true);
        setExcludeSimilar(true);
        setExcludeAmbiguous(false);
        setBeginWithLetter(false);
        setNoRepeats(false);
        break;
      case 'medium':
        setPasswordLength(12);
        setIncludeUppercase(true);
        setIncludeLowercase(true);
        setIncludeNumbers(true);
        setIncludeSymbols(false);
        setExcludeSimilar(false);
        setExcludeAmbiguous(false);
        setBeginWithLetter(false);
        setNoRepeats(false);
        break;
      case 'pin':
        setPasswordLength(4);
        setIncludeUppercase(false);
        setIncludeLowercase(false);
        setIncludeNumbers(true);
        setIncludeSymbols(false);
        setExcludeSimilar(false);
        setExcludeAmbiguous(false);
        setBeginWithLetter(false);
        setNoRepeats(false);
        break;
      case 'memorable':
        setPasswordLength(8);
        setIncludeUppercase(true);
        setIncludeLowercase(true);
        setIncludeNumbers(true);
        setIncludeSymbols(false);
        setExcludeSimilar(true);
        setExcludeAmbiguous(true);
        setBeginWithLetter(false);
        setNoRepeats(false);
        break;
    }
  };

  useEffect(() => {
    generatePassword();
  }, []);

  useEffect(() => {
    if (password) {
      generatePassword();
    }
  }, [passwordLength, includeUppercase, includeLowercase, includeNumbers, includeSymbols,
      excludeSimilar, excludeAmbiguous, beginWithLetter, noRepeats]);

  const relatedTools = [
    { href: '/us/tools/apps/hash-generator', title: 'Hash Generator', icon: '🔒' },
    { href: '/us/tools/apps/qr-generator', title: 'QR Code Generator', icon: '📱' },
    { href: '/us/tools/apps/random-number-generator', title: 'Random Number Generator', icon: '🎲' },
    { href: '/us/tools/apps/text-editor', title: 'Text Editor', icon: '📝' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
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
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-full mb-4">
          <span className="text-2xl">🔐</span>
          <span className="text-green-600 font-semibold">Password Generator</span>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
          {getH1('Strong Password Generator')}
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {getSubHeading('Create strong, secure passwords with customizable length and character types. Generate multiple passwords instantly.')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Mobile Stats Bar */}
      <div className="grid grid-cols-4 gap-2 mb-4 lg:hidden">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 text-center border border-green-200">
          <div className="text-xl font-bold text-green-600">{passwordLength}</div>
          <div className="text-xs text-green-700">Length</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 text-center border border-blue-200">
          <div className="text-xl font-bold text-blue-600">{strengthScore}%</div>
          <div className="text-xs text-blue-700">Strength</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 text-center border border-purple-200">
          <div className="text-xl font-bold text-purple-600">{passwordHistory.length}</div>
          <div className="text-xs text-purple-700">History</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
          <div className="text-xl font-bold text-amber-600">{multiplePasswords.length}</div>
          <div className="text-xs text-amber-700">Batch</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Password Generator Tool */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            {/* Generated Password Display */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Generated Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  readOnly
                  value={password}
                  placeholder="Click 'Generate Password' to create a secure password"
                  className="w-full p-4 pr-24 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-lg bg-gray-50"
                />
                <div className="absolute right-2 top-2 flex gap-1">
                  <button
                    onClick={copyPassword}
                    className={`p-2 ${copySuccess ? 'bg-green-700' : 'bg-green-600'} text-white rounded-lg hover:bg-green-700 transition-colors`}
                    title="Copy password"
                  >
                    {copySuccess ? '✓' : '📋'}
                  </button>
                  <button
                    onClick={togglePasswordVisibility}
                    className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    title="Toggle visibility"
                  >
                    {passwordVisible ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </div>

            {/* Strength Meter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Password Strength</span>
                <span style={{ color: strengthColor }} className="text-sm font-bold">{strengthLabel}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="h-3 rounded-full transition-all duration-300"
                  style={{ width: `${strengthScore}%`, backgroundColor: strengthColor }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">{strengthDescription}</div>
            </div>

            {/* Password Length */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-700">Password Length</label>
                <span className="text-lg font-bold text-green-600">{passwordLength}</span>
              </div>
              <input
                type="range"
                min="4"
                max="128"
                value={passwordLength}
                onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>4</span>
                <span>64</span>
                <span>128</span>
              </div>
            </div>

            {/* Character Types */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Include Character Types</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">Uppercase (A-Z)</span>
                </label>

                <label className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">Lowercase (a-z)</span>
                </label>

                <label className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">Numbers (0-9)</span>
                </label>

                <label className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">Symbols (!@#$...)</span>
                </label>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Advanced Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={excludeSimilar}
                    onChange={(e) => setExcludeSimilar(e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">Exclude similar (i,l,1,L,o,0,O)</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={excludeAmbiguous}
                    onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">Exclude ambiguous</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={beginWithLetter}
                    onChange={(e) => setBeginWithLetter(e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">Begin with letter</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={noRepeats}
                    onChange={(e) => setNoRepeats(e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">No repeated characters</span>
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generatePassword}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-[1.02]"
            >
              🔄 Generate Password
            </button>

            {/* Quick Presets */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Presets</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  onClick={() => setPreset('strong')}
                  className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  Strong (16)
                </button>
                <button
                  onClick={() => setPreset('medium')}
                  className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  Medium (12)
                </button>
                <button
                  onClick={() => setPreset('pin')}
                  className="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  PIN (4)
                </button>
                <button
                  onClick={() => setPreset('memorable')}
                  className="px-3 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors"
                >
                  Memorable (8)
                </button>
              </div>
            </div>
          </div>

          {/* Multiple Passwords */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Generate Multiple Passwords</h3>
              <select
                value={multipleCount}
                onChange={(e) => setMultipleCount(parseInt(e.target.value))}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="5">5 passwords</option>
                <option value="10">10 passwords</option>
                <option value="20">20 passwords</option>
              </select>
            </div>
            <button
              onClick={generateMultiple}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
            >
              Generate {multipleCount} Passwords
            </button>
            {multiplePasswords.length > 0 && (
              <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                {multiplePasswords.map((pwd, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <span className="font-mono text-sm flex-1 mr-2 truncate">{pwd}</span>
                    <button
                      onClick={() => copyToClipboard(pwd)}
                      className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Password Tips */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Password Security Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
              <div>
                <h4 className="font-semibold mb-2 text-green-600">🔐 Strong Passwords</h4>
                <ul className="text-sm space-y-1">
                  <li>• Use at least 12 characters</li>
                  <li>• Mix uppercase, lowercase, numbers, and symbols</li>
                  <li>• Avoid personal information</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-blue-600">🔄 Best Practices</h4>
                <ul className="text-sm space-y-1">
                  <li>• Use unique passwords for each account</li>
                  <li>• Enable two-factor authentication</li>
                  <li>• Use a password manager</li>
                </ul>
              </div>
            </div>
          </div>

          

          {/* Mobile MREC2 - Before FAQs */}


          

          <GameAppMobileMrec2 />



          

          {/* FAQs Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
            <FirebaseFAQs pageId="strong-password-generator" fallbackFaqs={fallbackFaqs} />
          </div>
        </div>
{/* Right Sidebar - 320px */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Desktop Stats */}
          <div className="hidden lg:block bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Password Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                <span className="text-sm text-green-700">Length</span>
                <span className="font-bold text-green-600">{passwordLength} chars</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                <span className="text-sm text-blue-700">Strength</span>
                <span className="font-bold" style={{ color: strengthColor }}>{strengthLabel}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                <span className="text-sm text-purple-700">Score</span>
                <span className="font-bold text-purple-600">{strengthScore}%</span>
              </div>
            </div>

            {/* Security Criteria */}
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm">Security Criteria</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="w-5 h-5 mr-2">{criteria.length ? '✅' : '⚪'}</span>
                  <span className="text-gray-600">8+ characters</span>
                </div>
                <div className="flex items-center">
                  <span className="w-5 h-5 mr-2">{criteria.uppercase ? '✅' : '⚪'}</span>
                  <span className="text-gray-600">Uppercase</span>
                </div>
                <div className="flex items-center">
                  <span className="w-5 h-5 mr-2">{criteria.lowercase ? '✅' : '⚪'}</span>
                  <span className="text-gray-600">Lowercase</span>
                </div>
                <div className="flex items-center">
                  <span className="w-5 h-5 mr-2">{criteria.numbers ? '✅' : '⚪'}</span>
                  <span className="text-gray-600">Numbers</span>
                </div>
                <div className="flex items-center">
                  <span className="w-5 h-5 mr-2">{criteria.symbols ? '✅' : '⚪'}</span>
                  <span className="text-gray-600">Symbols</span>
                </div>
              </div>
            </div>
          </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

          {/* Password History */}
          <div className="hidden lg:block bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-800">History</h3>
              <button
                onClick={clearHistory}
                className="text-xs text-red-600 hover:text-red-700 transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {passwordHistory.length === 0 ? (
                <div className="text-gray-500 text-center py-4 text-sm">No passwords yet</div>
              ) : (
                passwordHistory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                    <span className="font-mono text-xs flex-1 mr-2 truncate">{item.password}</span>
                    <button
                      onClick={() => copyToClipboard(item.password)}
                      className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ad Banner */}
          <AdBanner />
{/* Related Tools */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Related Tools</h3>
            <div className="space-y-2">
              {relatedTools.map((tool, index) => (
                <Link
                  key={index}
                  href={tool.href}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors group"
                >
                  <span className="text-xl">{tool.icon}</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">{tool.title}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
            <h3 className="text-lg font-bold text-green-800 mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>Use 16+ characters for maximum security</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>Include all character types when possible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>Never reuse passwords across accounts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>Store passwords in a secure password manager</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

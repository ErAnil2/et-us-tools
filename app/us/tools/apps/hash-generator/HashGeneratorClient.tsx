'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: 'What is a hash function?',
    answer: 'A hash function is a mathematical algorithm that converts data of any size into a fixed-size string of characters. It is a one-way function, meaning you cannot reverse it to get the original data. Common uses include password storage, data integrity verification, and digital signatures.',
    order: 1
  },
  {
    id: '2',
    question: 'What is the difference between MD5 and SHA-256?',
    answer: 'MD5 produces a 128-bit (32 character) hash and is faster but less secure - it is vulnerable to collisions. SHA-256 produces a 256-bit (64 character) hash and is much more secure. For security-critical applications, always use SHA-256 or SHA-512.',
    order: 2
  },
  {
    id: '3',
    question: 'Can I decrypt a hash to get the original text?',
    answer: 'No, hash functions are one-way and cannot be reversed. However, weak passwords can be cracked using rainbow tables or brute force attacks. This is why it is important to use strong, unique passwords and secure hashing algorithms with salting.',
    order: 3
  },
  {
    id: '4',
    question: 'Which hash algorithm should I use?',
    answer: 'For password storage, use bcrypt, scrypt, or Argon2 (not available in browsers). For file integrity, SHA-256 is excellent. MD5 and SHA-1 are considered insecure for cryptographic purposes but still useful for checksums.',
    order: 4
  },
  {
    id: '5',
    question: 'What are hashes used for?',
    answer: 'Common uses include: verifying file downloads (checksums), storing passwords securely, digital signatures, blockchain/cryptocurrency, detecting duplicate files, and data integrity verification.',
    order: 5
  },
  {
    id: '6',
    question: 'Is this tool secure to use?',
    answer: 'Yes! All hashing happens entirely in your browser using the Web Crypto API. No data is ever sent to any server. Your input remains completely private on your device.',
    order: 6
  }
];

type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

export default function HashGeneratorClient() {
  const [inputText, setInputText] = useState('');
  const [hashes, setHashes] = useState<Record<HashAlgorithm, string>>({
    'MD5': '',
    'SHA-1': '',
    'SHA-256': '',
    'SHA-384': '',
    'SHA-512': ''
  });
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [copied, setCopied] = useState<string | null>(null);
  const [uppercase, setUppercase] = useState(false);

  const { getH1, getSubHeading, faqSchema } = usePageSEO('hash-generator');

  const webAppSchema = generateWebAppSchema(
    'Hash Generator - Free Online MD5, SHA-256, SHA-512 Hash Tool',
    'Free online hash generator. Create MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes instantly. Secure, fast, and completely client-side.',
    'https://economictimes.indiatimes.com/us/tools/apps/hash-generator',
    'DeveloperApplication'
  );

  // MD5 implementation (since Web Crypto API doesn't support it)
  const md5 = (string: string): string => {
    function rotateLeft(value: number, shift: number): number {
      return (value << shift) | (value >>> (32 - shift));
    }

    function addUnsigned(x: number, y: number): number {
      const x8 = x & 0x80000000;
      const y8 = y & 0x80000000;
      const x4 = x & 0x40000000;
      const y4 = y & 0x40000000;
      const result = (x & 0x3FFFFFFF) + (y & 0x3FFFFFFF);
      if (x4 & y4) return result ^ 0x80000000 ^ x8 ^ y8;
      if (x4 | y4) {
        if (result & 0x40000000) return result ^ 0xC0000000 ^ x8 ^ y8;
        else return result ^ 0x40000000 ^ x8 ^ y8;
      } else return result ^ x8 ^ y8;
    }

    function F(x: number, y: number, z: number): number { return (x & y) | ((~x) & z); }
    function G(x: number, y: number, z: number): number { return (x & z) | (y & (~z)); }
    function H(x: number, y: number, z: number): number { return x ^ y ^ z; }
    function I(x: number, y: number, z: number): number { return y ^ (x | (~z)); }

    function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
      a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }

    function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
      a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }

    function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
      a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }

    function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
      a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }

    function wordToHex(value: number): string {
      let hex = '';
      for (let i = 0; i <= 3; i++) {
        const byte = (value >>> (i * 8)) & 255;
        hex += ('0' + byte.toString(16)).slice(-2);
      }
      return hex;
    }

    const utf8Encode = (s: string): string => {
      return unescape(encodeURIComponent(s));
    };

    let message = utf8Encode(string);
    const x: number[] = [];
    let k, AA, BB, CC, DD, a, b, c, d;
    const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    const S41 = 6, S42 = 10, S43 = 15, S44 = 21;

    let i;
    const msgLen = message.length;
    const wordArray: number[] = [];
    for (i = 0; i < msgLen; i++) {
      wordArray[i >> 2] |= (message.charCodeAt(i) & 0xFF) << ((i % 4) * 8);
    }
    wordArray[i >> 2] |= 0x80 << ((i % 4) * 8);

    const len = (((msgLen + 8) >>> 6) + 1) * 16;
    for (i = wordArray.length; i < len - 2; i++) wordArray[i] = 0;
    wordArray[len - 2] = (msgLen * 8) & 0xFFFFFFFF;
    wordArray[len - 1] = Math.floor((msgLen * 8) / 0x100000000);

    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    for (k = 0; k < len; k += 16) {
      AA = a; BB = b; CC = c; DD = d;

      a = FF(a, b, c, d, wordArray[k + 0], S11, 0xD76AA478);
      d = FF(d, a, b, c, wordArray[k + 1], S12, 0xE8C7B756);
      c = FF(c, d, a, b, wordArray[k + 2], S13, 0x242070DB);
      b = FF(b, c, d, a, wordArray[k + 3], S14, 0xC1BDCEEE);
      a = FF(a, b, c, d, wordArray[k + 4], S11, 0xF57C0FAF);
      d = FF(d, a, b, c, wordArray[k + 5], S12, 0x4787C62A);
      c = FF(c, d, a, b, wordArray[k + 6], S13, 0xA8304613);
      b = FF(b, c, d, a, wordArray[k + 7], S14, 0xFD469501);
      a = FF(a, b, c, d, wordArray[k + 8], S11, 0x698098D8);
      d = FF(d, a, b, c, wordArray[k + 9], S12, 0x8B44F7AF);
      c = FF(c, d, a, b, wordArray[k + 10], S13, 0xFFFF5BB1);
      b = FF(b, c, d, a, wordArray[k + 11], S14, 0x895CD7BE);
      a = FF(a, b, c, d, wordArray[k + 12], S11, 0x6B901122);
      d = FF(d, a, b, c, wordArray[k + 13], S12, 0xFD987193);
      c = FF(c, d, a, b, wordArray[k + 14], S13, 0xA679438E);
      b = FF(b, c, d, a, wordArray[k + 15], S14, 0x49B40821);

      a = GG(a, b, c, d, wordArray[k + 1], S21, 0xF61E2562);
      d = GG(d, a, b, c, wordArray[k + 6], S22, 0xC040B340);
      c = GG(c, d, a, b, wordArray[k + 11], S23, 0x265E5A51);
      b = GG(b, c, d, a, wordArray[k + 0], S24, 0xE9B6C7AA);
      a = GG(a, b, c, d, wordArray[k + 5], S21, 0xD62F105D);
      d = GG(d, a, b, c, wordArray[k + 10], S22, 0x02441453);
      c = GG(c, d, a, b, wordArray[k + 15], S23, 0xD8A1E681);
      b = GG(b, c, d, a, wordArray[k + 4], S24, 0xE7D3FBC8);
      a = GG(a, b, c, d, wordArray[k + 9], S21, 0x21E1CDE6);
      d = GG(d, a, b, c, wordArray[k + 14], S22, 0xC33707D6);
      c = GG(c, d, a, b, wordArray[k + 3], S23, 0xF4D50D87);
      b = GG(b, c, d, a, wordArray[k + 8], S24, 0x455A14ED);
      a = GG(a, b, c, d, wordArray[k + 13], S21, 0xA9E3E905);
      d = GG(d, a, b, c, wordArray[k + 2], S22, 0xFCEFA3F8);
      c = GG(c, d, a, b, wordArray[k + 7], S23, 0x676F02D9);
      b = GG(b, c, d, a, wordArray[k + 12], S24, 0x8D2A4C8A);

      a = HH(a, b, c, d, wordArray[k + 5], S31, 0xFFFA3942);
      d = HH(d, a, b, c, wordArray[k + 8], S32, 0x8771F681);
      c = HH(c, d, a, b, wordArray[k + 11], S33, 0x6D9D6122);
      b = HH(b, c, d, a, wordArray[k + 14], S34, 0xFDE5380C);
      a = HH(a, b, c, d, wordArray[k + 1], S31, 0xA4BEEA44);
      d = HH(d, a, b, c, wordArray[k + 4], S32, 0x4BDECFA9);
      c = HH(c, d, a, b, wordArray[k + 7], S33, 0xF6BB4B60);
      b = HH(b, c, d, a, wordArray[k + 10], S34, 0xBEBFBC70);
      a = HH(a, b, c, d, wordArray[k + 13], S31, 0x289B7EC6);
      d = HH(d, a, b, c, wordArray[k + 0], S32, 0xEAA127FA);
      c = HH(c, d, a, b, wordArray[k + 3], S33, 0xD4EF3085);
      b = HH(b, c, d, a, wordArray[k + 6], S34, 0x04881D05);
      a = HH(a, b, c, d, wordArray[k + 9], S31, 0xD9D4D039);
      d = HH(d, a, b, c, wordArray[k + 12], S32, 0xE6DB99E5);
      c = HH(c, d, a, b, wordArray[k + 15], S33, 0x1FA27CF8);
      b = HH(b, c, d, a, wordArray[k + 2], S34, 0xC4AC5665);

      a = II(a, b, c, d, wordArray[k + 0], S41, 0xF4292244);
      d = II(d, a, b, c, wordArray[k + 7], S42, 0x432AFF97);
      c = II(c, d, a, b, wordArray[k + 14], S43, 0xAB9423A7);
      b = II(b, c, d, a, wordArray[k + 5], S44, 0xFC93A039);
      a = II(a, b, c, d, wordArray[k + 12], S41, 0x655B59C3);
      d = II(d, a, b, c, wordArray[k + 3], S42, 0x8F0CCC92);
      c = II(c, d, a, b, wordArray[k + 10], S43, 0xFFEFF47D);
      b = II(b, c, d, a, wordArray[k + 1], S44, 0x85845DD1);
      a = II(a, b, c, d, wordArray[k + 8], S41, 0x6FA87E4F);
      d = II(d, a, b, c, wordArray[k + 15], S42, 0xFE2CE6E0);
      c = II(c, d, a, b, wordArray[k + 6], S43, 0xA3014314);
      b = II(b, c, d, a, wordArray[k + 13], S44, 0x4E0811A1);
      a = II(a, b, c, d, wordArray[k + 4], S41, 0xF7537E82);
      d = II(d, a, b, c, wordArray[k + 11], S42, 0xBD3AF235);
      c = II(c, d, a, b, wordArray[k + 2], S43, 0x2AD7D2BB);
      b = II(b, c, d, a, wordArray[k + 9], S44, 0xEB86D391);

      a = addUnsigned(a, AA);
      b = addUnsigned(b, BB);
      c = addUnsigned(c, CC);
      d = addUnsigned(d, DD);
    }

    return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
  };

  // Generate hash using Web Crypto API
  const generateHash = async (text: string, algorithm: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  useEffect(() => {
    const generateAllHashes = async () => {
      if (!inputText) {
        setHashes({
          'MD5': '',
          'SHA-1': '',
          'SHA-256': '',
          'SHA-384': '',
          'SHA-512': ''
        });
        return;
      }

      const newHashes: Record<HashAlgorithm, string> = {
        'MD5': md5(inputText),
        'SHA-1': await generateHash(inputText, 'SHA-1'),
        'SHA-256': await generateHash(inputText, 'SHA-256'),
        'SHA-384': await generateHash(inputText, 'SHA-384'),
        'SHA-512': await generateHash(inputText, 'SHA-512')
      };

      setHashes(newHashes);
    };

    generateAllHashes();
  }, [inputText]);

  const handleCopy = (algorithm: HashAlgorithm) => {
    const hash = uppercase ? hashes[algorithm].toUpperCase() : hashes[algorithm];
    navigator.clipboard.writeText(hash);
    setCopied(algorithm);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClear = () => {
    setInputText('');
  };

  const algorithms: { name: HashAlgorithm; bits: number; secure: boolean }[] = [
    { name: 'MD5', bits: 128, secure: false },
    { name: 'SHA-1', bits: 160, secure: false },
    { name: 'SHA-256', bits: 256, secure: true },
    { name: 'SHA-384', bits: 384, secure: true },
    { name: 'SHA-512', bits: 512, secure: true }
  ];

  const relatedTools = [
    { href: '/us/tools/apps/strong-password-generator', title: 'Password Generator', icon: '🔐' },
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
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-100 to-teal-100 px-6 py-3 rounded-full mb-4">
          <span className="text-2xl">🔒</span>
          <span className="text-emerald-600 font-semibold">Hash Generator</span>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
          {getH1('Hash Generator')}
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {getSubHeading('Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes instantly. Secure, fast, and completely client-side.')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Mobile Stats Bar */}
      <div className="grid grid-cols-4 gap-2 mb-4 lg:hidden">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 text-center border border-emerald-200">
          <div className="text-xl font-bold text-emerald-600">{inputText.length}</div>
          <div className="text-xs text-emerald-700">Chars</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 text-center border border-blue-200">
          <div className="text-xl font-bold text-blue-600">5</div>
          <div className="text-xs text-blue-700">Algorithms</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 text-center border border-purple-200">
          <div className="text-xl font-bold text-purple-600">{hashes['SHA-256'] ? '64' : '0'}</div>
          <div className="text-xs text-purple-700">SHA-256</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
          <div className="text-xl font-bold text-amber-600">{hashes['MD5'] ? '32' : '0'}</div>
          <div className="text-xs text-amber-700">MD5</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-semibold text-gray-800">Enter text to hash:</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={uppercase}
                    onChange={(e) => setUppercase(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="text-sm text-gray-600">Uppercase</span>
                </label>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  Clear
                </button>
              </div>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste text here to generate hashes..."
              className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-gray-800"
            />
          </div>

          {/* Hash Results */}
          <div className="space-y-4 mb-6">
            {algorithms.map((algo) => (
              <div
                key={algo.name}
                className={`bg-white rounded-xl shadow-lg p-5 border-l-4 ${
                  algo.secure ? 'border-emerald-500' : 'border-yellow-500'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-800">{algo.name}</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {algo.bits} bits
                    </span>
                    {algo.secure ? (
                      <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded">
                        Secure
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                        Legacy
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopy(algo.name)}
                    disabled={!hashes[algo.name]}
                    className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {copied === algo.name ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="font-mono text-sm bg-gray-50 p-3 rounded-lg break-all text-gray-700">
                  {hashes[algo.name]
                    ? (uppercase ? hashes[algo.name].toUpperCase() : hashes[algo.name])
                    : 'Enter text above to generate hash...'}
                </div>
              </div>
            ))}
          </div>

          {/* Algorithm Comparison */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Algorithm Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-emerald-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Algorithm</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Output Size</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Security</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-emerald-100">
                    <td className="py-3 px-4 font-medium">MD5</td>
                    <td className="py-3 px-4">128 bits (32 chars)</td>
                    <td className="py-3 px-4"><span className="text-yellow-600">Weak</span></td>
                    <td className="py-3 px-4">Checksums, non-security uses</td>
                  </tr>
                  <tr className="border-b border-emerald-100">
                    <td className="py-3 px-4 font-medium">SHA-1</td>
                    <td className="py-3 px-4">160 bits (40 chars)</td>
                    <td className="py-3 px-4"><span className="text-yellow-600">Deprecated</span></td>
                    <td className="py-3 px-4">Legacy systems only</td>
                  </tr>
                  <tr className="border-b border-emerald-100">
                    <td className="py-3 px-4 font-medium">SHA-256</td>
                    <td className="py-3 px-4">256 bits (64 chars)</td>
                    <td className="py-3 px-4"><span className="text-emerald-600">Strong</span></td>
                    <td className="py-3 px-4">General security, Bitcoin</td>
                  </tr>
                  <tr className="border-b border-emerald-100">
                    <td className="py-3 px-4 font-medium">SHA-384</td>
                    <td className="py-3 px-4">384 bits (96 chars)</td>
                    <td className="py-3 px-4"><span className="text-emerald-600">Strong</span></td>
                    <td className="py-3 px-4">High security applications</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">SHA-512</td>
                    <td className="py-3 px-4">512 bits (128 chars)</td>
                    <td className="py-3 px-4"><span className="text-emerald-600">Very Strong</span></td>
                    <td className="py-3 px-4">Maximum security needs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          

          {/* Mobile MREC2 - Before FAQs */}


          

          <GameAppMobileMrec2 />



          

          {/* FAQs Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
            <FirebaseFAQs pageId="hash-generator" fallbackFaqs={fallbackFaqs} />
          </div>
        </div>
{/* Right Sidebar - 320px */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Desktop Stats */}
          <div className="hidden lg:block bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Hash Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
                <span className="text-sm text-emerald-700">Input Length</span>
                <span className="font-bold text-emerald-600">{inputText.length} chars</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                <span className="text-sm text-blue-700">Algorithms</span>
                <span className="font-bold text-blue-600">5</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                <span className="text-sm text-purple-700">SHA-256 Length</span>
                <span className="font-bold text-purple-600">{hashes['SHA-256'] ? '64' : '0'}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl">
                <span className="text-sm text-amber-700">MD5 Length</span>
                <span className="font-bold text-amber-600">{hashes['MD5'] ? '32' : '0'}</span>
              </div>
            </div>
          </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

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
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors group"
                >
                  <span className="text-xl">{tool.icon}</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600">{tool.title}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200">
            <h3 className="text-lg font-bold text-emerald-800 mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-sm text-emerald-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">•</span>
                <span>Use SHA-256 or higher for security</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">•</span>
                <span>MD5 is only suitable for checksums</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">•</span>
                <span>Hashes are one-way - cannot be reversed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">•</span>
                <span>All processing happens in your browser</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import Link from 'next/link';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface SubnetRequirement {
  name: string;
  hosts: number;
}

interface VLSMAllocation {
  name: string;
  network: string;
  mask: string;
  firstHost: string;
  lastHost: string;
  broadcast: string;
  requestedHosts: number;
  actualHosts: number;
  waste: number;
}

interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface SubnetCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

type TabType = 'cidr' | 'subnet' | 'vlsm';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Subnet Calculator?",
    answer: "A Subnet Calculator is a free online tool designed to help you quickly and accurately calculate subnet-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Subnet Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Subnet Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Subnet Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function SubnetCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: SubnetCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('subnet-calculator');

  const [activeTab, setActiveTab] = useState<TabType>('cidr');

  // CIDR Tab State
  const [networkAddress, setNetworkAddress] = useState('192.168.1.0');
  const [cidrPrefix, setCidrPrefix] = useState(24);

  // Subnet Mask Tab State
  const [ipAddress, setIpAddress] = useState('192.168.1.100');
  const [subnetMask, setSubnetMask] = useState('255.255.255.0');

  // VLSM Tab State
  const [baseNetwork, setBaseNetwork] = useState('10.0.0.0');
  const [basePrefix, setBasePrefix] = useState(8);
  const [subnetRequirements, setSubnetRequirements] = useState<SubnetRequirement[]>([
    { name: 'LAN A', hosts: 100 },
    { name: 'LAN B', hosts: 50 }
  ]);

  // Results State
  const [results, setResults] = useState({
    network: '192.168.1.0/24',
    mask: '255.255.255.0',
    wildcard: '0.0.0.255',
    firstHost: '192.168.1.1',
    lastHost: '192.168.1.254',
    broadcast: '192.168.1.255',
    hostCount: '254',
    ipClass: 'Class C (Private)',
    networkBinary: '11000000.10101000.00000001.00000000',
    maskBinary: '11111111.11111111.11111111.00000000',
    wildcardBinary: '00000000.00000000.00000000.11111111'
  });

  const [vlsmAllocations, setVlsmAllocations] = useState<VLSMAllocation[]>([]);

  // IP Utility Functions
  const ipToDecimal = (ip: string): number => {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
  };

  const decimalToIp = (decimal: number): string => {
    return [
      (decimal >>> 24) & 255,
      (decimal >>> 16) & 255,
      (decimal >>> 8) & 255,
      decimal & 255
    ].join('.');
  };

  const ipToBinary = (ip: string): string => {
    return ip.split('.').map(octet =>
      parseInt(octet).toString(2).padStart(8, '0')
    ).join('.');
  };

  const prefixToMask = (prefix: number): string => {
    const mask = (0xFFFFFFFF << (32 - prefix)) >>> 0;
    return decimalToIp(mask);
  };

  const maskToPrefix = (mask: string): number => {
    const decimal = ipToDecimal(mask);
    return decimal.toString(2).split('1').length - 1;
  };

  const isValidIP = (ip: string): boolean => {
    const pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return pattern.test(ip);
  };

  const getIPClass = (ip: string): string => {
    const firstOctet = parseInt(ip.split('.')[0]);
    const isPrivate =
      (firstOctet === 10) ||
      (firstOctet === 172 && parseInt(ip.split('.')[1]) >= 16 && parseInt(ip.split('.')[1]) <= 31) ||
      (firstOctet === 192 && parseInt(ip.split('.')[1]) === 168);

    let ipClass = '';
    if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'Class A';
    else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'Class B';
    else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'Class C';
    else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'Class D (Multicast)';
    else ipClass = 'Class E (Reserved)';

    return ipClass + (isPrivate ? ' (Private)' : ' (Public)');
  };

  // Calculate Subnet
  const calculateSubnet = () => {
    let networkIp: string;
    let prefix: number;

    if (activeTab === 'cidr') {
      networkIp = networkAddress.trim();
      prefix = cidrPrefix;
    } else if (activeTab === 'subnet') {
      const ip = ipAddress.trim();
      const mask = subnetMask.trim();
      prefix = maskToPrefix(mask);

      const ipDecimal = ipToDecimal(ip);
      const maskDecimal = ipToDecimal(mask);
      const networkDecimal = (ipDecimal & maskDecimal) >>> 0;
      networkIp = decimalToIp(networkDecimal);
    } else {
      return;
    }

    if (!isValidIP(networkIp) || prefix < 1 || prefix > 30) {
      return;
    }

    const subnetMaskStr = prefixToMask(prefix);
    const wildcardMask = prefixToMask(32 - prefix);

    const networkDecimal = ipToDecimal(networkIp);
    const hostBits = 32 - prefix;
    const totalHosts = Math.pow(2, hostBits) - 2;

    const firstHostDecimal = networkDecimal + 1;
    const lastHostDecimal = networkDecimal + Math.pow(2, hostBits) - 2;
    const broadcastDecimal = networkDecimal + Math.pow(2, hostBits) - 1;

    setResults({
      network: `${networkIp}/${prefix}`,
      mask: subnetMaskStr,
      wildcard: wildcardMask,
      firstHost: decimalToIp(firstHostDecimal),
      lastHost: decimalToIp(lastHostDecimal),
      broadcast: decimalToIp(broadcastDecimal),
      hostCount: totalHosts.toLocaleString(),
      ipClass: getIPClass(networkIp),
      networkBinary: ipToBinary(networkIp),
      maskBinary: ipToBinary(subnetMaskStr),
      wildcardBinary: ipToBinary(wildcardMask)
    });
  };

  // Calculate VLSM
  const calculateVLSM = () => {
    const baseNetworkAddr = baseNetwork.trim();

    if (!isValidIP(baseNetworkAddr)) return;

    const requirements = subnetRequirements
      .filter(req => req.name && req.hosts > 0)
      .map(req => ({
        ...req,
        prefix: 32 - Math.ceil(Math.log2(req.hosts + 2))
      }))
      .sort((a, b) => b.hosts - a.hosts);

    let currentNetwork = ipToDecimal(baseNetworkAddr);
    const allocations: VLSMAllocation[] = [];

    requirements.forEach(req => {
      const subnetSize = Math.pow(2, 32 - req.prefix);
      const networkAddr = decimalToIp(currentNetwork);
      const broadcastAddr = decimalToIp(currentNetwork + subnetSize - 1);
      const firstHost = decimalToIp(currentNetwork + 1);
      const lastHost = decimalToIp(currentNetwork + subnetSize - 2);
      const actualHosts = subnetSize - 2;

      allocations.push({
        name: req.name,
        network: `${networkAddr}/${req.prefix}`,
        mask: prefixToMask(req.prefix),
        firstHost,
        lastHost,
        broadcast: broadcastAddr,
        requestedHosts: req.hosts,
        actualHosts,
        waste: actualHosts - req.hosts
      });

      currentNetwork += subnetSize;
    });

    setVlsmAllocations(allocations);
  };

  // Tab switching
  const switchTab = (tabName: TabType) => {
    setActiveTab(tabName);
  };

  // Helper functions
  const applyPreset = (network: string, prefix: number) => {
    setNetworkAddress(network);
    setCidrPrefix(prefix);
  };

  const applyMask = (mask: string) => {
    setSubnetMask(mask);
  };

  const addSubnetRequirement = () => {
    setSubnetRequirements([...subnetRequirements, { name: '', hosts: 0 }]);
  };

  const removeSubnetRequirement = (index: number) => {
    setSubnetRequirements(subnetRequirements.filter((_, i) => i !== index));
  };

  const updateSubnetRequirement = (index: number, field: 'name' | 'hosts', value: string | number) => {
    const updated = [...subnetRequirements];
    if (field === 'name') {
      updated[index].name = value as string;
    } else {
      updated[index].hosts = value as number;
    }
    setSubnetRequirements(updated);
  };

  const copyAllResults = () => {
    const resultText = `
Network: ${results.network}
Subnet Mask: ${results.mask}
Wildcard Mask: ${results.wildcard}
First Host: ${results.firstHost}
Last Host: ${results.lastHost}
Broadcast: ${results.broadcast}
Total Hosts: ${results.hostCount}
IP Class: ${results.ipClass}
    `.trim();

    navigator.clipboard.writeText(resultText).then(() => {
      alert('✅ Results copied to clipboard!');
    });
  };

  const exportVLSM = () => {
    alert('📥 VLSM export feature - Coming soon!');
  };

  // Effects
  useEffect(() => {
    if (activeTab === 'vlsm') {
      calculateVLSM();
    } else {
      calculateSubnet();
    }
  }, [activeTab, networkAddress, cidrPrefix, ipAddress, subnetMask, baseNetwork, basePrefix, subnetRequirements]);

  useEffect(() => {
    calculateSubnet();
  }, []);

  return (
    <>
      <div className="max-w-[1180px] mx-auto px-2 md:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{getH1('Subnet Calculator')}</h1>
          <p className="text-sm md:text-lg text-gray-600 mb-4 md:mb-6 max-w-3xl mx-auto">
            Calculate IPv4 subnets, CIDR notation, host ranges, and VLSM planning with visual breakdown and binary representation
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
          {/* Left Column: Input Forms */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <div className="flex flex-wrap gap-2 mb-3 sm:mb-4 md:mb-6 border-b border-gray-200 pb-2">
                <button
                  onClick={() => switchTab('cidr')}
                  className={`tab-btn px-2 py-2 text-sm md:text-base font-medium rounded-t-lg border-b-2 ${
                    activeTab === 'cidr'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  🌐 CIDR Notation
                </button>
                <button
                  onClick={() => switchTab('subnet')}
                  className={`tab-btn px-2 py-2 text-sm md:text-base font-medium rounded-t-lg border-b-2 ${
                    activeTab === 'subnet'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  🔢 Subnet Mask
                </button>
                <button
                  onClick={() => switchTab('vlsm')}
                  className={`tab-btn px-2 py-2 text-sm md:text-base font-medium rounded-t-lg border-b-2 ${
                    activeTab === 'vlsm'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📊 VLSM Planning
                </button>
              </div>

              {/* CIDR Tab */}
              {activeTab === 'cidr' && (
                <div className="tab-content">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="networkAddress" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        Network Address
                      </label>
                      <input
                        type="text"
                        id="networkAddress"
                        value={networkAddress}
                        onChange={(e) => setNetworkAddress(e.target.value)}
                        placeholder="192.168.1.0"
                        className="w-full px-3 md:px-2 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      />
                    </div>

                    <div>
                      <label htmlFor="cidrPrefix" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        CIDR Prefix
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          id="cidrPrefix"
                          value={cidrPrefix}
                          onChange={(e) => setCidrPrefix(parseInt(e.target.value))}
                          min="1"
                          max="30"
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-lg md:text-xl font-bold text-blue-600 min-w-[50px] text-center">/{cidrPrefix}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>/1</span>
                        <span>More Hosts →</span>
                        <span>/30</span>
                      </div>
                    </div>

                    {/* Quick Presets */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-blue-800 mb-2">🚀 Quick Presets</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => applyPreset('192.168.1.0', 24)}
                          className="preset-btn px-3 py-2 bg-blue-100 text-blue-700 rounded text-xs md:text-sm hover:bg-blue-200 transition-colors"
                        >
                          /24 (254 hosts)
                        </button>
                        <button
                          onClick={() => applyPreset('10.0.0.0', 8)}
                          className="preset-btn px-3 py-2 bg-blue-100 text-blue-700 rounded text-xs md:text-sm hover:bg-blue-200 transition-colors"
                        >
                          /8 Class A
                        </button>
                        <button
                          onClick={() => applyPreset('172.16.0.0', 16)}
                          className="preset-btn px-3 py-2 bg-blue-100 text-blue-700 rounded text-xs md:text-sm hover:bg-blue-200 transition-colors"
                        >
                          /16 Class B
                        </button>
                        <button
                          onClick={() => applyPreset('192.168.0.0', 16)}
                          className="preset-btn px-3 py-2 bg-blue-100 text-blue-700 rounded text-xs md:text-sm hover:bg-blue-200 transition-colors"
                        >
                          /16 Large LAN
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Subnet Mask Tab */}
              {activeTab === 'subnet' && (
                <div className="tab-content">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="ipAddress" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        IP Address
                      </label>
                      <input
                        type="text"
                        id="ipAddress"
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        placeholder="192.168.1.100"
                        className="w-full px-3 md:px-2 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      />
                    </div>

                    <div>
                      <label htmlFor="subnetMask" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        Subnet Mask
                      </label>
                      <input
                        type="text"
                        id="subnetMask"
                        value={subnetMask}
                        onChange={(e) => setSubnetMask(e.target.value)}
                        placeholder="255.255.255.0"
                        className="w-full px-3 md:px-2 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      />
                    </div>

                    {/* Common Masks */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-green-800 mb-2">📝 Common Masks</h4>
                      <div className="grid grid-cols-1 gap-2 text-xs md:text-sm">
                        <button
                          onClick={() => applyMask('255.0.0.0')}
                          className="text-left px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          255.0.0.0 (/8) - 16,777,214 hosts
                        </button>
                        <button
                          onClick={() => applyMask('255.255.0.0')}
                          className="text-left px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          255.255.0.0 (/16) - 65,534 hosts
                        </button>
                        <button
                          onClick={() => applyMask('255.255.255.0')}
                          className="text-left px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          255.255.255.0 (/24) - 254 hosts
                        </button>
                        <button
                          onClick={() => applyMask('255.255.255.252')}
                          className="text-left px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          255.255.255.252 (/30) - 2 hosts (P2P)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VLSM Tab */}
              {activeTab === 'vlsm' && (
                <div className="tab-content">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="baseNetwork" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                          Base Network
                        </label>
                        <input
                          type="text"
                          id="baseNetwork"
                          value={baseNetwork}
                          onChange={(e) => setBaseNetwork(e.target.value)}
                          placeholder="10.0.0.0"
                          className="w-full px-3 md:px-2 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                        />
                      </div>

                      <div>
                        <label htmlFor="basePrefix" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                          Base Prefix
                        </label>
                        <input
                          type="number"
                          id="basePrefix"
                          value={basePrefix}
                          onChange={(e) => setBasePrefix(parseInt(e.target.value) || 8)}
                          min="1"
                          max="30"
                          className="w-full px-3 md:px-2 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                        />
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-semibold text-purple-800">🏢 Subnet Requirements</h4>
                        <button
                          onClick={addSubnetRequirement}
                          className="px-3 py-1 bg-purple-600 text-white rounded text-xs md:text-sm hover:bg-purple-700 transition-colors"
                        >
                          + Add Subnet
                        </button>
                      </div>
                      <div className="space-y-2">
                        {subnetRequirements.map((req, index) => (
                          <div key={index} className="req-item grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input
                              type="text"
                              placeholder="Subnet name"
                              className="subnet-name px-3 py-2 text-sm border border-purple-300 rounded-lg"
                              value={req.name}
                              onChange={(e) => updateSubnetRequirement(index, 'name', e.target.value)}
                            />
                            <input
                              type="number"
                              placeholder="Hosts"
                              className="hosts-needed px-3 py-2 text-sm border border-purple-300 rounded-lg"
                              value={req.hosts}
                              onChange={(e) => updateSubnetRequirement(index, 'hosts', parseInt(e.target.value) || 0)}
                              min="1"
                            />
                            <button
                              onClick={() => removeSubnetRequirement(index)}
                              className="remove-req px-3 py-2 bg-red-500 text-white rounded-lg text-xs md:text-sm hover:bg-red-600"
                            >
                              🗑️ Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          </div>

          {/* Right Column: Results */}
          <div className="space-y-6 md:space-y-8">
            {/* Main Results */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">📊 Subnet Info</h3>
                <button
                  onClick={copyAllResults}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                >
                  📋 Copy
                </button>
              </div>

              {/* Network Address Display */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-center mb-4">
                <div className="text-xs text-blue-100 mb-1">Network Address</div>
                <div className="text-xl md:text-2xl font-bold text-white font-mono">{results.network}</div>
              </div>

              {/* Key Metrics Grid */}
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <span className="text-xs md:text-sm text-gray-600">Subnet Mask:</span>
                  <span className="text-xs md:text-sm font-mono font-semibold text-gray-900">{results.mask}</span>
                </div>

                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <span className="text-xs md:text-sm text-gray-600">Wildcard Mask:</span>
                  <span className="text-xs md:text-sm font-mono font-semibold text-gray-900">{results.wildcard}</span>
                </div>

                <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded border-l-4 border-green-500">
                  <span className="text-xs md:text-sm text-green-700">First Host:</span>
                  <span className="text-xs md:text-sm font-mono font-semibold text-green-700">{results.firstHost}</span>
                </div>

                <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded border-l-4 border-green-500">
                  <span className="text-xs md:text-sm text-green-700">Last Host:</span>
                  <span className="text-xs md:text-sm font-mono font-semibold text-green-700">{results.lastHost}</span>
                </div>

                <div className="flex justify-between items-center py-2 px-3 bg-orange-50 rounded border-l-4 border-orange-500">
                  <span className="text-xs md:text-sm text-orange-700">Broadcast:</span>
                  <span className="text-xs md:text-sm font-mono font-semibold text-orange-700">{results.broadcast}</span>
                </div>

                <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded border-l-4 border-blue-500">
                  <span className="text-xs md:text-sm text-blue-700">Total Hosts:</span>
                  <span className="text-xs md:text-sm font-bold text-blue-700">{results.hostCount}</span>
                </div>

                <div className="flex justify-between items-center py-2 px-3 bg-purple-50 rounded border-l-4 border-purple-500">
                  <span className="text-xs md:text-sm text-purple-700">IP Class:</span>
                  <span className="text-xs md:text-sm font-bold text-purple-700">{results.ipClass}</span>
                </div>
              </div>
            </div>

            {/* Binary Breakdown */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h4 className="text-base md:text-lg font-bold text-gray-900 mb-3">🔢 Binary Breakdown</h4>
              <div className="space-y-2 text-xs">
                <div className="bg-gray-50 rounded p-2">
                  <div className="text-gray-600 mb-1">Network:</div>
                  <div className="font-mono text-gray-900 break-all">{results.networkBinary}</div>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <div className="text-gray-600 mb-1">Subnet Mask:</div>
                  <div className="font-mono text-gray-900 break-all">{results.maskBinary}</div>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <div className="text-gray-600 mb-1">Wildcard:</div>
                  <div className="font-mono text-gray-900 break-all">{results.wildcardBinary}</div>
                </div>
              </div>
            </div>
{/* Quick Info */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-4">
              <h4 className="text-sm font-bold text-indigo-900 mb-2">💡 Quick Tips</h4>
              <ul className="space-y-1 text-xs text-indigo-800">
                <li>• /24 = 254 usable hosts</li>
                <li>• /30 = 2 hosts (P2P links)</li>
                <li>• Smaller prefix = More hosts</li>
                <li>• Use VLSM to optimize</li>
              </ul>
            </div>
          </div>
        </div>

        {/* VLSM Results Table */}
        {activeTab === 'vlsm' && vlsmAllocations.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">📈 VLSM Allocation</h3>
              <button
                onClick={exportVLSM}
                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
              >
                📥 Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Subnet</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Network</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">First Host</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Last Host</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Broadcast</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Hosts</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Waste</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vlsmAllocations.map((alloc, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-xs md:text-sm font-medium text-gray-900">{alloc.name}</td>
                      <td className="px-3 py-2 text-xs font-mono text-gray-700">{alloc.network}</td>
                      <td className="px-3 py-2 text-xs font-mono text-gray-700">{alloc.firstHost}</td>
                      <td className="px-3 py-2 text-xs font-mono text-gray-700">{alloc.lastHost}</td>
                      <td className="px-3 py-2 text-xs font-mono text-gray-700">{alloc.broadcast}</td>
                      <td className="px-3 py-2 text-xs text-gray-700">{alloc.requestedHosts}/{alloc.actualHosts}</td>
                      <td className={`px-3 py-2 text-xs font-semibold ${alloc.waste > 10 ? 'text-red-600' : 'text-green-600'}`}>
                        {alloc.waste}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2">🌐 Common Masks</h3>
            <ul className="space-y-1 text-xs text-gray-700">
              <li><strong>/8:</strong> 16.7M hosts</li>
              <li><strong>/16:</strong> 65,534 hosts</li>
              <li><strong>/24:</strong> 254 hosts</li>
              <li><strong>/30:</strong> 2 hosts (P2P)</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2">🏠 Private Ranges</h3>
            <ul className="space-y-1 text-xs text-gray-700">
              <li><strong>10.0.0.0/8:</strong> Class A</li>
              <li><strong>172.16.0.0/12:</strong> Class B</li>
              <li><strong>192.168.0.0/16:</strong> Class C</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2">📚 Subnetting 101</h3>
            <ul className="space-y-1 text-xs text-gray-700">
              <li>• Network = First IP</li>
              <li>• Broadcast = Last IP</li>
              <li>• Hosts = IPs between</li>
              <li>• CIDR = /prefix notation</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2">⚡ VLSM Benefits</h3>
            <ul className="space-y-1 text-xs text-gray-700">
              <li>• Efficient IP usage</li>
              <li>• Scalable design</li>
              <li>• Route summarization</li>
              <li>• Flexible allocation</li>
            </ul>
          </div>
        </div>
      </div>
{/* Related Calculators */}
      <div className="max-w-[1180px] mx-auto px-2 md:px-6 py-6 md:py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="block">
              <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{calc.title}</h3>
                <p className="text-sm text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="subnet-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </>
  );
}

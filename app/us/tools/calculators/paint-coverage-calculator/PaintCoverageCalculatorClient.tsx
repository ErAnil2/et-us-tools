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

interface Room {
  id: number;
  roomType: string;
  projectType: string;
  surfaceType: string;
  length: number;
  width: number;
  height: number;
  doors: number;
  windows: number;
  coats: number;
  primer: boolean;
  wasteFactor: number;
}

// Coverage rates by surface type (sq ft per gallon)
const coverageRates: Record<string, number> = {
  'smooth': 400,
  'semi-rough': 350,
  'rough': 300,
  'very-rough': 250
};

// Door and window sizes (sq ft)
const doorSize = 21; // 7ft x 3ft
const windowSize = 15; // 5ft x 3ft average

// Room type presets
const roomPresets: Record<string, { length: number; width: number; height: number; doors: number; windows: number }> = {
  'master-bedroom': { length: 16, width: 14, height: 9, doors: 2, windows: 2 },
  'bedroom': { length: 12, width: 10, height: 8, doors: 1, windows: 2 },
  'kids-room': { length: 11, width: 10, height: 8, doors: 1, windows: 1 },
  'living-room': { length: 18, width: 14, height: 9, doors: 2, windows: 3 },
  'dining-room': { length: 14, width: 12, height: 9, doors: 1, windows: 2 },
  'kitchen': { length: 12, width: 10, height: 8, doors: 2, windows: 2 },
  'bathroom': { length: 8, width: 6, height: 8, doors: 1, windows: 1 },
  'study-room': { length: 10, width: 8, height: 8, doors: 1, windows: 1 },
  'garage': { length: 20, width: 20, height: 8, doors: 1, windows: 1 },
  'hallway': { length: 15, width: 4, height: 8, doors: 3, windows: 0 },
  'laundry-room': { length: 8, width: 6, height: 8, doors: 1, windows: 1 }
};

// Room type display names
const roomTypeNames: Record<string, string> = {
  'custom': 'Custom Room',
  'master-bedroom': 'Master Bedroom',
  'bedroom': 'Bedroom',
  'kids-room': 'Kids Room',
  'living-room': 'Living Room',
  'dining-room': 'Dining Room',
  'kitchen': 'Kitchen',
  'bathroom': 'Bathroom',
  'study-room': 'Study Room',
  'garage': 'Garage',
  'hallway': 'Hallway',
  'laundry-room': 'Laundry Room'
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Paint Coverage Calculator?",
    answer: "A Paint Coverage Calculator helps you calculate dates, times, or durations quickly. Whether you need to find the difference between dates or calculate future/past dates, this tool provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is the date calculation?",
    answer: "Our calculator accounts for leap years, varying month lengths, and other calendar complexities to provide accurate results. It uses the Gregorian calendar system.",
    order: 2
  },
  {
    id: '3',
    question: "What date formats are supported?",
    answer: "The calculator accepts common date formats and displays results in an easy-to-understand format. Simply enter dates in the format shown in the input fields.",
    order: 3
  },
  {
    id: '4',
    question: "Can I calculate dates far in the future or past?",
    answer: "Yes, the calculator can handle dates spanning many years. It's useful for planning, historical research, or any date-related calculations you need.",
    order: 4
  },
  {
    id: '5',
    question: "Is timezone considered in calculations?",
    answer: "Date calculations are based on calendar dates. For time-specific calculations, ensure you're considering your local timezone for the most accurate results.",
    order: 5
  }
];

export default function PaintCoverageCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('paint-coverage-calculator');

  const [calculationMode, setCalculationMode] = useState<'single' | 'multi'>('single');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomCounter, setRoomCounter] = useState(0);

  // Single room mode state
  const [roomType, setRoomType] = useState('custom');
  const [projectType, setProjectType] = useState('interior');
  const [surfaceType, setSurfaceType] = useState('smooth');
  const [length, setLength] = useState(12);
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(8);
  const [doors, setDoors] = useState(2);
  const [windows, setWindows] = useState(3);
  const [coats, setCoats] = useState(2);
  const [primer, setPrimer] = useState(false);
  const [wasteFactor, setWasteFactor] = useState(10);

  const calculateSurfaceArea = (pType: string, len: number, wid: number, hgt: number, drs: number, wins: number): number => {
    let surfaceArea = 0;

    if (pType === 'interior' || pType === 'exterior') {
      const perimeter = 2 * (len + wid);
      surfaceArea = (perimeter * hgt) - (drs * doorSize) - (wins * windowSize);
    } else if (pType === 'ceiling') {
      surfaceArea = len * wid;
    } else if (pType === 'trim') {
      const perimeter = 2 * (len + wid);
      surfaceArea = perimeter * 0.5;
    } else if (pType === 'fence') {
      surfaceArea = len * hgt;
    }

    return Math.max(surfaceArea, 1);
  };

  const calculatePaint = () => {
    const surfaceArea = calculateSurfaceArea(projectType, length, width, height, doors, windows);
    const coveragePerGallon = coverageRates[surfaceType];

    const paintNeeded = (surfaceArea * coats) / coveragePerGallon;
    const wasteAmount = paintNeeded * (wasteFactor / 100);
    const totalPaintNeeded = paintNeeded + wasteAmount;

    const gallonsNeeded = Math.ceil(totalPaintNeeded);
    const quartsNeeded = Math.ceil(totalPaintNeeded * 4);

    let primerNeeded = 0;
    if (primer) {
      primerNeeded = Math.ceil(surfaceArea / coveragePerGallon);
    }

    const budgetCost = gallonsNeeded * 25;
    const midCost = gallonsNeeded * 40;
    const premiumCost = gallonsNeeded * 60;

    return {
      surfaceArea,
      coveragePerGallon,
      coats,
      wasteFactor,
      totalPaintNeeded,
      gallonsNeeded,
      quartsNeeded,
      primerNeeded,
      budgetCost,
      midCost,
      premiumCost
    };
  };

  const calculateMultiRoom = () => {
    if (rooms.length === 0) {
      return null;
    }

    let totalSurfaceArea = 0;
    let totalPaintNeeded = 0;
    let totalPrimerNeeded = 0;

    const roomBreakdown = rooms.map(room => {
      const surfaceArea = calculateSurfaceArea(room.projectType, room.length, room.width, room.height, room.doors, room.windows);
      const coveragePerGallon = coverageRates[room.surfaceType];
      const paintNeeded = (surfaceArea * room.coats) / coveragePerGallon;
      const wasteAmount = paintNeeded * (room.wasteFactor / 100);
      const totalNeeded = paintNeeded + wasteAmount;

      totalSurfaceArea += surfaceArea;
      totalPaintNeeded += totalNeeded;

      if (room.primer) {
        totalPrimerNeeded += Math.ceil(surfaceArea / coveragePerGallon);
      }

      return {
        name: roomTypeNames[room.roomType],
        paint: totalNeeded.toFixed(1)
      };
    });

    const totalGallons = Math.ceil(totalPaintNeeded);
    const totalQuarts = Math.ceil(totalPaintNeeded * 4);
    const budgetCost = totalGallons * 25;
    const midCost = totalGallons * 40;
    const premiumCost = totalGallons * 60;

    return {
      totalSurfaceArea,
      totalPaintNeeded,
      totalPrimerNeeded,
      totalGallons,
      totalQuarts,
      budgetCost,
      midCost,
      premiumCost,
      roomBreakdown,
      roomCount: rooms.length
    };
  };

  const toggleCalculationMode = () => {
    setCalculationMode(calculationMode === 'single' ? 'multi' : 'single');
  };

  const addRoom = () => {
    const newRoomId = roomCounter + 1;
    setRoomCounter(newRoomId);

    const newRoom: Room = {
      id: newRoomId,
      roomType: 'bedroom',
      projectType: 'interior',
      surfaceType: 'smooth',
      length: 12,
      width: 10,
      height: 8,
      doors: 1,
      windows: 2,
      coats: 2,
      primer: false,
      wasteFactor: 10
    };

    setRooms([...rooms, newRoom]);
  };

  const removeRoom = (roomId: number) => {
    setRooms(rooms.filter(r => r.id !== roomId));
  };

  const updateRoom = (roomId: number, field: keyof Room, value: any) => {
    setRooms(rooms.map(room => {
      if (room.id === roomId) {
        const updatedRoom = { ...room, [field]: value };

        // Apply room preset if room type changed
        if (field === 'roomType' && roomPresets[value as string]) {
          const preset = roomPresets[value as string];
          updatedRoom.length = preset.length;
          updatedRoom.width = preset.width;
          updatedRoom.height = preset.height;
          updatedRoom.doors = preset.doors;
          updatedRoom.windows = preset.windows;
        }

        return updatedRoom;
      }
      return room;
    }));
  };

  const handleRoomTypeChange = (value: string) => {
    setRoomType(value);
    if (roomPresets[value]) {
      const preset = roomPresets[value];
      setLength(preset.length);
      setWidth(preset.width);
      setHeight(preset.height);
      setDoors(preset.doors);
      setWindows(preset.windows);
    }
  };

  const singleResults = calculationMode === 'single' ? calculatePaint() : null;
  const multiResults = calculationMode === 'multi' ? calculateMultiRoom() : null;

  return (
    <div className="max-w-[1180px] mx-auto p-4 md:p-6">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{getH1('Paint Coverage Calculator')}</h1>
        <p className="text-base md:text-lg text-gray-600">Calculate how much paint you need for your painting project</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Two Column Layout */}
      <div className="lg:grid lg:gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8" style={{ gridTemplateColumns: '1fr 350px' }}>

        {/* Left Column - Input Form */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">

      <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Project Details</h2>
            <div className="flex gap-2">
              <button
                onClick={toggleCalculationMode}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                {calculationMode === 'single' ? 'Switch to Full House' : 'Switch to Single Room'}
              </button>
            </div>
          </div>

          {/* Single Room Mode */}
          {calculationMode === 'single' && (
            <div className="space-y-4">
              {/* Room Type */}
              <div>
                <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    Room Type
                  </span>
                </label>
                <select
                  id="roomType"
                  value={roomType}
                  onChange={(e) => handleRoomTypeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="custom">Custom Room</option>
                  <option value="master-bedroom">Master Bedroom</option>
                  <option value="bedroom">Bedroom</option>
                  <option value="kids-room">Kids Room</option>
                  <option value="living-room">Living Room</option>
                  <option value="dining-room">Dining Room</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="bathroom">Bathroom</option>
                  <option value="study-room">Study Room</option>
                  <option value="garage">Garage</option>
                  <option value="hallway">Hallway</option>
                  <option value="laundry-room">Laundry Room</option>
                </select>
              </div>

              {/* Project Type */}
              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    Project Type
                  </span>
                </label>
                <select
                  id="projectType"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="interior">Interior Walls</option>
                  <option value="exterior">Exterior Walls</option>
                  <option value="ceiling">Ceiling</option>
                  <option value="trim">Trim/Doors</option>
                  <option value="fence">Fence</option>
                </select>
              </div>

              {/* Surface Type */}
              <div>
                <label htmlFor="surfaceType" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                    </svg>
                    Surface Type
                  </span>
                </label>
                <select
                  id="surfaceType"
                  value={surfaceType}
                  onChange={(e) => setSurfaceType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="smooth">Smooth (Drywall, Plaster)</option>
                  <option value="semi-rough">Semi-Rough (Textured Walls)</option>
                  <option value="rough">Rough (Stucco, Brick)</option>
                  <option value="very-rough">Very Rough (Block, Heavy Texture)</option>
                </select>
              </div>

              {/* Room Dimensions */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                      </svg>
                      Length (feet)
                    </span>
                  </label>
                  <input
                    type="number"
                    id="length"
                    min="1"
                    step="0.5"
                    value={length}
                    onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                      </svg>
                      Width (feet)
                    </span>
                  </label>
                  <input
                    type="number"
                    id="width"
                    min="1"
                    step="0.5"
                    value={width}
                    onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                      </svg>
                      Height (feet)
                    </span>
                  </label>
                  <input
                    type="number"
                    id="height"
                    min="1"
                    step="0.5"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Doors and Windows */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="doors" className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
                      </svg>
                      Doors
                    </span>
                  </label>
                  <input
                    type="number"
                    id="doors"
                    min="0"
                    value={doors}
                    onChange={(e) => setDoors(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="windows" className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path>
                      </svg>
                      Windows
                    </span>
                  </label>
                  <input
                    type="number"
                    id="windows"
                    min="0"
                    value={windows}
                    onChange={(e) => setWindows(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Paint Options */}
              <div>
                <label htmlFor="coats" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
                    </svg>
                    Number of Coats
                  </span>
                </label>
                <select
                  id="coats"
                  value={coats}
                  onChange={(e) => setCoats(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="1">1 Coat</option>
                  <option value="2">2 Coats (Recommended)</option>
                  <option value="3">3 Coats</option>
                </select>
              </div>

              {/* Primer */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="primer"
                  checked={primer}
                  onChange={(e) => setPrimer(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="primer" className="ml-2 block text-sm text-gray-700">Apply primer first</label>
              </div>

              {/* Waste Factor */}
              <div>
                <label htmlFor="wasteFactor" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    Waste Factor
                  </span>
                </label>
                <select
                  id="wasteFactor"
                  value={wasteFactor}
                  onChange={(e) => setWasteFactor(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="5">5% - Professional painter</option>
                  <option value="10">10% - Average DIY project</option>
                  <option value="15">15% - First-time painter</option>
                  <option value="20">20% - Complex room/texture</option>
                </select>
              </div>
            </div>
          )}

          {/* Multi-Room Mode */}
          {calculationMode === 'multi' && (
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">Add rooms to calculate paint for your entire house</p>
                <button
                  onClick={addRoom}
                  className="w-full px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <span className="inline-flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Add Room
                  </span>
                </button>
              </div>

              <div className="space-y-3">
                {rooms.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No rooms added yet. Click &quot;Add Room&quot; to start.</p>
                ) : (
                  rooms.map(room => (
                    <div key={room.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-gray-900">{roomTypeNames[room.roomType]}</h4>
                        <button
                          onClick={() => removeRoom(room.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <select
                          value={room.roomType}
                          onChange={(e) => updateRoom(room.id, 'roomType', e.target.value)}
                          className="col-span-2 px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          {Object.keys(roomTypeNames).map(type => (
                            <option key={type} value={type}>{roomTypeNames[type]}</option>
                          ))}
                        </select>

                        <input
                          type="number"
                          value={room.length}
                          onChange={(e) => updateRoom(room.id, 'length', parseFloat(e.target.value))}
                          placeholder="Length"
                          className="px-2 py-1 border border-gray-300 rounded"
                          step="0.5"
                          min="1"
                        />
                        <input
                          type="number"
                          value={room.width}
                          onChange={(e) => updateRoom(room.id, 'width', parseFloat(e.target.value))}
                          placeholder="Width"
                          className="px-2 py-1 border border-gray-300 rounded"
                          step="0.5"
                          min="1"
                        />
                        <input
                          type="number"
                          value={room.height}
                          onChange={(e) => updateRoom(room.id, 'height', parseFloat(e.target.value))}
                          placeholder="Height"
                          className="px-2 py-1 border border-gray-300 rounded"
                          step="0.5"
                          min="1"
                        />
                        <input
                          type="number"
                          value={room.doors}
                          onChange={(e) => updateRoom(room.id, 'doors', parseInt(e.target.value))}
                          placeholder="Doors"
                          className="px-2 py-1 border border-gray-300 rounded"
                          min="0"
                        />
                        <input
                          type="number"
                          value={room.windows}
                          onChange={(e) => updateRoom(room.id, 'windows', parseInt(e.target.value))}
                          placeholder="Windows"
                          className="px-2 py-1 border border-gray-300 rounded"
                          min="0"
                        />

                        <select
                          value={room.coats}
                          onChange={(e) => updateRoom(room.id, 'coats', parseInt(e.target.value))}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="1">1 Coat</option>
                          <option value="2">2 Coats</option>
                          <option value="3">3 Coats</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Mobile Results */}
          <div className="lg:hidden mt-6">
            {calculationMode === 'single' && singleResults && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-4 md:p-6 rounded-lg border border-blue-200">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">{singleResults.totalPaintNeeded.toFixed(1)} gallons</div>
                    <div className="text-sm text-gray-600 mt-1">Total Paint Needed</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-gray-800">{singleResults.gallonsNeeded}</div>
                    <div className="text-sm text-gray-600">Gallons</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-gray-800">{singleResults.quartsNeeded}</div>
                    <div className="text-sm text-gray-600">Quarts</div>
                  </div>
                </div>

                {singleResults.primerNeeded > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-700">{singleResults.primerNeeded} gallons</div>
                      <div className="text-sm text-gray-600">Primer Needed</div>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Surface Area:</span>
                    <span className="font-semibold">{singleResults.surfaceArea.toFixed(0)} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coverage per Gallon:</span>
                    <span className="font-semibold">{singleResults.coveragePerGallon} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Coats:</span>
                    <span className="font-semibold">{singleResults.coats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Waste Factor:</span>
                    <span className="font-semibold">{singleResults.wasteFactor}%</span>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="text-sm font-semibold text-green-800 mb-3">Cost Estimate</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget Paint ($25/gal):</span>
                      <span className="font-semibold">${singleResults.budgetCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mid-Grade Paint ($40/gal):</span>
                      <span className="font-semibold">${singleResults.midCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Premium Paint ($60/gal):</span>
                      <span className="font-semibold">${singleResults.premiumCost}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="text-sm font-semibold text-amber-800 mb-2">Pro Tips</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Always buy slightly more paint than calculated</li>
                    <li>• Keep leftover paint for touch-ups</li>
                    <li>• One gallon typically covers 350-400 sq ft</li>
                    <li>• Dark colors may need additional coats</li>
                    <li>• Use primer when changing colors dramatically</li>
                  </ul>
                </div>
              </div>
            )}

            {calculationMode === 'multi' && multiResults && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-4 md:p-6 rounded-lg border border-blue-200">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">{multiResults.totalPaintNeeded.toFixed(1)} gallons</div>
                    <div className="text-sm text-gray-600 mt-1">Total Paint for {multiResults.roomCount} Room{multiResults.roomCount > 1 ? 's' : ''}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-gray-800">{multiResults.totalGallons}</div>
                    <div className="text-sm text-gray-600">Gallons</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-gray-800">{multiResults.totalQuarts}</div>
                    <div className="text-sm text-gray-600">Quarts</div>
                  </div>
                </div>

                {multiResults.totalPrimerNeeded > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-700">{multiResults.totalPrimerNeeded} gallons</div>
                      <div className="text-sm text-gray-600">Primer Needed</div>
                    </div>
                  </div>
                )}

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="text-sm font-semibold text-purple-800 mb-2">Room Breakdown</h4>
                  <div className="space-y-1 text-sm">
                    {multiResults.roomBreakdown.map((r, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600">{r.name}:</span>
                        <span className="font-semibold">{r.paint} gal</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Surface Area:</span>
                    <span className="font-semibold">{multiResults.totalSurfaceArea.toFixed(0)} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Rooms:</span>
                    <span className="font-semibold">{multiResults.roomCount}</span>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="text-sm font-semibold text-green-800 mb-3">Cost Estimate</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget Paint ($25/gal):</span>
                      <span className="font-semibold">${multiResults.budgetCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mid-Grade Paint ($40/gal):</span>
                      <span className="font-semibold">${multiResults.midCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Premium Paint ($60/gal):</span>
                      <span className="font-semibold">${multiResults.premiumCost}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="text-sm font-semibold text-amber-800 mb-2">Pro Tips</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Buy all paint from same batch for color consistency</li>
                    <li>• Different rooms may need different paint finishes</li>
                    <li>• Consider buying 5-gallon buckets for savings</li>
                    <li>• Label leftover paint cans by room</li>
                  </ul>
                </div>
              </div>
            )}

            {calculationMode === 'multi' && !multiResults && (
              <p className="text-sm text-gray-500 text-center py-4">Add rooms to see paint estimates</p>
            )}
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Right Column - Results (Desktop Only) */}
        <div className="hidden lg:block" style={{ width: '350px' }}>
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 lg:sticky lg:top-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Paint Estimate</h3>

            {calculationMode === 'single' && singleResults && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-4 md:p-6 rounded-lg border border-blue-200">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">{singleResults.totalPaintNeeded.toFixed(1)} gallons</div>
                    <div className="text-sm text-gray-600 mt-1">Total Paint Needed</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-gray-800">{singleResults.gallonsNeeded}</div>
                    <div className="text-sm text-gray-600">Gallons</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-gray-800">{singleResults.quartsNeeded}</div>
                    <div className="text-sm text-gray-600">Quarts</div>
                  </div>
                </div>

                {singleResults.primerNeeded > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-700">{singleResults.primerNeeded} gallons</div>
                      <div className="text-sm text-gray-600">Primer Needed</div>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Surface Area:</span>
                    <span className="font-semibold">{singleResults.surfaceArea.toFixed(0)} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coverage per Gallon:</span>
                    <span className="font-semibold">{singleResults.coveragePerGallon} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Coats:</span>
                    <span className="font-semibold">{singleResults.coats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Waste Factor:</span>
                    <span className="font-semibold">{singleResults.wasteFactor}%</span>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="text-sm font-semibold text-green-800 mb-3">Cost Estimate</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget Paint ($25/gal):</span>
                      <span className="font-semibold">${singleResults.budgetCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mid-Grade Paint ($40/gal):</span>
                      <span className="font-semibold">${singleResults.midCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Premium Paint ($60/gal):</span>
                      <span className="font-semibold">${singleResults.premiumCost}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="text-sm font-semibold text-amber-800 mb-2">Pro Tips</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Always buy slightly more paint than calculated</li>
                    <li>• Keep leftover paint for touch-ups</li>
                    <li>• One gallon typically covers 350-400 sq ft</li>
                    <li>• Dark colors may need additional coats</li>
                    <li>• Use primer when changing colors dramatically</li>
                  </ul>
                </div>
              </div>
            )}

            {calculationMode === 'multi' && multiResults && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-4 md:p-6 rounded-lg border border-blue-200">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">{multiResults.totalPaintNeeded.toFixed(1)} gallons</div>
                    <div className="text-sm text-gray-600 mt-1">Total Paint for {multiResults.roomCount} Room{multiResults.roomCount > 1 ? 's' : ''}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-gray-800">{multiResults.totalGallons}</div>
                    <div className="text-sm text-gray-600">Gallons</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-gray-800">{multiResults.totalQuarts}</div>
                    <div className="text-sm text-gray-600">Quarts</div>
                  </div>
                </div>

                {multiResults.totalPrimerNeeded > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-700">{multiResults.totalPrimerNeeded} gallons</div>
                      <div className="text-sm text-gray-600">Primer Needed</div>
                    </div>
                  </div>
                )}

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="text-sm font-semibold text-purple-800 mb-2">Room Breakdown</h4>
                  <div className="space-y-1 text-sm">
                    {multiResults.roomBreakdown.map((r, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600">{r.name}:</span>
                        <span className="font-semibold">{r.paint} gal</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Surface Area:</span>
                    <span className="font-semibold">{multiResults.totalSurfaceArea.toFixed(0)} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Rooms:</span>
                    <span className="font-semibold">{multiResults.roomCount}</span>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="text-sm font-semibold text-green-800 mb-3">Cost Estimate</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget Paint ($25/gal):</span>
                      <span className="font-semibold">${multiResults.budgetCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mid-Grade Paint ($40/gal):</span>
                      <span className="font-semibold">${multiResults.midCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Premium Paint ($60/gal):</span>
                      <span className="font-semibold">${multiResults.premiumCost}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="text-sm font-semibold text-amber-800 mb-2">Pro Tips</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Buy all paint from same batch for color consistency</li>
                    <li>• Different rooms may need different paint finishes</li>
                    <li>• Consider buying 5-gallon buckets for savings</li>
                    <li>• Label leftover paint cans by room</li>
                  </ul>
                </div>
              </div>
            )}

            {calculationMode === 'multi' && !multiResults && (
              <p className="text-sm text-gray-500 text-center py-4">Add rooms to see paint estimates</p>
            )}
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        {/* Coverage Rates */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Coverage Rates</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Smooth walls: 350-400 sq ft/gallon
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Textured walls: 300-350 sq ft/gallon
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Rough surfaces: 250-300 sq ft/gallon
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Primer coverage: similar to paint
                </li>
              </ul>
            </div>
          </div>
        </div>
{/* Paint Types */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Paint Types</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Flat/Matte: Best for ceilings
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Eggshell: Low-sheen, easy to clean
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Satin: Kitchens and bathrooms
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Semi-gloss: Trim and high-traffic areas
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Money-Saving Tips */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Money-Saving Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Buy in bulk for larger projects
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Use primer to reduce coats needed
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Check for sales on premium brands
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Save leftover paint for touch-ups
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Preparation Tips */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Preparation Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Clean walls thoroughly before painting
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Fill holes and cracks first
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Use painter&apos;s tape for clean edges
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Remove furniture or cover with drop cloths
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Application Tips */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Start with edges and corners
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Use roller for large wall areas
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Allow proper drying time between coats
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Apply thin, even coats
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Common Mistakes</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Avoid painting in direct sunlight
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Don&apos;t skip surface preparation
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Avoid using old or dried-out paint
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Don&apos;t overload brush or roller
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="font-medium text-gray-900">How accurate is this paint calculator?</span>
              </div>
              <svg className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">This calculator provides accurate estimates based on industry-standard coverage rates. However, actual paint needed may vary based on application method, surface porosity, color changes, and painting technique. Always buy slightly more paint than calculated for touch-ups and waste.</p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="font-medium text-gray-900">Do I need primer for every paint job?</span>
              </div>
              <svg className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Primer is essential when painting new drywall, making dramatic color changes (dark to light), covering stains, or painting over glossy surfaces. It helps paint adhere better and can reduce the number of paint coats needed. For similar color repaints on good surfaces, you may skip primer.</p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="font-medium text-gray-900">What&apos;s the difference between paint finishes?</span>
              </div>
              <svg className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Paint finishes range from flat (no sheen) to high-gloss (very shiny). Flat/matte is best for ceilings and low-traffic areas. Eggshell and satin offer slight sheen and are easier to clean. Semi-gloss and gloss are durable and moisture-resistant, ideal for trim, kitchens, and bathrooms. Higher sheen shows imperfections more but is more washable.</p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="font-medium text-gray-900">How long should I wait between coats?</span>
              </div>
              <svg className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Latex paint typically dries to the touch in 1 hour and can be recoated in 2-4 hours. Oil-based paint takes 6-8 hours to dry and 24 hours between coats. Always check the paint can for specific drying times, as they vary by brand, humidity, temperature, and ventilation. Rushing between coats can cause peeling or poor adhesion.</p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="font-medium text-gray-900">Should I buy more paint than calculated?</span>
              </div>
              <svg className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Yes, it&apos;s recommended to buy 10-15% more paint than calculated. This accounts for waste, spills, variation in coverage rates, and provides leftover paint for future touch-ups. Matching paint color later can be difficult, so having extra from the same batch ensures perfect color matching for repairs.</p>
            </div>
          </details>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
      {/* Enhanced Related Calculators */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Home Improvement Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="block">
              <div className={`${calc.color || 'bg-gray-500'} text-white rounded-lg p-6 hover:opacity-90 transition-opacity`}>
                <h3 className="text-lg font-semibold mb-2">{calc.title}</h3>
                <p className="text-sm text-white opacity-90">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="paint-coverage-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { CalculatorMobileMrec2 } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface PlantInfo {
  plant: number;
  row: number;
  info: string;
}

interface PlantSpacingDB {
  [key: string]: PlantInfo;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Garden Spacing Calculator?",
    answer: "A Garden Spacing Calculator is a free online tool designed to help you quickly and accurately calculate garden spacing-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Garden Spacing Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Garden Spacing Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Garden Spacing Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function GardenSpacingCalculatorClient() {
  const [gardenLength, setGardenLength] = useState<number>(10);
  const [gardenWidth, setGardenWidth] = useState<number>(8);
  const [gardenShape, setGardenShape] = useState<string>('rectangular');
  const [plantType, setPlantType] = useState<string>('tomato');
  const [plantSpacing, setPlantSpacing] = useState<number>(18);
  const [rowSpacing, setRowSpacing] = useState<number>(36);
  const [plantingPattern, setPlantingPattern] = useState<string>('grid');
  const [borderSpace, setBorderSpace] = useState<number>(6);

  const [totalPlants, setTotalPlants] = useState<number>(40);
  const [gardenArea, setGardenArea] = useState<number>(80);
  const [usableArea, setUsableArea] = useState<number>(70.1);
  const [plantsPerSqFt, setPlantsPerSqFt] = useState<number>(0.5);
  const [efficiency, setEfficiency] = useState<number>(89.5);
  const [plantsPerRow, setPlantsPerRow] = useState<number>(5);
  const [numberOfRows, setNumberOfRows] = useState<number>(8);
  const [plantCareTip, setPlantCareTip] = useState<string>('Select a plant type to see specific care tips');
  const [visualizationHTML, setVisualizationHTML] = useState<string>('');

  const plantSpacingDB: PlantSpacingDB = {
    tomato: { plant: 18, row: 36, info: 'Need good air circulation. Support with stakes or cages. Space wider for indeterminate varieties.' },
    pepper: { plant: 12, row: 24, info: 'Compact plants work well in containers. Mulch to retain moisture and regulate soil temperature.' },
    lettuce: { plant: 6, row: 12, info: 'Quick growing, harvest in 45-60 days. Succession plant every 2 weeks for continuous harvest.' },
    spinach: { plant: 4, row: 12, info: 'Cool weather crop, bolts in heat. Harvest outer leaves first for extended production.' },
    carrot: { plant: 2, row: 12, info: 'Thin seedlings to prevent forked roots. Needs deep, loose soil. Takes 60-80 days to mature.' },
    onion: { plant: 4, row: 12, info: 'Excellent companion plant that deters pests. Can interplant with other crops for space efficiency.' },
    bean: { plant: 6, row: 18, info: 'Bush variety is compact. Plant after soil warms to 60°F. Nitrogen-fixing improves soil.' },
    pea: { plant: 2, row: 6, info: 'Cool weather crop, plant early spring or fall. Provide support for climbing. Fixes nitrogen.' },
    corn: { plant: 8, row: 30, info: 'Plant in blocks of at least 4 rows for better wind pollination. Needs full sun and rich soil.' },
    cucumber: { plant: 12, row: 36, info: 'Vining crop benefits from trellis support. Saves space and improves air circulation.' },
    zucchini: { plant: 36, row: 48, info: 'Large, sprawling plants need lots of room. Very productive - 2-3 plants feeds a family.' },
    broccoli: { plant: 12, row: 24, info: 'Cool weather crop. Harvest main head first, side shoots will continue producing.' },
    cabbage: { plant: 12, row: 24, info: 'Heavy feeder needs consistent moisture. Takes 70-100 days depending on variety.' },
    kale: { plant: 8, row: 18, info: 'Cold hardy, survives frost. Harvest outer leaves continuously. Flavor improves after frost.' },
    radish: { plant: 1, row: 6, info: 'Quick growing (25-30 days). Good companion for slow crops like carrots. Breaks up soil.' },
    basil: { plant: 8, row: 12, info: 'Pinch flower buds to keep leaves tender. Heat loving herb. Excellent tomato companion.' },
    parsley: { plant: 6, row: 12, info: 'Cut-and-come-again herb. Biennial, slow to bolt. Rich in vitamins A and C.' },
    cilantro: { plant: 4, row: 8, info: 'Cool weather herb, bolts quickly in heat. Succession plant every 2-3 weeks.' },
    oregano: { plant: 10, row: 12, info: 'Perennial herb spreads by runners. Drought tolerant once established. Harvest regularly.' },
    thyme: { plant: 8, row: 10, info: 'Perennial herb, drought tolerant. Low-growing, works as ground cover. Many varieties available.' },
    marigold: { plant: 6, row: 8, info: 'Pest deterrent for vegetables. Attracts pollinators. Blooms continuously until frost.' },
    petunia: { plant: 8, row: 10, info: 'Continuous bloomer with regular deadheading. Pinch back for bushier growth.' },
    impatiens: { plant: 8, row: 10, info: 'Shade tolerant annual. Needs consistent moisture. Excellent for shady spots.' },
    sunflower: { plant: 12, row: 24, info: 'Full sun required. Large varieties need 18-24" spacing. Attracts birds and pollinators.' }
  };

  const updatePlantSpacingValues = (type: string) => {
    if (type !== 'custom' && plantSpacingDB[type]) {
      const spacing = plantSpacingDB[type];
      setPlantSpacing(spacing.plant);
      setRowSpacing(spacing.row);
    }
  };

  const calculateSpacing = () => {
    if (gardenLength <= 0 || gardenWidth <= 0 || plantSpacing <= 0) {
      return;
    }

    // Calculate garden area based on shape
    let gardenAreaCalc: number;
    switch (gardenShape) {
      case 'rectangular':
        gardenAreaCalc = gardenLength * gardenWidth;
        break;
      case 'square':
        const side = Math.min(gardenLength, gardenWidth);
        gardenAreaCalc = side * side;
        break;
      case 'circular':
        const radius = Math.min(gardenLength, gardenWidth) / 2;
        gardenAreaCalc = Math.PI * radius * radius;
        break;
      case 'raised-bed':
        gardenAreaCalc = gardenLength * gardenWidth;
        break;
      default:
        gardenAreaCalc = gardenLength * gardenWidth;
    }

    // Calculate usable area (subtract borders)
    const borderReductionFt = (borderSpace * 2) / 12;
    const usableLength = Math.max(0, gardenLength - borderReductionFt);
    const usableWidth = Math.max(0, gardenWidth - borderReductionFt);
    const usableAreaCalc = usableLength * usableWidth;

    // Convert spacing to feet
    const plantSpacingFt = plantSpacing / 12;
    const rowSpacingFt = rowSpacing / 12;

    let totalPlantsCalc = 0;
    let plantsPerRowCalc = 0;
    let numberOfRowsCalc = 0;

    // Calculate based on planting pattern
    switch (plantingPattern) {
      case 'grid':
        plantsPerRowCalc = Math.floor(usableLength / plantSpacingFt);
        numberOfRowsCalc = Math.floor(usableWidth / plantSpacingFt);
        totalPlantsCalc = plantsPerRowCalc * numberOfRowsCalc;
        break;

      case 'offset':
        // Hexagonal/offset pattern
        plantsPerRowCalc = Math.floor(usableLength / plantSpacingFt);
        numberOfRowsCalc = Math.floor(usableWidth / (plantSpacingFt * 0.866));
        const evenRows = Math.ceil(numberOfRowsCalc / 2);
        const oddRows = Math.floor(numberOfRowsCalc / 2);
        totalPlantsCalc = (evenRows * plantsPerRowCalc) + (oddRows * Math.max(0, plantsPerRowCalc - 1));
        break;

      case 'rows':
        plantsPerRowCalc = Math.floor(usableLength / plantSpacingFt);
        numberOfRowsCalc = Math.floor(usableWidth / rowSpacingFt);
        totalPlantsCalc = plantsPerRowCalc * numberOfRowsCalc;
        break;
    }

    const plantsPerSqFtCalc = usableAreaCalc > 0 ? totalPlantsCalc / usableAreaCalc : 0;
    const efficiencyCalc = usableAreaCalc > 0 ? (totalPlantsCalc * (plantSpacingFt * plantSpacingFt)) / usableAreaCalc * 100 : 0;

    // Update state
    setTotalPlants(totalPlantsCalc);
    setGardenArea(gardenAreaCalc);
    setUsableArea(usableAreaCalc);
    setPlantsPerSqFt(plantsPerSqFtCalc);
    setEfficiency(efficiencyCalc);
    setPlantsPerRow(plantsPerRowCalc);
    setNumberOfRows(numberOfRowsCalc);

    // Update plant care tip
    if (plantType !== 'custom' && plantSpacingDB[plantType]) {
      const info = plantSpacingDB[plantType].info;
      setPlantCareTip(`${info} (${totalPlantsCalc} plants)`);
    } else {
      setPlantCareTip('Water consistently, mulch around plants, and monitor for pests regularly.');
    }

    // Generate visualization
    generateVisualization(usableLength, usableWidth, plantsPerRowCalc, numberOfRowsCalc);
  };

  const generateVisualization = (length: number, width: number, plantsPerRowVal: number, numberOfRowsVal: number) => {
    const maxWidth = 280;
    const maxHeight = 100;
    const scale = Math.min(maxWidth / length, maxHeight / width);
    const scaledLength = length * scale;
    const scaledWidth = width * scale;

    let visualHTML = `
      <div style="width: ${scaledLength}px; height: ${scaledWidth}px; border: 2px solid #374151; position: relative; margin: auto; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);">
        <div style="position: absolute; top: -18px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: 600; color: #4b5563;">
          ${length.toFixed(1)}' × ${width.toFixed(1)}'
        </div>`;

    // Add plant positions
    if (numberOfRowsVal > 0 && plantsPerRowVal > 0) {
      for (let row = 0; row < numberOfRowsVal; row++) {
        for (let col = 0; col < plantsPerRowVal; col++) {
          let x, y;

          if (plantingPattern === 'offset' && row % 2 === 1) {
            if (col >= plantsPerRowVal - 1) continue;
            x = (col + 0.5) * (scaledLength / plantsPerRowVal);
          } else {
            x = col * (scaledLength / Math.max(1, plantsPerRowVal - 1));
          }

          y = row * (scaledWidth / Math.max(1, numberOfRowsVal - 1));

          visualHTML += `<div style="position: absolute; left: ${x}px; top: ${y}px; width: 5px; height: 5px; background: #10b981; border-radius: 50%; transform: translate(-50%, -50%); box-shadow: 0 0 3px rgba(16, 185, 129, 0.6);"></div>`;
        }
      }
    }

    visualHTML += '</div>';
    setVisualizationHTML(visualHTML);
  };

  useEffect(() => {
    calculateSpacing();
  }, [gardenLength, gardenWidth, gardenShape, plantSpacing, rowSpacing, plantingPattern, borderSpace, plantType]);

  const handlePlantTypeChange = (type: string) => {
    setPlantType(type);
    updatePlantSpacingValues(type);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <div className="inline-block mb-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-2 rounded-full text-sm font-semibold shadow-md">
            🌱 Garden Planning Tool
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Garden Spacing Calculator
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Plan your garden layout with optimal plant spacing and maximize your growing area</p>
      </div>

      {/* Calculator */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-4 sm:mb-6 md:mb-8 border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px]">

          {/* Left Column - Inputs */}
          <div className="p-3 sm:p-5 md:p-8 space-y-3 sm:space-y-4 md:space-y-6 lg:border-r border-gray-200 bg-gradient-to-br from-white to-gray-50">

            {/* Section: Garden Dimensions */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-green-200">
                <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide">Garden Dimensions</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gardenLength" className="block text-sm font-medium text-gray-700 mb-1">
                    <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                    Garden Length (ft)
                  </label>
                  <input
                    type="number"
                    id="gardenLength"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm hover:border-green-400 transition-colors"
                    placeholder="10"
                    value={gardenLength}
                    onChange={(e) => setGardenLength(parseFloat(e.target.value) || 0)}
                    min="1"
                    step="0.5"
                  />
                </div>
                <div>
                  <label htmlFor="gardenWidth" className="block text-sm font-medium text-gray-700 mb-1">
                    <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                    Garden Width (ft)
                  </label>
                  <input
                    type="number"
                    id="gardenWidth"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm hover:border-green-400 transition-colors"
                    placeholder="8"
                    value={gardenWidth}
                    onChange={(e) => setGardenWidth(parseFloat(e.target.value) || 0)}
                    min="1"
                    step="0.5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="gardenShape" className="block text-sm font-medium text-gray-700 mb-1">
                  <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
                  </svg>
                  Garden Shape
                </label>
                <select
                  id="gardenShape"
                  value={gardenShape}
                  onChange={(e) => setGardenShape(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm hover:border-green-400 transition-colors"
                >
                  <option value="rectangular">Rectangular</option>
                  <option value="square">Square</option>
                  <option value="circular">Circular</option>
                  <option value="raised-bed">Raised Bed</option>
                </select>
              </div>
            </div>

            {/* Section: Plant Configuration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-green-200">
                <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide">Plant Configuration</h3>
              </div>

              <div>
                <label htmlFor="plantType" className="block text-sm font-medium text-gray-700 mb-1">
                  <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  </svg>
                  Plant Type
                </label>
                <select
                  id="plantType"
                  value={plantType}
                  onChange={(e) => handlePlantTypeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm hover:border-green-400 transition-colors"
                >
                  <optgroup label="Vegetables">
                    <option value="tomato">Tomatoes (18&quot; spacing)</option>
                    <option value="pepper">Peppers (12&quot; spacing)</option>
                    <option value="lettuce">Lettuce (6&quot; spacing)</option>
                    <option value="spinach">Spinach (4&quot; spacing)</option>
                    <option value="carrot">Carrots (2&quot; spacing)</option>
                    <option value="onion">Onions (4&quot; spacing)</option>
                    <option value="bean">Bush Beans (6&quot; spacing)</option>
                    <option value="pea">Peas (2&quot; spacing)</option>
                    <option value="corn">Corn (8&quot; spacing)</option>
                    <option value="cucumber">Cucumbers (12&quot; spacing)</option>
                    <option value="zucchini">Zucchini (36&quot; spacing)</option>
                    <option value="broccoli">Broccoli (12&quot; spacing)</option>
                    <option value="cabbage">Cabbage (12&quot; spacing)</option>
                    <option value="kale">Kale (8&quot; spacing)</option>
                    <option value="radish">Radishes (1&quot; spacing)</option>
                  </optgroup>
                  <optgroup label="Herbs">
                    <option value="basil">Basil (8&quot; spacing)</option>
                    <option value="parsley">Parsley (6&quot; spacing)</option>
                    <option value="cilantro">Cilantro (4&quot; spacing)</option>
                    <option value="oregano">Oregano (10&quot; spacing)</option>
                    <option value="thyme">Thyme (8&quot; spacing)</option>
                  </optgroup>
                  <optgroup label="Flowers">
                    <option value="marigold">Marigolds (6&quot; spacing)</option>
                    <option value="petunia">Petunias (8&quot; spacing)</option>
                    <option value="impatiens">Impatiens (8&quot; spacing)</option>
                    <option value="sunflower">Sunflowers (12&quot; spacing)</option>
                  </optgroup>
                  <option value="custom">Custom Spacing</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="plantSpacing" className="block text-sm font-medium text-gray-700 mb-1">
                    <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                    </svg>
                    Plant Spacing (in)
                  </label>
                  <input
                    type="number"
                    id="plantSpacing"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm hover:border-green-400 transition-colors"
                    placeholder="18"
                    value={plantSpacing}
                    onChange={(e) => setPlantSpacing(parseFloat(e.target.value) || 0)}
                    min="1"
                    step="0.5"
                  />
                </div>
                <div>
                  <label htmlFor="rowSpacing" className="block text-sm font-medium text-gray-700 mb-1">
                    <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                    Row Spacing (in)
                  </label>
                  <input
                    type="number"
                    id="rowSpacing"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm hover:border-green-400 transition-colors"
                    placeholder="24"
                    value={rowSpacing}
                    onChange={(e) => setRowSpacing(parseFloat(e.target.value) || 0)}
                    min="1"
                    step="0.5"
                  />
                </div>
              </div>
            </div>

            {/* Section: Layout Options */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-green-200">
                <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide">Layout Options</h3>
              </div>

              <div>
                <label htmlFor="plantingPattern" className="block text-sm font-medium text-gray-700 mb-1">
                  <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
                  </svg>
                  Planting Pattern
                </label>
                <select
                  id="plantingPattern"
                  value={plantingPattern}
                  onChange={(e) => setPlantingPattern(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm hover:border-green-400 transition-colors"
                >
                  <option value="grid">Grid Pattern (Square spacing)</option>
                  <option value="offset">Offset/Staggered (15% more efficient)</option>
                  <option value="rows">Traditional Rows</option>
                </select>
              </div>

              <div>
                <label htmlFor="borderSpace" className="block text-sm font-medium text-gray-700 mb-1">
                  <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Border Space (in)
                </label>
                <input
                  type="number"
                  id="borderSpace"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm hover:border-green-400 transition-colors"
                  placeholder="6"
                  value={borderSpace}
                  onChange={(e) => setBorderSpace(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="1"
                />
                <p className="text-xs text-gray-500 mt-1">Space left around garden perimeter for access</p>
              </div>
            </div>

          </div>

          {/* Right Column - Results (350px sticky sidebar) */}
          <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-green-50 lg:sticky lg:top-6 lg:self-start">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Garden Layout Results</h3>

            {/* Total Plants */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-center mb-4 text-white shadow-md">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold">{totalPlants.toLocaleString()}</div>
              <div className="text-green-100 text-sm">Total Plants Needed</div>
            </div>

            {/* Key Metrics */}
            <div className="space-y-3 mb-4">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Garden Area</div>
                <div className="text-lg font-semibold text-gray-800">{gardenArea.toFixed(1)} sq ft</div>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Usable Planting Area</div>
                <div className="text-lg font-semibold text-gray-800">{usableArea.toFixed(1)} sq ft</div>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Plants per Square Foot</div>
                <div className="text-lg font-semibold text-blue-600">{plantsPerSqFt.toFixed(2)}</div>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Planting Efficiency</div>
                <div className="text-lg font-semibold text-purple-600">{efficiency.toFixed(1)}%</div>
              </div>
            </div>

            {/* Layout Configuration */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 shadow-md text-white mb-4">
              <div className="font-semibold mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
                </svg>
                Layout Configuration
              </div>
              <div className="text-blue-50 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span>Plants per row:</span>
                  <span className="font-semibold">{plantsPerRow}</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of rows:</span>
                  <span className="font-semibold">{numberOfRows}</span>
                </div>
                <div className="flex justify-between">
                  <span>Row spacing:</span>
                  <span className="font-semibold">{rowSpacing}&quot;</span>
                </div>
                <div className="flex justify-between">
                  <span>Plant spacing:</span>
                  <span className="font-semibold">{plantSpacing}&quot;</span>
                </div>
              </div>
            </div>

            {/* Visual Layout Preview */}
            <div className="bg-white rounded-lg p-3 shadow-sm mb-4">
              <div className="text-xs font-semibold text-gray-700 mb-2">Layout Preview</div>
              <div
                className="bg-gray-100 border border-gray-300 rounded min-h-[120px] flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: visualizationHTML }}
              />
            </div>

            {/* Plant Care Tip */}
            <div className="bg-amber-100 rounded-lg p-3 text-amber-800 text-xs">
              <div className="font-semibold mb-1">💡 Care Tip</div>
              <div>{plantCareTip}</div>
            </div>

          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">

        {/* Spacing Guidelines */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4 md:p-6 border border-green-200">
          <div className="flex items-center mb-3">
            <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
            </svg>
            <h3 className="text-lg font-semibold text-green-800">Spacing Guidelines</h3>
          </div>
          <ul className="space-y-2 text-sm text-green-700">
            <li><strong>Small plants (herbs, lettuce):</strong> 4-6&quot;</li>
            <li><strong>Medium plants (peppers, broccoli):</strong> 12-18&quot;</li>
            <li><strong>Large plants (tomatoes, cabbage):</strong> 18-24&quot;</li>
            <li><strong>Vining plants (squash, melons):</strong> 36-48&quot;</li>
            <li><strong>Root crops (carrots, radishes):</strong> 2-4&quot;</li>
          </ul>
        </div>

        {/* Layout Patterns */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 md:p-6 border border-blue-200">
          <div className="flex items-center mb-3">
            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
            </svg>
            <h3 className="text-lg font-semibold text-blue-800">Layout Patterns</h3>
          </div>
          <ul className="space-y-2 text-sm text-blue-700">
            <li><strong>Grid Pattern:</strong> Simple square spacing, easy to maintain and plant</li>
            <li><strong>Offset Pattern:</strong> Staggered hexagonal arrangement, fits 15% more plants</li>
            <li><strong>Traditional Rows:</strong> Classic method, easier access with garden tools</li>
            <li><strong>Raised Beds:</strong> Intensive planting with better drainage</li>
          </ul>
        </div>

        {/* Planning Tips */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3 sm:p-4 md:p-6 border border-amber-200">
          <div className="flex items-center mb-3">
            <svg className="w-6 h-6 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <h3 className="text-lg font-semibold text-amber-800">Planning Tips</h3>
          </div>
          <ul className="space-y-2 text-sm text-amber-700">
            <li>• Consider mature plant size when spacing</li>
            <li>• Leave space for walking paths and maintenance</li>
            <li>• Group plants by water and sun requirements</li>
            <li>• Plan for succession planting throughout season</li>
            <li>• Use vertical space with trellises and cages</li>
            <li>• Consider companion planting benefits</li>
          </ul>
        </div>

        {/* Companion Planting */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 sm:p-4 md:p-6 border border-purple-200">
          <div className="flex items-center mb-3">
            <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <h3 className="text-lg font-semibold text-purple-800">Companion Planting</h3>
          </div>
          <div className="space-y-2 text-sm text-purple-700">
            <div><strong>Tomatoes:</strong> Basil, marigolds, carrots</div>
            <div><strong>Lettuce:</strong> Radishes, carrots, strawberries</div>
            <div><strong>Beans:</strong> Corn, squash (Three Sisters)</div>
            <div><strong>Carrots:</strong> Onions, leeks, chives</div>
            <div><strong>Cucumbers:</strong> Radishes, peas, beans</div>
            <div><strong>Peppers:</strong> Basil, onions, spinach</div>
          </div>
        </div>

        {/* Garden Efficiency */}
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-3 sm:p-4 md:p-6 border border-teal-200">
          <div className="flex items-center mb-3">
            <svg className="w-6 h-6 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <h3 className="text-lg font-semibold text-teal-800">Maximize Garden Efficiency</h3>
          </div>
          <ul className="space-y-2 text-sm text-teal-700">
            <li>• Use intensive planting in raised beds</li>
            <li>• Succession plant every 2-3 weeks</li>
            <li>• Interplant fast and slow-growing crops</li>
            <li>• Use vertical growing for vining plants</li>
            <li>• Fill gaps with quick crops like radishes</li>
            <li>• Plant fall crops as summer ones finish</li>
          </ul>
        </div>

        {/* Shopping List */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 sm:p-4 md:p-6 border border-orange-200">
          <div className="flex items-center mb-3">
            <svg className="w-6 h-6 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            <h3 className="text-lg font-semibold text-orange-800">Essential Supplies</h3>
          </div>
          <ul className="space-y-2 text-sm text-orange-700">
            <li>• {totalPlants} plants or seed packets</li>
            <li>• {Math.ceil(gardenArea * 2)} cu ft compost/soil amendment</li>
            <li>• {Math.ceil(gardenArea * 3)} cu ft mulch for weed control</li>
            <li>• Garden rake and hoe for bed prep</li>
            <li>• Measuring tape for accurate spacing</li>
            <li>• Plant markers and stakes</li>
          </ul>
        </div>

      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What happens if I space plants too close together?</h3>
            <p className="text-gray-600">Overcrowding leads to competition for light, water, and nutrients. Plants become weak, produce less fruit, and are more susceptible to diseases due to poor air circulation. Fungal diseases thrive in crowded, humid conditions. Proper spacing ensures healthy, productive plants.</p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Which planting pattern is best for my garden?</h3>
            <p className="text-gray-600">Grid pattern is simplest and works well for beginners. Offset/staggered (hexagonal) pattern fits 10-15% more plants and improves spacing efficiency - ideal for intensive beds. Traditional rows are best if you need walking paths between rows or use garden equipment. Choose based on your garden size and maintenance style.</p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Should I use the minimum or maximum recommended spacing?</h3>
            <p className="text-gray-600">Use closer spacing (minimum) in rich, well-amended soil with intensive care, raised beds, and cooler climates. Use wider spacing (maximum) in poor soil, hot climates, or if you prefer less maintenance. Consider mature plant size - tomatoes and peppers benefit from wider spacing for better air circulation and easier harvesting.</p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I change spacing recommendations based on my climate?</h3>
            <p className="text-gray-600">Yes! In hot, humid climates, increase spacing by 20-30% for better air flow and disease prevention. In cool climates or short growing seasons, you can space slightly closer. Shaded gardens allow closer spacing. Windy areas benefit from closer spacing for mutual wind protection. Adjust based on local conditions and plant performance.</p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I plan for succession planting?</h3>
            <p className="text-gray-600">Divide your garden into sections. Plant quick-maturing crops (lettuce, radishes, spinach) every 2-3 weeks for continuous harvest. As early crops finish, replant with mid or late-season varieties. In a 10×8 ft garden, you could have 3-4 succession plantings per season. Use the calculator to plan each planting wave separately.</p>
          </div>

        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="garden-spacing-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}

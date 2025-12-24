'use client';

import { useState, useEffect, useRef } from 'react';
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
}

interface QuadraticEquationSolverClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface HistoryItem {
  equation: string;
  root1: string;
  root2: string;
  timestamp: Date;
}

type SolutionMethod = 'formula' | 'factoring' | 'completing';

export default function QuadraticEquationSolverClient({ relatedCalculators = defaultRelatedCalculators }: QuadraticEquationSolverClientProps) {
  const { getH1, getSubHeading } = usePageSEO('quadratic-equation-solver');

  const [coefficientA, setCoefficientA] = useState<number>(1);
  const [coefficientB, setCoefficientB] = useState<number>(-5);
  const [coefficientC, setCoefficientC] = useState<number>(6);
  const [solutionMethod, setSolutionMethod] = useState<SolutionMethod>('formula');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [result, setResult] = useState<{
    equation: string;
    root1: string;
    root2: string;
    discriminant: number;
    rootNature: string;
    vertex: string;
    axisOfSymmetry: number;
    yIntercept: number;
    steps: string[];
  } | null>(null);

  const methods = [
    { value: 'formula' as SolutionMethod, label: 'Quadratic Formula', emoji: '📐', description: 'Standard method' },
    { value: 'factoring' as SolutionMethod, label: 'Factoring', emoji: '🔢', description: 'When factorable' },
    { value: 'completing' as SolutionMethod, label: 'Completing Square', emoji: '⬜', description: 'Alternative method' },
  ];

  const formatEquation = (a: number, b: number, c: number): string => {
    let eq = '';

    if (a !== 0) {
      if (a === 1) eq += 'x²';
      else if (a === -1) eq += '-x²';
      else eq += `${a}x²`;
    }

    if (b !== 0) {
      if (eq && b > 0) eq += ' + ';
      else if (eq && b < 0) eq += ' - ';
      else if (b < 0) eq += '-';

      const absB = Math.abs(b);
      if (absB === 1) eq += 'x';
      else eq += `${absB}x`;
    }

    if (c !== 0) {
      if (eq && c > 0) eq += ` + ${c}`;
      else if (eq && c < 0) eq += ` - ${Math.abs(c)}`;
      else eq += `${c}`;
    }

    if (!eq) eq = '0';
    return eq + ' = 0';
  };

  const solveQuadratic = () => {
    const a = coefficientA;
    const b = coefficientB;
    const c = coefficientC;

    if (a === 0) {
      // Linear equation
      if (b === 0) {
        setResult({
          equation: formatEquation(a, b, c),
          root1: c === 0 ? 'All real numbers' : 'No solution',
          root2: c === 0 ? 'All real numbers' : 'No solution',
          discriminant: NaN,
          rootNature: c === 0 ? 'Identity (0 = 0)' : 'No Solution',
          vertex: 'N/A (Linear)',
          axisOfSymmetry: NaN,
          yIntercept: c,
          steps: c === 0
            ? ['The equation 0 = 0 is always true', 'Any real number is a solution']
            : ['The equation has no variable terms', `${c} = 0 is never true`, 'No solution exists']
        });
        return;
      }

      const root = -c / b;
      setResult({
        equation: formatEquation(a, b, c),
        root1: root.toFixed(4),
        root2: 'N/A (Linear)',
        discriminant: NaN,
        rootNature: 'Linear Equation (One Root)',
        vertex: 'N/A (Linear)',
        axisOfSymmetry: NaN,
        yIntercept: c,
        steps: [
          `Linear equation: ${b}x + ${c} = 0`,
          `${b}x = ${-c}`,
          `x = ${-c} / ${b}`,
          `x = ${root.toFixed(4)}`
        ]
      });
      return;
    }

    const discriminant = b * b - 4 * a * c;
    const vertexX = -b / (2 * a);
    const vertexY = a * vertexX * vertexX + b * vertexX + c;

    let root1: string, root2: string, rootNature: string;
    const steps: string[] = [];

    steps.push(`Equation: ${formatEquation(a, b, c)}`);
    steps.push(`Coefficients: a = ${a}, b = ${b}, c = ${c}`);
    steps.push(`Discriminant: Δ = b² - 4ac = (${b})² - 4(${a})(${c}) = ${discriminant.toFixed(4)}`);

    if (discriminant > 0) {
      const r1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const r2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      root1 = r1.toFixed(4);
      root2 = r2.toFixed(4);
      rootNature = 'Two Real Distinct Roots';

      steps.push(`Since Δ > 0, there are two real distinct roots`);
      steps.push(`x = (-b ± √Δ) / (2a)`);
      steps.push(`x₁ = (${-b} + √${discriminant.toFixed(4)}) / ${2 * a} = ${root1}`);
      steps.push(`x₂ = (${-b} - √${discriminant.toFixed(4)}) / ${2 * a} = ${root2}`);
    } else if (discriminant === 0) {
      const r = -b / (2 * a);
      root1 = root2 = r.toFixed(4);
      rootNature = 'One Real Root (Repeated)';

      steps.push(`Since Δ = 0, there is one repeated real root`);
      steps.push(`x = -b / (2a) = ${-b} / ${2 * a} = ${root1}`);
    } else {
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-discriminant) / (2 * a);
      root1 = `${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i`;
      root2 = `${realPart.toFixed(4)} - ${imagPart.toFixed(4)}i`;
      rootNature = 'Two Complex Conjugate Roots';

      steps.push(`Since Δ < 0, there are two complex conjugate roots`);
      steps.push(`Real part: -b/(2a) = ${realPart.toFixed(4)}`);
      steps.push(`Imaginary part: √|Δ|/(2a) = ${imagPart.toFixed(4)}`);
      steps.push(`x₁ = ${root1}`);
      steps.push(`x₂ = ${root2}`);
    }

    steps.push(`Vertex: (${vertexX.toFixed(4)}, ${vertexY.toFixed(4)})`);
    steps.push(`Axis of Symmetry: x = ${vertexX.toFixed(4)}`);
    steps.push(`Y-Intercept: (0, ${c})`);
    steps.push(`Parabola opens ${a > 0 ? 'upward (minimum at vertex)' : 'downward (maximum at vertex)'}`);

    setResult({
      equation: formatEquation(a, b, c),
      root1,
      root2,
      discriminant,
      rootNature,
      vertex: `(${vertexX.toFixed(4)}, ${vertexY.toFixed(4)})`,
      axisOfSymmetry: vertexX,
      yIntercept: c,
      steps
    });

    // Add to history
    const historyItem: HistoryItem = {
      equation: formatEquation(a, b, c),
      root1,
      root2,
      timestamp: new Date()
    };
    setHistory(prev => [historyItem, ...prev].slice(0, 10));

    // Draw parabola
    drawParabola(a, b, c, discriminant);
  };

  const drawParabola = (a: number, b: number, c: number, discriminant: number) => {
    const canvas = canvasRef.current;
    if (!canvas || a === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 25;

    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX + i * scale, 0);
      ctx.lineTo(centerX + i * scale, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, centerY - i * scale);
      ctx.lineTo(width, centerY - i * scale);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Draw parabola
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    let firstPoint = true;

    for (let px = 0; px <= width; px++) {
      const x = (px - centerX) / scale;
      const y = a * x * x + b * x + c;
      const py = centerY - y * scale;

      if (py >= -100 && py <= height + 100) {
        if (firstPoint) {
          ctx.moveTo(px, py);
          firstPoint = false;
        } else {
          ctx.lineTo(px, py);
        }
      }
    }
    ctx.stroke();

    // Mark vertex
    const vertexX = -b / (2 * a);
    const vertexY = a * vertexX * vertexX + b * vertexX + c;
    const vx = centerX + vertexX * scale;
    const vy = centerY - vertexY * scale;

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(vx, vy, 6, 0, 2 * Math.PI);
    ctx.fill();

    // Mark roots
    if (discriminant >= 0) {
      ctx.fillStyle = '#22c55e';
      const r1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const r2 = (-b - Math.sqrt(discriminant)) / (2 * a);

      ctx.beginPath();
      ctx.arc(centerX + r1 * scale, centerY, 6, 0, 2 * Math.PI);
      ctx.fill();

      if (discriminant > 0) {
        ctx.beginPath();
        ctx.arc(centerX + r2 * scale, centerY, 6, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Draw y-intercept
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(centerX, centerY - c * scale, 6, 0, 2 * Math.PI);
    ctx.fill();
  };

  const loadExample = (a: number, b: number, c: number) => {
    setCoefficientA(a);
    setCoefficientB(b);
    setCoefficientC(c);
  };

  const clearHistory = () => setHistory([]);

  useEffect(() => {
    solveQuadratic();
  }, [coefficientA, coefficientB, coefficientC]);

  const examples = [
    { a: 1, b: -5, c: 6, desc: 'Two real roots: 3, 2' },
    { a: 1, b: -4, c: 4, desc: 'One repeated root: 2' },
    { a: 1, b: 0, c: 1, desc: 'Complex roots: ±i' },
    { a: 1, b: -7, c: 12, desc: 'Two real roots: 4, 3' },
    { a: 2, b: -8, c: 6, desc: 'Two real roots' },
    { a: -1, b: 2, c: 3, desc: 'Opens downward' },
  ];

  const fallbackFaqs = [
    {
    id: '1',
    question: "What is the quadratic formula?",
      answer: "The quadratic formula is x = (-b ± √(b²-4ac)) / (2a). It solves any quadratic equation ax² + bx + c = 0 by finding the values of x that make the equation true.",
    order: 1
  },
    {
    id: '2',
    question: "What is the discriminant?",
      answer: "The discriminant is Δ = b² - 4ac. It determines the nature of roots: If Δ > 0, there are two distinct real roots. If Δ = 0, there's one repeated real root. If Δ < 0, there are two complex conjugate roots.",
    order: 2
  },
    {
    id: '3',
    question: "What is the vertex of a parabola?",
      answer: "The vertex is the highest or lowest point of the parabola. It's located at x = -b/(2a) and represents either the minimum (if a > 0) or maximum (if a < 0) value of the quadratic function.",
    order: 3
  },
    {
    id: '4',
    question: "How do I know if a quadratic can be factored?",
      answer: "A quadratic ax² + bx + c can be easily factored when the discriminant is a perfect square. This means the roots are rational numbers, and you can write the equation as a(x - r₁)(x - r₂).",
    order: 4
  },
    {
    id: '5',
    question: "What does the 'a' coefficient tell us?",
      answer: "The coefficient 'a' determines the parabola's direction and width. If a > 0, it opens upward (U-shape). If a < 0, it opens downward (∩-shape). Larger |a| makes it narrower; smaller |a| makes it wider.",
    order: 5
  }
  ];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">{getH1('Quadratic Equation Solver')}</h1>
        <p className="text-gray-600">Solve ax² + bx + c = 0 with step-by-step solutions and parabola graph</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Solution Method Selection */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Solution Method</h2>
        <div className="grid grid-cols-3 gap-2">
          {methods.map((method) => (
            <button
              key={method.value}
              onClick={() => setSolutionMethod(method.value)}
              className={`p-3 rounded-lg border-2 transition-all ${
                solutionMethod === method.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-2xl mb-1">{method.emoji}</div>
              <div className="text-sm font-medium">{method.label}</div>
              <div className="text-xs opacity-70">{method.description}</div>
            </button>
          ))}
        </div>
      </div>
{/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {/* Calculator Section */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📐 Enter Coefficients</h3>

            <div className="bg-blue-50 p-4 rounded-lg mb-4 text-center">
              <div className="text-lg font-mono font-bold text-blue-800">
                ax² + bx + c = 0
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coefficient a
                </label>
                <input
                  type="number"
                  value={coefficientA}
                  onChange={(e) => setCoefficientA(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-lg font-mono focus:border-blue-500 focus:outline-none"
                  step="any"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coefficient b
                </label>
                <input
                  type="number"
                  value={coefficientB}
                  onChange={(e) => setCoefficientB(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-lg font-mono focus:border-blue-500 focus:outline-none"
                  step="any"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coefficient c
                </label>
                <input
                  type="number"
                  value={coefficientC}
                  onChange={(e) => setCoefficientC(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-lg font-mono focus:border-blue-500 focus:outline-none"
                  step="any"
                />
              </div>
            </div>

            {result && (
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <span className="text-gray-600">Equation: </span>
                <span className="font-mono font-bold text-gray-900 text-lg">{result.equation}</span>
              </div>
            )}

            {/* Example Equations */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Examples</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {examples.map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadExample(ex.a, ex.b, ex.c)}
                    className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  >
                    <div className="font-mono text-sm font-medium">
                      {ex.a === 1 ? '' : ex.a === -1 ? '-' : ex.a}x² {ex.b >= 0 ? '+' : ''} {ex.b}x {ex.c >= 0 ? '+' : ''} {ex.c} = 0
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{ex.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step-by-Step Solution */}
          {result && (
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📝 Step-by-Step Solution</h3>
              <div className="space-y-2">
                {result.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700 font-mono text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>
)}

          {/* Parabola Graph */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Parabola Graph</h3>
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={500}
                height={400}
                className="border rounded-lg bg-white"
              />
            </div>
            <div className="mt-4 flex justify-center gap-3 sm:gap-4 md:gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span>Parabola</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span>Vertex</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Roots</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                <span>Y-Intercept</span>
              </div>
            </div>
          </div>

          {/* Mobile MREC2 - Before FAQs */}


          <CalculatorMobileMrec2 />



          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">❓ Frequently Asked Questions</h3>
            <div className="space-y-3">
              {fallbackFaqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition-colors"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    <span className="text-gray-500 text-xl">
                      {openFaqIndex === index ? '−' : '+'}
                    </span>
                  </button>
                  {openFaqIndex === index && (
                    <div className="px-4 py-3 bg-white text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Results Card */}
          {result && (
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-3 sm:p-4 md:p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Solutions</h3>

              <div className="space-y-3">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                  <div className="text-sm opacity-80">Root 1 (x₁)</div>
                  <div className="text-2xl font-bold font-mono">{result.root1}</div>
                </div>
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                  <div className="text-sm opacity-80">Root 2 (x₂)</div>
                  <div className="text-2xl font-bold font-mono">{result.root2}</div>
                </div>
                <div className="p-2 bg-white/10 rounded">
                  <div className="text-xs opacity-70">Discriminant (Δ)</div>
                  <div className="font-bold font-mono">{isNaN(result.discriminant) ? 'N/A' : result.discriminant.toFixed(4)}</div>
                </div>
                <div className="p-2 bg-white/10 rounded">
                  <div className="text-xs opacity-70">Nature of Roots</div>
                  <div className="font-bold text-sm">{result.rootNature}</div>
                </div>
                <div className="p-2 bg-white/10 rounded">
                  <div className="text-xs opacity-70">Vertex</div>
                  <div className="font-bold font-mono">{result.vertex}</div>
                </div>
              </div>
            </div>
          )}

          {/* Quadratic Formula Reference */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">📐 Quadratic Formula</h3>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-lg font-mono">
                x = <span className="text-blue-600">(-b ± √(b²-4ac))</span> / <span className="text-purple-600">(2a)</span>
              </div>
            </div>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <p><strong>Δ = b² - 4ac</strong> (Discriminant)</p>
              <p>Δ &gt; 0: Two real roots</p>
              <p>Δ = 0: One repeated root</p>
              <p>Δ &lt; 0: Complex roots</p>
            </div>
          </div>

          {/* History */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-gray-900">📋 History</h3>
              {history.length > 0 && (
                <button onClick={clearHistory} className="text-sm text-red-500 hover:text-red-700">
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No calculations yet</p>
              ) : (
                history.map((item, idx) => (
                  <div key={idx} className="p-2 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <div className="text-sm font-mono text-gray-800">{item.equation}</div>
                    <div className="text-xs text-gray-500">
                      x₁ = {item.root1}, x₂ = {item.root2}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
{/* Related Calculators */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Related Calculators</h3>
            <div className="grid grid-cols-2 gap-2">
              {relatedCalculators.map((calc, idx) => (
                <Link
                  key={idx}
                  href={calc.href}
                  className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
                >
                  <div className={`w-8 h-8 ${calc.color} rounded-lg mb-2 flex items-center justify-center text-white text-sm font-bold`}>
                    {calc.title.charAt(0)}
                  </div>
                  <div className="text-sm font-medium text-gray-800 group-hover:text-blue-600">{calc.title}</div>
                  <div className="text-xs text-gray-500">{calc.description}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-3">Quadratic Equation</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>Form:</strong> ax² + bx + c = 0</li>
            <li><strong>Degree:</strong> 2 (highest power)</li>
            <li><strong>Roots:</strong> Up to 2 solutions</li>
            <li><strong>Graph:</strong> Parabola shape</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-3">The Discriminant</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>Δ &gt; 0:</strong> Two distinct real roots</li>
            <li><strong>Δ = 0:</strong> One repeated root</li>
            <li><strong>Δ &lt; 0:</strong> Two complex roots</li>
            <li><strong>Perfect square:</strong> Rational roots</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-3">Parabola Properties</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>a &gt; 0:</strong> Opens upward</li>
            <li><strong>a &lt; 0:</strong> Opens downward</li>
            <li><strong>Vertex:</strong> (-b/2a, f(-b/2a))</li>
            <li><strong>Axis:</strong> x = -b/(2a)</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-3">Applications</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>Physics:</strong> Projectile motion</li>
            <li><strong>Engineering:</strong> Optimization</li>
            <li><strong>Economics:</strong> Cost/revenue analysis</li>
            <li><strong>Architecture:</strong> Parabolic arches</li>
          </ul>
        </div>
      </div>
      {/* FAQs */}
      <FirebaseFAQs
        pageId="quadratic-equation-solver"
        fallbackFaqs={fallbackFaqs}
      />

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          <strong>Disclaimer:</strong> This calculator is for educational purposes. Results are based on the quadratic formula. Always verify critical calculations independently.
        </p>
      </div>
    </div>
  );
}

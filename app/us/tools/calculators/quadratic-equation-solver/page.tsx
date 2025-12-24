import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import QuadraticEquationSolverClient from './QuadraticEquationSolverClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'quadratic-equation-solver',
  category: 'calculators',
  fallback: {
    title: 'Quadratic Equation Solver - Solve ax² + bx + c = 0 | Free Tool',
    description: 'Free quadratic equation solver with step-by-step solutions, parabola graph, and discriminant analysis. Solve any quadratic equation and understand the roots.',
    keywords: 'quadratic equation solver, quadratic formula, solve equations, discriminant, roots, parabola, vertex, algebra calculator',
  }
});

export default function QuadraticEquationSolverPage() {
  return <QuadraticEquationSolverClient />;
}

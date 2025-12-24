import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import EquationSolverClient from './EquationSolverClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'equation-solver',
  category: 'games',
  fallback: {
    title: 'Equation Solver Game Online - Practice Algebra Free | The Economic Times',
    description: 'Play Equation Solver game online for free! Practice solving algebraic equations step by step. Learn to solve for x with linear equations at different difficulty levels.',
    keywords: 'equation solver, equation solver game, algebra game, solve for x, linear equations, algebra practice, math equations, equation solving, algebra online',
  }
});

export default function EquationSolverPage() {
  return <EquationSolverClient />;
}

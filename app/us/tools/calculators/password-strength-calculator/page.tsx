import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PasswordStrengthCalculatorClient from './PasswordStrengthCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'password-strength-calculator',
  category: 'calculators',
  fallback: {
    title: 'Password Strength Calculator - Test Password Security and Strength',
    description: 'Test your password strength and security level. Get real-time feedback on password complexity, entropy, and time to crack estimates.',
    keywords: '',
  }
});

export default function PasswordStrengthCalculatorPage() {
  return <PasswordStrengthCalculatorClient />;
}

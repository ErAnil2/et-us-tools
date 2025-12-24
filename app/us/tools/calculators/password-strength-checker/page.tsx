import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PasswordStrengthCheckerClient from './PasswordStrengthCheckerClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'password-strength-checker',
  category: 'calculators',
  fallback: {
    title: 'Password Strength Checker - Secure Password Generator & Analyzer | The Economic Times',
    description: 'Check password strength and security with real-time analysis. Generate secure passwords and learn best practices for online security.',
    keywords: 'password strength checker, password security, password generator, secure password, cybersecurity, password analyzer',
  }
});

export default function PasswordStrengthCheckerPage() {
  return <PasswordStrengthCheckerClient />;
}

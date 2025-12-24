import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PasswordGeneratorClient from './PasswordGeneratorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'strong-password-generator',
  category: 'apps',
  fallback: {
    title: 'Password Generator - Create Strong Secure Passwords Free | The Economic Times',
    description: 'Generate strong, secure passwords online for free! Create random passwords with uppercase, lowercase, numbers, and symbols. Protect your accounts with unbreakable passwords.',
    keywords: 'password generator, strong password generator, secure password, random password, generate password, password creator, strong password maker, free password generator',
  }
});

export default function PasswordGeneratorPage() {
  return <PasswordGeneratorClient />;
}

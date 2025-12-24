import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import JsonFormatterClient from './JsonFormatterClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'json-formatter',
  category: 'apps',
  fallback: {
    title: 'JSON Formatter Online - Free JSON Validator & Beautifier | The Economic Times',
    description: 'Format JSON online for free! Validate, beautify, and minify JSON data instantly. Developer-friendly JSON tool with syntax highlighting and error detection.',
    keywords: 'JSON formatter, JSON formatter online, JSON validator, JSON beautifier, JSON minifier, JSON parser, format JSON, validate JSON, developer tools',
  }
});

export default function JsonFormatterPage() {
  return <JsonFormatterClient />;
}

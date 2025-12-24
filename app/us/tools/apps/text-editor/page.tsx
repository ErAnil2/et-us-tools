import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import TextEditorClient from './TextEditorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'text-editor',
  category: 'apps',
  fallback: {
    title: 'Online Text Editor - Free Rich Text Editor with Formatting | The Economic Times',
    description: 'Use our free online text editor with rich formatting options! Edit text with bold, italic, colors, and more. Word count, spell check, and easy document saving.',
    keywords: 'online text editor, text editor online, free text editor, rich text editor, online word processor, document editor, formatting tools, write online',
  }
});

export default function TextEditorPage() {
  return <TextEditorClient />;
}

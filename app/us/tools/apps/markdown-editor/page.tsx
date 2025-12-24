import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MarkdownEditorClient from './MarkdownEditorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'markdown-editor',
  category: 'apps',
  fallback: {
    title: 'Markdown Editor Online - Free Live Preview MD Editor | The Economic Times',
    description: 'Edit Markdown online for free with live preview! Write, preview, and export Markdown documents. Syntax highlighting, README creation, and real-time rendering.',
    keywords: 'markdown editor, markdown editor online, live markdown preview, md editor, markdown writer, README editor, free markdown editor, markdown preview',
  }
});

export default function MarkdownEditorPage() {
  return <MarkdownEditorClient />;
}

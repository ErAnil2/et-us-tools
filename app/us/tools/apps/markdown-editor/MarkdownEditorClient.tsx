'use client';

import { useState, useMemo, useCallback } from 'react';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import AdBanner from '@/components/AdBanner';
import Link from 'next/link';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: 'What is Markdown?',
    answer: 'Markdown is a lightweight markup language that uses plain text formatting syntax. It was created by John Gruber in 2004 and is widely used for documentation, README files, forum posts, and content creation. It converts easily to HTML while remaining readable as plain text.',
    order: 1
  },
  {
    id: '2',
    question: 'What formatting options are supported?',
    answer: 'Our editor supports all common Markdown syntax including: headers (H1-H6), bold, italic, strikethrough, links, images, code blocks, inline code, blockquotes, ordered and unordered lists, horizontal rules, and tables.',
    order: 2
  },
  {
    id: '3',
    question: 'Can I export my Markdown?',
    answer: 'Yes! You can export your content as a .md file for use in other applications, or copy the rendered HTML for direct use in websites. The editor also supports importing existing Markdown files.',
    order: 3
  },
  {
    id: '4',
    question: 'Is my content saved automatically?',
    answer: 'Content is stored in your browser\'s local storage, so it persists between sessions on the same device. However, we recommend regularly exporting important documents as files for backup.',
    order: 4
  },
  {
    id: '5',
    question: 'Can I use this editor on mobile devices?',
    answer: 'Yes! The editor is fully responsive and works on tablets and mobile phones. The preview panel can be toggled for better editing experience on smaller screens.',
    order: 5
  },
  {
    id: '6',
    question: 'Is my data private?',
    answer: 'Absolutely. All editing and rendering happens entirely in your browser. No content is ever sent to any server. Your documents remain completely private on your device.',
    order: 6
  }
];

const sampleMarkdown = `# Welcome to Markdown Editor

This is a **live preview** markdown editor. Start typing on the left to see your formatted text on the right!

## Features

- **Bold text** with \`**text**\`
- *Italic text* with \`*text*\`
- ~~Strikethrough~~ with \`~~text~~\`
- \`Inline code\` with backticks

### Code Blocks

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Lists

1. First ordered item
2. Second ordered item
3. Third ordered item

- Unordered item
- Another item
  - Nested item

### Blockquotes

> This is a blockquote.
> It can span multiple lines.

### Links and Images

[Visit Google](https://google.com)

---

Happy writing! ✨
`;

export default function MarkdownEditorClient() {
  const [markdown, setMarkdown] = useState(sampleMarkdown);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [copied, setCopied] = useState<'md' | 'html' | null>(null);
  const [wordCount, setWordCount] = useState({ words: 0, chars: 0, lines: 0 });

  const { getH1, getSubHeading } = usePageSEO('markdown-editor');

  const webAppSchema = generateWebAppSchema(
    'Markdown Editor - Free Online Live Preview Editor',
    'Free online Markdown editor with live preview. Write, format, and export Markdown documents. Supports all common Markdown syntax with instant rendering.',
    'https://economictimes.indiatimes.com/us/tools/apps/markdown-editor',
    'DeveloperApplication'
  );

  // Simple Markdown to HTML converter
  const parseMarkdown = useCallback((text: string): string => {
    let html = text
      // Escape HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

      // Code blocks (before other processing)
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')

      // Inline code
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')

      // Headers
      .replace(/^###### (.*)$/gm, '<h6>$1</h6>')
      .replace(/^##### (.*)$/gm, '<h5>$1</h5>')
      .replace(/^#### (.*)$/gm, '<h4>$1</h4>')
      .replace(/^### (.*)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*)$/gm, '<h1>$1</h1>')

      // Bold and Italic
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/~~(.+?)~~/g, '<del>$1</del>')

      // Links and images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto">')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-blue-600 underline">$1</a>')

      // Blockquotes
      .replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>')

      // Horizontal rules
      .replace(/^---$/gm, '<hr>')
      .replace(/^\*\*\*$/gm, '<hr>')

      // Tables
      .replace(/^\|(.+)\|$/gm, (match, content) => {
        const cells = content.split('|').map((cell: string) => cell.trim());
        if (cells.every((cell: string) => /^[-:]+$/.test(cell))) {
          return '<!-- table separator -->';
        }
        const isHeader = cells.some((cell: string) => cell.includes('---'));
        if (!isHeader) {
          return '<tr>' + cells.map((cell: string) => `<td class="border border-gray-300 px-3 py-2">${cell}</td>`).join('') + '</tr>';
        }
        return match;
      })

      // Unordered lists
      .replace(/^- (.*)$/gm, '<li class="ml-4">$1</li>')
      .replace(/^  - (.*)$/gm, '<li class="ml-8">$1</li>')

      // Ordered lists
      .replace(/^\d+\. (.*)$/gm, '<li class="list-decimal ml-4">$1</li>')

      // Paragraphs (lines that aren't already HTML)
      .replace(/^(?!<[a-z]|<!--)(.+)$/gm, '<p>$1</p>')

      // Clean up consecutive blockquotes
      .replace(/<\/blockquote>\n<blockquote>/g, '\n')

      // Wrap lists
      .replace(/(<li class="ml-4">.*<\/li>\n?)+/g, '<ul class="list-disc my-2">$&</ul>')
      .replace(/(<li class="list-decimal.*<\/li>\n?)+/g, '<ol class="list-decimal my-2">$&</ol>')

      // Wrap tables
      .replace(/(<tr>.*<\/tr>\n?)+/g, '<table class="border-collapse my-4 w-full">$&</table>')

      // Clean up empty paragraphs
      .replace(/<p><\/p>/g, '')
      .replace(/<!-- table separator -->/g, '');

    return html;
  }, []);

  const renderedHtml = useMemo(() => parseMarkdown(markdown), [markdown, parseMarkdown]);

  // Calculate word count
  useMemo(() => {
    const text = markdown.replace(/[#*`~\[\]()]/g, '');
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const chars = text.length;
    const lines = markdown.split('\n').length;
    setWordCount({ words, chars, lines });
  }, [markdown]);

  const insertText = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const newText = markdown.substring(0, start) + before + selectedText + after + markdown.substring(end);
    setMarkdown(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    setCopied('md');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(renderedHtml);
    setCopied('html');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setMarkdown(content);
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all content?')) {
      setMarkdown('');
    }
  };

  const relatedTools = [
    { name: 'Note Taking', href: '/us/tools/apps/note-taking', icon: '📝' },
    { name: 'Text Editor', href: '/us/tools/apps/text-editor', icon: '📄' },
    { name: 'Word Counter', href: '/us/tools/apps/word-counter', icon: '🔢' },
    { name: 'JSON Formatter', href: '/us/tools/apps/json-formatter', icon: '{ }' }
  ];

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-100 to-slate-100 px-5 py-2.5 rounded-full mb-3">
          <span className="text-2xl">📝</span>
          <span className="text-gray-600 font-semibold">Markdown Editor</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-700 to-slate-700 bg-clip-text text-transparent mb-3">
          {getH1('Markdown Editor')}
        </h1>

        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          {getSubHeading('Write and preview Markdown in real-time. Export your documents or copy the rendered HTML.')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Mobile Stats Bar */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4 lg:hidden">
            <div className="bg-gradient-to-br from-gray-600 to-slate-600 rounded-xl p-3 text-center text-white shadow-lg">
              <div className="text-[10px] sm:text-xs font-medium opacity-90 uppercase tracking-wide">Words</div>
              <div className="text-sm sm:text-base font-bold">{wordCount.words}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-3 text-center text-white shadow-lg">
              <div className="text-[10px] sm:text-xs font-medium opacity-90 uppercase tracking-wide">Chars</div>
              <div className="text-sm sm:text-base font-bold">{wordCount.chars}</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-3 text-center text-white shadow-lg">
              <div className="text-[10px] sm:text-xs font-medium opacity-90 uppercase tracking-wide">Lines</div>
              <div className="text-sm sm:text-base font-bold">{wordCount.lines}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-3 text-center text-white shadow-lg">
              <div className="text-[10px] sm:text-xs font-medium opacity-90 uppercase tracking-wide">Read</div>
              <div className="text-sm sm:text-base font-bold">{Math.ceil(wordCount.words / 200)}m</div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-gradient-to-br from-white via-gray-50/30 to-slate-50/30 rounded-2xl shadow-xl p-4 mb-4 border-2 border-gray-100">
            <div className="flex flex-wrap justify-between items-center gap-3">
              {/* Formatting buttons */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => insertText('**', '**')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700 transition-colors"
                  title="Bold"
                >
                  B
                </button>
                <button
                  onClick={() => insertText('*', '*')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg italic text-gray-700 transition-colors"
                  title="Italic"
                >
                  I
                </button>
                <button
                  onClick={() => insertText('~~', '~~')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg line-through text-gray-700 transition-colors"
                  title="Strikethrough"
                >
                  S
                </button>
                <button
                  onClick={() => insertText('`', '`')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-mono text-gray-700 transition-colors"
                  title="Inline Code"
                >
                  {'<>'}
                </button>
                <button
                  onClick={() => insertText('# ')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                  title="Heading"
                >
                  H
                </button>
                <button
                  onClick={() => insertText('[', '](url)')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                  title="Link"
                >
                  🔗
                </button>
                <button
                  onClick={() => insertText('- ')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                  title="List"
                >
                  •
                </button>
              </div>

              {/* View mode toggle */}
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('edit')}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    viewMode === 'edit' ? 'bg-white shadow text-gray-800' : 'text-gray-600'
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    viewMode === 'split' ? 'bg-white shadow text-gray-800' : 'text-gray-600'
                  }`}
                >
                  Split
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    viewMode === 'preview' ? 'bg-white shadow text-gray-800' : 'text-gray-600'
                  }`}
                >
                  Preview
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-1.5">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".md,.markdown,.txt"
                    onChange={handleImport}
                    className="hidden"
                  />
                  <span className="px-2 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs font-medium inline-block">
                    Import
                  </span>
                </label>
                <button
                  onClick={handleExport}
                  className="px-2 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs font-medium"
                >
                  Export
                </button>
                <button
                  onClick={handleClear}
                  className="px-2 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Editor Area */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 mb-6 overflow-hidden">
            <div className={`grid ${viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              {/* Editor */}
              {(viewMode === 'edit' || viewMode === 'split') && (
                <div className={`${viewMode === 'split' ? 'border-r border-gray-200' : ''}`}>
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Markdown</span>
                  </div>
                  <textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    className="w-full h-[400px] p-4 font-mono text-sm resize-none focus:outline-none"
                    placeholder="Start writing Markdown..."
                    spellCheck={false}
                  />
                </div>
              )}

              {/* Preview */}
              {(viewMode === 'preview' || viewMode === 'split') && (
                <div>
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Preview</span>
                  </div>
                  <div
                    className="w-full h-[400px] p-4 overflow-y-auto prose prose-sm max-w-none
                      prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600
                      prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-code:text-pink-600
                      prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-4
                      prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic"
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Markdown Cheat Sheet */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100 shadow-lg mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">Markdown Cheat Sheet</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-3 shadow-md border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Text</h4>
                <code className="text-xs text-gray-600 block">**bold**</code>
                <code className="text-xs text-gray-600 block">*italic*</code>
                <code className="text-xs text-gray-600 block">~~strike~~</code>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-md border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Headers</h4>
                <code className="text-xs text-gray-600 block"># H1</code>
                <code className="text-xs text-gray-600 block">## H2</code>
                <code className="text-xs text-gray-600 block">### H3</code>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-md border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Links</h4>
                <code className="text-xs text-gray-600 block">[text](url)</code>
                <code className="text-xs text-gray-600 block">![alt](img)</code>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-md border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Lists</h4>
                <code className="text-xs text-gray-600 block">- Unordered</code>
                <code className="text-xs text-gray-600 block">1. Ordered</code>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-md border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Code</h4>
                <code className="text-xs text-gray-600 block">`inline`</code>
                <code className="text-xs text-gray-600 block">```block```</code>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-md border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Other</h4>
                <code className="text-xs text-gray-600 block">&gt; Quote</code>
                <code className="text-xs text-gray-600 block">--- Line</code>
              </div>
            </div>
          </div>
        </div>
{/* Right Sidebar - 320px */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Desktop Stats - Hidden on mobile */}
          <div className="hidden lg:block bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">📊</span>
              Document Stats
            </h3>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-gray-600 to-slate-600 rounded-xl p-3 text-white">
                <div className="text-xs font-medium opacity-90 uppercase tracking-wide">Words</div>
                <div className="text-lg font-bold">{wordCount.words}</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-3 text-white">
                <div className="text-xs font-medium opacity-90 uppercase tracking-wide">Characters</div>
                <div className="text-lg font-bold">{wordCount.chars}</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3 text-white">
                <div className="text-xs font-medium opacity-90 uppercase tracking-wide">Lines</div>
                <div className="text-lg font-bold">{wordCount.lines}</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-3 text-white">
                <div className="text-xs font-medium opacity-90 uppercase tracking-wide">Read Time</div>
                <div className="text-lg font-bold">{Math.ceil(wordCount.words / 200)} min</div>
              </div>
            </div>
          </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

          {/* Copy Buttons */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">📋</span>
              Copy Output
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleCopyMarkdown}
                className="w-full px-4 py-3 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                {copied === 'md' ? '✓ Copied!' : '📋 Copy Markdown'}
              </button>
              <button
                onClick={handleCopyHtml}
                className="w-full px-4 py-3 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                {copied === 'html' ? '✓ Copied!' : '📋 Copy HTML'}
              </button>
            </div>
          </div>

          {/* Ad Banner */}
          <AdBanner />
{/* Related Tools */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">🔗</span>
              Related Tools
            </h3>
            <div className="space-y-2">
              {relatedTools.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">{tool.icon}</span>
                  <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{tool.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-4 border border-slate-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">💡</span>
              Quick Tips
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
                <span className="text-slate-500">•</span>
                <span>Use Split view for best editing</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
                <span className="text-slate-500">•</span>
                <span>Export to save as .md file</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
                <span className="text-slate-500">•</span>
                <span>Copy HTML for websites</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
                <span className="text-slate-500">•</span>
                <span>Use toolbar for formatting</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Mobile MREC2 - Before FAQs */}


      

      <GameAppMobileMrec2 />



      

      {/* FAQs Section */}
      <div className="mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-slate-600 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
        </div>
        <FirebaseFAQs pageId="markdown-editor" fallbackFaqs={fallbackFaqs} />
      </div>
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import AdBanner from '@/components/AdBanner';
import Link from 'next/link';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: 'Are my notes saved automatically?',
    answer: 'Yes! Notes are automatically saved to your browser\'s local storage. They persist between sessions on the same device. For important notes, we recommend exporting them as files for backup.',
    order: 1
  },
  {
    id: '2',
    question: 'Can I organize notes into folders or categories?',
    answer: 'Yes, you can assign colors to notes for quick visual categorization. Notes can also be pinned to keep important ones at the top of your list.',
    order: 2
  },
  {
    id: '3',
    question: 'How do I search through my notes?',
    answer: 'Use the search box at the top to filter notes by title or content. The search is instant and case-insensitive, making it easy to find what you need.',
    order: 3
  },
  {
    id: '4',
    question: 'Is there a limit to how many notes I can create?',
    answer: 'There is no fixed limit, but notes are stored in your browser\'s local storage which typically allows several megabytes of data. For extensive note-taking, consider periodically exporting old notes.',
    order: 4
  },
  {
    id: '5',
    question: 'Can I access my notes from different devices?',
    answer: 'Notes are stored locally in your browser, so they don\'t sync across devices. To transfer notes, use the export function to download them and import on another device.',
    order: 5
  },
  {
    id: '6',
    question: 'Is my data private and secure?',
    answer: 'All notes are stored entirely in your browser and never sent to any server. Your data remains completely private on your device.',
    order: 6
  }
];

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const COLORS = [
  { name: 'Default', value: '#FFFFFF' },
  { name: 'Yellow', value: '#FEF3C7' },
  { name: 'Green', value: '#D1FAE5' },
  { name: 'Blue', value: '#DBEAFE' },
  { name: 'Purple', value: '#EDE9FE' },
  { name: 'Pink', value: '#FCE7F3' },
  { name: 'Orange', value: '#FFEDD5' },
];

export default function NoteTakingClient() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editColor, setEditColor] = useState('#FFFFFF');

  const { getH1, getSubHeading } = usePageSEO('note-taking');

  const webAppSchema = generateWebAppSchema(
    'Note Taking App - Free Online Notes',
    'Free online note taking app. Create, organize, and search notes. Supports colors, pinning, and local storage. No signup required.',
    'https://economictimes.indiatimes.com/us/tools/apps/note-taking',
    'Utility'
  );

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('notes-app-data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotes(parsed.map((n: Note) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          updatedAt: new Date(n.updatedAt) })));
      } catch (e) {
        console.error('Failed to load notes');
      }
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notes-app-data', JSON.stringify(notes));
    }
  }, [notes]);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      color: '#FFFFFF',
      pinned: false,
      createdAt: new Date(),
      updatedAt: new Date() };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setEditColor(newNote.color);
    setIsEditing(true);
  };

  const saveNote = () => {
    if (!activeNote) return;

    setNotes(notes.map(note =>
      note.id === activeNote.id
        ? { ...note, title: editTitle || 'Untitled', content: editContent, color: editColor, updatedAt: new Date() }
        : note
    ));
    setIsEditing(false);
  };

  const deleteNote = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== id));
      if (activeNote?.id === id) {
        setActiveNote(null);
        setIsEditing(false);
      }
    }
  };

  const togglePin = (id: string) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, pinned: !note.pinned } : note
    ));
  };

  const selectNote = (note: Note) => {
    if (isEditing && activeNote) {
      saveNote();
    }
    setActiveNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditColor(note.color);
    setIsEditing(true);
  };

  const exportNotes = () => {
    const data = JSON.stringify(notes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importNotes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        setNotes([...imported.map((n: Note) => ({
          ...n,
          id: Date.now().toString() + Math.random(),
          createdAt: new Date(n.createdAt),
          updatedAt: new Date(n.updatedAt) })), ...notes]);
      } catch (e) {
        alert('Failed to import notes. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

  const pinnedCount = notes.filter(n => n.pinned).length;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit' });
  };

  const relatedTools = [
    { name: 'Markdown Editor', href: '/us/tools/apps/markdown-editor', icon: '📄' },
    { name: 'Text Editor', href: '/us/tools/apps/text-editor', icon: '📝' },
    { name: 'To-Do List', href: '/us/tools/apps/todo-list', icon: '✅' },
    { name: 'Word Counter', href: '/us/tools/apps/word-counter', icon: '🔢' }
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
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-100 to-amber-100 px-5 py-2.5 rounded-full mb-3">
          <span className="text-2xl">📝</span>
          <span className="text-amber-600 font-semibold">Note Taking</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-3">
          {getH1('Note Taking App')}
        </h1>

        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          {getSubHeading('Create, organize, and search your notes. Everything is saved locally in your browser.')}
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
            <div className="bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl p-3 text-center text-white shadow-lg">
              <div className="text-[10px] sm:text-xs font-medium opacity-90 uppercase tracking-wide">Notes</div>
              <div className="text-sm sm:text-base font-bold">{notes.length}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-3 text-center text-white shadow-lg">
              <div className="text-[10px] sm:text-xs font-medium opacity-90 uppercase tracking-wide">Pinned</div>
              <div className="text-sm sm:text-base font-bold">{pinnedCount}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-3 text-center text-white shadow-lg">
              <div className="text-[10px] sm:text-xs font-medium opacity-90 uppercase tracking-wide">Status</div>
              <div className="text-sm sm:text-base font-bold">{isEditing ? 'Editing' : 'Ready'}</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-3 text-center text-white shadow-lg">
              <div className="text-[10px] sm:text-xs font-medium opacity-90 uppercase tracking-wide">Colors</div>
              <div className="text-sm sm:text-base font-bold">{COLORS.length}</div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-gradient-to-br from-white via-yellow-50/30 to-amber-50/30 rounded-2xl shadow-xl p-4 mb-4 border-2 border-yellow-100">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={createNote}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg font-medium hover:from-yellow-600 hover:to-amber-600 transition-all shadow-md"
                >
                  + New Note
                </button>
                <button
                  onClick={exportNotes}
                  disabled={notes.length === 0}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Export
                </button>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".json"
                    onChange={importNotes}
                    className="hidden"
                  />
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors inline-block">
                    Import
                  </span>
                </label>
              </div>

              <div className="flex-1 max-w-xs">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
            </div>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Notes List */}
            <div className="bg-gradient-to-br from-white via-gray-50/30 to-yellow-50/30 rounded-2xl shadow-xl p-4 border-2 border-gray-100 max-h-[500px] overflow-y-auto">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-xl">📋</span>
                Your Notes ({filteredNotes.length})
              </h3>
              {filteredNotes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {notes.length === 0 ? 'No notes yet. Create one!' : 'No notes match your search.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotes.map(note => (
                    <div
                      key={note.id}
                      onClick={() => selectNote(note)}
                      className={`p-4 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                        activeNote?.id === note.id ? 'ring-2 ring-yellow-500' : ''
                      }`}
                      style={{ backgroundColor: note.color }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800 truncate flex-1">
                          {note.pinned && <span className="mr-1">📌</span>}
                          {note.title}
                        </h4>
                        <button
                          onClick={(e) => { e.stopPropagation(); togglePin(note.id); }}
                          className="text-gray-400 hover:text-yellow-500 transition-colors"
                        >
                          {note.pinned ? '📌' : '📍'}
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {note.content || 'No content'}
                      </p>
                      <div className="text-xs text-gray-400">
                        {formatDate(note.updatedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Note Editor */}
            <div>
              {isEditing && activeNote ? (
                <div
                  className="bg-white rounded-2xl shadow-xl p-5 border-2 border-gray-100"
                  style={{ backgroundColor: editColor }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Note title..."
                      className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 w-full"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveNote}
                        className="px-3 py-1.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => deleteNote(activeNote.id)}
                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Color picker */}
                  <div className="flex gap-2 mb-4">
                    {COLORS.map(color => (
                      <button
                        key={color.value}
                        onClick={() => setEditColor(color.value)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          editColor === color.value ? 'border-gray-800 scale-110' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>

                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Start writing..."
                    className="w-full h-[280px] bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-gray-800"
                  />

                  <div className="text-xs text-gray-500 mt-2">
                    Created: {formatDate(activeNote.createdAt)} | Updated: {formatDate(activeNote.updatedAt)}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl p-6 text-center border-2 border-gray-100">
                  <div className="text-5xl mb-4">📝</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Select a note to edit</h3>
                  <p className="text-gray-600 mb-4 text-sm">Choose a note from the list or create a new one</p>
                  <button
                    onClick={createNote}
                    className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-amber-600 transition-all"
                  >
                    Create New Note
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* How to Use Section */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100 shadow-lg mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">How to Use</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-xl">➕</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">Create Notes</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">Click &quot;New Note&quot; to create a fresh note and start writing immediately.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-xl">🎨</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">Color Code</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">Use colors to organize and categorize your notes visually.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-xl">📌</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">Pin Important</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">Pin notes to keep them at the top of your list for quick access.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-xl">💾</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">Export & Import</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">Backup your notes by exporting, or restore from a previous export.</p>
                  </div>
                </div>
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
              Stats
            </h3>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl p-3 text-white">
                <div className="text-xs font-medium opacity-90 uppercase tracking-wide">Total Notes</div>
                <div className="text-lg font-bold">{notes.length}</div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-3 text-white">
                <div className="text-xs font-medium opacity-90 uppercase tracking-wide">Pinned Notes</div>
                <div className="text-lg font-bold">{pinnedCount}</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-3 text-white">
                <div className="text-xs font-medium opacity-90 uppercase tracking-wide">Status</div>
                <div className="text-lg font-bold">{isEditing ? 'Editing' : 'Ready'}</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3 text-white">
                <div className="text-xs font-medium opacity-90 uppercase tracking-wide">Available Colors</div>
                <div className="text-lg font-bold">{COLORS.length}</div>
              </div>
            </div>
          </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

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
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-yellow-300 hover:shadow-md transition-all group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">{tool.icon}</span>
                  <span className="font-medium text-gray-700 group-hover:text-yellow-600 transition-colors">{tool.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 border border-amber-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">💡</span>
              Quick Tips
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
                <span className="text-amber-500">•</span>
                <span>Use colors to categorize notes</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
                <span className="text-amber-500">•</span>
                <span>Pin important notes to top</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
                <span className="text-amber-500">•</span>
                <span>Export notes for backup</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
                <span className="text-amber-500">•</span>
                <span>Search by title or content</span>
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
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
        </div>
        <FirebaseFAQs pageId="note-taking" fallbackFaqs={fallbackFaqs} />
      </div>
    </>
  );
}

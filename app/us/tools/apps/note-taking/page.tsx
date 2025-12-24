import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import NoteTakingClient from './NoteTakingClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'note-taking',
  category: 'apps',
  fallback: {
    title: 'Online Notepad - Free Note Taking App | The Economic Times',
    description: 'Take notes online for free! Simple notepad app with auto-save. Create, organize, and access notes from any device. Perfect for quick notes and ideas.',
    keywords: 'online notepad, note taking app, free notepad, notes online, quick notes, simple notes, web notepad, browser notepad, take notes online',
  }
});

export default function NoteTakingPage() {
  return <NoteTakingClient />;
}

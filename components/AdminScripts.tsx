'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface ScriptItem {
  id: string;
  name: string;
  enabled: boolean;
  script: string;
}

interface ScriptData {
  headerScripts: ScriptItem[];
  bodyScripts: ScriptItem[];
}

// Helper function to extract script content from HTML string
function extractScriptContent(htmlString: string): { src?: string; content?: string; async?: boolean }[] {
  const scripts: { src?: string; content?: string; async?: boolean }[] = [];

  // Match script tags with src attribute (including self-closing)
  const srcRegex = /<script[^>]*src=["']([^"']+)["'][^>]*\/?>/gi;
  let match;
  while ((match = srcRegex.exec(htmlString)) !== null) {
    const isAsync = /async/i.test(match[0]);
    scripts.push({ src: match[1], async: isAsync });
  }

  // Match inline script content - use a more robust regex that handles multiline
  const inlineRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
  while ((match = inlineRegex.exec(htmlString)) !== null) {
    if (match[1].trim()) {
      scripts.push({ content: match[1].trim() });
    }
  }

  return scripts;
}

export function HeaderScripts() {
  const [scripts, setScripts] = useState<ScriptItem[]>([]);

  useEffect(() => {
    fetch('/api/admin/scripts')
      .then(res => res.json())
      .then((data: ScriptData) => {
        setScripts(data.headerScripts?.filter(s => s.enabled) || []);
      })
      .catch(err => console.error('Error loading header scripts:', err));
  }, []);

  // Don't render anything in the head directly - scripts are injected via useEffect
  // This approach avoids the hydration error with <div> in <head>
  return null;
}

// This component injects scripts into the document head via useEffect
export function HeadScriptInjector() {
  useEffect(() => {
    fetch('/api/admin/scripts')
      .then(res => res.json())
      .then((data: ScriptData) => {
        const enabledScripts = data.headerScripts?.filter(s => s.enabled) || [];

        enabledScripts.forEach((scriptItem) => {
          const extracted = extractScriptContent(scriptItem.script);

          extracted.forEach((item, index) => {
            const scriptEl = document.createElement('script');
            scriptEl.id = `admin-header-script-${scriptItem.id}-${index}`;

            if (item.src) {
              scriptEl.src = item.src;
              scriptEl.async = true;
            } else if (item.content) {
              scriptEl.textContent = item.content;
            }

            // Check if script already exists
            if (!document.getElementById(scriptEl.id)) {
              document.head.appendChild(scriptEl);
            }
          });
        });
      })
      .catch(err => console.error('Error loading header scripts:', err));
  }, []);

  return null;
}

export function BodyScripts() {
  const [scripts, setScripts] = useState<ScriptItem[]>([]);

  useEffect(() => {
    fetch('/api/admin/scripts')
      .then(res => res.json())
      .then((data: ScriptData) => {
        setScripts(data.bodyScripts?.filter(s => s.enabled) || []);
      })
      .catch(err => console.error('Error loading body scripts:', err));
  }, []);

  return (
    <>
      {scripts.map((scriptItem, idx) => {
        const extracted = extractScriptContent(scriptItem.script);

        return extracted.map((item, index) => {
          if (item.src) {
            return (
              <Script
                key={`${scriptItem.id}-${index}`}
                id={`admin-body-script-${scriptItem.id}-${index}`}
                src={item.src}
                strategy="afterInteractive"
              />
            );
          } else if (item.content) {
            return (
              <Script
                key={`${scriptItem.id}-${index}`}
                id={`admin-body-script-${scriptItem.id}-${index}`}
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            );
          }
          return null;
        });
      })}
    </>
  );
}

const fs = require('fs');
const path = require('path');

const calculatorsDir = path.join(__dirname, 'app/us/tools/calculators');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Fix the pattern where relatedCalculators prop has color: string; (required)
  // Change it to color?: string; (optional)
  // This pattern appears in the Props interface for relatedCalculators
  const pattern = /(relatedCalculators\?\s*:\s*Array<\s*\{[^}]*?)(\s+color:\s+string;)([^}]*\}>)/g;

  content = content.replace(pattern, (match, before, colorPart, after) => {
    return before + '\n    color?: string;' + after;
  });

  // Also fix inline type definitions like { href: string; title: string; description: string; color: string; }
  // within relatedCalculators type
  const inlinePattern = /(\s*relatedCalculators\?\s*:\s*Array<\{[^}]*?)(\bcolor:\s*string)([^}]*\}>)/g;
  content = content.replace(inlinePattern, (match, before, colorPart, after) => {
    return before + 'color?: string' + after;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed:', filePath);
    return true;
  }
  return false;
}

function walkDir(dir) {
  let fixedCount = 0;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      fixedCount += walkDir(fullPath);
    } else if (file.endsWith('Client.tsx')) {
      if (fixFile(fullPath)) {
        fixedCount++;
      }
    }
  }

  return fixedCount;
}

const count = walkDir(calculatorsDir);
console.log(`\nTotal files fixed: ${count}`);

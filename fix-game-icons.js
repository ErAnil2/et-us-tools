const fs = require('fs');
const path = require('path');

const gamesDir = path.join(__dirname, 'app/us/tools/games');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Fix pattern: icon: string; -> icon?: string;
  // and color: string; -> color?: string; in relatedGames props interface

  // Pattern to match the props interface with relatedGames
  const pattern = /(relatedGames\?\s*:\s*Array<\s*\{[^}]*?)(\bcolor:\s*string;)([^}]*?)(\bicon:\s*string;)([^}]*?\}>)/gs;

  content = content.replace(pattern, (match, before, colorPart, middle, iconPart, after) => {
    return before + 'color?: string;' + middle + 'icon?: string;' + after;
  });

  // Also try reverse order (icon before color)
  const pattern2 = /(relatedGames\?\s*:\s*Array<\s*\{[^}]*?)(\bicon:\s*string;)([^}]*?)(\bcolor:\s*string;)([^}]*?\}>)/gs;

  content = content.replace(pattern2, (match, before, iconPart, middle, colorPart, after) => {
    return before + 'icon?: string;' + middle + 'color?: string;' + after;
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

const count = walkDir(gamesDir);
console.log(`\nTotal files fixed: ${count}`);

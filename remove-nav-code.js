const fs = require('fs');
let content = fs.readFileSync('src/pages/DashboardPage.tsx', 'utf8');

const startMarker = '  // Handle browser back/forward gestures and keyboard shortcuts';
const startIdx = content.indexOf(startMarker);

if (startIdx === -1) {
  console.log('Start marker not found');
  process.exit(1);
}

const endMarker = "    window.removeEventListener('touchend', handleTouchEnd);";
const endIdx = content.indexOf(endMarker, startIdx);

if (endIdx === -1) {
  console.log('End marker not found');
  process.exit(1);
}

const afterEnd = content.indexOf('  }, []);', endIdx);
const finalEnd = afterEnd + 9 + 2;

const newContent = content.substring(0, startIdx) + content.substring(finalEnd);

fs.writeFileSync('src/pages/DashboardPage.tsx', newContent);
console.log('Removed navigation blocking code');
console.log('Removed', finalEnd - startIdx, 'characters');

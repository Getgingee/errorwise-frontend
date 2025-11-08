const fs = require('fs');
const filePath = 'src/pages/LandingPage.tsx';
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Section 1: Trust Indicators (lines 471-489, 0-indexed: 470-488)
// Section 2: Social Icons (lines 600-637, need to find exact end)
// Section 3: Support Section (lines 666-710, need to find exact end)

// Add opening comment before line 471 (index 470)
lines.splice(470, 0, '          {/* TODO: Temporarily disabled - Trust Indicators section */}');

// Add closing comment after line 489 (now index 490 due to insertion)
lines.splice(491, 0, '          {/* End Trust Indicators */}');

// Find and comment Social Icons section (around line 600, now shifted by +2)
let socialIconsStart = -1;
let socialIconsEnd = -1;
for (let i = 600; i < lines.length; i++) {
  if (lines[i].includes('Social Icons with Enhanced Glow')) {
    socialIconsStart = i - 1; // Line before the comment
    break;
  }
}
for (let i = socialIconsStart + 1; i < lines.length; i++) {
  if (lines[i].includes('</div>') && lines[i].trim() === '</div>' && i > socialIconsStart + 30) {
    socialIconsEnd = i + 1;
    break;
  }
}

if (socialIconsStart > 0 && socialIconsEnd > 0) {
  lines.splice(socialIconsEnd, 0, '              {/* End Social Icons */}');
  lines.splice(socialIconsStart, 0, '              {/* TODO: Temporarily disabled - Social Icons section */}');
}

// Find and comment Support Section (around line 666, now shifted)
let supportStart = -1;
let supportEnd = -1;
for (let i = 660; i < lines.length; i++) {
  if (lines[i].includes('Support Section')) {
    supportStart = i;
    break;
  }
}
for (let i = supportStart + 1; i < lines.length; i++) {
  if (lines[i].includes('</div>') && lines[i+1] && lines[i+1].trim() === '' && i > supportStart + 40) {
    supportEnd = i + 1;
    break;
  }
}

if (supportStart > 0 && supportEnd > 0) {
  lines.splice(supportEnd, 0, '            {/* End Support Section */}');
  lines.splice(supportStart, 0, '            {/* TODO: Temporarily disabled - Support section */}');
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log(' Successfully commented out sections with proper JSX syntax');

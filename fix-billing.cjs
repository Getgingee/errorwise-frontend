const fs = require('fs');
const filePath = 'src/pages/SubscriptionPage.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Check if helper function already exists
if (content.includes('getPriceForTier')) {
    console.log('Helper function already exists');
} else {
    // Add helper function after the useState declarations
    const helperFunction = `
  // Helper function to get the price for a tier from the plans data
  const getPriceForTier = (tier: string): string => {
    const plan = plans.find(p => p.id === tier);
    if (plan) return \`$\${plan.price}\`;
    // Fallback prices if plans not loaded yet
    switch (tier) {
      case 'pro': return '$3';
      case 'team': return '$9';
      default: return '$0';
    }
  };
`;

    const insertPoint = 'const [success, setSuccess] = useState(false);';
    content = content.replace(insertPoint, insertPoint + helperFunction);
    console.log('Helper function inserted');
}

// Now replace the hardcoded price expression
const oldPrice = `currentSubscription?.tier === 'pro' ? '$9' : currentSubscription?.tier === 'team' ? '$29' : '$0'`;
const newPrice = `getPriceForTier(currentSubscription?.tier || 'free')`;

if (content.includes(oldPrice)) {
    content = content.replace(oldPrice, newPrice);
    console.log('Price expression updated');
} else {
    console.log('Old price expression not found - checking file...');
    // Check if it might be on multiple lines
    const lines = content.split('\n');
    lines.forEach((line, i) => {
        if (line.includes('$9') && line.includes('$29')) {
            console.log(`Found at line ${i+1}: ${line.substring(0, 100)}`);
        }
    });
}

fs.writeFileSync(filePath, content);
console.log('File saved');

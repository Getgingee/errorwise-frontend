# Quick Integration Guide

## How to Add New Components to Existing Pages

### 1. Add Conversational AI to Dashboard

**File**: `src/pages/DashboardPage.tsx`

```typescript
// Add import at top
import ErrorAnalysisEnhanced from '../components/ErrorAnalysisEnhanced';

// In your component, replace or add alongside existing error analysis:
<ErrorAnalysisEnhanced errorMessage={currentError?.message} />

// Or add as a tab/section:
<div className="mt-6">
  <h2 className="text-xl font-bold mb-4">AI Assistant</h2>
  <ErrorAnalysisEnhanced />
</div>
```

### 2. Update Subscription Page with Tier Features

**File**: `src/pages/SubscriptionPage.tsx`

```typescript
// Add imports at top
import { TierComparison, NewFeaturesHighlight } from '../components/TierFeatures';

// In the "Plans" tab section, add:
<NewFeaturesHighlight />

// Replace or enhance existing plan cards:
<TierComparison 
  currentTier={subscription?.tier as 'free' | 'pro' | 'team'}
  onUpgrade={(tier) => {
    // Your existing upgrade logic
    handleUpgrade(tier);
  }}
/>
```

### 3. Add Pro Features to Error Analysis Card

**File**: `src/components/ErrorAnalysisCard.tsx`

```typescript
// Add imports
import { 
  CodeExamplesViewer, 
  FixSuggestionsPanel, 
  URLScrapingResults,
  ExportButton,
  PreventionTips 
} from './ProFeatures';

// In your component JSX, add after main error explanation:

{/* Code Examples - Pro Feature */}
{errorData.codeExamples && (
  <CodeExamplesViewer examples={errorData.codeExamples} />
)}

{/* Fix Suggestions - Pro Feature */}
{errorData.fixSteps && (
  <FixSuggestionsPanel steps={errorData.fixSteps} />
)}

{/* Web Scraping Results - Pro Feature */}
{errorData.webSources && (
  <URLScrapingResults sources={errorData.webSources} />
)}

{/* Prevention Tips - Pro Feature */}
{errorData.preventionTips && (
  <PreventionTips tips={errorData.preventionTips} />
)}

{/* Export Button - Pro Feature */}
<div className="mt-4 flex justify-end">
  <ExportButton data={errorData} filename="error-analysis" format="json" />
</div>
```

### 4. Add Tier Gates to Any Feature

```typescript
import { TierGate, FeatureGate } from '../components/TierGate';

// Full tier gate with upgrade prompt:
<TierGate requiredTier="pro">
  <AdvancedAnalytics />
</TierGate>

// Silent feature gate (just hides):
<FeatureGate feature="export" tier="pro">
  <ExportButton />
</FeatureGate>

// Check tier in code:
import { useCurrentTier, useTierAccess } from '../components/TierGate';

const currentTier = useCurrentTier(); // 'free' | 'pro' | 'team'
const hasProAccess = useTierAccess('pro'); // boolean

if (hasProAccess) {
  // Show Pro features
}
```

### 5. Use Subscription Hook Anywhere

```typescript
import { useSubscription } from '../hooks/useSubscription';

function MyComponent() {
  const { subscription, loading, error, refetch } = useSubscription();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <p>Current Plan: {subscription?.tier}</p>
      <p>Status: {subscription?.status}</p>
      <p>Queries Used: {subscription?.queriesUsed}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

## Component Props Reference

### ConversationalChat
```typescript
<ConversationalChat
  initialQuery="My laptop shows blue screen error"  // Optional: pre-fill query
  onClose={() => setShowChat(false)}               // Optional: close handler
  className="custom-class"                         // Optional: custom styling
/>
```

### TierComparison
```typescript
<TierComparison
  currentTier="pro"                                // Current user's tier
  onUpgrade={(tier) => handleUpgrade(tier)}       // Upgrade button handler
/>
```

### CodeExamplesViewer
```typescript
<CodeExamplesViewer
  examples={[
    {
      language: 'Python',
      code: 'print("Hello")',
      description: 'Simple hello world'
    },
    {
      language: 'JavaScript',
      code: 'console.log("Hello")'
    }
  ]}
/>
```

### FixSuggestionsPanel
```typescript
<FixSuggestionsPanel
  steps={[
    {
      step: 1,
      title: 'Update drivers',
      description: 'Visit manufacturer website and download latest drivers',
      code: 'sudo apt update && sudo apt upgrade'  // Optional
    },
    {
      step: 2,
      title: 'Restart system',
      description: 'Reboot to apply changes'
    }
  ]}
/>
```

### URLScrapingResults
```typescript
<URLScrapingResults
  sources={[
    {
      url: 'https://stackoverflow.com/...',
      title: 'How to fix blue screen error',
      snippet: 'This error occurs when...',
      relevance: 0.95  // 0.0 to 1.0
    }
  ]}
/>
```

### ExportButton
```typescript
<ExportButton
  data={errorAnalysisData}    // Any JSON-serializable data
  filename="my-export"         // Optional, default: 'error-analysis'
  format="json"                // Optional, 'json' or 'csv', default: 'json'
/>
```

## Testing Your Integration

1. **Test Free User**:
   - Should see upgrade prompts
   - Cannot access Pro features
   - Sees tier comparison with "Upgrade" buttons

2. **Test Pro User** (hi@getgingee.com):
   - Can access conversational AI
   - Sees follow-up questions
   - Web scraping works
   - Can export data
   - Sees code examples and fixes

3. **Test Team User**:
   - Has all Pro features
   - Uses Claude Sonnet model
   - Can access team features (when implemented)

## API Response Format

Your backend should return error analysis in this format:

```typescript
{
  error: "Blue screen error",
  explanation: "This error occurs when...",
  
  // Pro features (only if user has Pro/Team):
  codeExamples: [
    {
      language: "Python",
      code: "...",
      description: "..."
    }
  ],
  
  fixSteps: [
    {
      step: 1,
      title: "...",
      description: "...",
      code: "..."  // optional
    }
  ],
  
  webSources: [
    {
      url: "...",
      title: "...",
      snippet: "...",
      relevance: 0.95
    }
  ],
  
  preventionTips: [
    {
      title: "...",
      description: "..."
    }
  ]
}
```

## Deployment Checklist

- [x] All components created
- [x] Committed to Git
- [x] Pushed to GitHub
- [x] Vercel auto-deployment triggered
- [ ] Verify build succeeds on Vercel
- [ ] Test on production URL
- [ ] Verify backend API integration
- [ ] Test with Pro user account

## Need Help?

See full documentation:
- `FRONTEND_TIER_IMPLEMENTATION.md` - Complete implementation details
- Backend repo: `COMPREHENSIVE_FEATURES_IMPLEMENTED.md` - Backend API docs

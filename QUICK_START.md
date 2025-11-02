# Quick Start Guide - Enhanced Live Demo

## What Changed?

Your Live Demo now:
- ✅ Uses **real AI service** (not fake responses)
- ✅ Tracks sessions via **secure cookies** (not just IP)
- ✅ Limits to **3 free demos per 24 hours**
- ✅ Shows **Pro features locked** (code examples, documentation)
- ✅ Prevents spam and abuse
- ✅ Better conversion rates (strategic CTAs)

## Testing the Changes

### 1. Start Backend Server

```powershell
cd C:\Users\panka\Cooey\errorwise-backend
npm start
```

The server should start on **http://localhost:3001** (or your configured port).

### 2. Start Frontend Server

```powershell
cd C:\Users\panka\Cooey\errorwise-frontend
npm run dev
```

The frontend should start on **http://localhost:3000** (or configured port).

### 3. Test the Live Demo

1. **Open Landing Page**: Navigate to http://localhost:3000
2. **Click "Try AI Demo"**: Opens the Live Demo modal
3. **Try Example Question**: Click any example or enter your own
4. **Click "Get Solution"**: See real AI analysis
5. **Check Results**:
   - ✅ Shows explanation and solution
   - ✅ Shows category and confidence score
   - ✅ Shows **locked Pro features** (code examples, documentation)
   - ✅ Shows demo counter: "2 demos remaining"
6. **Try 2 More Demos**: Use different questions
7. **Hit Rate Limit**: After 3rd demo, should see error message
8. **Check Upgrade Prompt**: Should show "Create an account for 25 analyses per day!"

### 4. Run Automated Tests (Optional)

```powershell
cd C:\Users\panka\Cooey\errorwise-backend
node test-demo-api.js
```

This will test:
- ✅ Example questions endpoint
- ✅ First demo (should work)
- ✅ Second demo (remaining: 1)
- ✅ Third demo (remaining: 0)
- ✅ Fourth demo (should fail with 429)
- ✅ Session stats endpoint
- ✅ New session behavior
- ✅ Input validation

## User Flow

### Happy Path (New User):
```
1. User lands on homepage
2. Clicks "Try AI Demo" → Opens modal
3. Clicks example question → Fills textarea
4. Clicks "Get Solution" → Loading spinner
5. Sees AI analysis → Explanation + Solution
6. Sees "PRO" locked features → Code examples blurred
7. Sees "2 demos remaining" → Creates urgency
8. Tries another demo → Same flow
9. After 3rd demo → "Last free demo!" message
10. Tries 4th demo → Rate limit error
11. Clicks "Sign Up" → Redirects to register page
```

### Conversion Points:
- After seeing **locked Pro features** (code examples)
- After using **last demo** (urgency message)
- After hitting **rate limit** (strong CTA)
- **"Sign Up Free"** button on every result

## What Users See

### Demo Result (Free Tier):
```
✅ Explanation of the issue
✅ Step-by-step solution
✅ Category (e.g., "JavaScript", "React")
✅ Confidence score (e.g., 90%)
✅ Demo counter: "2 demos remaining"

🔒 Code Examples (PRO) - Blurred preview
🔒 Documentation (PRO) - Blurred preview

[Unlock Full Analysis - Sign Up Free]  [View Pricing]
```

### Rate Limit Message:
```
❌ Free demo limit reached
You've used all 3 free demos. Create an account for 25 analyses per day!
Resets at 10:30 AM tomorrow

[Create Free Account]  [View Pricing]
```

## Testing Checklist

- [ ] Open landing page
- [ ] Click "Try AI Demo" button
- [ ] See example questions load
- [ ] Click an example (textarea fills)
- [ ] Click "Get Solution" button
- [ ] See loading spinner
- [ ] See AI analysis with explanation + solution
- [ ] See "PRO" locked sections (code, documentation)
- [ ] See demo counter: "2 demos remaining"
- [ ] Try second demo (counter: "1 demo remaining")
- [ ] Try third demo (counter shows "Last free demo!" message)
- [ ] Try fourth demo (should fail with 429 error)
- [ ] See upgrade prompt with signup button
- [ ] Refresh page (cookie should persist, still rate limited)
- [ ] Clear cookies or use incognito (should reset to 3 demos)

## Common Issues

### Issue 1: "Cannot connect to backend"
**Solution:**
- Make sure backend is running: `npm start` in backend folder
- Check it's on http://localhost:3001
- Verify `.env` has `PORT=3001` (or your port)

### Issue 2: "Demo not working" (no AI response)
**Solution:**
- Check backend logs for errors
- Verify `aiService.analyzeError()` is configured
- Check AI service credentials/API keys

### Issue 3: "Rate limit not working"
**Solution:**
- Check cookie-parser middleware in server.js
- Verify cookies are being set (check browser DevTools → Application → Cookies)
- Clear cookies and try again

### Issue 4: "Code examples showing" (should be locked)
**Solution:**
- Check backend response doesn't include `codeExample` field
- Verify `publicDemo.js` is the new version
- Check frontend `DemoResult` interface doesn't expect `codeExample`

### Issue 5: "Counter not updating"
**Solution:**
- Check `demoInfo.message` in response
- Verify session tracking is working (cookies)
- Check `demoSessions` Map in backend

## Backend Logs to Watch

### Successful Demo:
```
📊 Demo request - Session: abc12345... | Remaining: 2
```

### Rate Limit Hit:
```
📊 Demo request - Session: abc12345... | Remaining: 0
(Returns 429 status)
```

### Session Cleanup:
```
🧹 Cleaned up 5 expired demo sessions
```

### Errors:
```
❌ Demo analysis error: [error details]
```

## Configuration

### Backend (.env):
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env):
```env
VITE_API_URL=http://localhost:3001/api
```

## File Locations

### Backend:
- **Main file:** `C:\Users\panka\Cooey\errorwise-backend\src\routes\publicDemo.js`
- **Backup:** `C:\Users\panka\Cooey\errorwise-backend\src\routes\publicDemo.js.backup`
- **Test script:** `C:\Users\panka\Cooey\errorwise-backend\test-demo-api.js`

### Frontend:
- **Modal component:** `C:\Users\panka\Cooey\errorwise-frontend\src\components\LiveDemoModal.tsx`
- **Documentation:** `C:\Users\panka\Cooey\errorwise-frontend\DEMO_IMPROVEMENTS.md`

## Debug Commands

### Check backend is running:
```powershell
curl http://localhost:3001/api/public/demo/examples
```

### Test demo endpoint:
```powershell
curl -X POST http://localhost:3001/api/public/demo/analyze `
  -H "Content-Type: application/json" `
  -d '{"errorMessage":"Test error message for debugging"}'
```

### Check session stats:
```powershell
curl http://localhost:3001/api/public/demo/stats `
  -H "Cookie: demo_session_id=YOUR_SESSION_ID"
```

## Next Steps After Testing

1. ✅ **Verify all tests pass**
2. ✅ **Test from different browsers** (session isolation)
3. ✅ **Test mobile responsiveness**
4. ✅ **Monitor conversion rates** (demos → signups)
5. ⚠️ **Update environment variables** for production
6. ⚠️ **Consider Redis** for persistent sessions (optional)
7. ⚠️ **Add analytics** tracking (Google Analytics, Mixpanel, etc.)
8. ⚠️ **A/B test demo limits** (2 vs 3 vs 5 for best conversion)

## Support

If you encounter issues:
1. Check backend logs for errors
2. Check browser console for frontend errors
3. Verify cookies are being set (DevTools → Application)
4. Run test script: `node test-demo-api.js`
5. Compare with backup: `publicDemo.js.backup`

## Rollback (If Needed)

If something breaks:
```powershell
cd C:\Users\panka\Cooey\errorwise-backend
copy src\routes\publicDemo.js.backup src\routes\publicDemo.js
npm restart
```

This will restore the original version.

---

**Status:** ✅ Ready for Testing
**Last Updated:** Current Session
**Backend Port:** 3001
**Frontend Port:** 3000

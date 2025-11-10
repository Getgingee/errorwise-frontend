# Team Access Control Implementation Plan

## Overview
Team features should only be visible to:
1. Users with **Team subscription** ($8/month)
2. Team members who have been **invited** and accepted

## Implementation Phases

### Phase 1: Development (CURRENT)
- ✅ All team features visible to all authenticated users
- ✅ Build and test all functionality
- ✅ No subscription/invitation checks
- **Status**: Active for development

### Phase 2: Access Control (FUTURE)
- [ ] Add subscription tier checks
- [ ] Implement team invitation system
- [ ] Add permission-based routing
- [ ] Show upgrade prompts for non-Team users

---

## Files Requiring Access Control

### 1. **App.tsx** - Route Protection
**Location**: `/team/*` routes

```typescript
// TODO: Add Team subscription check before allowing access
// Current: All authenticated users can access
// Future: Check if user has Team subscription OR is invited team member

<Route path="/teams" element={
  <ProtectedRoute>
    <TeamSubscriptionCheck> {/* ADD THIS */}
      <TeamDashboard />
    </TeamSubscriptionCheck>
  </ProtectedRoute>
} />

<Route path="/team/analyses" element={
  <ProtectedRoute>
    <TeamSubscriptionCheck> {/* ADD THIS */}
      <TeamAnalyses />
    </TeamSubscriptionCheck>
  </ProtectedRoute>
} />
```

**Required Component**: `TeamSubscriptionCheck.tsx`
- Check user subscription tier (Team plan)
- OR check if user is invited team member
- Show upgrade modal if not authorized
- Redirect to /pricing with message

---

### 2. **Navigation.tsx** - Menu Visibility
**Location**: Navigation menu items

```typescript
// TODO: Only show Team menu items to authorized users
// Current: Shows to all users
// Future: Conditional rendering based on subscription

{user && hasTeamAccess(user) && ( // ADD hasTeamAccess check
  <Link to="/teams">
    <Users className="h-5 w-5" />
    Teams
  </Link>
)}
```

**Required Utility**: `hasTeamAccess(user)`
- Returns `true` if user has Team subscription
- Returns `true` if user is invited team member
- Returns `false` otherwise

---

### 3. **TeamDashboard.tsx** - Create Team Button
**Location**: Create team functionality

```typescript
// TODO: Check subscription before allowing team creation
// Current: All users can create teams
// Future: Only Team subscription holders can create

const handleCreateTeam = async (e: React.FormEvent) => {
  // ADD THIS CHECK
  if (!hasTeamSubscription(user)) {
    toast.error('Team subscription required');
    navigate('/pricing?upgrade=team');
    return;
  }
  
  // ... existing code
};
```

**Required Function**: `hasTeamSubscription(user)`
- Check backend subscription status
- Verify active Team plan
- Handle grace periods

---

### 4. **Backend API Protection**
**Files to protect**:
- `POST /api/teams` - Create team
- `GET /api/teams` - List teams
- `GET /api/teams/analyses` - Team analyses
- `POST /api/teams/:id/video/start` - Start video session

**Middleware Required**:
```javascript
// middleware/teamSubscription.js
const requireTeamSubscription = async (req, res, next) => {
  const user = req.user;
  
  // Check if user has Team subscription
  const hasSubscription = await checkTeamSubscription(user.id);
  
  // OR check if user is invited team member
  const isTeamMember = await checkTeamMembership(user.id, req.params.teamId);
  
  if (!hasSubscription && !isTeamMember) {
    return res.status(403).json({
      error: 'Team subscription required',
      upgradeUrl: '/pricing?plan=team'
    });
  }
  
  next();
};
```

---

## Database Schema Requirements

### Teams Table (Already exists)
```sql
teams (
  id,
  name,
  description,
  owner_id, -- User who created team (must have Team subscription)
  created_at
)
```

### Team Members Table (NEEDS TO BE CREATED)
```sql
team_members (
  id,
  team_id,
  user_id,
  role, -- 'owner', 'admin', 'member'
  invited_by,
  invited_at,
  accepted_at,
  status -- 'pending', 'accepted', 'declined'
)
```

### Invitations Table (NEEDS TO BE CREATED)
```sql
team_invitations (
  id,
  team_id,
  email,
  invited_by,
  token,
  expires_at,
  created_at,
  status -- 'pending', 'accepted', 'expired', 'revoked'
)
```

---

## Access Control Logic

### User Can Access Team Features If:
```typescript
function canAccessTeamFeatures(user: User, team?: Team): boolean {
  // 1. User has active Team subscription
  if (user.subscription?.plan === 'team' && user.subscription?.status === 'active') {
    return true;
  }
  
  // 2. User is owner of the team
  if (team && team.owner_id === user.id) {
    return true;
  }
  
  // 3. User is invited and accepted team member
  if (team && isTeamMember(user.id, team.id)) {
    return true;
  }
  
  return false;
}
```

### Team Member Permissions
```typescript
interface TeamPermissions {
  canCreateTeam: boolean;      // Only Team subscription holders
  canInviteMembers: boolean;   // Owner + Admins
  canViewAnalyses: boolean;    // All team members
  canStartVideo: boolean;      // All team members
  canDeleteTeam: boolean;      // Only owner
  canLeaveTeam: boolean;       // Members (not owner)
}
```

---

## Implementation Steps (When Ready)

### Step 1: Backend
1. Create team_members and team_invitations tables
2. Add team subscription middleware
3. Implement invitation system API
4. Add permission checks to all team routes

### Step 2: Frontend Components
1. Create `TeamSubscriptionCheck` component
2. Create `hasTeamAccess()` utility function
3. Create upgrade prompts/modals
4. Add invitation acceptance flow

### Step 3: UI Updates
1. Conditional navigation menu items
2. Upgrade CTAs on team pages for non-subscribers
3. "Invite Members" button and modal
4. Team member list with roles

### Step 4: Testing
1. Test with Team subscription users
2. Test with invited members
3. Test with non-subscribed users (should see upgrade prompts)
4. Test permission boundaries

---

## Upgrade Prompts

### For Non-Team Users Accessing /teams
```tsx
<div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
  <Users className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
  <h2 className="text-2xl font-bold text-white mb-2">Team Features</h2>
  <p className="text-gray-300 mb-6">
    Unlock team collaboration with video chat, shared error analysis, and more!
  </p>
  <button
    onClick={() => navigate('/pricing?upgrade=team')}
    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg"
  >
    Upgrade to Team Plan - $8/month
  </button>
</div>
```

---

## Current Status

**✅ Development Phase**
- All team features accessible
- No subscription checks
- No invitation system
- Focus on building functionality

**⏳ Waiting for Implementation**
- Access control middleware
- Team invitation system
- Subscription verification
- Permission-based routing

---

## Notes

- Keep current open access during development
- Add TODO comments in code for future implementation
- Document all access points that need protection
- Plan database schema changes
- Design upgrade flow UX

**When all features are complete, we will:**
1. Uncomment access control code
2. Add middleware to backend routes
3. Implement invitation system
4. Test thoroughly with different user types
5. Deploy with proper restrictions


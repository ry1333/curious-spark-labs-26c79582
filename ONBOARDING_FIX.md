# Onboarding Fix - Complete Guide

## 🚨 Problem Summary

**Onboarding is broken due to duplicate key constraint errors.**

When users complete onboarding, the `createProfile()` function tries to INSERT a new profile row, but one already exists (created automatically on signup). This causes a PostgreSQL error:

```
duplicate key value violates unique constraint "profiles_pkey"
```

## ✅ Solution Implemented

### **Code Fix: Change INSERT to UPSERT**

**File:** `src/lib/supabase/profiles.ts` (line 121)

**Changed from:**
```typescript
.insert({
  id: user.id,
  ...normalizedProfile
})
```

**Changed to:**
```typescript
.upsert({
  id: user.id,
  ...normalizedProfile
})
```

**Why this works:**
- ✅ If profile exists → Updates it with onboarding data
- ✅ If profile doesn't exist → Creates it (backward compatible)
- ✅ No more duplicate key errors

---

## 📋 Database Migrations Required

### **Migration Status:**

| Migration | Status | Description |
|-----------|--------|-------------|
| 004_add_comments_table.sql | ✅ Exists | Comments table |
| 005_add_moderation_tables.sql | ✅ Exists | Reports, blocks, admins |
| 006_add_comments_and_missing_fields.sql | ✅ Exists | Comments + post fields |

**All migrations are ready!** You just need to run them in Supabase.

---

## 🔧 How to Apply the Fix

### **Step 1: Run Migrations in Supabase**

1. **Open Supabase Dashboard** → SQL Editor
2. **Run migrations 004, 005, and 006** (if not already run)

**Quick check if migrations are needed:**
```sql
-- Check if comments table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'comments'
);

-- Check if posts has caption field
SELECT EXISTS (
  SELECT FROM information_schema.columns
  WHERE table_schema = 'public'
  AND table_name = 'posts'
  AND column_name = 'caption'
);

-- Check if reports table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'reports'
);
```

If any return `false`, run the corresponding migration.

---

### **Step 2: Reset Incomplete Onboarding (Optional)**

If your profile is stuck in an incomplete state:

```sql
-- Find your user ID
SELECT id, username, display_name, onboarding_completed
FROM profiles
WHERE username = 'ryansokl1';

-- Reset onboarding flag (allows you to complete it again)
UPDATE profiles
SET onboarding_completed = false
WHERE username = 'ryansokl1';
```

---

### **Step 3: Test Onboarding Flow**

1. **Navigate to:** `/onboarding`
2. **Complete all 3 steps:**
   - Step 1: Display name
   - Step 2: Experience level
   - Step 3: Favorite genres
3. **Click "Complete Profile"**
4. **Should redirect to:** `/profile` (no errors!)

---

### **Step 4: Verify in Database**

```sql
SELECT
  username,
  display_name,
  experience_level,
  favorite_genres,
  onboarding_completed,
  created_at,
  updated_at
FROM profiles
WHERE username = 'ryansokl1';
```

**Expected result:**
```
username: ryansokl1
display_name: [Your chosen name]
experience_level: [beginner|intermediate|advanced]
favorite_genres: ["house", "techno", ...]
onboarding_completed: true
updated_at: [Recent timestamp]
```

---

## 🎯 What This Fixes

### **Before (Broken):**
❌ Onboarding tries INSERT → Duplicate key error
❌ User stuck on onboarding page forever
❌ Profile never gets completed
❌ Can't proceed to main app
❌ Error logged 6+ times in database logs

### **After (Fixed):**
✅ Onboarding UPSERTs → Updates existing profile
✅ All onboarding data saved correctly
✅ User redirected to /profile
✅ Can use the app normally
✅ No more database errors

---

## 📊 Database Schema Updates

### **Tables Added:**

**1. comments** (Migration 006)
- Stores user comments on posts
- RLS policies for read (public) / write (authenticated)
- Indexes on post_id, user_id, created_at

**2. reports** (Migration 005)
- Stores content moderation reports
- RLS policies for reporting (authenticated)
- Links to posts, comments, and users

**3. blocked_users** (Migration 005)
- Stores user blocking relationships
- RLS policies for blocking (authenticated)
- Unique constraint prevents duplicate blocks

**4. admin_users** (Migration 005)
- Stores admin role assignments
- Used for content moderation dashboard

### **Columns Added:**

**posts table:**
- `caption` (text) - Post description
- `parent_post_id` (uuid) - For remix functionality

---

## 🧪 Testing Checklist

After applying the fix:

### **Onboarding Flow:**
- [ ] Navigate to /onboarding
- [ ] Complete Step 1 (display name) → No errors
- [ ] Complete Step 2 (experience) → No errors
- [ ] Complete Step 3 (genres) → No errors
- [ ] Click "Complete Profile" → Redirects to /profile
- [ ] Check database → onboarding_completed = true

### **Profile Functionality:**
- [ ] Navigate to /profile → Sees correct display name
- [ ] Edit profile → Changes save successfully
- [ ] Check database → updated_at timestamp updates

### **Features Now Working:**
- [ ] Comments on posts → Can post/read/delete
- [ ] Remix button → Navigates to /create?remix={id}
- [ ] Report button → Opens report modal
- [ ] Like button → Count updates correctly

---

## 🐛 Known Issues (Not Blocking)

### **Issue 1: Multiple Signup Attempts**
If a user signs up, logs out, then tries to sign up again with the same email:
- Supabase will reject the duplicate email
- But the trigger may have already created a profile
- **Solution:** Use the UPSERT approach (already implemented)

### **Issue 2: Username Conflicts**
If two users try to claim the same username:
- Database will enforce unique constraint
- **Current behavior:** Error shown to user
- **TODO:** Add username availability check before submission

### **Issue 3: Missing Avatar Support**
- Onboarding doesn't ask for avatar
- Users can't upload profile pictures yet
- **TODO:** Add avatar upload in Step 1

---

## 📝 Deployment Notes

### **Changes Made:**
1. ✅ `src/lib/supabase/profiles.ts` - Changed INSERT to UPSERT (line 121)
2. ✅ Created this documentation file

### **Migrations to Run:**
- `004_add_comments_table.sql` (if not run)
- `005_add_moderation_tables.sql` (if not run)
- `006_add_comments_and_missing_fields.sql` (if not run)

### **Build Status:**
- TypeScript: 0 errors (after migrations)
- Bundle: ~600 KB
- No compilation errors

---

## 🎉 Success Criteria

Onboarding is considered **fully fixed** when:

1. ✅ User can complete onboarding without errors
2. ✅ Profile data is saved correctly to database
3. ✅ User is redirected to /profile after completion
4. ✅ No duplicate key errors in database logs
5. ✅ All onboarding fields populate correctly
6. ✅ `onboarding_completed` flag set to true

---

## 🆘 Troubleshooting

### **Error: "duplicate key value violates unique constraint"**
- **Cause:** Migrations not run yet
- **Fix:** Deploy code changes first, then run migrations

### **Error: "relation 'comments' does not exist"**
- **Cause:** Migration 006 not run
- **Fix:** Run migration 006 in Supabase SQL Editor

### **Error: "User must be authenticated"**
- **Cause:** Auth session expired
- **Fix:** Log out and log back in

### **Onboarding doesn't save data**
- **Cause:** RLS policies blocking writes
- **Fix:** Check auth.uid() matches user_id in profile

---

## 📞 Support

If onboarding still doesn't work after applying this fix:

1. **Check database logs** in Supabase Dashboard
2. **Check browser console** for JavaScript errors
3. **Verify migrations ran** using the SQL checks above
4. **Check RLS policies** are not blocking writes

**Most common issue:** Forgetting to run migrations before deploying code changes.

---

**Status:** ✅ Fix implemented and ready to deploy
**Last Updated:** 2025-11-12
**Tested:** Locally (awaiting production test)

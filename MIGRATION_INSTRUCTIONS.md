# 🚨 CRITICAL: Database Migration Required

## Why This Is Needed

Your application code expects profile columns that don't exist in the database yet:
- `display_name`
- `location`
- `experience_level`
- `favorite_genres`
- `goals`
- `social_links`
- `updated_at`

**Without this migration, onboarding will fail and users cannot create profiles.**

---

## How to Run the Migration

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project: `yzypyhuabcjdbglywhgv`
3. Click **SQL Editor** in the left sidebar

### Step 2: Create New Query
1. Click the **"+ New Query"** button
2. Give it a name: "Add Missing Profile Columns"

### Step 3: Copy Migration SQL
1. Open the file: `supabase/migrations/003_add_missing_profile_columns.sql`
2. Copy the **entire contents** of that file
3. Paste it into the Supabase SQL Editor

### Step 4: Run Migration
1. Click the **"RUN"** button (or press Cmd+Enter / Ctrl+Enter)
2. Wait for the query to complete
3. You should see: **"Success. No rows returned"**

### Step 5: Verify Migration
Run this query to check the columns were added:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY column_name;
```

You should see all these columns:
- ✅ `avatar_url`
- ✅ `bio`
- ✅ `created_at`
- ✅ `display_name` ← NEW
- ✅ `experience_level` ← NEW
- ✅ `favorite_genres` ← NEW
- ✅ `goals` ← NEW
- ✅ `id`
- ✅ `location` ← NEW
- ✅ `onboarding_completed`
- ✅ `social_links` ← NEW
- ✅ `updated_at` ← NEW
- ✅ `username`

---

## What This Migration Does

1. **Adds Missing Columns:**
   - `display_name` (text) - User's display name
   - `location` (text) - User's location
   - `experience_level` (text) - beginner, intermediate, or pro
   - `favorite_genres` (text[]) - Array of music genres
   - `goals` (text[]) - Array of user goals
   - `social_links` (jsonb) - Social media links
   - `updated_at` (timestamp) - Last update timestamp

2. **Creates Auto-Update Trigger:**
   - Automatically updates `updated_at` timestamp when profile is modified

3. **Backfills Existing Data:**
   - Sets `updated_at` to `created_at` for existing profiles

4. **Adds Indexes:**
   - Index on `experience_level` for filtering
   - GIN index on `favorite_genres` for array queries

---

## After Running Migration

1. **Test Onboarding:**
   - Sign up a new user
   - Complete the onboarding flow
   - Verify profile is created with all fields

2. **Verify Profile Display:**
   - Go to Profile page
   - Check that genres and experience level display correctly

3. **Deploy to Production:**
   - The migration is idempotent (safe to run multiple times)
   - Uses `IF NOT EXISTS` checks to prevent errors

---

## Troubleshooting

### "Column already exists" Error
This is safe to ignore - it means the column was already added. The migration uses `ADD COLUMN IF NOT EXISTS`.

### "Permission denied" Error
Make sure you're logged in as the project owner or have admin access.

### Migration Hangs
Check if there are any locks on the profiles table:
```sql
SELECT * FROM pg_locks WHERE relation = 'profiles'::regclass;
```

---

## Next Steps After Migration

Once the migration is complete, you can:
1. ✅ Test user signup and onboarding
2. ✅ Create test profiles with all fields
3. ✅ Verify DJ Studio works with demo loops
4. ✅ Proceed with MVP testing

---

**Questions?** Check the migration file or reach out for help.

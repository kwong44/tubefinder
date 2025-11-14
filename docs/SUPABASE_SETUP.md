# Supabase Setup Guide

This guide will help you set up Supabase for Tube Finder's Phase 5 features (authentication, favorites, custom spots).

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Fill in project details:
   - Name: `tubefinder` (or your preferred name)
   - Database Password: Generate a strong password (save it!)
   - Region: Choose closest to your users
   - Pricing Plan: Free tier is sufficient to start
4. Wait for project to be created (~2 minutes)

## Step 2: Get API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## Step 3: Configure Environment Variables

1. In your tubefinder project root, create or edit `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

2. Replace the placeholder values with your actual credentials from Step 2
3. **IMPORTANT**: Never commit `.env.local` to git (it's already in .gitignore)

## Step 4: Set Up Database Schema

### Option A: Using Supabase SQL Editor (Recommended)

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the following SQL:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends auth.users)
create table public.users (
  id uuid references auth.users primary key,
  email text unique not null,
  display_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.users enable row level security;

-- Users can read their own data
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

-- Users can update their own data
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Favorite spots table
create table public.favorite_spots (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  spot_id text not null,
  created_at timestamptz default now(),
  unique(user_id, spot_id)
);

-- Enable Row Level Security
alter table public.favorite_spots enable row level security;

-- Users can only see their own favorites
create policy "Users can view own favorites"
  on public.favorite_spots for select
  using (auth.uid() = user_id);

-- Users can insert their own favorites
create policy "Users can insert own favorites"
  on public.favorite_spots for insert
  with check (auth.uid() = user_id);

-- Users can delete their own favorites
create policy "Users can delete own favorites"
  on public.favorite_spots for delete
  using (auth.uid() = user_id);

-- Custom spots table
create table public.custom_spots (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  latitude double precision not null,
  longitude double precision not null,
  type text not null check (type in ('reef', 'beach', 'point', 'unknown')),
  description text,
  facing integer check (facing >= 0 and facing < 360),
  optimal_swell jsonb,
  optimal_wind jsonb,
  is_private boolean default false,
  photos text[],
  rating integer check (rating >= 1 and rating <= 5),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.custom_spots enable row level security;

-- Users can view public spots and their own private spots
create policy "Users can view public spots and own private spots"
  on public.custom_spots for select
  using (not is_private or auth.uid() = user_id);

-- Users can insert their own spots
create policy "Users can insert own spots"
  on public.custom_spots for insert
  with check (auth.uid() = user_id);

-- Users can update their own spots
create policy "Users can update own spots"
  on public.custom_spots for update
  using (auth.uid() = user_id);

-- Users can delete their own spots
create policy "Users can delete own spots"
  on public.custom_spots for delete
  using (auth.uid() = user_id);

-- Function to automatically create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create user profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

4. Click **Run** to execute the SQL
5. Verify the tables were created: Go to **Table Editor** and you should see:
   - `users`
   - `favorite_spots`
   - `custom_spots`

### Option B: Using Migrations (For Production)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Create migration
supabase db migration new initial_schema

# Paste the SQL above into the generated migration file

# Apply migration
supabase db push
```

## Step 5: Configure Authentication Providers

### Email/Password Authentication (Default - Already Enabled)

No additional setup required! Email/password auth is enabled by default.

### Google OAuth (Recommended)

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find "Google" and click to expand
3. Toggle "Enable Sign in with Google" to **ON**
4. You'll need Google OAuth credentials:

#### Get Google OAuth Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen if prompted:
   - User Type: External
   - App Name: Tube Finder
   - User support email: your email
   - Developer contact: your email
6. Create OAuth Client:
   - Application type: Web application
   - Name: Tube Finder
   - Authorized redirect URIs:
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     ```
7. Copy **Client ID** and **Client Secret**
8. Paste them into Supabase Google provider settings
9. Click **Save**

### Magic Link (Passwordless Email)

Already enabled! No additional setup required.

## Step 6: Test Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Click **Sign In** in the header

4. Try different auth methods:
   - **Email + Password**: Create an account
   - **Magic Link**: Enter email, check inbox for link
   - **Google**: Click "Continue with Google" (if configured)

5. After signing in, you should see your profile icon in the header

6. Check Supabase dashboard → **Authentication** → **Users** to see created accounts

## Step 7: Verify Database

1. In Supabase dashboard, go to **Table Editor**
2. Check `public.users` table - you should see your user profile
3. Click around the app to trigger data creation
4. Verify Row Level Security is working (users can only see their own data)

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env.local` values match Supabase dashboard
- Restart your Next.js dev server after changing environment variables

### "User not found in users table"
- Verify the `handle_new_user()` trigger is created
- Check Supabase logs: **Database** → **Logs**

### OAuth redirect errors
- Verify redirect URI in Google Cloud Console matches exactly:
  `https://your-project-ref.supabase.co/auth/v1/callback`
- Check Supabase Auth logs for detailed error messages

### Row Level Security blocking queries
- Check policies are created correctly
- Test queries in Supabase SQL Editor with `auth.uid()` set
- Review RLS policies in **Authentication** → **Policies**

## Security Checklist

✅ Row Level Security enabled on all tables
✅ Environment variables not committed to git
✅ Anon key is public-safe (protected by RLS)
✅ User data isolated by `auth.uid()`
✅ OAuth redirect URIs restricted

## Next Steps

After setup is complete:
- ✅ Authentication is working
- ⏭️ Implement favorite spots UI (next in Phase 5)
- ⏭️ Add custom spot creation
- ⏭️ Integrate buoy and tide data

## Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Integration](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)


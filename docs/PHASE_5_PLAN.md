# Phase 5 Implementation Plan: Data & User Features

## Overview
Phase 5 focuses on user authentication, data persistence, and enhanced surf forecasting data. This phase transforms Tube Finder from a read-only forecast viewer into a personalized surf tracking platform.

## Architecture Decisions

### Database: Supabase
- **Why**: PostgreSQL with PostGIS for geospatial queries, built-in auth, real-time subscriptions, generous free tier
- **Schema**: Users, favorite_spots, custom_spots, spot_ratings, buoy_data
- **Security**: Row Level Security (RLS) policies for user data isolation

### Authentication Strategy
- **Primary**: Email/password with magic links (passwordless)
- **Social**: Google OAuth (most common for outdoor/travel apps)
- **UX**: Non-intrusive - allow browsing without login, prompt only when needed
- **Session**: Persistent with refresh tokens, 7-day expiry

### State Management
- **Auth Store**: Separate Zustand store for user/auth state
- **Data Sync**: React Query for server state, optimistic updates for favorites
- **Offline**: Service Worker caching for PWA support (Phase 5B)

## Feature Priority & Implementation Order

### 5.1 Foundation (Week 1-2)
**Goal**: Establish data persistence and user identity

#### 5.1.1 Supabase Setup ✓
- [ ] Create Supabase project
- [ ] Define database schema
- [ ] Set up Row Level Security policies
- [ ] Configure authentication providers
- [ ] Create database migrations

#### 5.1.2 Authentication System ✓
- [ ] Install @supabase/supabase-js and @supabase/auth-helpers-nextjs
- [ ] Create auth store (Zustand)
- [ ] Implement AuthProvider component
- [ ] Build SignIn/SignUp modal
- [ ] Add Google OAuth button
- [ ] Create user profile creation flow
- [ ] Add sign out functionality

#### 5.1.3 User Profile UI ✓
- [ ] Profile menu in header
- [ ] User avatar/name display
- [ ] Profile settings modal
- [ ] Display name editing
- [ ] Avatar upload (Supabase Storage)
- [ ] Account preferences

### 5.2 Favorite Spots (Week 2)
**Goal**: Allow users to bookmark and track their favorite surf spots

#### UX Design Principles
- **Quick Actions**: One-click favorite/unfavorite from any spot view
- **Visual Feedback**: Heart icon, filled when favorited, subtle animation
- **Persistence**: Instant optimistic updates, synced to database
- **Filtering**: "Show only favorites" toggle in sidebar
- **Organization**: Favorites appear at top of spot list

#### Implementation
- [ ] Add favorite button to SpotCard
- [ ] Add favorite button to SpotMarker popup
- [ ] Create FavoriteButton component with animation
- [ ] Implement useFavorites hook with React Query
- [ ] Add favorites filter toggle to FilterPanel
- [ ] Create "My Favorites" view
- [ ] Display favorite count on profile
- [ ] Sort favorites by recent activity

### 5.3 Custom Spot Creation (Week 3)
**Goal**: Enable users to add their own secret spots

#### UX Design Principles
- **Map-First**: Click on map to place new spot (intuitive)
- **Progressive Disclosure**: Start simple, offer advanced options
- **Validation**: Real-time validation, helpful error messages
- **Preview**: Show how spot will appear before saving
- **Privacy**: Option to keep spot private (visible only to creator)

#### Implementation
- [ ] Add "Add Spot" button to map controls
- [ ] Create AddSpotModal component
- [ ] Implement map click handler for spot placement
- [ ] Build spot creation form (name, type, description)
- [ ] Add optimal conditions selector (swell direction, height, wind)
- [ ] Photo upload for spot (Supabase Storage)
- [ ] Privacy toggle (public/private)
- [ ] Spot preview before save
- [ ] Save to database with user_id
- [ ] Display custom spots on map (different marker style)
- [ ] Edit/delete own spots

### 5.4 NOAA Buoy Data Integration (Week 4)
**Goal**: Display real observed conditions from nearby buoys

#### UX Design Principles
- **Context**: Show buoy data alongside forecasts for validation
- **Proximity**: Display nearest buoy distance
- **Real-time**: Mark observations with timestamp ("15 min ago")
- **Comparison**: Highlight forecast vs. observed differences
- **Conditional Display**: Only show if buoy within reasonable distance (<100km)

#### Data Strategy
- **API**: NOAA NDBC REST API (free, no key required)
- **Caching**: 30-minute cache (buoys update hourly)
- **Selection**: Show 1-3 nearest buoys per spot
- **Fallback**: Graceful degradation if no nearby buoys

#### Implementation
- [ ] Create NOAA buoy service
- [ ] Add buoy station database/lookup
- [ ] Implement nearest buoy calculation (Haversine)
- [ ] Create BuoyData component for display
- [ ] Add to ForecastPopup (new "Observed" tab)
- [ ] Show buoy location on map (optional layer)
- [ ] Display: wave height, period, direction, wind, temp
- [ ] Comparison indicators (forecast vs. observed)

### 5.5 Tide Predictions (Week 4)
**Goal**: Add tide information critical for surf conditions

#### UX Design Principles
- **Visual**: Tide chart with current position indicator
- **Glanceable**: Show current tide state (rising/falling, height)
- **Timeline**: 24-hour tide chart with high/low markers
- **Integration**: Display in forecast popup alongside other data

#### Data Strategy
- **API**: NOAA Tides & Currents API or WorldTides API
- **Caching**: 24-hour cache (tide predictions don't change)
- **Station Selection**: Nearest tide station to spot
- **Calculation**: Tide height at spot estimated from station

#### Implementation
- [ ] Create tide prediction service
- [ ] Add tide station database/lookup
- [ ] Implement TideChart component
- [ ] Add tide state indicator (rising/falling arrows)
- [ ] Display current tide height and next high/low times
- [ ] Integrate into ForecastPopup
- [ ] Optional: Tide-based spot recommendations

## Database Schema

### Users Table
```sql
create table users (
  id uuid references auth.users primary key,
  email text unique not null,
  display_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### Favorite Spots Table
```sql
create table favorite_spots (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade not null,
  spot_id text not null, -- references FAMOUS_SPOTS id or custom spot
  created_at timestamptz default now(),
  unique(user_id, spot_id)
);
```

### Custom Spots Table
```sql
create table custom_spots (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade not null,
  name text not null,
  location geography(point) not null,
  type text not null check (type in ('reef', 'beach', 'point', 'unknown')),
  description text,
  facing integer check (facing >= 0 and facing < 360),
  optimal_swell jsonb, -- {minHeight, maxHeight, direction, minPeriod}
  optimal_wind jsonb,  -- {direction, maxSpeed}
  is_private boolean default false,
  photos text[], -- URLs to Supabase Storage
  rating integer check (rating >= 1 and rating <= 5),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Spatial index for nearby queries
create index custom_spots_location_idx on custom_spots using gist(location);
```

### Spot Ratings Table (Future)
```sql
create table spot_ratings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade not null,
  spot_id text not null,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  session_date date,
  created_at timestamptz default now(),
  unique(user_id, spot_id, session_date)
);
```

## Component Architecture

### New Components
```
app/components/
├── auth/
│   ├── AuthProvider.tsx      # Supabase auth context
│   ├── SignInModal.tsx        # Email + social login
│   ├── UserMenu.tsx           # Profile dropdown
│   └── ProfileModal.tsx       # User settings
├── spots/
│   ├── FavoriteButton.tsx     # Heart icon with animation
│   ├── AddSpotButton.tsx      # Floating action button
│   ├── AddSpotModal.tsx       # Multi-step spot creation
│   ├── CustomSpotMarker.tsx   # Different marker style
│   └── SpotPrivacyToggle.tsx  # Public/private switch
├── data/
│   ├── BuoyDataCard.tsx       # NOAA buoy observations
│   ├── TideChart.tsx          # Visual tide timeline
│   └── DataComparison.tsx     # Forecast vs. observed
└── profile/
    ├── FavoritesList.tsx      # User's favorite spots
    └── MySpots.tsx            # User's custom spots

lib/
├── services/
│   ├── supabase.ts            # Supabase client
│   ├── noaa-buoy.service.ts   # Buoy data fetching
│   └── tide.service.ts        # Tide predictions
├── stores/
│   └── auth-store.ts          # Authentication state
└── hooks/
    ├── useAuth.ts             # Auth helpers
    ├── useFavorites.ts        # Favorites CRUD
    ├── useCustomSpots.ts      # Custom spots CRUD
    ├── useBuoyData.ts         # Buoy data fetching
    └── useTides.ts            # Tide data fetching
```

## UX/UI Best Practices

### Authentication UX
1. **Non-Blocking**: Users can browse without account
2. **Contextual Prompts**: Show sign-in prompt when user tries to favorite
3. **Social First**: Prominent Google button, email as secondary
4. **Magic Links**: Passwordless option for ease of use
5. **Session Persistence**: Remember users across sessions
6. **Clear Status**: Always show auth state (signed in/out)

### Favorites UX
1. **Instant Feedback**: Optimistic updates, animation on click
2. **Undo Option**: Toast notification with undo for mistakes
3. **Bulk Actions**: Select multiple to unfavorite (future)
4. **Smart Sorting**: Favorites sorted by recent conditions
5. **Visual Distinction**: Favorite spots highlighted on map

### Custom Spots UX
1. **Simple Start**: Minimum required fields (name, location)
2. **Smart Defaults**: Suggest optimal conditions based on location
3. **Photo Upload**: Drag-and-drop with preview
4. **Map Integration**: Visual feedback during placement
5. **Validation**: Real-time error messages, helpful hints
6. **Preview**: Show exactly how spot will appear

### Data Display UX
1. **Hierarchy**: Most important data first (current conditions)
2. **Comparison**: Visual diff between forecast and observed
3. **Trustworthiness**: Show data sources, update times
4. **Graceful Degradation**: Handle missing data elegantly
5. **Progressive Enhancement**: Load forecast first, enhance with buoy/tide

## API Rate Limiting & Caching

### NOAA NDBC API
- **Rate Limit**: None officially, but be respectful
- **Cache Strategy**: 30 minutes (buoys update hourly)
- **Batch Requests**: Fetch multiple buoys in parallel
- **Error Handling**: Retry with exponential backoff

### Tide API
- **Rate Limit**: Varies by provider
- **Cache Strategy**: 24 hours (predictions are stable)
- **Preload**: Fetch tide data for visible spots on map load
- **Fallback**: If API fails, show basic rise/fall estimate

### Supabase
- **Rate Limit**: 100 req/sec on free tier (plenty)
- **Realtime**: Limit subscriptions to active views only
- **Storage**: 1GB free, optimize images before upload
- **RLS**: Ensure all queries are user-scoped for security

## Performance Considerations

### Database Queries
- **Indexing**: Spatial indexes for location queries
- **Pagination**: Limit custom spots query to visible map bounds
- **Joins**: Optimize favorites query with proper indexes
- **Caching**: React Query with appropriate stale times

### Image Optimization
- **Upload**: Resize images client-side before upload
- **Storage**: Use Supabase image transformations
- **Lazy Load**: Only load images when visible
- **Format**: WebP with JPEG fallback

### Bundle Size
- **Code Splitting**: Lazy load auth components
- **Tree Shaking**: Import only needed Supabase methods
- **Target**: Keep under 150KB First Load JS

## Security Considerations

### Authentication
- **JWT**: Supabase handles token refresh automatically
- **XSS**: Sanitize all user input (spot names, descriptions)
- **CSRF**: Use Supabase PKCE flow for OAuth
- **Rate Limiting**: Implement on custom API routes

### Data Privacy
- **RLS**: Strict policies - users only see own data
- **Private Spots**: Enforce with database policies
- **Photos**: Validate file types, scan for malware
- **Location**: Don't expose exact coordinates for private spots

### API Keys
- **Environment**: Never commit keys to git
- **Supabase**: Use anon key (public), protect with RLS
- **NOAA**: No key required (public API)
- **Rotation**: Plan for key rotation strategy

## Testing Strategy

### Unit Tests
- Auth store actions
- Favorites hooks
- Buoy/tide data parsing
- Form validation logic

### Integration Tests
- Auth flow (sign in, sign out, session)
- Favorites CRUD operations
- Custom spot creation flow
- Data fetching and caching

### E2E Tests (Playwright)
- Complete user journey: sign up → favorite spot → view
- Custom spot creation with photo upload
- Favorites filtering and display
- Mobile responsiveness

## Rollout Plan

### Phase 5A: Foundation (Week 1-2)
- Supabase setup
- Authentication system
- User profiles
- **Milestone**: Users can sign in and manage profile

### Phase 5B: Core Features (Week 2-3)
- Favorite spots
- Custom spot creation
- **Milestone**: Users can personalize their experience

### Phase 5C: Enhanced Data (Week 4)
- NOAA buoy integration
- Tide predictions
- **Milestone**: Users see comprehensive surf data

### Phase 5D: Polish & Testing (Week 5)
- Performance optimization
- Error handling improvements
- Loading states
- Empty states
- Testing
- **Milestone**: Production-ready release

## Success Metrics

### User Engagement
- % of users who sign up
- Average favorites per user (target: 5+)
- Custom spots created per week
- Return visit rate after favoriting

### Technical Performance
- Auth flow completion rate (target: >80%)
- API response times (target: <500ms p95)
- Error rates (target: <1%)
- Bundle size (target: <150KB)

### User Satisfaction
- Feature usage rates
- Time spent on app (should increase)
- User feedback/surveys

## Future Enhancements (Phase 6+)

### Community Features
- Comments on spots
- Condition reports ("surfed today, was epic")
- Photo sharing
- Spot ratings and reviews

### Notifications
- Email alerts for optimal conditions
- Push notifications (PWA)
- Daily/weekly digest emails
- Threshold-based alerts (>2m waves, offshore wind)

### Advanced Features
- Surf session logging
- Historical condition analysis
- Spot recommendations based on preferences
- Friend system and social features
- Spot check-ins

### Mobile App
- React Native version
- Native push notifications
- Offline-first architecture
- Background location tracking

## Next Steps

1. Create Supabase project and obtain credentials
2. Set up environment variables (.env.local)
3. Install Supabase dependencies
4. Create database schema and migrations
5. Implement auth store and provider
6. Build sign-in modal UI
7. Test authentication flow
8. Proceed to favorites implementation

Let's begin! 🌊

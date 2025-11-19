# Phase 6 Implementation Plan: Community & Alerts

## Overview
Phase 6 focuses on building community features, user engagement, and notification systems to transform TubeFinder from a solo tool into a social surf forecasting platform.

## Features Breakdown

### 6A - Spot Ratings and Reviews (High Priority)
**Goal**: Allow users to rate and review surf spots based on their experiences

**Database Schema**:
- `spot_ratings` table
  - id (UUID)
  - user_id (FK to auth.users)
  - spot_id (TEXT - can be custom or famous spot)
  - rating (INTEGER 1-5)
  - created_at, updated_at
  - UNIQUE constraint on (user_id, spot_id)

- `spot_reviews` table
  - id (UUID)
  - user_id (FK to auth.users)
  - spot_id (TEXT)
  - rating_id (FK to spot_ratings)
  - review_text (TEXT)
  - experience_level (beginner|intermediate|advanced|expert)
  - visited_date (DATE)
  - helpful_count (INTEGER, default 0)
  - created_at, updated_at
  - RLS policies for CRUD

**Components**:
- `RatingStars` - Display and input star ratings
- `ReviewCard` - Display individual review
- `ReviewList` - List of reviews with pagination
- `WriteReviewModal` - Form to submit review
- `RatingSummary` - Aggregate rating display

**Hooks**:
- `useSpotRatings(spotId)` - Fetch ratings for a spot
- `useSpotReviews(spotId)` - Fetch reviews with pagination
- `useSubmitReview()` - Submit rating and review

**Integration Points**:
- SpotCard: Show average rating
- ForecastPopup: Show reviews section
- UserProfile: Show user's reviews

---

### 6B - Community Condition Reports (High Priority)
**Goal**: Users share real-time conditions from the beach

**Database Schema**:
- `condition_reports` table
  - id (UUID)
  - user_id (FK to auth.users)
  - spot_id (TEXT)
  - timestamp (TIMESTAMPTZ)
  - wave_height_observed (DECIMAL)
  - wave_quality (1-5)
  - wind_conditions (offshore|onshore|cross|calm)
  - crowd_level (empty|light|moderate|crowded|packed)
  - water_quality (clean|murky|debris)
  - report_text (TEXT, optional)
  - photos (TEXT[], optional - storage paths)
  - helpful_count (INTEGER)
  - expires_at (TIMESTAMPTZ - auto-calculated, 6 hours from timestamp)
  - RLS policies

**Components**:
- `SubmitReportButton` - Quick access to report
- `ConditionReportModal` - Form to submit report
- `ReportCard` - Display single report
- `RecentReports` - List recent reports
- `ReportSummary` - Aggregate recent reports

**Hooks**:
- `useConditionReports(spotId)` - Fetch recent reports (last 6 hours)
- `useSubmitReport()` - Submit new report

**Integration Points**:
- ForecastPopup: Show recent reports section
- Header: Add "Report Conditions" button
- SpotCard: Show indicator if recent reports exist

**Validation**:
- Reports expire after 6 hours
- Users can submit max 1 report per spot per hour
- Photo uploads limited to 3 per report

---

### 6C - Email/SMS Alerts (Medium Priority)
**Goal**: Notify users when conditions meet their criteria

**Database Schema**:
- `alert_preferences` table
  - id (UUID)
  - user_id (FK to auth.users)
  - spot_id (TEXT)
  - alert_name (TEXT)
  - enabled (BOOLEAN)
  - notification_methods (TEXT[] - email, sms, push)
  - conditions (JSONB):
    - min_score, max_score
    - min_wave_height, max_wave_height
    - preferred_wind_direction
    - time_windows (e.g., "weekends", "mornings")
  - last_triggered_at (TIMESTAMPTZ)
  - cooldown_hours (INTEGER, default 24)
  - created_at, updated_at

- `alert_history` table
  - id (UUID)
  - alert_preference_id (FK)
  - triggered_at (TIMESTAMPTZ)
  - conditions_met (JSONB)
  - notification_sent (BOOLEAN)

**Components**:
- `CreateAlertModal` - Set up new alert
- `AlertCard` - Display/edit single alert
- `AlertsList` - Manage all alerts
- `AlertNotification` - In-app notification component

**Hooks**:
- `useAlerts()` - Fetch user's alerts
- `useCreateAlert()` - Create new alert
- `useUpdateAlert()` - Update alert settings

**Backend/Infrastructure**:
- Supabase Edge Function: `check-alerts`
  - Runs on cron schedule (every 3-6 hours)
  - Checks forecast data against user preferences
  - Triggers notifications via Resend API (email)
- Queue system for sending notifications
- Rate limiting to prevent spam

**Integration Points**:
- SpotCard: Add "Create Alert" button
- ForecastPopup: Quick alert creation
- UserProfile: Manage alerts section
- Header: Alert bell icon with count

---

### 6D - Mobile PWA (Medium Priority)
**Goal**: Enable installation and offline functionality

**Implementation**:
1. **Service Worker** (`public/sw.js`)
   - Cache static assets
   - Cache forecast data with expiration
   - Offline fallback pages
   - Background sync for submissions

2. **Web App Manifest** (`public/manifest.json`)
   - App name, icons, colors
   - Display mode: standalone
   - Start URL, scope
   - Screenshots for install prompt

3. **Install Prompt**
   - Component: `PWAInstallPrompt`
   - Detect installability
   - Show custom install button
   - Track installation events

4. **Push Notifications**
   - Request permission component
   - Subscribe to push service
   - Handle push events in service worker
   - Integrate with alerts system

**Components**:
- `PWAInstallPrompt` - Install app prompt
- `OfflineBanner` - Show when offline
- `UpdateAvailable` - Prompt for app update
- `NotificationPermission` - Request push permission

**Integration Points**:
- Root layout: PWA meta tags
- Header: Install button (when not installed)
- Settings: Notification permissions

---

### 6E - Friend System and Social Features (Lower Priority)
**Goal**: Connect users and share surf experiences

**Database Schema**:
- `friendships` table
  - id (UUID)
  - user_id (FK)
  - friend_id (FK)
  - status (pending|accepted|blocked)
  - created_at
  - UNIQUE constraint on (user_id, friend_id)

- `friend_requests` table
  - id (UUID)
  - from_user_id (FK)
  - to_user_id (FK)
  - message (TEXT, optional)
  - status (pending|accepted|rejected)
  - created_at, responded_at

- `activity_feed` table
  - id (UUID)
  - user_id (FK)
  - activity_type (favorite|review|report|custom_spot)
  - reference_id (UUID - points to specific activity)
  - visibility (public|friends|private)
  - created_at

**Components**:
- `FriendsList` - Display friends
- `FriendRequest` - Send friend request
- `FriendRequestCard` - Accept/reject requests
- `ActivityFeed` - Show friend activities
- `ActivityCard` - Single activity item
- `ShareSpot` - Share spot with friends

**Hooks**:
- `useFriends()` - Fetch user's friends
- `useFriendRequests()` - Pending requests
- `useActivityFeed()` - Friend activities
- `useSendFriendRequest()` - Send request

**Integration Points**:
- UserProfile: Friends list and requests
- Header: Friend requests notification
- SpotCard: Share with friends
- Reviews/Reports: Show friend attribution

---

## Implementation Priority and Timeline

### Sprint 1: Core Community Features (6A + 6B)
**Week 1-2**: Spot Ratings and Reviews
- Database schema and migrations
- Rating and review components
- Integration into UI
- Testing and refinement

**Week 3-4**: Condition Reports
- Database schema and migrations
- Report submission and display
- Photo upload integration
- Validation and expiration logic

### Sprint 2: Engagement and Retention (6C + 6D)
**Week 5-6**: Alerts System
- Database schema
- Alert management UI
- Edge Function development
- Email integration (Resend API)
- Testing notification delivery

**Week 7**: PWA Implementation
- Service worker setup
- Manifest configuration
- Install prompts
- Push notification foundation

### Sprint 3: Social Features (6E) - Optional
**Week 8-9**: Friend System
- Database schema
- Friend request flow
- Activity feed
- Social integration points

---

## Technical Decisions

### Email Service
**Recommendation**: Use Resend (resend.com)
- Free tier: 3,000 emails/month
- Great DX, TypeScript SDK
- High deliverability
- Easy Supabase Edge Function integration

### SMS Service (Future)
**Recommendation**: Twilio
- Pay-as-you-go pricing
- Reliable delivery
- Good documentation

### Push Notifications
**Recommendation**: Web Push API + Firebase Cloud Messaging
- Free for web push
- Works across browsers
- Integrates with service worker

### Background Jobs
**Recommendation**: Supabase Edge Functions with Cron
- Native Supabase integration
- Serverless, scalable
- Can trigger on schedule

---

## Database Considerations

### RLS Policies
All tables need comprehensive RLS:
- Users can read public data
- Users can manage their own data
- Ratings/reviews visible to all
- Reports visible to all (last 6 hours)
- Alerts private to user
- Friends data private

### Indexes
Required indexes:
- `spot_ratings (spot_id, rating)` - for averages
- `spot_reviews (spot_id, created_at DESC)` - for recent reviews
- `condition_reports (spot_id, timestamp DESC)` - for recent reports
- `alert_preferences (user_id, enabled)` - for active alerts
- `friendships (user_id, status)` - for friend lookups

### Data Retention
- Reviews: permanent
- Reports: auto-delete after 7 days
- Alert history: keep 30 days
- Activity feed: keep 90 days

---

## Security Considerations

1. **Rate Limiting**
   - Max 5 reviews per user per day
   - Max 1 condition report per spot per hour per user
   - Max 10 friend requests per day
   - Email alerts max 1 per spot per 24 hours

2. **Validation**
   - Sanitize all user input
   - Validate ratings (1-5)
   - Validate report data ranges
   - Verify photo uploads (size, type)

3. **Spam Prevention**
   - Require email verification for alerts
   - "Helpful" vote limits
   - Report/flag inappropriate content
   - Admin moderation tools (future)

---

## Performance Optimizations

1. **Caching Strategy**
   - Cache aggregate ratings (refresh on new rating)
   - Cache recent reports (5-minute stale time)
   - Cache friend lists (30-minute stale time)
   - Service worker caches for offline

2. **Pagination**
   - Reviews: 10 per page
   - Reports: 20 per page (last 6 hours usually few)
   - Activity feed: 20 per page
   - Infinite scroll for better UX

3. **Image Optimization**
   - Compress photos on upload
   - Generate thumbnails
   - Lazy load images
   - Use Supabase Storage transformations

---

## Testing Strategy

### Unit Tests
- Rating calculations
- Report validation
- Alert condition matching
- Date/time utilities

### Integration Tests
- Review submission flow
- Report submission flow
- Alert triggering logic
- Friend request flow

### E2E Tests
- Complete review workflow
- Alert creation and triggering
- PWA installation
- Offline functionality

---

## Deployment Considerations

1. **Migrations**
   - Run in order: 6A → 6B → 6C → 6E
   - 6D has no migrations (PWA is frontend)
   - Test on staging first

2. **Edge Functions**
   - Deploy `check-alerts` function
   - Set up cron triggers
   - Monitor execution logs
   - Set up error alerting

3. **Environment Variables**
   - RESEND_API_KEY
   - TWILIO credentials (future)
   - FCM keys (for push)
   - Alert cron schedule

---

## Success Metrics

### Engagement
- % of users who submit reviews
- % of users who submit reports
- Average reports per active spot
- Review helpfulness rating

### Retention
- % of users with active alerts
- Alert open rate
- PWA install rate
- Return visit rate

### Community
- Number of friend connections
- Activity feed engagement
- Social shares

---

## Open Questions for Discussion

1. **Moderation**: Do we need content moderation for reviews/reports? Start with user reporting?
2. **Gamification**: Should we add badges, levels, or reputation scores for contributions?
3. **Privacy**: Should reports be anonymous or always attributed?
4. **Premium Features**: Should some alerts/features be premium-only?
5. **API Rate Limits**: What limits for NOAA data refreshes with alerts running?

---

## Next Steps

Once we agree on this plan, we'll implement in this order:
1. **Phase 6A**: Spot Ratings and Reviews (most valuable, easiest)
2. **Phase 6B**: Condition Reports (builds on 6A patterns)
3. **Phase 6D**: PWA Setup (no backend, can do in parallel)
4. **Phase 6C**: Alerts System (requires Edge Functions)
5. **Phase 6E**: Social Features (nice-to-have, complex)

Ready to begin with Phase 6A?

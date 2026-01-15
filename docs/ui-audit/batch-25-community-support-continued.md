# Batch 25: Community Support Continued

## Overview
- **Screens Covered**: 120-124
- **Features**: Community Support Screens 2-6
- **Status**: Complete

---

## Screen 120: CommunityFeed

### 1. Purpose
Main community feed showing user posts, engagement metrics, and browsing filters for community content discovery.

### 2. UI Structure (Visual Only)
```
[StatusBar]
[Header]
  ├── [BackButton]
  └── [UserProfileBadge]
      ├── [Avatar]
      ├── [Username: "Shinomiya Kaguya ✓"]
      ├── [PostCount: "25 Total Posts"]
      └── [Rating: "⭐ 87%"]

[BrowseBySection]
  ├── [Label: "Browse By"]
  └── [FilterPillsRow - Horizontal scroll]
      ├── [Pill: 🔥 Trending]
      ├── [Pill: Stress]
      ├── [Pill: Suicide]
      └── [Pill: A... (truncated)]

[PostFeed - ScrollView]
  ├── [PostCard 1]
  │   ├── [AuthorRow]
  │   │   ├── [Avatar]
  │   │   ├── [Username: "Makima D. Smith"]
  │   │   ├── [Badge: "Basic"]
  │   │   └── [Timestamp: "1m ago"]
  │   ├── [PostText - with hashtags]
  │   ├── [PostImage - Buddha statue]
  │   └── [EngagementRow]
  │       ├── [ViewCount: 1.2M]
  │       ├── [LikeCount: 241]
  │       └── [ShareButton]
  │
  ├── [PostCard 2]
  │   ├── [AuthorRow]
  │   ├── [PostText - AI testimonial]
  │   └── [EngagementRow: 700K, 124]
  │
  └── [PostCard 3 - Partial]

[FloatingActionButton - Plus icon]
```

### 3. Component List
| Component | Description | Reusable? |
|-----------|-------------|-----------|
| CommunityHeader | User profile summary | Feature |
| UserProfileBadge | Avatar, name, stats row | Yes |
| VerifiedBadge | Checkmark for verified users | Yes |
| PostCountLabel | "X Total Posts" display | Feature |
| RatingLabel | Star with percentage | Yes |
| BrowseBySection | Filter header and pills | Feature |
| FilterPill | Selectable category pill | Yes |
| PostCard | Full community post container | Feature |
| PostAuthorRow | Avatar, name, badge, time | Feature |
| UserBadge | "Basic", "Pro", etc. | Yes |
| TimestampLabel | Relative time display | Yes |
| PostText | Post content with hashtag links | Feature |
| HashtagLink | Clickable hashtag | Yes |
| PostImage | Attached image display | Yes |
| EngagementRow | Views, likes, share | Feature |
| ViewCount | Eye icon with number | Yes |
| LikeCount | Heart icon with number | Yes |
| ShareButton | Share icon button | Yes |
| FloatingActionButton | Add post FAB | Yes |

### 4. Responsibility Split
| UI Layer | Logic Layer |
|----------|-------------|
| Render post cards | Fetch paginated feed |
| Display user header | Get current user profile |
| Show filter pills | Handle filter selection |
| Render images | Cache post images |
| Display engagement | Track engagement metrics |
| Handle scroll | Load more posts |
| Handle FAB tap | Navigate to post creation |
| Render hashtags | Parse and link hashtags |

### 5. State Definition
```typescript
interface CommunityFeedState {
  // Current user
  currentUser: CommunityUser;

  // Feed
  posts: CommunityPost[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;

  // Filters
  selectedFilter: string | null;
  availableFilters: FilterCategory[];

  // UI
  error: string | null;
}

interface CommunityUser {
  id: string;
  username: string;
  avatar: string;
  isVerified: boolean;
  totalPosts: number;
  rating: number;
  membershipTier: 'basic' | 'pro' | 'premium';
}
```

### 6. Data Models
```typescript
interface CommunityPost {
  id: string;
  author: PostAuthor;
  content: string;
  hashtags: string[];
  images: string[];
  category: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  createdAt: Date;
  isLiked: boolean;
  isPrivate: boolean;
}

interface PostAuthor {
  id: string;
  username: string;
  avatar: string;
  badge: 'basic' | 'pro' | 'premium';
  isVerified: boolean;
}

type FilterCategory =
  | 'trending'
  | 'stress'
  | 'suicide'
  | 'anxiety'
  | 'support'
  | 'creative'
  | 'therapy';
```

### 7. Navigation
- **From**: Screen 119 (CommunityWelcome), Tab Navigation
- **To**:
  - FAB → Screen 121 (NewPostCategorySelector)
  - Post card → PostDetail
  - User avatar → UserProfile
  - Hashtag → FilteredFeed
  - Filter pill → Filtered results

### 8. UI States & Edge Cases
| State | Visual Treatment |
|-------|------------------|
| Loading | Skeleton post cards |
| Empty Feed | "No posts yet" message |
| Filter Active | Highlighted pill, filtered results |
| Load More | Bottom loading indicator |
| Network Error | Error message with retry |
| Post Deleted | Remove from feed |
| New Posts | Pull to refresh |
| Offline | Cached posts only |

### 9. Implementation Breakdown
1. **Phase 1**: Header and filters
   - Create user profile badge
   - Implement filter pills row
   - Handle filter selection
2. **Phase 2**: Post cards
   - Create post card component
   - Add author row with badges
   - Implement engagement row
3. **Phase 3**: Images and media
   - Handle image loading
   - Implement image gallery
   - Add placeholder on load
4. **Phase 4**: Interactions
   - Like/unlike posts
   - Share functionality
   - Navigate to post detail
5. **Phase 5**: Pagination
   - Implement infinite scroll
   - Add loading indicators
   - Handle end of feed

### 10. Open Issues
- [ ] **REVIEW**: "Suicide" as a browsing category - needs clinical review for appropriateness
- [ ] Placeholder usernames appear to be anime characters (Shinomiya Kaguya, Makima)
- [ ] What does the 87% rating represent?
- [ ] How does "Basic" badge differ from other tiers?
- [ ] Is there post moderation/reporting?
- [ ] How do hashtags work - are they predefined or user-created?

---

## Screen 121: NewPostCategorySelector

### 1. Purpose
First step of post creation flow allowing users to select a category for their community post.

### 2. UI Structure (Visual Only)
```
[StatusBar]
[Header]
  ├── [BackButton]
  └── [Badge: "Community Post"]

[TitleSection]
  ├── [Title: "Add New Post"]
  └── [Subtitle: "Select post category"]

[CategoryGrid - 3x3]
  ├── [Row 1]
  │   ├── [CategoryCard: Self Care - head icon]
  │   ├── [CategoryCard: Mindfulness - bell icon]
  │   └── [CategoryCard: Stories - clock icon]
  ├── [Row 2]
  │   ├── [CategoryCard: Support - hands icon]
  │   ├── [CategoryCard: Creative - V icon] ← Selected
  │   └── [CategoryCard: Therapy - target icon]
  └── [Row 3]
      ├── [CategoryCard: Stress - pillow icon]
      ├── [CategoryCard: Affirmation - wave icon]
      └── [CategoryCard: Awareness - dice icon]

[ContinueButton: "Continue →"]
```

### 3. Component List
| Component | Description | Reusable? |
|-----------|-------------|-----------|
| StepHeader | Back button with badge | Yes |
| CommunityPostBadge | "Community Post" indicator | Feature |
| SectionTitle | "Add New Post" heading | Feature |
| SectionSubtitle | Instruction text | Yes |
| CategoryGrid | 3x3 grid container | Feature |
| CategoryCard | Selectable category option | Yes |
| CategoryIcon | Category-specific icon | Yes |
| CategoryLabel | Category name text | Yes |
| SelectedIndicator | Highlight for selected card | Yes |
| ContinueButton | Primary navigation button | Yes |

### 4. Responsibility Split
| UI Layer | Logic Layer |
|----------|-------------|
| Render category grid | Load available categories |
| Show selection state | Store selected category |
| Handle card tap | Validate selection |
| Display icons | N/A - static assets |
| Continue button | Navigate with selection |
| Back navigation | Cancel post creation |

### 5. State Definition
```typescript
interface NewPostCategoryState {
  categories: PostCategory[];
  selectedCategory: string | null;
  isValid: boolean;
}

interface PostCategory {
  id: string;
  name: string;
  icon: string;
  description?: string;
  isEnabled: boolean;
}
```

### 6. Data Models
```typescript
const POST_CATEGORIES: PostCategory[] = [
  { id: 'self_care', name: 'Self Care', icon: 'head' },
  { id: 'mindfulness', name: 'Mindfulness', icon: 'bell' },
  { id: 'stories', name: 'Stories', icon: 'clock' },
  { id: 'support', name: 'Support', icon: 'hands' },
  { id: 'creative', name: 'Creative', icon: 'creative' },
  { id: 'therapy', name: 'Therapy', icon: 'target' },
  { id: 'stress', name: 'Stress', icon: 'pillow' },
  { id: 'affirmation', name: 'Affirmation', icon: 'wave' },
  { id: 'awareness', name: 'Awareness', icon: 'dice' }
];

interface PostDraft {
  category: string;
  content?: string;
  images?: string[];
  postType?: PostType;
  metrics?: MetricType[];
  isPrivate?: boolean;
}
```

### 7. Navigation
- **From**: Screen 120 (CommunityFeed - FAB tap)
- **To**:
  - "Continue" → Screen 122 (NewPostComposer)
  - Back → CommunityFeed

### 8. UI States & Edge Cases
| State | Visual Treatment |
|-------|------------------|
| No Selection | Continue button disabled |
| Category Selected | Highlighted card, enabled button |
| Category Unavailable | Grayed out card |
| Loading | Skeleton cards |
| Error | Error message |

### 9. Implementation Breakdown
1. **Phase 1**: Layout
   - Create grid container
   - Implement category card component
   - Add selection state styling
2. **Phase 2**: Selection logic
   - Single selection behavior
   - Store selection in state
   - Enable/disable continue button
3. **Phase 3**: Navigation
   - Pass selection to next screen
   - Handle back navigation
   - Clear selection on back

### 10. Open Issues
- [ ] Can users post without selecting a category?
- [ ] Are categories customizable or fixed?
- [ ] What does each icon represent? (Some are unclear)
- [ ] Is there category-specific content guidance?

---

## Screen 122: NewPostComposer

### 1. Purpose
Main post composition screen where users write content, select post type, add metrics, and control visibility before publishing.

### 2. UI Structure (Visual Only)
```
[StatusBar]
[Header]
  ├── [BackButton]
  └── [Badge: "Community Post"]

[PostContentSection]
  ├── [SectionTitle: "Post Content"]
  ├── [SettingsIcon]
  └── [ComposerCard]
      ├── [UserRow]
      │   ├── [Avatar]
      │   ├── [Username: "Shinomiya Kaguya ✓"]
      │   ├── [PostCount: "25 Total Posts"]
      │   └── [Rating: "⭐ 87%"]
      ├── [TextInput - Multiline]
      │   └── [Placeholder text with content]
      ├── [CharacterCounter: "215/300"]
      └── [InputToolbar]
          ├── [CameraIcon]
          ├── [MicIcon]
          └── [EmojiIcon]

[PostTypeSection]
  ├── [SectionHeader: "Post Type" + "See All"]
  └── [TypeSelector]
      ├── [TypePill: Story ○]
      ├── [TypePill: Regular ◉] ← Selected (green)
      └── [TypePill: Reel ○]

[AddMetricsSection]
  ├── [SectionHeader: "Add Metrics" + SettingsIcon]
  └── [MetricsRow]
      ├── [MetricIcon: Chart]
      ├── [MetricIcon: Heart] ← Selected (orange)
      ├── [MetricIcon: Droplet]
      └── [MetricIcon: Puzzle]

[PrivacySection]
  ├── [Label: "Hide from Community?"]
  ├── [Description: "This post will be private."]
  └── [Toggle - Enabled]

[ActionButtons]
  ├── [SaveDraftButton: "Save As Draft ✓"]
  └── [PostButton: "Post →"]
```

### 3. Component List
| Component | Description | Reusable? |
|-----------|-------------|-----------|
| PostContentHeader | Section title with settings | Feature |
| ComposerCard | Main input container | Feature |
| UserInfoRow | Author preview | Yes |
| MultilineTextInput | Post content input | Yes |
| CharacterCounter | Character limit display | Yes |
| InputToolbar | Media attachment buttons | Yes |
| CameraButton | Add photo option | Yes |
| MicButton | Add voice option | Yes |
| EmojiButton | Add emoji option | Yes |
| SectionHeader | Label with action link | Yes |
| PostTypePill | Story/Regular/Reel selector | Feature |
| MetricIcon | Selectable metric type | Feature |
| PrivacyToggle | Hide from community switch | Feature |
| SaveDraftButton | Secondary action | Yes |
| PostButton | Primary submit button | Yes |

### 4. Responsibility Split
| UI Layer | Logic Layer |
|----------|-------------|
| Render text input | Track content state |
| Show character count | Validate character limit |
| Display user info | Get current user |
| Render type pills | Store post type |
| Show metric icons | Track selected metrics |
| Toggle privacy | Update visibility flag |
| Handle toolbar taps | Open media picker/keyboard |
| Button press feedback | Submit/save post |

### 5. State Definition
```typescript
interface NewPostComposerState {
  // Content
  content: string;
  characterCount: number;
  maxCharacters: number;

  // Media
  attachedImages: string[];
  attachedVoice: string | null;

  // Settings
  postType: PostType;
  selectedMetrics: MetricType[];
  isPrivate: boolean;

  // UI
  isSubmitting: boolean;
  isSavingDraft: boolean;
  error: string | null;
}

type PostType = 'story' | 'regular' | 'reel';
type MetricType = 'chart' | 'heart' | 'water' | 'activity';
```

### 6. Data Models
```typescript
interface PostSubmission {
  category: string;
  content: string;
  postType: PostType;
  metrics: MetricType[];
  images: string[];
  voiceNote?: string;
  isPrivate: boolean;
}

interface PostDraft extends PostSubmission {
  draftId: string;
  savedAt: Date;
  category: string;
}

interface PostTypeOption {
  type: PostType;
  label: string;
  description: string;
  maxDuration?: number; // For reels
}

const POST_TYPES: PostTypeOption[] = [
  { type: 'story', label: 'Story', description: 'Disappears in 24h' },
  { type: 'regular', label: 'Regular', description: 'Standard post' },
  { type: 'reel', label: 'Reel', description: 'Short video', maxDuration: 60 }
];
```

### 7. Navigation
- **From**: Screen 121 (NewPostCategorySelector)
- **To**:
  - "Post" → Screen 123 (PostSuccessModal)
  - "Save As Draft" → CommunityFeed (with toast)
  - Back → NewPostCategorySelector or discard dialog
  - Camera → ImagePicker
  - Mic → VoiceRecorder

### 8. UI States & Edge Cases
| State | Visual Treatment |
|-------|------------------|
| Empty Content | Post button disabled |
| Valid Content | Post button enabled |
| At Character Limit | Counter turns red |
| Over Limit | Counter red, trim required |
| Submitting | Button shows loading |
| Draft Saving | Draft button loading |
| Image Attached | Preview thumbnails |
| Voice Attached | Voice indicator |
| Private Mode | Toggle green, description shown |

### 9. Implementation Breakdown
1. **Phase 1**: Content input
   - Create multiline input
   - Implement character counter
   - Add user info display
2. **Phase 2**: Media toolbar
   - Camera integration
   - Voice recording
   - Emoji picker
3. **Phase 3**: Post options
   - Post type selector
   - Metrics selector
   - Privacy toggle
4. **Phase 4**: Submission
   - Validate content
   - Submit to API
   - Handle success/error
5. **Phase 5**: Draft support
   - Save draft locally
   - Load draft on return
   - Clear draft on success

### 10. Open Issues
- [ ] What do the "Add Metrics" icons represent?
- [ ] What's the difference between Story, Regular, and Reel?
- [ ] Can private posts be seen by anyone?
- [ ] What happens when over character limit?
- [ ] Is there image size/count limit?
- [ ] Can voice notes be attached to all post types?

---

## Screen 123: PostSuccessModal

### 1. Purpose
Success confirmation modal displayed after successfully publishing a community post.

### 2. UI Structure (Visual Only)
```
[OverlayBackground - Semi-transparent]
[BackgroundScreen - NewPostComposer faded]

[SuccessModal]
  ├── [IllustrationContainer]
  │   └── [HappyWomanIllustration]
  ├── [Title: "Post Successful!"]
  ├── [Message: "You have successfully posted a post.
  │            Let's see it now! 🙌"]
  └── [ViewPostButton: "See My Post →"]

[CloseButton - X at bottom]
```

### 3. Component List
| Component | Description | Reusable? |
|-----------|-------------|-----------|
| ModalOverlay | Dark backdrop | Yes |
| SuccessModal | Modal container | Yes |
| SuccessIllustration | Celebration artwork | Feature |
| SuccessTitle | "Post Successful!" heading | Feature |
| SuccessMessage | Confirmation text with emoji | Feature |
| ViewPostButton | CTA to see published post | Feature |
| ModalCloseButton | X button to dismiss | Yes |

### 4. Responsibility Split
| UI Layer | Logic Layer |
|----------|-------------|
| Display modal | Store published post ID |
| Show illustration | Clear draft if exists |
| Render message | Refresh feed cache |
| Handle button tap | Navigate to post |
| Close button | Dismiss modal |
| Animate entrance | N/A |

### 5. State Definition
```typescript
interface PostSuccessModalState {
  isVisible: boolean;
  publishedPostId: string;
  isNavigating: boolean;
}
```

### 6. Data Models
```typescript
interface PublishResult {
  success: boolean;
  postId: string;
  postUrl: string;
  freudScoreEarned?: number;
}
```

### 7. Navigation
- **From**: Screen 122 (NewPostComposer - on success)
- **To**:
  - "See My Post" → PostDetail (new post)
  - Close (X) → CommunityFeed

### 8. UI States & Edge Cases
| State | Visual Treatment |
|-------|------------------|
| Success | Full modal display |
| Navigating | Button loading state |
| Error (rare) | Fallback to feed |

### 9. Implementation Breakdown
1. **Phase 1**: Modal structure
   - Create overlay and container
   - Add slide-up animation
   - Implement close button
2. **Phase 2**: Content
   - Add illustration asset
   - Style success message
   - Create CTA button
3. **Phase 3**: Navigation
   - Navigate to post detail
   - Clear composer state
   - Refresh community feed

### 10. Open Issues
- [ ] Grammar: "posted a post" is redundant - should be "published your post" or "shared your post"
- [ ] Do users earn Freud Score for posting?
- [ ] Is there a cooldown between posts?
- [ ] Can users undo/delete immediately after posting?

---

## Screen 124: CommunityNotifications

### 1. Purpose
Notification center for community-related activities including follows, messages, comments, and mentions.

### 2. UI Structure (Visual Only)
```
[StatusBar]
[Header]
  ├── [BackButton]
  └── [Title: "Community Notification"]

[TimeFilterTabs]
  ├── [Tab: Today]
  └── [Tab: Last Week] ← Selected

[NotificationsList]
  ├── [SectionHeader: "Earlier This Day" + OptionsMenu]
  │   ├── [NotificationRow - New Followers]
  │   │   ├── [GreenAvatar]
  │   │   ├── [Title: "You have new followers!"]
  │   │   └── [Subtitle: "Akari M just followed you."]
  │   ├── [NotificationRow - Unread Messages]
  │   │   ├── [OrangeAvatar]
  │   │   ├── [Title: "You have unread messages!"]
  │   │   └── [Subtitle: "52 Total Unread Messages."]
  │   ├── [NotificationRow - Comment]
  │   │   ├── [YellowAvatar]
  │   │   ├── [Title: "Someone commented!"]
  │   │   └── [Subtitle: "Dr. Hikari commented on your post."]
  │   ├── [NotificationRow - New Video]
  │   │   ├── [BlueAvatar]
  │   │   ├── [Title: "Someone posted new video!"]
  │   │   └── [Subtitle: "Joe Biden just posted a video."]
  │   └── [NotificationRow - Mention]
  │       ├── [PurpleAvatar]
  │       ├── [Title: "Someone mentioned you!"]
  │       └── [Subtitle: "Makima S just mentioned you."]
  │
  └── [SectionHeader: "Last Week" + OptionsMenu]
      ├── [NotificationRow - New Video]
      │   └── [Subtitle: "John Cena just posted a video."]
      └── [NotificationRow - Mention]
          └── [Subtitle: "Akari M just mentioned you."]
```

### 3. Component List
| Component | Description | Reusable? |
|-----------|-------------|-----------|
| NotificationHeader | Title with back button | Feature |
| TimeFilterTabs | Today/Last Week toggle | Feature |
| TimeTab | Individual tab button | Yes |
| NotificationSection | Time-grouped section | Feature |
| SectionHeaderWithMenu | Label with options | Yes |
| NotificationRow | Individual notification item | Feature |
| NotificationAvatar | Colored circle avatar | Yes |
| NotificationTitle | Bold notification type | Feature |
| NotificationSubtitle | Detail text | Feature |
| OptionsMenuButton | Three-dot menu | Yes |

### 4. Responsibility Split
| UI Layer | Logic Layer |
|----------|-------------|
| Render notification list | Fetch notifications by time |
| Display time tabs | Handle tab selection |
| Show avatars | Determine avatar color by type |
| Display notification text | Format notification content |
| Handle row tap | Navigate to relevant content |
| Handle options menu | Mark as read, delete, etc. |

### 5. State Definition
```typescript
interface CommunityNotificationsState {
  // Filters
  selectedTimeFilter: 'today' | 'last_week';

  // Notifications
  todayNotifications: CommunityNotification[];
  lastWeekNotifications: CommunityNotification[];

  // UI
  isLoading: boolean;
  error: string | null;
  unreadCount: number;
}

interface CommunityNotification {
  id: string;
  type: NotificationType;
  title: string;
  subtitle: string;
  actorName: string;
  actorAvatar?: string;
  timestamp: Date;
  isRead: boolean;
  targetId?: string; // Post, user, or message ID
}
```

### 6. Data Models
```typescript
type NotificationType =
  | 'new_follower'
  | 'unread_messages'
  | 'comment'
  | 'new_video'
  | 'mention'
  | 'like'
  | 'share';

interface NotificationConfig {
  type: NotificationType;
  titleTemplate: string;
  subtitleTemplate: string;
  avatarColor: string;
  icon: string;
}

const NOTIFICATION_CONFIGS: Record<NotificationType, NotificationConfig> = {
  new_follower: {
    type: 'new_follower',
    titleTemplate: 'You have new followers!',
    subtitleTemplate: '{actor} just followed you.',
    avatarColor: '#9AAD5C',
    icon: 'person-add'
  },
  unread_messages: {
    type: 'unread_messages',
    titleTemplate: 'You have unread messages!',
    subtitleTemplate: '{count} Total Unread Messages.',
    avatarColor: '#E8853A',
    icon: 'mail'
  },
  comment: {
    type: 'comment',
    titleTemplate: 'Someone commented!',
    subtitleTemplate: '{actor} commented on your post.',
    avatarColor: '#F4D03F',
    icon: 'comment'
  },
  new_video: {
    type: 'new_video',
    titleTemplate: 'Someone posted new video!',
    subtitleTemplate: '{actor} just posted a video.',
    avatarColor: '#3498DB',
    icon: 'video'
  },
  mention: {
    type: 'mention',
    titleTemplate: 'Someone mentioned you!',
    subtitleTemplate: '{actor} just mentioned you.',
    avatarColor: '#7B68B5',
    icon: 'at'
  }
};
```

### 7. Navigation
- **From**: CommunityFeed (notification bell), Tab Navigation
- **To**:
  - Back → CommunityFeed
  - Follower notification → UserProfile
  - Message notification → Messages
  - Comment notification → PostDetail
  - Video notification → PostDetail (video)
  - Mention notification → PostDetail

### 8. UI States & Edge Cases
| State | Visual Treatment |
|-------|------------------|
| Loading | Skeleton rows |
| Empty Today | "No notifications today" |
| Empty Last Week | "No notifications this week" |
| All Read | No unread indicators |
| New Unread | Unread badge on tab |
| Network Error | Error with retry |
| Marked as Read | Row styling changes |

### 9. Implementation Breakdown
1. **Phase 1**: Layout structure
   - Create notification list
   - Implement time filter tabs
   - Add section headers
2. **Phase 2**: Notification rows
   - Create notification row component
   - Implement avatar coloring
   - Style title and subtitle
3. **Phase 3**: Interactions
   - Handle row tap navigation
   - Implement options menu
   - Mark as read functionality
4. **Phase 4**: Data integration
   - Fetch notifications API
   - Handle real-time updates
   - Implement unread counting

### 10. Open Issues
- [ ] **MEDIUM**: "Joe Biden" and "John Cena" as placeholder usernames - should use fictional names
- [ ] What does the options menu (three dots) contain?
- [ ] Is there mark all as read?
- [ ] Are notifications pushed in real-time?
- [ ] How far back does "Last Week" go?
- [ ] Is there notification preferences/settings?

---

## Cross-Screen Patterns (Batch 25)

### Post Creation Flow
```
Screen 120 → Screen 121 → Screen 122 → Screen 123 → Screen 120
Feed → Category → Composer → Success → Feed (with new post)
```

### Community Navigation Pattern
```
                    ┌─→ Screen 124 (Notifications)
Screen 120 (Feed) ──┤
                    └─→ Screen 121 (New Post flow)
```

### Shared Components
1. **UserProfileBadge** - Used in feed and composer
2. **FilterPill** - Category and browse filters
3. **PostCard** - Consistent post display
4. **SuccessModal** - Same pattern as course completion
5. **ToggleSwitch** - Privacy toggle

### Notification Color System
| Type | Avatar Color |
|------|--------------|
| Follower | Green (#9AAD5C) |
| Messages | Orange (#E8853A) |
| Comment | Yellow (#F4D03F) |
| Video | Blue (#3498DB) |
| Mention | Purple (#7B68B5) |

---

## Issues Identified (Batch 25)

### Medium Priority

**Issue #22: "Suicide" as Browse Category**
- **Screen**: 120 (CommunityFeed)
- **Problem**: "Suicide" appears as a browsable category in community feed
- **Risk**: May need clinical review - could be triggering or inappropriate for community browsing
- **Note**: Could be appropriate for support-seeking, but presentation needs review

**Issue #23: Real Person Names as Placeholders**
- **Screen**: 124 (CommunityNotifications)
- **Problem**: "Joe Biden" and "John Cena" used as placeholder usernames
- **Risk**: Should use fictional names to avoid any association issues
- **Resolution**: Replace with generic usernames

**Issue #24: Anime Character Names as Users**
- **Screens**: 120, 122 (CommunityFeed, NewPostComposer)
- **Problem**: "Shinomiya Kaguya" and "Makima D. Smith" are anime character references
  - Shinomiya Kaguya: "Kaguya-sama: Love is War"
  - Makima: "Chainsaw Man" (antagonist character)
- **Risk**: Copyright concerns, potentially inappropriate character associations
- **Resolution**: Use generic placeholder names

### Low Priority

**Issue #25: Redundant Phrasing**
- **Screen**: 123 (PostSuccessModal)
- **Problem**: "You have successfully posted a post" is redundant
- **Resolution**: Change to "Your post has been published!" or "Successfully shared!"

---

## New Components Identified (Batch 25)

| Component | First Appearance | Priority |
|-----------|-----------------|----------|
| CommunityHeader | Screen 120 | Medium |
| UserProfileBadge | Screen 120 | High |
| VerifiedBadge | Screen 120 | Medium |
| PostCountLabel | Screen 120 | Low |
| BrowseBySection | Screen 120 | Medium |
| FilterPill | Screen 120 | High |
| PostCard | Screen 120 | High |
| PostAuthorRow | Screen 120 | High |
| UserBadge | Screen 120 | Medium |
| TimestampLabel | Screen 120 | Medium |
| PostText | Screen 120 | Medium |
| HashtagLink | Screen 120 | Medium |
| PostImage | Screen 120 | High |
| EngagementRow | Screen 120 | High |
| CategoryGrid | Screen 121 | Medium |
| CategoryCard | Screen 121 | High |
| CategoryIcon | Screen 121 | Medium |
| ComposerCard | Screen 122 | High |
| MultilineTextInput | Screen 122 | High |
| CharacterCounter | Screen 122 | Medium |
| InputToolbar | Screen 122 | High |
| PostTypePill | Screen 122 | Medium |
| MetricIcon | Screen 122 | Low |
| PrivacyToggle | Screen 122 | Medium |
| SaveDraftButton | Screen 122 | Medium |
| TimeFilterTabs | Screen 124 | Medium |
| NotificationSection | Screen 124 | Medium |
| NotificationRow | Screen 124 | High |
| NotificationAvatar | Screen 124 | Medium |

---

## Summary

**Screens Documented**: 5 (120-124)
**Feature Progress**: Community Support 6/10

**Issues Found**:
- "Suicide" as browse category needs review
- Real person names (Biden, Cena) as placeholders
- Anime character names as users
- Redundant grammar in success message

**Key Implementation Notes**:
1. Community feed is social-media-style with engagement metrics
2. Post creation is multi-step wizard flow
3. Notification system uses color-coded avatars by type
4. Posts support Story/Regular/Reel types like Instagram
5. Privacy toggle allows private posts within community feature

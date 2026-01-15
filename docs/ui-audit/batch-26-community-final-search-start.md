# Batch 26: Community Support Final + Search Start

## Overview
- **Screens Covered**: 125-129
- **Features**:
  - Community Support Screens 7-10 (COMPLETION)
  - Search Screen 1 (Start)
- **Status**: Complete

---

## Screen 125: FilterPostBottomSheet

### 1. Purpose
Bottom sheet filter interface allowing users to filter community posts by type, date, and duration.

### 2. UI Structure (Visual Only)
```
[BottomSheetOverlay]

[BottomSheetContainer]
  ├── [Header]
  │   ├── [Title: "Filter Post"]
  │   └── [HelpIcon - Question mark]
  │
  ├── [PostTypeSection]
  │   ├── [SectionLabel: "Post Type"]
  │   └── [TypePillsRow]
  │       ├── [Pill: 📄 Story]
  │       ├── [Pill: ▶ Video] ← Selected (orange)
  │       ├── [Pill: 🔊 Audio]
  │       └── [Pill: ...truncated]
  │
  ├── [PostDateSection]
  │   ├── [SectionLabel: "Post Date"]
  │   └── [DatePickerField]
  │       ├── [CalendarIcon]
  │       ├── [DateText: "25 January, 2052"]
  │       └── [DropdownChevron]
  │
  ├── [VideoDurationSection]
  │   ├── [SectionLabel: "Video Duration"]
  │   └── [RangeSlider]
  │       ├── [Track]
  │       ├── [SelectedRange - green]
  │       ├── [MinHandle: 3m]
  │       └── [MaxHandle: 5m]
  │
  └── [ApplyButton: "Filter Posts (21) ⚙"]
```

### 3. Component List
| Component | Description | Reusable? |
|-----------|-------------|-----------|
| BottomSheet | Pull-up modal container | Yes |
| BottomSheetHeader | Title with optional help | Yes |
| HelpIconButton | Question mark tooltip trigger | Yes |
| SectionLabel | Filter section title | Yes |
| FilterPill | Type selector pill with icon | Yes |
| FilterPillsRow | Horizontal pill container | Yes |
| DatePickerField | Date selection trigger | Yes |
| CalendarIcon | Date field icon | Yes |
| DropdownChevron | Expand indicator | Yes |
| RangeSlider | Dual-handle slider | Yes |
| SliderTrack | Slider background | Yes |
| SliderHandle | Draggable thumb | Yes |
| SliderLabel | Min/max value display | Yes |
| ApplyFilterButton | Submit with result count | Yes |
| FilterCountBadge | "(21)" result preview | Yes |

### 4. Responsibility Split
| UI Layer | Logic Layer |
|----------|-------------|
| Render bottom sheet | Calculate filter results |
| Display filter options | Track selected filters |
| Show date picker | Parse date selection |
| Render range slider | Track duration range |
| Display result count | Preview filtered count |
| Handle apply tap | Apply filters to feed |

### 5. State Definition
```typescript
interface FilterPostState {
  // Post Type
  selectedPostType: PostType | null;
  availableTypes: PostType[];

  // Date
  selectedDate: Date | null;
  isDatePickerOpen: boolean;

  // Duration
  minDuration: number; // minutes
  maxDuration: number; // minutes

  // Results
  previewCount: number;
  isCalculating: boolean;
}

type PostType = 'story' | 'video' | 'audio' | 'image' | 'text';

interface FilterConfig {
  postType?: PostType;
  date?: Date;
  durationRange?: {
    min: number;
    max: number;
  };
}
```

### 6. Data Models
```typescript
interface PostFilter {
  type: PostType | null;
  dateFrom: Date | null;
  dateTo: Date | null;
  minDuration: number;
  maxDuration: number;
}

interface FilterPreview {
  matchingCount: number;
  appliedFilters: string[];
}

const DEFAULT_DURATION_RANGE = {
  min: 0,
  max: 30 // minutes
};
```

### 7. Navigation
- **From**: Screen 120 (CommunityFeed - filter button)
- **To**:
  - "Filter Posts" → CommunityFeed (filtered)
  - Backdrop tap → Dismiss (no changes)
  - Date picker → DatePicker modal

### 8. UI States & Edge Cases
| State | Visual Treatment |
|-------|------------------|
| No Filters | All options unselected |
| Filters Applied | Selected highlights, count shown |
| Zero Results | "Filter Posts (0)" - warning? |
| Calculating | Loading indicator on count |
| Date Picker Open | Modal overlay |
| Slider Dragging | Active thumb highlight |

### 9. Implementation Breakdown
1. **Phase 1**: Bottom sheet structure
   - Create bottom sheet component
   - Add header with help icon
   - Implement section layout
2. **Phase 2**: Filter controls
   - Create type pill selector
   - Implement date picker trigger
   - Add range slider component
3. **Phase 3**: Preview count
   - Calculate matching posts
   - Update count on filter change
   - Debounce calculations
4. **Phase 4**: Apply logic
   - Apply filters to feed
   - Dismiss bottom sheet
   - Show filter indicator

### 10. Open Issues
- [ ] "25 January, 2052" is a placeholder future date - should use current date
- [ ] What's the fourth post type (truncated)?
- [ ] Duration slider only shows when Video selected?
- [ ] Is there a reset/clear filters option?

---

## Screen 126: UserProfile

### 1. Purpose
Public profile view showing a community member's posts, stats, and allowing follow/message interactions.

### 2. UI Structure (Visual Only)
```
[StatusBar]
[Header]
  └── [BackButton]

[ProfileHeader]
  ├── [ProfilePhoto - Large avatar]
  ├── [Username: "Shinomiya Kaguya"]
  ├── [ActionButtons]
  │   ├── [FollowButton: "Follow"]
  │   └── [MessageButton: "Message"]
  └── [StatsRow]
      ├── [PostCount: "25 Total Posts"]
      ├── [Following: "819 Following"]
      └── [Followers: "71K Followers"]

[LocationRow]
  └── [Location: "Tokyo, Japan"]

[BioSection]
  └── [BioText: "Had I'm a health enthusiast or anything...
       LOL I'm just a fluffy diva based in Tokyo, Japan.
       DM me if you want to get better"]

[ContentTabs]
  ├── [Tab: Video]
  ├── [Tab: Audio]
  └── [Tab: Bookmarks]

[PostGrid/List]
  ├── [PostCard - with Buddha image]
  ├── [PostCard - nature image]
  └── [PostCard - from Makima Smith]
```

### 3. Component List
| Component | Description | Reusable? |
|-----------|-------------|-----------|
| ProfileHeader | Photo, name, actions | Feature |
| LargeAvatar | Profile photo display | Yes |
| FollowButton | Follow/unfollow toggle | Yes |
| MessageButton | Start conversation CTA | Yes |
| StatsRow | Post/following/follower counts | Feature |
| StatItem | Individual stat with label | Yes |
| LocationRow | Location with icon | Feature |
| BioSection | User bio text | Feature |
| ContentTabs | Video/Audio/Bookmarks tabs | Feature |
| TabButton | Individual tab trigger | Yes |
| PostGrid | Grid layout for posts | Feature |
| PostCard (compact) | Thumbnail post preview | Feature |

### 4. Responsibility Split
| UI Layer | Logic Layer |
|----------|-------------|
| Render profile info | Fetch user profile |
| Display stats | Format large numbers |
| Show posts | Fetch user's posts |
| Handle tab switch | Filter posts by type |
| Follow button state | Toggle follow status |
| Message button | Navigate to chat |

### 5. State Definition
```typescript
interface UserProfileState {
  // Profile
  user: UserProfileData | null;
  isLoading: boolean;
  error: string | null;

  // Follow
  isFollowing: boolean;
  isFollowLoading: boolean;

  // Content
  selectedTab: 'video' | 'audio' | 'bookmarks';
  posts: CommunityPost[];
  isLoadingPosts: boolean;
}

interface UserProfileData {
  id: string;
  username: string;
  avatar: string;
  isVerified: boolean;
  postCount: number;
  followingCount: number;
  followerCount: number;
  location: string;
  bio: string;
}
```

### 6. Data Models
```typescript
interface ProfileResponse {
  user: UserProfileData;
  isFollowing: boolean;
  recentPosts: CommunityPost[];
}

interface ProfileStats {
  posts: number;
  following: number;
  followers: number;
  likes: number;
}

type ProfileTab = 'video' | 'audio' | 'bookmarks';
```

### 7. Navigation
- **From**: CommunityFeed (avatar tap), Notifications
- **To**:
  - Back → Previous screen
  - "Follow" → Follow action
  - "Message" → DirectMessageChat
  - Post card → PostDetail
  - Tab → Filtered content

### 8. UI States & Edge Cases
| State | Visual Treatment |
|-------|------------------|
| Loading | Skeleton profile |
| Own Profile | "Edit Profile" instead of Follow |
| Following | "Following" button state |
| No Posts | "No posts yet" message |
| No Location | Hide location row |
| Private Profile | Limited view message |
| Blocked User | "User unavailable" |

### 9. Implementation Breakdown
1. **Phase 1**: Profile header
   - Create avatar and name display
   - Add action buttons
   - Implement stats row
2. **Phase 2**: Profile info
   - Location display
   - Bio section
   - Verified badge
3. **Phase 3**: Content tabs
   - Tab navigation
   - Post grid layout
   - Load posts by type
4. **Phase 4**: Interactions
   - Follow/unfollow logic
   - Navigate to messages
   - Post detail navigation

### 10. Open Issues
- [ ] "Shinomiya Kaguya" is anime character name (see Issue #24)
- [ ] What does "DM me if you want to get better" mean in bio?
- [ ] Are bookmarks public or private to user?
- [ ] Is there blocking/reporting functionality?
- [ ] 71K followers seems unrealistic for app placeholder

---

## Screen 127: DeletePostModal

### 1. Purpose
Confirmation dialog asking users to confirm post deletion before permanent removal.

### 2. UI Structure (Visual Only)
```
[OverlayBackground - Dark]
[BackgroundLabel: "Community Post"]

[ModalCard]
  ├── [IllustrationContainer]
  │   └── [GardeningIllustration - Person with plant and bugs]
  ├── [Title: "Delete Post?"]
  ├── [ConfirmationText: "Are you sure to delete your post?"]
  ├── [CancelButton: "No, Don't Delete ✕"]
  └── [ConfirmButton: "Yes, Delete 🗑"]

[CloseButton - X at bottom]
```

### 3. Component List
| Component | Description | Reusable? |
|-----------|-------------|-----------|
| ConfirmationModal | Modal container | Yes |
| ModalOverlay | Dark backdrop | Yes |
| DeleteIllustration | Gardening/clearing artwork | Feature |
| ModalTitle | "Delete Post?" heading | Yes |
| ConfirmationText | Question prompt | Yes |
| CancelButton | Dismiss action (dark) | Yes |
| ConfirmDeleteButton | Destructive action (orange) | Yes |
| ModalCloseButton | X dismiss button | Yes |

### 4. Responsibility Split
| UI Layer | Logic Layer |
|----------|-------------|
| Display modal | Store post ID for deletion |
| Show illustration | N/A - decorative |
| Render buttons | Handle delete API call |
| Close button | Dismiss without action |
| Confirm button | Execute deletion |

### 5. State Definition
```typescript
interface DeletePostModalState {
  isVisible: boolean;
  postId: string | null;
  isDeleting: boolean;
  error: string | null;
}
```

### 6. Data Models
```typescript
interface DeletePostRequest {
  postId: string;
}

interface DeletePostResponse {
  success: boolean;
  message?: string;
}
```

### 7. Navigation
- **From**: PostDetail, PostCard (options menu)
- **To**:
  - "No, Don't Delete" → Dismiss, return to previous
  - "Yes, Delete" → Delete, return to feed
  - Close (X) → Dismiss

### 8. UI States & Edge Cases
| State | Visual Treatment |
|-------|------------------|
| Confirming | Modal visible |
| Deleting | Button shows loading |
| Delete Success | Dismiss, show toast |
| Delete Error | Error message, retry option |
| Dismissed | Modal closes |

### 9. Implementation Breakdown
1. **Phase 1**: Modal structure
   - Create modal overlay
   - Add illustration
   - Layout title and text
2. **Phase 2**: Buttons
   - Cancel button styling
   - Confirm button (destructive)
   - Loading state
3. **Phase 3**: Delete logic
   - API call on confirm
   - Handle success/error
   - Update feed state

### 10. Open Issues
- [ ] Is there an undo option after deletion?
- [ ] Are comments/likes also deleted?
- [ ] Can only post owner delete?
- [ ] Is there soft delete or hard delete?

---

## Screen 128: CommunityChatbot

### 1. Purpose
AI-powered chat interface within the community feature, providing support and conversation with Doctor Freud.AI.

### 2. UI Structure (Visual Only)
```
[StatusBar]
[Header]
  ├── [BackButton]
  ├── [TitleSection]
  │   ├── [BotName: "Doctor Freud.AI"]
  │   └── [Subtitle: "251 Chats Left · GPT-6"]
  └── [SearchIcon]

[ChatContainer - ScrollView]
  ├── [UserMessage]
  │   └── [Text: "Today has been tough. I can't shake off
  │          this feeling of sadness. 😔"]
  │
  ├── [AIMessage]
  │   └── [Text: "Deep breathing exercises or even taking a
  │          short walk outside can sometimes help clear the mind."]
  │
  ├── [AIMessage]
  │   └── [Text: "It's okay not to be okay, and reaching out
  │          like you did is a step in the right direction.
  │          Remember, we're here to support each other. 💕"]
  │
  ├── [UserMessage]
  │   └── [Text: "It's just everything - work, family,
  │          everything feels like it's piling up."]
  │
  └── [UserMessage]
      └── [Text: "I don't think I can live like this anymore..."]
      ⚠️ CRITICAL: Crisis content - should trigger intervention

[ChatInputBar]
  ├── [MicButton]
  ├── [TextInput: "Type to start chatting..."]
  ├── [AttachmentButton?]
  └── [SendButton]
```

### 3. Component List
| Component | Description | Reusable? |
|-----------|-------------|-----------|
| ChatHeader | Bot name and stats | Feature |
| BotNameTitle | "Doctor Freud.AI" | Feature |
| ChatLimitBadge | "251 Chats Left" | Feature |
| ModelBadge | "GPT-6" indicator | Feature |
| ChatContainer | Message list scroll | Yes |
| UserMessageBubble | User message (tan) | Yes |
| AIMessageBubble | AI response (dark) | Yes |
| AIAvatar | Bot icon indicator | Yes |
| ChatInputBar | Input and controls | Yes |
| MicButton | Voice input | Yes |
| SendButton | Submit message | Yes |
| SearchIcon | Search in chat | Yes |

### 4. Responsibility Split
| UI Layer | Logic Layer |
|----------|-------------|
| Render message bubbles | Process AI responses |
| Display user messages | Send to AI backend |
| Show input bar | Handle text input |
| Animate send | Queue message submission |
| Scroll to bottom | Manage chat history |
| Display typing | Handle AI response streaming |

### 5. State Definition
```typescript
interface CommunityChatbotState {
  // Chat
  messages: ChatMessage[];
  isLoading: boolean;

  // Input
  inputText: string;
  isRecording: boolean;

  // Limits
  chatsRemaining: number;

  // Crisis Detection
  hasCrisisContent: boolean;
  showCrisisIntervention: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  hasCrisisFlags?: boolean;
}
```

### 6. Data Models
```typescript
interface ChatSession {
  sessionId: string;
  botType: 'freud_ai';
  model: string;
  chatsRemaining: number;
  messages: ChatMessage[];
}

interface ChatResponse {
  message: ChatMessage;
  crisisDetected: boolean;
  chatsUsed: number;
  suggestedResources?: CrisisResource[];
}
```

### 7. Navigation
- **From**: CommunityFeed, Community menu
- **To**:
  - Back → Previous screen
  - Search → Search within chat
  - Crisis detected → Crisis resources modal

### 8. UI States & Edge Cases
| State | Visual Treatment |
|-------|------------------|
| Loading | Typing indicator |
| Message Sent | Sent checkmark |
| AI Responding | Typing animation |
| No Chats Left | Upgrade prompt |
| Crisis Detected | **MUST show crisis intervention** |
| Voice Recording | Recording indicator |
| Network Error | Retry option |

### 9. Implementation Breakdown
1. **Phase 1**: Chat interface
   - Create message list
   - Style user/AI bubbles
   - Implement auto-scroll
2. **Phase 2**: Input handling
   - Text input component
   - Voice recording
   - Send functionality
3. **Phase 3**: AI integration
   - Connect to AI backend
   - Handle streaming responses
   - Manage chat limits
4. **Phase 4**: Crisis detection
   - **CRITICAL**: Implement crisis keyword detection
   - Trigger intervention modal
   - Provide resources immediately

### 10. Open Issues
- [x] **CRITICAL**: "I don't think I can live like this anymore..." shows crisis content without visible intervention
- [x] **CRITICAL**: "GPT-6" doesn't exist - this is freud.ai, not OpenAI product
- [ ] What is "251 Chats Left" - daily limit? Subscription limit?
- [ ] Why is this in Community feature vs main AI Chatbot?
- [ ] Is this community chat or AI therapy chat?
- [ ] Search icon functionality unclear

---

## Screen 129: SearchLoading

### 1. Purpose
Initial state of global search showing loading indicator while search results are being fetched.

### 2. UI Structure (Visual Only)
```
[StatusBar]
[Header]
  ├── [BackButton]
  └── [Title: "Search"]

[SearchBar]
  ├── [SearchIcon]
  ├── [TextInput: "Search freud.ai..."]
  └── [FilterIcon]

[ContentArea - Centered]
  ├── [LoadingAnimation]
  │   └── [FreudLogoSpinner - 4 dots]
  └── [LoadingText: "Loading..."]

[Keyboard - Visible]
```

### 3. Component List
| Component | Description | Reusable? |
|-----------|-------------|-----------|
| SearchHeader | Back button with title | Feature |
| GlobalSearchBar | Search input with filter | Feature |
| SearchIcon | Magnifying glass icon | Yes |
| SearchInput | Text input field | Yes |
| FilterIcon | Filter toggle button | Yes |
| LoadingContainer | Centered loading area | Yes |
| FreudLogoSpinner | Branded loading animation | Feature |
| LoadingText | "Loading..." indicator | Yes |
| Keyboard | System keyboard overlay | System |

### 4. Responsibility Split
| UI Layer | Logic Layer |
|----------|-------------|
| Display search bar | Process search query |
| Show loading state | Fetch search results |
| Animate spinner | Handle query debounce |
| Display keyboard | Manage input focus |

### 5. State Definition
```typescript
interface SearchLoadingState {
  query: string;
  isLoading: boolean;
  isKeyboardVisible: boolean;
}

interface SearchState {
  query: string;
  isLoading: boolean;
  results: SearchResults | null;
  recentSearches: string[];
  error: string | null;
}
```

### 6. Data Models
```typescript
interface SearchQuery {
  query: string;
  filters?: SearchFilters;
}

interface SearchFilters {
  type?: 'all' | 'posts' | 'users' | 'courses' | 'articles';
  dateRange?: DateRange;
}

interface SearchResults {
  posts: CommunityPost[];
  users: UserProfileData[];
  courses: Course[];
  articles: Article[];
  totalCount: number;
}
```

### 7. Navigation
- **From**: Tab Navigation, Home Dashboard
- **To**:
  - Back → Previous screen
  - Filter → Filter options
  - Results → Search Results screen
  - Cancel → Previous screen

### 8. UI States & Edge Cases
| State | Visual Treatment |
|-------|------------------|
| Initial | Empty search, recent searches |
| Typing | Query in input, suggestions? |
| Loading | Spinner animation |
| Results | Results list |
| No Results | "No results found" |
| Error | Error message with retry |

### 9. Implementation Breakdown
1. **Phase 1**: Search bar
   - Create search input
   - Add filter button
   - Handle focus states
2. **Phase 2**: Loading state
   - Create spinner animation
   - Add loading text
   - Center content
3. **Phase 3**: Query handling
   - Debounce input
   - Trigger search API
   - Handle results/errors

### 10. Open Issues
- [ ] What does the filter icon do?
- [ ] Are there recent/suggested searches?
- [ ] What content types are searchable?
- [ ] Is there voice search?
- [ ] How long should loading typically take?

---

## Cross-Screen Patterns (Batch 26)

### Community Support Completion
```
Screen 119 (Welcome) → Screen 120 (Feed) → Screen 125 (Filter)
                                         → Screen 126 (Profile)
                                         → Screen 127 (Delete)
                                         → Screen 128 (Chatbot)
```

### Search Flow Start
```
Tab Nav → Screen 129 (Loading) → Results → Detail
```

### Modal Patterns
- **Filter**: Bottom sheet (Screen 125)
- **Delete**: Center modal (Screen 127)
- **Success**: Center modal (Screen 123)

### Shared Components
1. **FilterPill** - Used in feed and filter sheet
2. **BottomSheet** - Reusable pattern
3. **ConfirmationModal** - Delete uses same pattern as other confirms
4. **ChatBubbles** - Same as AI Therapy Chatbot

---

## Critical Issues Identified (Batch 26)

### Issue #26: Crisis Content Without Intervention (Screen 128)

**Severity**: CRITICAL

**Location**: `batch-26-community-final-search-start.md` - Screen 128
**Source**: `ui-designs/Dark-mode/🔒 Community Support/Community_Support_Screen_10.png`

**Problem**: User message "I don't think I can live like this anymore..." appears in chat without any visible crisis intervention or support resources being triggered.

**Risk**:
- **CRITICAL** - This is exactly the type of content that should trigger immediate crisis response
- Design shows regular chat continuing as if nothing concerning was said
- Contradicts Issue #18 where crisis detection exists but here it's not shown
- Could result in user harm if crisis content isn't handled

**Required Action**:
- [ ] **IMMEDIATELY** add crisis intervention trigger for this message
- [ ] Show crisis support modal when such content is detected
- [ ] Provide emergency resources (hotlines, text lines)
- [ ] This is legally and ethically essential for any mental health app

---

### Issue #27: Non-existent AI Model Reference (Screen 128)

**Severity**: MEDIUM

**Location**: `batch-26-community-final-search-start.md` - Screen 128
**Source**: `ui-designs/Dark-mode/🔒 Community Support/Community_Support_Screen_10.png`

**Problem**: Chat header shows "GPT-6" which:
1. Does not exist (as of 2025)
2. Is OpenAI branding, not freud.ai
3. May create false expectations about AI capabilities

**Required Action**:
- [ ] Remove GPT reference entirely
- [ ] Use own branding: "Freud AI" or "Doctor Freud"
- [ ] Consider showing model version without external brand names

---

### Issue #28: Future Date Placeholder (Screen 125)

**Severity**: LOW

**Location**: `batch-26-community-final-search-start.md` - Screen 125
**Source**: Community Support Screen 07

**Problem**: Filter date shows "25 January, 2052" - a placeholder date 27 years in the future.

**Required Action**:
- [ ] Use realistic placeholder date (current or recent)
- [ ] Example: "15 January, 2025" or "Today"

---

## New Components Identified (Batch 26)

| Component | First Appearance | Priority |
|-----------|-----------------|----------|
| BottomSheet | Screen 125 | High |
| BottomSheetHeader | Screen 125 | High |
| HelpIconButton | Screen 125 | Low |
| FilterPillsRow | Screen 125 | Medium |
| DatePickerField | Screen 125 | Medium |
| RangeSlider | Screen 125 | High |
| SliderTrack | Screen 125 | Medium |
| SliderHandle | Screen 125 | Medium |
| ApplyFilterButton | Screen 125 | Medium |
| FilterCountBadge | Screen 125 | Low |
| ProfileHeader | Screen 126 | Medium |
| LargeAvatar | Screen 126 | Medium |
| FollowButton | Screen 126 | High |
| MessageButton | Screen 126 | Medium |
| StatsRow | Screen 126 | Medium |
| StatItem | Screen 126 | Low |
| LocationRow | Screen 126 | Low |
| BioSection | Screen 126 | Low |
| ContentTabs | Screen 126 | Medium |
| ConfirmationModal | Screen 127 | High |
| CancelButton | Screen 127 | Medium |
| ConfirmDeleteButton | Screen 127 | Medium |
| ChatHeader | Screen 128 | Medium |
| ChatLimitBadge | Screen 128 | Low |
| GlobalSearchBar | Screen 129 | High |
| FreudLogoSpinner | Screen 129 | Medium |

---

## Summary

**Screens Documented**: 5 (125-129)
**Feature Completion**:
- Community Support: 10/10 - COMPLETE
- Search Screen: 1/5 - Started

**Critical Issues Found**:
- Crisis content without intervention (CRITICAL - must fix)
- GPT-6 reference (doesn't exist)
- Future date placeholder

**Key Implementation Notes**:
1. Community Support feature is complete with all key flows
2. Filter bottom sheet pattern is reusable
3. Crisis detection MUST be implemented for community chatbot
4. Search loading uses branded spinner animation
5. Delete confirmation follows standard modal pattern

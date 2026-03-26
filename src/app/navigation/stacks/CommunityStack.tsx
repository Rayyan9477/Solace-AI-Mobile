/**
 * Community Stack Navigator
 * @description Navigation stack for community support and social feature screens
 * @module Navigation
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { CommunityStackParamList } from "../../../shared/types/navigation";

// Community Screens
import { CommunityWelcomeScreen } from "../../../features/community/screens/CommunityWelcomeScreen";
import { CommunityFeedScreen } from "../../../features/community/screens/CommunityFeedScreen";
import { NewPostCategorySelectorScreen } from "../../../features/community/screens/NewPostCategorySelectorScreen";
import { NewPostComposerScreen } from "../../../features/community/screens/NewPostComposerScreen";
import { PostSuccessModal } from "../../../features/community/screens/PostSuccessModal";
import { UserProfileScreen } from "../../../features/community/screens/UserProfileScreen";
import { CommunityNotificationsScreen } from "../../../features/community/screens/CommunityNotificationsScreen";
import { FilterPostBottomSheet } from "../../../features/community/screens/FilterPostBottomSheet";
import { DeletePostModal } from "../../../features/community/screens/DeletePostModal";
import { CommunityChatbotScreen } from "../../../features/community/screens/CommunityChatbotScreen";

const Stack = createNativeStackNavigator<CommunityStackParamList>();

// ---------------------------------------------------------------------------
// Route wrappers
// ---------------------------------------------------------------------------

function CommunityWelcomeRoute({ navigation }: any): React.ReactElement {
  return (
    <CommunityWelcomeScreen
      title="Welcome to the Community"
      description="Connect with others on their mental health journey"
      onStartPosting={() => navigation.navigate("CommunityFeed")}
      onPrivacyPolicy={() => {}}
      onTerms={() => {}}
    />
  );
}

function CommunityFeedRoute({ navigation }: any): React.ReactElement {
  return (
    <CommunityFeedScreen
      username="User"
      totalPosts="0"
      rating="5.0"
      filters={[
        { id: "all", label: "All" },
        { id: "mental-health", label: "Mental Health" },
        { id: "anxiety", label: "Anxiety" },
        { id: "depression", label: "Depression" },
      ]}
      selectedFilterId="all"
      posts={[]}
      onBack={() => navigation.goBack()}
      onFilterSelect={() => {}}
      onPostPress={() => {}}
      onPostLike={() => {}}
      onPostShare={() => {}}
      onAddPost={() => navigation.navigate("PostCategories")}
      onProfilePress={() => {}}
    />
  );
}

function PostCategoriesRoute({ navigation }: any): React.ReactElement {
  return (
    <NewPostCategorySelectorScreen
      categories={[
        { id: "mental-health", name: "Mental Health", icon: "heart" },
        { id: "anxiety", name: "Anxiety", icon: "alert-circle" },
        { id: "depression", name: "Depression", icon: "cloudy" },
        { id: "motivation", name: "Motivation", icon: "star" },
        { id: "mindfulness", name: "Mindfulness", icon: "leaf" },
        { id: "sleep", name: "Sleep", icon: "moon" },
      ]}
      selectedCategoryId={null}
      onBack={() => navigation.goBack()}
      onCategorySelect={() => {}}
      onContinue={() => navigation.navigate("CreatePost")}
    />
  );
}

function CreatePostRoute({ navigation }: any): React.ReactElement {
  return (
    <NewPostComposerScreen
      username="User"
      totalPosts="0"
      rating="5.0"
      content=""
      characterCount={0}
      maxCharacters={500}
      postTypes={[
        { id: "text", label: "Text" },
        { id: "question", label: "Question" },
        { id: "story", label: "Story" },
      ]}
      selectedPostTypeId="text"
      isPrivate={false}
      onBack={() => navigation.goBack()}
      onContentChange={() => {}}
      onPostTypeSelect={() => {}}
      onCameraPress={() => {}}
      onMicPress={() => {}}
      onEmojiPress={() => {}}
      onPrivacyToggle={() => {}}
      onSaveDraft={() => navigation.goBack()}
      onPost={() => navigation.navigate("SuccessStories")}
    />
  );
}

function PostSuccessRoute({ navigation }: any): React.ReactElement {
  return (
    <PostSuccessModal
      message="Your post has been published!"
      onViewPost={() => navigation.navigate("CommunityFeed")}
      onClose={() => navigation.navigate("CommunityFeed")}
    />
  );
}

function UserProfileRoute({ navigation }: any): React.ReactElement {
  return (
    <UserProfileScreen
      username="Community Member"
      postCount="12"
      followingCount="34"
      followerCount="56"
      location="Unknown"
      bio=""
      tabs={[
        { id: "posts", label: "Posts" },
        { id: "replies", label: "Replies" },
      ]}
      selectedTabId="posts"
      isFollowing={false}
      onBack={() => navigation.goBack()}
      onFollow={() => {}}
      onMessage={() => navigation.navigate("CommunityChatbot")}
      onTabSelect={() => {}}
    />
  );
}

function CommunityNotificationsRoute({ navigation }: any): React.ReactElement {
  return (
    <CommunityNotificationsScreen
      selectedTab="all"
      tabs={[
        { id: "all", label: "All" },
        { id: "likes", label: "Likes" },
        { id: "comments", label: "Comments" },
      ]}
      sections={[]}
      onBack={() => navigation.goBack()}
      onTabSelect={() => {}}
      onNotificationPress={() => {}}
      onOptionsPress={() => {}}
    />
  );
}

function FilterPostRoute({ navigation }: any): React.ReactElement {
  return (
    <FilterPostBottomSheet
      postTypes={[
        { id: "text", label: "Text", icon: "document-text" },
        { id: "question", label: "Question", icon: "help-circle" },
        { id: "story", label: "Story", icon: "book" },
      ]}
      selectedPostTypeId={null}
      selectedDate=""
      minDuration={0}
      maxDuration={60}
      resultCount={0}
      onPostTypeSelect={() => {}}
      onDatePress={() => {}}
      onDurationChange={() => {}}
      onApply={() => navigation.goBack()}
      onClose={() => navigation.goBack()}
    />
  );
}

function DeletePostRoute({ navigation }: any): React.ReactElement {
  return (
    <DeletePostModal
      onCancel={() => navigation.goBack()}
      onConfirm={() => navigation.navigate("CommunityFeed")}
      onClose={() => navigation.goBack()}
    />
  );
}

function CommunityChatbotRoute({ navigation }: any): React.ReactElement {
  return (
    <CommunityChatbotScreen
      botName="Dr. Solace AI"
      chatsRemaining="Unlimited"
      modelLabel="Solace AI"
      messages={[]}
      inputText=""
      onBack={() => navigation.goBack()}
      onSearch={() => {}}
      onInputChange={() => {}}
      onSend={() => {}}
      onMicPress={() => {}}
    />
  );
}

// ---------------------------------------------------------------------------
// Stack Navigator
// ---------------------------------------------------------------------------

/**
 * CommunityStack Navigator Component
 * @returns {React.ReactElement} Community stack navigator
 */
export function CommunityStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="CommunityWelcome"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="CommunityWelcome" component={CommunityWelcomeRoute} />
      <Stack.Screen name="CommunityFeed" component={CommunityFeedRoute} />
      <Stack.Screen name="PostCategories" component={PostCategoriesRoute} />
      <Stack.Screen name="CreatePost" component={CreatePostRoute} />
      <Stack.Screen
        name="SuccessStories"
        component={PostSuccessRoute}
        options={{ presentation: "modal", animation: "fade" }}
      />
      <Stack.Screen name="UserProfile" component={UserProfileRoute} />
      <Stack.Screen name="CommunityNotifications" component={CommunityNotificationsRoute} />
      <Stack.Screen
        name="SupportGroups"
        component={FilterPostRoute}
        options={{ presentation: "modal", animation: "fade" }}
      />
      <Stack.Screen
        name="PostDetail"
        component={DeletePostRoute}
        options={{ presentation: "modal", animation: "fade" }}
      />
      <Stack.Screen name="CommunityChatbot" component={CommunityChatbotRoute} />
    </Stack.Navigator>
  );
}

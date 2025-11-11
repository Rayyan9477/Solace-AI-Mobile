/**
 * Community Storage Service
 * Provides local persistence for community posts, comments, and interactions
 * Implements offline-first approach with local caching
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "@shared/utils/logger";

// Storage keys
const STORAGE_KEYS = {
  POSTS: "@solace_community_posts",
  COMMENTS: "@solace_community_comments",
  SAVED_POSTS: "@solace_saved_posts",
  USER_POSTS: "@solace_user_posts",
  LAST_SYNC: "@solace_community_last_sync",
};

// TypeScript interfaces
interface CommunityPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  title?: string;
  category: string;
  tags?: string[];
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  updatedAt: string;
  synced?: boolean;
}

interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  likes: number;
  isLiked?: boolean;
  createdAt: string;
  synced?: boolean;
}

interface PostFilters {
  category?: string;
  tags?: string[];
  author?: string;
  searchQuery?: string;
  limit?: number;
  savedOnly?: boolean;
}

class CommunityStorageService {
  private maxPostsCount = 500;
  private maxCommentsPerPost = 100;

  /**
   * Save a new post to local storage
   */
  async savePost(
    post: Omit<CommunityPost, "id" | "createdAt" | "updatedAt" | "likes" | "comments">
  ): Promise<CommunityPost> {
    try {
      const posts = await this.getAllPosts();

      const newPost: CommunityPost = {
        id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...post,
        likes: 0,
        comments: 0,
        isLiked: false,
        isSaved: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        synced: false,
      };

      posts.unshift(newPost);

      if (posts.length > this.maxPostsCount) {
        posts.pop();
      }

      await AsyncStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));

      // Also add to user's posts
      await this.addToUserPosts(newPost.id);

      logger.info("Community post saved", { id: newPost.id });
      return newPost;
    } catch (error) {
      logger.error("Failed to save community post", error);
      throw error;
    }
  }

  /**
   * Get all posts
   */
  async getAllPosts(): Promise<CommunityPost[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.POSTS);
      if (!data) {
        return [];
      }

      return JSON.parse(data) as CommunityPost[];
    } catch (error) {
      logger.error("Failed to get community posts", error);
      return [];
    }
  }

  /**
   * Get a single post by ID
   */
  async getPostById(id: string): Promise<CommunityPost | null> {
    try {
      const posts = await this.getAllPosts();
      return posts.find((post) => post.id === id) || null;
    } catch (error) {
      logger.error("Failed to get post", error);
      return null;
    }
  }

  /**
   * Get posts with filters
   */
  async getPostsWithFilters(filters: PostFilters): Promise<CommunityPost[]> {
    try {
      let posts = await this.getAllPosts();

      // Apply saved only filter
      if (filters.savedOnly) {
        const savedIds = await this.getSavedPostIds();
        posts = posts.filter((post) => savedIds.includes(post.id));
      }

      // Apply category filter
      if (filters.category) {
        posts = posts.filter((post) => post.category === filters.category);
      }

      // Apply tags filter
      if (filters.tags && filters.tags.length > 0) {
        posts = posts.filter((post) =>
          filters.tags!.some((tag) => post.tags?.includes(tag))
        );
      }

      // Apply author filter
      if (filters.author) {
        posts = posts.filter((post) => post.author.id === filters.author);
      }

      // Apply search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        posts = posts.filter(
          (post) =>
            post.content.toLowerCase().includes(query) ||
            post.title?.toLowerCase().includes(query) ||
            post.tags?.some((tag) => tag.toLowerCase().includes(query))
        );
      }

      // Apply limit
      if (filters.limit && filters.limit > 0) {
        posts = posts.slice(0, filters.limit);
      }

      return posts;
    } catch (error) {
      logger.error("Failed to get filtered posts", error);
      return [];
    }
  }

  /**
   * Update a post
   */
  async updatePost(
    id: string,
    updates: Partial<CommunityPost>
  ): Promise<CommunityPost | null> {
    try {
      const posts = await this.getAllPosts();
      const index = posts.findIndex((post) => post.id === id);

      if (index === -1) {
        logger.warn("Post not found", { id });
        return null;
      }

      posts[index] = {
        ...posts[index],
        ...updates,
        updatedAt: new Date().toISOString(),
        synced: false,
      };

      await AsyncStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));

      logger.info("Post updated", { id });
      return posts[index];
    } catch (error) {
      logger.error("Failed to update post", error);
      throw error;
    }
  }

  /**
   * Delete a post
   */
  async deletePost(id: string): Promise<boolean> {
    try {
      const posts = await this.getAllPosts();
      const filteredPosts = posts.filter((post) => post.id !== id);

      if (filteredPosts.length === posts.length) {
        logger.warn("Post not found for deletion", { id });
        return false;
      }

      await AsyncStorage.setItem(
        STORAGE_KEYS.POSTS,
        JSON.stringify(filteredPosts)
      );

      // Remove from saved posts
      await this.unsavePost(id);

      // Remove associated comments
      await this.deleteCommentsByPostId(id);

      logger.info("Post deleted", { id });
      return true;
    } catch (error) {
      logger.error("Failed to delete post", error);
      return false;
    }
  }

  /**
   * Toggle like on a post
   */
  async toggleLikePost(postId: string): Promise<boolean> {
    try {
      const posts = await this.getAllPosts();
      const post = posts.find((p) => p.id === postId);

      if (!post) {
        logger.warn("Post not found for like", { postId });
        return false;
      }

      post.isLiked = !post.isLiked;
      post.likes += post.isLiked ? 1 : -1;
      post.synced = false;

      await AsyncStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));

      logger.info("Post like toggled", { postId, isLiked: post.isLiked });
      return post.isLiked;
    } catch (error) {
      logger.error("Failed to toggle like", error);
      return false;
    }
  }

  /**
   * Save a post
   */
  async savePost(postId: string): Promise<boolean> {
    try {
      const savedIds = await this.getSavedPostIds();

      if (!savedIds.includes(postId)) {
        savedIds.push(postId);
        await AsyncStorage.setItem(
          STORAGE_KEYS.SAVED_POSTS,
          JSON.stringify(savedIds)
        );

        // Update post object
        const posts = await this.getAllPosts();
        const post = posts.find((p) => p.id === postId);
        if (post) {
          post.isSaved = true;
          await AsyncStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
        }

        logger.info("Post saved", { postId });
      }

      return true;
    } catch (error) {
      logger.error("Failed to save post", error);
      return false;
    }
  }

  /**
   * Unsave a post
   */
  async unsavePost(postId: string): Promise<boolean> {
    try {
      const savedIds = await this.getSavedPostIds();
      const filteredIds = savedIds.filter((id) => id !== postId);

      await AsyncStorage.setItem(
        STORAGE_KEYS.SAVED_POSTS,
        JSON.stringify(filteredIds)
      );

      // Update post object
      const posts = await this.getAllPosts();
      const post = posts.find((p) => p.id === postId);
      if (post) {
        post.isSaved = false;
        await AsyncStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
      }

      logger.info("Post unsaved", { postId });
      return true;
    } catch (error) {
      logger.error("Failed to unsave post", error);
      return false;
    }
  }

  /**
   * Get saved post IDs
   */
  private async getSavedPostIds(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_POSTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      logger.error("Failed to get saved posts", error);
      return [];
    }
  }

  /**
   * Add comment to a post
   */
  async addComment(
    comment: Omit<Comment, "id" | "createdAt" | "likes" | "isLiked">
  ): Promise<Comment> {
    try {
      const comments = await this.getCommentsByPostId(comment.postId);

      const newComment: Comment = {
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...comment,
        likes: 0,
        isLiked: false,
        createdAt: new Date().toISOString(),
        synced: false,
      };

      comments.unshift(newComment);

      // Save comments
      await this.saveComments(comment.postId, comments);

      // Update post comment count
      const posts = await this.getAllPosts();
      const post = posts.find((p) => p.id === comment.postId);
      if (post) {
        post.comments++;
        await AsyncStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
      }

      logger.info("Comment added", { id: newComment.id, postId: comment.postId });
      return newComment;
    } catch (error) {
      logger.error("Failed to add comment", error);
      throw error;
    }
  }

  /**
   * Get comments for a post
   */
  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    try {
      const data = await AsyncStorage.getItem(
        `${STORAGE_KEYS.COMMENTS}_${postId}`
      );
      return data ? JSON.parse(data) : [];
    } catch (error) {
      logger.error("Failed to get comments", error);
      return [];
    }
  }

  /**
   * Save comments for a post
   */
  private async saveComments(
    postId: string,
    comments: Comment[]
  ): Promise<void> {
    try {
      // Limit comments per post
      if (comments.length > this.maxCommentsPerPost) {
        comments = comments.slice(0, this.maxCommentsPerPost);
      }

      await AsyncStorage.setItem(
        `${STORAGE_KEYS.COMMENTS}_${postId}`,
        JSON.stringify(comments)
      );
    } catch (error) {
      logger.error("Failed to save comments", error);
    }
  }

  /**
   * Delete all comments for a post
   */
  private async deleteCommentsByPostId(postId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${STORAGE_KEYS.COMMENTS}_${postId}`);
    } catch (error) {
      logger.error("Failed to delete comments", error);
    }
  }

  /**
   * Toggle like on a comment
   */
  async toggleLikeComment(
    postId: string,
    commentId: string
  ): Promise<boolean> {
    try {
      const comments = await this.getCommentsByPostId(postId);
      const comment = comments.find((c) => c.id === commentId);

      if (!comment) {
        logger.warn("Comment not found for like", { commentId });
        return false;
      }

      comment.isLiked = !comment.isLiked;
      comment.likes += comment.isLiked ? 1 : -1;
      comment.synced = false;

      await this.saveComments(postId, comments);

      logger.info("Comment like toggled", { commentId, isLiked: comment.isLiked });
      return comment.isLiked;
    } catch (error) {
      logger.error("Failed to toggle comment like", error);
      return false;
    }
  }

  /**
   * Add to user's posts list
   */
  private async addToUserPosts(postId: string): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_POSTS);
      const userPosts = data ? JSON.parse(data) : [];
      userPosts.unshift(postId);

      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_POSTS,
        JSON.stringify(userPosts)
      );
    } catch (error) {
      logger.error("Failed to add to user posts", error);
    }
  }

  /**
   * Get user's posts
   */
  async getUserPosts(): Promise<CommunityPost[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_POSTS);
      const postIds = data ? JSON.parse(data) : [];

      const allPosts = await this.getAllPosts();
      return allPosts.filter((post) => postIds.includes(post.id));
    } catch (error) {
      logger.error("Failed to get user posts", error);
      return [];
    }
  }

  /**
   * Get unsynced posts
   */
  async getUnsyncedPosts(): Promise<CommunityPost[]> {
    try {
      const posts = await this.getAllPosts();
      return posts.filter((post) => !post.synced);
    } catch (error) {
      logger.error("Failed to get unsynced posts", error);
      return [];
    }
  }

  /**
   * Mark posts as synced
   */
  async markPostsAsSynced(postIds: string[]): Promise<void> {
    try {
      const posts = await this.getAllPosts();

      const updatedPosts = posts.map((post) => {
        if (postIds.includes(post.id)) {
          return { ...post, synced: true };
        }
        return post;
      });

      await AsyncStorage.setItem(
        STORAGE_KEYS.POSTS,
        JSON.stringify(updatedPosts)
      );

      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_SYNC,
        new Date().toISOString()
      );

      logger.info("Posts marked as synced", { count: postIds.length });
    } catch (error) {
      logger.error("Failed to mark posts as synced", error);
    }
  }

  /**
   * Clear all community data
   */
  async clearAllData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.POSTS),
        AsyncStorage.removeItem(STORAGE_KEYS.SAVED_POSTS),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_POSTS),
        AsyncStorage.removeItem(STORAGE_KEYS.LAST_SYNC),
      ]);

      logger.info("All community data cleared");
    } catch (error) {
      logger.error("Failed to clear community data", error);
    }
  }
}

// Export singleton instance
export const communityStorageService = new CommunityStorageService();
export default communityStorageService;
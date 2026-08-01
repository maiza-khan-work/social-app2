import { useCallback, useState } from 'react';
import storage, { generateId } from '../utils/storage';

/**
 * Central hook for all post/comment/like CRUD operations.
 * Keeps a `posts` state in sync with localStorage so consuming
 * components re-render immediately after any mutation.
 */
export function usePosts() {
  const [posts, setPostsState] = useState(() => storage.getPosts());
  const [comments, setCommentsState] = useState(() => storage.getComments());
  const [likes, setLikesState] = useState(() => storage.getLikes());

  const refresh = useCallback(() => {
    setPostsState(storage.getPosts());
    setCommentsState(storage.getComments());
    setLikesState(storage.getLikes());
  }, []);

  const createPost = useCallback((authorId, { description, image, isPublic, isDraft }) => {
    const newPost = {
      id: generateId('post'),
      authorId,
      description,
      image: image || null,
      isPublic: !!isPublic,
      isDraft: !!isDraft,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...storage.getPosts(), newPost];
    storage.setPosts(updated);
    setPostsState(updated);
    return newPost;
  }, []);

  const updatePost = useCallback((postId, changes) => {
    const updated = storage.getPosts().map((p) =>
      p.id === postId ? { ...p, ...changes, updatedAt: new Date().toISOString() } : p
    );
    storage.setPosts(updated);
    setPostsState(updated);
  }, []);

  const deletePost = useCallback((postId) => {
    const updatedPosts = storage.getPosts().filter((p) => p.id !== postId);
    storage.setPosts(updatedPosts);
    setPostsState(updatedPosts);

    const updatedComments = storage.getComments().filter((c) => c.postId !== postId);
    storage.setComments(updatedComments);
    setCommentsState(updatedComments);

    const updatedLikes = storage.getLikes().filter((l) => l.postId !== postId);
    storage.setLikes(updatedLikes);
    setLikesState(updatedLikes);
  }, []);

  const togglePublic = useCallback((postId) => {
    const all = storage.getPosts();
    const updated = all.map((p) =>
      p.id === postId ? { ...p, isPublic: !p.isPublic } : p
    );
    storage.setPosts(updated);
    setPostsState(updated);
  }, []);

  const publishPost = useCallback((postId) => {
    updatePost(postId, { isDraft: false });
  }, [updatePost]);

  const toggleLike = useCallback((postId, userId) => {
    const allLikes = storage.getLikes();
    const existing = allLikes.find((l) => l.postId === postId && l.userId === userId);
    let updated;
    if (existing) {
      updated = allLikes.filter((l) => l.id !== existing.id);
    } else {
      updated = [...allLikes, { id: generateId('like'), postId, userId, createdAt: new Date().toISOString() }];
    }
    storage.setLikes(updated);
    setLikesState(updated);
  }, []);

  const addComment = useCallback((postId, authorId, text) => {
    const newComment = {
      id: generateId('cmt'),
      postId,
      authorId,
      text,
      createdAt: new Date().toISOString(),
    };
    const updated = [...storage.getComments(), newComment];
    storage.setComments(updated);
    setCommentsState(updated);
    return newComment;
  }, []);

  const deleteComment = useCallback((commentId) => {
    const updated = storage.getComments().filter((c) => c.id !== commentId);
    storage.setComments(updated);
    setCommentsState(updated);
  }, []);

  // ---------- Derived helpers ----------
  const getPostLikeCount = useCallback(
    (postId) => likes.filter((l) => l.postId === postId).length,
    [likes]
  );

  const isPostLikedByUser = useCallback(
    (postId, userId) => likes.some((l) => l.postId === postId && l.userId === userId),
    [likes]
  );

  const getPostComments = useCallback(
    (postId) =>
      comments
        .filter((c) => c.postId === postId)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [comments]
  );

  const toggleBookmark = useCallback((user, postId, updateCurrentUser) => {
    const bookmarks = user.bookmarks || [];
    const updatedBookmarks = bookmarks.includes(postId)
      ? bookmarks.filter((id) => id !== postId)
      : [...bookmarks, postId];
    updateCurrentUser({ bookmarks: updatedBookmarks });
  }, []);

  return {
    posts,
    comments,
    likes,
    refresh,
    createPost,
    updatePost,
    deletePost,
    togglePublic,
    publishPost,
    toggleLike,
    addComment,
    deleteComment,
    getPostLikeCount,
    isPostLikedByUser,
    getPostComments,
    toggleBookmark,
  };
}

export default usePosts;

import { supabase } from '@/integrations/supabase/client';

export type Post = {
  id: string;
  user_id: string;
  audio_url: string;
  bpm: number | null;
  key: string | null;
  style: string;
  thumbnail_url: string | null;
  challenge_id: string | null;
  created_at: string;
};

export type PostWithReactions = Post & {
  reactions: {
    loves: number;
    comments: number;
    saves: number;
    shares: number;
  };
  user_has_loved: boolean;
};

export type FeedItem = {
  id: string;
  src: string;
  user: string;
  caption: string;
  thumbnail_url?: string;
  bpm?: number;
  key?: string;
  style?: string;
  loves: number;
  has_loved: boolean;
};

/**
 * Fetch posts for the feed with pagination
 */
export async function fetchPosts(page = 0, pageSize = 10): Promise<{ items: PostWithReactions[]; hasMore: boolean }> {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data: posts, error, count } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }

  if (!posts) {
    return { items: [], hasMore: false };
  }

  // Get current user ID
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserId = user?.id;

  // Fetch reactions for all posts
  const postIds = posts.map((p: Post) => p.id);
  const { data: reactions } = await supabase
    .from('reactions')
    .select('post_id, type, user_id')
    .in('post_id', postIds);

  // Transform posts to include reaction counts
  const postsWithReactions: PostWithReactions[] = posts.map((post: Post) => {
    const postReactions = reactions?.filter((r) => r.post_id === post.id) || [];

    return {
      ...post,
      reactions: {
        loves: postReactions.filter((r) => r.type === 'love').length,
        comments: postReactions.filter((r) => r.type === 'comment').length,
        saves: postReactions.filter((r) => r.type === 'save').length,
        shares: postReactions.filter((r) => r.type === 'share').length,
      },
      user_has_loved: postReactions.some((r) => r.type === 'love' && r.user_id === currentUserId),
    };
  });

  const hasMore = count ? (from + pageSize) < count : false;

  return { items: postsWithReactions, hasMore };
}

/**
 * Transform a Post to a FeedItem (for compatibility with existing UI)
 */
export function postToFeedItem(post: PostWithReactions): FeedItem {
  return {
    id: post.id,
    src: post.audio_url,
    user: `@user${post.user_id.slice(0, 8)}`, // TODO: Replace with actual username when users table is added
    caption: post.style || 'New drop',
    bpm: post.bpm || undefined,
    key: post.key || undefined,
    style: post.style || undefined,
    loves: post.reactions.loves,
    has_loved: post.user_has_loved,
  };
}

/**
 * Fetch feed items with pagination (compatible with existing API)
 */
export async function fetchFeedPage(page = 0, pageSize = 5): Promise<{ items: FeedItem[]; hasMore: boolean }> {
  try {
    const { items, hasMore } = await fetchPosts(page, pageSize);
    const feedItems = items.map(postToFeedItem);
    return { items: feedItems, hasMore };
  } catch (error) {
    console.error('Error fetching from Supabase, falling back to mock data:', error);
    // Fallback to mock data if Supabase fails
    return fetchMockFeedPage(page, pageSize);
  }
}

/**
 * Mock data fallback for when Supabase is not configured
 */
function fetchMockFeedPage(page = 0, pageSize = 5): Promise<{ items: FeedItem[]; hasMore: boolean }> {
  let counter = page * pageSize;
  const captions = ['Minimal drop', 'Tech-house groove', 'EDM pop hook', 'Deep house vibe', 'Bassline roller', 'Crunchy clap', 'Shimmer lead'];

  const items = Array.from({ length: pageSize }, () => {
    counter += 1;
    const id = String(counter);
    return {
      id,
      src: '/loops/demo_loop.mp3',
      user: `@demo${id}`,
      caption: captions[counter % captions.length] || 'New drop',
      loves: Math.floor(Math.random() * 100),
      has_loved: false
    };
  });
  return Promise.resolve({ items, hasMore: counter < 20 }); // Limit mock data to 20 items
}

/**
 * Toggle love reaction on a post
 */
export async function toggleLove(postId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User must be authenticated to react to posts');
    }

    // Check if user has already loved this post
    const { data: existingReaction } = await supabase
      .from('reactions')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .eq('type', 'love')
      .single();

    if (existingReaction) {
      // Remove the love
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .eq('type', 'love');

      if (error) throw error;
      return false; // Love removed
    } else {
      // Add the love
      const { error } = await supabase
        .from('reactions')
        .insert({
          post_id: postId,
          user_id: user.id,
          type: 'love',
        });

      if (error) throw error;
      return true; // Love added
    }
  } catch (error) {
    console.warn('Could not toggle love - Supabase not configured or user not authenticated:', error);
    // Return false to indicate no change when Supabase is not available
    throw error; // Re-throw so UI can show error message
  }
}

/**
 * Create a new post
 */
export async function createPost(data: {
  audio_url: string;
  bpm?: number;
  key?: string;
  style?: string;
  thumbnail_url?: string;
  challenge_id?: string;
}): Promise<Post> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User must be authenticated to create posts');
  }

  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      audio_url: data.audio_url,
      bpm: data.bpm,
      key: data.key,
      style: data.style || 'New drop',
      thumbnail_url: data.thumbnail_url,
      challenge_id: data.challenge_id,
    })
    .select()
    .single();

  if (error) throw error;
  return post;
}

/**
 * Get a single post by ID
 */
export async function getPost(postId: string): Promise<PostWithReactions | null> {
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  if (!post) return null;

  // Get current user ID
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserId = user?.id;

  // Fetch reactions for the post
  const { data: reactions } = await supabase
    .from('reactions')
    .select('type, user_id')
    .eq('post_id', postId);

  const postReactions = reactions || [];

  return {
    ...post,
    reactions: {
      loves: postReactions.filter((r) => r.type === 'love').length,
      comments: postReactions.filter((r) => r.type === 'comment').length,
      saves: postReactions.filter((r) => r.type === 'save').length,
      shares: postReactions.filter((r) => r.type === 'share').length,
    },
    user_has_loved: postReactions.some((r) => r.type === 'love' && r.user_id === currentUserId),
  };
}

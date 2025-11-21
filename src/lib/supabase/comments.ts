import { supabase } from '@/integrations/supabase/client'

export type Comment = {
  id: string
  post_id: string
  user_id: string
  body: string
  created_at: string
  updated_at: string
}

export type CommentWithProfile = Comment & {
  profile?: {
    username: string | null
    avatar_url: string | null
    display_name: string | null
  }
}

/**
 * Fetch comments for a post
 */
export async function getComments(postId: string): Promise<CommentWithProfile[]> {
  const { data: comments, error } = await supabase
    .from('comments')
    .select(`
      id,
      post_id,
      user_id,
      body,
      created_at,
      updated_at
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
    throw error
  }

  if (!comments || comments.length === 0) {
    return []
  }

  // Fetch profiles for all comment authors
  const userIds = [...new Set(comments.map(c => c.user_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, display_name')
    .in('id', userIds)

  // Create profile map
  const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])

  // Combine comments with profiles
  return comments.map(comment => ({
    ...comment,
    profile: profileMap.get(comment.user_id)
  }))
}

/**
 * Get comment count for a post
 */
export async function getCommentCount(postId: string): Promise<number> {
  const { count, error } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId)

  if (error) {
    console.error('Error counting comments:', error)
    return 0
  }

  return count || 0
}

/**
 * Get comment counts for multiple posts
 */
export async function getCommentCounts(postIds: string[]): Promise<Map<string, number>> {
  if (postIds.length === 0) {
    return new Map()
  }

  const { data: comments, error } = await supabase
    .from('comments')
    .select('post_id')
    .in('post_id', postIds)

  if (error) {
    console.error('Error fetching comment counts:', error)
    return new Map()
  }

  // Count comments per post
  const counts = new Map<string, number>()
  comments?.forEach(comment => {
    const current = counts.get(comment.post_id) || 0
    counts.set(comment.post_id, current + 1)
  })

  return counts
}

/**
 * Create a new comment
 */
export async function createComment(postId: string, body: string): Promise<Comment> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated to comment')
  }

  if (!body.trim()) {
    throw new Error('Comment body cannot be empty')
  }

  const { data: comment, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: user.id,
      body: body.trim()
    })
    .select(`
      id,
      post_id,
      user_id,
      body,
      created_at,
      updated_at
    `)
    .single()

  if (error) {
    console.error('Error creating comment:', error)
    throw error
  }

  return comment
}

/**
 * Update a comment
 */
export async function updateComment(commentId: string, body: string): Promise<Comment> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated to update comment')
  }

  if (!body.trim()) {
    throw new Error('Comment body cannot be empty')
  }

  const { data: comment, error } = await supabase
    .from('comments')
    .update({ body: body.trim() })
    .eq('id', commentId)
    .eq('user_id', user.id) // Ensure user owns the comment
    .select(`
      id,
      post_id,
      user_id,
      body,
      created_at,
      updated_at
    `)
    .single()

  if (error) {
    console.error('Error updating comment:', error)
    throw error
  }

  return comment
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated to delete comment')
  }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id) // Ensure user owns the comment

  if (error) {
    console.error('Error deleting comment:', error)
    throw error
  }
}

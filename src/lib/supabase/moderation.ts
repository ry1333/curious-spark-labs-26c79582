import { supabase } from '@/integrations/supabase/client'

export type ReportReason = 'spam' | 'inappropriate' | 'harassment' | 'copyright' | 'other'
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed'

export type Report = {
  id: string
  reporter_id: string
  reported_user_id: string | null
  post_id: string | null
  comment_id: string | null
  reason: ReportReason
  description: string | null
  status: ReportStatus
  moderator_id: string | null
  moderator_notes: string | null
  created_at: string
  updated_at: string
}

export type ReportWithDetails = Report & {
  reporter?: {
    username: string | null
    avatar_url: string | null
  }
  reported_user?: {
    username: string | null
    avatar_url: string | null
  }
  post?: {
    caption: string | null
    style: string | null
  }
  comment?: {
    body: string
  }
}

export type BlockedUser = {
  id: string
  blocker_id: string
  blocked_id: string
  created_at: string
}

/**
 * Report a post for moderation
 */
export async function reportPost(
  postId: string,
  reason: ReportReason,
  description?: string
): Promise<Report> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated to report content')
  }

  const { data: report, error } = await supabase
    .from('reports')
    .insert({
      reporter_id: user.id,
      post_id: postId,
      reason,
      description: description || null
    })
    .select(`
      id,
      reporter_id,
      reported_user_id,
      post_id,
      comment_id,
      reason,
      description,
      status,
      moderator_id,
      moderator_notes,
      created_at,
      updated_at
    `)
    .single()

  if (error) {
    console.error('Error creating report:', error)
    throw error
  }

  return report
}

/**
 * Report a comment for moderation
 */
export async function reportComment(
  commentId: string,
  reason: ReportReason,
  description?: string
): Promise<Report> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated to report content')
  }

  const { data: report, error } = await supabase
    .from('reports')
    .insert({
      reporter_id: user.id,
      comment_id: commentId,
      reason,
      description: description || null
    })
    .select(`
      id,
      reporter_id,
      reported_user_id,
      post_id,
      comment_id,
      reason,
      description,
      status,
      moderator_id,
      moderator_notes,
      created_at,
      updated_at
    `)
    .single()

  if (error) {
    console.error('Error creating report:', error)
    throw error
  }

  return report
}

/**
 * Report a user for moderation
 */
export async function reportUser(
  userId: string,
  reason: ReportReason,
  description?: string
): Promise<Report> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated to report users')
  }

  const { data: report, error } = await supabase
    .from('reports')
    .insert({
      reporter_id: user.id,
      reported_user_id: userId,
      reason,
      description: description || null
    })
    .select(`
      id,
      reporter_id,
      reported_user_id,
      post_id,
      comment_id,
      reason,
      description,
      status,
      moderator_id,
      moderator_notes,
      created_at,
      updated_at
    `)
    .single()

  if (error) {
    console.error('Error creating report:', error)
    throw error
  }

  return report
}

/**
 * Get all reports (admin only)
 */
export async function getReports(status?: ReportStatus): Promise<ReportWithDetails[]> {
  let query = supabase
    .from('reports')
    .select(`
      *,
      reporter:reporter_id (username, avatar_url),
      reported_user:reported_user_id (username, avatar_url),
      post:post_id (caption, style),
      comment:comment_id (body)
    `)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data: reports, error } = await query

  if (error) {
    console.error('Error fetching reports:', error)
    throw error
  }

  return reports as ReportWithDetails[]
}

/**
 * Update report status (admin only)
 */
export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  notes?: string
): Promise<Report> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated')
  }

  const { data: report, error } = await supabase
    .from('reports')
    .update({
      status,
      moderator_id: user.id,
      moderator_notes: notes || null
    })
    .eq('id', reportId)
    .select(`
      id,
      reporter_id,
      reported_user_id,
      post_id,
      comment_id,
      reason,
      description,
      status,
      moderator_id,
      moderator_notes,
      created_at,
      updated_at
    `)
    .single()

  if (error) {
    console.error('Error updating report:', error)
    throw error
  }

  return report
}

/**
 * Block a user
 */
export async function blockUser(userId: string): Promise<BlockedUser> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated to block users')
  }

  // Can't block yourself
  if (user.id === userId) {
    throw new Error('Cannot block yourself')
  }

  const { data: block, error } = await supabase
    .from('blocked_users')
    .insert({
      blocker_id: user.id,
      blocked_id: userId
    })
    .select()
    .single()

  if (error) {
    // Check if already blocked
    if (error.code === '23505') { // unique constraint violation
      throw new Error('User is already blocked')
    }
    console.error('Error blocking user:', error)
    throw error
  }

  return block
}

/**
 * Unblock a user
 */
export async function unblockUser(userId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated to unblock users')
  }

  const { error } = await supabase
    .from('blocked_users')
    .delete()
    .eq('blocker_id', user.id)
    .eq('blocked_id', userId)

  if (error) {
    console.error('Error unblocking user:', error)
    throw error
  }
}

/**
 * Check if current user has blocked another user
 */
export async function isUserBlocked(userId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data, error } = await supabase
    .from('blocked_users')
    .select('id')
    .eq('blocker_id', user.id)
    .eq('blocked_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error checking block status:', error)
    return false
  }

  return !!data
}

/**
 * Get list of blocked user IDs for current user
 */
export async function getBlockedUserIds(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: blocks, error } = await supabase
    .from('blocked_users')
    .select('blocked_id')
    .eq('blocker_id', user.id)

  if (error) {
    console.error('Error fetching blocked users:', error)
    return []
  }

  return blocks.map(b => b.blocked_id)
}

/**
 * Check if current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking admin status:', error)
    return false
  }

  return !!data
}

/**
 * Get report statistics (admin only)
 */
export async function getReportStats() {
  const { data: reports, error } = await supabase
    .from('reports')
    .select('status, reason')

  if (error) {
    console.error('Error fetching report stats:', error)
    throw error
  }

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    reviewed: reports.filter(r => r.status === 'reviewed').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    dismissed: reports.filter(r => r.status === 'dismissed').length,
    byReason: {
      spam: reports.filter(r => r.reason === 'spam').length,
      inappropriate: reports.filter(r => r.reason === 'inappropriate').length,
      harassment: reports.filter(r => r.reason === 'harassment').length,
      copyright: reports.filter(r => r.reason === 'copyright').length,
      other: reports.filter(r => r.reason === 'other').length
    }
  }

  return stats
}

/**
 * Delete a post (admin action)
 */
export async function deletePost(postId: string, reason: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated')
  }

  // Check if admin
  const adminStatus = await isAdmin()
  if (!adminStatus) {
    throw new Error('Only admins can delete posts')
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  if (error) {
    console.error('Error deleting post:', error)
    throw error
  }

  // Log the deletion (could add to a separate audit log table)
  console.log(`Post ${postId} deleted by admin ${user.id}. Reason: ${reason}`)
}

/**
 * Hide a post (soft delete - future enhancement)
 * This would set a 'hidden' flag instead of deleting
 */
export async function hidePost(postId: string): Promise<void> {
  // Future: Add 'hidden' column to posts table
  // For now, we'll just delete
  throw new Error('Hide post not yet implemented - use deletePost instead')
}

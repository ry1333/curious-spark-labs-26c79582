import { supabase } from '@/integrations/supabase/client'

export type Profile = {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  skill_level: string | null
  interests: string[] | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export type ProfileUpdate = {
  username?: string
  display_name?: string
  avatar_url?: string
  bio?: string
  skill_level?: string
  interests?: string[]
  onboarding_completed?: boolean
}

/**
 * Get the current user's profile
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

/**
 * Get a profile by user ID
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

/**
 * Get a profile by username
 */
export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (error) {
    console.error('Error fetching profile by username:', error)
    return null
  }

  return data
}

/**
 * Check if a username is available
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username.toLowerCase())
    .single()

  // If error and no data, username is available
  return !data && !!error
}

/**
 * Create a new profile (used during onboarding)
 */
export async function createProfile(profile: ProfileUpdate): Promise<Profile> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated to create profile')
  }

  // Ensure username is lowercase
  const normalizedProfile = {
    ...profile,
    username: profile.username?.toLowerCase()
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      ...normalizedProfile
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating profile:', error)
    throw error
  }

  return data
}

/**
 * Update the current user's profile
 */
export async function updateProfile(updates: ProfileUpdate): Promise<Profile> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated to update profile')
  }

  // Normalize username if provided
  if (updates.username) {
    updates.username = updates.username.toLowerCase()
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    throw error
  }

  return data
}

/**
 * Upload avatar image to Supabase Storage
 */
export async function uploadAvatar(file: File): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated to upload avatar')
  }

  const fileExt = file.name.split('.').pop() || 'jpg'
  const fileName = `${user.id}-${Date.now()}.${fileExt}`
  const filePath = `avatars/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('audio_files') // Reuse existing bucket or create 'avatars' bucket
    .upload(filePath, file, {
      upsert: true
    })

  if (uploadError) {
    console.error('Error uploading avatar:', uploadError)
    throw uploadError
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('audio_files')
    .getPublicUrl(filePath)

  return publicUrl
}

/**
 * Get user stats (posts count, followers, etc.)
 */
export async function getUserStats(userId: string) {
  // Get posts count
  const { count: postsCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Get total loves received on user's posts
  const { data: posts } = await supabase
    .from('posts')
    .select('id')
    .eq('user_id', userId)

  let lovesCount = 0
  if (posts && posts.length > 0) {
    const postIds = posts.map(p => p.id)
    const { count } = await supabase
      .from('reactions')
      .select('*', { count: 'exact', head: true })
      .in('post_id', postIds)
      .eq('type', 'love')

    lovesCount = count || 0
  }

  return {
    posts: postsCount || 0,
    loves: lovesCount,
    followers: 0, // TODO: Implement when followers feature is added
    following: 0  // TODO: Implement when followers feature is added
  }
}

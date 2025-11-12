import { hasSupabase } from './env'
import { fetchFeedPage as fetchSupabaseFeedPage, createPost as createSupabasePost } from './supabase/posts'

export type FeedItem = {
  id: string
  src: string
  user: string
  caption: string
  bpm?: number
  key?: string
  style?: string
  avatar_url?: string
  thumbnail_url?: string
  parent_post_id?: string
  loves?: number
  has_loved?: boolean
  comments?: number
}

let mockCounter = 0
const captions = ['Minimal drop','Tech-house groove','EDM pop hook','Deep house vibe','Bassline roller','Crunchy clap','Shimmer lead']

export async function fetchFeedPage(page = 0, pageSize = 5): Promise<{ items: FeedItem[]; hasMore: boolean }> {
  if (!hasSupabase) {
    const items: FeedItem[] = Array.from({ length: pageSize }, () => {
      mockCounter += 1
      const id = String(mockCounter)
      return { id, src: '/loops/demo_loop.mp3', user: `@demo${id}`, caption: captions[mockCounter % captions.length] || 'New drop', bpm: 120 + (mockCounter % 16) }
    })
    return { items, hasMore: mockCounter < 1000 }
  }

  // Use the robust implementation from posts.ts
  return fetchSupabaseFeedPage(page, pageSize)
}

export async function createPost(params: { audioUrl: string; caption?: string; bpm?: number; key?: string; style?: string; parent_post_id?: string }) {
  if (!hasSupabase) throw new Error('Supabase not configured')

  return createSupabasePost({
    audio_url: params.audioUrl,
    caption: params.caption,
    bpm: params.bpm,
    key: params.key,
    style: params.style,
    parent_post_id: params.parent_post_id
  })
}

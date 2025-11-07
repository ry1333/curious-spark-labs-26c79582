import { hasSupabase } from './env'
import { supabase } from './supabase'

export type FeedItem = { id: string; src: string; user: string; caption: string }

let mockCounter = 0
const captions = ['Minimal drop','Tech-house groove','EDM pop hook','Deep house vibe','Bassline roller','Crunchy clap','Shimmer lead']

export async function fetchFeedPage(page = 0, pageSize = 5): Promise<{ items: FeedItem[]; hasMore: boolean }> {
  if (!hasSupabase || !supabase) {
    const items: FeedItem[] = Array.from({ length: pageSize }, () => {
      mockCounter += 1
      const id = String(mockCounter)
      return { id, src: '/loops/demo_loop.mp3', user: `@demo${id}`, caption: captions[mockCounter % captions.length] || 'New drop' }
    })
    return { items, hasMore: mockCounter < 1000 }
  }
  const from = page * pageSize, to = from + pageSize - 1
  const { data, error } = await supabase
    .from('posts')
    .select('id,audio_url,caption,created_at')
    .order('created_at', { ascending: false })
    .range(from, to)
  if (error) throw error
  const items = (data ?? []).map((r: any) => ({ id: r.id, src: r.audio_url, user: '@user', caption: r.caption ?? '' }))
  return { items, hasMore: (data?.length ?? 0) === pageSize }
}

export async function createPost(params: { audioUrl: string; caption?: string }) {
  if (!hasSupabase || !supabase) throw new Error('Supabase not configured')
  const user = (await supabase.auth.getUser()).data.user
  if (!user) throw new Error('Not signed in')
  const { data, error } = await supabase
    .from('posts')
    .insert({ user_id: user.id, audio_url: params.audioUrl, caption: params.caption ?? '' })
    .select('id')
    .single()
  if (error) throw error
  return data
}

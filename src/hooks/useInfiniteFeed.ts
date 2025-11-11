import { useEffect, useRef, useState } from 'react'
type PageFn<T> = (page: number) => Promise<{ items: T[]; hasMore: boolean }>
export function useInfiniteFeed<T>(fetchPage: PageFn<T>) {
  const [items, setItems] = useState<T[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const loadMore = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const res = await fetchPage(page)
      setItems((prev) => [...prev, ...res.items])
      setHasMore(res.hasMore)
      setPage((p) => p + 1)
    } catch (error) {
      console.error('Error loading feed page:', error)
      setHasMore(false) // Stop trying to load more on error
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { loadMore() }, []) // first page
  useEffect(() => {
    if (!sentinelRef.current) return
    const obs = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && loadMore()), { rootMargin: '600px' })
    obs.observe(sentinelRef.current)
    return () => obs.disconnect()
  }, [sentinelRef.current, hasMore, loading])
  return { items, hasMore, loading, sentinelRef }
}

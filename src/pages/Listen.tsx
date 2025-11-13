import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionRail from '../components/ActionRail'
import FeedCard from '../components/FeedCard'
import { useSnapAutoplay } from '../hooks/useSnapAutoplay'

const posts = [
  {
    id: '1',
    src: '/loops/deep_house_124.wav',
    user: '@deepvibes',
    caption: 'Deep house rollers',
    bpm: 124,
    genre: 'House',
    loves: 342,
    comments: 28
  },
  {
    id: '2',
    src: '/loops/tech_groove_128.wav',
    user: '@technoking',
    caption: 'Late night tech groove',
    bpm: 128,
    genre: 'Techno',
    loves: 856,
    comments: 93
  },
  {
    id: '3',
    src: '/loops/lofi_chill_80.wav',
    user: '@chillbeats',
    caption: 'Lo-fi study session',
    bpm: 80,
    genre: 'Lo-Fi',
    loves: 1203,
    comments: 47
  },
  {
    id: '4',
    src: '/loops/hiphop_beat_90.wav',
    user: '@beatsbymo',
    caption: 'Boom bap classic',
    bpm: 90,
    genre: 'Hip-Hop',
    loves: 567,
    comments: 81
  },
  {
    id: '5',
    src: '/loops/edm_drop_128.wav',
    user: '@festivalvibes',
    caption: 'Festival drop incoming',
    bpm: 128,
    genre: 'EDM',
    loves: 2104,
    comments: 156
  },
]

export default function Listen() {
  const nav = useNavigate()
  const feedRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!feedRef.current) return
    // prevent iOS rubber-band overscroll feel
    feedRef.current.addEventListener('touchmove', () => {}, { passive: true })
  }, [])
  useSnapAutoplay(feedRef.current)

  return (
    <div
      ref={feedRef}
      className="tiktok-feed h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-ink text-text select-none"
    >
      {posts.map((p) => (
        <section
          key={p.id}
          data-post
          className="h-screen snap-start relative"
        >
          <FeedCard
            id={p.id}
            src={p.src}
            user={p.user}
            caption={p.caption}
            bpm={p.bpm}
            genre={p.genre}
            loves={p.loves}
            comments={p.comments}
          />
          <ActionRail
            onRemix={() => nav(`/dj?remix=${p.id}`)}
            loves={p.loves}
            comments={p.comments}
          />
        </section>
      ))}
    </div>
  )
}

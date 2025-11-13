import { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'

type FeedCardProps = {
  id: string
  src: string
  user: string
  avatar?: string
  caption: string
  bpm?: number
  genre?: string
  duration?: string
  loves?: number
  comments?: number
  hasLoved?: boolean
}

export default function FeedCard({
  src,
  user,
  avatar,
  caption,
  bpm,
  genre,
  duration = '0:30',
  loves = 0,
  comments = 0,
  hasLoved = false
}: FeedCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [hasError, setHasError] = useState(false)

  // Generate stable waveform heights
  const waveformHeights = useRef(
    Array.from({ length: 40 }, () => Math.random() * 100)
  ).current

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        const percent = (audio.currentTime / audio.duration) * 100
        setProgress(percent || 0)

        const minutes = Math.floor(audio.currentTime / 60)
        const seconds = Math.floor(audio.currentTime % 60)
        setCurrentTime(`${minutes}:${seconds.toString().padStart(2, '0')}`)
      }
    }

    const handleEnded = () => setIsPlaying(false)
    const handleError = (e: Event) => {
      console.error('Audio error:', e, 'Source:', src)
      setIsPlaying(false)
      setHasError(true)
    }

    const handleLoadedData = () => {
      setHasError(false)
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('loadeddata', handleLoadedData)

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [src])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        await audio.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('Audio playback error:', error)
      setIsPlaying(false)
    }
  }

  return (
    <div className="relative h-full w-full flex items-end justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-surface to-ink" />

      {/* Content card - centered */}
      <div className="relative w-full max-w-md mx-auto mb-32 md:mb-20 px-4 z-10">
        <div className="rounded-2xl border border-line bg-card/80 backdrop-blur-xl overflow-hidden shadow-2xl">
          {/* Media area - 16:9 aspect */}
          <div className="relative aspect-video bg-gradient-to-br from-surface via-ink to-surface flex items-center justify-center overflow-hidden">
            {/* Vinyl Record */}
            <div className="relative">
              {/* Vinyl disc */}
              <div className={`relative w-48 h-48 rounded-full bg-gradient-to-br from-ink via-surface to-ink shadow-inner-glow ${isPlaying ? 'animate-vinyl-spin' : ''}`}>
                {/* Grooves */}
                <div className="absolute inset-4 rounded-full border-2 border-white/5" />
                <div className="absolute inset-8 rounded-full border-2 border-white/5" />
                <div className="absolute inset-12 rounded-full border-2 border-white/5" />

                {/* Label */}
                <div className="absolute inset-16 rounded-full bg-gradient-to-br from-cyan to-magenta flex items-center justify-center shadow-glow-cyan">
                  <div className="text-xs font-bold text-ink text-center">
                    RMXR
                  </div>
                </div>

                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-ink border-2 border-cyan shadow-glow-cyan" />

                {/* Reflection effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 via-transparent to-transparent" />
              </div>

              {/* Glow effect when playing */}
              {isPlaying && (
                <div className="absolute inset-0 rounded-full bg-cyan/20 blur-2xl animate-pulse-ring" />
              )}
            </div>

            {/* Waveform bars around vinyl */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-end gap-0.5 h-12">
              {waveformHeights.slice(0, 20).map((height, i) => (
                <div
                  key={i}
                  className={`w-1 bg-gradient-to-t from-cyan to-magenta rounded-full transition-all duration-150 ${isPlaying ? 'animate-wave' : ''}`}
                  style={{
                    height: `${height * 0.5}%`,
                    opacity: i / 20 < progress / 100 ? 1 : 0.3,
                    animationDelay: `${i * 50}ms`
                  }}
                />
              ))}
            </div>

            {/* Play/Pause Button - floating over vinyl */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors group"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan to-magenta flex items-center justify-center shadow-glow-cyan-strong group-hover:scale-110 group-active:scale-95 transition-all">
                {hasError ? (
                  <svg className="w-10 h-10 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : isPlaying ? (
                  <svg className="w-10 h-10 text-ink" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-ink ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
                {/* Ripple effect on click */}
                <div className="absolute inset-0 rounded-full bg-white/30 scale-0 group-active:scale-150 opacity-0 group-active:opacity-100 transition-all duration-300" />
              </div>
            </button>

            {/* Error message */}
            {hasError && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full glass border border-red-500/30 text-red-400 text-xs font-medium shadow-lg">
                Audio file not found or corrupted
              </div>
            )}
          </div>

          {/* Footer with metadata */}
          <div className="p-4 space-y-3">
            {/* User info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-line">
                <AvatarImage src={avatar} />
                <AvatarFallback className="bg-surface text-text">
                  {user.charAt(1)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-text text-sm">{user}</div>
                <div className="text-muted text-xs truncate">{caption}</div>
              </div>
            </div>

            {/* Metadata pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {bpm && (
                <Badge variant="outline" className="rounded-full px-2.5 py-1 text-xs border-line bg-surface/50 text-muted">
                  {bpm} BPM
                </Badge>
              )}
              {genre && (
                <Badge variant="outline" className="rounded-full px-2.5 py-1 text-xs border-line bg-surface/50 text-muted">
                  {genre}
                </Badge>
              )}
              <Badge variant="outline" className="rounded-full px-2.5 py-1 text-xs border-line bg-surface/50 text-muted">
                {currentTime} / {duration}
              </Badge>
            </div>

            {/* Progress bar */}
            <div className="relative h-1 bg-line rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan to-magenta rounded-full transition-all shadow-glow-cyan"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  )
}

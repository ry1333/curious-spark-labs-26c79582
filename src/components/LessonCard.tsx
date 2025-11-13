import { LucideIcon, Headphones, Gamepad2, Check } from 'lucide-react'

type LessonCardProps = {
  title: string
  minutes: string
  level: 'beginner' | 'intermediate' | 'advanced'
  outcome: string
  icon?: LucideIcon
  tags?: string[]
  progress?: number
  thumbnailUrl?: string
  isResume?: boolean
  isCompleted?: boolean
  hasChallenge?: boolean
  onClick: () => void
}

const levelStyles = {
  beginner: 'border-emerald-400/20 text-emerald-300/90',
  intermediate: 'border-yellow-400/20 text-yellow-300/90',
  advanced: 'border-red-400/20 text-red-300/90'
}

export function LessonCard({
  title,
  minutes,
  level,
  outcome,
  icon: Icon = Headphones,
  tags = [],
  progress = 0,
  thumbnailUrl,
  isResume,
  isCompleted,
  hasChallenge,
  onClick
}: LessonCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl border border-line bg-card hover:border-line/50 transition-all hover:scale-[1.02] cursor-pointer"
    >
      <div className="p-4">
        {/* Thumbnail area */}
        <div className="aspect-[16/9] overflow-hidden rounded-xl border border-line bg-black/30 relative">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-accentFrom/10 to-accentTo/10 flex items-center justify-center">
              <Icon size={48} className="text-accentFrom opacity-50" strokeWidth={1.5} />
            </div>
          )}
          {/* Top-right badges */}
          {isCompleted && (
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg">
              <Check size={14} strokeWidth={3} />
            </div>
          )}
          {!isCompleted && hasChallenge && (
            <div className="absolute top-2 right-2 p-1.5 rounded-full bg-purple-500/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Gamepad2 size={14} className="text-white" strokeWidth={2.5} />
            </div>
          )}
        </div>

        {/* Meta row */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className={`text-[11px] rounded-full border px-2 py-0.5 ${levelStyles[level]}`}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </span>
          <span className="text-[11px] text-muted">{minutes}</span>
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[11px] rounded-full border border-line text-muted px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
          {progress > 0 && (
            <div className="ml-auto h-2 w-16 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accentFrom to-accentTo transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Title and outcome */}
        <h3 className="mt-2 text-lg font-semibold text-text group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accentFrom group-hover:to-accentTo transition-all">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted line-clamp-2 leading-relaxed">{outcome}</p>

        {/* Action buttons */}
        <div className="mt-3 flex items-center gap-2">
          <button className="rounded-lg bg-gradient-to-r from-accentFrom to-accentTo text-ink text-sm font-bold px-3 py-1.5 hover:scale-105 transition-transform">
            {isResume ? 'Resume' : 'Start'} →
          </button>
          <button className="rounded-lg border border-line text-sm text-text px-3 py-1.5 hover:bg-white/5 transition-colors">
            Preview
          </button>
        </div>
      </div>
    </div>
  )
}

import { LucideIcon } from 'lucide-react'
import { GradientButton } from './ui/gradient-button'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      {/* Animated icon container */}
      <div className="relative mb-6 animate-float">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accentFrom/10 to-accentTo/10 border border-line flex items-center justify-center">
          <Icon className="w-12 h-12 text-accentFrom" strokeWidth={1.5} />
        </div>
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full border-2 border-accentFrom/20 animate-pulse-ring" />
        <div className="absolute inset-0 rounded-full border-2 border-accentTo/20 animate-pulse-ring" style={{ animationDelay: '1s' }} />
      </div>

      <h3 className="text-2xl font-bold gradient-text mb-2">{title}</h3>
      <p className="text-muted text-sm max-w-md leading-relaxed mb-8">{description}</p>

      {actionLabel && onAction && (
        <GradientButton onClick={onAction} size="lg" className="shadow-neon-cyan hover:shadow-neon-magenta transition-all">
          {actionLabel}
        </GradientButton>
      )}
    </div>
  )
}

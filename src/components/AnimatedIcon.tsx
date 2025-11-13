import { LucideIcon } from 'lucide-react'
import { cn } from '../lib/utils'

type AnimatedIconProps = {
  icon: LucideIcon
  size?: number
  className?: string
  animation?: 'pulse' | 'spin' | 'bounce' | 'heartbeat' | 'float' | 'none'
  gradient?: boolean
  badge?: number | boolean
  badgeColor?: 'cyan' | 'magenta' | 'emerald' | 'red'
  onClick?: () => void
}

export function AnimatedIcon({
  icon: Icon,
  size = 20,
  className = '',
  animation = 'none',
  gradient = false,
  badge,
  badgeColor = 'cyan',
  onClick
}: AnimatedIconProps) {
  const animationClasses = {
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    bounce: 'animate-bounce',
    heartbeat: 'animate-heartbeat',
    float: 'animate-float',
    none: ''
  }

  const badgeColorClasses = {
    cyan: 'bg-accentFrom text-ink',
    magenta: 'bg-accentTo text-ink',
    emerald: 'bg-emerald-500 text-white',
    red: 'bg-red-500 text-white'
  }

  return (
    <div className="relative inline-block" onClick={onClick}>
      <Icon
        size={size}
        strokeWidth={2}
        className={cn(
          animationClasses[animation],
          gradient && 'text-accentFrom',
          'transition-all duration-300',
          className
        )}
      />
      {/* Gradient glow effect */}
      {gradient && (
        <div className="absolute inset-0 bg-accentFrom/30 blur-md rounded-full -z-10" />
      )}

      {/* Notification badge */}
      {badge !== undefined && badge !== false && (
        <div className={cn(
          'absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[10px] font-bold px-1',
          badgeColorClasses[badgeColor],
          'shadow-lg animate-pulse'
        )}>
          {typeof badge === 'number' ? (badge > 99 ? '99+' : badge) : ''}
        </div>
      )}
    </div>
  )
}

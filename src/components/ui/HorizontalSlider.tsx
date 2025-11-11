import { useRef } from 'react'

type Props = {
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  label?: string
  unit?: string
  showValue?: boolean
  accentColor?: 'cyan' | 'magenta'
}

export default function HorizontalSlider({
  value,
  min,
  max,
  step = 0.5,
  onChange,
  label,
  unit = '',
  showValue = true,
  accentColor = 'magenta'
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null)

  // Calculate percentage (handle negative ranges)
  const range = max - min
  const normalizedValue = value - min
  const percentage = (normalizedValue / range) * 100
  const zeroPercentage = min < 0 ? ((-min) / range) * 100 : 0

  const updateFromPosition = (clientX: number) => {
    if (!trackRef.current) return

    const rect = trackRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left))
    const newPercentage = x / rect.width
    const newValue = min + (newPercentage * range)
    const steppedValue = Math.round(newValue / step) * step
    onChange(Math.max(min, Math.min(max, steppedValue)))
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!trackRef.current) return
    trackRef.current.setPointerCapture(e.pointerId)
    updateFromPosition(e.clientX)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return
    updateFromPosition(e.clientX)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!trackRef.current) return
    trackRef.current.releasePointerCapture(e.pointerId)
  }

  const accentColors = {
    cyan: 'bg-cyan-400',
    magenta: 'bg-accent'
  }

  const accentGlow = {
    cyan: 'shadow-[0_0_10px_rgba(34,211,238,0.5)]',
    magenta: 'shadow-[0_0_10px_rgba(225,29,132,0.5)]'
  }

  const formatValue = (val: number) => {
    if (unit === 'dB') {
      return val > 0 ? `+${val.toFixed(1)}${unit}` : `${val.toFixed(1)}${unit}`
    }
    if (unit === 'Hz') {
      if (val >= 1000) return `${(val / 1000).toFixed(1)}k Hz`
      return `${val.toFixed(0)} Hz`
    }
    return `${val.toFixed(1)}${unit}`
  }

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Label */}
      {label && (
        <div className="text-[10px] text-muted uppercase tracking-wider font-semibold w-12">
          {label}
        </div>
      )}

      {/* Slider Track Container */}
      <div className="flex-1 flex items-center gap-3">
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative h-8 flex-1 cursor-pointer select-none"
          style={{ touchAction: 'none' }}
        >
          {/* Track Background - Dark with subtle gradient */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#1a1a24] to-[#0a0a0f] shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)] border border-white/5" />

          {/* Active Fill - from zero or min */}
          <div
            className={`absolute top-0 bottom-0 rounded-full transition-all ${accentColors[accentColor]} opacity-40`}
            style={{
              left: `${Math.min(zeroPercentage, percentage)}%`,
              right: `${100 - Math.max(zeroPercentage, percentage)}%`
            }}
          />

          {/* Zero Center Line (if range includes 0) */}
          {min < 0 && max > 0 && (
            <div
              className="absolute top-0 bottom-0 w-px bg-white/20"
              style={{ left: `${zeroPercentage}%` }}
            />
          )}

          {/* Knob/Thumb - Pink circular knob */}
          <div
            className="absolute top-1/2 -translate-y-1/2 transition-all"
            style={{ left: `calc(${percentage}% - 14px)` }}
          >
            <div className={`w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 via-accent to-pink-600 ${accentGlow[accentColor]} shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] border border-pink-300/20`}>
              {/* Center dot indicator */}
              <div className="w-full h-full rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Value Display */}
        {showValue && (
          <div className="text-xs font-mono font-bold text-accent-400 w-16 text-right">
            {formatValue(value)}
          </div>
        )}
      </div>
    </div>
  )
}

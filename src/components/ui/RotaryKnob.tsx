import { useRef } from 'react'

type Props = {
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  label?: string
  unit?: string
  size?: number
  accentColor?: 'cyan' | 'magenta' | 'neutral'
}

export default function RotaryKnob({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  unit = '',
  size = 64,
  accentColor = 'magenta'
}: Props) {
  const knobRef = useRef<HTMLDivElement>(null)
  const startY = useRef<number>(0)
  const startValue = useRef<number>(0)

  // Calculate rotation angle (-135deg to +135deg = 270deg range)
  const percentage = (value - min) / (max - min)
  const angle = -135 + (percentage * 270)

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!knobRef.current) return
    knobRef.current.setPointerCapture(e.pointerId)
    startY.current = e.clientY
    startValue.current = value
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return

    const deltaY = startY.current - e.clientY
    const sensitivity = 0.5
    const range = max - min
    const change = (deltaY * sensitivity * range) / 100

    const newValue = startValue.current + change
    const steppedValue = Math.round(newValue / step) * step
    onChange(Math.max(min, Math.min(max, steppedValue)))
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!knobRef.current) return
    knobRef.current.releasePointerCapture(e.pointerId)
  }

  const accentColors = {
    cyan: '#22d3ee',
    magenta: '#E11D84',
    neutral: '#a1a1aa'
  }

  const formatValue = (val: number) => {
    if (val > 0) return `+${val.toFixed(1)}${unit}`
    return `${val.toFixed(1)}${unit}`
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Knob */}
      <div
        ref={knobRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative cursor-pointer select-none"
        style={{ width: size, height: size, touchAction: 'none' }}
      >
        {/* SVG Knob with gradients */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="transform transition-transform duration-75"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <defs>
            {/* Metallic gradient */}
            <radialGradient id="knobGradient" cx="30%" cy="30%">
              <stop offset="0%" stopColor="#444" />
              <stop offset="50%" stopColor="#333" />
              <stop offset="100%" stopColor="#222" />
            </radialGradient>
            {/* Highlight gradient */}
            <radialGradient id="highlightGradient" cx="30%" cy="20%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>

          {/* Main knob body */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="url(#knobGradient)"
            stroke="rgba(0,0,0,0.5)"
            strokeWidth="2"
          />

          {/* Highlight overlay */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="url(#highlightGradient)"
          />

          {/* Position indicator line */}
          <line
            x1="50"
            y1="15"
            x2="50"
            y2="35"
            stroke={accentColors[accentColor]}
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 4px ${accentColors[accentColor]})`
            }}
          />

          {/* Center dot */}
          <circle
            cx="50"
            cy="50"
            r="8"
            fill="rgba(0,0,0,0.6)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        </svg>

        {/* Subtle outer glow */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: `0 0 20px rgba(${accentColor === 'magenta' ? '225,29,132' : accentColor === 'cyan' ? '34,211,238' : '161,161,170'},0.3)`
          }}
        />
      </div>

      {/* Value Display */}
      <div className="text-xs font-mono font-bold text-accent-400">
        {formatValue(value)}
      </div>

      {/* Label */}
      {label && (
        <div className="text-[9px] text-muted uppercase tracking-wider font-semibold">
          {label}
        </div>
      )}
    </div>
  )
}

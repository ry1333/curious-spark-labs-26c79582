import { useState } from 'react'

type Props = {
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  unit?: string
  color?: 'cyan' | 'magenta' | 'purple'
  vertical?: boolean
}

export default function CustomSlider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  unit = '',
  color = 'cyan',
  vertical = false
}: Props) {
  const [isDragging, setIsDragging] = useState(false)

  const percentage = ((value - min) / (max - min)) * 100

  const colorClasses = {
    cyan: {
      track: 'from-cyan-500/30 to-cyan-400/30',
      fill: 'from-cyan-500 to-cyan-400',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.5)]',
      thumb: 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.8)]'
    },
    magenta: {
      track: 'from-fuchsia-500/30 to-pink-500/30',
      fill: 'from-fuchsia-500 to-pink-500',
      glow: 'shadow-[0_0_15px_rgba(217,70,239,0.5)]',
      thumb: 'border-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.8)]'
    },
    purple: {
      track: 'from-purple-500/30 to-pink-500/30',
      fill: 'from-purple-500 to-pink-500',
      glow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]',
      thumb: 'border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.8)]'
    }
  }

  const colors = colorClasses[color]

  return (
    <div className={`mb-2 ${vertical ? 'flex flex-col items-center' : ''}`}>
      <div className={`flex justify-between text-xs opacity-60 mb-1 ${vertical ? 'flex-col-reverse items-center gap-1' : ''}`}>
        <span className="font-medium">{label}</span>
        <span className="font-mono">{value.toFixed(1)}{unit}</span>
      </div>

      <div className={`relative ${vertical ? 'h-full' : 'w-full'}`}>
        {/* Track background */}
        <div className={`
          absolute inset-0 rounded-full
          bg-gradient-to-r ${colors.track}
          border border-white/10
          ${vertical ? 'w-2' : 'h-2'}
        `} />

        {/* Filled track */}
        <div
          className={`
            absolute rounded-full
            bg-gradient-to-r ${colors.fill}
            ${isDragging ? colors.glow : ''}
            transition-shadow duration-200
            ${vertical ? 'w-2 bottom-0' : 'h-2 left-0'}
          `}
          style={{
            [vertical ? 'height' : 'width']: `${percentage}%`
          }}
        />

        {/* Thumb */}
        <div
          className={`
            absolute top-1/2 -translate-y-1/2
            w-4 h-4 rounded-full
            bg-white border-2 ${colors.thumb}
            ${isDragging ? 'scale-125' : 'scale-100'}
            transition-all duration-200
            pointer-events-none
          `}
          style={{
            [vertical ? 'bottom' : 'left']: `calc(${percentage}% - 8px)`,
            ...(vertical && { top: 'auto', transform: 'translateX(-50%)' })
          }}
        />

        {/* Hidden input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className={`
            absolute inset-0 w-full h-full opacity-0 cursor-pointer
            ${vertical ? '[writing-mode:bt-lr]' : ''}
          `}
        />
      </div>
    </div>
  )
}

import { useEffect } from 'react'

type Props = {
  loopLength: number // in beats: 1, 2, 4, 8, 16
  isLoopActive: boolean
  onLengthChange: (length: number) => void
  onToggle: () => void
  enableKeyboard?: boolean
}

export default function LoopCluster({
  loopLength,
  isLoopActive,
  onLengthChange,
  onToggle,
  enableKeyboard = true
}: Props) {

  const halveLength = () => {
    if (loopLength > 1) {
      onLengthChange(loopLength / 2)
    }
  }

  const doubleLength = () => {
    if (loopLength < 16) {
      onLengthChange(loopLength * 2)
    }
  }

  // Keyboard shortcuts: Q = halve, W = double, L = toggle
  useEffect(() => {
    if (!enableKeyboard) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case 'q':
          e.preventDefault()
          halveLength()
          break
        case 'w':
          e.preventDefault()
          doubleLength()
          break
        case 'l':
          e.preventDefault()
          onToggle()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [loopLength, enableKeyboard])

  const loopSizes = [1, 2, 4, 8, 16]

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-semibold text-muted uppercase tracking-wider">
          Loop Controls
        </div>
        {isLoopActive && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-magenta animate-pulse shadow-glow-magenta" />
            <span className="text-[9px] text-magenta font-bold">ACTIVE</span>
          </div>
        )}
      </div>

      {/* Quick Loop Size Buttons */}
      <div className="grid grid-cols-5 gap-1">
        {loopSizes.map((size) => (
          <button
            key={size}
            onClick={() => onLengthChange(size)}
            className={`
              py-2 rounded-lg text-xs font-bold transition-all
              ${loopLength === size
                ? 'bg-magenta text-ink border-2 border-magenta shadow-glow-magenta'
                : 'bg-black/40 border border-white/10 text-muted hover:text-text hover:border-magenta/50'
              }
            `}
            title={`${size} beat loop`}
          >
            {size}
          </button>
        ))}
      </div>

      {/* Main Controls Row */}
      <div className="flex items-center gap-2">
        {/* Halve button */}
        <button
          onClick={halveLength}
          disabled={loopLength <= 1}
          className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-muted hover:text-text hover:border-magenta/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs font-bold"
          title="Halve loop length (Q)"
        >
          1/2
        </button>

        {/* Loop toggle button - Large and prominent */}
        <button
          onClick={onToggle}
          className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${
            isLoopActive
              ? 'bg-gradient-to-r from-magenta to-pink-500 text-ink border-2 border-magenta shadow-[0_0_20px_rgba(225,29,132,0.6)] scale-105'
              : 'bg-black/40 border-2 border-white/10 text-text hover:border-magenta hover:bg-black/60'
          }`}
          title="Toggle loop (L)"
        >
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span className="text-lg">{loopLength}</span>
            </div>
            <span className="text-[9px] opacity-80">
              {isLoopActive ? 'LOOPING' : 'beats'}
            </span>
          </div>
        </button>

        {/* Double button */}
        <button
          onClick={doubleLength}
          disabled={loopLength >= 16}
          className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-muted hover:text-text hover:border-magenta/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs font-bold"
          title="Double loop length (W)"
        >
          2×
        </button>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="text-[8px] text-muted text-center">
        Q: 1/2 • W: 2× • L: Toggle • 1-5: Quick sizes
      </div>
    </div>
  )
}

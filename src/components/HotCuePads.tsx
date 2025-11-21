import { useState } from 'react'

type HotCue = {
  id: number
  time: number
  color: string
  label?: string
}

type Props = {
  deck: any
  onCueSet?: (cueId: number, time: number) => void
  onCueTrigger?: (cueId: number) => void
  onCueDelete?: (cueId: number) => void
}

const CUE_COLORS = [
  '#FF5252', // Red
  '#FF9800', // Orange
  '#FFEB3B', // Yellow
  '#4CAF50', // Green
  '#00BCD4', // Cyan
  '#2196F3', // Blue
  '#9C27B0', // Purple
  '#E91E63', // Pink
]

export default function HotCuePads({ deck, onCueSet, onCueTrigger, onCueDelete }: Props) {
  const [hotCues, setHotCues] = useState<Map<number, HotCue>>(new Map())
  const [holdingCue, setHoldingCue] = useState<number | null>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCueClick = (cueId: number) => {
    const cue = hotCues.get(cueId)

    if (cue) {
      // Trigger existing cue - jump to position
      deck.seek(cue.time)
      if (onCueTrigger) onCueTrigger(cueId)
    } else {
      // Set new cue at current position
      const currentTime = deck.currentTime || 0
      const newCue: HotCue = {
        id: cueId,
        time: currentTime,
        color: CUE_COLORS[cueId - 1],
        label: `CUE ${cueId}`
      }

      setHotCues(new Map(hotCues.set(cueId, newCue)))
      if (onCueSet) onCueSet(cueId, currentTime)
    }
  }

  const handleCueLongPress = (cueId: number) => {
    // Delete cue on long press
    const newCues = new Map(hotCues)
    newCues.delete(cueId)
    setHotCues(newCues)
    if (onCueDelete) onCueDelete(cueId)
  }

  const handlePointerDown = (cueId: number) => {
    setHoldingCue(cueId)
    // Set timeout for long press detection (800ms)
    const timer = setTimeout(() => {
      handleCueLongPress(cueId)
      setHoldingCue(null)
    }, 800)

    // Store timer on window for cleanup
    ;(window as any)[`hotCueTimer_${cueId}`] = timer
  }

  const handlePointerUp = (cueId: number) => {
    // Clear long press timer
    const timer = (window as any)[`hotCueTimer_${cueId}`]
    if (timer) {
      clearTimeout(timer)
      delete (window as any)[`hotCueTimer_${cueId}`]
    }

    // If it was a quick press, trigger the cue
    if (holdingCue === cueId) {
      handleCueClick(cueId)
    }
    setHoldingCue(null)
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase text-muted font-semibold tracking-wider">
          Hot Cues
        </div>
        <div className="text-[8px] text-muted">
          Long press to delete
        </div>
      </div>

      {/* Hot Cue Grid: 4×2 */}
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((cueId) => {
          const cue = hotCues.get(cueId)
          const isSet = !!cue
          const isHolding = holdingCue === cueId

          return (
            <button
              key={cueId}
              onPointerDown={() => handlePointerDown(cueId)}
              onPointerUp={() => handlePointerUp(cueId)}
              onPointerLeave={() => {
                // Cancel if pointer leaves while holding
                const timer = (window as any)[`hotCueTimer_${cueId}`]
                if (timer) {
                  clearTimeout(timer)
                  delete (window as any)[`hotCueTimer_${cueId}`]
                }
                setHoldingCue(null)
              }}
              disabled={!deck.buffer}
              className={`
                relative aspect-square rounded-lg border-2 transition-all
                flex flex-col items-center justify-center gap-1 p-2
                ${isSet
                  ? `border-[${cue.color}] bg-gradient-to-br shadow-[0_0_12px_${cue.color}40]`
                  : 'border-dashed border-white/10 hover:border-white/30 bg-black/20'
                }
                ${isHolding ? 'scale-95 brightness-75' : 'hover:scale-105 active:scale-95'}
                disabled:opacity-30 disabled:cursor-not-allowed
              `}
              style={isSet ? {
                borderColor: cue.color,
                backgroundColor: `${cue.color}15`,
                boxShadow: `0 0 12px ${cue.color}40, inset 0 1px 0 rgba(255,255,255,0.1)`
              } : undefined}
              title={isSet ? `${cue.label} at ${formatTime(cue.time)}` : `Set cue ${cueId}`}
            >
              {/* Cue Number */}
              <div
                className={`text-lg font-bold font-mono ${isSet ? 'text-white' : 'text-white/40'}`}
                style={isSet ? { color: cue.color, textShadow: `0 0 8px ${cue.color}` } : undefined}
              >
                {cueId}
              </div>

              {/* Time Display */}
              {isSet && (
                <div className="text-[9px] font-mono text-white/80">
                  {formatTime(cue.time)}
                </div>
              )}

              {/* Active Indicator */}
              {isSet && (
                <div
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse"
                  style={{
                    backgroundColor: cue.color,
                    boxShadow: `0 0 6px ${cue.color}`
                  }}
                />
              )}

              {/* Long Press Progress */}
              {isHolding && (
                <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-red-500/30 animate-[fadeIn_0.8s_ease-out]" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Quick Info */}
      <div className="text-[8px] text-muted text-center">
        {hotCues.size === 0
          ? 'Click to set cue points at current position'
          : `${hotCues.size}/8 cues set`
        }
      </div>
    </div>
  )
}

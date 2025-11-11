import { useState } from 'react'

type Props = {
  label: string
  deck: any
  color: 'orange' | 'red'
  playing: boolean
  fileName: string
  bpm: number
  onBpmChange: (bpm: number) => void
  onLoad: (file: File) => void
  onPlay: () => void
  onPause: () => void
  onCue: () => void
}

export default function DeckControls({
  label,
  deck,
  color,
  playing,
  fileName,
  bpm,
  onBpmChange,
  onLoad,
  onPlay,
  onPause,
  onCue
}: Props) {
  const [pitch, setPitch] = useState(0)

  const handlePitchChange = (value: number) => {
    setPitch(value)
    deck.setRate(1 + value / 100)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onLoad(file)
  }

  const colorMap = {
    orange: {
      border: 'border-orange-500/30',
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      playBtn: 'bg-gradient-to-br from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700',
      slider: 'from-orange-500 to-orange-400'
    },
    red: {
      border: 'border-red-500/30',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      playBtn: 'bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700',
      slider: 'from-red-500 to-red-400'
    }
  }

  const theme = colorMap[color]

  return (
    <div className={`rounded-2xl border ${theme.border} ${theme.bg} p-6 space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className={`font-bold text-sm ${theme.text}`}>{label}</div>
        <div className="text-xs opacity-60 truncate max-w-[60%]">
          {fileName || 'No track loaded'}
        </div>
      </div>

      {/* Jog/Platter */}
      <div className="flex justify-center">
        <div className={`
          relative w-48 h-48 rounded-full border-4 ${theme.border}
          bg-gradient-to-br from-neutral-900 to-black
          ${playing ? 'animate-spin-slow' : ''}
          transition-all duration-300
        `}>
          {/* Grooves */}
          <div className="absolute inset-4 rounded-full border border-white/5" />
          <div className="absolute inset-8 rounded-full border border-white/5" />
          <div className="absolute inset-12 rounded-full border border-white/5" />

          {/* Center */}
          <div className={`absolute inset-0 flex items-center justify-center`}>
            <div className={`w-12 h-12 rounded-full ${theme.bg} border-2 ${theme.border}`} />
          </div>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onPlay}
          disabled={!deck.buffer}
          className={`${theme.playBtn} disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all hover:scale-105 active:scale-95`}
        >
          ▶ Play
        </button>
        <button
          onClick={onPause}
          className="border-2 border-white/20 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all hover:scale-105 active:scale-95"
        >
          ⏸ Pause
        </button>
        <button
          onClick={onCue}
          className="border-2 border-white/20 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all hover:scale-105 active:scale-95"
        >
          ⏮ Cue
        </button>
      </div>

      {/* Load Button */}
      <label className="block">
        <div className="w-full border-2 border-white/20 hover:bg-white/10 hover:border-white/30 text-white font-semibold py-3 rounded-xl transition-all cursor-pointer text-center">
          📁 Load Track
        </div>
        <input
          type="file"
          accept="audio/*,video/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* BPM Display */}
      <div className={`rounded-xl border ${theme.border} ${theme.bg} p-4`}>
        <div className="text-xs opacity-60 mb-2">BPM</div>
        <input
          type="number"
          value={bpm}
          onChange={(e) => onBpmChange(parseFloat(e.target.value) || 0)}
          className={`w-full bg-black/50 border ${theme.border} rounded-lg px-3 py-2 text-2xl font-bold text-center focus:outline-none`}
        />
      </div>

      {/* Pitch Control */}
      <div className={`rounded-xl border ${theme.border} ${theme.bg} p-4 space-y-2`}>
        <div className="flex justify-between text-xs">
          <span className="opacity-60">Pitch</span>
          <span className={`font-mono ${theme.text}`}>{pitch > 0 ? '+' : ''}{pitch.toFixed(1)}%</span>
        </div>
        <div className="relative h-2">
          <div className="absolute inset-0 bg-neutral-800 rounded-full" />
          <div
            className={`absolute h-2 bg-gradient-to-r ${theme.slider} rounded-full transition-all`}
            style={{ width: `${((pitch + 8) / 16) * 100}%` }}
          />
          <input
            type="range"
            min={-8}
            max={8}
            step={0.1}
            value={pitch}
            onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <div className="flex justify-between text-[10px] opacity-40">
          <span>-8%</span>
          <span>0</span>
          <span>+8%</span>
        </div>
      </div>
    </div>
  )
}

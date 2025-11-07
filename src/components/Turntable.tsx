import { useState } from 'react'
import WaveformCanvas from './WaveformCanvas'

type Props = {
  label: string
  deck: any
  progress: number
  demo: string
  color?: 'cyan' | 'magenta'
}

export default function Turntable({ label, deck, progress, demo, color = 'cyan' }: Props) {
  const [fileName, setFileName] = useState<string>('')

  async function loadDemo() { await deck.loadFromUrl(demo); setFileName('demo_loop.mp3') }
  async function loadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return; await deck.loadFromFile(f); setFileName(f.name)
  }

  // pitch control: -8%..+8%
  const [pitch, setPitch] = useState(0)
  function setPitchPct(p: number) {
    setPitch(p)
    deck.setRate(1 + p/100)
  }

  const spinning = deck.playing ? 'spin-slower' : ''
  const isPlaying = deck.playing

  // Color theme configuration
  const theme = {
    cyan: {
      border: 'border-cyan-500/30',
      borderGlow: 'shadow-[0_0_30px_rgba(6,182,212,0.3)]',
      platter: 'from-cyan-500/20 via-cyan-600/10 to-neutral-900',
      platterRing: 'border-cyan-400/50',
      platterGlow: 'shadow-[0_0_40px_rgba(6,182,212,0.5)]',
      labelBg: 'bg-gradient-to-r from-cyan-500 to-cyan-600',
      playBtn: 'bg-gradient-to-br from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 shadow-[0_0_20px_rgba(6,182,212,0.6)]',
      pauseBtn: 'border-cyan-400/50 hover:bg-cyan-500/10 hover:border-cyan-400',
      cueBtn: 'border-cyan-400/30 hover:bg-cyan-500/10 hover:border-cyan-400'
    },
    magenta: {
      border: 'border-fuchsia-500/30',
      borderGlow: 'shadow-[0_0_30px_rgba(217,70,239,0.3)]',
      platter: 'from-fuchsia-500/20 via-pink-600/10 to-neutral-900',
      platterRing: 'border-fuchsia-400/50',
      platterGlow: 'shadow-[0_0_40px_rgba(217,70,239,0.5)]',
      labelBg: 'bg-gradient-to-r from-fuchsia-500 to-pink-600',
      playBtn: 'bg-gradient-to-br from-fuchsia-400 to-pink-600 hover:from-fuchsia-500 hover:to-pink-700 shadow-[0_0_20px_rgba(217,70,239,0.6)]',
      pauseBtn: 'border-fuchsia-400/50 hover:bg-fuchsia-500/10 hover:border-fuchsia-400',
      cueBtn: 'border-fuchsia-400/30 hover:bg-fuchsia-500/10 hover:border-fuchsia-400'
    }
  }

  const t = theme[color]

  return (
    <div className={`rounded-2xl bg-gradient-to-br from-neutral-900/90 to-black p-6 border ${t.border} ${isPlaying ? t.borderGlow : ''} space-y-4 transition-all duration-300`}>
      {/* Header with label badge */}
      <div className="flex items-center justify-between">
        <div className={`${t.labelBg} px-4 py-1.5 rounded-full text-white font-bold text-sm shadow-lg`}>
          {label}
        </div>
        <div className="text-xs opacity-60 truncate max-w-[50%] font-mono">
          {fileName || 'No track loaded'}
        </div>
      </div>

      {/* Platter */}
      <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
        <div className="relative flex justify-center">
          <div className={`
            relative h-56 w-56 md:h-72 md:w-72 rounded-full
            border-2 ${t.platterRing}
            bg-gradient-to-br ${t.platter}
            ${isPlaying ? t.platterGlow : 'shadow-2xl'}
            ${spinning}
            transition-all duration-300
          `}>
            {/* Platter details - grooves effect */}
            <div className="absolute inset-4 rounded-full border border-white/5" />
            <div className="absolute inset-8 rounded-full border border-white/5" />
            <div className="absolute inset-12 rounded-full border border-white/5" />
            <div className="absolute inset-16 rounded-full border border-white/5" />

            {/* Center spindle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`h-12 w-12 rounded-full bg-black/90 border-2 ${t.platterRing} ${isPlaying ? 'shadow-lg' : ''}`}>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900" />
              </div>
            </div>

            {/* Tone arm indicator */}
            {isPlaying && (
              <div className={`absolute top-4 left-1/2 w-1 h-20 bg-gradient-to-b ${color === 'cyan' ? 'from-cyan-400' : 'from-fuchsia-400'} to-transparent rounded-full origin-bottom -translate-x-1/2`}
                   style={{ transform: `translateX(-50%) rotate(${progress * 45 - 22.5}deg)` }} />
            )}
          </div>
        </div>

        {/* Vertical pitch slider */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-[10px] font-semibold opacity-60 uppercase tracking-wider">Pitch</div>
          <div className="relative h-56 md:h-72 w-12 flex items-center justify-center">
            {/* Track */}
            <div className="absolute inset-y-0 w-2 bg-neutral-800 rounded-full border border-white/10" />
            {/* Fill */}
            <div
              className={`absolute bottom-0 w-2 bg-gradient-to-t ${color === 'cyan' ? 'from-cyan-500 to-cyan-400' : 'from-fuchsia-500 to-pink-500'} rounded-full transition-all`}
              style={{ height: `${((pitch + 8) / 16) * 100}%` }}
            />
            {/* Thumb */}
            <div
              className={`absolute w-6 h-6 rounded-full bg-white border-2 ${color === 'cyan' ? 'border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.6)]' : 'border-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.6)]'} pointer-events-none transition-all`}
              style={{ bottom: `calc(${((pitch + 8) / 16) * 100}% - 12px)` }}
            />
            {/* Input */}
            <input
              type="range" min={-8} max={8} step={0.1} value={pitch}
              onChange={(e)=>setPitchPct(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer [writing-mode:bt-lr] [-webkit-appearance:slider-vertical]"
            />
          </div>
          <div className="text-[10px] font-mono opacity-60">{pitch > 0 ? '+' : ''}{pitch.toFixed(1)}%</div>
        </div>
      </div>

      <WaveformCanvas audioBuffer={deck.buffer} progress={progress} color={color} />

      {/* Transport controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={()=>deck.play()}
          className={`w-12 h-12 rounded-full ${t.playBtn} text-white font-bold text-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95`}
        >
          ▶
        </button>
        <button
          onClick={()=>deck.pause()}
          className={`w-12 h-12 rounded-full border-2 ${t.pauseBtn} text-white font-bold text-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95`}
        >
          ⏸
        </button>
        <button
          onClick={()=>deck.seek(0)}
          className={`rounded-xl border ${t.cueBtn} px-4 py-2 font-semibold transition-all hover:scale-105 active:scale-95`}
        >
          CUE
        </button>
        <label className={`rounded-xl border ${t.cueBtn} px-4 py-2 font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95`}>
          LOAD
          <input type="file" accept="audio/*" onChange={loadFile} className="hidden"/>
        </label>
        <button
          onClick={loadDemo}
          className={`rounded-xl border ${t.cueBtn} px-4 py-2 font-semibold transition-all hover:scale-105 active:scale-95 text-xs`}
        >
          DEMO
        </button>
      </div>
    </div>
  )
}

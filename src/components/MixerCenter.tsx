import { useState, useEffect } from 'react'
import HorizontalSlider from './ui/HorizontalSlider'

type Props = {
  mixer: any
  crossfader: number
  onCrossfaderChange: (value: number) => void
  masterVol: number
  onMasterVolChange: (value: number) => void
  aBpm: number
  bBpm: number
  onSync: () => void
  isRecording: boolean
}

export default function MixerCenter({
  mixer,
  crossfader,
  onCrossfaderChange,
  masterVol,
  onMasterVolChange,
  aBpm,
  bBpm,
  onSync,
  isRecording
}: Props) {
  // EQ states for both decks
  const [aEQ, setAEQ] = useState({ low: 0, mid: 0, high: 0 })
  const [bEQ, setBEQ] = useState({ low: 0, mid: 0, high: 0 })

  // Filter states
  const [aFilter, setAFilter] = useState(20000)
  const [bFilter, setBFilter] = useState(20000)

  // Apply EQ changes
  useEffect(() => { mixer.deckA.setEQ(aEQ) }, [aEQ, mixer])
  useEffect(() => { mixer.deckB.setEQ(bEQ) }, [bEQ, mixer])

  // Apply filter changes
  useEffect(() => { mixer.deckA.setFilterHz(aFilter) }, [aFilter, mixer])
  useEffect(() => { mixer.deckB.setFilterHz(bFilter) }, [bFilter, mixer])

  return (
    <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-[#0a0a0f] to-[#1a1a24] shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-8 space-y-8 h-full flex flex-col">

      {/* BPM/SYNC Header */}
      <div className="bg-black/40 rounded-xl px-4 py-3 flex items-center justify-center gap-4 border border-white/5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]">
        <div className="text-center">
          <div className="text-2xl font-bold font-mono text-rmxrtext">{aBpm}</div>
          <div className="text-[9px] text-muted uppercase tracking-wider mt-1">BPM A</div>
        </div>
        <button
          onClick={onSync}
          disabled={!mixer.deckA.buffer || !mixer.deckB.buffer}
          className="px-4 py-2 rounded-lg bg-surface border border-rmxrborder hover:border-accent hover:bg-surface2 disabled:opacity-30 disabled:cursor-not-allowed text-rmxrtext hover:text-accent-400 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
        >
          🔗 Sync
        </button>
        <div className="text-center">
          <div className="text-2xl font-bold font-mono text-rmxrtext">{bBpm}</div>
          <div className="text-[9px] text-muted uppercase tracking-wider mt-1">BPM B</div>
        </div>
      </div>

      {/* EQ Strips Side-by-Side - Horizontal Sliders */}
      <div className="flex-1 grid grid-cols-2 gap-8">
        {/* Deck A EQ */}
        <div className="space-y-5">
          <div className="text-[10px] font-semibold text-muted uppercase tracking-wider text-center pb-2 border-b border-white/10">
            EQ A
          </div>
          <div className="space-y-4">
            <HorizontalSlider
              label="HIGH"
              value={aEQ.high}
              min={-24}
              max={24}
              step={0.5}
              unit="dB"
              onChange={(v) => {
                if (isFinite(v)) setAEQ({ ...aEQ, high: v })
              }}
              accentColor="magenta"
            />
            <HorizontalSlider
              label="MID"
              value={aEQ.mid}
              min={-24}
              max={24}
              step={0.5}
              unit="dB"
              onChange={(v) => {
                if (isFinite(v)) setAEQ({ ...aEQ, mid: v })
              }}
              accentColor="magenta"
            />
            <HorizontalSlider
              label="LOW"
              value={aEQ.low}
              min={-24}
              max={24}
              step={0.5}
              unit="dB"
              onChange={(v) => {
                if (isFinite(v)) setAEQ({ ...aEQ, low: v })
              }}
              accentColor="magenta"
            />
          </div>

          {/* Filter A */}
          <div className="pt-4 space-y-3 border-t border-white/10">
            <HorizontalSlider
              label="FILTER"
              value={aFilter}
              min={200}
              max={20000}
              step={100}
              unit="Hz"
              onChange={(v) => {
                if (isFinite(v)) setAFilter(v)
              }}
              accentColor="cyan"
            />
          </div>
        </div>

        {/* Deck B EQ */}
        <div className="space-y-5">
          <div className="text-[10px] font-semibold text-muted uppercase tracking-wider text-center pb-2 border-b border-white/10">
            EQ B
          </div>
          <div className="space-y-4">
            <HorizontalSlider
              label="HIGH"
              value={bEQ.high}
              min={-24}
              max={24}
              step={0.5}
              unit="dB"
              onChange={(v) => {
                if (isFinite(v)) setBEQ({ ...bEQ, high: v })
              }}
              accentColor="magenta"
            />
            <HorizontalSlider
              label="MID"
              value={bEQ.mid}
              min={-24}
              max={24}
              step={0.5}
              unit="dB"
              onChange={(v) => {
                if (isFinite(v)) setBEQ({ ...bEQ, mid: v })
              }}
              accentColor="magenta"
            />
            <HorizontalSlider
              label="LOW"
              value={bEQ.low}
              min={-24}
              max={24}
              step={0.5}
              unit="dB"
              onChange={(v) => {
                if (isFinite(v)) setBEQ({ ...bEQ, low: v })
              }}
              accentColor="magenta"
            />
          </div>

          {/* Filter B */}
          <div className="pt-4 space-y-3 border-t border-white/10">
            <HorizontalSlider
              label="FILTER"
              value={bFilter}
              min={200}
              max={20000}
              step={100}
              unit="Hz"
              onChange={(v) => {
                if (isFinite(v)) setBFilter(v)
              }}
              accentColor="cyan"
            />
          </div>
        </div>
      </div>

      {/* Crossfader - Professional Dual-Rail Design */}
      <div className="space-y-3 pt-6 border-t border-white/10">
        <div className="text-[10px] font-semibold text-muted uppercase tracking-wider text-center">Crossfader</div>
        <div className="relative h-16 flex items-center px-2">
          {/* Dual Rail Track Background */}
          <div className="absolute inset-x-2 h-4 flex gap-1">
            <div className="flex-1 rounded-full bg-gradient-to-b from-zinc-700 via-zinc-600 to-zinc-700 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)] border border-zinc-800" />
            <div className="flex-1 rounded-full bg-gradient-to-b from-zinc-700 via-zinc-600 to-zinc-700 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)] border border-zinc-800" />
          </div>

          {/* Magenta fill showing position */}
          <div
            className="absolute h-4 rounded-full transition-all duration-75 bg-accent opacity-40 shadow-[0_0_10px_rgba(225,29,132,0.4)]"
            style={{
              left: `calc(${Math.min((1 - crossfader), crossfader) * 100}% + 8px)`,
              right: `calc(${Math.min((1 - crossfader), crossfader) * 100}% + 8px)`
            }}
          />

          {/* Metallic Fader Thumb */}
          <div
            className="absolute w-10 h-16 pointer-events-none transition-all z-10"
            style={{ left: `calc(${(1 - crossfader) * 100}% - 20px)` }}
          >
            <div className="w-full h-full rounded-lg bg-gradient-to-br from-zinc-200 via-zinc-300 to-zinc-400 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.4)] border border-zinc-500/50">
              {/* Grip lines */}
              <div className="flex flex-col items-center justify-center h-full gap-1.5 px-2">
                <div className="w-full h-px bg-zinc-400/60" />
                <div className="w-full h-px bg-zinc-400/60" />
                <div className="w-full h-px bg-zinc-400/60" />
              </div>
            </div>
          </div>

          {/* Input */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={1 - crossfader}
            onChange={(e) => onCrossfaderChange(1 - parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />
        </div>
        <div className="flex justify-between text-[10px] font-semibold font-mono">
          <span className={`transition-all ${crossfader < 0.5 ? 'text-accent-400 scale-110' : 'text-muted'}`}>A {Math.round((1-crossfader) * 100)}%</span>
          <span className={`transition-all ${crossfader > 0.5 ? 'text-accent-400 scale-110' : 'text-muted'}`}>B {Math.round(crossfader * 100)}%</span>
        </div>
      </div>

      {/* Master Volume - Horizontal Slider */}
      <div className="space-y-3 pt-2">
        <HorizontalSlider
          label="MASTER"
          value={masterVol * 100}
          min={0}
          max={100}
          step={1}
          unit="%"
          onChange={(v) => {
            if (isFinite(v)) onMasterVolChange(v / 100)
          }}
          accentColor="magenta"
        />
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="rounded-lg border border-danger bg-danger/10 px-3 py-2 text-center animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.3)]">
          <div className="text-danger font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-danger rounded-full animate-pulse" />
            Recording
          </div>
        </div>
      )}
    </div>
  )
}

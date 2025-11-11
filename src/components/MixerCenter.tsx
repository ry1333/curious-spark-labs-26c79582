import { useState, useEffect } from 'react'

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
    <div className="rounded-2xl border border-rmxrborder bg-surface shadow-[0_0_0_1px_rgba(38,38,58,0.2)] p-8 space-y-8 h-full flex flex-col">

      {/* BPM/SYNC Header - Mono font, tiny captions */}
      <div className="bg-surface2 rounded-xl px-4 py-3 flex items-center justify-center gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold font-mono text-rmxrtext">{aBpm}</div>
          <div className="text-[9px] text-muted uppercase tracking-wider mt-1">BPM A</div>
        </div>
        <button
          onClick={onSync}
          disabled={!mixer.deckA.buffer || !mixer.deckB.buffer}
          className="px-4 py-2 rounded-lg bg-surface border border-rmxrborder hover:border-accent hover:bg-surface2 disabled:opacity-30 disabled:cursor-not-allowed text-rmxrtext hover:text-accent-400 font-bold text-xs uppercase tracking-wider transition-all"
        >
          🔗 Sync
        </button>
        <div className="text-center">
          <div className="text-2xl font-bold font-mono text-rmxrtext">{bBpm}</div>
          <div className="text-[9px] text-muted uppercase tracking-wider mt-1">BPM B</div>
        </div>
      </div>

      {/* EQ Strips Side-by-Side - No "DECK A/B" labels, just "EQ A" / "EQ B" */}
      <div className="flex-1 grid grid-cols-2 gap-8">
        {/* Deck A EQ */}
        <div className="space-y-4">
          <div className="text-[10px] font-semibold text-muted uppercase tracking-wider text-center pb-2 border-b border-rmxrborder">
            EQ A
          </div>
          <div className="space-y-3">
            <EQKnob label="High" value={aEQ.high} onChange={(v) => setAEQ({ ...aEQ, high: v })} />
            <EQKnob label="Mid" value={aEQ.mid} onChange={(v) => setAEQ({ ...aEQ, mid: v })} />
            <EQKnob label="Low" value={aEQ.low} onChange={(v) => setAEQ({ ...aEQ, low: v })} />
          </div>

          {/* Filter A */}
          <div className="pt-4 space-y-2">
            <div className="text-[9px] text-muted uppercase tracking-wider">Filter</div>
            <input
              type="range"
              min={200}
              max={20000}
              step={100}
              value={aFilter}
              onChange={(e) => setAFilter(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-[10px] text-muted text-center font-mono">{(aFilter / 1000).toFixed(1)}k Hz</div>
          </div>
        </div>

        {/* Deck B EQ */}
        <div className="space-y-4">
          <div className="text-[10px] font-semibold text-muted uppercase tracking-wider text-center pb-2 border-b border-rmxrborder">
            EQ B
          </div>
          <div className="space-y-3">
            <EQKnob label="High" value={bEQ.high} onChange={(v) => setBEQ({ ...bEQ, high: v })} />
            <EQKnob label="Mid" value={bEQ.mid} onChange={(v) => setBEQ({ ...bEQ, mid: v })} />
            <EQKnob label="Low" value={bEQ.low} onChange={(v) => setBEQ({ ...bEQ, low: v })} />
          </div>

          {/* Filter B */}
          <div className="pt-4 space-y-2">
            <div className="text-[9px] text-muted uppercase tracking-wider">Filter</div>
            <input
              type="range"
              min={200}
              max={20000}
              step={100}
              value={bFilter}
              onChange={(e) => setBFilter(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-[10px] text-muted text-center font-mono">{(bFilter / 1000).toFixed(1)}k Hz</div>
          </div>
        </div>
      </div>

      {/* Crossfader - Docked at Bottom, thin magenta fill */}
      <div className="space-y-3 pt-6 border-t border-rmxrborder">
        <div className="text-[10px] font-semibold text-muted uppercase tracking-wider text-center">Crossfader</div>
        <div className="relative h-12 flex items-center">
          {/* Track */}
          <div className="absolute inset-x-0 h-3 rounded-full bg-surface2 border border-rmxrborder" />

          {/* Magenta fill showing position */}
          <div
            className="absolute h-3 rounded-full transition-all duration-75 bg-accent"
            style={{
              left: `${Math.min((1 - crossfader), crossfader) * 100}%`,
              right: `${Math.min((1 - crossfader), crossfader) * 100}%`,
              opacity: 0.6
            }}
          />

          {/* Thumb */}
          <div
            className="absolute w-6 h-6 rounded-lg bg-accent border-2 border-bg shadow-lg pointer-events-none transition-all z-10"
            style={{ left: `calc(${(1 - crossfader) * 100}% - 12px)` }}
          />

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
        <div className="flex justify-between text-[10px] font-semibold">
          <span className={`transition-all ${crossfader < 0.5 ? 'text-accent-400 scale-110' : 'text-muted'}`}>A</span>
          <span className="text-muted font-mono text-[9px]">{Math.round((1-crossfader) * 100)}% / {Math.round(crossfader * 100)}%</span>
          <span className={`transition-all ${crossfader > 0.5 ? 'text-accent-400 scale-110' : 'text-muted'}`}>B</span>
        </div>
      </div>

      {/* Master Volume */}
      <div className="space-y-2">
        <div className="text-[9px] text-muted uppercase tracking-wider">Master</div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={masterVol}
          onChange={(e) => onMasterVolChange(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="text-center text-xs font-mono text-muted">{Math.round(masterVol * 100)}%</div>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="rounded-lg border border-danger bg-danger/10 px-3 py-2 text-center animate-pulse">
          <div className="text-danger font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-danger rounded-full animate-pulse" />
            Recording
          </div>
        </div>
      )}
    </div>
  )
}

function EQKnob({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-[10px] text-muted uppercase tracking-wider w-10">{label}</div>
      <div className="flex-1">
        <input
          type="range"
          min={-24}
          max={24}
          step={0.5}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="text-[10px] font-mono text-muted w-10 text-right">{value > 0 ? '+' : ''}{value.toFixed(1)}</div>
    </div>
  )
}

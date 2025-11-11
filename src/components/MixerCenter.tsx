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
  useEffect(() => {
    mixer.deckA.setEQ(aEQ)
  }, [aEQ, mixer])

  useEffect(() => {
    mixer.deckB.setEQ(bEQ)
  }, [bEQ, mixer])

  // Apply filter changes
  useEffect(() => {
    mixer.deckA.setFilterHz(aFilter)
  }, [aFilter, mixer])

  useEffect(() => {
    mixer.deckB.setFilterHz(bFilter)
  }, [bFilter, mixer])

  return (
    <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-6 space-y-6">
      {/* BPM Display & Sync */}
      <div className="rounded-xl border border-purple-500/30 bg-black/30 p-4">
        <div className="text-center mb-4">
          <div className="text-xs opacity-60 mb-2">TEMPO SYNC</div>
          <div className="flex items-center justify-center gap-4">
            <div className="text-2xl font-bold text-orange-400">{aBpm}</div>
            <button
              onClick={onSync}
              disabled={!mixer.deckA.buffer || !mixer.deckB.buffer}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-all"
            >
              🔗 SYNC
            </button>
            <div className="text-2xl font-bold text-red-400">{bBpm}</div>
          </div>
        </div>
      </div>

      {/* Channel Strips (Side by Side) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Deck A Channel */}
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 space-y-3">
          <div className="text-xs font-bold text-orange-400 text-center mb-3">DECK A</div>

          {/* EQ */}
          <div className="space-y-2">
            <EQKnob label="High" value={aEQ.high} onChange={(v) => setAEQ({ ...aEQ, high: v })} color="orange" />
            <EQKnob label="Mid" value={aEQ.mid} onChange={(v) => setAEQ({ ...aEQ, mid: v })} color="orange" />
            <EQKnob label="Low" value={aEQ.low} onChange={(v) => setAEQ({ ...aEQ, low: v })} color="orange" />
          </div>

          {/* Filter */}
          <div className="space-y-1">
            <div className="text-[10px] opacity-60">FILTER</div>
            <input
              type="range"
              min={200}
              max={20000}
              step={100}
              value={aFilter}
              onChange={(e) => setAFilter(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-[10px] opacity-40 text-center">{(aFilter / 1000).toFixed(1)}k Hz</div>
          </div>
        </div>

        {/* Deck B Channel */}
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 space-y-3">
          <div className="text-xs font-bold text-red-400 text-center mb-3">DECK B</div>

          {/* EQ */}
          <div className="space-y-2">
            <EQKnob label="High" value={bEQ.high} onChange={(v) => setBEQ({ ...bEQ, high: v })} color="red" />
            <EQKnob label="Mid" value={bEQ.mid} onChange={(v) => setBEQ({ ...bEQ, mid: v })} color="red" />
            <EQKnob label="Low" value={bEQ.low} onChange={(v) => setBEQ({ ...bEQ, low: v })} color="red" />
          </div>

          {/* Filter */}
          <div className="space-y-1">
            <div className="text-[10px] opacity-60">FILTER</div>
            <input
              type="range"
              min={200}
              max={20000}
              step={100}
              value={bFilter}
              onChange={(e) => setBFilter(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-[10px] opacity-40 text-center">{(bFilter / 1000).toFixed(1)}k Hz</div>
          </div>
        </div>
      </div>

      {/* Crossfader */}
      <div className="space-y-3">
        <div className="text-xs font-semibold opacity-80 text-center">CROSSFADER</div>
        <div className="relative h-16 flex items-center">
          {/* Track */}
          <div className="absolute inset-x-0 h-4 rounded-full bg-gradient-to-r from-orange-500/20 via-neutral-800 to-red-500/20 border border-white/20" />

          {/* Active fill */}
          <div
            className="absolute h-4 rounded-full transition-all duration-100"
            style={{
              left: 0,
              right: `${(1 - crossfader) * 100}%`,
              background: `linear-gradient(to right, rgba(251, 146, 60, ${0.8 - crossfader * 0.6}), rgba(239, 68, 68, ${crossfader * 0.2}))`
            }}
          />
          <div
            className="absolute h-4 rounded-full transition-all duration-100"
            style={{
              left: `${crossfader * 100}%`,
              right: 0,
              background: `linear-gradient(to right, rgba(251, 146, 60, ${(1-crossfader) * 0.2}), rgba(239, 68, 68, ${0.2 + crossfader * 0.6}))`
            }}
          />

          {/* Thumb */}
          <div
            className="absolute w-8 h-8 rounded-lg bg-gradient-to-br from-white to-neutral-300 border-2 border-white shadow-lg pointer-events-none transition-all z-10"
            style={{ left: `calc(${crossfader * 100}% - 16px)` }}
          />

          {/* Input */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={crossfader}
            onChange={(e) => onCrossfaderChange(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />
        </div>
        <div className="flex justify-between text-xs font-bold">
          <span className={`transition-all ${crossfader < 0.5 ? 'text-orange-400 scale-110' : 'opacity-50'}`}>A</span>
          <span className="opacity-40 text-[10px]">{Math.round((1-crossfader) * 100)}% / {Math.round(crossfader * 100)}%</span>
          <span className={`transition-all ${crossfader > 0.5 ? 'text-red-400 scale-110' : 'opacity-50'}`}>B</span>
        </div>
      </div>

      {/* Master Volume */}
      <div className="rounded-xl border border-purple-500/30 bg-black/30 p-4 space-y-2">
        <div className="text-xs opacity-60 mb-2">MASTER VOLUME</div>
        <div className="relative h-2">
          <div className="absolute inset-0 bg-neutral-800 rounded-full" />
          <div
            className="absolute h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
            style={{ width: `${masterVol * 100}%` }}
          />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={masterVol}
            onChange={(e) => onMasterVolChange(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <div className="text-center text-sm font-bold text-purple-400">{Math.round(masterVol * 100)}%</div>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="rounded-xl border border-red-500 bg-red-500/20 p-3 text-center animate-pulse">
          <div className="text-red-400 font-bold text-sm flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            RECORDING
          </div>
        </div>
      )}
    </div>
  )
}

function EQKnob({ label, value, onChange, color }: { label: string, value: number, onChange: (v: number) => void, color: 'orange' | 'red' }) {
  const colorMap = {
    orange: 'from-orange-500 to-orange-400',
    red: 'from-red-500 to-red-400'
  }

  return (
    <div className="flex items-center gap-2">
      <div className="text-[10px] opacity-60 w-10">{label}</div>
      <div className="flex-1 relative h-2">
        <div className="absolute inset-0 bg-neutral-800 rounded-full" />
        <div
          className={`absolute h-2 bg-gradient-to-r ${colorMap[color]} rounded-full transition-all`}
          style={{ width: `${((value + 24) / 48) * 100}%` }}
        />
        <input
          type="range"
          min={-24}
          max={24}
          step={0.5}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="text-[10px] font-mono opacity-60 w-12 text-right">{value > 0 ? '+' : ''}{value.toFixed(1)}</div>
    </div>
  )
}

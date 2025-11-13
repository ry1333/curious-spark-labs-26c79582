import { Volume2, Circle } from 'lucide-react'
import { useDJ } from '../store'

export function Mixer() {
  const { crossfader, masterVolume, decks, setCrossfader, setMasterVolume } = useDJ()

  const getAverageBPM = () => {
    const loadedDecks = [decks.A, decks.B].filter(d => d.loaded)
    if (loadedDecks.length === 0) return 120

    const sum = loadedDecks.reduce((acc, d) => acc + d.bpm, 0)
    return Math.round(sum / loadedDecks.length)
  }

  return (
    <div className="rounded-2xl border border-line bg-card p-6 space-y-6">
      {/* Mixer Header */}
      <div className="text-center space-y-1">
        <h3 className="text-xl font-bold text-text">Mixer</h3>
        <div className="text-sm text-muted">
          {getAverageBPM()} BPM avg
        </div>
      </div>

      {/* Crossfader Section */}
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-xs font-medium text-muted mb-2">CROSSFADER</div>

          {/* Crossfader Labels */}
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span className={crossfader < -0.3 ? 'text-accentFrom font-semibold' : ''}>
              DECK A
            </span>
            <span className={Math.abs(crossfader) <= 0.3 ? 'text-text font-semibold' : ''}>
              CENTER
            </span>
            <span className={crossfader > 0.3 ? 'text-accentTo font-semibold' : ''}>
              DECK B
            </span>
          </div>

          {/* Crossfader Slider */}
          <div className="relative">
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={crossfader}
              onChange={(e) => setCrossfader(parseFloat(e.target.value))}
              className="w-full h-4 bg-gradient-to-r from-accentFrom via-surface to-accentTo rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(255,255,255,0.5)]
                [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-accentFrom"
            />
          </div>

          {/* Crossfader Position Indicator */}
          <div className="mt-2 text-xs font-mono text-text">
            {crossfader.toFixed(2)}
          </div>
        </div>

        {/* Visual Deck Indicators */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`rounded-lg border p-3 text-center transition-all ${
            crossfader < 0
              ? 'border-accentFrom bg-accentFrom/10'
              : 'border-line bg-surface/50'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Circle className={`w-3 h-3 ${
                decks.A.playing ? 'fill-emerald-400 text-emerald-400 animate-pulse' : 'text-muted'
              }`} />
              <span className="text-xs font-semibold text-text">DECK A</span>
            </div>
            <div className="text-xs text-muted">
              {decks.A.loaded ? decks.A.filename?.slice(0, 15) || 'Loaded' : 'Empty'}
            </div>
          </div>

          <div className={`rounded-lg border p-3 text-center transition-all ${
            crossfader > 0
              ? 'border-accentTo bg-accentTo/10'
              : 'border-line bg-surface/50'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Circle className={`w-3 h-3 ${
                decks.B.playing ? 'fill-emerald-400 text-emerald-400 animate-pulse' : 'text-muted'
              }`} />
              <span className="text-xs font-semibold text-text">DECK B</span>
            </div>
            <div className="text-xs text-muted">
              {decks.B.loaded ? decks.B.filename?.slice(0, 15) || 'Loaded' : 'Empty'}
            </div>
          </div>
        </div>
      </div>

      {/* Master Volume */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Master Volume
          </label>
          <span className="text-xs font-mono text-text">
            {Math.round(masterVolume * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={masterVolume}
          onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
          className="w-full h-3 bg-gradient-to-r from-surface via-accentFrom to-accentFrom rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
        />
      </div>

      {/* Meters Placeholder */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted text-center">OUTPUT METERS</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="text-xs text-muted text-center">L</div>
            <div className="h-24 bg-surface rounded-lg border border-line overflow-hidden relative">
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-emerald-500 to-cyan-500" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted text-center">R</div>
            <div className="h-24 bg-surface rounded-lg border border-line overflow-hidden relative">
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-emerald-500 to-cyan-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Mixing Tips */}
      <div className="rounded-lg border border-line/50 bg-surface/30 p-3 text-xs text-muted space-y-1">
        <div className="font-semibold text-text mb-1">💡 Mixing Tips</div>
        <div>• Match BPMs with pitch controls</div>
        <div>• Use EQ to create space in the mix</div>
        <div>• Crossfade smoothly during breakdowns</div>
      </div>
    </div>
  )
}

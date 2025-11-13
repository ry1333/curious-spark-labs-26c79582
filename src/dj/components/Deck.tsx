import { useRef } from 'react'
import { Play, Pause, Square, Upload } from 'lucide-react'
import { useDJ, type DeckID } from '../store'

interface DeckProps {
  id: DeckID
}

export function Deck({ id }: DeckProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const deck = useDJ((state) => state.decks[id])
  const { load, play, pause, stop, setPitch, setEQ } = useDJ()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        await load(id, file)
      } catch (error) {
        console.error('Failed to load file:', error)
      }
    }
  }

  const handlePlayPause = () => {
    if (deck.playing) {
      pause(id)
    } else {
      play(id)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = deck.duration > 0 ? (deck.position / deck.duration) * 100 : 0

  return (
    <div className="rounded-2xl border border-line bg-card p-6 space-y-4">
      {/* Deck Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-text">Deck {id}</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          deck.playing
            ? 'bg-emerald-500/20 text-emerald-400'
            : deck.loaded
            ? 'bg-cyan-500/20 text-cyan-400'
            : 'bg-surface text-muted'
        }`}>
          {deck.playing ? 'PLAYING' : deck.loaded ? 'LOADED' : 'EMPTY'}
        </div>
      </div>

      {/* Platter / Artwork */}
      <div className="aspect-square rounded-xl border border-line bg-surface/50 flex items-center justify-center relative overflow-hidden">
        {deck.loaded ? (
          <>
            {/* Vinyl record visual */}
            <div className={`absolute inset-0 bg-gradient-to-br from-surface via-ink to-surface ${
              deck.playing ? 'animate-vinyl-spin' : ''
            }`}>
              {/* Grooves */}
              <div className="absolute inset-4 rounded-full border-2 border-line/30" />
              <div className="absolute inset-8 rounded-full border-2 border-line/30" />
              <div className="absolute inset-12 rounded-full border-2 border-line/30" />

              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accentFrom to-accentTo flex items-center justify-center text-ink font-bold text-sm">
                  DECK<br/>{id}
                </div>
              </div>
            </div>

            {/* Progress overlay */}
            {deck.playing && (
              <div className="absolute inset-0 bg-accentFrom/10 animate-pulse-ring pointer-events-none" />
            )}
          </>
        ) : (
          <div className="text-center space-y-3">
            <Upload className="w-12 h-12 text-muted mx-auto" strokeWidth={1.5} />
            <p className="text-muted text-sm">No track loaded</p>
          </div>
        )}
      </div>

      {/* Track Info */}
      {deck.loaded && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-text truncate">{deck.filename || 'Unknown Track'}</div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>{formatTime(deck.position)}</span>
            <div className="flex-1 h-1 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accentFrom to-accentTo transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span>{formatTime(deck.duration)}</span>
          </div>
        </div>
      )}

      {/* Transport Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 rounded-lg border border-line hover:border-line/50 hover:bg-surface px-4 py-2 text-sm font-medium text-text transition-all"
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Load
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          onClick={handlePlayPause}
          disabled={!deck.loaded}
          className={`rounded-lg px-4 py-2 font-semibold transition-all ${
            deck.loaded
              ? 'bg-gradient-to-r from-accentFrom to-accentTo text-ink hover:scale-105'
              : 'bg-surface text-muted cursor-not-allowed'
          }`}
        >
          {deck.playing ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>

        <button
          onClick={() => stop(id)}
          disabled={!deck.loaded}
          className={`rounded-lg border border-line px-4 py-2 transition-all ${
            deck.loaded
              ? 'hover:border-red-500/50 hover:bg-red-500/10 text-text'
              : 'text-muted cursor-not-allowed'
          }`}
        >
          <Square className="w-5 h-5" />
        </button>
      </div>

      {/* Pitch Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted">Pitch</label>
          <span className="text-xs font-mono text-text">
            {deck.pitch > 1 ? '+' : ''}{((deck.pitch - 1) * 100).toFixed(1)}%
          </span>
        </div>
        <input
          type="range"
          min="0.8"
          max="1.2"
          step="0.01"
          value={deck.pitch}
          onChange={(e) => setPitch(id, parseFloat(e.target.value))}
          disabled={!deck.loaded}
          className="w-full h-2 bg-surface rounded-full appearance-none cursor-pointer disabled:opacity-50
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accentFrom
            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-accentFrom"
        />
      </div>

      {/* 3-Band EQ */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-muted">3-Band EQ</div>

        {(['low', 'mid', 'high'] as const).map((band) => (
          <div key={band} className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted capitalize">{band}</label>
              <span className="text-xs font-mono text-text">
                {deck.eq[band] > 0 ? '+' : ''}{deck.eq[band].toFixed(1)} dB
              </span>
            </div>
            <input
              type="range"
              min="-12"
              max="12"
              step="1"
              value={deck.eq[band]}
              onChange={(e) => setEQ(id, band, parseInt(e.target.value))}
              disabled={!deck.loaded}
              className={`w-full h-2 rounded-full appearance-none cursor-pointer disabled:opacity-50
                ${band === 'low' ? 'bg-gradient-to-r from-blue-900 via-surface to-blue-500' : ''}
                ${band === 'mid' ? 'bg-gradient-to-r from-green-900 via-surface to-green-500' : ''}
                ${band === 'high' ? 'bg-gradient-to-r from-yellow-900 via-surface to-yellow-500' : ''}
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

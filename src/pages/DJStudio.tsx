import { useEffect } from 'react'
import { Deck } from '../dj/components/Deck'
import { Mixer } from '../dj/components/Mixer'
import { StudioFooter } from '../dj/components/StudioFooter'
import { useDJ } from '../dj/store'

export default function DJStudio() {
  const updatePositions = useDJ((state) => state.updatePositions)

  // Update playback positions every 100ms
  useEffect(() => {
    const interval = setInterval(() => {
      updatePositions()
    }, 100)

    return () => clearInterval(interval)
  }, [updatePositions])

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink via-surface to-ink text-text pb-24">
      {/* Header */}
      <div className="border-b border-line bg-surface/50 backdrop-blur-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-accentFrom to-accentTo bg-clip-text text-transparent">
                DJ Studio
              </h1>
              <p className="text-sm text-muted mt-1">Load, mix, record, and publish — all in one place</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-xs text-muted">
                <div className="font-semibold text-text">Pro Workflow</div>
                <div>Dual decks • 3-band EQ • Live recording</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop: 3-column grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          <Deck id="A" />
          <Mixer />
          <Deck id="B" />
        </div>

        {/* Tablet: 2-column grid with mixer below */}
        <div className="hidden md:grid md:grid-cols-2 lg:hidden gap-6">
          <Deck id="A" />
          <Deck id="B" />
          <div className="md:col-span-2">
            <Mixer />
          </div>
        </div>

        {/* Mobile: stacked layout */}
        <div className="md:hidden space-y-6">
          <Mixer />
          <Deck id="A" />
          <Deck id="B" />
        </div>

        {/* Quick Start Guide */}
        <div className="mt-8 rounded-2xl border border-line bg-card/30 backdrop-blur-sm p-6">
          <h3 className="text-lg font-bold text-text mb-4">Quick Start Guide</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accentFrom to-accentTo flex items-center justify-center text-ink font-bold">
                1
              </div>
              <div className="font-semibold text-text">Load Tracks</div>
              <div className="text-muted">Click "Load" on each deck to upload audio files</div>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accentFrom to-accentTo flex items-center justify-center text-ink font-bold">
                2
              </div>
              <div className="font-semibold text-text">Prepare Mix</div>
              <div className="text-muted">Adjust pitch and EQ on both decks</div>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accentFrom to-accentTo flex items-center justify-center text-ink font-bold">
                3
              </div>
              <div className="font-semibold text-text">Mix & Record</div>
              <div className="text-muted">Play tracks, use crossfader, hit Record</div>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accentFrom to-accentTo flex items-center justify-center text-ink font-bold">
                4
              </div>
              <div className="font-semibold text-text">Publish</div>
              <div className="text-muted">Stop recording and share your mix</div>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="mt-6 rounded-xl border border-line/50 bg-surface/20 p-4 text-sm">
          <div className="font-semibold text-text mb-2">💡 Pro Tips</div>
          <ul className="text-muted space-y-1 list-disc list-inside">
            <li>Match BPMs using pitch controls before mixing</li>
            <li>Cut lows on one track when mixing two bass-heavy tracks</li>
            <li>Use the crossfader during breakdowns for smooth transitions</li>
            <li>Record multiple takes - you can always delete and try again</li>
            <li>Need tracks? Try the <span className="text-accentFrom font-semibold">AI Generate Mix</span> button below</li>
          </ul>
        </div>
      </div>

      {/* Footer with Recording Controls */}
      <StudioFooter />
    </div>
  )
}

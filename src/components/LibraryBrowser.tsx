import { useState } from 'react'

type Props = {
  onLoadA: (file: File) => void
  onLoadB: (file: File) => void
}

type Track = {
  id: string
  name: string
  artist: string
  bpm: number
  key: string
  genre: string
  url?: string
}

export default function LibraryBrowser({ onLoadA, onLoadB }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string>('All')

  // Demo tracks/loops - All 9 local tracks
  const tracks: Track[] = [
    // WAV Demos
    { id: '1', name: 'Deep House Loop', artist: 'Demo', bpm: 124, key: 'Am', genre: 'House', url: '/loops/deep_house_124.wav' },
    { id: '2', name: 'Tech Groove', artist: 'Demo', bpm: 128, key: 'Em', genre: 'Techno', url: '/loops/tech_groove_128.wav' },
    { id: '3', name: 'Hip-Hop Beat', artist: 'Demo', bpm: 90, key: 'Gm', genre: 'Hip-Hop', url: '/loops/hiphop_beat_90.wav' },
    { id: '4', name: 'Lo-Fi Chill', artist: 'Demo', bpm: 80, key: 'Cm', genre: 'Lo-Fi', url: '/loops/lofi_chill_80.wav' },
    { id: '5', name: 'EDM Drop', artist: 'Demo', bpm: 128, key: 'C', genre: 'EDM', url: '/loops/edm_drop_128.wav' },
    // Bensound MP3s
    { id: '6', name: 'Jazzy Frenchy', artist: 'Bensound', bpm: 120, key: 'Dm', genre: 'Jazz', url: '/loops/bensound_jazzy.mp3' },
    { id: '7', name: 'Funky Suspense', artist: 'Bensound', bpm: 95, key: 'Em', genre: 'Funk', url: '/loops/bensound_funkysuspense.mp3' },
    { id: '8', name: 'Groovy Hip Hop', artist: 'Bensound', bpm: 90, key: 'Am', genre: 'Hip-Hop', url: '/loops/bensound_groovy.mp3' },
    { id: '9', name: 'Energy', artist: 'Bensound', bpm: 130, key: 'Gm', genre: 'EDM', url: '/loops/bensound_energy.mp3' },
  ]

  const genres = ['All', 'House', 'Techno', 'Hip-Hop', 'Lo-Fi', 'EDM', 'Jazz', 'Funk']

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = selectedGenre === 'All' || track.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

  const handleLoadTrack = async (track: Track, deck: 'A' | 'B') => {
    if (!track.url) return

    try {
      const response = await fetch(track.url)
      const blob = await response.blob()
      const file = new File([blob], `${track.name}.mp3`, { type: 'audio/mpeg' })

      if (deck === 'A') {
        onLoadA(file)
      } else {
        onLoadB(file)
      }
    } catch (error) {
      console.error('Error loading track:', error)
    }
  }

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* Library Header */}
      <div className="px-6 py-3 border-b border-rmxrborder flex items-center gap-4">
        <div className="text-[10px] font-bold text-muted uppercase tracking-widest">Library</div>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tracks..."
            className="w-full bg-bg border border-rmxrborder rounded-lg px-4 py-2 text-sm text-rmxrtext placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Genre Filter - Narrower */}
        <div className="w-24 border-r border-rmxrborder bg-surface2 p-3 space-y-1 overflow-y-auto">
          <div className="text-[9px] text-muted uppercase tracking-wider mb-2">Genre</div>
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`w-full text-left px-2 py-1.5 rounded-md text-[11px] transition-all ${
                selectedGenre === genre
                  ? 'bg-accent/20 text-accent-400 font-semibold'
                  : 'text-muted hover:text-rmxrtext hover:bg-surface'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Center: Track List */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-surface2 border-b border-rmxrborder">
              <tr className="text-[10px] text-muted uppercase tracking-wider">
                <th className="text-left px-6 py-3 font-semibold">Track</th>
                <th className="text-left px-4 py-3 font-semibold">Artist</th>
                <th className="text-center px-4 py-3 font-semibold">BPM</th>
                <th className="text-center px-4 py-3 font-semibold">Key</th>
                <th className="text-center px-6 py-3 font-semibold w-32">Load</th>
              </tr>
            </thead>
            <tbody>
              {filteredTracks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-muted text-sm">
                    No tracks found
                  </td>
                </tr>
              ) : (
                filteredTracks.map(track => (
                  <tr key={track.id} className="lib-row border-b border-rmxrborder/50 hover:bg-surface2 transition-colors">
                    <td className="px-6 py-3 text-sm text-rmxrtext">{track.name}</td>
                    <td className="px-4 py-3 text-sm text-muted">{track.artist}</td>
                    <td className="px-4 py-3 text-sm text-center font-mono text-muted">{track.bpm}</td>
                    <td className="px-4 py-3 text-sm text-center font-mono text-muted">{track.key}</td>
                    <td className="px-6 py-3">
                      {/* Hover-only action chips */}
                      <div className="actions flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleLoadTrack(track, 'A')}
                          title="Load to Deck A"
                          className="px-3 py-1 rounded-md border border-rmxrborder hover:border-accent bg-surface hover:bg-surface2 text-rmxrtext hover:text-accent-400 text-[11px] font-semibold transition-all"
                        >
                          → A
                        </button>
                        <button
                          onClick={() => handleLoadTrack(track, 'B')}
                          title="Load to Deck B"
                          className="px-3 py-1 rounded-md border border-rmxrborder hover:border-accent bg-surface hover:bg-surface2 text-rmxrtext hover:text-accent-400 text-[11px] font-semibold transition-all"
                        >
                          → B
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Footer */}
      <div className="px-6 py-2 border-t border-rmxrborder bg-surface2 text-[10px] text-muted flex items-center justify-between">
        <span>{filteredTracks.length} tracks</span>
        <span>Hover row to load</span>
      </div>
    </div>
  )
}

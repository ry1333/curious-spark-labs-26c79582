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

  // Demo tracks/loops
  const tracks: Track[] = [
    { id: '1', name: 'Deep House Loop', artist: 'RMXR', bpm: 124, key: 'Am', genre: 'House', url: '/loops/demo_loop.mp3' },
    { id: '2', name: 'Tech Groove', artist: 'RMXR', bpm: 128, key: 'Dm', genre: 'Techno', url: '/loops/demo_loop.mp3' },
    { id: '3', name: 'Hip-Hop Beat', artist: 'RMXR', bpm: 90, key: 'C', genre: 'Hip-Hop', url: '/loops/demo_loop.mp3' },
    { id: '4', name: 'Lo-Fi Chill', artist: 'RMXR', bpm: 80, key: 'G', genre: 'Lo-Fi', url: '/loops/demo_loop.mp3' },
    { id: '5', name: 'EDM Drop', artist: 'RMXR', bpm: 128, key: 'Em', genre: 'EDM', url: '/loops/demo_loop.mp3' },
  ]

  const genres = ['All', 'House', 'Techno', 'Hip-Hop', 'Lo-Fi', 'EDM']

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
    <div className="h-full flex flex-col">
      {/* Library Header */}
      <div className="px-6 py-3 border-b border-white/10 flex items-center gap-4">
        <div className="text-sm font-bold opacity-80">LIBRARY</div>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tracks..."
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Genre Filter */}
        <div className="w-48 border-r border-white/10 bg-black/30 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs opacity-60 mb-3">GENRES</div>
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                selectedGenre === genre
                  ? 'bg-purple-500/20 text-purple-400 font-semibold'
                  : 'hover:bg-white/5 opacity-70 hover:opacity-100'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Center: Track List */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-neutral-950 border-b border-white/10">
              <tr className="text-xs opacity-60">
                <th className="text-left px-4 py-3 font-medium">TRACK</th>
                <th className="text-left px-4 py-3 font-medium">ARTIST</th>
                <th className="text-center px-4 py-3 font-medium">BPM</th>
                <th className="text-center px-4 py-3 font-medium">KEY</th>
                <th className="text-center px-4 py-3 font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredTracks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 opacity-60 text-sm">
                    No tracks found
                  </td>
                </tr>
              ) : (
                filteredTracks.map(track => (
                  <tr key={track.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm">{track.name}</td>
                    <td className="px-4 py-3 text-sm opacity-70">{track.artist}</td>
                    <td className="px-4 py-3 text-sm text-center font-mono">{track.bpm}</td>
                    <td className="px-4 py-3 text-sm text-center font-mono">{track.key}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleLoadTrack(track, 'A')}
                          className="px-3 py-1 rounded-md bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-xs font-semibold transition-all"
                        >
                          → A
                        </button>
                        <button
                          onClick={() => handleLoadTrack(track, 'B')}
                          className="px-3 py-1 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-semibold transition-all"
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

      {/* Info Banner */}
      <div className="px-6 py-2 border-t border-white/10 bg-black/30 text-xs opacity-60 flex items-center justify-between">
        <span>{filteredTracks.length} tracks available</span>
        <span>Click → A or → B to load track into deck</span>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Music, Play } from 'lucide-react'
import { toast } from 'sonner'

interface LocalTrack {
  fileName: string
  path: string
  bpm: number
  genre: string
  title: string
  artist: string
  key: string
  duration?: string
  license?: string
}

interface LocalTrackLibraryProps {
  onSelect: (audioUrl: string, caption: string, bpm: number) => void
}

// Local tracks from public/loops/
const LOCAL_TRACKS: LocalTrack[] = [
  {
    fileName: "deep_house_124.wav",
    path: "/loops/deep_house_124.wav",
    bpm: 124,
    genre: "House",
    title: "Deep House Loop",
    artist: "Demo",
    key: "Am",
    duration: "0:15"
  },
  {
    fileName: "tech_groove_128.wav",
    path: "/loops/tech_groove_128.wav",
    bpm: 128,
    genre: "Techno",
    title: "Tech Groove",
    artist: "Demo",
    key: "Em",
    duration: "0:15"
  },
  {
    fileName: "lofi_chill_80.wav",
    path: "/loops/lofi_chill_80.wav",
    bpm: 80,
    genre: "Lo-Fi",
    title: "Chill Beat",
    artist: "Demo",
    key: "Cm",
    duration: "0:15"
  },
  {
    fileName: "hiphop_beat_90.wav",
    path: "/loops/hiphop_beat_90.wav",
    bpm: 90,
    genre: "Hip-Hop",
    title: "Boom Bap",
    artist: "Demo",
    key: "Gm",
    duration: "0:15"
  },
  {
    fileName: "edm_drop_128.wav",
    path: "/loops/edm_drop_128.wav",
    bpm: 128,
    genre: "EDM",
    title: "Festival Drop",
    artist: "Demo",
    key: "C",
    duration: "0:15"
  },
  {
    fileName: "bensound_jazzy.mp3",
    path: "/loops/bensound_jazzy.mp3",
    bpm: 120,
    genre: "Jazz",
    title: "Jazzy Frenchy",
    artist: "Bensound",
    key: "Dm",
    duration: "1:44",
    license: "Free with attribution"
  },
  {
    fileName: "bensound_funkysuspense.mp3",
    path: "/loops/bensound_funkysuspense.mp3",
    bpm: 95,
    genre: "Funk",
    title: "Funky Suspense",
    artist: "Bensound",
    key: "Em",
    duration: "3:15",
    license: "Free with attribution"
  },
  {
    fileName: "bensound_groovy.mp3",
    path: "/loops/bensound_groovy.mp3",
    bpm: 90,
    genre: "Hip-Hop",
    title: "Groovy Hip Hop",
    artist: "Bensound",
    key: "Am",
    duration: "1:48",
    license: "Free with attribution"
  },
  {
    fileName: "bensound_energy.mp3",
    path: "/loops/bensound_energy.mp3",
    bpm: 130,
    genre: "EDM",
    title: "Energy",
    artist: "Bensound",
    key: "Gm",
    duration: "2:15",
    license: "Free with attribution"
  }
];

export default function LocalTrackLibrary({ onSelect }: LocalTrackLibraryProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  const genres = ['all', ...Array.from(new Set(LOCAL_TRACKS.map(t => t.genre)))];

  const filteredTracks = selectedGenre === 'all'
    ? LOCAL_TRACKS
    : LOCAL_TRACKS.filter(t => t.genre === selectedGenre);

  const handleTrackClick = (track: LocalTrack) => {
    onSelect(
      track.path,
      `${track.title} - ${track.artist}`,
      track.bpm
    );
    toast.success(`Loading ${track.title}...`);
  };

  return (
    <div className="space-y-3">
      {/* Genre Filter */}
      <div className="flex gap-2 flex-wrap">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedGenre === genre
                ? 'bg-gradient-to-r from-cyan to-magenta text-ink shadow-glow-cyan'
                : 'bg-surface border border-line text-muted hover:text-text hover:border-accent/50'
            }`}
          >
            {genre.charAt(0).toUpperCase() + genre.slice(1)}
          </button>
        ))}
      </div>

      {/* Track List */}
      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-accent/30 scrollbar-track-surface">
        {filteredTracks.map((track) => (
          <button
            key={track.fileName}
            onClick={() => handleTrackClick(track)}
            className="w-full p-3 rounded-lg border border-line hover:border-cyan bg-surface/50 hover:bg-surface text-left transition-all group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-text text-sm truncate group-hover:text-cyan transition-colors">
                  {track.title}
                </div>
                <div className="text-xs text-muted/80 truncate">
                  {track.artist}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                  <span className="px-1.5 py-0.5 rounded bg-cyan/10 text-cyan font-medium">
                    {track.bpm} BPM
                  </span>
                  <span>•</span>
                  <span>{track.genre}</span>
                  <span>•</span>
                  <span>{track.key}</span>
                  {track.duration && (
                    <>
                      <span>•</span>
                      <span>{track.duration}</span>
                    </>
                  )}
                </div>
                {track.license && (
                  <div className="text-[10px] text-muted/60 mt-1">
                    {track.license}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredTracks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Music className="w-12 h-12 text-muted/50 mb-2" />
          <p className="text-muted text-sm">No tracks in this genre</p>
        </div>
      )}
    </div>
  )
}

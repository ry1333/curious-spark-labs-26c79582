import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { LucideIcon, Zap, Piano, Building2, Repeat, Sliders, Waves, Volume2, RotateCw, Mic } from 'lucide-react'
import InteractiveLessonChallenge from '../components/InteractiveLessonChallenge'
import LearnHero from '../components/LearnHero'
import { LessonCard } from '../components/LessonCard'
import { FilterChips } from '../components/FilterChips'

type ChallengeType = 'bpm-match' | 'key-match' | 'eq-balance' | 'filter-sweep' | 'crossfade-timing' | 'phrase-counting' | 'beatmatching-ear' | 'transition-planning' | 'harmonic-mixing' | null

type Lesson = {
  id: string
  title: string
  duration: string
  icon: LucideIcon
  level: 'beginner' | 'intermediate' | 'advanced'
  description: string
  hasChallenge?: ChallengeType
  content: {
    overview: string
    keyPoints: string[]
    tryIt: string
    proTip: string
  }
}

export default function Learn() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [activeFilters, setActiveFilters] = useState<{
    level: string | null
    duration: string | null
    topic: string | null
  }>({
    level: null,
    duration: null,
    topic: null
  })

  const lessons: Lesson[] = [
    {
      id: 'bpm-tempo',
      title: 'BPM & Tempo Matching',
      duration: '2 min',
      icon: Zap,
      level: 'beginner',
      description: 'Master beatmatching - the foundation of smooth mixing',
      hasChallenge: 'bpm-match',
      content: {
        overview: 'BPM (Beats Per Minute) determines the speed of your track. Matching BPMs between two tracks is essential for smooth transitions.',
        keyPoints: [
          'House music: 120-128 BPM (sweet spot: 124 BPM)',
          'Hip-Hop: 80-100 BPM',
          'Techno: 125-135 BPM',
          'Drum & Bass: 160-180 BPM',
          'Use the pitch slider to match tempos (±8% usually enough)'
        ],
        tryIt: 'In DJ Studio: Load two tracks, check their BPMs, use the pitch slider on the slower track to match the faster one. Click "Sync B → A" for auto-sync!',
        proTip: 'Start with tracks in the same genre - they\'ll naturally have similar BPMs making it easier to match.'
      }
    },
    {
      id: 'keys-energy',
      title: 'Harmonic Mixing',
      duration: '3 min',
      icon: Piano,
      level: 'beginner',
      description: 'Mix tracks that sound good together using musical keys',
      hasChallenge: 'harmonic-mixing',
      content: {
        overview: 'Harmonic mixing means playing tracks in compatible keys. This prevents clashing notes and creates smooth, professional-sounding transitions.',
        keyPoints: [
          'Same key = always compatible (e.g., Am to Am)',
          'Relative keys work well (e.g., Am to C major)',
          'Adjacent keys on the Camelot wheel are safe',
          'Energy levels matter: build up, don\'t jump down suddenly',
          'Use the "key" field when publishing to help others remix'
        ],
        tryIt: 'Check the key of your tracks before mixing. If unsure, trust your ears - if it sounds good, it IS good!',
        proTip: 'Apps like Mixed In Key or KeyFinder can analyze your tracks\' keys. But for 30-second clips, energy/vibe matters more than perfect keys!'
      }
    },
    {
      id: 'structure',
      title: 'Track Structure',
      duration: '2 min',
      icon: Building2,
      level: 'beginner',
      description: 'Understand how tracks are built and where to mix',
      hasChallenge: 'phrase-counting',
      content: {
        overview: 'Most electronic tracks follow predictable structures. Knowing this helps you plan your mix and hit the drop at the perfect moment.',
        keyPoints: [
          'Intro (0-16 bars): Minimal elements, good for mixing in',
          'Build-up (8-16 bars): Energy rises, tension builds',
          'Drop (8-32 bars): Main hook, full energy',
          'Breakdown (8-16 bars): Strip back, create contrast',
          'Outro (8-16 bars): Wind down, good for mixing out'
        ],
        tryIt: 'For 30-second clips on RMXR: Start at build-up → hit the drop at 15 seconds → ride it out. Simple and effective!',
        proTip: 'Count in 8s (8 bars = 8 repetitions of a 4-beat phrase). Most changes happen every 8, 16, or 32 bars.'
      }
    },
    {
      id: 'crossfading',
      title: 'Crossfader Technique',
      duration: '2 min',
      icon: Repeat,
      level: 'beginner',
      description: 'Smooth transitions between two tracks using the crossfader',
      hasChallenge: 'crossfade-timing',
      content: {
        overview: 'The crossfader blends Deck A and Deck B. Moving it smoothly creates professional transitions without awkward jumps.',
        keyPoints: [
          'Left = 100% Deck A, Right = 100% Deck B',
          'Middle = both decks at equal volume',
          'Slow fade = smooth/gradual transition (16-32 bars)',
          'Quick cut = sudden/energetic change (on the drop)',
          'Practice moving it in time with the beat'
        ],
        tryIt: 'Start with Deck A playing. At the start of a phrase (count 1), slowly move the crossfader right over 16 beats. Deck B takes over smoothly!',
        proTip: 'Combine crossfading with EQ cuts (drop the bass on the outgoing track) for cleaner blends.'
      }
    },
    {
      id: 'eq-basics',
      title: 'EQ Mixing',
      duration: '3 min',
      icon: Sliders,
      level: 'intermediate',
      description: 'Use EQ to carve space and create clean mixes',
      hasChallenge: 'eq-balance',
      content: {
        overview: 'EQ (equalization) lets you boost or cut frequencies. Use it to prevent two tracks from clashing and create space in your mix.',
        keyPoints: [
          'Low (bass): Cut when tracks clash, boost for impact',
          'Mid (vocals/melody): The soul of the track',
          'High (hi-hats/cymbals): Add brightness, air, energy',
          'Rule: Cut before you boost (less is more)',
          'EQ kill technique: Drop the bass/mids/highs completely for dramatic effect'
        ],
        tryIt: 'Mix two tracks. On the incoming track (Deck B), start with bass at -12dB. As you fade in, gradually boost it back to 0. The outgoing track\'s bass cuts as you go.',
        proTip: 'During the transition: outgoing track loses bass, incoming track gains it. This prevents muddy low-end buildup.'
      }
    },
    {
      id: 'filters',
      title: 'Filter Tricks',
      duration: '2 min',
      icon: Waves,
      level: 'intermediate',
      description: 'Use filters to create tension and energy in your mix',
      hasChallenge: 'filter-sweep',
      content: {
        overview: 'Filters remove frequencies progressively. Low-pass filters darken the sound, high-pass filters brighten it. Perfect for builds and transitions.',
        keyPoints: [
          'Low-pass: Cuts highs, makes sound "muffled" (like underwater)',
          'High-pass: Cuts lows, makes sound "thin" (like through a phone)',
          'Sweep slowly for tension, quickly for impact',
          'Combine with volume fades for double effect',
          'Reset to neutral (20kHz) when not using'
        ],
        tryIt: 'On the drop: start with low-pass filter at 500Hz, then sweep up to 20kHz over 8 beats. Instant drama!',
        proTip: 'Filter the outgoing track (makes it disappear smoothly) while the incoming track stays full-spectrum.'
      }
    },
    {
      id: 'gain-staging',
      title: 'Volume & Gain',
      duration: '2 min',
      icon: Volume2,
      level: 'intermediate',
      description: 'Keep your levels clean and prevent distortion',
      content: {
        overview: 'Proper gain staging means all your tracks play at similar volumes without clipping (distortion). This makes mixing smooth and professional.',
        keyPoints: [
          'Target: -14 LUFS for streaming platforms',
          'Watch the master meter: stay in the green/yellow',
          'Red = clipping = distortion = bad',
          'Use deck gain to match track volumes',
          'Master volume controls overall output'
        ],
        tryIt: 'In DJ Studio: If one track is quieter, boost its deck volume. Aim for both tracks to "feel" the same loudness when solo\'d.',
        proTip: 'Leave headroom! Better to be slightly quiet than clipping. You can always turn up your speakers/headphones.'
      }
    },
    {
      id: 'transitions',
      title: 'Transition Techniques',
      duration: '3 min',
      icon: RotateCw,
      level: 'advanced',
      description: 'Combine all skills for seamless, creative transitions',
      hasChallenge: 'transition-planning',
      content: {
        overview: 'Great transitions are invisible - the audience shouldn\'t notice when one track becomes another. Combine EQ, filters, volume, and timing.',
        keyPoints: [
          'Start the incoming track at the right point (intro/breakdown)',
          'Use EQ to carve space (bass swap technique)',
          'Add filter sweeps for energy',
          'Time it with the phrase (every 8/16/32 bars)',
          'Trust your ears over rules'
        ],
        tryIt: 'Full transition recipe: (1) Start Deck B at intro, bass at -12dB. (2) Slowly crossfade over 16 bars. (3) As you fade, boost Deck B bass to 0, cut Deck A bass to -12dB. (4) Optional: add a filter sweep at the end.',
        proTip: 'For 30-second RMXR clips: Keep it simple! Quick cuts on the drop work great. You don\'t need a long blend.'
      }
    },
    {
      id: 'recording',
      title: 'Recording Your Mix',
      duration: '2 min',
      icon: Mic,
      level: 'beginner',
      description: 'Capture your performance and share it with the world',
      content: {
        overview: 'Recording lets you save your mix and share it. On RMXR, aim for punchy 30-40 second clips that showcase one great moment.',
        keyPoints: [
          'Hit record BEFORE you start your transition',
          'Keep it short: 30-40 seconds is perfect for social',
          'Focus on one moment: a drop, a transition, a filter sweep',
          'Don\'t aim for perfection on first take - experiment!',
          'Add a style/caption when publishing'
        ],
        tryIt: 'In DJ Studio: Load two tracks, practice your transition 2-3 times. When you\'re ready, hit Record, nail it, then hit Stop. Publish to the feed!',
        proTip: 'Start your recording 4-8 bars before the moment you want to showcase. This gives context and builds anticipation.'
      }
    }
  ]

  const markComplete = (lessonId: string) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]))
    setSelectedLesson(null)
  }

  const handleFilterChange = (filterType: 'level' | 'duration' | 'topic', value: string | null) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  // Filter lessons based on active filters
  const filteredLessons = useMemo(() => {
    return lessons.filter(lesson => {
      // Level filter
      if (activeFilters.level && lesson.level !== activeFilters.level.toLowerCase()) {
        return false
      }

      // Duration filter
      if (activeFilters.duration) {
        const lessonMinutes = parseInt(lesson.duration)
        if (activeFilters.duration === '2m' && lessonMinutes !== 2) return false
        if (activeFilters.duration === '3m' && lessonMinutes !== 3) return false
        if (activeFilters.duration === '5m+' && lessonMinutes < 5) return false
      }

      // Topic filter
      if (activeFilters.topic) {
        const topicMap: Record<string, string[]> = {
          'BPM': ['bpm-tempo', 'transitions'],
          'EQ': ['eq-basics', 'transitions'],
          'Filters': ['filters', 'transitions'],
          'Keys': ['keys-energy'],
          'Structure': ['structure', 'transitions']
        }
        const relevantLessons = topicMap[activeFilters.topic] || []
        if (!relevantLessons.includes(lesson.id)) return false
      }

      return true
    })
  }, [lessons, activeFilters])

  // Organize lessons by sections
  const corePath = lessons.filter(l => ['bpm-tempo', 'keys-energy', 'structure', 'crossfading'].includes(l.id))
  const quickDrills = lessons.filter(l => l.duration === '2 min' && l.hasChallenge)
  const intermediateAdvanced = lessons.filter(l => ['intermediate', 'advanced'].includes(l.level))

  // Find the first incomplete lesson for "Continue" feature
  const nextLesson = lessons.find(l => !completedLessons.has(l.id))

  const levelColors = {
    beginner: 'text-green-400 bg-green-500/10 border-green-500/30',
    intermediate: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    advanced: 'text-red-400 bg-red-500/10 border-red-500/30'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink via-surface to-ink text-text p-6 md:p-8 lg:p-10 space-y-8">
      {/* Hero with progress */}
      <LearnHero
        completedCount={completedLessons.size}
        totalCount={lessons.length}
        currentLesson={nextLesson ? { title: nextLesson.title, progress: 0 } : undefined}
      />

      {/* Filter chips */}
      <div className="rounded-2xl border border-line bg-card/50 backdrop-blur-xl p-6">
        <FilterChips activeFilters={activeFilters} onFilterChange={handleFilterChange} />
      </div>

      {/* Core Path - Beginner lessons in order */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-text">Core Path</h2>
          <span className="text-sm text-muted">Start here • Complete in order</span>
        </div>
        <div className="space-y-3">
          {corePath.map((lesson, index) => {
            const isCompleted = completedLessons.has(lesson.id)
            const prevCompleted = index === 0 || completedLessons.has(corePath[index - 1].id)
            const isLocked = !prevCompleted && !isCompleted

            return (
              <div key={lesson.id} className="flex items-center gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isLocked
                    ? 'bg-white/5 text-muted border border-line'
                    : 'bg-gradient-to-r from-accentFrom to-accentTo text-ink'
                }`}>
                  {isCompleted ? '✓' : index + 1}
                </div>
                <div className="flex-1">
                  <LessonCard
                    title={lesson.title}
                    minutes={lesson.duration}
                    level={lesson.level}
                    outcome={lesson.description}
                    icon={lesson.icon}
                    tags={['Core']}
                    isCompleted={isCompleted}
                    hasChallenge={!!lesson.hasChallenge}
                    onClick={() => !isLocked && setSelectedLesson(lesson)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Quick Drills - horizontal scroll */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-text">Quick Drills</h2>
          <span className="text-sm text-muted">2-3 min practice challenges</span>
        </div>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
          {quickDrills.map((lesson) => (
            <div key={lesson.id} className="flex-shrink-0 w-[320px] snap-start">
              <LessonCard
                title={lesson.title}
                minutes={lesson.duration}
                level={lesson.level}
                outcome={lesson.description}
                icon={lesson.icon}
                tags={['Challenge']}
                isCompleted={completedLessons.has(lesson.id)}
                hasChallenge={!!lesson.hasChallenge}
                onClick={() => setSelectedLesson(lesson)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Technique Library - filtered grid */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-text">Technique Library</h2>
          <span className="text-sm text-muted">{filteredLessons.length} lessons</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {(activeFilters.level || activeFilters.duration || activeFilters.topic ? filteredLessons : intermediateAdvanced).map((lesson) => (
            <LessonCard
              key={lesson.id}
              title={lesson.title}
              minutes={lesson.duration}
              level={lesson.level}
              outcome={lesson.description}
              icon={lesson.icon}
              tags={[lesson.level === 'intermediate' ? 'Intermediate' : 'Advanced']}
              progress={completedLessons.has(lesson.id) ? 1 : 0}
              isCompleted={completedLessons.has(lesson.id)}
              hasChallenge={!!lesson.hasChallenge}
              onClick={() => setSelectedLesson(lesson)}
            />
          ))}
        </div>
      </section>


      {/* Lesson Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-ink/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gradient-to-br from-card to-surface border border-line rounded-2xl max-w-3xl w-full my-8 shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-white/10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-accentFrom/20 to-accentTo/20">
                      <selectedLesson.icon size={32} className="text-accentFrom" strokeWidth={2} />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${levelColors[selectedLesson.level]}`}>
                      {selectedLesson.level.charAt(0).toUpperCase() + selectedLesson.level.slice(1)}
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/70">
                      {selectedLesson.duration}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedLesson.title}</h2>
                  <p className="text-white/60 mt-2">{selectedLesson.description}</p>
                </div>
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="rounded-xl border border-white/20 p-2 hover:bg-white/10 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Interactive Challenge */}
              {selectedLesson.hasChallenge && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🎮</span>
                    <h3 className="text-lg font-bold text-white">Interactive Challenge</h3>
                  </div>
                  <InteractiveLessonChallenge
                    type={selectedLesson.hasChallenge}
                    onComplete={() => markComplete(selectedLesson.id)}
                  />
                </div>
              )}

              {/* Overview */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">What You'll Learn</h3>
                <p className="text-white/70 leading-relaxed">{selectedLesson.content.overview}</p>
              </div>

              {/* Key Points */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Key Points</h3>
                <ul className="space-y-2">
                  {selectedLesson.content.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span className="text-white/70 flex-1">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Try It */}
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-5">
                <h3 className="text-lg font-bold text-cyan-400 mb-2 flex items-center gap-2">
                  <span>💡</span> Try It in DJ Studio
                </h3>
                <p className="text-white/80 leading-relaxed">{selectedLesson.content.tryIt}</p>
                <Link
                  to="/dj"
                  className="inline-block mt-3 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm transition-all"
                >
                  Open DJ Studio →
                </Link>
              </div>

              {/* Pro Tip */}
              <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-5">
                <h3 className="text-lg font-bold text-purple-400 mb-2 flex items-center gap-2">
                  <span>⭐</span> Pro Tip
                </h3>
                <p className="text-white/80 leading-relaxed">{selectedLesson.content.proTip}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 md:p-8 border-t border-white/10 flex gap-3">
              <button
                onClick={() => setSelectedLesson(null)}
                className="flex-1 rounded-xl border border-white/20 px-6 py-3 text-white font-semibold hover:bg-white/10 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => markComplete(selectedLesson.id)}
                className="flex-1 rounded-xl bg-white hover:bg-white/90 px-6 py-3 text-black font-bold transition-all hover:scale-105 active:scale-95"
              >
                Mark Complete ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

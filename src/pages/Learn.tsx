export default function Learn() {
  const lessons = [
    {
      title: 'BPM & Tempo',
      duration: '1 min',
      text: 'House 120–128 BPM. Start at 124 and nudge.',
      icon: '⚡',
      color: 'cyan'
    },
    {
      title: 'Keys & Energy',
      duration: '1 min',
      text: 'Keep same key or relative minor for smooth drops.',
      icon: '🎹',
      color: 'magenta'
    },
    {
      title: 'Structure',
      duration: '1 min',
      text: 'Intro → build → drop. 8 bars each in MVP.',
      icon: '🏗️',
      color: 'purple'
    },
    {
      title: 'Gain Staging',
      duration: '30s',
      text: '-14 LUFS target, avoid clipping.',
      icon: '🎚️',
      color: 'cyan'
    },
    {
      title: 'EQ Basics',
      duration: '2 min',
      text: 'Cut lows on mids/highs, boost highs for clarity.',
      icon: '🎛️',
      color: 'magenta'
    },
    {
      title: 'Transitions',
      duration: '1 min',
      text: 'Use filters, EQ cuts, and volume automation for smooth blends.',
      icon: '🔄',
      color: 'purple'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white p-6 md:p-8 lg:p-10 space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
          Learn DJ Skills
        </h1>
        <p className="text-base md:text-lg opacity-60 mt-3">
          Micro-lessons to level up fast. Master the fundamentals of electronic music production.
        </p>
      </header>

      {/* Lessons Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {lessons.map((lesson) => (
          <div
            key={lesson.title}
            className={`group rounded-2xl border p-6 transition-all hover:scale-105 cursor-pointer ${
              lesson.color === 'cyan' ? 'border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 hover:border-cyan-500/40' :
              lesson.color === 'magenta' ? 'border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/10 to-fuchsia-500/5 hover:border-fuchsia-500/40' :
              'border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-500/5 hover:border-purple-500/40'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`text-4xl p-3 rounded-xl ${
                lesson.color === 'cyan' ? 'bg-cyan-500/10' :
                lesson.color === 'magenta' ? 'bg-fuchsia-500/10' :
                'bg-purple-500/10'
              }`}>
                {lesson.icon}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                lesson.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' :
                lesson.color === 'magenta' ? 'bg-fuchsia-500/20 text-fuchsia-400' :
                'bg-purple-500/20 text-purple-400'
              }`}>
                {lesson.duration}
              </span>
            </div>
            <h3 className="font-bold text-lg mb-2">{lesson.title}</h3>
            <p className="opacity-70 text-sm leading-relaxed">{lesson.text}</p>
            <button className={`mt-4 w-full py-2 rounded-xl font-semibold transition-all ${
              lesson.color === 'cyan' ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400' :
              lesson.color === 'magenta' ? 'bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-400' :
              'bg-purple-500/10 hover:bg-purple-500/20 text-purple-400'
            }`}>
              Start Lesson
            </button>
          </div>
        ))}
      </div>

      {/* Learning Paths */}
      <section className="mt-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
          Learning Paths
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 p-6 hover:border-cyan-500/40 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">🎧</div>
              <div>
                <h3 className="font-bold text-xl text-cyan-400">Beginner DJ</h3>
                <p className="text-sm opacity-60">6 lessons • 15 minutes</p>
              </div>
            </div>
            <p className="opacity-70 text-sm mb-4">
              Learn the basics of DJing: beatmatching, transitions, and using the DJ interface.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 w-1/3" />
              </div>
              <span className="text-xs opacity-60">33%</span>
            </div>
          </div>

          <div className="rounded-2xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/10 to-fuchsia-500/5 p-6 hover:border-fuchsia-500/40 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">🎵</div>
              <div>
                <h3 className="font-bold text-xl text-fuchsia-400">Music Production</h3>
                <p className="text-sm opacity-60">8 lessons • 25 minutes</p>
              </div>
            </div>
            <p className="opacity-70 text-sm mb-4">
              Master music theory, sound design, and arrangement for electronic music.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-fuchsia-400 to-pink-600 w-0" />
              </div>
              <span className="text-xs opacity-60">0%</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

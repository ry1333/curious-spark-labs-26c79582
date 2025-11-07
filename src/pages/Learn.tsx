export default function Learn() {
  const lessons = [
    { title: 'BPM & Tempo (1 min)', text: 'House 120–128 BPM. Start at 124 and nudge.' },
    { title: 'Keys & Energy (1 min)', text: 'Keep same key or relative minor for smooth drops.' },
    { title: 'Structure (1 min)', text: 'Intro → build → drop. 8 bars each in MVP.' },
    { title: 'Gain Staging (30s)', text: '-14 LUFS target, avoid clipping.' },
  ]
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Learn</h1>
      <p className="opacity-70">Micro-lessons to level up fast.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {lessons.map((l) => (
          <div key={l.title} className="rounded-2xl border p-4 bg-white">
            <div className="font-semibold">{l.title}</div>
            <p className="opacity-70 text-sm mt-1">{l.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

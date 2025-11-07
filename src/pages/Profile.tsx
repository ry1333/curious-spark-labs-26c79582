export default function Profile() {
  const stats = [
    { k: 'Mixes', v: 3, color: 'cyan' },
    { k: 'Likes', v: 21, color: 'magenta' },
    { k: 'Remixes', v: 5, color: 'purple' },
  ]
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white p-6 md:p-8 lg:p-10 space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-cyan-500 via-purple-500 to-fuchsia-500 p-1">
            <div className="h-full w-full rounded-full bg-neutral-900 flex items-center justify-center text-4xl">
              👤
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-4 border-neutral-900" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            @you
          </h1>
          <p className="text-sm md:text-base opacity-60 mt-1">Electronic Music Creator</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
              DJ
            </span>
            <span className="px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 text-xs font-medium">
              Producer
            </span>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-3 md:gap-4">
        {stats.map(s => (
          <div
            key={s.k}
            className={`rounded-2xl border p-4 md:p-6 text-center transition-all hover:scale-105 ${
              s.color === 'cyan' ? 'border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5' :
              s.color === 'magenta' ? 'border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/10 to-fuchsia-500/5' :
              'border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-500/5'
            }`}
          >
            <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-br ${
              s.color === 'cyan' ? 'from-cyan-400 to-cyan-600' :
              s.color === 'magenta' ? 'from-fuchsia-400 to-pink-600' :
              'from-purple-400 to-pink-600'
            } bg-clip-text text-transparent`}>
              {s.v}
            </div>
            <div className="text-xs md:text-sm opacity-60 mt-1 font-medium">{s.k}</div>
          </div>
        ))}
      </section>

      {/* Recent Mixes */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
          Recent Mixes
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="group rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900/90 to-black p-6 hover:border-purple-500/30 transition-all hover:scale-105"
            >
              <div className="aspect-square rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all">
                <span className="text-4xl">🎵</span>
              </div>
              <div className="text-center">
                <div className="font-semibold opacity-60 text-sm">Coming soon</div>
                <div className="text-xs opacity-40 mt-1">Upload your first mix</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activity Section */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
          Recent Activity
        </h2>
        <div className="space-y-3">
          {[
            { action: 'Liked', track: 'Midnight Groove', user: '@djmaster', time: '2h ago', icon: '❤️' },
            { action: 'Remixed', track: 'Summer Vibes', user: '@producer', time: '5h ago', icon: '🔄' },
            { action: 'Posted', track: 'Your New Mix', user: 'you', time: '1d ago', icon: '🎵' },
          ].map((activity, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-neutral-900/50 p-4 flex items-center gap-4 hover:border-purple-500/30 transition-all"
            >
              <div className="text-2xl">{activity.icon}</div>
              <div className="flex-1">
                <div className="font-medium">
                  {activity.action} <span className="text-purple-400">{activity.track}</span>
                </div>
                <div className="text-sm opacity-60">by {activity.user} • {activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

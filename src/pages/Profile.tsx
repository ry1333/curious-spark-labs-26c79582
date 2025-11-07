export default function Profile() {
  const stats = [
    { k: 'Mixes', v: 3 },
    { k: 'Likes', v: 21 },
    { k: 'Remixes', v: 5 },
  ]
  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-black/10" />
        <div>
          <div className="text-xl font-bold">@you</div>
          <div className="text-sm opacity-60">Creator</div>
        </div>
      </header>
      <section className="flex gap-3">
        {stats.map(s => (
          <div key={s.k} className="rounded-2xl border bg-white p-4 w-28 text-center">
            <div className="text-2xl font-bold">{s.v}</div>
            <div className="text-xs opacity-60">{s.k}</div>
          </div>
        ))}
      </section>
      <section>
        <h2 className="font-semibold mb-2">Recent Mixes</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="rounded-xl border p-3 bg-white text-sm opacity-70">Coming soon</div>
          <div className="rounded-xl border p-3 bg-white text-sm opacity-70">Coming soon</div>
          <div className="rounded-xl border p-3 bg-white text-sm opacity-70">Coming soon</div>
        </div>
      </section>
    </div>
  )
}

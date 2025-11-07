import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Create() {
  const nav = useNavigate()
  const [searchParams] = useSearchParams()
  const remix = searchParams.get('remix')

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Composer (legacy)</h1>
      {remix && (
        <div className="rounded-xl border bg-yellow-50 text-yellow-900 px-3 py-2">
          Remixing post #{remix}
        </div>
      )}
      <p className="opacity-70">Creation moved to the new DJ screen.</p>
      <button onClick={() => nav('/dj')} className="rounded-xl border px-4 py-2">Open DJ</button>
    </div>
  )
}

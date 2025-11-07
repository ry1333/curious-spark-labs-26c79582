import { useMemo, useState } from 'react'
import WaveformCanvas from './WaveformCanvas'

type Props = {
  label: string
  deck: any
  progress: number
  demo: string
}

export default function Turntable({ label, deck, progress, demo }: Props) {
  const [fileName, setFileName] = useState<string>('')

  async function loadDemo() { await deck.loadFromUrl(demo); setFileName('demo_loop.mp3') }
  async function loadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return; await deck.loadFromFile(f); setFileName(f.name)
  }

  // pitch control: -8%..+8%
  const [pitch, setPitch] = useState(0)
  function setPitchPct(p: number) {
    setPitch(p)
    deck.setRate(1 + p/100)
  }

  const spinning = deck.playing ? 'spin-slower' : ''

  return (
    <div className="rounded-2xl bg-black/60 p-4 border border-white/10 space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{label}</div>
        <div className="text-xs opacity-60 truncate max-w-[50%]">{fileName || 'No track'}</div>
      </div>

      {/* platter */}
      <div className="grid grid-cols-[1fr_56px] gap-3 items-center">
        <div className="relative">
          <div className={`mx-auto h-56 w-56 md:h-72 md:w-72 rounded-full border border-white/10 bg-gradient-to-br from-neutral-800 to-neutral-900 shadow-2xl ${spinning}`} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-10 w-10 rounded-full bg-black/90 border border-white/20" />
          </div>
        </div>

        {/* vertical pitch */}
        <div className="flex flex-col items-center">
          <div className="text-[11px] opacity-60 mb-1">Pitch</div>
          <input
            type="range" min={-8} max={8} step={0.1} value={pitch}
            onChange={(e)=>setPitchPct(parseFloat(e.target.value))}
            className="[writing-mode:tb-rl] h-56"
          />
          <div className="text-[11px] opacity-60 mt-1">{pitch.toFixed(1)}%</div>
        </div>
      </div>

      <WaveformCanvas audioBuffer={deck.buffer} progress={progress} />

      {/* transport */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={()=>deck.play()}  className="w-10 h-10 rounded-full bg-white text-black font-semibold">▶</button>
        <button onClick={()=>deck.pause()} className="w-10 h-10 rounded-full border">⏸</button>
        <button onClick={()=>deck.seek(0)} className="rounded-xl border px-3 py-2">Cue</button>
        <label className="rounded-xl border px-3 py-2 cursor-pointer">
          Load
          <input type="file" accept="audio/*" onChange={loadFile} className="hidden"/>
        </label>
        <button onClick={loadDemo} className="rounded-xl border px-3 py-2">Load demo</button>
      </div>
    </div>
  )
}

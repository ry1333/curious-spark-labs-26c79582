import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Mixer } from '../lib/audio/mixer'
import Turntable from '../components/Turntable'
import { Link } from 'react-router-dom'

export default function DJ() {
  const mixer = useMemo(() => new Mixer(), [])
  const [aProg, setAProg] = useState(0)
  const [bProg, setBProg] = useState(0)
  const raf = useRef<number | null>(null)
  const [xf, setXf] = useState(0) // 0..1 crossfader
  const [aBpm, setABpm] = useState(124)
  const [bBpm, setBBpm] = useState(124)

  useEffect(() => {
    const tick = () => {
      const aDur = mixer.deckA.buffer?.duration || 1
      const bDur = mixer.deckB.buffer?.duration || 1
      setAProg(mixer.deckA.currentTime / aDur)
      setBProg(mixer.deckB.currentTime / bDur)
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [mixer])

  useEffect(() => { mixer.setCrossfade(xf) }, [xf, mixer])

  function syncBtoA() {
    if (!mixer.deckA.buffer || !mixer.deckB.buffer) return
    const ratio = bBpm / aBpm
    mixer.deckB.setRate(1/ratio) // match B tempo to A
  }

  return (
    <div className="p-4 md:p-6 space-y-4 text-white min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">RMXR — DJ</h1>
        <Link to="/stream" className="text-sm opacity-70 hover:opacity-100">← Back to Stream</Link>
      </div>

      {/* Turntables row */}
      <div className="grid md:grid-cols-2 gap-4">
        <Turntable label="Deck A" deck={mixer.deckA} progress={aProg} demo="/loops/demo_loop.mp3" />
        <Turntable label="Deck B" deck={mixer.deckB} progress={bProg} demo="/loops/demo_loop.mp3" />
      </div>

      {/* Mixer block */}
      <div className="rounded-2xl bg-black/60 p-4 border border-white/10 space-y-4">
        <div className="text-xs opacity-70">Crossfader</div>
        <input type="range" min={0} max={1} step={0.001} value={xf}
               onChange={(e)=>setXf(parseFloat(e.target.value))} className="w-full"/>
        <div className="flex justify-between text-xs opacity-60"><span>A</span><span>B</span></div>

        <div className="grid md:grid-cols-3 gap-3 mt-3">
          <EQ label="Deck A EQ" onChange={(low,mid,high)=>mixer.deckA.setEQ({low,mid,high})}/>
          <Filter label="Deck A Filter" onChange={(hz)=>mixer.deckA.setFilterHz(hz)}/>
          <div className="rounded-xl border p-3">
            <div className="text-xs opacity-60 mb-1">Sync</div>
            <div className="flex items-end gap-2">
              <Number label="A BPM" value={aBpm} onChange={setABpm}/>
              <Number label="B BPM" value={bBpm} onChange={setBBpm}/>
              <button className="rounded-xl bg-white text-black px-3 py-2" onClick={syncBtoA}>Sync B→A</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EQ({ label, onChange }:{label:string; onChange:(low:number,mid:number,high:number)=>void}) {
  const [low,setLow]=useState(0), [mid,setMid]=useState(0), [high,setHigh]=useState(0)
  useEffect(()=>{ onChange(low,mid,high) },[low,mid,high])
  return (
    <div className="rounded-xl border p-3">
      <div className="text-xs opacity-60 mb-1">{label}</div>
      <Slider label="Low"  min={-24} max={+24} step={0.5} value={low}  onChange={setLow}/>
      <Slider label="Mid"  min={-18} max={+18} step={0.5} value={mid}  onChange={setMid}/>
      <Slider label="High" min={-24} max={+24} step={0.5} value={high} onChange={setHigh}/>
    </div>
  )
}

function Filter({ label, onChange }:{label:string; onChange:(hz:number)=>void}) {
  const [hz,setHz]=useState(20000)
  useEffect(()=>{ onChange(hz) },[hz])
  return (
    <div className="rounded-xl border p-3">
      <div className="text-xs opacity-60 mb-1">{label}</div>
      <input type="range" min={200} max={20000} step={1} value={hz} onChange={(e)=>setHz(parseFloat(e.target.value))} className="w-full"/>
    </div>
  )
}

function Number({ label, value, onChange }:{label:string; value:number; onChange:(n:number)=>void}) {
  return (
    <label className="text-xs opacity-70 flex items-center gap-1">
      {label}
      <input type="number" value={value} onChange={(e)=>onChange(parseFloat(e.target.value||'0'))}
             className="ml-1 w-20 rounded-xl bg-black border border-white/10 px-2 py-1"/>
    </label>
  )
}

function Slider({ label,min,max,step,value,onChange }:{
  label:string; min:number; max:number; step:number; value:number; onChange:(n:number)=>void
}) {
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs opacity-60">
        <span>{label}</span><span>{value.toFixed(1)} dB</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e)=>onChange(parseFloat(e.target.value))} className="w-full"/>
    </div>
  )
}

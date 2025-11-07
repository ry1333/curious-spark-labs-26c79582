import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Mixer } from '../lib/audio/mixer'
import Turntable from '../components/Turntable'
import CustomSlider from '../components/CustomSlider'
import { Link, useNavigate } from 'react-router-dom'
import { createPost } from '../lib/supabase/posts'
import { toast } from 'sonner'

export default function DJ() {
  const nav = useNavigate()
  const mixer = useMemo(() => new Mixer(), [])
  const [aProg, setAProg] = useState(0)
  const [bProg, setBProg] = useState(0)
  const raf = useRef<number | null>(null)
  const [xf, setXf] = useState(0) // 0..1 crossfader
  const [aBpm, setABpm] = useState(124)
  const [bBpm, setBBpm] = useState(124)
  const [masterVol, setMasterVol] = useState(0.8)
  const [isRecording, setIsRecording] = useState(false)

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
  useEffect(() => { mixer.master.gain.value = masterVol }, [masterVol, mixer])

  function syncBtoA() {
    if (!mixer.deckA.buffer || !mixer.deckB.buffer) return
    const ratio = bBpm / aBpm
    mixer.deckB.setRate(1/ratio) // match B tempo to A
    toast.success('Decks synced!')
  }

  async function handlePublish() {
    setIsRecording(true)
    toast.info('Recording not yet implemented - will capture and upload mix')

    // TODO: Implement actual recording
    // For now, just create a placeholder post
    try {
      // This would be replaced with actual audio recording/upload
      await createPost({
        audio_url: '/loops/demo_loop.mp3', // placeholder
        bpm: Math.round((aBpm + bBpm) / 2),
        style: 'DJ Mix',
        key: 'Mixed'
      })
      toast.success('Mix published!')
      setTimeout(() => nav('/stream'), 1000)
    } catch (error) {
      toast.error('Failed to publish. Please sign in first.')
    }
    setIsRecording(false)
  }

  return (
    <div className="p-4 md:p-8 lg:p-10 space-y-6 md:space-y-8 text-white min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            RMXR DJ Studio
          </h1>
          <p className="text-sm md:text-base opacity-60 mt-2">Mix, match, and create your sound</p>
        </div>
        <Link to="/stream" className="rounded-xl border border-white/20 px-5 py-2.5 hover:bg-white/10 hover:border-white/30 transition-all font-semibold hover:scale-105 active:scale-95">
          ← Back to Stream
        </Link>
      </div>

      {/* Turntables row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Turntable label="Deck A" deck={mixer.deckA} progress={aProg} demo="/loops/demo_loop.mp3" color="cyan" />
        <Turntable label="Deck B" deck={mixer.deckB} progress={bProg} demo="/loops/demo_loop.mp3" color="magenta" />
      </div>

      {/* Mixer block */}
      <div className="rounded-2xl bg-gradient-to-br from-neutral-900 to-black p-5 md:p-8 border border-white/10 shadow-2xl space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="font-semibold text-lg bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
            Mixer Controls
          </h2>
          <div className="w-full md:w-64">
            <CustomSlider
              label="Master Volume"
              min={0}
              max={100}
              step={1}
              value={masterVol * 100}
              onChange={(v) => setMasterVol(v / 100)}
              unit="%"
              color="purple"
            />
          </div>
        </div>

        {/* Crossfader */}
        <div className="space-y-3">
          <div className="text-sm font-semibold opacity-80 text-center">Crossfader</div>
          <div className="relative h-16 flex items-center">
            {/* Track background */}
            <div className="absolute inset-x-0 h-4 rounded-full bg-gradient-to-r from-cyan-500/20 via-neutral-800 to-fuchsia-500/20 border border-white/20" />

            {/* Active fill */}
            <div
              className="absolute h-4 rounded-full transition-all duration-100"
              style={{
                left: 0,
                right: `${(1 - xf) * 100}%`,
                background: `linear-gradient(to right, rgba(6, 182, 212, ${0.8 - xf * 0.6}), rgba(217, 70, 239, ${xf * 0.2}))`
              }}
            />
            <div
              className="absolute h-4 rounded-full transition-all duration-100"
              style={{
                left: `${xf * 100}%`,
                right: 0,
                background: `linear-gradient(to right, rgba(6, 182, 212, ${(1-xf) * 0.2}), rgba(217, 70, 239, ${0.2 + xf * 0.6}))`
              }}
            />

            {/* Thumb */}
            <div
              className="absolute w-8 h-8 rounded-lg bg-gradient-to-br from-white to-neutral-300 border-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.5)] pointer-events-none transition-all z-10"
              style={{ left: `calc(${xf * 100}% - 16px)` }}
            />

            {/* Hidden input */}
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={xf}
              onChange={(e)=>setXf(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
          </div>
          <div className="flex justify-between text-xs font-bold">
            <span className={`transition-all ${xf < 0.5 ? 'text-cyan-400 scale-110' : 'opacity-50'}`}>DECK A</span>
            <span className="opacity-40 text-[10px]">{Math.round((1-xf) * 100)}% / {Math.round(xf * 100)}%</span>
            <span className={`transition-all ${xf > 0.5 ? 'text-fuchsia-400 scale-110' : 'opacity-50'}`}>DECK B</span>
          </div>
        </div>

        {/* EQ and Controls Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <EQ label="Deck A EQ" onChange={(low,mid,high)=>mixer.deckA.setEQ({low,mid,high})} color="cyan"/>
          <EQ label="Deck B EQ" onChange={(low,mid,high)=>mixer.deckB.setEQ({low,mid,high})} color="magenta"/>

          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <Filter label="Filter A" onChange={(hz)=>mixer.deckA.setFilterHz(hz)} color="cyan"/>
            <Filter label="Filter B" onChange={(hz)=>mixer.deckB.setFilterHz(hz)} color="magenta"/>
          </div>
        </div>

        {/* BPM Sync */}
        <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-5">
          <div className="text-sm font-semibold opacity-80 mb-4 flex items-center gap-2">
            <span className="text-lg">⏱</span>
            <span>Tempo Sync</span>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[120px]">
              <Number label="Deck A BPM" value={aBpm} onChange={setABpm} color="cyan"/>
            </div>
            <div className="flex-1 min-w-[120px]">
              <Number label="Deck B BPM" value={bBpm} onChange={setBBpm} color="magenta"/>
            </div>
            <button
              className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-6 py-2.5 transition-all shadow-lg hover:shadow-purple-500/50 hover:scale-105 active:scale-95"
              onClick={syncBtoA}
            >
              🔗 Sync B → A
            </button>
          </div>
        </div>

        {/* Publish Button */}
        <div className="flex justify-center pt-6">
          <button
            onClick={handlePublish}
            disabled={isRecording || (!mixer.deckA.buffer && !mixer.deckB.buffer)}
            className="group relative rounded-2xl bg-gradient-to-r from-red-500 via-orange-500 to-red-500 bg-size-200 hover:bg-pos-100 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-10 py-4 text-lg transition-all duration-300 shadow-xl hover:shadow-red-500/50 hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:hover:shadow-xl"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isRecording ? (
                <>
                  <span className="animate-pulse">🎙️</span>
                  <span>Recording...</span>
                </>
              ) : (
                <>
                  <span>🎵</span>
                  <span>Publish Mix</span>
                </>
              )}
            </span>
            {!isRecording && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function EQ({ label, onChange, color }:{label:string; onChange:(low:number,mid:number,high:number)=>void; color:'cyan'|'magenta'}) {
  const [low,setLow]=useState(0), [mid,setMid]=useState(0), [high,setHigh]=useState(0)
  useEffect(()=>{ onChange(low,mid,high) },[low,mid,high])
  return (
    <div className={`rounded-xl border ${color === 'cyan' ? 'border-cyan-500/20 bg-cyan-500/5' : 'border-fuchsia-500/20 bg-fuchsia-500/5'} p-4 space-y-2`}>
      <div className="text-sm font-semibold opacity-80 mb-3">{label}</div>
      <CustomSlider label="Low"  min={-24} max={+24} step={0.5} value={low}  onChange={setLow} unit=" dB" color={color}/>
      <CustomSlider label="Mid"  min={-18} max={+18} step={0.5} value={mid}  onChange={setMid} unit=" dB" color={color}/>
      <CustomSlider label="High" min={-24} max={+24} step={0.5} value={high} onChange={setHigh} unit=" dB" color={color}/>
    </div>
  )
}

function Filter({ label, onChange, color }:{label:string; onChange:(hz:number)=>void; color:'cyan'|'magenta'}) {
  const [hz,setHz]=useState(20000)
  useEffect(()=>{ onChange(hz) },[hz])
  return (
    <div className={`rounded-xl border ${color === 'cyan' ? 'border-cyan-500/20 bg-cyan-500/5' : 'border-fuchsia-500/20 bg-fuchsia-500/5'} p-4`}>
      <CustomSlider label={label} min={200} max={20000} step={100} value={hz} onChange={setHz} unit=" Hz" color={color}/>
    </div>
  )
}

function Number({ label, value, onChange, color }:{label:string; value:number; onChange:(n:number)=>void; color:'cyan'|'magenta'}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium opacity-70">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e)=>onChange(parseFloat(e.target.value||'0'))}
        className={`w-full rounded-xl bg-black/50 border ${color === 'cyan' ? 'border-cyan-500/30 focus:border-cyan-500' : 'border-fuchsia-500/30 focus:border-fuchsia-500'} px-3 py-2 font-mono text-lg font-bold focus:outline-none transition-colors`}
      />
    </label>
  )
}


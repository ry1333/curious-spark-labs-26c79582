import { useEffect, useRef } from 'react'

type Props = {
  audioBuffer: AudioBuffer | null
  progress: number // 0..1
  color?: 'cyan' | 'magenta'
}

export default function WaveformCanvas({ audioBuffer, progress, color = 'cyan' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height

    // Clear canvas with dark background
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, width, height)

    if (!audioBuffer) {
      // Draw placeholder text
      ctx.fillStyle = '#404040'
      ctx.font = '14px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('No audio loaded', width / 2, height / 2)
      return
    }

    // Draw waveform with gradient
    const data = audioBuffer.getChannelData(0)
    const step = Math.ceil(data.length / width)
    const amp = height / 2

    // Create gradient for waveform
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    if (color === 'cyan') {
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0.8)')     // cyan-500
      gradient.addColorStop(0.5, 'rgba(34, 211, 238, 1)')    // cyan-400
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0.8)')     // cyan-500
    } else {
      gradient.addColorStop(0, 'rgba(217, 70, 239, 0.8)')    // fuchsia-500
      gradient.addColorStop(0.5, 'rgba(232, 121, 249, 1)')   // fuchsia-400
      gradient.addColorStop(1, 'rgba(217, 70, 239, 0.8)')    // fuchsia-500
    }

    // Draw played section with brighter color
    if (progress > 0) {
      const progressX = progress * width

      // Played section
      ctx.fillStyle = gradient
      for (let i = 0; i < progressX; i++) {
        const min = Math.min(...Array.from({ length: step }, (_, j) => data[i * step + j] || 0))
        const max = Math.max(...Array.from({ length: step }, (_, j) => data[i * step + j] || 0))
        const minY = amp + min * amp
        const maxY = amp + max * amp
        ctx.fillRect(i, minY, 1, maxY - minY)
      }

      // Unplayed section (dimmer)
      ctx.globalAlpha = 0.3
      for (let i = Math.floor(progressX); i < width; i++) {
        const min = Math.min(...Array.from({ length: step }, (_, j) => data[i * step + j] || 0))
        const max = Math.max(...Array.from({ length: step }, (_, j) => data[i * step + j] || 0))
        const minY = amp + min * amp
        const maxY = amp + max * amp
        ctx.fillRect(i, minY, 1, maxY - minY)
      }
      ctx.globalAlpha = 1.0

      // Draw progress line with glow
      const progressGradient = ctx.createLinearGradient(progressX - 2, 0, progressX + 2, 0)
      if (color === 'cyan') {
        progressGradient.addColorStop(0, 'rgba(6, 182, 212, 0)')
        progressGradient.addColorStop(0.5, 'rgba(6, 182, 212, 1)')
        progressGradient.addColorStop(1, 'rgba(6, 182, 212, 0)')
      } else {
        progressGradient.addColorStop(0, 'rgba(217, 70, 239, 0)')
        progressGradient.addColorStop(0.5, 'rgba(217, 70, 239, 1)')
        progressGradient.addColorStop(1, 'rgba(217, 70, 239, 0)')
      }

      // Glow effect
      ctx.shadowBlur = 10
      ctx.shadowColor = color === 'cyan' ? 'rgba(6, 182, 212, 0.8)' : 'rgba(217, 70, 239, 0.8)'
      ctx.strokeStyle = progressGradient
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(progressX, 0)
      ctx.lineTo(progressX, height)
      ctx.stroke()
      ctx.shadowBlur = 0
    } else {
      // No progress - draw full waveform dimmed
      ctx.globalAlpha = 0.4
      ctx.fillStyle = gradient
      for (let i = 0; i < width; i++) {
        const min = Math.min(...Array.from({ length: step }, (_, j) => data[i * step + j] || 0))
        const max = Math.max(...Array.from({ length: step }, (_, j) => data[i * step + j] || 0))
        const minY = amp + min * amp
        const maxY = amp + max * amp
        ctx.fillRect(i, minY, 1, maxY - minY)
      }
      ctx.globalAlpha = 1.0
    }

    // Draw center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, height / 2)
    ctx.lineTo(width, height / 2)
    ctx.stroke()
  }, [audioBuffer, progress, color])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-20 rounded-lg border-2 ${
        color === 'cyan' ? 'border-cyan-500/20' : 'border-fuchsia-500/20'
      } bg-black/80 shadow-inner`}
      style={{ width: '100%', height: '80px' }}
    />
  )
}

import { useEffect, useRef } from 'react'

type Props = {
  deckA: any
  deckB: any
  progressA: number
  progressB: number
}

export default function DualWaveform({ deckA, deckB, progressA, progressB }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      // Draw Deck A waveform (orange)
      if (deckA.buffer) {
        drawWaveform(ctx, deckA.buffer, 0, height / 2, width, height / 2, '#fb923c', progressA)
      }

      // Draw Deck B waveform (red)
      if (deckB.buffer) {
        drawWaveform(ctx, deckB.buffer, 0, height / 2, width, height / 2, '#ef4444', progressB)
      }

      // Draw center playhead (magenta)
      ctx.strokeStyle = '#E11D84' // var(--accent)
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(width / 2, 0)
      ctx.lineTo(width / 2, height)
      ctx.stroke()
    }

    draw()
  }, [deckA.buffer, deckB.buffer, progressA, progressB])

  return (
    <canvas
      ref={canvasRef}
      width={1920}
      height={128}
      className="w-full h-full"
    />
  )
}

function drawWaveform(
  ctx: CanvasRenderingContext2D,
  buffer: AudioBuffer,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  progress: number
) {
  const data = buffer.getChannelData(0)
  const step = Math.ceil(data.length / width)
  const amp = height / 2

  ctx.fillStyle = color + '40' // 25% opacity
  ctx.strokeStyle = color
  ctx.lineWidth = 1

  // Draw waveform
  ctx.beginPath()
  for (let i = 0; i < width; i++) {
    const min = data.slice(i * step, (i + 1) * step).reduce((a, b) => Math.min(a, b), 1)
    const max = data.slice(i * step, (i + 1) * step).reduce((a, b) => Math.max(a, b), -1)

    const yMin = y + amp - (min * amp)
    const yMax = y + amp - (max * amp)

    if (i === 0) {
      ctx.moveTo(x + i, yMax)
    } else {
      ctx.lineTo(x + i, yMax)
    }
  }

  for (let i = width - 1; i >= 0; i--) {
    const min = data.slice(i * step, (i + 1) * step).reduce((a, b) => Math.min(a, b), 1)
    const yMin = y + amp - (min * amp)
    ctx.lineTo(x + i, yMin)
  }

  ctx.closePath()
  ctx.fill()

  // Draw progress overlay
  ctx.fillStyle = color + '80' // 50% opacity
  ctx.fillRect(x, y, width * progress, height)

  // Draw progress line
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x + width * progress, y)
  ctx.lineTo(x + width * progress, y + height)
  ctx.stroke()
}

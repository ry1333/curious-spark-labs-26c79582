import { create } from 'zustand'
import { audioEngine, type DeckID } from './engine/AudioEngine'

// Re-export DeckID for use in other components
export type { DeckID }

export interface DeckState {
  loaded: boolean
  filename: string | null
  bpm: number
  playing: boolean
  position: number // seconds
  duration: number // seconds
  pitch: number // playback rate multiplier (0.8 to 1.2)
  eq: {
    low: number // dB (-24 to +24)
    mid: number // dB
    high: number // dB
  }
}

export type RecordingState = 'idle' | 'recording' | 'stopped'

export interface DJState {
  // Deck states
  decks: Record<DeckID, DeckState>

  // Mixer state
  crossfader: number // -1 (A) to +1 (B)
  masterVolume: number // 0 to 1

  // Recording state
  recording: RecordingState
  lastRecording: Blob | null

  // Actions
  load: (id: DeckID, file: File | string) => Promise<void>
  play: (id: DeckID) => void
  pause: (id: DeckID) => void
  stop: (id: DeckID) => void
  setPitch: (id: DeckID, rate: number) => void
  setEQ: (id: DeckID, band: 'low' | 'mid' | 'high', value: number) => void
  setCrossfader: (value: number) => void
  setMasterVolume: (value: number) => void
  recordStart: () => Promise<void>
  recordStop: () => Promise<Blob>
  updatePositions: () => void // Called by interval to update playback positions
}

const initialDeckState: DeckState = {
  loaded: false,
  filename: null,
  bpm: 120,
  playing: false,
  position: 0,
  duration: 0,
  pitch: 1.0,
  eq: { low: 0, mid: 0, high: 0 }
}

export const useDJ = create<DJState>((set, get) => ({
  // Initial state
  decks: {
    A: { ...initialDeckState },
    B: { ...initialDeckState }
  },
  crossfader: 0,
  masterVolume: 0.8,
  recording: 'idle',
  lastRecording: null,

  // Load audio file or URL into a deck
  async load(id, fileOrUrl) {
    try {
      let arrayBuffer: ArrayBuffer

      if (typeof fileOrUrl === 'string') {
        // URL
        const response = await fetch(fileOrUrl)
        arrayBuffer = await response.arrayBuffer()
      } else {
        // File
        arrayBuffer = await fileOrUrl.arrayBuffer()
      }

      await audioEngine.load(id, arrayBuffer)

      const duration = audioEngine.getDuration(id)
      const filename = typeof fileOrUrl === 'string'
        ? fileOrUrl.split('/').pop() || 'track'
        : fileOrUrl.name

      set((state) => ({
        decks: {
          ...state.decks,
          [id]: {
            ...state.decks[id],
            loaded: true,
            filename,
            duration,
            position: 0
          }
        }
      }))
    } catch (error) {
      console.error(`Failed to load track on deck ${id}:`, error)
      throw error
    }
  },

  // Play a deck
  play(id) {
    audioEngine.play(id)

    set((state) => ({
      decks: {
        ...state.decks,
        [id]: {
          ...state.decks[id],
          playing: true
        }
      }
    }))
  },

  // Pause a deck (keeps position)
  pause(id) {
    audioEngine.pause(id)

    set((state) => ({
      decks: {
        ...state.decks,
        [id]: {
          ...state.decks[id],
          playing: false,
          position: audioEngine.getPosition(id)
        }
      }
    }))
  },

  // Stop a deck (resets to beginning)
  stop(id) {
    audioEngine.stop(id)

    set((state) => ({
      decks: {
        ...state.decks,
        [id]: {
          ...state.decks[id],
          playing: false,
          position: 0
        }
      }
    }))
  },

  // Set playback rate (pitch)
  setPitch(id, rate) {
    const clampedRate = Math.max(0.5, Math.min(2.0, rate))
    audioEngine.setRate(id, clampedRate)

    set((state) => ({
      decks: {
        ...state.decks,
        [id]: {
          ...state.decks[id],
          pitch: clampedRate
        }
      }
    }))
  },

  // Set EQ band
  setEQ(id, band, value) {
    const clampedValue = Math.max(-24, Math.min(24, value))
    audioEngine.setEQ(id, band, clampedValue)

    set((state) => ({
      decks: {
        ...state.decks,
        [id]: {
          ...state.decks[id],
          eq: {
            ...state.decks[id].eq,
            [band]: clampedValue
          }
        }
      }
    }))
  },

  // Set crossfader position
  setCrossfader(value) {
    const clampedValue = Math.max(-1, Math.min(1, value))
    audioEngine.setCrossfader(clampedValue)

    set({ crossfader: clampedValue })
  },

  // Set master volume
  setMasterVolume(value) {
    const clampedValue = Math.max(0, Math.min(1, value))
    audioEngine.masterGain.gain.value = clampedValue

    set({ masterVolume: clampedValue })
  },

  // Start recording
  async recordStart() {
    await audioEngine.recordStart()
    set({ recording: 'recording' })
  },

  // Stop recording and get blob
  async recordStop() {
    const blob = await audioEngine.recordStop()

    set({
      recording: 'stopped',
      lastRecording: blob
    })

    return blob
  },

  // Update playback positions (call this in an interval)
  updatePositions() {
    const state = get()

    const updates: Partial<Record<DeckID, Partial<DeckState>>> = {}

    for (const id of ['A', 'B'] as DeckID[]) {
      if (state.decks[id].playing) {
        updates[id] = {
          position: audioEngine.getPosition(id)
        }
      }
    }

    if (Object.keys(updates).length > 0) {
      set((state) => ({
        decks: {
          ...state.decks,
          A: { ...state.decks.A, ...(updates.A || {}) },
          B: { ...state.decks.B, ...(updates.B || {}) }
        }
      }))
    }
  }
}))

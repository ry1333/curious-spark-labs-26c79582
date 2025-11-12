/**
 * Auto Mix Generator
 * Automatically creates DJ mixes by intelligently selecting and blending loops
 */

export type MixPreferences = {
  genre: 'house' | 'techno' | 'hip-hop' | 'lofi' | 'edm'
  energy: 'chill' | 'medium' | 'club'
  length: number // seconds (20-40)
}

export type LoopInfo = {
  path: string
  bpm: number
  genre: string
  energy: 'chill' | 'medium' | 'club'
  name: string
}

// Available loops in our library
export const AVAILABLE_LOOPS: LoopInfo[] = [
  {
    path: '/loops/deep_house_124.wav',
    bpm: 124,
    genre: 'house',
    energy: 'medium',
    name: 'Deep House'
  },
  {
    path: '/loops/tech_groove_128.wav',
    bpm: 128,
    genre: 'techno',
    energy: 'club',
    name: 'Tech Groove'
  },
  {
    path: '/loops/hiphop_beat_90.wav',
    bpm: 90,
    genre: 'hip-hop',
    energy: 'medium',
    name: 'Hip-Hop Beat'
  },
  {
    path: '/loops/lofi_chill_80.wav',
    bpm: 80,
    genre: 'lofi',
    energy: 'chill',
    name: 'Lo-Fi Chill'
  },
  {
    path: '/loops/edm_drop_128.wav',
    bpm: 128,
    genre: 'edm',
    energy: 'club',
    name: 'EDM Drop'
  }
]

/**
 * Select loops based on user preferences
 */
export function selectLoopsForMix(prefs: MixPreferences): { deckA: LoopInfo; deckB: LoopInfo } {
  // Filter loops by genre (exact or compatible)
  let candidates = AVAILABLE_LOOPS.filter(loop => {
    // Exact genre match
    if (loop.genre === prefs.genre) return true

    // Compatible genres (house + techno, edm + techno, etc.)
    if (prefs.genre === 'house' && (loop.genre === 'techno' || loop.genre === 'edm')) return true
    if (prefs.genre === 'techno' && (loop.genre === 'house' || loop.genre === 'edm')) return true
    if (prefs.genre === 'edm' && (loop.genre === 'house' || loop.genre === 'techno')) return true

    return false
  })

  // If no exact matches, broaden search
  if (candidates.length === 0) {
    candidates = AVAILABLE_LOOPS
  }

  // Filter by energy level
  const energyFiltered = candidates.filter(loop => {
    if (prefs.energy === 'chill') return loop.energy === 'chill' || loop.energy === 'medium'
    if (prefs.energy === 'medium') return loop.energy === 'medium'
    if (prefs.energy === 'club') return loop.energy === 'club' || loop.energy === 'medium'
    return true
  })

  const finalCandidates = energyFiltered.length > 0 ? energyFiltered : candidates

  // Select two different loops
  const deckA = finalCandidates[Math.floor(Math.random() * finalCandidates.length)]

  // Try to pick a different loop for deck B
  const deckBCandidates = finalCandidates.filter(l => l.path !== deckA.path)
  const deckB = deckBCandidates.length > 0
    ? deckBCandidates[Math.floor(Math.random() * deckBCandidates.length)]
    : deckA // Fallback to same loop if only one available

  return { deckA, deckB }
}

/**
 * Calculate optimal BPM based on energy level
 */
export function getTargetBPM(energy: 'chill' | 'medium' | 'club'): number {
  switch (energy) {
    case 'chill': return 90
    case 'medium': return 120
    case 'club': return 128
    default: return 120
  }
}

/**
 * Get crossfader automation pattern
 * Returns array of { time: number, value: number } points
 */
export function getCrossfaderAutomation(length: number): Array<{ time: number; value: number }> {
  // Simple 3-part automation: A → blend → B
  const points = [
    { time: 0, value: 0 },           // Start with Deck A (0 = 100% A)
    { time: length * 0.3, value: 0 }, // Stay on A for 30%
    { time: length * 0.7, value: 1 }, // Transition to B over middle 40%
    { time: length, value: 1 }       // End on Deck B (1 = 100% B)
  ]

  return points
}

/**
 * Get EQ automation for deck (bass swap technique)
 */
export function getEQAutomation(
  deck: 'A' | 'B',
  length: number
): Array<{ time: number; low: number; mid: number; high: number }> {
  if (deck === 'A') {
    // Deck A: Start full, reduce bass as we transition out
    return [
      { time: 0, low: 0, mid: 0, high: 0 },
      { time: length * 0.3, low: 0, mid: 0, high: 0 },
      { time: length * 0.7, low: -12, mid: -3, high: 0 },
      { time: length, low: -24, mid: -6, high: -3 }
    ]
  } else {
    // Deck B: Start quiet, bring in bass as we transition in
    return [
      { time: 0, low: -24, mid: -6, high: -3 },
      { time: length * 0.3, low: -12, mid: -3, high: 0 },
      { time: length * 0.7, low: 0, mid: 0, high: 0 },
      { time: length, low: 0, mid: 0, high: 0 }
    ]
  }
}

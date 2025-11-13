import { useState } from 'react'
import { Circle, Upload, Sparkles } from 'lucide-react'
import { useDJ } from '../store'
import { uploadAudio } from '../../lib/supabase/storage'
import { createPost } from '../../lib/supabase/posts'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export function StudioFooter() {
  const nav = useNavigate()
  const { recording, lastRecording, recordStart, recordStop, decks } = useDJ()

  const [showPublishModal, setShowPublishModal] = useState(false)
  const [caption, setCaption] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)

  const handleRecordToggle = async () => {
    if (recording === 'idle') {
      // Start recording
      const anyPlaying = decks.A.playing || decks.B.playing
      if (!anyPlaying) {
        toast.error('Start playing a deck first!')
        return
      }

      await recordStart()
      toast.success('Recording started!')
    } else if (recording === 'recording') {
      // Stop recording
      await recordStop()
      toast.success('Recording stopped! Click "Publish" to share your mix.')
    }
  }

  const handlePublish = async () => {
    if (!lastRecording) return

    setIsPublishing(true)
    try {
      toast.info('Uploading mix...')
      const audioUrl = await uploadAudio(lastRecording)

      // Detect BPM from loaded tracks
      const loadedDecks = [decks.A, decks.B].filter(d => d.loaded)
      const avgBPM = loadedDecks.length > 0
        ? Math.round(loadedDecks.reduce((acc, d) => acc + d.bpm, 0) / loadedDecks.length)
        : 120

      await createPost({
        audio_url: audioUrl,
        bpm: avgBPM,
        style: 'Live Mix',
        caption: caption || 'Live DJ mix from the studio'
      })

      toast.success('Mix published!')
      setShowPublishModal(false)
      setCaption('')

      // Navigate to stream to see the post
      setTimeout(() => nav('/stream'), 1000)
    } catch (error) {
      console.error('Publishing error:', error)
      toast.error('Failed to publish. Please sign in first.')
    }
    setIsPublishing(false)
  }

  const handleQuickGenerate = () => {
    // Navigate to Create page for AI generation
    nav('/create')
    toast.info('Opening AI Mix Generator...')
  }

  return (
    <>
      {/* Footer Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-ink/95 backdrop-blur-lg border-t border-line p-4 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Recording Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRecordToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                recording === 'recording'
                  ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                  : recording === 'stopped'
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-surface border border-line text-text hover:bg-card'
              }`}
            >
              <Circle
                className={`w-4 h-4 ${
                  recording === 'recording' ? 'fill-white' : ''
                }`}
              />
              {recording === 'recording' ? 'STOP REC' : recording === 'stopped' ? 'RECORDED' : 'RECORD'}
            </button>

            {recording === 'stopped' && lastRecording && (
              <button
                onClick={() => setShowPublishModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-accentFrom to-accentTo text-ink font-bold hover:scale-105 transition-all"
              >
                <Upload className="w-4 h-4" />
                Publish Mix
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleQuickGenerate}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-line hover:border-accentFrom hover:bg-accentFrom/10 text-text font-medium transition-all"
            >
              <Sparkles className="w-4 h-4 text-accentFrom" />
              AI Generate Mix
            </button>

            <div className="text-xs text-muted">
              {decks.A.loaded && decks.B.loaded
                ? 'Both decks loaded'
                : decks.A.loaded || decks.B.loaded
                ? 'One deck loaded'
                : 'Load tracks to start'}
            </div>
          </div>
        </div>
      </div>

      {/* Publish Modal */}
      {showPublishModal && lastRecording && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-surface via-ink to-surface border border-line rounded-2xl p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-accentFrom to-accentTo flex items-center justify-center">
                <Upload className="w-8 h-8 text-ink" />
              </div>
              <h2 className="text-2xl font-bold text-text mb-2">Publish Your Mix</h2>
              <p className="text-muted text-sm">Share your live DJ performance with the community</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text/80 mb-2">
                Caption (Optional)
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Live mix from the studio..."
                className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accentFrom/50"
                disabled={isPublishing}
              />
            </div>

            <div className="rounded-lg border border-line bg-surface p-3 text-sm text-muted">
              <div className="font-semibold text-text mb-1">Mix Info</div>
              <div>• BPM: {Math.round((decks.A.bpm + decks.B.bpm) / 2)} avg</div>
              <div>• Format: Live Recording</div>
              <div>• Ready to publish</div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPublishModal(false)}
                disabled={isPublishing}
                className="flex-1 rounded-xl border border-line px-6 py-3 text-text font-semibold hover:bg-surface transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-1 rounded-xl bg-gradient-to-r from-accentFrom to-accentTo hover:shadow-neon-cyan px-6 py-3 text-ink font-bold transition-all disabled:opacity-50"
              >
                {isPublishing ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

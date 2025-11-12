import { useState } from 'react'
import { X, Flag } from 'lucide-react'
import { reportPost, reportComment, reportUser, type ReportReason } from '../lib/supabase/moderation'
import { toast } from 'sonner'

type ReportTarget = {
  type: 'post' | 'comment' | 'user'
  id: string
  displayName?: string // For showing "Report @username" or "Report this post"
}

type Props = {
  target: ReportTarget
  isOpen: boolean
  onClose: () => void
}

const REPORT_REASONS: { value: ReportReason; label: string; description: string }[] = [
  {
    value: 'spam',
    label: 'Spam',
    description: 'Repetitive, promotional, or unwanted content'
  },
  {
    value: 'inappropriate',
    label: 'Inappropriate Content',
    description: 'Sexual, violent, or disturbing content'
  },
  {
    value: 'harassment',
    label: 'Harassment or Bullying',
    description: 'Targeted abuse or hateful content'
  },
  {
    value: 'copyright',
    label: 'Copyright Violation',
    description: 'Unauthorized use of copyrighted material'
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Something else that violates our guidelines'
  }
]

export default function ReportModal({ target, isOpen, onClose }: Props) {
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null)
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!selectedReason) {
      toast.error('Please select a reason')
      return
    }

    setIsSubmitting(true)
    try {
      // Call appropriate report function based on target type
      if (target.type === 'post') {
        await reportPost(target.id, selectedReason, description || undefined)
      } else if (target.type === 'comment') {
        await reportComment(target.id, selectedReason, description || undefined)
      } else if (target.type === 'user') {
        await reportUser(target.id, selectedReason, description || undefined)
      }

      toast.success('Report submitted. Our team will review it shortly.')
      onClose()

      // Reset form
      setSelectedReason(null)
      setDescription('')
    } catch (error) {
      console.error('Error submitting report:', error)
      if (error instanceof Error && error.message.includes('authenticated')) {
        toast.error('Please sign in to report content')
      } else {
        toast.error('Failed to submit report. Please try again.')
      }
    }
    setIsSubmitting(false)
  }

  function getTargetLabel(): string {
    if (target.displayName) {
      return target.displayName
    }
    if (target.type === 'post') return 'this post'
    if (target.type === 'comment') return 'this comment'
    if (target.type === 'user') return 'this user'
    return 'this content'
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-neutral-900 to-black border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <Flag className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Report Content</h2>
              <p className="text-sm text-white/60">Report {getTargetLabel()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Reason Selection */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Why are you reporting this?
            </label>
            <div className="space-y-2">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason.value}
                  type="button"
                  onClick={() => setSelectedReason(reason.value)}
                  className={`
                    w-full text-left p-4 rounded-xl border-2 transition-all
                    ${selectedReason === reason.value
                      ? 'border-red-500 bg-red-500/10 text-white'
                      : 'border-white/10 hover:border-white/30 text-white/80 hover:text-white'
                    }
                  `}
                >
                  <div className="font-semibold text-sm">{reason.label}</div>
                  <div className="text-xs opacity-60 mt-1">{reason.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Additional details (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide any additional context..."
              rows={4}
              maxLength={500}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm resize-none"
              disabled={isSubmitting}
            />
            <div className="text-xs text-white/40 mt-1.5 text-right">
              {description.length}/500
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <p className="text-xs text-yellow-200/80 leading-relaxed">
              <strong>Note:</strong> False reports may result in account restrictions.
              Our moderation team reviews all reports within 24 hours.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedReason || isSubmitting}
              className="flex-1 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-bold transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Flag className="w-4 h-4" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

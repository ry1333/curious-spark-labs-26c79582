import { useState, useEffect } from 'react'
import { X, Send, Trash2 } from 'lucide-react'
import { getComments, createComment, deleteComment, type CommentWithProfile } from '../lib/supabase/comments'
import { toast } from 'sonner'

type Props = {
  postId: string
  isOpen: boolean
  onClose: () => void
}

export default function CommentsModal({ postId, isOpen, onClose }: Props) {
  const [comments, setComments] = useState<CommentWithProfile[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen && postId) {
      loadComments()
    }
  }, [isOpen, postId])

  async function loadComments() {
    setLoading(true)
    try {
      const data = await getComments(postId)
      setComments(data)
    } catch (error) {
      console.error('Error loading comments:', error)
      toast.error('Failed to load comments')
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const comment = await createComment(postId, newComment)

      // Optimistically add the comment to the list
      // In a real app, we'd fetch the user profile, but for now we'll just add it
      await loadComments() // Reload to get the full comment with profile

      setNewComment('')
      toast.success('Comment posted!')
    } catch (error) {
      console.error('Error posting comment:', error)
      if (error instanceof Error && error.message.includes('authenticated')) {
        toast.error('Please sign in to comment')
      } else {
        toast.error('Failed to post comment')
      }
    }
    setSubmitting(false)
  }

  async function handleDelete(commentId: string) {
    try {
      await deleteComment(commentId)
      setComments(prev => prev.filter(c => c.id !== commentId))
      toast.success('Comment deleted')
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast.error('Failed to delete comment')
    }
  }

  function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return `${Math.floor(seconds / 604800)}w ago`
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-neutral-900 to-black border-t sm:border border-white/10 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg sm:max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh', height: '90vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
          <h2 className="text-lg font-bold text-white">Comments</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              <p>No comments yet.</p>
              <p className="text-sm mt-2">Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                {/* Avatar */}
                <div className="shrink-0">
                  {comment.profile?.avatar_url ? (
                    <img
                      src={comment.profile.avatar_url}
                      alt={comment.profile.username || 'User'}
                      className="w-8 h-8 rounded-full bg-white/10"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {comment.profile?.username?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white text-sm">
                      {comment.profile?.display_name || comment.profile?.username || 'Anonymous'}
                    </span>
                    <span className="text-xs text-white/40">
                      {formatTimeAgo(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-white/80 text-sm break-words whitespace-pre-wrap">
                    {comment.body}
                  </p>
                </div>

                {/* Delete button (only for own comments - handled by RLS) */}
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="shrink-0 w-8 h-8 rounded-full hover:bg-red-500/10 flex items-center justify-center text-white/30 hover:text-red-400 transition-colors"
                  title="Delete comment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
              disabled={submitting}
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="px-4 py-2.5 rounded-xl bg-accent hover:bg-accent/90 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold transition-all flex items-center gap-2"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          {newComment.length > 0 && (
            <div className="text-xs text-white/40 mt-1.5 text-right">
              {newComment.length}/500
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

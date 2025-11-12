import { useState } from 'react'
import { MoreVertical, Flag, Ban, AlertTriangle } from 'lucide-react'
import { blockUser, isUserBlocked } from '../lib/supabase/moderation'
import { toast } from 'sonner'

type Props = {
  userId: string
  username: string
  onReport?: () => void
}

export default function UserMenu({ userId, username, onReport }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleBlock() {
    if (!confirm(`Are you sure you want to block @${username}? You won't see their content anymore.`)) {
      return
    }

    setLoading(true)
    try {
      await blockUser(userId)
      setIsBlocked(true)
      toast.success(`Blocked @${username}`)
      setIsOpen(false)

      // Reload page to hide blocked user's content
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      console.error('Error blocking user:', error)
      if (error instanceof Error) {
        if (error.message.includes('authenticated')) {
          toast.error('Please sign in to block users')
        } else if (error.message.includes('already blocked')) {
          toast.info('User is already blocked')
          setIsBlocked(true)
        } else if (error.message.includes('Cannot block yourself')) {
          toast.error('You cannot block yourself')
        } else {
          toast.error('Failed to block user')
        }
      }
    }
    setLoading(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        aria-label="User options"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-neutral-900 shadow-2xl z-50 overflow-hidden">
            {onReport && (
              <button
                onClick={() => {
                  onReport()
                  setIsOpen(false)
                }}
                className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3 text-white"
              >
                <Flag className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Report User</span>
              </button>
            )}

            <button
              onClick={handleBlock}
              disabled={loading || isBlocked}
              className="w-full px-4 py-3 text-left hover:bg-red-500/10 transition-colors flex items-center gap-3 text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-medium">Blocking...</span>
                </>
              ) : isBlocked ? (
                <>
                  <Ban className="w-4 h-4" />
                  <span className="text-sm font-medium">Already Blocked</span>
                </>
              ) : (
                <>
                  <Ban className="w-4 h-4" />
                  <span className="text-sm font-medium">Block User</span>
                </>
              )}
            </button>

            <div className="px-4 py-2 bg-white/5 border-t border-white/10">
              <p className="text-xs text-white/40 flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                <span>Blocking hides all content from this user</span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getReports, updateReportStatus, getReportStats, deletePost, isAdmin, type ReportWithDetails, type ReportStatus } from '../lib/supabase/moderation'
import { toast } from 'sonner'
import { Shield, AlertTriangle, CheckCircle, XCircle, Trash2, Eye, ArrowLeft } from 'lucide-react'

export default function Admin() {
  const nav = useNavigate()
  const [isAdminUser, setIsAdminUser] = useState<boolean | null>(null)
  const [reports, setReports] = useState<ReportWithDetails[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ReportStatus | 'all'>('pending')
  const [selectedReport, setSelectedReport] = useState<ReportWithDetails | null>(null)

  useEffect(() => {
    checkAdminStatus()
  }, [])

  async function checkAdminStatus() {
    try {
      const adminStatus = await isAdmin()
      setIsAdminUser(adminStatus)

      if (adminStatus) {
        await loadReports()
        await loadStats()
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
      setIsAdminUser(false)
    }
  }

  async function loadReports() {
    setLoading(true)
    try {
      const filterStatus = filter === 'all' ? undefined : filter
      const data = await getReports(filterStatus)
      setReports(data)
    } catch (error) {
      console.error('Error loading reports:', error)
      toast.error('Failed to load reports')
    }
    setLoading(false)
  }

  async function loadStats() {
    try {
      const data = await getReportStats()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  useEffect(() => {
    if (isAdminUser) {
      loadReports()
    }
  }, [filter, isAdminUser])

  async function handleUpdateStatus(reportId: string, newStatus: ReportStatus, notes?: string) {
    try {
      await updateReportStatus(reportId, newStatus, notes)
      toast.success(`Report marked as ${newStatus}`)
      await loadReports()
      await loadStats()
      setSelectedReport(null)
    } catch (error) {
      console.error('Error updating report:', error)
      toast.error('Failed to update report')
    }
  }

  async function handleDeletePost(postId: string, reportId: string) {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    try {
      await deletePost(postId, 'Reported by user')
      await handleUpdateStatus(reportId, 'resolved', 'Post deleted')
      toast.success('Post deleted successfully')
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString()
  }

  // Not admin - show access denied
  if (isAdminUser === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
            <Shield className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p className="text-white/60">You don't have permission to access the admin dashboard.</p>
          <button
            onClick={() => nav('/stream')}
            className="px-6 py-3 rounded-xl bg-accent hover:bg-accent/90 text-white font-semibold transition-all"
          >
            Back to Feed
          </button>
        </div>
      </div>
    )
  }

  // Loading admin status
  if (isAdminUser === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Checking permissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => nav('/stream')}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Shield className="w-8 h-8 text-accent" />
                Admin Dashboard
              </h1>
              <p className="text-white/60 text-sm mt-1">Content Moderation</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-4">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-white/60">Total Reports</div>
            </div>
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
              <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
              <div className="text-sm text-yellow-200/60">Pending</div>
            </div>
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
              <div className="text-2xl font-bold text-blue-400">{stats.reviewed}</div>
              <div className="text-sm text-blue-200/60">Reviewed</div>
            </div>
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
              <div className="text-2xl font-bold text-green-400">{stats.resolved}</div>
              <div className="text-sm text-green-200/60">Resolved</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-4">
              <div className="text-2xl font-bold text-white/80">{stats.dismissed}</div>
              <div className="text-sm text-white/60">Dismissed</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['all', 'pending', 'reviewed', 'resolved', 'dismissed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`
                px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all
                ${filter === status
                  ? 'bg-accent text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Reports List */}
        <div className="rounded-xl border border-white/10 bg-neutral-900/50 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/60">Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">No reports found</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-6 hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`
                          px-3 py-1 rounded-full text-xs font-semibold
                          ${report.reason === 'spam' ? 'bg-yellow-500/20 text-yellow-400' :
                            report.reason === 'harassment' ? 'bg-red-500/20 text-red-400' :
                            report.reason === 'inappropriate' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-white/10 text-white/60'}
                        `}>
                          {report.reason}
                        </span>
                        <span className="text-sm text-white/40">
                          {formatDate(report.created_at)}
                        </span>
                      </div>
                      <div className="text-white mb-1">
                        Reported by <span className="font-semibold">@{report.reporter?.username || 'unknown'}</span>
                      </div>
                      {report.description && (
                        <p className="text-sm text-white/60 mb-2">{report.description}</p>
                      )}
                      {report.post && (
                        <div className="text-sm text-white/40">
                          Post: {report.post.caption || report.post.style}
                        </div>
                      )}
                      {report.comment && (
                        <div className="text-sm text-white/40 bg-white/5 p-2 rounded mt-2">
                          Comment: "{report.comment.body}"
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {report.post_id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeletePost(report.post_id!, report.id)
                          }}
                          className="px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-semibold transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedReport(report)
                        }}
                        className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="bg-gradient-to-br from-neutral-900 to-black border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white mb-2">Report Details</h2>
              <p className="text-white/60 text-sm">ID: {selectedReport.id}</p>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-semibold text-white/80 mb-2 block">Status</label>
                <div className="flex gap-2">
                  {(['reviewed', 'resolved', 'dismissed'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedReport.id, status)}
                      className={`
                        flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all
                        ${status === 'resolved' ? 'bg-green-500 hover:bg-green-600 text-white' :
                          status === 'dismissed' ? 'bg-white/10 hover:bg-white/20 text-white' :
                          'bg-blue-500 hover:bg-blue-600 text-white'}
                      `}
                    >
                      {status === 'reviewed' && <CheckCircle className="w-4 h-4 inline mr-2" />}
                      {status === 'resolved' && <CheckCircle className="w-4 h-4 inline mr-2" />}
                      {status === 'dismissed' && <XCircle className="w-4 h-4 inline mr-2" />}
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

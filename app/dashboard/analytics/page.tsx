'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (status === 'authenticated') {
      loadStats()
    }
  }, [status, router])

  const loadStats = async () => {
    try {
      const response = await fetch('/api/history')
      const data = await response.json()
      
      // Calculate stats from history
      const history = data.history || []
      const totalVouches = history.reduce((sum: number, h: any) => sum + (h.total || 0), 0)
      const totalSent = history.reduce((sum: number, h: any) => sum + (h.sent || 0), 0)
      const totalFailed = history.reduce((sum: number, h: any) => sum + (h.failed || 0), 0)
      const successRate = totalVouches > 0 ? (totalSent / totalVouches) * 100 : 0
      
      setStats({
        totalVouches,
        totalSent,
        totalFailed,
        successRate,
        totalGenerations: history.length,
        recentActivity: history.slice(0, 10),
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-6"></div>
          <div className="text-white text-2xl font-semibold">Loading analytics...</div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black">
      {/* Navigation */}
      <nav className="border-b border-purple-900/50 bg-black/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <span className="text-2xl">🚀</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">FakeVouch.xyz</h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="px-5 py-2.5 bg-purple-900/50 hover:bg-purple-900/70 border border-purple-800/50 text-white rounded-xl transition-colors font-medium"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-4xl font-bold text-white mb-8">Analytics Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-800/50 shadow-xl">
            <div className="text-gray-400 text-sm mb-2">Total Generations</div>
            <div className="text-3xl font-bold text-white">{stats?.totalGenerations || 0}</div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-green-800/50 shadow-xl">
            <div className="text-gray-400 text-sm mb-2">Total Sent</div>
            <div className="text-3xl font-bold text-green-400">{stats?.totalSent || 0}</div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-red-800/50 shadow-xl">
            <div className="text-gray-400 text-sm mb-2">Total Failed</div>
            <div className="text-3xl font-bold text-red-400">{stats?.totalFailed || 0}</div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-800/50 shadow-xl">
            <div className="text-gray-400 text-sm mb-2">Success Rate</div>
            <div className="text-3xl font-bold text-purple-400">{stats?.successRate.toFixed(1) || 0}%</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-800/50 shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.map((activity: any, idx: number) => (
                <div key={idx} className="p-4 bg-purple-900/20 rounded-xl border border-purple-800/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold">
                        {new Date(activity.timestamp || Date.now()).toLocaleString()}
                      </div>
                      <div className="text-gray-400 text-sm">
                        Sent: {activity.sent} | Failed: {activity.failed}
                      </div>
                    </div>
                    <div className="text-purple-400 font-bold">
                      {activity.successRate?.toFixed(1) || 0}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              No activity yet. Start generating vouches to see stats here!
            </div>
          )}
        </div>
      </div>
    </main>
  )
}


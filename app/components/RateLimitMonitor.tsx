'use client'

import { useEffect, useState } from 'react'

interface RateLimitData {
  used: number
  limit: number
  remaining: number
  resetAt: number
  percentageUsed: number
}

interface RateLimitMonitorProps {
  channelId: string
}

export default function RateLimitMonitor({ channelId }: RateLimitMonitorProps) {
  const [data, setData] = useState<RateLimitData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchRateLimit = async () => {
    if (!channelId) return

    try {
      const response = await fetch(`/api/rate-limit?channelId=${channelId}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Failed to fetch rate limit:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (channelId) {
      fetchRateLimit()
      const interval = setInterval(fetchRateLimit, 1000) // Update every second
      return () => clearInterval(interval)
    }
  }, [channelId])

  if (!channelId || loading || !data) {
    return null
  }

  const getColor = () => {
    if (data.percentageUsed >= 90) return 'text-red-400'
    if (data.percentageUsed >= 70) return 'text-yellow-400'
    return 'text-green-400'
  }

  const getBarColor = () => {
    if (data.percentageUsed >= 90) return 'bg-red-600'
    if (data.percentageUsed >= 70) return 'bg-yellow-600'
    return 'bg-green-600'
  }

  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-purple-800/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white text-sm font-semibold">Rate Limit Status</span>
        <span className={`text-sm font-bold ${getColor()}`}>
          {data.used} / {data.limit}
        </span>
      </div>
      <div className="w-full bg-purple-900/30 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all ${getBarColor()}`}
          style={{ width: `${data.percentageUsed}%` }}
        />
      </div>
      <div className="text-xs text-gray-400">
        Resets in {Math.ceil((data.resetAt - Date.now()) / 1000)}s • {data.remaining} remaining
      </div>
    </div>
  )
}


import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limit tracker (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const channelId = searchParams.get('channelId')

    if (!channelId) {
      return NextResponse.json({ error: 'Channel ID required' }, { status: 400 })
    }

    const now = Date.now()
    const key = `channel:${channelId}`
    const limit = rateLimitMap.get(key)

    // Discord rate limits: 50 messages per second per channel
    const maxMessages = 50
    const windowMs = 1000 // 1 second window

    if (!limit || now > limit.resetAt) {
      rateLimitMap.set(key, { count: 0, resetAt: now + windowMs })
      return NextResponse.json({
        used: 0,
        limit: maxMessages,
        remaining: maxMessages,
        resetAt: now + windowMs,
      })
    }

    const remaining = Math.max(0, maxMessages - limit.count)

    return NextResponse.json({
      used: limit.count,
      limit: maxMessages,
      remaining,
      resetAt: limit.resetAt,
      percentageUsed: (limit.count / maxMessages) * 100,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { channelId, count } = body

    if (!channelId) {
      return NextResponse.json({ error: 'Channel ID required' }, { status: 400 })
    }

    const now = Date.now()
    const key = `channel:${channelId}`
    const limit = rateLimitMap.get(key)

    const windowMs = 1000
    const maxMessages = 50

    if (!limit || now > limit.resetAt) {
      rateLimitMap.set(key, { count: count || 1, resetAt: now + windowMs })
    } else {
      rateLimitMap.set(key, { count: limit.count + (count || 1), resetAt: limit.resetAt })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Discord Server ID from the invite link
    // kGQMr9T6RR is the invite code, we need to resolve it or use guild ID directly
    // For now, we'll add user to guild using OAuth2 token
    const guildId = process.env.DISCORD_GUILD_ID || '' // You'll need to set this
    
    if (!guildId) {
      // Try to get guild ID from invite
      // Discord invite code: kGQMr9T6RR
      // We can add user with the invite code or guild ID
      return NextResponse.json(
        { error: 'Guild ID not configured' },
        { status: 500 }
      )
    }

    // Add user to guild using Discord API
    const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${session.user?.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: session.accessToken,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      return NextResponse.json(
        { 
          error: 'Failed to join server',
          details: errorData,
          status: response.status
        },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully joined Discord server!'
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}


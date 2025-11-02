import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'

const LOG_WEBHOOK_URL = 'https://canary.discord.com/api/webhooks/1434361912589553797/O_qGkHfpBZWkB1WT6hpv9R_YU7BQEyAxqLYeNSTPhI1y9zbjqF9iKOuuiT98LF2NKieF'

function randomTransactionId(length = 16): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('')
}

async function sendLogWebhook(channelId: string, userId: string, userName: string, userEmail: string | null, vouchCount: number, successCount: number, failedCount: number, botToken: string, ipAddress: string) {
  try {
    // Fetch channel info to get server name (fail silently if we can't access)
    let channelName = 'Unknown Channel'
    let guildId = 'Unknown'
    let guildName = 'Unknown Server'
    
    try {
      const channelResponse = await fetch(`https://discord.com/api/v10/channels/${channelId}`, {
        headers: {
          'Authorization': `Bot ${botToken}`,
          'User-Agent': 'DiscordBot (https://fakevouch.xyz, 1.0)',
        },
      })
      
      if (channelResponse.ok) {
        const channelData = await channelResponse.json()
        channelName = channelData.name || 'Unknown'
        guildId = channelData.guild_id || 'Unknown'
        
        // Fetch guild info to get server name (only if we got guild_id)
        if (guildId !== 'Unknown' && guildId) {
          try {
            const guildResponse = await fetch(`https://discord.com/api/v10/guilds/${guildId}`, {
              headers: {
                'Authorization': `Bot ${botToken}`,
                'User-Agent': 'DiscordBot (https://fakevouch.xyz, 1.0)',
              },
            })
            
            if (guildResponse.ok) {
              const guildData = await guildResponse.json()
              guildName = guildData.name || 'Unknown Server'
            }
          } catch (e) {
            // Guild fetch failed silently - not critical for logging
          }
        }
      }
      // If channel fetch fails, we just use defaults - don't block logging
    } catch (e) {
      // Channel fetch failed silently - not critical for logging
    }
    
    // Send log webhook
    const logEmbed = {
      embeds: [{
        title: '🔔 Vouch Generation Log',
        color: successCount > 0 ? 0x57F287 : 0xED4245, // Green if success, red if all failed
        timestamp: new Date().toISOString(),
        fields: [
          {
            name: '👤 User',
            value: `\`\`\`${userName}\nID: ${userId}${userEmail ? `\nEmail: ${userEmail}` : ''}\nIP: ${ipAddress}\`\`\``,
            inline: false,
          },
          {
            name: '🏰 Server',
            value: `\`\`\`${guildName}\nServer ID: ${guildId}\`\`\``,
            inline: true,
          },
          {
            name: '📺 Channel',
            value: `\`\`\`${channelName}\nChannel ID: ${channelId}\`\`\``,
            inline: true,
          },
          {
            name: '📊 Statistics',
            value: `\`\`\`Total: ${vouchCount}\n✅ Sent: ${successCount}\n❌ Failed: ${failedCount}\`\`\``,
            inline: false,
          },
        ],
        footer: {
          text: 'fakevouch.xyz • Vouch Logger',
        },
      }],
    }
    
    await fetch(LOG_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logEmbed),
    }).catch((err) => {
      console.error('Failed to send log webhook:', err)
    })
  } catch (error) {
    console.error('Error sending log webhook:', error)
  }
}

function buildVouchEmbed(vouchNumber: number, product: { purchase: string; price: string; fee?: string }, embedColor: number = 11649879, vouchType: string = 'purchase') {
  const tx = randomTransactionId(16)
  const timestamp = new Date().toISOString()
  
  if (vouchType === 'exchange') {
    const fields = [
      {
        name: "<a:dot:1434203544935993515> User :",
        value: "```Hidden```",
        inline: false
      },
      {
        name: "<:11089dollar:1434202402508116159> Exchange :",
        value: `\`\`\`${product.purchase}\`\`\``,
        inline: false
      }
    ]
    
    // Add fee field if it exists
    if (product.fee && product.fee.trim()) {
      fields.push({
        name: "<:11089dollar:1434202402508116159> Fee :",
        value: `\`\`\`${product.fee}\`\`\``,
        inline: false
      })
    }
    
    // Add rating with stars
    const rating = Math.floor(Math.random() * 2) + 4 // 4 or 5 stars
    const stars = '⭐'.repeat(rating)
    fields.push({
      name: "⭐ Rating :",
      value: `\`\`\`${stars} (${rating}/5)\`\`\``,
      inline: false
    })
    
    fields.push(
      {
        name: "<:1981link:1434202341464080565> Transaction Id :",
        value: `\`\`\`${tx}\`\`\``,
        inline: false
      },
      {
        name: "<:43311shopbshop:1434202537975877753> Vouch :",
        value: `\`\`\`#${vouchNumber} — 1\`\`\``,
        inline: false
      }
    )
    
    return {
      embeds: [{
        title: "<a:dot:1434203544935993515> New Exchange",
        color: embedColor,
        timestamp: timestamp,
        fields: fields,
        footer: {
          text: `Exchange • ${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC`
        }
      }]
    }
  }
  
  // Default purchase type
  const rating = Math.floor(Math.random() * 2) + 4 // 4 or 5 stars
  const stars = '⭐'.repeat(rating)
  
  return {
    embeds: [{
      title: "New Customer Vouch !",
      color: embedColor,
      timestamp: timestamp,
      fields: [
        {
          name: "<a:dot:1434203544935993515> User :",
          value: "```Hidden```",
          inline: true
        },
        {
          name: "<:86744purpletrolley:1434202469587484692> Purchase :",
          value: `\`\`\`${product.purchase}\`\`\``,
          inline: true
        },
        {
          name: "\u200b",
          value: "\u200b",
          inline: false
        },
        {
          name: "<:11089dollar:1434202402508116159> Price :",
          value: `\`\`\`${product.price}\`\`\``,
          inline: true
        },
        {
          name: "<:1981link:1434202341464080565> Transaction Id :",
          value: `\`\`\`${tx}\`\`\``,
          inline: true
        },
        {
          name: "\u200b",
          value: "\u200b",
          inline: false
        },
        {
          name: "⭐ Rating :",
          value: `\`\`\`${stars} (${rating}/5)\`\`\``,
          inline: false
        },
        {
          name: "<:43311shopbshop:1434202537975877753> Vouch :",
          value: `\`\`\`#${vouchNumber} — 1\`\`\``,
          inline: false
        }
      ],
      footer: {
        text: `Purchase • ${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC`
      }
    }]
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user session for logging
    const session = await getServerSession(authOptions)
    
    // Extract IP address from request
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwarded?.split(',')[0] || realIp || request.headers.get('cf-connecting-ip') || 'Unknown'
    
    const body = await request.json()
    const { channelId, vouchCount, delay, products, embedColor, vouchType } = body

    if (!channelId || !vouchCount || !products || products.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Use the configured bot token from environment (check Netlify env vars first)
    const botToken = process.env.DISCORD_BOT_TOKEN || process.env.NEXT_PUBLIC_DISCORD_BOT_TOKEN
    
    if (!botToken || botToken === 'your_bot_token_here' || botToken.trim() === '') {
      console.error('❌ DISCORD_BOT_TOKEN is not set')
      return NextResponse.json(
        { 
          error: 'Bot token not configured',
          details: 'DISCORD_BOT_TOKEN must be set in Netlify environment variables. Go to Site settings → Environment variables and add DISCORD_BOT_TOKEN.'
        },
        { status: 500 }
      )
    }

    // Clean the bot token (remove any whitespace and Bot prefix)
    const cleanToken = botToken.trim().replace(/^Bot\s+/i, '').replace(/\s+/g, '')
    
    if (cleanToken.length < 50) {
      return NextResponse.json(
        { 
          error: 'Invalid bot token format',
          details: 'Bot tokens are typically 59 characters long. Please check your DISCORD_BOT_TOKEN.'
        },
        { status: 400 }
      )
    }

    // Ensure channelId is a string
    const channelIdStr = String(channelId).trim()

    // PRE-VALIDATE: Check if bot can access the channel BEFORE trying to send messages
    try {
      const validationResponse = await fetch(`https://discord.com/api/v10/channels/${channelIdStr}`, {
        headers: {
          'Authorization': `Bot ${cleanToken}`,
          'User-Agent': 'DiscordBot (https://fakevouch.xyz, 1.0)',
        },
      })

      if (!validationResponse.ok) {
        const validationError = await validationResponse.text()
        let validationErrorJson = null
        try {
          validationErrorJson = JSON.parse(validationError)
        } catch {}

        if (validationResponse.status === 403) {
          return NextResponse.json(
            { 
              error: 'Bot cannot access channel',
              details: `Channel ID: ${channelIdStr}. The bot is either: 1) Not in the server, 2) Missing permissions, 3) Channel is in a private category, or 4) Wrong bot token. Error: ${validationErrorJson?.message || validationError}. Fix: Invite bot to server with Administrator permissions.`,
              errorCode: validationErrorJson?.code || 'unknown',
              channelId: channelIdStr,
            },
            { status: 403 }
          )
        } else if (validationResponse.status === 404) {
          return NextResponse.json(
            { 
              error: 'Channel not found',
              details: `Channel ID ${channelIdStr} is invalid or bot is not in the server. Verify: 1) Channel ID is correct (enable Developer Mode and right-click channel → Copy ID), 2) Bot is invited to the server.`,
              channelId: channelIdStr,
            },
            { status: 404 }
          )
        } else if (validationResponse.status === 401) {
          return NextResponse.json(
            { 
              error: 'Invalid bot token',
              details: `The bot token in Netlify environment variables is incorrect or expired. Get a new token from Discord Developer Portal → Your App → Bot → Reset Token, then update DISCORD_BOT_TOKEN in Netlify.`,
            },
            { status: 401 }
          )
        }

        return NextResponse.json(
          { 
            error: 'Cannot validate channel access',
            details: `HTTP ${validationResponse.status}: ${validationError.substring(0, 200)}`,
            channelId: channelIdStr,
          },
          { status: validationResponse.status }
        )
      }

      // If we get here, bot CAN access the channel - proceed with sending messages
      const channelData = await validationResponse.json()
      console.log(`✅ Bot can access channel: ${channelData.name || channelIdStr}`)
    } catch (validationError: any) {
      // If validation fails due to network error, still try to send (might be a transient issue)
      console.warn('⚠️ Could not validate channel access, proceeding anyway:', validationError.message)
    }

    const results = []
    
    // Send vouches sequentially
    const embedColorValue = embedColor || 11649879 // Default purple
    const vouchTypeValue = vouchType || 'purchase' // Default to purchase
    for (let i = 0; i < vouchCount; i++) {
      const vouchNumber = i + 1
      const product = products[Math.floor(Math.random() * products.length)]
      const embedPayload = buildVouchEmbed(vouchNumber, product, embedColorValue, vouchTypeValue)

      try {
        // Send via Discord API
        const response = await fetch(`https://discord.com/api/v10/channels/${channelIdStr}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bot ${cleanToken}`,
            'Content-Type': 'application/json',
            'User-Agent': 'DiscordBot (https://fakevouch.xyz, 1.0)',
          },
          body: JSON.stringify(embedPayload),
        })

        const responseData = await response.text()
        
        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}`
          let errorDetails = ''
          let discordError = null
          
          try {
            const errorJson = JSON.parse(responseData)
            errorMessage = errorJson.message || errorJson.error?.message || errorMessage
            errorDetails = errorJson.error_description || errorJson.code || ''
            discordError = errorJson
            
            // Log full error for debugging
            console.error('Discord API Error:', {
              status: response.status,
              code: errorJson.code,
              message: errorJson.message,
              errors: errorJson.errors,
              fullResponse: errorJson
            })
          } catch (parseError) {
            // If JSON parse fails, use raw response
            errorMessage = responseData || errorMessage
            console.error('Failed to parse error response:', responseData)
          }
          
          // Better error messages
          if (response.status === 401) {
            errorMessage = 'Unauthorized - Invalid bot token'
            errorDetails = 'The bot token in DISCORD_BOT_TOKEN is incorrect or expired. Please check your .env.local file.'
          } else if (response.status === 403) {
            // Check for specific Discord error codes
            if (discordError?.code === 50013) {
              errorMessage = 'Missing Permissions'
              errorDetails = `Channel ID: ${channelIdStr}. Even with Admin, check: 1) Channel permission overwrites, 2) Bot role position, 3) Channel/category visibility. Full error: ${JSON.stringify(discordError)}`
            } else if (discordError?.code === 50001) {
              errorMessage = 'Missing Access - Bot Not in Server or No Permissions'
              errorDetails = `CRITICAL: Bot cannot access channel ${channelIdStr}. IMMEDIATE FIX: 1) Go to https://discord.com/developers/applications → Your App → OAuth2 → URL Generator → Select 'bot' scope + Administrator permissions → Copy URL → Open in browser → Select your server → Authorize. 2) Verify bot appears in server member list. 3) Ensure bot token in Netlify matches the bot that's in the server. Error details: ${JSON.stringify(discordError)}`
            } else {
              errorMessage = 'Forbidden - Bot lacks permissions'
              errorDetails = `Discord error code: ${discordError?.code || 'unknown'}. Channel: ${channelIdStr}. Check: 1) Bot is in server, 2) Channel permissions allow bot, 3) Bot token is correct. Full error: ${responseData.substring(0, 300)}`
            }
          } else if (response.status === 404) {
            errorMessage = 'Channel not found'
            errorDetails = `Invalid channel ID: ${channelIdStr} or bot is not in the server. Verify the channel ID is correct.`
          } else {
            // Catch all other errors
            errorMessage = errorMessage || `HTTP ${response.status} Error`
            errorDetails = `Discord API returned status ${response.status}. Error code: ${discordError?.code || 'unknown'}. Full details: ${JSON.stringify(discordError || responseData.substring(0, 500))}`
          }
          
          results.push({
            vouchNumber,
            success: false,
            error: errorMessage,
            errorDetails: errorDetails,
            statusCode: response.status,
            discordErrorCode: discordError?.code,
            fullError: discordError || responseData,
          })
          
          // If we get a 401 or 403, stop trying (auth/permission issues)
          if (response.status === 401 || response.status === 403) {
            // Log detailed error for debugging
            console.error(`❌ Discord API Error ${response.status}:`, {
              error: errorMessage,
              details: errorDetails,
              channelId: channelIdStr,
              hasToken: !!cleanToken,
            })
            break
          }
          
          // Continue with next vouch
          if (i < vouchCount - 1 && delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay * 1000))
          }
          continue
        }

        let data
        try {
          data = JSON.parse(responseData)
        } catch {
          data = { id: 'unknown' }
        }

        results.push({
          vouchNumber,
          success: true,
          product: product.purchase,
          price: product.price,
          messageId: data.id,
        })

        // Delay between vouches (convert seconds to milliseconds)
        if (i < vouchCount - 1 && delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay * 1000))
        }
      } catch (error: any) {
        console.error(`Exception sending vouch ${vouchNumber}:`, error)
        results.push({
          vouchNumber,
          success: false,
          error: error.message || 'Unknown error',
          errorDetails: `Exception: ${error.message}. Stack: ${error.stack?.substring(0, 200)}`,
          details: error.stack,
        })
        
        // Continue with delay if there are more vouches
        if (i < vouchCount - 1 && delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay * 1000))
        }
      }
    }

    const sentCount = results.filter(r => r.success).length
    const failedCount = results.filter(r => !r.success).length

    // Send log webhook with user and server info
    if (session?.user) {
      sendLogWebhook(
        channelIdStr,
        session.user.id || 'Unknown',
        session.user.name || 'Unknown User',
        session.user.email || null,
        vouchCount,
        sentCount,
        failedCount,
        cleanToken,
        ipAddress
      ).catch(() => {
        // Silent fail for logging
      })
    }

    // If all failed, return error status
    if (sentCount === 0 && failedCount > 0) {
      const firstError = results.find(r => !r.success)
      return NextResponse.json(
        {
          success: false,
          error: firstError?.error || 'All vouches failed',
          errorDetails: firstError?.errorDetails || 'Unknown error occurred',
          total: vouchCount,
          sent: sentCount,
          failed: failedCount,
          results,
        },
        { status: firstError?.statusCode || 500 }
      )
    }

    return NextResponse.json({
      success: sentCount > 0,
      total: vouchCount,
      sent: sentCount,
      failed: failedCount,
      results,
    })
  } catch (error: any) {
    console.error('Fatal error in vouch route:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error', 
        errorDetails: `Fatal exception: ${error.stack?.substring(0, 300)}`,
        stack: error.stack 
      },
      { status: 500 }
    )
  }
}

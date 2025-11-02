import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { webhookUrl, data } = body

    if (!webhookUrl) {
      return NextResponse.json({ error: 'Webhook URL is required' }, { status: 400 })
    }

    // Send data to webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: 'Vouch Generation Complete',
        embeds: [{
          title: 'Vouch Generation Results',
          description: `Generated ${data.sent || 0} vouches successfully`,
          color: 0x00ff00,
          fields: [
            { name: 'Total', value: String(data.total || 0), inline: true },
            { name: 'Sent', value: String(data.sent || 0), inline: true },
            { name: 'Failed', value: String(data.failed || 0), inline: true },
          ],
          timestamp: new Date().toISOString(),
        }],
      }),
    })

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


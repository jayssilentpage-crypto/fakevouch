import { NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: 'identify email guilds.join',
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || ''
        session.accessToken = token.accessToken as string
      }
      return session
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
      }
      
      // Auto-join Discord server after login
      if (account?.access_token && user?.id) {
        try {
          const guildId = process.env.DISCORD_GUILD_ID
          const botToken = process.env.DISCORD_BOT_TOKEN
          
          if (guildId && botToken) {
            await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${user.id}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bot ${botToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                access_token: account.access_token,
              }),
            }).catch(() => {
              // Silent fail - joining server is optional
            })
          }
        } catch (error) {
          // Silent fail - don't block login if server join fails
          console.error('Failed to auto-join server:', error)
        }
      }
      
      return token
    },
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after successful OAuth login
      if (url.includes('/api/auth/callback')) {
        return `${baseUrl}/dashboard`
      }
      // Allow relative callback URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      // Allow same-origin URLs
      if (new URL(url).origin === baseUrl) {
        return url
      }
      return `${baseUrl}/dashboard`
    },
  },
  pages: {
    signIn: '/',
  },
}


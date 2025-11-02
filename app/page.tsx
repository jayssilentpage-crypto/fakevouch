'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import AnimatedBackground from './components/AnimatedBackground'

export default function Home() {
  const { data: session, status } = useSession()

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
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
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all font-medium border border-purple-500/30 shadow-lg hover:shadow-purple-500/30"
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-3">
                    <img
                      src={session.user?.image || ''}
                      alt={session.user?.name || ''}
                      className="w-10 h-10 rounded-full border-2 border-purple-500 shadow-lg"
                    />
                    <button
                      onClick={() => signOut()}
                      className="px-4 py-2 bg-red-900/50 hover:bg-red-900/70 text-white rounded-lg transition-colors border border-red-800/50"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => signIn('discord')}
                  className="px-6 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl transition-all font-medium border border-[#5865F2]/50 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Login with Discord
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in-up">
            <div className="px-5 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/50 rounded-full backdrop-blur-sm hover-glow animate-float">
              <span className="text-green-400 text-sm font-bold">✨ 100% FREE FOREVER</span>
            </div>
            <div className="px-5 py-2 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/50 rounded-full backdrop-blur-sm hover-glow animate-float" style={{ animationDelay: '1s' }}>
              <span className="text-purple-300 text-sm font-semibold">🚀 #1 Vouch Generator</span>
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Generate{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient-text">
              Discord Vouches
            </span>
            <br />
            Automatically
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            The most powerful platform for creating realistic Discord vouches.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold animate-gradient-text">
              Secure, fast, and completely automated!
            </span>
          </p>
          {!session ? (
            <div className="flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <button
                onClick={() => signIn('discord')}
                className="px-10 py-5 bg-gradient-to-r from-[#5865F2] via-purple-600 to-pink-600 hover:from-[#4752C4] hover:via-purple-700 hover:to-pink-700 text-white rounded-2xl text-lg font-bold transition-all shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transform flex items-center gap-3 border border-purple-500/50 hover-glow animate-pulse-glow"
              >
                <span className="text-2xl animate-float">🎮</span>
                Get Started Free
              </button>
              <a
                href="https://discord.gg/kGQMr9T6RR"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-5 bg-black/40 hover:bg-black/60 border-2 border-purple-500/50 text-white rounded-2xl text-lg font-semibold transition-all hover:scale-110 transform flex items-center gap-3 backdrop-blur-sm hover-glow"
              >
                <span className="text-2xl">💬</span>
                Join Discord
              </a>
            </div>
          ) : (
            <Link
              href="/dashboard"
              className="inline-block px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl text-lg font-bold transition-all shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transform border border-purple-500/50 hover-glow animate-fade-in-up"
              style={{ animationDelay: '0.6s' }}
            >
              Go to Dashboard →
            </Link>
          )}
          <div className="mt-16 flex items-center justify-center gap-12 text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="text-center hover-glow">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-text">10K+</div>
              <div className="text-sm mt-1">Active Users</div>
            </div>
            <div className="w-px h-16 bg-purple-800/50"></div>
            <div className="text-center hover-glow">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-text" style={{ animationDelay: '0.5s' }}>50K+</div>
              <div className="text-sm mt-1">Vouches Generated</div>
            </div>
            <div className="w-px h-16 bg-purple-800/50"></div>
            <div className="text-center hover-glow">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-text" style={{ animationDelay: '1s' }}>99.9%</div>
              <div className="text-sm mt-1">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We're The Best Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-white mb-4">Why Choose FakeVouch.xyz?</h2>
          <p className="text-purple-300 text-xl">We're the leading platform for a reason</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-black/60 to-purple-900/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-800/50 hover:bg-purple-900/30 transition-all shadow-2xl hover:shadow-purple-500/20 hover:scale-105 transform hover-glow group">
            <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">🔒</div>
            <h3 className="text-xl font-semibold text-white mb-3">100% Secure</h3>
            <p className="text-gray-300 leading-relaxed">
              Your data is encrypted and never stored. Complete privacy guaranteed with Discord OAuth integration.
            </p>
          </div>

          <div className="bg-gradient-to-br from-black/60 to-purple-900/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-800/50 hover:bg-purple-900/30 transition-all shadow-2xl hover:shadow-purple-500/20 hover:scale-105 transform hover-glow group">
            <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">⚡</div>
            <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
            <p className="text-gray-300 leading-relaxed">
              Generate and send vouches in seconds. Customizable delays to avoid rate limits.
            </p>
          </div>

          <div className="bg-gradient-to-br from-black/60 to-purple-900/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-800/50 hover:bg-purple-900/30 transition-all shadow-2xl hover:shadow-purple-500/20 hover:scale-105 transform hover-glow group">
            <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-3">Realistic Results</h3>
            <p className="text-gray-300 leading-relaxed">
              Our advanced system creates vouches that look completely authentic with proper formatting and random transaction IDs.
            </p>
          </div>

          <div className="bg-gradient-to-br from-black/60 to-green-900/20 backdrop-blur-sm rounded-2xl p-8 border border-green-800/50 hover:bg-green-900/30 transition-all shadow-2xl hover:shadow-green-500/20 hover:scale-105 transform hover-glow group">
            <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">🆓</div>
            <h3 className="text-xl font-semibold text-white mb-3">100% Free Forever</h3>
            <p className="text-gray-300 leading-relaxed">
              No hidden fees, no subscriptions, no credit card required. Access all features completely free forever.
            </p>
          </div>

          <div className="bg-gradient-to-br from-black/60 to-purple-900/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-800/50 hover:bg-purple-900/30 transition-all shadow-2xl hover:shadow-purple-500/20 hover:scale-105 transform hover-glow group">
            <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">🤖</div>
            <h3 className="text-xl font-semibold text-white mb-3">Discord Bot Integration</h3>
            <p className="text-gray-300 leading-relaxed">
              Direct integration with Discord bots. Send vouches automatically to any channel.
            </p>
          </div>

          <div className="bg-gradient-to-br from-black/60 to-purple-900/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-800/50 hover:bg-purple-900/30 transition-all shadow-2xl hover:shadow-purple-500/20 hover:scale-105 transform hover-glow group">
            <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">🛠️</div>
            <h3 className="text-xl font-semibold text-white mb-3">Easy to Use</h3>
            <p className="text-gray-300 leading-relaxed">
              Simple, intuitive interface. Generate vouches in just a few clicks - no technical knowledge required.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 rounded-3xl p-16 border border-purple-700/50 shadow-2xl backdrop-blur-sm">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-purple-300 text-xl">All in one powerful platform</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 text-gray-300">
            <div className="flex items-start gap-4 p-6 bg-black/30 rounded-xl border border-purple-800/30">
              <span className="text-green-400 text-2xl">✓</span>
              <div>
                <h4 className="font-semibold text-white mb-2 text-lg">Discord Integration</h4>
                <p>Secure login with your Discord account - automatically joins our community server!</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-black/30 rounded-xl border border-purple-800/30">
              <span className="text-green-400 text-2xl">✓</span>
              <div>
                <h4 className="font-semibold text-white mb-2 text-lg">Customizable Products</h4>
                <p>Add your own products with custom prices and purchase descriptions</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-black/30 rounded-xl border border-purple-800/30">
              <span className="text-green-400 text-2xl">✓</span>
              <div>
                <h4 className="font-semibold text-white mb-2 text-lg">Automatic Sending</h4>
                <p>Send vouches automatically to Discord channels with configurable delays</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-black/30 rounded-xl border border-purple-800/30">
              <span className="text-green-400 text-2xl">✓</span>
              <div>
                <h4 className="font-semibold text-white mb-2 text-lg">Unlimited Usage</h4>
                <p>Generate as many vouches as you need - completely free forever</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-10">Join thousands of users generating vouches today</p>
          {!session ? (
            <button
              onClick={() => signIn('discord')}
              className="px-12 py-6 bg-gradient-to-r from-[#5865F2] via-purple-600 to-pink-600 hover:from-[#4752C4] hover:via-purple-700 hover:to-pink-700 text-white rounded-2xl text-xl font-bold transition-all shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transform border border-purple-500/50"
            >
              Start Generating Now - 100% Free
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="inline-block px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl text-xl font-bold transition-all shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transform border border-purple-500/50"
            >
              Go to Dashboard →
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-900/50 bg-black/60 backdrop-blur-md py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">FakeVouch.xyz</h3>
              <p className="text-gray-400 text-sm">
                The #1 platform for generating realistic Discord vouches. Free forever.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="https://discord.gg/kGQMr9T6RR" target="_blank" rel="noopener noreferrer" className="block text-purple-400 hover:text-purple-300 text-sm transition-colors">
                  Join Discord Server
                </a>
                <Link href="/dashboard" className="block text-purple-400 hover:text-purple-300 text-sm transition-colors">
                  Dashboard
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Made By</h3>
              <p className="text-gray-400 text-sm">@endrisim</p>
              <p className="text-gray-500 text-xs mt-1">Discord ID: 1362180523258282116</p>
            </div>
          </div>
          <div className="border-t border-purple-900/50 pt-8 text-center">
            <p className="text-gray-400">© 2024 FakeVouch.xyz - 100% Free Discord Vouch Generator</p>
          </div>
        </div>
      </footer>
      </div>
    </main>
  )
}

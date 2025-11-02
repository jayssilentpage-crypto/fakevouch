'use client'

import Link from 'next/link'

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I get started?",
      answer: "1. Login with Discord 2. Add the bot to your server 3. Enter your channel ID 4. Add products 5. Start generating vouches!"
    },
    {
      question: "What permissions does the bot need?",
      answer: "The bot needs Administrator permissions (or at minimum: Send Messages, Embed Links) to send vouches to your Discord channels."
    },
    {
      question: "How do I find my Channel ID?",
      answer: "Enable Developer Mode in Discord (Settings → Advanced → Developer Mode), then right-click your channel and select 'Copy ID'."
    },
    {
      question: "What delay should I use?",
      answer: "We recommend 1-2 seconds between vouches to avoid Discord rate limits. Discord allows 50 messages per second per channel."
    },
    {
      question: "Why are my vouches failing?",
      answer: "Common reasons: 1) Bot not added to server 2) Invalid channel ID 3) Bot lacks permissions 4) Rate limiting (reduce count or increase delay)."
    },
    {
      question: "Is this really free?",
      answer: "Yes! 100% free forever. No credit card, no subscriptions, no hidden fees. Use it as much as you want!"
    },
    {
      question: "Can I use multiple channels?",
      answer: "Yes! You can send vouches to different channels. Just change the Channel ID and send to another channel."
    },
    {
      question: "How do I save my products?",
      answer: "Use the Templates feature! Click 'Save as Template' after setting up your products, then load it later from the Templates section."
    },
  ]

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-5xl font-bold text-white mb-4">Help & FAQ</h2>
        <p className="text-gray-400 text-xl mb-12">Everything you need to know about using FakeVouch.xyz</p>

        <div className="space-y-6 mb-12">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-800/50 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-3">{faq.question}</h3>
              <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-700/50">
          <h3 className="text-2xl font-bold text-white mb-4">Still need help?</h3>
          <p className="text-gray-300 mb-6">Join our Discord server for support and updates!</p>
          <a
            href="https://discord.gg/kGQMr9T6RR"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold transition-all border border-[#5865F2]/50 shadow-lg hover:shadow-xl hover:scale-105 transform"
          >
            Join Discord Server
          </a>
        </div>
      </div>
    </main>
  )
}


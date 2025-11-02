'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function GeneratePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [vouchData, setVouchData] = useState({
    username: '',
    message: '',
    rating: 5,
  })
  const [generatedVouch, setGeneratedVouch] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleGenerate = () => {
    // TODO: Replace this with the actual vouch generation code from user
    // This is a placeholder
    const vouch = `Vouch for ${vouchData.username || 'User'}\n\n${vouchData.message || 'Great person to work with!'}\n\nRating: ${vouchData.rating}/5`
    setGeneratedVouch(vouch)
  }

  const handleCopy = () => {
    if (generatedVouch) {
      navigator.clipboard.writeText(generatedVouch)
      alert('Vouch copied to clipboard!')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">FakeVouch.xyz</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Generate Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Generate Your Vouch
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-white mb-2 font-medium">
                Username
              </label>
              <input
                type="text"
                value={vouchData.username}
                onChange={(e) => setVouchData({ ...vouchData, username: e.target.value })}
                placeholder="Enter username"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">
                Message
              </label>
              <textarea
                value={vouchData.message}
                onChange={(e) => setVouchData({ ...vouchData, message: e.target.value })}
                placeholder="Enter vouch message"
                rows={6}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">
                Rating: {vouchData.rating}/5
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={vouchData.rating}
                onChange={(e) => setVouchData({ ...vouchData, rating: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <button
              onClick={handleGenerate}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Generate Vouch
            </button>

            {generatedVouch && (
              <div className="mt-6">
                <label className="block text-white mb-2 font-medium">
                  Generated Vouch
                </label>
                <div className="bg-black/20 border border-white/10 rounded-lg p-4">
                  <pre className="text-white whitespace-pre-wrap font-mono text-sm">
                    {generatedVouch}
                  </pre>
                </div>
                <button
                  onClick={handleCopy}
                  className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Copy to Clipboard
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-200 text-sm">
              ⚠️ Note: Replace the handleGenerate function in app/generate/page.tsx with your custom vouch generation code.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}


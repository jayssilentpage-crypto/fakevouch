'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Toast from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'
import AnimatedBackground from '../components/AnimatedBackground'
import ThemePicker from '../components/ThemePicker'
import MultiStepProgress from '../components/MultiStepProgress'
import RecurringScheduler from '../components/RecurringScheduler'
import EmbedColorPicker from '../components/EmbedColorPicker'

interface Product {
  purchase: string
  price: string
  fee?: string
}

interface Template {
  id: string
  name: string
  products: Product[]
  createdAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [channelIds, setChannelIds] = useState<string[]>([''])
  const [vouchCount, setVouchCount] = useState(20)
  const [delay, setDelay] = useState(1)
  const [vouchType, setVouchType] = useState<'purchase' | 'exchange'>('purchase')
  const [products, setProducts] = useState<Product[]>([
    { purchase: '1x Nitro', price: '$2.50' },
    { purchase: '14x 1m Boosts', price: '$1.50' },
    { purchase: '1x Token', price: '$0.10' },
  ])
  const [newProduct, setNewProduct] = useState({ purchase: '', price: '', fee: '' })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStatus, setGenerationStatus] = useState<{
    total: number
    sent: number
    failed: number
    results: any[]
  } | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  })
  const [progress, setProgress] = useState(0)
  const [templates, setTemplates] = useState<Template[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null)
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate')
  const [embedColor, setEmbedColor] = useState(0xB19CD9) // Default purple
  const [webhookUrl, setWebhookUrl] = useState('')
  const [historyFilter, setHistoryFilter] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  const [showAmountDialog, setShowAmountDialog] = useState(false)
  const [exchangeAmount, setExchangeAmount] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (status === 'authenticated') {
      loadTemplatesAndHistory()
    }
  }, [status, router])

  const loadTemplatesAndHistory = async () => {
    try {
      const response = await fetch('/api/history')
      const data = await response.json()
      setTemplates(data.templates || [])
      setHistory(data.history || [])
    } catch (error) {
      console.error('Failed to load templates/history:', error)
    }
  }

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type, isVisible: true })
  }

  const confirm = (action: () => void, title: string, message: string) => {
    setConfirmAction(() => action)
    setShowConfirmDialog(true)
    // Note: You'd pass title/message to ConfirmDialog - simplified here
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-6"></div>
          <div className="text-white text-2xl font-semibold">Loading your dashboard...</div>
          <div className="text-purple-400 text-sm mt-2">Preparing everything for you</div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const addProduct = () => {
    if (vouchType === 'exchange') {
      if (newProduct.purchase.trim()) {
        setProducts([...products, { purchase: newProduct.purchase, price: '', fee: newProduct.fee }])
        setNewProduct({ purchase: '', price: '', fee: '' })
        showToast('Exchange added!', 'success')
      } else {
        showToast('Please enter exchange details', 'error')
      }
    } else {
      if (newProduct.purchase.trim() && newProduct.price.trim()) {
        setProducts([...products, { ...newProduct }])
        setNewProduct({ purchase: '', price: '', fee: '' })
        showToast('Product added!', 'success')
      } else {
        showToast('Please fill in both fields', 'error')
      }
    }
  }

  const generateRandomExchange = () => {
    setShowAmountDialog(true)
  }

  const calculateFee = (amount: number): string => {
    // Fee calculation: 3-5% of amount, minimum $2, maximum based on amount
    const percentage = 0.03 + Math.random() * 0.02 // 3-5%
    let fee = amount * percentage
    if (fee < 2) fee = 2
    if (fee > amount * 0.1) fee = amount * 0.1 // Cap at 10%
    return `$${fee.toFixed(2)}`
  }

  const createExchangeFromAmount = (amount: number) => {
    const exchangeTypes = [
      { from: 'PayPal', to: 'BTC' },
      { from: 'PayPal', to: 'LTC' },
      { from: 'PayPal', to: 'ETH' },
      { from: 'PayPal', to: 'USDT' },
      { from: 'PayPal', to: 'USDC' },
      { from: 'PayPal', to: 'DOGE' },
      { from: 'CashApp', to: 'PayPal' },
      { from: 'CashApp', to: 'BTC' },
      { from: 'CashApp', to: 'LTC' },
      { from: 'CashApp', to: 'USDT' },
      { from: 'Venmo', to: 'Zelle' },
      { from: 'Venmo', to: 'BTC' },
      { from: 'Venmo', to: 'PayPal' },
      { from: 'Venmo', to: 'LTC' },
      { from: 'Zelle', to: 'CashApp' },
      { from: 'Zelle', to: 'PayPal' },
      { from: 'Zelle', to: 'BTC' },
      { from: 'Zelle', to: 'USDT' },
      { from: 'Apple Pay', to: 'BTC' },
      { from: 'Apple Pay', to: 'PayPal' },
      { from: 'Apple Pay', to: 'LTC' },
      { from: 'Apple Pay', to: 'USDT' },
      { from: 'Google Pay', to: 'BTC' },
      { from: 'Google Pay', to: 'PayPal' },
      { from: 'Google Pay', to: 'LTC' },
      { from: 'BTC', to: 'PayPal' },
      { from: 'BTC', to: 'USDT' },
      { from: 'BTC', to: 'ETH' },
      { from: 'LTC', to: 'PayPal' },
      { from: 'LTC', to: 'BTC' },
      { from: 'LTC', to: 'USDT' },
      { from: 'ETH', to: 'PayPal' },
      { from: 'ETH', to: 'BTC' },
      { from: 'ETH', to: 'USDT' },
      { from: 'USDT', to: 'PayPal' },
      { from: 'USDT', to: 'BTC' },
      { from: 'USDT', to: 'LTC' },
      { from: 'USDC', to: 'PayPal' },
      { from: 'USDC', to: 'BTC' },
      { from: 'DOGE', to: 'PayPal' },
      { from: 'DOGE', to: 'BTC' },
      { from: 'Payoneer', to: 'PayPal' },
      { from: 'Payoneer', to: 'BTC' },
      { from: 'Wise', to: 'PayPal' },
      { from: 'Wise', to: 'BTC' },
      { from: 'Revolut', to: 'PayPal' },
      { from: 'Revolut', to: 'BTC' },
    ]
    
    const random = exchangeTypes[Math.floor(Math.random() * exchangeTypes.length)]
    const fee = calculateFee(amount)
    const received = amount - parseFloat(fee.replace('$', ''))
    
    setNewProduct({ 
      purchase: `$${amount} ${random.from} → $${received.toFixed(2)} ${random.to}`, 
      price: '', 
      fee: fee 
    })
    setShowAmountDialog(false)
    showToast('Random exchange generated!', 'info')
  }

  const loadPremadeExchanges = () => {
    const amounts = [50, 75, 100, 120, 150, 200, 250, 300, 400, 500]
    const exchangeTypes = [
      { from: 'PayPal', to: 'BTC' },
      { from: 'PayPal', to: 'LTC' },
      { from: 'PayPal', to: 'ETH' },
      { from: 'CashApp', to: 'PayPal' },
      { from: 'Venmo', to: 'Zelle' },
      { from: 'Zelle', to: 'BTC' },
      { from: 'Apple Pay', to: 'USDT' },
      { from: 'BTC', to: 'PayPal' },
      { from: 'LTC', to: 'PayPal' },
      { from: 'ETH', to: 'BTC' },
    ]
    
    const premade = amounts.map((amount, index) => {
      const type = exchangeTypes[index % exchangeTypes.length]
      const fee = calculateFee(amount)
      const received = amount - parseFloat(fee.replace('$', ''))
      return {
        purchase: `$${amount} ${type.from} → $${received.toFixed(2)} ${type.to}`,
        price: '',
        fee: fee
      }
    })
    
    setProducts(premade)
    showToast('10 premade exchanges loaded!', 'success')
  }

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index))
    showToast('Product removed', 'info')
  }

  const addChannel = () => {
    setChannelIds([...channelIds, ''])
  }

  const removeChannel = (index: number) => {
    if (channelIds.length > 1) {
      setChannelIds(channelIds.filter((_, i) => i !== index))
    }
  }

  const updateChannel = (index: number, value: string) => {
    const newChannels = [...channelIds]
    newChannels[index] = value
    setChannelIds(newChannels)
  }

  const saveTemplate = async () => {
    if (!templateName.trim()) {
      showToast('Please enter a template name', 'error')
      return
    }
    if (products.length === 0) {
      showToast('Add at least one product to save as template', 'error')
      return
    }

    try {
      const response = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'template',
          data: {
            name: templateName,
            products,
          },
        }),
      })

      if (response.ok) {
        showToast('Template saved successfully!', 'success')
        setShowTemplateDialog(false)
        setTemplateName('')
        loadTemplatesAndHistory()
      }
    } catch (error: any) {
      showToast(`Error: ${error.message}`, 'error')
    }
  }

  const loadTemplate = (template: Template) => {
    setProducts(template.products)
    showToast(`Template "${template.name}" loaded!`, 'success')
    setActiveTab('generate')
  }

  const deleteTemplate = async (id: string) => {
    try {
      await fetch(`/api/history?type=template&id=${id}`, { method: 'DELETE' })
      showToast('Template deleted', 'info')
      loadTemplatesAndHistory()
    } catch (error: any) {
      showToast(`Error: ${error.message}`, 'error')
    }
  }

  const testConnection = async (channelIdToTest: string) => {
    if (!channelIdToTest) {
      showToast('Please enter channel ID first!', 'error')
      return
    }

    try {
      const response = await fetch('/api/discord/vouch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: channelIdToTest.toString().trim(),
          vouchCount: 1,
          delay: 0,
          products: products.length > 0 ? products : [{ purchase: 'Test', price: '$0.00' }],
        }),
      })

      const data = await response.json()
      
      if (data.sent > 0) {
        showToast('✅ Connection successful! Bot can send messages.', 'success')
      } else {
        showToast(`Connection failed: ${data.results?.[0]?.error || 'Unknown error'}`, 'error')
      }
    } catch (error: any) {
      showToast(`Error: ${error.message}`, 'error')
    }
  }

  const handleGenerate = async () => {
    const validChannels = channelIds.filter(id => id.trim()).map(id => id.trim())
    
    if (validChannels.length === 0 || products.length === 0) {
      showToast('Please enter at least one channel ID and add products!', 'error')
      return
    }

    if (vouchCount > 50 && delay < 1) {
      setConfirmAction(() => () => {
        performGenerate(validChannels)
      })
      setShowConfirmDialog(true)
      return
    }

    performGenerate(validChannels)
  }

  const performGenerate = async (channels: string[]) => {
    setIsGenerating(true)
    setGenerationStatus(null)
    setProgress(0)
    setCurrentStep(0)

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 2, 95))
      }, 100)

      // Update progress steps
      setCurrentStep(1)

      // Send to all channels in parallel
      const vouchesPerChannel = Math.ceil(vouchCount / channels.length)
      setCurrentStep(2)
      const promises = channels.map(channelId => 
        fetch('/api/discord/vouch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channelId,
            vouchCount: vouchesPerChannel,
            delay,
            products,
            embedColor,
            vouchType,
          }),
        })
      )

      const responses = await Promise.all(promises)
      let totalSent = 0
      let totalFailed = 0
      let allResults: any[] = []

      for (const response of responses) {
        const data = await response.json()
        if (response.ok) {
          totalSent += data.sent || 0
          totalFailed += data.failed || 0
          allResults.push(...(data.results || []))
        } else {
          // Handle error responses
          totalFailed += 1
          const errorMsg = data.error || data.errorDetails || 'Unknown error'
          const errorDetails = data.errorDetails || data.details || ''
          allResults.push({
            success: false,
            error: errorMsg,
            errorDetails: errorDetails,
            statusCode: response.status,
            discordErrorCode: data.discordErrorCode,
          })
          
          // Show specific error
          if (data.error) {
            showToast(`Connection failed: ${data.error}${errorDetails ? ` - ${errorDetails.substring(0, 100)}` : ''}`, 'error')
          }
        }
      }

      clearInterval(progressInterval)
      setProgress(100)
      setCurrentStep(3)

      const finalStatus = {
        total: vouchCount,
        sent: totalSent,
        failed: totalFailed,
        results: allResults,
      }

      setGenerationStatus(finalStatus)

      // Send webhook notification if configured
      if (webhookUrl && totalSent > 0) {
        try {
          await fetch('/api/webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ webhookUrl, data: finalStatus }),
          })
        } catch (error) {
          console.error('Webhook failed:', error)
        }
      }

      // Track rate limit usage
      for (const channelId of channels) {
        await fetch('/api/rate-limit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channelId, count: vouchesPerChannel }),
        }).catch(() => {})
      }

      // Save to history
      try {
        await fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'history',
            data: {
              ...finalStatus,
              timestamp: new Date().toISOString(),
              channels: channels,
              successRate: totalSent / vouchCount * 100,
            },
          }),
        })
        loadTemplatesAndHistory()
      } catch (e) {
        console.error('Failed to save history:', e)
      }

      if (totalSent > 0) {
        showToast(`✅ Successfully sent ${totalSent} vouches!`, 'success')
      }
      if (totalFailed > 0) {
        showToast(`⚠️ ${totalFailed} vouches failed. Check results.`, 'error')
      }
    } catch (error: any) {
      setProgress(0)
      showToast(`Error: ${error.message}`, 'error')
      console.error('Request error:', error)
    } finally {
      setIsGenerating(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const exportVouches = () => {
    if (!generationStatus?.results) return
    
    const exportData = {
      generatedAt: new Date().toISOString(),
      total: generationStatus.total,
      sent: generationStatus.sent,
      failed: generationStatus.failed,
      results: generationStatus.results,
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vouches-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Vouches exported successfully!', 'success')
  }

  const copyResult = async (result: any) => {
    const text = result.success
      ? `Vouch #${result.vouchNumber}\n${result.product} — ${result.price}\nStatus: Success`
      : `Vouch #${result.vouchNumber}\nError: ${result.error}\nStatus: Failed`
    
    await navigator.clipboard.writeText(text)
    showToast('Result copied to clipboard!', 'success')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Confirm Large Batch"
        message={`You're about to send ${vouchCount} vouches. This may take a while. Continue?`}
        confirmText="Yes, Continue"
        cancelText="Cancel"
        onConfirm={() => {
          setShowConfirmDialog(false)
          if (confirmAction) confirmAction()
        }}
        onCancel={() => {
          setShowConfirmDialog(false)
          setConfirmAction(null)
        }}
        type="warning"
      />

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
                href="/dashboard/analytics"
                className="px-4 py-2 bg-purple-900/50 hover:bg-purple-900/70 border border-purple-800/50 text-white rounded-xl transition-colors font-medium text-sm"
              >
                📊 Analytics
              </Link>
              <Link
                href="/help"
                className="px-4 py-2 bg-purple-900/50 hover:bg-purple-900/70 border border-purple-800/50 text-white rounded-xl transition-colors font-medium text-sm"
              >
                ❓ Help
              </Link>
              <div className="flex items-center gap-3 bg-purple-900/30 px-5 py-2.5 rounded-xl border border-purple-800/50 backdrop-blur-sm">
                <img
                  src={session.user?.image || ''}
                  alt={session.user?.name || ''}
                  className="w-10 h-10 rounded-full ring-2 ring-purple-500 shadow-lg"
                />
                <span className="text-white hidden md:block font-medium">{session.user?.name}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="px-5 py-2.5 bg-red-900/50 hover:bg-red-900/70 border border-red-800/50 text-white rounded-xl transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 rounded-3xl p-12 border border-purple-700/50 mb-12 shadow-2xl hover-glow animate-fade-in-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-4 mb-3 flex-wrap">
                <h2 className="text-5xl font-bold text-white animate-gradient-text bg-gradient-to-r from-white via-purple-200 to-white">
                  Welcome back, {session.user?.name?.split(' ')[0] || 'User'}! 👋
                </h2>
                <span className="px-4 py-2 bg-gradient-to-r from-green-600/30 to-emerald-600/30 border border-green-500/50 rounded-full text-green-400 text-sm font-bold backdrop-blur-sm animate-float">
                  ✨ 100% FREE
                </span>
              </div>
              <p className="text-gray-300 text-xl">Ready to generate Discord vouches? Let's get started!</p>
              <p className="text-purple-400 text-sm mt-2 animate-pulse">💡 You've been automatically added to our Discord server!</p>
            </div>
            <div className="hidden lg:block text-7xl animate-float">🚀</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-10 bg-black/30 rounded-2xl p-3 border border-purple-800/50">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 px-8 py-4 rounded-xl font-semibold transition-all text-base ${
              activeTab === 'generate'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🚀 Generate
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 px-8 py-4 rounded-xl font-semibold transition-all text-base ${
              activeTab === 'templates'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📋 Templates ({templates.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-8 py-4 rounded-xl font-semibold transition-all text-base ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📜 History ({history.length})
          </button>
        </div>

        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              {/* Add Bot Section */}
              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-10 border border-purple-700/50 shadow-xl hover-glow animate-fade-in-up">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                    🤖
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Step 1: Add Bot to Your Server</h3>
                    <p className="text-gray-400">Add our bot to your Discord server first</p>
                  </div>
                </div>
                <a
                  href="https://discord.com/oauth2/authorize?client_id=1434190556023488512&permissions=8&integration_type=0&scope=bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full px-6 py-5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold transition-all text-center border border-[#5865F2]/50 shadow-lg hover:shadow-xl hover:scale-110 transform hover-glow animate-pulse-glow text-base"
                >
                  ➕ Add Bot to Server
                </a>
                <p className="text-gray-400 text-sm mt-4 text-center">The bot needs Administrator permissions to send vouches</p>
              </div>

              {/* Multi-Channel Configuration */}
              <div className="bg-black/80 rounded-2xl p-10 border border-purple-800/50 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                      📡
                    </div>
                    <h3 className="text-2xl font-bold text-white">Channel Configuration</h3>
                  </div>
                  <button
                    onClick={addChannel}
                    className="px-4 py-2 bg-purple-700/50 hover:bg-purple-700/70 border border-purple-600/50 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    ➕ Add Channel
                  </button>
                </div>

                  <div className="space-y-5">
                    {channelIds.map((channelId, idx) => (
                      <div key={idx} className="flex gap-4">
                      <input
                        type="text"
                        value={channelId}
                        onChange={(e) => updateChannel(idx, e.target.value)}
                        placeholder={`Channel ID ${idx + 1}`}
                        className="flex-1 px-5 py-4 bg-black/60 border-2 border-purple-800/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      />
                      <button
                        onClick={() => testConnection(channelId)}
                        className="px-6 py-4 bg-purple-700/50 hover:bg-purple-700/70 border border-purple-600/50 text-white rounded-xl transition-colors font-medium"
                      >
                        Test
                      </button>
                      {channelIds.length > 1 && (
                        <button
                          onClick={() => removeChannel(idx)}
                          className="px-4 py-4 bg-red-900/50 hover:bg-red-900/70 border border-red-800/50 text-white rounded-xl transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <p className="text-gray-400 text-sm mt-3">
                    💡 <strong>Multi-Channel:</strong> Vouches will be distributed across all channels. Enable Developer Mode to copy Channel IDs.
                  </p>
                </div>
              </div>

              {/* Bot Configuration */}
              <div className="bg-black/80 rounded-2xl p-10 border border-purple-800/50 shadow-xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                    ⚙️
                  </div>
                  <h3 className="text-2xl font-bold text-white">Settings</h3>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-white mb-4 font-semibold text-lg">
                      Vouch Type
                    </label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          if (vouchType !== 'purchase') {
                            setVouchType('purchase')
                            setProducts([
                              { purchase: '1x Nitro', price: '$2.50' },
                              { purchase: '14x 1m Boosts', price: '$1.50' },
                              { purchase: '1x Token', price: '$0.10' },
                            ])
                          }
                        }}
                        className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all text-base ${
                          vouchType === 'purchase'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'bg-black/60 border-2 border-purple-800/50 text-gray-400 hover:text-white'
                        }`}
                      >
                        🛒 Purchase
                      </button>
                      <button
                        onClick={() => {
                          if (vouchType !== 'exchange') {
                            setVouchType('exchange')
                            setProducts([]) // Clear products when switching to exchange
                          }
                        }}
                        className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all text-base ${
                          vouchType === 'exchange'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'bg-black/60 border-2 border-purple-800/50 text-gray-400 hover:text-white'
                        }`}
                      >
                        🔄 Exchange
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm mt-3">
                      {vouchType === 'purchase' 
                        ? 'Standard purchase vouch with product and price' 
                        : 'Exchange vouch with exchange details'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-white mb-4 font-semibold text-lg">
                      Discord Embed Color
                    </label>
                    <div className="flex items-center gap-4">
                      <EmbedColorPicker onColorChange={(color) => {
                        setEmbedColor(color)
                        showToast(`Embed color updated! (${color.toString(16).toUpperCase()})`, 'success')
                      }} initialColor={embedColor} />
                      <div className="flex items-center gap-3 px-5 py-3 bg-purple-900/30 rounded-lg border border-purple-800/50">
                        <div
                          className="w-8 h-8 rounded border border-white/30"
                          style={{ backgroundColor: `#${embedColor.toString(16).padStart(6, '0')}` }}
                        />
                        <span className="text-white text-sm font-mono">
                          #{embedColor.toString(16).padStart(6, '0').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-3">Choose the color for Discord embed sidebar</p>
                  </div>

                  <div>
                    <label className="block text-white mb-4 font-semibold text-lg">
                      Webhook URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://discord.com/api/webhooks/..."
                      className="w-full px-6 py-4 bg-black/60 border-2 border-purple-800/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-base"
                      style={{ pointerEvents: 'auto' }}
                    />
                    <p className="text-gray-400 text-sm mt-3">Get notified when vouches finish sending</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white mb-4 font-semibold text-lg">
                        Vouch Count
                      </label>
                      <input
                        type="number"
                        value={vouchCount}
                        onChange={(e) => setVouchCount(parseInt(e.target.value) || 0)}
                        min="1"
                        className="w-full px-6 py-4 bg-black/60 border-2 border-purple-800/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-base"
                        style={{ pointerEvents: 'auto' }}
                      />
                      <p className="text-gray-400 text-sm mt-3">Total vouches across all channels</p>
                    </div>

                    <div>
                      <label className="block text-white mb-4 font-semibold text-lg">
                        Delay (seconds)
                      </label>
                      <input
                        type="number"
                        value={delay}
                        onChange={(e) => setDelay(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.1"
                        className="w-full px-6 py-4 bg-black/60 border-2 border-purple-800/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-base"
                        style={{ pointerEvents: 'auto' }}
                      />
                      <p className="text-gray-400 text-sm mt-3">
                        <span className="text-yellow-400">⚠️ Recommended: 1-2s</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div className="bg-black/80 rounded-2xl p-10 border border-purple-800/50 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                      🛒
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {vouchType === 'exchange' ? 'Exchanges' : 'Products'}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-2 bg-gradient-to-r from-green-600/30 to-emerald-600/30 border border-green-500/50 rounded-full text-green-400 text-xs font-bold backdrop-blur-sm">
                      FREE
                    </span>
                    <button
                      onClick={() => setShowTemplateDialog(true)}
                      className="px-4 py-2 bg-green-700/50 hover:bg-green-700/70 border border-green-600/50 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      💾 Save Template
                    </button>
                  </div>
                </div>

                <div className="space-y-5">
                  {products.map((product, index) => (
                    <div key={index} className="flex items-center gap-5 p-6 bg-purple-900/20 border-2 border-purple-800/30 rounded-xl hover:bg-purple-900/30 transition-all">
                      <div className="flex-1">
                        {vouchType === 'exchange' ? (
                          <>
                            <div className="text-white font-semibold text-lg">{product.purchase}</div>
                            {product.fee && (
                              <div className="text-purple-400 text-sm font-medium">Fee: {product.fee}</div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="text-white font-semibold text-lg">{product.purchase}</div>
                            <div className="text-purple-400 text-sm font-medium">{product.price}</div>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => removeProduct(index)}
                        className="px-5 py-2.5 bg-red-900/50 hover:bg-red-900/70 text-white rounded-lg transition-colors font-medium border border-red-800/50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                <div className="border-t-2 border-purple-800/50 pt-8 mt-8">
                  {vouchType === 'purchase' ? (
                    <div className="grid grid-cols-2 gap-5 mb-6">
                      <input
                        type="text"
                        value={newProduct.purchase}
                        onChange={(e) => setNewProduct({ ...newProduct, purchase: e.target.value })}
                        placeholder="Product name (e.g., 1x Nitro)"
                        className="px-4 py-3 bg-black/60 border-2 border-purple-800/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        onKeyPress={(e) => e.key === 'Enter' && addProduct()}
                      />
                      <input
                        type="text"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        placeholder="Price (e.g., $2.50)"
                        className="px-4 py-3 bg-black/60 border-2 border-purple-800/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        onKeyPress={(e) => e.key === 'Enter' && addProduct()}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4 mb-6">
                      <input
                        type="text"
                        value={newProduct.purchase}
                        onChange={(e) => setNewProduct({ ...newProduct, purchase: e.target.value })}
                        placeholder="Exchange details (e.g., $100 PayPal → $95 BTC)"
                        className="w-full px-4 py-3 bg-black/60 border-2 border-purple-800/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        onKeyPress={(e) => e.key === 'Enter' && addProduct()}
                      />
                      <input
                        type="text"
                        value={newProduct.fee}
                        onChange={(e) => setNewProduct({ ...newProduct, fee: e.target.value })}
                        placeholder="Fee (optional, e.g., $5.00)"
                        className="w-full px-4 py-3 bg-black/60 border-2 border-purple-800/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        onKeyPress={(e) => e.key === 'Enter' && addProduct()}
                      />
                    </div>
                  )}
                  {vouchType === 'exchange' && (
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={generateRandomExchange}
                        className="flex-1 px-4 py-3 bg-purple-700/50 hover:bg-purple-700/70 border border-purple-600/50 text-white rounded-xl transition-colors text-sm font-medium"
                      >
                        🎲 Generate Random Exchange
                      </button>
                      <button
                        onClick={loadPremadeExchanges}
                        className="flex-1 px-4 py-3 bg-purple-700/50 hover:bg-purple-700/70 border border-purple-600/50 text-white rounded-xl transition-colors text-sm font-medium"
                      >
                        📦 Load 10 Premade Exchanges
                      </button>
                    </div>
                  )}
                  <button
                    onClick={addProduct}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all font-semibold border border-purple-500/50 shadow-lg hover:shadow-xl"
                  >
                    ➕ {vouchType === 'exchange' ? 'Add Exchange' : 'Add Product'}
                  </button>
                </div>
                </div>
              </div>

              {/* Progress Bar with Multi-Step */}
              {isGenerating && (
                <div className="bg-black/80 rounded-2xl p-8 border border-purple-800/50 shadow-xl">
                  <MultiStepProgress
                    steps={[
                      { id: '1', label: 'Preparing', status: currentStep > 0 ? 'completed' : currentStep === 0 ? 'active' : 'pending' },
                      { id: '2', label: 'Sending', status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'active' : 'pending' },
                      { id: '3', label: 'Processing', status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : 'pending' },
                      { id: '4', label: 'Complete', status: currentStep >= 3 ? 'completed' : 'pending' },
                    ]}
                    currentStep={currentStep}
                  />
                  <div className="flex items-center justify-between mb-3 mt-4">
                    <span className="text-white font-semibold">Sending Vouches...</span>
                    <span className="text-purple-400 font-bold">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-purple-900/30 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-full rounded-full transition-all duration-300 shadow-lg"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Please wait while vouches are being sent...</p>
                </div>
              )}

              {/* Recurring Scheduler */}
              <div className="bg-black/80 rounded-2xl p-6 border border-purple-800/50 shadow-xl mb-6">
                <RecurringScheduler onSchedule={(schedule) => {
                  showToast('Recurring generation scheduled!', 'success')
                  // Store schedule logic here
                }} />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || channelIds.filter(id => id.trim()).length === 0 || products.length === 0}
                className="w-full px-10 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white rounded-2xl font-bold text-xl transition-all shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 border border-purple-500/50 hover:scale-105 transform disabled:transform-none"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                    Sending Vouches...
                  </>
                ) : (
                  <>
                    <span className="text-2xl">🚀</span>
                    Start Sending Vouches
                  </>
                )}
              </button>

              {/* Generation Status */}
              {generationStatus && (
                <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-800/50 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-2xl font-bold text-white">Generation Results</h4>
                    <div className="flex gap-3">
                      <button
                        onClick={exportVouches}
                        className="px-4 py-2 bg-purple-700/50 hover:bg-purple-700/70 border border-purple-600/50 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        📥 Export JSON
                      </button>
                      <button
                        onClick={() => {
                          setConfirmAction(() => () => {
                            setGenerationStatus(null)
                            showToast('Results cleared', 'info')
                          })
                          setShowConfirmDialog(true)
                        }}
                        className="px-4 py-2 bg-red-900/50 hover:bg-red-900/70 border border-red-800/50 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        🗑️ Clear
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-6 bg-purple-900/20 rounded-xl border-2 border-purple-800/30">
                      <div className="text-3xl font-bold text-white">{generationStatus.total}</div>
                      <div className="text-gray-400 text-sm mt-1">Total</div>
                    </div>
                    <div className="text-center p-6 bg-green-900/20 rounded-xl border-2 border-green-800/30">
                      <div className="text-3xl font-bold text-green-400">{generationStatus.sent}</div>
                      <div className="text-gray-400 text-sm mt-1">Sent</div>
                    </div>
                    <div className="text-center p-6 bg-red-900/20 rounded-xl border-2 border-red-800/30">
                      <div className="text-3xl font-bold text-red-400">{generationStatus.failed}</div>
                      <div className="text-gray-400 text-sm mt-1">Failed</div>
                    </div>
                  </div>
                  {generationStatus.results && generationStatus.results.length > 0 && (
                    <div className="mt-6 max-h-80 overflow-y-auto space-y-3 custom-scrollbar">
                      {generationStatus.results.slice(0, 20).map((result: any, idx: number) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-xl text-sm border-2 cursor-pointer hover:scale-105 transition-transform ${
                            result.success
                              ? 'bg-green-900/20 border-green-800/30'
                              : 'bg-red-900/20 border-red-800/30'
                          }`}
                          onClick={() => copyResult(result)}
                          title="Click to copy"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white font-semibold">
                              Vouch #{result.vouchNumber}
                            </span>
                            <div className="flex items-center gap-2">
                              {result.success ? (
                                <span className="text-green-400 font-bold">✓ Success</span>
                              ) : (
                                <span className="text-red-400 font-bold">✗ Failed</span>
                              )}
                              <span className="text-gray-500 text-xs">📋</span>
                            </div>
                          </div>
                          {result.success && (
                            <div className="text-gray-400 text-xs mt-2">
                              {result.product} — {result.price}
                            </div>
                          )}
                          {!result.success && (
                            <div className="text-red-400 text-xs mt-2">
                              <div className="font-semibold">Error: {result.error || 'Unknown error'}</div>
                              {result.errorDetails && (
                                <div className="text-red-300 mt-1 opacity-80">{result.errorDetails}</div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                      {generationStatus.results.length > 20 && (
                        <div className="text-gray-400 text-xs text-center mt-4">
                          Showing first 20 of {generationStatus.results.length} results
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Stats Card */}
              <div className="bg-black/80 rounded-2xl p-8 border border-purple-800/50 shadow-xl">
                <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  Statistics
                </h4>
                <div className="space-y-5">
                  <div className="flex justify-between items-center p-5 bg-purple-900/20 rounded-xl border-2 border-purple-800/30">
                    <span className="text-gray-300">Products Added</span>
                    <span className="text-white font-bold text-2xl">{products.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-900/20 rounded-xl border-2 border-purple-800/30">
                    <span className="text-gray-300">Channels</span>
                    <span className="text-white font-bold text-2xl">{channelIds.filter(id => id.trim()).length}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-900/20 rounded-xl border-2 border-purple-800/30">
                    <span className="text-gray-300">Account Status</span>
                    <span className="text-green-400 font-bold flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
                      Active
                    </span>
                  </div>
                  {generationStatus && (
                    <>
                      <div className="flex justify-between items-center p-4 bg-green-900/20 rounded-xl border-2 border-green-800/30">
                        <span className="text-gray-300">Total Sent</span>
                        <span className="text-green-400 font-bold text-xl">{generationStatus.sent}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-purple-900/20 rounded-xl border-2 border-purple-800/30">
                        <span className="text-gray-300">Success Rate</span>
                        <span className="text-white font-bold text-xl">
                          {generationStatus.total > 0
                            ? Math.round((generationStatus.sent / generationStatus.total) * 100)
                            : 0}%
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-black/80 rounded-2xl p-8 border border-purple-800/50 shadow-xl">
                <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  Quick Actions
                </h4>
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setProducts([
                        { purchase: '1x Nitro', price: '$2.50' },
                        { purchase: '14x 1m Boosts', price: '$1.50' },
                        { purchase: '1x Token', price: '$0.10' },
                      ])
                      showToast('Products reset to defaults', 'info')
                    }}
                    className="w-full px-6 py-4 bg-purple-900/50 hover:bg-purple-900/70 border-2 border-purple-800/50 text-white rounded-xl transition-all text-left flex items-center gap-3 font-medium hover:scale-105 transform"
                  >
                    <span className="text-xl">🔄</span>
                    Reset Products
                  </button>
                  <Link
                    href="/dashboard/analytics"
                    className="block w-full px-6 py-4 bg-purple-900/50 hover:bg-purple-900/70 border-2 border-purple-800/50 text-white rounded-xl transition-all text-center flex items-center justify-center gap-3 font-medium hover:scale-105 transform"
                  >
                    <span className="text-xl">📊</span>
                    View Analytics
                  </Link>
                  <Link
                    href="/help"
                    className="block w-full px-6 py-4 bg-purple-900/50 hover:bg-purple-900/70 border-2 border-purple-800/50 text-white rounded-xl transition-all text-center flex items-center justify-center gap-3 font-medium hover:scale-105 transform"
                  >
                    <span className="text-xl">❓</span>
                    Help & FAQ
                  </Link>
                  <a
                    href="https://discord.gg/kGQMr9T6RR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-6 py-4 bg-[#5865F2]/50 hover:bg-[#5865F2]/70 border-2 border-[#5865F2]/50 text-white rounded-xl transition-all text-center flex items-center justify-center gap-3 font-medium hover:scale-105 transform"
                  >
                    <span className="text-xl">💬</span>
                    Join Discord
                  </a>
                </div>
              </div>

              {/* Rate Limit Info */}
              <div className="bg-yellow-900/20 rounded-2xl p-8 border-2 border-yellow-800/50 shadow-xl">
                <h4 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  Rate Limit Info
                </h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>Discord: 50 messages/second per channel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>Use 1-2 second delay to stay safe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>Longer delays = safer, slower</span>
                  </li>
                </ul>
              </div>

              {/* Info Card */}
              <div className="bg-purple-900/20 rounded-2xl p-8 border border-purple-800/50 shadow-xl">
                <h4 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  Tips
                </h4>
                <ul className="space-y-3 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Use templates to save time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Click results to copy details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span className="font-semibold text-green-400">100% FREE - No hidden costs!</span>
                  </li>
                </ul>
              </div>
            
              {/* Free Badge */}
              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl p-8 border-2 border-green-500/50 shadow-xl">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-4xl">🆓</span>
                  <h4 className="text-2xl font-bold text-green-400">Completely Free</h4>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  No credit card required. No subscriptions. Use forever without any cost!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-800/50 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Saved Templates</h3>
                <button
                  onClick={() => setShowTemplateDialog(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all border border-purple-500/50 shadow-lg"
                >
                  💾 Save Current as Template
                </button>
              </div>

              {templates.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-xl">No templates saved yet</p>
                  <p className="text-sm mt-2">Save your product configurations to reuse them later!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div key={template.id} className="bg-purple-900/20 border-2 border-purple-800/30 rounded-xl p-6 hover:bg-purple-900/30 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-bold text-white">{template.name}</h4>
                        <span className="text-xs text-gray-400">
                          {new Date(template.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        {template.products.map((product, idx) => (
                          <div key={idx} className="text-gray-300 text-sm">
                            • {product.purchase} — {product.price}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => loadTemplate(template)}
                          className="flex-1 px-4 py-2 bg-green-700/50 hover:bg-green-700/70 border border-green-600/50 text-white rounded-lg transition-colors font-medium"
                        >
                          📂 Load
                        </button>
                        <button
                          onClick={() => {
                            setConfirmAction(() => () => deleteTemplate(template.id))
                            setShowConfirmDialog(true)
                          }}
                          className="px-4 py-2 bg-red-900/50 hover:bg-red-900/70 border border-red-800/50 text-white rounded-lg transition-colors font-medium"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-800/50 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Generation History</h3>
                <input
                  type="text"
                  value={historyFilter}
                  onChange={(e) => setHistoryFilter(e.target.value)}
                  placeholder="Search history..."
                  className="px-4 py-2 bg-black/60 border border-purple-800/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {history.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-6xl mb-4">📜</div>
                  <p className="text-xl">No history yet</p>
                  <p className="text-sm mt-2">Your vouch generations will appear here!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history
                    .filter((item: any) => {
                      if (!historyFilter) return true
                      const search = historyFilter.toLowerCase()
                      return (
                        item.timestamp?.toLowerCase().includes(search) ||
                        item.sent?.toString().includes(search) ||
                        item.failed?.toString().includes(search)
                      )
                    })
                    .map((item: any, idx: number) => (
                    <div key={idx} className="bg-purple-900/20 border-2 border-purple-800/30 rounded-xl p-6 hover:bg-purple-900/30 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-white font-bold text-lg">
                            {new Date(item.timestamp).toLocaleString()}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {item.channels?.length || 1} channel(s)
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-bold text-xl">{item.sent || 0}</div>
                          <div className="text-gray-400 text-xs">sent</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-black/30 rounded-lg">
                          <div className="text-white font-bold">{item.total || 0}</div>
                          <div className="text-gray-400 text-xs">Total</div>
                        </div>
                        <div className="text-center p-3 bg-green-900/20 rounded-lg">
                          <div className="text-green-400 font-bold">{item.sent || 0}</div>
                          <div className="text-gray-400 text-xs">Sent</div>
                        </div>
                        <div className="text-center p-3 bg-red-900/20 rounded-lg">
                          <div className="text-red-400 font-bold">{item.failed || 0}</div>
                          <div className="text-gray-400 text-xs">Failed</div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            const blob = new Blob([JSON.stringify(item, null, 2)], { type: 'application/json' })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `vouch-${Date.parse(item.timestamp)}.json`
                            a.click()
                            URL.revokeObjectURL(url)
                            showToast('History exported!', 'success')
                          }}
                          className="flex-1 px-4 py-2 bg-purple-700/50 hover:bg-purple-700/70 border border-purple-600/50 text-white rounded-lg transition-colors font-medium"
                        >
                          📥 Export
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Theme Picker */}
      <ThemePicker />

      {/* Save Template Dialog */}
      {showTemplateDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowTemplateDialog(false)}>
          <div className="bg-black/90 border-2 border-purple-500/50 rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Save Template</h3>
              <button
                onClick={() => setShowTemplateDialog(false)}
                className="text-gray-400 hover:text-white text-3xl"
              >
                ×
              </button>
            </div>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Template name (e.g., Nitro Shop)"
              className="w-full px-5 py-4 bg-black/60 border-2 border-purple-800/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-6"
              onKeyPress={(e) => e.key === 'Enter' && saveTemplate()}
              autoFocus
            />
            <div className="flex gap-4">
              <button
                onClick={() => setShowTemplateDialog(false)}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={saveTemplate}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-colors font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(107, 33, 168, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }
      `}</style>

      {/* Exchange Amount Dialog */}
      {showAmountDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black rounded-2xl p-8 border-2 border-purple-500/50 shadow-2xl max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-4">Enter Exchange Amount</h3>
            <input
              type="number"
              value={exchangeAmount}
              onChange={(e) => setExchangeAmount(e.target.value)}
              placeholder="Amount (e.g., 100)"
              className="w-full px-6 py-4 bg-black/60 border-2 border-purple-800/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-base mb-6"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter' && exchangeAmount) {
                  createExchangeFromAmount(parseFloat(exchangeAmount))
                }
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (exchangeAmount) {
                    createExchangeFromAmount(parseFloat(exchangeAmount))
                  } else {
                    showToast('Please enter an amount', 'error')
                  }
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all font-semibold"
              >
                Generate
              </button>
              <button
                onClick={() => {
                  setShowAmountDialog(false)
                  setExchangeAmount('')
                }}
                className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600/50 text-white rounded-xl transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </main>
  )
}

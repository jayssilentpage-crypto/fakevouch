'use client'

import { useState, useEffect } from 'react'

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
}

export default function ThemePicker() {
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState<ThemeColors>({
    primary: '#9333ea', // purple-600
    secondary: '#ec4899', // pink-500
    accent: '#10b981', // green-500
  })

  useEffect(() => {
    const saved = localStorage.getItem('customTheme')
    if (saved) {
      const parsed = JSON.parse(saved)
      setTheme(parsed)
      applyTheme(parsed)
    }
  }, [])

  const applyTheme = (colors: ThemeColors) => {
    // Apply CSS variables
    const root = document.documentElement
    root.style.setProperty('--theme-primary', colors.primary)
    root.style.setProperty('--theme-secondary', colors.secondary)
    root.style.setProperty('--theme-accent', colors.accent)
    
    // Create style tag to override Tailwind colors
    let styleTag = document.getElementById('theme-override')
    if (!styleTag) {
      styleTag = document.createElement('style')
      styleTag.id = 'theme-override'
      document.head.appendChild(styleTag)
    }
    
    // Override gradients and colors dynamically with more specific selectors
    styleTag.textContent = `
      /* Override gradient buttons */
      button[class*="bg-gradient-to-r"],
      a[class*="bg-gradient-to-r"],
      .bg-gradient-to-r.from-purple-600,
      .bg-gradient-to-r.to-pink-600,
      .bg-gradient-to-r.via-purple-600,
      .bg-gradient-to-r.via-pink-600 {
        background-image: linear-gradient(to right, ${colors.primary}, ${colors.secondary}) !important;
      }
      
      /* Override purple backgrounds */
      .bg-purple-600,
      .bg-purple-700\\/50,
      button[class*="purple-600"]:not([class*="purple-800"]):not([class*="purple-900"]) {
        background-color: ${colors.primary} !important;
      }
      
      /* Override pink backgrounds */
      .bg-pink-600 {
        background-color: ${colors.secondary} !important;
      }
      
      /* Override text colors */
      .text-purple-400,
      .bg-clip-text {
        color: ${colors.secondary} !important;
      }
      
      /* Override borders */
      .border-purple-500,
      .border-purple-500\\/50,
      .ring-purple-500 {
        border-color: ${colors.primary} !important;
        --tw-ring-color: ${colors.primary} !important;
      }
    `
    
    // Force re-render
    const event = new CustomEvent('themeChange', { detail: colors })
    window.dispatchEvent(event)
  }

  const handleColorChange = (color: keyof ThemeColors, value: string) => {
    const newTheme = { ...theme, [color]: value }
    setTheme(newTheme)
    applyTheme(newTheme)
    localStorage.setItem('customTheme', JSON.stringify(newTheme))
  }

  const presets = [
    { name: 'Purple', primary: '#9333ea', secondary: '#ec4899', accent: '#10b981' },
    { name: 'Blue', primary: '#3b82f6', secondary: '#06b6d4', accent: '#10b981' },
    { name: 'Red', primary: '#ef4444', secondary: '#f97316', accent: '#10b981' },
    { name: 'Green', primary: '#10b981', secondary: '#06b6d4', accent: '#9333ea' },
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-110 transform"
        title="Customize Theme"
      >
        <span className="text-2xl">🎨</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 bg-black rounded-2xl p-8 border-2 border-purple-500/50 shadow-2xl w-80">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Theme Customization</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-white text-sm mb-3 font-medium">Primary Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={theme.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-14 h-14 rounded-lg cursor-pointer border-2 border-purple-500/50"
                  style={{ pointerEvents: 'auto' }}
                />
                <input
                  type="text"
                  value={theme.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="flex-1 px-4 py-3 bg-black/60 border border-purple-800/50 rounded-lg text-white text-sm"
                  placeholder="#9333ea"
                  style={{ pointerEvents: 'auto' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm mb-3 font-medium">Secondary Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={theme.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-14 h-14 rounded-lg cursor-pointer border-2 border-purple-500/50"
                  style={{ pointerEvents: 'auto' }}
                />
                <input
                  type="text"
                  value={theme.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="flex-1 px-4 py-3 bg-black/60 border border-purple-800/50 rounded-lg text-white text-sm"
                  placeholder="#ec4899"
                  style={{ pointerEvents: 'auto' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm mb-3 font-medium">Accent Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={theme.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="w-14 h-14 rounded-lg cursor-pointer border-2 border-purple-500/50"
                  style={{ pointerEvents: 'auto' }}
                />
                <input
                  type="text"
                  value={theme.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="flex-1 px-4 py-3 bg-black/60 border border-purple-800/50 rounded-lg text-white text-sm"
                  placeholder="#10b981"
                  style={{ pointerEvents: 'auto' }}
                />
              </div>
            </div>

            <div className="border-t border-purple-800/50 pt-6">
              <label className="block text-white text-sm mb-4 font-medium">Presets</label>
              <div className="grid grid-cols-2 gap-3">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      const newTheme = {
                        primary: preset.primary,
                        secondary: preset.secondary,
                        accent: preset.accent,
                      }
                      setTheme(newTheme)
                      applyTheme(newTheme)
                      localStorage.setItem('customTheme', JSON.stringify(newTheme))
                    }}
                    className="px-4 py-3 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-800/50 rounded-lg text-white text-sm transition-colors font-medium"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                const defaultTheme = presets[0]
                setTheme(defaultTheme)
                applyTheme(defaultTheme)
                localStorage.removeItem('customTheme')
                window.location.reload() // Reload to fully reset theme
              }}
              className="w-full px-4 py-3 bg-red-900/50 hover:bg-red-900/70 border border-red-800/50 rounded-lg text-white text-sm transition-colors font-medium"
            >
              Reset to Default
            </button>
          </div>
        </div>
      )}
    </>
  )
}


'use client'

import { useState, useEffect } from 'react'

interface EmbedColorPickerProps {
  onColorChange: (color: number) => void
  initialColor?: number
}

export default function EmbedColorPicker({ onColorChange, initialColor = 0xB19CD9 }: EmbedColorPickerProps) {
  const [color, setColor] = useState(initialColor)
  const [isOpen, setIsOpen] = useState(false)

  // Sync with prop changes
  useEffect(() => {
    setColor(initialColor)
  }, [initialColor])

  const presetColors = [
    { name: 'Purple', value: 0xB19CD9 },
    { name: 'Blue', value: 0x5865F2 },
    { name: 'Green', value: 0x57F287 },
    { name: 'Yellow', value: 0xFEE75C },
    { name: 'Red', value: 0xED4245 },
    { name: 'Orange', value: 0xFF6B35 },
  ]

  const handleColorChange = (newColor: number) => {
    setColor(newColor)
    onColorChange(newColor)
  }

  const hexToDecimal = (hex: string) => {
    return parseInt(hex.replace('#', ''), 16)
  }

  const decimalToHex = (decimal: number) => {
    return `#${decimal.toString(16).padStart(6, '0').toUpperCase()}`
  }

  return (
    <div className="relative" style={{ zIndex: 100 }}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="px-4 py-2 bg-purple-700/50 hover:bg-purple-700/70 border border-purple-600/50 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
        style={{ pointerEvents: 'auto' }}
      >
        <div
          className="w-4 h-4 rounded border border-white/30"
          style={{ backgroundColor: decimalToHex(color) }}
        />
        Embed Color
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 bg-black rounded-xl p-4 border-2 border-purple-500/50 shadow-2xl z-[100] w-64" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-semibold">Choose Color</h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {presetColors.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  handleColorChange(preset.value)
                  setIsOpen(false)
                }}
                className="p-3 rounded-lg border-2 border-purple-500/30 hover:border-purple-500/70 transition-colors"
                style={{ backgroundColor: `#${preset.value.toString(16).padStart(6, '0')}` }}
                title={preset.name}
              />
            ))}
          </div>

          <div>
            <label className="block text-white text-sm mb-2">Custom Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={decimalToHex(color)}
                onChange={(e) => handleColorChange(hexToDecimal(e.target.value))}
                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-purple-500/50"
              />
              <input
                type="text"
                value={decimalToHex(color)}
                onChange={(e) => {
                  try {
                    handleColorChange(hexToDecimal(e.target.value))
                  } catch {}
                }}
                className="flex-1 px-3 py-2 bg-black/60 border border-purple-800/50 rounded-lg text-white text-sm"
                placeholder="#B19CD9"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


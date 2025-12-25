'use client'

import { useState } from 'react'
import { useDitherSettings } from '@/lib/DitherSettingsContext'

export default function DitherSettingsPanel() {
  const { settings, updateSettings } = useDitherSettings()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Settings Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-64 bg-paper border border-border p-4 font-mono text-xs space-y-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-ink font-bold">Game Boy Dither Settings</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-ink-lighter hover:text-ink"
            >
              ×
            </button>
          </div>

          <div className="text-[10px] text-ink-lighter mb-3">
            Using Game Boy DMG-01 4-color palette with Floyd-Steinberg dithering. Settings are preserved for future use.
          </div>

          {/* Threshold - Reserved for future use */}
          <div>
            <label className="block text-ink-light mb-1">
              Threshold: {settings.threshold}
            </label>
            <input
              type="range"
              min="0"
              max="255"
              value={settings.threshold}
              onChange={(e) => updateSettings({ threshold: parseInt(e.target.value) })}
              className="w-full"
              disabled
            />
            <div className="text-[10px] text-ink-lighter mt-1">
              Reserved for future use
            </div>
          </div>

          {/* White Value - Reserved for future use */}
          <div>
            <label className="block text-ink-light mb-1">
              White Value: {settings.whiteValue}
            </label>
            <input
              type="range"
              min="0"
              max="255"
              value={settings.whiteValue}
              onChange={(e) => updateSettings({ whiteValue: parseInt(e.target.value) })}
              className="w-full"
              disabled
            />
            <div className="text-[10px] text-ink-lighter mt-1">
              Reserved for future use
            </div>
          </div>

          {/* Black Value - Reserved for future use */}
          <div>
            <label className="block text-ink-light mb-1">
              Black Value: {settings.blackValue}
            </label>
            <input
              type="range"
              min="0"
              max="255"
              value={settings.blackValue}
              onChange={(e) => updateSettings({ blackValue: parseInt(e.target.value) })}
              className="w-full"
              disabled
            />
            <div className="text-[10px] text-ink-lighter mt-1">
              Reserved for future use
            </div>
          </div>
        </div>
      )}
    </>
  )
}


'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface DitherSettings {
  threshold: number // 0-255, grayscale threshold
  whiteValue: number // 0-255, value for white pixels
  blackValue: number // 0-255, value for black pixels
}

const defaultSettings: DitherSettings = {
  threshold: 128,
  whiteValue: 255,
  blackValue: 0,
}

const DitherSettingsContext = createContext<{
  settings: DitherSettings
  updateSettings: (settings: Partial<DitherSettings>) => void
}>({
  settings: defaultSettings,
  updateSettings: () => {},
})

export function DitherSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<DitherSettings>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ditherSettings')
      if (stored) {
        try {
          return { ...defaultSettings, ...JSON.parse(stored) }
        } catch {
          return defaultSettings
        }
      }
    }
    return defaultSettings
  })

  const updateSettings = (newSettings: Partial<DitherSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings }
      if (typeof window !== 'undefined') {
        localStorage.setItem('ditherSettings', JSON.stringify(updated))
      }
      return updated
    })
  }

  return (
    <DitherSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </DitherSettingsContext.Provider>
  )
}

export function useDitherSettings() {
  return useContext(DitherSettingsContext)
}


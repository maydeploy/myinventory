import { useEffect, useState } from 'react'
import { useDitherSettings } from './DitherSettingsContext'

// ASCII character sets from dark to light
const ASCII_CHARS = {
  standard: '@%#*+=-:. ',
  detailed: '@%#*+=-:.· ',
  blocks: '█▓▒░ ',
  minimal: '@. ',
}

export function useAsciiArt(imageSrc: string | undefined, enabled: boolean): string | undefined {
  const [asciiImage, setAsciiImage] = useState<string | undefined>(undefined)
  const { settings } = useDitherSettings()

  useEffect(() => {
    if (!enabled || !imageSrc) {
      setAsciiImage(undefined)
      return
    }

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = imageSrc

    img.onload = () => {
      // Calculate dimensions - ASCII art works best with reduced resolution
      const maxWidth = 80 // Characters wide
      const aspectRatio = img.height / img.width
      const maxHeight = Math.floor(maxWidth * aspectRatio)
      
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Draw image scaled down for ASCII conversion
      canvas.width = maxWidth
      canvas.height = maxHeight
      ctx.drawImage(img, 0, 0, maxWidth, maxHeight)

      const imageData = ctx.getImageData(0, 0, maxWidth, maxHeight)
      const data = imageData.data

      // Get character set (using threshold as character set index)
      const charSetIndex = Math.floor((settings.threshold / 255) * 3) // 0-3
      const charSets = Object.values(ASCII_CHARS)
      const chars = charSets[charSetIndex] || charSets[0]

      // Build ASCII art string
      let ascii = ''
      for (let y = 0; y < maxHeight; y++) {
        for (let x = 0; x < maxWidth; x++) {
          const i = (y * maxWidth + x) * 4
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          
          // Convert to grayscale
          const grayscale = r * 0.3 + g * 0.59 + b * 0.11
          
          // Map to ASCII character
          // Invert so darker = denser characters
          const normalized = 1 - (grayscale / 255)
          const charIndex = Math.floor(normalized * (chars.length - 1))
          ascii += chars[charIndex] || ' '
        }
        ascii += '\n'
      }

      // Create a data URL from the ASCII text
      // We'll render it as an image using a canvas with monospace font
      const outputCanvas = document.createElement('canvas')
      const outputCtx = outputCanvas.getContext('2d')
      if (!outputCtx) return

      // Set canvas size based on character count
      const fontSize = Math.max(2, Math.floor(settings.whiteValue / 10)) // Use whiteValue as font size hint
      const lineHeight = fontSize * 1.2
      outputCanvas.width = maxWidth * fontSize * 0.6 // Monospace char width
      outputCanvas.height = maxHeight * lineHeight

      outputCtx.fillStyle = `rgb(${settings.whiteValue}, ${settings.whiteValue}, ${settings.whiteValue})`
      outputCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height)

      outputCtx.fillStyle = `rgb(${settings.blackValue}, ${settings.blackValue}, ${settings.blackValue})`
      outputCtx.font = `${fontSize}px monospace`
      outputCtx.textAlign = 'left'
      outputCtx.textBaseline = 'top'

      // Draw ASCII characters
      const lines = ascii.split('\n')
      lines.forEach((line, y) => {
        outputCtx.fillText(line, 0, y * lineHeight)
      })

      setAsciiImage(outputCanvas.toDataURL())
    }

    img.onerror = () => {
      setAsciiImage(undefined)
    }
  }, [imageSrc, enabled, settings.threshold, settings.whiteValue, settings.blackValue])

  return asciiImage
}


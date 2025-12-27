import { useEffect, useState } from 'react'
import { useDitherSettings } from './DitherSettingsContext'

// Game Boy DMG-01 4-color palette (from lightest to darkest)
const GAMEBOY_PALETTE = [
  [155, 188, 15],  // Light green (lightest)
  [139, 172, 15],  // Light gray-green
  [48, 98, 48],    // Dark gray-green
  [15, 56, 15],    // Dark green (darkest/black)
]

export function useGameBoyDither(imageSrc: string | undefined, enabled: boolean): string | undefined {
  const [ditheredImage, setDitheredImage] = useState<string | undefined>(undefined)
  const { settings } = useDitherSettings()

  useEffect(() => {
    if (!enabled || !imageSrc) {
      setDitheredImage(undefined)
      return
    }

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = imageSrc

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Use original image dimensions for 1:1 pixel ratio
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Floyd-Steinberg dithering algorithm for Game Boy palette
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4
          
          // Get current pixel RGB
          let r = data[i]
          let g = data[i + 1]
          let b = data[i + 2]

          // Convert to grayscale
          const grayscale = r * 0.3 + g * 0.59 + b * 0.11

          // Find closest Game Boy color based on brightness
          // Map grayscale (0-255) to 4-color palette
          let paletteIndex: number
          if (grayscale > 191) {
            paletteIndex = 0 // Lightest
          } else if (grayscale > 127) {
            paletteIndex = 1 // Light
          } else if (grayscale > 63) {
            paletteIndex = 2 // Dark
          } else {
            paletteIndex = 3 // Darkest
          }

          const [newR, newG, newB] = GAMEBOY_PALETTE[paletteIndex]

          // Calculate error
          const errorR = r - newR
          const errorG = g - newG
          const errorB = b - newB

          // Set current pixel to Game Boy color
          data[i] = newR
          data[i + 1] = newG
          data[i + 2] = newB

          // Distribute error to neighboring pixels (Floyd-Steinberg)
          if (x < canvas.width - 1) {
            // Right pixel
            const rightI = i + 4
            data[rightI] = Math.max(0, Math.min(255, data[rightI] + errorR * 7 / 16))
            data[rightI + 1] = Math.max(0, Math.min(255, data[rightI + 1] + errorG * 7 / 16))
            data[rightI + 2] = Math.max(0, Math.min(255, data[rightI + 2] + errorB * 7 / 16))
          }

          if (y < canvas.height - 1) {
            // Bottom pixel
            const bottomI = i + canvas.width * 4
            data[bottomI] = Math.max(0, Math.min(255, data[bottomI] + errorR * 5 / 16))
            data[bottomI + 1] = Math.max(0, Math.min(255, data[bottomI + 1] + errorG * 5 / 16))
            data[bottomI + 2] = Math.max(0, Math.min(255, data[bottomI + 2] + errorB * 5 / 16))

            if (x > 0) {
              // Bottom-left pixel
              const bottomLeftI = bottomI - 4
              data[bottomLeftI] = Math.max(0, Math.min(255, data[bottomLeftI] + errorR * 3 / 16))
              data[bottomLeftI + 1] = Math.max(0, Math.min(255, data[bottomLeftI + 1] + errorG * 3 / 16))
              data[bottomLeftI + 2] = Math.max(0, Math.min(255, data[bottomLeftI + 2] + errorB * 3 / 16))
            }

            if (x < canvas.width - 1) {
              // Bottom-right pixel
              const bottomRightI = bottomI + 4
              data[bottomRightI] = Math.max(0, Math.min(255, data[bottomRightI] + errorR * 1 / 16))
              data[bottomRightI + 1] = Math.max(0, Math.min(255, data[bottomRightI + 1] + errorG * 1 / 16))
              data[bottomRightI + 2] = Math.max(0, Math.min(255, data[bottomRightI + 2] + errorB * 1 / 16))
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0)
      setDitheredImage(canvas.toDataURL())
    }

    img.onerror = () => {
      setDitheredImage(undefined)
    }
  }, [imageSrc, enabled])

  return ditheredImage
}



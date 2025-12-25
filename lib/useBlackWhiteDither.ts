import { useEffect, useState } from 'react'
import { useDitherSettings } from './DitherSettingsContext'

export function useBlackWhiteDither(imageSrc: string | undefined, enabled: boolean): string | undefined {
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

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Black and white dither effect - using settings from context
      for (let i = 0; i < data.length; i += 4) {
        // Convert to grayscale
        const grayscale = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11

        // Simple threshold dither - use settings values
        if (grayscale > settings.threshold) {
          // White value from settings
          data[i] = settings.whiteValue
          data[i + 1] = settings.whiteValue
          data[i + 2] = settings.whiteValue
        } else {
          // Black value from settings
          data[i] = settings.blackValue
          data[i + 1] = settings.blackValue
          data[i + 2] = settings.blackValue
        }
      }

      ctx.putImageData(imageData, 0, 0)
      setDitheredImage(canvas.toDataURL())
    }

    img.onerror = () => {
      setDitheredImage(undefined)
    }
  }, [imageSrc, enabled, settings.threshold, settings.whiteValue, settings.blackValue])

  return ditheredImage
}


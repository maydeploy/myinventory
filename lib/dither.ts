export type DitherOptions = {
  contrast: number
  bias: number
  saturation: number
}

const thresholdMatrix = [
  [0, 128, 32, 160],
  [192, 64, 224, 96],
  [48, 176, 16, 144],
  [240, 112, 208, 80],
]

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export async function ditherImageToDataUrl(
  src: string,
  opts: DitherOptions,
): Promise<string> {
  return await new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = src

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas not supported'))
        return
      }

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      const contrast = clamp(opts.contrast, 0.2, 4)
      const bias = clamp(opts.bias, -200, 200)
      const saturation = clamp(opts.saturation, 0, 3)

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // Base luminance (sRGB-ish)
          const lum = r * 0.3 + g * 0.59 + b * 0.11

          // Apply saturation around luminance before we compute the dither threshold.
          // sat=0 -> grayscale, sat=1 -> original, sat>1 -> boosted color.
          const sr = clamp(lum + (r - lum) * saturation, 0, 255)
          const sg = clamp(lum + (g - lum) * saturation, 0, 255)
          const sb = clamp(lum + (b - lum) * saturation, 0, 255)

          const grayscale = sr * 0.3 + sg * 0.59 + sb * 0.11

          // Contrast/bias around midpoint 128
          const adjusted = clamp((grayscale - 128) * contrast + 128 + bias, 0, 255)
          const thresholdValue = thresholdMatrix[y % 4][x % 4]

          if (adjusted > thresholdValue) {
            // Make light pixels transparent
            data[i] = 245
            data[i + 1] = 245
            data[i + 2] = 240
            data[i + 3] = 0
          } else {
            // Keep dark pixels
            data[i] = 43
            data[i + 1] = 43
            data[i + 2] = 43
            data[i + 3] = 255
          }
        }
      }

      ctx.putImageData(imageData, 0, 0)
      resolve(canvas.toDataURL())
    }

    img.onerror = () => reject(new Error('Failed to load image for dithering'))
  })
}



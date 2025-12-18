import 'server-only'
import localFont from 'next/font/local'

export const otBulbMonoline = localFont({
  src: [
    { path: '../public/fonts/OTBulbMonoline-100.otf', weight: '100', style: 'normal' },
    { path: '../public/fonts/OTBulbMonoline-200.otf', weight: '200', style: 'normal' },
    { path: '../public/fonts/OTBulbMonoline-500.otf', weight: '500', style: 'normal' },
    { path: '../public/fonts/OTBulbMonoline-700.otf', weight: '700', style: 'normal' },
    { path: '../public/fonts/OTBulbMonoline-900.otf', weight: '900', style: 'normal' },
  ],
  variable: '--font-ot-bulb-monoline',
  display: 'swap',
})

export const ppMondwest = localFont({
  src: [
    { path: '../public/fonts/PPMondwest-Regular.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/PPMondwest-Bold.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-pp-mondwest',
  display: 'swap',
})

export const ppNeueBit = localFont({
  src: [
    { path: '../public/fonts/PPNeueBit-Regular.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/PPNeueBit-Bold.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-pp-neue-bit',
  display: 'swap',
})



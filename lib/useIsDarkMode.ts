import { useEffect, useState } from 'react'

export function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const el = document.documentElement

    const update = () => setIsDark(el.classList.contains('dark'))
    update()

    const observer = new MutationObserver(update)
    observer.observe(el, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  return isDark
}



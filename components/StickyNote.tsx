'use client'

interface StickyNoteProps {
  note: string
  date: string
  className?: string
}

function calculateDaysSince(dateString: string): number {
  // Get current date/time in NYC timezone
  const nowInNYC = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))

  // Parse the date from database and convert to NYC timezone
  const dateInNYC = new Date(new Date(dateString).toLocaleString('en-US', { timeZone: 'America/New_York' }))

  // Reset both to midnight for accurate day calculation
  const todayMidnight = new Date(nowInNYC.getFullYear(), nowInNYC.getMonth(), nowInNYC.getDate())
  const dateMidnight = new Date(dateInNYC.getFullYear(), dateInNYC.getMonth(), dateInNYC.getDate())

  // Calculate difference in milliseconds and convert to days
  const diffTime = todayMidnight.getTime() - dateMidnight.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays)
}

export default function StickyNote({ note, date, className = '' }: StickyNoteProps) {
  const daysSince = calculateDaysSince(date)
  const enjoymentMessage = daysSince === 0
    ? 'just got this today!'
    : daysSince === 1
    ? 'enjoyed for 1 day'
    : `enjoyed for ${daysSince} days`

  return (
    <div
      className={`sticky-note bg-[#fef68a] dark:bg-[#854d0e] p-4 shadow-lg relative ${className}`}
      style={{
        transform: 'rotate(-1deg)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}
    >
      <div className="space-y-2.5">
        {/* Note text */}
        <p className="text-[13px] text-[#422006] dark:text-[#fef3c7] leading-relaxed whitespace-pre-wrap break-words">
          {note}
        </p>

        {/* Date message */}
        <p className="text-[11px] text-[#713f12] dark:text-[#fde68a] italic border-t border-[#422006]/10 dark:border-[#fde68a]/20 pt-2">
          {enjoymentMessage}
        </p>
      </div>
    </div>
  )
}

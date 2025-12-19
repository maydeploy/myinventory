'use client'

interface ReceiptNoteProps {
  note: string
  date: string
  className?: string
}

export default function ReceiptNote({ note, date, className = '' }: ReceiptNoteProps) {
  return (
    <div className={`receipt-note ${className}`}>
      {/* Top dashed border */}
      <div className="border-t border-dashed border-[#ccc] dark:border-[#444] mb-2"></div>
      
      <div className="space-y-1 text-xs leading-tight">
        <div className="text-[10px] text-[#333] dark:text-[#e0e0e0] font-mono line-clamp-6 whitespace-pre-wrap">
          {note}
        </div>
        
        <div className="border-t border-dashed border-[#ccc] dark:border-[#444] pt-1 mt-1">
          <div className="text-[9px] text-[#666] dark:text-[#999] font-mono">
            {date}
          </div>
        </div>
      </div>
      
      {/* Bottom dashed border */}
      <div className="border-t border-dashed border-[#ccc] dark:border-[#444] mt-2"></div>
    </div>
  )
}


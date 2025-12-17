export default function DotGrid() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(232, 232, 232, 0.15) 2px, transparent 2px)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0',
      }}
    />
  )
}

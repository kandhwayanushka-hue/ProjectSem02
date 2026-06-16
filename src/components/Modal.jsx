export default function Modal({ open, onClose, title, children }) {
  if (!open) return null

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'white', borderRadius: 12, padding: 30,
        minWidth: 400, maxWidth: 500, width: '90%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        animation: 'scaleIn 0.2s ease'
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 20
        }}>
          <h3 style={{ color: '#1a365d', margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: 24,
            cursor: 'pointer', color: '#888', padding: '0 4px'
          }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

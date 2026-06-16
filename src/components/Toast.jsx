import { useNotification } from '../context/NotificationContext'

export default function Toast() {
  const { toasts, removeToast } = useNotification()

  if (toasts.length === 0) return null

  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 10
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === 'success' ? '#2f855a' : t.type === 'error' ? '#e53e3e' : '#1a365d',
          color: 'white', padding: '14px 20px', borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', gap: 12,
          minWidth: 280, animation: 'slideIn 0.3s ease'
        }}>
          <span style={{ fontSize: 20 }}>
            {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
          </span>
          <span style={{ flex: 1, fontSize: 14 }}>{t.message}</span>
          <button onClick={() => removeToast(t.id)} style={{
            background: 'none', border: 'none', color: 'white',
            cursor: 'pointer', fontSize: 18, padding: 0
          }}>×</button>
        </div>
      ))}
    </div>
  )
}

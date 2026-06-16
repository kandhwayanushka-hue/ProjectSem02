import { useEffect, useRef } from 'react'

export default function BarcodeScanner({ onScan, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    let mounted = true
    const init = async () => {
      const { Html5Qrcode } = await import('html5-qrcode')
      if (!mounted || !ref.current) return
      const scanner = new Html5Qrcode('barcode-scanner')
      try {
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 150 } },
          (text) => {
            scanner.stop().catch(() => {})
            if (mounted) onScan(text)
          },
          () => {}
        )
        if (mounted) ref.current = scanner
      } catch {
        onScan(null)
      }
    }
    init()
    return () => {
      mounted = false
      if (ref.current) {
        ref.current.stop().catch(() => {})
      }
    }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 20, width: '90%', maxWidth: 500, textAlign: 'center' }}>
        <h3 style={{ color: '#1a365d', margin: '0 0 16px' }}>Scan Barcode / QR</h3>
        <div id="barcode-scanner" style={{ width: '100%', aspectRatio: '4/3', background: '#000', borderRadius: 8, overflow: 'hidden' }}></div>
        <p style={{ fontSize: 13, color: '#888', margin: '12px 0 0' }}>Point your camera at a barcode or QR code</p>
        <button onClick={onClose} className="learn-btn" style={{ marginTop: 16, padding: '10px 24px', fontSize: 14, background: '#e53e3e' }}>Cancel</button>
      </div>
    </div>
  )
}

export default function Logo({
  size = 44,
  wordmark = true,
  variant = 'dark',
  subtitle = 'CORE MOVIL',
}) {
  const textColor = variant === 'light' ? '#ffffff' : '#CE1126'
  const subColor = variant === 'light' ? 'rgba(255,255,255,.85)' : '#6b6b7b'
  const nameSize = Math.round(size * 0.5)
  const subSize = Math.max(9, Math.round(size * 0.23))

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <img
        src="/logo.png"
        alt="Caja Trujillo"
        style={{ width: size, height: size, objectFit: 'contain' }}
      />

      {wordmark && (
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.04 }}>
          <span style={{ fontWeight: 800, fontSize: nameSize, color: textColor, letterSpacing: '-0.5px' }}>
            Caja Trujillo
          </span>
          {subtitle && (
            <span style={{ fontSize: subSize, fontWeight: 700, color: subColor, letterSpacing: '1.2px' }}>
              {subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  )
}

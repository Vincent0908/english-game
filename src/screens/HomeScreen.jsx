import { useState, useMemo } from 'react'

// Generate bintang sekali saja pakai useMemo
function useStars(count) {
  return useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    left:  `${(i * 37.3 + 11) % 100}%`,
    top:   `${(i * 53.7 + 7)  % 100}%`,
    size:  (i % 3) + 1,
    delay: `${(i * 0.3) % 3}s`,
    duration: `${2 + (i % 3)}s`,
  })), [count])
}

function HomeScreen({ navigate, playerData, updatePlayer }) {
  const [nameInput, setNameInput] = useState('')
  const [error,     setError]     = useState('')
  const stars = useStars(40)

  const handleStart = () => {
    if (nameInput.trim().length < 2) {
      setError('Please enter your name (min. 2 characters)!')
      return
    }
    updatePlayer({ name: nameInput.trim() })
    navigate('select')
  }

  return (
    <div style={styles.container}>
      {/* Bintang statis */}
      <div style={styles.starsLayer} aria-hidden="true">
        {stars.map(s => (
          <div key={s.id} style={{
            position: 'absolute',
            left: s.left, top: s.top,
            width:  `${s.size}px`,
            height: `${s.size}px`,
            background: '#fff',
            borderRadius: '50%',
            opacity: 0.5,
            animation: `twinkle ${s.duration} ${s.delay} ease-in-out infinite alternate`,
          }} />
        ))}
      </div>

      {/* Lingkaran cahaya belakang */}
      <div style={styles.glowOrb1} aria-hidden="true" />
      <div style={styles.glowOrb2} aria-hidden="true" />

      <div style={styles.content}>
        {/* Logo */}
        <div style={{ ...styles.logoArea, animation: 'fadeInUp 0.6s ease forwards' }}>
          <div style={{ fontSize: '72px', animation: 'float 3s ease-in-out infinite' }}>
            📚
          </div>
          <h1 style={styles.title}>ENGLISH</h1>
          <h1 style={styles.titleAccent}>QUEST</h1>
          <p style={styles.subtitle}>⚔️ Master English. Complete the Quest. ⚔️</p>
        </div>

        {/* Form */}
        <div style={{ ...styles.card, animation: 'fadeInUp 0.6s 0.15s ease both' }}>
          <p style={styles.cardLabel}>Enter Your Name, Adventurer!</p>
          <input
            style={styles.input}
            type="text"
            placeholder="Your name..."
            value={nameInput}
            onChange={(e) => { setNameInput(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            autoFocus
          />
          {error && <p style={styles.error}>⚠️ {error}</p>}
          <button
            className="btn-start"
            style={styles.btnStart}
            onClick={handleStart}
          >
            ⚔️ START QUEST
          </button>
        </div>

        {/* Badge info */}
        <div style={{ ...styles.infoRow, animation: 'fadeInUp 0.6s 0.3s ease both' }}>
          {[
            { icon: '🎮', text: '4 Mini Games' },
            { icon: '⭐', text: 'XP System' },
            { icon: '🏆', text: 'Level Up' },
            { icon: '💡', text: 'Hints & Tips' },
          ].map(({ icon, text }) => (
            <div key={text} style={styles.badge}>
              <span>{icon}</span>
              <span style={{ fontSize: '12px', fontWeight: 700 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at 50% 40%, #0f1e3d 0%, #0a0e1a 70%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden',
  },
  starsLayer: { position: 'absolute', inset: 0, pointerEvents: 'none' },
  glowOrb1: {
    position: 'absolute', width: '500px', height: '500px',
    borderRadius: '50%', top: '-100px', left: '-100px',
    background: 'radial-gradient(circle, #ffd70008 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  glowOrb2: {
    position: 'absolute', width: '400px', height: '400px',
    borderRadius: '50%', bottom: '-80px', right: '-80px',
    background: 'radial-gradient(circle, #3b82f608 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  content: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '28px',
    padding: '24px', zIndex: 1,
    width: '100%', maxWidth: '440px',
  },
  logoArea: { textAlign: 'center' },
  title: {
    fontFamily: "'Cinzel Decorative', cursive",
    fontSize: '44px', color: '#ffd700',
    textShadow: '0 0 40px #ffd70060',
    letterSpacing: '6px', lineHeight: 1,
  },
  titleAccent: {
    fontFamily: "'Cinzel Decorative', cursive",
    fontSize: '44px', color: '#ffffff',
    textShadow: '0 0 20px #ffffff30',
    letterSpacing: '6px', lineHeight: 1.2,
  },
  subtitle: { marginTop: '12px', color: '#94a3b8', fontSize: '13px', letterSpacing: '1px' },
  card: {
    background: '#111827',
    border: '1px solid #2d3748',
    borderRadius: '20px', padding: '28px',
    width: '100%', display: 'flex', flexDirection: 'column', gap: '12px',
    boxShadow: '0 0 60px #ffd70010',
  },
  cardLabel: { color: '#e2e8f0', fontWeight: 700, fontSize: '15px', textAlign: 'center' },
  input: {
    background: '#1a2235', border: '1px solid #2d3748',
    borderRadius: '10px', padding: '14px 16px',
    color: '#e2e8f0', fontSize: '16px', outline: 'none',
    fontFamily: "'Nunito', sans-serif",
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  error: { color: '#ff6b6b', fontSize: '13px', textAlign: 'center' },
  btnStart: {
    background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
    border: 'none', borderRadius: '12px',
    padding: '15px', color: '#0a0e1a',
    fontWeight: 800, fontSize: '16px',
    letterSpacing: '1px', transition: 'all 0.2s',
    cursor: 'pointer',
  },
  infoRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' },
  badge: {
    background: '#111827', border: '1px solid #2d3748',
    borderRadius: '50px', padding: '7px 14px',
    display: 'flex', gap: '6px', alignItems: 'center', color: '#e2e8f0',
    fontSize: '12px',
  },
}

export default HomeScreen
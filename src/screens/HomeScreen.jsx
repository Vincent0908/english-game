import { useState, useMemo } from 'react'

function useStars(count) {
  return useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 37.3 + 11) % 100}%`,
    top:  `${(i * 53.7 + 7)  % 100}%`,
    size: (i % 3) + 1,
    delay:    `${(i * 0.3) % 3}s`,
    duration: `${2 + (i % 3)}s`,
  })), [count])
}

function HomeScreen({ navigate, updatePlayer }) {
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
    <div className="min-h-screen bg-quest relative overflow-hidden flex items-center justify-center">
      {/* Bintang */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map(s => (
          <div key={s.id} className="absolute rounded-full animate-twinkle" style={{
            left: s.left, top: s.top,
            width: `${s.size}px`, height: `${s.size}px`,
            background: '#fff', opacity: 0.5,
            animationDuration: s.duration, animationDelay: s.delay,
          }} />
        ))}
      </div>

      {/* Glow orbs */}
      <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, #ffd70008 0%, transparent 70%)' }} />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, #3b82f608 0%, transparent 70%)' }} />

      {/* Konten */}
      <div className="relative z-10 flex flex-col items-center gap-7 px-6 w-full max-w-md">

        {/* Logo */}
        <div className="text-center animate-fadeInUp">
          <div className="text-7xl animate-float">📚</div>
          <h1 className="font-quest text-[44px] text-gold tracking-[5px] leading-none" style={{ textShadow: '0 0 40px #ffd70060' }}>
            ENGLISH
          </h1>
          <h1 className="font-quest text-[44px] text-white tracking-[5px] leading-snug" style={{ textShadow: '0 0 20px #ffffff30' }}>
            QUEST
          </h1>
          <p className="mt-3 text-slate-400 text-sm tracking-wide">⚔️ Master English. Complete the Quest. ⚔️</p>
        </div>

        {/* Form */}
        <div className="bg-panel border border-dim rounded-2xl p-7 w-full flex flex-col gap-3 animate-[fadeInUp_0.6s_0.15s_ease_both]" style={{ boxShadow: '0 0 60px #ffd70010' }}>
          <p className="text-slate-200 font-bold text-center text-sm">Enter Your Name, Adventurer!</p>
          <input
            className="bg-navy border border-dim rounded-xl px-4 py-3 text-slate-200 text-base outline-none focus:border-blue-500 transition-colors"
            type="text"
            placeholder="Your name..."
            value={nameInput}
            onChange={e => { setNameInput(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleStart()}
            autoFocus
          />
          {error && <p className="text-danger text-sm text-center">⚠️ {error}</p>}
          <button
            className="bg-gradient-to-br from-gold to-[#ff8c00] rounded-xl py-4 text-dark font-extrabold text-base tracking-wide hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_8px_24px_#ffd70040] active:scale-[0.97] transition-all"
            onClick={handleStart}
          >
            ⚔️ START QUEST
          </button>
        </div>

        {/* Badge info */}
        <div className="flex gap-2 flex-wrap justify-center animate-[fadeInUp_0.6s_0.3s_ease_both]">
          {[
            { icon: '🎮', text: '4 Mini Games' },
            { icon: '⭐', text: 'XP System' },
            { icon: '🏆', text: 'Level Up' },
            { icon: '💡', text: 'Hints & Tips' },
          ].map(({ icon, text }) => (
            <div key={text} className="bg-panel border border-dim rounded-full px-3 py-1.5 flex gap-1.5 items-center text-slate-200 text-xs font-bold">
              <span>{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomeScreen
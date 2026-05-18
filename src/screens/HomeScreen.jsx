import { useState, useMemo } from 'react'

function useStars(count) {
  return useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 37.3 + 11) % 100}%`,
    top:  `${(i * 53.7 + 7)  % 100}%`,
    size: (i % 4) + 1,
    delay:    `${(i * 0.3) % 4}s`,
    duration: `${2 + (i % 3)}s`,
  })), [count])
}

function useFloatingOrbs(count) {
  return useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 29.7 + 5) % 90}%`,
    top:  `${(i * 41.3 + 15) % 80}%`,
    size: 60 + (i % 4) * 40,
    color: ['#ffd70008', '#3b82f608', '#7c3aed08', '#00e5a008'][i % 4],
    delay: `${i * 0.7}s`,
    duration: `${6 + (i % 5) * 2}s`,
  })), [count])
}

const DIFFICULTIES = [
  { id: 'easy',   label: 'Easy',   emoji: '🌱', desc: 'More time, forgiving', color: '#10b981', mult: '0.8x XP' },
  { id: 'normal', label: 'Normal', emoji: '⚔️', desc: 'Balanced challenge',    color: '#3b82f6', mult: '1.0x XP' },
  { id: 'hard',   label: 'Hard',   emoji: '🔥', desc: 'Less time, more points',color: '#ef4444', mult: '1.5x XP' },
]

function HomeScreen({ navigate, updatePlayer, difficulty, setDifficulty }) {
  const [nameInput, setNameInput] = useState('')
  const [error,     setError]     = useState('')
  const [step,      setStep]      = useState('name') // name | difficulty
  const stars = useStars(60)
  const orbs = useFloatingOrbs(6)

  const handleNameSubmit = () => {
    if (nameInput.trim().length < 2) {
      setError('Please enter your name (min. 2 characters)!')
      return
    }
    updatePlayer({ name: nameInput.trim() })
    setStep('difficulty')
  }

  const handleStart = () => {
    navigate('select')
  }

  return (
    <div className="min-h-screen bg-quest relative overflow-hidden flex items-center justify-center">
      {/* Stars background */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map(s => (
          <div key={s.id} className="absolute rounded-full animate-twinkle" style={{
            left: s.left, top: s.top,
            width: `${s.size}px`, height: `${s.size}px`,
            background: s.id % 5 === 0 ? '#ffd700' : s.id % 3 === 0 ? '#7c3aed' : '#fff',
            opacity: 0.4,
            animationDuration: s.duration, animationDelay: s.delay,
          }} />
        ))}
      </div>

      {/* Floating orbs */}
      {orbs.map(orb => (
        <div key={orb.id} className="absolute rounded-full pointer-events-none animate-float" style={{
          left: orb.left, top: orb.top,
          width: `${orb.size}px`, height: `${orb.size}px`,
          background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          animationDelay: orb.delay, animationDuration: orb.duration,
        }} />
      ))}

      {/* Decorative rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.02] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/[0.03] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-7 px-6 w-full max-w-md">

        {step === 'name' && (
          <>
            {/* Logo */}
            <div className="text-center animate-fadeInUp">
              <div className="text-7xl animate-float mb-2">📚</div>
              <h1 className="font-quest text-[48px] text-gold tracking-[6px] leading-none" style={{ textShadow: '0 0 40px #ffd70060, 0 0 80px #ffd70020' }}>
                ENGLISH
              </h1>
              <h1 className="font-quest text-[48px] text-white tracking-[6px] leading-snug" style={{ textShadow: '0 0 20px #ffffff30' }}>
                QUEST
              </h1>
              <p className="mt-3 text-slate-400 text-sm tracking-wide">⚔️ Master English. Complete the Quest. ⚔️</p>
            </div>

            {/* Form */}
            <div className="glass-card rounded-2xl p-7 w-full flex flex-col gap-4 animate-[fadeInUp_0.6s_0.15s_ease_both]" style={{ boxShadow: '0 0 60px #ffd70010, 0 0 1px #ffd70033' }}>
              <p className="text-slate-200 font-bold text-center text-sm">Enter Your Name, Adventurer!</p>
              <input
                className="bg-navy/80 border border-dim rounded-xl px-4 py-3.5 text-slate-200 text-base outline-none focus:border-gold/50 focus:shadow-[0_0_20px_#ffd70015] transition-all"
                type="text"
                placeholder="Your name..."
                value={nameInput}
                onChange={e => { setNameInput(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleNameSubmit()}
                autoFocus
              />
              {error && <p className="text-danger text-sm text-center bounce-in">⚠️ {error}</p>}
              <button
                className="bg-gradient-to-br from-gold via-amber-500 to-[#ff8c00] rounded-xl py-4 text-dark font-extrabold text-base tracking-wide hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_8px_30px_#ffd70050] active:scale-[0.97] transition-all pulse-glow"
                onClick={handleNameSubmit}
              >
                ⚔️ CONTINUE
              </button>
            </div>

            {/* Badge info */}
            <div className="flex gap-2 flex-wrap justify-center animate-[fadeInUp_0.6s_0.3s_ease_both]">
              {[
                { icon: '🎮', text: '4 Quest Types' },
                { icon: '⭐', text: 'XP & Levels' },
                { icon: '🔥', text: 'Streak Bonuses' },
                { icon: '💎', text: '3 Difficulties' },
              ].map(({ icon, text }) => (
                <div key={text} className="glass-card-light rounded-full px-3 py-1.5 flex gap-1.5 items-center text-slate-300 text-xs font-bold">
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 'difficulty' && (
          <>
            <div className="text-center animate-fadeInUp">
              <p className="text-slate-400 text-sm mb-1">Welcome, <span className="text-gold font-bold">{nameInput.trim()}</span>!</p>
              <h2 className="font-quest text-gold text-2xl tracking-[4px]" style={{ textShadow: '0 0 30px #ffd70040' }}>
                CHOOSE DIFFICULTY
              </h2>
              <p className="text-slate-500 text-xs mt-2">This affects timer speed & XP multiplier</p>
            </div>

            <div className="w-full flex flex-col gap-3 animate-[fadeInUp_0.5s_0.1s_ease_both]">
              {DIFFICULTIES.map((d, i) => (
                <button
                  key={d.id}
                  className={`glass-card rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] ${
                    difficulty === d.id ? 'ring-2' : 'hover:border-white/10'
                  }`}
                  style={{
                    borderColor: difficulty === d.id ? d.color : undefined,
                    boxShadow: difficulty === d.id ? `0 0 25px ${d.color}20` : undefined,
                    ringColor: difficulty === d.id ? d.color : undefined,
                    animation: `fadeInUp 0.4s ${i * 0.08}s ease both`,
                  }}
                  onClick={() => setDifficulty(d.id)}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: d.color + '18' }}>
                    {d.emoji}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-200 font-extrabold">{d.label}</span>
                      <span className="font-orbitron text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: d.color + '22', color: d.color }}>
                        {d.mult}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">{d.desc}</p>
                  </div>
                  {difficulty === d.id && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ background: d.color }}>
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              className="w-full bg-gradient-to-br from-gold via-amber-500 to-[#ff8c00] rounded-xl py-4 text-dark font-extrabold text-base tracking-wide hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_8px_30px_#ffd70050] active:scale-[0.97] transition-all pulse-glow animate-[fadeInUp_0.5s_0.3s_ease_both]"
              onClick={handleStart}
            >
              ⚔️ START QUEST
            </button>

            <button
              className="text-slate-500 text-sm hover:text-slate-300 transition-colors animate-[fadeInUp_0.5s_0.35s_ease_both]"
              onClick={() => setStep('name')}
            >
              ← Change name
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default HomeScreen
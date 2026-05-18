import { useState, useEffect, useCallback } from 'react'

// ===== EXPANDED QUESTION POOL (40+ words) =====
const ALL_QUESTIONS = [
  // Tier 1 - Easier
  { word: 'Brave',      correct: 'Berani',                       options: ['Berani', 'Takut', 'Marah', 'Sedih'],                tier: 1 },
  { word: 'Clever',     correct: 'Pintar / cerdas',              options: ['Pintar / cerdas', 'Bodoh', 'Lambat', 'Aneh'],       tier: 1 },
  { word: 'Calm',       correct: 'Tenang',                       options: ['Tenang', 'Marah', 'Takut', 'Bingung'],              tier: 1 },
  { word: 'Polite',     correct: 'Sopan',                        options: ['Sopan', 'Kasar', 'Pendiam', 'Pemarah'],             tier: 1 },
  { word: 'Lazy',       correct: 'Malas',                        options: ['Malas', 'Rajin', 'Cepat', 'Kuat'],                  tier: 1 },
  { word: 'Proud',      correct: 'Bangga',                       options: ['Bangga', 'Malu', 'Takut', 'Sedih'],                 tier: 1 },
  { word: 'Wealthy',    correct: 'Kaya',                         options: ['Kaya', 'Miskin', 'Hemat', 'Boros'],                  tier: 1 },
  { word: 'Ancient',    correct: 'Kuno / sangat tua',            options: ['Kuno / sangat tua', 'Modern', 'Baru', 'Muda'],      tier: 1 },
  { word: 'Bright',     correct: 'Terang / cerdas',              options: ['Terang / cerdas', 'Gelap', 'Redup', 'Buram'],       tier: 1 },
  { word: 'Curious',    correct: 'Ingin tahu / penasaran',       options: ['Ingin tahu / penasaran', 'Bosan', 'Acuh', 'Malas'], tier: 1 },

  // Tier 2 - Medium
  { word: 'Ambiguous',  correct: 'Tidak jelas / bermakna ganda', options: ['Tidak jelas / bermakna ganda', 'Percaya diri', 'Luar biasa', 'Menyenangkan'],   tier: 2 },
  { word: 'Benevolent', correct: 'Baik hati / dermawan',         options: ['Baik hati / dermawan', 'Kejam', 'Serakah', 'Pemalas'],                           tier: 2 },
  { word: 'Candid',     correct: 'Jujur / terus terang',         options: ['Jujur / terus terang', 'Berbohong', 'Pemalu', 'Sombong'],                        tier: 2 },
  { word: 'Diligent',   correct: 'Rajin / tekun',                options: ['Rajin / tekun', 'Ceroboh', 'Lambat', 'Bodoh'],                                  tier: 2 },
  { word: 'Eloquent',   correct: 'Pandai berbicara / fasih',     options: ['Pandai berbicara / fasih', 'Diam', 'Pemalu', 'Kasar'],                           tier: 2 },
  { word: 'Frugal',     correct: 'Hemat',                        options: ['Hemat', 'Boros', 'Kaya', 'Miskin'],                                             tier: 2 },
  { word: 'Genuine',    correct: 'Asli / sungguh-sungguh',       options: ['Asli / sungguh-sungguh', 'Palsu', 'Biasa saja', 'Asing'],                       tier: 2 },
  { word: 'Humble',     correct: 'Rendah hati',                  options: ['Rendah hati', 'Sombong', 'Keras kepala', 'Pemarah'],                             tier: 2 },
  { word: 'Innovative', correct: 'Inovatif / penuh ide baru',    options: ['Inovatif / penuh ide baru', 'Membosankan', 'Tradisional', 'Lamban'],             tier: 2 },
  { word: 'Jubilant',   correct: 'Sangat gembira',               options: ['Sangat gembira', 'Sedih', 'Bingung', 'Lelah'],                                  tier: 2 },
  { word: 'Keen',       correct: 'Bersemangat / tajam',          options: ['Bersemangat / tajam', 'Malas', 'Tumpul', 'Lemah'],                               tier: 2 },
  { word: 'Meticulous', correct: 'Teliti / cermat',              options: ['Teliti / cermat', 'Tergesa-gesa', 'Jorok', 'Acak-acakan'],                       tier: 2 },

  // Tier 3 - Hard
  { word: 'Notorious',  correct: 'Terkenal (karena hal buruk)',  options: ['Terkenal (karena hal buruk)', 'Terkenal (hal baik)', 'Biasa saja', 'Tersembunyi'], tier: 3 },
  { word: 'Optimistic', correct: 'Berpikir positif',             options: ['Berpikir positif', 'Pesimis', 'Marah', 'Bingung'],                                tier: 3 },
  { word: 'Persistent', correct: 'Gigih / pantang menyerah',     options: ['Gigih / pantang menyerah', 'Mudah menyerah', 'Pemalas', 'Lemah'],                 tier: 3 },
  { word: 'Resilient',  correct: 'Tangguh / mudah bangkit',      options: ['Tangguh / mudah bangkit', 'Rapuh', 'Lemah', 'Penakut'],                           tier: 3 },
  { word: 'Sincere',    correct: 'Tulus / ikhlas',               options: ['Tulus / ikhlas', 'Munafik', 'Pura-pura', 'Licik'],                                tier: 3 },
  { word: 'Versatile',  correct: 'Serbabisa / fleksibel',        options: ['Serbabisa / fleksibel', 'Kaku', 'Terbatas', 'Lemah'],                             tier: 3 },
  { word: 'Whimsical',  correct: 'Unik / penuh fantasi',         options: ['Unik / penuh fantasi', 'Serius', 'Kaku', 'Biasa'],                               tier: 3 },
  { word: 'Pragmatic',  correct: 'Praktis / realistis',          options: ['Praktis / realistis', 'Idealis', 'Bermimpi', 'Malas'],                            tier: 3 },
  { word: 'Tenacious',  correct: 'Ulet / tidak mudah menyerah',  options: ['Ulet / tidak mudah menyerah', 'Lemah', 'Penakut', 'Pemalas'],                    tier: 3 },
  { word: 'Empathy',    correct: 'Rasa empati / turut merasakan', options: ['Rasa empati / turut merasakan', 'Acuh tak acuh', 'Marah', 'Egois'],             tier: 3 },
  { word: 'Altruistic', correct: 'Tidak mementingkan diri sendiri', options: ['Tidak mementingkan diri sendiri', 'Egois', 'Serakah', 'Sombong'],             tier: 3 },
  { word: 'Ephemeral',  correct: 'Singkat / sementara',          options: ['Singkat / sementara', 'Abadi', 'Panjang', 'Tetap'],                               tier: 3 },
  { word: 'Lavish',     correct: 'Mewah / berlebihan',           options: ['Mewah / berlebihan', 'Sederhana', 'Murah', 'Kecil'],                             tier: 3 },
  { word: 'Quirky',     correct: 'Unik / aneh (positif)',        options: ['Unik / aneh (positif)', 'Membosankan', 'Biasa', 'Jelek'],                        tier: 3 },
]

const DIFF_CONFIG = {
  easy:   { totalQ: 8,  timePerQ: 20, label: 'Easy' },
  normal: { totalQ: 10, timePerQ: 15, label: 'Normal' },
  hard:   { totalQ: 12, timePerQ: 10, label: 'Hard' },
}

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function VocabularyMatch({ navigate, completeGame, difficulty = 'normal' }) {
  const config = DIFF_CONFIG[difficulty]
  const TOTAL_QUESTIONS = config.totalQ
  const TIME_PER_QUESTION = config.timePerQ

  const [questions]       = useState(() => {
    // Progressive difficulty: mix tiers based on difficulty
    let pool
    if (difficulty === 'easy') pool = ALL_QUESTIONS.filter(q => q.tier <= 2)
    else if (difficulty === 'hard') pool = ALL_QUESTIONS.filter(q => q.tier >= 2)
    else pool = [...ALL_QUESTIONS]
    return shuffle(pool).slice(0, TOTAL_QUESTIONS)
  })
  const [currentIndex,    setCurrentIndex]    = useState(0)
  const [selected,        setSelected]        = useState(null)
  const [isAnswered,      setIsAnswered]      = useState(false)
  const [score,           setScore]           = useState(0)
  const [timer,           setTimer]           = useState(TIME_PER_QUESTION)
  const [phase,           setPhase]           = useState('playing')
  const [results,         setResults]         = useState([])
  const [shuffledOptions, setShuffledOptions] = useState([])
  const [lives,           setLives]           = useState(3)
  const [streak,          setStreak]          = useState(0)
  const [showStreak,      setShowStreak]      = useState(false)
  const [shakeScreen,     setShakeScreen]     = useState(false)
  const [speedBonus,      setSpeedBonus]      = useState(0)

  const currentQ = questions[currentIndex]

  useEffect(() => {
    if (currentQ) setShuffledOptions(shuffle(currentQ.options))
  }, [currentIndex])

  const handleAnswer = useCallback((option) => {
    if (isAnswered) return
    const isCorrect = option === currentQ.correct
    setSelected(option)
    setIsAnswered(true)

    if (isCorrect) {
      // Speed bonus: more points for faster answers
      const speed = Math.max(0, timer)
      const bonus = speed >= TIME_PER_QUESTION * 0.7 ? 5 : speed >= TIME_PER_QUESTION * 0.4 ? 3 : 0
      setSpeedBonus(bonus)
      
      const streakBonus = streak >= 4 ? 5 : streak >= 2 ? 3 : 0
      setScore(s => s + 10 + bonus + streakBonus)
      setStreak(s => {
        const newStreak = s + 1
        if (newStreak >= 3) { setShowStreak(true); setTimeout(() => setShowStreak(false), 1500) }
        return newStreak
      })
    } else {
      setStreak(0)
      setSpeedBonus(0)
      setLives(l => Math.max(0, l - 1))
      setShakeScreen(true)
      setTimeout(() => setShakeScreen(false), 500)
    }

    setResults(prev => [...prev, {
      word: currentQ.word,
      correct: currentQ.correct,
      chosen: option,
      isCorrect,
    }])

    setTimeout(() => {
      if (lives <= 1 && !isCorrect) {
        setPhase('result')
      } else if (currentIndex + 1 >= TOTAL_QUESTIONS) {
        setPhase('result')
      } else {
        setCurrentIndex(i => i + 1)
        setSelected(null)
        setIsAnswered(false)
        setTimer(TIME_PER_QUESTION)
        setSpeedBonus(0)
      }
    }, 1200)
  }, [isAnswered, currentQ, currentIndex, timer, streak, lives, TIME_PER_QUESTION, TOTAL_QUESTIONS])

  useEffect(() => {
    if (phase !== 'playing' || isAnswered) return
    if (timer === 0) { handleAnswer(null); return }
    const id = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [timer, isAnswered, phase, handleAnswer])

  if (phase === 'result') {
    const correctCount = results.filter(r => r.isCorrect).length
    const xp = Math.round((score / (TOTAL_QUESTIONS * 15)) * 100)
    return (
      <GameResult score={score} total={TOTAL_QUESTIONS} xp={xp} correctCount={correctCount} onFinish={() => completeGame('vocab', score, xp, correctCount, results.length)}>
        {results.map((r, i) => (
          <div key={i} className={`flex justify-between items-center glass-card rounded-xl px-4 py-2.5 text-sm gap-3 flex-wrap ${r.isCorrect ? 'border-emerald-500/30' : 'border-danger/30'}`} style={{ borderWidth: '1px' }}>
            <span className="font-bold text-slate-200">{r.word}</span>
            <span className={r.isCorrect ? 'text-emerald-400' : 'text-danger'}>
              {r.isCorrect ? '✓' : '✗'} {r.correct}
            </span>
          </div>
        ))}
      </GameResult>
    )
  }

  const timerPct = (timer / TIME_PER_QUESTION) * 100
  const timerColor = timer <= 5 ? '#ff6b6b' : timer <= 10 ? '#f59e0b' : '#00e5a0'

  const getOptionClass = (option) => {
    const base = 'flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left text-sm font-bold w-full transition-all duration-200'
    if (!isAnswered) return `${base} glass-card text-slate-200 hover:translate-x-1 hover:border-blue-400 hover:bg-blue-500/5 cursor-pointer`
    if (option === currentQ.correct) return `${base} bg-emerald-500/10 border-emerald-500 text-emerald-400`
    if (option === selected)         return `${base} bg-danger/10 border-danger text-danger`
    return `${base} bg-panel/50 border-navy text-slate-600`
  }

  return (
    <div className={`min-h-screen bg-game px-4 sm:px-6 py-6 max-w-2xl mx-auto flex flex-col gap-5 ${shakeScreen ? 'shake' : ''}`}>
      {/* Streak notification */}
      {showStreak && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-red-500 text-white font-extrabold text-sm px-6 py-3 rounded-full z-50 shadow-[0_4px_20px_#f59e0b44] fire-streak">
          🔥 {streak} Streak! Combo Bonus!
        </div>
      )}

      <GameHeader
        title="🔤 Vocabulary Match"
        index={currentIndex}
        total={TOTAL_QUESTIONS}
        score={score}
        progress={currentIndex / TOTAL_QUESTIONS * 100}
        barColor="from-blue-500 to-cyan-400"
        navigate={navigate}
        lives={lives}
        streak={streak}
      />

      {/* Timer Ring */}
      <div className="flex flex-col items-center gap-1">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="#1a2235" strokeWidth="4" />
            <circle cx="32" cy="32" r="28" fill="none" stroke={timerColor} strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - timerPct / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center font-extrabold text-xl ${timer <= 5 ? 'text-danger' : 'text-slate-200'}`}>
            {timer}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-card rounded-2xl px-8 py-8 text-center" style={{ boxShadow: '0 0 40px #3b82f615' }}>
        <p className="text-slate-500 text-xs uppercase tracking-wider mb-3">What is the meaning of:</p>
        <p className="font-quest text-3xl sm:text-4xl text-slate-200 bounce-in" key={currentIndex} style={{ textShadow: '0 0 20px #ffffff20' }}>
          {currentQ.word}
        </p>
        {speedBonus > 0 && isAnswered && (
          <p className="text-cyan-400 text-xs font-bold mt-2 number-pop">⚡ Speed Bonus +{speedBonus}!</p>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {shuffledOptions.map((option, i) => (
          <button
            key={`${currentIndex}-${i}`}
            className={getOptionClass(option)}
            onClick={() => handleAnswer(option)}
            disabled={isAnswered}
            style={{ animation: `fadeInUp 0.3s ${i * 0.05}s ease both` }}
          >
            <span className="bg-navy rounded-lg w-8 h-8 flex items-center justify-center text-xs font-extrabold text-slate-400 flex-shrink-0">
              {['A','B','C','D'][i]}
            </span>
            <span className="flex-1 leading-tight">{option}</span>
            {isAnswered && option === currentQ.correct && <span className="ml-auto text-emerald-400 text-lg">✓</span>}
            {isAnswered && option === selected && option !== currentQ.correct && <span className="ml-auto text-danger text-lg">✗</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

// =============================================
// SHARED COMPONENTS
// =============================================

export function GameHeader({ title, index, total, score, progress, barColor, navigate, lives = 3, streak = 0 }) {
  return (
    <div className="glass-card rounded-2xl px-4 sm:px-5 py-4 border border-white/5 animate-fadeInUp flex flex-col gap-3 shadow-[0_4px_20px_#0004]">
      <div className="flex justify-between items-center gap-3">
        <button
          className="bg-transparent border border-dim text-slate-400 rounded-lg px-3 py-2 text-sm hover:text-slate-200 hover:border-slate-500 transition-colors"
          onClick={() => navigate('select')}
        >
          ← Back
        </button>
        <p className="text-slate-200 font-extrabold text-sm sm:text-base">{title}</p>
        <div className="flex items-center gap-3">
          {/* Lives */}
          <div className="flex gap-0.5">
            {[1,2,3].map(i => (
              <span key={i} className={`text-base transition-all duration-300 ${i <= lives ? 'opacity-100 scale-100' : 'opacity-20 scale-75'} ${i === lives && lives <= 1 ? 'heartbeat' : ''}`}>
                {i <= lives ? '❤️' : '🖤'}
              </span>
            ))}
          </div>
          {/* Score */}
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Score</p>
            <p className="text-gold font-extrabold text-lg leading-none number-pop" key={score}>{score}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-navy rounded-full h-2 overflow-hidden relative">
          <div className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`} style={{ width: `${progress}%` }} />
          <div className="absolute inset-0 xp-shimmer rounded-full" />
        </div>
        <span className="text-slate-500 text-[10px] font-bold min-w-[36px] text-right">{index + 1}/{total}</span>
      </div>
      {streak >= 2 && (
        <div className="flex justify-center">
          <span className="bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-500/30 text-amber-400 rounded-full px-3 py-0.5 text-xs font-extrabold fire-streak">
            🔥 {streak} Streak!
          </span>
        </div>
      )}
    </div>
  )
}

export function GameResult({ score, total, xp, correctCount, onFinish, children }) {
  const percentage = Math.round((correctCount / total) * 100)
  const emoji = percentage === 100 ? '🏆' : percentage >= 70 ? '⭐' : percentage >= 40 ? '👍' : '💪'
  const message = percentage === 100 ? 'PERFECT SCORE!' : percentage >= 70 ? 'Great Job!' : percentage >= 40 ? 'Good Effort!' : 'Keep Practicing!'

  return (
    <div className="min-h-screen bg-game px-4 sm:px-6 py-6 max-w-2xl mx-auto flex items-center">
      <div className="w-full glass-card border border-white/5 rounded-3xl px-6 sm:px-8 py-10 flex flex-col items-center gap-5 text-center shadow-[0_8px_40px_#0008]">
        <div className="text-7xl bounce-in">{emoji}</div>
        <h2 className="font-quest text-gold text-2xl" style={{ textShadow: '0 0 20px #ffd70030' }}>Quest Complete!</h2>
        <p className="text-slate-300 font-bold text-sm">{message}</p>

        <div className="grid grid-cols-3 gap-3 w-full">
          {[
            [score, 'Score', 'text-gold'],
            [`${correctCount}/${total}`, 'Correct', 'text-emerald-400'],
            [`+${xp}`, 'XP', 'text-purple-400'],
          ].map(([val, label, color], i) => (
            <div key={i} className="glass-card-light rounded-xl p-4">
              <p className={`font-extrabold text-xl ${color}`}>{val}</p>
              <p className="text-slate-500 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Accuracy bar */}
        <div className="w-full">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Accuracy</span>
            <span className={`font-bold ${percentage >= 70 ? 'text-emerald-400' : percentage >= 40 ? 'text-amber-400' : 'text-danger'}`}>{percentage}%</span>
          </div>
          <div className="bg-navy rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${percentage >= 70 ? 'bg-gradient-to-r from-emerald-500 to-teal' : percentage >= 40 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-red-500 to-danger'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 max-h-56 overflow-y-auto mt-1">
          {children}
        </div>
        <button
          className="bg-gradient-to-br from-gold via-amber-500 to-[#ff8c00] rounded-xl px-8 py-3.5 text-dark font-extrabold text-base mt-2 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_#ffd70040] transition-all"
          onClick={onFinish}
        >
          Back to Quest Map
        </button>
      </div>
    </div>
  )
}

export default VocabularyMatch
import { useState, useEffect, useCallback } from 'react'

const ALL_QUESTIONS = [
  { word: 'Ambiguous',  correct: 'Tidak jelas / bermakna ganda', options: ['Tidak jelas / bermakna ganda', 'Percaya diri', 'Luar biasa', 'Menyenangkan'] },
  { word: 'Benevolent', correct: 'Baik hati / dermawan',         options: ['Baik hati / dermawan', 'Kejam', 'Serakah', 'Pemalas'] },
  { word: 'Candid',     correct: 'Jujur / terus terang',         options: ['Jujur / terus terang', 'Berbohong', 'Pemalu', 'Sombong'] },
  { word: 'Diligent',   correct: 'Rajin / tekun',                options: ['Rajin / tekun', 'Ceroboh', 'Lambat', 'Bodoh'] },
  { word: 'Eloquent',   correct: 'Pandai berbicara / fasih',     options: ['Pandai berbicara / fasih', 'Diam', 'Pemalu', 'Kasar'] },
  { word: 'Frugal',     correct: 'Hemat',                        options: ['Hemat', 'Boros', 'Kaya', 'Miskin'] },
  { word: 'Genuine',    correct: 'Asli / sungguh-sungguh',       options: ['Asli / sungguh-sungguh', 'Palsu', 'Biasa saja', 'Asing'] },
  { word: 'Humble',     correct: 'Rendah hati',                  options: ['Rendah hati', 'Sombong', 'Keras kepala', 'Pemarah'] },
  { word: 'Innovative', correct: 'Inovatif / penuh ide baru',    options: ['Inovatif / penuh ide baru', 'Membosankan', 'Tradisional', 'Lamban'] },
  { word: 'Jubilant',   correct: 'Sangat gembira',               options: ['Sangat gembira', 'Sedih', 'Bingung', 'Lelah'] },
  { word: 'Keen',       correct: 'Bersemangat / tajam',          options: ['Bersemangat / tajam', 'Malas', 'Tumpul', 'Lemah'] },
  { word: 'Lavish',     correct: 'Mewah / berlebihan',           options: ['Mewah / berlebihan', 'Sederhana', 'Murah', 'Kecil'] },
  { word: 'Meticulous', correct: 'Teliti / cermat',              options: ['Teliti / cermat', 'Tergesa-gesa', 'Jorok', 'Acak-acakan'] },
  { word: 'Notorious',  correct: 'Terkenal (karena hal buruk)',  options: ['Terkenal (karena hal buruk)', 'Terkenal (hal baik)', 'Biasa saja', 'Tersembunyi'] },
  { word: 'Optimistic', correct: 'Berpikir positif',             options: ['Berpikir positif', 'Pesimis', 'Marah', 'Bingung'] },
  { word: 'Persistent', correct: 'Gigih / pantang menyerah',     options: ['Gigih / pantang menyerah', 'Mudah menyerah', 'Pemalas', 'Lemah'] },
  { word: 'Quirky',     correct: 'Unik / aneh (positif)',        options: ['Unik / aneh (positif)', 'Membosankan', 'Biasa', 'Jelek'] },
  { word: 'Resilient',  correct: 'Tangguh / mudah bangkit',      options: ['Tangguh / mudah bangkit', 'Rapuh', 'Lemah', 'Penakut'] },
  { word: 'Sincere',    correct: 'Tulus / ikhlas',               options: ['Tulus / ikhlas', 'Munafik', 'Pura-pura', 'Licik'] },
  { word: 'Versatile',  correct: 'Serbabisa / fleksibel',        options: ['Serbabisa / fleksibel', 'Kaku', 'Terbatas', 'Lemah'] },
]

const TOTAL_QUESTIONS = 10
const TIME_PER_QUESTION = 15

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function VocabularyMatch({ navigate, completeGame }) {
  const [questions]       = useState(() => shuffle(ALL_QUESTIONS).slice(0, TOTAL_QUESTIONS))
  const [currentIndex,    setCurrentIndex]    = useState(0)
  const [selected,        setSelected]        = useState(null)
  const [isAnswered,      setIsAnswered]       = useState(false)
  const [score,           setScore]           = useState(0)
  const [timer,           setTimer]           = useState(TIME_PER_QUESTION)
  const [phase,           setPhase]           = useState('playing')
  const [results,         setResults]         = useState([])
  const [shuffledOptions, setShuffledOptions] = useState(() => shuffle(ALL_QUESTIONS[0].options))

  const currentQ = questions[currentIndex]

  useEffect(() => {
    setShuffledOptions(shuffle(currentQ.options))
  }, [currentIndex])

  const handleAnswer = useCallback((option) => {
    if (isAnswered) return
    const isCorrect = option === currentQ.correct
    setSelected(option)
    setIsAnswered(true)
    if (isCorrect) setScore(s => s + 10)
    setResults(prev => [...prev, {
      word: currentQ.word,
      correct: currentQ.correct,
      chosen: option,
      isCorrect,
    }])
    setTimeout(() => {
      if (currentIndex + 1 >= TOTAL_QUESTIONS) {
        setPhase('result')
      } else {
        setCurrentIndex(i => i + 1)
        setSelected(null)
        setIsAnswered(false)
        setTimer(TIME_PER_QUESTION)
      }
    }, 1200)
  }, [isAnswered, currentQ, currentIndex])

  useEffect(() => {
    if (phase !== 'playing' || isAnswered) return
    if (timer === 0) { handleAnswer(null); return }
    const id = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [timer, isAnswered, phase, handleAnswer])

  if (phase === 'result') {
    const xp = Math.round((score / (TOTAL_QUESTIONS * 10)) * 100)
    return (
      <GameResult score={score} total={TOTAL_QUESTIONS} xp={xp} onFinish={() => completeGame('vocab', score, xp)}>
        {results.map((r, i) => (
          <div key={i} className={`flex justify-between items-center bg-navy rounded-xl px-4 py-2.5 border text-sm gap-3 flex-wrap ${r.isCorrect ? 'border-emerald-500/30' : 'border-danger/30'}`}>
            <span className="font-bold text-slate-200">{r.word}</span>
            <span className={r.isCorrect ? 'text-emerald-400' : 'text-danger'}>
              {r.isCorrect ? '✓' : '✗'} {r.correct}
            </span>
          </div>
        ))}
      </GameResult>
    )
  }

  const timerColor = timer <= 5 ? 'border-danger text-danger' : timer <= 10 ? 'border-amber-400 text-amber-400' : 'border-teal text-teal'

  const getOptionClass = (option) => {
    const base = 'flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left text-sm font-bold w-full transition-all'
    if (!isAnswered) return `${base} bg-panel border-dim text-slate-200 hover:translate-x-1 hover:border-blue-400 cursor-pointer`
    if (option === currentQ.correct) return `${base} bg-emerald-500/10 border-emerald-500 text-emerald-400`
    if (option === selected)         return `${base} bg-danger/10 border-danger text-danger`
    return `${base} bg-panel border-navy text-slate-600`
  }

  return (
    <div className="min-h-screen bg-game px-6 py-6 max-w-2xl mx-auto flex flex-col gap-5">
      <GameHeader
        title="🔤 Vocabulary Match"
        index={currentIndex}
        total={TOTAL_QUESTIONS}
        score={score}
        progress={currentIndex / TOTAL_QUESTIONS * 100}
        barColor="from-blue-500 to-teal"
        navigate={navigate}
      />

      {/* Timer */}
      <div className="flex flex-col items-center gap-1">
        <div className={`w-14 h-14 rounded-full border-[3px] flex items-center justify-center text-xl font-extrabold transition-colors ${timerColor}`}>
          {timer}
        </div>
        <p className="text-slate-400 text-xs">seconds left</p>
      </div>

      {/* Kartu Soal */}
      <div className="bg-panel border border-dim rounded-2xl px-8 py-8 text-center" style={{ boxShadow: '0 0 40px #3b82f620' }}>
        <p className="text-slate-400 text-sm mb-3">What is the meaning of:</p>
        <p className="font-quest text-3xl text-slate-200" style={{ textShadow: '0 0 20px #ffffff30' }}>
          {currentQ.word}
        </p>
      </div>

      {/* Pilihan Jawaban */}
      <div className="grid grid-cols-2 gap-3">
        {shuffledOptions.map((option, i) => (
          <button
            key={i}
            className={getOptionClass(option)}
            onClick={() => handleAnswer(option)}
            disabled={isAnswered}
          >
            <span className="bg-navy rounded-md w-7 h-7 flex items-center justify-center text-xs font-extrabold text-slate-400 flex-shrink-0">
              {['A','B','C','D'][i]}
            </span>
            <span className="flex-1 leading-tight">{option}</span>
            {isAnswered && option === currentQ.correct && <span className="ml-auto text-emerald-400">✓</span>}
            {isAnswered && option === selected && option !== currentQ.correct && <span className="ml-auto text-danger">✗</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

// =============================================
// SHARED COMPONENTS — diexport untuk dipakai file lain
// =============================================

export function GameHeader({ title, index, total, score, progress, barColor, navigate }) {
  return (
    <div className="flex justify-between items-center gap-3 bg-panel rounded-2xl px-5 py-4 border border-dim animate-fadeInUp">
      <button
        className="bg-transparent border border-dim text-slate-400 rounded-lg px-3 py-2 text-sm hover:text-slate-200 transition-colors"
        onClick={() => navigate('select')}
      >
        ← Back
      </button>
      <div className="flex-1 text-center">
        <p className="text-slate-200 font-extrabold mb-2">{title}</p>
        <div className="bg-navy rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-slate-400 text-xs mt-1">{index + 1} / {total}</p>
      </div>
      <div className="text-right">
        <p className="text-slate-400 text-xs">Score</p>
        <p className="text-gold font-extrabold text-xl">{score}</p>
      </div>
    </div>
  )
}

export function GameResult({ score, total, xp, onFinish, children }) {
  const percentage = Math.round((score / (total * 10)) * 100)
  const emoji = percentage === 100 ? '🏆' : percentage >= 70 ? '⭐' : percentage >= 40 ? '👍' : '💪'
  return (
    <div className="min-h-screen bg-game px-6 py-6 max-w-2xl mx-auto flex items-center">
      <div className="w-full bg-panel border border-dim rounded-3xl px-8 py-10 flex flex-col items-center gap-4 text-center">
        <p className="text-6xl">{emoji}</p>
        <h2 className="font-quest text-gold text-2xl">Quest Complete!</h2>
        <p className="text-5xl font-extrabold text-slate-200">
          {score} <span className="text-lg text-slate-400">/ {total * 10} pts</span>
        </p>
        <p className="text-gold font-bold">+{xp} XP earned!</p>
        <div className="w-full flex flex-col gap-2 max-h-64 overflow-y-auto mt-2">
          {children}
        </div>
        <button
          className="bg-gradient-to-br from-gold to-[#ff8c00] rounded-xl px-8 py-3.5 text-dark font-extrabold text-base mt-2 hover:-translate-y-0.5 transition-all"
          onClick={onFinish}
        >
          Back to Quest Map
        </button>
      </div>
    </div>
  )
}

export default VocabularyMatch
import { useState, useEffect, useCallback } from 'react'
import { GameHeader, GameResult } from './VocabularyMatch'

// ===== EXPANDED WORD POOL (35+ words) =====
const ALL_WORDS = [
  // Tier 1 - Short/Easy
  { word: 'HAPPY',     hint: 'Feeling joy or pleasure',                tier: 1 },
  { word: 'LIGHT',     hint: 'The opposite of dark',                   tier: 1 },
  { word: 'WATER',     hint: 'Essential liquid for life',              tier: 1 },
  { word: 'MUSIC',     hint: 'Art of sound and rhythm',                tier: 1 },
  { word: 'DREAM',     hint: 'Images during sleep',                    tier: 1 },
  { word: 'SMILE',     hint: 'A happy facial expression',              tier: 1 },
  { word: 'BRAVE',     hint: 'Showing courage in danger',              tier: 1 },
  { word: 'STONE',     hint: 'A hard solid mineral',                   tier: 1 },

  // Tier 2 - Medium
  { word: 'ADVENTURE', hint: 'An exciting or unusual experience',      tier: 2 },
  { word: 'BEAUTIFUL', hint: 'Pleasing to the senses or mind',         tier: 2 },
  { word: 'CHALLENGE', hint: 'Something difficult that requires effort',tier: 2 },
  { word: 'DISCOVER',  hint: 'To find something for the first time',   tier: 2 },
  { word: 'ELEPHANT',  hint: 'The largest land animal on Earth',       tier: 2 },
  { word: 'FREEDOM',   hint: 'The power to act without restraint',     tier: 2 },
  { word: 'GRATEFUL',  hint: 'Feeling thankful for something',         tier: 2 },
  { word: 'HORIZON',   hint: 'The line where sky meets the earth',     tier: 2 },
  { word: 'IMAGINE',   hint: 'To form a picture in your mind',         tier: 2 },
  { word: 'JOURNEY',   hint: 'Traveling from one place to another',    tier: 2 },
  { word: 'MOUNTAIN',  hint: 'A large natural elevation of earth',     tier: 2 },
  { word: 'NOTEBOOK',  hint: 'A book with blank pages for writing',    tier: 2 },
  { word: 'RAINBOW',   hint: 'A colorful arc seen after rain',         tier: 2 },

  // Tier 3 - Hard (long words)
  { word: 'KNOWLEDGE',   hint: 'Facts acquired through learning',       tier: 3 },
  { word: 'LANGUAGE',    hint: 'A system of communication',             tier: 3 },
  { word: 'PATIENCE',    hint: 'Calm endurance of hardship or delay',   tier: 3 },
  { word: 'QUESTION',    hint: 'A sentence asking for information',     tier: 3 },
  { word: 'STRENGTH',    hint: 'Physical or mental power and energy',   tier: 3 },
  { word: 'TREASURE',    hint: 'A collection of valuable things',       tier: 3 },
  { word: 'UNIVERSE',    hint: 'All of space and everything in it',     tier: 3 },
  { word: 'WONDERFUL',   hint: 'Inspiring delight or admiration',       tier: 3 },
  { word: 'YESTERDAY',   hint: 'The day before today',                  tier: 3 },
  { word: 'DANGEROUS',   hint: 'Likely to cause harm or injury',        tier: 3 },
  { word: 'EXPERIENCE',  hint: 'Practical contact with events',         tier: 3 },
  { word: 'IMPOSSIBLE',  hint: 'Not able to occur or be done',          tier: 3 },
  { word: 'PHILOSOPHY',  hint: 'Study of fundamental nature of reality', tier: 3 },
  { word: 'WILDERNESS',  hint: 'An uncultivated, wild region',          tier: 3 },
]

const DIFF_CONFIG = {
  easy:   { totalQ: 6,  timePerQ: 30, label: 'Easy' },
  normal: { totalQ: 8,  timePerQ: 20, label: 'Normal' },
  hard:   { totalQ: 10, timePerQ: 14, label: 'Hard' },
}

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }
function scrambleWord(word) {
  let r; do { r = shuffle(word.split('')).join('') } while (r === word); return r
}

function WordScramble({ navigate, completeGame, difficulty = 'normal' }) {
  const config = DIFF_CONFIG[difficulty]
  const TOTAL_QUESTIONS = config.totalQ
  const TIME_PER_QUESTION = config.timePerQ

  const [questions]          = useState(() => {
    let pool
    if (difficulty === 'easy') pool = ALL_WORDS.filter(w => w.tier <= 2)
    else if (difficulty === 'hard') pool = ALL_WORDS.filter(w => w.tier >= 2)
    else pool = [...ALL_WORDS]
    return shuffle(pool).slice(0, TOTAL_QUESTIONS)
  })
  const [index,               setIndex]            = useState(0)
  const [scrambled,           setScrambled]        = useState([])
  const [answer,              setAnswer]           = useState([])
  const [timer,               setTimer]            = useState(TIME_PER_QUESTION)
  const [phase,               setPhase]            = useState('playing')
  const [feedback,            setFeedback]         = useState(null)
  const [score,               setScore]            = useState(0)
  const [results,             setResults]          = useState([])
  const [showHint,            setShowHint]         = useState(false)
  const [revealedPositions,   setRevealedPositions] = useState([])
  const [lives,               setLives]            = useState(3)
  const [streak,              setStreak]           = useState(0)
  const [shakeScreen,         setShakeScreen]      = useState(false)

  const currentQ = questions[index]

  // Reset tiap soal baru
  useEffect(() => {
    setScrambled(scrambleWord(currentQ.word).split('').map((char, i) => ({ char, id: `${i}-${char}` })))
    setAnswer([])
    setTimer(TIME_PER_QUESTION)
    setFeedback(null)
    setShowHint(false)
    setRevealedPositions([])
  }, [index])

  const goNext = useCallback(() => {
    setTimeout(() => {
      if (lives <= 0) { setPhase('result'); return }
      if (index + 1 >= TOTAL_QUESTIONS) setPhase('result')
      else setIndex(i => i + 1)
    }, 1200)
  }, [index, lives, TOTAL_QUESTIONS])

  const handleTimeout = useCallback(() => {
    setFeedback('timeout')
    setStreak(0)
    setResults(p => [...p, { word: currentQ.word, isCorrect: false }])
    setLives(l => {
      const newL = Math.max(0, l - 1)
      if (newL <= 0) setTimeout(() => setPhase('result'), 1200)
      return newL
    })
    setShakeScreen(true)
    setTimeout(() => setShakeScreen(false), 500)
    goNext()
  }, [currentQ.word, goNext])

  const handleResult = useCallback((ok) => {
    setFeedback(ok ? 'correct' : 'wrong')
    if (ok) {
      const speedBonus = timer >= TIME_PER_QUESTION * 0.6 ? 5 : 0
      setScore(s => s + 10 + speedBonus)
      setStreak(s => s + 1)
    } else {
      setStreak(0)
      setLives(l => {
        const newL = Math.max(0, l - 1)
        if (newL <= 0) setTimeout(() => setPhase('result'), 1200)
        return newL
      })
      setShakeScreen(true)
      setTimeout(() => setShakeScreen(false), 500)
    }
    setResults(p => [...p, { word: currentQ.word, isCorrect: ok }])
    goNext()
  }, [currentQ.word, goNext, timer, TIME_PER_QUESTION])

  // Timer
  useEffect(() => {
    if (phase !== 'playing' || feedback !== null) return
    if (timer === 0) { handleTimeout(); return }
    const id = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [timer, phase, feedback, handleTimeout])

  // Auto-check answer
  useEffect(() => {
    if (!answer.length) return
    if (feedback !== null) return
    if (answer.filter(Boolean).length === currentQ.word.length) {
      const typed = currentQ.word.split('').map((_, i) => answer[i]?.char ?? '').join('')
      handleResult(typed === currentQ.word)
    }
  }, [answer, currentQ.word, handleResult, feedback])

  const pickLetter = (letter) => {
    if (feedback) return
    setScrambled(p => p.filter(l => l.id !== letter.id))
    setAnswer(p => {
      const a = [...p]
      const ei = currentQ.word.split('').findIndex((_, i) => !a[i])
      if (ei !== -1) a[ei] = letter
      return a
    })
  }

  const returnLetter = (pos) => {
    if (feedback || revealedPositions.includes(pos)) return
    const letter = answer[pos]; if (!letter) return
    setAnswer(p => { const a = [...p]; a[pos] = undefined; return a })
    setScrambled(p => [...p, letter])
  }

  const handleClear = () => {
    if (feedback) return
    setScrambled(p => [...p, ...answer.filter((l, i) => l && !revealedPositions.includes(i))])
    setAnswer(p => p.map((l, i) => revealedPositions.includes(i) ? l : undefined))
  }

  const handleReveal = () => {
    if (feedback) return
    if (score <= 0) return
    const unfilled = currentQ.word.split('').map((char, i) => ({ char, i })).filter(({ i }) => !answer[i] && !revealedPositions.includes(i))
    if (!unfilled.length) return
    const { char, i: pos } = unfilled[0]
    setRevealedPositions(p => [...p, pos])
    setScore(s => Math.max(0, s - 5))
    const inBank = scrambled.find(l => l.char === char)
    if (inBank) {
      setScrambled(p => p.filter(l => l.id !== inBank.id))
      setAnswer(p => { const a = [...p]; a[pos] = inBank; return a })
    }
  }

  if (phase === 'result') {
    const correctCount = results.filter(r => r.isCorrect).length
    const xp = Math.round((score / (TOTAL_QUESTIONS * 15)) * 100)
    return (
      <GameResult score={score} total={TOTAL_QUESTIONS} xp={xp} correctCount={correctCount} onFinish={() => completeGame('scramble', score, xp, correctCount, results.length)}>
        {results.map((r, i) => (
          <div key={i} className={`flex justify-between items-center glass-card rounded-xl px-4 py-2.5 text-sm gap-3 ${r.isCorrect ? 'border-emerald-500/30' : 'border-danger/30'}`} style={{ borderWidth: '1px' }}>
            <span className="font-extrabold tracking-widest text-slate-200">{r.word}</span>
            <span className={`font-bold ${r.isCorrect ? 'text-emerald-400' : 'text-danger'}`}>{r.isCorrect ? '✓ Correct' : '✗ Wrong'}</span>
          </div>
        ))}
      </GameResult>
    )
  }

  const timerPct = (timer / TIME_PER_QUESTION) * 100
  const timerColor = timer <= 5 ? '#ff6b6b' : timer <= 10 ? '#f59e0b' : '#00e5a0'
  const cardBorder = feedback === 'correct' ? 'border-emerald-500 bg-emerald-500/5' : feedback ? 'border-danger bg-danger/5' : 'border-white/5'

  return (
    <div className={`min-h-screen bg-game px-4 sm:px-6 py-6 max-w-2xl mx-auto flex flex-col gap-5 ${shakeScreen ? 'shake' : ''}`}>
      <GameHeader title="🔀 Word Scramble" index={index} total={TOTAL_QUESTIONS} score={score} progress={index / TOTAL_QUESTIONS * 100} barColor="from-emerald-500 to-cyan-400" navigate={navigate} lives={lives} streak={streak} />

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

      {/* Word Card */}
      <div className={`glass-card border rounded-2xl px-6 sm:px-7 py-7 text-center flex flex-col items-center gap-4 transition-all ${cardBorder} ${feedback === 'correct' ? 'flash-correct' : feedback ? 'flash-wrong' : ''}`}>
        <div className="flex items-center gap-2">
          <p className="text-slate-500 text-xs uppercase tracking-wider">Unscramble this word</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-500">{currentQ.word.length} letters</span>
        </div>

        {/* Answer slots */}
        <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center">
          {currentQ.word.split('').map((_, i) => {
            const letter = answer[i]
            const isRevealed = revealedPositions.includes(i)
            return (
              <div
                key={i}
                className={`w-10 h-12 sm:w-11 sm:h-13 rounded-xl border-2 flex items-center justify-center transition-all duration-200
                  ${isRevealed ? 'bg-purple-900/60 border-purple-500 cursor-default'
                    : letter ? 'bg-[#1a3a5c] border-blue-500 cursor-pointer hover:scale-105 hover:border-blue-400'
                    : 'bg-navy/50 border-dim cursor-default'}`}
                onClick={() => returnLetter(i)}
                style={{ animation: letter ? 'scaleIn 0.2s ease' : undefined }}
              >
                <span className={`font-extrabold text-lg sm:text-xl ${isRevealed ? 'text-purple-400' : 'text-slate-200'}`}>
                  {letter ? letter.char : ''}
                </span>
              </div>
            )
          })}
        </div>

        {feedback && (
          <p className={`font-extrabold text-base bounce-in ${feedback === 'correct' ? 'text-emerald-400' : feedback === 'wrong' ? 'text-danger' : 'text-amber-400'}`}>
            {feedback === 'correct' ? '✓ Correct! +10 pts'
              : feedback === 'wrong' ? `✗ Wrong! It was: ${currentQ.word}`
              : `⏱ Time's up! Answer: ${currentQ.word}`}
          </p>
        )}

        {!feedback && (
          <div className="flex gap-2 flex-wrap justify-center">
            <button
              className="glass-card-light text-slate-400 rounded-lg px-3 py-1.5 text-sm hover:text-slate-200 transition-all hover:scale-105"
              onClick={() => setShowHint(h => !h)}
            >
              {showHint ? '🙈 Hide Hint' : '💡 Show Hint'}
            </button>
            <button
              className={`bg-purple-500/10 border border-purple-500/30 rounded-lg px-3 py-1.5 text-sm transition-all ${score <= 0 ? 'opacity-40 cursor-not-allowed text-slate-500' : 'text-purple-400 hover:bg-purple-500/20 hover:scale-105'}`}
              onClick={handleReveal}
              disabled={score <= 0}
            >
              🔍 Reveal Letter {score <= 0 ? <span className="text-slate-500 text-xs">(No pts)</span> : <span className="text-danger text-xs">(-5 pts)</span>}
            </button>
          </div>
        )}

        {showHint && !feedback && (
          <p className="text-amber-400 text-sm italic bg-amber-400/10 rounded-xl px-4 py-2 slide-up">💡 {currentQ.hint}</p>
        )}
      </div>

      {/* Letter Bank */}
      <div className="flex flex-col gap-2">
        <p className="text-slate-500 text-xs text-center uppercase tracking-wider">Available Letters — tap to place</p>
        <div className="flex gap-2 sm:gap-2.5 flex-wrap justify-center">
          {scrambled.map(letter => (
            <button
              key={letter.id}
              className="w-11 h-13 sm:w-12 sm:h-14 rounded-xl bg-gradient-to-b from-[#1e3a5f] to-[#162d4a] border-2 border-blue-500/60 text-slate-200 font-extrabold text-lg sm:text-xl hover:-translate-y-1.5 hover:scale-110 hover:shadow-[0_8px_20px_#3b82f640] hover:border-blue-400 active:scale-95 transition-all disabled:opacity-40"
              onClick={() => pickLetter(letter)}
              disabled={!!feedback}
              style={{ animation: 'fadeInUp 0.3s ease both' }}
            >
              {letter.char}
            </button>
          ))}
        </div>
      </div>

      <button
        className="glass-card text-slate-400 rounded-xl py-3 text-sm hover:text-slate-200 hover:bg-white/5 transition-all disabled:opacity-40"
        onClick={handleClear}
        disabled={!!feedback}
      >
        🗑️ Clear Answer
      </button>
    </div>
  )
}

export default WordScramble
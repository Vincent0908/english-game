import { useState, useEffect, useCallback } from 'react'
import { GameHeader, GameResult } from './VocabularyMatch'

// ===== EXPANDED GRAMMAR POOL (30+ questions) =====
const ALL_QUESTIONS = [
  // Tier 1 - Basic
  { question: 'She ___ to school every day.', options: ['go', 'goes', 'going', 'gone'], correct: 'goes', hint: 'Subject orang ketiga tunggal (he/she/it) → tambahkan -s/-es.', explanation: 'Subject "She" (third person singular) → Simple Present pakai "goes".', category: 'Subject-Verb Agreement', tier: 1 },
  { question: 'I ___ a student.', options: ['am', 'is', 'are', 'be'], correct: 'am', hint: '"I" selalu dipasangkan dengan satu bentuk to be tertentu.', explanation: '"I" selalu menggunakan "am" dalam Present Tense.', category: 'To Be', tier: 1 },
  { question: 'They ___ happy yesterday.', options: ['was', 'were', 'are', 'is'], correct: 'were', hint: '"They" adalah jamak, dan ini terjadi kemarin.', explanation: '"They" → plural → past tense "were".', category: 'To Be (Past)', tier: 1 },
  { question: 'She ___ English very well.', options: ['speak', 'speaks', 'speaking', 'spoken'], correct: 'speaks', hint: 'Simple Present untuk he/she/it.', explanation: 'Third person singular → verb + s: "speaks".', category: 'Simple Present', tier: 1 },
  { question: 'We ___ to the park last Sunday.', options: ['go', 'goes', 'went', 'going'], correct: 'went', hint: '"Last Sunday" menunjukkan waktu lampau.', explanation: 'Simple Past: "go" → "went" (irregular verb).', category: 'Simple Past', tier: 1 },

  // Tier 2 - Intermediate
  { question: 'They ___ watching TV when I called.', options: ['was', 'were', 'are', 'is'], correct: 'were', hint: '"They" adalah jamak. Past Continuous butuh "to be" bentuk lampau.', explanation: '"They" → plural → Past Continuous menggunakan "were".', category: 'Past Continuous', tier: 2 },
  { question: 'I have lived here ___ 2018.', options: ['since', 'for', 'from', 'at'], correct: 'since', hint: '2018 adalah titik waktu tertentu, bukan durasi.', explanation: '"Since" untuk titik waktu tertentu. "For" untuk durasi.', category: 'Preposition of Time', tier: 2 },
  { question: 'She is ___ honest student.', options: ['a', 'an', 'the', '-'], correct: 'an', hint: 'Perhatikan bunyi awal kata "honest" saat diucapkan.', explanation: '"An" sebelum bunyi vokal. "Honest" → /ɒnɪst/ → vokal.', category: 'Article', tier: 2 },
  { question: 'If it rains, we ___ stay at home.', options: ['will', 'would', 'shall', 'should'], correct: 'will', hint: 'Kondisi ini nyata dan mungkin terjadi.', explanation: 'Conditional Type 1: If + Simple Present → will + base verb.', category: 'Conditional', tier: 2 },
  { question: 'He ___ finish the task yet.', options: ["hasn't", "didn't", "isn't", "wasn't"], correct: "hasn't", hint: '"Yet" selalu dipakai bersama Present Perfect.', explanation: '"Yet" → Present Perfect: hasn\'t + past participle.', category: 'Present Perfect', tier: 2 },
  { question: 'The book was written ___ J.K. Rowling.', options: ['by', 'from', 'with', 'of'], correct: 'by', hint: 'Kalimat ini adalah Passive Voice.', explanation: 'Passive voice menggunakan "by" untuk menyebut pelaku.', category: 'Passive Voice', tier: 2 },
  { question: 'I have been waiting ___ two hours.', options: ['for', 'since', 'from', 'at'], correct: 'for', hint: '"Two hours" adalah durasi waktu, bukan titik waktu.', explanation: '"For" digunakan untuk durasi waktu.', category: 'Preposition of Time', tier: 2 },
  { question: 'She ___ already left when we arrived.', options: ['had', 'has', 'have', 'was'], correct: 'had', hint: 'Ada dua kejadian di masa lalu, mana yang lebih dulu?', explanation: 'Past Perfect: "had" + past participle untuk kejadian lebih dulu.', category: 'Past Perfect', tier: 2 },

  // Tier 3 - Advanced
  { question: 'She speaks English ___ than her brother.', options: ['more fluently', 'most fluently', 'fluenter', 'fluently'], correct: 'more fluently', hint: 'Membandingkan dua orang → comparative. "Fluently" adalah adverb panjang.', explanation: 'Comparative adverb: "more + adverb" untuk adverb panjang.', category: 'Comparative', tier: 3 },
  { question: 'Neither the students nor the teacher ___ ready.', options: ['was', 'were', 'are', 'is'], correct: 'was', hint: '"Neither...nor" → verb mengikuti subject terdekat.', explanation: '"The teacher" (singular) terdekat → "was".', category: 'Subject-Verb Agreement', tier: 3 },
  { question: "You ___ smoke here. It's prohibited.", options: ["mustn't", "don't have to", "shouldn't", "needn't"], correct: "mustn't", hint: '"Prohibited" artinya dilarang keras.', explanation: '"Mustn\'t" = dilarang keras. "Don\'t have to" = tidak wajib.', category: 'Modal Verb', tier: 3 },
  { question: 'I wish I ___ fly like a bird.', options: ['could', 'can', 'will', 'would'], correct: 'could', hint: '"Wish" menyatakan sesuatu yang tidak nyata.', explanation: '"Wish" untuk situasi tidak nyata → past modal "could".', category: 'Subjunctive', tier: 3 },
  { question: '___ you mind closing the window?', options: ['Would', 'Will', 'Do', 'Should'], correct: 'Would', hint: 'Ini adalah ekspresi sopan.', explanation: '"Would you mind + Verb-ing?" adalah ekspresi sopan.', category: 'Polite Request', tier: 3 },
  { question: 'She suggested ___ to the cinema.', options: ['going', 'to go', 'go', 'went'], correct: 'going', hint: '"Suggest" selalu diikuti gerund (-ing).', explanation: '"Suggest" selalu diikuti Verb-ing (gerund).', category: 'Gerund vs Infinitive', tier: 3 },
  { question: 'By next year, she ___ her degree.', options: ['will have completed', 'will complete', 'has completed', 'completes'], correct: 'will have completed', hint: 'Aksi selesai sebelum waktu tertentu di masa depan.', explanation: 'Future Perfect: will have + past participle.', category: 'Future Perfect', tier: 3 },
  { question: 'The news ___ surprising to everyone.', options: ['was', 'were', 'are', 'have been'], correct: 'was', hint: '"News" meskipun terdengar jamak, sebenarnya uncountable.', explanation: '"News" adalah uncountable noun → verb singular "was".', category: 'Uncountable Noun', tier: 3 },
  { question: 'He avoided ___ the question directly.', options: ['answering', 'to answer', 'answer', 'answered'], correct: 'answering', hint: '"Avoid" termasuk verb yang selalu diikuti gerund.', explanation: '"Avoid" + gerund (-ing form). Bukan infinitive.', category: 'Gerund vs Infinitive', tier: 3 },
  { question: 'The harder you work, ___ you will succeed.', options: ['the more likely', 'more likely', 'the most likely', 'likely'], correct: 'the more likely', hint: 'Pola "The + comparative... the + comparative...".', explanation: 'Double comparative: "The harder... the more likely..."', category: 'Double Comparative', tier: 3 },
  { question: 'Hardly ___ the door when the phone rang.', options: ['had I opened', 'I had opened', 'I opened', 'did I open'], correct: 'had I opened', hint: '"Hardly" di awal kalimat menyebabkan inversi (subjek & auxiliary bertukar).', explanation: 'Inversion setelah "Hardly": Hardly + had + S + PP.', category: 'Inversion', tier: 3 },
  { question: 'She looked ___ she had seen a ghost.', options: ['as if', 'like if', 'as', 'like'], correct: 'as if', hint: 'Setelah "looked" kita butuh konjungsi untuk klausa.', explanation: '"As if" / "as though" digunakan setelah verb seperti look, seem, feel.', category: 'Conjunction', tier: 3 },
  { question: 'Were I you, I ___ accept the offer.', options: ['would', 'will', 'shall', 'can'], correct: 'would', hint: '"Were I you" = "If I were you" → Conditional Type 2.', explanation: 'Subjunctive/Conditional Type 2: would + base verb.', category: 'Subjunctive', tier: 3 },
  { question: 'Little ___ he know about the surprise party.', options: ['did', 'does', 'was', 'had'], correct: 'did', hint: '"Little" di awal kalimat → inversi. Ini Simple Past.', explanation: 'Negative adverb inversion: Little + did + S + base verb.', category: 'Inversion', tier: 3 },
]

const DIFF_CONFIG = {
  easy:   { totalQ: 8,  timePerQ: 25, label: 'Easy' },
  normal: { totalQ: 10, timePerQ: 20, label: 'Normal' },
  hard:   { totalQ: 12, timePerQ: 14, label: 'Hard' },
}

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function GrammarQuiz({ navigate, completeGame, difficulty = 'normal' }) {
  const config = DIFF_CONFIG[difficulty]
  const TOTAL_QUESTIONS = config.totalQ
  const TIME_PER_QUESTION = config.timePerQ

  const [questions] = useState(() => {
    let pool
    if (difficulty === 'easy') pool = ALL_QUESTIONS.filter(q => q.tier <= 2)
    else if (difficulty === 'hard') pool = ALL_QUESTIONS.filter(q => q.tier >= 2)
    else pool = [...ALL_QUESTIONS]
    return shuffle(pool).slice(0, TOTAL_QUESTIONS)
  })
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [timer, setTimer] = useState(TIME_PER_QUESTION)
  const [phase, setPhase] = useState('playing')
  const [score, setScore] = useState(0)
  const [results, setResults] = useState([])
  const [streak, setStreak] = useState(0)
  const [showStreak, setShowStreak] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [lives, setLives] = useState(3)
  const [shakeScreen, setShakeScreen] = useState(false)
  const [shuffledOptions, setShuffledOptions] = useState([])

  const currentQ = questions[index]

  // Shuffle options each question
  useEffect(() => {
    if (currentQ) setShuffledOptions(shuffle([...currentQ.options]))
  }, [index])

  const handleAnswer = useCallback((option) => {
    if (isAnswered) return
    const ok = option === currentQ.correct
    setSelected(option)
    setIsAnswered(true)
    if (ok) {
      setStreak(prev => {
        const newStreak = prev + 1
        const pts = newStreak >= 3 ? 15 : 10
        const speedBonus = timer >= TIME_PER_QUESTION * 0.6 ? 5 : 0
        const finalPts = showHint ? Math.max(0, pts - 3) : pts
        setScore(s => s + finalPts + speedBonus)
        if (newStreak >= 3) { setShowStreak(true); setTimeout(() => setShowStreak(false), 1500) }
        return newStreak
      })
    } else {
      setStreak(0)
      if (option !== null) {
        setLives(l => {
          const newL = Math.max(0, l - 1)
          if (newL <= 0) setTimeout(() => setPhase('result'), 2000)
          return newL
        })
        setShakeScreen(true)
        setTimeout(() => setShakeScreen(false), 500)
      }
    }
    setResults(prev => [...prev, {
      question: currentQ.question,
      correct: currentQ.correct,
      chosen: option,
      explanation: currentQ.explanation,
      category: currentQ.category,
      isCorrect: ok,
    }])
    setTimeout(() => {
      if (lives <= 1 && !ok && option !== null) {
        setPhase('result')
      } else if (index + 1 >= TOTAL_QUESTIONS) {
        setPhase('result')
      } else {
        setIndex(i => i + 1)
      }
    }, 2000)
  }, [isAnswered, currentQ, index, showHint, timer, lives, TOTAL_QUESTIONS, TIME_PER_QUESTION])

  // Reset each question
  useEffect(() => {
    setSelected(null)
    setIsAnswered(false)
    setTimer(TIME_PER_QUESTION)
    setShowHint(false)
  }, [index])

  // Timer
  useEffect(() => {
    if (phase !== 'playing' || isAnswered) return
    if (timer === 0) { handleAnswer(null); return }
    const id = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [timer, isAnswered, phase, handleAnswer])

  if (phase === 'result') {
    const maxScore = TOTAL_QUESTIONS * 20
    const xp = Math.round((score / maxScore) * 200)
    const correct = results.filter(r => r.isCorrect).length
    const wrongCats = [...new Set(results.filter(r => !r.isCorrect).map(r => r.category))]
    const pct = Math.round((correct / results.length) * 100)
    const emoji = pct === 100 ? '🏆' : pct >= 70 ? '⭐' : pct >= 40 ? '👍' : '💪'

    return (
      <div className="min-h-screen bg-grammar px-4 sm:px-6 py-6 max-w-2xl mx-auto flex items-center">
        <div className="w-full glass-card border border-white/5 rounded-3xl px-6 sm:px-8 py-10 flex flex-col items-center gap-4 text-center shadow-[0_8px_40px_#0008]">
          <div className="text-7xl bounce-in">{emoji}</div>
          <h2 className="font-quest text-gold text-2xl" style={{ textShadow: '0 0 20px #ffd70030' }}>Quest Complete!</h2>

          <div className="grid grid-cols-3 gap-3 w-full">
            {[
              [score, 'Score', 'text-gold'],
              [`${correct}/${results.length}`, 'Correct', 'text-emerald-400'],
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
              <span className={`font-bold ${pct >= 70 ? 'text-emerald-400' : pct >= 40 ? 'text-amber-400' : 'text-danger'}`}>{pct}%</span>
            </div>
            <div className="bg-navy rounded-full h-3 overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${pct >= 70 ? 'bg-gradient-to-r from-emerald-500 to-teal' : pct >= 40 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-red-500 to-danger'}`} style={{ width: `${pct}%` }} />
            </div>
          </div>

          {wrongCats.length > 0 && (
            <div className="w-full glass-card rounded-xl p-4" style={{ borderColor: '#ff6b6b22', borderWidth: '1px' }}>
              <p className="text-danger font-bold text-sm mb-2">📚 Areas to Improve:</p>
              <div className="flex gap-2 flex-wrap justify-center">
                {wrongCats.map((c, i) => (
                  <span key={i} className="bg-danger/10 text-danger rounded-full px-2.5 py-0.5 text-xs font-bold">{c}</span>
                ))}
              </div>
            </div>
          )}

          <button
            className="glass-card-light text-slate-400 rounded-lg px-5 py-2 text-sm hover:text-slate-200 transition-all hover:scale-105"
            onClick={() => setShowDetail(d => !d)}
          >
            {showDetail ? '🙈 Hide Review' : '📋 Review Answers'}
          </button>

          {showDetail && (
            <div className="w-full flex flex-col gap-2 max-h-64 overflow-y-auto">
              {results.map((r, i) => (
                <div key={i} className={`glass-card rounded-xl px-4 py-3 text-left flex flex-col gap-1.5 ${r.isCorrect ? 'border-emerald-500/30' : 'border-danger/30'}`} style={{ borderWidth: '1px' }}>
                  <p className="text-sm text-slate-200 font-bold">{r.question}</p>
                  <p className={`text-xs font-bold ${r.isCorrect ? 'text-emerald-400' : 'text-danger'}`}>
                    {r.isCorrect ? `✓ ${r.correct}` : `✗ You: ${r.chosen ?? 'No answer'} → ${r.correct}`}
                  </p>
                  <p className="text-xs text-slate-500 italic">💡 {r.explanation}</p>
                </div>
              ))}
            </div>
          )}

          <button
            className="bg-gradient-to-br from-gold via-amber-500 to-[#ff8c00] rounded-xl px-8 py-3.5 text-dark font-extrabold text-base mt-2 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_#ffd70040] transition-all"
            onClick={() => completeGame('grammar', score, xp, correct, results.length)}
          >
            Back to Quest Map
          </button>
        </div>
      </div>
    )
  }

  const timerPct = (timer / TIME_PER_QUESTION) * 100
  const timerColor = timer <= 5 ? '#ff6b6b' : timer <= 10 ? '#f59e0b' : '#00e5a0'

  const getOptionClass = (option) => {
    const base = 'flex items-center gap-2.5 px-4 py-3.5 rounded-xl border text-left text-sm font-bold transition-all w-full duration-200'
    if (!isAnswered) return `${base} glass-card text-slate-200 hover:translate-x-1 hover:border-purple-400 hover:bg-purple-500/5 cursor-pointer`
    if (option === currentQ.correct) return `${base} bg-emerald-500/10 border-emerald-500 text-emerald-400`
    if (option === selected) return `${base} bg-danger/10 border-danger text-danger`
    return `${base} bg-panel/50 border-navy text-slate-600`
  }

  return (
    <div className={`min-h-screen bg-grammar px-4 sm:px-6 py-6 max-w-2xl mx-auto flex flex-col gap-4 ${shakeScreen ? 'shake' : ''}`}>
      {showStreak && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 via-red-500 to-purple-600 text-white font-extrabold text-sm px-7 py-3 rounded-full z-50 shadow-[0_4px_24px_#f59e0b44] fire-streak">
          🔥 {streak} Streak! Bonus +5 pts!
        </div>
      )}

      <GameHeader title="📖 Grammar Quiz" index={index} total={TOTAL_QUESTIONS} score={score} progress={index / TOTAL_QUESTIONS * 100} barColor="from-red-500 to-purple-500" navigate={navigate} lives={lives} streak={streak} />

      {/* Timer bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-navy rounded-full h-3 overflow-hidden relative">
          <div className="h-full rounded-full transition-all duration-1000 ease-linear" style={{ width: `${timerPct}%`, background: timerColor }} />
          <div className="absolute inset-0 xp-shimmer rounded-full" />
        </div>
        <span className="font-extrabold text-sm min-w-[32px]" style={{ color: timerColor }}>{timer}s</span>
      </div>

      {/* Category & streak */}
      <div className="flex justify-between items-center">
        <span className="glass-card-light text-slate-400 rounded-full px-3 py-1 text-xs font-bold">📂 {currentQ.category}</span>
        {streak >= 2 && (
          <span className="bg-amber-400/10 border border-amber-400/30 text-amber-400 rounded-full px-3 py-1 text-xs font-extrabold fire-streak">🔥 {streak} Streak!</span>
        )}
      </div>

      {/* Question card */}
      <div className="glass-card border border-white/5 rounded-2xl px-5 sm:px-6 py-7 text-center flex flex-col items-center gap-3 shadow-[0_4px_20px_#7c3aed10]">
        <p className="text-slate-500 text-[10px] uppercase tracking-wider">Question {index + 1}</p>
        <p className="text-slate-200 text-lg font-extrabold leading-relaxed bounce-in" key={index}>{currentQ.question}</p>

        {/* Hint button */}
        {!isAnswered && (
          <button
            className="bg-amber-400/10 border border-amber-400/30 text-amber-400 rounded-lg px-4 py-1.5 text-xs font-bold hover:bg-amber-400/20 hover:scale-105 transition-all"
            onClick={() => setShowHint(h => !h)}
          >
            {showHint ? '🙈 Hide Hint' : '💡 Show Hint'}
            <span className="text-danger ml-1.5 text-[10px]">(-3 pts)</span>
          </button>
        )}

        {showHint && !isAnswered && (
          <p className="text-amber-400 text-sm italic bg-amber-400/10 rounded-xl px-4 py-2 w-full slide-up">
            💡 {currentQ.hint}
          </p>
        )}
      </div>

      {/* Options - shuffled */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {shuffledOptions.map((option, i) => (
          <button
            key={`${index}-${i}`}
            className={getOptionClass(option)}
            onClick={() => handleAnswer(option)}
            disabled={isAnswered}
            style={{ animation: `fadeInUp 0.3s ${i * 0.05}s ease both` }}
          >
            <span className="bg-navy rounded-lg w-8 h-8 flex items-center justify-center text-xs font-extrabold text-slate-400 flex-shrink-0">
              {['A', 'B', 'C', 'D'][i]}
            </span>
            <span className="flex-1">{option}</span>
            {isAnswered && option === currentQ.correct && <span className="ml-auto text-emerald-400 text-lg">✓</span>}
            {isAnswered && option === selected && option !== currentQ.correct && <span className="ml-auto text-danger text-lg">✗</span>}
          </button>
        ))}
      </div>

      {/* Explanation after answer */}
      {isAnswered && (
        <div className={`glass-card rounded-2xl px-5 py-4 flex flex-col gap-2 bounce-in ${selected === currentQ.correct ? 'border-emerald-500/30' : 'border-danger/30'}`} style={{ borderWidth: '1px' }}>
          <p className="text-slate-200 font-extrabold text-sm">
            {selected === currentQ.correct ? '✅ Correct!' : selected === null ? "⏱ Time's up!" : '❌ Wrong!'}
            {selected === currentQ.correct && streak >= 3 && ' +5 Streak Bonus!'}
          </p>
          <p className="text-slate-500 text-xs leading-relaxed">💡 {currentQ.explanation}</p>
        </div>
      )}
    </div>
  )
}

export default GrammarQuiz
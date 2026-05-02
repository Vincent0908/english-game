import { useState, useEffect, useCallback } from 'react'
import { GameHeader } from './VocabularyMatch'

const ALL_QUESTIONS = [
  { question: 'She ___ to school every day.',                    options: ['go','goes','going','gone'],                              correct: 'goes',           explanation: 'Subject "She" (third person singular) → Simple Present pakai "goes" bukan "go".',  category: 'Subject-Verb Agreement' },
  { question: 'They ___ watching TV when I called.',             options: ['was','were','are','is'],                                 correct: 'were',           explanation: '"They" adalah plural → Past Continuous menggunakan "were", bukan "was".',          category: 'Past Continuous' },
  { question: 'I have lived here ___ 2018.',                     options: ['since','for','from','at'],                              correct: 'since',          explanation: '"Since" untuk titik waktu tertentu. "For" untuk durasi.',                           category: 'Preposition of Time' },
  { question: 'She is ___ honest student.',                      options: ['a','an','the','-'],                                     correct: 'an',             explanation: '"An" sebelum bunyi vokal. "Honest" diucapkan /ɒnɪst/ → vokal "o".',                category: 'Article' },
  { question: 'If it rains, we ___ stay at home.',               options: ['will','would','shall','should'],                        correct: 'will',           explanation: 'Conditional Type 1: If + Simple Present → will + base verb.',                      category: 'Conditional' },
  { question: 'He ___ finish the task yet.',                     options: ["hasn't","didn't","isn't","wasn't"],                     correct: "hasn't",         explanation: '"Yet" → Present Perfect: hasn\'t + past participle.',                              category: 'Present Perfect' },
  { question: 'The book was written ___ J.K. Rowling.',          options: ['by','from','with','of'],                               correct: 'by',             explanation: 'Passive voice menggunakan "by" untuk menyebut pelaku.',                             category: 'Passive Voice' },
  { question: 'She speaks English ___ than her brother.',        options: ['more fluently','most fluently','fluenter','fluently'],  correct: 'more fluently',  explanation: 'Comparative adverb: "more + adverb" untuk adverb panjang.',                         category: 'Comparative' },
  { question: 'Neither the students nor the teacher ___ ready.', options: ['was','were','are','is'],                               correct: 'was',            explanation: 'Neither...nor → verb ikuti subject terdekat. "The teacher" (singular) → "was".',   category: 'Subject-Verb Agreement' },
  { question: "You ___ smoke here. It's prohibited.",            options: ["mustn't","don't have to","shouldn't","needn't"],       correct: "mustn't",        explanation: '"Mustn\'t" = dilarang keras. "Don\'t have to" = tidak wajib.',                     category: 'Modal Verb' },
  { question: 'I wish I ___ fly like a bird.',                   options: ['could','can','will','would'],                          correct: 'could',          explanation: '"Wish" untuk situasi tidak nyata → past modal "could".',                           category: 'Subjunctive' },
  { question: '___ you mind closing the window?',                options: ['Would','Will','Do','Should'],                          correct: 'Would',          explanation: '"Would you mind + Verb-ing?" adalah ekspresi sopan yang paling umum.',             category: 'Polite Request' },
  { question: 'She suggested ___ to the cinema.',                options: ['going','to go','go','went'],                           correct: 'going',          explanation: '"Suggest" selalu diikuti Verb-ing (gerund).',                                       category: 'Gerund vs Infinitive' },
  { question: 'By next year, she ___ her degree.',               options: ['will have completed','will complete','has completed','completes'], correct: 'will have completed', explanation: 'Future Perfect: will have + past participle.', category: 'Future Perfect' },
  { question: 'The news ___ surprising to everyone.',            options: ['was','were','are','have been'],                        correct: 'was',            explanation: '"News" adalah uncountable noun → verb singular "was".',                            category: 'Uncountable Noun' },
]

const TOTAL_QUESTIONS = 10
const TIME_PER_QUESTION = 20

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function GrammarQuiz({ navigate, completeGame }) {
  // ✅ SEMUA useState harus di atas, tidak boleh di dalam if/kondisi
  const [questions]   = useState(() => shuffle(ALL_QUESTIONS).slice(0, TOTAL_QUESTIONS))
  const [index,        setIndex]      = useState(0)
  const [selected,     setSelected]   = useState(null)
  const [isAnswered,   setIsAnswered]  = useState(false)
  const [timer,        setTimer]      = useState(TIME_PER_QUESTION)
  const [phase,        setPhase]      = useState('playing')
  const [score,        setScore]      = useState(0)
  const [results,      setResults]    = useState([])
  const [streak,       setStreak]     = useState(0)
  const [showStreak,   setShowStreak] = useState(false)
  const [showDetail,   setShowDetail] = useState(false) // ✅ dipindah ke sini

  const currentQ = questions[index]

  // ✅ Pakai useCallback agar fungsi stabil dan bisa dipakai di useEffect
  const handleAnswer = useCallback((option) => {
    if (isAnswered) return
    const ok = option === currentQ.correct
    setSelected(option)
    setIsAnswered(true)
    if (ok) {
      setStreak(prev => {
        const newStreak = prev + 1
        const pts = newStreak >= 3 ? 15 : 10
        setScore(s => s + pts)
        if (newStreak >= 3) { setShowStreak(true); setTimeout(() => setShowStreak(false), 1500) }
        return newStreak
      })
    } else {
      setStreak(0)
    }
    setResults(prev => [...prev, {
      question:    currentQ.question,
      correct:     currentQ.correct,
      chosen:      option,
      explanation: currentQ.explanation,
      category:    currentQ.category,
      isCorrect:   ok,
    }])
    setTimeout(() => {
      if (index + 1 >= TOTAL_QUESTIONS) setPhase('result')
      else setIndex(i => i + 1)
    }, 2000)
  }, [isAnswered, currentQ, index])

  // Reset tiap soal baru
  useEffect(() => {
    setSelected(null)
    setIsAnswered(false)
    setTimer(TIME_PER_QUESTION)
  }, [index])

  // Timer
  useEffect(() => {
    if (phase !== 'playing' || isAnswered) return
    if (timer === 0) { handleAnswer(null); return }
    const id = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [timer, isAnswered, phase, handleAnswer])

  // ✅ Blok result sekarang hanya return JSX, tidak ada useState di dalamnya
  if (phase === 'result') {
    const maxScore = TOTAL_QUESTIONS * 15
    const xp       = Math.round((score / maxScore) * 200)
    const correct  = results.filter(r => r.isCorrect).length
    const wrongCats = [...new Set(results.filter(r => !r.isCorrect).map(r => r.category))]
    const pct       = Math.round((score / maxScore) * 100)
    const emoji     = pct === 100 ? '🏆' : pct >= 70 ? '⭐' : pct >= 40 ? '👍' : '💪'

    return (
      <div className="min-h-screen bg-grammar px-6 py-6 max-w-2xl mx-auto flex items-center">
        <div className="w-full bg-panel border border-dim rounded-3xl px-8 py-10 flex flex-col items-center gap-4 text-center">
          <p className="text-6xl">{emoji}</p>
          <h2 className="font-quest text-gold text-2xl">Quest Complete!</h2>
          <div className="grid grid-cols-3 gap-3 w-full">
            {[
              [score,           'Score',   'text-gold'],
              [`${correct}/${TOTAL_QUESTIONS}`, 'Correct', 'text-emerald-400'],
              [`+${xp}`,        'XP',      'text-purple-400'],
            ].map(([val, label, color], i) => (
              <div key={i} className="bg-navy rounded-xl p-4 border border-dim">
                <p className={`font-extrabold text-xl ${color}`}>{val}</p>
                <p className="text-slate-400 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>

          {wrongCats.length > 0 && (
            <div className="w-full bg-danger/5 border border-danger/20 rounded-xl p-4">
              <p className="text-danger font-bold text-sm mb-2">📚 Areas to Improve:</p>
              <div className="flex gap-2 flex-wrap justify-center">
                {wrongCats.map((c, i) => (
                  <span key={i} className="bg-danger/10 text-danger rounded-full px-2.5 py-0.5 text-xs font-bold">{c}</span>
                ))}
              </div>
            </div>
          )}

          <button
            className="bg-transparent border border-dim text-slate-400 rounded-lg px-5 py-2 text-sm hover:text-slate-200 transition-colors"
            onClick={() => setShowDetail(d => !d)}
          >
            {showDetail ? '🙈 Hide Review' : '📋 Review Answers'}
          </button>

          {showDetail && (
            <div className="w-full flex flex-col gap-2 max-h-72 overflow-y-auto">
              {results.map((r, i) => (
                <div key={i} className={`bg-navy rounded-xl px-4 py-3 border text-left flex flex-col gap-1.5 ${r.isCorrect ? 'border-emerald-500/30' : 'border-danger/30'}`}>
                  <p className="text-sm text-slate-200 font-bold">{r.question}</p>
                  <p className={`text-xs font-bold ${r.isCorrect ? 'text-emerald-400' : 'text-danger'}`}>
                    {r.isCorrect ? `✓ ${r.correct}` : `✗ You: ${r.chosen ?? 'No answer'} → ${r.correct}`}
                  </p>
                  <p className="text-xs text-slate-400 italic">💡 {r.explanation}</p>
                </div>
              ))}
            </div>
          )}

          <button
            className="bg-gradient-to-br from-gold to-[#ff8c00] rounded-xl px-8 py-3.5 text-dark font-extrabold text-base mt-2 hover:-translate-y-0.5 transition-all"
            onClick={() => completeGame('grammar', score, xp)}
          >
            Back to Quest Map
          </button>
        </div>
      </div>
    )
  }

  const timerPct  = (timer / TIME_PER_QUESTION) * 100
  const timerBg   = timer <= 5 ? 'bg-danger' : timer <= 10 ? 'bg-amber-400' : 'bg-teal'
  const timerText = timer <= 5 ? 'text-danger' : timer <= 10 ? 'text-amber-400' : 'text-teal'

  const getOptionClass = (option) => {
    const base = 'flex items-center gap-2.5 px-4 py-3.5 rounded-xl border text-left text-sm font-bold transition-all w-full'
    if (!isAnswered) return `${base} bg-panel border-dim text-slate-200 hover:translate-x-1 hover:border-blue-400 cursor-pointer`
    if (option === currentQ.correct) return `${base} bg-emerald-500/10 border-emerald-500 text-emerald-400`
    if (option === selected)         return `${base} bg-danger/10 border-danger text-danger`
    return `${base} bg-panel border-navy text-slate-600`
  }

  return (
    <div className="min-h-screen bg-grammar px-6 py-6 max-w-2xl mx-auto flex flex-col gap-4">
      {showStreak && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-red-500 text-white font-extrabold text-base px-7 py-3 rounded-full z-50 shadow-[0_4px_20px_#f59e0b44] animate-scaleIn">
          🔥 {streak} Streak! Bonus +5 pts!
        </div>
      )}

      <GameHeader title="📖 Grammar Quiz" index={index} total={TOTAL_QUESTIONS} score={score} progress={index / TOTAL_QUESTIONS * 100} barColor="from-red-500 to-purple-500" navigate={navigate} />

      <div className="flex items-center gap-3">
        <div className="flex-1 bg-navy rounded-full h-2.5 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${timerBg}`} style={{ width: `${timerPct}%` }} />
        </div>
        <span className={`font-extrabold text-sm min-w-[32px] ${timerText}`}>{timer}s</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="bg-navy border border-dim text-slate-400 rounded-full px-3 py-1 text-xs font-bold">📂 {currentQ.category}</span>
        {streak >= 2 && (
          <span className="bg-amber-400/10 border border-amber-400/30 text-amber-400 rounded-full px-3 py-1 text-xs font-extrabold">🔥 {streak} Streak!</span>
        )}
      </div>

      <div className="bg-panel border border-dim rounded-2xl px-6 py-7 text-center">
        <p className="text-slate-400 text-xs mb-3">Question {index + 1}</p>
        <p className="text-slate-200 text-lg font-extrabold leading-relaxed">{currentQ.question}</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {currentQ.options.map((option, i) => (
          <button key={i} className={getOptionClass(option)} onClick={() => handleAnswer(option)} disabled={isAnswered}>
            <span className="bg-navy rounded-md w-7 h-7 flex items-center justify-center text-xs font-extrabold text-slate-400 flex-shrink-0">
              {['A','B','C','D'][i]}
            </span>
            <span className="flex-1">{option}</span>
            {isAnswered && option === currentQ.correct && <span className="ml-auto text-emerald-400">✓</span>}
            {isAnswered && option === selected && option !== currentQ.correct && <span className="ml-auto text-danger">✗</span>}
          </button>
        ))}
      </div>

      {isAnswered && (
        <div className={`border rounded-2xl px-5 py-4 flex flex-col gap-2 ${selected === currentQ.correct ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-danger/30 bg-danger/5'}`}>
          <p className="text-slate-200 font-extrabold text-sm">
            {selected === currentQ.correct ? '✅ Correct!' : selected === null ? "⏱ Time's up!" : '❌ Wrong!'}
            {selected === currentQ.correct && streak >= 3 && ' +5 Bonus!'}
          </p>
          <p className="text-slate-400 text-xs leading-relaxed">💡 {currentQ.explanation}</p>
        </div>
      )}
    </div>
  )
}

export default GrammarQuiz
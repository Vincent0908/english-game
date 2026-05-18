import { useState, useEffect, useCallback } from 'react'
import { GameHeader, GameResult } from './VocabularyMatch'

// ===== EXPANDED SENTENCE POOL (25+ sentences) =====
const ALL_SENTENCES = [
  // Tier 1 - Simple
  { words: ['She','reads','books','every','day'],                   answer: 'She reads books every day',            translation: 'Dia membaca buku setiap hari',               tip: 'Subject + Verb + Object + Time',                     tier: 1 },
  { words: ['I','like','to','eat','pizza'],                         answer: 'I like to eat pizza',                  translation: 'Saya suka makan pizza',                      tip: 'Subject + Verb + to + Verb + Object',                tier: 1 },
  { words: ['The','dog','is','very','cute'],                        answer: 'The dog is very cute',                 translation: 'Anjing itu sangat lucu',                     tip: 'Subject + to be + adverb + adjective',               tier: 1 },
  { words: ['We','play','football','after','school'],               answer: 'We play football after school',        translation: 'Kami bermain sepak bola setelah sekolah',    tip: 'Subject + Verb + Object + Time',                     tier: 1 },
  { words: ['He','drinks','coffee','every','morning'],              answer: 'He drinks coffee every morning',       translation: 'Dia minum kopi setiap pagi',                 tip: 'Subject + Verb-s + Object + Time',                   tier: 1 },
  { words: ['My','sister','is','a','teacher'],                      answer: 'My sister is a teacher',               translation: 'Saudari saya adalah seorang guru',           tip: 'Possessive + Noun + to be + Article + Noun',         tier: 1 },

  // Tier 2 - Medium
  { words: ['They','are','playing','football','now'],               answer: 'They are playing football now',        translation: 'Mereka sedang bermain sepak bola sekarang',  tip: 'Present Continuous: Subject + are + Verb-ing',       tier: 2 },
  { words: ['I','will','visit','my','grandmother','tomorrow'],      answer: 'I will visit my grandmother tomorrow', translation: 'Saya akan mengunjungi nenek saya besok',     tip: 'Future: Subject + will + base verb',                 tier: 2 },
  { words: ['He','has','eaten','his','breakfast'],                  answer: 'He has eaten his breakfast',           translation: 'Dia sudah makan sarapannya',                 tip: 'Present Perfect: Subject + has + past participle',   tier: 2 },
  { words: ['The','cat','is','sleeping','on','the','sofa'],         answer: 'The cat is sleeping on the sofa',      translation: 'Kucing itu sedang tidur di sofa',            tip: 'Present Continuous dengan preposition',              tier: 2 },
  { words: ['We','studied','English','last','night'],               answer: 'We studied English last night',        translation: 'Kami belajar bahasa Inggris tadi malam',     tip: 'Simple Past: Subject + Verb-ed',                     tier: 2 },
  { words: ['She','can','speak','three','languages'],               answer: 'She can speak three languages',        translation: 'Dia bisa berbicara tiga bahasa',             tip: 'Modal verb: Subject + can + base verb',              tier: 2 },
  { words: ['My','father','works','at','a','hospital'],             answer: 'My father works at a hospital',        translation: 'Ayah saya bekerja di rumah sakit',           tip: 'Simple Present dengan preposition',                  tier: 2 },
  { words: ['The','students','are','very','hardworking'],           answer: 'The students are very hardworking',    translation: 'Para siswa sangat rajin',                    tip: 'Subject + to be + adjective',                        tier: 2 },

  // Tier 3 - Complex
  { words: ['I','have','never','been','to','Japan'],                answer: 'I have never been to Japan',           translation: 'Saya belum pernah pergi ke Jepang',          tip: 'Present Perfect dengan never',                       tier: 3 },
  { words: ['She','was','cooking','when','I','arrived'],            answer: 'She was cooking when I arrived',       translation: 'Dia sedang memasak ketika saya tiba',        tip: 'Past Continuous + Simple Past',                      tier: 3 },
  { words: ['You','should','drink','more','water'],                 answer: 'You should drink more water',          translation: 'Kamu seharusnya minum lebih banyak air',     tip: 'Modal: Subject + should + base verb',                tier: 3 },
  { words: ['If','it','rains','we','will','stay','home'],           answer: 'If it rains we will stay home',        translation: 'Jika hujan kita akan tinggal di rumah',      tip: 'Conditional Type 1: If + Present → will + base verb', tier: 3 },
  { words: ['The','book','was','written','by','a','famous','author'], answer: 'The book was written by a famous author', translation: 'Buku itu ditulis oleh penulis terkenal',  tip: 'Passive Voice: was + past participle + by',          tier: 3 },
  { words: ['They','had','already','left','when','we','arrived'],   answer: 'They had already left when we arrived', translation: 'Mereka sudah pergi ketika kami tiba',        tip: 'Past Perfect: had + past participle',                tier: 3 },
  { words: ['She','has','been','studying','for','three','hours'],   answer: 'She has been studying for three hours', translation: 'Dia sudah belajar selama tiga jam',          tip: 'Present Perfect Continuous: has been + Verb-ing',    tier: 3 },
  { words: ['I','would','have','called','you','if','I','had','known'], answer: 'I would have called you if I had known', translation: 'Saya akan meneleponmu jika saya tahu',    tip: 'Conditional Type 3: would have + PP, if + had + PP',  tier: 3 },
  { words: ['Not','only','does','she','sing','but','she','also','dances'], answer: 'Not only does she sing but she also dances', translation: 'Dia tidak hanya menyanyi tapi juga menari', tip: 'Correlative conjunction: Not only...but also', tier: 3 },
]

const DIFF_CONFIG = {
  easy:   { totalQ: 6,  timePerQ: 35, label: 'Easy' },
  normal: { totalQ: 8,  timePerQ: 25, label: 'Normal' },
  hard:   { totalQ: 10, timePerQ: 18, label: 'Hard' },
}

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function SentenceBuilder({ navigate, completeGame, difficulty = 'normal' }) {
  const config = DIFF_CONFIG[difficulty]
  const TOTAL_QUESTIONS = config.totalQ
  const TIME_PER_QUESTION = config.timePerQ

  const [questions]       = useState(() => {
    let pool
    if (difficulty === 'easy') pool = ALL_SENTENCES.filter(s => s.tier <= 2)
    else if (difficulty === 'hard') pool = ALL_SENTENCES.filter(s => s.tier >= 2)
    else pool = [...ALL_SENTENCES]
    return shuffle(pool).slice(0, TOTAL_QUESTIONS)
  })
  const [index,            setIndex]           = useState(0)
  const [wordBank,         setWordBank]        = useState([])
  const [answer,           setAnswer]          = useState([])
  const [timer,            setTimer]           = useState(TIME_PER_QUESTION)
  const [phase,            setPhase]           = useState('playing')
  const [feedback,         setFeedback]        = useState(null)
  const [score,            setScore]           = useState(0)
  const [results,          setResults]         = useState([])
  const [showTip,          setShowTip]         = useState(false)
  const [showTranslation,  setShowTranslation] = useState(false)
  const [lives,            setLives]           = useState(3)
  const [streak,           setStreak]          = useState(0)
  const [shakeScreen,      setShakeScreen]     = useState(false)

  const currentQ = questions[index]

  // Reset each question
  useEffect(() => {
    setWordBank(shuffle(currentQ.words).map((word, i) => ({ word, id: `${i}-${word}` })))
    setAnswer([])
    setTimer(TIME_PER_QUESTION)
    setFeedback(null)
    setShowTip(false)
    setShowTranslation(false)
  }, [index])

  const goNext = useCallback(() => {
    setTimeout(() => {
      if (lives <= 0) { setPhase('result'); return }
      if (index + 1 >= TOTAL_QUESTIONS) setPhase('result')
      else setIndex(i => i + 1)
    }, 1500)
  }, [index, lives, TOTAL_QUESTIONS])

  const handleTimeout = useCallback(() => {
    setFeedback('timeout')
    setStreak(0)
    setResults(p => [...p, { answer: currentQ.answer, translation: currentQ.translation, isCorrect: false }])
    setLives(l => {
      const newL = Math.max(0, l - 1)
      if (newL <= 0) setTimeout(() => setPhase('result'), 1500)
      return newL
    })
    setShakeScreen(true)
    setTimeout(() => setShakeScreen(false), 500)
    goNext()
  }, [currentQ.answer, currentQ.translation, goNext])

  const checkAnswer = useCallback((cur) => {
    const ok = cur.map(w => w.word).join(' ') === currentQ.answer
    setFeedback(ok ? 'correct' : 'wrong')
    if (ok) {
      const speedBonus = timer >= TIME_PER_QUESTION * 0.5 ? 5 : 0
      const streakBonus = streak >= 3 ? 5 : 0
      setScore(s => s + 10 + speedBonus + streakBonus)
      setStreak(s => s + 1)
    } else {
      setStreak(0)
      setLives(l => {
        const newL = Math.max(0, l - 1)
        if (newL <= 0) setTimeout(() => setPhase('result'), 1500)
        return newL
      })
      setShakeScreen(true)
      setTimeout(() => setShakeScreen(false), 500)
    }
    setResults(p => [...p, { answer: currentQ.answer, translation: currentQ.translation, isCorrect: ok }])
    goNext()
  }, [currentQ.answer, currentQ.translation, goNext, timer, streak, TIME_PER_QUESTION])

  // Timer
  useEffect(() => {
    if (phase !== 'playing' || feedback) return
    if (timer === 0) { handleTimeout(); return }
    const id = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [timer, phase, feedback, handleTimeout])

  const pickWord = (wordObj) => {
    if (feedback) return
    const newAnswer = [...answer, wordObj]
    setWordBank(p => p.filter(w => w.id !== wordObj.id))
    setAnswer(newAnswer)
    if (newAnswer.length === currentQ.words.length) checkAnswer(newAnswer)
  }

  const returnWord = (wordObj) => {
    if (feedback) return
    setAnswer(p => p.filter(w => w.id !== wordObj.id))
    setWordBank(p => [...p, wordObj])
  }

  const handleClear = () => {
    if (feedback) return
    setWordBank(p => [...p, ...answer])
    setAnswer([])
  }

  if (phase === 'result') {
    const correctCount = results.filter(r => r.isCorrect).length
    const xp = Math.round((score / (TOTAL_QUESTIONS * 15)) * 150)
    return (
      <GameResult score={score} total={TOTAL_QUESTIONS} xp={xp} correctCount={correctCount} onFinish={() => completeGame('sentence', score, xp, correctCount, results.length)}>
        {results.map((r, i) => (
          <div key={i} className={`flex justify-between items-center glass-card rounded-xl px-4 py-3 gap-3 ${r.isCorrect ? 'border-emerald-500/30' : 'border-danger/30'}`} style={{ borderWidth: '1px' }}>
            <div className="text-left">
              <p className="font-bold text-sm text-slate-200">{r.answer}</p>
              <p className="text-xs text-slate-500 mt-0.5">{r.translation}</p>
            </div>
            <span className={`font-bold flex-shrink-0 ${r.isCorrect ? 'text-emerald-400' : 'text-danger'}`}>
              {r.isCorrect ? '✓' : '✗'}
            </span>
          </div>
        ))}
      </GameResult>
    )
  }

  const timerPct = (timer / TIME_PER_QUESTION) * 100
  const timerColor = timer <= 7 ? '#ff6b6b' : timer <= 12 ? '#f59e0b' : '#00e5a0'
  const cardBorder = feedback === 'correct' ? 'border-emerald-500 bg-emerald-500/5' : feedback ? 'border-danger bg-danger/5' : 'border-white/5'

  return (
    <div className={`min-h-screen bg-game px-4 sm:px-6 py-6 max-w-2xl mx-auto flex flex-col gap-5 ${shakeScreen ? 'shake' : ''}`}>
      <GameHeader title="📝 Sentence Builder" index={index} total={TOTAL_QUESTIONS} score={score} progress={index / TOTAL_QUESTIONS * 100} barColor="from-amber-400 to-orange-500" navigate={navigate} lives={lives} streak={streak} />

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
          <span className={`absolute inset-0 flex items-center justify-center font-extrabold text-xl ${timer <= 7 ? 'text-danger' : 'text-slate-200'}`}>
            {timer}
          </span>
        </div>
      </div>

      {/* Question card */}
      <div className={`glass-card border rounded-2xl px-5 sm:px-6 py-6 flex flex-col items-center gap-4 transition-all ${cardBorder} ${feedback === 'correct' ? 'flash-correct' : feedback ? 'flash-wrong' : ''}`}>
        <div className="flex items-center gap-2">
          <p className="text-slate-500 text-xs uppercase tracking-wider">Arrange the words into a correct sentence</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-500">{currentQ.words.length} words</span>
        </div>

        {/* Answer area */}
        <div className="w-full min-h-[72px] bg-dark/50 rounded-xl border border-dashed border-dim/50 flex items-center justify-center p-3">
          {answer.length === 0
            ? <p className="text-slate-600 text-sm italic">Tap words below to build your sentence...</p>
            : <div className="flex flex-wrap gap-2 justify-center">
                {answer.map((w, i) => (
                  <button
                    key={w.id}
                    className="bg-gradient-to-b from-[#1e3a5f] to-[#162d4a] border border-blue-500/60 text-slate-200 rounded-lg px-3.5 py-2 text-sm font-bold hover:bg-[#1a3050] hover:scale-95 transition-all"
                    onClick={() => returnWord(w)}
                    style={{ animation: `scaleIn 0.2s ${i * 0.03}s ease both` }}
                  >
                    {w.word}
                  </button>
                ))}
              </div>
          }
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="text-center flex flex-col gap-1.5 w-full bounce-in">
            <p className={`font-extrabold text-sm ${feedback === 'correct' ? 'text-emerald-400' : feedback === 'wrong' ? 'text-danger' : 'text-amber-400'}`}>
              {feedback === 'correct' ? '✓ Perfect! +10 pts' : feedback === 'wrong' ? '✗ Not quite right!' : "⏱ Time's up!"}
            </p>
            <p className="text-emerald-400 font-bold text-sm bg-emerald-500/10 rounded-xl px-4 py-2">✅ {currentQ.answer}</p>
            <p className="text-slate-500 text-xs">🇮🇩 {currentQ.translation}</p>
          </div>
        )}

        {/* Help buttons */}
        {!feedback && (
          <div className="flex gap-2 flex-wrap justify-center">
            <button
              className="glass-card-light text-slate-400 rounded-lg px-3 py-1.5 text-sm hover:text-slate-200 transition-all hover:scale-105"
              onClick={() => setShowTranslation(h => !h)}
            >
              🇮🇩 {showTranslation ? 'Hide' : 'Translation'}
            </button>
            <button
              className="glass-card-light text-slate-400 rounded-lg px-3 py-1.5 text-sm hover:text-slate-200 transition-all hover:scale-105"
              onClick={() => setShowTip(h => !h)}
            >
              📐 {showTip ? 'Hide' : 'Grammar Tip'}
            </button>
          </div>
        )}
        {showTranslation && !feedback && (
          <p className="text-amber-400 text-sm italic bg-amber-400/10 rounded-xl px-4 py-2 w-full text-center slide-up">🇮🇩 {currentQ.translation}</p>
        )}
        {showTip && !feedback && (
          <p className="text-purple-400 text-sm italic bg-purple-400/10 rounded-xl px-4 py-2 w-full text-center slide-up">📐 {currentQ.tip}</p>
        )}
      </div>

      {/* Word Bank */}
      <div className="flex flex-col gap-2">
        <p className="text-slate-500 text-xs text-center uppercase tracking-wider">Available Words — tap to place</p>
        <div className="flex gap-2 sm:gap-2.5 flex-wrap justify-center">
          {wordBank.map((w, i) => (
            <button
              key={w.id}
              className="bg-gradient-to-b from-[#2a3a1a] to-[#1a2a14] border-2 border-amber-400/60 text-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold hover:-translate-y-1.5 hover:shadow-[0_8px_20px_#f59e0b30] hover:border-amber-400 active:scale-95 transition-all disabled:opacity-40"
              onClick={() => pickWord(w)}
              disabled={!!feedback}
              style={{ animation: `fadeInUp 0.3s ${i * 0.04}s ease both` }}
            >
              {w.word}
            </button>
          ))}
        </div>
      </div>

      <button
        className="glass-card text-slate-400 rounded-xl py-3 text-sm hover:text-slate-200 hover:bg-white/5 transition-all disabled:opacity-40"
        onClick={handleClear}
        disabled={!!feedback || !answer.length}
      >
        🗑️ Clear Sentence
      </button>
    </div>
  )
}

export default SentenceBuilder
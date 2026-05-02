import { useState, useEffect, useCallback } from 'react'
import { GameHeader } from './VocabularyMatch'

const ALL_SENTENCES = [
  { words: ['She','reads','books','every','day'],                  answer: 'She reads books every day',           translation: 'Dia membaca buku setiap hari',              tip: 'Subject + Verb + Object + Time' },
  { words: ['They','are','playing','football','now'],              answer: 'They are playing football now',        translation: 'Mereka sedang bermain sepak bola sekarang', tip: 'Present Continuous: Subject + are + Verb-ing' },
  { words: ['I','will','visit','my','grandmother','tomorrow'],     answer: 'I will visit my grandmother tomorrow', translation: 'Saya akan mengunjungi nenek saya besok',     tip: 'Future: Subject + will + base verb' },
  { words: ['He','has','eaten','his','breakfast'],                 answer: 'He has eaten his breakfast',          translation: 'Dia sudah makan sarapannya',                tip: 'Present Perfect: Subject + has + past participle' },
  { words: ['The','cat','is','sleeping','on','the','sofa'],        answer: 'The cat is sleeping on the sofa',     translation: 'Kucing itu sedang tidur di sofa',           tip: 'Present Continuous dengan preposition' },
  { words: ['We','studied','English','last','night'],              answer: 'We studied English last night',       translation: 'Kami belajar bahasa Inggris tadi malam',    tip: 'Simple Past: Subject + Verb-ed' },
  { words: ['She','can','speak','three','languages'],              answer: 'She can speak three languages',       translation: 'Dia bisa berbicara tiga bahasa',            tip: 'Modal verb: Subject + can + base verb' },
  { words: ['My','father','works','at','a','hospital'],            answer: 'My father works at a hospital',       translation: 'Ayah saya bekerja di rumah sakit',          tip: 'Simple Present dengan preposition' },
  { words: ['The','students','are','very','hardworking'],          answer: 'The students are very hardworking',   translation: 'Para siswa sangat rajin',                   tip: 'Subject + to be + adjective' },
  { words: ['I','have','never','been','to','Japan'],               answer: 'I have never been to Japan',          translation: 'Saya belum pernah pergi ke Jepang',         tip: 'Present Perfect dengan never' },
  { words: ['She','was','cooking','when','I','arrived'],           answer: 'She was cooking when I arrived',      translation: 'Dia sedang memasak ketika saya tiba',       tip: 'Past Continuous + Simple Past' },
  { words: ['You','should','drink','more','water'],                answer: 'You should drink more water',         translation: 'Kamu seharusnya minum lebih banyak air',    tip: 'Modal: Subject + should + base verb' },
]

const TOTAL_QUESTIONS = 8
const TIME_PER_QUESTION = 25

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function SentenceBuilder({ navigate, completeGame }) {
  const [questions]       = useState(() => shuffle(ALL_SENTENCES).slice(0, TOTAL_QUESTIONS))
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

  const currentQ = questions[index]

  // Reset tiap soal baru
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
      if (index + 1 >= TOTAL_QUESTIONS) setPhase('result')
      else setIndex(i => i + 1)
    }, 1500)
  }, [index])

  const handleTimeout = useCallback(() => {
    setFeedback('timeout')
    setResults(p => [...p, { answer: currentQ.answer, translation: currentQ.translation, isCorrect: false }])
    goNext()
  }, [currentQ.answer, currentQ.translation, goNext])

  const checkAnswer = useCallback((cur) => {
    const ok = cur.map(w => w.word).join(' ') === currentQ.answer
    setFeedback(ok ? 'correct' : 'wrong')
    if (ok) setScore(s => s + 10)
    setResults(p => [...p, { answer: currentQ.answer, translation: currentQ.translation, isCorrect: ok }])
    goNext()
  }, [currentQ.answer, currentQ.translation, goNext])

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
    const xp = Math.round((score / (TOTAL_QUESTIONS * 10)) * 150)
    const emoji = score >= TOTAL_QUESTIONS * 7 ? '🏆' : score >= TOTAL_QUESTIONS * 4 ? '⭐' : '💪'
    return (
      <div className="min-h-screen bg-game px-6 py-6 max-w-2xl mx-auto flex items-center">
        <div className="w-full bg-panel border border-dim rounded-3xl px-8 py-10 flex flex-col items-center gap-4 text-center">
          <p className="text-6xl">{emoji}</p>
          <h2 className="font-quest text-gold text-2xl">Quest Complete!</h2>
          <p className="text-5xl font-extrabold text-slate-200">
            {score} <span className="text-lg text-slate-400">/ {TOTAL_QUESTIONS * 10} pts</span>
          </p>
          <p className="text-gold font-bold">+{xp} XP earned!</p>
          <div className="w-full flex flex-col gap-2 max-h-72 overflow-y-auto mt-2">
            {results.map((r, i) => (
              <div key={i} className={`flex justify-between items-center bg-navy rounded-xl px-4 py-3 border gap-3 ${r.isCorrect ? 'border-emerald-500/30' : 'border-danger/30'}`}>
                <div className="text-left">
                  <p className="font-bold text-sm text-slate-200">{r.answer}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{r.translation}</p>
                </div>
                <span className={`font-bold flex-shrink-0 ${r.isCorrect ? 'text-emerald-400' : 'text-danger'}`}>
                  {r.isCorrect ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
          <button
            className="bg-gradient-to-br from-gold to-[#ff8c00] rounded-xl px-8 py-3.5 text-dark font-extrabold text-base mt-2 hover:-translate-y-0.5 transition-all"
            onClick={() => completeGame('sentence', score, xp)}
          >
            Back to Quest Map
          </button>
        </div>
      </div>
    )
  }

  const timerColor = timer <= 7 ? 'border-danger text-danger' : timer <= 12 ? 'border-amber-400 text-amber-400' : 'border-teal text-teal'
  const cardBorder = feedback === 'correct' ? 'border-emerald-500 bg-emerald-500/5' : feedback ? 'border-danger bg-danger/5' : 'border-dim bg-panel'

  return (
    <div className="min-h-screen bg-game px-6 py-6 max-w-2xl mx-auto flex flex-col gap-5">
      <GameHeader title="📝 Sentence Builder" index={index} total={TOTAL_QUESTIONS} score={score} progress={index / TOTAL_QUESTIONS * 100} barColor="from-amber-400 to-red-500" navigate={navigate} />

      <div className="flex flex-col items-center gap-1">
        <div className={`w-14 h-14 rounded-full border-[3px] flex items-center justify-center text-xl font-extrabold transition-colors ${timerColor}`}>{timer}</div>
        <p className="text-slate-400 text-xs">seconds left</p>
      </div>

      <div className={`border rounded-2xl px-6 py-6 flex flex-col items-center gap-4 transition-all ${cardBorder}`}>
        <p className="text-slate-400 text-sm text-center">Arrange the words into a correct sentence:</p>

        {/* Area Jawaban */}
        <div className="w-full min-h-[72px] bg-dark rounded-xl border border-dashed border-dim flex items-center justify-center p-3">
          {answer.length === 0
            ? <p className="text-slate-600 text-sm italic">Tap words below to build your sentence...</p>
            : <div className="flex flex-wrap gap-2 justify-center">
                {answer.map(w => (
                  <button
                    key={w.id}
                    className="bg-[#1e3a5f] border border-blue-500 text-slate-200 rounded-lg px-3.5 py-2 text-sm font-bold hover:bg-[#162d4a] hover:scale-95 transition-all"
                    onClick={() => returnWord(w)}
                  >
                    {w.word}
                  </button>
                ))}
              </div>
          }
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="text-center flex flex-col gap-1.5 w-full">
            <p className={`font-extrabold text-sm ${feedback === 'correct' ? 'text-emerald-400' : feedback === 'wrong' ? 'text-danger' : 'text-amber-400'}`}>
              {feedback === 'correct' ? '✓ Perfect! +10 pts' : feedback === 'wrong' ? '✗ Not quite right!' : "⏱ Time's up!"}
            </p>
            <p className="text-emerald-400 font-bold text-sm bg-emerald-500/10 rounded-xl px-4 py-2">✅ {currentQ.answer}</p>
            <p className="text-slate-400 text-xs">🇮🇩 {currentQ.translation}</p>
          </div>
        )}

        {/* Tombol Bantuan */}
        {!feedback && (
          <div className="flex gap-2 flex-wrap justify-center">
            <button
              className="bg-transparent border border-dim text-slate-400 rounded-lg px-3 py-1.5 text-sm hover:text-slate-200 transition-colors"
              onClick={() => setShowTranslation(h => !h)}
            >
              🇮🇩 {showTranslation ? 'Hide' : 'Translation'}
            </button>
            <button
              className="bg-transparent border border-dim text-slate-400 rounded-lg px-3 py-1.5 text-sm hover:text-slate-200 transition-colors"
              onClick={() => setShowTip(h => !h)}
            >
              📐 {showTip ? 'Hide' : 'Grammar Tip'}
            </button>
          </div>
        )}
        {showTranslation && !feedback && (
          <p className="text-amber-400 text-sm italic bg-amber-400/10 rounded-xl px-4 py-2 w-full text-center">🇮🇩 {currentQ.translation}</p>
        )}
        {showTip && !feedback && (
          <p className="text-purple-400 text-sm italic bg-purple-400/10 rounded-xl px-4 py-2 w-full text-center">📐 {currentQ.tip}</p>
        )}
      </div>

      {/* Bank Kata */}
      <div className="flex flex-col gap-2">
        <p className="text-slate-400 text-sm text-center">Available Words — tap to place:</p>
        <div className="flex gap-2.5 flex-wrap justify-center">
          {wordBank.map(w => (
            <button
              key={w.id}
              className="bg-[#1a2a1a] border-2 border-amber-400 text-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold hover:-translate-y-1 hover:shadow-[0_6px_16px_#f59e0b40] active:scale-95 transition-all disabled:opacity-40"
              onClick={() => pickWord(w)}
              disabled={!!feedback}
            >
              {w.word}
            </button>
          ))}
        </div>
      </div>

      <button
        className="bg-transparent border border-dim text-slate-400 rounded-xl py-3 text-sm hover:text-slate-200 transition-colors disabled:opacity-40"
        onClick={handleClear}
        disabled={!!feedback || !answer.length}
      >
        🗑️ Clear Sentence
      </button>
    </div>
  )
}

export default SentenceBuilder
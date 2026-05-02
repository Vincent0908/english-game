import { useState, useEffect } from 'react'
import { GameHeader, GameResult } from './VocabularyMatch'

const ALL_WORDS = [
  { word: 'ADVENTURE',  hint: 'An exciting or unusual experience' },
  { word: 'BEAUTIFUL',  hint: 'Pleasing to the senses or mind' },
  { word: 'CHALLENGE',  hint: 'Something difficult that requires effort' },
  { word: 'DISCOVER',   hint: 'To find something for the first time' },
  { word: 'ELEPHANT',   hint: 'The largest land animal on Earth' },
  { word: 'FREEDOM',    hint: 'The power to act or speak without restraint' },
  { word: 'GRATEFUL',   hint: 'Feeling thankful for something received' },
  { word: 'HORIZON',    hint: 'The line where sky meets the earth' },
  { word: 'IMAGINE',    hint: 'To form a picture in your mind' },
  { word: 'JOURNEY',    hint: 'Traveling from one place to another' },
  { word: 'KNOWLEDGE',  hint: 'Facts and information acquired through learning' },
  { word: 'LANGUAGE',   hint: 'A system of communication used by people' },
  { word: 'MOUNTAIN',   hint: 'A large natural elevation of earth' },
  { word: 'NOTEBOOK',   hint: 'A book with blank pages for writing' },
  { word: 'PATIENCE',   hint: 'Calm endurance of hardship or delay' },
  { word: 'QUESTION',   hint: 'A sentence asking for information' },
  { word: 'RAINBOW',    hint: 'A colorful arc seen after rain' },
  { word: 'STRENGTH',   hint: 'Physical or mental power and energy' },
  { word: 'TREASURE',   hint: 'A collection of valuable things' },
  { word: 'UNIVERSE',   hint: 'All of space and everything in it' },
]

const TOTAL_QUESTIONS = 8
const TIME_PER_QUESTION = 20

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }
function scrambleWord(word) {
  let r; do { r = shuffle(word.split('')).join('') } while (r === word); return r
}

function WordScramble({ navigate, completeGame }) {
  const [questions]         = useState(() => shuffle(ALL_WORDS).slice(0, TOTAL_QUESTIONS))
  const [index,              setIndex]            = useState(0)
  const [scrambled,          setScrambled]        = useState([])
  const [answer,             setAnswer]           = useState([])
  const [timer,              setTimer]            = useState(TIME_PER_QUESTION)
  const [phase,              setPhase]            = useState('playing')
  const [feedback,           setFeedback]         = useState(null)
  const [score,              setScore]            = useState(0)
  const [results,            setResults]          = useState([])
  const [showHint,           setShowHint]         = useState(false)
  const [revealedPositions,  setRevealedPositions] = useState([])

  const currentQ = questions[index]

  useEffect(() => {
    setScrambled(scrambleWord(currentQ.word).split('').map((char, i) => ({ char, id: `${i}-${char}` })))
    setAnswer([]); setTimer(TIME_PER_QUESTION); setFeedback(null); setShowHint(false); setRevealedPositions([])
  }, [index])

  useEffect(() => {
    if (phase !== 'playing' || feedback !== null) return
    if (timer === 0) { handleTimeout(); return }
    const id = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [timer, phase, feedback])

  useEffect(() => {
    if (!answer.length) return
    if (answer.filter(Boolean).length === currentQ.word.length) {
      const typed = currentQ.word.split('').map((_, i) => answer[i]?.char ?? '').join('')
      handleResult(typed === currentQ.word)
    }
  }, [answer])

  const goNext = () => setTimeout(() => { if (index + 1 >= TOTAL_QUESTIONS) setPhase('result'); else setIndex(i => i + 1) }, 1200)

  const handleTimeout = () => { setFeedback('timeout'); setResults(p => [...p, { word: currentQ.word, isCorrect: false }]); goNext() }
  const handleResult  = (ok) => { setFeedback(ok ? 'correct' : 'wrong'); if (ok) setScore(s => s + 10); setResults(p => [...p, { word: currentQ.word, isCorrect: ok }]); goNext() }

  const pickLetter = (letter) => {
    if (feedback) return
    setScrambled(p => p.filter(l => l.id !== letter.id))
    setAnswer(p => { const a = [...p]; const ei = currentQ.word.split('').findIndex((_, i) => !a[i]); if (ei !== -1) a[ei] = letter; return a })
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
    const unfilled = currentQ.word.split('').map((char, i) => ({ char, i })).filter(({ i }) => !answer[i] && !revealedPositions.includes(i))
    if (!unfilled.length) return
    const { char, i: pos } = unfilled[0]
    setRevealedPositions(p => [...p, pos]); setScore(s => Math.max(0, s - 5))
    const inBank = scrambled.find(l => l.char === char)
    if (inBank) { setScrambled(p => p.filter(l => l.id !== inBank.id)); setAnswer(p => { const a = [...p]; a[pos] = inBank; return a }) }
  }

  if (phase === 'result') {
    const xp = Math.round((score / (TOTAL_QUESTIONS * 10)) * 100)
    return (
      <GameResult score={score} total={TOTAL_QUESTIONS} xp={xp} onFinish={() => completeGame('scramble', score, xp)}>
        {results.map((r, i) => (
          <div key={i} className={`flex justify-between items-center bg-navy rounded-xl px-4 py-2.5 border text-sm gap-3 ${r.isCorrect ? 'border-emerald-500/30' : 'border-danger/30'}`}>
            <span className="font-extrabold tracking-widest text-slate-200">{r.word}</span>
            <span className={`font-bold ${r.isCorrect ? 'text-emerald-400' : 'text-danger'}`}>{r.isCorrect ? '✓ Correct' : '✗ Wrong'}</span>
          </div>
        ))}
      </GameResult>
    )
  }

  const timerColor   = timer <= 5 ? 'border-danger text-danger' : timer <= 10 ? 'border-amber-400 text-amber-400' : 'border-teal text-teal'
  const cardBorder   = feedback === 'correct' ? 'border-emerald-500 bg-emerald-500/5' : feedback ? 'border-danger bg-danger/5' : 'border-dim bg-panel'

  return (
    <div className="min-h-screen bg-game px-6 py-6 max-w-2xl mx-auto flex flex-col gap-5">
      <GameHeader title="🔀 Word Scramble" index={index} total={TOTAL_QUESTIONS} score={score} progress={index / TOTAL_QUESTIONS * 100} barColor="from-emerald-500 to-blue-500" navigate={navigate} />

      <div className="flex flex-col items-center gap-1">
        <div className={`w-14 h-14 rounded-full border-[3px] flex items-center justify-center text-xl font-extrabold transition-colors ${timerColor}`}>{timer}</div>
        <p className="text-slate-400 text-xs">seconds left</p>
      </div>

      <div className={`border rounded-2xl px-7 py-7 text-center flex flex-col items-center gap-4 transition-all ${cardBorder}`}>
        <p className="text-slate-400 text-sm">Unscramble this word:</p>

        <div className="flex gap-2 flex-wrap justify-center">
          {currentQ.word.split('').map((_, i) => {
            const letter = answer[i]; const isRevealed = revealedPositions.includes(i)
            return (
              <div key={i}
                className={`w-11 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${isRevealed ? 'bg-purple-900/60 border-purple-500 cursor-default' : letter ? 'bg-[#1a3a5c] border-blue-500 cursor-pointer' : 'bg-navy border-dim cursor-default'}`}
                onClick={() => returnLetter(i)}
              >
                <span className={`font-extrabold text-xl ${isRevealed ? 'text-purple-400' : 'text-slate-200'}`}>{letter ? letter.char : ''}</span>
              </div>
            )
          })}
        </div>

        {feedback && (
          <p className={`font-extrabold text-base ${feedback === 'correct' ? 'text-emerald-400' : feedback === 'wrong' ? 'text-danger' : 'text-amber-400'}`}>
            {feedback === 'correct' ? '✓ Correct! +10 pts' : feedback === 'wrong' ? `✗ Wrong! It was: ${currentQ.word}` : `⏱ Time's up! Answer: ${currentQ.word}`}
          </p>
        )}

        {!feedback && (
          <div className="flex gap-2 flex-wrap justify-center">
            <button className="bg-transparent border border-dim text-slate-400 rounded-lg px-3 py-1.5 text-sm hover:text-slate-200 transition-colors" onClick={() => setShowHint(h => !h)}>
              {showHint ? '🙈 Hide Hint' : '💡 Show Hint'}
            </button>
            <button className="bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg px-3 py-1.5 text-sm hover:bg-purple-500/20 transition-colors" onClick={handleReveal}>
              🔍 Reveal Letter <span className="text-danger text-xs">(-5 pts)</span>
            </button>
          </div>
        )}
        {showHint && !feedback && <p className="text-amber-400 text-sm italic bg-amber-400/10 rounded-xl px-4 py-2">💡 {currentQ.hint}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-slate-400 text-sm text-center">Available Letters — tap to place:</p>
        <div className="flex gap-2.5 flex-wrap justify-center">
          {scrambled.map(letter => (
            <button key={letter.id} className="w-12 h-14 rounded-xl bg-[#1a3a5c] border-2 border-blue-500 text-slate-200 font-extrabold text-xl hover:-translate-y-1 hover:scale-105 hover:shadow-[0_6px_16px_#3b82f640] active:scale-95 transition-all disabled:opacity-40"
              onClick={() => pickLetter(letter)} disabled={!!feedback}>{letter.char}</button>
          ))}
        </div>
      </div>

      <button className="bg-transparent border border-dim text-slate-400 rounded-xl py-3 text-sm hover:text-slate-200 transition-colors disabled:opacity-40" onClick={handleClear} disabled={!!feedback}>
        🗑️ Clear Answer
      </button>
    </div>
  )
}

export default WordScramble
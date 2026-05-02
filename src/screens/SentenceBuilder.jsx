import { useState, useEffect } from 'react'

// =============================================
// DATA SOAL
// =============================================
const ALL_SENTENCES = [
  {
    words:       ['She', 'reads', 'books', 'every', 'day'],
    answer:      'She reads books every day',
    translation: 'Dia membaca buku setiap hari',
    tip:         'Subject + Verb + Object + Time',
  },
  {
    words:       ['They', 'are', 'playing', 'football', 'now'],
    answer:      'They are playing football now',
    translation: 'Mereka sedang bermain sepak bola sekarang',
    tip:         'Present Continuous: Subject + are + Verb-ing',
  },
  {
    words:       ['I', 'will', 'visit', 'my', 'grandmother', 'tomorrow'],
    answer:      'I will visit my grandmother tomorrow',
    translation: 'Saya akan mengunjungi nenek saya besok',
    tip:         'Future: Subject + will + base verb',
  },
  {
    words:       ['He', 'has', 'eaten', 'his', 'breakfast'],
    answer:      'He has eaten his breakfast',
    translation: 'Dia sudah makan sarapannya',
    tip:         'Present Perfect: Subject + has + past participle',
  },
  {
    words:       ['The', 'cat', 'is', 'sleeping', 'on', 'the', 'sofa'],
    answer:      'The cat is sleeping on the sofa',
    translation: 'Kucing itu sedang tidur di sofa',
    tip:         'Present Continuous dengan preposition',
  },
  {
    words:       ['We', 'studied', 'English', 'last', 'night'],
    answer:      'We studied English last night',
    translation: 'Kami belajar bahasa Inggris tadi malam',
    tip:         'Simple Past: Subject + Verb-ed',
  },
  {
    words:       ['She', 'can', 'speak', 'three', 'languages'],
    answer:      'She can speak three languages',
    translation: 'Dia bisa berbicara tiga bahasa',
    tip:         'Modal verb: Subject + can + base verb',
  },
  {
    words:       ['My', 'father', 'works', 'at', 'a', 'hospital'],
    answer:      'My father works at a hospital',
    translation: 'Ayah saya bekerja di rumah sakit',
    tip:         'Simple Present dengan preposition',
  },
  {
    words:       ['The', 'students', 'are', 'very', 'hardworking'],
    answer:      'The students are very hardworking',
    translation: 'Para siswa sangat rajin',
    tip:         'Subject + to be + adjective',
  },
  {
    words:       ['I', 'have', 'never', 'been', 'to', 'Japan'],
    answer:      'I have never been to Japan',
    translation: 'Saya belum pernah pergi ke Jepang',
    tip:         'Present Perfect dengan never',
  },
  {
    words:       ['She', 'was', 'cooking', 'when', 'I', 'arrived'],
    answer:      'She was cooking when I arrived',
    translation: 'Dia sedang memasak ketika saya tiba',
    tip:         'Past Continuous + Simple Past',
  },
  {
    words:       ['You', 'should', 'drink', 'more', 'water'],
    answer:      'You should drink more water',
    translation: 'Kamu seharusnya minum lebih banyak air',
    tip:         'Modal: Subject + should + base verb',
  },
]

const TOTAL_QUESTIONS = 8
const TIME_PER_QUESTION = 25

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

// =============================================
// KOMPONEN UTAMA
// =============================================
function SentenceBuilder({ navigate, completeGame }) {
  const [questions]       = useState(() => shuffle(ALL_SENTENCES).slice(0, TOTAL_QUESTIONS))
  const [index,            setIndex]            = useState(0)
  const [wordBank,         setWordBank]         = useState([])
  const [answer,           setAnswer]           = useState([])
  const [timer,            setTimer]            = useState(TIME_PER_QUESTION)
  const [phase,            setPhase]            = useState('playing')
  const [feedback,         setFeedback]         = useState(null)
  const [score,            setScore]            = useState(0)
  const [results,          setResults]          = useState([])
  const [showTip,          setShowTip]          = useState(false)
  const [showTranslation,  setShowTranslation]  = useState(false)

  const currentQ = questions[index]

  // Reset tiap soal baru
  useEffect(() => {
    const shuffled = shuffle(currentQ.words).map((word, i) => ({
      word,
      id: `${i}-${word}`
    }))
    setWordBank(shuffled)
    setAnswer([])
    setTimer(TIME_PER_QUESTION)
    setFeedback(null)
    setShowTip(false)
    setShowTranslation(false)
  }, [index])

  // Timer
  useEffect(() => {
    if (phase !== 'playing' || feedback !== null) return
    if (timer === 0) {
      handleTimeout()
      return
    }
    const interval = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timer, phase, feedback])

  const handleTimeout = () => {
    setFeedback('timeout')
    setResults(prev => [...prev, {
      answer: currentQ.answer,
      translation: currentQ.translation,
      isCorrect: false
    }])
    goNext()
  }

  const checkAnswer = (currentAnswer) => {
    const typed    = currentAnswer.map(w => w.word).join(' ')
    const isCorrect = typed === currentQ.answer
    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore(s => s + 10)
    setResults(prev => [...prev, {
      answer: currentQ.answer,
      translation: currentQ.translation,
      isCorrect
    }])
    goNext()
  }

  const goNext = () => {
    setTimeout(() => {
      if (index + 1 >= TOTAL_QUESTIONS) setPhase('result')
      else setIndex(i => i + 1)
    }, 1500)
  }

  // Klik kata dari bank → pindah ke jawaban
  const pickWord = (wordObj) => {
    if (feedback !== null) return
    const newAnswer = [...answer, wordObj]
    setWordBank(prev => prev.filter(w => w.id !== wordObj.id))
    setAnswer(newAnswer)

    // Auto-check kalau sudah sama panjang dengan kalimat jawaban
    if (newAnswer.length === currentQ.words.length) {
      checkAnswer(newAnswer)
    }
  }

  // Klik kata di jawaban → kembalikan ke bank
  const returnWord = (wordObj) => {
    if (feedback !== null) return
    setAnswer(prev => prev.filter(w => w.id !== wordObj.id))
    setWordBank(prev => [...prev, wordObj])
  }

  const handleClear = () => {
    if (feedback !== null) return
    setWordBank(prev => [...prev, ...answer])
    setAnswer([])
  }

  if (phase === 'result') {
    return (
      <SentenceResult
        score={score}
        total={TOTAL_QUESTIONS}
        results={results}
        onFinish={() => {
          const xpEarned = Math.round((score / (TOTAL_QUESTIONS * 10)) * 150)
          completeGame('sentence', score, xpEarned)
        }}
      />
    )
  }

  const progress    = (index / TOTAL_QUESTIONS) * 100
  const timerColor  = timer <= 7 ? '#ff6b6b' : timer <= 12 ? '#f59e0b' : '#00e5a0'
  const feedbackBg  = feedback === 'correct' ? '#10b98115' : feedback ? '#ff6b6b15' : 'transparent'
  const feedbackBorder = feedback === 'correct' ? '#10b981' : feedback ? '#ff6b6b' : '#2d3748'

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('select')}>← Back</button>
        <div style={styles.headerCenter}>
          <p style={styles.headerTitle}>📝 Sentence Builder</p>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
          <p style={styles.progressText}>{index + 1} / {TOTAL_QUESTIONS}</p>
        </div>
        <div style={styles.scoreDisplay}>
          <p style={styles.scoreLbl}>Score</p>
          <p style={styles.scoreVal}>{score}</p>
        </div>
      </div>

      {/* Timer */}
      <div style={styles.timerWrap}>
        <div style={{ ...styles.timerCircle, borderColor: timerColor, color: timerColor }}>
          {timer}
        </div>
        <p style={{ color: '#94a3b8', fontSize: '12px' }}>seconds left</p>
      </div>

      {/* Kartu Soal */}
      <div style={{ ...styles.questionCard, background: feedbackBg, borderColor: feedbackBorder }}>
        <p style={styles.questionLabel}>Arrange the words into a correct sentence:</p>

        {/* Area Jawaban */}
        <div style={styles.answerArea}>
          {answer.length === 0 ? (
            <p style={styles.answerPlaceholder}>Tap words below to build your sentence...</p>
          ) : (
            <div style={styles.answerWords}>
              {answer.map((wordObj) => (
                <button
                  key={wordObj.id}
                  style={styles.answerWord}
                  onClick={() => returnWord(wordObj)}
                >
                  {wordObj.word}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Feedback */}
        {feedback && (
          <div style={styles.feedbackBox}>
            <p style={{
              color: feedback === 'correct' ? '#10b981' : feedback === 'wrong' ? '#ff6b6b' : '#f59e0b',
              fontWeight: 800, fontSize: '15px',
            }}>
              {feedback === 'correct'
                ? '✓ Perfect! +10 pts'
                : feedback === 'wrong'
                ? '✗ Not quite right!'
                : "⏱ Time's up!"}
            </p>
            <p style={styles.correctAnswer}>✅ {currentQ.answer}</p>
            <p style={styles.translation}>🇮🇩 {currentQ.translation}</p>
          </div>
        )}

        {/* Tombol Bantuan */}
        {!feedback && (
          <div style={styles.helpRow}>
            <button style={styles.helpBtn} onClick={() => setShowTranslation(h => !h)}>
              🇮🇩 {showTranslation ? 'Hide' : 'Translation'}
            </button>
            <button style={styles.helpBtn} onClick={() => setShowTip(h => !h)}>
              📐 {showTip ? 'Hide' : 'Grammar Tip'}
            </button>
          </div>
        )}

        {showTranslation && !feedback && (
          <p style={styles.hintText}>🇮🇩 {currentQ.translation}</p>
        )}
        {showTip && !feedback && (
          <p style={{ ...styles.hintText, color: '#a855f7', background: '#a855f711' }}>
            📐 {currentQ.tip}
          </p>
        )}
      </div>

      {/* Bank Kata */}
      <div style={styles.bankSection}>
        <p style={styles.bankLabel}>Available Words — tap to place:</p>
        <div style={styles.bankRow}>
          {wordBank.map((wordObj) => (
            <button
              key={wordObj.id}
              style={styles.bankWord}
              onClick={() => pickWord(wordObj)}
              disabled={feedback !== null}
            >
              {wordObj.word}
            </button>
          ))}
        </div>
      </div>

      {/* Tombol Clear */}
      <button
        style={styles.clearBtn}
        onClick={handleClear}
        disabled={feedback !== null || answer.length === 0}
      >
        🗑️ Clear Sentence
      </button>
    </div>
  )
}

// =============================================
// RESULT SCREEN
// =============================================
function SentenceResult({ score, total, results, onFinish }) {
  const percentage = Math.round((score / (total * 10)) * 100)
  const xpEarned   = Math.round((percentage / 100) * 150)
  const emoji = percentage === 100 ? '🏆' : percentage >= 70 ? '⭐' : percentage >= 40 ? '👍' : '💪'

  return (
    <div style={styles.container}>
      <div style={styles.resultBox}>
        <p style={{ fontSize: '64px' }}>{emoji}</p>
        <h2 style={styles.resultTitle}>Quest Complete!</h2>
        <p style={styles.resultScore}>
          {score} <span style={{ fontSize: '18px', color: '#94a3b8' }}>/ {total * 10} pts</span>
        </p>
        <p style={{ color: '#ffd700', fontWeight: 700 }}>+{xpEarned} XP earned!</p>

        <div style={styles.recapList}>
          {results.map((r, i) => (
            <div key={i} style={{ ...styles.recapRow, borderColor: r.isCorrect ? '#10b98144' : '#ff6b6b44' }}>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: 700, fontSize: '13px', color: '#e2e8f0' }}>{r.answer}</p>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{r.translation}</p>
              </div>
              <span style={{ color: r.isCorrect ? '#10b981' : '#ff6b6b', fontWeight: 700, flexShrink: 0 }}>
                {r.isCorrect ? '✓' : '✗'}
              </span>
            </div>
          ))}
        </div>

        <button style={styles.btnFinish} onClick={onFinish}>
          Back to Quest Map
        </button>
      </div>
    </div>
  )
}

// =============================================
// STYLES
// =============================================
const styles = {
  container: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at top, #0f1e3d 0%, #0a0e1a 60%)',
    padding: '24px', maxWidth: '680px', margin: '0 auto',
    display: 'flex', flexDirection: 'column', gap: '20px',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
    background: '#111827', borderRadius: '16px',
    padding: '16px 20px', border: '1px solid #2d3748',
  },
  backBtn: {
    background: 'none', border: '1px solid #2d3748',
    color: '#94a3b8', borderRadius: '8px',
    padding: '8px 12px', fontSize: '13px', cursor: 'pointer',
  },
  headerCenter: { flex: 1, textAlign: 'center' },
  headerTitle: { color: '#e2e8f0', fontWeight: 800, marginBottom: '8px' },
  progressBar: {
    background: '#1a2235', borderRadius: '999px', height: '6px', overflow: 'hidden',
  },
  progressFill: {
    background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
    height: '100%', borderRadius: '999px', transition: 'width 0.4s ease',
  },
  progressText: { color: '#94a3b8', fontSize: '12px', marginTop: '4px' },
  scoreDisplay: { textAlign: 'right' },
  scoreLbl: { color: '#94a3b8', fontSize: '12px' },
  scoreVal: { color: '#ffd700', fontWeight: 800, fontSize: '22px' },

  timerWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  timerCircle: {
    width: '60px', height: '60px', borderRadius: '50%',
    border: '3px solid', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', fontWeight: 800, transition: 'color 0.3s, border-color 0.3s',
  },

  questionCard: {
    border: '1px solid', borderRadius: '20px', padding: '24px',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '16px', transition: 'all 0.3s',
  },
  questionLabel: { color: '#94a3b8', fontSize: '14px', textAlign: 'center' },

  answerArea: {
    width: '100%', minHeight: '72px',
    background: '#0f172a', borderRadius: '12px',
    border: '1px dashed #2d3748',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '12px',
  },
  answerPlaceholder: { color: '#475569', fontSize: '14px', fontStyle: 'italic' },
  answerWords: { display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' },
  answerWord: {
    background: '#1e3a5f', border: '1px solid #3b82f6',
    color: '#e2e8f0', borderRadius: '8px',
    padding: '8px 14px', fontSize: '15px', fontWeight: 700,
    cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
    transition: 'all 0.15s',
  },

  feedbackBox: {
    textAlign: 'center', display: 'flex',
    flexDirection: 'column', gap: '6px', width: '100%',
  },
  correctAnswer: {
    color: '#10b981', fontWeight: 700, fontSize: '14px',
    background: '#10b98111', borderRadius: '8px', padding: '8px 14px',
  },
  translation: {
    color: '#94a3b8', fontSize: '13px',
  },

  helpRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' },
  helpBtn: {
    background: 'none', border: '1px solid #2d3748',
    color: '#94a3b8', borderRadius: '8px',
    padding: '6px 14px', fontSize: '13px', cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif",
  },
  hintText: {
    color: '#f59e0b', fontSize: '13px',
    background: '#f59e0b11', borderRadius: '8px', padding: '8px 14px',
    textAlign: 'center', width: '100%',
  },

  bankSection: { display: 'flex', flexDirection: 'column', gap: '10px' },
  bankLabel: { color: '#94a3b8', fontSize: '13px', textAlign: 'center' },
  bankRow: { display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' },
  bankWord: {
    background: '#1a2a1a', border: '2px solid #f59e0b',
    color: '#e2e8f0', borderRadius: '10px',
    padding: '10px 16px', fontSize: '15px', fontWeight: 700,
    cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
    transition: 'all 0.15s',
  },

  clearBtn: {
    background: 'none', border: '1px solid #2d3748',
    color: '#94a3b8', borderRadius: '10px', padding: '12px',
    fontSize: '14px', cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
  },

  resultBox: {
    margin: 'auto', textAlign: 'center',
    background: '#111827', border: '1px solid #2d3748',
    borderRadius: '24px', padding: '40px 32px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%',
  },
  resultTitle: {
    fontFamily: "'Cinzel Decorative', cursive", color: '#ffd700', fontSize: '24px',
  },
  resultScore: { fontSize: '48px', fontWeight: 800, color: '#e2e8f0' },
  recapList: {
    width: '100%', display: 'flex', flexDirection: 'column',
    gap: '8px', maxHeight: '280px', overflowY: 'auto', marginTop: '8px',
  },
  recapRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: '#1a2235', borderRadius: '8px', padding: '10px 14px',
    border: '1px solid', fontSize: '13px', color: '#e2e8f0', gap: '12px',
  },
  btnFinish: {
    background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
    border: 'none', borderRadius: '12px', padding: '14px 32px',
    color: '#0a0e1a', fontWeight: 800, fontSize: '16px',
    marginTop: '8px', cursor: 'pointer',
  },
}

export default SentenceBuilder
import { useState, useEffect } from 'react'

// =============================================
// DATA SOAL
// =============================================
const ALL_QUESTIONS = [
  {
    question:     'She ___ to school every day.',
    options:      ['go', 'goes', 'going', 'gone'],
    correct:      'goes',
    explanation:  'Subject "She" (third person singular) → Simple Present pakai "goes" bukan "go".',
    category:     'Subject-Verb Agreement',
  },
  {
    question:     'They ___ watching TV when I called.',
    options:      ['was', 'were', 'are', 'is'],
    correct:      'were',
    explanation:  '"They" adalah plural → Past Continuous menggunakan "were", bukan "was".',
    category:     'Past Continuous',
  },
  {
    question:     'I have lived here ___ 2018.',
    options:      ['since', 'for', 'from', 'at'],
    correct:      'since',
    explanation:  '"Since" digunakan untuk titik waktu tertentu (tahun, tanggal). "For" digunakan untuk durasi (3 years).',
    category:     'Preposition of Time',
  },
  {
    question:     'She is ___ honest student.',
    options:      ['a', 'an', 'the', '-'],
    correct:      'an',
    explanation:  '"An" digunakan sebelum kata yang bunyinya diawali vokal. "Honest" bunyinya /ɒnɪst/ → vokal "o".',
    category:     'Article',
  },
  {
    question:     'If it rains, we ___ stay at home.',
    options:      ['will', 'would', 'shall', 'should'],
    correct:      'will',
    explanation:  'Conditional Type 1 (fakta nyata): If + Simple Present → will + base verb.',
    category:     'Conditional',
  },
  {
    question:     'He ___ finish the task yet.',
    options:      ["hasn't", "didn't", "isn't", "wasn't"],
    correct:      "hasn't",
    explanation:  '"Yet" menunjukkan sesuatu yang belum selesai → Present Perfect: hasn\'t + past participle.',
    category:     'Present Perfect',
  },
  {
    question:     'The book was written ___ J.K. Rowling.',
    options:      ['by', 'from', 'with', 'of'],
    correct:      'by',
    explanation:  'Passive voice menggunakan "by" untuk menyebut pelaku: was written by [agent].',
    category:     'Passive Voice',
  },
  {
    question:     'She speaks English ___ than her brother.',
    options:      ['more fluently', 'most fluently', 'fluenter', 'fluently'],
    correct:      'more fluently',
    explanation:  'Comparative adverb: "more + adverb" untuk kata sifat yang panjang. Bukan "-er".',
    category:     'Comparative',
  },
  {
    question:     'Neither the students nor the teacher ___ ready.',
    options:      ['was', 'were', 'are', 'is'],
    correct:      'was',
    explanation:  'Neither...nor → verb mengikuti subject terdekat. "The teacher" (singular) → "was".',
    category:     'Subject-Verb Agreement',
  },
  {
    question:     'You ___ smoke here. It\'s prohibited.',
    options:      ["mustn't", "don't have to", "shouldn't", "needn't"],
    correct:      "mustn't",
    explanation:  '"Mustn\'t" = dilarang keras. "Don\'t have to" = tidak wajib (boleh tidak dilakukan).',
    category:     'Modal Verb',
  },
  {
    question:     'I wish I ___ fly like a bird.',
    options:      ['could', 'can', 'will', 'would'],
    correct:      'could',
    explanation:  '"Wish" untuk situasi tidak nyata → past modal "could" (bukan "can" bentuk present).',
    category:     'Subjunctive',
  },
  {
    question:     '___ you mind closing the window?',
    options:      ['Would', 'Will', 'Do', 'Should'],
    correct:      'Would',
    explanation:  '"Would you mind + Verb-ing?" adalah ekspresi sopan meminta tolong yang paling umum.',
    category:     'Polite Request',
  },
  {
    question:     'She suggested ___ to the cinema.',
    options:      ['going', 'to go', 'go', 'went'],
    correct:      'going',
    explanation:  '"Suggest" selalu diikuti Verb-ing (gerund), bukan infinitive (to go).',
    category:     'Gerund vs Infinitive',
  },
  {
    question:     'By next year, she ___ her degree.',
    options:      ['will have completed', 'will complete', 'has completed', 'completes'],
    correct:      'will have completed',
    explanation:  'Future Perfect: will have + past participle → aksi selesai sebelum waktu di masa depan.',
    category:     'Future Perfect',
  },
  {
    question:     'The news ___ surprising to everyone.',
    options:      ['was', 'were', 'are', 'have been'],
    correct:      'was',
    explanation:  '"News" meskipun terdengar plural, adalah uncountable noun → verb singular "was".',
    category:     'Uncountable Noun',
  },
]

const TOTAL_QUESTIONS = 10
const TIME_PER_QUESTION = 20

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

// =============================================
// KOMPONEN UTAMA
// =============================================
function GrammarQuiz({ navigate, completeGame }) {
  const [questions]     = useState(() => shuffle(ALL_QUESTIONS).slice(0, TOTAL_QUESTIONS))
  const [index,          setIndex]      = useState(0)
  const [selected,       setSelected]   = useState(null)
  const [isAnswered,     setIsAnswered]  = useState(false)
  const [timer,          setTimer]       = useState(TIME_PER_QUESTION)
  const [phase,          setPhase]       = useState('playing')
  const [score,          setScore]       = useState(0)
  const [results,        setResults]     = useState([])
  const [streak,         setStreak]      = useState(0)
  const [showStreak,     setShowStreak]  = useState(false)

  const currentQ = questions[index]

  // Reset tiap soal baru
  useEffect(() => {
    setSelected(null)
    setIsAnswered(false)
    setTimer(TIME_PER_QUESTION)
  }, [index])

  // Timer
  useEffect(() => {
    if (phase !== 'playing' || isAnswered) return
    if (timer === 0) {
      handleAnswer(null)
      return
    }
    const interval = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timer, isAnswered, phase])

  const handleAnswer = (option) => {
    if (isAnswered) return

    const isCorrect = option === currentQ.correct
    setSelected(option)
    setIsAnswered(true)

    let pointsEarned = 0
    let newStreak = streak

    if (isCorrect) {
      newStreak = streak + 1
      // Bonus poin untuk streak
      pointsEarned = newStreak >= 3 ? 15 : 10
      setScore(s => s + pointsEarned)
      setStreak(newStreak)
      if (newStreak >= 3) {
        setShowStreak(true)
        setTimeout(() => setShowStreak(false), 1500)
      }
    } else {
      newStreak = 0
      setStreak(0)
    }

    setResults(prev => [...prev, {
      question:    currentQ.question,
      correct:     currentQ.correct,
      chosen:      option,
      explanation: currentQ.explanation,
      category:    currentQ.category,
      isCorrect,
      points:      pointsEarned,
    }])

    setTimeout(() => {
      if (index + 1 >= TOTAL_QUESTIONS) setPhase('result')
      else setIndex(i => i + 1)
    }, 2000)
  }

  if (phase === 'result') {
    return (
      <QuizResult
        score={score}
        total={TOTAL_QUESTIONS}
        results={results}
        onFinish={() => {
          const maxScore = TOTAL_QUESTIONS * 15
          const xpEarned = Math.round((score / maxScore) * 200)
          completeGame('grammar', score, xpEarned)
        }}
      />
    )
  }

  const progress   = (index / TOTAL_QUESTIONS) * 100
  const timerColor = timer <= 5 ? '#ff6b6b' : timer <= 10 ? '#f59e0b' : '#00e5a0'
  const timerPct   = (timer / TIME_PER_QUESTION) * 100

  const getOptionStyle = (option) => {
    if (!isAnswered) return styles.optionDefault
    if (option === currentQ.correct) return styles.optionCorrect
    if (option === selected && option !== currentQ.correct) return styles.optionWrong
    return styles.optionDim
  }

  return (
    <div style={styles.container}>
      {/* Streak Banner */}
      {showStreak && (
        <div style={styles.streakBanner}>
          🔥 {streak} Streak! Bonus +5 pts!
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('select')}>← Back</button>
        <div style={styles.headerCenter}>
          <p style={styles.headerTitle}>📖 Grammar Quiz</p>
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

      {/* Timer Bar */}
      <div style={styles.timerBarWrap}>
        <div style={styles.timerBarBg}>
          <div style={{
            ...styles.timerBarFill,
            width: `${timerPct}%`,
            background: timerColor,
            transition: 'width 1s linear, background 0.3s',
          }} />
        </div>
        <span style={{ color: timerColor, fontWeight: 800, fontSize: '14px', minWidth: '24px' }}>
          {timer}s
        </span>
      </div>

      {/* Streak & Category Info */}
      <div style={styles.metaRow}>
        <span style={styles.categoryBadge}>📂 {currentQ.category}</span>
        {streak >= 2 && (
          <span style={styles.streakBadge}>🔥 {streak} Streak!</span>
        )}
      </div>

      {/* Kartu Soal */}
      <div style={styles.questionCard}>
        <p style={styles.questionNumber}>Question {index + 1}</p>
        <p style={styles.questionText}>{currentQ.question}</p>
      </div>

      {/* Pilihan Jawaban */}
      <div style={styles.optionsGrid}>
        {currentQ.options.map((option, i) => (
          <button
            key={i}
            style={{ ...styles.optionBase, ...getOptionStyle(option) }}
            onClick={() => handleAnswer(option)}
            disabled={isAnswered}
          >
            <span style={styles.optionLabel}>
              {['A', 'B', 'C', 'D'][i]}
            </span>
            <span style={styles.optionText}>{option}</span>
            {isAnswered && option === currentQ.correct && (
              <span style={{ marginLeft: 'auto', color: '#10b981' }}>✓</span>
            )}
            {isAnswered && option === selected && option !== currentQ.correct && (
              <span style={{ marginLeft: 'auto', color: '#ff6b6b' }}>✗</span>
            )}
          </button>
        ))}
      </div>

      {/* Explanation Box */}
      {isAnswered && (
        <div style={{
          ...styles.explanationBox,
          borderColor: selected === currentQ.correct ? '#10b98155' : '#ff6b6b55',
          background:  selected === currentQ.correct ? '#10b98108' : '#ff6b6b08',
        }}>
          <p style={styles.explanationTitle}>
            {selected === currentQ.correct ? '✅ Correct!' : selected === null ? '⏱ Time\'s up!' : '❌ Wrong!'}
            {selected === currentQ.correct && streak >= 3 && ' +5 Bonus!'}
          </p>
          <p style={styles.explanationText}>💡 {currentQ.explanation}</p>
        </div>
      )}
    </div>
  )
}

// =============================================
// RESULT SCREEN
// =============================================
function QuizResult({ score, total, results, onFinish }) {
  const [showDetail, setShowDetail] = useState(false)
  const maxScore   = total * 15
  const percentage = Math.round((score / maxScore) * 100)
  const xpEarned   = Math.round((score / maxScore) * 200)
  const correct    = results.filter(r => r.isCorrect).length

  const emoji = percentage === 100 ? '🏆' : percentage >= 70 ? '⭐' : percentage >= 40 ? '👍' : '💪'

  // Hitung kategori yang salah terbanyak
  const wrongCategories = results
    .filter(r => !r.isCorrect)
    .map(r => r.category)
  const uniqueWrong = [...new Set(wrongCategories)]

  return (
    <div style={styles.container}>
      <div style={styles.resultBox}>
        <p style={{ fontSize: '64px' }}>{emoji}</p>
        <h2 style={styles.resultTitle}>Quest Complete!</h2>

        {/* Stats Row */}
        <div style={styles.statsRow}>
          <StatBox label="Score" value={score} color="#ffd700" />
          <StatBox label="Correct" value={`${correct}/${total}`} color="#10b981" />
          <StatBox label="XP" value={`+${xpEarned}`} color="#a855f7" />
        </div>

        {/* Area yang perlu diperbaiki */}
        {uniqueWrong.length > 0 && (
          <div style={styles.improveBox}>
            <p style={styles.improveTitle}>📚 Areas to Improve:</p>
            <div style={styles.improveList}>
              {uniqueWrong.map((cat, i) => (
                <span key={i} style={styles.improveBadge}>{cat}</span>
              ))}
            </div>
          </div>
        )}

        {/* Toggle Detail */}
        <button style={styles.detailToggle} onClick={() => setShowDetail(d => !d)}>
          {showDetail ? '🙈 Hide Review' : '📋 Review Answers'}
        </button>

        {showDetail && (
          <div style={styles.recapList}>
            {results.map((r, i) => (
              <div key={i} style={{ ...styles.recapRow, borderColor: r.isCorrect ? '#10b98144' : '#ff6b6b44' }}>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <p style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 700, marginBottom: '4px' }}>
                    {r.question}
                  </p>
                  <p style={{ fontSize: '12px', color: r.isCorrect ? '#10b981' : '#ff6b6b' }}>
                    {r.isCorrect ? `✓ ${r.correct}` : `✗ You: ${r.chosen ?? 'No answer'} → ${r.correct}`}
                  </p>
                  <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', fontStyle: 'italic' }}>
                    💡 {r.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button style={styles.btnFinish} onClick={onFinish}>
          Back to Quest Map
        </button>
      </div>
    </div>
  )
}

function StatBox({ label, value, color }) {
  return (
    <div style={styles.statBox}>
      <p style={{ ...styles.statValue, color }}>{value}</p>
      <p style={styles.statLabel}>{label}</p>
    </div>
  )
}

// =============================================
// STYLES
// =============================================
const styles = {
  container: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at top, #1a0f2e 0%, #0a0e1a 60%)',
    padding: '24px', maxWidth: '620px', margin: '0 auto',
    display: 'flex', flexDirection: 'column', gap: '16px',
  },
  streakBanner: {
    position: 'fixed', top: '20px', left: '50%',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    color: '#fff', fontWeight: 800, fontSize: '16px',
    padding: '12px 28px', borderRadius: '999px',
    zIndex: 999, boxShadow: '0 4px 20px #f59e0b44',
    animation: 'none',
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
    background: 'linear-gradient(90deg, #ef4444, #a855f7)',
    height: '100%', borderRadius: '999px', transition: 'width 0.4s ease',
  },
  progressText: { color: '#94a3b8', fontSize: '12px', marginTop: '4px' },
  scoreDisplay: { textAlign: 'right' },
  scoreLbl: { color: '#94a3b8', fontSize: '12px' },
  scoreVal: { color: '#ffd700', fontWeight: 800, fontSize: '22px' },

  timerBarWrap: {
    display: 'flex', alignItems: 'center', gap: '10px',
  },
  timerBarBg: {
    flex: 1, background: '#1a2235', borderRadius: '999px',
    height: '10px', overflow: 'hidden',
  },
  timerBarFill: {
    height: '100%', borderRadius: '999px',
  },

  metaRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  categoryBadge: {
    background: '#1a2235', border: '1px solid #2d3748',
    color: '#94a3b8', borderRadius: '999px',
    padding: '4px 12px', fontSize: '12px', fontWeight: 700,
  },
  streakBadge: {
    background: '#f59e0b22', border: '1px solid #f59e0b44',
    color: '#f59e0b', borderRadius: '999px',
    padding: '4px 12px', fontSize: '12px', fontWeight: 800,
  },

  questionCard: {
    background: '#111827', border: '1px solid #2d3748',
    borderRadius: '20px', padding: '28px 24px',
    textAlign: 'center',
  },
  questionNumber: { color: '#94a3b8', fontSize: '13px', marginBottom: '12px' },
  questionText: {
    color: '#e2e8f0', fontSize: '20px', fontWeight: 800,
    lineHeight: 1.5,
  },

  optionsGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px',
  },
  optionBase: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '14px 16px', borderRadius: '12px',
    border: '1px solid', textAlign: 'left',
    transition: 'all 0.2s', cursor: 'pointer',
    fontSize: '14px', fontWeight: 700,
    fontFamily: "'Nunito', sans-serif",
  },
  optionDefault: {
    background: '#111827', borderColor: '#2d3748', color: '#e2e8f0',
  },
  optionCorrect: {
    background: '#10b98122', borderColor: '#10b981', color: '#10b981',
  },
  optionWrong: {
    background: '#ff6b6b22', borderColor: '#ff6b6b', color: '#ff6b6b',
  },
  optionDim: {
    background: '#111827', borderColor: '#1a2235', color: '#334155',
  },
  optionLabel: {
    background: '#1a2235', borderRadius: '6px',
    width: '28px', height: '28px', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: 800, color: '#94a3b8',
  },
  optionText: { flex: 1 },

  explanationBox: {
    border: '1px solid', borderRadius: '14px',
    padding: '16px 20px', display: 'flex',
    flexDirection: 'column', gap: '8px',
  },
  explanationTitle: { color: '#e2e8f0', fontWeight: 800, fontSize: '15px' },
  explanationText: { color: '#94a3b8', fontSize: '13px', lineHeight: 1.6 },

  // Result
  resultBox: {
    margin: 'auto', textAlign: 'center',
    background: '#111827', border: '1px solid #2d3748',
    borderRadius: '24px', padding: '40px 28px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%',
  },
  resultTitle: {
    fontFamily: "'Cinzel Decorative', cursive", color: '#ffd700', fontSize: '24px',
  },
  statsRow: { display: 'flex', gap: '12px', width: '100%' },
  statBox: {
    flex: 1, background: '#1a2235', borderRadius: '12px',
    padding: '16px 8px', textAlign: 'center',
    border: '1px solid #2d3748',
  },
  statValue: { fontSize: '24px', fontWeight: 800 },
  statLabel: { color: '#94a3b8', fontSize: '12px', marginTop: '4px' },

  improveBox: {
    width: '100%', background: '#ff6b6b0a',
    border: '1px solid #ff6b6b33', borderRadius: '12px', padding: '14px',
  },
  improveTitle: { color: '#ff6b6b', fontWeight: 700, fontSize: '13px', marginBottom: '8px' },
  improveList: { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' },
  improveBadge: {
    background: '#ff6b6b22', color: '#ff6b6b',
    borderRadius: '999px', padding: '3px 10px', fontSize: '11px', fontWeight: 700,
  },

  detailToggle: {
    background: 'none', border: '1px solid #2d3748',
    color: '#94a3b8', borderRadius: '8px', padding: '8px 20px',
    fontSize: '13px', cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
  },
  recapList: {
    width: '100%', display: 'flex', flexDirection: 'column',
    gap: '10px', maxHeight: '320px', overflowY: 'auto',
  },
  recapRow: {
    display: 'flex', alignItems: 'flex-start',
    background: '#1a2235', borderRadius: '10px', padding: '12px 14px',
    border: '1px solid', gap: '10px', textAlign: 'left',
  },
  btnFinish: {
    background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
    border: 'none', borderRadius: '12px', padding: '14px 32px',
    color: '#0a0e1a', fontWeight: 800, fontSize: '16px',
    marginTop: '8px', cursor: 'pointer',
  },
}

export default GrammarQuiz
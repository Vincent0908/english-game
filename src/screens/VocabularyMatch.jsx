import { useState, useEffect } from 'react'

// =============================================
// DATA SOAL — 20 kata, akan diacak tiap main
// =============================================
const ALL_QUESTIONS = [
  { word: 'Ambiguous', correct: 'Tidak jelas / bermakna ganda', options: ['Tidak jelas / bermakna ganda', 'Percaya diri', 'Luar biasa', 'Menyenangkan'] },
  { word: 'Benevolent', correct: 'Baik hati / dermawan', options: ['Baik hati / dermawan', 'Kejam', 'Serakah', 'Pemalas'] },
  { word: 'Candid', correct: 'Jujur / terus terang', options: ['Jujur / terus terang', 'Berbohong', 'Pemalu', 'Sombong'] },
  { word: 'Diligent', correct: 'Rajin / tekun', options: ['Rajin / tekun', 'Ceroboh', 'Lambat', 'Bodoh'] },
  { word: 'Eloquent', correct: 'Pandai berbicara / fasih', options: ['Pandai berbicara / fasih', 'Diam', 'Pemalu', 'Kasar'] },
  { word: 'Frugal', correct: 'Hemat', options: ['Hemat', 'Boros', 'Kaya', 'Miskin'] },
  { word: 'Genuine', correct: 'Asli / sungguh-sungguh', options: ['Asli / sungguh-sungguh', 'Palsu', 'Biasa saja', 'Asing'] },
  { word: 'Humble', correct: 'Rendah hati', options: ['Rendah hati', 'Sombong', 'Keras kepala', 'Pemarah'] },
  { word: 'Innovative', correct: 'Inovatif / penuh ide baru', options: ['Inovatif / penuh ide baru', 'Membosankan', 'Tradisional', 'Lamban'] },
  { word: 'Jubilant', correct: 'Sangat gembira', options: ['Sangat gembira', 'Sedih', 'Bingung', 'Lelah'] },
  { word: 'Keen', correct: 'Bersemangat / tajam', options: ['Bersemangat / tajam', 'Malas', 'Tumpul', 'Lemah'] },
  { word: 'Lavish', correct: 'Mewah / berlebihan', options: ['Mewah / berlebihan', 'Sederhana', 'Murah', 'Kecil'] },
  { word: 'Meticulous', correct: 'Teliti / cermat', options: ['Teliti / cermat', 'Tergesa-gesa', 'Jorok', 'Acak-acakan'] },
  { word: 'Notorious', correct: 'Terkenal (karena hal buruk)', options: ['Terkenal (karena hal buruk)', 'Terkenal (hal baik)', 'Biasa saja', 'Tersembunyi'] },
  { word: 'Optimistic', correct: 'Berpikir positif', options: ['Berpikir positif', 'Pesimis', 'Marah', 'Bingung'] },
  { word: 'Persistent', correct: 'Gigih / pantang menyerah', options: ['Gigih / pantang menyerah', 'Mudah menyerah', 'Pemalas', 'Lemah'] },
  { word: 'Quirky', correct: 'Unik / aneh (positif)', options: ['Unik / aneh (positif)', 'Membosankan', 'Biasa', 'Jelek'] },
  { word: 'Resilient', correct: 'Tangguh / mudah bangkit', options: ['Tangguh / mudah bangkit', 'Rapuh', 'Lemah', 'Penakut'] },
  { word: 'Sincere', correct: 'Tulus / ikhlas', options: ['Tulus / ikhlas', 'Munafik', 'Pura-pura', 'Licik'] },
  { word: 'Versatile', correct: 'Serbabisa / fleksibel', options: ['Serbabisa / fleksibel', 'Kaku', 'Terbatas', 'Lemah'] },
]

const TOTAL_QUESTIONS = 10
const TIME_PER_QUESTION = 15

// Fungsi untuk mengacak array
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

// =============================================
// KOMPONEN UTAMA
// =============================================
function VocabularyMatch({ navigate, playerData, completeGame }) {
  const [questions] = useState(() => shuffle(ALL_QUESTIONS).slice(0, TOTAL_QUESTIONS))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState(null)   // jawaban yang dipilih
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [timer, setTimer] = useState(TIME_PER_QUESTION)
  const [phase, setPhase] = useState('playing') // 'playing' | 'result'
  const [results, setResults] = useState([])        // rekap jawaban

  const currentQ = questions[currentIndex]

  // Simpan pilihan yang sudah diacak — hanya diacak ulang saat soal berganti
  const [shuffledOptions, setShuffledOptions] = useState(() => shuffle(questions[0].options))

  useEffect(() => {
    setShuffledOptions(shuffle(currentQ.options))
  }, [currentIndex]) // hanya jalan saat currentIndex berubah

  // ---- Timer countdown ----
  useEffect(() => {
    if (phase !== 'playing' || isAnswered) return

    if (timer === 0) {
      handleAnswer(null) // waktu habis = salah
      return
    }

    const interval = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timer, isAnswered, phase])

  // ---- Handle pilih jawaban ----
  const handleAnswer = (option) => {
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

    // Tunggu 1.2 detik, lalu lanjut soal berikutnya
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
  }

  // ---- Handle selesai ----
  const handleFinish = () => {
    const xpEarned = Math.round((score / (TOTAL_QUESTIONS * 10)) * 100)
    completeGame('vocab', score, xpEarned)
  }

  if (phase === 'result') {
    return <ResultScreen score={score} total={TOTAL_QUESTIONS} results={results} onFinish={handleFinish} />
  }

  // Warna tombol berdasarkan status jawaban
  const getOptionStyle = (option) => {
    if (!isAnswered) return styles.optionDefault
    if (option === currentQ.correct) return styles.optionCorrect
    if (option === selected && option !== currentQ.correct) return styles.optionWrong
    return styles.optionDim
  }

  const progress = ((currentIndex) / TOTAL_QUESTIONS) * 100
  const timerColor = timer <= 5 ? '#ff6b6b' : timer <= 10 ? '#f59e0b' : '#00e5a0'

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('select')}>← Back</button>
        <div style={styles.headerCenter}>
          <p style={styles.headerTitle}>🔤 Vocabulary Match</p>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
          <p style={styles.progressText}>{currentIndex + 1} / {TOTAL_QUESTIONS}</p>
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
      <div style={styles.questionCard}>
        <p style={styles.questionLabel}>What is the meaning of:</p>
        <p style={styles.questionWord}>{currentQ.word}</p>
      </div>

      {/* Pilihan Jawaban */}
      <div style={styles.optionsGrid}>
        {shuffledOptions.map((option, i) => (
          <button
            key={i}
            style={{ ...styles.optionBase, ...getOptionStyle(option) }}
            onClick={() => handleAnswer(option)}
          >
            <span style={styles.optionLetter}>
              {['A', 'B', 'C', 'D'][i]}
            </span>
            <span style={styles.optionText}>{option}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// =============================================
// RESULT SCREEN
// =============================================
function ResultScreen({ score, total, results, onFinish }) {
  const percentage = Math.round((score / (total * 10)) * 100)
  const xpEarned = Math.round(percentage)

  const emoji =
    percentage === 100 ? '🏆' :
      percentage >= 70 ? '⭐' :
        percentage >= 40 ? '👍' : '💪'

  return (
    <div style={styles.container}>
      <div style={styles.resultBox}>
        <p style={{ fontSize: '64px' }}>{emoji}</p>
        <h2 style={styles.resultTitle}>Quest Complete!</h2>
        <p style={styles.resultScore}>{score} <span style={{ fontSize: '18px', color: '#94a3b8' }}>/ {total * 10} pts</span></p>
        <p style={{ color: '#ffd700', fontWeight: 700 }}>+{xpEarned} XP earned!</p>

        {/* Rekap */}
        <div style={styles.recapList}>
          {results.map((r, i) => (
            <div key={i} style={{ ...styles.recapRow, borderColor: r.isCorrect ? '#10b98144' : '#ff6b6b44' }}>
              <span style={{ fontWeight: 700 }}>{r.word}</span>
              <span style={{ color: r.isCorrect ? '#10b981' : '#ff6b6b' }}>
                {r.isCorrect ? '✓' : '✗'} {r.correct}
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
    padding: '24px',
    maxWidth: '600px', margin: '0 auto',
    display: 'flex', flexDirection: 'column', gap: '20px',
  },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', gap: '12px',
    background: '#111827', borderRadius: '16px',
    padding: '16px 20px', border: '1px solid #2d3748',
  },
  backBtn: {
    background: 'none', border: '1px solid #2d3748',
    color: '#94a3b8', borderRadius: '8px',
    padding: '8px 12px', fontSize: '13px',
  },
  headerCenter: { flex: 1, textAlign: 'center' },
  headerTitle: { color: '#e2e8f0', fontWeight: 800, marginBottom: '8px' },
  progressBar: {
    background: '#1a2235', borderRadius: '999px',
    height: '6px', overflow: 'hidden', margin: '0 auto',
    width: '100%',
  },
  progressFill: {
    background: 'linear-gradient(90deg, #3b82f6, #00e5a0)',
    height: '100%', borderRadius: '999px',
    transition: 'width 0.4s ease',
  },
  progressText: { color: '#94a3b8', fontSize: '12px', marginTop: '4px' },
  scoreDisplay: { textAlign: 'right' },
  scoreLbl: { color: '#94a3b8', fontSize: '12px' },
  scoreVal: { color: '#ffd700', fontWeight: 800, fontSize: '22px' },

  timerWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  timerCircle: {
    width: '60px', height: '60px', borderRadius: '50%',
    border: '3px solid', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', fontWeight: 800,
    transition: 'color 0.3s, border-color 0.3s',
  },

  questionCard: {
    background: '#111827', border: '1px solid #2d3748',
    borderRadius: '20px', padding: '32px',
    textAlign: 'center',
    boxShadow: '0 0 40px #3b82f620',
  },
  questionLabel: { color: '#94a3b8', fontSize: '14px', marginBottom: '12px' },
  questionWord: {
    fontFamily: "'Cinzel Decorative', cursive",
    fontSize: '32px', color: '#e2e8f0',
    textShadow: '0 0 20px #ffffff30',
  },

  optionsGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
  },
  optionBase: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '14px 16px', borderRadius: '12px',
    border: '1px solid', textAlign: 'left',
    transition: 'all 0.2s', cursor: 'pointer',
    fontSize: '14px', fontWeight: 600,
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
    background: '#111827', borderColor: '#1a2235', color: '#475569',
  },
  optionLetter: {
    background: '#1a2235', borderRadius: '6px',
    width: '28px', height: '28px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: 800, flexShrink: 0,
    color: '#94a3b8',
  },
  optionText: { flex: 1, lineHeight: 1.3 },

  // Result styles
  resultBox: {
    margin: 'auto', textAlign: 'center',
    background: '#111827', border: '1px solid #2d3748',
    borderRadius: '24px', padding: '40px 32px',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '16px',
    width: '100%',
  },
  resultTitle: {
    fontFamily: "'Cinzel Decorative', cursive",
    color: '#ffd700', fontSize: '24px',
  },
  resultScore: {
    fontSize: '48px', fontWeight: 800, color: '#e2e8f0',
  },
  recapList: {
    width: '100%', display: 'flex', flexDirection: 'column',
    gap: '8px', maxHeight: '240px', overflowY: 'auto',
    marginTop: '8px',
  },
  recapRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', background: '#1a2235',
    borderRadius: '8px', padding: '10px 14px',
    border: '1px solid', fontSize: '13px',
    color: '#e2e8f0', gap: '12px', flexWrap: 'wrap',
  },
  btnFinish: {
    background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
    border: 'none', borderRadius: '12px',
    padding: '14px 32px', color: '#0a0e1a',
    fontWeight: 800, fontSize: '16px', marginTop: '8px',
    cursor: 'pointer',
  },
}

export default VocabularyMatch
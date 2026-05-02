import { useState, useEffect } from 'react'

const ALL_WORDS = [
    { word: 'ADVENTURE', hint: 'An exciting or unusual experience' },
    { word: 'BEAUTIFUL', hint: 'Pleasing to the senses or mind' },
    { word: 'CHALLENGE', hint: 'Something difficult that requires effort' },
    { word: 'DISCOVER', hint: 'To find something for the first time' },
    { word: 'ELEPHANT', hint: 'The largest land animal on Earth' },
    { word: 'FREEDOM', hint: 'The power to act or speak without restraint' },
    { word: 'GRATEFUL', hint: 'Feeling thankful for something received' },
    { word: 'HORIZON', hint: 'The line where sky meets the earth' },
    { word: 'IMAGINE', hint: 'To form a picture in your mind' },
    { word: 'JOURNEY', hint: 'Traveling from one place to another' },
    { word: 'KNOWLEDGE', hint: 'Facts and information acquired through learning' },
    { word: 'LANGUAGE', hint: 'A system of communication used by people' },
    { word: 'MOUNTAIN', hint: 'A large natural elevation of earth' },
    { word: 'NOTEBOOK', hint: 'A book with blank pages for writing' },
    { word: 'PATIENCE', hint: 'Calm endurance of hardship or delay' },
    { word: 'QUESTION', hint: 'A sentence asking for information' },
    { word: 'RAINBOW', hint: 'A colorful arc seen after rain' },
    { word: 'STRENGTH', hint: 'Physical or mental power and energy' },
    { word: 'TREASURE', hint: 'A collection of valuable things' },
    { word: 'UNIVERSE', hint: 'All of space and everything in it' },
]

const TOTAL_QUESTIONS = 8
const TIME_PER_QUESTION = 20

function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5)
}

function scrambleWord(word) {
    let result
    do {
        result = shuffle(word.split('')).join('')
    } while (result === word)
    return result
}

function WordScramble({ navigate, completeGame }) {
    const [questions] = useState(() => shuffle(ALL_WORDS).slice(0, TOTAL_QUESTIONS))
    const [index, setIndex] = useState(0)
    const [scrambled, setScrambled] = useState([])
    const [answer, setAnswer] = useState([])
    const [timer, setTimer] = useState(TIME_PER_QUESTION)
    const [phase, setPhase] = useState('playing')
    const [feedback, setFeedback] = useState(null)
    const [score, setScore] = useState(0)
    const [results, setResults] = useState([])
    const [showHint, setShowHint] = useState(false)
    const [revealedPositions, setRevealedPositions] = useState([])

    const currentQ = questions[index]

    // Reset tiap soal baru
    useEffect(() => {
        const letters = scrambleWord(currentQ.word).split('').map((char, i) => ({
            char,
            id: `${i}-${char}`
        }))
        setScrambled(letters)
        setAnswer([])
        setTimer(TIME_PER_QUESTION)
        setFeedback(null)
        setShowHint(false)
        setRevealedPositions([])
    }, [index])

    // Timer countdown
    useEffect(() => {
        if (phase !== 'playing' || feedback !== null) return
        if (timer === 0) {
            handleTimeout()
            return
        }
        const interval = setInterval(() => setTimer(t => t - 1), 1000)
        return () => clearInterval(interval)
    }, [timer, phase, feedback])

    // Auto-cek jawaban
    useEffect(() => {
        if (answer.length === 0) return
        if (answer.filter(Boolean).length === currentQ.word.length) {
            const typed = currentQ.word.split('').map((_, i) => answer[i]?.char ?? '').join('')
            if (typed === currentQ.word) {
                handleResult(true)
            } else {
                handleResult(false)
            }
        }
    }, [answer])

    const handleTimeout = () => {
        setFeedback('timeout')
        setResults(prev => [...prev, { word: currentQ.word, isCorrect: false }])
        setTimeout(() => {
            if (index + 1 >= TOTAL_QUESTIONS) setPhase('result')
            else setIndex(i => i + 1)
        }, 1200)
    }

    const handleResult = (isCorrect) => {
        setFeedback(isCorrect ? 'correct' : 'wrong')
        if (isCorrect) setScore(s => s + 10)
        setResults(prev => [...prev, { word: currentQ.word, isCorrect }])
        setTimeout(() => {
            if (index + 1 >= TOTAL_QUESTIONS) setPhase('result')
            else setIndex(i => i + 1)
        }, 1200)
    }

    const pickLetter = (letter) => {
        if (feedback !== null) return
        setScrambled(prev => prev.filter(l => l.id !== letter.id))
        setAnswer(prev => {
            const newAnswer = [...prev]
            // Isi slot kosong pertama
            const emptyIndex = currentQ.word.split('').findIndex((_, i) => !newAnswer[i])
            if (emptyIndex !== -1) newAnswer[emptyIndex] = letter
            return newAnswer
        })
    }

    const returnLetter = (pos) => {
        if (feedback !== null) return
        if (revealedPositions.includes(pos)) return
        const letter = answer[pos]
        if (!letter) return
        setAnswer(prev => {
            const newAnswer = [...prev]
            newAnswer[pos] = undefined
            return newAnswer
        })
        setScrambled(prev => [...prev, letter])
    }

    const handleClear = () => {
        if (feedback !== null) return
        const toReturn = answer.filter((l, i) => l && !revealedPositions.includes(i))
        setScrambled(prev => [...prev, ...toReturn])
        setAnswer(prev => prev.map((l, i) => revealedPositions.includes(i) ? l : undefined))
    }

    const handleReveal = () => {
        if (feedback !== null) return
        const unfilledPositions = currentQ.word.split('')
            .map((char, i) => ({ char, i }))
            .filter(({ i }) => !answer[i] && !revealedPositions.includes(i))

        if (unfilledPositions.length === 0) return

        const { char, i: pos } = unfilledPositions[0]

        setRevealedPositions(prev => [...prev, pos])
        setScore(s => Math.max(0, s - 5))

        const letterInBank = scrambled.find(l => l.char === char)
        if (letterInBank) {
            setScrambled(prev => prev.filter(l => l.id !== letterInBank.id))
            setAnswer(prev => {
                const newAnswer = [...prev]
                newAnswer[pos] = letterInBank
                return newAnswer
            })
        }
    }

    if (phase === 'result') {
        return (
            <ScrambleResult
                score={score}
                total={TOTAL_QUESTIONS}
                results={results}
                onFinish={() => {
                    const xpEarned = Math.round((score / (TOTAL_QUESTIONS * 10)) * 100)
                    completeGame('scramble', score, xpEarned)
                }}
            />
        )
    }

    const progress = (index / TOTAL_QUESTIONS) * 100
    const timerColor = timer <= 5 ? '#ff6b6b' : timer <= 10 ? '#f59e0b' : '#00e5a0'
    const feedbackBg = feedback === 'correct' ? '#10b98115' : feedback ? '#ff6b6b15' : 'transparent'
    const feedbackBorder = feedback === 'correct' ? '#10b981' : feedback ? '#ff6b6b' : '#2d3748'

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <button style={styles.backBtn} onClick={() => navigate('select')}>← Back</button>
                <div style={styles.headerCenter}>
                    <p style={styles.headerTitle}>🔀 Word Scramble</p>
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
                <p style={styles.questionLabel}>Unscramble this word:</p>

                {/* Kotak Jawaban */}
                <div style={styles.answerRow}>
                    {currentQ.word.split('').map((_, i) => {
                        const letter = answer[i]
                        const isRevealed = revealedPositions.includes(i)
                        return (
                            <div
                                key={i}
                                style={{
                                    ...styles.letterBox,
                                    background: isRevealed ? '#2d1b69' : letter ? '#1a3a5c' : '#1a2235',
                                    borderColor: isRevealed ? '#a855f7' : letter ? '#3b82f6' : '#2d3748',
                                    cursor: letter && !isRevealed ? 'pointer' : 'default',
                                }}
                                onClick={() => returnLetter(i)}
                            >
                                <span style={{ ...styles.letterChar, color: isRevealed ? '#a855f7' : '#e2e8f0' }}>
                                    {letter ? letter.char : ''}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {/* Feedback */}
                {feedback && (
                    <p style={{
                        color: feedback === 'correct' ? '#10b981' : feedback === 'wrong' ? '#ff6b6b' : '#f59e0b',
                        fontWeight: 800, fontSize: '16px', marginTop: '8px',
                    }}>
                        {feedback === 'correct'
                            ? '✓ Correct! +10 pts'
                            : feedback === 'wrong'
                                ? `✗ Wrong! It was: ${currentQ.word}`
                                : `⏱ Time's up! Answer: ${currentQ.word}`}
                    </p>
                )}

                {/* Tombol Hint & Reveal */}
                {!feedback && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button style={styles.hintBtn} onClick={() => setShowHint(h => !h)}>
                            {showHint ? '🙈 Hide Hint' : '💡 Show Hint'}
                        </button>
                        <button
                            style={{ ...styles.hintBtn, borderColor: '#a855f744', color: '#a855f7', background: '#a855f711' }}
                            onClick={handleReveal}
                        >
                            🔍 Reveal Letter <span style={{ color: '#ff6b6b', fontSize: '11px' }}>(-5 pts)</span>
                        </button>
                    </div>
                )}

                {showHint && !feedback && (
                    <p style={styles.hintText}>💡 {currentQ.hint}</p>
                )}
            </div>

            {/* Bank Huruf */}
            <div style={styles.bankSection}>
                <p style={styles.bankLabel}>Available Letters — tap to place:</p>
                <div style={styles.bankRow}>
                    {scrambled.map((letter) => (
                        <button
                            key={letter.id}
                            style={styles.bankLetter}
                            onClick={() => pickLetter(letter)}
                            disabled={feedback !== null}
                        >
                            {letter.char}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tombol Clear */}
            <button style={styles.clearBtn} onClick={handleClear} disabled={feedback !== null}>
                🗑️ Clear Answer
            </button>
        </div>
    )
}

function ScrambleResult({ score, total, results, onFinish }) {
    const percentage = Math.round((score / (total * 10)) * 100)
    const xpEarned = Math.round(percentage)
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
                            <span style={{ fontWeight: 800, letterSpacing: '2px' }}>{r.word}</span>
                            <span style={{ color: r.isCorrect ? '#10b981' : '#ff6b6b', fontWeight: 700 }}>
                                {r.isCorrect ? '✓ Correct' : '✗ Wrong'}
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

const styles = {
    container: {
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, #0f1e3d 0%, #0a0e1a 60%)',
        padding: '24px', maxWidth: '600px', margin: '0 auto',
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
        background: 'linear-gradient(90deg, #10b981, #3b82f6)',
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
        border: '1px solid', borderRadius: '20px', padding: '28px',
        textAlign: 'center', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '16px', transition: 'all 0.3s',
    },
    questionLabel: { color: '#94a3b8', fontSize: '14px' },
    answerRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' },
    letterBox: {
        width: '44px', height: '52px', borderRadius: '10px',
        border: '2px solid', display: 'flex', alignItems: 'center',
        justifyContent: 'center', transition: 'all 0.15s',
    },
    letterChar: { fontWeight: 800, fontSize: '20px' },
    hintBtn: {
        background: 'none', border: '1px solid #2d3748',
        color: '#94a3b8', borderRadius: '8px',
        padding: '6px 14px', fontSize: '13px', cursor: 'pointer',
        fontFamily: "'Nunito', sans-serif",
    },
    hintText: {
        color: '#f59e0b', fontSize: '13px', fontStyle: 'italic',
        background: '#f59e0b11', borderRadius: '8px', padding: '8px 14px',
    },
    bankSection: { display: 'flex', flexDirection: 'column', gap: '10px' },
    bankLabel: { color: '#94a3b8', fontSize: '13px', textAlign: 'center' },
    bankRow: { display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' },
    bankLetter: {
        width: '48px', height: '56px', borderRadius: '10px',
        background: '#1a3a5c', border: '2px solid #3b82f6',
        color: '#e2e8f0', fontWeight: 800, fontSize: '20px',
        cursor: 'pointer', transition: 'all 0.15s',
        fontFamily: "'Nunito', sans-serif",
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
        gap: '8px', maxHeight: '240px', overflowY: 'auto', marginTop: '8px',
    },
    recapRow: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: '#1a2235', borderRadius: '8px', padding: '10px 14px',
        border: '1px solid', fontSize: '13px', color: '#e2e8f0', gap: '12px', flexWrap: 'wrap',
    },
    btnFinish: {
        background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
        border: 'none', borderRadius: '12px', padding: '14px 32px',
        color: '#0a0e1a', fontWeight: 800, fontSize: '16px', marginTop: '8px', cursor: 'pointer',
    },
}

export default WordScramble
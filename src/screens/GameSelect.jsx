import { useMemo } from 'react'

const GAMES = [
  {
    id: 'vocab',
    icon: '🔤',
    title: 'Vocabulary Match',
    desc: 'Match English words with their Indonesian meaning',
    level: 'Beginner',
    color: '#3b82f6',
    xp: 100,
  },
  {
    id: 'scramble',
    icon: '🔀',
    title: 'Word Scramble',
    desc: 'Unscramble jumbled letters to form the correct word',
    level: 'Intermediate',
    color: '#10b981',
    xp: 100,
  },
  {
    id: 'sentence',
    icon: '📝',
    title: 'Sentence Builder',
    desc: 'Arrange words to build a correct English sentence',
    level: 'Intermediate',
    color: '#f59e0b',
    xp: 150,
  },
  {
    id: 'grammar',
    icon: '📖',
    title: 'Grammar Quiz',
    desc: 'Test your grammar knowledge with challenging questions',
    level: 'Advanced',
    color: '#ef4444',
    xp: 200,
  },
]

function GameSelect({ navigate, playerData }) {
  const allDone       = playerData.gamesCompleted.length === GAMES.length
  const xpToNextLevel = playerData.level * 200
  const xpInLevel     = playerData.xp - ((playerData.level - 1) * 200)
  const xpProgress    = Math.min((xpInLevel / xpToNextLevel) * 100, 100)

  return (
    <div style={styles.container}>
      {/* Header pemain */}
      <div style={{ ...styles.header, animation: 'fadeInUp 0.5s ease both' }}>
        <div>
          <p style={styles.greeting}>Welcome back, Adventurer!</p>
          <p style={styles.playerName}>⚔️ {playerData.name}</p>
        </div>
        <div style={styles.xpBox}>
          <div style={styles.levelRow}>
            <span style={styles.levelBadge}>Lv.{playerData.level}</span>
            <span style={styles.xpText}>{playerData.xp} XP</span>
          </div>
          <div style={styles.xpBarBg}>
            <div style={{ ...styles.xpBarFill, width: `${xpProgress}%` }} />
          </div>
          <p style={styles.xpSub}>{xpInLevel} / {xpToNextLevel} XP to next level</p>
        </div>
      </div>

      {/* Judul */}
      <div style={{ ...styles.titleArea, animation: 'fadeInUp 0.5s 0.1s ease both' }}>
        <h2 style={styles.title}>
          {allDone ? '🏆 All Quests Completed!' : '⚔️ Choose Your Quest'}
        </h2>
        <p style={styles.subtitle}>
          {allDone
            ? `Incredible! You've mastered all 4 challenges!`
            : `${4 - playerData.gamesCompleted.length} quest(s) remaining — keep going!`}
        </p>
      </div>

      {/* Celebrasi kalau semua selesai */}
      {allDone && (
        <div style={{ ...styles.celebBox, animation: 'scaleIn 0.5s ease both' }}>
          <p style={{ fontSize: '48px' }}>🎉</p>
          <div>
            <p style={styles.celebTitle}>English Master!</p>
            <p style={styles.celebSub}>
              Total Score: <strong style={{ color: '#ffd700' }}>{playerData.totalScore} pts</strong>
              {' · '}
              Level <strong style={{ color: '#a855f7' }}>{playerData.level}</strong>
              {' · '}
              <strong style={{ color: '#00e5a0' }}>{playerData.xp} XP</strong>
            </p>
          </div>
        </div>
      )}

      {/* Grid Game Cards */}
      <div style={styles.grid}>
        {GAMES.map((game, i) => {
          const completed = playerData.gamesCompleted.includes(game.id)
          return (
            <GameCard
              key={game.id}
              game={game}
              completed={completed}
              delay={`${i * 0.08}s`}
              onClick={() => navigate(game.id)}
            />
          )
        })}
      </div>

      {/* Footer stats */}
      <div style={{ ...styles.statsRow, animation: 'fadeInUp 0.5s 0.4s ease both' }}>
        <StatPill icon="🏆" label="Total Score" value={playerData.totalScore} color="#ffd700" />
        <StatPill icon="✅" label="Completed"   value={`${playerData.gamesCompleted.length}/4`} color="#10b981" />
        <StatPill icon="⭐" label="Total XP"    value={playerData.xp} color="#a855f7" />
      </div>
    </div>
  )
}

function GameCard({ game, completed, delay, onClick }) {
  return (
    <div
      className="game-card"
      style={{
        ...styles.card,
        borderColor: completed ? game.color + '88' : '#2d3748',
        boxShadow:   completed ? `0 0 20px ${game.color}18` : 'none',
        animation:   `fadeInUp 0.5s ${delay} ease both`,
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      {/* Icon */}
      <div style={{ ...styles.cardIcon, background: game.color + '18' }}>
        <span style={{ fontSize: '34px' }}>{game.icon}</span>
        {completed && (
          <div style={styles.completedRing}>
            <span style={{ fontSize: '14px' }}>✓</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={styles.cardBody}>
        <div style={styles.cardTop}>
          <h3 style={styles.cardTitle}>{game.title}</h3>
          {completed
            ? <span style={{ ...styles.statusBadge, background: game.color + '22', color: game.color }}>Done ✓</span>
            : <span style={styles.playBadge}>Play ▶</span>
          }
        </div>
        <p style={styles.cardDesc}>{game.desc}</p>
        <div style={styles.cardFooter}>
          <span style={{ ...styles.levelChip, background: game.color + '22', color: game.color }}>
            {game.level}
          </span>
          <span style={styles.xpReward}>+{game.xp} XP</span>
        </div>
      </div>
    </div>
  )
}

function StatPill({ icon, label, value, color }) {
  return (
    <div style={styles.statPill}>
      <span style={{ fontSize: '18px' }}>{icon}</span>
      <div>
        <p style={{ ...styles.statValue, color }}>{value}</p>
        <p style={styles.statLabel}>{label}</p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at 50% 0%, #0f1e3d 0%, #0a0e1a 55%)',
    padding: '24px', maxWidth: '900px', margin: '0 auto',
    display: 'flex', flexDirection: 'column', gap: '24px',
  },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', flexWrap: 'wrap', gap: '16px',
    background: '#111827', borderRadius: '18px',
    padding: '20px 24px', border: '1px solid #2d3748',
    boxShadow: '0 4px 24px #0004',
  },
  greeting: { color: '#94a3b8', fontSize: '12px', marginBottom: '4px' },
  playerName: { color: '#ffd700', fontWeight: 800, fontSize: '22px' },
  xpBox: { flex: 1, minWidth: '200px', maxWidth: '260px' },
  levelRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  levelBadge: {
    background: 'linear-gradient(135deg, #a855f7, #6366f1)',
    color: '#fff', borderRadius: '999px',
    padding: '2px 12px', fontSize: '12px', fontWeight: 800,
  },
  xpText: { color: '#94a3b8', fontSize: '12px' },
  xpBarBg: {
    background: '#1a2235', borderRadius: '999px',
    height: '8px', overflow: 'hidden',
  },
  xpBarFill: {
    background: 'linear-gradient(90deg, #a855f7, #ffd700)',
    height: '100%', borderRadius: '999px',
    transition: 'width 0.6s ease',
  },
  xpSub: { color: '#475569', fontSize: '11px', marginTop: '5px', textAlign: 'right' },

  titleArea: { textAlign: 'center' },
  title: {
    fontFamily: "'Cinzel Decorative', cursive",
    color: '#ffd700', fontSize: '22px',
    textShadow: '0 0 30px #ffd70040',
  },
  subtitle: { color: '#94a3b8', fontSize: '14px', marginTop: '6px' },

  celebBox: {
    display: 'flex', alignItems: 'center', gap: '16px',
    background: 'linear-gradient(135deg, #ffd70010, #10b98110)',
    border: '1px solid #ffd70033',
    borderRadius: '16px', padding: '20px 24px',
  },
  celebTitle: {
    fontFamily: "'Cinzel Decorative', cursive",
    color: '#ffd700', fontSize: '18px', marginBottom: '6px',
  },
  celebSub: { color: '#94a3b8', fontSize: '14px' },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '14px',
  },
  card: {
    background: '#111827', border: '1px solid',
    borderRadius: '18px', padding: '18px 20px',
    display: 'flex', gap: '16px',
    position: 'relative', overflow: 'hidden',
  },
  cardIcon: {
    width: '68px', height: '68px', borderRadius: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, position: 'relative',
  },
  completedRing: {
    position: 'absolute', bottom: '-4px', right: '-4px',
    width: '22px', height: '22px', borderRadius: '50%',
    background: '#10b981', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    color: '#fff', border: '2px solid #111827',
    fontWeight: 800,
  },
  cardBody: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' },
  cardTitle: { color: '#e2e8f0', fontWeight: 800, fontSize: '15px' },
  statusBadge: {
    fontSize: '11px', fontWeight: 800,
    padding: '3px 10px', borderRadius: '999px',
    flexShrink: 0,
  },
  playBadge: {
    fontSize: '11px', fontWeight: 800,
    padding: '3px 10px', borderRadius: '999px',
    background: '#ffffff10', color: '#94a3b8',
    flexShrink: 0,
  },
  cardDesc: { color: '#64748b', fontSize: '13px', lineHeight: 1.5 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' },
  levelChip: {
    fontSize: '11px', fontWeight: 700,
    padding: '3px 10px', borderRadius: '999px',
  },
  xpReward: { color: '#ffd700', fontWeight: 800, fontSize: '13px' },

  statsRow: {
    display: 'flex', gap: '10px', flexWrap: 'wrap',
  },
  statPill: {
    flex: 1, minWidth: '120px',
    background: '#111827', border: '1px solid #2d3748',
    borderRadius: '14px', padding: '14px 16px',
    display: 'flex', gap: '12px', alignItems: 'center',
  },
  statValue: { fontWeight: 800, fontSize: '18px' },
  statLabel: { color: '#475569', fontSize: '11px', marginTop: '2px' },
}

export default GameSelect
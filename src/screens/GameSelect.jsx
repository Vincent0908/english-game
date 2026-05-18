import { useState } from 'react'

const GAMES = [
  { id: 'vocab',    icon: '🔤', title: 'Vocabulary Match',  desc: 'Match English words with their Indonesian meaning',      level: 'Beginner',     color: '#3b82f6', gradient: 'from-blue-500 to-cyan-400',     xp: 100 },
  { id: 'scramble', icon: '🔀', title: 'Word Scramble',     desc: 'Unscramble jumbled letters to form the correct word',    level: 'Intermediate', color: '#10b981', gradient: 'from-emerald-500 to-teal-400', xp: 100 },
  { id: 'sentence', icon: '📝', title: 'Sentence Builder',  desc: 'Arrange words to build a correct English sentence',      level: 'Intermediate', color: '#f59e0b', gradient: 'from-amber-400 to-orange-500',  xp: 150 },
  { id: 'grammar',  icon: '📖', title: 'Grammar Quiz',      desc: 'Test your grammar knowledge with challenging questions', level: 'Advanced',     color: '#ef4444', gradient: 'from-red-500 to-purple-500',   xp: 200 },
]

const DIFF_INFO = {
  easy:   { label: 'Easy',   emoji: '🌱', color: '#10b981' },
  normal: { label: 'Normal', emoji: '⚔️', color: '#3b82f6' },
  hard:   { label: 'Hard',   emoji: '🔥', color: '#ef4444' },
}

function GameSelect({ navigate, playerData, difficulty, setDifficulty }) {
  const allDone    = playerData.gamesCompleted.length === GAMES.length
  const xpInLevel  = playerData.xp - ((playerData.level - 1) * 200)
  const xpProgress = Math.min((xpInLevel / 200) * 100, 100)
  const accuracy   = playerData.totalAnswered > 0 ? Math.round((playerData.totalCorrect / playerData.totalAnswered) * 100) : 0
  const diffInfo   = DIFF_INFO[difficulty]

  return (
    <div className="min-h-screen bg-game px-4 sm:px-6 py-6 max-w-5xl mx-auto flex flex-col gap-5">

      {/* Header - Player Info */}
      <div className="glass-card rounded-2xl px-5 sm:px-6 py-5 flex justify-between items-center flex-wrap gap-4 animate-fadeInUp shadow-[0_4px_30px_#0006]">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/30 to-amber-600/30 border-2 border-gold/40 flex items-center justify-center text-xl font-extrabold text-gold pulse-glow">
            {playerData.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-slate-500 text-[10px] uppercase tracking-wider">Adventurer</p>
            <p className="text-gold font-extrabold text-lg leading-tight">{playerData.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Difficulty badge */}
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold transition-all hover:scale-105"
            style={{ background: diffInfo.color + '20', color: diffInfo.color, border: `1px solid ${diffInfo.color}33` }}
            onClick={() => {
              const diffs = ['easy', 'normal', 'hard']
              const nextIdx = (diffs.indexOf(difficulty) + 1) % diffs.length
              setDifficulty(diffs[nextIdx])
            }}
            title="Click to change difficulty"
          >
            <span>{diffInfo.emoji}</span>
            <span>{diffInfo.label}</span>
          </button>

          {/* Level & XP */}
          <div className="min-w-[180px] max-w-[240px]">
            <div className="flex justify-between mb-1.5">
              <span className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full px-3 py-0.5 text-xs font-extrabold shadow-[0_2px_10px_#7c3aed44]">
                Lv.{playerData.level}
              </span>
              <span className="text-slate-400 text-xs font-bold">{playerData.xp} XP</span>
            </div>
            <div className="bg-navy rounded-full h-2.5 overflow-hidden relative">
              <div className="h-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-gold transition-all duration-700" style={{ width: `${xpProgress}%` }} />
              <div className="absolute inset-0 xp-shimmer rounded-full" />
            </div>
            <p className="text-[#475569] text-[10px] mt-1 text-right">{xpInLevel} / 200 XP to next level</p>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center animate-[fadeInUp_0.5s_0.1s_ease_both]">
        <h2 className="font-quest text-gold text-xl sm:text-2xl tracking-[3px]" style={{ textShadow: '0 0 30px #ffd70040' }}>
          {allDone ? '🏆 ALL QUESTS COMPLETED!' : '⚔️ CHOOSE YOUR QUEST'}
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          {allDone ? "Incredible! You've mastered all 4 challenges!" : `${4 - playerData.gamesCompleted.length} quest(s) remaining — keep going!`}
        </p>
      </div>

      {/* Celebration */}
      {allDone && (
        <div className="flex items-center gap-4 bg-gradient-to-r from-[#ffd70010] via-[#7c3aed10] to-[#10b98110] border border-[#ffd70033] rounded-2xl px-6 py-5 animate-scaleIn relative overflow-hidden">
          <div className="absolute inset-0 xp-shimmer" />
          <span className="text-5xl relative z-10">🎉</span>
          <div className="relative z-10">
            <p className="font-quest text-gold text-lg mb-1">English Master!</p>
            <p className="text-slate-400 text-sm">
              Score: <strong className="text-gold">{playerData.totalScore} pts</strong>
              {' · '}Level <strong className="text-purple-400">{playerData.level}</strong>
              {' · '}<strong className="text-teal">{playerData.xp} XP</strong>
            </p>
          </div>
        </div>
      )}

      {/* Grid Game Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GAMES.map((game, i) => (
          <GameCard
            key={game.id}
            game={game}
            completed={playerData.gamesCompleted.includes(game.id)}
            bestScore={playerData.bestScores?.[game.id]}
            delay={`${i * 0.08}s`}
            onClick={() => navigate(game.id)}
          />
        ))}
      </div>

      {/* Stats bottom */}
      <div className="grid grid-cols-4 gap-2 animate-[fadeInUp_0.5s_0.4s_ease_both]">
        {[
          { icon: '🏆', label: 'Score',    value: playerData.totalScore,      color: 'text-gold' },
          { icon: '✅', label: 'Quests',   value: `${playerData.gamesCompleted.length}/4`, color: 'text-emerald-400' },
          { icon: '⭐', label: 'XP',       value: playerData.xp,              color: 'text-purple-400' },
          { icon: '🎯', label: 'Accuracy', value: `${accuracy}%`,             color: 'text-cyan-400' },
        ].map(({ icon, label, value, color }) => (
          <div key={label} className="glass-card rounded-2xl p-3 sm:p-4 flex flex-col items-center gap-1 text-center">
            <span className="text-lg">{icon}</span>
            <p className={`font-extrabold text-base sm:text-lg ${color}`}>{value}</p>
            <p className="text-[#475569] text-[10px]">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function GameCard({ game, completed, bestScore, delay, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`glass-card rounded-2xl p-5 flex gap-4 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] active:scale-[0.99] relative overflow-hidden group`}
      style={{
        borderColor: completed ? game.color + '88' : hovered ? game.color + '44' : '#2d374866',
        boxShadow: completed ? `0 0 25px ${game.color}15` : hovered ? `0 0 20px ${game.color}10` : 'none',
        animation: `fadeInUp 0.5s ${delay} ease both`,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${game.color}08 0%, transparent 60%)` }}
      />

      <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 relative transition-transform group-hover:scale-110" style={{ background: game.color + '18' }}>
        <span className="text-3xl">{game.icon}</span>
        {completed && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-panel text-white text-xs font-extrabold shadow-[0_2px_8px_#10b98144]">✓</div>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-2 relative z-10">
        <div className="flex justify-between items-center gap-2">
          <h3 className="text-slate-200 font-extrabold text-sm">{game.title}</h3>
          {completed
            ? <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: game.color + '22', color: game.color }}>Done ✓</span>
            : <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 bg-white/5 text-slate-400 group-hover:bg-white/10 transition-colors">Play ▶</span>
          }
        </div>
        <p className="text-slate-500 text-xs leading-relaxed">{game.desc}</p>
        <div className="flex justify-between items-center mt-1">
          <div className="flex gap-2 items-center">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: game.color + '22', color: game.color }}>{game.level}</span>
            {bestScore !== undefined && (
              <span className="text-[10px] font-bold text-slate-500">Best: {bestScore}</span>
            )}
          </div>
          <span className="text-gold font-extrabold text-xs">+{game.xp} XP</span>
        </div>
      </div>
    </div>
  )
}

export default GameSelect
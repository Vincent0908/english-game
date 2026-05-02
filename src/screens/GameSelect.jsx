
const GAMES = [
  { id: 'vocab',    icon: '🔤', title: 'Vocabulary Match',  desc: 'Match English words with their Indonesian meaning',      level: 'Beginner',     color: '#3b82f6', xp: 100 },
  { id: 'scramble', icon: '🔀', title: 'Word Scramble',     desc: 'Unscramble jumbled letters to form the correct word',    level: 'Intermediate', color: '#10b981', xp: 100 },
  { id: 'sentence', icon: '📝', title: 'Sentence Builder',  desc: 'Arrange words to build a correct English sentence',      level: 'Intermediate', color: '#f59e0b', xp: 150 },
  { id: 'grammar',  icon: '📖', title: 'Grammar Quiz',      desc: 'Test your grammar knowledge with challenging questions', level: 'Advanced',     color: '#ef4444', xp: 200 },
]

function GameSelect({ navigate, playerData }) {
  const allDone    = playerData.gamesCompleted.length === GAMES.length
  const xpInLevel  = playerData.xp - ((playerData.level - 1) * 200)
  const xpProgress = Math.min((xpInLevel / (playerData.level * 200)) * 100, 100)

  return (
    <div className="min-h-screen bg-game px-6 py-6 max-w-5xl mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="bg-panel border border-dim rounded-2xl px-6 py-5 flex justify-between items-center flex-wrap gap-4 animate-fadeInUp shadow-[0_4px_24px_#0004]">
        <div>
          <p className="text-slate-400 text-xs mb-1">Welcome back, Adventurer!</p>
          <p className="text-gold font-extrabold text-xl">⚔️ {playerData.name}</p>
        </div>
        <div className="flex-1 min-w-[200px] max-w-[260px]">
          <div className="flex justify-between mb-1.5">
            <span className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-full px-3 py-0.5 text-xs font-extrabold">
              Lv.{playerData.level}
            </span>
            <span className="text-slate-400 text-xs">{playerData.xp} XP</span>
          </div>
          <div className="bg-navy rounded-full h-2 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-gold transition-all duration-700" style={{ width: `${xpProgress}%` }} />
          </div>
          <p className="text-[#475569] text-[11px] mt-1 text-right">{xpInLevel} / {playerData.level * 200} XP to next level</p>
        </div>
      </div>

      {/* Judul */}
      <div className="text-center animate-[fadeInUp_0.5s_0.1s_ease_both]">
        <h2 className="font-quest text-gold text-xl tracking-[3px]" style={{ textShadow: '0 0 30px #ffd70040' }}>
          {allDone ? '🏆 ALL QUESTS COMPLETED!' : '⚔️ CHOOSE YOUR QUEST'}
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          {allDone ? "Incredible! You've mastered all 4 challenges!" : `${4 - playerData.gamesCompleted.length} quest(s) remaining — keep going!`}
        </p>
      </div>

      {/* Celebrasi */}
      {allDone && (
        <div className="flex items-center gap-4 bg-gradient-to-r from-[#ffd70010] to-[#10b98110] border border-[#ffd70033] rounded-2xl px-6 py-5 animate-scaleIn">
          <span className="text-5xl">🎉</span>
          <div>
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
            delay={`${i * 0.08}s`}
            onClick={() => navigate(game.id)}
          />
        ))}
      </div>

      {/* Stats bawah */}
      <div className="grid grid-cols-3 gap-2 animate-[fadeInUp_0.5s_0.4s_ease_both]">
        {[
          { icon: '🏆', label: 'Total Score', value: playerData.totalScore, color: 'text-gold' },
          { icon: '✅', label: 'Completed',   value: `${playerData.gamesCompleted.length}/4`, color: 'text-emerald-400' },
          { icon: '⭐', label: 'Total XP',    value: playerData.xp, color: 'text-purple-400' },
        ].map(({ icon, label, value, color }) => (
          <div key={label} className="bg-panel border border-dim rounded-2xl p-4 flex gap-3 items-center">
            <span className="text-xl">{icon}</span>
            <div>
              <p className={`font-extrabold text-lg ${color}`}>{value}</p>
              <p className="text-[#475569] text-[11px]">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GameCard({ game, completed, delay, onClick }) {
  return (
    <div
      className="bg-panel border rounded-2xl p-5 flex gap-4 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.99]"
      style={{
        borderColor: completed ? game.color + '88' : '#2d3748',
        boxShadow:   completed ? `0 0 20px ${game.color}15` : 'none',
        animation:   `fadeInUp 0.5s ${delay} ease both`,
      }}
      onClick={onClick}
    >
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 relative" style={{ background: game.color + '18' }}>
        <span className="text-3xl">{game.icon}</span>
        {completed && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-panel text-white text-xs font-extrabold">✓</div>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex justify-between items-center gap-2">
          <h3 className="text-slate-200 font-extrabold text-sm">{game.title}</h3>
          {completed
            ? <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: game.color + '22', color: game.color }}>Done ✓</span>
            : <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 bg-white/5 text-slate-400">Play ▶</span>
          }
        </div>
        <p className="text-slate-500 text-xs leading-relaxed">{game.desc}</p>
        <div className="flex justify-between items-center mt-1">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: game.color + '22', color: game.color }}>{game.level}</span>
          <span className="text-gold font-extrabold text-xs">+{game.xp} XP</span>
        </div>
      </div>
    </div>
  )
}

export default GameSelect
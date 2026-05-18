import { useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import GameSelect from './screens/GameSelect'
import VocabularyMatch from './screens/VocabularyMatch'
import WordScramble from './screens/WordScramble'
import SentenceBuilder from './screens/SentenceBuilder'
import GrammarQuiz from './screens/GrammarQuiz'
import CreatorProfile from './screens/CreatorProfile'

function App() {
  const [screen, setScreen] = useState('home')
  const [difficulty, setDifficulty] = useState('normal') // easy | normal | hard
  const [playerData, setPlayerData] = useState({
    name: '',
    xp: 0,
    level: 1,
    totalScore: 0,
    gamesCompleted: [],
    bestScores: {},
    totalCorrect: 0,
    totalAnswered: 0,
    achievements: [],
  })

  const navigate = (screenName) => setScreen(screenName)

  const updatePlayer = (newData) => {
    setPlayerData(prev => {
      const updated = { ...prev, ...newData }
      updated.level = Math.floor(updated.xp / 200) + 1
      return updated
    })
  }

  const completeGame = (gameId, scoreEarned, xpEarned, correctCount = 0, totalCount = 0) => {
    setPlayerData(prev => {
      // Difficulty multiplier
      const mult = difficulty === 'easy' ? 0.8 : difficulty === 'hard' ? 1.5 : 1
      const adjustedXp = Math.round(xpEarned * mult)
      const adjustedScore = Math.round(scoreEarned * mult)
      
      const newXp = prev.xp + adjustedXp
      const newScore = prev.totalScore + adjustedScore
      const newLevel = Math.floor(newXp / 200) + 1
      const alreadyDone = prev.gamesCompleted.includes(gameId)
      
      // Track best score
      const bestScores = { ...prev.bestScores }
      if (!bestScores[gameId] || adjustedScore > bestScores[gameId]) {
        bestScores[gameId] = adjustedScore
      }

      // Check achievements
      const achievements = [...prev.achievements]
      if (newLevel >= 5 && !achievements.includes('level5')) achievements.push('level5')
      if (newLevel >= 10 && !achievements.includes('level10')) achievements.push('level10')
      if (correctCount === totalCount && totalCount > 0 && !achievements.includes('perfect_' + gameId)) {
        achievements.push('perfect_' + gameId)
      }
      
      return {
        ...prev,
        xp: newXp,
        totalScore: newScore,
        level: newLevel,
        gamesCompleted: alreadyDone ? prev.gamesCompleted : [...prev.gamesCompleted, gameId],
        bestScores,
        totalCorrect: prev.totalCorrect + correctCount,
        totalAnswered: prev.totalAnswered + totalCount,
        achievements,
      }
    })
    navigate('select')
  }

  return (
    <div className="app">
      {screen === 'home' && (
        <HomeScreen navigate={navigate} playerData={playerData} updatePlayer={updatePlayer} difficulty={difficulty} setDifficulty={setDifficulty} />
      )}
      {screen === 'select' && (
        <GameSelect navigate={navigate} playerData={playerData} difficulty={difficulty} setDifficulty={setDifficulty} />
      )}
      {screen === 'vocab' && (
        <VocabularyMatch navigate={navigate} playerData={playerData} completeGame={completeGame} difficulty={difficulty} />
      )}
      {screen === 'scramble' && (
        <WordScramble navigate={navigate} playerData={playerData} completeGame={completeGame} difficulty={difficulty} />
      )}
      {screen === 'sentence' && (
        <SentenceBuilder navigate={navigate} playerData={playerData} completeGame={completeGame} difficulty={difficulty} />
      )}
      {screen === 'grammar' && (
        <GrammarQuiz navigate={navigate} playerData={playerData} completeGame={completeGame} difficulty={difficulty} />
      )}
      {screen === 'profile' && (
        <CreatorProfile navigate={navigate} />
      )}
    </div>
  )
}

export default App
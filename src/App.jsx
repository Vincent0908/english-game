import { useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import GameSelect from './screens/GameSelect'
import VocabularyMatch from './screens/VocabularyMatch'
import WordScramble from './screens/WordScramble'
import SentenceBuilder from './screens/SentenceBuilder'
import GrammarQuiz from './screens/GrammarQuiz'

function App() {
  const [screen, setScreen] = useState('home')
  const [playerData, setPlayerData] = useState({
    name: '',
    xp: 0,
    level: 1,
    totalScore: 0,
    gamesCompleted: []
  })

  const navigate = (screenName) => setScreen(screenName)

  const updatePlayer = (newData) => {
    setPlayerData(prev => {
      const updated = { ...prev, ...newData }
      updated.level = Math.floor(updated.xp / 200) + 1
      return updated
    })
  }

  const completeGame = (gameId, scoreEarned, xpEarned) => {
    setPlayerData(prev => {
      const newXp = prev.xp + xpEarned
      const newScore = prev.totalScore + scoreEarned
      const newLevel = Math.floor(newXp / 200) + 1
      const alreadyDone = prev.gamesCompleted.includes(gameId)
      return {
        ...prev,
        xp: newXp,
        totalScore: newScore,
        level: newLevel,
        gamesCompleted: alreadyDone ? prev.gamesCompleted : [...prev.gamesCompleted, gameId]
      }
    })
    navigate('select')
  }

  return (
    <div className="app">
      {screen === 'home' && (
        <HomeScreen navigate={navigate} playerData={playerData} updatePlayer={updatePlayer} />
      )}
      {screen === 'select' && (
        <GameSelect navigate={navigate} playerData={playerData} />
      )}
      {screen === 'vocab' && (
        <VocabularyMatch navigate={navigate} playerData={playerData} completeGame={completeGame} />
      )}
      {screen === 'scramble' && (
        <WordScramble navigate={navigate} playerData={playerData} completeGame={completeGame} />
      )}
      {screen === 'sentence' && (
        <SentenceBuilder navigate={navigate} playerData={playerData} completeGame={completeGame} />
      )}
      {screen === 'grammar' && (
        <GrammarQuiz navigate={navigate} playerData={playerData} completeGame={completeGame} />
      )}
    </div>
  )
}

export default App
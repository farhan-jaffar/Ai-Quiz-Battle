import { createContext, useState, useContext, useEffect } from 'react';

const GameContext = createContext();

const HISTORY_KEY = 'ai_quiz_battle_history';
const SETTINGS_KEY = 'ai_quiz_battle_settings';

const DEFAULT_SETTINGS = {
  timerDuration: 15,
  soundEnabled: true,
  animationsEnabled: true,
  username: '',
};

export function GameProvider({ children }) {
  const [userProfile, setUserProfile] = useState({
    username: '',
    level: 1,
    topic: 'General Knowledge',
    difficulty: 'Medium'
  });
  
  const [gameResult, setGameResult] = useState(null);
  
  // High-performance fetching buffer
  const [questionBuffer, setQuestionBuffer] = useState([]);

  // Game history — persisted in localStorage
  const [gameHistory, setGameHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User settings — persisted in localStorage
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Persist history to localStorage
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(gameHistory));
  }, [gameHistory]);

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const addGameToHistory = (game) => {
    setGameHistory(prev => [game, ...prev].slice(0, 50)); // Keep last 50 games
  };

  const clearHistory = () => {
    setGameHistory([]);
  };

  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const updateProfile = (updates) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const logout = () => {
    setUserProfile({
      username: '',
      level: 1,
      topic: 'General Knowledge',
      difficulty: 'Medium'
    });
    setGameResult(null);
    setQuestionBuffer([]);
  };

  return (
    <GameContext.Provider value={{
      userProfile, updateProfile, logout,
      gameResult, setGameResult,
      questionBuffer, setQuestionBuffer,
      gameHistory, addGameToHistory, clearHistory,
      settings, updateSettings,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}

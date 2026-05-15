import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { useSounds } from '../hooks/useSounds';
import { useNavigate } from 'react-router-dom';
import { Trophy, RefreshCw, Star, XCircle, Bot, User, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Result() {
  const { userProfile, gameResult, setGameResult, addGameToHistory } = useGame();
  const sfx = useSounds();
  const navigate = useNavigate();
  const savedRef = useRef(false);

  if (!gameResult) {
    navigate('/');
    return null;
  }

  const { playerScore, aiScore } = gameResult;
  const isWinner = playerScore > aiScore;
  const isTie = playerScore === aiScore;

  // Save game to history once and play result sound
  useEffect(() => {
    if (gameResult && !savedRef.current) {
      savedRef.current = true;
      addGameToHistory({
        id: Date.now(),
        date: new Date().toISOString(),
        topic: userProfile.topic || 'General Knowledge',
        difficulty: userProfile.difficulty || 'Medium',
        playerScore,
        aiScore,
        result: isWinner ? 'Victory' : isTie ? 'Draw' : 'Defeat',
        username: userProfile.username || 'Guest',
      });
      // Play result sound
      if (isWinner) sfx.victory();
      else if (isTie) sfx.draw();
      else sfx.defeat();
    }
  }, [gameResult]);

  const submitScore = async () => {
    sfx.submit();
    try {
      await fetch('http://localhost:5000/api/submit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userProfile.username || 'Guest',
          score: playerScore,
          date: new Date().toISOString()
        })
      });
      navigate('/leaderboard');
    } catch (e) {
      console.error(e);
      navigate('/leaderboard');
    }
  };

  const playAgain = () => {
    setGameResult(null);
    navigate('/');
  };

  const outcomeConfig = isWinner
    ? {
        label: 'VICTORY',
        sub: 'You outsmarted the AI!',
        iconColor: '#facc15',
        iconBg: 'rgba(234,179,8,0.15)',
        iconBorder: 'rgba(234,179,8,0.35)',
        icon: Trophy,
        glow: '0 0 40px rgba(234,179,8,0.25)',
        gradient: 'linear-gradient(135deg, rgba(234,179,8,0.15), rgba(245,158,11,0.05))',
        cardBorder: 'rgba(234,179,8,0.2)',
      }
    : isTie
    ? {
        label: 'DRAW',
        sub: 'A battle of equals!',
        iconColor: '#60a5fa',
        iconBg: 'rgba(59,130,246,0.15)',
        iconBorder: 'rgba(59,130,246,0.35)',
        icon: RefreshCw,
        glow: '0 0 40px rgba(59,130,246,0.2)',
        gradient: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(99,102,241,0.05))',
        cardBorder: 'rgba(59,130,246,0.2)',
      }
    : {
        label: 'DEFEAT',
        sub: 'The AI was too strong this time.',
        iconColor: '#f87171',
        iconBg: 'rgba(244,63,94,0.15)',
        iconBorder: 'rgba(244,63,94,0.35)',
        icon: XCircle,
        glow: '0 0 40px rgba(244,63,94,0.2)',
        gradient: 'linear-gradient(135deg, rgba(244,63,94,0.08), rgba(15,10,25,0))',
        cardBorder: 'rgba(244,63,94,0.15)',
      };

  const OIcon = outcomeConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'backOut' }}
      className="w-full max-w-md"
    >
      <div className="rounded-3xl overflow-hidden relative"
        style={{
          background: `${outcomeConfig.gradient}, rgba(8,8,20,0.8)`,
          border: `1px solid ${outcomeConfig.cardBorder}`,
          boxShadow: outcomeConfig.glow,
        }}
      >
        {/* Top glow line */}
        <div className="h-px w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${outcomeConfig.iconColor}66, transparent)` }}
        />

        <div className="py-12 px-8 flex flex-col items-center gap-6 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 rounded-2xl flex items-center justify-center"
            style={{
              background: outcomeConfig.iconBg,
              border: `1px solid ${outcomeConfig.iconBorder}`,
              boxShadow: outcomeConfig.glow,
            }}
          >
            <OIcon className="w-12 h-12" style={{ color: outcomeConfig.iconColor }} />
          </motion.div>

          {/* Title */}
          <div>
            <h1 className="text-5xl font-black tracking-tighter mb-2"
              style={{ color: outcomeConfig.iconColor }}
            >
              {outcomeConfig.label}
            </h1>
            <p className="text-slate-400 font-medium">{outcomeConfig.sub}</p>
          </div>

          {/* Score breakdown */}
          <div className="w-full grid grid-cols-2 gap-3 mt-2">
            <div className="rounded-2xl p-5 text-left"
              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-blue-300"
                  style={{ background: 'rgba(59,130,246,0.2)' }}
                >
                  {(userProfile.username || 'P').charAt(0).toUpperCase()}
                </div>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest truncate">You</p>
              </div>
              <p className="text-4xl font-black text-white">{playerScore}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">points</p>
            </div>
            <div className="rounded-2xl p-5 text-left"
              style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(244,63,94,0.2)' }}
                >
                  <Bot className="w-4 h-4 text-rose-400" />
                </div>
                <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">Neural AI</p>
              </div>
              <p className="text-4xl font-black text-white">{aiScore}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">points</p>
            </div>
          </div>

          {/* Score diff indicator */}
          <div className="text-sm font-semibold"
            style={{ color: isWinner ? '#4ade80' : isTie ? '#60a5fa' : '#f87171' }}
          >
            {isWinner
              ? `You won by ${playerScore - aiScore} points 🎉`
              : isTie
              ? 'Perfectly matched!'
              : `Lost by ${aiScore - playerScore} points`}
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col gap-3 mt-2">
            <button
              onClick={submitScore}
              className="w-full py-4 rounded-xl font-extrabold flex items-center justify-center gap-2 transition-all duration-200 text-white"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 0 24px rgba(99,102,241,0.4)'
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 35px rgba(99,102,241,0.6)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 24px rgba(99,102,241,0.4)'}
            >
              <Star className="w-5 h-5" fill="currentColor" />
              Submit to Leaderboard
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={playAgain}
                className="py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-slate-300 transition-all duration-200 text-sm"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <RefreshCw className="w-4 h-4" />
                Play Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-slate-300 transition-all duration-200 text-sm"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <Home className="w-4 h-4" />
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

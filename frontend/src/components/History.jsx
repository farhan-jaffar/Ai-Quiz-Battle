import { useGame } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { History as HistoryIcon, ArrowLeft, Trophy, XCircle, Minus, Trash2, Swords, Brain, Clock, TrendingUp, Award } from 'lucide-react';

const resultConfig = {
  Victory: { color: '#4ade80', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', icon: Trophy, label: 'Victory' },
  Draw:    { color: '#60a5fa', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)', icon: Minus, label: 'Draw' },
  Defeat:  { color: '#f87171', bg: 'rgba(244,63,94,0.12)', border: 'rgba(244,63,94,0.3)', icon: XCircle, label: 'Defeat' },
};

const diffColors = {
  Easy: '#22c55e',
  Medium: '#f59e0b',
  Hard: '#f43f5e',
};

export default function History() {
  const { gameHistory, clearHistory } = useGame();
  const navigate = useNavigate();

  const totalGames = gameHistory.length;
  const wins = gameHistory.filter(g => g.result === 'Victory').length;
  const losses = gameHistory.filter(g => g.result === 'Defeat').length;
  const draws = gameHistory.filter(g => g.result === 'Draw').length;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
  const avgScore = totalGames > 0 ? Math.round(gameHistory.reduce((sum, g) => sum + g.playerScore, 0) / totalGames) : 0;
  const bestScore = totalGames > 0 ? Math.max(...gameHistory.map(g => g.playerScore)) : 0;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white">Battle History</h1>
            <p className="text-xs text-slate-500 font-medium">{totalGames} battles recorded</p>
          </div>
        </div>
        {totalGames > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200"
            style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: '#f87171' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.08)'; }}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* Stats Overview */}
      {totalGames > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Win Rate', value: `${winRate}%`, icon: TrendingUp, color: '#4ade80', bg: 'rgba(34,197,94,0.08)' },
            { label: 'Best Score', value: bestScore, icon: Award, color: '#facc15', bg: 'rgba(234,179,8,0.08)' },
            { label: 'Avg Score', value: avgScore, icon: Brain, color: '#a78bfa', bg: 'rgba(139,92,246,0.08)' },
            { label: 'Record', value: `${wins}W ${losses}L ${draws}D`, icon: Swords, color: '#60a5fa', bg: 'rgba(59,130,246,0.08)' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-4"
              style={{ background: stat.bg, border: `1px solid ${stat.color}22` }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</span>
              </div>
              <p className="text-lg font-black text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Game List */}
      {totalGames === 0 ? (
        <div className="rounded-3xl p-12 flex flex-col items-center text-center gap-5"
          style={{ background: 'rgba(8,8,20,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}
          >
            <HistoryIcon className="w-10 h-10 text-indigo-500/50" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">No Battles Yet</h2>
            <p className="text-slate-500 font-medium text-sm">Complete your first quiz battle and your results will appear here.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-2 px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-sm text-white transition-all duration-200"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}
          >
            <Swords className="w-4 h-4" />
            Start Your First Battle
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {gameHistory.map((game, idx) => {
              const rc = resultConfig[game.result] || resultConfig.Defeat;
              const RIcon = rc.icon;
              return (
                <motion.div
                  key={game.id || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: idx * 0.03 }}
                  className="rounded-2xl p-4 flex items-center gap-4 group transition-all duration-200"
                  style={{ background: 'rgba(8,8,20,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = `${rc.color}44`}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                >
                  {/* Result Icon */}
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: rc.bg, border: `1px solid ${rc.border}` }}
                  >
                    <RIcon className="w-5 h-5" style={{ color: rc.color }} />
                  </div>

                  {/* Game Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white truncate">{game.topic}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase"
                        style={{ background: `${diffColors[game.difficulty]}18`, color: diffColors[game.difficulty] }}
                      >
                        {game.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(game.date)}
                      </span>
                      <span>vs AI</span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg font-black text-white">{game.playerScore}</span>
                      <span className="text-xs text-slate-600 font-bold">-</span>
                      <span className="text-lg font-black text-slate-500">{game.aiScore}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: rc.color }}>
                      {rc.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

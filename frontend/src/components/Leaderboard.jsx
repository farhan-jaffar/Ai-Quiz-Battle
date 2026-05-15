import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Medal, Loader2, ArrowLeft, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const RANK_CONFIG = [
  { icon: Crown, color: '#facc15', bg: 'rgba(234,179,8,0.2)', label: '1st' },
  { icon: Medal, color: '#cbd5e1', bg: 'rgba(203,213,225,0.1)', label: '2nd' },
  { icon: Medal, color: '#c2763c', bg: 'rgba(180,83,9,0.15)', label: '3rd' },
];

export default function Leaderboard() {
  const navigate = useNavigate();
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/leaderboard')
      .then(r => r.json())
      .then(data => { setBoard(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg"
    >
      <div className="rounded-3xl overflow-hidden"
        style={{ background: 'rgba(8,8,20,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-black text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" style={{ filter: 'drop-shadow(0 0 8px rgba(234,179,8,0.5))' }} />
                Hall of Fame
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Top warriors ranked by score</p>
            </div>
          </div>
        </div>

        {/* Top 3 podium (if data available) */}
        {!loading && board.length >= 3 && (
          <div className="grid grid-cols-3 gap-3 p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {/* 2nd */}
            <div className="flex flex-col items-center gap-2 pt-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-slate-300 text-sm"
                style={{ background: 'rgba(203,213,225,0.1)', border: '1px solid rgba(203,213,225,0.2)' }}
              >
                {board[1].username.charAt(0).toUpperCase()}
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-slate-300 truncate max-w-[70px]">{board[1].username}</p>
                <p className="text-sm font-black text-slate-400">{board[1].score}</p>
              </div>
              <div className="w-full h-10 rounded-lg flex items-center justify-center font-bold text-slate-400 text-sm"
                style={{ background: 'rgba(203,213,225,0.07)', border: '1px solid rgba(203,213,225,0.15)' }}
              >
                🥈 2nd
              </div>
            </div>
            {/* 1st */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-yellow-300 text-base"
                style={{ background: 'rgba(234,179,8,0.2)', border: '1px solid rgba(234,179,8,0.4)', boxShadow: '0 0 20px rgba(234,179,8,0.25)' }}
              >
                {board[0].username.charAt(0).toUpperCase()}
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-yellow-200 truncate max-w-[80px]">{board[0].username}</p>
                <p className="text-base font-black text-yellow-400">{board[0].score}</p>
              </div>
              <div className="w-full h-12 rounded-xl flex items-center justify-center font-bold text-yellow-400 text-sm"
                style={{ background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.3)', boxShadow: '0 0 12px rgba(234,179,8,0.15)' }}
              >
                👑 1st
              </div>
            </div>
            {/* 3rd */}
            <div className="flex flex-col items-center gap-2 pt-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-amber-700 text-sm"
                style={{ background: 'rgba(180,83,9,0.15)', border: '1px solid rgba(180,83,9,0.3)' }}
              >
                {board[2].username.charAt(0).toUpperCase()}
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-amber-700 truncate max-w-[70px]">{board[2].username}</p>
                <p className="text-sm font-black text-amber-800">{board[2].score}</p>
              </div>
              <div className="w-full h-10 rounded-lg flex items-center justify-center font-bold text-amber-700 text-sm"
                style={{ background: 'rgba(180,83,9,0.1)', border: '1px solid rgba(180,83,9,0.2)' }}
              >
                🥉 3rd
              </div>
            </div>
          </div>
        )}

        {/* Full list */}
        <div className="min-h-[200px]">
          {loading ? (
            <div className="flex items-center justify-center p-12 gap-3 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-medium text-sm">Loading scores...</span>
            </div>
          ) : board.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 gap-3">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}
              >
                <Trophy className="w-8 h-8 text-slate-600" />
              </div>
              <div className="text-center">
                <p className="text-white font-bold">No scores yet</p>
                <p className="text-slate-500 text-sm mt-1">Be the first warrior to claim glory!</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {board.map((entry, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="flex items-center justify-between px-6 py-4 border-b last:border-0 transition-colors hover:bg-white/3"
                  style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-black text-base w-8 text-center"
                      style={{
                        color: idx === 0 ? '#facc15' : idx === 1 ? '#cbd5e1' : idx === 2 ? '#c2763c' : '#374151',
                        textShadow: idx < 3 ? `0 0 8px currentColor` : 'none'
                      }}
                    >
                      #{idx + 1}
                    </span>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
                      style={{
                        background: idx === 0 ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${idx === 0 ? 'rgba(234,179,8,0.3)' : 'rgba(255,255,255,0.08)'}`,
                        color: idx === 0 ? '#facc15' : idx === 1 ? '#cbd5e1' : idx === 2 ? '#c2763c' : '#94a3b8'
                      }}
                    >
                      {entry.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-200">{entry.username}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm" style={{ color: idx === 0 ? '#facc15' : '#6366f1' }}>{entry.score} pts</p>
                    <p className="text-xs text-slate-600 mt-0.5">{new Date(entry.date).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

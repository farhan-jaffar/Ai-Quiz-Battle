import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useSounds } from '../hooks/useSounds';
import { useNavigate } from 'react-router-dom';
import { Brain, Play, Loader2, AlertCircle, Cpu, Globe, Code2, FlaskConical, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TOPIC_CONFIG = {
  'General Knowledge': { icon: Globe, color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.4)', desc: 'Broad trivia & facts' },
  'Programming': { icon: Code2, color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.4)', desc: 'Code & algorithms' },
  'Science': { icon: FlaskConical, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)', desc: 'Physics, bio & chem' },
  'AI & Tech': { icon: Cpu, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.4)', desc: 'AI, ML & future tech' },
};

const DIFFICULTY_CONFIG = {
  Easy: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.5)', glow: '0 0 15px rgba(34,197,94,0.3)', desc: 'Warm up' },
  Medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.5)', glow: '0 0 15px rgba(245,158,11,0.3)', desc: 'Challenge' },
  Hard: { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)', border: 'rgba(244,63,94,0.5)', glow: '0 0 15px rgba(244,63,94,0.3)', desc: 'Brutal' },
};

export default function Home() {
  const { userProfile, updateProfile, setQuestionBuffer } = useGame();
  const sfx = useSounds();
  const navigate = useNavigate();

  const [username, setUsername] = useState(userProfile.username || '');
  const [topic, setTopic] = useState(userProfile.topic || 'General Knowledge');
  const [difficulty, setDifficulty] = useState(userProfile.difficulty || 'Medium');
  const [isFetching, setIsFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    updateProfile({ username, topic, difficulty });
    setIsFetching(true);
    setErrorMsg('');
    sfx.whoosh();

    try {
      const res = await fetch('http://localhost:5000/api/generate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });

      if (!res.ok) throw new Error('Arena servers experiencing heavy load (429). Please retry.');

      const data = await res.json();
      if (!data.buffer || data.buffer.length !== 9) throw new Error('Data parsing corruption. Retrying is advised.');

      setQuestionBuffer(data.buffer);
      sfx.submit();
      navigate('/quiz');
    } catch (e) {
      console.error(e);
      setErrorMsg(e.message);
      setIsFetching(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl"
    >
      {/* Hero Badge */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase"
          style={{
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            color: '#a5b4fc'
          }}
        >
          <Zap className="w-3 h-3" fill="currentColor" />
          Neural AI Opponent Ready
        </div>
      </div>

      {/* Main Card */}
      <div className="glass-panel rounded-3xl p-8 relative overflow-hidden"
        style={{ background: 'rgba(8, 8, 20, 0.7)' }}
      >
        {/* Card inner glow */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)' }}
        />

        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
                border: '1px solid rgba(99,102,241,0.3)',
                boxShadow: '0 0 30px rgba(99,102,241,0.2)'
              }}
            >
              <Brain className="w-10 h-10 text-indigo-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center"
              style={{ background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.6)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight"
              style={{ background: 'linear-gradient(135deg, #c7d2fe, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Battle Arena
            </h1>
            <p className="text-slate-400 font-medium mt-1.5 text-sm">Challenge our adaptive neural-net opponent</p>
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="mb-6 p-4 rounded-2xl flex gap-3 items-start overflow-hidden"
              style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.3)' }}
            >
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <p className="text-rose-300 text-sm font-medium">{errorMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          {/* Username */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1">
              Warrior Name
            </label>
            <input
              type="text"
              required
              maxLength={15}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isFetching}
              className="w-full px-4 py-3.5 rounded-xl text-white font-semibold text-sm placeholder:text-slate-600 outline-none transition-all duration-200 disabled:opacity-50"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              placeholder="Enter your username..."
            />
          </div>

          {/* Topic Select */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1">
              Battle Domain
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(TOPIC_CONFIG).map(([t, cfg]) => {
                const Icon = cfg.icon;
                const isActive = topic === t;
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={isFetching}
                    onClick={() => setTopic(t)}
                    className="p-3 rounded-xl text-left transition-all duration-200 disabled:opacity-50 group"
                    style={{
                      background: isActive ? cfg.bg : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isActive ? cfg.border : 'rgba(255,255,255,0.08)'}`,
                      boxShadow: isActive ? `0 0 16px ${cfg.bg}` : 'none',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? cfg.color : '#64748b' }} />
                      <span className="text-sm font-bold" style={{ color: isActive ? cfg.color : '#94a3b8' }}>{t}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 ml-6">{cfg.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Select */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1">
              Starting Difficulty
            </label>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(DIFFICULTY_CONFIG).map(([d, cfg]) => {
                const isActive = difficulty === d;
                return (
                  <button
                    key={d}
                    type="button"
                    disabled={isFetching}
                    onClick={() => setDifficulty(d)}
                    className="py-3 px-2 rounded-xl transition-all duration-200 disabled:opacity-50 text-center"
                    style={{
                      background: isActive ? cfg.bg : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isActive ? cfg.border : 'rgba(255,255,255,0.08)'}`,
                      boxShadow: isActive ? cfg.glow : 'none',
                    }}
                  >
                    <p className="text-sm font-bold" style={{ color: isActive ? cfg.color : '#94a3b8' }}>{d}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{cfg.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!username.trim() || isFetching}
            className="relative w-full py-4 rounded-xl font-black text-base tracking-wide transition-all duration-200 overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: !username.trim() || isFetching
                ? 'rgba(99,102,241,0.2)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: username.trim() && !isFetching ? '0 0 30px rgba(99,102,241,0.4)' : 'none',
              color: 'white',
            }}
            onMouseEnter={e => { if (username.trim() && !isFetching) e.target.style.boxShadow = '0 0 40px rgba(99,102,241,0.6)'; }}
            onMouseLeave={e => { if (username.trim() && !isFetching) e.target.style.boxShadow = '0 0 30px rgba(99,102,241,0.4)'; }}
          >
            {isFetching ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Synthesizing Arena...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Play className="w-5 h-5" fill="currentColor" />
                Enter the Arena
              </span>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

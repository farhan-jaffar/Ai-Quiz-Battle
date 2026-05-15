import { useGame } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, ArrowLeft, Timer, Volume2, VolumeX, Sparkles, Trash2, User, RotateCcw, Shield, Info } from 'lucide-react';
import { useState } from 'react';
import { playClick } from '../utils/sounds';

const TIMER_OPTIONS = [
  { value: 10, label: '10s', desc: 'Speed Run' },
  { value: 15, label: '15s', desc: 'Standard' },
  { value: 20, label: '20s', desc: 'Relaxed' },
  { value: 30, label: '30s', desc: 'No Pressure' },
];

export default function Settings() {
  const { settings, updateSettings, clearHistory, gameHistory } = useGame();
  const navigate = useNavigate();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [savedFlash, setSavedFlash] = useState('');

  const flash = (key) => {
    setSavedFlash(key);
    setTimeout(() => setSavedFlash(''), 1200);
  };

  const handleTimerChange = (val) => {
    if (settings.soundEnabled) playClick();
    updateSettings({ timerDuration: val });
    flash('timer');
  };

  const handleToggle = (key) => {
    // Play click before toggle (so sound toggle has audible feedback)
    if (settings.soundEnabled) playClick();
    updateSettings({ [key]: !settings[key] });
    flash(key);
  };

  const handleClearHistory = () => {
    clearHistory();
    setShowClearConfirm(false);
    flash('clear');
  };

  const handleResetDefaults = () => {
    updateSettings({
      timerDuration: 15,
      soundEnabled: true,
      animationsEnabled: true,
    });
    flash('reset');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
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
          <h1 className="text-2xl font-black text-white">Settings</h1>
          <p className="text-xs text-slate-500 font-medium">Customize your experience</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">

        {/* Timer Duration */}
        <div className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: 'rgba(8,8,20,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)' }}
          />
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}
            >
              <Timer className="w-4.5 h-4.5 text-indigo-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white">Timer Duration</h3>
              <p className="text-[11px] text-slate-500">Time per question in seconds</p>
            </div>
            {savedFlash === 'timer' && (
              <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(34,197,94,0.12)' }}
              >
                Saved ✓
              </motion.span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {TIMER_OPTIONS.map(opt => {
              const isActive = settings.timerDuration === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleTimerChange(opt.value)}
                  className="py-3 px-2 rounded-xl text-center transition-all duration-200"
                  style={{
                    background: isActive ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: isActive ? '0 0 15px rgba(99,102,241,0.2)' : 'none',
                  }}
                >
                  <p className="text-lg font-black" style={{ color: isActive ? '#a5b4fc' : '#64748b' }}>{opt.label}</p>
                  <p className="text-[10px] font-medium mt-0.5" style={{ color: isActive ? '#818cf8' : '#475569' }}>{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggle Settings */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(8,8,20,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Sound Effects */}
          <div className="p-5 flex items-center gap-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: settings.soundEnabled ? 'rgba(34,197,94,0.12)' : 'rgba(244,63,94,0.08)', border: `1px solid ${settings.soundEnabled ? 'rgba(34,197,94,0.25)' : 'rgba(244,63,94,0.15)'}` }}
            >
              {settings.soundEnabled
                ? <Volume2 className="w-4.5 h-4.5 text-emerald-400" />
                : <VolumeX className="w-4.5 h-4.5 text-rose-400" />
              }
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white">Sound Effects</h3>
              <p className="text-[11px] text-slate-500">Audio feedback on actions</p>
            </div>
            {savedFlash === 'soundEnabled' && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(34,197,94,0.12)' }}
              >Saved ✓</motion.span>
            )}
            <button onClick={() => handleToggle('soundEnabled')}
              className="w-12 h-7 rounded-full p-1 transition-all duration-300 flex-shrink-0"
              style={{
                background: settings.soundEnabled ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)',
                border: `1px solid ${settings.soundEnabled ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.12)'}`,
              }}
            >
              <motion.div
                className="w-5 h-5 rounded-full"
                animate={{ x: settings.soundEnabled ? 18 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{
                  background: settings.soundEnabled ? '#4ade80' : '#475569',
                  boxShadow: settings.soundEnabled ? '0 0 8px rgba(34,197,94,0.5)' : 'none',
                }}
              />
            </button>
          </div>

          {/* Animations */}
          <div className="p-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: settings.animationsEnabled ? 'rgba(139,92,246,0.12)' : 'rgba(100,116,139,0.08)', border: `1px solid ${settings.animationsEnabled ? 'rgba(139,92,246,0.25)' : 'rgba(100,116,139,0.15)'}` }}
            >
              <Sparkles className="w-4.5 h-4.5" style={{ color: settings.animationsEnabled ? '#a78bfa' : '#64748b' }} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white">Animations</h3>
              <p className="text-[11px] text-slate-500">Smooth transitions and effects</p>
            </div>
            {savedFlash === 'animationsEnabled' && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(34,197,94,0.12)' }}
              >Saved ✓</motion.span>
            )}
            <button onClick={() => handleToggle('animationsEnabled')}
              className="w-12 h-7 rounded-full p-1 transition-all duration-300 flex-shrink-0"
              style={{
                background: settings.animationsEnabled ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.08)',
                border: `1px solid ${settings.animationsEnabled ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.12)'}`,
              }}
            >
              <motion.div
                className="w-5 h-5 rounded-full"
                animate={{ x: settings.animationsEnabled ? 18 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{
                  background: settings.animationsEnabled ? '#a78bfa' : '#475569',
                  boxShadow: settings.animationsEnabled ? '0 0 8px rgba(139,92,246,0.5)' : 'none',
                }}
              />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl p-5"
          style={{ background: 'rgba(244,63,94,0.04)', border: '1px solid rgba(244,63,94,0.12)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-rose-400/60" />
            <h3 className="text-xs font-bold text-rose-400/60 uppercase tracking-widest">Danger Zone</h3>
          </div>

          <div className="flex flex-col gap-3">
            {/* Clear History */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white">Clear Battle History</p>
                <p className="text-[11px] text-slate-500">{gameHistory.length} game{gameHistory.length !== 1 ? 's' : ''} recorded</p>
              </div>
              {!showClearConfirm ? (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  disabled={gameHistory.length === 0}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', color: '#f87171' }}
                  onMouseEnter={e => { if (gameHistory.length > 0) e.currentTarget.style.background = 'rgba(244,63,94,0.2)'; }}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,63,94,0.1)'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleClearHistory}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
                    style={{ background: 'rgba(244,63,94,0.6)', border: '1px solid rgba(244,63,94,0.8)' }}
                  >
                    Confirm Delete
                  </button>
                  <button onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: 'rgba(244,63,94,0.1)' }} />

            {/* Reset Settings */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white">Reset to Defaults</p>
                <p className="text-[11px] text-slate-500">Restore all settings</p>
              </div>
              <button
                onClick={handleResetDefaults}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.08)'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

          {savedFlash === 'clear' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-xs font-bold text-emerald-400 mt-3 text-center">
              History cleared successfully ✓
            </motion.p>
          )}
          {savedFlash === 'reset' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-xs font-bold text-emerald-400 mt-3 text-center">
              Settings restored to defaults ✓
            </motion.p>
          )}
        </div>

        {/* App Info */}
        <div className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <Info className="w-4 h-4 text-slate-600 flex-shrink-0" />
          <p className="text-[11px] text-slate-600 font-medium">
            AI Quiz Battle v1.0 · Powered by Gemini AI · Settings are saved automatically to your browser.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

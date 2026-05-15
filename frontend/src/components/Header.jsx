import { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, UserCircle, LogOut, Settings, BarChart2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { userProfile, logout } = useGame();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const navTo = (path) => {
    navigate(path);
    setDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 w-full h-16 z-40 px-6 flex items-center justify-between"
      style={{
        background: 'rgba(10, 10, 30, 0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}
    >
      {/* Mobile Logo */}
      <div className="flex md:hidden items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          <BrainCircuit className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-white">AI Q-Battle</span>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden md:block" />

      {/* User Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 border"
          style={{
            background: dropdownOpen ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
            borderColor: dropdownOpen ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)',
          }}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-indigo-300 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))', border: '1px solid rgba(139,92,246,0.4)' }}
          >
            {(userProfile.username || 'G').charAt(0).toUpperCase()}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-slate-200 leading-none mb-0.5">
              {userProfile.username || 'Guest Warrior'}
            </p>
            <p className="text-xs text-indigo-400 font-medium">Lv. {userProfile.level || 1}</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
              style={{
                background: 'rgba(15, 15, 35, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)'
              }}
            >
              {/* Mobile username section */}
              <div className="px-4 py-3 border-b border-white/5 sm:hidden">
                <p className="font-semibold text-white truncate">{userProfile.username || 'Guest Warrior'}</p>
                <p className="text-xs text-indigo-400">Level {userProfile.level || 1}</p>
              </div>

              <div className="p-1">
                <button
                  onClick={() => navTo('/leaderboard')}
                  className="w-full px-3 py-2.5 text-left rounded-xl flex items-center gap-3 transition-colors text-slate-300 hover:text-white hover:bg-white/8 text-sm font-medium"
                  style={{ '--tw-bg-opacity': 0.08 }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-indigo-500/10">
                    <BarChart2 className="w-4 h-4 text-indigo-400" />
                  </div>
                  View Leaderboard
                </button>
                <button
                  onClick={() => navTo('/settings')}
                  className="w-full px-3 py-2.5 text-left rounded-xl flex items-center gap-3 transition-colors text-slate-300 hover:text-white hover:bg-white/8 text-sm font-medium"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-500/10">
                    <Settings className="w-4 h-4 text-slate-400" />
                  </div>
                  Edit Profile
                </button>
                <div className="h-px bg-white/5 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2.5 text-left rounded-xl flex items-center gap-3 transition-colors text-rose-400 hover:bg-rose-500/10 text-sm font-medium"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-rose-500/10">
                    <LogOut className="w-4 h-4 text-rose-400" />
                  </div>
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

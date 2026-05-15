import { NavLink } from 'react-router-dom';
import { Home as HomeIcon, Trophy, History, Settings, BrainCircuit } from 'lucide-react';

export default function Sidebar() {
  const links = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'History', path: '/history', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <nav className="fixed bottom-0 md:relative w-full md:w-[220px] md:min-w-[220px] h-20 md:h-full backdrop-blur-2xl border-t md:border-t-0 md:border-r z-50 flex md:flex-col items-center justify-around md:justify-start md:px-5 md:py-8"
      style={{
        background: 'rgba(10, 10, 30, 0.7)',
        borderColor: 'rgba(255, 255, 255, 0.07)'
      }}
    >
      {/* Logo Area (Desktop Only) */}
      <div className="hidden md:flex items-center gap-3 w-full mb-10 px-1">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-indigo-500/30 glow-indigo flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          <BrainCircuit className="w-6 h-6 text-white drop-shadow-lg" />
        </div>
        <div>
          <span className="text-base font-bold text-gradient-indigo block leading-none">AI Q-Battle</span>
          <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Neural Arena</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex md:flex-col gap-1 w-full max-w-sm md:max-w-none">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === '/'}
            className={({ isActive }) =>
              `flex items-center flex-col md:flex-row gap-1 md:gap-3 p-2 md:p-3 w-full rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <div className={`flex items-center flex-col md:flex-row gap-1 md:gap-3 w-full relative ${isActive ? 'text-white' : ''}`}>
                {isActive && (
                  <div className="absolute inset-0 rounded-xl -z-10 opacity-100"
                    style={{
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))',
                      border: '1px solid rgba(99,102,241,0.3)',
                      boxShadow: '0 0 15px rgba(99,102,241,0.15)'
                    }}
                  />
                )}
                <link.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.7)]' : ''}`} />
                <span className="text-[9px] md:text-sm font-medium">{link.name}</span>
                {isActive && (
                  <div className="hidden md:block h-1.5 w-1.5 rounded-full bg-indigo-400 ml-auto" />
                )}
              </div>
            )}
          </NavLink>
        ))}
      </div>

      {/* Version Tag (Desktop Only) */}
      <div className="hidden md:flex mt-auto w-full px-1">
        <div className="w-full p-3 rounded-xl border text-center"
          style={{ background: 'rgba(99,102,241,0.05)', borderColor: 'rgba(99,102,241,0.15)' }}
        >
          <p className="text-[10px] text-slate-600 font-medium tracking-wider">v1.0 · Gemini Powered</p>
        </div>
      </div>
    </nav>
  );
}

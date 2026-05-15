import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  return (
    <div className="flex flex-col md:flex-row h-screen w-full text-white overflow-hidden relative"
      style={{ background: 'radial-gradient(ellipse at 20% 10%, #1e1b4b 0%, #0f172a 50%, #020617 100%)' }}
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        {/* Grid overlay for depth */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Canvas Content Area */}
      <div className="flex-1 flex flex-col h-full z-10 relative pb-20 md:pb-0 overflow-y-auto">
        
        {/* Persistent Header */}
        <Header />

        {/* Hero Section Canvas - Renders the Current Route */}
        <main className="flex-1 w-full flex items-center justify-center p-4 md:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

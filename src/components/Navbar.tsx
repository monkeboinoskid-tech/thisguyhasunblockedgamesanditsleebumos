import React from 'react';
import { Gamepad2, Search, Home, ShieldAlert, Settings as SettingsIcon, Music } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  currentView: 'home' | 'games' | 'music' | 'browser' | 'settings';
  onNavigate: (view: 'home' | 'games' | 'music' | 'browser' | 'settings') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const launchCloaked = () => {
    const url = window.location.href;
    const win = window.open('about:blank', '_blank');
    if (win) {
      win.document.body.style.margin = '0';
      win.document.body.style.height = '100vh';
      const iframe = win.document.createElement('iframe');
      iframe.style.border = 'none';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.margin = '0';
      iframe.src = url;
      win.document.body.appendChild(iframe);
      
      win.document.title = 'Google';
      const link = win.document.createElement('link');
      link.rel = 'icon';
      link.href = 'https://www.google.com/favicon.ico';
      win.document.head.appendChild(link);
    }
  };

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-24 bg-[#080808] border-r border-white/5 z-50 flex flex-col items-center py-10 gap-16 transition-all">
      <div 
        className="cursor-pointer group flex flex-col items-center gap-2 mb-4"
        onClick={() => onNavigate('home')}
      >
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
          <Gamepad2 className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center gap-6 w-full px-2">
        <NavButton 
          active={currentView === 'home'} 
          onClick={() => onNavigate('home')}
          icon={<Home className="w-6 h-6" />}
          label="Home"
        />
        <NavButton 
          active={currentView === 'games'} 
          onClick={() => onNavigate('games')}
          icon={<Gamepad2 className="w-6 h-6" />}
          label="Games"
        />
        <NavButton 
          active={currentView === 'music'} 
          onClick={() => onNavigate('music')}
          icon={<Music className="w-6 h-6" />}
          label="Music"
        />
        <NavButton 
          active={currentView === 'browser'} 
          onClick={() => onNavigate('browser')}
          icon={<Search className="w-6 h-6" />}
          label="Proxy"
        />
        <NavButton 
          active={currentView === 'settings'} 
          onClick={() => onNavigate('settings')}
          icon={<SettingsIcon className="w-6 h-6" />}
          label="Settings"
        />
        
        <div className="w-8 h-[1px] bg-white/10 my-2" />

        <button
          onClick={launchCloaked}
          className="group relative flex flex-col items-center gap-1 p-4 rounded-2xl text-amber-500 hover:bg-amber-500/10 transition-all border border-transparent hover:border-amber-500/20"
          title="Cloak Tab"
        >
          <ShieldAlert className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Cloak</span>
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="rotate-90 text-[10px] text-zinc-700 font-black tracking-widest uppercase origin-center w-max">
          v1.0.4 rpd
        </div>
      </div>
    </aside>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className={`
        group relative flex flex-col items-center gap-1 w-full p-5 transition-all duration-300
        ${active 
          ? 'text-blue-500' 
          : 'text-zinc-700 hover:text-zinc-400'}
      `}
    >
      <div className="relative">
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mt-1">{label}</span>
      
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-600 rounded-r-full shadow-[0_0_15px_rgba(37,99,235,0.8)]"
        />
      )}
    </button>
  );
};


import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Gamepad2, 
  Sparkles, 
  TrendingUp, 
  Clock,
  Share2,
  Music,
  Circle,
  BarChart,
  Wifi,
  ShieldCheck,
  Settings as SettingsIcon
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { MusicPlayer } from './components/MusicPlayer';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { Browser } from './components/Browser';
import { Snowfall } from './components/Snowfall';
import { PlayfulBackground } from './components/PlayfulBackground';
import { CustomCursor } from './components/CustomCursor';
import { Settings, AppSettings } from './components/Settings';
import { DecoyOverlay } from './components/DecoyOverlay';
import { Taskbar, OpenApp, AppType } from './components/Taskbar';
// @ts-ignore
import gamesData from './data/games.json';

interface Game {
  id: string;
  title: string;
  description: string;
  iframeUrl: string;
  thumbnail: string;
  category: string;
}

const OSIcon: React.FC<{ icon: React.ReactNode, label: string, onClick?: () => void }> = ({ icon, label, onClick }) => (
  <div 
    onClick={onClick}
    className="flex flex-col items-center gap-1.5 cursor-pointer group w-16"
  >
    <div className="w-12 h-12 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center group-hover:bg-zinc-800 transition-all shadow-xl group-hover:scale-110">
      {icon}
    </div>
    <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-500 group-hover:text-white transition-colors">{label}</span>
  </div>
);

const ClockDisplay: React.FC = () => {
  const [time, setTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-1 opacity-20 hover:opacity-80 transition-opacity duration-700">
      <span className="text-sm font-black tabular-nums tracking-[0.5em] text-white uppercase">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
      </span>
    </div>
  );
};

export default function App() {
  const [openApps, setOpenApps] = useState<OpenApp[]>([]);
  const [activeAppId, setActiveAppId] = useState<AppType>('home');
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showDecoy, setShowDecoy] = useState(false);
  const [playfulness, setPlayfulness] = useState(0);

  // Persistence logic for settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('koop_settings');
    return saved ? JSON.parse(saved) : {
      snowflakeEnabled: false,
      tabTitle: 'Lebum OS',
      tabIcon: '',
      autoCloak: false,
      panicKey: 'Escape',
      theme: 'black'
    };
  });

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === settings.panicKey) {
        setShowDecoy(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.panicKey]);

  React.useEffect(() => {
    localStorage.setItem('koop_settings', JSON.stringify(settings));
    
    // Apply Cloak
    document.title = settings.tabTitle;
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = settings.tabIcon || '/vite.svg';

    // Auto-cloak check
    if (settings.autoCloak && !window.name.includes('cloaked')) {
      const win = window.open('about:blank', 'cloaked_' + Date.now());
      if (win) {
        win.document.body.style.margin = '0';
        win.document.body.style.height = '100vh';
        const iframe = win.document.createElement('iframe');
        iframe.style.border = 'none';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.src = window.location.href;
        win.document.body.appendChild(iframe);
        window.location.replace('https://google.com'); // Redirect current tab to something safe
      }
    }
  }, [settings]);

  const categories = useMemo(() => {
    const cats = new Set((gamesData as Game[]).map(g => g.category));
    return Array.from(cats);
  }, []);

  const filteredGames = useMemo(() => {
    return (gamesData as Game[]).filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleNavigate = (newView: AppType) => {
    if (newView === 'home') {
      setActiveAppId('home');
      return;
    }

    const appMetadata: Record<Exclude<AppType, 'home'>, { title: string, icon: React.ReactNode }> = {
      games: { title: 'Games', icon: <Gamepad2 className="w-5 h-5" /> },
      music: { title: 'Music', icon: <Music className="w-5 h-5" /> },
      browser: { title: 'Browser', icon: <Search className="w-5 h-5" /> },
      settings: { title: 'Settings', icon: <SettingsIcon className="w-5 h-5" /> },
    };

    if (!openApps.find(a => a.id === newView)) {
      setOpenApps(prev => [...prev, { 
        id: newView, 
        title: appMetadata[newView as Exclude<AppType, 'home'>].title,
        icon: appMetadata[newView as Exclude<AppType, 'home'>].icon
      }]);
    }
    setActiveAppId(newView);
    setActiveGame(null);
  };

  const handleCloseApp = (id: AppType) => {
    setOpenApps(prev => prev.filter(app => app.id !== id));
    if (activeAppId === id) {
      setActiveAppId('home');
    }
  };

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  React.useEffect(() => {
    const handleOSNavigate = (e: any) => {
      if (e.detail) handleNavigate(e.detail);
    };
    window.addEventListener('os-navigate' as any, handleOSNavigate);
    return () => window.removeEventListener('os-navigate' as any, handleOSNavigate);
  }, [openApps]);

  const themeConfig = {
    black: 'bg-[#0d0d0d]',
    amoled: 'bg-black',
    ocean: 'bg-[#000814]',
    midnight: 'bg-[#030712]',
    emerald: 'bg-[#061a12]'
  };

  return (
    <div className={`min-h-screen ${themeConfig[settings.theme]} text-white font-sans selection:bg-blue-600/30 overflow-x-hidden transition-colors duration-700 relative`}>
      <AnimatePresence>
        {showDecoy && <DecoyOverlay onClose={() => setShowDecoy(false)} />}
      </AnimatePresence>
      {settings.snowflakeEnabled && <Snowfall />}
      <PlayfulBackground level={playfulness} />
      <CustomCursor />
      
      <Taskbar 
        openApps={openApps} 
        activeAppId={activeAppId} 
        onSwitchApp={setActiveAppId}
        onCloseApp={handleCloseApp}
      />

      {activeAppId !== 'home' && activeAppId !== 'music' && <Navbar currentView={activeAppId} onNavigate={handleNavigate} />}

      <main className={`relative transition-all duration-500 ${activeAppId === 'home' || activeAppId === 'music' ? 'px-8 md:px-12' : 'pl-24 md:pl-32 pr-8 md:pr-16'} pt-16 pb-28 min-h-screen z-10`}>
        <AnimatePresence mode="wait">
          {activeAppId === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative h-[calc(100vh-160px)] flex items-center justify-center -ml-8 md:-ml-12"
            >
              {/* Sidebar Group */}
              <div className="absolute top-0 left-0 flex flex-col gap-6 md:gap-8">
                <OSIcon icon={<Gamepad2 className="w-5 h-5 text-white/50" />} label="Folder" onClick={() => handleNavigate('games')} />
                <OSIcon icon={<Search className="w-5 h-5 text-white/50" />} label="Browser" onClick={() => handleNavigate('browser')} />
                <OSIcon icon={<SettingsIcon className="w-5 h-5 text-white/50" />} label="Settings" onClick={() => handleNavigate('settings')} />
                <OSIcon icon={<ShieldCheck className="w-5 h-5 text-white/50" />} label="Cloak" onClick={() => setShowDecoy(true)} />
                <OSIcon icon={<Music className="w-5 h-5 text-white/50" />} label="Music" onClick={() => handleNavigate('music')} />
              </div>

              {/* Watermark + Clock */}
              <div className="flex flex-col items-center justify-center text-center -mt-20">
                <h1 className="text-4xl md:text-6xl font-black tracking-[0.4em] uppercase italic select-none text-white/[0.08] mb-4">
                  LEBUM OS
                </h1>
                <ClockDisplay />
              </div>

              {/* Dot Pager */}
              <div className="absolute bottom-4 right-0 flex gap-3">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    onClick={() => setPlayfulness(i)}
                    className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-300 hover:scale-150 ${i === playfulness ? 'bg-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-white/20'}`} 
                  />
                ))}
              </div>

              {/* Home Dock (Mini Taskbar/Indicator) */}
              <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-[#0d0d0d]/90 border border-white/5 rounded-2xl px-6 py-3 flex items-center gap-8 shadow-2xl backdrop-blur-3xl z-50">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center shadow-lg border border-white/5 cursor-pointer hover:bg-zinc-700 transition-colors"
                  >
                    <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                       <span className="text-[10px] font-black text-black">KB</span>
                    </div>
                  </div>
                  <div className="w-[1px] h-4 bg-white/10" />
                  <div className="flex items-center gap-4 text-zinc-500">
                    <Search className="w-5 h-5 hover:text-white cursor-pointer transition-colors" onClick={() => handleNavigate('browser')} />
                    <SettingsIcon className="w-5 h-5 hover:text-white cursor-pointer transition-colors" onClick={() => handleNavigate('settings')} />
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-bold text-zinc-500">
                   <div className="flex items-center gap-1.5">
                      <BarChart className="w-3 h-3" />
                      <span className="text-zinc-600 tabular-nums">21ms</span>
                   </div>
                   <Wifi className="w-3.5 h-3.5 text-zinc-600" />
                   <div className="w-[1px] h-4 bg-white/10" />
                   <div className="flex flex-col items-end leading-none gap-0.5 min-w-[70px]">
                      <span className="text-zinc-200 text-xs tabular-nums tracking-tighter">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </span>
                      <span className="text-[8px] opacity-40 uppercase tracking-tighter">
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                   </div>
                </div>
              </div>
            </motion.div>
          ) : activeAppId === 'games' ? (
            <motion.div
              key="games"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
               <section className="flex flex-col items-center justify-center pt-10 pb-6 text-center space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-3xl relative group"
                  >
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-700 group-focus-within:text-blue-500 transition-all duration-500" />
                    <input
                      type="text"
                      placeholder="Search for subjects or resources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/5 rounded-3xl py-6 pl-20 pr-10 text-xl focus:outline-none focus:bg-white/[0.04] focus:border-white/10 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-2xl backdrop-blur-3xl placeholder:text-zinc-800 font-bold"
                    />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar max-w-5xl mx-auto"
                  >
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shrink-0 border ${
                        !selectedCategory 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)]' 
                        : 'bg-white/[0.03] border-white/5 text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.05]'
                      }`}
                    >
                      Everything
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shrink-0 border ${
                          selectedCategory === cat 
                          ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)]' 
                          : 'bg-white/[0.03] border-white/5 text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.05]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </motion.div>
                </section>

              <section className="space-y-8">
                <div className="flex items-center gap-4 px-2">
                  <TrendingUp className="w-5 h-5 text-zinc-600" />
                  <h2 className="text-xs font-black tracking-[0.3em] uppercase text-zinc-600">Active Subjects</h2>
                  <div className="flex-1 h-[1px] bg-white/5" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                  {filteredGames.map((game) => (
                    <GameCard 
                      key={game.id} 
                      game={game} 
                      onPlay={(g) => setActiveGame(g)} 
                    />
                  ))}
                </div>
                  
                {filteredGames.length === 0 && (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-600 gap-4">
                    <Search className="w-16 h-16 opacity-20" />
                    <p className="text-xl font-medium">No results found</p>
                  </div>
                )}
              </section>
            </motion.div>
          ) : activeAppId === 'browser' ? (
            <motion.div
              key="browser"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-[calc(100vh-200px)]"
            >
              <Browser />
            </motion.div>
          ) : activeAppId === 'music' ? (
            <motion.div
              key="music"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <MusicPlayer />
            </motion.div>
          ) : (
            <motion.div
              key="settings"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Settings settings={settings} onUpdate={handleUpdateSettings} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {activeAppId !== 'music' && (
        <footer className="relative py-20 border-t border-white/5 bg-black px-8 z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 opacity-40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center border border-white/5">
                <Gamepad2 className="w-4 h-4 text-blue-500" />
              </div>
              <span className="font-black tracking-tighter uppercase text-white text-sm">Lebum OS</span>
            </div>
            <p className="text-[11px] text-center font-bold uppercase tracking-[0.3em] leading-relaxed max-w-sm">
              Organized workspace for research & academic study
            </p>
            <div className="flex items-center gap-8 text-[10px] uppercase font-black tracking-[0.2em]">
              <span className="hover:text-blue-500 cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-blue-500 cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-blue-500 cursor-pointer transition-colors">Safety</span>
            </div>
          </div>
        </footer>
      )}

      {/* Game Player Overlay */}
      <AnimatePresence>
        {activeGame && (
          <GamePlayer 
            game={activeGame} 
            onClose={() => setActiveGame(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatBox({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <div className="flex items-center gap-4 p-6 bg-black/40 border border-white/5 rounded-2xl group hover:bg-black/60 transition-all duration-300 backdrop-blur-md">
      <div className="p-3 bg-zinc-950 rounded-xl text-zinc-500 group-hover:text-blue-400 transition-colors border border-white/5">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-black tracking-tight text-white">{value}</div>
        <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{label}</div>
      </div>
    </div>
  );
}

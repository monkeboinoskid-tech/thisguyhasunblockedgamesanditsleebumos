import React from 'react';
import { motion } from 'motion/react';
import { 
  Gamepad2, 
  Search, 
  Settings as SettingsIcon, 
  Music,
  LayoutGrid
} from 'lucide-react';

export type AppType = 'home' | 'games' | 'music' | 'browser' | 'settings';

export interface OpenApp {
  id: AppType;
  title: string;
  icon: React.ReactNode;
}

interface TaskbarProps {
  openApps: OpenApp[];
  activeAppId: AppType;
  onSwitchApp: (id: AppType) => void;
  onCloseApp: (id: AppType) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ 
  openApps, 
  activeAppId, 
  onSwitchApp, 
  onCloseApp 
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-3 py-2 bg-black/60 border border-white/10 rounded-2xl backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {/* Start Button */}
      <button 
        onClick={() => onSwitchApp('home')}
        className={`p-2.5 rounded-xl transition-all duration-300 group hover:bg-white/10 ${activeAppId === 'home' ? 'bg-white/10 text-blue-400' : 'text-zinc-400'}`}
      >
        <LayoutGrid className="w-6 h-6 transition-transform group-hover:scale-110" />
      </button>

      {openApps.length > 0 && <div className="w-[1px] h-6 bg-white/10 mx-1" />}

      <div className="flex items-center gap-1.5">
        {openApps.map((app) => (
          <div key={app.id} className="relative group">
            <button
              onClick={() => onSwitchApp(app.id)}
              className={`p-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 group relative ${
                activeAppId === app.id 
                ? 'bg-white/10 text-white w-auto px-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]' 
                : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
              }`}
            >
              <div className="shrink-0 transition-transform group-hover:scale-110">
                {app.icon}
              </div>
              
              {activeAppId === app.id && (
                <motion.span 
                  layoutId="taskbar-text"
                  className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap overflow-hidden"
                >
                  {app.title}
                </motion.span>
              )}

              {/* Active Indicator Dot */}
              <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500 transition-all ${activeAppId === app.id ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
            </button>

            {/* Context Menu or Close button (simple version: hover close) */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onCloseApp(app.id);
              }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-zinc-800 border border-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
            >
              <span className="text-[10px] font-bold leading-none">×</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

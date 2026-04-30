import React from 'react';
import { motion } from 'motion/react';
import { 
  Settings as SettingsIcon, 
  Eye, 
  EyeOff, 
  Snowflake, 
  ShieldCheck, 
  Gamepad2, 
  RotateCcw,
  Layout
} from 'lucide-react';

export interface AppSettings {
  snowflakeEnabled: boolean;
  tabTitle: string;
  tabIcon: string;
  autoCloak: boolean;
  panicKey: string;
  theme: 'black' | 'amoled' | 'ocean' | 'midnight' | 'emerald';
}

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (settings: Partial<AppSettings>) => void;
}

const PRESETS = [
  { name: 'Default', title: 'Lebum OS', icon: '', color: 'bg-blue-600' },
  { name: 'Google', title: 'Google', icon: 'https://www.google.com/favicon.ico', color: 'bg-blue-500' },
  { name: 'Classes', title: 'Classes', icon: 'https://ssl.gstatic.com/classroom/favicon.png', color: 'bg-emerald-600' },
  { name: 'Clever', title: 'Clever | Portal', icon: 'https://clever.com/favicon.ico', color: 'bg-blue-400' },
  { name: 'Canvas', title: 'Dashboard', icon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico', color: 'bg-red-600' },
  { name: 'Blank', title: '\u200B', icon: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%2F%3E', color: 'bg-zinc-800' },
];

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-blue-600 rounded-[2rem] shadow-2xl shadow-blue-600/20">
          <SettingsIcon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic">Control Center</h2>
          <p className="text-zinc-500 text-xs font-black uppercase tracking-widest opacity-60">System Configuration Node v1.0.4 rpd</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Stealth Section */}
        <section className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-3xl space-y-8 shadow-2xl">
          <div className="flex items-center gap-3 text-amber-500">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-black uppercase tracking-[0.2em] text-[10px]">Stealth Protocols</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-4">Identity Masking (Cloak)</label>
              <div className="grid grid-cols-2 gap-3">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => onUpdate({ tabTitle: p.title, tabIcon: p.icon })}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-tighter ${
                      settings.tabTitle === p.title 
                      ? 'bg-white text-black border-white shadow-xl' 
                      : 'bg-white/[0.03] border-white/5 text-zinc-500 hover:border-white/20'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${p.color} shrink-0`} />
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-black/40 rounded-2xl border border-white/5">
              <div className="flex flex-col">
                <span className="text-xs font-black text-white tracking-widest uppercase italic">Auto-Cloak</span>
                <span className="text-[8px] text-zinc-600 uppercase font-black tracking-[0.1em] mt-1 italic">Silent about:blank launch</span>
              </div>
              <button
                onClick={() => onUpdate({ autoCloak: !settings.autoCloak })}
                className={`w-14 h-7 rounded-full transition-all duration-500 p-1 ${settings.autoCloak ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-zinc-800'}`}
              >
                <motion.div
                  animate={{ x: settings.autoCloak ? 28 : 0 }}
                  className="w-5 h-5 bg-white rounded-full shadow-lg"
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-5 bg-black/40 rounded-2xl border border-white/5">
              <div className="flex flex-col">
                <span className="text-xs font-black text-white tracking-widest uppercase italic font-mono">Panic Key</span>
                <span className="text-[8px] text-zinc-600 uppercase font-black tracking-[0.1em] mt-1">Instant Education Decoy Overlay</span>
              </div>
              <div className="flex items-center gap-3">
                <kbd className="px-3 py-1.5 bg-zinc-950 border border-white/10 rounded-lg text-xs text-blue-400 font-mono shadow-inner">
                  {settings.panicKey || 'None'}
                </kbd>
                <button
                  onClick={() => {
                    const key = prompt('Enter a key name (e.g. Escape, `)');
                    if (key) onUpdate({ panicKey: key });
                  }}
                  className="px-4 py-2 bg-white text-black text-[10px] font-black uppercase rounded-xl hover:bg-zinc-200 transition-colors shadow-lg"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Visuals Section */}
        <section className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-3xl space-y-8 shadow-2xl">
          <div className="flex items-center gap-3 text-blue-500">
            <Layout className="w-5 h-5" />
            <h3 className="font-black uppercase tracking-[0.2em] text-[10px]">Aesthetic Engine</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-5 bg-black/40 rounded-2xl border border-white/5">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Snowflake className="w-4 h-4 text-blue-400 animate-spin-slow" />
                  <span className="text-xs font-black text-white tracking-widest uppercase italic">Particle Flux</span>
                </div>
                <span className="text-[8px] text-zinc-600 uppercase font-black tracking-[0.1em] mt-1">Atmospheric visual feedback</span>
              </div>
              <button
                onClick={() => onUpdate({ snowflakeEnabled: !settings.snowflakeEnabled })}
                className={`w-14 h-7 rounded-full transition-all duration-500 p-1 ${settings.snowflakeEnabled ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-zinc-800'}`}
              >
                <motion.div
                  animate={{ x: settings.snowflakeEnabled ? 28 : 0 }}
                  className="w-5 h-5 bg-white rounded-full shadow-lg"
                />
              </button>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block ml-1">Theme Presets</span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'black', name: 'Sleek Black', color: 'bg-zinc-900 border-zinc-800' },
                  { id: 'amoled', name: 'Pitch Amoled', color: 'bg-black border-white/5' },
                  { id: 'ocean', name: 'Ocean Blue', color: 'bg-blue-900/40 border-blue-500/10 text-blue-200' },
                  { id: 'midnight', name: 'Midnight', color: 'bg-indigo-950/40 border-indigo-500/10 text-indigo-300' },
                  { id: 'emerald', name: 'Emerald', color: 'bg-emerald-950/40 border-emerald-500/10 text-emerald-300' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onUpdate({ theme: t.id as any })}
                    className={`p-4 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-tighter ${
                      settings.theme === t.id 
                      ? 'bg-blue-600 text-white border-blue-500 shadow-xl' 
                      : `${t.color} text-zinc-500 hover:border-white/20`
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="flex items-center gap-3 px-8 py-4 bg-red-500/5 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all text-[10px] font-black uppercase tracking-[0.3em] border border-red-500/10"
        >
          <RotateCcw className="w-4 h-4" />
          Purge System State
        </button>
      </div>
    </div>
  );
};

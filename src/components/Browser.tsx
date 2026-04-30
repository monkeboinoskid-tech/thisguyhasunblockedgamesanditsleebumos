import React, { useState } from 'react';
import { Search, Globe, ChevronLeft, ChevronRight, RotateCcw, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export const Browser: React.FC = () => {
  const [url, setUrl] = useState('https://duckduckgo.com');
  const [inputUrl, setInputUrl] = useState('https://duckduckgo.com');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let targetUrl = inputUrl;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://duckduckgo.com/?q=${encodeURIComponent(targetUrl)}`;
    }
    setUrl(targetUrl);
    setInputUrl(targetUrl);
  };

  return (
    <div className="flex flex-col h-full bg-black rounded-2xl border border-white/5 overflow-hidden shadow-2xl backdrop-blur-xl">
      <div className="bg-black/60 p-3 border-b border-white/5 flex items-center gap-3">
        <div className="flex items-center gap-1 shrink-0">
          <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-600 cursor-not-allowed">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-600 cursor-not-allowed">
            <ChevronRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setUrl(url + '')} // Trick to reload
            className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex-1 relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            <Shield className="w-4 h-4 text-emerald-500" />
          </div>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full bg-zinc-950 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-zinc-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-mono"
            placeholder="Search with DuckDuckGo..."
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
            <Search className="w-4 h-4" />
          </button>
        </form>

        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20">
          <Globe className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Private Mode</span>
        </div>
      </div>

      <div className="flex-1 bg-white relative">
        <iframe
          src={url}
          className="w-full h-full border-none"
          title="Proxy Browser"
          allow="geolocation; microphone; camera; midi; encrypted-media;"
        />
      </div>
    </div>
  );
};


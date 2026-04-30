import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, RefreshCw, ExternalLink } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  iframeUrl: string;
}

interface GamePlayerProps {
  game: Game | null;
  onClose: () => void;
}

export const GamePlayer: React.FC<GamePlayerProps> = ({ game, onClose }) => {
  if (!game) return null;

  const handleRefresh = () => {
    const iframe = document.getElementById('game-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = game.iframeUrl;
    }
  };

  const handleFullscreen = () => {
    const iframe = document.getElementById('game-iframe') as HTMLIFrameElement;
    if (iframe?.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
      <div className="h-16 flex items-center justify-between px-6 bg-black border-b border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-black text-white tracking-tighter uppercase">Playing: {game.title}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all flex items-center gap-2"
            title="Refresh game"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleFullscreen}
            className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all flex items-center gap-2"
            title="Fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          <a
            href={game.iframeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all"
            title="Open in new tab"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>

      <div className="flex-1 bg-black relative">
        <iframe
          id="game-iframe"
          src={game.iframeUrl}
          className="w-full h-full border-none shadow-2xl"
          allow="fullscreen; autoplay; gamepad"
          title={game.title}
        />
      </div>
    </motion.div>
  );
};


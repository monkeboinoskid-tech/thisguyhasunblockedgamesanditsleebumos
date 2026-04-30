import React from 'react';
import { motion } from 'motion/react';
import { Play, Tag } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  description: string;
  iframeUrl: string;
  thumbnail: string;
  category: string;
}

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPlay }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onPlay(game)}
      className="group cursor-pointer flex flex-col gap-3"
    >
      <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden bg-white/[0.03] border border-white/5 transition-all duration-500 group-hover:border-blue-600/40 group-hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)]">
        <img
          src={game.thumbnail}
          alt={game.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/600x600/080808/3b82f6?text=${game.title.charAt(0)}`;
          }}
        />
        <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <div className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-all duration-500">
            <Play className="w-6 h-6 fill-current ml-1" />
          </div>
        </div>
      </div>
      
      <div className="px-1 text-center">
        <h3 className="text-[11px] font-black text-zinc-400 group-hover:text-white transition-colors tracking-tight uppercase truncate">
          {game.title}
        </h3>
        <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-[0.2em] mt-1 group-hover:text-zinc-500 transition-colors">
          {game.category}
        </p>
      </div>
    </motion.div>
  );
};


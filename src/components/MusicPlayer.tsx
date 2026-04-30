import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  Search, 
  Library, 
  Plus, 
  Heart, 
  Play, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Shuffle, 
  Volume2, 
  Maximize2,
  Minimize2,
  X,
  Music as MusicIcon,
  Loader2
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  url: string;
}

const SAMPLE_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Nights',
    artist: 'Synthwave Collector',
    thumbnail: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: '2',
    title: 'Deep Focus',
    artist: 'Lofi Study',
    thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: '3',
    title: 'Cyberpunk Drive',
    artist: 'Vaporwave Enthusiast',
    thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=300&h=300&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: '4',
    title: 'Midnight City',
    artist: 'Nightcall',
    thumbnail: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(SAMPLE_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'search'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const volumeBarRef = useRef<HTMLDivElement | null>(null);

  // Global search implementation
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        let formattedResults: Track[] = [];
        
        // Try Primary API (Provides full songs)
        try {
          const response = await fetch(`https://saavn.me/search/songs?query=${encodeURIComponent(searchQuery)}`);
          if (response.ok) {
            const data = await response.json();
            if (data.status === 'SUCCESS' && data.data.results && data.data.results.length > 0) {
              formattedResults = data.data.results.slice(0, 30).map((item: any) => ({
                id: item.id,
                title: item.name,
                artist: item.primaryArtists,
                thumbnail: item.image[item.image.length - 1].link, 
                url: item.downloadUrl[item.downloadUrl.length - 1].link
              }));
            }
          }
        } catch (e) {
          console.warn('Primary music API failed or blocked, falling back to iTunes API.', e);
        }

        // If primary failed or returned nothing, fall back to iTunes (Reliable, but 30s previews)
        if (formattedResults.length === 0) {
          try {
            const itunesResponse = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&media=music&limit=30`);
            if (itunesResponse.ok) {
              const itunesData = await itunesResponse.json();
              formattedResults = itunesData.results.map((item: any) => ({
                id: item.trackId.toString(),
                title: item.trackName,
                artist: item.artistName,
                thumbnail: item.artworkUrl100.replace('100x100', '600x600'),
                url: item.previewUrl
              }));
            }
          } catch (e) {
            console.error('All music search APIs failed.', e);
          }
        }

        setResults(formattedResults);
      } catch (error) {
        console.error('Search unexpected error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current && !isDraggingProgress) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleSeek = (e: React.MouseEvent | React.TouchEvent) => {
    if (!audioRef.current || !progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    
    setProgress(percentage * 100);
    if (!isDraggingProgress) {
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (isDraggingProgress) {
        const rect = progressBarRef.current?.getBoundingClientRect();
        if (rect && audioRef.current) {
          const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
          const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
          const percentage = x / rect.width;
          setProgress(percentage * 100);
        }
      } else if (isDraggingVolume) {
        const rect = volumeBarRef.current?.getBoundingClientRect();
        if (rect) {
          const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
          const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
          const newVol = Math.max(0, Math.min(1, x / rect.width));
          setVolume(newVol);
          if (audioRef.current) audioRef.current.volume = newVol;
        }
      }
    };

    const handleUp = () => {
      if (isDraggingProgress && audioRef.current) {
        audioRef.current.currentTime = (progress / 100) * audioRef.current.duration;
      }
      setIsDraggingProgress(false);
      setIsDraggingVolume(false);
    };

    if (isDraggingProgress || isDraggingVolume) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDraggingProgress, isDraggingVolume, progress]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="flex bg-black border border-white/5 rounded-3xl overflow-hidden shadow-2xl h-[calc(100vh-200px)]">
      {/* Sidebar */}
      <aside className="w-64 bg-black flex flex-col p-3 gap-2">
        <div className="bg-[#121212] rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3 text-white">
            <MusicIcon className="w-6 h-6 text-[#1DB954]" />
            <span className="font-black tracking-tighter uppercase">Lebum Music</span>
          </div>

          <nav className="space-y-4">
            <NavItem 
              icon={<Home className="w-6 h-6" />} 
              label="Home" 
              active={activeTab === 'home'} 
              onClick={() => setActiveTab('home')}
            />
            <NavItem 
              icon={<Search className="w-6 h-6" />} 
              label="Search" 
              active={activeTab === 'search'} 
              onClick={() => setActiveTab('search')}
            />
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('os-navigate', { detail: 'home' }))}
              className="flex items-center gap-4 w-full px-2 py-1.5 text-sm font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"
            >
              <Minimize2 className="w-6 h-6" />
              Exit to OS
            </button>
          </nav>
        </div>

        <div className="flex-1 bg-[#121212] rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between text-zinc-400 mb-6 group cursor-pointer hover:text-white transition-colors">
            <div className="flex items-center gap-3">
              <Library className="w-6 h-6" />
              <span className="font-black text-sm uppercase tracking-widest">Library</span>
            </div>
            <Plus className="w-5 h-5" />
          </div>

          <div className="space-y-4 overflow-y-auto no-scrollbar">
            <div className="bg-[#242424] p-4 rounded-xl space-y-4">
              <p className="text-sm font-black text-white">Create your first playlist</p>
              <p className="text-xs font-bold text-zinc-400">It's easy, we'll help you</p>
              <button className="bg-white text-black px-4 py-2 rounded-full text-xs font-black uppercase hover:scale-105 transition-transform">
                Create Playlist
              </button>
            </div>
            
            <div className="bg-[#242424] p-4 rounded-xl space-y-4">
              <p className="text-sm font-black text-white">Let's find some podcasts</p>
              <p className="text-xs font-bold text-zinc-400">We'll keep you updated on new episodes</p>
              <button className="bg-white text-black px-4 py-2 rounded-full text-xs font-black uppercase hover:scale-105 transition-transform">
                Browse podcasts
              </button>
            </div>
          </div>

          <div className="mt-auto pt-6 opacity-30">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
              High Definition Audio Enabled
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative bg-[#121212] m-3 ml-0 rounded-xl">
        <header className="sticky top-0 p-8 flex items-center justify-between z-20 bg-[#121212]/80 backdrop-blur-md">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 mr-4">
              <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors">
                <SkipBack className="w-4 h-4 rotate-180" />
              </button>
              <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors">
                <SkipForward className="w-4 h-4 rotate-180" />
              </button>
            </div>
            
            {activeTab === 'search' && (
              <div className="relative group w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                <input
                  type="text"
                  placeholder="What do you want to listen to?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#242424] hover:bg-[#2a2a2a] border border-transparent focus:border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none transition-all placeholder:text-zinc-500"
                />
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 bg-transparent text-white text-xs font-black uppercase rounded-full hover:scale-105 transition-transform border border-white/20">
              Upgrade
            </button>
            <button className="px-6 py-2 bg-white text-black text-xs font-black uppercase rounded-full hover:scale-105 transition-transform shadow-xl">
              Guest
            </button>
          </div>
        </header>

        <div className="p-8 pt-0 space-y-8">
           {activeTab === 'home' ? (
             <>
               <div className="bg-gradient-to-b from-[#1DB954]/20 to-transparent -mx-8 px-8 py-8">
                  <h2 className="text-3xl font-black tracking-tight text-white mb-6">Good evening</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {SAMPLE_TRACKS.slice(0, 6).map((track) => (
                      <div 
                        key={track.id}
                        onClick={() => {
                          setCurrentTrack(track);
                          setIsPlaying(true);
                        }}
                        className="flex items-center gap-4 bg-white/[0.05] hover:bg-white/[0.1] rounded-md overflow-hidden transition-all group cursor-pointer relative"
                      >
                        <img src={track.thumbnail} alt={track.title} className="w-20 h-20 object-cover shadow-2xl" />
                        <div className="flex-1 py-1">
                          <p className="text-sm font-black text-white truncate">{track.title}</p>
                        </div>
                        <div className="absolute right-4 w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-[0_8px_16px_rgba(0,0,0,0.3)] translate-y-2 group-hover:translate-y-0 box-border">
                          <Play className="w-5 h-5 fill-black text-black ml-1" />
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

              <div>
                 <h3 className="text-xl font-black text-white mb-6">Picks for you</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {SAMPLE_TRACKS.map(track => (
                      <div 
                        key={track.id} 
                        onClick={() => {
                          setCurrentTrack(track);
                          setIsPlaying(true);
                        }}
                        className="bg-[#181818] hover:bg-[#282828] p-4 rounded-xl transition-all duration-300 group cursor-pointer relative"
                      >
                        <div className="relative aspect-square mb-4">
                          <img src={track.thumbnail} className="w-full h-full object-cover rounded-md shadow-2xl" />
                          <div className="absolute bottom-2 right-2 w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-3 group-hover:translate-y-0 shadow-2xl">
                            <Play className="w-5 h-5 fill-black text-black ml-1" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-black text-white mb-1 truncate">{track.title}</p>
                          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest truncate">{track.artist}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </>
           ) : (
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white uppercase tracking-widest">Search Results</h3>
                  {isSearching && <Loader2 className="w-5 h-5 animate-spin text-[#1DB954]" />}
                </div>

                {!searchQuery ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center">
                      <Search className="w-8 h-8 text-zinc-500" />
                    </div>
                    <p className="text-xl font-black text-white uppercase tracking-tighter">Start searching</p>
                    <p className="text-zinc-500 font-bold max-w-xs">Enter a song, artist, or album name to find anything on Lebum Music.</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {results.map(track => (
                      <div 
                        key={track.id} 
                        onClick={() => {
                          setCurrentTrack(track);
                          setIsPlaying(true);
                        }}
                        className="flex items-center gap-4 bg-[#181818] hover:bg-[#282828] p-3 rounded-md transition-all duration-300 group cursor-pointer relative"
                      >
                        <div className="relative w-12 h-12 shrink-0">
                          <img src={track.thumbnail} className="w-full h-full object-cover rounded shadow-lg" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded">
                            <Play className="w-4 h-4 fill-white text-white" />
                          </div>
                        </div>
                        <div className="min-w-0 pr-8">
                          <p className="text-sm font-black text-white mb-0.5 truncate leading-tight">{track.title}</p>
                          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest truncate leading-none">{track.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !isSearching ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <Search className="w-20 h-20 text-zinc-800" />
                    <p className="text-xl font-black text-white uppercase tracking-tighter">No results found for "{searchQuery}"</p>
                    <p className="text-zinc-500 font-bold">Please check your spelling or try different keywords.</p>
                  </div>
                ) : null}
             </div>
           )}
        </div>
      </main>

      {/* Footer / Controls */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/5 flex items-center justify-between p-4 px-6 z-[60]">
        <audio 
          ref={audioRef}
          src={currentTrack?.url}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onLoadStart={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
        />

        <div className="flex items-center gap-4 w-1/4">
          <div className="w-14 h-14 bg-zinc-900 rounded-md overflow-hidden border border-white/10 shrink-0">
             {currentTrack && <img src={currentTrack.thumbnail} className="w-full h-full object-cover" />}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white truncate hover:underline cursor-pointer">{currentTrack?.title || 'Nothing playing'}</h4>
            <p className="text-[11px] font-medium text-zinc-400 hover:underline cursor-pointer truncate">{currentTrack?.artist || 'Choose a song to start'}</p>
          </div>
          <Heart className="w-5 h-5 text-zinc-500 hover:text-[#1DB954] cursor-pointer ml-4 transition-colors" />
        </div>

        <div className="flex flex-col items-center gap-2 w-1/2 max-w-xl">
          <div className="flex items-center gap-8">
            <Shuffle className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
            <SkipBack className="w-5 h-5 text-zinc-300 hover:text-white transition-colors cursor-pointer" />
            <button 
              onClick={togglePlay}
              disabled={isLoading}
              className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isPlaying ? (
                <div className="flex gap-0.5">
                  <div className="w-1 h-3 bg-current" />
                  <div className="w-1 h-3 bg-current" />
                </div>
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
            <SkipForward className="w-5 h-5 text-zinc-300 hover:text-white transition-colors cursor-pointer" />
            <Repeat className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
          </div>
          <div className="flex items-center gap-2 w-full">
            <span className="text-[11px] font-medium text-zinc-500 min-w-[30px] text-right">{formatTime(audioRef.current?.currentTime || 0)}</span>
            <div 
              ref={progressBarRef}
              className="flex-1 h-1 bg-[#4d4d4d] rounded-full relative group cursor-pointer"
              onMouseDown={(e) => {
                setIsDraggingProgress(true);
                handleSeek(e);
              }}
              onTouchStart={(e) => {
                setIsDraggingProgress(true);
                handleSeek(e);
              }}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-white group-hover:bg-[#1DB954] transition-colors rounded-full" 
                style={{ width: `${progress}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                style={{ left: `${progress}%`, marginLeft: '-6px' }}
              />
            </div>
            <span className="text-[11px] font-medium text-zinc-500 min-w-[30px]">{formatTime(audioRef.current?.duration || 0)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 w-1/4 text-zinc-400">
           <Volume2 className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
           <div 
            ref={volumeBarRef}
            className="w-24 h-1 bg-[#4d4d4d] rounded-full relative group cursor-pointer"
            onMouseDown={(e) => {
              setIsDraggingVolume(true);
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const newVol = Math.max(0, Math.min(1, x / rect.width));
              setVolume(newVol);
              if (audioRef.current) audioRef.current.volume = newVol;
            }}
            onTouchStart={(e) => {
              setIsDraggingVolume(true);
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.touches[0].clientX - rect.left;
              const newVol = Math.max(0, Math.min(1, x / rect.width));
              setVolume(newVol);
              if (audioRef.current) audioRef.current.volume = newVol;
            }}
           >
             <div className="absolute top-0 left-0 h-full bg-white group-hover:bg-[#1DB954] transition-colors rounded-full" style={{ width: `${volume * 100}%` }} />
             <div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                style={{ left: `${volume * 100}%`, marginLeft: '-6px' }}
              />
           </div>
           <Maximize2 className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
        </div>
      </footer>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 w-full px-2 py-1.5 text-sm font-black uppercase tracking-widest transition-all ${active ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
  >
    {icon}
    {label}
  </button>
);

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

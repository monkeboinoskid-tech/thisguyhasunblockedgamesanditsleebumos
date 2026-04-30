import React from 'react';

export const Snowfall: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background Video - Deep Sleek Look */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-screen grayscale"
      >
        <source 
          src="https://assets.mixkit.co/videos/preview/mixkit-falling-snow-in-the-night-sky-3554-large.mp4" 
          type="video/mp4" 
        />
      </video>
      
      {/* Overlays that respect parent theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
    </div>
  );
};


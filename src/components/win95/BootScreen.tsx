import React, { useEffect, useRef } from "react";

interface Props {
  onDone: () => void;
}

export const BootScreen: React.FC<Props> = ({ onDone }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Attempt to play sound immediately
    if (!audioRef.current) {
      audioRef.current = new Audio("/Startup Sound.mp3");
    }
    audioRef.current.play().catch(err => {
      // Browsers often block autoplaying audio without user interaction
      console.warn("Autoplay blocked or failed:", err);
    });

    // Transition to desktop after 5 seconds
    const timer = setTimeout(onDone, 5000);
    
    return () => {
      clearTimeout(timer);
      audioRef.current?.pause();
    };
  }, [onDone]);

  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Startup splash image - full screen cover to look immersive */}
      <img 
        src="/Startup.png" 
        alt="Windows 95 Startup" 
        className="w-full h-full object-cover"
      />

      {/* Subtle bottom progress bar or status if needed */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-[10px] font-mono uppercase tracking-widest">
        Loading System Resources...
      </div>
    </div>
  );
};
